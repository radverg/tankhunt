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
exports.Bot_SE = void 0;
var Player_SE_1 = require("./Player_SE");
var Geometry_SE_1 = require("./utils/Geometry_SE");
var Bot_SE = (function (_super) {
    __extends(Bot_SE, _super);
    function Bot_SE(game) {
        var _this = _super.call(this, null, "bot") || this;
        _this.updateCounter = 0;
        _this.headingTo = null;
        _this.thGame = game;
        return _this;
    }
    Bot_SE.prototype.update = function () {
        this.updateCounter++;
        if (this.headingTo.equals(new Geometry_SE_1.Vec2(this.thGame.level.getSqrX(this.tank.x), this.thGame.level.getSqrX(this.tank.x)))) {
        }
    };
    return Bot_SE;
}(Player_SE_1.Player_SE));
exports.Bot_SE = Bot_SE;
