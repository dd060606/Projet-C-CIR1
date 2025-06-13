let life=100;


function main() {
    initGameTimer();
    initinventory();
    updatelife(100,30);
    updateenergy(100,30);
    updateprecision(100,200);
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

function initinventory(){
   let tab = document.querySelectorAll(".slot");

    tab.forEach((element,index) => {
        element.addEventListener("click",function(){
            colorinventory(index);
        });
   });

}

function colorinventory(index){
    let tab = document.querySelectorAll(".slot");
    tab.forEach(element => {
        element.style.border = "2px solid transparent"; //on fait ca pour mettre toutes les bordures en transparent
    });
    tab[index].style.border = "2px solid #3498db"; // on ajoute la bordure bleue au carré séléctioné
}

function updatelife(life,attack){
    life=life-attack;
    let visualstats= document.querySelectorAll(".statline span")  //on prend que les span dans la div statline
    let visuallife=visualstats[0];
    visuallife.innerText=life;
}


function updateenergy(energy,cost){
    energy=energy-cost;
    let visualstats= document.querySelectorAll(".statline span")  //on prend que les span dans la div statline
    let visualenergy=visualstats[1];
    visualenergy.innerText=energy;

}

function updateprecision(precision,weaponprecision){
    precision=weaponprecision;
    let visualstats= document.querySelectorAll(".statline span")  //on prend que les span dans la div statline
    let visualprecision=visualstats[2];
    visualprecision.innerText=weaponprecision;




}