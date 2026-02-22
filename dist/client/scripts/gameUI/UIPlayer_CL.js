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
var UIPlayer_CL = (function (_super) {
    __extends(UIPlayer_CL, _super);
    function UIPlayer_CL(phaserGame, thGame, player) {
        var _this = _super.call(this, phaserGame) || this;
        _this.thGame = thGame;
        _this.player = player;
        _this.player.UIpl = _this;
        var offsetY = -_this.player.tank.height;
        _this.nick = _this.game.make.text(0, offsetY, _this.player.name);
        _this.nick.font = "Orbitron";
        _this.nick.fontSize = 25;
        _this.nick.alpha = 0.6;
        _this.nick.anchor.setTo(0.5);
        _this.add(_this.nick);
        _this.healthBar = new HealthBar_CL(_this, offsetY + 25);
        _this.updateHealthBar();
        _this.itemIcon = _this.create(0, offsetY - 35, "items");
        _this.itemIcon.scale.setTo(0.6);
        _this.itemIcon.anchor.setTo(0.5);
        _this.itemIcon.alpha = 0.8;
        _this.itemIcon.kill();
        return _this;
    }
    UIPlayer_CL.prototype.updateHealthBar = function () {
        this.healthBar.updateHealthBar(this.player.tank.maxHealth, this.player.tank.health);
    };
    UIPlayer_CL.prototype.healthChange = function (healthBef, healthAft) {
        this.updateHealthBar();
        var healthDiff = healthAft - healthBef;
        var text = (healthDiff < 0) ? "".concat(healthDiff, " hp") : "+".concat(healthDiff.toFixed(0), " hp");
        var color = (healthDiff < 0) ? "#e02626" : "#139607";
        if (!TH.effects.should())
            return;
        this.add(TextMaker_CL.goUpText(text, this.player.tank.width / 2 + 10, 0, color));
    };
    UIPlayer_CL.prototype.blockSign = function () {
        if (!TH.effects.should())
            return;
        this.add(TextMaker_CL.goUpText("blocked", this.player.tank.width / 2 + 10, 0, "white"));
    };
    UIPlayer_CL.prototype.showItemIcon = function (frame) {
        this.itemIcon.revive();
        this.itemIcon.frame = frame;
    };
    UIPlayer_CL.prototype.hideItemIcon = function () {
        this.itemIcon.kill();
    };
    return UIPlayer_CL;
}(Phaser.Group));
