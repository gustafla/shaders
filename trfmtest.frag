#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

float t = iGlobalTime;

mat2 getRot(float a) {
    return mat2(
        sin(a), -cos(a),
        cos(a), sin(a)
    );
}

vec3 CBTex(vec2 pos) {
    float a = clamp(sin(pos.x)*cos(pos.y)*100000.0, 0.0, 1.0);
    return a*vec3(sin(t+pos.y), 0.3, 0.0)+(1.0-a)*vec3(0.0, 0.3, cos(t*0.6+pos.x));
}

void main() {
    vec2 pos = (2.0*gl_FragCoord.xy - iResolution.xy)/iResolution.y;
    pos = getRot(t*0.4) * pos;
    pos *= sin(pos.y+t*2.0)*0.2+0.8;
    pos.x += t;
    pos.y += t*1.2;
    pos *= 20.0;
    gl_FragColor = vec4(CBTex(pos), 1.0);
}
