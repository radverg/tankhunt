var Player = (function () {
    function Player(id, tank, name) {
        this.name = "unnamed";
        this.tank = null;
        this.id = id;
        this.name = name || "unnamed";
        if (tank) {
            this.attachTank(tank);
        }
        ;
    }
    Player.prototype.attachTank = function (tank) {
        this.tank = tank;
        tank.player = this;
    };
    ;
    Player.prototype.removeTank = function () {
        if (!this.tank)
            return;
        this.tank.destroy();
        this.tank = null;
    };
    ;
    Player.prototype.applyPacket = function (packet) {
    };
    return Player;
}());
