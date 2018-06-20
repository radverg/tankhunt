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
var PlayerGroup_CL = (function (_super) {
    __extends(PlayerGroup_CL, _super);
    function PlayerGroup_CL() {
        var _this = _super.call(this, TH.game) || this;
        _this.players = {};
        _this.myID = null;
        return _this;
    }
    Object.defineProperty(PlayerGroup_CL.prototype, "me", {
        get: function () { return this.players[this.myID || "notspecified"]; },
        enumerable: true,
        configurable: true
    });
    ;
    PlayerGroup_CL.prototype.add = function (player) {
        if (player.tank) {
            _super.prototype.add.call(this, player.tank);
        }
        else
            throw "Cannot add a player without tank!";
        this.players[player.id] = player;
    };
    PlayerGroup_CL.prototype.addTank = function (tank) {
        _super.prototype.add.call(this, tank);
    };
    PlayerGroup_CL.prototype.getPlayer = function (playerID) {
        return this.players[playerID];
    };
    PlayerGroup_CL.prototype.getTank = function (playerID) {
        return this.players[playerID].tank;
    };
    PlayerGroup_CL.prototype.updateTanks = function () {
        this.forEach(this.updateTank);
    };
    PlayerGroup_CL.prototype.removePlayer = function (plID) {
        this.players[plID].removeTank();
        delete this.players[plID];
    };
    PlayerGroup_CL.prototype.updateTank = function (tank) {
        tank.interpolationUpdate();
    };
    PlayerGroup_CL.prototype.setMe = function (player) {
        this.myID = player.id;
        player.tank.defaultColor = Color.Blue;
        player.tank.color = Color.Blue;
    };
    PlayerGroup_CL.prototype.setEnemy = function (player) {
        player.tank.defaultColor = Color.Enemy;
        player.tank.color = Color.Enemy;
    };
    PlayerGroup_CL.prototype.setFriend = function (player) {
        player.tank.defaultColor = Color.Friend;
        player.tank.color = Color.Friend;
    };
    return PlayerGroup_CL;
}(Phaser.Group));
