"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ItemManager_SE_1 = require("../ItemManager_SE");
var Level_SE_1 = require("../Level_SE");
var Tank_SE_1 = require("../Tank_SE");
var THGame_SE_1 = require("./THGame_SE");
var Levels = require("../../../shared/Levels");
var Arena_SE = (function (_super) {
    __extends(Arena_SE, _super);
    function Arena_SE(capacity) {
        var _this = _super.call(this) || this;
        _this.respawnDelay = 1000;
        _this.immunityTime = 3000;
        _this.capacity = capacity || 20;
        _this.running = true;
        _this.itemManager = new ItemManager_SE_1.ItemManager_SE(_this);
        _this.itemManager.startSpawning();
        _this.level = new Level_SE_1.Level_SE();
        _this.level.parseJSONLevel(Levels.arena1);
        console.log("Starting Arena game...");
        return _this;
    }
    Arena_SE.prototype.addPlayer = function (player) {
        player.game = this;
        player.tank = new Tank_SE_1.Tank_SE(player);
        player.alive = false;
        this.players.push(player);
        this.emitLevelPl(player);
        this.emitInfoToPl(player);
        this.emitNewPl(player);
        this.respawn(player);
        console.log("New player joined the arena!");
    };
    Arena_SE.prototype.playerDisconnected = function (player) {
        var index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
        this.emitRemove(player.socket.id);
    };
    Arena_SE.prototype.respawn = function (player) {
        var spawnPos = this.level.getRandomSpawn1(player.tank.body.hDiagonal, player.tank.body.hDiagonal);
        player.tank.randomizeAngle();
        player.tank.turret.randomizeAngle();
        player.tank.setPos(spawnPos.x, spawnPos.y);
        var packet = player.tank.getStatePacket();
        packet.serverTime = Date.now();
        packet.respawnDelay = this.respawnDelay;
        packet.immunityTime = this.immunityTime;
        setTimeout(function () { player.alive = true; }, this.respawnDelay);
        this.emitRespawn(packet);
    };
    Arena_SE.prototype.killPlayer = function (killed, killer, shot) {
        killed.die();
        if (killer !== killed)
            killer.stats.kills++;
        this.emitKill(killed.id, killer.id, shot.id);
        this.respawn(killed);
    };
    Arena_SE.prototype.update = function (deltaSec) {
        if (!this.running)
            return;
        this.updateCounter++;
        var firstTank = true;
        for (var pl = 0; pl < this.players.length; pl++) {
            if (!this.players[pl].alive)
                continue;
            this.players[pl].tank.update(deltaSec);
            this.players[pl].tank.wallCollide(this.level);
            this.itemManager.checkForTank(this.players[pl].tank);
            for (var sh = 0; sh < this.shots.length; sh++) {
                if (firstTank) {
                    if (this.shots[sh].remove) {
                        this.shots.splice(sh, 1);
                        sh -= 1;
                        continue;
                    }
                    this.shots[sh].update(deltaSec);
                }
                if (this.shots[sh].isHittingTank(this.players[pl].tank)) {
                    this.killPlayer(this.players[pl], this.shots[sh].owner, this.shots[sh]);
                }
            }
            firstTank = false;
        }
        this.itemManager.update();
        if ((this.updateCounter % 3) == 0) {
            this.emitMovable();
        }
    };
    Arena_SE.prototype.emitInfoToPl = function (player) {
        var packet = {
            players: [],
            items: this.itemManager.getItemsPacket()
        };
        for (var i = 0; i < this.players.length; i++) {
            packet.players.push(this.players[i].getInfoPacket());
        }
        this.emitDataPl("gameInfo", packet, player);
    };
    Arena_SE.prototype.emitNewPl = function (player) {
        this.emitData("newPlayer", player.getInfoPacket());
    };
    Arena_SE.prototype.emitRespawn = function (data) {
        this.emitData("respawn", data);
    };
    return Arena_SE;
}(THGame_SE_1.THGame_SE));
exports.Arena_SE = Arena_SE;
