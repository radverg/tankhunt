class Capture_CL extends Phaser.Group {

    public team: number;
    private myTeam: number;

    private isOurs: boolean;

    public id: string;
    private capTime: number;

    private capBarB: Phaser.Sprite;
    private capBarF: Phaser.Sprite;
    private flag: Phaser.Sprite;

    private growTween: Phaser.Tween;

    constructor(sqrX: number, sqrY: number, sqrSize: number, team: number, myTeam: number, capTime: number, game: Phaser.Game) {
        super(game, null);

        this.isOurs = (myTeam === team);

        this.x = sqrX * sqrSize + sqrSize / 2;
        this.y = sqrY * sqrSize + sqrSize / 2;

        this.flag = this.create(0, 0, (this.isOurs) ? "flagGreen" : "flagRed");

        this.flag.anchor.setTo(0.5);
        this.flag.scale.setTo(0.8);
        this.team = team;
        this.capTime = capTime;
        this.id = `a${sqrX}|${sqrY}`;

        let flagAnim = this.flag.animations.add("allFrames", null, 40, true);
        this.flag.animations.play("allFrames", 50, true);
        flagAnim.frame = Math.floor(Math.random() * flagAnim.frameTotal);

        let barWidth = sqrSize * 0.8;
        let barHeight = 5;
        let barYOffset = -sqrSize * 0.4;

        this.capBarB = this.create(0, barYOffset, "blackRect");

        this.capBarB.anchor.setTo(0.5);
        this.capBarB.width = barWidth;
        this.capBarB.height = barHeight;

        this.capBarF = this.create(-this.capBarB.width / 2, barYOffset, "whiteRect");

        this.capBarF.anchor.setTo(0, 0.5);
        this.capBarF.width = 0;
        this.capBarF.height = this.capBarB.height;
        this.capBarF.tint = (!this.isOurs) ? 0x00ff00: 0xff0000;
    }

    startCapturing() {

        this.cancelCapturing();
        this.growTween = this.game.add.tween(this.capBarF).to({ width: this.capBarB.width }, this.capTime, Phaser.Easing.Default, true );   
    }

    /**
     * Stops capturing and resets bar to initial position
     */
    cancelCapturing() {

        if (this.growTween && this.growTween.isRunning) {
            this.growTween.stop();
        }

        this.capBarF.width = 0;
    }

    /**
     * Destroys this capture flag with a fade out effect
     */
    fadeOut() {
        this.capBarB.destroy();
        this.capBarF.destroy();

        let twn = this.game.add.tween(this.flag).to({ y: this.flag.y - 100, alpha: 0 }, 400);
        twn.onComplete.add(function() { this.destroy(); }, this);
        twn.start();
    }
}