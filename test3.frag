precision highp float;

uniform vec2 iResolution;
uniform float iGlobalTime;

void main() {
    vec2 pos = gl_FragCoord.xy/iResolution.xy;
    vec3 col1 = vec3(1.0, 1.0, 0.0);
    vec3 col2 = vec3(0.0, 1.0, 0.0);
    float a = clamp(sin(pos.x*12.0+iGlobalTime)*100000000.0, 0.0, 1.0);
    gl_FragColor = vec4(col1*a+(col2*(1.0-a)), 1.0);
}
