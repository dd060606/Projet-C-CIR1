//
// Created by doria on 12/06/2025.
//

#ifndef CHAPTER_ARRAY_H
#define CHAPTER_ARRAY_H

#include "read_book.h"

struct ChapterArray {
    struct Chapter* chapters;
    int capacity;
    int size;
};

//On initialise le tableau de chapitres
struct ChapterArray chap_array_init();

//On ajoute un chapitre au tableau dynamique
void chapter_add(struct ChapterArray *chapArray, struct Chapter chapter);

#endif //CHAPTER_ARRAY_H
