precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

float fillCircle(vec2 cPos, float r) {
    vec2 pos = gl_FragCoord.xy/iResolution.yy - vec2(0.5);
    return pow(max(1.0 - length(pos - cPos), 0.0), r);
}

void main() {
    float pL = 0.0;
    float t = iGlobalTime;
    pL += fillCircle(vec2(sin(t)*0.2, cos(t))*0.8, 5.0);
    pL += fillCircle(vec2(sin(t*0.8)*0.6, cos(t))*0.2, 7.0);
    pL += fillCircle(vec2(sin(t*0.3)*0.1, cos(t*0.7))*0.8, 9.0);
    pL += fillCircle(vec2(cos(t*2.0)*0.2, sin(t*0.5))*0.7, 9.0);
    pL += fillCircle(vec2(sin(t*0.5)*0.1, cos(t*0.6))*0.5, 9.0);
    pL += fillCircle(vec2(sin(t*2.0)*0.8, cos(t*0.54))*0.1, 9.0);
    pL += fillCircle(vec2(sin(t*0.2)*0.4, cos(t*0.4))*0.6, 9.0);
    pL += fillCircle(vec2(sin(t*3.0)*0.2, cos(t*0.2))*0.8, 9.0);
    pL = clamp((pL-0.5)*1000.0, 0.0, 1.0);
    gl_FragColor = vec4(pL, pL, pL, 0.1);
}
