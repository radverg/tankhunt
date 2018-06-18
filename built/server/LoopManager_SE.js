"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoopManager_SE = (function () {
    function LoopManager_SE(tankhunt) {
        this.mainLoop = null;
        this.lastTick = null;
        this.th = tankhunt;
        this.gm = tankhunt.gameManager;
    }
    LoopManager_SE.prototype.start = function () {
        var _this = this;
        this.mainLoop = setInterval(function () { _this.serverLoop(); }, 1000 / 60);
        this.lastTick = Date.now();
        console.log("Server loop has been started!");
    };
    LoopManager_SE.prototype.serverLoop = function () {
        var deltaSec = (Date.now() - this.lastTick) / 1000;
        this.gm.loopTick(deltaSec);
        this.lastTick += deltaSec * 1000;
    };
    return LoopManager_SE;
}());
exports.LoopManager_SE = LoopManager_SE;
