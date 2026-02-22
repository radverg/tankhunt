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
        this.thGame.onGameFinish.add(this.itemMeUse, this);
    }

    createPlayerView(player: Player_CL) {
        let plrView = new UIPlayer_CL(this.game, this.thGame, player);
    }

    removePlayer(player: Player_CL) {
        if (player.UIpl) {
            player.UIpl.destroy(true);
            player.UIpl = null;
        }
    }

    hitPlayer(data: PacketShotHit) {
        let plHit = this.thGame.playerGroup.getPlayer(data.plID);

        if (plHit && plHit.UIpl) {
            if (data.healthAft != data.healthBef)
                plHit.UIpl.healthChange(data.healthBef, data.healthAft);
            else 
                plHit.UIpl.blockSign();

            if (data.healthAft <= 0) {
                plHit.UIpl.hideItemIcon();
            }
        }
    }

    healPlayer(player: Player_CL, packet: PacketHeal) {
        
        let healthBef = (packet.healthBef === undefined) ? player.tank.health - packet.amount : packet.healthBef;
        let healthAft = (packet.healthAft === undefined) ? player.tank.health : packet.healthAft;

        if (!player || !player.UIpl) return;
            
        player.UIpl.updateHealthBar();

        if (healthBef != healthAft)
            player.UIpl.healthChange(healthBef, healthAft);
        
    }

    respawnPlayer(player: Player_CL) {
        if (player && player.UIpl) {
            player.UIpl.updateHealthBar();
        }
    }

    itemCollect(item: Item_CL, collector: Player_CL) {

        if (collector === this.thGame.playerGroup.me) {
            // Show item icon
            if (collector.UIpl) {
                collector.UIpl.showItemIcon(item.getSprFrame() as number);
            }
        }
    }

    itemMeUse() {
        // Hide item icon
        let me = this.thGame.playerGroup.me;
        if (me && me.UIpl) {
            me.UIpl.hideItemIcon();
        }
    }

    /**
     * Update health bars of all players
     */
    updateAllBars() {
        let plrs = this.thGame.playerGroup.players;

        for (const id in plrs) {
            let plr = plrs[id];
            if (!plr || !plr.UIpl) continue;
            plr.UIpl.updateHealthBar();
        }
    }
}