
function main() {
    resetLocalStorage();

}

main();


//On réinitialise le stockage local pour le jeu
function resetLocalStorage() {
    if (typeof (Storage) !== "undefined") {
        localStorage.gameTime = 0;
        localStorage.life = 100;
        localStorage.energy = 100;
        localStorage.precision = 10;
        localStorage.inventory = JSON.stringify([]);
        localStorage.currentItem = 0;
        document.querySelector("#play-time").textContent = "00:00";
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}
