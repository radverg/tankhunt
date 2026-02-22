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
var Shot_CL = (function (_super) {
    __extends(Shot_CL, _super);
    function Shot_CL(dataPack, asset) {
        var _this = _super.call(this, TH.game, dataPack.startX * TH.sizeCoeff, dataPack.startY * TH.sizeCoeff, asset || "whiteRect") || this;
        _this.delay = 16;
        _this.moveTween = null;
        _this.shotGroup = TH.thGame.shotGroup;
        _this.killCount = 0;
        _this.startX = dataPack.startX * TH.sizeCoeff;
        _this.startY = dataPack.startY * TH.sizeCoeff;
        _this.endX = dataPack.endX * TH.sizeCoeff;
        _this.endY = dataPack.endY * TH.sizeCoeff;
        _this.x = dataPack.startX * TH.sizeCoeff;
        _this.y = dataPack.startY * TH.sizeCoeff;
        _this.rotation = dataPack.rot;
        _this.startTime = dataPack.startTime;
        _this.speed = dataPack.speed * TH.sizeCoeff;
        _this.ownerPl = dataPack.ownerObj || null;
        _this.delay = TH.timeManager.getDelay(dataPack.startTime) || 16;
        _this.events.onDestroy.add(function () { if (_this.shotGroup && _this.shotGroup.removeShot)
            _this.shotGroup.removeShot(_this); }, _this);
        return _this;
    }
    Shot_CL.prototype.start = function () {
    };
    Shot_CL.prototype.stop = function () {
    };
    Shot_CL.prototype.blast = function (dataPack) {
    };
    Shot_CL.prototype.getOwner = function () {
        return this.ownerPl;
    };
    return Shot_CL;
}(Sprite));
var LaserDirect_CL = (function (_super) {
    __extends(LaserDirect_CL, _super);
    function LaserDirect_CL(dataPack) {
        var _this = _super.call(this, dataPack, "lasers") || this;
        _this.anchor.set(0.5, 0);
        _this.width = 16;
        _this.rotation += Math.PI;
        _this.speed = dataPack.speed * TH.sizeCoeff;
        _this.dist = TH.game.math.distance(_this.endX, _this.endY, _this.startX, _this.startY);
        _this.time = (_this.dist / _this.speed) * 1000;
        _this.frame = _this.ownerPl.tank.defaultColorIndex;
        _this.height = 0;
        TH.game.add.existing(_this);
        var twn = TH.game.add.tween(_this);
        twn.to({ height: _this.dist }, _this.time);
        twn.onComplete.add(function () { this.stop(); }, _this);
        twn.start();
        TH.effects.playAudio(SoundNames.LASER3, _this);
        return _this;
    }
    LaserDirect_CL.prototype.stop = function () {
        var stopTwn = this.game.add.tween(this).to({ alpha: 0 }, 500);
        stopTwn.onComplete.add(function () { this.destroy(); }, this);
        stopTwn.start();
    };
    return LaserDirect_CL;
}(Shot_CL));
var APCR_CL = (function (_super) {
    __extends(APCR_CL, _super);
    function APCR_CL(dataPack) {
        var _this = _super.call(this, dataPack, "shot") || this;
        _this.anchor.set(0.5, 0.5);
        _this.scale.setTo(0.5);
        _this.dist = TH.game.math.distance(_this.endX, _this.endY, _this.startX, _this.startY);
        _this.time = (_this.dist / _this.speed) * 1000;
        return _this;
    }
    APCR_CL.prototype.start = function () {
        this.moveTween = TH.game.add.tween(this);
        this.moveTween.to({ x: this.endX, y: this.endY }, this.time);
        this.moveTween.onComplete.add(function () {
            TH.effects.wallDebrisEffect(this.x, this.y);
            this.destroy();
        }, this);
        this.moveTween.start();
        this.shotGroup.add(this);
        TH.effects.playAudio(SoundNames.BUM1, this);
        this.ownerPl.tank.shotExplodeEffect(this);
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
        var _this = _super.call(this, dataPack, "lasers") || this;
        _this.size = 3 * TH.sizeCoeff;
        _this.anchor.setTo(0.5);
        _this.width = _this.size;
        _this.height = 0.2 * TH.sizeCoeff;
        _this.dist = TH.game.math.distance(_this.endX, _this.endY, _this.startX, _this.startY);
        _this.time = (_this.dist / _this.speed) * 1000;
        _this.frame = _this.ownerPl.tank.defaultColorIndex;
        _this.shotGroup.add(_this);
        var twn = TH.game.add.tween(_this);
        twn.to({ x: _this.endX, y: _this.endY }, _this.time);
        twn.onComplete.add(function () { this.destroy(); }, _this);
        twn.start();
        TH.effects.playAudio(SoundNames.LASER4, _this);
        return _this;
    }
    return FlatLaser_CL;
}(Shot_CL));
var Bouncer_CL = (function (_super) {
    __extends(Bouncer_CL, _super);
    function Bouncer_CL(dataPack, asset) {
        var _this = _super.call(this, dataPack, asset || "shot") || this;
        _this.currentBounce = 0;
        _this.tweens = [];
        _this.wayPoints = [];
        _this.wayPoints = dataPack.pts;
        for (var i = 0; i < _this.wayPoints.length; i++) {
            _this.wayPoints[i].x *= TH.sizeCoeff;
            _this.wayPoints[i].y *= TH.sizeCoeff;
        }
        _this.anchor.set(0.5, 0);
        _this.scale.setTo(0.5);
        return _this;
    }
    Bouncer_CL.prototype.start = function () {
        for (var i = 1; i < this.wayPoints.length; i++) {
            var ptX = this.wayPoints[i].x;
            var ptY = this.wayPoints[i].y;
            var dist = TH.game.math.distance(ptX, ptY, this.wayPoints[i - 1].x, this.wayPoints[i - 1].y);
            var time = (dist / this.speed) * 1000;
            var twn = TH.game.add.tween(this);
            twn.to({ x: ptX, y: ptY }, time);
            twn.onComplete.add(function () {
                this.currentBounce++;
                if (this.tweens[this.currentBounce]) {
                    this.rotation = this.wayPoints[this.currentBounce].ang;
                    TH.effects.wallDebrisEffect(this.x, this.y, 5, null);
                    TH.effects.playAudio(SoundNames.BOUNCE);
                    this.tweens[this.currentBounce].start();
                }
                else {
                    this.stop();
                }
            }, this);
            this.tweens.push(twn);
        }
        this.shotGroup.add(this);
        this.tweens[0].start();
        TH.effects.playAudio(SoundNames.GUNSHOT2, this);
        this.ownerPl.tank.shotExplodeEffect(this);
    };
    Bouncer_CL.prototype.stop = function () {
        this.destroy();
    };
    return Bouncer_CL;
}(Shot_CL));
var PolygonalBouncer_CL = (function (_super) {
    __extends(PolygonalBouncer_CL, _super);
    function PolygonalBouncer_CL(dataPack) {
        var _this = _super.call(this, dataPack, "shotDarker") || this;
        _this.anchor.setTo(0.5);
        _this.scale.setTo(0.8, 0.4);
        return _this;
    }
    PolygonalBouncer_CL.prototype.stop = function () {
        this.destroy();
    };
    return PolygonalBouncer_CL;
}(Bouncer_CL));
var Eliminator_CL = (function (_super) {
    __extends(Eliminator_CL, _super);
    function Eliminator_CL(dataPack) {
        var _this = _super.call(this, dataPack, "ball") || this;
        _this.splintersData = [];
        _this.anchor.setTo(0.5);
        _this.scale.setTo(0.8);
        _this.splintersData = dataPack.spl;
        _this.splinterTime = dataPack.splTime;
        return _this;
    }
    Eliminator_CL.prototype.start = function () {
        _super.prototype.start.call(this);
        TH.effects.stopAudio(SoundNames.GUNSHOT2);
        TH.effects.playAudio(SoundNames.GUNSHOT1);
    };
    Eliminator_CL.prototype.stop = function () {
        this.destroy();
    };
    Eliminator_CL.prototype.blast = function (dataPack) {
        for (var i = 0; i < this.splintersData.length; i++) {
            var spd = this.splintersData[i].speed * TH.sizeCoeff;
            var ang = this.splintersData[i].ang;
            var time = this.splinterTime;
            var splinterSprite = this.shotGroup.create(dataPack.x * TH.sizeCoeff, dataPack.y * TH.sizeCoeff, "shotDarker");
            splinterSprite.rotation = ang;
            splinterSprite.anchor.set(0.5, 0);
            splinterSprite.scale.setTo(0.5);
            var dist = spd * (time / 1000);
            var twn = this.game.add.tween(splinterSprite);
            var endPoint = { x: splinterSprite.x + Math.sin(ang) * dist, y: splinterSprite.y - Math.cos(ang) * dist };
            twn.to({ x: endPoint.x, y: endPoint.y }, time);
            twn.onComplete.add(function () { this.destroy(); }, splinterSprite);
            twn.start();
        }
        TH.effects.playAudio(SoundNames.SHOTMEGAEXP, this);
        this.stop();
    };
    return Eliminator_CL;
}(Bouncer_CL));
var BouncingLaser_CL = (function (_super) {
    __extends(BouncingLaser_CL, _super);
    function BouncingLaser_CL(dataPack) {
        var _this = _super.call(this, dataPack, "whiteRect") || this;
        _this.laserLinesGrp = new Phaser.Group(_this.game);
        _this.shotGroup.add(_this.laserLinesGrp);
        return _this;
    }
    BouncingLaser_CL.prototype.start = function () {
        TH.effects.playAudio("laser1", this);
        this.nextLaserLine();
    };
    BouncingLaser_CL.prototype.nextLaserLine = function () {
        var currB = this.currentBounce;
        if (currB >= this.wayPoints.length - 1) {
            return;
        }
        var pt1 = this.wayPoints[this.currentBounce];
        var pt2 = this.wayPoints[this.currentBounce + 1];
        var lineSpr = new Sprite(this.game, pt1.x, pt1.y, "lasers");
        this.laserLinesGrp.add(lineSpr);
        lineSpr.frame = this.ownerPl.tank.defaultColorIndex;
        lineSpr.anchor.setTo(0.5, 0);
        lineSpr.rotation = pt1.ang + Math.PI;
        lineSpr.width = 14;
        var dist = TH.game.math.distance(pt1.x, pt1.y, pt2.x, pt2.y);
        var time = (dist / this.speed) * 1000;
        var twn = this.game.add.tween(lineSpr);
        twn.to({ height: dist }, time);
        if (currB == this.wayPoints.length - 2) {
            twn.onComplete.add(function () { this.fadeOut(); }, this);
        }
        else {
            twn.onComplete.add(function () { this.nextLaserLine(); }, this);
        }
        twn.start();
        this.currentBounce++;
    };
    BouncingLaser_CL.prototype.stop = function () {
        this.laserLinesGrp.destroy();
        this.destroy();
    };
    BouncingLaser_CL.prototype.fadeOut = function () {
        var stopTwn = this.game.add.tween(this.laserLinesGrp).to({ alpha: 0 }, 500);
        stopTwn.onComplete.add(function () {
            this.laserLinesGrp.destroy();
            this.destroy();
        }, this);
        stopTwn.start();
    };
    return BouncingLaser_CL;
}(Bouncer_CL));
var Mine_CL = (function (_super) {
    __extends(Mine_CL, _super);
    function Mine_CL(dataPack) {
        var _this = _super.call(this, dataPack, "mine") || this;
        _this.anchor.setTo(0.5);
        _this.width = TH.sizeCoeff;
        _this.height = TH.sizeCoeff;
        return _this;
    }
    Mine_CL.prototype.start = function () {
        this.game.add.tween(this).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
        TH.effects.playAudio(SoundNames.MINEBEEP);
        this.shotGroup.add(this);
    };
    return Mine_CL;
}(Shot_CL));
var Shots = {
    LaserDirect: LaserDirect_CL,
    APCR: APCR_CL,
    FlatLaser: FlatLaser_CL,
    Bouncer: Bouncer_CL,
    BouncingLaser: BouncingLaser_CL,
    PolygonalBouncer: PolygonalBouncer_CL,
    Eliminator: Eliminator_CL,
    Mine: Mine_CL
};
