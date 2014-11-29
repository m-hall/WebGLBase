attribute vec3 vertex;
attribute vec2 textureCoord;
uniform mat4 modelView;
uniform mat4 perspective;
varying vec2 texCoord;
void main(void) {
    gl_Position = perspective * modelView * vec4(vertex, 1.0);
    texCoord = textureCoord;
}