//
// Created by doria on 12/06/2025.
//

#ifndef UTILS_H
#define UTILS_H
#include <stdbool.h>


//Renvoie true si la ligne commence par une chaîne de caractères donnée
bool startsWith(const char *line, const char *str);

//Fonction qui concatène deux chaînes de caractères dynamiquement
char *concat(char *a, char *b);

#endif //UTILS_H
