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
    stats: { kills: number; deaths: number; wins: number; };
    
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
           wins: 0
       }
       
    }

    die() {
        this.stats.deaths++;
        this.alive = false;
       // this.emitable = false;
    }

    getInfoPacket(): PacketPlayerInfo {
        var packet: PacketPlayerInfo = {
            id: this.id,
            name: this.name,
            stats: this.stats,
            alive: this.alive
        }
        
        if (this.tank) {
            packet.tank = this.tank.getStatePacket();
        }

        return packet;
    }
}

export {Player_SE};