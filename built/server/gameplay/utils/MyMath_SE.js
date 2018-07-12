"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
;
function getAngleToAxis(centerX, centerY, pointX, pointY) {
    var dx = pointX - centerX;
    var dy = pointY - centerY;
    var result = 0;
    if (dy < 0 && dx >= 0) {
        result = Math.atan(dx / Math.abs(dy));
    }
    else if (dx >= 0 && dy > 0) {
        result = Math.PI - Math.atan(dx / dy);
    }
    else if (dx <= 0 && dy > 0) {
        result = Math.PI + Math.atan(Math.abs(dx) / dy);
    }
    else {
        result = Math.PI * 2 - Math.atan(Math.abs(dx) / Math.abs(dy));
    }
    return result;
}
exports.getAngleToAxis = getAngleToAxis;
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
exports.dist = dist;
function distVec(v1, v2) {
    return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y));
}
exports.distVec = distVec;
function checkIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    var numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    var numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
    if (denom == 0) {
        return false;
    }
    var uA = numeA / denom;
    var uB = numeB / denom;
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
}
exports.checkIntersection = checkIntersection;
function lineIntPoint(x1, y1, x2, y2, x3, y3, x4, y4) {
    var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    var numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    var numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
    if (denom == 0) {
        return false;
    }
    var uA = numeA / denom;
    var uB = numeB / denom;
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return {
            x: x1 + uA * (x2 - x1),
            y: y1 + uA * (y2 - y1)
        };
    }
    return false;
}
exports.lineIntPoint = lineIntPoint;
