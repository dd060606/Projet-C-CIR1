//
// Created by doria on 12/06/2025.
//

#ifndef READ_BOOK_H
#define READ_BOOK_H

struct Chapter {
    char* title;
    char** content;
    int contentLen;
    struct Choice* choices;
    int choiceLen;
};

struct Choice {
    int chapNumber;
    char* text;
};

char* readBookFile(char* filename);

//Lit un seul chapitre en fonction d'un chapitre sous forme de texte
struct Chapter readOneChapter(char* chapterText);

//On retourne un tableau de tous les chapitres
struct Chapter* readAllChapters(char* allText, int chaptersCount);

#endif //READ_BOOK_H
