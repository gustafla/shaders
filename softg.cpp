#include <iostream>
#include <cmath>
#include <limits>
#include <cstdlib>
#include <cstdio>
#include <unistd.h>
#include <sys/time.h>
#include <glm/glm.hpp>

//using namespace glm; //vec etc

unsigned int w=20;
unsigned int h=20;
float iGlobalTime = 0.0f;

/*struct glm::vec2 {
    glm::vec2(float a) {
        y = x = a;
    }
    glm::vec2(float _x, float _y) {
        x = _x;
        y = _y;
    }
    glm::vec2& operator= (glm::vec2 a) {
        x = a.x;
        y = a.y;
        return *this;
    }
    glm::vec2& operator-= (glm::vec2 a) {
        x-=a.x;
        y-=a.y;
        return *this;
    }
    glm::vec2& operator+= (glm::vec2 a) {
        x+=a.x;
        y+=a.y;
        return *this;
    }
    glm::vec2& operator*= (glm::vec2 a) {
        x*=a.x;
        y*=a.y;
        return *this;
    }
    glm::vec2& operator/= (glm::vec2 a) { 
        x/=a.x;
        y/=a.y;
        return *this;
    }
    glm::vec2 operator- (glm::vec2 l, glm::vec2 r) {
        l-=r;
        return l;
    }
    glm::vec2 operator+ (glm::vec2 l, glm::vec2 r) {
        l+=r;
        return l;
    }
    glm::vec2 operator* (glm::vec2 l, glm::vec2 r) {
        l*=r;
        return l;
    }
    glm::vec2 operator/ (glm::vec2 l, glm::vec2 r) {
        l/=r;
        return l;
    }

    float x;
    float y;
};

struct glm::vec3 {
    glm::vec3(float a) {
        z = y = x = a;
    }
    glm::vec3(float _x, float _y, float _z) {
        x = _x;
        y = _y;
        z = _z;
    }
    glm::vec3(glm::vec2 xy, float _z) {
        x = xy.x;
        y = xy.y;
        z = _z;
    }
    glm::vec3(float _x, glm::vec2 yz) {
        x = _x;
        y = yz.x;
        z = yz.y;
    }
    glm::vec3& operator= (glm::vec3 a) {
        x = a.x;
        y = a.y;
        z = a.z;
        return *this;
    }
    glm::vec3& operator-= (glm::vec3 a) {
        x-=a.x;
        y-=a.y;
        z-=a.z;
        return *this;
    }
    glm::vec3& operator+= (glm::vec3 a) {
        x+=a.x;
        y+=a.y;
        z+=a.z;
        return *this;
    }
    glm::vec3& operator*= (glm::vec3 a) {
        x*=a.x;
        y*=a.y;
        z*=a.z;
        return *this;
    }
    glm::vec3& operator/= (glm::vec3 a) { 
        x/=a.x;
        y/=a.y;
        z/=a.z;
        return *this;
    }
    glm::vec3 operator- (glm::vec3 l, glm::vec3 r) {
        l-=r;
        return l;
    }
    glm::vec3 operator+ (glm::vec3 l, glm::vec3 r) {
        l+=r;
        return l;
    }
    glm::vec3 operator* (glm::vec3 l, glm::vec3 r) {
        l*=r;
        return l;
    }
    glm::vec3 operator/ (glm::vec3 l, glm::vec3 r) {
        l/=r;
        return l;
    }

    float x;
    float y;
    float z;
};

float glm::length(glm::vec3 a) {
    return sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
}

float glm::dot(glm::vec3 l, glm::vec3 r) {
    return (l.x*r.x + l.y*r.y + l.z*r.z);
}*/

void clear() {
    //system("clear");
    std::cout << "\033[1;1H";
}

float clamp(float i, float f, float c) {
    return ((i > f) ? ((i > c) ? c : i) : f);
}

int const ITERATIONS = 28;
float const EPSILON = 0.01;
float const B = 0.2;
float const PI = 3.14159265;

glm::mat3 rotationMatrix(glm::vec3 axis, float angle)
{
    axis = glm::normalize(axis);
    float s = glm::sin(angle);
    float c = glm::cos(angle);
    float oc = 1.0 - c;
    
    return glm::mat3(
                    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c
    );
}

float box(glm::vec3 p, glm::vec3 b) {
    glm::vec3 d = glm::abs(p) - b;
    return glm::min(glm::max(d.x,glm::max(d.y,d.z)),0.0f) + glm::length(glm::max(d,0.0f));
}

float ball(glm::vec3 marchPos, float r) {
    return glm::length(marchPos) -r;
}

float plane(glm::vec3 p)
{
    return p.y;
}

float thing(glm::vec3 marchPos, glm::vec3 pos, float r) {
    return glm::length(marchPos-pos) -sin(marchPos.x*6.0+iGlobalTime*3.0)*r -cos(marchPos.y*6.0+iGlobalTime*3.0)*r;
}

float scene(glm::vec3 marchPos) {
    return glm::min(
        plane(marchPos),
        ball(marchPos-glm::vec3(0.0, 1.0, 4.0), 1.0)
    );
}

glm::vec3 getGradient(glm::vec3 pos){ //Thanks to Atomimalli for this!
    glm::vec3 e1=glm::vec3(EPSILON,0.0,0.0); 
    glm::vec3 e2=glm::vec3(0.0,EPSILON,0.0);
    glm::vec3 e3=glm::vec3(0.0,0.0,EPSILON);
    return (scene(pos+e1)*e1+scene(pos+e2)*e2+scene(pos+e3)*e3) - (scene(pos-e1)*e1+scene(pos-e2)*e2+scene(pos-e3)*e3);
}

glm::vec3 march(glm::vec3 start, glm::vec3 dir, float b) {
    glm::vec3 marchPos = start;
    float len;
    for (int i=0; i<ITERATIONS; i++) {
        len = scene(marchPos);
        if (len<0.0)
            break;
        marchPos += len*dir*b;
    }
    return marchPos;
}

float getPicture(glm::vec2 screenPos) {
    glm::vec3 cam = glm::vec3(0.0, 1.0, -5.0);
    //glm::vec3 light1 = glm::vec3(sin(iGlobalTime)*4.0, 0.0, cos(iGlobalTime)*4.0);
    glm::vec3 light1 = glm::vec3(glm::sin(iGlobalTime*0.666)*3.0-2.0, 0.0, glm::cos(iGlobalTime*0.4)-5.0);
    glm::vec3 marchPos = march(cam, glm::normalize(glm::vec3(screenPos, 1.0)), 1.);
    glm::vec3 shadowPos = march(marchPos +glm::normalize(cam-marchPos)*EPSILON, glm::normalize(light1-marchPos), 1.);
    float isLit = 1.0;
    if (glm::length(shadowPos-light1) < glm::length(marchPos-light1))
        isLit=0.0;
    return (1.0/glm::length(marchPos-light1)) * glm::max(glm::dot(glm::normalize(getGradient(marchPos)), glm::normalize(light1-marchPos)), 0.0f) * isLit * 4.6;
}

float pixel(float x, float y) {
    glm::vec2 screenPos = glm::vec2(x, y) / glm::vec2(float(h)) - glm::vec2(0.5);
    return getPicture(screenPos);
}

    /*-------------- Actual drawing ends here ---------------*/

#include <cstring>

struct Args {
    Args():
    size(20),
    tMult(1) {
        
    }
    unsigned int size;
    float tMult;
};

void argErr() {
    std::cout << "Bad launch parameters.\n";
    exit(-1);
}

Args* parseArgs(int argc, char* argv[]) {
    Args* args = new Args;
    for (int i=1; i<argc; i++) {
        if (!strcmp(argv[i], "-s")) {
            i++; if (i==argc) argErr();
            args->size = atoi(argv[i]);
        } else if (!strcmp(argv[i], "-t")) {
            i++; if (i==argc) argErr();
            args->tMult = atof(argv[i]);
        } else {
            argErr();
        }
    }
    return args;
}

int main(int argc, char* argv[]) {
    Args* args = parseArgs(argc, argv);
    h = w = args->size;
    float tMult = args->tMult;
    delete args;

    unsigned short const PALETTE_S = 8;
    char palette[PALETTE_S] = {
        ' ',
        '.',
        '/',
        '!',
        '[',
        '{',
        '%',
        '#'
    };
    unsigned char pix = 0;
    float t=0.0;
    float lastft=0.0;
    float fps=0.0;
    unsigned int frames=0;
    struct timeval tTmp;
    struct timeval startT;
    gettimeofday(&tTmp, NULL);
    gettimeofday(&startT, NULL);
    unsigned int x=0, y=0;
    for(;;) {
        clear();

        gettimeofday(&tTmp, NULL);
        t = static_cast<float>(tTmp.tv_sec - startT.tv_sec + ((tTmp.tv_usec - startT.tv_usec)*1e-6));
        iGlobalTime = t*tMult;
        for(unsigned int y=0; y<h; y++) {
            for(unsigned int x=0; x<w; x++) {
                pix = static_cast<int>(clamp(pixel(x, y), 0.0, 1.0)*(PALETTE_S-0.9));
                std::cout << palette[pix] << palette[pix];
            }
            std::cout << std::endl;
        }
        frames++;
        if (t > lastft+4.0) {
            lastft=t;
            fps = frames/4.0;
            frames=0;
        }
        std::cout << (int)fps << " " << "FPS" << "                ";
    }
}
