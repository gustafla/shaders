precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;

float PI = 3.14159265;

float width = 0.5;
float lineHard = 100000000.0;

vec3 tex(vec2 coord, vec3 col1, vec3 col2) {
    float l = sin(coord.x*10.0)*sin(coord.y*10.0);
    l = sin(l+iGlobalTime*3.0);
    return col1*l+col2*(1.0-l);
}

void main() {			
    vec2 pos = gl_FragCoord.xy/iResolution.xy - vec2(0.5);
    
    vec4 col = vec4(vec3(0.0), 1.0);
    
    float a = sin(sin(pos.y*1.2+iGlobalTime)*2.0*pos.y*sin(iGlobalTime*0.4)+iGlobalTime*0.8)*4.0;
    //float a = iGlobalTime;
    vec4 twister = vec4(sin(a), sin(a+0.5*PI), sin(a+PI), sin(a+1.5*PI))*width;
    
    vec4 alpha=vec4( //If here in x is filled or not, multiply color with this
        (1.0-clamp(((pos.x-twister.x)*(pos.x-twister.y))*lineHard, 0.0, 1.0)),
        (1.0-clamp(((pos.x-twister.y)*(pos.x-twister.z))*lineHard, 0.0, 1.0)),
        (1.0-clamp(((pos.x-twister.z)*(pos.x-twister.w))*lineHard, 0.0, 1.0)),
        (1.0-clamp(((pos.x-twister.w)*(pos.x-twister.x))*lineHard, 0.0, 1.0))
    );
    
    alpha *= vec4( //Test if line is showing
    	1.0-clamp((twister.x-twister.y)*lineHard, 0.0, 1.0),
    	1.0-clamp((twister.y-twister.z)*lineHard, 0.0, 1.0),
    	1.0-clamp((twister.z-twister.w)*lineHard, 0.0, 1.0),
    	1.0-clamp((twister.w-twister.x)*lineHard, 0.0, 1.0)
    );

    vec4 shade=vec4(
    	twister.y-twister.x,
    	twister.z-twister.y,
    	twister.w-twister.z,
    	twister.x-twister.w
    );
    
    shade /= width*1.8;

    vec3 s1col = tex(vec2(((pos.x-((twister.x+twister.y)/2.0))/(twister.x-twister.y)), pos.y/width*2.0), vec3(1.0,0.0,0.0), vec3(1.0,1.0,0.0));
    vec3 s2col = tex(vec2(((pos.x-((twister.y+twister.z)/2.0))/(twister.y-twister.z)), pos.y/width*2.0), vec3(1.0,0.0,0.0), vec3(1.0,1.0,1.0));
    vec3 s3col = tex(vec2(((pos.x-((twister.z+twister.w)/2.0))/(twister.z-twister.w)), pos.y/width*2.0), vec3(0.0,1.0,0.0), vec3(0.0,0.0,1.0));
    vec3 s4col = tex(vec2(((pos.x-((twister.w+twister.x)/2.0))/(twister.w-twister.x)), pos.y/width*2.0), vec3(0.0,1.0,1.0), vec3(0.0,0.0,0.0));

    col.rgb += s1col * alpha.x * shade.x;
    col.rgb += s2col * alpha.y * shade.y;
    col.rgb += s3col * alpha.z * shade.z;
    col.rgb += s4col * alpha.w * shade.w;

    col.a = dot(alpha, alpha)*0.4;
    
    gl_FragColor = col;
}
