#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D iChannel0;
uniform float iGlobalTime;
uniform vec2 iResolution;

void main() {
    vec2 pos = gl_FragCoord.xy/iResolution.xy;
    pos.x+=sin(pos.y*40.0)*0.01;
    //pos.x*=sin(pos.y*6.0+iGlobalTime)*0.04+0.98;
    pos.y+=sin(pos.x*16.0-iGlobalTime)*0.012;
    //pos.y*=sin(pos.y*8.0+iGlobalTime)*0.04+0.98;
    //sin(pos.y*3.0+iGlobalTime)*0.1+0.95;
    gl_FragColor = vec4(texture2D(iChannel0, pos).rgb, 1.0);
}
