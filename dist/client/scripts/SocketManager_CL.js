var SocketManager_CL = (function () {
    function SocketManager_CL(tankhunt) {
        this.socket = null;
        this.firstConnection = true;
        this.th = tankhunt;
    }
    SocketManager_CL.prototype.connect = function () {
        this.socket = io.connect();
        this.initSocket();
    };
    SocketManager_CL.prototype.getID = function () {
        return this.socket.id;
    };
    SocketManager_CL.prototype.initSocket = function () {
        var _this = this;
        var that = this;
        this.socket.on("connect", function (socket) { _this.onConnection(socket); });
        this.socket.on("disconnect", function () { console.log("Disconnected!"); });
        this.socket.on("ms", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processStateInfo(data); });
        this.socket.on("gameInfo", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processGameInfo(data); });
        this.socket.on("removePlayer", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processPlayerRemove(data); });
        this.socket.on("shot", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processNewShot(data); });
        this.socket.on("level", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processLevel(data); });
        this.socket.on("itemSpawn", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processNewItem(data); });
        this.socket.on("itemCollect", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processItemCollect(data); });
        this.socket.on("newPlayer", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processNewPlayer(data); });
        this.socket.on("respawn", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processRespawn(data); });
        this.socket.on("hit", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processHit(data); });
        this.socket.on("gameStart", function (data) { that.th.playManager.processGameStart(data); });
        this.socket.on("appear", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processAppear(data); });
        this.socket.on("disappear", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processDisappear(data); });
        this.socket.on("heal", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processHeal(data); });
        this.socket.on("gFinish", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processGameFinish(data); });
        this.socket.on("cap", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processCapture(data); });
        this.socket.on("wo", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processItemUse(data); });
        this.socket.on("menuChat", function (data) { that.th.menuManager.processChat(data); });
        this.socket.on("gameChat", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processChatMessage(data); });
        this.socket.on("menuInfo", function (data) { that.th.menuManager.processMenuInfo(data); });
        this.socket.on("pongg", function (data) { that.th.tManager.onSynchronizeResponse(data); });
    };
    SocketManager_CL.prototype.onConnection = function (socket) {
        if (this.firstConnection) {
            console.log("Connected to the server!");
            this.firstConnection = false;
        }
        else {
            console.log("Reconnected!");
            if (this.th.playManager.thGame) {
                this.th.playManager.thGame.destroy();
                TH.game.state.start("menu");
            }
        }
    };
    SocketManager_CL.prototype.emitInput = function (data) {
        this.socket.emit("input", data);
    };
    SocketManager_CL.prototype.emitGameRequest = function (data) {
        this.socket.emit("gameRequest", data);
    };
    SocketManager_CL.prototype.emitPingRequest = function () {
        this.socket.emit("pingg", {});
    };
    SocketManager_CL.prototype.emitLeave = function () {
        this.socket.emit("leave");
    };
    SocketManager_CL.prototype.emit = function (emName, data) {
        this.socket.emit(emName, data);
    };
    return SocketManager_CL;
}());
