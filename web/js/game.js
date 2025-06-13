function main() {
    initGameTimer();
    spawnEntity();

    // Déplacements
    moveCharacter("player", 150, 1500).then(() => {
        addStartDiscussionBtn();
    });
    setTimeout(() => {
        moveCharacter("entity", 300, 1500).then(() => {
            //Code lors du retour du bonhomme 2
            console.log("Le bonhomme 2 est revenu !");
        });
    }, 2500);
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

function moveCharacter(id, distance, duration = 1000) {
    return new Promise((resolve) => {
        const character = document.getElementById(id);
        const startLeft = parseFloat(getComputedStyle(character).left) || 0;
        const startTime = performance.now();

        character.style.position = "absolute";
        character.style.left = `${startLeft}px`;

        // Déterminer le sens (retourner horizontalement si distance négative)
        const direction = distance >= 0 ? 1 : -1;
        character.style.transform = `scaleX(${direction})`;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const newLeft = startLeft + distance * progress;
            character.style.left = `${newLeft}px`;

            // Oscillation de rotation pour simuler la marche (ajouté à scaleX)
            const angle = Math.sin(progress * Math.PI * 10) * 10;
            character.style.transform = `scaleX(${direction}) rotate(${angle}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Revenir à la position neutre
                character.style.transform = `scaleX(${direction}) rotate(0deg)`;
                resolve();
            }
        }

        requestAnimationFrame(animate);
    });
}

// Fait apparaitre un l'entité
function spawnEntity() {
    const gameBox = document.querySelector(".game-box");
    const entity = document.createElement("img");
    entity.id = "entity";
    entity.className = "entity";
    entity.src = "../assets/nathaniel.png";
    gameBox.appendChild(entity);
}

// Ajoute le bouton pour démarrer la discussion
function addStartDiscussionBtn() {
    const gameBox = document.querySelector(".choices-container");
    const button = document.createElement("button");
    button.textContent = "Participer à la discussion";
    button.className = "btn start-discussion-btn";
    button.addEventListener("click", () => {
        console.log("Discussion démarrée !");
    });
    gameBox.appendChild(button);
}