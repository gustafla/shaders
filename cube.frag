#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iGlobalTime;

#define ITERATIONS 50
#define MAX_T 70.0
#define MIN_T 0.1
#define STEP_SCALE 1.0
#define EPSILON 0.001
#define PI 3.14159265

float t = iGlobalTime;
vec3 cam;
vec3 normal;

//---------------------------------------------------------------

mat2 getRotMat(float a) {
    return mat2(sin(a), -cos(a),
                cos(a), sin(a)
    );
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

void repX(inout vec3 p, float s) {
    vec3 r = p;
    r.x = mod(p.x, s)-(s*0.5);
    p=r;
}

void repXY(inout vec3 p, float s) {
    vec3 r = p;
    r.x = mod(p.x, s)-(s*0.5);
    r.y = mod(p.y, s)-(s*0.5);
    p=r;
}

void repXYZ(inout vec3 p, float s) {
    vec3 r = p;
    r.x = mod(p.x, s)-(s*0.5);
    r.y = mod(p.y, s)-(s*0.5);
    r.z = mod(p.z, s)-(s*0.5);
    p=r;
}

//--------------------------------------------------------------------

float box(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float plane(vec3 p) {
    return p.y;
}

float sphere(vec3 p) {
    return length(p)-1.0;
}

float f(vec3 p) {
    return box(getYRotMat(iGlobalTime)*getZRotMat(iGlobalTime*0.7)*(p - vec3(0.0, 0.0, 6.0)), vec3(1.0));
}

vec3 grad(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    return (vec3(f(p+e.xyy), f(p+e.yxy), f(p+e.yyx)) - f(p)) / e.x;
}

vec3 march(vec3 o, vec3 v) {
    float t = MIN_T;
    float d;
    for (int i=0; i<ITERATIONS; i++) {
        d = f(o+v*t);
        t += d*STEP_SCALE;
        if (d<EPSILON||t>MAX_T)
            break;
    }
    return o+v*t;
}

vec3 applyFog(vec3 p, float i, vec3 ci, vec3 fc) {
    return mix(ci, fc, clamp((1.0/i)*p.z, 0.0, 1.0));
}

vec3 bg(vec2 scPos) {
    vec3 c1 = vec3(0.7, 0.6, 0.2);
    vec3 c2 = vec3(0.6, 0.2, 0.2);
    scPos =  getRotMat(iGlobalTime*0.4)*scPos;
    scPos *= sin(iGlobalTime*0.6)*4.0+15.0;
    float f = sin(scPos.x)*cos(scPos.y);
    return (f*c1+((1.0-f)*c2));
}

vec3 render(vec2 scPos) {
    vec3 p = march(cam, /*getYRotMat(-0.3)*/normalize(vec3(scPos*0.8, 1.0)));
    normal = normalize(grad(p));
    vec3 c = (1.0/length(p-cam))*max(dot(normalize(p-cam), -normal),0.0)*vec3(0.0, 1.0, 0.0)*4.0;
    return applyFog(p-cam, 40.0, c, bg(scPos));
}

void main() {
    cam = vec3(0.0, 0.0, 0.0);
    vec2 scPos = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
    gl_FragColor = vec4(render(scPos), 1.0);
}
