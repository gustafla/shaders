precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

float PI = 3.14159265;

float width = 0.5;
float lineHard = 100000000000000.0;

void main() {			
    vec2 pos = gl_FragCoord.xy/iResolution.xy - vec2(0.5);
    
    vec4 col = vec4(vec3(0.0), 1.0);
    
    float a = sin(sin(pos.y*1.2+iGlobalTime)*2.0*pos.y*sin(iGlobalTime*0.4)+iGlobalTime*0.8)*4.0;
    //float a = iGlobalTime*0.1;
    //width *= (sin(pos.y*3.0+iGlobalTime)*0.4+0.6)*(sin(pos.y*6.0-iGlobalTime*2.0)*0.4+0.6);
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

    float texy = pos.y/(iResolution.x/iResolution.y) - iGlobalTime*0.4;
    vec3 s1col = texture2D(iChannel0, vec2(((pos.x-((twister.x+twister.y)/2.0))/(twister.x-twister.y))+0.5, texy)).rgb;
    vec3 s2col = texture2D(iChannel1, vec2(((pos.x-((twister.y+twister.z)/2.0))/(twister.y-twister.z))+0.5, texy)).rgb;
    vec3 s3col = texture2D(iChannel0, vec2(((pos.x-((twister.z+twister.w)/2.0))/(twister.z-twister.w))+0.5, texy)).rgb;
    vec3 s4col = texture2D(iChannel1, vec2(((pos.x-((twister.w+twister.x)/2.0))/(twister.w-twister.x))+0.5, texy)).rgb;

    col.rgb += s1col * alpha.x * shade.x;
    col.rgb += s2col * alpha.y * shade.y;
    col.rgb += s3col * alpha.z * shade.z;
    col.rgb += s4col * alpha.w * shade.w;

    col.a = (alpha.x+alpha.y+alpha.z+alpha.w);
    //col.a = ((shade.x*alpha.x)+(shade.y*alpha.y)+(shade.z*alpha.z)+(shade.w*alpha.w));
    
    gl_FragColor = col;
    //gl_FragColor.a = 1.0;
}
