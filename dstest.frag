#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

void main() {
    int x = int(gl_FragCoord.x*0.1);
    int y = int(gl_FragCoord.y*0.1);
    float fx = float(x);
    float fy = float(y);
    vec2 uv = vec2(fx,fy)/(iResolution.xy*0.1);
    vec3 col = vec3(0.06, 0.5, 0.9);
    uv *= sin(iGlobalTime)*8.0+16.0;
    float l = sin(uv.x)*sin(uv.y);
    gl_FragColor = vec4(col*l, 0.1);
}
