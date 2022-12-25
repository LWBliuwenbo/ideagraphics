#version 300 es

in  vec4 aPosition;
in  vec4 aColor;
out vec4 vColor;

uniform vec3 translate;

void main()
{
    mat4 tMat = mat4(1.0,  0.0,  0.0, translate.x,
		    0.0,  1.0,  0.0,  translate.y,
		    0.0,  0.0,  1.0,  translate.z,
		    0.0,  0.0,  0.0, 1.0);


    vColor = aColor;
    gl_Position = tMat * aPosition;
}