"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THGame_SE = (function () {
    function THGame_SE() {
        this.players = [];
        this.shots = [];
        this.items = [];
        this.level = null;
        this.running = false;
        this.startTime = 0;
        this.updateCounter = 0;
        this.capacity = 100;
    }
    THGame_SE.prototype.addPlayer = function (player) {
        if (this.running)
            return;
        this.players.push(player);
        player.game = this;
    };
    THGame_SE.prototype.update = function (deltaSec) {
    };
    THGame_SE.prototype.killPlayer = function (killed, killer, shot) {
        if (killer !== killed)
            killer.stats.kills++;
        killed.tank.setPos(1, 1);
        this.emitKill(killed.socket.id, killer.socket.id, shot.id);
    };
    THGame_SE.prototype.shoot = function (shot) {
        this.shots.push(shot);
        this.emitShot(shot.getStartPacket());
    };
    THGame_SE.prototype.emitLevel = function () {
        this.emitData("level", this.level);
    };
    THGame_SE.prototype.emitLevelPl = function (player) {
        this.emitDataPl("level", this.level, player);
    };
    THGame_SE.prototype.emitShot = function (packet) {
        this.emitData("shot", packet);
    };
    THGame_SE.prototype.emitKill = function (killedID, killerID, shotID) {
        this.emitData("kill", { killerID: killerID, killedID: killedID, shotID: shotID });
    };
    THGame_SE.prototype.emitItemSpawn = function (item) {
        this.emitData("itemSpawn", { typeIndex: item.typeIndex, x: item.x, y: item.y, id: item.id });
    };
    THGame_SE.prototype.emitItemCollect = function (item, collector) {
        this.emitData("itemCollect", { id: item.id, playerID: collector.id });
    };
    THGame_SE.prototype.emitDisappear = function (id) {
        this.emitData("disappear", { id: id });
    };
    THGame_SE.prototype.emitAppear = function (id) {
        this.emitData("appear", { id: id });
    };
    THGame_SE.prototype.emitData = function (emName, data) {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].socket.emit(emName, data);
        }
    };
    THGame_SE.prototype.emitDataPl = function (emName, data, player) {
        player.socket.emit(emName, data);
    };
    THGame_SE.prototype.emitRemove = function (id) {
        this.emitData("removePlayer", id);
    };
    THGame_SE.prototype.emitMovable = function () {
        var packet = {};
        packet.players = [];
        for (var pl = 0; pl < this.players.length; pl++) {
            if (this.players[pl].alive && this.players[pl].emitable) {
                packet.players.push(this.players[pl].tank.getStatePacket());
            }
        }
        this.emitData("movableState", packet);
    };
    THGame_SE.prototype.handleInput = function (inputType, player) {
        if (this[inputType])
            this[inputType](player);
    };
    THGame_SE.prototype.inpForwOn = function (player) {
        player.tank.fullForward();
    };
    THGame_SE.prototype.inpForwOff = function (player) {
        if (player.tank.speed > 0)
            player.tank.stop();
    };
    THGame_SE.prototype.inpBackwOn = function (player) {
        player.tank.fullBackward();
    };
    THGame_SE.prototype.inpBackwOff = function (player) {
        if (player.tank.speed < 0)
            player.tank.stop();
    };
    THGame_SE.prototype.inpLeftOn = function (player) {
        player.tank.fullLeftRotate();
    };
    THGame_SE.prototype.inpLeftOff = function (player) {
        if (player.tank.angularVel < 0)
            player.tank.stopRotation();
    };
    THGame_SE.prototype.inpRightOn = function (player) {
        player.tank.fullRightRotate();
    };
    THGame_SE.prototype.inpRightOff = function (player) {
        if (player.tank.angularVel > 0)
            player.tank.stopRotation();
    };
    THGame_SE.prototype.inpTurrLeftOn = function (player) {
        player.tank.turret.fullLeftRotate();
    };
    THGame_SE.prototype.inpTurrLeftOff = function (player) {
        if (player.tank.turret.angularVel < 0)
            player.tank.turret.stopRotation();
    };
    THGame_SE.prototype.inpTurrRightOn = function (player) {
        player.tank.turret.fullRightRotate();
    };
    THGame_SE.prototype.inpTurrRightOff = function (player) {
        if (player.tank.turret.angularVel > 0)
            player.tank.turret.stopRotation();
    };
    THGame_SE.prototype.inpShotOn = function (player) {
        if (player.tank.apcrGun)
            player.tank.apcrGun.onPress(this);
    };
    THGame_SE.prototype.inpShotOff = function (player) {
        if (player.tank.apcrGun)
            player.tank.apcrGun.onRelease(this);
    };
    THGame_SE.prototype.inpShotSpecialOn = function (player) {
        if (player.tank.specialGun) {
            player.tank.specialGun.onPress(this);
        }
    };
    THGame_SE.prototype.inpShotSpecialOff = function (player) {
        if (player.tank.specialGun) {
            player.tank.specialGun.onRelease(this);
        }
    };
    THGame_SE.prototype.inpShotBouncingOn = function (player) {
        if (player.tank.bouncerGun) {
            player.tank.bouncerGun.onPress(this);
        }
    };
    return THGame_SE;
}());
exports.THGame_SE = THGame_SE;
