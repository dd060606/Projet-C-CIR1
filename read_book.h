//
// Created by doria on 12/06/2025.
//

#ifndef READ_BOOK_H
#define READ_BOOK_H

#include <stdbool.h>
#include <string.h>

#include "chapter_array.h"

struct Chapter {
    int id;         //identifiant du chapitre
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

//Fonction pour comprendre une ligne du fichier book.txt et d'ajouter le champ correspondant
//à la structure Chapter
void convertChapLine(struct Chapter* chapter, char* chapterLine);

//Renvoie true si la ligne commence par une chaîne de caractères donnée
bool startsWith(const char* line, const char* str) {
    return strncmp(line, str, strlen(str)) == 0;
}

#endif //READ_BOOK_H
