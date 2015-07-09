#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

void main() {
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    gl_FragColor = vec4(vec3(0.0), 1.0);
    if(uv.y > 0.8-iGlobalTime*0.06)
        gl_FragColor.rgb = texture2D(iChannel0, uv).rgb;
}
