precision highp float;

uniform vec2 iResolution;
uniform float iGlobalTime;

/*float rand(vec2 c) {
    return fract(cos(dot(c.x*0.245345, c.y*11.02457874)));
}*/

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 pos = gl_FragCoord.xy/iResolution.xy;
    gl_FragColor = vec4(rand(pos+iGlobalTime*0.1), rand(pos+iGlobalTime*0.2), rand(pos+iGlobalTime*0.3), 1.0);
}
