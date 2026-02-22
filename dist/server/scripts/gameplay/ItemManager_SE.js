"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemManager_SE = void 0;
var Weapon_SE_1 = require("./Weapon_SE");
var ItemManager_SE = (function () {
    function ItemManager_SE(thGame, maxItems) {
        if (maxItems === void 0) { maxItems = 15; }
        this.items = [];
        this.lastTimeSpawn = Date.now();
        this.spawning = false;
        this.itemSize = 0.9;
        this.spawnPossibilities = [
            Weapon_SE_1.Guns.BouncingLaserGun,
            Weapon_SE_1.Invisibility_SE,
            Weapon_SE_1.Guns.EliminatorGun,
            Weapon_SE_1.Guns.MineGun,
            Weapon_SE_1.Guns.MultiBouncerGun,
            Weapon_SE_1.Guns.PulsarGun,
            Weapon_SE_1.Guns.LaserGun,
            Weapon_SE_1.Guns.FlatLaserGun
        ];
        this.thGame = thGame;
        this.maxItems = maxItems;
    }
    ItemManager_SE.prototype.update = function () {
        if (this.spawning && this.thGame.players.length > 0 && this.items.length < this.maxItems && Date.now() - this.lastTimeSpawn > 1000 * (1 + this.items.length)) {
            this.spawnItem();
        }
    };
    ItemManager_SE.prototype.startSpawning = function () {
        this.spawning = true;
    };
    ItemManager_SE.prototype.spawnItem = function () {
        var newItem = new this.spawnPossibilities[Math.floor(Math.random() * this.spawnPossibilities.length)]();
        var newPos = this.thGame.level.getRandomSpawnItems(newItem.body.w, newItem.body.w);
        newItem.setPos(newPos.x, newPos.y);
        this.lastTimeSpawn = Date.now();
        this.items.push(newItem);
        if (Math.random() < 0.1) {
            var temp = newItem.typeIndex;
            newItem.typeIndex = 9;
            this.thGame.emitItemSpawn(newItem);
            newItem.typeIndex = temp;
        }
        else {
            this.thGame.emitItemSpawn(newItem);
            return newItem;
        }
    };
    ItemManager_SE.prototype.checkForTank = function (tank) {
        if (tank.specialGun === null || tank.specialGun.wornOut) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].overlapsTank(tank)) {
                    tank.specialGun = this.items[i];
                    this.items[i].bindOwner(tank.owner);
                    this.thGame.emitItemCollect(this.items[i], tank.owner);
                    this.items.splice(i, 1);
                    break;
                }
            }
        }
    };
    ItemManager_SE.prototype.getItemsPacket = function () {
        var packet = [];
        for (var i = 0; i < this.items.length; i++) {
            packet.push(this.items[i].getStatePacket());
        }
        return packet;
    };
    ItemManager_SE.prototype.clear = function () {
        this.items = [];
    };
    ItemManager_SE.prototype.destroy = function () {
        this.spawning = false;
        this.thGame = null;
        this.clear();
    };
    return ItemManager_SE;
}());
exports.ItemManager_SE = ItemManager_SE;
