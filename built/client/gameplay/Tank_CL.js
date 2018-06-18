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
var Tank_CL = (function (_super) {
    __extends(Tank_CL, _super);
    function Tank_CL(asset) {
        var _this = _super.call(this, TH.game, 0, 0, asset) || this;
        _this.player = null;
        _this.frameStart = 1;
        _this._defaultColor = Color.Red;
        _this._color = Color.Red;
        _this.color = Color.Red;
        return _this;
    }
    Object.defineProperty(Tank_CL.prototype, "defaultColor", {
        set: function (val) { this._defaultColor = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tank_CL.prototype, "color", {
        set: function (val) {
            this._color = val;
            this.frameStart = val * (this.framesInRow || 1);
            this.frame = this.frameStart;
        },
        enumerable: true,
        configurable: true
    });
    Tank_CL.prototype.updateTurret = function () {
        this.turret.x = this.x;
        this.turret.y = this.y;
    };
    Tank_CL.prototype.rotationTurretServerUpdate = function (rot) {
        this.turret.rotationServerUpdate(rot);
    };
    Tank_CL.prototype.addToScene = function () {
        TH.game.add.existing(this);
        TH.game.add.existing(this.turret);
    };
    Tank_CL.prototype.applyStatePacket = function (packet) {
        this.rotationServerUpdate(packet.rot);
        this.rotationTurretServerUpdate(packet.turrRot);
        this.positionServerUpdate(packet.x, packet.y);
    };
    Tank_CL.prototype.jumpToRemote = function () {
        this.x = this.remX;
        this.y = this.remY;
        this.rotation = this.remAngle;
        this.turret.jumpToRemote();
        this.updateTurret();
    };
    Tank_CL.prototype.kill = function () {
        _super.prototype.kill.call(this);
        this.turret.kill();
    };
    Tank_CL.prototype.revive = function () {
        _super.prototype.revive.call(this);
        this.turret.revive();
    };
    Tank_CL.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.turret.destroy();
    };
    Tank_CL.prototype.hide = function () {
        this.visible = false;
        this.turret.visible = false;
    };
    Tank_CL.prototype.show = function () {
        this.visible = true;
        this.turret.visible = true;
    };
    return Tank_CL;
}(Sprite));
