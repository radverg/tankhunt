var Geom = require("../utils/Geometry");
var GO = require("../utils/GameObject");
var Mt = require("../utils/MyMath");

class THGame {

    constructor() {
         this.players = [];
         this.shots = [];
         this.items = [];
         this.level = null;

         this.running = false;
         this.startTime = 0;
         this.updateCounter = 0;
         this.capacity = 100;
    }

    addPlayer (player) {
        if (this.running) return;
        this.players.push(player);
        player.game = this;
    }

    update(deltaSec) {
        if (!this.running) return;
        this.updateCounter++;

        // Move, rotate, collide players
        for (var pl = 0; pl < this.players.length; pl++) {
            this.players[pl].tank.move(deltaSec);
            this.players[pl].tank.rotate(deltaSec);
        }

        // Move, collide shots
        for (var sh = 0; sh < this.shots.length; sh++) {

        }

        // Send players state every third frame ( 20 per second)
        if ((this.updateCounter % 3) == 0) {
            this.emitPlayersState();
        }
    }

    killPlayer(killed, killer, shot) {
      //  killed.die();
        if (killer !== killed) killer.stats.kills++;
        killed.tank.setPos(1, 1);
       

        this.emitKill(killed.socket.id, killer.socket.id, shot.id);
    }

    playerDisconnected(player) { }

    shoot(shot) {
        this.shots.push(shot);
        this.emitShot(shot.getStartPacket());
    }

    emitLevel() {
        this.emitData("level", this.level);
    }

    emitLevelPl(player) {
        this.emitDataPl("level", this.level, player);
    }

    emitShot(packet) {
        this.emitData("shot", packet);
    }

    emitKill(killedID, killerID, shotID) {
        this.emitData("kill", { killerID: killerID, killedID: killedID, shotID: shotID });
    }

    emitItemSpawn(item) {
        this.emitData("itemSpawn", {typeIndex: item.typeIndex, x: item.x, y: item.y});
    }

    emitItemCollect(item, collector) {
        this.emitData("itemCollect", { id: item.id, playerID: collector.id });
    }

    emitDisappear(id) {
        this.emitData("disappear", { id: id });
    }

    emitAppear(id) {
        this.emitData("appear", { id: id });
    }

    emitData(emName, data) {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].socket.emit(emName, data);
        }
    }

    emitDataPl(emName, data, player) {
        player.socket.emit(emName, data);
    }

    emitRemove(id) {
        this.emitData("removePlayer", { id: id });
    }

    // Creates and sends packet that contains positions, rotations and velocities of the tanks
    emitMovable() {
        var packet = {};
        packet.players = []; 

        // Add players to the packet
        for (var pl = 0; pl < this.players.length; pl++) {
            if (this.players[pl].alive && this.players[pl].emitable) { // Include a player in the packet only if it's both alive and visible (emitable)
                packet.players.push(this.players[pl].tank.getStatePacket());
                // packet.players.push({"id": this.players[pl].socket.id, "posX": this.players[pl].tank.x, 
                //     "posY": this.players[pl].tank.y, "rot": this.players[pl].tank.angle, 
                //     "turrRot": this.players[pl].tank.turret.angle});
            }
        }

        // Add shots to the packet
        packet.shots = [];
        // for (var sh = 0; sh < this.shots.length; sh++) {
        //     packet.shots.push({ "id": this.shots[sh].id, "posX": this.shots[sh].x, "posY": this.shots[sh].y, "rot": this.shots[sh].angle });
        // }

        this.emitData("movableState", packet);
    }

    // Input handling ----------------------------------------------------------------------
    handleInput(inputType, player) {
        if (this[inputType])
            this[inputType](player);  
    }

    inpForwOn(player) {
        player.tank.fullForward();
    }

    inpForwOff(player) {
        if (player.tank.speed > 0) player.tank.stop();
    }

    inpBackwOn(player) {
        player.tank.fullBackward();
    }

    inpBackwOff(player) {
        if (player.tank.speed < 0) player.tank.stop();
    }

    inpLeftOn(player) {
        player.tank.fullLeftRotate();
    }

    inpLeftOff(player) {
        if (player.tank.angularVel < 0) player.tank.stopRotation();

    }

    inpRightOn(player) {
        player.tank.fullRightRotate();
        
    }

    inpRightOff(player) {
        if (player.tank.angularVel > 0) player.tank.stopRotation();
        
    }

    inpTurrLeftOn(player) {
        player.tank.turret.fullLeftRotate();
    }

    inpTurrLeftOff(player) {
        if (player.tank.turret.angularVel < 0) player.tank.turret.stopRotation();
    }

    inpTurrRightOn(player) {
        player.tank.turret.fullRightRotate();
    }

    inpTurrRightOff(player) {
        if (player.tank.turret.angularVel > 0) player.tank.turret.stopRotation();
    }

    inpShotOn(player) {
        if (player.tank.apcrGun)
            player.tank.apcrGun.onPress(this);
    }

    inpShotOff(player) {
        if (player.tank.laserGun)
            player.tank.laserGun.onRelease(this);
    }

    inpShotSpecialOn(player) {
        if (player.tank.specialGun) {
            player.tank.specialGun.onPress(this);
        }
    }

    inpShotSpecialOff(player) {
        if (player.tank.specialGun) {
            player.tank.specialGun.onRelease(this);
        }
    }

    inpShotBouncingOn(player) {
        if (player.tank.bouncerGun) {
            player.tank.bouncerGun.onPress(this);
        }
    }
}


// --------------------------------------------------------------------------

module.exports = THGame;