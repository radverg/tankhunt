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
exports.TeamFight_SE = void 0;
var THGame_SE_1 = require("./THGame_SE");
var Level_SE_1 = require("../Level_SE");
var Tank_SE_1 = require("../Tank_SE");
var Capture_SE_1 = require("../Capture_SE");
var Stats_SE_1 = require("../Stats_SE");
var TeamFight_SE = (function (_super) {
    __extends(TeamFight_SE, _super);
    function TeamFight_SE() {
        var _this = _super.call(this) || this;
        _this.playersPerTeam = 3;
        _this.startCountDown = 8000;
        _this.capsPerTeam = 7;
        _this.capTime = 6000;
        _this.teamHeal = 500;
        _this.team1Caps = 0;
        _this.team2Caps = 0;
        _this.over = false;
        _this.debug = true;
        _this.respawnTime = 5000;
        _this.health = 2000;
        _this.caps = {};
        _this.gameType = "TeamFight";
        _this.running = true;
        _this.itemManager.startSpawning();
        _this.itemManager.maxItems = 20;
        _this.level = new Level_SE_1.Level_SE();
        _this.level.parseJSONLevel("team1");
        var capSqueres1 = _this.level.getRandomUniqueSquares(3, 0, _this.level.tilesCountX / 2 - 1, _this.level.tilesCountY - 1, _this.capsPerTeam);
        var capSqueres2 = _this.level.getRandomUniqueSquares(_this.level.tilesCountX / 2, 0, _this.level.tilesCountX - 4, _this.level.tilesCountY - 1, _this.capsPerTeam);
        for (var i = 0; i < _this.capsPerTeam; i++) {
            var cap1 = new Capture_SE_1.Capture_SE(capSqueres1[i].sqrX, capSqueres1[i].sqrY, _this.level.squareSize, 1, _this.capTime);
            var cap2 = new Capture_SE_1.Capture_SE(capSqueres2[i].sqrX, capSqueres2[i].sqrY, _this.level.squareSize, 2, _this.capTime);
            _this.caps[cap1.id] = cap1;
            _this.caps[cap2.id] = cap2;
        }
        console.log("Generating caps...");
        console.log("Starting TeamFight game...");
        return _this;
    }
    TeamFight_SE.prototype.addPlayer = function (player) {
        player.game = this;
        player.tank = new Tank_SE_1.Tank_SE(player);
        player.alive = true;
        player.stats = new Stats_SE_1.Stats_SE();
        player.invisible = false;
        this.players.push(player);
        var index = this.players.length - 1;
        player.team = (index < this.playersPerTeam) ? 1 : 2;
    };
    TeamFight_SE.prototype.start = function () {
        this.startTime = Date.now();
        this.running = true;
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var plr = _a[_i];
            var plDiag = plr.tank.body.hDiagonal;
            var spos = (plr.team == 1) ? this.level.getRandomSpawn1(plDiag, plDiag) :
                this.level.getRandomSpawn2(plDiag, plDiag);
            plr.tank.setPos(spos.x, spos.y);
            plr.tank.randomizeAngle();
            plr.tank.maxHealth = this.health;
            plr.tank.health = this.health;
        }
        this.emitGameStart();
    };
    TeamFight_SE.prototype.emitGameStart = function () {
        var packet = {
            serverTime: Date.now(),
            players: [],
            gameType: this.gameType,
            items: null,
            level: { name: this.level.name },
            countDown: this.startCountDown,
            capTime: this.capTime,
            caps: []
        };
        for (var i = 0; i < this.players.length; i++) {
            packet.players.push(this.players[i].getInfoPacket());
        }
        for (var key in this.caps) {
            var cap = this.caps[key];
            packet.caps.push(cap.getPacket());
        }
        this.emitData("gameStart", packet);
    };
    TeamFight_SE.prototype.wholeGameEnd = function (winnerTeam) {
        var pack = {
            winnerTeam: winnerTeam
        };
        this.emitData("gFinish", pack);
        this.remove = true;
    };
    TeamFight_SE.prototype.playerDisconnected = function (player) {
        this.players.splice(this.players.indexOf(player), 1);
        this.tidyPlayerShots(player);
        player.game = null;
        this.emitRemove(player.id);
        var team1count = 0;
        var team2Count = 0;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].team == 1)
                team1count++;
            else
                team2Count++;
        }
        if (team1count === 0)
            this.wholeGameEnd(2);
        else if (team2Count === 0)
            this.wholeGameEnd(1);
    };
    TeamFight_SE.prototype.update = function (deltaSec) {
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
            var capPack = this.handleCapture(this.players[pl]);
            if (capPack) {
                this.emitCapture(capPack);
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
                if (!this.shots[sh].owner.isEnemyOf(this.players[pl]))
                    continue;
                if (this.shots[sh].isHittingTank(this.players[pl].tank)) {
                    var hitPack = this.shots[sh].hit(this.players[pl].tank);
                    var healPack = null;
                    var attackerTank = this.shots[sh].owner.tank;
                    var targetTank = this.players[pl].tank;
                    var wasKilled = hitPack.healthAft <= 0;
                    if (hitPack.healthAft < hitPack.healthBef && targetTank.owner.capture) {
                        var cap = void 0;
                        if (wasKilled)
                            cap = targetTank.owner.capture.cancelCapturing();
                        else
                            cap = targetTank.owner.capture.resetCapturing();
                        this.emitCapture(cap);
                    }
                    if (wasKilled) {
                        hitPack.resTime = this.countResTime();
                        var tmKiller = this.shots[sh].owner.team;
                        this.healTeam(tmKiller, this.teamHeal);
                        healPack = {};
                        healPack.tm = tmKiller;
                        healPack.amount = this.teamHeal;
                    }
                    this.shots[sh].owner.stats.countHit(attackerTank.owner, targetTank.owner, hitPack.healthBef, hitPack.healthAft);
                    this.emitHit(hitPack);
                    if (healPack) {
                        this.emitHeal(healPack);
                    }
                    if (wasKilled) {
                        this.respawn(this.players[pl]);
                    }
                }
            }
            firstTank = false;
        }
        this.itemManager.update();
        if ((this.updateCounter % 3) == 0) {
            this.emitMovable();
        }
    };
    TeamFight_SE.prototype.respawn = function (player) {
        var _this = this;
        setTimeout(function () {
            if (!player.game)
                return;
            var plDiag = player.tank.body.hDiagonal;
            var spos = (player.team == 1) ? _this.level.getRandomSpawn1(plDiag, plDiag) :
                _this.level.getRandomSpawn2(plDiag, plDiag);
            player.tank.setPos(spos.x, spos.y);
            player.alive = true;
            player.tank.health = player.tank.maxHealth;
            var packet = player.tank.getStatePacket();
            packet.health = player.tank.health;
            _this.emitRespawn(packet);
        }, this.countResTime());
    };
    TeamFight_SE.prototype.healTeam = function (team, amount) {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var plr = _a[_i];
            if (plr.team !== team)
                continue;
            plr.tank.addHealth(amount);
        }
    };
    TeamFight_SE.prototype.countResTime = function () {
        var delta = Date.now() - this.startTime;
        var halfMins = Math.round(delta / 30000);
        return Math.min(3 + halfMins, 15) * 1000;
    };
    TeamFight_SE.prototype.handleCapture = function (player) {
        var cap = this.caps["a".concat(this.level.getSqrX(player.tank.x), "|").concat(this.level.getSqrX(player.tank.y))];
        if (cap && !cap.remove && cap.team !== player.team) {
            if (player.capture !== cap) {
                if (player.capture) {
                    return player.capture.cancelCapturing();
                }
                if (!cap.capturing)
                    return cap.startCapturing(player);
            }
            else {
                if (cap.isCaptured()) {
                    if (cap.team === 1)
                        this.team2Caps++;
                    else
                        this.team1Caps++;
                    this.checkFinish();
                    return cap.finishCapturing();
                }
            }
        }
        else {
            if (player.capture !== null) {
                return player.capture.cancelCapturing();
            }
        }
        return null;
    };
    TeamFight_SE.prototype.checkFinish = function () {
        var _this = this;
        if (this.team1Caps < this.capsPerTeam && this.team2Caps < this.capsPerTeam && !this.over)
            return;
        var winnerTeam = (this.team1Caps > this.team2Caps) ? 1 : 2;
        this.over = true;
        setTimeout(function () {
            _this.wholeGameEnd(winnerTeam);
        }, 500);
    };
    return TeamFight_SE;
}(THGame_SE_1.THGame_SE));
exports.TeamFight_SE = TeamFight_SE;
