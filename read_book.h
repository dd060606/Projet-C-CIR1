//
// Created by doria on 12/06/2025.
//

#ifndef READ_BOOK_H
#define READ_BOOK_H

struct Chapter {
    char* title;
    char** content;
    int contentLen;
    struct Choice* choices;
    int choiceLen;
};

struct Choice {
    int chapNumber;
    char* text;
};

#endif //READ_BOOK_H
