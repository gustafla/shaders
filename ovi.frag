#ifdef GL_ES
    precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

#define PI 3.14159265
#define EPSILON 0.001
#define ITERATIONS 30
#define MAX_MARCH_LEN 30.0
#define NUM_POINTLIGHTS 3
#define TRY_DRAW_LIGHTSOURCES
vec3 cam = vec3(0.0, 1.7+sin(iGlobalTime)*0.1, sin(iGlobalTime*0.6)*0.2);
//vec3 cam = vec3(sin(iGlobalTime)*8.0, 1.7+sin(iGlobalTime)*0.1, sin(iGlobalTime*0.6)*02.2);
vec3 normal;
vec4 light_p_coord[NUM_POINTLIGHTS]; //W is bool visibility
vec3 light_p_color[NUM_POINTLIGHTS];

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

float smin( float a, float b, float k ) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float box(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float plane(vec3 pos) {
    return pos.y;
}

float sphere(vec3 pos, float r) {
    return length(pos)-r;
}

/*-------------------------------------------------------------------*/

float wallWithDoor(vec3 pos) {
    float doorW = 1.2;
    float doorH = 2.0;
    
    float wall = box(pos, vec3(20.0, 10.0, 0.2));
    //pos.x = mod(pos.x, 10.0)-5.0;
    float door = min(
            box(pos, vec3(doorW, doorH*2.0, 40.0)),
            sphere(pos-vec3(0.0, doorH*2.0, 0.0), doorW)
    );
    float door2 = min(
            box(pos-vec3(6.0, 0.0, 0.0), vec3(doorW, doorH*2.0, 40.0)),
            sphere(pos-vec3(6.0, doorH*2.0, 0.0), doorW)
    );
    
    return max(
        wall,
        -min(
            door,
            door2
        )
    );
}

float scene(vec3 pos) {
    return smin(
        plane(pos),
        min(
            wallWithDoor(pos-vec3(-0.2, 0.0, 6.0)),
            wallWithDoor(getYRotMat(PI/2.0)*(pos-vec3(3.0, 0.0, 9.0)))
        ),
        0.1
    );
}

/*---------------------------------------------------------------------------*/

vec3 getGradient(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    return (vec3(scene(p+e.xyy), scene(p+e.yxy), scene(p+e.yyx)) - scene(p)) / e.x;
}

vec3 march(vec3 origin, vec3 direction) {
    float t=EPSILON;
    float dist;
    for (int i=0; i<ITERATIONS; i++) {
        dist = scene(origin+direction*t);
        t += dist;
        if (dist<EPSILON)
            break;
        if (t>MAX_MARCH_LEN)
            break;
    }
    return origin + direction*t;
}

float softShadow(vec3 origin, vec3 direction, float mint, float maxt, float k) {
    float l = 1.0;
    float t = mint;
    float dist;
    for(int i=0;i<ITERATIONS;i++)
    {
        dist = scene(origin + direction*t);
        if(dist<EPSILON)
            return 0.0; //If hits a surface, fragment is completely shadowed
        t += dist;
        l = min(l, k*dist/t);
        if(t > maxt)
            break;
    }
    return l;
}

vec3 pointLight(vec3 pos, vec3 lpos, vec3 lcol) {
    float diff = max(dot(normalize(pos-lpos), -normal), 0.0);
    float dist = 1.0/(length(pos-lpos));
    float shadow = softShadow(pos, normalize(lpos-pos), 0.1, length(lpos-pos), 30.0);
    return dist * diff * lcol * shadow;
}

vec3 lighting(vec3 pos) {
    vec3 l = vec3(0.0);
    for (int i=0; i<NUM_POINTLIGHTS; i++) {
        vec3 lcoord = light_p_coord[i].xyz;
        l += pointLight(pos, lcoord, light_p_color[i]);
        
        if (light_p_coord[i].w > 0.5) {
            if (length(pos-cam) > length(lcoord-cam))
                l += pow(max(dot(normalize(cam-lcoord), -normalize(pos-cam)), 0.0), 2000.0)*light_p_color[i];
        }
    }
    return l;
    
}

vec3 getPicture(vec2 screenPos) {
    vec3 pos = march(cam, getZRotMat(sin(iGlobalTime*0.2)*0.04)*getYRotMat(-0.2)*normalize(vec3(screenPos, 1.0)));
    normal = normalize(getGradient(pos));
    return lighting(pos);
}

void main() {
    light_p_coord[0] = vec4(sin(iGlobalTime*0.331)*0.5-2.0, 2.0, 9.0+cos(iGlobalTime*0.42), 0.0);
    light_p_color[0] = vec3(1.0, 0.6, 0.1)*2.8;
    
    //This light for fake GI :D
    light_p_coord[1] = vec4(0.2, sin(iGlobalTime*0.64)*0.4+3.0, 3.0, 0.0);
    light_p_color[1] = normalize(vec3(1.0, 0.7, 0.3))*0.8;
    
    light_p_coord[2] = vec4(3.0+sin(iGlobalTime*0.4)*3.0, 1.5+sin(iGlobalTime*0.6654)*0.3, 6.0+cos(iGlobalTime*0.4)*3.0, 1.0);
    light_p_color[2] = vec3(0.2, 0.9, 0.4)*(sin(iGlobalTime*3.0)*0.2+0.8)*(sin(iGlobalTime*5.0)*0.3+0.6)*(cos(iGlobalTime*0.6)*0.2+1.0);

    gl_FragColor = vec4(getPicture((2.0*gl_FragCoord.xy - iResolution.xy)/iResolution.y)*1.3, 1.0);
}
