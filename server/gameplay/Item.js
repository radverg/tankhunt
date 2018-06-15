var GO = require("./utils/GameObject");
var Data = require("../../shared/Data");
var mymath = require("./utils/MyMath");

class Item extends GO {

    constructor(x, y, typeIndex) {
        super(x, y, Data.Items.size, Data.Items.size);

        this.typeIndex = typeIndex || mymath.getRandomInt(0, Data.Items.types.length);

    }

    overlapsTank(tank) {
        return tank.body.circularIntersect(this.body);
    }
}

module.exports = Item;