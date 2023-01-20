#version 300 es

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

in vec3 vtx_position;

out vec4 worldSpaceVert;
out vec4 eyeSpaceVert;

void main(void)
{
    // do the necessary transformations
    worldSpaceVert = vec4(vtx_position,1);
    eyeSpaceVert = modelViewMatrix * worldSpaceVert;
    gl_Position = projectionMatrix * eyeSpaceVert;
}