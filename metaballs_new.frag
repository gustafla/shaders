#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

float fillCircle(vec2 cPos, float r) {
    vec2 pos = gl_FragCoord.xy/iResolution.yy - vec2(0.5);
    pos.x -= ((iResolution.x-iResolution.y)/iResolution.y)/2.0;
    return pow(max(1.0 - length(pos - cPos), 0.0), r);
}

void main() {
    float pL = 0.0;
    float t = iGlobalTime;

    pL += fillCircle(vec2(sin(t)*0.6, cos(t*0.9)*0.4), 8.0);
    pL += fillCircle(vec2(sin(t*0.9)*0.7, cos(t)*0.333), 10.0);
    pL += fillCircle(vec2(sin(t*0.61)*0.4, sin(t*0.44)*0.5), 8.0);
    pL += fillCircle(vec2(sin(t*0.22)*0.6, sin(t*0.64)*0.13), 8.0);
    pL += fillCircle(vec2(cos(t*0.53)*0.47, sin(t)*0.724), 5.0);

    pL = clamp((pL-0.5)*20.0, 0.0, 1.0);
    gl_FragColor = vec4(pL, pL, pL, 0.2);
}
