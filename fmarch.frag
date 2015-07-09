#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

#define EPSILON 0.001
#define PI 3.14159265

mat2 getRotMat(float a) {
    return mat2(sin(a), -cos(a),
                cos(a), sin(a)
    );
}

vec3 getPicture(vec2 screenPos) {
    vec2 pos = getRotMat(sin(iGlobalTime*1.2)*0.4)*screenPos*(sin(iGlobalTime*0.8)*1.0+2.0) +vec2(iGlobalTime, iGlobalTime*0.3);
    float l = sin(pos.y * 20.0) * sin(pos.x*20.0) -0.5;
    l = clamp(l*100000.0, 0.0, 1.0);
    
    vec2 pos2 = getRotMat(sin(iGlobalTime*1.2)*0.4)*screenPos*(sin(iGlobalTime*0.8)*1.0+3.0) +vec2(iGlobalTime, iGlobalTime*0.3);
    float l2 = sin(pos2.y * 20.0) * sin(pos2.x*20.0) -0.5;
    l2 = clamp(l2*100000.0, 0.0, 1.0)*0.5;
    return vec3(l+l2);
}

void main() {
    vec2 pos = (2.0*gl_FragCoord.xy -iResolution.xy)/iResolution.y;
    gl_FragColor = vec4(getPicture(pos), 1.0);
}