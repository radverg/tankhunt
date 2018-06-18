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
