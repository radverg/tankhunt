

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
        timer.loop(milisecStep, function() {

            current--;
            if (current == 0) {
                timer.stop(true);
                timer.destroy();
                cdText.destroy();
                return;
            }
            cdText.text = current.toString();
            cdText.scale.set(1);

            let twn = game.add.tween(this.scale).to({ x: 0.25, y: 0.25 }, milisecStep / 1.5, Phaser.Easing.Default);
           // let fadeTwn = game.add.tween(this).to({ alpha: 0 }, milisecStep - milisecStep / 1.5);
            //wn.chain(fadeTwn);
            twn.start();

        }, cdText);
        timer.start();

        return cdText;
    }
}