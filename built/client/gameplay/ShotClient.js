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
var Shot = /** @class */ (function (_super) {
    __extends(Shot, _super);
    function Shot(dataPack, asset) {
        var _this = _super.call(this, game, dataPack.startX * game.sizeCoeff, dataPack.startY * game.sizeCoeff, asset || "whiteRect") || this;
        // Extract datapack from server
        // contains: id, rot, type, startX, startY, startTime, ownerID
        var dataKeys = Object.keys(dataPack);
        for (var i = 0; i < dataKeys.length; i++) {
            _this[dataKeys[i]] = dataPack[dataKeys[i]];
        }
        _this.delay = (Date.now() - dataPack.startTime) || 10;
        _this.moveTween = null;
        return _this;
    }
    return Shot;
}(Phaser.Sprite));
var LaserDirect = /** @class */ (function (_super) {
    __extends(LaserDirect, _super);
    function LaserDirect(dataPack) {
        var _this = _super.call(this, dataPack) || this;
        _this.anchor.set(0.5, 0);
        _this.width = 0.07 * game.sizeCoeff;
        _this.rotation = _this.rot + Math.PI;
        _this.endPoint = { x: dataPack.endX * game.sizeCoeff, y: dataPack.endY * game.sizeCoeff };
        _this.speed = dataPack.speed * game.sizeCoeff;
        _this.dist = game.math.distance(_this.endPoint.x, _this.endPoint.y, _this.startX * game.sizeCoeff, _this.startY * game.sizeCoeff);
        _this.time = (_this.dist / _this.speed) * 1000;
        _this.tint = 0xF80000;
        // Start laser
        // Move laser forwards according to delay
        _this.height = (_this.speed / 1000) * _this.delay;
        game.add.existing(_this);
        var twn = game.add.tween(_this);
        twn.to({ height: _this.dist }, _this.time);
        twn.onComplete.add(function () { this.destroy(); }, _this);
        twn.start();
        return _this;
    }
    return LaserDirect;
}(Shot));
var APCR = /** @class */ (function (_super) {
    __extends(APCR, _super);
    function APCR(dataPack) {
        var _this = _super.call(this, dataPack, "ammo") || this;
        _this.anchor.set(0.5, 0);
        _this.rotation = _this.rot;
        _this.width = 0.07 * game.sizeCoeff;
        _this.height = 0.3 * game.sizeCoeff;
        _this.endPoint = { x: dataPack.endX * game.sizeCoeff, y: dataPack.endY * game.sizeCoeff };
        _this.speed = dataPack.speed * game.sizeCoeff;
        _this.dist = game.math.distance(_this.endPoint.x, _this.endPoint.y, _this.startX * game.sizeCoeff, _this.startY * game.sizeCoeff);
        _this.time = (_this.dist / _this.speed) * 1000;
        // Start the shot 
        game.add.existing(_this);
        _this.moveTween = game.add.tween(_this);
        _this.moveTween.to({ x: _this.endPoint.x, y: _this.endPoint.y }, _this.time);
        _this.moveTween.onComplete.add(function () { this.destroy(); }, _this);
        _this.moveTween.start();
        return _this;
    }
    return APCR;
}(Shot));
var Shots = {
    LaserDirect: LaserDirect,
    APCR: APCR
};
