

class UIPlayer_CL extends Phaser.Group {

    private thGame: THGame_CL;
    private player: Player_CL;
    
    private healthBar: HealthBar_CL;
    private healthBarBackground: Phaser.Sprite;

    private itemIcon: Phaser.Sprite;

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
        this.nick.fontSize = 25;
        this.nick.alpha = 0.6;
        this.nick.anchor.setTo(0.5);
        this.add(this.nick);

        // Create health bar
        this.healthBar = new HealthBar_CL(this, offsetY + 25);
        this.updateHealthBar();

        // Create item icon
        this.itemIcon = this.create(0, offsetY - 35, "items");
        this.itemIcon.scale.setTo(0.6);
        this.itemIcon.anchor.setTo(0.5);
        this.itemIcon.alpha = 0.8;
        this.itemIcon.kill();
    }

    updateHealthBar() {
        this.healthBar.updateHealthBar(this.player.tank.maxHealth, this.player.tank.health);
    }


    healthChange(healthBef: number, healthAft:number) {
        this.updateHealthBar();
        let healthDiff = healthAft - healthBef;

        let text = (healthDiff < 0) ? `${healthDiff} hp` : `+${healthDiff.toFixed(0)} hp`;
        let color = (healthDiff < 0) ? "#e02626" : "#139607"; 

        if (!TH.effects.should()) return;

        this.add(TextMaker_CL.goUpText(text, this.player.tank.width / 2 + 10, 0, color));
    }

    blockSign() {
        if (!TH.effects.should()) return;        

        this.add(TextMaker_CL.goUpText("blocked", this.player.tank.width / 2 + 10, 0, "white"));
    }

    showItemIcon(frame: number) {
        this.itemIcon.revive();
        this.itemIcon.frame = frame;

    }

    hideItemIcon() {
        this.itemIcon.kill();
    }


}