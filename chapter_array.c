//
// Created by doria on 12/06/2025.
//

#include "chapter_array.h"

#include <stdlib.h>

//On initialise notre tableau de chapitres
struct ChapterArray chap_array_init() {
    //On alloue un tableau de chapitres
    struct Chapter *chapters = malloc(2 * sizeof(struct Chapter));
    if (chapters == NULL) {
        exit(1);
    }
    struct ChapterArray chapArray = {.size = 0, .capacity = 10, .chapters = chapters};
    return chapArray;
}

//On ajoute un chapitre
void chapter_add(struct ChapterArray *chapArray, struct Chapter chapter){
    if (chapArray->size == chapArray->capacity) {
        //Le tableau est remplit on l'agrandit
        chapArray->capacity *= 2;
        struct Chapter *newChapters = malloc(chapArray->capacity * sizeof(struct Chapter));
        if (newChapters == NULL) {
            exit(1);
        }

        //On copie les valeurs
        for (int i = 0; i < chapArray->size; i++) {
            newChapters[i] = chapArray->chapters[i];
        }
        free(chapArray->chapters);
        chapArray->chapters = newChapters;
    }
    //On ajoute le chapitre
    chapArray->chapters[chapArray->size] = chapter;
    chapArray->size++;
}