class EffectManager {

    private game: Phaser.Game;
    private effectGroup: Phaser.Group;

    constructor(game: Phaser.Game) {
        this.game = game;
        this.effectGroup = game.world;
    }

    /**
     * Creates a smoke effect at given coordinates
     * @param x 
     * @param y 
     * @param scale optional - default 1
     */
    smokeEffect(x: number, y: number, scale: number = 1) {

        let smokeSpr: Phaser.Sprite = this.game.add.sprite(x, y, "smoke");
        smokeSpr.anchor.setTo(0.5);
        smokeSpr.scale.setTo(scale);

        let smokeAnim = smokeSpr.animations.add("smokeAnim", null, 42);
        smokeAnim.onComplete.add(function() { this.destroy(); }, smokeSpr);
        smokeAnim.play();
    
    }

    shotDebrisEffect(x: number,  y: number) {

        if (!x || !y) {
            return;
        }
        let debrisCount = Math.floor(Math.random() * 5) + 4;
        let duration = 300;

        for (let i = 0; i < debrisCount; i++) {
            
            let ang = Math.random() * Math.PI * 2;
            let dist = Math.random() * TH.sizeCoeff * 2;

            let pos = {x:  x + Math.sin(ang) * dist, y: y - Math.cos(ang) * dist };
            
            let debrisSpr: Phaser.Sprite = this.game.add.sprite(x, y, "blackRect");
            debrisSpr.anchor.setTo(0.5);
            debrisSpr.width = TH.sizeCoeff * 0.04;
            debrisSpr.height = TH.sizeCoeff * 0.2;
            debrisSpr.rotation = ang;

            let twn = this.game.add.tween(debrisSpr);
            twn.to({ x: pos.x, y: pos.y, alpha: 0 }, duration);
            twn.onComplete.add(function() { this.destroy(); }, debrisSpr);
            twn.start();
        }
    }
}