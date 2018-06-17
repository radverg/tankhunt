var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Arena = (function (_super) {
    __extends(Arena, _super);
    function Arena(socketManager) {
        return _super.call(this, socketManager) || this;
    }
    Arena.prototype.processRespawn = function (data) {
        if (this.hasPlayer(data.plID)) {
            this.players[data.plID].tank.applyStatePacket(data);
        }
        TH.game.time.events.add(data.respawnDelay, this.players[data.plID].tank.revive, this.players[data.plID].tank);
    };
    Arena.prototype.newPlayerFromPacket = function (packet) {
        var tank = new DefaultTank();
        var player = new Player(packet.id, tank, packet.name);
        player.stats = packet.stats;
        if (packet.tank) {
            tank.applyStatePacket(packet.tank);
            tank.jumpToRemote();
        }
        this.players[packet.id] = player;
        if (packet.id == this.socketManager.getID()) {
            this.playerMe = player;
            tank.defaultColor = Color.Blue;
            tank.color = Color.Blue;
            this.setCamera();
        }
        else {
            tank.defaultColor = Color.Red;
            tank.color = Color.Red;
        }
        if (!packet.alive) {
            tank.hide();
        }
        tank.addToScene();
    };
    return Arena;
}(THGame));
