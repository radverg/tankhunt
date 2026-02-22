"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arena_SE = void 0;
var Level_SE_1 = require("../Level_SE");
var Tank_SE_1 = require("../Tank_SE");
var THGame_SE_1 = require("./THGame_SE");
var Stats_SE_1 = require("../Stats_SE");
var Arena_SE = (function (_super) {
    __extends(Arena_SE, _super);
    function Arena_SE(capacity) {
        var _this = _super.call(this) || this;
        _this.respawnDelay = 1800;
        _this.immunityTime = 5000;
        _this.startUpHealth = 500;
        _this.maxHealth = 2500;
        _this.gameType = "Arena";
        _this.capacity = capacity || 10;
        _this.running = true;
        _this.itemManager.startSpawning();
        var ll = Level_SE_1.LoadedLevels;
        _this.level = ll["arena2"];
        console.log("Starting Arena game...");
        return _this;
    }
    Arena_SE.prototype.addPlayer = function (player) {
        player.game = this;
        player.tank = new Tank_SE_1.Tank_SE(player);
        player.alive = false;
        player.lastInput = Date.now();
        player.invisible = false;
        player.stats = new Stats_SE_1.Stats_SE();
        this.players.push(player);
        this.emitGameStartToPl(player);
        this.emitNewPl(player);
        this.respawn(player);
        console.log("New player joined the arena!");
    };
    Arena_SE.prototype.playerDisconnected = function (player) {
        var index = this.players.indexOf(player);
        this.tidyPlayerShots(player);
        this.emitRemove(player.id);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
        player.game = null;
    };
    Arena_SE.prototype.respawn = function (player) {
        var spawnPos = this.level.getRandomSpawn1(player.tank.body.hDiagonal, player.tank.body.hDiagonal);
        player.tank.randomizeAngle();
        player.tank.turret.randomizeAngle();
        player.tank.maxHealth = this.startUpHealth;
        player.tank.health = this.startUpHealth;
        var packet = player.tank.getStatePacket();
        packet.x = spawnPos.x;
        packet.y = spawnPos.y;
        packet.serverTime = Date.now();
        packet.respawnDelay = this.respawnDelay;
        packet.immunityTime = this.immunityTime;
        packet.health = player.tank.health;
        player.invulnerable = true;
        setTimeout(function () { player.alive = true; player.tank.setPos(spawnPos.x, spawnPos.y); }, this.respawnDelay);
        setTimeout(function () { player.invulnerable = false; }, this.respawnDelay + this.immunityTime);
        this.emitRespawn(packet);
    };
    Arena_SE.prototype.update = function (deltaSec) {
        this.now = Date.now();
        if (!this.running)
            return;
        this.updateCounter++;
        var firstTank = true;
        for (var pl = 0; pl < this.players.length; pl++) {
            if (!this.players[pl].alive)
                continue;
            if (this.now - this.players[pl].lastInput > 50000) {
                this.kickPlayer(this.players[pl]);
                pl--;
                continue;
            }
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
                    var hitPack = this.shots[sh].hit(this.players[pl].tank);
                    var healPack = null;
                    var attackerTank = this.shots[sh].owner.tank;
                    var targetTank = this.players[pl].tank;
                    var wasKilled = hitPack.healthAft <= 0;
                    if (wasKilled) {
                        healPack = {};
                        healPack.plID = attackerTank.owner.id;
                        healPack.healthBef = attackerTank.health;
                        healPack.maxHealthBef = attackerTank.maxHealth;
                        attackerTank.maxHealth *= 1.3;
                        if (attackerTank.maxHealth > this.maxHealth) {
                            attackerTank.maxHealth = this.maxHealth;
                        }
                        attackerTank.health = attackerTank.maxHealth;
                        healPack.healthAft = attackerTank.health;
                        healPack.maxHealthAft = attackerTank.maxHealth;
                    }
                    this.shots[sh].owner.stats.countHit(attackerTank.owner, targetTank.owner, hitPack.healthBef, hitPack.healthAft);
                    this.emitHit(hitPack);
                    if (healPack) {
                        this.emitHeal(healPack);
                    }
                    if (hitPack.healthAft <= 0) {
                        this.respawn(this.players[pl]);
                    }
                }
            }
            this.players[pl].tank.update(deltaSec);
            this.players[pl].tank.wallCollide(this.level);
            this.itemManager.checkForTank(this.players[pl].tank);
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
    Arena_SE.prototype.emitGameStartToPl = function (player) {
        var packet = {
            serverTime: Date.now(),
            players: [],
            items: this.itemManager.getItemsPacket(),
            gameType: this.gameType,
            level: {
                name: this.level.name
            }
        };
        for (var i = 0; i < this.players.length; i++) {
            packet.players.push(this.players[i].getInfoPacket());
        }
        this.emitDataPl("gameStart", packet, player);
    };
    Arena_SE.prototype.emitNewPl = function (player) {
        this.emitData("newPlayer", player.getInfoPacket());
    };
    return Arena_SE;
}(THGame_SE_1.THGame_SE));
exports.Arena_SE = Arena_SE;
