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
exports.Mine_SE = exports.Eliminator_SE = exports.BouncingLaser_SE = exports.Bouncer_SE = exports.FlatLaser_SE = exports.Shot_SE = exports.APCR_SE = exports.LaserDirect_SE = exports.Shots = void 0;
var GameObject_SE_1 = require("./utils/GameObject_SE");
var MyMath_SE_1 = require("./utils/MyMath_SE");
var Geometry_SE_1 = require("./utils/Geometry_SE");
var Shot_SE = (function (_super) {
    __extends(Shot_SE, _super);
    function Shot_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, startX, startY, 0.2, 0.2) || this;
        _this.tanksHit = [];
        _this.damage = 200;
        _this.penetrationBonus = 0;
        _this.ignoreArmor = false;
        _this.active = true;
        _this.game = game;
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
            packet.startX = parseFloat(this.startX.toFixed(4)),
            packet.startY = parseFloat(this.startY.toFixed(4)),
            packet.startTime = this.startTime,
            packet.ownerID = this.owner.id;
        return packet;
    };
    Shot_SE.prototype.isBeyond = function () {
        return (0, MyMath_SE_1.dist)(this.x, this.y, this.startX, this.startY) >= (0, MyMath_SE_1.dist)(this.startX, this.startY, this.endPoint.x, this.endPoint.y);
    };
    Shot_SE.prototype.isHittingTank = function (tank) {
        if (this.remove || !this.active || !tank.alive || tank.owner.invulnerable || tank.health <= 0)
            return false;
        if (this.tanksHit.length > 0) {
            if (this.tanksHit.indexOf(tank) !== -1)
                return false;
        }
        var collInfo = this.getTankCollision(tank);
        if (collInfo === true || collInfo === false)
            return collInfo;
        return collInfo.side !== -1;
    };
    Shot_SE.prototype.hit = function (tank, ignoreArmor) {
        if (ignoreArmor === void 0) { ignoreArmor = false; }
        if (this.removeAfterHit)
            this.remove = true;
        else
            this.tanksHit.push(tank);
        var collInfo = this.getTankCollision(tank);
        var damage = this.damage;
        if (collInfo && collInfo.side != -1 && tank.armor && !this.ignoreArmor && !ignoreArmor) {
            var penPerc = 1 - tank.armor[collInfo.side] + this.penetrationBonus;
            if (Math.random() > penPerc) {
                damage = 0;
            }
        }
        var initialHealth = tank.health;
        tank.health -= damage;
        if (tank.health <= 0) {
            tank.owner.die();
        }
        var hitPack = {
            rm: this.removeAfterHit,
            plID: tank.owner.id,
            plAttID: this.owner.id,
            healthBef: initialHealth,
            healthAft: tank.health,
            shotID: this.id,
            xTank: tank.x,
            yTank: tank.y
        };
        if (collInfo && collInfo.x) {
            hitPack.x = collInfo.x;
            hitPack.y = collInfo.y;
        }
        return hitPack;
    };
    Shot_SE.prototype.hitSimple = function (tank) {
        if (this.removeAfterHit)
            this.remove = true;
        else
            this.tanksHit.push(tank);
        tank.owner.die();
        var packet = {
            rm: this.removeAfterHit,
            healthAft: 0,
            healthBef: 1,
            shotID: this.id,
            plAttID: this.owner.id,
            xTank: tank.x,
            yTank: tank.y,
            plID: tank.owner.id
        };
        return packet;
    };
    return Shot_SE;
}(GameObject_SE_1.GameObject_SE));
exports.Shot_SE = Shot_SE;
var APCR_SE = (function (_super) {
    __extends(APCR_SE, _super);
    function APCR_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng, game) || this;
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
    APCR_SE.prototype.getTankCollision = function (tank) {
        if (tank.body.rectCircleVSCircle((this.x + this.prevBody.cX) / 2, (this.y + this.prevBody.cY) / 2, (0, MyMath_SE_1.dist)(this.x, this.y, this.prevBody.cX, this.prevBody.cY) / 2)) {
            return tank.body.whichSideLineInt(this.x, this.y, this.prevBody.cX, this.prevBody.cY);
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
        var _this = _super.call(this, weapon, startX, startY, startAng, game) || this;
        _this.damage = 1500;
        _this.ignoreArmor = true;
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
    LaserDirect_SE.prototype.getTankCollision = function (tank) {
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
        var _this = _super.call(this, weapon, startX, startY, startAng, game) || this;
        _this.point1 = new Geometry_SE_1.Vec2(0, 0);
        _this.point2 = new Geometry_SE_1.Vec2(0, 0);
        _this.size = 3;
        _this.damage = 900;
        _this.ignoreArmor = true;
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
    FlatLaser_SE.prototype.getTankCollision = function (tank) {
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
    function Bouncer_SE(weapon, startX, startY, startAng, game, findPath) {
        if (findPath === void 0) { findPath = true; }
        var _this = _super.call(this, weapon, startX, startY, startAng, game) || this;
        _this.maxLength = 50;
        _this.maxBounces = 5;
        _this.wayPoints = [];
        _this.totalDist = 0;
        _this.currentBounce = 0;
        _this.type = "Bouncer";
        _this.removeAfterHit = true;
        _this.maxSpeed = 10;
        _this.fullForward();
        if (findPath)
            _this.createWayPoints();
        return _this;
    }
    Bouncer_SE.prototype.createWayPoints = function () {
        var currLength = 0;
        var currBounces = 0;
        var nextStartX = this.startX;
        var nextStartY = this.startY;
        var nextDirX = this.direction.x;
        var nextDirY = this.direction.y;
        this.wayPoints.push({ x: nextStartX, y: nextStartY, ang: Math.atan2(nextDirX, -nextDirY) });
        while (currLength < this.maxLength) {
            var point = null;
            try {
                point = this.game.level.wallCheckLoop(nextStartX, nextStartY, nextDirX, nextDirY);
            }
            catch (_a) {
                console.log("EXCEPTION CAUGHT!");
                this.remove = true;
                return;
            }
            var newLength = (0, MyMath_SE_1.dist)(point.x, point.y, nextStartX, nextStartY);
            if (currLength + newLength > this.maxLength) {
                newLength = this.maxLength - currLength;
                point.x = nextStartX + nextDirX * newLength;
                point.y = nextStartY + nextDirY * newLength;
            }
            nextDirX = this.game.level.dirXBounce(point.x, nextDirX);
            nextDirY = this.game.level.dirYBounce(point.y, nextDirY);
            nextStartX = point.x + 0.001 * (nextDirX / Math.abs(nextDirX));
            nextStartY = point.y + 0.001 * (nextDirY / Math.abs(nextDirY));
            currLength += newLength;
            this.wayPoints.push({ x: (0, MyMath_SE_1.shortFloat)(point.x), y: (0, MyMath_SE_1.shortFloat)(point.y), ang: (0, MyMath_SE_1.shortFloat)(Math.atan2(nextDirX, -nextDirY)) });
        }
    };
    Bouncer_SE.prototype.getStartPacket = function () {
        var packet = _super.prototype.getStartPacket.call(this);
        packet.endX = (0, MyMath_SE_1.shortFloat)(this.endPoint.x);
        packet.endY = (0, MyMath_SE_1.shortFloat)(this.endPoint.y);
        packet.speed = this.maxSpeed;
        packet.pts = this.wayPoints;
        return packet;
    };
    Bouncer_SE.prototype.getTankCollision = function (tank) {
        if (tank.body.rectCircleVSCircle((this.x + this.prevBody.cX) / 2, (this.y + this.prevBody.cY) / 2, (0, MyMath_SE_1.dist)(this.x, this.y, this.prevBody.cX, this.prevBody.cY) / 2)) {
            return tank.body.whichSideLineInt(this.x, this.y, this.prevBody.cX, this.prevBody.cY);
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
        var lineDist = (0, MyMath_SE_1.distVec)(this.wayPoints[this.currentBounce], this.wayPoints[this.currentBounce + 1]);
        var shotFromPointDist = (0, MyMath_SE_1.dist)(this.wayPoints[this.currentBounce].x, this.wayPoints[this.currentBounce].y, this.x, this.y);
        if (shotFromPointDist >= lineDist) {
            this.currentBounce++;
            this.setPos(this.wayPoints[this.currentBounce].x, this.wayPoints[this.currentBounce].y);
            this.angle = this.wayPoints[this.currentBounce].ang;
        }
    };
    return Bouncer_SE;
}(Shot_SE));
exports.Bouncer_SE = Bouncer_SE;
var BouncingLaser_SE = (function (_super) {
    __extends(BouncingLaser_SE, _super);
    function BouncingLaser_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng, game) || this;
        _this.damage = 1500;
        _this.ignoreArmor = true;
        _this.maxSpeed = 35;
        _this.fullForward();
        _this.type = "BouncingLaser";
        return _this;
    }
    BouncingLaser_SE.prototype.getTankCollision = function (tank) {
        if (tank.owner == this.owner) {
            return tank.body.rotContains(this.x, this.y);
        }
        for (var i = 0; i <= this.currentBounce; i++) {
            var pt1 = this.wayPoints[i];
            var pt2 = this.wayPoints[i + 1];
            if (tank.body.lineInt(pt1.x, pt1.y, pt2.x, pt2.y)) {
                if (i === this.currentBounce) {
                    return tank.body.lineInt(pt1.x, pt1.y, this.x, this.y);
                }
                return true;
            }
        }
        return false;
    };
    return BouncingLaser_SE;
}(Bouncer_SE));
exports.BouncingLaser_SE = BouncingLaser_SE;
var PolygonalBouncer_SE = (function (_super) {
    __extends(PolygonalBouncer_SE, _super);
    function PolygonalBouncer_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng, game) || this;
        _this.type = "PolygonalBouncer";
        return _this;
    }
    return PolygonalBouncer_SE;
}(Bouncer_SE));
var Splinter_SE = (function (_super) {
    __extends(Splinter_SE, _super);
    function Splinter_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng, game) || this;
        _this.damage = 500;
        return _this;
    }
    Splinter_SE.prototype.getTankCollision = function (tank) {
        return APCR_SE.prototype.getTankCollision.call(this, tank);
    };
    return Splinter_SE;
}(Shot_SE));
var Eliminator_SE = (function (_super) {
    __extends(Eliminator_SE, _super);
    function Eliminator_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng, game, false) || this;
        _this.splinterCount = 20;
        _this.splinterTime = 4000;
        _this.maxSplinterSpeed = 40;
        _this.minSplinterSpeed = 2;
        _this.blasted = false;
        _this.splintersData = [];
        _this.type = "Eliminator";
        _this.maxLength = 25;
        _this.maxSpeed = 5;
        _this.createWayPoints();
        _this.fullForward();
        for (var i = 0; i < _this.splinterCount; i++) {
            _this.splintersData.push({
                speed: Math.random() * (_this.maxSplinterSpeed - _this.minSplinterSpeed) + _this.minSplinterSpeed,
                ang: Math.random() * Math.PI * 2
            });
        }
        return _this;
    }
    Eliminator_SE.prototype.getStartPacket = function () {
        var packet = _super.prototype.getStartPacket.call(this);
        packet.endX = (0, MyMath_SE_1.shortFloat)(this.endPoint.x);
        packet.endY = (0, MyMath_SE_1.shortFloat)(this.endPoint.y);
        packet.speed = this.maxSpeed;
        packet.spl = this.splintersData;
        packet.splTime = this.splinterTime;
        return packet;
    };
    Eliminator_SE.prototype.blast = function () {
        for (var i = 0; i < this.splintersData.length; i++) {
            var newSpl = new Splinter_SE(this.weapon, this.x, this.y, this.splintersData[i].ang, this.game);
            newSpl.maxSpeed = this.splintersData[i].speed;
            newSpl.fullForward();
            this.game.shoot(newSpl, false);
            var splDist = newSpl.speed * (this.splinterTime / 1000);
            this.endPoint = { x: this.startX + (this.direction.x * splDist), y: this.startY + (this.direction.y * splDist) };
        }
        this.remove = true;
        this.blasted = true;
        var hitPacket = {
            blast: true, plID: "", plAttID: this.owner.id, rm: true, shotID: this.id, x: this.x, y: this.y
        };
        this.game.emitHit(hitPacket);
    };
    Eliminator_SE.prototype.isHittingTank = function () {
        return false;
    };
    Eliminator_SE.prototype.update = function (deltaSec) {
        _super.prototype.update.call(this, deltaSec);
        if (this.remove) {
            this.blast();
            this.weapon.wornOut = true;
        }
    };
    return Eliminator_SE;
}(Bouncer_SE));
exports.Eliminator_SE = Eliminator_SE;
var Mine_SE = (function (_super) {
    __extends(Mine_SE, _super);
    function Mine_SE(weapon, startX, startY, startAng, game) {
        var _this = _super.call(this, weapon, startX, startY, startAng, game) || this;
        _this.damage = 400;
        _this.active = false;
        _this.ignoreArmor = true;
        _this.body.setSize(1, 1);
        _this.type = "Mine";
        _this.removeAfterHit = true;
        setTimeout(function () { _this.active = true; }, 1000);
        return _this;
    }
    Mine_SE.prototype.getTankCollision = function (tank) {
        if (!this.active)
            return false;
        if (this.body.circularIntersect(tank.body)) {
            return this.body.pointOverlapping(tank.body);
        }
        return false;
    };
    return Mine_SE;
}(Shot_SE));
exports.Mine_SE = Mine_SE;
var Shots = {
    APCR_SE: APCR_SE,
    LaserDirect_SE: LaserDirect_SE,
    FlatLaser_SE: FlatLaser_SE,
    Bouncer_SE: Bouncer_SE,
    BouncingLaser_SE: BouncingLaser_SE,
    PolygonalBouncer_SE: PolygonalBouncer_SE,
    Eliminator_SE: Eliminator_SE,
    Mine_SE: Mine_SE
};
exports.Shots = Shots;
