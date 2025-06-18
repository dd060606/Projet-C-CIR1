//
// Created by doria on 12/06/2025.
//

#ifndef WRITE_HTML_H
#define WRITE_HTML_H
#include "chapter.h"

void writeHTML(struct ChapterArray *chapterArray);

void writeFile(char *fileOutputName, char *content);

char *createHTMLContent(struct Chapter *chapter);

#endif //WRITE_HTML_H
