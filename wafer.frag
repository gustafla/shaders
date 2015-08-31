#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

float t = iGlobalTime;

#define EPSILON 0.001
#define M_ITR 14
#define M_MAX 30.0
#define M_STR 0.2

//-----------------------------------------------------------------------------
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

mat3 getXRotMat(float a) {
    return mat3(
         1.0,  0.0,     0.0,
         0.0,  cos(a), -sin(a),
         0.0,  sin(a),  cos(a)
    );
}

mat3 getYRotMat(float a) {
    return mat3(
         cos(a),  0.0,  sin(a),
         0.0,     1.0,  0.0,
        -sin(a),  0.0,  cos(a)
    );
}

mat3 getZRotMat(float a) {
    return mat3(
         cos(a), -sin(a),  0.0,
         sin(a),  cos(a),  0.0,
         0.0,     0.0,     1.0
    );
}
//-----------------------------------------------------------------------------

float ball(vec3 p) {
    return length(p)-1.0;
}

float plane(vec3 p) {
    return p.y;
}

float waferUncut(vec3 p) {
    return max(
        max(
            ball(p),
            plane(p-vec3(0.0, 0.007, 0.0))
        ),
        -plane(p-vec3(0.0, -0.007, 0.0))
    );
}

float f(vec3 p) {
    return waferUncut((p-vec3(0.0, -0.8, 2.0)));
}

float march(vec3 origin, vec3 direction) {
    float tt = M_STR;
    float d;
    for (int i=0; i<M_ITR; i++) {
        d = f(origin+direction*tt);
        tt += d;
        if (d<EPSILON || d>M_MAX)
            break;
    }
    return tt;
}

vec3 grad(vec3 p) {
    vec2 e = vec2(0.01, 0.0);
    return (vec3(f(p+e.xyy), f(p+e.yxy), f(p+e.yyx)) - f(p)) / e.x;
}

vec3 render(vec3 camPos, vec2 screenPos) {
    vec3 dir = normalize(vec3(screenPos, 1.0));
    vec3 pos = camPos + dir*march(camPos, dir);
    vec3 normal = normalize(grad(pos));
    float diff = max(dot(-normal, normalize(pos-camPos)), 0.0);
    return vec3(1.0) * 1.0/length(pos-camPos)*diff;
}

void main() {
    vec2 pos = (2.0*gl_FragCoord.xy - iResolution)/iResolution.y;
    vec3 c = render(vec3(0.0), pos);
    gl_FragColor = vec4(c, 1.0);
}
