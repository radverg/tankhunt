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
var TeamFight_CL = (function (_super) {
    __extends(TeamFight_CL, _super);
    function TeamFight_CL(sm, packet) {
        var _this = _super.call(this, sm) || this;
        _this.caps = {};
        _this.onCapture = new Phaser.Signal();
        _this.allyCapturedCount = 0;
        _this.enemyCapturedCount = 0;
        _this.uiTeamFight = new UITeamFight_CL(_this.game, _this);
        _this.processGameInfo(packet);
        var me = _this.playerGroup.me;
        for (var key in _this.playerGroup.players) {
            var plr = _this.playerGroup.players[key];
            if (!plr.isEnemyOf(me) && plr !== me) {
                _this.playerGroup.setFriend(plr);
            }
        }
        _this.processLevel(packet.level);
        _this.capTime = packet.capTime;
        for (var _i = 0, _a = packet.caps; _i < _a.length; _i++) {
            var cap = _a[_i];
            var splID = cap.id.split("|");
            var sqrX = parseInt(splID[0].substr(1));
            var sqrY = parseInt(splID[1]);
            var capSpr = new Capture_CL(sqrX, sqrY, _this.level.getSqrSize(), cap.tm, me.team, _this.capTime, _this.game);
            _this.levelGroup.add(capSpr);
            _this.caps[capSpr.id] = capSpr;
        }
        TH.effects.playAudioLooping(SoundNames.WIND);
        _this.running = true;
        _this.onGameStart.dispatch(packet);
        return _this;
    }
    TeamFight_CL.prototype.processRespawn = function (data) {
        var player = this.playerGroup.getPlayer(data.plID);
        if (!player)
            return;
        player.tank.maxHealth = data.health;
        player.tank.health = data.health;
        player.tank.applyStatePacket(data);
        player.tank.jumpToRemote();
        player.tank.revive();
        if (player.me) {
            TH.effects.playAudio(SoundNames.RESPAWN);
        }
        this.onRespawn.dispatch(player);
    };
    TeamFight_CL.prototype.processCapture = function (data) {
        var cap = this.caps[data.id];
        if (!cap)
            return;
        if (data.rs || data.st) {
            cap.startCapturing();
        }
        if (data.cn) {
            cap.cancelCapturing();
        }
        if (data.fin) {
            delete this.caps[cap.id];
            cap.fadeOut();
            var plr = this.playerGroup.getPlayer(data.plID);
            if (plr) {
                plr.stats.caps++;
            }
            if (cap.team == this.playerGroup.me.team) {
                this.allyCapturedCount++;
            }
            else {
                this.enemyCapturedCount++;
            }
        }
        this.onCapture.dispatch(data);
    };
    TeamFight_CL.prototype.processGameFinish = function (data) {
        this.onGameFinish.dispatch(data);
    };
    TeamFight_CL.prototype.processHeal = function (data) {
        var plrs = this.playerGroup.players;
        for (var id in plrs) {
            var plr = plrs[id];
            if (plr.team !== data.tm)
                continue;
            plr.tank.health = Math.min(plr.tank.health + data.amount, plr.tank.maxHealth);
            this.onHeal.dispatch(plr, data);
        }
    };
    TeamFight_CL.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.onCapture.dispose();
    };
    return TeamFight_CL;
}(THGame_CL));
