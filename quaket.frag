#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

void main() {
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    vec4 a1 = texture2D(iChannel0, uv);
    vec4 a2 = texture2D(iChannel1, uv);
    float a;
    if (mod(iGlobalTime * 2.0, 20.0) < 15.0)
         a = a1.r;
    else a = a2.r;
    gl_FragColor = vec4(mod(iGlobalTime*10.0, 2.0)-vec3(a), 1.0);
}
