import { Player_SE } from "../Player_SE";
import { Item_SE } from "../Item_SE";
import { Shot_SE } from "../Shot_SE";
import { ItemManager_SE } from "../ItemManager_SE";
import { Level_SE } from "../Level_SE";

abstract class THGame_SE {

    public players: Player_SE[] = [];
    protected shots: Shot_SE[] = [];
    protected items: Item_SE[] = [];

    protected itemManager: ItemManager_SE | null;

    public level: Level_SE | null = null;
    
    public running: boolean = false;
    public startTime: number = 0;

    protected updateCounter: number = 0;
    protected capacity: number = 100;

    protected gameType: string;
    
    constructor() { }

    addPlayer (player: Player_SE) {
        if (this.running) return;
        this.players.push(player);
        player.game = this;
    }

    update(deltaSec: number) {
        // if (!this.running) return;
        // this.updateCounter++;

        // // Move, rotate, collide players
        // for (var pl = 0; pl < this.players.length; pl++) {
        //     this.players[pl].tank.move(deltaSec);
        //     this.players[pl].tank.rotate(deltaSec);
        // }

        // // Move, collide shots
        // for (var sh = 0; sh < this.shots.length; sh++) {

        // }

        // // Send players state every third frame ( 20 per second)
        // if ((this.updateCounter % 3) == 0) {
        //     this.emitPlayersState();
        // }
    }

    killPlayer(killed: Player_SE, killer: Player_SE, shot: Shot_SE) {
      //  killed.die();
        if (killer !== killed) killer.stats.kills++;
        killed.tank.setPos(1, 1);
       

        this.emitKill(killed.socket.id, killer.socket.id, shot.id);
    }

    abstract playerDisconnected(player: Player_SE): void;

    shoot(shot: Shot_SE, emitShot: boolean = true) {
        this.shots.push(shot);
        
        if (emitShot)
            this.emitShot(shot.getStartPacket());
    }

    emitLevel() {
        this.emitData("level", this.level);
    }

    emitLevelPl(player: Player_SE) {
        this.emitDataPl("level", this.level, player);
    }

    emitShot(packet: PacketShotStart) {
        this.emitData("shot", packet);
    }

    emitKill(killedID: string, killerID: string, shotID: string) {
        this.emitData("kill", { killerID: killerID, killedID: killedID, shotID: shotID });
    }

    emitItemSpawn(item: Item_SE) {
        this.emitData("itemSpawn", {typeIndex: item.typeIndex, x: item.x, y: item.y, id: item.id});
    }

    emitItemCollect(item: Item_SE, collector: Player_SE) {
        this.emitData("itemCollect", { id: item.id, playerID: collector.id });
    }

    emitDisappear(id: string) {
        this.emitData("disappear", { id: id });
    }

    emitAppear(id: string) {
        this.emitData("appear", { id: id });
    }

    emitData(emName: string, data: any) {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].socket.emit(emName, data);
        }
    }

    emitDataPl(emName: string, data: any, player: Player_SE) {
        player.socket.emit(emName, data);
    }

    emitRemove(id: string) {
        this.emitData("removePlayer", id);
    }

    // Creates and sends packet that contains positions, rotations and velocities of the tanks
    emitMovable() {
        var packet: PacketMovable = {} as PacketMovable;
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

        this.emitData("movableState", packet);
    }

    // Input handling ----------------------------------------------------------------------
    handleInput(inputType: string, player: Player_SE) {
        if ((this as any)[inputType])
            (this as any)[inputType](player);  
    }

    inpForwOn(player: Player_SE) {
        player.tank.fullForward();
    }

    inpForwOff(player: Player_SE) {
        if (player.tank.speed > 0) player.tank.stop();
    }

    inpBackwOn(player: Player_SE) {
        player.tank.fullBackward();
    }

    inpBackwOff(player: Player_SE) {
        if (player.tank.speed < 0) player.tank.stop();
    }

    inpLeftOn(player: Player_SE) {
        player.tank.fullLeftRotate();
    }

    inpLeftOff(player: Player_SE) {
        if (player.tank.angularVel < 0) player.tank.stopRotation();

    }

    inpRightOn(player: Player_SE) {
        player.tank.fullRightRotate();
        
    }

    inpRightOff(player: Player_SE) {
        if (player.tank.angularVel > 0) player.tank.stopRotation();
        
    }

    inpTurrLeftOn(player: Player_SE) {
        player.tank.turret.fullLeftRotate();
    }

    inpTurrLeftOff(player: Player_SE) {
        if (player.tank.turret.angularVel < 0) player.tank.turret.stopRotation();
    }

    inpTurrRightOn(player: Player_SE) {
        player.tank.turret.fullRightRotate();
    }

    inpTurrRightOff(player: Player_SE) {
        if (player.tank.turret.angularVel > 0) player.tank.turret.stopRotation();
    }

    inpShotOn(player: Player_SE) {
        if (player.tank.apcrGun)
            player.tank.apcrGun.onPress(this);
    }

    inpShotOff(player: Player_SE) {
        if (player.tank.apcrGun)
            player.tank.apcrGun.onRelease(this);
    }

    inpShotSpecialOn(player: Player_SE) {
        if (player.tank.specialGun) {
            player.tank.specialGun.onPress(this);
        }
    }

    inpShotSpecialOff(player: Player_SE) {
        if (player.tank.specialGun) {
            player.tank.specialGun.onRelease(this);
        }
    }

    inpShotBouncingOn(player: Player_SE) {
        if (player.tank.bouncerGun) {
            player.tank.bouncerGun.onPress(this);
        }
    }
}

export { THGame_SE };

// --------------------------------------------------------------------------
