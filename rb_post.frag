#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

void main() {
    vec2 pos = gl_FragCoord.xy/iResolution.xy;
    gl_FragColor = vec4(texture2D(iChannel0, pos+vec2(0.01, 0.0)).r, texture2D(iChannel0, pos).g, texture2D(iChannel0, pos-vec2(0.01, 0.0)).b, 1.0);
}
