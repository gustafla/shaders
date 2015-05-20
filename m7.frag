precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

float fov = 1.2;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    float horizon = 0.5;
    
    vec2 sc_uv = gl_FragCoord.xy / iResolution.yy - vec2((iResolution.x/iResolution.y)*0.5, 0.5);
    
    vec2 uv = vec2(sc_uv.x/(sc_uv.y-horizon), (sc_uv.y-horizon-fov)/(sc_uv.y-horizon));
    
    uv.y+=iGlobalTime*0.2;
    //uv.x+=sin(pow(iGlobalTime, 1.0/iGlobalTime)*0.1)*0.2;
    /*
    float l  = clamp(((sin(uv.x*4.0) * sin(uv.y*4.0))*10000.0), 0.0, 1.0);///(t);
    float l2 = 1.0;///(t);
    
    gl_FragColor = vec4(
                           l2,
                           l2-l,
                           l2-l,
                           0.1
                       );/*
    if (sc_uv.y > horizon)
        gl_FragColor.rgb = vec3(0.0);*/
        
    float t = iGlobalTime * 0.4;
    float a = sin(t * 0.5);
    uv *= (0.4 + (sin(t)*0.2)); //zoom
    uv = vec2((uv.x * cos(a)) - (uv.y * sin(a)), (uv.x * sin(a)) + (uv.y * cos(a))); // pyöritys
    
    float l = 0.5 + (sin(uv.y*20.0)*0.5) +
                    (cos(uv.x*20.0)*0.5);
                    
    l = 0.5 + (sin(l * ((20.0 * sin(t/2.0)) + 24.0)) * 0.5);

    l += 0.5 + (cos(uv.y*1.1*(50.0+sin(t)*10.0))*0.5);    
    l += 0.5 + (cos(uv.x*0.9*(40.0+sin(t)*20.0))*0.5);    

    l *= 0.5;
    l += (0.1 * rand(uv+t));

    l *= 0.9 + (sin(uv.y*1.3*(2.0+(sin(iGlobalTime)*0.9)))*0.05) +
               (cos(uv.x*1.5*(3.0+(sin(iGlobalTime)*0.4)))*0.05);

    gl_FragColor = vec4((0.5+sin(t+(sin(uv.x*(sin(t)*3.8))*0.5)))*l,
                        (0.5+cos(t+(cos(uv.y*(cos(t/2.0)*4.4)*0.8))))*l,
                        ((0.5+sin(t/3.0)*0.5)*l + (0.08*rand(uv + t))),
                        0.1);
    gl_FragColor.rgb = clamp(gl_FragColor.rgb, 0.0, 1.0);    
    gl_FragColor.rgb -= (gl_FragCoord.y/iResolution.y);
    gl_FragColor.rgb += rand(uv+t)*0.2-0.1;
    gl_FragColor.rgb -= mod(gl_FragCoord.y, 2.0)-1.0;
}
