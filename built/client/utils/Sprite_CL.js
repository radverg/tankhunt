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
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(game, x, y, asset) {
        var _this = _super.call(this, game, x, y, asset) || this;
        _this.interpolationConst = 0.2;
        _this.remX = 0;
        _this.remY = 0;
        _this.remAngle = 0;
        _this.frameStart = 1;
        _this.framesInRow = 1;
        _this.defaultColorIndex = 1;
        return _this;
    }
    Object.defineProperty(Sprite.prototype, "colorIndex", {
        set: function (val) {
            this.frameStart = val * (this.framesInRow || 1);
            this.frame = this.frameStart;
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.interpolate = function () {
        var diffX = this.remX - this.x;
        var diffY = this.remY - this.y;
        var dist = Math.sqrt(diffX * diffX + diffY * diffY);
        if (dist < 2) {
            this.x = this.remX;
            this.y = this.remY;
            return;
        }
        this.x += diffX * this.interpolationConst;
        this.y += diffY * this.interpolationConst;
    };
    Sprite.prototype.interpolateAngle = function () {
        var diff = this.remAngle - this.rotation;
        if (Math.abs(diff) < Math.PI / 90) {
            this.rotation = this.remAngle;
            return;
        }
        this.rotation += diff * this.interpolationConst;
    };
    Sprite.prototype.positionServerUpdate = function (x, y) {
        this.remX = x * TH.sizeCoeff;
        this.remY = y * TH.sizeCoeff;
    };
    Sprite.prototype.rotationServerUpdate = function (rot) {
        this.remAngle = rot;
    };
    Sprite.prototype.jumpToRemote = function () {
        this.x = this.remX;
        this.y = this.remY;
        this.rotation = this.remAngle;
    };
    return Sprite;
}(Phaser.Sprite));
