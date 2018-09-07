import { GameObject_SE } from "./utils/GameObject_SE";
import { Tank_SE } from "./Tank_SE";
import { Player_SE } from "./Player_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";

class Item_SE extends GameObject_SE {
    
    typeIndex: number;
    owner: Player_SE | null = null;

    private _wornOut: boolean = false;
    set wornOut(val: boolean) { this._wornOut = val; if (val && this.owner.socket.connected && this.owner.game) this.owner.socket.emit("wo"); }
    get wornOut() { return this._wornOut };

    /**
     * Determines if player's key for activating this item is pressed
     * This has to be set in onPress and onRelease methods if they are overwritten
     */
    pressed: boolean = false;
    
    constructor(typeIndex: number) {
        super(0,0, 0.9, 0.9);

        this.typeIndex = typeIndex;
       
    }

    overlapsTank(tank: Tank_SE) {
        if (tank.body.circularIntersect(this.body)) {
            // TODO: Upgrade intersect logic
            return tank.body.pointOverlapping(this.body);
        }

        return false;
    }

    getStatePacket(): PacketItem {
        let packet: PacketItem = super.getStatePacket() as PacketItem;
        packet.typeIndex = this.typeIndex;
        return packet;
    }

    bindOwner(player: Player_SE) {
        this.owner =player;
    }

    onPress(game: THGame_SE): void {
        this.pressed = true;
    }

    onRelease(game: THGame_SE): void {
        this.pressed = false;
    }

    onHold(game: THGame_SE): void {

    }
}

export {Item_SE};
