#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iGlobalTime;

vec3 amiga(vec2 uv) { //"Amiga" tekstuuri
    vec3 col = vec3(0.0, 0.1, 1.0);
    float l = clamp((sin(uv.x)-0.98)*100000.0, 0.0, 1.0)+clamp((sin(uv.y)-0.98)*100000.0, 0.0, 1.0);
    return col*l;
}

mat2 getRotMat(float a) {
    return mat2(sin(a), -cos(a),
                cos(a), sin(a)
    );
}

void main() {
    vec2 pos = (2.0*gl_FragCoord.xy - iResolution)/iResolution.y;
    vec2 spos = pos;
    pos.y = abs(pos.y);

    pos.x /= pos.y;
    pos.y = pos.y-1.0/pos.y;
    pos *= 10.0;
    pos = getRotMat(iGlobalTime*0.4) * pos;
    pos.x += iGlobalTime*8.4;
    gl_FragColor = vec4((amiga(pos)-(1.2-abs(spos.y)))*3.0, 1.0);
}
