"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THGame_SE = void 0;
var ItemManager_SE_1 = require("../ItemManager_SE");
var THGame_SE = (function () {
    function THGame_SE() {
        this.players = [];
        this.shots = [];
        this.level = null;
        this.running = false;
        this.startTime = 0;
        this.updateCounter = 0;
        this.capacity = 10;
        this.hViewWidth = 15;
        this.hViewHeight = 9;
        this.viewOffset = 4.28;
        this.now = Date.now();
        this.blockInput = false;
        this.remove = false;
        this.itemManager = new ItemManager_SE_1.ItemManager_SE(this);
    }
    THGame_SE.prototype.addPlayer = function (player) {
        if (this.running)
            return;
        this.players.push(player);
        player.game = this;
    };
    THGame_SE.prototype.update = function (deltaSec) { };
    THGame_SE.prototype.shoot = function (shot, emitShot) {
        if (emitShot === void 0) { emitShot = true; }
        if (shot.remove)
            return false;
        this.shots.push(shot);
        if (emitShot)
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
    THGame_SE.prototype.emitHit = function (data) {
        this.emitData("hit", data);
    };
    THGame_SE.prototype.emitItemSpawn = function (item) {
        this.emitData("itemSpawn", { typeIndex: item.typeIndex, x: parseFloat(item.x.toFixed(4)), y: parseFloat(item.y.toFixed(4)), id: item.id });
    };
    THGame_SE.prototype.emitItemCollect = function (item, collector) {
        this.emitData("itemCollect", { id: item.id, playerID: collector.id });
    };
    THGame_SE.prototype.emitDisappear = function (player) {
        this.emitData("disappear", { plID: player.id });
    };
    THGame_SE.prototype.emitAppear = function (player) {
        this.emitData("appear", { plID: player.id, atX: player.tank.x, atY: player.tank.y });
    };
    THGame_SE.prototype.emitData = function (emName, data) {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (!player.socket || player.socket.disconnected)
                continue;
            player.socket.emit(emName, data);
        }
    };
    THGame_SE.prototype.emitHeal = function (data) {
        this.emitData("heal", data);
    };
    THGame_SE.prototype.emitRespawn = function (data) {
        this.emitData("respawn", data);
    };
    THGame_SE.prototype.emitCapture = function (data) {
        this.emitData("cap", data);
    };
    THGame_SE.prototype.emitDataPl = function (emName, data, player) {
        if (!player.socket || player.socket.disconnected)
            return;
        player.socket.emit(emName, data);
    };
    THGame_SE.prototype.emitDataPlVolatile = function (emName, data, player) {
        if (!player.socket || player.socket.disconnected)
            return;
        player.socket.volatile.emit(emName, data);
    };
    THGame_SE.prototype.emitRemove = function (id) {
        this.emitData("removePlayer", id);
    };
    THGame_SE.prototype.emitMovable = function () {
        for (var pl = 0; pl < this.players.length; pl++) {
            var plr1 = this.players[pl];
            var packet = {};
            packet.p = {};
            var counter = 0;
            for (var pl2 = 0; pl2 < this.players.length; pl2++) {
                var plr2 = this.players[pl2];
                if (!this.isInView(plr2.tank, plr1.tank.x, plr1.tank.y) || !plr2.alive || !plr2.emitable || (plr2.invisible && plr2.isEnemyOf(plr1)))
                    continue;
                packet.p[plr2.id] = plr2.tank.getTinyPacket();
                counter++;
            }
            if (counter > 0)
                this.emitDataPlVolatile("ms", packet, plr1);
        }
    };
    THGame_SE.prototype.isInView = function (gameobj, fromX, fromY) {
        var rectX = fromX - this.hViewWidth;
        var rectY = fromY - this.hViewHeight;
        return gameobj.body.right > rectX && gameobj.body.left < rectX + this.hViewWidth * 2
            && gameobj.body.top < rectY + this.hViewHeight * 2 && gameobj.body.bottom > rectY;
    };
    THGame_SE.prototype.isFull = function () {
        return this.players.length == this.capacity;
    };
    THGame_SE.prototype.isEmpty = function () {
        return this.players.length == 0;
    };
    THGame_SE.prototype.getPlayerCount = function () {
        return this.players.length;
    };
    THGame_SE.prototype.kickPlayer = function (player) {
        this.playerDisconnected(player);
    };
    THGame_SE.prototype.tidyPlayerShots = function (player) {
        var shotsToRemove = this.shots.filter(function (sh) { return sh.owner === player; });
        for (var _i = 0, shotsToRemove_1 = shotsToRemove; _i < shotsToRemove_1.length; _i++) {
            var shot = shotsToRemove_1[_i];
            shot.remove = true;
        }
    };
    THGame_SE.prototype.destroy = function () {
        this.remove = true;
        this.level = null;
        this.players.forEach(function (plr) {
            plr.game = null;
            plr.lastInput = null;
        });
        this.players = null;
        this.itemManager.destroy();
        this.shots = null;
        this.running = false;
        this.blockInput = true;
    };
    THGame_SE.prototype.processChatMessage = function (data, senderPl) {
        var packet = { id: senderPl.id, mess: data.mess };
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var plr = _a[_i];
            if (data.alliesOnly && senderPl.isEnemyOf(plr))
                continue;
            this.emitDataPl("gameChat", packet, plr);
        }
    };
    THGame_SE.prototype.handleInput = function (inputType, player) {
        if (this.blockInput)
            return;
        if (inputType.substr(0, 3) !== "inp") {
            return;
        }
        if (this[inputType]) {
            this[inputType](player);
            player.lastInput = this.now;
        }
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
