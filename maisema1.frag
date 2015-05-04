precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;

void main()
{
    float horizon = 0.0;
    float fov = 1.0;

    float pixY = (gl_FragCoord.y/iResolution.y);
    vec2 sc_uv = gl_FragCoord.xy / iResolution.yy - vec2((iResolution.x/iResolution.y)*0.5, 0.5);

    vec2 uv = vec2(sc_uv.x/(sc_uv.y-horizon), (sc_uv.y-horizon-fov)/(sc_uv.y-horizon));
    //uv = vec2(uv.x * sin(iGlobalTime*0.1) - uv.y * cos(iGlobalTime*0.1), uv.x * cos(iGlobalTime*0.1) + uv.y * sin(iGlobalTime*0.1));

    uv.x -= sin(iGlobalTime*0.04)*20.7;
    uv.y += iGlobalTime*1.1;
    uv *= 0.08;
    uv.y = abs(uv.y);

    gl_FragColor = texture2D(iChannel0, uv);

    vec2 uv2 = gl_FragCoord.xy/iResolution.yy;
    uv2 *= 4.0;
    uv2.x += iGlobalTime*(0.5);

    if (pixY>horizon+0.5)
    {
        gl_FragColor.rgb = vec3(0.52, 0.8, 1.0);
        gl_FragColor.r += clamp((1.0-((pixY-horizon)*1.6))*2.0, 0.0, 1.0);
        //gl_FragColor.g -= clamp((1.0-((pixY-horizon)*1.4))*0.1, 0.0, 1.0);
        gl_FragColor.b -= clamp((1.0-((pixY-horizon)*1.6))*2.0, 0.0, 1.0);
        gl_FragColor.rgb -= (pixY-horizon)*0.2;
        vec4 col = texture2D(iChannel1, uv);
        //gl_FragColor.rgb += col.rgb*(col.a*(pixY-horizon));
        gl_FragColor.rgb += (col.rgb*col.a)/2.0;
    }
    vec2 uv_t = (gl_FragCoord.xy / iResolution.xy);
    vec4 col_t = texture2D(iChannel2, uv_t);
    if (uv_t.x > 0.0 && uv_t.x < 1.0)
        gl_FragColor.rgb += col_t.rgb*col_t.a;

    gl_FragColor.a = 0.1;
    //gl_FragColor.rgb /= mod(gl_FragCoord.y, 2.0);
}
