"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MyMath_SE_1 = require("./MyMath_SE");
var li = require("line-intersect");
var Rect = (function () {
    function Rect(x, y, w, h) {
        this._w = w || 1;
        this._h = h || 1;
        this._hWidth = this.w / 2;
        this._hHeight = this.h / 2;
        this._hDiagonal = Math.sqrt(this._hWidth * this._hWidth + this._hHeight * this._hHeight);
        this._diagAng = Math.atan(this._hWidth / this._hHeight);
        this.cX = x || 0;
        this.cY = y || 0;
        this.ang = 0;
        this.vertices = [
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0)
        ];
        this.updateVertices();
        this._r = this._hDiagonal;
    }
    Object.defineProperty(Rect.prototype, "w", {
        get: function () { return this._w; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Rect.prototype, "h", {
        get: function () { return this._h; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Rect.prototype, "hWidth", {
        get: function () { return this._hWidth; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Rect.prototype, "hHeight", {
        get: function () { return this._hHeight; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Rect.prototype, "r", {
        get: function () { return this._r; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "hDiagonal", {
        get: function () { return this._hDiagonal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        get: function () { return this.cY + this.hHeight; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Rect.prototype, "top", {
        get: function () { return this.cY - this.hHeight; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Rect.prototype, "left", {
        get: function () { return this.cX - this.hWidth; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Rect.prototype, "right", {
        get: function () { return this.cX + this.hWidth; },
        enumerable: true,
        configurable: true
    });
    ;
    Rect.prototype.setSize = function (w, h) {
        this._w = w || this._w;
        this._h = h || this._h;
        this._r = Math.sqrt(Math.pow(this.w / 2, 2) + Math.pow(this.h / 2, 2));
        this._hDiagonal = this._r;
    };
    Rect.prototype.setPos = function (x, y) {
        this.cX = x;
        this.cY = y;
    };
    Rect.prototype.updateVertices = function () {
        this.vertices[0].set(this.cX + Math.sin(this.ang - this._diagAng) * this.hDiagonal, this.cY - Math.cos(this.ang - this._diagAng) * this.hDiagonal);
        this.vertices[1].set(this.cX + Math.sin(this.ang + this._diagAng) * this.hDiagonal, this.cY - Math.cos(this.ang + this._diagAng) * this.hDiagonal);
        this.vertices[2].set(this.cX + Math.sin(this.ang + (Math.PI - this._diagAng)) * this.hDiagonal, this.cY - Math.cos(this.ang + (Math.PI - this._diagAng)) * this.hDiagonal);
        this.vertices[3].set(this.cX + Math.sin(this.ang + (Math.PI + this._diagAng)) * this.hDiagonal, this.cY - Math.cos(this.ang + (Math.PI + this._diagAng)) * this.hDiagonal);
    };
    Rect.prototype.getClosestVertice = function (x, y) {
        var closest = this.vertices[0];
        for (var i = 1; i < this.vertices.length; i++) {
            if (MyMath_SE_1.dist(this.vertices[i].x, this.vertices[i].y, x, y) <
                MyMath_SE_1.dist(closest.x, closest.y, x, y)) {
                closest = this.vertices[i];
            }
        }
        return closest;
    };
    Rect.prototype.updateVerticesSimple = function () {
        this.vertices[0].set(this.left, this.top);
        this.vertices[1].set(this.right, this.top);
        this.vertices[2].set(this.right, this.bottom);
        this.vertices[3].set(this.left, this.bottom);
    };
    Rect.prototype.circularIntersect = function (anotherRect) {
        var dx = this.cX - anotherRect.cX;
        var dy = this.cY - anotherRect.cY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        return dist < this.hDiagonal + anotherRect.hDiagonal;
    };
    Rect.prototype.rotContains = function (x, y) {
        var ang = MyMath_SE_1.getAngleToAxis(this.cX, this.cY, x, y) - this.ang;
        var dis = MyMath_SE_1.dist(this.cX, this.cY, x, y);
        return this.contains(this.cX + dis * Math.sin(ang), this.cY - dis * Math.cos(ang));
    };
    Rect.prototype.contains = function (x, y) {
        return !(x < this.left || x > this.right ||
            y < this.top || y > this.bottom);
    };
    Rect.prototype.intersects = function (rect) {
        return !(this.left > rect.right || this.right < rect.left || this.top > rect.bottom || this.bottom < rect.top);
    };
    Rect.prototype.containsRect = function (rect) {
        return rect.top >= this.top && rect.right <= this.right && rect.bottom <= this.bottom && rect.left >= this.left;
    };
    Rect.prototype.containsCircleRect = function (rect) {
        return rect.cY - rect.r >= this.top && rect.cX + rect.r <= this.right &&
            rect.cY + rect.r <= this.bottom && rect.cX - rect.r >= this.left;
    };
    Rect.prototype.rectCircleVSCircle = function (x1, y1, r) {
        return MyMath_SE_1.dist(x1, y1, this.cX, this.cY) < this.hDiagonal + r;
    };
    Rect.prototype.simpleLineInt = function (x1, y1, x2, y2) {
        return (li.checkIntersection(x1, y1, x2, y2, this.left, this.top, this.right, this.top).point ||
            li.checkIntersection(x1, y1, x2, y2, this.right, this.bottom, this.right, this.top).point ||
            li.checkIntersection(x1, y1, x2, y2, this.left, this.bottom, this.right, this.bottom).point ||
            li.checkIntersection(x1, y1, x2, y2, this.left, this.top, this.left, this.bottom).point);
    };
    Rect.prototype.lineInt = function (x1, y1, x2, y2) {
        return (li.checkIntersection(x1, y1, x2, y2, this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y).point ||
            li.checkIntersection(x1, y1, x2, y2, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y).point ||
            li.checkIntersection(x1, y1, x2, y2, this.vertices[2].x, this.vertices[2].y, this.vertices[3].x, this.vertices[3].y).point ||
            li.checkIntersection(x1, y1, x2, y2, this.vertices[0].x, this.vertices[0].y, this.vertices[3].x, this.vertices[3].y).point);
    };
    Rect.prototype.lineIntPoints = function (x1, y1, x2, y2) {
        var points = [];
        var point = li.checkIntersection(x1, y1, x2, y2, this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y).point;
        if (point)
            points.push(point);
        point = li.checkIntersection(x1, y1, x2, y2, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y).point;
        if (point)
            points.push(point);
        point = li.checkIntersection(x1, y1, x2, y2, this.vertices[2].x, this.vertices[2].y, this.vertices[3].x, this.vertices[3].y).point;
        if (point)
            points.push(point);
        point = li.checkIntersection(x1, y1, x2, y2, this.vertices[0].x, this.vertices[0].y, this.vertices[3].x, this.vertices[3].y).point;
        if (point)
            points.push(point);
        return points;
    };
    Rect.prototype.simpleLineIntPoints = function (x1, y1, x2, y2) {
        var points = [];
        var point = li.checkIntersection(x1, y1, x2, y2, this.left, this.top, this.right, this.top).point;
        if (point)
            points.push(point);
        point = li.checkIntersection(x1, y1, x2, y2, this.right, this.bottom, this.right, this.top).point;
        if (point)
            points.push(point);
        point = li.checkIntersection(x1, y1, x2, y2, this.left, this.bottom, this.right, this.bottom).point;
        if (point)
            points.push(point);
        point = li.checkIntersection(x1, y1, x2, y2, this.left, this.top, this.left, this.bottom).point;
        if (point)
            points.push(point);
        return points;
    };
    return Rect;
}());
exports.Rect = Rect;
var Vec2 = (function () {
    function Vec2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Vec2.prototype.set = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };
    return Vec2;
}());
exports.Vec2 = Vec2;
