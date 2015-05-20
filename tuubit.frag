#ifdef GL_ES
    precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

float t = iGlobalTime;

#define PI 3.14159265
#define E 0.001
#define MD 40.0
#define I 100

vec3 cam;
vec3 nm;

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

float tube(vec3 p) {
    vec2 d = abs(p.yz) - vec2(1.0);
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float f(vec3 p) {
    vec3 tp = p;
    tp.z=clamp(tp.z, 10.0, 20.0);
    tp.y*=sin(tp.x*0.1+iGlobalTime*0.8)*0.4+1.0;
    repXY(tp.yzx, 8.0);
    tp.y+=sin(tp.x*.4+iGlobalTime*2.0+tp.z*0.3)*.7;
    tp=getXRotMat(tp.x*.1+iGlobalTime*0.8+tp.y*0.07)*tp;
    return tube(tp);
}

vec3 grad(vec3 p) {
    vec2 e = vec2(E, 0.0);
    return (vec3(f(p+e.xyy), f(p+e.yxy), f(p+e.yyx)) - f(p)) / e.x;
}

vec3 m(vec3 o, vec3 v) {
    float d;
    float t=E;
    for (int i=0;i<I;i++) {
        d=f(o+v*t);
        t+=d*0.5;
        if (d<E||t>MD)
            break;
    }
    return o+v*t;
}

vec3 applyFog(vec3 p, float i, vec3 ci, vec3 fc) {
    return mix(ci, fc, i*p.z);
}

vec3 c(vec2 sp) {
    vec3 p=m(cam, getXRotMat(sin(iGlobalTime*0.3)*0.3)*getYRotMat(sin(iGlobalTime*0.7)*0.2)*getZRotMat(sin(iGlobalTime*0.1)*0.4)*normalize(vec3(sp, 1.0)));
    nm=normalize(grad(p));
    float diff = max(dot(normalize(p-cam), -nm), 0.0);
    vec3 c = vec3(1.0, 0.2, 0.1)*(1./length(p-cam))*diff*max(pow(diff, 3.0)*8.0, 1.0)*4.0; //PLACEHOLDER LIGHTING
    vec3 fc1=vec3(1.0, 0.1, 0.2)*0.8;
    vec3 fc2=vec3(0.2, 0.1, 1.0)*0.8;
    float fp = sin(iGlobalTime*0.4)*0.5+0.5;
    c=applyFog(p, 0.01, c, fc1*fp+(fc2*(1.0-fp)));
    return c;
}

void main() {
    cam = vec3(sin(iGlobalTime*0.3)*0.2, cos(iGlobalTime)*6.0, sin(iGlobalTime*0.6)*0.4);
    
    vec2 sp = (2.*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
    gl_FragColor = vec4(c(sp)*3.0,1.);
}