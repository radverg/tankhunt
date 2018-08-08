import { Tank_SE } from "./Tank_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";

class Player_SE {

    public socket: SocketIO.Socket;
    public id: string;
    public name: string;
    public tank: Tank_SE;
    game: THGame_SE | null = null;

    alive: boolean;
    emitable: boolean;
    invisible: boolean = false;
    invulnerable: boolean = false;

    team: any = null;
    stats: { kills: number; deaths: number; wins: number; killsInRow: number };
    
    constructor(socket: SocketIO.Socket, name: string) {
        this.socket = socket;
        this.id = socket.id;
        this.socket.player = this;
        this.name = name || "unnamed";
        
        this.tank = new Tank_SE(this);
        
        this.alive = true;
        this.emitable = true;
        
        this.stats = {
           kills: 0,
           deaths: 0,
           wins: 0,
           killsInRow: 0
       }
       
    }

    die() {
        this.stats.deaths++;
        this.stats.killsInRow = 0;
        this.tank.health = 0;
        this.alive = false;
        this.tank.specialGun = null;
       // this.emitable = false;
    }

    isEnemyOf(player: Player_SE) {
        if (player == this) return false;

        if (!this.team || !player.team) {
            return true;
        }

        return this.team == player.team;
    }

    getInfoPacket(): PacketPlayerInfo {
        var packet: PacketPlayerInfo = {
            id: this.id,
            name: this.name,
            stats: this.stats,
            alive: this.alive,
            health: this.tank.health,
            maxHealth: this.tank.maxHealth
        }
        
        if (this.tank) {
            packet.tank = this.tank.getStatePacket();
        }

        return packet;
    }
}

export {Player_SE};