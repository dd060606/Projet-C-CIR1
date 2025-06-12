#include <stdio.h>
#include "read_book.h"

int main(void) {
    //Les tests
    struct Chapter chapter = initChapter();
    convertChapLine(&chapter, "<chapter id=\"01\">Le Village de Grinheim</chapter>");
    printf("Chapter ID: %d\n", chapter.id);
    printf("Chapter Title: %s\n", chapter.title);
    convertChapLine(&chapter, "<p>Vous êtes originaire du village de Grinheim, un endroit tranquille niché entre des collines verdoyantes et une forêt dense. Le village, autrefois prospère, se trouve aujourd'hui sous l'emprise d'une malédiction ancienne. Les récoltes pourrissent, les enfants tombent malades, et un sentiment d'oppression envahit l'air. Selon la légende, un artefact puissant, le Collier aux Sept Pierres, possède le pouvoir de briser la malédiction et de sauver Grinheim.</p>");
    convertChapLine(&chapter, "<p>Le vent frais souffle à travers les arbres, vous donnant un dernier souffle de courage. Vous faites vos adieux aux habitants de Grinheim et prenez le chemin de l’aventure.</p>");
    printf("Chapter Content Length: %d\n", chapter.contentLen);
    for (int i = 0; i < chapter.contentLen; i++) {
        printf("Paragraph %d: %s\n", i + 1, chapter.content[i]);
    }
    convertChapLine(&chapter, "<choice idref=\"04\">Partir vers le nord, une route qui mène apparemment vers une falaise escarpée. <a>Chapitre 4</a></choice>");
    convertChapLine(&chapter, "<choice idref=\"05\">Revenir sur vos pas, vous méfiant des ombres grandissantes dans la forêt. <a>Chapitre 5</a></choice>");

    printf("Chapter Choices Length: %d\n", chapter.choiceLen);
    for (int i = 0; i < chapter.choiceLen; i++) {
        printf("Choice %d: %s (Chapter %d)\n", i + 1, chapter.choices[i].choicename, chapter.choices[i].chapNumber);
    }

    freeChapter(&chapter);

    // Même tests mais avec d'autres données
    convertChapLine(&chapter, "<chapter id=\"02\">Le 2</chapter>");
    printf("Chapter ID: %d\n", chapter.id);
    printf("Chapter Title: %s\n", chapter.title);
    convertChapLine(&chapter, "<p>TEST1.</p>");
    convertChapLine(&chapter, "<p>TEST2.</p>");
    printf("Chapter Content Length: %d\n", chapter.contentLen);
    for (int i = 0; i < chapter.contentLen; i++) {
        printf("Paragraph %d: %s\n", i + 1, chapter.content[i]);
    }
    convertChapLine(&chapter, "<choice idref=\"02\">PART</choice>");
    convertChapLine(&chapter, "<choice idref=\"03\">AAAAAAA</choice>");

    printf("Chapter Choices Length: %d\n", chapter.choiceLen);
    for (int i = 0; i < chapter.choiceLen; i++) {
        printf("Choice %d: %s (Chapter %d)\n", i + 1, chapter.choices[i].choicename, chapter.choices[i].chapNumber);
    }


    return 0;
}
