#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

void main() {
    vec2 pos = gl_FragCoord.xy/iResolution.xy;
    pos.y += (sin(pos.y*6.0+iGlobalTime) + sin(pos.y*2.0-iGlobalTime*0.6)*0.3)*0.3;
    pos.x += (sin(pos.y*3.0-iGlobalTime*1.2)*0.3 + sin(pos.y*2.0-iGlobalTime*0.5)*0.2 + sin(pos.y*4.0+iGlobalTime*0.8)*0.4)*0.5;
    float primaryMap = ((sin(pos.x*12.0+iGlobalTime*0.3)+0.5) + sin(pos.y*10.0+iGlobalTime) +
                        sin(pos.y*3.0*pos.x*2.0+iGlobalTime*1.3)*0.7+0.7 + sin(pos.x+pos.y+iGlobalTime*1.3)*0.4) * ((cos(pos.y*2.0+iGlobalTime)*0.8+1.0)*(sin(pos.x*3.0-iGlobalTime)*0.6+0.6));
    primaryMap *= 2.0;
    gl_FragColor = vec4(vec3(sin(primaryMap), sin(primaryMap+1.7), sin(primaryMap+3.66666)*0.3), 1.0);
}
