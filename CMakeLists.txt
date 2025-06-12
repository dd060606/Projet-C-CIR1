cmake_minimum_required(VERSION 3.25)
project(Projet_C_CIR1 C)

set(CMAKE_C_STANDARD 11)

add_executable(Projet_C_CIR1 main.c
        read_book.c
        read_book.h
        write_html.c
        write_html.h)
