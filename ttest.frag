precision highp float;

vec3 blend(vec4 i) {
    return i.rgb*i.a+(gl_FragColor.rgb*(1.0-i.a));
}

void main() {
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    uv *= iGlobalTime*iGlobalTime;
    gl_FragColor.rgb = blend(texture2D(iChannel0, uv));
    gl_FragColor.rgb = blend(texture2D(iChannel1, uv));
    gl_FragColor.rgb = blend(texture2D(iChannel2, uv));
    gl_FragColor.rgb = blend(texture2D(iChannel3, uv));
}
