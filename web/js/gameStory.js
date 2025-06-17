// Les items du jeu
const ITEMS = [
  {
    name: "Banane",
    image: "../assets/banane.png",
    damage: 1000,
    precision: 100,
  },
  {
    name: "Faux",
    image: "../assets/faux.png",
    damage: 10,
    precision: 7,
  },
  {
    name: "Pistolet",
    image: "../assets/gun.png",
    damage: 20,
    precision: 5,
    projectile: {
      image: "../assets/gun_shot.png",
      rotate: false,
    },
  },
  {
    name: "Totem d'immortalité",
    image: "../assets/totem.png",
    damage: 2,
    precision: 10,
  },
  {
    name: "Calculatrice",
    image: "../assets/calculatrice.png",
    damage: 2,
    precision: 10,
  }
];

const ENTITIES = [
  {
    name: "nathaniel",
    image: "../assets/nathaniel.png",
    life: 0,
    damage: 0,
  },
  {
    name: "nathaniel-chockbar",
    image: "../assets/nathaniel-chockbar.png",
    life: 80,
    damage: 12,
    projectileImage: "../assets/potato.png",
  },
  {
    name: "blob",
    image: "../assets/blob.png",
    life: 40,
    damage: 15,
    projectileImage: "../assets/slimeball.png",
  },
  {
    name: "dragon",
    image: "../assets/dragon.png",
    life: 50,
    damage: 45,
    projectileImage: "../assets/fireball.png",
  },
  {
    name: "mecha_florian",
    image: "../assets/mecha_florian.png",
    life: 0,
    damage: 0,
  },
  {
    name: "charbel",
    image: "../assets/charbel.png",
    life: 6,
    damage: 0,
  },
  {
    name: "ours",
    image: "../assets/ours.png",
    life: 50,
    damage: 20,
    projectileImage: "../assets/griffe.png",
  },
];

// Empêche le joueur de faire un choix pendant une discussion
let canMakeChoice = true;

// Les scénarios du jeu
const SCENARIOS = [
  {
    //Le chapitre auquel appartient le scénario
    chapterId: 5,
    //Description du scénario
    description: "Le scénario de Nathaniel",
    // Indique si c'est un combat ou non
    isFight: false,
    // Fonction qui s'exécute avant le démarrage de l'interaction (mise en place des entités, etc.)
    preScenario: () => {
      spawnEntity("nathaniel");
    },
    // Le texte de discussion avant le choix du joueur
    beforeChoiceDiscussionText: `Bonjour jeune aventurier, je suis Nathaniel.
        Je suis là pour te mettre au défi :
        Pourras-tu résoudre ce Casse tête et passer cette épreuve ?
        Quel est le résultat de 99*17-85/5 ?
        `,
    // Les choix disponibles pour le joueur
    choices: [
      {
        text: "Résoudre",
        // Fonction qui s'exécute lors du choix
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;

          const result = prompt("Quel est le résultat de 99*17-85/5 ?");
          if (parseInt(result) === 1666) {
            showSpeechBubble(
              "Bravo, tu as résolu l'énigme !\n Tu as gagné une banane.\n Attention, utilise la à bon escient, elle est à usage unique !",
              20
            );
            spawnChest();
            addItemToInventory(ITEMS[0]); // Ajoute la banane à l'inventaire
          } else {
            changeEntityImage("nathaniel-chockbar");
            showSpeechBubble("Perdu, c'était pourtant trivial !\n Je t'offre cette calculatrice pour réussir le rattrapage", 20);
            spawnChest();
            addItemToInventory(ITEMS[4]); // Ajoute la calculatrice à l'inventaire
          }
          setTimeout(() => {
            closeSpeechBubble();
            moveCharacter("entity", 300, 1000).then(() => {
              clearChest();
              // On termine le scénario
              endScenario();
            });
          }, 5000);
        },
        // Bulle de texte affiché après la discussion pour ce choix
        afterDiscussionText: "",
      },
      {
        text: "Attaquer",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          shootProjectile().then(() => {
            changeEntityImage("nathaniel-dead");
            setTimeout(() => {
              closeSpeechBubble();
              moveCharacter("entity", 200, 1000).then(() => {
                // On termine le scénario
                endScenario();
              });
            }, 5000);
          });
        },
        afterDiscussionText:
          "C'est dommage, tu aurais pu gagner un item, c'était pourtant trivial !",
      },
    ],
  },
  {
    chapterId: 1,
    description: "Tutoriel de combat",
    isFight: true,
    preScenario: () => {
      // Si le tutoriel a déjà été fait, on ne le refait pas
      if (localStorage.skipTutorial) {
        endScenario();
      } else {
        spawnEntity("charbel");
      }
    },
    beforeChoiceDiscussionText: `Bonjour, je suis Charbel.
    Je vais t'apprendre à combattre.
    Chaque tour, tu peux attaquer ou fuir.
    Quand tu attaques, le monstre t'attaquera aussi en retour.
    Choisis bien tes actions !
    `,
    choices: [
      {
        text: "Attaquer",
        onClick: () => {
          // Empêche les attaques multiples
          if (!canMakeChoice) return;
          canMakeChoice = false;
          playerAttackEntity().then(() => {
            changeEntityImage("charbel-chockbar");
            setTimeout(() => {
              changeEntityImage("charbel");
              // Si l'entitté est morte
              if (!getCurrentEntity()) {
                spawnChest();
                showSpeechBubble(
                  "Bravo, tu as complété le tutoriel !\n Tu as gagné une arme pour te battre contre les vrais monstres.",
                  20
                );
                addItemToInventory(ITEMS[1]);

                //On attend 5 secondes avant de fermer la bulle de discussion et de terminer le scénario
                setTimeout(() => {
                  localStorage.skipTutorial = true;
                  closeSpeechBubble();
                  clearChest();
                  endScenario();
                }, 5000);
              } else {
                canMakeChoice = true;
              }
            }, 300);
          });
        },
        afterDiscussionText: "",
      },
      {
        text: "Fuite",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          stopFight();
          endScenario(true);
          moveCharacter("player", -300, 1000).then(() => {
            window.location.href = `${localStorage.previousChapter || 1}.html`;
          });
        },
        afterDiscussionText: "",
      },
    ],
  },
  {
    chapterId: 3,
    description: "Combat contre monstre",
    isFight: true,
    preScenario: () => {
      spawnEntity("blob");
    },
    beforeChoiceDiscussionText: "",
    choices: [
      {
        text: "Attaquer",
        onClick: () => {
          // Empêche les attaques multiples
          if (!canMakeChoice) return;
          canMakeChoice = false;

          playerAttackEntity().then(() => {
            // Tour de l'entité
            setTimeout(() => {
              if (getCurrentEntity()?.life > 0) {
                // L'entité attaque le joueur
                entityAttackPlayer().then(() => (canMakeChoice = true));
              } else {
                // On regen le joueur
                updateLife(getLife() + 40);
                // Si l'entité est morte, on termine le scénario
                endScenario();
              }
            }, 700);
          });
        },
        afterDiscussionText: "",
      },
      {
        text: "Fuite",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          stopFight();
          endScenario(true);
          moveCharacter("player", -300, 1000).then(() => {
            window.location.href = `${localStorage.previousChapter || 1}.html`;
          });
        },
        afterDiscussionText: "",
      },
    ],
  },
  {
    chapterId: 7,
    description: "Combat contre dragon",
    isFight: true,
    preScenario: () => {
      spawnEntity("dragon");
    },
    beforeChoiceDiscussionText: "",
    choices: [
      {
        text: "Attaquer",
        onClick: () => {
          // Empêche les attaques multiples
          if (!canMakeChoice) return;
          canMakeChoice = false;
          playerAttackEntity().then(() => {
            // Tour de l'entité
            setTimeout(() => {
              if (getCurrentEntity()?.life > 0) {
                // L'entité attaque le joueur
                entityAttackPlayer(false).then(() => (canMakeChoice = true));
              } else {
                // Si l'entité est morte, on termine le scénario
                endScenario();
              }
            }, 1000);
          });
        },
        afterDiscussionText: "",
      },
      {
        text: "Fuite",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          stopFight();
          endScenario(true);
          moveCharacter("player", -300, 1000).then(() => {
            window.location.href = `${localStorage.previousChapter || 1}.html`;
          });
        },
        afterDiscussionText: "",
      },
    ],
  },
  {
    chapterId: 8,
    description: "Combat contre l'ours",
    isFight: true,
    preScenario: () => {
      spawnEntity("ours");
    },
    beforeChoiceDiscussionText: "",
    choices: [
      {
        text: "Attaquer",
        onClick: () => {
          // Empêche les attaques multiples
          if (!canMakeChoice) return;
          canMakeChoice = false;
          playerAttackEntity().then(() => {
            // Tour de l'entité
            setTimeout(() => {
              if (getCurrentEntity()?.life > 0) {
                // L'entité attaque le joueur
                entityAttackPlayer(false).then(() => (canMakeChoice = true));
              } else {
                // On regen le joueur
                updateLife(getLife() + 50);
                // Si l'entité est morte, on termine le scénario
                endScenario();
              }
            }, 1000);
          });
        },
        afterDiscussionText: "",
      },
      {
        text: "Fuite",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          stopFight();
          endScenario(true);
          moveCharacter("player", -300, 1000).then(() => {
            window.location.href = `${localStorage.previousChapter || 1}.html`;
          });
        },
        afterDiscussionText: "",
      },
    ],
  },
  {
    //Le chapitre auquel appartient le scénario
    chapterId: 9,
    //Description du scénario
    description: "Fin du Jeu",
    // Indique si c'est un combat ou non
    isFight: false,
    // Fonction qui s'exécute avant le démarrage de l'interaction (mise en place des entités, etc.)
    preScenario: () => {
      spawnTrophy();
    },
    // Le texte de discussion avant le choix du joueur
    beforeChoiceDiscussionText: ``,
    // Les choix disponibles pour le joueur
    choices: [
      {
        text: "Recommencer",
        // Fonction qui s'exécute lors du choix
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          moveCharacter("player", 200, 1000).then(() => {
            setTimeout(() => {
              clearTrophy();

              moveCharacter("player", 500, 1250).then(() => {
                // On vide le stockage local pour recommencer
                localStorage.clear();
                // On envoie le joueur vers le premier chapitre
                window.location.href = "1.html";
              });
            }, 1000);
          });
        },
      },
      {
        text: "Quitter",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          moveCharacter("player", 200, 1000).then(() => {
            setTimeout(() => {
              clearTrophy();

              moveCharacter("player", 500, 1250).then(() => {
                window.location.href = "../index.html";
              });
            }, 1000);
          });
        },
        afterDiscussionText: "A la prochaine !",
      },
    ],
  },
  {
    chapterId: 10,
    description: "Totem d'immortalité",
    isFight: false,
    preScenario: () => {
      spawnChest();
    },
    beforeChoiceDiscussionText:
      "Un coffre magique apparaît devant vous !\n Vous pouvez choisir de l'ouvrir ou de l'ignorer.",
    choices: [
      {
        text: "Ouvrir",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          showSpeechBubble(
            "Vous avez trouvé un totem d'immortalité !\n Vous pouvez l'utiliser pour survivre à un combat fatal.",
            20
          );
          setTimeout(() => {
            closeSpeechBubble();
            // On ajoute le totem à l'inventaire
            addItemToInventory(ITEMS[3]);
            clearChest();
            moveCharacter("player", 1000, 2000).then(() => {
              endScenario();
            });
          }, 3000);
        },
        afterDiscussionText: "",
      },
      {
        text: "Ignorer",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          closeSpeechBubble();
          clearChest();
          moveCharacter("player", 1000, 1500).then(() => {
            endScenario();
          });
        },
        afterDiscussionText: "",
      },
    ],
  },
  {
    //Le chapitre auquel appartient le scénario
    chapterId: 11,
    //Description du scénario
    description: "Le scénario de Mecha-Florian",
    // Indique si c'est un combat ou non
    isFight: false,
    // Fonction qui s'exécute avant le démarrage de l'interaction (mise en place des entités, etc.)
    preScenario: () => {
      spawnEntity("mecha_florian");
    },
    // Le texte de discussion avant le choix du joueur
    beforeChoiceDiscussionText: `Bonjour, je suis Mecha-Florian.
        Je suis venu du futur pour te lancer ce défi :
        Regarde ce code et dit moi quel langage c'est ?
        fn message(nom: &str) {
            println!("Bonjour, {} !", nom);
        }
        `,
    // Les choix disponibles pour le joueur
    choices: [
      {
        text: "Résoudre",
        // Fonction qui s'exécute lors du choix
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          const result = prompt("De quel langage s'agit-il ?");
          if (result && result.toLowerCase() === "rust") {
            showSpeechBubble(
              "Bravo !\n C'est bien du Rust, tu as résolu l'énigme et gagné un item.",
              20
            );
            spawnChest();
            // Ajoute le pistolet à l'inventaire
            addItemToInventory(ITEMS[2]);
          } else {
            showSpeechBubble(
              "Perdu, j'espère que tu t'en sortira dans ton aventure !",
              20
            );
          }
          setTimeout(() => {
            closeSpeechBubble();
            moveCharacter("entity", 300, 1000).then(() => {
              clearChest();
              // On termine le scénario
              endScenario();
            });
          }, 5000);
        },
        // Bulle de texte affiché après la discussion pour ce choix
        afterDiscussionText: "",
      },
      {
        text: "Attaquer",
        onClick: () => {
          if (!canMakeChoice) return;
          canMakeChoice = false;
          shootProjectile().then(() => {
            removeItemFromInventory(getCurrentItemIndex());
            setTimeout(() => {
              closeSpeechBubble();
              moveCharacter("entity", 200, 1000).then(() => {
                // On termine le scénario
                endScenario();
              });
            }, 5000);
          });
        },
        afterDiscussionText:
          "Avec ma super armure du futur, tu n'as aucune chance !\n Ton arme s'est brisé !\n Le dragon va te dévorer !",
      },
    ],
  },
];

// On démarre le scénario correspondant au chapitre actuel
function startScenario() {
  const chapterId = getCurrentChapter();
  const scenario = SCENARIOS.find((s) => s.chapterId === chapterId);
  if (scenario) {
    showChoiceButtons(false);
    scenario.preScenario();
  }
}

// Récupère le numéro du chapitre actuel
function getCurrentChapter() {
  const chapDiv = document.querySelector(".chapter");
  const id = chapDiv.id;
  return id ? parseInt(id.replace("chapter-", "")) : 1;
}

// Ajoute le bouton pour démarrer l'interaction
function addStartInteractionBtn() {
  const scenario = SCENARIOS.find((s) => s.chapterId === getCurrentChapter());
  if (!scenario) {
    // Si aucun scénario n'est trouvé pour le chapitre actuel, on affiche directement les choix en parchemins
    showChoiceButtons(true);
    return;
  }
  // On crée le bouton pour démarrer l'interaction
  const gameBox = document.querySelector(".choices-container");
  const button = document.createElement("button");
  button.textContent = "Lancer l'interaction";
  button.className = "btn start-interaction-btn";
  button.addEventListener("click", () => {
    // Lors du clic, on démarre l'interaction
    setGameInterfaceFullscreen(true);
    showSpeechBubble(scenario.beforeChoiceDiscussionText, 20);
    // On affiche les choix disponibles
    const choicesContainer = document.querySelector(".choices-container");
    // Vide les choix précédents
    clearScenarioChoices();

    //On supprime le bouton de démarrage de l'interaction
    button.remove();

    // Si on est dans un combat, on démarre le combat
    if (scenario.isFight) {
      startFight();
    }

    scenario.choices.forEach((choice) => {
      const choiceButton = document.createElement("button");
      choiceButton.textContent = choice.text;
      choiceButton.className = "btn choice-btn";
      //Lors du clic sur un choix, on ferme la bulle de discussion et on exécute l'action associée
      choiceButton.addEventListener("click", () => {
        closeSpeechBubble();
        choice.onClick();
        setTimeout(() => {
          // Affiche le texte après la discussion
          showSpeechBubble(choice.afterDiscussionText, 20);
        }, 1000);
      });
      choicesContainer.appendChild(choiceButton);
    });
  });
  gameBox.appendChild(button);
}

// Affiche une bulle de discussion au-dessus de l'entity
function showSpeechBubble(text, speed = 20) {
  if (!text) return;
  let voice = new Audio("../assets/sound/voicesound.mp3");

  voice.loop = true; // Pour que la musique de fond tourne en boucle
  voice.play();
  // Supprime l'ancienne bulle si elle existe
  const oldBubble = document.querySelector(".speech-bubble");
  if (oldBubble) oldBubble.remove();

  const gameBox = document.querySelector(".game-box");

  // Récupère l'entity
  const entity = document.querySelector(".entity");

  // Crée la bulle
  const bubble = document.createElement("div");
  bubble.className = "speech-bubble";
  gameBox.appendChild(bubble);

  if (entity) {
    // Positionne la bulle au-dessus de l'entity
    bubble.style.left = entity.offsetLeft + entity.offsetWidth / 2 + "px";
  } else {
    // Si l'entity n'existe pas, on positionne la bulle au centre
    bubble.style.left = "60%";
  }

  // Affichage progressif du texte
  let i = 0;
  function typeWriter() {
    bubble.innerHTML = text.slice(0, i).replace(/\n/g, "<br>");
    if (i < text.length) {
      i++;
      setTimeout(typeWriter, speed);
    } else if (i == text.length) {
      voice.pause();
      voice.currentTime = 0;
    }
  }
  typeWriter();
}

// Ferme la bulle de discussion
function closeSpeechBubble() {
  const bubble = document.querySelector(".speech-bubble");
  if (bubble) {
    bubble.remove();
  }
}

// Ouvre l'interface de jeu en grand
function setGameInterfaceFullscreen(fullscreen) {
  const chapchoice = document.querySelector(".chapchoice");
  if (fullscreen) {
    chapchoice.classList.add("is-open");
  } else {
    chapchoice.classList.remove("is-open");
  }
}

// Supprime les choix de scénario
function clearScenarioChoices() {
  const oldChoices = document.querySelectorAll(".choice-btn");
  oldChoices.forEach((choice) => choice.remove());
}

// Fonction pour afficher les boutons de choix (parchemins)
function showChoiceButtons(show = true) {
  const choices = document.querySelectorAll(".choice");
  choices.forEach((choice) => {
    choice.style.display = show ? "flex" : "none";
  });
}

// Fonction qui gère la fin du scénario
function endScenario(isEscaping = false) {
  if (!isEscaping) {
    // On sauvegarde le chapitre actuel dans le stockage local si on n'est pas en train de fuir
    localStorage.previousChapter = getCurrentChapter();
  }
  // On remet l'interface de jeu en mode normal
  clearEntity();
  setGameInterfaceFullscreen(false);
  clearScenarioChoices();
  stopFight();
  showChoiceButtons(true);
  canMakeChoice = true;
}
