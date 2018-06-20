import { getRandomInt } from "./utils/MyMath_SE";
import { GameObject_SE } from "./utils/GameObject_SE";
import { Tank_SE } from "./Tank_SE";
var Data: Dat = require("../../shared/Data");

class Item_SE extends GameObject_SE {
    
    typeIndex: number;
    
    constructor(x: number, y: number, typeIndex: number) {
        super(x, y, Data.Items.size, Data.Items.size);

        this.typeIndex = typeIndex || getRandomInt(0, Data.Items.types.length);
       
    }

    overlapsTank(tank: Tank_SE) {
        return tank.body.circularIntersect(this.body);
    }

    getStatePacket(): PacketItem {
        let packet: PacketItem = super.getStatePacket() as PacketItem;
        packet.typeIndex = this.typeIndex;
        return packet;
    }
}

export {Item_SE};
