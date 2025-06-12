//
// Created by doria on 12/06/2025.
//
#include <stdio.h>
#include "read_book.h"
#include <stdlib.h>
#include <string.h>
#define LINE_SIZE 512
void readChapter(struct Chapter *chapter);

void freeChapter(struct Chapter* chapter) {


    // Libère le titre
    free(chapter->title);
    chapter->title = NULL;//on remet les variables à 0

    // Libère chaque paragraphe du contenu (si alloué dynamiquement)
    if (chapter->content) {
        for (int i = 0; i < chapter->contentLen; ++i) {     //on parcourt tout le texte
            free(chapter->content[i]);  //on libère chaque tableau chacun son tour
        }
        free(chapter->content);  // on libère la mémoire du tableau qui héberge les textes
        chapter->content = NULL;
    }
    chapter->contentLen = 0; //on remet les varaibles à 0

    //on fait pareil pour la structure choice
    free(chapter->choices);
    chapter->choices = NULL;
    chapter->choiceLen = 0;
}

char* readBookFile(char* filename) {
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename);
        exit(EXIT_FAILURE);
    }
    struct ChapterArray chapterArray=chap_array_init();
    struct Chapter chapter;
    int saut_de_ligne=0;
    char line[LINE_SIZE];

    while(fgets(line, sizeof(line), file)) {
        if (strcmp(line,"\n") == 0) {
            saut_de_ligne++;
        }
        else {
            saut_de_ligne=0;    //on retemet saut de ligne a 0 car sinon il comptera juste tous les sauts de ligne du texte
        }
        if (saut_de_ligne==2) {
            chapter_add(&chapterArray,chapter);     //on fait en sorte d'isoler les chapitres
            freeChapter(&chapter);      //on remet les variables à 0  pour avoir un autre chapitre

        }


    }
}

void convertChapLine(struct Chapter* chapter, char* chapterLine) {

}