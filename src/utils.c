//
// Created by doria on 12/06/2025.
//

#include "utils.h"

#include <stdlib.h>
#include <string.h>

//Dans ce fichier, nous avons des fonctions utilitaires pour gérer les chaînes de caractères

//Vérifie si une ligne commence par une chaîne de caractères donnée
bool startsWith(const char *line, const char *str) {
    return strncmp(line, str, strlen(str)) == 0;
}

//Concatène deux chaînes de caractères dynamiquement
char *concat(char *a, char *b) {
    //On alloue dynamiquement la taille finale
    size_t len = strlen(a) + strlen(b) + 1;
    char *result = malloc(len);
    if (result == NULL) {
        exit(EXIT_FAILURE);
    }
    //On copie puis concatène les deux chaînes
    strcpy(result, a);
    strcat(result, b);
    return result;
}

