//
// Created by doria on 12/06/2025.
//

#ifndef READ_BOOK_H
#define READ_BOOK_H

#include <stdbool.h>
#include <string.h>

#include "chapter.h"

//On retourne un tableau de tous les chapitres
struct ChapterArray readBookFile(char* filename);

//Fonction pour comprendre une ligne du fichier book.txt et d'ajouter le champ correspondant
//à la structure Chapter
void convertChapLine(struct Chapter* chapter, char* chapterLine);

//Renvoie true si la ligne commence par une chaîne de caractères donnée
bool startsWith(const char* line, const char* str);

#endif //READ_BOOK_H
