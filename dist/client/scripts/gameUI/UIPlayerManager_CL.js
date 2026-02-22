var UIPlayerManager_CL = (function () {
    function UIPlayerManager_CL(phaserGame, thGame) {
        this.game = phaserGame;
        this.thGame = thGame;
        this.initialize();
    }
    UIPlayerManager_CL.prototype.initialize = function () {
        this.thGame.onNewPlayer.add(this.createPlayerView, this);
        this.thGame.onPlayerRemove.add(this.removePlayer, this);
        this.thGame.onHit.add(this.hitPlayer, this);
        this.thGame.onRespawn.add(this.respawnPlayer, this);
        this.thGame.onHeal.add(this.healPlayer, this);
        this.thGame.onItemCollect.add(this.itemCollect, this);
        this.thGame.onMeItemUse.add(this.itemMeUse, this);
        this.thGame.onGameFinish.add(this.itemMeUse, this);
    };
    UIPlayerManager_CL.prototype.createPlayerView = function (player) {
        var plrView = new UIPlayer_CL(this.game, this.thGame, player);
    };
    UIPlayerManager_CL.prototype.removePlayer = function (player) {
        if (player.UIpl) {
            player.UIpl.destroy(true);
            player.UIpl = null;
        }
    };
    UIPlayerManager_CL.prototype.hitPlayer = function (data) {
        var plHit = this.thGame.playerGroup.getPlayer(data.plID);
        if (plHit && plHit.UIpl) {
            if (data.healthAft != data.healthBef)
                plHit.UIpl.healthChange(data.healthBef, data.healthAft);
            else
                plHit.UIpl.blockSign();
            if (data.healthAft <= 0) {
                plHit.UIpl.hideItemIcon();
            }
        }
    };
    UIPlayerManager_CL.prototype.healPlayer = function (player, packet) {
        var healthBef = (packet.healthBef === undefined) ? player.tank.health - packet.amount : packet.healthBef;
        var healthAft = (packet.healthAft === undefined) ? player.tank.health : packet.healthAft;
        if (!player || !player.UIpl)
            return;
        player.UIpl.updateHealthBar();
        if (healthBef != healthAft)
            player.UIpl.healthChange(healthBef, healthAft);
    };
    UIPlayerManager_CL.prototype.respawnPlayer = function (player) {
        if (player && player.UIpl) {
            player.UIpl.updateHealthBar();
        }
    };
    UIPlayerManager_CL.prototype.itemCollect = function (item, collector) {
        if (collector === this.thGame.playerGroup.me) {
            if (collector.UIpl) {
                collector.UIpl.showItemIcon(item.getSprFrame());
            }
        }
    };
    UIPlayerManager_CL.prototype.itemMeUse = function () {
        var me = this.thGame.playerGroup.me;
        if (me && me.UIpl) {
            me.UIpl.hideItemIcon();
        }
    };
    UIPlayerManager_CL.prototype.updateAllBars = function () {
        var plrs = this.thGame.playerGroup.players;
        for (var id in plrs) {
            var plr = plrs[id];
            if (!plr || !plr.UIpl)
                continue;
            plr.UIpl.updateHealthBar();
        }
    };
    return UIPlayerManager_CL;
}());
