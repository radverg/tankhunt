

class UITeamFight_CL {

    private game: Phaser.Game;
    private thGame: TeamFight_CL;

    private centerGrp: Phaser.Group;

    private uiStats: UIStatsTable_CL;
    private uiNotification: UINotification_CL;
    private uiChat: UIGameChat_CL;
    private uiPlayerManager: UIPlayerManager_CL;

    private capBarMe: Phaser.Group;
    private capBarEnemy: Phaser.Group;
    private capSquareGrpMe: Phaser.Group;
    private capSquareGrpEnemy: Phaser.Group;

    constructor(phaserGame: Phaser.Game, thGame: TeamFight_CL) {
        this.game = phaserGame;
        this.thGame = thGame;

        this.centerGrp = new Phaser.Group(phaserGame);
        this.centerGrp.fixedToCamera = true;
        this.centerGrp.cameraOffset.setTo(phaserGame.camera.view.halfWidth, 0);

        this.uiStats = new UIStatsTable_CL(thGame, ["kills", "deaths", "suic", "blockC", "dmgD", "dmgR", "caps"], "kills");
        this.thGame.onCapture.add(this.uiStats.refresh, this.uiStats);

        this.uiChat = new UIGameChat_CL(phaserGame, thGame);
        this.uiNotification = new UINotification_CL(phaserGame, thGame);
        this.uiNotification.displayInRow = false;
        this.uiPlayerManager = new UIPlayerManager_CL(phaserGame, thGame);

        this.thGame.onGameFinish.add(this.gameFinish, this);
        this.thGame.onCapture.add(this.captureCallback, this);
        thGame.onGameStart.addOnce(this.init, this);


        this.capBarMe = new Phaser.Group(phaserGame);
        this.capBarEnemy = new Phaser.Group(phaserGame);

        this.capBarMe.fixedToCamera = true;
        this.capBarEnemy.fixedToCamera = true;

        

    }

    init(packet: PacketTeamGameStart) {
        this.capBarMe.cameraOffset.setTo(200, 10);
        let text = this.game.make.text(-180, 5, "Our caps:");
        this.capBarMe.add(text);

        this.capBarEnemy.cameraOffset.setTo(200, 80);
        let text2 = this.game.make.text(-180, 5, "Enemy caps:");
        this.capBarEnemy.add(text2);
       
        // Capbar background
        let capBarWidth = 400;
        let capBarHeight = 40;
        let padding = 5;
        let capCount = packet.caps.length / 2;

        let bg: Phaser.Sprite = this.capBarMe.create(0, 0, "blackRect");
        bg.width = capBarWidth;
        bg.height = capBarHeight;

        bg = this.capBarEnemy.create(0, 0, "blackRect");
        bg.width = capBarWidth;
        bg.height = capBarHeight;

        // Now squares
        this.capSquareGrpMe = new Phaser.Group(this.game, this.capBarMe);
        this.capSquareGrpEnemy = new Phaser.Group(this.game, this.capBarEnemy);
       

        let sqrWidth = capBarWidth / capCount - padding;
        let sqrHeight = capBarHeight - padding * 2;

        for (let i = 0; i < capCount; i++) {
            let capSqr: Phaser.Sprite = this.capSquareGrpMe.create(i * sqrWidth + (i+1) * padding, padding, "whiteRect");
            capSqr.width = sqrWidth;
            capSqr.height = sqrHeight;

            capSqr = this.capSquareGrpEnemy.create(i * sqrWidth + (i+1) * padding, padding, "whiteRect");
            capSqr.width = sqrWidth;
            capSqr.height = sqrHeight;
            
        }
    }

    gameFinish(packet: PacketGameFinish) {
        let win: boolean = (packet.winnerTeam == this.thGame.playerGroup.me.team);

        let overlaySpr: Phaser.Sprite = this.centerGrp.create(0, 0, "blackRect");
            overlaySpr.alpha = 0.5;
            overlaySpr.height = this.game.camera.view.height;
            overlaySpr.width = this.game.camera.view.width * 0.65;
            overlaySpr.anchor.setTo(0.5, 0);

            if (win) {
                // I have won!
                this.centerGrp.add(TextMaker_CL.winText(0, 30));
            } else {
                // I have lost!
                this.centerGrp.add(TextMaker_CL.defText( 0, 30));

            }

            this.addMainMenuButton(1500);

            this.uiStats.show();
    }

    private addMainMenuButton(delay: number) {
        let btn = this.game.make.button(0, 150, "panels", this.mainMenuCallback, this, 0, 1);
        let game = this.game;
        this.centerGrp.add(btn);
		btn.scale.setTo(0);
        btn.anchor.setTo(0.5);
        
        let btnText = TH.game.make.text(0, 0, "Back to menu");
        btnText.anchor.setTo(0.5); 
        btn.addChild(btnText);
        
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

    private captureCallback(packet: PacketCapture) {
        if (packet.fin) {
            let ourCap = packet.tm === this.thGame.playerGroup.me.team;
            let grp = (ourCap) ? this.capSquareGrpMe : this.capSquareGrpEnemy;
            let color = (ourCap) ? 0xff00000 : 0x00ff00;
            let index = (ourCap) ? this.thGame.allyCapturedCount - 1 : this.thGame.enemyCapturedCount - 1;
            let sqr: Phaser.Sprite = grp.getChildAt(index) as Phaser.Sprite;
            sqr.tint = color;

            // Some notification
        }
    }
}