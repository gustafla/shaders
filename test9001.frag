#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

#define ITERATIONS 12
#define PI 3.14159265

float time = iGlobalTime*0.1;
float a = 1.0;
float epsilon=0.001; 
float b = 0.8;

float ball(vec3 rayPos, vec3 pos, float r) {
	return length(rayPos - pos) - r - sin(rayPos.x*6.0+time*2.0)*0.5 - sin(rayPos.y*8.0+time*4.0)*0.6;
	//return length(rayPos - pos) - r;
}

float scene(vec3 rayPos) {
	return// min(
	//	ball(rayPos, vec3(sin(time)*2.0*a, cos(time)*a, 3.0), 1.0),
		ball(rayPos, vec3(sin(time+PI)*2.0*a, cos(time+PI)*a, 3.0), 1.0)
	/*)*/;
}

vec3 getGradient(vec3 pos){ //Thanks to Atomimalli for this!
    vec3 e1=vec3(epsilon,0.0,0.0); 
    vec3 e2=vec3(0.0,epsilon,0.0);
    vec3 e3=vec3(0.0,0.0,epsilon);
    return (scene(pos+e1)*e1+scene(pos+e2)*e2+scene(pos+e3)*e3) - (scene(pos-e1)*e1+scene(pos-e2)*e2+scene(pos-e3)*e3);
}

float march(vec2 screenPos) { //Returns a "light" intensity value
	vec3 rayDir = normalize(vec3(screenPos, 1.0)); //Pixel direction
	//Positive Z forward. Also rays go in a "round" way from screen to get perspective (see pos xy)
	vec3 camPos = vec3(0.0, 0.0, -4.0); //Camera pos
	vec3 rayPos = camPos; //March pos
	float dist;
	for (int i=0; i<ITERATIONS; i++) {
		dist = scene(rayPos); //Distance from surface
		rayPos += dist*rayDir*b; //Move in ray direction the distance we're from the scene's surface
	}
    
    vec3 light1 = vec3(0.0, 0.0, 1.0);
    vec3 lightDir = normalize(rayPos-light1);
    vec3 shadowRayDir = normalize(light1-rayPos); //March towards light
    vec3 shadowRayPos = rayPos + epsilon*shadowRayDir; //Start from surface
    float shadowDist;
    for (int i=0; i<ITERATIONS; i++) {
		shadowDist = scene(shadowRayPos); //Distance from surface
		shadowRayPos += shadowDist*shadowRayDir*b; //Move in ray direction the distance we're from the scene
	}
    float isLit = 1.0;
    if (length(rayPos-shadowRayPos) < length(rayPos-light1)) //If distance from start to shadow test march is smaller than from start to light
        isLit = 0.2;
	//return (1.0/sqrt(length(rayPos-light1))) isLit * max(dot(getGradient(rayPos), lightDir), 0.0);
	return (1.0/length(rayPos-light1)) * isLit;
}

void main() {
	vec2 screenPos = gl_FragCoord.xy/iResolution.yy - vec2(0.5);
	float intensity = march(screenPos);
	gl_FragColor = vec4(vec3(intensity), intensity);
}

