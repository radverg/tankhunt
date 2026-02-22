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
var Arena_CL = (function (_super) {
    __extends(Arena_CL, _super);
    function Arena_CL(socketManager, packet) {
        var _this = _super.call(this, socketManager) || this;
        _this.uiArena = new UIPlayerManager_CL(TH.game, _this);
        _this.uiNotification = new UINotification_CL(TH.game, _this);
        _this.uiLadder = new UILadder_CL(TH.game, _this);
        _this.uiStats = new UIStatsTable_CL(_this, ["inRow", "maxRow", "kills", "deaths", "suic", "blockC", "dmgD", "dmgR",], "kills");
        _this.uiChat = new UIGameChat_CL(TH.game, _this);
        var btnExit = TH.game.add.button(TH.game.width - 70, 20, "panels", function () { this.socketManager.emitLeave(); this.leaveToMenu(); }, _this, 1, 0);
        var btnText = TH.game.make.text(0, 0, "Quit");
        btnExit.scale.setTo(0.5);
        btnExit.anchor.setTo(0.5);
        btnText.anchor.setTo(0.5);
        btnExit.addChild(btnText);
        btnExit.onOverSound = TH.effects.getSound(SoundNames.CLICK);
        btnExit.onOverSoundMarker = SoundNames.CLICK;
        btnExit.fixedToCamera = true;
        btnExit.alpha = 0.7;
        _this.processLevel(packet.level);
        _this.processGameInfo(packet);
        _this.running = true;
        _this.game.camera.unfollow();
        _this.game.camera.setPosition(_this.game.world.centerX - _this.game.camera.view.halfWidth, _this.game.world.centerY - _this.game.camera.view.halfHeight);
        TH.effects.playAudioLooping(SoundNames.SONG1);
        return _this;
    }
    Arena_CL.prototype.processRespawn = function (data) {
        var player = this.playerGroup.getPlayer(data.plID);
        if (!player)
            return;
        player.tank.maxHealth = data.health;
        player.tank.health = data.health;
        player.tank.applyStatePacket(data);
        player.tank.jumpToRemote();
        player.tank.setColor(Color.Gray);
        TH.game.time.events.add(data.respawnDelay, player.tank.revive, player.tank);
        TH.game.time.events.add(data.respawnDelay + data.immunityTime, function () { this.setColor(this.defaultColorIndex); }, player.tank);
        this.onRespawn.dispatch(player);
    };
    return Arena_CL;
}(THGame_CL));
