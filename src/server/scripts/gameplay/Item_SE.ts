import { getRandomInt } from "./utils/MyMath_SE";
import { GameObject_SE } from "./utils/GameObject_SE";
import { Tank_SE } from "./Tank_SE";
import { Player_SE } from "./Player_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";
var Data: Dat = require("../../../shared/Data");

class Item_SE extends GameObject_SE {
    
    typeIndex: number;
    owner: Player_SE | null = null;
    wornOut: boolean = false;

    /**
     * Determines if player's key for activating this item is pressed
     * This has to be set in onPress and onRelease methods if they are overwritten
     */
    pressed: boolean = false;
    
    constructor(typeIndex: number) {
        super(0,0, Data.Items.size, Data.Items.size);

        this.typeIndex = typeIndex || getRandomInt(0, Data.Items.types.length);
       
    }

    overlapsTank(tank: Tank_SE) {
        if (tank.body.circularIntersect(this.body)) {
            // TODO: Upgrade intersect logic
            return true;
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
