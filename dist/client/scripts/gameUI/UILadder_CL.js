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
var UILadder_CL = (function () {
    function UILadder_CL(game, thGame, slots) {
        if (slots === void 0) { slots = 4; }
        this.rankGroups = [];
        this.groupHeight = 64;
        this.sortKey = "kills";
        this.sortAsc = false;
        this.thGame = thGame;
        this.game = game;
        this.slots = slots;
        this.initialize();
    }
    UILadder_CL.prototype.initialize = function () {
        var offsetY = 20;
        for (var i = 0; i < this.slots; i++) {
            var grp = new Phaser.Group(this.game);
            this.rankGroups.push(grp);
            grp.fixedToCamera = true;
            grp.cameraOffset.setTo(10, offsetY + i * this.groupHeight);
            var panel = grp.create(0, 0, "panels");
            panel.width = 240;
            panel.height = this.groupHeight;
            panel.alpha = 0.6;
            panel.frame = 1;
            var rankPos = { x: 7, y: 7 };
            var numSpr = null;
            if (i < 3) {
                numSpr = grp.create(rankPos.x, rankPos.y, "medals", i);
                numSpr.scale.setTo(0.7);
            }
            else {
                numSpr = TextMaker_CL.rankNumber(i + 1, rankPos.x + 10, rankPos.y);
                grp.add(numSpr);
            }
            var offsetX = 62;
            var style = {
                font: "Arial",
                fontSize: 22,
                fill: "white",
                fontStyle: "bold"
            };
            var nameSpr = this.game.make.text(offsetX, 5, "0", style);
            grp.add(nameSpr);
            style.fontSize = 16;
            var statsText = this.game.make.text(offsetX, 30, "0", style);
            grp.add(statsText);
        }
        this.rankGroups[this.slots - 1].getChildAt(0).frame = 0;
        this.thGame.onNewPlayerConnected.add(this.update, this);
        this.thGame.onGameInfo.add(this.update, this);
        this.thGame.onHit.add(this.update, this);
    };
    UILadder_CL.prototype.update = function () {
        var players = this.thGame.playerGroup.players;
        var me = this.thGame.playerGroup.me;
        var keys = this.thGame.playerGroup.getSortedIDsByStats(this.sortKey, this.sortAsc);
        for (var i = 0; i < this.slots - 1; i++) {
            var grp = this.rankGroups[i];
            var player = (keys[i]) ? players[keys[i]] : null;
            var nameText = this.getStatsText1(player);
            var statsText = this.getStatsText2(player);
            grp.getChildAt(0).frame = (player) ? ((player.me) ? 0 : 1) : 1;
            grp.getChildAt(2).text = nameText;
            grp.getChildAt(3).text = statsText;
        }
        if (!me)
            return;
        var myRank = keys.indexOf(me.id) + 1;
        var myGrp = this.rankGroups[this.rankGroups.length - 1];
        if (myRank > this.slots - 1) {
            myGrp.visible = true;
            var nameText = this.getStatsText1(me);
            var statsText = this.getStatsText2(me);
            myGrp.getChildAt(1).text = myRank.toString();
            myGrp.getChildAt(2).text = nameText;
            myGrp.getChildAt(3).text = statsText;
        }
        else {
            myGrp.visible = false;
        }
    };
    UILadder_CL.prototype.getStatsText1 = function (player) {
        return (player) ? player.name : "";
    };
    UILadder_CL.prototype.getStatsText2 = function (player) {
        return (player) ? "".concat(player.stats.inRow, " kills in a row") : "";
    };
    return UILadder_CL;
}());
var UILadderDuel_CL = (function (_super) {
    __extends(UILadderDuel_CL, _super);
    function UILadderDuel_CL(game, thGame) {
        var _this = _super.call(this, game, thGame, 3) || this;
        _this.sortKey = "wins";
        return _this;
    }
    UILadderDuel_CL.prototype.getStatsText1 = function (player) {
        return (player) ? player.name : "";
    };
    UILadderDuel_CL.prototype.getStatsText2 = function (player) {
        return (player) ? "".concat(player.stats.wins, " wins") : "";
    };
    return UILadderDuel_CL;
}(UILadder_CL));
