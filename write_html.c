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
    system("del ..\\export\\chapter.html >nul 2>&1");
#else
    system("rm -rf ../export/");
    system("mkdir -p ../export/chapters");
    system("cp -a ../web/. ../export/");
    system("rm ../export/chapter.html");
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

char *totalTemplate =
        "<!DOCTYPE html>\n"
        "<html lang=\"fr\">\n"
        "\n"
        "<head>\n"
        "    <meta charset=\"UTF-8\">\n"
        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
        "    <title>La Quête Royale</title>\n"
        "    <link\n"
        "        href=\"https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap\"\n"
        "        rel=\"stylesheet\">\n"
        "    <link rel=\"stylesheet\" href=\"../css/nav.css\">\n"
        "    <link rel=\"stylesheet\" href=\"../css/chapter.css\">\n"
        "<script src=\"../js/gameEngine.js\" defer></script>\n"
        "<script src=\"../js/gameStory.js\" defer></script>\n"
        "    <script src=\"../js/game.js\" defer></script>\n"
        "</head>\n"
        "\n"
        "<body>\n"
        "    <!-- Barre de navigation -->\n"
        "    <nav>\n"
        "        <a href=\"../index.html\" class=\"nav-link\">\n"
        "            <h1>La Quête Royale</h1>\n"
        "        </a>\n"
        "        <div>\n"
        "            <p>Temps de jeu</p>\n"
        "            <span id=\"play-time\"></span>\n"
        "        </div>\n"
        "    </nav>\n"
        "    <div class=\"chapentier\">\n"
        "%s\n" // Le chapitre sera inséré ici
        "<div class=\"stats\">\n"
        "    <h1>Votre personnage</h1>\n"
        "    <div class=\"player-stats\">\n"
        "        <div class=\"statline-container\">\n"
        "            <div class=\"statline\">\n"
        "                <img src=\"../assets/coeur.png\" width=\"20px\" height=\"20px\">\n"
        "                <p>Vie: <span>100 PV</span></p>\n"
        "            </div>\n"
        "            <div class=\"statline\">\n"
        "                <img src=\"../assets/cible.png\" width=\"20px\" height=\"20px\">\n"
        "                <p>Précision: <span>10 </span></p>\n"
        "            </div>\n"
        "            <div class=\"statline\">\n"
        "                <img src=\"../assets/eclair.png\" width=\"20px\" height=\"20px\">\n"
        "                <p>Énergie: <span>100 </span></p>\n"
        "            </div>\n"
        "        </div>\n"
        "        <div class=\"player-box\">\n"
        "            <img src=\"../assets/player.png\" alt=\"player\">\n"
        "        </div>\n"
        "    </div>\n"
        "    <div class=\"inventory\">\n"
        "        <h2>Inventaire</h2>\n"
        "        <div class=\"slots\">\n"
        "            <div class=\"slot\"></div>\n"
        "            <div class=\"slot\"></div>\n"
        "            <div class=\"slot\"></div>\n"
        "            <div class=\"slot\"></div>\n"
        "            <div class=\"slot\"></div>\n"
        "        </div>\n"
        "    </div>\n"
        "</div>\n"
        "</div>\n"
        "<div class=\"chapchoice\">\n"
        "    <div class=\"game-box\">\n"
        "        <img src=\"../assets/player.png\" alt=\"player\" id=\"player\">\n"
        "    </div>\n"
        "    <div class=\"choices-container\">\n"
        "%s\n" // Les choix seront insérés ici
        "</div>\n"
        "</div>\n"
        "</body>\n"
        "</html>\n";

char *chapDivTemplate = "<div class=\"chapter\" id=\"chapter-%d\">\n"
        "%s\n" // Contenu du chapitre
        "</div>\n";

char *chapTitleTemplate = "<h1>%s</h1>\n";

char *paragraphTemplate = "<p>%s</p>\n";
char *choiceTemplate = "<a class=\"choice\" href=\"%d.html\">\n"
        "<p class=\"choice-text\">%s</p>\n"
        "</a>\n";

char *createHTMLContent(struct Chapter *chapter) {
    // Création du titre
    char titleBuffer[1024];
    snprintf(titleBuffer, sizeof(titleBuffer), chapTitleTemplate, chapter->title);

    // Paragraphes
    char *contentHTML = strdup("");
    for (int i = 0; i < chapter->contentLen; i++) {
        char paragraphBuffer[1024];
        snprintf(paragraphBuffer, sizeof(paragraphBuffer), paragraphTemplate, chapter->content[i]);
        char *newContent = concat(contentHTML, paragraphBuffer);
        free(contentHTML);
        contentHTML = newContent;
    }

    // On concatène le titre et les paragraphes
    char *divContent = concat(titleBuffer, contentHTML);
    free(contentHTML);

    // On crée la div du chapitre avec le titre + paragraphes
    int chapterDivSize = strlen(chapDivTemplate) + strlen(divContent) + 100;
    char *chapterDivHTML = malloc(chapterDivSize);
    if (chapterDivHTML == NULL) {
        exit(EXIT_FAILURE);
    }
    snprintf(chapterDivHTML, chapterDivSize, chapDivTemplate, chapter->id, divContent);
    free(divContent);

    // Choix
    char *choicesHTML = strdup("");
    for (int i = 0; i < chapter->choiceLen; i++) {
        char choiceBuffer[1024];
        snprintf(choiceBuffer, sizeof(choiceBuffer), choiceTemplate,
                 chapter->choices[i].chapNumber,
                 chapter->choices[i].choicename);
        char *newChoices = concat(choicesHTML, choiceBuffer);
        free(choicesHTML);
        choicesHTML = newChoices;
    }

    // Construction du HTML final
    int finalHTMLSize = strlen(totalTemplate) + strlen(chapterDivHTML) + strlen(choicesHTML) + 100;
    char *finalHTML = malloc(finalHTMLSize);
    if (finalHTML == NULL) {
        exit(EXIT_FAILURE);
    }
    snprintf(finalHTML, finalHTMLSize, totalTemplate, chapterDivHTML, choicesHTML);

    // Libération de la mémoire
    free(choicesHTML);
    free(chapterDivHTML);

    return finalHTML;
}
