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

vec2 f(vec3 p) {
	vec2 ret;
    vec3 pb = p;
    pb.z = max(pb.z, 6.0);
    pb.x = max(pb.x, 0.0);
    repXY(pb.xzy, 3.0);
    ret.x = min(
		min(
			sphere(pb-vec3(0.0, 0.0, 0.0)),
			box(p-vec3(10.0, 1.1, 16.0), vec3(10.0, 0.4, 10.0))
		),
		plane(p-vec3(0.0, -0.6, 0.0))
	);
	return ret;
}

vec3 grad(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    return (vec3(f(p+e.xyy), f(p+e.yxy), f(p+e.yyx)) - f(p)) / e.x;
}

vec4 march(vec3 o, vec3 v) {
    float t = MIN_T;
    vec2 d;
    for (int i=0; i<ITERATIONS; i++) {
        d = f(o+v*t);
        t += d.x*STEP_SCALE;
        if (d.x<EPSILON||t>MAX_T)
            break;
    }
    return vec4(o+v*t, d.y);
}

vec3 applyFog(vec3 p, float i, vec3 ci, vec3 fc) {
    return mix(ci, fc, clamp((1.0/i)*p.z, 0.0, 1.0));
}

vec3 render(vec2 scPos) {
    vec4 pp = march(cam, getYRotMat(-0.3)*normalize(vec3(scPos*0.8, 1.0)));
    vec3 p = pp.xyz;
    normal = normalize(grad(p));
    vec3 c = (1.0/length(p-cam))*max(dot(normalize(p-cam), -normal),0.0)*normalize(vec3(0.5, 0.8, 1.0))*4.0;
    return applyFog(p-cam, 40.0, c, vec3(0.0, 0.01, 0.02));
}

void main() {
    cam = vec3(0.4, sin(t*0.4)*0.3+1.5, 1.0);
    //cam = vec3(t*0.4, 2.0-t*0.1, t);
    vec2 scPos = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
    gl_FragColor = vec4(render(scPos), 1.0);
}
