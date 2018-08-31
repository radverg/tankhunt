import { GameObject_SE } from "./utils/GameObject_SE";
import { Player_SE } from "./Player_SE";

class Capture_SE extends GameObject_SE {

    team: number;

    private lastCapStart: number = null;
    private lastCapStop: number = 0;

    public capturing: boolean = false;
    private capturer: Player_SE = null;

    private capTime: number;

    constructor(sqrX: number, sqrY: number, sqrSize: number, team: number, capTime: number = 4000) {
        super(sqrX + sqrSize / 2, sqrY + sqrSize / 2, sqrSize, sqrSize);

        this.team = team;
        this.capTime = capTime;

        this.id = `a${sqrX}|${sqrY}`;
    }

    startCapturing(capturer: Player_SE): PacketCapture {
        if (this.capturer) return;

        this.lastCapStart = Date.now();
        this.capturing = true;
        this.capturer = capturer;
        this.capturer.capture = this;

        let pack = this.getPacket();
        pack.st = true;

        return pack;
    }

    cancelCapturing(): PacketCapture {
        this.lastCapStop = Date.now();
        this.capturing = false;

        let pack = this.getPacket();
        pack.cn = true;
    
        this.capturer.capture = null;
        this.capturer = null;

        return pack;
    }

    resetCapturing(): PacketCapture {
        this.capturing = true;
        this.lastCapStart = Date.now();

        let pack = this.getPacket();
        pack.rs = true;

        return pack;

    }

    finishCapturing(): PacketCapture {
        this.capturer.capture = null;
        this.capturing = false;
        this.capturer.stats.caps++;
        let pack = this.getPacket(); 
        pack.fin = true;

        return pack;
    }

    isCaptured() {
        if (this.lastCapStart === null) return false;
        let res = false;
        if (this.lastCapStart > this.lastCapStop) {
            res = (Date.now() - this.lastCapStart) > this.capTime;
        } else {
            res = this.lastCapStop - this.lastCapStart > this.capTime;
        }

        if (res) {
            this.remove = true;
        }

        return res;

    }

    getPacket() {
        let packet: PacketCapture = {
            id: this.id,
            tm: this.team,
        }

        if (this.capturer) {
            packet.plID = this.capturer.id;
        }

        return packet;
    }
}

export { Capture_SE };