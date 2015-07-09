#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

float fillCircle(vec2 cPos, float r, vec2 pos) {
    return pow(max(1.0 - length(pos - cPos), 0.0), r);
}

float balls(vec2 off) {
    vec2 pos = gl_FragCoord.xy/iResolution.yy - vec2(0.5) + off;
    pos.x -= ((iResolution.x-iResolution.y)/iResolution.y)/2.0;

    float pL = 0.0;
    float t = iGlobalTime;
    
    pL += fillCircle(vec2(sin(t)*0.6, cos(t*0.9)*0.07), 7.0, pos);
    pL += fillCircle(vec2(sin(t*0.9)*0.07, cos(t)*0.5), 9.0, pos);
    pL += fillCircle(vec2(sin(t*0.7)*0.4, sin(t*0.8)*0.4), 5.0, pos);
    pL += fillCircle(vec2(cos(t*0.6)*0.2, sin(t*0.4)*0.5), 6.0, pos);
    pL += fillCircle(vec2(cos(t*0.8)*0.02, sin(2.0*t)*0.3), 9.0, pos);
    //pL += fillCircle(vec2(cos(t*0.2)*0.02, sin(t*0.7)*0.1)*a, 10.0, pos);
    //pL += fillCircle(vec2(cos(t*0.3)*0.03, sin(t*0.5)*0.2)*a, 11.0, pos);
    //pL += fillCircle(vec2(cos(t*0.4)*0.04, sin(t*0.9)*0.3)*a, 11.0, pos);
    //pL += fillCircle(vec2(cos(t*0.5)*0.05, sin(t*0.4)*0.4)*a, 11.0, pos);
    /*pL += fillCircle(vec2(cos(t*0.6)*0.06, sin(t*0.001)*0.5)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*0.7)*0.07, sin(t*0.1)*0.6)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*0.8)*0.08, sin(t*1.6)*0.7)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*0.9)*0.09, sin(t*0.2)*0.8)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t)*0.1, sin(t)*0.3)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*1.1)*0.11, sin(t*1.3))*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*1.2)*0.12, sin(t*0.6))*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*0.1)*0.13, sin(t*1.111111)*1.4)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*0.11)*0.14, sin(t)*0.2)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*0.111)*0.15, sin(t)*0.6)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*0.1111)*0.16, sin(t*0.6)*2.3)*a, 14.0, pos);
    pL += fillCircle(vec2(cos(t*0.11111)*0.17, sin(t)*1.3)*a, 14.0, pos);
*/
    pL = clamp((pL-0.5)*40.0, 0.0, 1.0);
    return pL;
}

void main() {

    gl_FragColor = vec4(balls(vec2(0.04+sin(gl_FragCoord.y*0.01)*0.01,0.0)), balls(vec2(0.02, 0.0)), balls(vec2(sin(gl_FragCoord.y*0.01)*0.01, 0.0)), 0.2);
}
