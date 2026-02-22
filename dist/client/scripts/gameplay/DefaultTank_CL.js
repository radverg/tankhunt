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
var DefaultTank_CL = (function (_super) {
    __extends(DefaultTank_CL, _super);
    function DefaultTank_CL() {
        var _this = _super.call(this, "tankBodys") || this;
        _this.leftExSpr = null;
        _this.rightExSpr = null;
        _this.rightExTween = null;
        _this.leftExTween = null;
        _this.currAnimName = "tracks1";
        _this.anchor.setTo(0.5);
        _this.width = TH.sizeCoeff;
        _this.height = 1.4375 * TH.sizeCoeff;
        _this.shadow.width = _this.width + 20;
        _this.shadow.height = _this.height + 20;
        _this.framesInRow = 4;
        _this.frameStart = 0;
        _this.turret = new Sprite(TH.game, _this.x, _this.y, "defaultTurrets");
        _this.turret.anchor.setTo(0.5, 0.8453);
        _this.turret.width = 0.825 * TH.sizeCoeff;
        _this.turret.height = 0.825 * 3.23 * TH.sizeCoeff;
        _this.addChild(_this.turret);
        _this.onColorChange.add(function (val) { _this.adjustTrackAnim(val); }, _this);
        _this.initExhaustAnim();
        _this.initTrackAnim();
        _this.onIntMoveStart.add(_this.startExhaustEffect, _this);
        _this.onIntMoveStop.add(_this.stopExhaustEffect, _this);
        return _this;
    }
    DefaultTank_CL.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.isMoving() || this.isRotating()) {
            this.animations.play(this.currAnimName);
        }
        else {
            this.animations.stop(this.currAnimName);
        }
        if (this.turretEngineSound) {
            if (this.turret.isRotating()) {
                if (!this.turretEngineSound.isPlaying) {
                    TH.effects.playAudio(SoundNames.ENGINETURRET);
                }
            }
            else if (this.turretEngineSound.isPlaying) {
                TH.effects.stopAudio(SoundNames.ENGINETURRET);
            }
        }
    };
    DefaultTank_CL.prototype.initTrackAnim = function () {
        var fps = 20;
        this.animations.add("tracks1", [0, 1, 2, 3], fps);
        this.animations.add("tracks2", [4, 5, 6, 7], fps);
        this.animations.add("tracks3", [8, 9, 10, 11], fps);
        this.animations.add("tracks4", [12, 13, 14, 15], fps);
    };
    DefaultTank_CL.prototype.adjustTrackAnim = function (colorIndex) {
        var currAnim = this.animations.getAnimation(this.currAnimName);
        if (!currAnim)
            return;
        var startNext = currAnim.isPlaying;
        currAnim.stop();
        this.frame = this.frameStart;
        this.currAnimName = "tracks".concat(colorIndex + 1);
        if (startNext)
            this.animations.play(this.currAnimName);
    };
    DefaultTank_CL.prototype.initExhaustAnim = function () {
        var exLeftSpr = this.game.make.sprite(TH.sizeCoeff * 0.3 + TH.sizeCoeff * 1.5, TH.sizeCoeff * 3.6, "exhaust");
        var exRightSpr = this.game.make.sprite(-TH.sizeCoeff * 0.3 + TH.sizeCoeff * 1.5, TH.sizeCoeff * 3.6, "exhaust2");
        exLeftSpr.blendMode = PIXI.blendModes.MULTIPLY;
        exRightSpr.blendMode = PIXI.blendModes.MULTIPLY;
        this.leftExSpr = exLeftSpr;
        this.rightExSpr = exRightSpr;
        exLeftSpr.rotation = Math.PI;
        exRightSpr.rotation = Math.PI;
        exLeftSpr.alpha = 0.2;
        exRightSpr.alpha = 0.2;
        this.leftExTween = this.game.add.tween(exLeftSpr);
        this.rightExTween = this.game.add.tween(exRightSpr);
        exLeftSpr.animations.add("blow", null, 20, true);
        exRightSpr.animations.add("blow", null, 40, true);
        exLeftSpr.animations.play("blow");
        exRightSpr.animations.play("blow");
        this.addChild(exLeftSpr);
        this.addChild(exRightSpr);
    };
    DefaultTank_CL.prototype.startExhaustEffect = function () {
        this.rightExTween.stop();
        this.leftExTween.stop();
        this.rightExTween = this.game.add.tween(this.rightExSpr).to({ alpha: 0.8 }, 500, Phaser.Easing.Default, true);
        this.leftExTween = this.game.add.tween(this.leftExSpr).to({ alpha: 0.8 }, 500, Phaser.Easing.Default, true);
        if (this.engineSound) {
            this.engineSound.fadeTo(250, 0.15);
        }
    };
    DefaultTank_CL.prototype.stopExhaustEffect = function () {
        this.rightExTween.stop();
        this.leftExTween.stop();
        this.rightExTween = this.game.add.tween(this.rightExSpr).to({ alpha: 0.2 }, 500, Phaser.Easing.Default, true);
        this.leftExTween = this.game.add.tween(this.leftExSpr).to({ alpha: 0.2 }, 500, Phaser.Easing.Default, true);
        if (this.engineSound) {
            this.engineSound.fadeTo(250, 0.0001);
        }
    };
    DefaultTank_CL.prototype.initEngineSound = function () {
        this.engineSound = TH.effects.getSound(SoundNames.ENGINELOW);
        this.engineSound.loop = true;
        this.engineSound.play(SoundNames.ENGINELOW, null, 0.0001, true);
        this.turretEngineSound = TH.effects.getSound(SoundNames.ENGINETURRET);
    };
    DefaultTank_CL.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.engineSound)
            this.engineSound.stop();
    };
    return DefaultTank_CL;
}(Tank_CL));
