//
// Created by doria on 12/06/2025.
//

#ifndef READ_BOOK_H
#define READ_BOOK_H

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

char* readBookFile(char* filename);

//Lit un seul chapitre en fonction d'un chapitre sous forme de texte
struct Chapter readOneChapter(char* chapterText);

//On retourne un tableau de tous les chapitres
struct Chapter* readAllChapters(char* allText, int chaptersCount);

#endif //READ_BOOK_H
