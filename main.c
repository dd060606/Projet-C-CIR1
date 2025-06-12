#include <stdio.h>
#include "read_book.h"
#include "write_html.h"

int main(void) {
    struct ChapterArray chapArray = readBookFile("../book.txt");
    char *html = createHTMLContent(&chapArray.chapters[0]);
    printf("%s", html);
    return 0;
}
