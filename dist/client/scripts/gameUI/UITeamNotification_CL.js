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
var UITeamNotification_CL = (function (_super) {
    __extends(UITeamNotification_CL, _super);
    function UITeamNotification_CL(game, thGame) {
        var _this = _super.call(this, game, thGame) || this;
        _this.lastCapNotification = Date.now();
        _this.topGroup.cameraOffset.y = 130;
        return _this;
    }
    UITeamNotification_CL.prototype.initialize = function () {
        this.thGame.onPlayerRemove.add(function (player) { this.logText("Player ".concat(player.name, " has left the game!")); }, this);
        this.thGame.onHit.add(this.playerHit, this);
        this.thGame.onCapture.add(this.captureCallback, this);
    };
    UITeamNotification_CL.prototype.playerHit = function (packet, player) {
        var me = this.thGame.playerGroup.me;
        if (packet.healthAft > 0)
            return;
        if (me.team === player.team) {
            if (player.me) {
                this.logBig("You have been killed!", "red");
            }
            else {
                this.logBig("Team mate killed!", "red");
            }
        }
        else {
            this.logBig("Enemy killed!", "green");
        }
    };
    UITeamNotification_CL.prototype.captureCallback = function (packet) {
        var mineCap = packet.tm === this.thGame.playerGroup.me.team;
        if (packet.st) {
            if (mineCap && Date.now() - this.lastCapNotification > 2000) {
                this.lastCapNotification = Date.now();
                this.logBig("Enemy is capturing!", "red");
            }
        }
        else if (packet.fin) {
            if (mineCap) {
                this.logBig("Our base has been captured!", "red");
            }
            else {
                this.logBig("Enemy base has been captured!", "green");
            }
        }
    };
    UITeamNotification_CL.prototype.logBig = function (text, color) {
        if (!TH.effects.should())
            return;
        var offsetY = this.topGroup.children.length * 30;
        this.topGroup.add(TextMaker_CL.goTextBigUp(text, 0, offsetY, color));
    };
    return UITeamNotification_CL;
}(UINotification_CL));
