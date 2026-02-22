var UITeamFight_CL = (function () {
    function UITeamFight_CL(phaserGame, thGame) {
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
    UITeamFight_CL.prototype.init = function (packet) {
        this.capBarMe.cameraOffset.setTo(850, 10);
        var text = this.game.make.text(-180, 5, "Our caps:");
        this.capBarMe.add(text);
        this.capBarEnemy.cameraOffset.setTo(850, 50);
        var text2 = this.game.make.text(-180, 5, "Enemy caps:");
        this.capBarEnemy.add(text2);
        var capBarWidth = 400;
        var capBarHeight = 40;
        var padding = 5;
        var capCount = packet.caps.length / 2;
        var bg = this.capBarMe.create(0, 0, "blackRect");
        bg.width = capBarWidth + padding;
        bg.height = capBarHeight;
        bg = this.capBarEnemy.create(0, 0, "blackRect");
        bg.width = capBarWidth + padding;
        bg.height = capBarHeight;
        this.capSquareGrpMe = new Phaser.Group(this.game, this.capBarMe);
        this.capSquareGrpEnemy = new Phaser.Group(this.game, this.capBarEnemy);
        var sqrWidth = capBarWidth / capCount - padding;
        var sqrHeight = capBarHeight - padding * 2;
        for (var i = 0; i < capCount; i++) {
            var capSqr = this.capSquareGrpMe.create(i * sqrWidth + (i + 1) * padding, padding, "whiteRect");
            capSqr.width = sqrWidth;
            capSqr.height = sqrHeight;
            capSqr = this.capSquareGrpEnemy.create(i * sqrWidth + (i + 1) * padding, padding, "whiteRect");
            capSqr.width = sqrWidth;
            capSqr.height = sqrHeight;
        }
        this.generatePlayerList();
    };
    UITeamFight_CL.prototype.gameFinish = function (packet) {
        var win = (packet.winnerTeam == this.thGame.playerGroup.me.team);
        this.centerGrp.parent.bringToTop(this.centerGrp);
        var overlaySpr = this.centerGrp.create(0, 0, "blackRect");
        overlaySpr.alpha = 0.8;
        overlaySpr.height = this.game.camera.view.height;
        overlaySpr.width = this.game.camera.view.width * 0.8;
        overlaySpr.anchor.setTo(0.5, 0);
        if (win) {
            this.centerGrp.add(TextMaker_CL.winText(0, 70));
            this.game.time.events.add(600, function () { TH.effects.playAudio(SoundNames.VICTORY); }, this);
        }
        else {
            this.centerGrp.add(TextMaker_CL.defText(0, 70));
            this.game.time.events.add(600, function () { TH.effects.playAudio(SoundNames.LOSS); }, this);
        }
        this.addMainMenuButton(1500);
        this.uiStats.show();
    };
    UITeamFight_CL.prototype.generatePlayerList = function () {
        var plrs = this.thGame.playerGroup.players;
        var sizeY = 50;
        var sizeX = 180;
        this.team1List.fixedToCamera = true;
        this.team1List.cameraOffset.setTo(0);
        this.team2List.fixedToCamera = true;
        this.team2List.cameraOffset.setTo(this.game.camera.view.width - sizeX, 0);
        for (var key in plrs) {
            var plr = plrs[key];
            var cont = (plr.team == 1) ? this.team1List : this.team2List;
            var grp = new Phaser.Group(this.game, cont);
            grp.name = key;
            grp.y = sizeY * (cont.children.length - 1);
            var bg = grp.create(0, 0, "whiteRect");
            bg.height = sizeY;
            bg.width = sizeX;
            bg.tint = (plr.me) ? 0x000777 : (plr.team == this.thGame.playerGroup.me.team) ? 0x1c7000 : 0x720000;
            var text = this.game.make.text(10, 0, plr.name);
            text.fill = "white";
            grp.add(text);
            var bgStrip = grp.create(0, sizeY, "blackRect");
            bgStrip.height = 10;
            bgStrip.width = sizeX;
            bgStrip.anchor.y = 1;
            var fgStrip = grp.create(0, sizeY - 3, "whiteRect");
            fgStrip.height = 7;
            fgStrip.width = sizeX;
            fgStrip.anchor.y = 1;
        }
    };
    UITeamFight_CL.prototype.addMainMenuButton = function (delay) {
        var btn = this.game.make.button(0, 190, "panels", this.mainMenuCallback, this, 0, 1);
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
    UITeamFight_CL.prototype.hitCallback = function (packet) {
        var pl = this.thGame.playerGroup.getPlayer(packet.plID);
        if (!pl)
            return;
        if (packet.healthAft <= 0) {
            var searchGrp = (pl.team == 1) ? this.team1List : this.team2List;
            var stripGrp = searchGrp.filter(function (child) { return child.name === pl.id; }).first;
            var barF = stripGrp.getChildAt(3);
            var barB = stripGrp.getChildAt(2);
            barF.width = 0;
            this.game.add.tween(barF).to({ width: barB.width }, packet.resTime, Phaser.Easing.Default, true);
        }
    };
    UITeamFight_CL.prototype.playerRemove = function (player) {
        if (player.me)
            return;
        var searchGrp = (player.team == 1) ? this.team1List : this.team2List;
        var item = searchGrp.filter(function (child) { return child.name === player.id; }).first;
        item.alpha = 0.2;
    };
    UITeamFight_CL.prototype.mainMenuCallback = function () {
        this.uiStats.hide();
        this.game.state.start("menu");
    };
    UITeamFight_CL.prototype.captureCallback = function (packet) {
        if (packet.fin) {
            var ourCap = packet.tm === this.thGame.playerGroup.me.team;
            var grp = (ourCap) ? this.capSquareGrpMe : this.capSquareGrpEnemy;
            var color = (ourCap) ? 0x720000 : 0x1c7000;
            var index = (ourCap) ? this.thGame.allyCapturedCount - 1 : this.thGame.enemyCapturedCount - 1;
            var sqr = grp.getChildAt(index);
            sqr.tint = color;
            if (!ourCap) {
                TH.effects.playAudio(SoundNames.TADA);
            }
        }
        if (packet.st) {
            TH.effects.playAudio(SoundNames.BIM);
        }
    };
    return UITeamFight_CL;
}());
