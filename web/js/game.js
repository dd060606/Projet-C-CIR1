function main() {
    initGameTimer();
    initChapterChoices();
    initInventory();
    initStats();
    initSounds();

    // addItemToInventory(ITEMS[0]);
    // addItemToInventory(ITEMS[2]);
    startScenario();
    // Déplacements
    moveCharacter("player", 200, 1500).then(() => {
        // On n'ajoute pas le bouton d'intéraction lors du tutoriel si le tutoriel est déjà fait
        if (!(getCurrentChapter() === 1 && localStorage.skipTutorial)) {
            addStartInteractionBtn();
        }
    });
}

main();


// Temps de jeu peristent à travers les pages
function initGameTimer() {
    let gameTime = 0;
    // Vérifier si le temps de jeu est déjà stocké
    if (localStorage.gameTime) {
        // Si oui, récupérer le temps de jeu existant
        gameTime = parseInt(localStorage.gameTime);
    }

    // Mettre à jour le temps de jeu toutes les secondes
    setInterval(function () {
        gameTime++;
        localStorage.gameTime = gameTime;
        document.querySelector("#play-time").textContent = formatTime(gameTime);
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

//On ajoute l'animation de déplacement du personnage avant la redirection vers le chapitre suivant
function initChapterChoices() {
    document.querySelectorAll(".choice").forEach(choice => {
        choice.addEventListener("click", (e) => {
            e.preventDefault();
            moveCharacter("player", 1000, 1500).then(() => {
                const link = e.target.closest("a");
                window.location.href = link.href;
            });
        });
    });
}


