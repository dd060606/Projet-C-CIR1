//
// Created by doria on 12/06/2025.
//

#ifndef CHAPTER_ARRAY_H
#define CHAPTER_ARRAY_H

#define LINE_SIZE 512

struct Chapter {
    int id; //identifiant du chapitre
    char *title; //variable du titre du chapitre
    char **content; //tableau de texte
    int contentLen; //nombre de paragraphes
    struct Choice *choices; //tableau pour les choix
    int choiceLen; //nombre de choix disponibles
};

struct Choice {
    int chapNumber; //numéro du chapitre
    char *choicename; //texte du choix
};

struct ChapterArray {
    struct Chapter *chapters;
    int capacity;
    int size;
};

//On initialise le tableau de chapitres
struct ChapterArray chap_array_init();

//On ajoute un chapitre au tableau dynamique
void chapter_add(struct ChapterArray *chapArray, struct Chapter chapter);

//On initialise un chapitre
struct Chapter initChapter();

struct Chapter deep_copy_chapter(struct Chapter *src);

#endif //CHAPTER_ARRAY_H
