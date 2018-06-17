"use strict";
var SocketManager = /** @class */ (function () {
    function SocketManager(tankhunt) {
        this.th = tankhunt;
        this.socket = null;
    }
    /**
     * Creates websocket connection via socket.io and calls initSocket()
     */
    SocketManager.prototype.connect = function () {
        this.socket = io.connect();
        this.initSocket();
    };
    /**
     * Returns ID of the socket
     */
    SocketManager.prototype.getID = function () {
        return this.socket.id;
    };
    /**
     * Creates callback for all possible incoming emits via socket.io
     */
    SocketManager.prototype.initSocket = function () {
        var that = this;
        this.socket.on("connect", this.onConnection);
        this.socket.on("movableState", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processStateInfo(data); });
        this.socket.on("gameInfo", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processGameInfo(data); });
        this.socket.on("removePlayer", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.removePlayer(data); });
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
        this.socket.on("kill", function (data) { if (that.th.playManager.thGame)
            that.th.playManager.thGame.processKill(data); });
    };
    /**
     * Called when Websocket connection is established, this refers to the new socket
     */
    SocketManager.prototype.onConnection = function () {
        console.log("Connected to the server! ID is: " + this.id);
    };
    /**
     * Sends input information to the server
     * @param {*} data Text representation of the input (example: inpTurrLeftOn)
     */
    SocketManager.prototype.emitInput = function (data) {
        this.socket.emit("input", data);
    };
    return SocketManager;
}());
