#version 300 es

precision mediump float;

in vec2 vTextureCoord; // 纹理坐标
in vec3 fragPos;
in vec3 Normal;


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
uniform sampler2D uMaterialSpecular; // 拾色器

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
    vec3 N = Normal;

    // 环境光分量
    vec4 ambient = uLightAmbient * texture(uMaterialDiffuse, vTextureCoord);

    // 计算漫反射光分量
    float Kd = max( dot(L, N), 0.0 );
    vec4 diffuse = Kd*uLightDiffuse*texture(uMaterialDiffuse, vTextureCoord);

    // 计算镜面反射光分量
    float Ks = pow(max( dot( N, H ), 0.0 ), 32.0);
    vec4 specular = Ks*uLightSpecular*texture(uMaterialSpecular, vTextureCoord);

    // 如果方向为反
    if(dot(L, N) < 0.0){
        specular = vec4(0.0, 0.0, 0.0, 1.0);
    }
    
    
    fColor = ambient + diffuse + specular;
    // fColor = texture(uMaterialDiffuse, vTextureCoord) + texture(uMaterialSpecular, vTextureCoord);
}