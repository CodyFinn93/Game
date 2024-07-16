// function chance(x) {
//     return Math.random() < (x / 100);
// }

// export function roll(min, max) {
//     return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
// }

// export function heal(x) {
//     x.maxHealth = 10 * Math.pow(1.5, x.level -1); //fixes bug :(
//     x.currentHealth = x.maxHealth;
// }

// export function message(message) {
//     var log = document.getElementById("log");
//     log.value = `${message}\n${log.value}`
// }

// export function changeMonster() {
//     if (monster.isBoss == true) {
//         monster.maxHealth = 100 * Math.pow(1.5, monster.level -1);
//         monster.goldPerKill = 10 * Math.pow(1.6, monster.level -1);
//         monster.minDmg = 2 * Math.pow(1.5, monster.level -1);
//         monster.maxDmg = 4 * Math.pow(1.5, monster.level -1);
//         monster.expPerKill = 20 * Math.pow(1.2, monster.level -1);
//     } else {
//         monster.maxHealth = 10 * Math.pow(1.5, monster.level -1);
//         monster.goldPerKill = Math.pow(1.6, monster.level -1);
//         monster.minDmg = Math.pow(1.5, monster.level -1);
//         monster.maxDmg = 2 * Math.pow(1.5, monster.level -1);
//         monster.expPerKill = Math.pow(1.2, monster.level -1);
//     }
//     heal(monster);
// }