//
// Created by doria on 12/06/2025.
//

#include "write_html.h"
#include <stdio.h>
#include "chapter.h"
void writeHTML(struct ChapterArray* chapterArray) {
    for(int i=0; i < chapterArray->size;i++) {
        char filename[10];
        sprintf(filename, "%02d.html", chapterArray->chapters[i].id);  //génère le nom de notre fichier en fonction du numéro du chapitre

        writeFile(filename, chapterArray->chapters[i].content);

    }
}

void writeFile(char* fileOutputName, char* content) {
    FILE* f = fopen(fileOutputName, "w");
    fputs(content, f); //fonction qui permet d'écrire un texte dans un fichier
    fclose(f);

}