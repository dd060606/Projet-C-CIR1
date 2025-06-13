function main() {
    initGameTimer();

}

main();


// Temps de jeu peristent à travers les pages
function initGameTimer() {
    if (typeof (Storage) !== "undefined") {
        // Vérifier si le temps de jeu est déjà stocké
        if (localStorage.gameTime) {
            // Si oui, récupérer le temps de jeu existant
            var gameTime = parseInt(localStorage.gameTime);
        } else {
            // Si non, initialiser le temps de jeu à 0
            var gameTime = 0;
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

