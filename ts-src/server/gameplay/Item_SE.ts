import { getRandomInt } from "./utils/MyMath_SE";
import { GameObject_SE } from "./utils/GameObject_SE";
import { Tank_SE } from "./Tank_SE";
var Data: Dat = require("../../shared/Data");

class Item_SE extends GameObject_SE {
    
    typeIndex: string;
    
    constructor(x, y, typeIndex) {
        super(x, y, Data.Items.size, Data.Items.size);

        this.typeIndex = typeIndex || getRandomInt(0, Data.Items.types.length);
       
    }

    overlapsTank(tank: Tank_SE) {
        return tank.body.circularIntersect(this.body);
    }

    getStatePacket(): PacketItem {
        return super.getStatePacket();
    }
}

export {Item_SE};
