"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MyMath_SE_1 = require("./utils/MyMath_SE");
var GameObject_SE_1 = require("./utils/GameObject_SE");
var Data = require("../../shared/Data");
var Item_SE = (function (_super) {
    __extends(Item_SE, _super);
    function Item_SE(x, y, typeIndex) {
        var _this = _super.call(this, x, y, Data.Items.size, Data.Items.size) || this;
        _this.typeIndex = typeIndex || MyMath_SE_1.getRandomInt(0, Data.Items.types.length);
        return _this;
    }
    Item_SE.prototype.overlapsTank = function (tank) {
        return tank.body.circularIntersect(this.body);
    };
    Item_SE.prototype.getStatePacket = function () {
        var packet = _super.prototype.getStatePacket.call(this);
        packet.typeIndex = this.typeIndex;
        return packet;
    };
    return Item_SE;
}(GameObject_SE_1.GameObject_SE));
exports.Item_SE = Item_SE;
