#version 300 es

in  vec4 aPosition; // 顶点位置
in  vec4 aColor; // 顶点颜色
in  vec3 aNormal; // 法向量
out vec4 vColor; // 输出顶点颜色

// 模型变换矩阵
uniform vec3 uTheta;
uniform vec3 uTranslate;
uniform vec3 uScale;
// 视角矩阵
uniform mat4 uModelView;
// 投影矩阵
uniform mat4 uProject;

// 光照计算所需变量
// 环境光颜色分量与材质反色属性各分量相乘
uniform vec4 uAmbientProduct;
uniform vec4 uDiffuseProduct;
uniform vec4 uSpecularProduct; 
// 光源位置
uniform vec4 uLightPosition;
// 高光
uniform float uShininess;




void main()
{
    // Compute the sines and cosines of theta for each of
    //   the three axes in one computation.
    vec3 angles = radians(uTheta);
    vec3 c = cos(angles);
    vec3 s = sin(angles);

    // Remeber: thse matrices are column-major
    mat4 rx = mat4(1.0,  0.0,  0.0, 0.0,
		    0.0,  c.x,  s.x, 0.0,
		    0.0, -s.x,  c.x, 0.0,
		    0.0,  0.0,  0.0, 1.0);

    mat4 ry = mat4(c.y, 0.0, -s.y, 0.0,
		    0.0, 1.0,  0.0, 0.0,
		    s.y, 0.0,  c.y, 0.0,
		    0.0, 0.0,  0.0, 1.0);


    mat4 rz = mat4(c.z, s.z, 0.0, 0.0,
		    -s.z,  c.z, 0.0, 0.0,
		    0.0,  0.0, 1.0, 0.0,
		    0.0,  0.0, 0.0, 1.0);

    mat4 tMat = mat4(
        1.0,  0.0,  0.0, 0.0,
		0.0,  1.0,  0.0, 0.0,
		0.0,  0.0,  1.0,  0.0,
		uTranslate.x,  uTranslate.y,  uTranslate.z, 1.0
    );

    mat4 tScale = mat4(
        uScale.x, 0, 0, 0,
        0, uScale.y, 0, 0,
        0,0, uScale.z, 0,
        0,0,0,1
    );


    // 光照计算

    vec3 pos = -(uModelView * (rz * ry * rx) * tScale * tMat * aPosition).xyz;

    // 光源位置 
    vec3 light = uLightPosition.xyz;
    // 光源与点线
    vec3 L = normalize(light - pos);
    
    // 计算半角向量
    vec3 E = normalize(-pos);
    vec3 H = normalize(L + E);

    vec4 NH = vec4(aNormal, 0);

    // 计算法向量转换
    vec3 N = normalize((uModelView * (rz * ry * rx) * tScale * tMat * NH).xyz);

    // 环境光分量
    vec4 ambient = uAmbientProduct;

    // 计算漫反射光分量
    float Kd = max( dot(L, N), 0.0 );
    vec4 diffuse = Kd*uDiffuseProduct;

    // 计算镜面反射光分量
    float Ks = pow(max( dot( N, H ), 0.0 ), uShininess);
    vec4 specular = Ks * uSpecularProduct;

    // 如果方向为反
    if(dot(L, N) < 0.0){
        specular = vec4(0.0, 0.0, 0.0, 1.0);
    }
    

    gl_Position = uProject * uModelView * (rz * ry * rx) * tScale * tMat * aPosition;

    vColor = ambient + diffuse + specular;

}