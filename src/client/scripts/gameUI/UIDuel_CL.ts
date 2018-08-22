class UIDuel_CL {
    private game: Phaser.Game;
    private thGame: THGame_CL;
    private uiLadder: UILadderDuel_CL;
    private uiCountDown: UICountdown_CL;
    private centerGrp: Phaser.Group;

    constructor(phaserGame: Phaser.Game, thGame: THGame_CL) {
        this.game = phaserGame;
        this.thGame = thGame;
        this.uiCountDown = new UICountdown_CL(TH.game);
        this.uiLadder = new UILadderDuel_CL(phaserGame, thGame);
        this.centerGrp = new Phaser.Group(phaserGame);
        this.centerGrp.fixedToCamera = true;
        this.centerGrp.cameraOffset.setTo(phaserGame.camera.view.halfWidth, 0);

        this.initialize();
    }

    initialize() {
        this.thGame.onGameFinish.add(this.gameFinish, this);
    }

    gameFinish(packet: PacketGameFinish) {
        let winner = this.thGame.playerGroup.getPlayer(packet.winnerID);
        
        if (winner) {
            winner.stats.wins++;
        }

        if (packet.subgame) {
            let winner = this.thGame.playerGroup.getPlayer(packet.winnerID);
            
            if (packet.winnerID == this.thGame.playerGroup.me.id) {
                // That is a small victory!
               this.centerGrp.add(TextMaker_CL.goTextBig("+1 win!", 0, 200));
            }

            this.centerGrp.add(this.uiCountDown.startNew(packet.nextDelay, 0, 100));

        } else {

            // This is actually end of the game
            if (packet.winnerID == this.thGame.playerGroup.me.id) {
                // I have won!
                this.centerGrp.add(TextMaker_CL.winText(0, 150));
            } else {
                // I have lost!
                this.centerGrp.add(TextMaker_CL.defText( 0, 150));

            }

            this.addMainMenuButton(1500);
            
        }
        this.uiLadder.update();

    }

    private addMainMenuButton(delay: number) {
        let btn = this.game.make.button(0, 200, "panels", this.mainMenuCallback, this, 0, 1);
        let game = this.game;
        this.centerGrp.add(btn);
		btn.scale.setTo(0);
        btn.anchor.setTo(0.5);
        
        let btnText = TH.game.make.text(0, 0, "Back to menu");
        btnText.anchor.setTo(0.5); 
        btn.addChild(btnText);
        
        // Animate button after a delay
        this.game.time.events.add(delay, function() {
            game.add.tween(btn.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Default, true);
        }, this);
    }

    private mainMenuCallback() {
        // Return back to menu
        console.log("Menu clicked!");
    }
}