precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;

#define PI 3.14159265

vec2 uv = gl_FragCoord.xy / iResolution.yy;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void logo() {
    float offs = iResolution.y/5.0;
    vec2 uv_l = uv*5.0;
    uv_l.x+=rand(uv.yy+iGlobalTime)*0.04;
    vec4 c = texture2D(iChannel0, uv_l);
    if (gl_FragCoord.x < offs && gl_FragCoord.y > offs*4.0) {
        gl_FragColor.rgb = (c.rgb*c.a)+(gl_FragColor.rgb*(1.0-c.a));
    }
}

vec3 tunnel() {
    vec2 uv_t = uv - vec2((iResolution.x/iResolution.y)*0.5, 0.5);
    
    float t = 1.0/sqrt(uv_t.x*uv_t.x + uv_t.y*uv_t.y);
    float u = atan(uv_t.y, uv_t.x)+(sin(iGlobalTime*0.22)*8.0);
    float v = t+(iGlobalTime*4.0);

    u+=t*cos(iGlobalTime*0.22)*0.2;   
 
    float l = ((sin(u*4.0)*sin(v*2.0))*1.0)*8.0;
    l=clamp(l, 0.0, 1.0);
    l/=t*0.5;

    vec3 col1 = vec3(0.7, 0.7, 0.2);
    vec3 col2 = vec3(0.6, 0.18, 0.0);

    return ((col1 * l) + (col2 * (1.0-l)));
}

void scroll() {
    vec2 uv_s = uv;
    float wave = (sin(iGlobalTime*0.7)*0.2)+(sin(iGlobalTime+uv.x*6.0)*0.2);
    uv_s.x*=(32.0/2048.0);
    uv_s*=3.0;
    uv_s.x+=iGlobalTime*0.04;
    uv_s.y+=wave;
    vec4 t;
    const float time = 120.0;
    float timer = clamp(time*0.5-mod(iGlobalTime*0.5, time*0.5), 0.0, 1.0);
    float cotimer = clamp(mod(iGlobalTime*0.5, time*0.5), 0.0, 1.0);
    if (mod(iGlobalTime, time*2.0) < time)
        t = texture2D(iChannel1, min(max(uv_s, 0.0-1.0), 1.0-1.0));
    else
        t = texture2D(iChannel2, min(max(uv_s, 0.0-1.0), 1.0-1.0));
    vec3 c = vec3(
                    sin(iGlobalTime+(uv.x*2.0))*0.5+0.5,
                    sin(iGlobalTime+(uv.x*2.0)+((2.0*PI)/3.0))*0.5+0.5,
                    sin(iGlobalTime+(uv.x*2.0)+(((2.0*PI)/3.0)*2.0))*0.5+0.5
                 );
    //if ((wave/3.0*iResolution.y)+gl_FragCoord.y > iResolution.y/3.0 && (wave/3.0*iResolution.y)+gl_FragCoord.y < (iResolution.y/3.0)*2.0)
        gl_FragColor.rgb = c.rgb*(t.a*timer*cotimer)+(gl_FragColor.rgb*(1.0-(t.a*timer*cotimer)));
}

void main() {
    gl_FragColor = vec4(tunnel(), 0.2);
    logo();
    scroll();
    //gl_FragColor.rgb *= mod(gl_FragCoord.y, 2.0);
}
