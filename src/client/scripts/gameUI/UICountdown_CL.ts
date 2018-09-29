class UICountdown_CL {

    private game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    startNew(milisec: number, x?: number, y?: number, size: number = 20, milisecStep: number = 500): Phaser.Text {
        let current = Math.ceil(milisec / milisecStep);
        let game = this.game;
    
        let cdText = this.game.make.text(x, y, current.toString(), { font: "Orbitron", fontSize: size * 4 });
        cdText.anchor.setTo(0.5);

        let timer = this.game.time.create(false);
        TH.effects.playAudio(SoundNames.TICK);

        timer.loop(milisecStep, function() {

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
            } else {
                TH.effects.playAudio(SoundNames.TICK);
            }

            cdText.scale.set(1);

            let twn = game.add.tween(this.scale).to({ x: 0.25, y: 0.25 }, milisecStep / 1.5, Phaser.Easing.Default);
            twn.start();

        }, cdText);
        timer.start();

        return cdText;
    }
}