precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

void main()
{
    vec2 uv = gl_FragCoord.xy / iResolution.yy - vec2((iResolution.x/iResolution.y)*0.5, 0.5);
    /*
    float t = 1.0/sqrt(uv.x*uv.x + uv.y*uv.y);
    float u = atan(uv.y, uv.x)+(iGlobalTime*0.2);
    float v = t+(iGlobalTime*1.6);
    */
    //float z=(uv.y/2.0);
    uv.x += sin(iGlobalTime*0.1); uv.y += cos(iGlobalTime*0.1);
    uv *= 6.0+(sin(iGlobalTime*0.4)*4.0);
    //uv/=z;
   
    uv.x *= sin(uv.y*sin(iGlobalTime*0.5));
    uv.y *= sin(uv.x*cos(iGlobalTime*0.4));

    float l  = clamp(((sin(uv.x*4.0) * sin(uv.y*4.0))*100000.0), 0.0, 0.6);///(t);
    float l2 = 0.8;///(t);
    
    gl_FragColor = vec4(
                           l2,
                           l2-l,
                           l2-l,
                           0.1
                       );
/*
    if (((gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)/3.0) > 0.8)
        gl_FragColor.rgb+=0.1;
    else
        gl_FragColor.rgb-=0.1;
*/
}
