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
        _this.shotGroup = TH.thGame.shotGroup;
        _this.startX = dataPack.startX * TH.sizeCoeff;
        _this.startY = dataPack.startY * TH.sizeCoeff;
        _this.endX = dataPack.endX * TH.sizeCoeff;
        _this.endY = dataPack.endY * TH.sizeCoeff;
        _this.x = dataPack.startX * TH.sizeCoeff;
        _this.y = dataPack.startY * TH.sizeCoeff;
        _this.rotation = dataPack.rot;
        _this.startTime = dataPack.startTime;
        _this.speed = dataPack.speed * TH.sizeCoeff;
        _this.delay = TH.timeManager.getDelay(dataPack.startTime) || 16;
        return _this;
    }
    Shot_CL.prototype.start = function () {
    };
    Shot_CL.prototype.stop = function () {
    };
    return Shot_CL;
}(Sprite));
var LaserDirect_CL = (function (_super) {
    __extends(LaserDirect_CL, _super);
    function LaserDirect_CL(dataPack) {
        var _this = _super.call(this, dataPack) || this;
        _this.anchor.set(0.5, 0);
        _this.width = 0.07 * TH.sizeCoeff;
        _this.rotation += Math.PI;
        _this.speed = dataPack.speed * TH.sizeCoeff;
        _this.dist = TH.game.math.distance(_this.endX, _this.endY, _this.startX, _this.startY);
        _this.time = (_this.dist / _this.speed) * 1000;
        _this.tint = 0x7D1ADF;
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
        _this.width = 0.07 * TH.sizeCoeff;
        _this.height = 0.3 * TH.sizeCoeff;
        _this.dist = TH.game.math.distance(_this.endX, _this.endY, _this.startX, _this.startY);
        _this.time = (_this.dist / _this.speed) * 1000;
        _this.start();
        return _this;
    }
    APCR_CL.prototype.start = function () {
        this.moveTween = TH.game.add.tween(this);
        this.moveTween.to({ x: this.endX, y: this.endY }, this.time);
        this.moveTween.onComplete.add(function () { this.destroy(); }, this);
        this.moveTween.start();
        this.shotGroup.add(this);
    };
    APCR_CL.prototype.stop = function () {
        this.moveTween.stop();
        this.destroy();
    };
    return APCR_CL;
}(Shot_CL));
var FlatLaser_CL = (function (_super) {
    __extends(FlatLaser_CL, _super);
    function FlatLaser_CL(dataPack) {
        var _this = _super.call(this, dataPack) || this;
        _this.size = 3 * TH.sizeCoeff;
        _this.anchor.setTo(0.5);
        _this.width = _this.size;
        _this.height = 0.1 * TH.sizeCoeff;
        _this.dist = TH.game.math.distance(_this.endX, _this.endY, _this.startX, _this.startY);
        _this.time = (_this.dist / _this.speed) * 1000;
        _this.tint = 0x7D1ADF;
        _this.shotGroup.add(_this);
        var twn = TH.game.add.tween(_this);
        twn.to({ x: _this.endX, y: _this.endY }, _this.time);
        twn.onComplete.add(function () { this.destroy(); }, _this);
        twn.start();
        return _this;
    }
    return FlatLaser_CL;
}(Shot_CL));
var Bouncer_CL = (function (_super) {
    __extends(Bouncer_CL, _super);
    function Bouncer_CL(dataPack) {
        var _this = _super.call(this, dataPack, "ammo") || this;
        _this.currentBounce = 0;
        _this.tweens = [];
        _this.bouncePoints = [];
        _this.bouncePoints = dataPack.pts;
        _this.anchor.set(0.5, 0);
        _this.width = 0.07 * TH.sizeCoeff;
        _this.height = 0.3 * TH.sizeCoeff;
        for (var i = 1; i < dataPack.pts.length; i++) {
            var ptX = dataPack.pts[i].x * TH.sizeCoeff;
            var ptY = dataPack.pts[i].y * TH.sizeCoeff;
            var dist = TH.game.math.distance(ptX, ptY, dataPack.pts[i - 1].x * TH.sizeCoeff, dataPack.pts[i - 1].y * TH.sizeCoeff);
            var time = (dist / _this.speed) * 1000;
            var twn = TH.game.add.tween(_this);
            twn.to({ x: ptX, y: ptY }, time);
            twn.onComplete.add(function () {
                this.currentBounce++;
                if (this.tweens[this.currentBounce]) {
                    this.rotation = this.bouncePoints[this.currentBounce].ang;
                    this.tweens[this.currentBounce].start();
                }
                else {
                    this.destroy();
                }
            }, _this);
            _this.tweens.push(twn);
        }
        _this.shotGroup.add(_this);
        _this.tweens[0].start();
        return _this;
    }
    return Bouncer_CL;
}(Shot_CL));
var Shots = {
    LaserDirect: LaserDirect_CL,
    APCR: APCR_CL,
    FlatLaser: FlatLaser_CL,
    Bouncer: Bouncer_CL
};
