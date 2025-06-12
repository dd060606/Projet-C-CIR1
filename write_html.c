//
// Created by doria on 12/06/2025.
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "write_html.h"

#include "utils.h"

void writeHTML(struct ChapterArray *chapterArray) {
}

void writeFile(char *fileOutputName, char *content) {
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

