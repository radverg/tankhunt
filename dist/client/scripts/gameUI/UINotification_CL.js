var UINotification_CL = (function () {
    function UINotification_CL(game, thGame) {
        this.displayInRow = true;
        this.game = game;
        this.thGame = thGame;
        this.topGroup = new Phaser.Group(this.game);
        this.topGroup.fixedToCamera = true;
        this.topGroup.cameraOffset.x = this.game.camera.view.width / 2;
        this.topGroup.cameraOffset.y = 100;
        this.logGroup = new Phaser.Group(game);
        this.logGroup.fixedToCamera = true;
        this.logGroup.cameraOffset.setTo(20, this.game.camera.view.height - 50);
        this.initialize();
    }
    UINotification_CL.prototype.initialize = function () {
        this.thGame.onHit.add(this.playerHit, this);
        this.thGame.onPlayerRemove.add(function (player) { this.logText("Player ".concat(player.name, " has left the game!")); }, this);
        this.thGame.onNewPlayerConnected.add(function (player) { this.logText("Player ".concat(player.name, " has joined the game!")); }, this);
    };
    UINotification_CL.prototype.playerHit = function (packet, player) {
        if (!TH.effects.should())
            return;
        var attacker = this.thGame.playerGroup.getPlayer(packet.plAttID);
        if (packet.healthAft === 0) {
            var notifYPos = this.topGroup.children.length * 50;
            if (this.thGame.playerGroup.me === player) {
                if (player === attacker)
                    this.topGroup.add(TextMaker_CL.goTextBig("You killed yourself!", 0, notifYPos, false, "#e51414"));
                else
                    this.topGroup.add(TextMaker_CL.goTextBig("You've been killed by ".concat(attacker.name, "!"), 0, notifYPos, false, "#e51414"));
            }
            else if (attacker === this.thGame.playerGroup.me) {
                this.topGroup.add(TextMaker_CL.goTextBig("Enemy ".concat(player.name, " killed!"), 0, notifYPos));
                if (this.displayInRow) {
                    this.topGroup.add(TextMaker_CL.goTextBig("".concat(attacker.stats.inRow, " in a row!"), 0, notifYPos + 50, true, "lightblue"));
                    var soundName_1 = null;
                    if (attacker.stats.inRow === 5)
                        soundName_1 = SoundNames.FIVE;
                    else if (attacker.stats.inRow === 10)
                        soundName_1 = SoundNames.TEN;
                    else if (attacker.stats.inRow === 15)
                        soundName_1 = SoundNames.FIFTEEN;
                    else if (attacker.stats.inRow === 20)
                        soundName_1 = SoundNames.TWENTY;
                    if (soundName_1) {
                        TH.game.time.events.add(700, function () { TH.effects.playAudio(soundName_1); });
                    }
                }
            }
            var logText = (attacker === player && this.thGame.playerGroup.me === player) ?
                "Player ".concat(attacker.name, " killed himself!") :
                "Player ".concat(attacker.name, " killed ").concat(player.name, "!");
            this.logText(logText);
        }
    };
    UINotification_CL.prototype.logText = function (text) {
        this.logGroup.subAll("y", 30, false, false);
        this.logGroup.add(TextMaker_CL.log(text));
    };
    return UINotification_CL;
}());
