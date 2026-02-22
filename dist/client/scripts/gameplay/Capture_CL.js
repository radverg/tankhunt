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
var Capture_CL = (function (_super) {
    __extends(Capture_CL, _super);
    function Capture_CL(sqrX, sqrY, sqrSize, team, myTeam, capTime, game) {
        var _this = _super.call(this, game, null) || this;
        _this.isOurs = (myTeam === team);
        _this.x = sqrX * sqrSize + sqrSize / 2;
        _this.y = sqrY * sqrSize + sqrSize / 2;
        _this.flag = _this.create(0, 0, (_this.isOurs) ? "flagGreen" : "flagRed");
        _this.flag.anchor.setTo(0.5);
        _this.flag.scale.setTo(0.8);
        _this.team = team;
        _this.capTime = capTime;
        _this.id = "a".concat(sqrX, "|").concat(sqrY);
        var flagAnim = _this.flag.animations.add("allFrames", null, 40, true);
        _this.flag.animations.play("allFrames", 50, true);
        flagAnim.frame = Math.floor(Math.random() * flagAnim.frameTotal);
        var barWidth = sqrSize * 0.8;
        var barHeight = 5;
        var barYOffset = -sqrSize * 0.4;
        _this.capBarB = _this.create(0, barYOffset, "blackRect");
        _this.capBarB.anchor.setTo(0.5);
        _this.capBarB.width = barWidth;
        _this.capBarB.height = barHeight;
        _this.capBarF = _this.create(-_this.capBarB.width / 2, barYOffset, "whiteRect");
        _this.capBarF.anchor.setTo(0, 0.5);
        _this.capBarF.width = 0;
        _this.capBarF.height = _this.capBarB.height;
        _this.capBarF.tint = (!_this.isOurs) ? 0x1c7000 : 0x720000;
        return _this;
    }
    Capture_CL.prototype.startCapturing = function () {
        this.cancelCapturing();
        this.growTween = this.game.add.tween(this.capBarF).to({ width: this.capBarB.width }, this.capTime, Phaser.Easing.Default, true);
    };
    Capture_CL.prototype.cancelCapturing = function () {
        if (this.growTween && this.growTween.isRunning) {
            this.growTween.stop();
        }
        this.capBarF.width = 0;
    };
    Capture_CL.prototype.fadeOut = function () {
        this.capBarB.destroy();
        this.capBarF.destroy();
        var twn = this.game.add.tween(this.flag).to({ y: this.flag.y - 100, alpha: 0 }, 400);
        twn.onComplete.add(function () { this.destroy(); }, this);
        twn.start();
    };
    return Capture_CL;
}(Phaser.Group));
