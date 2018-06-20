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
var Arena_CL = (function (_super) {
    __extends(Arena_CL, _super);
    function Arena_CL(socketManager) {
        return _super.call(this, socketManager) || this;
    }
    Arena_CL.prototype.processRespawn = function (data) {
        var player = this.playerGroup.getPlayer(data.plID);
        if (player) {
            player.tank.applyStatePacket(data);
        }
        TH.game.time.events.add(data.respawnDelay, player.tank.revive, player.tank);
    };
    Arena_CL.prototype.newPlayerFromPacket = function (packet) {
        var tank = new DefaultTank_CL();
        var player = new Player_CL(packet.id, tank, packet.name);
        player.stats = packet.stats;
        if (packet.tank) {
            tank.applyStatePacket(packet.tank);
            tank.jumpToRemote();
        }
        this.playerGroup.add(player);
        if (packet.id == this.socketManager.getID()) {
            this.playerGroup.setMe(player);
            this.setCamera();
        }
        else {
            this.playerGroup.setEnemy(player);
        }
        if (!packet.alive) {
            tank.hide();
        }
    };
    return Arena_CL;
}(THGame_CL));
