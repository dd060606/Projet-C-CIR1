// Déplace le personnage ou l'entité
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
function spawnEntity(name) {
    const gameBox = document.querySelector(".game-box");
    const entity = document.createElement("img");
    entity.id = "entity";
    entity.className = "entity";
    entity.src = `../assets/${name}.png`;
    gameBox.appendChild(entity);
}


// Statistiques du personnage

function updateLife(attack) {
    let life = getLife();
    life = life - attack;
    //On stocke la vie dans le localStorage
    if (typeof (Storage) !== "undefined") {
        localStorage.life = life;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
    let visualstats = document.querySelectorAll(".statline span")  //on prend que les span dans la div statline
    let visuallife = visualstats[0];
    visuallife.innerText = life + "PV";
}


function updateEnergy(cost) {
    let energy = getEnergy();
    energy = energy - cost;
    //On stocke l'énergie dans le localStorage
    if (typeof (Storage) !== "undefined") {
        localStorage.energy = energy;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
    let visualstats = document.querySelectorAll(".statline span")  //on prend que les span dans la div statline
    let visualenergy = visualstats[2];
    visualenergy.innerText = energy;

}

function updatePrecision(weaponprecision) {
    let precision = getPrecision();
    precision = weaponprecision;
    //On stocke la précision dans le localStorage
    if (typeof (Storage) !== "undefined") {
        localStorage.precision = precision;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
    let visualstats = document.querySelectorAll(".statline span")  //on prend que les span dans la div statline
    let visualprecision = visualstats[1];
    visualprecision.innerText = weaponprecision;
}

// Récupère les statistiques du personnage depuis le stockage local
function getLife() {
    if (typeof (Storage) !== "undefined") {
        let life = 100;
        if (localStorage.life) {
            life = parseInt(localStorage.life);
        }
        return life;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}
function getEnergy() {
    if (typeof (Storage) !== "undefined") {
        let energy = 100;
        if (localStorage.energy) {
            energy = parseInt(localStorage.energy);
        }
        return energy;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}

function getPrecision() {
    if (typeof (Storage) !== "undefined") {
        let precision = 10;
        if (localStorage.precision) {
            precision = parseInt(localStorage.precision);
        }
        return precision;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}

// Initialise l'inventaire du personnage
function initInventory() {
    let tab = document.querySelectorAll(".slot");

    //On ajoute les listeners aux slots de l'inventaire
    tab.forEach((element, index) => {
        element.addEventListener("click", function () {
            setCurrentItemIndex(index);
        });
    });
    // On affiche les images des items dans les slots
    let inventory = getInventory();
    inventory.forEach((item, index) => {
        if (index < tab.length) {
            tab[index].innerHTML = `<img src="${item.image}" alt="${item.name}" class="item-image" />`;
        }
    });

    //On colore le slot sélectionné
    if (getInventory().length > 0) {
        colorInventory(getCurrentItemIndex());
    }
}


// Inventaire du personnage tableau d'objets
function getInventory() {
    if (typeof (Storage) !== "undefined") {
        let inventory = [];
        if (localStorage.inventory) {
            inventory = JSON.parse(localStorage.inventory);
        }
        return inventory;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}

// Récupère l'index de l'objet courant du personnage
function getCurrentItemIndex() {
    if (typeof (Storage) !== "undefined") {
        let currentItem = 0;
        if (localStorage.currentItem) {
            currentItem = parseInt(localStorage.currentItem);
        }
        return currentItem;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}

// Ajoute un item à l'inventaire du personnage
function addItemToInventory(item) {
    if (typeof (Storage) !== "undefined") {

        let inventory = getInventory();
        //On vérifie si l'item est déjà dans l'inventaire

        if (inventory.find(i => i.name === item.name)) {
            console.log("L'item est déjà dans l'inventaire.");
            return;
        }
        inventory.push(item);
        localStorage.inventory = JSON.stringify(inventory);
        if (inventory.length === 1) {
            // Si c'est le premier item ajouté, on le sélectionne
            setCurrentItemIndex(0);
        }
        // Met à jour l'affichage de l'inventaire
        let slots = document.querySelectorAll(".inventory .slot");
        slots[inventory.length - 1].innerHTML = `<img src="${item.image}" alt="${item.name}" class="item-image" />`;
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}

// Met à jour l'index de l'item courant du personnage
function setCurrentItemIndex(index) {
    if (typeof (Storage) !== "undefined") {
        if (index >= 0 && index < getInventory().length) {
            localStorage.currentItem = index;
            colorInventory(index);
        } else {
            console.log("Index d'item invalide.");
        }
    } else {
        console.log("Erreur, votre navigateur ne supporte pas le stockage local.");
    }
}

//On colore le slot sélectionné
function colorInventory(index) {
    let tab = document.querySelectorAll(".slot");
    tab.forEach(element => {
        element.style.border = "2px solid transparent";
    });
    tab[index].style.border = "2px solid #3498db";
}

