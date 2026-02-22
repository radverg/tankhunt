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
        _this.intMoving = false;
        _this.onIntMoveStop = new Phaser.Signal();
        _this.onIntMoveStart = new Phaser.Signal();
        _this.onIntMove = new Phaser.Signal();
        _this.onColorChange = new Phaser.Signal();
        return _this;
    }
    Object.defineProperty(Sprite.prototype, "colorIndex", {
        set: function (val) {
            this.frameStart = val * (this.framesInRow || 1);
            this.frame = this.frameStart;
            this.onColorChange.dispatch(val);
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.interpolate = function () {
        var diffX = this.remX - this.x;
        var diffY = this.remY - this.y;
        var dist = Math.sqrt(diffX * diffX + diffY * diffY);
        if (dist < 2 || dist > TH.sizeCoeff * 2) {
            this.x = this.remX;
            this.y = this.remY;
            if (this.intMoving) {
                this.onIntMoveStop.dispatch();
                this.intMoving = false;
            }
            return;
        }
        else {
            if (!this.intMoving) {
                this.onIntMoveStart.dispatch();
                this.intMoving = true;
            }
        }
        this.x += diffX * this.interpolationConst;
        this.y += diffY * this.interpolationConst;
    };
    Sprite.prototype.interpolateAngle = function () {
        var diff = this.remAngle - this.rotation;
        if (Math.abs(diff) < Math.PI / 90 || Math.abs(diff) > Math.PI / 3) {
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
    Sprite.prototype.isMoving = function () {
        return !(Math.round(this.previousPosition.x) === Math.round(this.position.x) &&
            Math.round(this.previousPosition.y) === Math.round(this.position.y));
    };
    Sprite.prototype.isRotating = function () {
        return parseFloat(this.rotation.toPrecision(5)) !== parseFloat(this.previousRotation.toPrecision(5));
    };
    Sprite.prototype.jumpToRemote = function () {
        this.x = this.remX;
        this.y = this.remY;
        this.rotation = this.remAngle;
    };
    Sprite.prototype.isGoingBack = function () {
    };
    return Sprite;
}(Phaser.Sprite));
