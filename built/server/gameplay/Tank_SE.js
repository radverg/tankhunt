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
var GameObject_SE_1 = require("./utils/GameObject_SE");
var Weapon_SE_1 = require("./Weapon_SE");
var Tank_SE = (function (_super) {
    __extends(Tank_SE, _super);
    function Tank_SE(owner) {
        var _this = _super.call(this, 2, 2, 1, 1.4375) || this;
        _this.owner = owner;
        _this.turret = new Turret();
        _this.maxSpeed = 4;
        _this.maxAngularVel = Math.PI;
        _this.apcrGun = new Weapon_SE_1.APCRGun_SE(owner);
        _this.specialGun = new Weapon_SE_1.FlatLaserGun_SE(owner);
        _this.bouncerGun = null;
        return _this;
    }
    Tank_SE.prototype.getShotPosition = function () {
        return this.turret.countShotPos(this.x, this.y);
    };
    Tank_SE.prototype.getLaserPosition = function () {
        return {
            x: this.x + this.direction.x * (this.body.hWidth + 0.4),
            y: this.y + this.direction.y * (this.body.hWidth + 0.4)
        };
    };
    Tank_SE.prototype.update = function (deltaSec) {
        this.turret.rotate(deltaSec);
        this.move(deltaSec);
        this.rotate(deltaSec);
        this.body.updateVertices();
        this.turret.angle = this.turret.selfAngle + this.angle;
    };
    Tank_SE.prototype.wallCollide = function (level) {
        var sqrX1 = level.getSqrX(this.body.vertices[0].x);
        var sqrY1 = level.getSqrY(this.body.vertices[0].y);
        level.squareLineWallColl(sqrX1, sqrY1, this);
        var sqrX2 = level.getSqrX(this.body.vertices[1].x);
        var sqrY2 = level.getSqrY(this.body.vertices[1].y);
        if (sqrX2 != sqrX1 || sqrY2 != sqrY1) {
            level.squareLineWallColl(sqrX2, sqrY2, this);
        }
        var sqrX3 = level.getSqrX(this.body.vertices[2].x);
        var sqrY3 = level.getSqrY(this.body.vertices[2].y);
        if ((sqrX3 != sqrX2 || sqrY3 != sqrY2) && (sqrX3 != sqrX1 || sqrY3 != sqrY1)) {
            level.squareLineWallColl(sqrX3, sqrY3, this);
        }
        var sqrX4 = level.getSqrX(this.body.vertices[3].x);
        var sqrY4 = level.getSqrY(this.body.vertices[3].y);
        if ((sqrX4 != sqrX3 || sqrY4 != sqrY3) && (sqrX4 != sqrX2 || sqrY4 != sqrY2) && (sqrX4 != sqrX1 || sqrY4 != sqrY1)) {
            level.squareLineWallColl(sqrX4, sqrY4, this);
        }
    };
    Tank_SE.prototype.getStatePacket = function () {
        var pack = _super.prototype.getStatePacket.call(this);
        pack.turrRot = this.turret.angle;
        pack.plID = this.owner.id;
        return pack;
    };
    return Tank_SE;
}(GameObject_SE_1.GameObject_SE));
exports.Tank_SE = Tank_SE;
var Turret = (function (_super) {
    __extends(Turret, _super);
    function Turret() {
        var _this = _super.call(this) || this;
        _this.anchor = { x: 0.5, y: 0.5 };
        _this._barrelDist = 1.5;
        _this.selfAngle = 0;
        _this.maxAngularVel = 3;
        return _this;
    }
    Turret.prototype.countShotPos = function (fromX, fromY) {
        return {
            x: fromX + this._barrelDist * this.direction.x,
            y: fromY + this._barrelDist * this.direction.y
        };
    };
    Turret.prototype.rotate = function (deltaSec) {
        if (this.angularVel) {
            this.selfAngle += this.angularVel * deltaSec;
        }
    };
    return Turret;
}(GameObject_SE_1.GameObject_SE));
