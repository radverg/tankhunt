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
var Tank = (function (_super) {
    __extends(Tank, _super);
    function Tank(asset) {
        var _this = _super.call(this, TH.game, 0, 0, asset) || this;
        _this.player = null;
        _this.frameStart = 1;
        _this._defaultColor = Color.Red;
        _this._color = Color.Red;
        _this.color = Color.Red;
        return _this;
    }
    Object.defineProperty(Tank.prototype, "defaultColor", {
        set: function (val) { this._defaultColor = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tank.prototype, "color", {
        set: function (val) {
            this._color = val;
            this.frameStart = val * (this.framesInRow || 1);
            this.frame = this.frameStart;
        },
        enumerable: true,
        configurable: true
    });
    Tank.prototype.updateTurret = function () {
        this.turret.x = this.x;
        this.turret.y = this.y;
    };
    Tank.prototype.rotationTurretServerUpdate = function (rot) {
        this.turret.rotationServerUpdate(rot);
    };
    Tank.prototype.addToScene = function () {
        TH.game.add.existing(this);
        TH.game.add.existing(this.turret);
    };
    Tank.prototype.applyStatePacket = function (packet) {
        this.rotationServerUpdate(packet.rot);
        this.rotationTurretServerUpdate(packet.turrRot);
        this.positionServerUpdate(packet.x, packet.y);
    };
    Tank.prototype.jumpToRemote = function () {
        this.x = this.remX;
        this.y = this.remY;
        this.rotation = this.remAngle;
        this.turret.jumpToRemote();
        this.updateTurret();
    };
    Tank.prototype.kill = function () {
        _super.prototype.kill.call(this);
        this.turret.kill();
    };
    Tank.prototype.revive = function () {
        _super.prototype.revive.call(this);
        this.turret.revive();
    };
    Tank.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.turret.destroy();
    };
    Tank.prototype.hide = function () {
        this.visible = false;
        this.turret.visible = false;
    };
    Tank.prototype.show = function () {
        this.visible = true;
        this.turret.visible = true;
    };
    return Tank;
}(Sprite));
