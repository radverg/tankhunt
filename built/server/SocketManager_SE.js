"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player_SE_1 = require("./gameplay/Player_SE");
var SocketManager_SE = (function () {
    function SocketManager_SE(tankhunt, io) {
        var _this = this;
        this.th = tankhunt;
        this.io = io;
        io.sockets.on("connection", function (socket) { _this.onConnection(socket); });
    }
    SocketManager_SE.prototype.onConnection = function (socket) {
        console.log("New client has connected from " + socket.handshake.address +
            " with id " + socket.id + "!");
        this.initSocket(socket);
        this.th.gameManager.newPlayer(new Player_SE_1.Player_SE(socket, "noname"));
    };
    SocketManager_SE.prototype.initSocket = function (socket) {
        var _this = this;
        socket.on("disconnect", function () { return _this.onDisconnect(socket); });
        socket.on("input", function (data) { return _this.onInput(socket, data); });
        socket.on("gameRequest", function (data) { return _this.onGameRequest(socket, data); });
        socket.on("pingg", function () { socket.emit("pongg", Date.now()); });
    };
    SocketManager_SE.prototype.onDisconnect = function (socket) {
        console.log("Client " + socket.handshake.address + " has disconnected!");
        if (socket.player && socket.player.game) {
            socket.player.game.playerDisconnected(socket.player);
        }
    };
    SocketManager_SE.prototype.onInput = function (socket, data) {
        if (socket.player && socket.player.game) {
            socket.player.game.handleInput(data, socket.player);
        }
    };
    SocketManager_SE.prototype.onGameRequest = function (socket, data) {
        socket.player = new Player_SE_1.Player_SE(socket, data.playerName);
        this.th.gameManager.processGameRequest(socket.player, data);
    };
    return SocketManager_SE;
}());
exports.SocketManager_SE = SocketManager_SE;
