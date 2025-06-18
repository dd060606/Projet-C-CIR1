cmake_minimum_required(VERSION 3.25)
project(Projet_C_CIR1 C)

set(CMAKE_C_STANDARD 11)

add_executable(Projet_C_CIR1 src/main.c
        src/read_book.c
        src/read_book.h
        src/write_html.c
        src/write_html.h
        src/chapter.c
        src/chapter.h
        src/utils.c
        src/utils.h)
