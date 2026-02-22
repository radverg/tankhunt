var UICountdown_CL = (function () {
    function UICountdown_CL(game) {
        this.game = game;
    }
    UICountdown_CL.prototype.startNew = function (milisec, x, y, size, milisecStep) {
        if (size === void 0) { size = 20; }
        if (milisecStep === void 0) { milisecStep = 500; }
        var current = Math.ceil(milisec / milisecStep);
        var game = this.game;
        var cdText = this.game.make.text(x, y, current.toString(), { font: "Orbitron", fontSize: size * 4 });
        cdText.setShadow(0, 0, "black", 10);
        cdText.strokeThickness = 2;
        cdText.stroke = "white";
        cdText.anchor.setTo(0.5);
        var timer = this.game.time.create(false);
        TH.effects.playAudio(SoundNames.TICK);
        timer.loop(milisecStep, function () {
            current--;
            if (current == -1) {
                timer.stop(true);
                timer.destroy();
                cdText.destroy();
                return;
            }
            cdText.text = current.toString();
            if (current == 0) {
                cdText.text = "GO!";
                TH.effects.playAudio(SoundNames.TICKMEGA);
            }
            else {
                TH.effects.playAudio(SoundNames.TICK);
            }
            cdText.scale.set(1);
            var twn = game.add.tween(this.scale).to({ x: 0.25, y: 0.25 }, milisecStep / 1.5, Phaser.Easing.Default);
            twn.start();
        }, cdText);
        timer.start();
        return cdText;
    };
    return UICountdown_CL;
}());
