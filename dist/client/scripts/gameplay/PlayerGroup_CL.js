var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
        enumerable: false,
        configurable: true
    });
    ;
    PlayerGroup_CL.prototype.addPlayer = function (player) {
        if (player.tank) {
            player.tank.addToGroup(this);
        }
        else
            throw "Cannot add a player without tank!";
        this.players[player.id] = player;
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
    PlayerGroup_CL.prototype.stateUpdate = function (data) {
        var keys = Object.keys(this.players);
        for (var i = 0; i < keys.length; i++) {
            var plr = this.players[keys[i]];
            if (data.p[plr.id]) {
                plr.tank.show();
                plr.tank.applyTinyStatePacket(data.p[plr.id]);
            }
            else {
                plr.tank.hide();
            }
        }
    };
    PlayerGroup_CL.prototype.updateTank = function (tank) {
        tank.update();
    };
    PlayerGroup_CL.prototype.setMe = function (player) {
        this.myID = player.id;
        player.me = true;
        player.tank.setDefaultColor(Color.Blue);
        player.tank.setColor(Color.Blue);
    };
    PlayerGroup_CL.prototype.setEnemy = function (player) {
        player.tank.setDefaultColor(Color.Enemy);
        player.tank.setColor(Color.Enemy);
    };
    PlayerGroup_CL.prototype.setFriend = function (player) {
        player.tank.setDefaultColor(Color.Friend);
        player.tank.setColor(Color.Friend);
    };
    PlayerGroup_CL.prototype.getSortedIDsByStats = function (sortKey, asc) {
        var players = this.players;
        var sortDir = asc ? -1 : 1;
        var keys = Object.keys(players);
        keys.sort(function (a, b) {
            return (players[b].stats[sortKey] - players[a].stats[sortKey]) * sortDir;
        });
        return keys;
    };
    return PlayerGroup_CL;
}(Phaser.Group));
