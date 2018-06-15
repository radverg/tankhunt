var Data = require("../../shared/Data"); 
var Item = require("./Item");
var Weapons = require("./Weapon");

/**
 * Item manager can be used to manage items in the game.
 * To continually spawn items, startSpawning() method has to be called and also
 * update method has to be called each game frame.
 */
class ItemManager {
    constructor(thGame) {
        this.items = [];
        this.thGame = thGame;
        this.lastTimeSpawn = Date.now();

        this.spawning = false;
    }

    update() {
        if (this.spawning && this.thGame.players.length > 0 && Date.serverTime - this.lastTimeSpawn > 500 * (1 + this.items.length)) {
            this.spawnItem();
        }
    }

    startSpawning() {
        this.spawning = true;
    }

    spawnItem() {
        var newPos = this.thGame.level.getRandomSpawnItems(Data.Items.size, Data.Items.size);
        var newItem = new Item(newPos.x, newPos.y);
        this.lastTimeSpawn = Date.serverTime;
        this.items.push(newItem);

        // Emit spawn
        this.thGame.emitItemSpawn(newItem);
        return newItem;
    }

    checkForTank(tank) {

        if (tank.specialGun === null || tank.specialGun.wornOut) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].overlapsTank(tank)) {
                    // Take the item
                    tank.specialGun = new Weapons[Data.Items.types[this.items[i].typeIndex]](tank.owner);
                    // Remove the item and emit collect
                    this.thGame.emitItemCollect(this.items[i], tank.owner);
                    this.items.splice(i, 1);
                    break;
                }
                
            }
        }

    }
}

module.exports = ItemManager;