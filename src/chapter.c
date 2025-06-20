//
// Created by doria on 12/06/2025.
//

#include "chapter.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//On initialise un chapitre vide
struct Chapter initChapter() {
    struct Chapter chapter = {.choiceLen = 0, .contentLen = 0};
    //On initialise des tableaux vides de 5 pour les choix et le contenu
    chapter.choices = malloc(5 * sizeof(struct Choice));
    if (chapter.choices == NULL) {
        exit(1);
    }
    //On alloue de la mémoire pour chaque choix
    for (int i = 0; i < 5; ++i) {
        chapter.choices[i].choicename = malloc(LINE_SIZE * sizeof(char));
        if (chapter.choices[i].choicename == NULL) {
            exit(1);
        }
        chapter.choices[i].choicename[0] = '\0';
        chapter.choices[i].chapNumber = 0;
    }

    chapter.content = malloc(5 * sizeof(char *));
    if (chapter.content == NULL) {
        exit(1);
    }
    //On alloue de la mémoire pour chaque paragraphe du contenu
    for (int i = 0; i < 5; ++i) {
        chapter.content[i] = malloc(LINE_SIZE * sizeof(char));
        if (chapter.content[i] == NULL) {
            exit(1);
        }
        chapter.content[i][0] = '\0';
    }

    //on initialise le titre
    chapter.title = malloc(LINE_SIZE * sizeof(char));
    if (chapter.title == NULL) {
        exit(1);
    }
    // On initialise le titre à une chaîne vide
    chapter.title[0] = '\0';

    return chapter;
}

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
void chapter_add(struct ChapterArray *chapArray, struct Chapter chapter) {
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

//Copie profonde d'un chapitre
struct Chapter deep_copy_chapter(struct Chapter *src) {
    struct Chapter copy;
    copy.id = src->id;

    // Copier le titre
    if (src->title != NULL) {
        copy.title = strdup(src->title);
    } else {
        copy.title = NULL;
    }

    // Copier le contenu
    copy.contentLen = src->contentLen;
    if (src->contentLen > 0) {
        copy.content = malloc(copy.contentLen * sizeof(char *));
        for (int i = 0; i < copy.contentLen; ++i) {
            copy.content[i] = strdup(src->content[i]);
        }
    } else {
        copy.content = NULL;
    }

    // Copier les choix
    copy.choiceLen = src->choiceLen;
    if (copy.choiceLen > 0) {
        copy.choices = malloc(copy.choiceLen * sizeof(struct Choice));
        for (int i = 0; i < copy.choiceLen; ++i) {
            copy.choices[i].chapNumber = src->choices[i].chapNumber;
            copy.choices[i].choicename = strdup(src->choices[i].choicename);
        }
    } else {
        copy.choices = NULL;
    }

    return copy;
}
