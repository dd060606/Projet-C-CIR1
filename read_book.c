//
// Created by doria on 12/06/2025.
//
#include <stdio.h>
#include "read_book.h"
#include <stdlib.h>
#define LINE_SIZE 512

char* readBookFile(char* filename) {
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename);
        exit(EXIT_FAILURE);
    }

    char line[LINE_SIZE];
    struct Chapter chapter;
    while(fgets(line, sizeof(line), file)) {
        //si double saut de ligne
        //     créer une nouvelle struct chapter
        //
    }
}

struct Chapter readOneChapter(char* chapterText) {

}