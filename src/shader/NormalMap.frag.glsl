#version 300 es

precision mediump float;

in vec2 vTextureCoord; // 纹理坐标
in vec3 fragPos;
in vec3 Normal;
in vec3 tangent;
in vec3 bitangent;
in mat3 TBN;


// 光照计算所需变量
// 环境光颜色分量与材质反色属性各分量相乘
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular; 
// 光源位置
uniform vec4 uLightPosition;
// 眼睛位置
uniform vec3 uViewPosition;
// 高光
uniform float uShininess;

uniform sampler2D uMaterialDiffuse; // 拾色器
// uniform sampler2D uMaterialSpecular; // 拾色器
uniform sampler2D uMaterialNormalMap; // 法向贴图

out vec4 fColor;
void main() {

    // 光源位置 
    vec3 light = uLightPosition.xyz;
    // 光源与点线
    vec3 L = normalize(light - fragPos);
    
    // 计算半角向量
    vec3 E = normalize(uViewPosition - fragPos);
    vec3 H = normalize(L + E);


    // 计算法向量转换
    vec3 N = texture(uMaterialNormalMap, vTextureCoord).rgb;
    N = normalize(N * 2.0 - 1.0);
    N = normalize(TBN * N);
    


    // 环境光分量
    vec3 ambient = uLightAmbient.xyz * texture(uMaterialDiffuse, vTextureCoord).rgb;

    // 计算漫反射光分量
    float Kd = max( dot(L, N), 0.0 );
    vec3 diffuse = Kd*uLightDiffuse.xyz*texture(uMaterialDiffuse, vTextureCoord).rgb;

    // 计算镜面反射光分量
    float Ks = pow(max( dot( N, H ), 0.0 ), uShininess);
    vec3 specular = Ks * uLightSpecular.rgb;

    // 如果方向为反
    if(dot(L, N) < 0.0){
        specular = vec3(0.0, 0.0, 0.0);
    }
    
    
    vec3 result = ambient + diffuse + specular;
    fColor = vec4(result, 1.0);
    // fColor = texture(uMaterialDiffuse, vTextureCoord) + texture(uMaterialSpecular, vTextureCoord);
}