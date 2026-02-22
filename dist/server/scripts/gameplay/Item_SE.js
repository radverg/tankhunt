"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item_SE = void 0;
var GameObject_SE_1 = require("./utils/GameObject_SE");
var Item_SE = (function (_super) {
    __extends(Item_SE, _super);
    function Item_SE(typeIndex) {
        var _this = _super.call(this, 0, 0, 0.9, 0.9) || this;
        _this.owner = null;
        _this._wornOut = false;
        _this.pressed = false;
        _this.typeIndex = typeIndex;
        return _this;
    }
    Object.defineProperty(Item_SE.prototype, "wornOut", {
        get: function () { return this._wornOut; },
        set: function (val) { this._wornOut = val; if (val && this.owner.socket.connected && this.owner.game)
            this.owner.socket.emit("wo"); },
        enumerable: false,
        configurable: true
    });
    ;
    Item_SE.prototype.overlapsTank = function (tank) {
        if (tank.body.circularIntersect(this.body)) {
            return tank.body.pointOverlapping(this.body);
        }
        return false;
    };
    Item_SE.prototype.getStatePacket = function () {
        var packet = _super.prototype.getStatePacket.call(this);
        packet.typeIndex = this.typeIndex;
        return packet;
    };
    Item_SE.prototype.bindOwner = function (player) {
        this.owner = player;
    };
    Item_SE.prototype.onPress = function (game) {
        this.pressed = true;
    };
    Item_SE.prototype.onRelease = function (game) {
        this.pressed = false;
    };
    Item_SE.prototype.onHold = function (game) { };
    return Item_SE;
}(GameObject_SE_1.GameObject_SE));
exports.Item_SE = Item_SE;
