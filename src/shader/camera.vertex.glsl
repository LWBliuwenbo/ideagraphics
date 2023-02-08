#version 300 es


in vec3 vtx_position;
in vec3 vtx_normal;

uniform mat4  modelViewMatrix;

void main() {
    vec4 positions = vec4(vtx_position, 1.0);
    gl_Position = modelViewMatrix * positions;
}
