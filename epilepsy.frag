precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

#define BPM       720
#define TIME_IVAL (60.0 / float(BPM))

void main()
{
    float r, g, b;
    float rt, gt, bt;
    
    rt = mod(iGlobalTime + TIME_IVAL * 0.0, (3.0*TIME_IVAL));
    gt = mod(iGlobalTime + TIME_IVAL * 1.0, (3.0*TIME_IVAL));
    bt = mod(iGlobalTime + TIME_IVAL * 2.0, (3.0*TIME_IVAL));
    
    if (rt < TIME_IVAL)
        r = 1.0;
    else
        r = 0.0;
        
    if (gt < TIME_IVAL)
        g = 1.0;
    else
        g = 0.0;
        
    if (bt < TIME_IVAL)
        b = 1.0;
    else
        b = 0.0;
        
    gl_FragColor = vec4(r, g, b, 0.2);
}
