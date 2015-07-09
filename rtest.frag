#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iGlobalTime;

vec3 getAmigaTexture(vec2 pos, float s) {
    float l = clamp(sin(pos.x*s)*sin(pos.y*s)*1000.0, 0.0, 1.0);
    return (vec3(1.0, 0.0, 0.0)*l+(vec3(1.0, 1.0, 1.0)*(1.0-l)));
}

void main() {
    vec2 pos=gl_FragCoord.xy/iResolution.xy-vec2(0.5, 0.5);
    vec3 cam=vec3(sin(iGlobalTime)*2.0, cos(iGlobalTime), cos(iGlobalTime*0.5));
    
    vec2 uv = vec2(atan(atan(pos.x, pos.y)/(pos.x+sin(pos.y-cam.x)/sqrt(pos.x+cam.y))), abs(pos.x*pos.x/pos.y+cam.z));
    gl_FragColor = vec4(getAmigaTexture(uv.xy, 20.0), 0.1);
}
