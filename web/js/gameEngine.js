let backgroundMusic = new Audio("../assets/sound/fondmusic.mp3");
let combatMusic = new Audio("../assets/sound/combat.mp3");
let deadMusic = new Audio("../assets/sound/perdu.mp3");

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
    const entityData = getEntityByName(name);
    if (entityData) {
        entity.src = entityData.image;
        //On stocke l'entité actuelle
        localStorage.entity = JSON.stringify(entityData);
    }
    gameBox.appendChild(entity);
}

// On supprime l'entité
function clearEntity() {
    const entity = document.getElementById("entity");
    if (entity) {
        entity.remove();
        // On supprime l'entité du stockage local
        localStorage.removeItem("entity");
    }
}

// Récupère les données de l'entité par son nom
function getEntityByName(name) {
    return ENTITIES.find((entity) => entity.name === name);
}

// On change l'image de l'entité
function changeEntityImage(name) {
    const entity = document.getElementById("entity");
    if (entity) {
        const entityData = getEntityByName(name);
        if (entityData) {
            entity.src = entityData.image;
        } else {
            entity.src = `../assets/${name}.png`;
        }
    }
}

// Récupère l'entité actuelle du stockage local
function getCurrentEntity() {
    let entity = null;
    if (localStorage.entity) {
        entity = JSON.parse(localStorage.entity);
    }
    return entity;
}

// Fait apparaitre un coffre
function spawnChest() {
    const gameBox = document.querySelector(".game-box");
    const chest = document.createElement("img");
    chest.className = "chest";
    chest.src = "../assets/coffre.png";
    gameBox.appendChild(chest);
}

// On supprime le coffre
function clearChest() {
    const chest = document.querySelector(".chest");
    if (chest) {
        chest.remove();
    }
}

// Fait apparaitre un trophée
function spawnTrophy() {
    const gameBox = document.querySelector(".game-box");
    const trophy = document.createElement("img");
    trophy.className = "trophy";
    trophy.src = "../assets/trophy.png";
    gameBox.appendChild(trophy);
}

// On supprime le trophée
function clearTrophy() {
    const trophy = document.querySelector(".trophy");
    if (trophy) {
        trophy.remove();
    }
}

// Statistiques du personnage

function initStats() {
    // On initialise les statistiques du personnage
    if (!localStorage.life) {
        localStorage.life = 100; // Vie initiale
    }
    if (!localStorage.energy) {
        localStorage.energy = 100; // Énergie initiale
    }
    if (!localStorage.precision) {
        localStorage.precision = 10; // Précision initiale
    }

    // On affiche les statistiques dans la div statline
    let visualstats = document.querySelectorAll(".statline span");
    let visuallife = visualstats[0];
    visuallife.innerText = localStorage.life + "PV";
    let visualprecision = visualstats[1];
    visualprecision.innerText = localStorage.precision;
    let visualenergy = visualstats[2];
    visualenergy.innerText = localStorage.energy;
}

function updateLife(newLife) {
    if (newLife < 0) {
        newLife = 0;
    }
    //On stocke la vie dans le localStorage
    localStorage.life = newLife;

    let visualstats = document.querySelectorAll(".statline span"); //on prend que les span dans la div statline
    let visuallife = visualstats[0];
    visuallife.innerText = newLife + "PV";
}

function updateEnergy(cost) {
    let energy = getEnergy();
    energy = energy - cost;
    if (energy < 0) {
        energy = 0;
    }
    //On stocke l'énergie dans le localStorage
    localStorage.energy = energy;

    let visualstats = document.querySelectorAll(".statline span"); //on prend que les span dans la div statline
    let visualenergy = visualstats[2];
    visualenergy.innerText = energy;
}

function updatePrecision(weaponprecision) {
    let precision = getPrecision();
    precision = weaponprecision;
    if (precision < 0) {
        precision = 0;
    }
    //On stocke la précision dans le localStorage
    localStorage.precision = precision;

    let visualstats = document.querySelectorAll(".statline span"); //on prend que les span dans la div statline
    let visualprecision = visualstats[1];
    visualprecision.innerText = weaponprecision;
}

// Récupère les statistiques du personnage depuis le stockage local
function getLife() {
    return parseInt(localStorage.life);
}
function getEnergy() {
    return parseInt(localStorage.energy);
}

function getPrecision() {
    return parseInt(localStorage.precision);
}

// Initialise l'inventaire du personnage
function initInventory() {
    let tab = document.querySelectorAll(".slot");

    //On ajoute les listeners aux slots de l'inventaire
    tab.forEach((element, index) => {
        element.addEventListener("click", function () {
            setCurrentItemIndex(index);
            //easter egg calculatrice
            let item = getInventory()[index];
            if (item.name == "Calculatrice") {
                let result = prompt("Veuillez entrer un chiffre");
                result = parseInt(result);
                if (result >= 12) {
                    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; //redirige vers le lien ytb
                } else if (result > 0) {
                    window.location.href = result + ".html";
                }
            }
        });
    });
    // On affiche les images des items dans les slots
    let inventory = getInventory();
    inventory.forEach((item, index) => {
        if (index < tab.length) {
            tab[
                index
            ].innerHTML = `<img src="${item.image}" alt="${item.name}" class="item-image" />`;
            initItemTooltip(tab[index], item);
        }
    });

    //On colore le slot sélectionné
    if (getInventory().length > 0) {
        colorInventory(getCurrentItemIndex());
    }
}
// Ajoute un tooltip sur un item de l'inventaire
function initItemTooltip(slotComponent, item) {
    // Ajout du tooltip sur l'image de l'item
    const img = slotComponent.querySelector(".item-image");
    if (img) {
        img.addEventListener("mouseenter", function (e) {
            let tooltip = document.createElement("div");
            tooltip.className = "item-tooltip";
            // Affiche les détails de l'item sauf pour la banane
            if (item.name === "Banane") {
                tooltip.innerHTML = `<strong>${item.name}</strong><br>Dégâts : ?<br>Précision : ?`;
            } else {
                tooltip.innerHTML = `<strong>${item.name}</strong><br>Dégâts : ${item.damage}<br>Précision : ${item.precision}`;
            }
            document.body.appendChild(tooltip);
            // Positionnement du tooltip près de la souris
            const rect = img.getBoundingClientRect();
            tooltip.style.left = rect.right + 10 + "px";
            tooltip.style.top = rect.top + "px";
        });
        img.addEventListener("mouseleave", function () {
            const tooltip = document.querySelector(".item-tooltip");
            if (tooltip) tooltip.remove();
        });
    }
}

// Inventaire du personnage tableau d'objets
function getInventory() {
    let inventory = [];
    if (localStorage.inventory) {
        inventory = JSON.parse(localStorage.inventory);
    }
    return inventory;
}

// Récupère l'index de l'objet courant du personnage
function getCurrentItemIndex() {
    let currentItem = 0;
    if (localStorage.currentItem) {
        currentItem = parseInt(localStorage.currentItem);
    }
    return currentItem;
}

// Ajoute un item à l'inventaire du personnage
function addItemToInventory(item) {
    let inventory = getInventory();
    //On vérifie si l'item est déjà dans l'inventaire

    if (inventory.find((i) => i.name === item.name)) {
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
    slots[
        inventory.length - 1
    ].innerHTML = `<img src="${item.image}" alt="${item.name}" class="item-image" />`;
    initItemTooltip(slots[inventory.length - 1], item);
}

// Supprime un item de l'inventaire du personnage
function removeItemFromInventory(index) {
    let inventory = getInventory();
    if (index >= 0 && index < inventory.length) {
        // Supprime l'item à l'index donné
        inventory.splice(index, 1);
        localStorage.inventory = JSON.stringify(inventory);

        // Réorganise l'affichage de l'inventaire pour déplacer les items restants vers le début
        let slots = document.querySelectorAll(".inventory .slot");
        // Efface tous les slots
        slots.forEach((slot) => {
            slot.innerHTML = "";
            slot.style.border = "2px solid transparent";
        });
        // Réaffiche les items restants
        inventory.forEach((item, idx) => {
            slots[
                idx
            ].innerHTML = `<img src="${item.image}" alt="${item.name}" class="item-image" />`;
            initItemTooltip(slots[idx], item);
        });

        // Met à jour l'index courant si besoin
        let currentIndex = getCurrentItemIndex();
        if (currentIndex >= inventory.length) {
            setCurrentItemIndex(Math.max(0, inventory.length - 1));
        } else if (currentIndex === index) {
            setCurrentItemIndex(Math.max(0, index - 1));
        } else {
            colorInventory(getCurrentItemIndex());
        }
    }
}

// Met à jour l'index de l'item courant du personnage
function setCurrentItemIndex(index) {
    if (index >= 0 && index < getInventory().length) {
        localStorage.currentItem = index;
        colorInventory(index);
        updatePrecision(getInventory()[index].precision);
    }
}

// Savoir si le joueur possède l'item demandé
function hasItem(itemName) {
    const inventory = getInventory();
    return inventory.some((item) => item.name === itemName);
}

//On colore le slot sélectionné
function colorInventory(index) {
    let tab = document.querySelectorAll(".slot");
    tab.forEach((element) => {
        element.style.border = "2px solid transparent";
    });
    tab[index].style.border = "2px solid #3498db";
}

// On démarre le mode combat
function startFight() {
    showHealthBar();
    backgroundMusic.pause();
    // Lancer la musique de combat
    combatMusic.play();
}

// On arrête le mode combat
function stopFight() {
    removeHealthBar();
    combatMusic.pause();
    // Lancer la musique de fond
    backgroundMusic.play();
}

// Affiche la barre de vie de l'entité et du joueur
function showHealthBar() {
    // Création de la barre de vie
    let entityHealthBar = document.createElement("div");
    entityHealthBar.id = "entity-health-bar";
    entityHealthBar.className = "health-bar";
    entityHealthBar.style.left =
        document.getElementById("entity").offsetLeft + "px";
    let playerHealthBar = document.createElement("div");
    playerHealthBar.id = "player-health-bar";
    playerHealthBar.className = "health-bar";
    playerHealthBar.style.left =
        document.getElementById("player").offsetLeft - 15 + "px";

    // Jauge de vie
    const entityBar = document.createElement("div");
    entityBar.id = "entity-health-bar-inner";
    entityBar.className = "health-bar-inner";
    entityHealthBar.appendChild(entityBar);
    const playerBar = document.createElement("div");
    playerBar.id = "player-health-bar-inner";
    playerBar.className = "health-bar-inner";
    playerHealthBar.appendChild(playerBar);

    // Ajout dans la game-box
    const gameBox = document.querySelector(".game-box");
    gameBox.appendChild(entityHealthBar);
    gameBox.appendChild(playerHealthBar);

    updateHealthBar("player", getLife());
}

// Met à jour la barre de vie de l'entité ou du joueur
function updateHealthBar(healthId, currentLife, maxLife = 100) {
    const healthBar = document.getElementById(`${healthId}-health-bar-inner`);
    if (healthBar) {
        // Calcul du pourcentage de vie restante
        let newLife = Math.round((currentLife / maxLife) * 100);
        // Met à jour la largeur de la barre de vie en fonction de la santé restante
        healthBar.style.width = `${newLife}%`;
        // Change la couleur de la barre en fonction de la santé
        if (newLife > 50) {
            healthBar.style.backgroundColor = "green";
        } else if (newLife > 20) {
            healthBar.style.backgroundColor = "orange";
        } else {
            healthBar.style.backgroundColor = "red";
        }
    }
}
// Supprime les barres de vie
function removeHealthBar() {
    const healthBars = document.querySelectorAll(".health-bar");
    healthBars.forEach((healthBar) => healthBar.remove());
}

// Tire un projectile d'un élément à un autre
function shootProjectile(fromPlayer = true, duration = 700, rotate = true) {
    return new Promise((resolve) => {
        const fromElem = fromPlayer
            ? document.getElementById("player")
            : document.getElementById("entity");
        const toElem = fromPlayer
            ? document.getElementById("entity")
            : document.getElementById("player");
        if (!fromElem || !toElem) return resolve();

        // Création du projectile
        const projectile = document.createElement("img");
        projectile.className = "projectile";
        //On récupère l'image du projectile en fonction de l'attaquant
        let image = "../assets/potato.png";
        if (fromPlayer) {
            const item = getInventory()[getCurrentItemIndex()];
            if (item) {
                // Si l'item a une image de projectile, on l'utilise
                if (item.projectile) {
                    image = item.projectile.image;
                    rotate = item.projectile.rotate;
                } else {
                    image = item.image;
                }
            }
        } else {
            const entity = getCurrentEntity();
            if (entity && entity.projectileImage) {
                image = entity.projectileImage;
            }
        }
        if (rotate) {
            projectile.classList.add("rotate");
        }
        projectile.src = image;

        // Ajout dans la game-box
        const gameBox = document.querySelector(".game-box");
        gameBox.appendChild(projectile);

        // Position de départ (centre du lanceur)
        const fromRect = fromElem.getBoundingClientRect();
        const toRect = toElem.getBoundingClientRect();
        const gameBoxRect = gameBox.getBoundingClientRect();
        // On fait quelques ajustements pour que ça fonctionne bien
        const startX = fromRect.left + fromRect.width / 2 - gameBoxRect.left - 20;
        const startY = fromRect.top + fromRect.height / 2 - gameBoxRect.top - 20;
        const endX = toRect.left + toRect.width / 2 - gameBoxRect.left - 20;
        const endY = toRect.top + toRect.height / 2 - gameBoxRect.top - 20;
        projectile.style.left = `${startX}px`;
        projectile.style.top = `${startY}px`;

        // Animation jusqu'à la cible;
        const startTime = performance.now();
        function animateProjectile(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const x = startX + (endX - startX) * progress;
            const y = startY + (endY - startY) * progress;
            projectile.style.left = `${x}px`;
            projectile.style.top = `${y}px`;
            if (progress < 1) {
                requestAnimationFrame(animateProjectile);
            } else {
                projectile.remove();
                resolve();
            }
        }
        requestAnimationFrame(animateProjectile);
    });
}

// Tire un projectile qui rate la cible (quand la précision est insuffisante)
function shootMissedProjectile() {
    return new Promise((resolve) => {
        const fromElem = document.getElementById("player");
        const toElem = document.getElementById("entity");
        if (!fromElem || !toElem) return resolve();

        // Création du projectile
        const projectile = document.createElement("img");
        projectile.className = "projectile";

        // Image du projectile depuis l'inventaire du joueur
        let image = "../assets/potato.png";
        const item = getInventory()[getCurrentItemIndex()];
        if (item) {
            // Si l'item a une image de projectile, on l'utilise
            if (item.projectile) {
                image = item.projectile.image;
            } else {
                image = item.image;
            }
        }
        projectile.src = image;

        // Ajout dans la game-box
        const gameBox = document.querySelector(".game-box");
        gameBox.appendChild(projectile);

        // Position de départ (centre du joueur)
        const fromRect = fromElem.getBoundingClientRect();
        const toRect = toElem.getBoundingClientRect();
        const gameBoxRect = gameBox.getBoundingClientRect();

        const startX = fromRect.left + fromRect.width / 2 - gameBoxRect.left - 20;
        const startY = fromRect.top + fromRect.height / 2 - gameBoxRect.top - 20;
        const endX = toRect.left + toRect.width / 2 - gameBoxRect.left - 20;
        const endY = toRect.top + toRect.height / 2 - gameBoxRect.top - 20;

        // Déviation du tir raté : toujours au-dessus de l'entité
        const missOffsetY = -80 - Math.random() * 60; // toujours au-dessus
        const missOffsetX = Math.random() * 40 - 20; // léger aléa horizontal

        const finalX = endX + missOffsetX;
        const finalY = endY + missOffsetY;

        projectile.style.left = `${startX}px`;
        projectile.style.top = `${startY}px`;

        // Animation vers la mauvaise direction (au-dessus de l'entité)
        const duration = 700;
        const startTime = performance.now();
        function animateProjectile(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const x = startX + (finalX - startX) * progress;
            const y = startY + (finalY - startY) * progress;
            projectile.style.left = `${x}px`;
            projectile.style.top = `${y}px`;
            if (progress < 1) {
                requestAnimationFrame(animateProjectile);
            } else {
                projectile.remove();
                resolve();
            }
        }
        requestAnimationFrame(animateProjectile);
    });
}

// L'entité attaque le joueur
function entityAttackPlayer(rotateprojectile = true) {
    return new Promise((resolve) => {
        // On envoie un projectile vers le joueur
        shootProjectile(false, 700, rotateprojectile).then(() => {
            const entity = getCurrentEntity();
            // On met à jour la vie du joueur
            updateLife(getLife() - entity.damage);
            const life = getLife();
            updateHealthBar("player", life);
            if (life <= 0) {
                //Le joueur est mort
                gameOver();
            }
            resolve();
        });
    });
}

// Le joueur attaque l'entité
function playerAttackEntity() {
    return new Promise((resolve) => {
        const inventory = getInventory();
        const currentItemIndex = getCurrentItemIndex();
        let item;
        if (currentItemIndex < 0 || currentItemIndex >= inventory.length) {
            // Item par défaut si l'index est invalide
            item = {
                name: "Patate",
                damage: 2,
                image: "../assets/potato.png",
                precision: 100,
            };
        } else {
            // On récupère l'item courant
            item = inventory[currentItemIndex];
        }
        const entity = getCurrentEntity();

        // Si l'entité est morte, on ne fait rien
        if (!entity) {
            return;
        }

        // Plus la précision est élevée, moins il y a de chance de rater
        const miss = 1 / item.precision;
        if (Math.random() < miss) {
            shootMissedProjectile().then(() => {
                resolve();
            });
        } else {
            // On tire le projectile
            shootProjectile().then(() => {
                // On met à jour la vie de l'entité
                updateHealthBar(
                    "entity",
                    entity.life - item.damage,
                    getEntityByName(entity.name).life
                );

                // On met à jour l'entité dans le stockage local
                localStorage.entity = JSON.stringify({
                    ...entity,
                    life: entity.life - item.damage,
                });

                //Banane à usage unique
                if (item.name === "Banane") {
                    removeItemFromInventory(currentItemIndex);
                }

                // Victoire
                if (entity.life - item.damage <= 0) {
                    removeHealthBar();
                    clearEntity();
                    // Gérer la victoire
                }
                resolve();
            });
        }
    });
}

// Modale de game over
function gameOver() {
    // Overlay sombre
    const overlay = document.createElement("div");
    overlay.id = "gameover-overlay";
    overlay.className = "gameover-overlay";

    // Modale
    const modal = document.createElement("div");
    modal.id = "gameover-modal";
    modal.className = "gameover-modal";

    // Titre
    const title = document.createElement("h2");
    title.innerText = "Vous avez perdu !";
    title.className = "gameover-title";
    modal.appendChild(title);

    // Message
    const msg = document.createElement("p");
    msg.innerText = "Votre aventure s'arrête ici...";
    msg.className = "gameover-message";
    modal.appendChild(msg);

    // Boutons
    const btns = document.createElement("div");
    btns.className = "gameover-btns";

    // Bouton du totem d'immortalité
    if (hasItem("Totem d'immortalité")) {
        const totemBtn = document.createElement("button");
        totemBtn.innerText = "Utiliser le Totem";
        totemBtn.className = "btn";
        totemBtn.addEventListener("click", () => {
            // On supprime le totem de l'inventaire
            const inventory = getInventory();
            // On cherche l'index du totem dans l'inventaire
            const totemIndex = inventory.findIndex(
                (item) => item.name === "Totem d'immortalité"
            );
            removeItemFromInventory(totemIndex);
            // On restaure la vie du joueur
            updateLife(100);
            // On reload la page pour relancer le combat
            window.location.reload();
        });
        btns.appendChild(totemBtn);
    } else {
        // Bouton recommencer
        const retryBtn = document.createElement("button");
        retryBtn.innerText = "Recommencer";
        retryBtn.className = "btn";
        retryBtn.addEventListener("click", () => {
            // On vide le stockage local pour recommencer
            localStorage.clear();
            // On envoie le joueur vers le premier chapitre
            window.location.href = "1.html";
        });
        btns.appendChild(retryBtn);
    }

    // Bouton quitter
    const quitBtn = document.createElement("button");
    quitBtn.innerText = "Quitter";
    quitBtn.className = "btn";
    quitBtn.addEventListener(
        "click",
        () => (window.location.href = "../index.html")
    );
    btns.appendChild(quitBtn);

    modal.appendChild(btns);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    combatMusic.pause();
    backgroundMusic.pause();

    // Lancer la musique de combat
    deadMusic.play();
}

function initSounds() {
    backgroundMusic.loop = true; // Pour que la musique de fond tourne en boucle
    combatMusic.loop = true;
    deadMusic.loop = true;

    document.addEventListener("click", () => {
        if (backgroundMusic.paused && combatMusic.paused && deadMusic.paused) {
            backgroundMusic.play();
        }
    });
}
