"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room_SE = void 0;
var Room_SE = (function () {
    function Room_SE() {
        this.sockets = [];
    }
    Room_SE.prototype.addSocket = function (socket) {
        if (this.sockets.indexOf(socket) === -1)
            this.sockets.push(socket);
    };
    Room_SE.prototype.removeSocket = function (socket) {
        var index = this.sockets.indexOf(socket);
        if (index == -1)
            return;
        this.sockets.splice(index, 1);
    };
    Room_SE.prototype.broadcast = function (emName, content, exception) {
        for (var s = 0; s < this.sockets.length; s++) {
            if (this.sockets[s] == exception)
                continue;
            this.sockets[s].emit(emName, content);
        }
    };
    Room_SE.prototype.getSocketCount = function () {
        return this.sockets.length;
    };
    return Room_SE;
}());
exports.Room_SE = Room_SE;
