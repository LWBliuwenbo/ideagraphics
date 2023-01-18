#version 300 es

precision mediump float;

in vec2 vTextureCoord; // 纹理坐标
in vec3 fragPos;
in vec3 Normal;
in vec3 tangent;
in vec3 bitangent;
in mat3 TBN;
in vec3 radiance; // 光照辐射度 


// 光照计算所需变量
// 环境光颜色分量与材质反色属性各分量相乘
// uniform vec4 uLightAmbient;
// uniform vec4 uLightDiffuse;
// uniform vec4 uLightSpecular; 

uniform vec3 uLightColor;

// 光源：类型
uniform int uLightType;

// 光源：位置
uniform vec3 uLightPosition;

// 光源：强度
uniform float uLightItensity;

// 光源：衰减半径

uniform float ulightInvRadius;

// 眼睛位置
uniform vec3 uViewPosition;

// 高光
uniform float uShininess;

uniform sampler2D uMaterialDiffuse; // 拾色器
// uniform sampler2D uMaterialSpecular; // 拾色器
uniform sampler2D uMaterialNormalMap; // 法向贴图

out vec4 fColor;

// 固有色 使用纹理传入
// uniform vec3 baseColor;

/*
金属度，规定电介质为0，金属为1；
当值趋向1时：弱化漫反射比率，强化镜面反射强度，同时镜面反射逐渐附带上金属色
半导体材质情况特殊，尽量避免使用半导体调试效果 0 1 0
*/
uniform float metallic;

// 次表面 控制漫反射形状 0 1 0

uniform float subsurface;

// 高光强度（镜面反射强度）
// 控制镜面反射光占入射光的比率，用于取代折射率 0 1 .5
uniform float specular;


// 粗糙度，影响漫反射和镜面反射 0 1 .5
uniform float roughness;

//高光染色，和baseColor一起，控制镜面反射的颜色
//注意，这是非物理效果，且掠射镜面反射依然是非彩色 0 1 0
uniform float specularTint;

//各向异性程度，控制镜面反射在不同朝向上的强度，既镜面反射高光的纵横比
//规定完全各向同性时为0，完全各项异性时为1 0 1 0
uniform float anisotropic;

//光泽度，一种额外的掠射分量，一般用于补偿布料在掠射角下的光能  0 1 0
uniform float sheen;

// 光泽色，控制sheen的颜色  0 1 .5
uniform float sheenTint;

// 清漆强度，控制第二个镜面反射波瓣形成及其影响范围 0 1 0
uniform float clearcoat;

// 清漆光泽度，控制透明涂层的高光强度（光泽度）
// 规定缎面(satin)为0，光泽(gloss)为1； 0 1 1
uniform float clearcoatGloss;


const float PI = 3.14159265358979323846;

// 平方函数
float sqr(float x) { return x * x;}

//入参u时视方向与法线的点积
//返回F0为0情况下的SchlickFresnel的解，既0 + (1-0)(1-vdoth)^5
float SchlickFresnel(float u)
{
    float m = clamp(1.0 - u, 0.0, 1.0);//将1-vdoth的结果限制在[0,1]空间内 
    float m2 = m*m;
    return m2*m2*m; // pow(m,5) 求5次方
}

//GTR 1 (次镜面波瓣，gamma=1)
//次用于上层透明涂层材质（ClearCoat清漆材质，俗称上层高光），是各向同性且非金属的。
float GTR1(float NdotH, float a)
{
    //考虑到粗糙度a在等于1的情况下，公式返回值无意义，因此固定返回1/pi，
    //说明在完全粗糙的情况下，各个方向的法线分布均匀，且积分后得1
    if (a >= 1.0) {
        return 1.0/PI;
    };

    float a2 = a*a;
    float t = 1.0 + (a2-1.0)*NdotH*NdotH; //公式主部
    return (a2-1.0) / (PI*log(a2)*t);   //GTR1的c，迪士尼取值为：(a2-1)/(PI*log(a2))
}

//GTR 2(主镜面波瓣，gamma=2) 先用于基础层材质（Base Material）用于各项同性的金属或非金属（俗称下层高光）
float GTR2(float NdotH, float a)
{
    float a2 = a*a;
    float t = 1.0 + (a2-1.0)*NdotH*NdotH;
    return a2 / (PI * t*t);  //GTR2的c，迪士尼取值为:a2/PI
}

//主镜面波瓣的各向异性版本
//其中HdotX为半角向量与物体表面法线空间中的切线方向向量的点积
//HdotY为半角点乘切线空间中的副切线向量 
//ax 和 ay 分别是这2个方向上的可感粗糙度，范围是0~1 
float GTR2_aniso(float NdotH, float HdotX, float HdotY, float ax, float ay)
{
    return 1.0 / (PI * ax*ay * sqr( sqr(HdotX/ax) + sqr(HdotY/ay) + NdotH*NdotH ));
}

//2012版disney采用的Smith GGX导出的G项，本质是Smith联合遮蔽阴影函数中的“分离的遮蔽阴影型”
//入参NdotV视情况也可替换会NdotL，用于计算阴影相关G1；
//入参alphaG被迪士尼定义为0.25f
//该公式各项同性，迪士尼使用此公式计算第二高光波瓣 
float smithG_GGX(float NdotV, float alphaG)
{
    float a = alphaG*alphaG;
    float b = NdotV*NdotV;
    return 1.0 / (NdotV + sqrt(a + b - a*b));
}

//各向异性版G 
float smithG_GGX_aniso(float NdotV, float VdotX, float VdotY, float ax, float ay)
{
    return 1.0 / (NdotV + sqrt( sqr(VdotX*ax) + sqr(VdotY*ay) + sqr(NdotV) ));
}

vec3 mon2lin(vec3 x)
{
    return vec3(pow(x[0], 2.2), pow(x[1], 2.2), pow(x[2], 2.2));
}

vec3 lightradiance() {
    float distance = length(uLightPosition.xyz - fragPos);
    float attenuation = 1.0 / (distance * distance);
    return uLightColor.rgb * attenuation;
}


vec3 BRDF( vec3 baseColor, vec3 L, vec3 V, vec3 N, vec3 X, vec3 Y )
{
    //准备参数
    float NdotL = dot(N,L);
    float NdotV = dot(N,V);
    if (NdotL < 0.0 || NdotV < 0.0) return vec3(0); //无视水平面以下的光线或视线 
    vec3 H = normalize(L+V);                    //半角向量
    float NdotH = dot(N,H);
    float LdotH = dot(L,H);

    vec3 Cdlin = mon2lin(baseColor);                        //将gamma空间的颜色转换到线性空间，目前存储的还是rgb
    float Cdlum = .3*Cdlin[0] + .6*Cdlin[1]  + .1*Cdlin[2]; //luminance approx. 近似的将rgb转换成光亮度 luminance 

    //对baseColor按亮度归一化，从而独立出色调和饱和度，可以认为Ctint是与亮度无关的固有色调 
    vec3 Ctint = Cdlum > 0.0 ? Cdlin/Cdlum : vec3(1); // normalize lum. to isolate hue+sat
    //混淆得到高光底色，包含2次mix操作
    //第一次从白色按照用户输入的specularTint插值到Ctint。列如specularTint为0，则返回纯白色
    //第二次从第一次混淆的返回值开始，按照金属度metallic，插值到带有亮度的线性空间baseColor。
    //列如金属度为1，则返回本色baseColor。如果金属度为0，既电介质，那么返回第一次插值的结果得一定比例（0.8*specular倍）
    vec3 Cspec0 = mix(specular*.08*mix(vec3(1), Ctint, specularTint), Cdlin, metallic);
    //这是光泽颜色，我们知道光泽度用于补偿布料等材质在FresnelPeak处的额外光能，光泽颜色则从白色开始，按照用户输入的sheenTint值，插值到Ctint为止。
    vec3 Csheen = mix(vec3(1), Ctint, sheenTint);

    //以下代码段负责计算Diffuse分量 
    // Diffuse fresnel - go from 1 at normal incidence to .5 at grazing
    // and mix in diffuse retro-reflection based on roughness
    float FL = SchlickFresnel(NdotL), FV = SchlickFresnel(NdotV); //SchlickFresnel返回的是(1-cosθ)^5的计算结果 
    float Fd90 = 0.5 + 2.0 * LdotH*LdotH * roughness; //使用粗糙度计算漫反射的反射率
    float Fd = mix(1.0, Fd90, FL) * mix(1.0, Fd90, FV);  //此步骤还没有乘以baseColor/pi，会在当前代码段之外完成。

    //以下代码负责计算SS(次表面散射)分量 
    // Based on Hanrahan-Krueger brdf approximation of isotropic bssrdf（基于各向同性bssrdf的Hanrahan-Krueger brdf逼近）
    // 1.25 scale is used to (roughly) preserve albedo（1.25的缩放是用于（大致）保留反照率）
    // Fss90 used to "flatten" retroreflection based on roughness （Fss90用于“平整”基于粗糙度的逆反射）
    float Fss90 = LdotH*LdotH*roughness; //垂直于次表面的菲涅尔系数
    float Fss = mix(1.0, Fss90, FL) * mix(1.0, Fss90, FV);
    float ss = 1.25 * (Fss * (1.0 / (NdotL + NdotV) - .5) + .5); //此步骤同样还没有乘以baseColor/pi，会在当前代码段之外完成。

    // specular
    float aspect = sqrt(1.0-anisotropic*.9);//aspect 将艺术家手中的anisotropic参数重映射到[0.1,1]空间，确保aspect不为0,
    float ax = max(.001, sqr(roughness)/aspect);                    //ax随着参数anisotropic的增加而增加
    float ay = max(.001, sqr(roughness)*aspect);                    //ay随着参数anisotropic的增加而减少，ax和ay在anisotropic值为0时相等
    float Ds = GTR2_aniso(NdotH, dot(H, X), dot(H, Y), ax, ay);  //各项异性GTR2导出对应H的法线强度
    float FH = SchlickFresnel(LdotH);  //返回菲尼尔核心，既pow(1-cosθd,5)
    vec3 Fs = mix(Cspec0, vec3(1), FH); //菲尼尔项，使用了Cspec0作为F0，既高光底色，模拟金属的菲涅尔染色 
    float Gs;   //几何项，一般与l，v和n相关，各项异性时还需要考虑方向空间中的切线t和副切线b
    Gs  = smithG_GGX_aniso(NdotL, dot(L, X), dot(L, Y), ax, ay);  //遮蔽关联的几何项G1
    Gs *= smithG_GGX_aniso(NdotV, dot(V, X), dot(V, Y), ax, ay); //阴影关联的几何项G1，随后合并两项存入Gs

    // sheen 光泽项，本身作为边缘处漫反射的补偿 
    vec3 Fsheen = FH * sheen * Csheen; //迪士尼认为sheen值正比于菲涅尔项FH，同时强度被控制变量sheen和颜色控制变量Csheen影响 

    // clearcoat (ior = 1.5 -> F0 = 0.04)
    //清漆层没有漫反射，只有镜面反射，使用独立的D,F和G项 
    //下面行使用GTR1（berry）分布函数获取法线强度，第二个参数是a（粗糙度）
    //迪士尼使用用户控制变量clearcoatGloss，在0.1到0.001线性插值获取a 
    float Dr = GTR1(NdotH, mix(.1,.001,clearcoatGloss)); 
    float Fr = mix(.04, 1.0, FH);  //菲涅尔项上调最低值至0.04 
    float Gr = smithG_GGX(NdotL, .25) * smithG_GGX(NdotV, .25);    //几何项使用各项同性的smithG_GGX计算，a固定给0.25 

    //（漫反射 + 光泽）* 非金属度 + 镜面反射 + 清漆高光
    // 注意漫反射计算时使用了subsurface控制变量对基于菲涅尔的漫反射 和 次表面散射进行插值过渡；此外还补上了之前提到的baseColor/pi
    // 使用非金属度（既：1-金属度）用以消除来自金属的漫反射 <- 非物理，但是能插值很爽啊 
    return ((1.0/PI) * mix(Fd, ss, subsurface)*Cdlin + Fsheen) 
        * (1.0-metallic)
        + Gs*Fs*Ds + .25*clearcoat*Gr*Fr*Dr;
}

// 平行光
vec3 light_direct_luminance (vec3 baseColor, vec3 V, vec3 N, vec3 X, vec3 Y) {
      // 光源位置 
    vec3 light = uLightPosition.xyz;
    // 光源与点线
    vec3 L = normalize(light);

    float NoL = clamp(dot(N, L), 0.0, 1.0);

    // lightIntensity为垂直入射时的照度, 单位 lux
    float illuminance = (uLightItensity / 683.0 ) * NoL;

    return vec3(0.3) +  BRDF(baseColor, L,V,N, X, Y) * illuminance;
}

// 点光源：计算衰减
float getSquareFalloffAttenuation(vec3 posToLight, float lightInvRadius) {
    float distanceSquare = dot(posToLight, posToLight);
    float factor = distanceSquare * lightInvRadius * lightInvRadius;
    float smoothFactor = max(1.0 - factor * factor, 0.0);
    return (smoothFactor * smoothFactor) / max(distanceSquare, 1e-4);
}





// 点光源
vec3 light_point_luminance(vec3 baseColor, vec3 V, vec3 N, vec3 X, vec3 Y) {

     // 光源位置 
    vec3 light = uLightPosition.xyz;

    vec3 posToLight = light - fragPos;
    // 光源与点线
    vec3 L = normalize(posToLight);

    float NoL = clamp(dot(N, L), 0.0, 1.0);

    float attenuation;

    attenuation  = getSquareFalloffAttenuation(posToLight, ulightInvRadius);
    //TODO 聚光灯衰减计算

    // lightIntensity为垂直入射时的照度, 单位 w/m*m
    float illuminance = uLightItensity *attenuation* NoL;

    return vec3(0.03) + BRDF(baseColor, L,V,N, X, Y) * illuminance * uLightColor;
}


void main() {

    
    // 视线方向
    vec3 V = normalize(uViewPosition - fragPos);


    // 计算法向量转换
    vec3 N = normalize(Normal);

    vec3 L = normalize(uLightPosition - fragPos);
    vec3 X = normalize(tangent);
    vec3 Y = normalize(bitangent);

    vec3 baseColor = vec3(0.87f, 0.85f, 0.76f);
    vec3 b ;
    if(uLightType == 1){
        b =  vec3(  BRDF(baseColor, L, V, N, X, Y));
    }else if(uLightType == 0){
        b =  vec3( BRDF(baseColor,L,  V, N, X, Y));
    }

    b = max(b, vec3(0.0));
    b*= dot(L, N) + vec3(0.2);

    fColor = vec4(b, 1.0);
}