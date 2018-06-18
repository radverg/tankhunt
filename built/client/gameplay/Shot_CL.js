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
var Shot_CL = (function (_super) {
    __extends(Shot_CL, _super);
    function Shot_CL(dataPack, asset) {
        var _this = _super.call(this, TH.game, dataPack.startX * TH.sizeCoeff, dataPack.startY * TH.sizeCoeff, asset || "whiteRect") || this;
        _this.delay = 16;
        _this.moveTween = null;
        var dataKeys = Object.keys(dataPack);
        for (var i = 0; i < dataKeys.length; i++) {
            _this[dataKeys[i]] = dataPack[dataKeys[i]];
        }
        _this.x *= TH.sizeCoeff;
        _this.y *= TH.sizeCoeff;
        _this.delay = (Date.now() - dataPack.startTime) || 16;
        return _this;
    }
    return Shot_CL;
}(Sprite));
var LaserDirect_CL = (function (_super) {
    __extends(LaserDirect_CL, _super);
    function LaserDirect_CL(dataPack) {
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
    return LaserDirect_CL;
}(Shot_CL));
var APCR_CL = (function (_super) {
    __extends(APCR_CL, _super);
    function APCR_CL(dataPack) {
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
    return APCR_CL;
}(Shot_CL));
var Shots = {
    LaserDirect: LaserDirect_CL,
    APCR: APCR_CL
};
