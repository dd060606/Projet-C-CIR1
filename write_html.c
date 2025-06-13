//
// Created by doria on 12/06/2025.
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "write_html.h"
#include "chapter.h"
#include "utils.h"

void writeHTML(struct ChapterArray *chapterArray) {
    // Tout d'abord on supprime le dossier export s'il existe pour le recréer proprement
    // On crée les dossiers nécessaires
    // Puis on copie les fichiers web dans le dossier export
#ifdef _WIN32
    system("rmdir /S /Q ..\\export >nul 2>&1");
    system("mkdir ..\\export\\chapters >nul 2>&1");
    system("xcopy /E /I /Y ..\\web\\* ..\\export\\");
#else
    system("rm -rf ../export/");
    system("mkdir -p ../export/chapters");
    system("cp -a ../web/. ../export/");
#endif
    for (int i = 0; i < chapterArray->size; i++) {
        char filename[50];
        sprintf(filename, "../export/chapters/%d.html", chapterArray->chapters[i].id);
        writeFile(filename, createHTMLContent(&chapterArray->chapters[i]));
    }
}

void writeFile(char *fileOutputName, char *content) {
    FILE *f = fopen(fileOutputName, "w");
    if (f == NULL) {
        fprintf(stderr, "Error: failed to open file %s for writing\n", fileOutputName);
        return;
    }

    fputs(content, f);
    fclose(f);
}


// Les templates HTML
char *chapDivTemplate = "<div class=\"chapter\" id=\"chapter-%d\">\n"
        "%s\n" // Contenu du chapitre
        "</div>\n";

char *chapTitleTemplate = "<h1>%s</h1>\n";

char *paragraphTemplate = "<p>%s</p>\n";
char *choiceTemplate = "<div class=\"choice\">\n"
        "<p>%s</p>\n"
        "<a href=\"%d.html\">%s</a>\n"
        "</div>\n";

char *createHTMLContent(struct Chapter *chapter) {
    // Création du titre
    char titleBuffer[1024];
    snprintf(titleBuffer, sizeof(titleBuffer), chapTitleTemplate, chapter->title);

    // Paragraphes
    char *contentHTML = strdup("");
    for (int i = 0; i < chapter->contentLen; i++) {
        char paragraphBuffer[1024];
        //On remplace dans la template
        snprintf(paragraphBuffer, sizeof(paragraphBuffer), paragraphTemplate, chapter->content[i]);
        char *newContent = concat(contentHTML, paragraphBuffer);
        free(contentHTML);
        contentHTML = newContent;
    }

    // Choix
    char *choicesHTML = strdup("");
    for (int i = 0; i < chapter->choiceLen; i++) {
        char choiceBuffer[1024];
        snprintf(choiceBuffer, sizeof(choiceBuffer), choiceTemplate,
                 chapter->choices[i].choicename,
                 chapter->choices[i].chapNumber,
                 chapter->choices[i].choicename);
        char *newChoices = concat(choicesHTML, choiceBuffer);
        free(choicesHTML);
        choicesHTML = newChoices;
    }

    // On concatène le titre, le contenu et les choix
    char *divContent = concat(titleBuffer, contentHTML);
    char *tmp = concat(divContent, choicesHTML);
    free(divContent);
    divContent = tmp;

    // Construction du HTML final
    int finalSize = strlen(chapDivTemplate) + strlen(divContent) + 20;
    char *finalHTML = malloc(finalSize);
    if (finalHTML == NULL) {
        exit(EXIT_FAILURE);
    }
    snprintf(finalHTML, finalSize, chapDivTemplate, chapter->id, divContent);

    // On libère la mémoire allouée
    free(contentHTML);
    free(choicesHTML);
    free(divContent);

    return finalHTML;
}
