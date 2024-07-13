const gameData = {
    goldPerKill: 1,
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
    expPerKill: 1
}

function chance(x) {
    return Math.random() + (x / 100) >= 1;
}

function roll(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
}

function heal(x) {
    x.currentHealth = x.maxHealth;
}

function message(message) {
    var log = document.getElementById("log");
    log.value = `${message}\n${log.value}`
}

function levelUp() {
    if (player.exp >= player.expRequired) {
        message("Level up!");
        player.level += 1;
        player.exp -= player.expRequired;
        player.expRequired *= 1.5;
        player.minDmg *= 1.5;
        player.maxDmg *= 1.5;
        player.maxHealth *= 1.5;
        heal(player);
    }
    if (player.level >= 10 && player.critChance == 0) {
        player.critChance += 5;
        document.getElementById("criticalButton").removeAttribute("hidden");
        message("You have unlocked critical strike!");
    }
    if (player.level >= 20 && player.multistrikeChance == 0) {
        player.multistrikeChance += 5;
        document.getElementById("multistrikeButton").removeAttribute("hidden");
        message("You have unlocked multistrike!");
    }
}

function changeMonster() {
    if (monster.isBoss == true) {
        monster.maxHealth = 100 * Math.pow(1.5, monster.level -1);
        gameData.goldPerKill = 10 * Math.pow(1.6, monster.level -1);
        monster.minDmg = 2 * Math.pow(1.5, monster.level -1);
        monster.maxDmg = 4 * Math.pow(1.5, monster.level -1);
        monster.expPerKill = 20 * Math.pow(1.2, monster.level -1);
    } else {
        monster.maxHealth = 10 * Math.pow(1.5, monster.level -1);
        gameData.goldPerKill = Math.pow(1.6, monster.level -1);
        monster.minDmg = Math.pow(1.5, monster.level -1);
        monster.maxDmg = 2 * Math.pow(1.5, monster.level -1);
        monster.expPerKill = Math.pow(1.2, monster.level -1);
    }
    heal(monster);
}

function respawn() {
    if (monster.currentHealth <= 0) {
        player.gold += gameData.goldPerKill;
        player.exp += monster.expPerKill;
        message("You earned " + Math.round(monster.expPerKill) + " experience and " + Math.round(gameData.goldPerKill) + " gold.");
        if (monster.isBoss) {
            gameData.levelUnlocked += 1;
            monster.isBoss = false;
            monster.level += 1;
            gameData.kills = 0;
        }
        changeMonster();
        if (gameData.levelUnlocked == monster.level && gameData.kills < 10) {
            gameData.kills += 1;
        }
    }
    if (player.currentHealth <= 0) {
        player.isAlive = false;
    }
    if (!player.isAlive) {
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
        document.getElementById("log").innerHTML += "Critical strike!\n"
    }
    if (damage > 0 && damage <= health) {
        y.currentHealth -= damage;
    } else if (damage > health) {
        y.currentHealth = 0;
    }
}

function increase(x) {
    if (x == "damage" && player.gold >= gameData.damageCost) {
        player.minDmg += 1;
        player.maxDmg += 2;
        player.gold -= gameData.damageCost;
        gameData.damageCost *= 1.1;
    }
    if (x == "defense" && player.gold >= gameData.defenseCost) {
        player.defense += 1;
        player.gold -= gameData.defenseCost;
        gameData.defenseCost *= 1.1;
    }
    if (x == "critical" && player.gold >= gameData.criticalCost) {
        player.critChance += 1;
        player.gold -= gameData.criticalCost
        gameData.criticalCost *= 1.2;
    }
    if (x == "multistrike" && player.gold >= gameData.multistrikeCost) {
        player.multistrikeChance += 1;
        player.gold -= gameData.multistrikeCost
        gameData.multistrikeCost *= 1.3;
    }
}

function increaseLevel() {
    if (monster.isBoss) {
        monster.isBoss = false; //Give Up
    } else if (gameData.kills >= 10 && gameData.levelUnlocked == monster.level) {
        monster.isBoss = true;
        gameData.bossTimer = 30; //spawns boss and timer 30
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
        case 'player':
            var bar = document.getElementById('playerHealth');
            bar.style.width = percentage + '%';
        case 'monster':
            var bar = document.getElementById('monsterHealth');
            bar.style.width = percentage + '%';
        case 'exp':
            var bar = document.getElementById('exp');
            bar.style.width = percentage + '%';
    }
}

function buttons() {
    if (player.gold < gameData.damageCost) {
        document.getElementById("damageButton").setAttribute("disabled", "");
    } else {
        document.getElementById("damageButton").removeAttribute("disabled");
    }
    if (player.gold < gameData.defenseCost) {
        document.getElementById("defenseButton").setAttribute("disabled", "");
    } else {
        document.getElementById("defenseButton").removeAttribute("disabled");
    }
    if (player.gold < gameData.criticalCost) {
        document.getElementById("criticalButton").setAttribute("disabled", "");
    } else {
        document.getElementById("criticalButton").removeAttribute("disabled");
    }
    if (player.gold < gameData.multistrikeCost) {
        document.getElementById("multistrikeButton").setAttribute("disabled", "");
    } else {
        document.getElementById("multistrikeButton").removeAttribute("disabled");
    }
    if (monster.level == gameData.levelUnlocked && gameData.kills < 10) {
        document.getElementById("levelButton").setAttribute("disabled", "");
    } else {
        document.getElementById("levelButton").removeAttribute("disabled")
    }
    if (monster.isBoss) {
        document.getElementById("delevelButton").setAttribute("disabled", "");
    } else {
        document.getElementById("delevelButton").removeAttribute("disabled");
    }
    if (monster.level == 1) {
        document.getElementById("delevelButton").setAttribute("hidden", "");
    } else {
        document.getElementById("delevelButton").removeAttribute("hidden");
    }
}

function updateGame() {
    document.getElementById("playerHealth").innerHTML = `Health: ${Math.round(player.currentHealth)}/${Math.round(player.maxHealth)}`;
    document.getElementById("playerDamage").innerHTML = `Damage: ${Math.round(player.minDmg)}-${Math.round(player.maxDmg)}`;
    document.getElementById("playerDefense").innerHTML = `Defense: ${player.defense}`;
    document.getElementById("playerLevel").innerHTML = `Level: ${player.level}`;
    document.getElementById("exp").innerHTML = `Experience: ${Math.round(player.exp)}/${Math.round(player.expRequired)}`;
    document.getElementById("currentGold").innerHTML = `Gold: ${Math.round(player.gold)}`;
    if (player.critChance > 0) {
        document.getElementById("playerCritical").innerHTML = `Critical: ${player.critChance}%`;
    }
    if (player.multistrikeChance > 0) {
        document.getElementById("playerMultistrike").innerHTML = "Multistrike: " + player.multistrikeChance + "%";
    }
    if (monster.isBoss) {
        document.getElementById("monsterTitle").innerHTML = "Boss Stats:";
    } else {
        document.getElementById("monsterTitle").innerHTML = "Monster Stats:";
    }
    document.getElementById("monsterHealth").innerHTML = "Health: " + Math.round(monster.currentHealth) + "/" + Math.round(monster.maxHealth);
    document.getElementById("monsterDamage").innerHTML = "Damage: " + Math.round(monster.minDmg) + "-" + Math.round(monster.maxDmg);
    document.getElementById("monsterLevel").innerHTML = "Level: " + monster.level;
    document.getElementById("damageButton").innerHTML = "Increase Damage Cost: " + Math.round(gameData.damageCost);
    document.getElementById("defenseButton").innerHTML = "Increase Defense Cost: " + Math.round(gameData.defenseCost);
    document.getElementById("criticalButton").innerHTML = "Increase Critical Cost: " + Math.round(gameData.criticalCost);
    document.getElementById("multistrikeButton").innerHTML = "Increase Multistrike Cost: " + Math.round(gameData.multistrikeCost);
    if (monster.isBoss) {
        document.getElementById("levelButton").innerHTML = "Give Up"
    } else if (gameData.levelUnlocked == monster.level) {
        document.getElementById("levelButton").innerHTML = "Fight Boss Kills: " + gameData.kills + "/10";
    } else {
        document.getElementById("levelButton").innerHTML = "Increase Level";
    }
    if (monster.isBoss) {
        document.getElementById("bossTimer").removeAttribute("hidden")
        document.getElementById("bossTimer").innerHTML = "Time Remaining: " + gameData.bossTimer;
    } else {
        document.getElementById("bossTimer").setAttribute("hidden", "");
    }
    buttons();
    levelUp();
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

var mainGameLoop = window.setInterval(function() {
    updateGame()
}, 100)

function attackLoop() {
    setTimeout(function () {
        attackLoop();
    }, player.attackSpeed);
    if (player.isAlive) {
        if (chance(player.multistrikeChance)) {
            document.getElementById("log").innerHTML += "Multistrike!\n"
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