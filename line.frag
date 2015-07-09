#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iGlobalTime;

void main() {
    float PI = 3.14159265;

    vec2 pos = gl_FragCoord.xy/iResolution.yy;

    //set bg color to black
    gl_FragColor = vec4(vec3(0.0), 1.0);

    //Line width and point radius in openGL screen space 'units'
    float lineSize = 1.0/iResolution.y; //0.005;
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

    //if current pixel is inside the line, set it's color to white
    if ((pos.y > line.y-lineSizeHalf && pos.y < line.y+lineSizeHalf) || (pos.x > line.x-lineSizeHalf && pos.x < line.x+lineSizeHalf))
        gl_FragColor = vec4(1.0);

    //if current pixel is inside any of the points, set it's color to red
    if (length(pos-point1) < pointSize || length(pos-point2) < pointSize)
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
