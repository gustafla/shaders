#ifdef GL_ES
precision highp float;
#endif

//värijutska.vs

precision lowp float;
uniform float iGlobalTime;
uniform vec2 iResolution;

void main()
{
    float t = iGlobalTime;
    vec2 coords = gl_FragCoord.xy / iResolution.xy;
    coords.y = 1.0 - coords.y;
    vec2 uv = coords;
    uv.x *= iResolution.x / iResolution.y;
    vec2 pos = (gl_FragCoord.xy / iResolution.xy) * (sin(t) * 2.0 + 2.1);
    float a = t * 0.2;
    pos = pos + vec2(sin(pos.x * 4.0), sin(pos.y * 3.0)) * 0.5;
    pos = vec2(pos.x * cos(a) - pos.y * sin(a), pos.x * sin(a) + pos.y * cos(a)); // pyöritys
    pos = pos + vec2(sin(pos.x * 4.0), sin(pos.y * 3.0)) * sin(pos.y * 0.01 + t) * 0.1; //aaldojuddu :DD
    float color_r = sin(pos.y * 20.0 + t * 10.0) + sin(pos.x * 10.0 + t * 10.0);
    float color_g = sin(t * 0.5 * 20.0 + pos.x * 6.0) + sin(pos.y * 3.0);
    float color_b = sin((pos.x + pos.y) * 50.0);
    float summa = color_r + color_g + color_b;
    summa = summa / 3.0;
    vec4 vari = vec4(color_r * 0.0 + summa, color_g + summa, color_b + summa, 0.2);
    vari = vari * sin(pos.y * 0.01 + t);
    vari.rgb = vec3(min(max(vari.r, 0.0), 1.0), min(max(vari.g, 0.0), 1.0), min(max(vari.b, 0.0), 1.0));
    if(vari.r < 0.1)
    vari /= 1.0 + mod(gl_FragCoord.y, 2.0);
    gl_FragColor = vari;
}
