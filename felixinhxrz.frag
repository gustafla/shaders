#ifdef GL_ES
precision mediump float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

vec3 amiga(vec2 uv) {
    vec3 col1 = vec3(sin(iGlobalTime / 0.1), sin(iGlobalTime / 0.2), 1.0);
    vec3 col2 = vec3(sin(iGlobalTime / 0.3), sin(iGlobalTime / 0.4), 1.0);

    float a = clamp(sin(iGlobalTime * 2.0) * ((sin(uv.y  * 5.0
    	 + sin(iGlobalTime * 2.0) * 4.0) *
    	cos(uv.x * 8.0))*1000.0), 0.0, 1.0);
    return ( col2*a+(col1*(1.0-a)));
}



void main() {
    float pi = ( 3.1415 );
 	vec2 pos = ( gl_FragCoord.xy / iResolution.xy - vec2(0.5) + sin(-iGlobalTime * 4.0 ) / 2.3 * sin(iGlobalTime * 2.0) / 2.3);

    float color_r = sin(pos.y * sin(iGlobalTime)) *
   	cos(pos.x * sin(iGlobalTime));

    vec2 uv;
    uv.x = atan(pos.x, pos.y);
    uv.y = 1.0/length(pos) + sin(iGlobalTime * 2.0) / 2.0 * cos(iGlobalTime);
    float u = (pos.y * 257.5 / pi );
    float v = (pos.x * 257.5 / pi );
    float color = ( u * u / 100.0 * sin(iGlobalTime) + v * v / 99.9 * cos(iGlobalTime + 40.0));
    gl_FragColor = vec4(amiga(uv + iGlobalTime * 2.2 + color_r * 2.0) * color , 1.0);
}