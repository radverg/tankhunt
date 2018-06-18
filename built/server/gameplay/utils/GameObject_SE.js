"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometry_SE_1 = require("./Geometry_SE");
var GameObject_SE = (function () {
    function GameObject_SE(x, y, w, h) {
        this._id = GameObject_SE.getNextID();
        this.velocity = new Geometry_SE_1.Vec2(0, 0);
        this.direction = new Geometry_SE_1.Vec2(1, 0);
        this._angle = 0;
        this.speed = 0;
        this.maxSpeed = 2;
        this.angularVel = Math.PI / 3;
        this.remove = false;
        this.emitable = true;
        this.alive = true;
        this.body = new Geometry_SE_1.Rect(x || 0, y || 0, w || 1, h || 1);
        this.prevBody = new Geometry_SE_1.Rect(x || 0, y || 0, w || 1, h || 1);
    }
    Object.defineProperty(GameObject_SE.prototype, "x", {
        get: function () { return this.body.cX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject_SE.prototype, "y", {
        get: function () { return this.body.cY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject_SE.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject_SE.prototype, "angle", {
        get: function () { return this._angle; },
        set: function (val) { this.setAngle(val); },
        enumerable: true,
        configurable: true
    });
    GameObject_SE.getNextID = function () {
        GameObject_SE._currentID++;
        return "a" + GameObject_SE._currentID;
    };
    GameObject_SE.prototype.move = function (deltaSec) {
        this.prevBody.setPos(this.body.cX, this.body.cY);
        this.body.cX += this.direction.x * deltaSec * this.speed;
        this.body.cY += this.direction.y * deltaSec * this.speed;
    };
    GameObject_SE.prototype.setPos = function (x, y) {
        this.prevBody.setPos(this.body.cX, this.body.cY);
        this.body.setPos(x, y);
    };
    GameObject_SE.prototype.rotate = function (deltaSec) {
        if (this.angularVel) {
            this.setAngle(this._angle + this.angularVel * deltaSec);
        }
    };
    GameObject_SE.prototype.setAngle = function (ang) {
        this._angle = ang || 0;
        this.body.ang = ang || 0;
        this.direction.x = Math.sin(ang || 0);
        this.direction.y = -Math.cos(ang || 0);
    };
    GameObject_SE.prototype.randomizeAngle = function () {
        this.setAngle(Math.random() * Math.PI * 2);
    };
    GameObject_SE.prototype.getAng = function () {
        return this._angle;
    };
    GameObject_SE.prototype.fullForward = function () {
        this.speed = this.maxSpeed;
    };
    GameObject_SE.prototype.fullBackward = function () {
        this.speed = -this.maxSpeed;
    };
    GameObject_SE.prototype.stop = function () {
        this.speed = 0;
    };
    GameObject_SE.prototype.fullLeftRotate = function () {
        this.angularVel = -this.maxAngularVel;
    };
    GameObject_SE.prototype.fullRightRotate = function () {
        this.angularVel = this.maxAngularVel;
    };
    GameObject_SE.prototype.stopRotation = function () {
        this.angularVel = 0;
    };
    GameObject_SE.prototype.update = function (deltaSec) {
        this.move(deltaSec);
        this.rotate(deltaSec);
    };
    GameObject_SE.prototype.getStatePacket = function () {
        return {
            id: this._id,
            x: this.x,
            y: this.y,
            rot: this.angle
        };
    };
    GameObject_SE._currentID = 1;
    return GameObject_SE;
}());
exports.GameObject_SE = GameObject_SE;
