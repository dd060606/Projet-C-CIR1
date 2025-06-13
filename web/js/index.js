
function main() {
    resetGameTimer();

}

main();


//On réinitialise le temps de jeu à 0
function resetGameTimer() {
    if (typeof (Storage) !== "undefined") {
        localStorage.gameTime = 0;
        document.querySelector("#play-time").textContent = "00:00";
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}
