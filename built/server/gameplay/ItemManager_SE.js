"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Item_SE_1 = require("./Item_SE");
var Data = require("../../shared/Data");
var ItemManager_SE = (function () {
    function ItemManager_SE(thGame) {
        this.items = [];
        this.lastTimeSpawn = Date.now();
        this.spawning = false;
        this.thGame = thGame;
    }
    ItemManager_SE.prototype.update = function () {
        if (this.spawning && this.thGame.players.length > 0 && Date.now() - this.lastTimeSpawn > 500 * (1 + this.items.length)) {
            this.spawnItem();
        }
    };
    ItemManager_SE.prototype.startSpawning = function () {
        this.spawning = true;
    };
    ItemManager_SE.prototype.spawnItem = function () {
        var newPos = this.thGame.level.getRandomSpawnItems(Data.Items.size, Data.Items.size);
        var newItem = new Item_SE_1.Item_SE(newPos.x, newPos.y, "typehere");
        this.lastTimeSpawn = Date.now();
        this.items.push(newItem);
        this.thGame.emitItemSpawn(newItem);
        return newItem;
    };
    ItemManager_SE.prototype.checkForTank = function (tank) {
        if (tank.specialGun === null || tank.specialGun.wornOut) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].overlapsTank(tank)) {
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
    return ItemManager_SE;
}());
exports.ItemManager_SE = ItemManager_SE;
