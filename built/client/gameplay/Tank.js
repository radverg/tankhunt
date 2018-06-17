"use strict";
/// <reference path="../refs.ts" />
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
var Tank = /** @class */ (function (_super) {
    __extends(Tank, _super);
    function Tank(asset) {
        var _this = _super.call(this, TH.game, 0, 0, asset) || this;
        _this.remX = 0;
        _this.remY = 0;
        _this.remAngle = 0;
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
    Tank.prototype.positionServerUpdate = function (x, y) {
        this.remX = x * TH.sizeCoeff;
        this.remY = y * TH.sizeCoeff;
    };
    Tank.prototype.updateTurret = function () {
        this.turret.x = this.x;
        this.turret.y = this.y;
    };
    Tank.prototype.rotationServerUpdate = function (rot) {
        this.remAngle = rot;
    };
    Tank.prototype.rotationTurretServerUpdate = function (rot) {
        this.turret.remAngle = rot;
    };
    Tank.prototype.addToScene = function () {
        TH.game.add.existing(this);
        TH.game.add.existing(this.turret);
        //if (!visible) this.kill();
    };
    Tank.prototype.applyStatePacket = function (packet) {
        this.rotationServerUpdate(packet.rot);
        this.rotationTurretServerUpdate(packet.turrRot);
        this.positionServerUpdate(packet.x, packet.y);
    };
    /**
     * Sets immediatelly tank's position, rotation and turret rotation to remote values, without interpolation
     */
    Tank.prototype.jumpToRemote = function () {
        this.x = this.remX;
        this.y = this.remY;
        this.rotation = this.remAngle;
        this.turret.rotation = this.turret.remAngle;
    };
    Tank.prototype.kill = function () {
        _super.prototype.kill.call(this);
        this.turret.kill();
    };
    Tank.prototype.revive = function () {
        _super.prototype.revive.call(this);
        this.turret.revive();
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
}(Phaser.Sprite));
