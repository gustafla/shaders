precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

float BPM=144.0;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    //float pulse = max(sin(iGlobalTime)*1.5+1.46, 0.0);
    float pulse = max((1.0-abs(sin(iGlobalTime*(BPM/60.0)*2.0)))*0.02-0.01, 0.0);
    vec2 pos = gl_FragCoord.xy/iResolution.xy;
    float ang = rand(pos-vec2(0.5)+iGlobalTime*0.1)*360.0;//rand(pos+bpos);//rand(pos+iGlobalTime)*360.0;
    //pos.x += rand(pos+iGlobalTime)*pulse*0.1-0.05*pulse;
    //pos.y += rand(pos+iGlobalTime*0.99)*pulse*0.1-0.05*pulse;
    pos += vec2(cos(ang), sin(ang))*pulse*rand(pos+iGlobalTime);//*noiTex;
    gl_FragColor = vec4(texture2D(iChannel0, pos).rgb, 1.0);
}
