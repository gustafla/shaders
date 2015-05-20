precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

vec2 uv = gl_FragCoord.xy/iResolution.yy;

float sade(float m, float p, float o, vec2 pan) {
    vec2 uvS = uv - vec2(0.5) + pan;
    uvS.x -= (iResolution.x-iResolution.y)/iResolution.y;
    uvS = vec2(atan(uvS.y, uvS.x), 1.0/sqrt(uvS.x * uvS.x + uvS.y * uvS.y));
    return (clamp(((sin(uvS.x*m+o)-p)*40.0)/(uvS.y*uvS.y), 0.0, 1.0));
}

void main() {
    float t  = iGlobalTime*20.0;
    float tm = iGlobalTime*0.2;
    const float i = 0.3;
    const float n = 16.0;
    const float w = 0.4;
    gl_FragColor = vec4(vec3(sade(n, w, sin(t*0.003)*300.0    , vec2(cos(iGlobalTime)*2.0*sin(iGlobalTime)*i, sin(iGlobalTime)*sin(iGlobalTime)*i))+
                             sade(n, w, t*0.5, vec2(sin(iGlobalTime)*i*3.0, cos(iGlobalTime)*1.4*sin(iGlobalTime)*i))
                            ), 0.1
                       );
}
