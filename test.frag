#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

void main()
{
    vec2 pos = gl_FragCoord.xy / iResolution;
    
    float l = 0.5 + (sin(pos.y*20.0)*0.5) +
                    (cos(pos.x*20.0)*0.5);
                    
    l = 0.5 + (sin(l * ((20.0 * sin(iGlobalTime/2.0)) + 24.0)) * 0.5);
    
    gl_FragColor = vec4((0.5+sin(iGlobalTime)*0.5)*l,
                        (0.5+cos(iGlobalTime)*0.5)*l,
                        (0.5+sin(iGlobalTime/3.0)*0.5)*l,
                        0.1);
    gl_FragColor *= mod(gl_FragCoord.y, 2.0);
}
