"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager_SE = void 0;
var Arena_SE_1 = require("./gameplay/gamemodes/Arena_SE");
var Duel_SE_1 = require("./gameplay/gamemodes/Duel_SE");
var TeamFight_SE_1 = require("./gameplay/gamemodes/TeamFight_SE");
var GameManager_SE = (function () {
    function GameManager_SE(tankhunt) {
        this.arenas = [];
        this.duels = [];
        this.teamFights = [];
        this.plDuelPending = null;
        this.teamFightQueue = [];
        this.th = tankhunt;
        this.arenas.push(new Arena_SE_1.Arena_SE(10));
    }
    GameManager_SE.prototype.loopTick = function (deltaSec) {
        for (var i = 0; i < this.arenas.length; i++) {
            if (this.arenas[i].isEmpty() && this.arenas.length > 1) {
                this.destroyGame(this.arenas[i]);
                this.arenas.splice(i, 1);
                continue;
            }
            this.arenas[i].update(deltaSec);
        }
        for (var i = 0; i < this.duels.length; i++) {
            if (this.duels[i].remove) {
                this.destroyGame(this.duels[i]);
                this.duels.splice(i, 1);
                continue;
            }
            this.duels[i].update(deltaSec);
        }
        for (var i = 0; i < this.teamFights.length; i++) {
            if (this.teamFights[i].remove) {
                this.destroyGame(this.teamFights[i]);
                this.teamFights.splice(i, 1);
                continue;
            }
            this.teamFights[i].update(deltaSec);
        }
    };
    GameManager_SE.prototype.destroyGame = function (game) {
        for (var _i = 0, _a = game.players; _i < _a.length; _i++) {
            var plr = _a[_i];
            if (plr.socket && plr.socket.connected) {
                this.th.menuManager.addSocket(plr.socket);
            }
        }
        game.destroy();
        this.th.menuManager.emitMenuInfo();
    };
    GameManager_SE.prototype.getArenaCount = function () {
        return this.arenas.length;
    };
    GameManager_SE.prototype.getDuelCount = function () {
        return this.duels.length;
    };
    GameManager_SE.prototype.getTeamFightCount = function () {
        return this.teamFights.length;
    };
    GameManager_SE.prototype.getTeamQueueCount = function () {
        return this.teamFightQueue.length;
    };
    GameManager_SE.prototype.onSocketDisconnected = function (socket) {
        if (!socket.player)
            return;
        if (socket.player.game) {
            socket.player.game.playerDisconnected(socket.player);
            return;
        }
        this.removeFromTeamQueue(socket);
    };
    GameManager_SE.prototype.removeFromTeamQueue = function (socket) {
        var teamQueueIndex = this.teamFightQueue.indexOf(socket.player);
        if (teamQueueIndex !== -1) {
            this.teamFightQueue.splice(teamQueueIndex, 1);
            this.th.menuManager.emitMenuInfo();
        }
    };
    GameManager_SE.prototype.addToTeamQueue = function (socket) {
        var index = this.teamFightQueue.indexOf(socket.player);
        if (index !== -1)
            return false;
        this.teamFightQueue.push(socket.player);
        return true;
    };
    GameManager_SE.prototype.processGameRequest = function (player, packet) {
        if (player.game)
            return;
        if (this.plDuelPending == player) {
            this.plDuelPending = null;
        }
        if (packet.gameType == "nogame") {
            if (player == this.plDuelPending)
                this.plDuelPending = null;
            this.removeFromTeamQueue(player.socket);
            this.th.menuManager.emitMenuInfo();
        }
        if (packet.gameType == "Arena") {
            var arenaToJoin = this.arenas[0];
            for (var ar = 0; ar < this.arenas.length; ar++) {
                if (this.arenas[ar].getPlayerCount() > arenaToJoin.getPlayerCount() || arenaToJoin.isFull())
                    arenaToJoin = this.arenas[ar];
            }
            if (arenaToJoin.isFull()) {
                var arena = new Arena_SE_1.Arena_SE(10);
                this.arenas.push(arena);
                arenaToJoin = arena;
            }
            arenaToJoin.addPlayer(player);
            this.th.menuManager.removeSocket(player.socket);
            this.th.menuManager.emitMenuInfo();
        }
        if (packet.gameType == "Duel") {
            if (this.plDuelPending && this.plDuelPending.socket.connected) {
                var dGame = new Duel_SE_1.Duel_SE();
                dGame.addPlayer(this.plDuelPending);
                dGame.addPlayer(player);
                dGame.start();
                this.duels.push(dGame);
                this.th.menuManager.removeSocket(player.socket);
                this.th.menuManager.removeSocket(this.plDuelPending.socket);
                this.th.menuManager.emitMenuInfo();
                this.plDuelPending = null;
            }
            else {
                this.plDuelPending = player;
            }
            this.removeFromTeamQueue(player.socket);
        }
        if (packet.gameType == "TeamFight") {
            this.addToTeamQueue(player.socket);
            if (this.teamFightQueue.length === 6) {
                var tGame = new TeamFight_SE_1.TeamFight_SE();
                for (var _i = 0, _a = this.teamFightQueue; _i < _a.length; _i++) {
                    var plr = _a[_i];
                    this.th.menuManager.removeSocket(player.socket);
                    tGame.addPlayer(plr);
                }
                this.teamFightQueue = [];
                tGame.start();
                this.teamFights.push(tGame);
            }
            this.th.menuManager.emitMenuInfo();
        }
    };
    return GameManager_SE;
}());
exports.GameManager_SE = GameManager_SE;
