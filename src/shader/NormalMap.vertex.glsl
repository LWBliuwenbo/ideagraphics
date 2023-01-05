#version 300 es

in  vec4 aPosition; // 顶点位置
in  vec3 aNormal; // 法向量
in  vec2 aTextureCoord; // 纹理坐标
in  vec3 aTangent;
in  vec3 aBitangent;


out vec2 vTextureCoord; // 输出纹理坐标
out vec3 fragPos;
out vec3 Normal;
out vec3 tangent;
out vec3 bitangent;
out mat3 TBN;


// 模型变换矩阵
uniform vec3 uTheta;
uniform vec3 uTranslate;
uniform vec3 uScale;
// 视角矩阵
uniform mat4 uModelView;
// 投影矩阵
uniform mat4 uProject;




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



    mat4 model = (rz * ry * rx) * tScale * tMat;

    fragPos = ( model * aPosition).xyz;
    // 计算法向量转换
    mat3 NormalMat = mat3(transpose(inverse( model)));


    vTextureCoord = aTextureCoord;
    tangent = NormalMat * aTangent;
    bitangent = NormalMat * aBitangent;
    Normal = NormalMat * aNormal;
    TBN = transpose(mat3(tangent, bitangent, Normal));
    
    gl_Position = uProject * uModelView * model * aPosition;


}