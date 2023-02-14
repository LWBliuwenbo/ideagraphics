#version 300 es

precision mediump float;

uniform vec3 incidentVector;
uniform float incidentTheta;
uniform float incidentPhi;

uniform float brightness;
uniform float gamma;
uniform float exposure;
uniform float useNDotL;
uniform float enableHover;

in vec4 worldSpaceVert;
in vec4 eyeSpaceVert;
in vec3 eyeSpaceNormal;
in vec3 eyeSpaceTangent;
in vec3 eyeSpaceBitangent;
in vec3 fragbaseColor;

out vec4 fragColor;

// 固有色 使用纹理传入
uniform vec3 baseColor;

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

vec3 BRDF( vec3 L, vec3 V, vec3 N, vec3 X, vec3 Y )
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

float lightDistanceFromCenter = 2.2;



vec3 computeWithDirectionalLight( vec3 surfPt, vec3 incidentVector, vec3 viewVec, vec3 normal, vec3 tangent, vec3 bitangent )
{
    // evaluate the BRDF
    vec3 b = max( BRDF( incidentVector, viewVec, normal, tangent, bitangent ), vec3(0.0) );

    // multiply in the cosine factor
    if (useNDotL != 0.0)
        b *= dot( normal, incidentVector );

    return b;
}


vec3 computeWithPointLight( vec3 surfPt, vec3 incidentVector, vec3 viewVec, vec3 normal, vec3 tangent, vec3 bitangent )
{
    // compute the point light vector
    vec3 toLight = (incidentVector * lightDistanceFromCenter) - surfPt;
    float pointToLightDist = length( toLight );
    toLight /= pointToLightDist;


    // evaluate the BRDF
    vec3 b = max( BRDF( toLight, viewVec, normal, tangent, bitangent ), vec3(0.0) );

    // multiply in the cosine factor
    if (useNDotL != 0.0)
        b *= dot( normal, toLight );

    // multiply in the falloff
    b *= (1.0 / (pointToLightDist*pointToLightDist));

    return b;
}



vec3 computeWithAreaLight( vec3 surfPt, vec3 incidentVector, vec3 viewVec, vec3 normal, vec3 tangent, vec3 bitangent )
{
    float lightRadius = 0.5;

    vec3 lightPoint = (incidentVector * lightDistanceFromCenter);

    // define the surface of the light source (we'll have it always face the sphere)
    vec3 toLight = normalize( (incidentVector * lightDistanceFromCenter) - surfPt );
    vec3 uVec = cross( toLight, vec3(1,0,0) );
    vec3 vVec = cross( uVec, toLight );

    vec3 result = vec3(0.0);

    float u = -1.0;
    for( int i = 0; i < 5; i++ )
    {
        float v = -1.0;
        for( int j = 0; j < 5; j++ )
        {
            vec3 vplPoint = lightPoint + (uVec*u + vVec*v)*lightRadius;

            // compute the point light vector
            vec3 toLight = vplPoint - surfPt;
            float pointToLightDist = length( toLight );
            toLight /= pointToLightDist;


            // evaluate the BRDF
            vec3 b = max( BRDF( toLight, viewVec, normal, tangent, bitangent ), vec3(0.0) );

            // multiply in the cosine factor
            if (useNDotL != 0.0)
                b *= dot( normal, toLight );

            // multiply in the falloff
            b *= (1.0 / (pointToLightDist*pointToLightDist));



            result += b;

            v += 0.4;
        }
        u += 0.4;
    }

    result /= 25.0;


    return result;
}


void main(void)
{
    // orthogonal vectors
    vec3 normal = normalize( eyeSpaceNormal);
    vec3 tangent = normalize( eyeSpaceTangent );
    vec3 bitangent = normalize( eyeSpaceBitangent );


    // calculate the viewing vector
    //vec3 viewVec = -normalize(eyeSpaceVert.xyz);
    vec3 viewVec = vec3(0,0,1); // ortho mode


    vec3 b = computeWithDirectionalLight(eyeSpaceVert.xyz , incidentVector, viewVec, normal, tangent, bitangent );
    // vec3 b = computeWithPointLight( surfacePos, incidentVector, viewVec, normal, tangent, bitangent );
    // vec3 b = computeWithAreaLight( surfacePos, incidentVector, viewVec, normal, tangent, bitangent );

    // brightness
    b *= brightness;

    // exposure
    b *= pow( 2.0, exposure );

    // gamma
    b = pow( b, vec3( 1.0 / gamma ) );

    if(enableHover > 0.5){
        fragColor = vec4(fragbaseColor,1.0);
    }   else {
        fragColor = vec4( clamp( b, vec3(0.0), vec3(1.0) ), 1.0 );
    }

}

