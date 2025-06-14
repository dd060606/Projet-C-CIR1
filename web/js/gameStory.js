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

// Les scénarios du jeu
const SCENARIOS = [
    {
        //Le chapitre auquel appartient le scénario
        chapterId: 1,
        //Description du scénario
        description: "Le scénario de Nathaniel",
        // Fonction qui s'exécute avant le démarrage de l'interaction (mise en place des entités, etc.)
        preScenario: () => {
            spawnEntity("nathaniel");
        },
        // Le texte de discussion avant le choix du joueur
        beforeChoiceDiscussionText: `Bonjour jeune aventurier, je suis Nathaniel Raimbault.
        Je suis là pour te mettre au défi :
        Pourras-tu résoudre ce Casse tête et passer cette épreuve ?
        Quel est le résultat de 99*17-85/3 ?
        `,
        // Les choix disponibles pour le joueur
        choices: [
            {
                text: "Résoudre",
                // Fonction qui s'exécute lors du choix
                onClick: () => {
                },
                // Bulle de texte affiché après la discussion pour ce choix
                afterDiscussionText: "",
            },
            {
                text: "Attaquer",
                onClick: () => {
                },
                afterDiscussionText: "C'est dommage, tu aurais pu gagner un item, c'était pourtant trivial !",
            }
        ]
    }
];

// On démarre le scénario correspondant au chapitre actuel
function startScenario() {
    const chapterId = getCurrentChapter();
    const scenario = SCENARIOS.find(s => s.chapterId === chapterId);
    if (scenario) {
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
    const gameBox = document.querySelector(".choices-container");
    const chapchoice = document.querySelector(".chapchoice");
    const button = document.createElement("button");
    button.textContent = "Lancer l'interaction";
    button.className = "btn start-interaction-btn";
    button.addEventListener("click", () => {
        // Lors du clic, on démarre l'interaction
        const scenario = SCENARIOS.find(s => s.chapterId === getCurrentChapter());
        chapchoice.classList.add("is-open");
        if (scenario) {
            showSpeechBubble(scenario.beforeChoiceDiscussionText, 20);
            // On affiche les choix disponibles
            const choicesContainer = document.querySelector(".choices-container");
            // Vide les choix précédents
            choicesContainer.innerHTML = "";
            scenario.choices.forEach(choice => {
                const choiceButton = document.createElement("button");
                choiceButton.textContent = choice.text;
                choiceButton.className = "btn choice-btn";
                choiceButton.addEventListener("click", () => {
                    closeSpeechBubble();
                    choice.onClick();
                    showSpeechBubble(choice.afterDiscussionText, 20);
                });
                choicesContainer.appendChild(choiceButton);
            });
        }
    });
    gameBox.appendChild(button);
}

// Affiche une bulle de discussion au-dessus de l'entity
function showSpeechBubble(text, speed = 20) {
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
    const entityRect = entity.getBoundingClientRect();
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