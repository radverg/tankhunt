import { Item_SE } from "./Item_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";
import { Tank_SE } from "./Tank_SE";

var Data : Dat = require("../../shared/Data"); 

/**
 * Item manager can be used to manage items in the game.
 * To continually spawn items, startSpawning() method has to be called and also
 * update method has to be called each game frame.
 */
class ItemManager_SE {

    items: Item_SE[] = [];
    thGame: THGame_SE;
    lastTimeSpawn: number = Date.now();
    spawning: boolean = false;

    constructor(thGame: THGame_SE) {
        this.thGame = thGame;
    }

    update() {
        if (this.spawning && this.thGame.players.length > 0 && Date.now() - this.lastTimeSpawn > 500 * (1 + this.items.length)) {
            this.spawnItem();
        }
    }

    startSpawning() {
        this.spawning = true;
    }

    spawnItem() {
        var newPos = this.thGame.level.getRandomSpawnItems(Data.Items.size, Data.Items.size);
        var newItem = new Item_SE(newPos.x, newPos.y, 0);
        this.lastTimeSpawn = Date.now();
        this.items.push(newItem);

        // Emit spawn
        this.thGame.emitItemSpawn(newItem);
        return newItem;
    }

    checkForTank(tank: Tank_SE) {

        if (tank.specialGun === null || tank.specialGun.wornOut) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].overlapsTank(tank)) {
                    // Take the item
                  //  tank.specialGun = new Weapons[Data.Items.types[this.items[i].typeIndex]](tank.owner);
                    // Remove the item and emit collect
                    this.thGame.emitItemCollect(this.items[i], tank.owner);
                    this.items.splice(i, 1);
                    break;
                }
                
            }
        }

    }

    getItemsPacket(): PacketItem[] {
        var packet = [];
        
        for (let i = 0; i < this.items.length; i++) {
           packet.push(this.items[i].getStatePacket());
        }

        return packet;
    }
}

export { ItemManager_SE };