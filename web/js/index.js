
function main() {
    resetLocalStorage();

}

main();


//On réinitialise le stockage local pour le jeu
function resetLocalStorage() {
    localStorage.clear();
    document.querySelector("#play-time").textContent = "00:00";
}
