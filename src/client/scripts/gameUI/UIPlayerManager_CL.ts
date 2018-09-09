
class UIPlayerManager_CL {

    private game: Phaser.Game;
    private thGame: THGame_CL;

    constructor(phaserGame: Phaser.Game, thGame: THGame_CL) {
        this.game = phaserGame;
        this.thGame = thGame;
        this.initialize();
    }

    initialize() {
        // Create callbacks
        this.thGame.onNewPlayer.add(this.createPlayerView, this);
        this.thGame.onPlayerRemove.add(this.removePlayer, this);
        this.thGame.onHit.add(this.hitPlayer, this);
        this.thGame.onRespawn.add(this.respawnPlayer, this);
        this.thGame.onHeal.add(this.healPlayer, this);
        this.thGame.onItemCollect.add(this.itemCollect, this);
        this.thGame.onMeItemUse.add(this.itemMeUse, this);

    }

    createPlayerView(player: Player_CL) {
        let plrView = new UIPlayer_CL(this.game, this.thGame, player);
    }

    removePlayer(player: Player_CL) {
        if (player.plView) {
            player.plView.destroy(true);
            player.plView = null;
        }
    }

    hitPlayer(data: PacketShotHit) {
        let plHit = this.thGame.playerGroup.getPlayer(data.plID);

        if (plHit && plHit.plView) {
            if (data.healthAft != data.healthBef)
                plHit.plView.healthChange(data.healthBef, data.healthAft);
            else 
                plHit.plView.blockSign();

            if (data.healthAft <= 0) {
                plHit.plView.hideItemIcon();
            }
        }

       
    }

    healPlayer(player: Player_CL, packet: PacketHeal) {
        if (player && player.plView) {
            player.plView.updateHealthBar();

            if (packet.healthBef != packet.healthAft)
                player.plView.healthChange(packet.healthBef, packet.healthAft);
        }
    }

    respawnPlayer(player: Player_CL) {
        if (player && player.plView) {
            player.plView.updateHealthBar();
        }
    }

    itemCollect(item: Item_CL, collector: Player_CL) {

        if (collector === this.thGame.playerGroup.me) {
            // Show item icon
            if (collector.plView) {
                collector.plView.showItemIcon(item.getSprFrame() as number);
            }
        }
    }

    itemMeUse() {
        // Hide item icon
        let me = this.thGame.playerGroup.me;
        if (me && me.plView) {
            me.plView.hideItemIcon();
        }

    }

    /**
     * Update health bars of all players
     */
    updateAllBars() {
        let plrs = this.thGame.playerGroup.players;

        for (const id in plrs) {
            let plr = plrs[id];
            if (!plr || !plr.plView) continue;
            plr.plView.updateHealthBar();
        }
    }

}