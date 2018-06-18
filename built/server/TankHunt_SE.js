"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketManager_SE_1 = require("./SocketManager_SE");
var GameManager_SE_1 = require("./GameManager_SE");
var LoopManager_SE_1 = require("./LoopManager_SE");
var TankHunt_SE = (function () {
    function TankHunt_SE(server) {
        this.nodeserver = server;
        this.io = require("socket.io").listen(server);
        this.startTime = Date.now();
        this.socketManager = new SocketManager_SE_1.SocketManager_SE(this, this.io);
        this.gameManager = new GameManager_SE_1.GameManager_SE(this);
        this.loopManager = new LoopManager_SE_1.LoopManager_SE(this);
        this.loopManager.start();
        console.log("Socket IO is now listening for Websockets!");
        console.log("TankHunt is ready!");
    }
    return TankHunt_SE;
}());
exports.TankHunt_SE = TankHunt_SE;
