#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;

#define PI 3.14159265

vec2 uv = gl_FragCoord.xy / iResolution.yy;

float rand(vec2 co){
    return fract(sin(dot(co*0.01, vec2(12.9898, 78.233))) * 43758.5453);
}

void text() {

}

vec3 tunnel() {
    vec2 uv_t = uv - vec2((iResolution.x/iResolution.y)*0.5, 0.5);
    
    float t = 1.0/sqrt(uv_t.x*uv_t.x + uv_t.y*uv_t.y);
    float u = atan(uv_t.y, uv_t.x)+(sin(iGlobalTime*0.8)*3.0);
    float v = t+(iGlobalTime*3.0);

    u+=t*cos(iGlobalTime*0.8)*0.1;   
 
    float l = clamp(((sin(u*4.0)*sin(v*2.0))*1.0)*6.0, 0.0, 1.0);
    l/=t;

    vec3 col2 = vec3(0.02, 0.05, 0.05);
    vec3 col1 = vec3(0.0 , 0.7, 0.9);

    return ((col1 * l) + (col2 * (1.0-l)));
}

void main() {
    gl_FragColor = vec4(tunnel(), 1.0);
}
