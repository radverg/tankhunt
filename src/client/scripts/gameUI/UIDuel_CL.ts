class UIDuel_CL {
    private game: Phaser.Game;
    private thGame: Duel_CL;
    private uiLadder: UILadderDuel_CL;
    private uiCountDown: UICountdown_CL;
    private uiStats: UIStatsTable_CL;
    private uiChat: UIGameChat_CL;
    private uiPlayerManager: UIPlayerManager_CL;
    private centerGrp: Phaser.Group;

    constructor(phaserGame: Phaser.Game, thGame: Duel_CL) {
        this.game = phaserGame;
        this.thGame = thGame;
        this.uiCountDown = new UICountdown_CL(TH.game);

        this.uiLadder = new UILadderDuel_CL(phaserGame, thGame);
        this.uiStats = new UIStatsTable_CL(thGame, ["wins", "kills", "deaths", "suic", "dmgD", "dmgR"], "wins");
        this.uiPlayerManager = new UIPlayerManager_CL(phaserGame, thGame);
        this.uiChat = new UIGameChat_CL(phaserGame, thGame);
        this.thGame.onGameFinish.add(this.uiPlayerManager.updateAllBars, this.uiPlayerManager);
        
        this.centerGrp = new Phaser.Group(phaserGame);
        this.centerGrp.fixedToCamera = true;
        this.centerGrp.cameraOffset.setTo(phaserGame.camera.view.halfWidth, 0);

        // Win count text
        let txt = this.game.add.text(0, 0, `Win ${this.thGame.winCount} rounds first!`);
        txt.fontSize = 20;
        txt.fixedToCamera = true;
        txt.cameraOffset.setTo(10, 160);
        txt.font = "Orbitron";
        txt.strokeThickness = 3;
        txt.stroke = "black";
        txt.fill = "green";

        this.initialize();
    }

    initialize() {
        this.thGame.onGameFinish.add(this.gameFinish, this);
        this.thGame.onGameStart.add(this.gameStart, this);
    }

    gameStart(packet: PacketGameStart) {
        this.centerGrp.add(this.uiCountDown.startNew(packet.countDown, 0, 250, 100));
    }

    gameFinish(packet: PacketGameFinish) {
        let winner = this.thGame.playerGroup.getPlayer(packet.winnerID);
        
        if (winner) {
            winner.stats.wins++;
        }

        if (packet.subgame) {
            
            if (!TH.effects.should()) return;
            let winner = this.thGame.playerGroup.getPlayer(packet.winnerID);
            
            if (packet.winnerID == this.thGame.playerGroup.me.id) {
                // That is a small victory!
               this.centerGrp.add(TextMaker_CL.goTextBig("+1 win!", 0, 420));
            }

            this.centerGrp.add(this.uiCountDown.startNew(packet.nextDelay, 0, 250, 100));

        } else {

            // This is actually end of the game
            // Create overlay in the center
            let overlaySpr: Phaser.Sprite = this.centerGrp.create(0, 0, "blackRect");
            overlaySpr.alpha = 0.5;
            overlaySpr.height = this.game.camera.view.height;
            overlaySpr.width = this.game.camera.view.width * 0.8;
            overlaySpr.anchor.setTo(0.5, 0);

            if (packet.winnerID == this.thGame.playerGroup.me.id) {
                // I have won!
                this.centerGrp.add(TextMaker_CL.winText(0, 150));
                this.game.time.events.add(600, function() { TH.effects.playAudio(SoundNames.VICTORY); }, this); 
            } else {
                // I have lost!
                this.centerGrp.add(TextMaker_CL.defText(0, 150));
                this.game.time.events.add(600, function() { TH.effects.playAudio(SoundNames.LOSS); }, this); 
            }

            this.addMainMenuButton(1500);

            this.uiStats.show();
            
        }
        this.uiLadder.update();

    }

    private addMainMenuButton(delay: number) {
        let btn = this.game.make.button(0, 280, "panels", this.mainMenuCallback, this, 0, 1);
        let game = this.game;
        this.centerGrp.add(btn);
		btn.scale.setTo(0);
        btn.anchor.setTo(0.5);
        
        let btnText = TH.game.make.text(0, 0, "Back to menu");
        btnText.anchor.setTo(0.5); 
        btn.addChild(btnText);
        btn.onOverSound = TH.effects.getSound(SoundNames.CLICK);
		btn.onOverSoundMarker = SoundNames.CLICK;
        
        // Animate button after a delay;;;;;;;;
        this.game.time.events.add(delay, function() {
            game.add.tween(btn.scale).to({ x: 1.2, y: 1 }, 500, Phaser.Easing.Default, true);
        }, this);
    }

    private mainMenuCallback() {
        // Return back to menu
        this.uiStats.hide();
        console.log("Menu clicked!");
        this.game.state.start("menu");
    }
}