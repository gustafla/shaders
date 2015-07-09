#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

float fillCircle(vec2 pos, vec2 cPos, float r) {
    pos.x -= ((iResolution.x-iResolution.y)/iResolution.y)/2.0;
    return pow(max(1.0 - length(pos - cPos), 0.0), r);
}

void main() {
    vec2 pos = gl_FragCoord.xy/iResolution.yy - vec2(0.5);
    float stencil = min(2.0*fillCircle(pos, vec2(sin(iGlobalTime*0.2)*0.5, sin(iGlobalTime*0.4)*0.4), 9.0), 1.0); //"stencil"
    vec3 colorbg = vec3(sin(pos.x*6.0+iGlobalTime)*0.5+0.5, sin(pos.x*4.0+iGlobalTime)*0.5+0.4, sin(pos.y+iGlobalTime*0.5)*0.5+0.5);
    gl_FragColor=vec4(colorbg*stencil, 1.0);
}
