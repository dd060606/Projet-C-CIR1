//
// Created by doria on 12/06/2025.
//

#ifndef READ_BOOK_H
#define READ_BOOK_H

#include "chapter_array.h"

struct Chapter {
    char* title;        //variable du titre du chapitre
    char** content;     //tableau de texte
    int contentLen;     //nombre de paragraphes
    struct Choice* choices;     //tableau pour les choix
    int choiceLen;              //nombre de choix disponibles
};

struct Choice {
    int chapNumber;     //numéro du chapitre
    char* choicename;         //texte du choix
};

//On retourne un tableau de tous les chapitres
struct ChapterArray readBookFile(char* filename, int* chaptersCount);

//
void convertChapLine(struct Chapter* chapter, char* chapterLine);

#endif //READ_BOOK_H
