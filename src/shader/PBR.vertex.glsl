#version 300 es
precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 viewPosition;
// uniform mat3 normalMatrix;

in vec3 vtx_position;
in vec3 vtx_normal;
in vec3 vtx_color;

out vec3 eyeSpaceNormal;
out vec3 eyeSpaceTangent;
out vec3 eyeSpaceBitangent;
out vec4 eyeSpaceVert;
out vec3 fragbaseColor;

void computeTangentVectors( vec3 inVec, out vec3 uVec, out vec3 vVec )
{
    uVec = abs(inVec.x) < 0.999 ? vec3(1,0,0) : vec3(0,1,0);
    uVec = normalize(cross(inVec, uVec));
    vVec = normalize(cross(inVec, uVec));
}


// nothing to see here
void main(void)
{
    // do the necessary transformations
    eyeSpaceVert = viewMatrix* modelMatrix * vec4(vtx_position,1);
    
    mat3 normalMatrix = mat3(transpose(inverse(modelMatrix)));

    eyeSpaceNormal = normalMatrix * vtx_normal;

    computeTangentVectors( eyeSpaceNormal, eyeSpaceTangent, eyeSpaceBitangent );

    gl_Position = projectionMatrix * eyeSpaceVert;
    fragbaseColor = vec3(vtx_color);
}
