#include <stdio.h>
#include "read_book.h"

int main(void) {

    struct ChapterArray chapArray = readBookFile("../book.txt");
    printf("%d", chapArray.size);
    return 0;
}
