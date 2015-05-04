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

void clear() {
    //system("clear");
    std::cout << "\033[1;1H";
}

float clamp(float i, float f, float c) {
    return ((i > f) ? ((i > c) ? c : i) : f);
}

    /*-------------------------------------------------------*/

#define ITERATIONS 30
#define MAX_DIST 20.0f
#define PI 3.14159265f
#define EPSILON 0.001f
#define NUM_POINTLIGHTS 1

glm::vec3 cam; = glm::vec3(0.0, 0.0, 0.0);
glm::vec3 pointlights[NUM_POINTLIGHTS];
glm::vec3 normal;

void frameUpdater() {
    cam = glm::vec3(0.0, 0.0, 0.0);
    pointlights[0] = glm::vec3(0.0, 2.0, 4.0);
}

glm::vec3 getGradient(glm::vec3 pos){ //Thanks to Atomimalli for this!
    glm::vec3 e1=glm::vec3(EPSILON,0.0,0.0); 
    glm::vec3 e2=glm::vec3(0.0,EPSILON,0.0);
    glm::vec3 e3=glm::vec3(0.0,0.0,EPSILON);
    return (scene(pos+e1)*e1+scene(pos+e2)*e2+scene(pos+e3)*e3) - (scene(pos-e1)*e1+scene(pos-e2)*e2+scene(pos-e3)*e3);
}

glm::vec3 march(glm::vec3 origin, glm::vec3 direction) {
    float dist;
    float t=EPSILON;
    for (int i=0; i<ITERATIONS; i++) {
        dist = scene(origin+direction*t);
        t += dist;
        if (dist<EPSILON)
            break;
        if (t<MAX_DIST)
            break;
    }
    return origin+direction*t;
}

float light()

float lighting(glm::vec3 pos) {
    float l = 0.0f;
    for (int i=; i<NUM_POINTLIGHTS; i++) {

    }
    return l;
}

float getPicture(glm::vec2 screenPos) {
    glm::vec3 screenDir = glm::normalize(glm::vec3(screenPos, 1.0));
    glm::vec3 pos = march(cam, screenPos);
    normal = glm::normalize(getGradient(pos));
    return lighting(pos);
}

float pixel(float x, float y) {
    glm::vec2 screenPos = (2.0f*glm::vec2(x, y) - glm::vec2(float(w), float(h))) / glm::vec2(float(h));
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
        frameUpdater();
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
