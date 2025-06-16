// Les items du jeu
const ITEMS = [
    {
        name: "Banane",
        image: "../assets/banane.png",
        damage: 1000,
    },
    {
        name: "Faux",
        image: "../assets/faux.png",
        damage: 10,
    }
];

const ENTITIES = [
    {
        name: "nathaniel",
        image: "../assets/nathaniel.png",
        life: 0,
        damage: 0
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
        
    }
    
]

let isAttacking = false;

// Les scénarios du jeu
const SCENARIOS = [
    {
        //Le chapitre auquel appartient le scénario
        chapterId: 1,
        //Description du scénario
        description: "Le scénario de Nathaniel",
        // Indique si c'est un combat ou non
        isFight: false,
        // Fonction qui s'exécute avant le démarrage de l'interaction (mise en place des entités, etc.)
        preScenario: () => {
            spawnEntity("nathaniel");
        },
        // Le texte de discussion avant le choix du joueur
        beforeChoiceDiscussionText: `Bonjour jeune aventurier, je suis Nathaniel Raimbault.
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
                    const result = prompt("Quel est le résultat de 99*17-85/5 ?");
                    if (parseInt(result) === 1666) {
                        showSpeechBubble("Bravo, tu as résolu l'énigme !\n Tu as gagné une banane.", 20);
                        addItemToInventory(ITEMS[0]); // Ajoute la banane à l'inventaire
                    } else {
                        changeEntityImage("nathaniel-chockbar");
                        showSpeechBubble("Perdu, c'était pourtant trivial !", 20);
                    }
                    setTimeout(() => {
                        closeSpeechBubble();
                        moveCharacter("entity", 300, 1000).then(() => {
                            // On termine le scénario
                            endScenario();
                        });
                    }, 3000);
                },
                // Bulle de texte affiché après la discussion pour ce choix
                afterDiscussionText: "",
            },
            {
                text: "Attaquer",
                onClick: () => {
                    shootProjectile().then(() => {
                        changeEntityImage("nathaniel-dead");
                        setTimeout(() => {
                            closeSpeechBubble();
                            moveCharacter("entity", 200, 1000).then(() => {
                                // On termine le scénario
                                endScenario();
                            });
                        }, 3000);
                    });


                },
                afterDiscussionText: "C'est dommage, tu aurais pu gagner un item, c'était pourtant trivial !",
            }
        ]
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
                    if (isAttacking) {
                        return;
                    }
                    isAttacking = true;
                    playerAttackEntity().then(() => {
                        // Tour de l'entité
                        setTimeout(() => {
                            if (getCurrentEntity()?.life > 0) {
                                // L'entité attaque le joueur
                                entityAttackPlayer().then(() => isAttacking = false);
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
                    stopFight();
                    endScenario(true);
                    moveCharacter("player", -300, 1000).then(() => {
                        window.location.href = `${localStorage.previousChapter || 1}.html`;
                    });

                },
                afterDiscussionText: "",
            }
        ]
    }
];



// On démarre le scénario correspondant au chapitre actuel
function startScenario() {
    const chapterId = getCurrentChapter();
    const scenario = SCENARIOS.find(s => s.chapterId === chapterId);
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
    const scenario = SCENARIOS.find(s => s.chapterId === getCurrentChapter());
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

        scenario.choices.forEach(choice => {
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
    // Supprime l'ancienne bulle si elle existe
    const oldBubble = document.querySelector('.speech-bubble');
    if (oldBubble) oldBubble.remove();

    // Récupère l'entity
    const entity = document.querySelector(".entity");
    if (!entity) return;

    // Crée la bulle
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    entity.parentElement.appendChild(bubble);

    // Positionne la bulle au-dessus de l'entity
    bubble.style.left = (entity.offsetLeft + entity.offsetWidth / 2) + 'px';

    // Affichage progressif du texte
    let i = 0;
    function typeWriter() {
        bubble.innerHTML = text.slice(0, i).replace(/\n/g, "<br>");
        if (i < text.length) {
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();
}

// Ferme la bulle de discussion
function closeSpeechBubble() {
    const bubble = document.querySelector('.speech-bubble');
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
    oldChoices.forEach(choice => choice.remove());
}

// Fonction pour afficher les boutons de choix (parchemins)
function showChoiceButtons(show = true) {
    const choices = document.querySelectorAll(".choice");
    choices.forEach(choice => {
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
    showChoiceButtons(true);
    isAttacking = false;
}