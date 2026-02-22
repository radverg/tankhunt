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
var Duel_CL = (function (_super) {
    __extends(Duel_CL, _super);
    function Duel_CL(sm, packet) {
        var _this = _super.call(this, sm) || this;
        console.log("Creating duel game...");
        _this.winCount = packet.winCount;
        _this.uiDuel = new UIDuel_CL(TH.game, _this);
        for (var i = 0; i < packet.players.length; i++) {
            _this.newPlayerFromPacket(packet.players[i]);
        }
        _this.processLevel(packet.level);
        _this.running = true;
        _this.onGameStart.dispatch(packet);
        return _this;
    }
    Duel_CL.prototype.processGameFinish = function (data) {
        if (data.subgame) {
            this.playerGroup.setAll("maxHealth", data.nextHealth);
            this.playerGroup.setAll("health", data.nextHealth);
            this.tidy();
            this.processLevel(data.nextLevel);
            this.playerGroup.callAll("alphaShow", null);
            this.playerGroup.callAll("revive", null);
        }
        else {
            console.log("Duel ends!");
        }
        this.onGameFinish.dispatch(data);
    };
    return Duel_CL;
}(THGame_CL));
