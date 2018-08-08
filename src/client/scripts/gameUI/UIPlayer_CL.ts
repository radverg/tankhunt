

class UIPlayer_CL extends Phaser.Group {

    private thGame: THGame_CL;
    private player: Player_CL;
    
    private healthBar: Phaser.Sprite;
    private healthBarBackground: Phaser.Sprite;

    private nick: Phaser.Text;

    constructor(phaserGame: Phaser.Game, thGame: THGame_CL, player: Player_CL) {
        super(phaserGame);

        this.thGame = thGame;
        this.player = player;
        this.player.plView = this;
        
        // Create nick
        let offsetY = -this.player.tank.height;
        this.nick = this.game.make.text(0, offsetY, this.player.name);
        this.nick.font = "Orbitron";
        this.nick.fontSize = TH.sizeCoeff * 0.3;
        this.nick.alpha = 0.6;
        this.nick.anchor.setTo(0.5);
        this.add(this.nick);

        // Create health bar
        let barThickness = 6;

        this.healthBarBackground = this.create(0, offsetY + barThickness * 2, "blackRect");
        this.healthBarBackground.anchor.setTo(0.5);
        this.healthBarBackground.width = 150;
        this.healthBarBackground.height = barThickness;

        this.healthBar = this.create(-this.healthBarBackground.width / 2, this.healthBarBackground.y, "whiteRect");
        this.healthBar.anchor.setTo(0, 0.5);
        this.healthBar.width = this.healthBarBackground.width;
        this.healthBar.height = this.healthBarBackground.height;
        this.healthBar.tint = 0x1eaf05;

        this.updateHealthBar();
    }

    updateHealthBar() {
        let healthRatio = this.player.tank.health / this.player.tank.maxHealth;
        this.healthBar.width = this.healthBarBackground.width * healthRatio;
    }


    healthChange(healthBef: number, healthAft:number) {
        this.updateHealthBar();
        let healthDiff = healthAft - healthBef;

        let text = (healthDiff < 0) ? `${healthDiff} hp` : `+${healthDiff.toFixed(0)} hp`;
        let color = (healthDiff < 0) ? "#e02626" : "#139607"; 

        this.add(TextMaker_CL.goUpText(text, this.player.tank.width / 2 + 10, 0, color));
    }

    blockSign() {
        this.add(TextMaker_CL.goUpText("blocked", this.player.tank.width / 2 + 10, 0, "white"));
    }


}