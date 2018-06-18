"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Arena_SE_1 = require("./gameplay/gamemodes/Arena_SE");
var GameManager_SE = (function () {
    function GameManager_SE(tankhunt) {
        this.games = [];
        this.th = tankhunt;
        this.testGame = new Arena_SE_1.Arena_SE(20);
        this.games.push(this.testGame);
    }
    GameManager_SE.prototype.newPlayer = function (pl) {
        this.testGame.addPlayer(pl);
    };
    GameManager_SE.prototype.loopTick = function (deltaSec) {
        for (var i = 0; i < this.games.length; i++) {
            this.games[i].update(deltaSec);
        }
    };
    return GameManager_SE;
}());
exports.GameManager_SE = GameManager_SE;
