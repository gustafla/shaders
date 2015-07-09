#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

#define PI 3.14159265

/*void main()
{
    vec2 uv = gl_FragCoord.xy / iResolution.yy - vec2((iResolution.x/iResolution.y)*0.5, 0.5);
    
    float t = 1.0/sqrt(uv.x*uv.x + uv.y*uv.y);
    float u = atan(uv.y, uv.x);//+(iGlobalTime*0.2);
    float v = t+(iGlobalTime*iGlobalTime*0.5);
    
    vec3 col1 = vec3(1.0, 1.0, 1.0);
    vec3 col2 = vec3(1.0, 0.1, 0.1);
    float l = clamp(((sin(u*8.0) * sin(v*8.0))*1000.0), 0.0, 1.0);

    gl_FragColor = vec4((col2*l+(col1*(1.0-l))), 0.33);
}*/

vec3 amiga(vec2 uv) { //"Amiga" tekstuuri
    vec3 col1 = vec3(1.0, 1.0, 1.0);
    vec3 col2 = vec3(1.0, 0.0, 0.0);
    float a = clamp(((sin(uv.x*8.0) * sin(uv.y*8.0))*10000.0), 0.0, 1.0);
    return (col2*a+(col1*(1.0-a)));
}

void main()
{
    vec2 pos = gl_FragCoord.xy / iResolution.xy - vec2(0.5);
    
    vec2 uv;
    uv.x = atan(pos.x, pos.y);
    uv.y = 1.0/length(pos);

    gl_FragColor = vec4(amiga(uv+iGlobalTime), 1.0);
}
