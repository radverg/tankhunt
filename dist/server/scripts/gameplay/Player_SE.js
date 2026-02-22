"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player_SE = void 0;
var Tank_SE_1 = require("./Tank_SE");
var Stats_SE_1 = require("./Stats_SE");
var GameObject_SE_1 = require("./utils/GameObject_SE");
var Player_SE = (function () {
    function Player_SE(socket, name) {
        this.game = null;
        this.invisible = false;
        this.invulnerable = false;
        this.capture = null;
        this.team = 0;
        this.socket = socket;
        if (socket !== null) {
            this.id = GameObject_SE_1.GameObject_SE.getNextID();
            this.socket.player = this;
        }
        else
            this.id = "abc".concat((Math.random() * 100000).toFixed());
        this.name = name || "unnamed";
        this.tank = new Tank_SE_1.Tank_SE(this);
        this.alive = true;
        this.emitable = true;
        this.stats = new Stats_SE_1.Stats_SE();
    }
    Player_SE.prototype.die = function () {
        this.stats.inRow = 0;
        this.tank.health = 0;
        this.alive = false;
        this.tank.specialGun = null;
    };
    Player_SE.prototype.isEnemyOf = function (player) {
        if (player == this)
            return false;
        if (!this.team || !player.team) {
            return true;
        }
        return this.team !== player.team;
    };
    Player_SE.prototype.getInfoPacket = function () {
        var packet = {
            id: this.id,
            socketID: (this.socket) ? this.socket.id : this.id,
            name: this.name,
            stats: this.stats.exportPacket(),
            alive: this.alive,
            health: this.tank.health,
            maxHealth: this.tank.maxHealth,
        };
        if (this.tank) {
            packet.tank = this.tank.getStatePacket();
        }
        if (this.team) {
            packet.team = this.team;
        }
        return packet;
    };
    return Player_SE;
}());
exports.Player_SE = Player_SE;
