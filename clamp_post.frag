precision highp float;

uniform sampler2D iChannel0;
uniform float iGlobalTime;
uniform vec2 iResolution;

void main() {
    vec2 pos = gl_FragCoord.xy/iResolution.xy;
    pos = vec2(clamp(pos.x, 0.0, sin(iGlobalTime)*0.5+0.5), pos.y);
    gl_FragColor = vec4(texture2D(iChannel0, pos).rgb, 1.0);
}
