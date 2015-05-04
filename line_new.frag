precision highp float;

uniform vec2 iResolution;
uniform float iGlobalTime;

/*WIP?*/

void main() {
    float PI = 3.14159265;
    float hard = 10000000000.0;
    float hardOther = 1.0-(1.0/hard);

    vec2 pos = gl_FragCoord.xy/iResolution.yy;

    //set bg color to black
    gl_FragColor = vec4(vec3(0.0), 1.0);

    //Line width and point radius in openGL screen space 'units'
    float lineSize = (1.0/iResolution.y)*4.0; //0.005;
    float pointSize = 0.007;

    //points
    //Feel free to set these however you want
    vec2 point1 = vec2(sin(iGlobalTime*0.05)*0.5+0.5, cos(iGlobalTime*1.4)*0.5+0.5);
    vec2 point2 = vec2(sin(iGlobalTime*0.1+PI)*0.5+0.5, cos(iGlobalTime*1.7+PI)*0.5+0.5);

    //'k' for kulmakerroin :D
    float k = (point1.y - point2.y)/(point1.x - point2.x);
    float b = point1.y - k*point1.x;

    /* //DAMN this was hard to wrap my head around!
    point1.y = k*point1.x + b // -k*point1.x
    point1.y - k*point1.x = b
    */

    vec2 line = vec2((pos.y-b)/k, pos.x*k+b);
    float lineSizeHalf = lineSize/2.0;        

    //if current pixel is inside any of the points, set it's color to red
    gl_FragColor.r += clamp(((1.0-length(pos-point1))-0.99)*hard, 0.0, 1.0);
    gl_FragColor.r += clamp(((1.0-length(pos-point2))-0.99)*hard, 0.0, 1.0);

    //pos+=line;
    gl_FragColor.rgb += 1.0-clamp((1.0-pos.y+line.y-lineSizeHalf-hardOther)*
                                  (1.0-pos.y+line.y+lineSizeHalf-hardOther)*
                                  (1.0-pos.x+line.x-lineSizeHalf-hardOther)*
                                  (1.0-pos.x+line.x+lineSizeHalf-hardOther)*hard, 0.0, 1.0);

}
