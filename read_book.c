//
// Created by doria on 12/06/2025.
//
#include <stdio.h>
#include "read_book.h"
#include <stdlib.h>
#include <string.h>
#define LINE_SIZE 512

char* readBookFile(char* filename) {
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename);
        exit(EXIT_FAILURE);
    }
    struct Chapter chapter;
    int saut_de_ligne=0;
    char line[LINE_SIZE];
    while(fgets(line, sizeof(line), file)) {
        if (strcmp(line,"\n") == 0) {
            saut_de_ligne++;
        }
        else {
            saut_de_ligne=0;    //on retemet saut de ligne a 0 car sinon il comptera juste tous les sauts de ligne du texte
        }
        if (saut_de_ligne==2) {
            Chapter_add()
        }


    }
}

void convertChapLine(struct Chapter* chapter, char* chapterLine) {

}