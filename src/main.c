#include <stdio.h>
#include "read_book.h"
#include "write_html.h"

int main(void) {
    struct ChapterArray chapArray = readBookFile("../book.txt");
    writeHTML(&chapArray);
    printf("Fichiers HTML générés dans le dossier export/chapters\n");
    return 0;
}
