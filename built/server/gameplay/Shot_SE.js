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
var MyMath_SE_1 = require("./utils/MyMath_SE");
var Geometry_SE_1 = require("./utils/Geometry_SE");
var Shot_SE = (function (_super) {
    __extends(Shot_SE, _super);
    function Shot_SE(weapon, startX, startY, startAng) {
        var _this = _super.call(this, startX, startY, 0.2, 0.2) || this;
        _this.startX = startX;
        _this.startY = startY;
        _this.endPoint = { x: startX, y: startY };
        _this.type = "unknown";
        _this.startTime = Date.now();
        _this.weapon = weapon;
        _this.owner = weapon.owner;
        _this.angle = startAng;
        _this.removeAfterHit = true;
        return _this;
    }
    Shot_SE.prototype.getStartPacket = function () {
        var packet = _super.prototype.getStatePacket.call(this);
        packet.type = this.type,
            packet.startX = this.startX,
            packet.startY = this.startY,
            packet.startTime = this.startTime,
            packet.ownerID = this.owner.socket.id;
        return packet;
    };
    Shot_SE.prototype.isBeyond = function () {
        return MyMath_SE_1.dist(this.x, this.y, this.startX, this.startY) >= MyMath_SE_1.dist(this.startX, this.startY, this.endPoint.x, this.endPoint.y);
    };
    return Shot_SE;
}(GameObject_SE_1.GameObject_SE));
exports.Shot_SE = Shot_SE;
var APCR_SE = (function (_super) {
    __extends(APCR_SE, _super);
    function APCR_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng) || this;
        _this.type = "APCR";
        _this.maxSpeed = 25;
        _this.fullForward();
        _this.endPoint = game.level.wallCheckLoop(startX, startY, _this.direction.x, _this.direction.y);
        return _this;
    }
    APCR_SE.prototype.getStartPacket = function () {
        var packet = _super.prototype.getStartPacket.call(this);
        packet.endX = this.endPoint.x;
        packet.endY = this.endPoint.y;
        packet.speed = this.maxSpeed;
        return packet;
    };
    APCR_SE.prototype.isHittingTank = function (tank) {
        if (tank.body.rectCircleVSCircle((this.x + this.prevBody.cX) / 2, (this.y + this.prevBody.cY) / 2, MyMath_SE_1.dist(this.x, this.y, this.prevBody.cX, this.prevBody.cY) / 2)) {
            return tank.body.lineInt(this.x, this.y, this.prevBody.cX, this.prevBody.cY);
        }
        return false;
    };
    APCR_SE.prototype.update = function (deltaSec) {
        GameObject_SE_1.GameObject_SE.prototype.update.call(this, deltaSec);
        this.remove = this.isBeyond();
    };
    return APCR_SE;
}(Shot_SE));
exports.APCR_SE = APCR_SE;
var LaserDirect_SE = (function (_super) {
    __extends(LaserDirect_SE, _super);
    function LaserDirect_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng) || this;
        _this.type = "LaserDirect";
        _this.removeAfterHit = false;
        _this.maxSpeed = 40;
        _this.fullForward();
        var points = game.level.levelRect.simpleLineIntPoints(startX, startY, startX + Math.sin(startAng) * 10000, startY
            - Math.cos(startAng) * 10000);
        _this.endPoint = points[0];
        return _this;
    }
    LaserDirect_SE.prototype.getStartPacket = function () {
        var packet = _super.prototype.getStartPacket.call(this);
        packet.endX = this.endPoint.x;
        packet.endY = this.endPoint.y;
        packet.speed = this.maxSpeed;
        return packet;
    };
    LaserDirect_SE.prototype.isHittingTank = function (tank) {
        if (tank.owner == this.owner)
            return false;
        return tank.body.lineInt(this.startX, this.startY, this.x, this.y);
    };
    LaserDirect_SE.prototype.update = function (deltaSec) {
        GameObject_SE_1.GameObject_SE.prototype.update.call(this, deltaSec);
        this.remove = this.isBeyond();
    };
    return LaserDirect_SE;
}(Shot_SE));
exports.LaserDirect_SE = LaserDirect_SE;
var FlatLaser_SE = (function (_super) {
    __extends(FlatLaser_SE, _super);
    function FlatLaser_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng) || this;
        _this.point1 = new Geometry_SE_1.Vec2(0, 0);
        _this.point2 = new Geometry_SE_1.Vec2(0, 0);
        _this.size = 3;
        _this.type = "FlatLaser";
        _this.removeAfterHit = false;
        _this.maxSpeed = 20;
        _this.fullForward();
        var points = game.level.levelRect.simpleLineIntPoints(startX, startY, startX + Math.sin(startAng) * 10000, startY
            - Math.cos(startAng) * 10000);
        _this.endPoint = points[0];
        _this.setPoints();
        return _this;
    }
    FlatLaser_SE.prototype.setPoints = function () {
        this.point1.set(this.x + (Math.sin(this.angle + (Math.PI / 2))) * (this.size / 2), this.y - (Math.cos(this.angle + (Math.PI / 2))) * (this.size / 2));
        this.point2.set(this.x + (Math.sin(this.angle - (Math.PI / 2))) * (this.size / 2), this.y - (Math.cos(this.angle - (Math.PI / 2))) * (this.size / 2));
    };
    FlatLaser_SE.prototype.getStartPacket = function () {
        var packet = _super.prototype.getStartPacket.call(this);
        packet.endX = this.endPoint.x;
        packet.endY = this.endPoint.y;
        packet.speed = this.maxSpeed;
        return packet;
    };
    FlatLaser_SE.prototype.isHittingTank = function (tank) {
        if (tank.owner == this.owner)
            return false;
        return tank.body.lineInt(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
    };
    FlatLaser_SE.prototype.update = function (deltaSec) {
        GameObject_SE_1.GameObject_SE.prototype.update.call(this, deltaSec);
        this.setPoints();
        this.remove = this.isBeyond();
    };
    return FlatLaser_SE;
}(Shot_SE));
exports.FlatLaser_SE = FlatLaser_SE;
var Bouncer_SE = (function (_super) {
    __extends(Bouncer_SE, _super);
    function Bouncer_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng) || this;
        _this.maxLength = 50;
        _this.maxBounces = 5;
        _this.bouncePoints = [];
        _this.totalDist = 0;
        _this.currentBounce = 0;
        _this.type = "Bouncer";
        _this.removeAfterHit = true;
        _this.maxSpeed = 10;
        _this.fullForward();
        var currLength = 0;
        var currBounces = 0;
        var nextStartX = startX;
        var nextStartY = startY;
        var nextDirX = _this.direction.x;
        var nextDirY = _this.direction.y;
        _this.bouncePoints.push({ x: nextStartX, y: nextStartY, ang: Math.atan2(nextDirX, -nextDirY) });
        while (currLength < _this.maxLength) {
            var point = game.level.wallCheckLoop(nextStartX, nextStartY, nextDirX, nextDirY);
            var newLength = MyMath_SE_1.dist(point.x, point.y, nextStartX, nextStartY);
            if (currLength + newLength > _this.maxLength) {
                newLength = _this.maxLength - currLength;
                point.x = nextStartX + nextDirX * newLength;
                point.y = nextStartY + nextDirY * newLength;
            }
            nextDirX = game.level.dirXBounce(point.x, nextDirX);
            nextDirY = game.level.dirYBounce(point.y, nextDirY);
            nextStartX = point.x + 0.001 * (nextDirX / Math.abs(nextDirX));
            nextStartY = point.y + 0.001 * (nextDirY / Math.abs(nextDirY));
            currLength += newLength;
            _this.bouncePoints.push({ x: point.x, y: point.y, ang: Math.atan2(nextDirX, -nextDirY) });
        }
        return _this;
    }
    Bouncer_SE.prototype.getStartPacket = function () {
        var packet = _super.prototype.getStartPacket.call(this);
        packet.endX = this.endPoint.x;
        packet.endY = this.endPoint.y;
        packet.speed = this.maxSpeed;
        packet.pts = this.bouncePoints;
        return packet;
    };
    Bouncer_SE.prototype.isHittingTank = function (tank) {
        if (tank.body.rectCircleVSCircle((this.x + this.prevBody.cX) / 2, (this.y + this.prevBody.cY) / 2, MyMath_SE_1.dist(this.x, this.y, this.prevBody.cX, this.prevBody.cY) / 2)) {
            return tank.body.lineInt(this.x, this.y, this.prevBody.cX, this.prevBody.cY);
        }
        return false;
    };
    Bouncer_SE.prototype.update = function (deltaSec) {
        GameObject_SE_1.GameObject_SE.prototype.update.call(this, deltaSec);
        this.totalDist += this.distOfFrameMove();
        if (this.totalDist >= this.maxLength) {
            this.remove = true;
            return;
        }
        var lineDist = MyMath_SE_1.distVec(this.bouncePoints[this.currentBounce], this.bouncePoints[this.currentBounce + 1]);
        var shotFromPointDist = MyMath_SE_1.dist(this.bouncePoints[this.currentBounce].x, this.bouncePoints[this.currentBounce].y, this.x, this.y);
        if (shotFromPointDist >= lineDist) {
            this.currentBounce++;
            this.setPos(this.bouncePoints[this.currentBounce].x, this.bouncePoints[this.currentBounce].y);
            this.angle = this.bouncePoints[this.currentBounce].ang;
        }
    };
    return Bouncer_SE;
}(Shot_SE));
exports.Bouncer_SE = Bouncer_SE;
var Shots = {
    APCR_SE: APCR_SE,
    LaserDirect_SE: LaserDirect_SE,
    FlatLaser_SE: FlatLaser_SE,
    Bouncer_SE: Bouncer_SE
};
exports.Shots = Shots;
