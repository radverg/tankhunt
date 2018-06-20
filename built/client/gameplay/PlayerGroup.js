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
        return _super.call(this, TH.game) || this;
    }
    PlayerGroup_CL.prototype.add = function (player) {
        if (player.tank)
            _super.prototype.add.call(this, player.tank);
        this.players[player.id] = player;
    };
    PlayerGroup_CL.prototype.addTank = function (tank) {
        _super.prototype.add.call(this, tank);
    };
    return PlayerGroup_CL;
}(Phaser.Group));
