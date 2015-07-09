#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

vec2 uv = gl_FragCoord.xy / iResolution.xy;

void main() {
    vec4 c = texture2D(iChannel0, vec2(uv.x, clamp(uv.y, sin(iGlobalTime*0.5)*0.5+0.5, 1.0)));
    gl_FragColor = vec4(c.rgb, 0.1);
}
