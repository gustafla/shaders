#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iGlobalTime;

#define ITERATIONS 20
#define MAX_T 50.0
#define MIN_T 3.1
#define STEP_SCALE 2.3
#define EPSILON 0.1
#define PI 3.14159265

float t = iGlobalTime;
vec3 cam;
vec3 normal;

//---------------------------------------------------------------

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

float plane(vec3 p) {
    return p.y;
}

float sphere(vec3 p) {
    return length(p)-1.0;
}

float f(vec3 p) {
    vec3 pb = p;
    pb.y+=sin(pb.z*0.4+t+pb.x*0.2)*2.0;
    pb.y+=sin(pb.z*4.0+t)*0.1*sin(pb.x*5.0+t*0.8);
    pb.y+=sin(pb.z+t*0.3)*0.4*sin(pb.x+t*0.8);
    pb.y+=sin(pb.z*1.8+t*1.7)*0.1*sin(pb.x*2.0+t*3.0);
    pb.y+=sin(pb.z*0.1+t*1.6)*0.8*sin(-pb.x*0.2+t*0.5);
    //repXY(pb.xzy, 3.0);
    //pb.z = clamp(pb.z, 4.0, 20.0);
    //return sphere(pb-vec3(0.0, 0.0, 0.0));
    return// max(
        plane(pb-vec3(0.0, 0.0, 0.0));//,
    //    plane(pb-vec3(0.2, 0.0, 3.0))
    //);
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

vec3 render(vec2 scPos) {
    vec3 p = march(cam, /*getXRotMat(-0.8)*/normalize(vec3(scPos, 1.0)));
    normal = normalize(grad(p));
    vec3 c = (1.0/length(p-cam))*max(dot(normalize(p-cam), -normal),0.0)*normalize(vec3(0.5, 0.8, 1.0))*4.0;
    return applyFog(p-cam, 100.0, c, vec3(1.0, 0.6, 0.2));
}

void main() {
    cam = vec3(0.0, 5.0, 0.0);
    vec2 scPos = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
    gl_FragColor = vec4(render(scPos), 1.0);
}
