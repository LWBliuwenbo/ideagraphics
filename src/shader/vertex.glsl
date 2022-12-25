#version 300 es

in  vec4 aPosition;
in  vec4 aColor;
out vec4 vColor;

uniform vec3 uTheta;
uniform vec3 uTranslate;
uniform vec3 uScale;
uniform mat4 uModelView;
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
    

    gl_Position = uProject * uModelView * (rz * ry * rx) * tScale * tMat * aPosition;

    vColor = aColor;

}