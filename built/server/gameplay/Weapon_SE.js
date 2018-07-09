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
var Item_SE_1 = require("./Item_SE");
var Weapon_SE = (function (_super) {
    __extends(Weapon_SE, _super);
    function Weapon_SE(owner, typeIndex) {
        if (typeIndex === void 0) { typeIndex = 0; }
        var _this = _super.call(this, typeIndex) || this;
        _this._currentShot = null;
        _this._lastShotTime = 0;
        _this.shots = [];
        _this._reloadTime = 3000;
        _this._ammoCount = 10;
        _this._shotType = "none";
        _this._currentShot = null;
        _this._lastShotTime = 0;
        _this.owner = owner || null;
        _this.shots = [];
        return _this;
    }
    Weapon_SE.prototype.shoot = function () {
        this._lastShotTime = Date.now();
        this._ammoCount--;
        this.wornOut = (this._ammoCount < 1);
    };
    Weapon_SE.prototype.canShoot = function () {
        return (this._ammoCount > 0) && ((Date.now() - this._lastShotTime) > this._reloadTime);
    };
    return Weapon_SE;
}(Item_SE_1.Item_SE));
exports.Weapon_SE = Weapon_SE;
var LaserGun_SE = (function (_super) {
    __extends(LaserGun_SE, _super);
    function LaserGun_SE(owner) {
        var _this = _super.call(this, owner, 4) || this;
        _this._ammoCount = 1;
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
var PulsarGun = (function (_super) {
    __extends(PulsarGun, _super);
    function PulsarGun(owner) {
        var _this = _super.call(this, owner) || this;
        _this._ammoCount = 10;
        _this._shotType = "APCR";
        _this._reloadTime = 150;
        return _this;
    }
    return PulsarGun;
}(Weapon_SE));
var FlatLaserGun_SE = (function (_super) {
    __extends(FlatLaserGun_SE, _super);
    function FlatLaserGun_SE(owner) {
        if (owner === void 0) { owner = null; }
        var _this = _super.call(this, owner) || this;
        _this._shotType = "FlatLaser";
        _this._ammoCount = 10;
        _this._reloadTime = 500;
        return _this;
    }
    FlatLaserGun_SE.prototype.onPress = function (game) {
        if (this.canShoot()) {
            var shps = this.owner.tank.getLaserPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            this.shoot();
            var shot = new Shot_SE_1.FlatLaser_SE(this, shps.x, shps.y, this.owner.tank.angle, game);
            game.shoot(shot);
        }
    };
    return FlatLaserGun_SE;
}(Weapon_SE));
exports.FlatLaserGun_SE = FlatLaserGun_SE;
var Guns = {
    LaserGun: LaserGun_SE,
    APCRGun: APCRGun_SE,
    FlatLaserGun: FlatLaserGun_SE
};
exports.Guns = Guns;
