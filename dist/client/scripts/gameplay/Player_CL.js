var Player_CL = (function () {
    function Player_CL(id, tank, name) {
        this.name = "unnamed";
        this.tank = null;
        this.me = false;
        this.stats = new Stats_CL();
        this.team = 0;
        this.UIpl = null;
        this.id = id;
        this.name = name || "unnamed";
        if (tank) {
            this.attachTank(tank);
        }
        ;
    }
    Player_CL.prototype.attachTank = function (tank) {
        this.tank = tank;
        tank.player = this;
    };
    ;
    Player_CL.prototype.removeTank = function () {
        if (!this.tank)
            return;
        this.tank.destroy();
        this.tank = null;
    };
    ;
    Player_CL.prototype.isEnemyOf = function (player) {
        if (this == player)
            return false;
        if (!this.team || !player.team)
            return true;
        return this.team !== player.team;
    };
    return Player_CL;
}());
