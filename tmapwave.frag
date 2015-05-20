precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

void main() {
    lowp vec2 pos = gl_FragCoord.xy/iResolution.xy;
    float a = sin(iGlobalTime*0.6)*0.6;
    pos = vec2((pos.x * cos(a)) - (pos.y * sin(a)), (pos.x * sin(a)) + (pos.y * cos(a)));
    pos *= sin(iGlobalTime*0.4)*0.8+1.4;
    pos.x += sin(pos.y*7.0+iGlobalTime)*sin(iGlobalTime*1.4)*0.1+0.2;
    pos.y *= sin(pos.x*11.0+iGlobalTime)*sin(iGlobalTime*1.2)*0.2+1.04;
   //pos.x += sin(pos.y*10.0+iGlobalTime)*sin(iGlobalTime*2.4)*0.05+0.1;
    ////pos.y += sin(pos.x*17.0+iGlobalTime)*sin(iGlobalTime*1.6)*0.02+0.03;
   gl_FragColor = vec4(sin(pos.x*5.0)*0.04+0.08, 0.0, sin(pos.y*3.0)*0.04+0.08, 1.0);
}
