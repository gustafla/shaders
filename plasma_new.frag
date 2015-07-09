#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iGlobalTime;

void main() {
    vec2 pos = gl_FragCoord.xy/iResolution.yy;
    float t = iGlobalTime;

    vec3 col1 = vec3(1.0, 0.2, 0.0);
    vec3 col2 = vec3(0.1, 0.0, 0.0);

    pos.x +=
        sin(pos.y*5.0+t)*0.2
    ;

    pos.y +=
        sin(pos.x*2.0+t)*0.2
    ;

    float plasMap =
        sin(pos.x*3.0+t)*1.2 +
        cos(pos.y*5.0+t)*2.0 +
        sin(pos.x*18.0-t)*0.8 +
        sin(pos.y*12.0-t)*2.0
    ;

    plasMap *= 
        sin(pos.x+pos.y*2.0+t)*0.2+1.0 +
        sin(pos.x*3.0+t)*0.4+1.4 +
        sin(pos.x*5.0-t*2.0)*0.8
    ;

    float l = sin(plasMap);
    gl_FragColor = vec4(col1*l+(col2*(1.0-l)), 1.0);
}
