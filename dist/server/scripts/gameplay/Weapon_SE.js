"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invisibility_SE = exports.DoubleMineGun_SE = exports.MineGun_SE = exports.BouncerGun_SE = exports.FlatLaserGun_SE = exports.Weapon_SE = exports.LaserGun_SE = exports.APCRGun_SE = exports.Guns = void 0;
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
        return (this._ammoCount > 0) && ((Date.now() - this._lastShotTime) > this._reloadTime) && !this.wornOut && this.owner && this.owner.alive;
    };
    return Weapon_SE;
}(Item_SE_1.Item_SE));
exports.Weapon_SE = Weapon_SE;
var LaserGun_SE = (function (_super) {
    __extends(LaserGun_SE, _super);
    function LaserGun_SE(owner) {
        var _this = _super.call(this, owner, 4) || this;
        _this._ammoCount = 1;
        _this._shotType = "LaserDirect_SE";
        return _this;
    }
    LaserGun_SE.prototype.onPress = function (game) {
        if (this.canShoot()) {
            var shps = this.owner.tank.getShotPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            this.shoot();
            var shot = new Shot_SE_1.LaserDirect_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
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
        _this._shotType = "APCR_SE";
        _this._reloadTime = 2000;
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
var PulsarGun_SE = (function (_super) {
    __extends(PulsarGun_SE, _super);
    function PulsarGun_SE(owner) {
        var _this = _super.call(this, owner, 1) || this;
        _this.maxDispersion = 0.1;
        _this.game = null;
        _this.wasPressed = false;
        _this._ammoCount = 10;
        _this._shotType = "APCR_SE";
        _this._reloadTime = 150;
        return _this;
    }
    PulsarGun_SE.prototype.onPress = function (game) {
        this.game = game;
        if (this.wasPressed)
            return;
        this.wasPressed = true;
        this.shootNext(game);
    };
    PulsarGun_SE.prototype.shootNext = function (game) {
        var _this = this;
        if (!this.wornOut && this.owner && this.owner.alive) {
            this.shoot();
            var shps = this.owner.tank.getShotPosition();
            if (!game || !game.level || !game.level.levelRect.contains(shps.x, shps.y)) {
                this.wornOut = true;
                return;
            }
            var dispDir = (Math.random() > 0.5) ? 1 : -1;
            var ang = this.owner.tank.turret.angle + Math.random() * this.maxDispersion * dispDir;
            var shot = new Shot_SE_1.Shots[this._shotType](this, shps.x, shps.y, ang, this.game);
            this.game.shoot(shot);
            setTimeout(function () { _this.shootNext(game); }, this._reloadTime);
        }
    };
    return PulsarGun_SE;
}(Weapon_SE));
var BouncerGun_SE = (function (_super) {
    __extends(BouncerGun_SE, _super);
    function BouncerGun_SE(owner, typeIndex) {
        var _this = _super.call(this, owner, typeIndex || 0) || this;
        _this._ammoCount = 10000;
        _this._shotType = "BouncerGun_SE";
        _this._reloadTime = 2000;
        return _this;
    }
    BouncerGun_SE.prototype.onPress = function (game) {
        if (this.canShoot()) {
            var shps = this.owner.tank.getShotPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            this.shoot();
            var shot = new Shot_SE_1.Bouncer_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
            game.shoot(shot);
        }
    };
    return BouncerGun_SE;
}(Weapon_SE));
exports.BouncerGun_SE = BouncerGun_SE;
var BouncingLaserGun_SE = (function (_super) {
    __extends(BouncingLaserGun_SE, _super);
    function BouncingLaserGun_SE(owner) {
        var _this = _super.call(this, owner, 5) || this;
        _this._ammoCount = 1;
        _this._shotType = "BouncingLaser_SE";
        _this._reloadTime = 1000;
        return _this;
    }
    BouncingLaserGun_SE.prototype.onPress = function (game) {
        if (this.canShoot()) {
            var shps = this.owner.tank.getShotPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            this.shoot();
            var shot = new Shot_SE_1.BouncingLaser_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
            game.shoot(shot);
        }
    };
    return BouncingLaserGun_SE;
}(Weapon_SE));
var FlatLaserGun_SE = (function (_super) {
    __extends(FlatLaserGun_SE, _super);
    function FlatLaserGun_SE(owner) {
        if (owner === void 0) { owner = null; }
        var _this = _super.call(this, owner, 7) || this;
        _this._shotType = "FlatLaser_SE";
        _this._ammoCount = 1;
        _this._reloadTime = 500;
        return _this;
    }
    FlatLaserGun_SE.prototype.onPress = function (game) {
        if (this.canShoot()) {
            var shps = this.owner.tank.getShotPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            this.shoot();
            var shot = new Shot_SE_1.FlatLaser_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
            game.shoot(shot);
        }
    };
    return FlatLaserGun_SE;
}(Weapon_SE));
exports.FlatLaserGun_SE = FlatLaserGun_SE;
var MultiBouncerGun_SE = (function (_super) {
    __extends(MultiBouncerGun_SE, _super);
    function MultiBouncerGun_SE(owner) {
        var _this = _super.call(this, owner) || this;
        _this.typeIndex = 2;
        _this._shotType = "PolygonalBouncer_SE";
        return _this;
    }
    return MultiBouncerGun_SE;
}(PulsarGun_SE));
var EliminatorGun_SE = (function (_super) {
    __extends(EliminatorGun_SE, _super);
    function EliminatorGun_SE(owner) {
        var _this = _super.call(this, owner) || this;
        _this.canBlast = false;
        _this.shot = null;
        _this.typeIndex = 3;
        _this._ammoCount = 1;
        _this._shotType = "Eliminator_SE";
        return _this;
    }
    EliminatorGun_SE.prototype.onPress = function (game) {
        if (this.canBlast) {
            this.canBlast = false;
            this.shot.blast();
            this.wornOut = true;
        }
        if (this.canShoot()) {
            var shps = this.owner.tank.getShotPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            var shot = new Shot_SE_1.Eliminator_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
            this.shot = shot;
            this.canBlast = true;
            game.shoot(shot);
        }
    };
    return EliminatorGun_SE;
}(Weapon_SE));
var MineGun_SE = (function (_super) {
    __extends(MineGun_SE, _super);
    function MineGun_SE(owner) {
        var _this = _super.call(this, owner, 0) || this;
        _this._ammoCount = 1;
        _this._reloadTime = 100;
        return _this;
    }
    MineGun_SE.prototype.onPress = function (game) {
        if (this.canShoot()) {
            var shps = this.owner.tank.getRearShotPosition();
            if (!game.level.levelRect.contains(shps.x, shps.y)) {
                return;
            }
            this.shoot();
            var shot = new Shot_SE_1.Mine_SE(this, shps.x, shps.y, this.owner.tank.angle, game);
            game.shoot(shot);
        }
    };
    return MineGun_SE;
}(Weapon_SE));
exports.MineGun_SE = MineGun_SE;
var DoubleMineGun_SE = (function (_super) {
    __extends(DoubleMineGun_SE, _super);
    function DoubleMineGun_SE(owner) {
        var _this = _super.call(this, owner) || this;
        _this.typeIndex = 6;
        _this._ammoCount = 2;
        return _this;
    }
    return DoubleMineGun_SE;
}(MineGun_SE));
exports.DoubleMineGun_SE = DoubleMineGun_SE;
var Invisibility_SE = (function (_super) {
    __extends(Invisibility_SE, _super);
    function Invisibility_SE(owner) {
        var _this = _super.call(this, 8) || this;
        _this.duration = 12000;
        _this.timeout = null;
        _this.owner = owner;
        return _this;
    }
    Invisibility_SE.prototype.onPress = function (game) {
        var _this = this;
        if (this.wornOut)
            return;
        this.wornOut = true;
        this.owner.invisible = true;
        game.emitDisappear(this.owner);
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        setTimeout(function () {
            if (_this.owner && _this.owner.game == game) {
                _this.owner.invisible = false;
                game.emitAppear(_this.owner);
                _this.timeout = null;
            }
        }, this.duration);
    };
    return Invisibility_SE;
}(Item_SE_1.Item_SE));
exports.Invisibility_SE = Invisibility_SE;
var Guns = {
    LaserGun: LaserGun_SE,
    APCRGun: APCRGun_SE,
    FlatLaserGun: FlatLaserGun_SE,
    BouncerGun: BouncerGun_SE,
    BouncingLaserGun: BouncingLaserGun_SE,
    PulsarGun: PulsarGun_SE,
    MultiBouncerGun: MultiBouncerGun_SE,
    EliminatorGun: EliminatorGun_SE,
    MineGun: MineGun_SE,
    DoubleMineGun: DoubleMineGun_SE
};
exports.Guns = Guns;
