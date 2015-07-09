#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iGlobalTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;

#define PI  3.14159265
#define PI2 6.28318530

vec2 uv = gl_FragCoord.xy/iResolution.xy;

vec3 bg() {
    vec3 col1 = vec3(0.4, 0.2, 0.0);
    float rt = sin(iGlobalTime)*0.6;
    vec2 uv_bg = vec2(uv.x, uv.y + (sin(uv.x*8.0+iGlobalTime)*0.1 * sin(uv.x*24.0-iGlobalTime*3.0)*0.8));
    uv_bg.y = uv_bg.x * sin(rt) + uv_bg.y * cos(rt);
    float a = clamp(((0.5-uv_bg.y)*4.0),0.0,1.0);

    float h = sin(iGlobalTime)*10.0+30.0;
    float ptrn = clamp(sin(uv_bg.x*h+sin(iGlobalTime*0.5)*20.0)*sin(uv_bg.y*h+cos(iGlobalTime*0.5)*20.0)*1000.0, 0.0, 1.0);

    return vec3(col1*a*ptrn);
}

vec3 cw() {
    vec2 uv_w = uv - vec2((iResolution.y/2.0/iResolution.y), 0.5);
    uv_w = vec2(atan(uv_w.y, uv_w.x)+(iGlobalTime*0.2), 1.0/sqrt(uv_w.x*uv_w.x + uv_w.y*uv_w.y));
    uv_w.x += abs(sin(uv_w.y));

    vec3 c = vec3(
                   sin(uv_w.x)*0.5+0.5,
                   sin(uv_w.x+(PI2/3.0))*0.5+0.5,
                   sin(uv_w.x+((PI2/3.0)*2.0))*0.5+0.5
               );

    vec4 a = texture2D(iChannel0, vec2(clamp(uv.x, 1.0-iGlobalTime/2.0, clamp(6.0-iGlobalTime, 0.0, 1.0)), uv.y));
    vec4 a2 = texture2D(iChannel1, vec2(clamp(uv.x, 4.0-iGlobalTime/2.0, clamp(19.0-iGlobalTime, 0.0, 1.0)), uv.y));

    return (c*(a.a+a2.a)+(gl_FragColor.rgb*(1.0-(a.a+a2.a))));
}

void main() {
    gl_FragColor = vec4(bg(), 0.1);
    gl_FragColor.rgb = cw();

    gl_FragColor.rgb *= clamp(iGlobalTime, 0.0, 1.0);
    gl_FragColor.rgb *= clamp(19.0-iGlobalTime, 0.0, 1.0);
}

