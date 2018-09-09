import { Tank_SE } from "./Tank_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";
import { Stats_SE } from "./Stats_SE";
import { Capture_SE } from "./Capture_SE";
import { GameObject_SE } from "./utils/GameObject_SE";

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

    capture: Capture_SE = null;

    team: any = null;
    stats: Stats_SE;

    lastInput: number;
    
    constructor(socket: SocketIO.Socket, name: string) {
        this.socket = socket
        if (socket !== null) {
            this.id = GameObject_SE.getNextID(); //socket.id; 
            this.socket.player = this;
        }
        else
            this.id = `abc${(Math.random() * 100000).toFixed()}`;

        this.name = name || "unnamed";
        
        this.tank = new Tank_SE(this);
        
        this.alive = true;
        this.emitable = true;
        
        this.stats = new Stats_SE();
       
    }

    die() {
        this.stats.inRow = 0;
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

        return this.team !== player.team;
    }

    getInfoPacket(): PacketPlayerInfo {
        var packet: PacketPlayerInfo = {
            id: this.id,
            socketID: (this.socket) ? this.socket.id : this.id,
            name: this.name,
            stats: this.stats.exportPacket(),
            alive: this.alive,
            health: this.tank.health,
            maxHealth: this.tank.maxHealth,
        }
        
        if (this.tank) {
            packet.tank = this.tank.getStatePacket();
        }

        if (this.team) {
            packet.team = this.team;
        }

        return packet;
    }
}

export {Player_SE};