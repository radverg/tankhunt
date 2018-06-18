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
        socket.on("disconnect", this.onDisconnect);
        socket.on("input", this.onInput);
    };
    SocketManager_SE.prototype.onDisconnect = function () {
        console.log("Client " + this.handshake.address + " has disconnected!");
        if (this.player && this.player.game) {
            this.player.game.playerDisconnected(this.player);
        }
    };
    SocketManager_SE.prototype.onInput = function (data) {
        if (this.player && this.player.game) {
            this.player.game.handleInput(data, this.player);
        }
    };
    return SocketManager_SE;
}());
exports.SocketManager_SE = SocketManager_SE;
