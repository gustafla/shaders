#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

void main() {
    vec3 col1 = vec3(0.1, 1.0, 0.2);
    vec3 col2 = vec3(0.1, 0.2, 1.0);
    vec3 col3 = vec3(0.0, 0.1, 0.1);

    vec2 pos = gl_FragCoord.xy/iResolution.xy;

    float l = sin(sin(sin(pos.x*(pos.x-pos.y*iGlobalTime*5.0)) * sin(pos.y-cos(iGlobalTime*2.0)*pos.x) + iGlobalTime*4.0));
    vec3 col = (l*col1+(col2*(1.0-l)));

    gl_FragColor = vec4(col, 0.1);
}
