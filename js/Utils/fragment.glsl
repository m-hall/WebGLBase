#ifdef GL_ES
precision lowp float;
#endif
uniform sampler2D tex;
varying vec2 texCoord;
void main(void) {
    vec4 o = texture2D(tex, texCoord);
    gl_FragColor = o;
}