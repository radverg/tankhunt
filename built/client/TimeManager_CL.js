var TimeManager_CL = (function () {
    function TimeManager_CL(sm) {
        this.clockDiff = 0;
        this.sm = null;
        this.pingStart = null;
        this.pingEnd = null;
        this.lastSync = null;
        this.sm = sm;
    }
    Object.defineProperty(TimeManager_CL.prototype, "ping", {
        get: function () { return this._ping; },
        enumerable: true,
        configurable: true
    });
    ;
    TimeManager_CL.prototype.synchronizeRequest = function () {
        this.pingStart = Date.now();
        this.sm.emitPingRequest();
    };
    TimeManager_CL.prototype.onSynchronizeResponse = function (serverTime) {
        this.pingEnd = Date.now();
        this._ping = this.pingEnd - this.pingStart;
        this.clockDiff = serverTime - (this.pingStart + this._ping / 2);
        this.lastSync = this.pingEnd;
    };
    TimeManager_CL.prototype.getDelay = function (serverTime) {
        return (Date.now() + this.clockDiff) - serverTime;
    };
    return TimeManager_CL;
}());
