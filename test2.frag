precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    float t = iGlobalTime * 2.4;
    vec2 pos = gl_FragCoord.xy / iResolution;
    float a = sin(t * 1.2);
    pos = vec2(pos.x * cos(a) - pos.y * sin(a), pos.x * sin(a) + pos.y * cos(a)); // pyöritys
    pos *= (1.5 + (sin(t)*0.5)); //zoom
    pos = pos + vec2(sin(pos.x * 2.0), sin(pos.y * 2.0)) * sin(pos.y * 0.1 + t) * 0.4; //aaldojuddu :DD
    pos += vec2((1.0 + (sin(t/20.0)*1.0)), (1.0 + (cos(t/5.0)*1.0))); //sirto
    
    float l = 0.5 + (sin(pos.y*20.0)*0.5) +
                    (cos(pos.x*20.0)*0.5);
                    
    l = 0.5 + (sin(l * ((20.0 * sin(t/2.0)) + 24.0)) * 0.5);

    l += 0.5 + (cos(pos.y*3.5*(80.0+sin(t)*10.0))*0.5);    
    l += 0.5 + (cos(pos.x*3.0*(60.0+sin(t)*20.0))*0.5);    

    l *= 0.4;
    l += (0.1 * rand(pos+t));

    gl_FragColor = vec4(( 0.5 + sin( t + (sin( pos.x * (sin( t ) * 3.8) ) )) * 0.5 )*l,
                        (0.5+cos(t+(cos(pos.y*(cos(t/2.0)*4.4)*0.8))))*l,
                        ((0.5+sin(t/3.0)*0.5)*l + (0.08*rand(pos + t))),
                        0.08);
    gl_FragColor *= mod(gl_FragCoord.y, 2.0);
}
