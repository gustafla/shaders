precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float ball(vec3 position, vec3 coord, float r)
{
    return length(position - coord) - r + rand(position.xy)*0.4;
}

float scene(vec3 position)
{
    return min
    (
        ball(position, vec3((sin(iGlobalTime*0.4)*1.0), (cos(iGlobalTime*0.4)*1.0), (4.0 + (sin(iGlobalTime)*3.7))), 0.3),
        ball(position, vec3((sin(iGlobalTime*0.8)*1.2), (cos(iGlobalTime*0.8)*1.2), (4.0+(sin(iGlobalTime*1.8)*3.8))), 0.4)
    );
}

float march(vec3 ray, vec3 cam)
{
    vec3 position = cam;
    for(int i=0; i<16; i++)
    {
        float dist = scene(position);
        position += dist * ray;
    }
    return length(position - cam);
}

float raymarcher()
{
    vec2 pos = (gl_FragCoord.xy / iResolution.yy) - vec2((iResolution.x/iResolution.y) * 0.5, 0.5);
    
    vec3 cam = vec3(0.0, 0.0, -2.0);
    vec3 ray = normalize(vec3(pos, 1.0));
    float l = (1.0 / sqrt(march(ray, cam)));
    return l;
}

void main()
{
    float l = raymarcher();
    gl_FragColor = vec4(vec3(l), 0.25);
}
