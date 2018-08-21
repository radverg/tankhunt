

class UICountdown_CL {

    private game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    startNew(milisec: number, x?: number, y?: number, size: number = 20, milisecStep: number = 500) {
        let current = Math.ceil(milisec / milisecStep);
        let game = this.game;
    
        let cdText = this.game.add.text(x, y, current.toString(), { font: "Orbitron", fontSize: size });
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

            let twn = game.add.tween(this).from({ width: this.width * 2, height: this.height * 2 }, milisecStep / 2, Phaser.Easing.Exponential.In, true);

        }, cdText);
        timer.start();


    }
}