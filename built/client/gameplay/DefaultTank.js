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
var DefaultTankProps = {
    ASSET_NAME: "tankBodys",
    ANCHORX: 0.5,
    ANCHORY: 0.5,
    SIZEX: 1,
    SIZEY: 1.4375
};
var DefaultTank = /** @class */ (function (_super) {
    __extends(DefaultTank, _super);
    function DefaultTank() {
        var _this = _super.call(this, DefaultTankProps.ASSET_NAME) || this;
        _this.anchor.setTo(DefaultTankProps.ANCHORX, DefaultTankProps.ANCHORY);
        _this.width = DefaultTankProps.SIZEX * game.sizeCoeff;
        _this.height = DefaultTankProps.SIZEY * game.sizeCoeff;
        _this.framesInRow = 1;
        _this.turret = new Phaser.Sprite(game, _this.x, _this.y, "defaultTurret");
        _this.turret.remAngle = 0;
        _this.turret.anchor.setTo(0.5, 0.8453);
        _this.turret.width = 0.625 * game.sizeCoeff;
        _this.turret.height = 0.625 * 3.23 * game.sizeCoeff;
        return _this;
    }
    return DefaultTank;
}(Tank));
