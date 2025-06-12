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

#endif //READ_BOOK_H
