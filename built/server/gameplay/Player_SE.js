"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tank_SE_1 = require("./Tank_SE");
var Player_SE = (function () {
    function Player_SE(socket, name) {
        this.game = null;
        this.socket = socket;
        this.id = socket.id;
        this.socket.player = this;
        this.name = name || "unnamed";
        this.tank = new Tank_SE_1.Tank_SE(this);
        this.alive = true;
        this.emitable = true;
        this.stats = {
            kills: 0,
            deaths: 0,
            wins: 0
        };
    }
    Player_SE.prototype.die = function () {
        this.stats.deaths++;
        this.alive = false;
    };
    Player_SE.prototype.getInfoPacket = function () {
        var packet = {
            id: this.id,
            name: this.name,
            stats: this.stats,
            alive: this.alive
        };
        if (this.tank) {
            packet.tank = this.tank.getStatePacket();
        }
        return packet;
    };
    return Player_SE;
}());
exports.Player_SE = Player_SE;
