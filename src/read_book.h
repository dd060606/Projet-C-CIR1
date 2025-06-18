//
// Created by doria on 12/06/2025.
//

#ifndef READ_BOOK_H
#define READ_BOOK_H

#include "chapter.h"

//On retourne un tableau de tous les chapitres
struct ChapterArray readBookFile(char* filename);

//Fonction pour comprendre une ligne du fichier book.txt et d'ajouter le champ correspondant
//à la structure Chapter
void convertChapLine(struct Chapter* chapter, char* chapterLine);


#endif //READ_BOOK_H
