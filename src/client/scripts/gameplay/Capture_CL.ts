class Capture_CL extends Phaser.Group {

    team: number;
    private myTeam: number;

    private isOurs: boolean;

    id: string;
    private capTime: number;

    private capBarB: Phaser.Sprite;
    private capBarF: Phaser.Sprite;
    private flag: Phaser.Sprite;

    private growTween: Phaser.Tween;

    constructor(sqrX: number, sqrY: number, sqrSize: number, team: number, myTeam: number, capTime: number, game: Phaser.Game) {
        super(game, null);

        this.x = sqrX * sqrSize + sqrSize / 2;
        this.y = sqrY * sqrSize + sqrSize / 2;

        this.flag = this.create(0, 0, "whiteRect");

        this.isOurs = (myTeam === team);
        this.flag.tint = this.isOurs ? 0x00ff00 : 0xff0000;
        this.flag.anchor.setTo(0.5);
        this.team = team;
        this.capTime = capTime;
        this.id = `a${sqrX}|${sqrY}`;

        this.flag.width = sqrSize * 0.4;
        this.flag.height = sqrSize * 0.4;
        this.flag.alpha = 0.1;

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

        // this.growTween = game.add.tween(this.capBarF.scale);
        
    }

    startCapturing() {
        this.cancelCapturing();
        this.growTween = this.game.add.tween(this.capBarF).to({ width: this.capBarB.width }, this.capTime, Phaser.Easing.Default, true );
        
    }

    cancelCapturing() {
        if (this.growTween && this.growTween.isRunning) {
            this.growTween.stop();
        }

        this.capBarF.width = 0;

    }

    /**
     * Destroys this capture flag with an effect
     */
    fadeOut() {
        this.capBarB.destroy();
        this.capBarF.destroy();

        let twn = this.game.add.tween(this.flag).to({ y: this.flag.y - 100, alpha: 0 }, 400);
        twn.onComplete.add(function() { this.destroy(); }, this);
        twn.start();
    }

    
}