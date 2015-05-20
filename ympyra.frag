#ifdef GL_ES
    precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

#define W 0.002

void main() {
    vec3 outc = vec3(0.0);
    vec2 screenPos = gl_FragCoord.xy/iResolution.yy;
    
    vec2 c = vec2(sin(iGlobalTime)*0.5 + 0.5, 0.5);
    float r = 0.3;
    
    float xx = screenPos.x-c.x;
    float yy = screenPos.y-c.y;
    if (xx*xx + yy*yy < r*r+W && xx*xx + yy*yy > r*r-W)
        outc = vec3(1.0);
    
    gl_FragColor = vec4(outc, 1.0);
}