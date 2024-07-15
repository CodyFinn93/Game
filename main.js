const gameData = {
    damageCost: 1,
    defenseCost: 1,
    criticalCost: 100,
    multistrikeCost: 10000,
    kills : 0,
    levelUnlocked: 1,
    bossTimer: 0
}

const player = {
    isAlive: true,
    level: 1,
    exp: 0,
    expRequired: 20,
    gold: 0,
    minDmg: 1,
    maxDmg: 2,
    currentHealth: 10,
    maxHealth: 10,
    defense: 0,
    critChance: 0,
    critDmg: 2,
    multistrikeChance: 0,
    multistrikeCount: 2,
    attackSpeed: 1000
}

const monster = {
    isAlive: true,
    isBoss: false,
    level: 1,
    minDmg: 1,
    maxDmg: 2,
    currentHealth: 10,
    maxHealth: 10,
    defense: 0,
    critChance: 0,
    critDmg: 1,
    expPerKill: 1,
    goldPerKill: 1
}

class weaponObject {
    constructor(name, type, level, quantity, damage, equipped) {
        this.name = name;
        this.type = type;
        this.level = level;
        this.quantity = quantity;
        this.damage = damage;
        this.equipped = equipped;
    }
}

class armorObject {
    constructor(name, type, level, quantity, defense, equipped) {
        this.name = name;
        this.type = type;
        this.level = level;
        this.quantity = quantity;
        this.defense = defense;
        this.equipped = equipped;
    }
}

// Function to create objects with different attributes
function createWeapon(name, type, level, quantity, damage, equipped) {
    return new weaponObject(name, type, level, quantity, damage, equipped);
}

function createArmor(name, type, level, quantity, defense, equipped) {
    return new armorObject(name, type, level, quantity, defense, equipped);
}

const inventory = [];

function addItem(item) {
    inventory.push(item);
    renderInventory();
}

function removeItem(item) {
    let index = inventory.indexOf(item);
    if (index !== -1) {
        inventory.splice(index, 1);
    }
    renderInventory();
}

function renderInventory() {
    let container = document.getElementById('inventory');
    container.innerHTML = '';

    inventory.forEach(item => {
        let itemElement = document.createElement('div');
        let itemButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        itemButton.addEventListener("click", () => {toggleEquip(item)});
        deleteButton.addEventListener("click", () => {removeItem(item)});
        itemElement.textContent = `${item.name}`;
        if (!item.equipped) {
            itemButton.textContent = "Equip";
        } else {
            itemButton.textContent = "Unequip";
        }
        deleteButton.textContent = "Delete";
        container.appendChild(itemElement);
        container.appendChild(itemButton);
        container.appendChild(deleteButton);
    });
}

function toggleEquip(item) {
    if (!item.equipped) {
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].type == item.type && inventory[i].equipped) {
                inventory[i].equipped = false;
            }
        }
        item.equipped = true;
    } else {
        item.equipped = false;
    }
    renderInventory();
}

function getWeaponDamage() {
    let result = 0;
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].type == "Weapon" && inventory[i].equipped == true) {
            result = inventory[i].damage;
        }
    }
    return result;
}

function getArmorDefense() {
    let result = 0;
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].type == "Armor" && inventory[i].equipped == true) {
            result = inventory[i].defense;
        }
    }
    return result;
}

function renderStats() {
    if (player.exp >= player.expRequired) {
        message("Level up!");
        player.level += 1;
        player.exp -= player.expRequired;
        player.expRequired *= 1.5;
        heal(player);
    }
    player.minDmg = Math.pow(1.5, player.level -1) + (getWeaponDamage());
    player.maxDmg = 2 * Math.pow(1.5, player.level -1) + (getWeaponDamage());
    player.maxHealth = 10 * Math.pow(1.5, player.level -1);
    player.defense = (getArmorDefense());
    if (player.level >= 10 && player.critChance == 0) {
        player.critChance += 5;
        message("You have unlocked critical strike!");
    }
    if (player.level >= 20 && player.multistrikeChance == 0) {
        player.multistrikeChance += 5;
        message("You have unlocked multistrike!");
    }
}

function chance(x) {
    return Math.random() + (x / 100) >= 1;
}

function roll(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
}

function heal(x) {
    x.maxHealth = 10 * Math.pow(1.5, x.level -1); //fixes bug :(
    x.currentHealth = x.maxHealth;
}

function message(message) {
    var log = document.getElementById("log");
    log.value = `${message}\n${log.value}`
}

function changeMonster() {
    if (monster.isBoss == true) {
        monster.maxHealth = 100 * Math.pow(1.5, monster.level -1);
        monster.goldPerKill = 10 * Math.pow(1.6, monster.level -1);
        monster.minDmg = 2 * Math.pow(1.5, monster.level -1);
        monster.maxDmg = 4 * Math.pow(1.5, monster.level -1);
        monster.expPerKill = 20 * Math.pow(1.2, monster.level -1);
    } else {
        monster.maxHealth = 10 * Math.pow(1.5, monster.level -1);
        monster.goldPerKill = Math.pow(1.6, monster.level -1);
        monster.minDmg = Math.pow(1.5, monster.level -1);
        monster.maxDmg = 2 * Math.pow(1.5, monster.level -1);
        monster.expPerKill = Math.pow(1.2, monster.level -1);
    }
    heal(monster);
}

function reward() {
    player.gold += monster.goldPerKill;
    player.exp += monster.expPerKill;
    message(`You earned ${Math.round(monster.expPerKill)} experience and ${Math.round(monster.goldPerKill)} gold.`);
    if (chance(5) && inventory.length < 5) {
        addItem(createWeapon("Sword", "Weapon", 1, 1, 2 * monster.level, false));
        message("You found a sword!");
    }
    if (chance(5) && inventory.length < 5) {
        addItem(createArmor("Armor", "Armor", 1, 1, monster.level, false));
        message("You found armor!");
    }
}
function respawn() {
    if (monster.currentHealth <= 0) {
        reward();
        if (monster.isBoss) {
            gameData.levelUnlocked += 1;
            monster.isBoss = false;
            monster.level += 1;
            gameData.kills = 0;
        }

        if (gameData.levelUnlocked == monster.level && gameData.kills < 10) {
            gameData.kills += 1;
        }
        changeMonster();
    }

    if (player.currentHealth <= 0) {
        player.isAlive = false;
    }

    if (!player.isAlive) { //slowly regenerates player life after they die
        if (player.currentHealth < player.maxHealth) {
            player.currentHealth += (player.maxHealth * 0.05)
            if (player.currentHealth > player.maxHealth) {
                player.currentHealth = player.maxHealth;
            }
        } else {
            player.isAlive = true;
        }
    }
}

function attack(x, y) {
    let damage = roll(x.minDmg, x.maxDmg) - y.defense;
    let health = y.currentHealth;

    if (chance(x.critChance)) {
        damage *= x.critDmg;
        message("Critical strike!")
    }
    if (damage > 0 && damage <= health) {
        y.currentHealth -= damage;
    } else if (damage > health) {
        y.currentHealth = 0;
    }
}

function increaseLevel() {
    if (monster.isBoss) {
        monster.isBoss = false; //Give Up button
    } else if (gameData.kills >= 10 && gameData.levelUnlocked == monster.level) {
        monster.isBoss = true;
        gameData.bossTimer = 10; //spawns boss and timer 30
    } else if (gameData.levelUnlocked > monster.level) {
        monster.level += 1; //raises level if farming lower levels
    }
    changeMonster();
}

function decreaseLevel() {
    if (monster.level > 1) {
        monster.level -= 1;
        changeMonster();
    }
}

function updateBars(current, maximum, x) { 
    var percentage = (current / maximum) * 100;
    switch(x) {
        case 'player': //update player hp bar
            var bar = document.getElementById('playerHealthBar');
            bar.style.width = percentage + '%';
        case 'monster': //update monster hp bar
            var bar = document.getElementById('monsterHealthBar');
            bar.style.width = percentage + '%';
        case 'exp': //update exp bar
            var bar = document.getElementById('expBar');
            bar.style.width = percentage + '%';
    }
}

function buttons() { //hides or disables buttons
    let levelButton = document.getElementById("levelButton");
    let delevelButton = document.getElementById("delevelButton");
    let playerDefense = document.getElementById("playerDefense");
    let playerCritical = document.getElementById("playerCritical");
    let playerMultistrike = document.getElementById("playerMultistrike");

    monster.level == gameData.levelUnlocked && gameData.kills < 10 ? levelButton.setAttribute("disabled", "") : levelButton.removeAttribute("disabled");
    monster.isBoss ? delevelButton.setAttribute("disabled", "") : delevelButton.removeAttribute("disabled");
    monster.level == 1 ? delevelButton.setAttribute("hidden", "") : delevelButton.removeAttribute("hidden");

    player.defense ? playerDefense.removeAttribute("hidden") : playerDefense.setAttribute("hidden", "");
    player.critChance ? playerCritical.removeAttribute("hidden") : playerCritical.setAttribute("hidden", "");
    player.multistrikeChance ? playerMultistrike.removeAttribute("hidden") : playerMultistrike.setAttribute("hidden", "");
}

function updateGame() {
    document.getElementById("playerHealth").innerHTML = `Health: ${Math.round(player.currentHealth)}/${Math.round(player.maxHealth)}`;
    document.getElementById("playerDamage").innerHTML = `Damage: ${Math.round(player.minDmg)}-${Math.round(player.maxDmg)}`;
    document.getElementById("playerDefense").innerHTML = `Defense: ${player.defense}`;
    document.getElementById("playerCritical").innerHTML = `Critical: ${player.critChance}%`;
    document.getElementById("playerMultistrike").innerHTML = "Multistrike: " + player.multistrikeChance + "%";
    document.getElementById("playerLevel").innerHTML = `Level: ${player.level}`;
    document.getElementById("exp").innerHTML = `Experience: ${Math.round(player.exp)}/${Math.round(player.expRequired)}`;
    document.getElementById("currentGold").innerHTML = `Gold: ${Math.round(player.gold)}`;    
    document.getElementById("monsterHealth").innerHTML = `Health: ${Math.round(monster.currentHealth)}/${Math.round(monster.maxHealth)}`;
    document.getElementById("monsterDamage").innerHTML = `Damage: ${Math.round(monster.minDmg)}-${Math.round(monster.maxDmg)}`;
    document.getElementById("monsterLevel").innerHTML = `Level: ${monster.level}`;

    if (monster.isBoss) {
        document.getElementById("bossTimer").removeAttribute("hidden")
        document.getElementById("bossTimer").innerHTML = "Time Remaining: " + gameData.bossTimer;
        document.getElementById("levelButton").innerHTML = "Give Up"
        document.getElementById("monsterTitle").innerHTML = "Boss Stats:";
    } else {
        document.getElementById("monsterTitle").innerHTML = "Monster Stats:";
        document.getElementById("bossTimer").setAttribute("hidden", "");
        if (gameData.levelUnlocked == monster.level) {
            document.getElementById("levelButton").innerHTML = "Fight Boss Kills: " + gameData.kills + "/10";
        } else {
            document.getElementById("levelButton").innerHTML = "Increase Level";
        }
    }

    buttons();
    renderStats();
    updateBars(player.currentHealth, player.maxHealth, 'player');
    updateBars(monster.currentHealth, monster.maxHealth, 'monster');
    updateBars(player.exp, player.expRequired, 'exp');    
    respawn();
}



function togglePoyo() {
    if (document.getElementById("poyo").hasAttribute("hidden")) {
        document.getElementById("poyo").removeAttribute("hidden");
        document.getElementById("poyoButton").innerHTML = "Hide Poyo";
    } else {
        document.getElementById("poyo").setAttribute("hidden", "");
        document.getElementById("poyoButton").innerHTML = "Show Poyo";
    }
}




// Game loop stuff


var mainGameLoop = window.setInterval(function() {
    updateGame()
}, 100)

function attackLoop() {
    setTimeout(function () {
        attackLoop();
    }, player.attackSpeed);
    if (player.isAlive) {
        if (chance(player.multistrikeChance)) {
            message("Multistrike!")
            for (let i = 0; i < player.multistrikeCount; i++) {
                attack(player, monster);
                console.log('multistrike ' + (i + 1) + '!');
            }
        } else {
            attack(player, monster);
        }
    }
}

function monsterAttackLoop() {
    setTimeout(function () {
        monsterAttackLoop();
    }, 1000);
    if (monster.currentHealth > 0 && player.isAlive) {
        attack(monster, player);
    }
    if (monster.isBoss) {
        if (gameData.bossTimer > 0) {
            gameData.bossTimer -= 1
        } else {
            monster.isBoss = false;
            changeMonster();
        }
    }
}

setTimeout(function () {
    attackLoop();
    monsterAttackLoop();
}, 1000);

function speedHack() {
    if (player.attackSpeed == 1000) {
        player.attackSpeed = 100;
        document.getElementById("speedButton").innerHTML = "Speed Hack On"
    } else {
        player.attackSpeed = 1000;
        document.getElementById("speedButton").innerHTML = "Speed Hack Off"
    }
}