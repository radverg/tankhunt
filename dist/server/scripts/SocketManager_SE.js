"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager_SE = void 0;
var Player_SE_1 = require("./gameplay/Player_SE");
var SocketManager_SE = (function () {
    function SocketManager_SE(tankhunt, io) {
        var _this = this;
        this.socketCount = 0;
        this.totalConnectionCount = 0;
        this.th = tankhunt;
        this.io = io;
        io.sockets.on("connection", function (socket) { _this.onConnection(socket); });
    }
    SocketManager_SE.prototype.onConnection = function (socket) {
        this.socketCount++;
        this.totalConnectionCount++;
        console.log("New client has connected from " + socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress +
            " with id " + socket.id + "!");
        console.log("Total connections: " + this.totalConnectionCount);
        this.th.menuManager.addSocket(socket);
        this.th.menuManager.emitMenuInfo();
        this.initSocket(socket);
    };
    SocketManager_SE.prototype.initSocket = function (socket) {
        var _this = this;
        socket.on("disconnect", function () { return _this.onDisconnect(socket); });
        socket.on("input", function (data) { return _this.onInput(socket, data); });
        socket.on("leave", function () { return _this.onLeave(socket); });
        socket.on("gameRequest", function (data) { return _this.onGameRequest(socket, data); });
        socket.on("pingg", function () { socket.emit("pongg", Date.now()); });
        socket.on("menuChat", function (data) { _this.th.menuManager.processMenuChat(data); });
        socket.on("gameChat", function (data) { if (socket.player && socket.player.game)
            socket.player.game.processChatMessage(data, socket.player); });
    };
    SocketManager_SE.prototype.onDisconnect = function (socket) {
        console.log("Client " + socket.request.connection.remoteAddress + " has disconnected!");
        this.th.gameManager.onSocketDisconnected(socket);
        this.socketCount--;
        this.th.menuManager.removeSocket(socket);
        this.th.menuManager.emitMenuInfo();
    };
    SocketManager_SE.prototype.onInput = function (socket, data) {
        if (socket.player && socket.player.game) {
            socket.player.game.handleInput(data, socket.player);
        }
    };
    SocketManager_SE.prototype.onLeave = function (socket) {
        console.log("Player left a game!");
        if (socket.player && socket.player.game) {
            socket.player.game.playerDisconnected(socket.player);
            this.th.menuManager.addSocket(socket);
            this.th.menuManager.emitMenuInfo();
        }
    };
    SocketManager_SE.prototype.onGameRequest = function (socket, data) {
        var name = data.playerName.trim();
        if (name.length < 3 || name.length > 12)
            name = "hacker";
        if (!socket.player)
            socket.player = new Player_SE_1.Player_SE(socket, name);
        else
            socket.player.name = name;
        this.th.gameManager.processGameRequest(socket.player, data);
    };
    return SocketManager_SE;
}());
exports.SocketManager_SE = SocketManager_SE;
