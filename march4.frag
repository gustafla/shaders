#ifdef GL_ES
    precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

#define ITR 70
#define EPSILON 0.001
#define PI 3.14159265
#define NUM_LIGHTS 2
#define MAX_MARCH_LENGTH 20.0

#define TRY_DRAW_LIGHTSOURCES //comment to hide light sources

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

float plane(vec3 p) {
    return p.y;
}

float torus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz)-t.x,p.y);
    return length(q)-t.y;
}

float box(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sphere(vec3 pos, float r) {
    return length(pos) -r;
}

float tunnel(vec3 pos, float r) {
    return -(length(vec3(pos.xy,0.0))-r);
}

//-----------------------------------------------------------------------------

vec3 cam = vec3(0.0, 1.0, sin(iGlobalTime)-1.0);
vec3 lights[NUM_LIGHTS*2];
vec3 normal;

float scene(vec3 pos) {
    /*return min(
        plane(pos),
        min(
            box(getYRotMat(iGlobalTime*0.33)*getXRotMat(iGlobalTime)*(pos-vec3(1.4, 1.3+sin(iGlobalTime)*0.5, 5.0-sin(iGlobalTime*0.2)*0.2)), vec3(0.4, 0.4, 0.4)),
            box(getYRotMat(iGlobalTime*0.6)*getXRotMat(iGlobalTime*0.4)*(pos-vec3(-1.4, 1.0+cos(iGlobalTime)*0.3, 5.0)), vec3(0.4, 0.4, 0.4))
        )
    );*/
    return min(
        plane(pos),
        sphere(pos-vec3(0.0, 1.0, 4.0), 1.0)
    );
}

//-----------------------------------------------------------------------------

vec3 grad(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    return (vec3(scene(p+e.xyy), scene(p+e.yxy), scene(p+e.yyx)) - scene(p)) / e.x;
}

float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k)
{
    float res = 1.0;
    float t = mint;
    float h;
    for(int i=0;i<ITR;i++)
    {
        h = scene(ro + rd*t);
        if(h<EPSILON)
            return 0.0;
        t += h;
        res = min(res, k*h/t);
        if(t > maxt)
            break;
    }
    return res;
}

vec3 light(vec3 pos, vec3 light, vec3 color) {
    float nmLight = max(dot(normalize(pos-light), -normal), 0.0);
    return (1.0/length(pos-light)) * nmLight * softShadow(pos, normalize(light-pos), 0.1, length(light-pos), 18.0) * color * texture2D(iChannel0, pos.xz*0.2).rgb + pow(nmLight, 200.0)*color;
}

vec3 lighting(vec3 pos, vec3 dir, vec3 spos) {
    vec3 l=vec3(0.0);
    for (int i=0; i<NUM_LIGHTS; i++) {
        l += light(pos, lights[i*2], lights[i*2+1]);
        
        #ifdef TRY_DRAW_LIGHTSOURCES
            if (length(pos-spos) > length(lights[i*2]-spos))
                l += pow(max(dot(normalize(spos-lights[i*2]), -dir), 0.0), 2000.0)*lights[i*2+1];
        #endif
    }
    return l;
}

vec3 march(vec3 origin, vec3 direction) {
    float t;
    float dist;
    for (int i=0; i<ITR; i++) {
        dist = scene(origin+direction*t);
        t += dist;
        if (t > MAX_MARCH_LENGTH)
            break;
    }
    return origin + direction*t;
}

vec3 getImage(vec2 screenPos) {
    vec3 screenDir = /*getXRotMat(-0.5)*/normalize(vec3(screenPos*0.5, 1.0));
    vec3 pos = march(cam, screenDir);
    normal = normalize(grad(pos)); //Global normal, declared after distfield tools
    vec3 reflectDir = normalize(reflect(screenDir, normal));
    return lighting(pos, screenDir, cam)*0.7 + lighting(march(pos+reflectDir*EPSILON, reflectDir), reflectDir, pos)*0.3;
}

void main() {
    lights[0] = vec3(sin(iGlobalTime*0.3+(PI/3.0))*3.0, 2.0, 6.0);
    lights[1] = vec3(1.0, 1.0, 0.6);
    
    lights[2] = vec3(sin(iGlobalTime*0.5)*4.0, 2.5+cos(iGlobalTime*0.2)*0.4, 3.5+cos(iGlobalTime*0.5)*6.0);
    lights[3] = vec3(1.0, 0.5, 0.0)*2.0;
    
    //lights[4] = vec3(0.0, 5.0+sin(iGlobalTime*0.2)*2.0, 2.0);
    //lights[5] = vec3(0.6, 0.6, 0.8);
    
    vec2 pos = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
    gl_FragColor = vec4(vec3(getImage(pos)), 1.0);
}
