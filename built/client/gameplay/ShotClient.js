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
var Shot = (function (_super) {
    __extends(Shot, _super);
    function Shot(dataPack, asset) {
        var _this = _super.call(this, TH.game, dataPack.startX * TH.sizeCoeff, dataPack.startY * TH.sizeCoeff, asset || "whiteRect") || this;
        _this.delay = 16;
        _this.moveTween = null;
        var dataKeys = Object.keys(dataPack);
        for (var i = 0; i < dataKeys.length; i++) {
            _this[dataKeys[i]] = dataPack[dataKeys[i]];
        }
        _this.delay = (Date.now() - dataPack.startTime) || 16;
        return _this;
    }
    return Shot;
}(Sprite));
var LaserDirect = (function (_super) {
    __extends(LaserDirect, _super);
    function LaserDirect(dataPack) {
        var _this = _super.call(this, dataPack) || this;
        _this.anchor.set(0.5, 0);
        _this.width = 0.07 * TH.sizeCoeff;
        _this.rotation = dataPack.rot + Math.PI;
        _this.endPoint = { x: dataPack.endX * TH.sizeCoeff, y: dataPack.endY * TH.sizeCoeff };
        _this.speed = dataPack.speed * TH.sizeCoeff;
        _this.dist = TH.game.math.distance(_this.endPoint.x, _this.endPoint.y, _this.startX * TH.sizeCoeff, _this.startY * TH.sizeCoeff);
        _this.time = (_this.dist / _this.speed) * 1000;
        _this.tint = 0xF80000;
        _this.height = (_this.speed / 1000) * _this.delay;
        TH.game.add.existing(_this);
        var twn = TH.game.add.tween(_this);
        twn.to({ height: _this.dist }, _this.time);
        twn.onComplete.add(function () { this.destroy(); }, _this);
        twn.start();
        return _this;
    }
    return LaserDirect;
}(Shot));
var APCR = (function (_super) {
    __extends(APCR, _super);
    function APCR(dataPack) {
        var _this = _super.call(this, dataPack, "ammo") || this;
        _this.anchor.set(0.5, 0);
        _this.rotation = dataPack.rot;
        _this.width = 0.07 * TH.sizeCoeff;
        _this.height = 0.3 * TH.sizeCoeff;
        _this.endPoint = { x: dataPack.endX * TH.sizeCoeff, y: dataPack.endY * TH.sizeCoeff };
        _this.speed = dataPack.speed * TH.sizeCoeff;
        _this.dist = TH.game.math.distance(_this.endPoint.x, _this.endPoint.y, _this.startX * TH.sizeCoeff, _this.startY * TH.sizeCoeff);
        _this.time = (_this.dist / _this.speed) * 1000;
        TH.game.add.existing(_this);
        _this.moveTween = TH.game.add.tween(_this);
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
