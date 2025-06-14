function main() {
    initGameTimer();

    initInventory();
    // updateLife(30);
    // updatePrecision(10);
    // updateEnergy(30);
    addItemToInventory(ITEMS[0]);
    addItemToInventory(ITEMS[1]);
    startScenario();
    // Déplacements
    moveCharacter("player", 200, 1500).then(() => {
        addStartInteractionBtn();
    });
    // moveCharacter("entity", 300, 1500).then(() => {
    // });
}

main();


// Temps de jeu peristent à travers les pages
function initGameTimer() {
    if (typeof (Storage) !== "undefined") {
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
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}




