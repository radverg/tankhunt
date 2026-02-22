var UIDuel_CL = (function () {
    function UIDuel_CL(phaserGame, thGame) {
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
        var txt = this.game.add.text(0, 0, "Win ".concat(this.thGame.winCount, " rounds first!"));
        txt.fontSize = 20;
        txt.fixedToCamera = true;
        txt.cameraOffset.setTo(10, 160);
        txt.font = "Orbitron";
        txt.strokeThickness = 3;
        txt.stroke = "black";
        txt.fill = "green";
        this.initialize();
    }
    UIDuel_CL.prototype.initialize = function () {
        this.thGame.onGameFinish.add(this.gameFinish, this);
        this.thGame.onGameStart.add(this.gameStart, this);
    };
    UIDuel_CL.prototype.gameStart = function (packet) {
        this.centerGrp.add(this.uiCountDown.startNew(packet.countDown, 0, 250, 100));
    };
    UIDuel_CL.prototype.gameFinish = function (packet) {
        var winner = this.thGame.playerGroup.getPlayer(packet.winnerID);
        if (winner) {
            winner.stats.wins++;
        }
        if (packet.subgame) {
            if (!TH.effects.should())
                return;
            var winner_1 = this.thGame.playerGroup.getPlayer(packet.winnerID);
            if (packet.winnerID == this.thGame.playerGroup.me.id) {
                this.centerGrp.add(TextMaker_CL.goTextBig("+1 win!", 0, 420));
            }
            this.centerGrp.add(this.uiCountDown.startNew(packet.nextDelay, 0, 250, 100));
        }
        else {
            this.centerGrp.parent.bringToTop(this.centerGrp);
            var overlaySpr = this.centerGrp.create(0, 0, "blackRect");
            overlaySpr.alpha = 0.5;
            overlaySpr.height = this.game.camera.view.height;
            overlaySpr.width = this.game.camera.view.width * 0.8;
            overlaySpr.anchor.setTo(0.5, 0);
            if (packet.winnerID == this.thGame.playerGroup.me.id) {
                this.centerGrp.add(TextMaker_CL.winText(0, 150));
                this.game.time.events.add(600, function () { TH.effects.playAudio(SoundNames.VICTORY); }, this);
            }
            else {
                this.centerGrp.add(TextMaker_CL.defText(0, 150));
                this.game.time.events.add(600, function () { TH.effects.playAudio(SoundNames.LOSS); }, this);
            }
            this.addMainMenuButton(1500);
            this.uiStats.show();
        }
        this.uiLadder.update();
    };
    UIDuel_CL.prototype.addMainMenuButton = function (delay) {
        var btn = this.game.make.button(0, 280, "panels", this.mainMenuCallback, this, 0, 1);
        var game = this.game;
        this.centerGrp.add(btn);
        btn.scale.setTo(0);
        btn.anchor.setTo(0.5);
        var btnText = TH.game.make.text(0, 0, "Back to menu");
        btnText.anchor.setTo(0.5);
        btn.addChild(btnText);
        btn.onOverSound = TH.effects.getSound(SoundNames.CLICK);
        btn.onOverSoundMarker = SoundNames.CLICK;
        this.game.time.events.add(delay, function () {
            game.add.tween(btn.scale).to({ x: 1.2, y: 1 }, 500, Phaser.Easing.Default, true);
        }, this);
    };
    UIDuel_CL.prototype.mainMenuCallback = function () {
        this.uiStats.hide();
        this.game.state.start("menu");
    };
    return UIDuel_CL;
}());
