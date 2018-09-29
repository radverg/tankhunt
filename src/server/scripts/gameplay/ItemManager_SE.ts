import { Item_SE } from "./Item_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";
import { Tank_SE } from "./Tank_SE";
import { Weapon_SE, Guns, Invisibility_SE } from "./Weapon_SE";

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
    maxItems: number;

    private itemSize: number = 0.9;

    spawnPossibilities: any[] = [
        Guns.BouncingLaserGun,
        Invisibility_SE,
        Guns.EliminatorGun,
        Guns.MineGun,
        Guns.MultiBouncerGun,
        Guns.PulsarGun,
        Guns.LaserGun,
        Guns.FlatLaserGun
    ];

    constructor(thGame: THGame_SE, maxItems: number = 15) {
        this.thGame = thGame;
        this.maxItems = maxItems;
    }

    update() {
        if (this.spawning && this.thGame.players.length > 0 && this.items.length < this.maxItems && Date.now() - this.lastTimeSpawn > 1000 * (1 + this.items.length)) {
            this.spawnItem();
        }
    }

    startSpawning() {
        this.spawning = true;
    }

    spawnItem() {
        
        var newItem: Item_SE = new this.spawnPossibilities[Math.floor(Math.random() * this.spawnPossibilities.length)]();
        var newPos = this.thGame.level.getRandomSpawnItems(newItem.body.w, newItem.body.w);

        newItem.setPos(newPos.x, newPos.y);
        
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
                    // Remove the item and emit collect
                    tank.specialGun = this.items[i];
                    this.items[i].bindOwner(tank.owner);
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

    clear() {
        this.items = [];
    }

    destroy() {
        this.spawning = false;
        this.thGame = null;
        this.clear();
    }
}

export { ItemManager_SE };