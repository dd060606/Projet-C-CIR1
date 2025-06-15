//
// Created by doria on 12/06/2025.
//
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "read_book.h"
#include "utils.h"


//On lit le fichier book.txt et on retourne un tableau de chapitres
struct ChapterArray readBookFile(char *filename) {
    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename);
        exit(EXIT_FAILURE);
    }
    struct ChapterArray chapterArray = chap_array_init();
    struct Chapter chapter = initChapter();
    char line[LINE_SIZE];

    while (fgets(line, sizeof(line), file)) {
        convertChapLine(&chapter, line);

        //S'il y a un retour à la ligne
        if (strlen(line) <= 2) {
            chapter_add(&chapterArray, deep_copy_chapter(&chapter));
            chapter = initChapter();
        }
    }
    chapter_add(&chapterArray, chapter);
    chapter = initChapter();
    return chapterArray;
}

//On convertit une ligne de chapitre en un champ de la structure Chapter
void convertChapLine(struct Chapter *chapter, char *chapterLine) {
    if (startsWith(chapterLine, "<chapter")) {
        //Pour la balise <chapter> on récupère le texte et l'id du chapitre
        int id;
        char titre[LINE_SIZE];
        sscanf(chapterLine, "<chapter id=\"%d\">%[^<]</chapter>", &id, titre);
        strcpy(chapter->title, titre);
        chapter->id = id;
    } else if (startsWith(chapterLine, "<p>")) {
        //Pour la balise <p> on récupère le texte du paragraphe
        char text[LINE_SIZE];
        sscanf(chapterLine, "<p>%[^<]</p>", text);
        strcpy(chapter->content[chapter->contentLen], text);
        chapter->contentLen++;
    } else if (startsWith(chapterLine, "<choice")) {
        //Pour la balise <choice> on récupère le texte et l'id du choix
        int id;
        char choicename[LINE_SIZE];
        sscanf(chapterLine, "<choice idref=\"%d\">%[^<]</choice>", &id, choicename);
        strcpy(chapter->choices[chapter->choiceLen].choicename, choicename);
        chapter->choices[chapter->choiceLen].chapNumber = id;
        chapter->choiceLen++;
    }
}
