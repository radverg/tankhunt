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
exports.Duel_SE = void 0;
var THGame_SE_1 = require("./THGame_SE");
var Tank_SE_1 = require("../Tank_SE");
var Level_SE_1 = require("../Level_SE");
var MyMath_SE_1 = require("../utils/MyMath_SE");
var Stats_SE_1 = require("../Stats_SE");
var Duel_SE = (function (_super) {
    __extends(Duel_SE, _super);
    function Duel_SE() {
        var _this = _super.call(this) || this;
        _this.playerCount = 2;
        _this.startDelay = 2000;
        _this.endDelay = 3500;
        _this.isWinPending = false;
        _this.maxWins = 15;
        _this.currentRound = 0;
        _this.duelMapCount = 20;
        _this.levels = [];
        _this.maxHealth = 2500;
        _this.minHealth = 100;
        _this.subGameRunning = false;
        _this.gameType = "Duel";
        for (var i = 0; i < _this.duelMapCount; i++) {
            var ll = Level_SE_1.LoadedLevels;
            _this.levels.push(ll["duel".concat(i + 1)]);
        }
        _this.itemManager.maxItems = 8;
        _this.itemManager.spawning = true;
        _this.blockInput = true;
        return _this;
    }
    Duel_SE.prototype.playerDisconnected = function (player) {
        this.players.splice(this.players.indexOf(player), 1);
        player.game = null;
        if (this.players.length === 1) {
            this.wholeGameEnd(this.players[0]);
            console.log("Aborting duel game!");
        }
    };
    Duel_SE.prototype.addPlayer = function (player) {
        player.game = this;
        player.tank = new Tank_SE_1.Tank_SE(player);
        player.alive = true;
        player.invisible = false;
        player.stats = new Stats_SE_1.Stats_SE();
        this.players.push(player);
    };
    Duel_SE.prototype.subgameEnd = function (winner) {
        var _this = this;
        this.currentRound++;
        this.blockInput = true;
        this.subGameRunning = false;
        var nextLevel = this.levels[Math.floor(Math.random() * this.levels.length)];
        var packet = {
            subgame: true,
            nextDelay: this.startDelay,
            nextLevel: {
                name: nextLevel.name
            }
        };
        this.itemManager.clear();
        this.itemManager.spawning = false;
        this.shots = [];
        this.level = nextLevel;
        if (winner) {
            packet.winnerID = winner.id;
            winner.stats.wins++;
            if (winner.stats.wins >= this.maxWins) {
                this.wholeGameEnd(winner);
                return;
            }
        }
        this.generatePostions();
        this.reviveAll();
        if (this.players[0]) {
            packet.nextHealth = this.players[0].tank.health;
        }
        setTimeout(function () { _this.subGameRunning = true; _this.blockInput = false; _this.itemManager.spawning = true; }, this.startDelay);
        this.emitData("gFinish", packet);
    };
    Duel_SE.prototype.winPending = function (winAdept) {
        var _this = this;
        if (this.isWinPending)
            return;
        this.isWinPending = true;
        setTimeout(function () {
            if (_this.remove)
                return;
            _this.isWinPending = false;
            var winner = (winAdept.alive) ? winAdept : null;
            _this.subGameRunning = false;
            _this.subgameEnd(winner);
        }, this.endDelay);
    };
    Duel_SE.prototype.wholeGameEnd = function (winner) {
        var packet = {
            winnerID: winner.id
        };
        this.emitData("gFinish", packet);
        this.remove = true;
    };
    Duel_SE.prototype.reviveAll = function () {
        var rndHealt = (0, MyMath_SE_1.getRandomInt)(this.minHealth, this.maxHealth);
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var plr = _a[_i];
            plr.alive = true;
            plr.invisible = false;
            plr.tank.stopCompletely();
            plr.tank.maxHealth = rndHealt;
            plr.tank.health = rndHealt;
            plr.tank.specialGun = null;
        }
    };
    Duel_SE.prototype.emitGameStart = function () {
        var packet = {
            serverTime: Date.now(),
            players: [],
            items: null,
            gameType: this.gameType,
            level: {
                name: this.level.name
            },
            countDown: this.startDelay,
            winCount: this.maxWins
        };
        for (var i = 0; i < this.players.length; i++) {
            packet.players.push(this.players[i].getInfoPacket());
        }
        this.emitData("gameStart", packet);
    };
    Duel_SE.prototype.start = function () {
        var _this = this;
        this.startTime = Date.now();
        this.running = true;
        this.level = this.levels[0];
        this.generatePostions();
        this.reviveAll();
        this.emitGameStart();
        setTimeout(function () { _this.subGameRunning = true; _this.blockInput = false; }, this.startDelay);
    };
    Duel_SE.prototype.generatePostions = function () {
        for (var i = 0; i < this.players.length; i++) {
            var plr = this.players[i];
            var pos = this.level.getRandomSpawn1(plr.tank.body.w, plr.tank.body.h);
            plr.tank.randomizeAngle();
            plr.tank.turret.angle = 0;
            plr.tank.setPos(pos.x, pos.y);
        }
    };
    Duel_SE.prototype.update = function (deltaSec) {
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
                    var packet = this.shots[sh].hit(this.players[pl].tank, true);
                    var attackerTank = this.shots[sh].owner.tank;
                    var targetTank = this.players[pl].tank;
                    attackerTank.owner.stats.countHit(attackerTank.owner, targetTank.owner, packet.healthBef, packet.healthAft);
                    var livingPlrs = this.players.filter(function (value) {
                        return value.alive;
                    });
                    if (livingPlrs.length == 1) {
                        this.winPending(livingPlrs[0]);
                    }
                    this.emitHit(packet);
                }
            }
            firstTank = false;
        }
        this.itemManager.update();
        if ((this.updateCounter % 3) == 0) {
            this.emitMovable();
        }
    };
    Duel_SE.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.levels = null;
    };
    return Duel_SE;
}(THGame_SE_1.THGame_SE));
exports.Duel_SE = Duel_SE;
