class UITeamFight_CL {

    private game: Phaser.Game;
    private thGame: TeamFight_CL;

    private centerGrp: Phaser.Group;

    // Other UI references -------------------------------
    private uiStats: UIStatsTable_CL;
    private uiNotification: UITeamNotification_CL;
    private uiChat: UIGameChat_CL;
    private uiPlayerManager: UIPlayerManager_CL;
    // ---------------------------------------------------

    private team1List: Phaser.Group;
    private team2List: Phaser.Group;

    private capBarMe: Phaser.Group;
    private capBarEnemy: Phaser.Group;
    private capSquareGrpMe: Phaser.Group;
    private capSquareGrpEnemy: Phaser.Group;

    private countDownText: Phaser.Text;
    private countDownTimer: Phaser.Timer;

    constructor(phaserGame: Phaser.Game, thGame: TeamFight_CL) {

        this.game = phaserGame;
        this.thGame = thGame;

        this.capBarMe = new Phaser.Group(phaserGame);
        this.capBarEnemy = new Phaser.Group(phaserGame);

        this.uiStats = new UIStatsTable_CL(thGame, ["kills", "deaths", "suic", "blockC", "dmgD", "dmgR", "caps"], "dmgD");
        this.thGame.onCapture.add(this.uiStats.refresh, this.uiStats);

        this.uiChat = new UIGameChat_CL(phaserGame, thGame);
        this.uiNotification = new UITeamNotification_CL(phaserGame, thGame);
        this.uiNotification.displayInRow = false;
        this.uiPlayerManager = new UIPlayerManager_CL(phaserGame, thGame);

        this.thGame.onGameFinish.add(this.gameFinish, this);
        this.thGame.onCapture.add(this.captureCallback, this);
        this.thGame.onHit.add(this.hitCallback, this);
        thGame.onGameStart.addOnce(this.init, this);

        this.team1List = new Phaser.Group(phaserGame);
        this.team2List = new Phaser.Group(phaserGame);

        this.capBarMe.fixedToCamera = true;
        this.capBarEnemy.fixedToCamera = true;

        this.centerGrp = new Phaser.Group(phaserGame);
        this.centerGrp.fixedToCamera = true;
        this.centerGrp.cameraOffset.setTo(phaserGame.camera.view.halfWidth, 0);

        this.thGame.onPlayerRemove.add(this.playerRemove, this);
    }

    init(packet: PacketTeamGameStart) {

        this.capBarMe.cameraOffset.setTo(850, 10);
        let text = this.game.make.text(-180, 5, "Our caps:");
        this.capBarMe.add(text);

        this.capBarEnemy.cameraOffset.setTo(850, 50);
        let text2 = this.game.make.text(-180, 5, "Enemy caps:");
        this.capBarEnemy.add(text2);
       
        // Capbar background
        let capBarWidth = 400;
        let capBarHeight = 40;
        let padding = 5;
        let capCount = packet.caps.length / 2;

        let bg: Phaser.Sprite = this.capBarMe.create(0, 0, "blackRect");
        bg.width = capBarWidth + padding;
        bg.height = capBarHeight;

        bg = this.capBarEnemy.create(0, 0, "blackRect");
        bg.width = capBarWidth + padding;
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

        this.generatePlayerList();
    }

    gameFinish(packet: PacketGameFinish) {

        let win: boolean = (packet.winnerTeam == this.thGame.playerGroup.me.team);

        (this.centerGrp.parent as Phaser.Group).bringToTop(this.centerGrp);

        let overlaySpr: Phaser.Sprite = this.centerGrp.create(0, 0, "blackRect");
        overlaySpr.alpha = 0.8;
        overlaySpr.height = this.game.camera.view.height;
        overlaySpr.width = this.game.camera.view.width * 0.8;
        overlaySpr.anchor.setTo(0.5, 0);

        if (win) {
            // I have won!
            this.centerGrp.add(TextMaker_CL.winText(0, 70));
            this.game.time.events.add(600, function() { TH.effects.playAudio(SoundNames.VICTORY); }, this); 
        } else {
            // I have lost!
            this.centerGrp.add(TextMaker_CL.defText( 0, 70));
            this.game.time.events.add(600, function() { TH.effects.playAudio(SoundNames.LOSS); }, this); 
        }

        this.addMainMenuButton(1500);
        this.uiStats.show();
    }

    private generatePlayerList() {

        let plrs = this.thGame.playerGroup.players;
        let sizeY = 50;
        let sizeX = 180;

        this.team1List.fixedToCamera = true;
        this.team1List.cameraOffset.setTo(0);

        this.team2List.fixedToCamera = true;
        this.team2List.cameraOffset.setTo(this.game.camera.view.width - sizeX, 0);

        for (const key in plrs) {
            let plr = plrs[key];
            let cont = (plr.team == 1) ? this.team1List : this.team2List;

            let grp = new Phaser.Group(this.game, cont);
            grp.name = key;
            grp.y = sizeY * (cont.children.length - 1);
            let bg = grp.create(0, 0, "whiteRect");
            bg.height = sizeY;
            bg.width = sizeX;
            bg.tint = (plr.me) ? 0x000777 : (plr.team == this.thGame.playerGroup.me.team) ? 0x1c7000 : 0x720000;
            let text = this.game.make.text(10, 0, plr.name);
            text.fill = "white";
            grp.add(text);

            // Strip
            let bgStrip = grp.create(0, sizeY, "blackRect");
            bgStrip.height = 10;
            bgStrip.width = sizeX;
            bgStrip.anchor.y = 1;
            let fgStrip = grp.create(0, sizeY - 3, "whiteRect");
            fgStrip.height = 7;
            fgStrip.width = sizeX;
            fgStrip.anchor.y = 1;
        }
    }

    private addMainMenuButton(delay: number) {

        let btn = this.game.make.button(0, 190, "panels", this.mainMenuCallback, this, 0, 1);
        let game = this.game;
        this.centerGrp.add(btn);
		btn.scale.setTo(0);
        btn.anchor.setTo(0.5);
        
        let btnText = TH.game.make.text(0, 0, "Back to menu");
        btnText.anchor.setTo(0.5); 
        btn.addChild(btnText);
        btn.onOverSound = TH.effects.getSound(SoundNames.CLICK);
		btn.onOverSoundMarker = SoundNames.CLICK;
        
        // Animate button after a delay
        this.game.time.events.add(delay, function() {
            game.add.tween(btn.scale).to({ x: 1.2, y: 1 }, 500, Phaser.Easing.Default, true);
        }, this);
    }

    private hitCallback(packet: PacketShotHit) {

        let pl = this.thGame.playerGroup.getPlayer(packet.plID);
        if (!pl) return;

        if (packet.healthAft <= 0) {
            // Somebody died, find his ui strip
            let searchGrp = (pl.team == 1) ? this.team1List : this.team2List;
            let stripGrp: Phaser.Group = searchGrp.filter((child: Phaser.Group) => { return child.name === pl.id }).first;
            let barF = stripGrp.getChildAt(3) as Phaser.Sprite;
            let barB = stripGrp.getChildAt(2) as Phaser.Sprite;
            barF.width = 0;
            this.game.add.tween(barF).to( { width: barB.width }, packet.resTime, Phaser.Easing.Default, true);
        }   
    }

    private playerRemove(player: Player_CL) {

        if (player.me) return;

        let searchGrp = (player.team == 1) ? this.team1List : this.team2List;
        let item: Phaser.Group = searchGrp.filter((child: Phaser.Group) => { return child.name === player.id }).first;
        item.alpha = 0.2;
    }

    private mainMenuCallback() {
        // Return back to menu
        this.uiStats.hide();
        this.game.state.start("menu");
    }

    private captureCallback(packet: PacketCapture) {

        if (packet.fin) {
            let ourCap = packet.tm === this.thGame.playerGroup.me.team;
            let grp = (ourCap) ? this.capSquareGrpMe : this.capSquareGrpEnemy;
            let color = (ourCap) ? 0x720000 : 0x1c7000;
            let index = (ourCap) ? this.thGame.allyCapturedCount - 1 : this.thGame.enemyCapturedCount - 1;
            let sqr: Phaser.Sprite = grp.getChildAt(index) as Phaser.Sprite;
            sqr.tint = color;

            // Some notification
            if (!ourCap) {
                TH.effects.playAudio(SoundNames.TADA);
            }
        }

        if (packet.st) {
            TH.effects.playAudio(SoundNames.BIM);
        }
    }
}