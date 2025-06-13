# Projet-C-CIR1

Projet de première année en C et HTML/CSS/JS

# Construire et lancer le projet

### Sur Windows

1) Ouvrir le projet avec CLion et lancer la compilation.

### Sur Linux

1) Créer un dossier `build` dans le dossier du projet.

```bash
mkdir build
```

2) Lancer la compilation dans le dossier `build`.

```bash
cd build
cmake ..
make
```

3) Lancer le projet.

```bash 
./Projet-C-CIR1
```

**Il faut bien faire attention à lancer le projet depuis le dossier `build` pour que les fichiers HTML/CSS/JS soient
trouvés depuis la fonction writeHTML**