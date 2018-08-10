class HealthBar_CL {

    backgroundSpr: Phaser.Sprite;
    healthSpr: Phaser.Sprite;
    textRep: Phaser.Text;

    private group: Phaser.Group;

    constructor(group: Phaser.Group, offsetY: number, barThickness: number = 13) {
        this.group = group;
        // Create health bar
        this.backgroundSpr = group.create(0, offsetY, "blackRect");
        this.backgroundSpr.anchor.setTo(0.5);
        this.backgroundSpr.width = 180;
        this.backgroundSpr.height = barThickness;
        group.add(this.backgroundSpr);

        this.healthSpr = group.create(-this.backgroundSpr.width / 2, this.backgroundSpr.y, "whiteRect");
        this.healthSpr.anchor.setTo(0, 0.5);
        this.healthSpr.width = this.backgroundSpr.width;
        this.healthSpr.height = this.backgroundSpr.height * 0.7;
        this.healthSpr.tint = 0x1eaf05;
        group.add(this.healthSpr);

        // Create health text
        let text = group.game.make.text(0, offsetY, "undefined");
        text.fontSize = 13;
        text.fill = "white";
        this.textRep = text;
        text.anchor.setTo(0.5, 0.35);
        group.add(text);

    }

    


    updateHealthBar(maxHealth: number, health: number = maxHealth, maxMaxHealth?: number) {
        let healthRatio = health / maxHealth;

        let barColor = (maxMaxHealth) ? Color.Spectrum[Math.floor(Color.Spectrum.length * ((maxHealth - 0.0001) / maxMaxHealth))] : 
            Color.Spectrum[Math.floor(Color.Spectrum.length * (healthRatio - 0.00001))];

        this.healthSpr.tint = barColor;
        this.healthSpr.width = this.backgroundSpr.width * healthRatio;

        this.textRep.text = `${health.toFixed(0)} / ${maxHealth.toFixed(0)}`;
    }

}