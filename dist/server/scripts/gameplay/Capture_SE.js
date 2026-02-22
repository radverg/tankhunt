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
exports.Capture_SE = void 0;
var GameObject_SE_1 = require("./utils/GameObject_SE");
var Capture_SE = (function (_super) {
    __extends(Capture_SE, _super);
    function Capture_SE(sqrX, sqrY, sqrSize, team, capTime) {
        if (capTime === void 0) { capTime = 4000; }
        var _this = _super.call(this, sqrX + sqrSize / 2, sqrY + sqrSize / 2, sqrSize, sqrSize) || this;
        _this.lastCapStart = null;
        _this.lastCapStop = 0;
        _this.capturing = false;
        _this.capturer = null;
        _this.team = team;
        _this.capTime = capTime;
        _this.id = "a".concat(sqrX, "|").concat(sqrY);
        return _this;
    }
    Capture_SE.prototype.startCapturing = function (capturer) {
        if (this.capturer)
            return;
        this.lastCapStart = Date.now();
        this.capturing = true;
        this.capturer = capturer;
        this.capturer.capture = this;
        var pack = this.getPacket();
        pack.st = true;
        return pack;
    };
    Capture_SE.prototype.cancelCapturing = function () {
        this.lastCapStop = Date.now();
        this.capturing = false;
        var pack = this.getPacket();
        pack.cn = true;
        this.capturer.capture = null;
        this.capturer = null;
        return pack;
    };
    Capture_SE.prototype.resetCapturing = function () {
        this.capturing = true;
        this.lastCapStart = Date.now();
        var pack = this.getPacket();
        pack.rs = true;
        return pack;
    };
    Capture_SE.prototype.finishCapturing = function () {
        this.capturer.capture = null;
        this.capturing = false;
        this.capturer.stats.caps++;
        var pack = this.getPacket();
        pack.fin = true;
        return pack;
    };
    Capture_SE.prototype.isCaptured = function () {
        if (this.lastCapStart === null)
            return false;
        var res = false;
        if (this.lastCapStart > this.lastCapStop) {
            res = (Date.now() - this.lastCapStart) > this.capTime;
        }
        else {
            res = this.lastCapStop - this.lastCapStart > this.capTime;
        }
        if (res) {
            this.remove = true;
        }
        return res;
    };
    Capture_SE.prototype.getPacket = function () {
        var packet = {
            id: this.id,
            tm: this.team,
        };
        if (this.capturer) {
            packet.plID = this.capturer.id;
        }
        return packet;
    };
    return Capture_SE;
}(GameObject_SE_1.GameObject_SE));
exports.Capture_SE = Capture_SE;
