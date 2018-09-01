class EffectManager {

    private game: Phaser.Game;
    private effectGroup: Phaser.Group;

    constructor(game: Phaser.Game) {
        this.game = game;
        this.effectGroup = game.world;
    }

    playSound(name: string, volume: number = 1, atX?: number, atY?: number)  {
        let vol = volume;

        if (atX) {
            vol *= this.getVolumeCoeff(atX, atY);
        }

        if (vol == 0) {
            return;
        }
        
        this.game.sound.play(name, vol);


    }

    playLaser1(atX: number, atY: number) {
        this.playSound("laser1_sound", 0.8, atX, atY);
    }

    playLaser2(atX: number, atY: number) {
        this.playSound("laser2_sound", 0.8, atX, atY);
    }

    playLaser3(atX: number, atY: number) {
        this.playSound("laser3_sound", 0.8, atX, atY);
    }

    private getVolumeCoeff(x: number, y: number) {
        let cam = this.game.camera;
        let dist = TH.game.math.distance(cam.view.centerX, cam.view.centerY, x, y);
        if (cam.view.height / 2 > dist) 
            return 1;

        let coeff = (cam.view.height / 2) / (dist * 1.3);
        if (coeff < 0.03)
            coeff = 0;

        return coeff;
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

    wallDebrisEffect(x: number, y: number) {
       
        let debrisCount = 10;
        let duration = 400;

        for (let i = 0; i < debrisCount; i++) {
            
            let ang = Math.random() * Math.PI * 2;
            let dist = Math.random() * 90;

            let pos = {x:  x + Math.sin(ang) * dist, y: y - Math.cos(ang) * dist };
            
            let debrisSpr: Phaser.Sprite = this.game.add.sprite(x, y, "wallDebrisDarker");
            debrisSpr.anchor.setTo(0.5);
            debrisSpr.scale.setTo(0.6);
            debrisSpr.frame = i;
            debrisSpr.rotation = ang;

            let twn = this.game.add.tween(debrisSpr);
            twn.to({ x: pos.x, y: pos.y, alpha: 0, rotation: debrisSpr.rotation + (Math.PI * 2 * Math.random()) }, duration);
            twn.onComplete.add(function() { this.destroy(); }, debrisSpr);
            twn.start();
        }
    }

    shotDamageEffect(x: number, y: number) {
        if (!x || !y) {
            return;
        }

        let spr = this.game.add.sprite(x, y, "shotDamage");
        spr.anchor.setTo(0.5);
        spr.scale.setTo(0.7);

        let anim = spr.animations.add("burst", null, 60);
        anim.onComplete.add(function() { this.destroy(); }, spr);
        anim.play();
    }
}