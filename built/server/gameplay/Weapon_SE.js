"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Shot_SE_1 = require("./Shot_SE");
var Weapon_SE = (function () {
    function Weapon_SE(owner) {
        this._currentShot = null;
        this._lastShotTime = 0;
        this.shots = [];
        this.wornOut = false;
        this._reloadTime = 3000;
        this._ammoCount = 10;
        this._shotType = "none";
        this._currentShot = null;
        this._lastShotTime = 0;
        this.owner = owner || null;
        this.shots = [];
        this.wornOut = false;
    }
    Weapon_SE.prototype.shoot = function () {
        this._lastShotTime = Date.now();
        this._ammoCount--;
        this.wornOut = (this._ammoCount < 1);
    };
    Weapon_SE.prototype.canShoot = function () {
        return (this._ammoCount > 0) && ((Date.now() - this._lastShotTime) > this._reloadTime);
    };
    Weapon_SE.prototype.onPress = function (game) { };
    ;
    Weapon_SE.prototype.onRelease = function (game) { };
    ;
    return Weapon_SE;
}());
exports.Weapon_SE = Weapon_SE;
var LaserGun_SE = (function (_super) {
    __extends(LaserGun_SE, _super);
    function LaserGun_SE(owner) {
        var _this = _super.call(this, owner) || this;
        _this._ammoCount = 100;
        _this._shotType = "LaserDirect";
        return _this;
    }
    LaserGun_SE.prototype.onPress = function (game) {
        if (this.canShoot()) {
            var shps = this.owner.tank.getLaserPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            this.shoot();
            var shot = new Shot_SE_1.LaserDirect_SE(this, shps.x, shps.y, this.owner.tank.angle, game);
            game.shoot(shot);
        }
    };
    return LaserGun_SE;
}(Weapon_SE));
exports.LaserGun_SE = LaserGun_SE;
var APCRGun_SE = (function (_super) {
    __extends(APCRGun_SE, _super);
    function APCRGun_SE(owner) {
        var _this = _super.call(this, owner) || this;
        _this._ammoCount = 10000;
        _this._shotType = "APCRGun";
        _this._reloadTime = 1000;
        return _this;
    }
    APCRGun_SE.prototype.onPress = function (game) {
        if (this.canShoot()) {
            var shps = this.owner.tank.getShotPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            this.shoot();
            var shot = new Shot_SE_1.APCR_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
            game.shoot(shot);
        }
    };
    return APCRGun_SE;
}(Weapon_SE));
exports.APCRGun_SE = APCRGun_SE;
var Guns = {
    Laser: LaserGun_SE,
    APCRGun: APCRGun_SE
};
exports.Guns = Guns;
