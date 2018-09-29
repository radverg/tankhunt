class TimeManager_CL {

    private clockDiff: number = 0;
    private sm: SocketManager_CL = null;

    private pingStart: number = null;
    private pingEnd: number = null;

    private lastSync: number = null;

    private _ping: number;
    get ping()  { return this._ping; };

    constructor(sm: SocketManager_CL) {
        this.sm = sm;
    }

    synchronizeRequest() {

        this.pingStart = Date.now();
        this.sm.emitPingRequest();
    }

    onSynchronizeResponse(serverTime: number) {
        this.pingEnd = Date.now();
        this._ping = this.pingEnd - this.pingStart;

        this.clockDiff = serverTime - (this.pingStart + this._ping / 2);
        this.lastSync = this.pingEnd;
    }

    getDelay(serverTime: number) {
        return (Date.now() + this.clockDiff) - serverTime;
    }
}