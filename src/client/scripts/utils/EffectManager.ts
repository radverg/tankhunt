

class EffectManager {

    private game: Phaser.Game;
    private effectGroup: Phaser.Group;

    private audioSprite: Phaser.AudioSprite;    
    private pool: Pool_CL;
    constructor(game: Phaser.Game) {
        this.game = game;
        this.effectGroup = game.world;
    }

    initPool() {
        this.pool = new Pool_CL(this.game);

        for (let i = 0; i < 5; i++) {
            this.pool.createMultiple(1, `shotExplode${i + 1}`);
            this.pool.createMultiple(1, `explosion${i + 1}`);
        }

        this.pool.createMultiple(5, "shotDamage");

        this.pool.createMultiple(40, "wallDebrisDarker");
        this.pool.createMultiple(34, "tankParts");
    }

    getPool(): Pool_CL {
        return this.pool;
    }

    should(sourceSpr?: Phaser.Sprite, tolerance: number = 0) {

        if (!sourceSpr) return !TH.suspended;

        let badBounds = sourceSpr.getBounds();
        let cam = TH.game.camera;
        return !TH.suspended && cam.view.intersects(new Phaser.Rectangle(badBounds.x + cam.x, badBounds.y + cam.y, badBounds.width, badBounds.height), tolerance);
    }

    shouldByXY(x: number, y: number) {
        return !TH.suspended && TH.game.camera.view.contains(x, y);
    }

    playAudio(name: string, sourceSpr?: Phaser.Sprite, x?: number, y?: number) {

        if (!this.audioSprite || !this.audioSprite.get(name)) return;

        let volScale = 1;
        let vol = this.audioSprite.config.spritemap[name].volume || 1;

        if (sourceSpr) {
            volScale = this.getVolumeCoeff(sourceSpr.x, sourceSpr.y);
        } else if (x !== undefined && y !== undefined) {
            volScale = this.getVolumeCoeff(x, y);
        }

        if (volScale === 0) return;
        vol *= volScale;

        this.audioSprite.play(name, vol);
    }

    playAudioLooping(name: string) {
        let sound = this.audioSprite.get(name);

        if (sound) {
            sound.play(name, null, this.audioSprite.config.spritemap[name].volume || 1, true);
        }

    }

    fadeOutAndStop(name: string) {
        let sound = this.audioSprite.get(name);

        if (!sound || !sound.isPlaying) return;

        sound.onFadeComplete.addOnce(function() { this.stop(); }, sound);
        sound.fadeOut();
    }

    getSound(name: string) {
        return this.audioSprite.get(name);
    }

    stopAudio(name?: string) {
        if (!name) name = null;
        this.audioSprite.stop(name);
    }

    private getVolumeCoeff(x: number, y: number) {
        let cam = this.game.camera;
        let dist = TH.game.math.distance(cam.view.centerX, cam.view.centerY, x, y);
        if (cam.view.height > dist) 
            return 1;

        let coeff = (cam.view.height) / (dist * 1.5);
        if (coeff < 0.03)
            coeff = 0;

        return coeff;
    }

    createAudioSprite() {
        if (this.audioSprite) return;

        this.audioSprite = this.game.add.audioSprite("audioSprite");
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

        if (!this.shouldByXY(x, y)) return;

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

    wallDebrisEffect(x: number, y: number, count: number = 10, soundName: string = SoundNames.SPLASH) {
       
        let duration = 400;
        let frames = 10;

        if (soundName)
            this.playAudio(SoundNames.SPLASH, null, x, y);

        if (!this.shouldByXY(x, y)) return;

        let debSprs = this.pool.getAllFreeByKey("wallDebrisDarker");

        if (debSprs.length < count) {
            debSprs.push(...this.pool.createMultiple(count - length, "wallDebrisDarker"));
        }

        for (let i = 0; i < count; i++) {
            
            let ang = Math.random() * Math.PI * 2;
            let dist = Math.random() * 90;

            let pos = {x:  x + Math.sin(ang) * dist, y: y - Math.cos(ang) * dist };
            
            let debrisSpr: Phaser.Sprite = debSprs[i];  //  this.game.add.sprite(x, y, "wallDebrisDarker");
            debrisSpr.anchor.setTo(0.5);
            debrisSpr.scale.setTo(0.6);
            debrisSpr.alpha = 1;
            debrisSpr.frame = Math.floor(Math.random() * frames);
            debrisSpr.position.setTo(x, y);
            debrisSpr.exists = true;
            debrisSpr.rotation = ang;

            let twn = this.game.add.tween(debrisSpr);
            twn.to({ x: pos.x, y: pos.y, alpha: 0, rotation: debrisSpr.rotation + (Math.PI * 2 * Math.random()) }, duration);
            twn.onComplete.add(function() { this.exists = false; }, debrisSpr);
            twn.start();
        }
    }

    shotDamageEffect(x: number, y: number) {
        if (!x || !y) {
            return;
        }

        if (!this.shouldByXY(x, y)) return;

        let spr = this.game.add.sprite(x, y, "shotDamage");
        spr.anchor.setTo(0.5);
        spr.scale.setTo(0.7);

        let anim = spr.animations.add("burst", null, 60);
        anim.onComplete.add(function() { this.destroy(); }, spr);
        anim.play();
    }
}

enum SoundNames {
    LASER1 = "laser1",
    LASER2 = "laser2",
    LASER3 = "laser3",
    LASER4 = "laser4",
    LOSS = "loss",
    MULTIKILL = "multiKill",
    FIVE = "five",
    TEN = "ten",
    FIFTEEN = "fifteen",
    SHOTSMALL = "shotSmall",
    SPLASH = "splash",
    TADA = "tada",
    TICK = "tick",
    TICKMEGA = "tickMega",
    TWENTY = "twenty",
    SHOTMEGAEXP = "shotMegaExplosion",
    GUNSHOT1 = "gunShot1",
    GUNSHOT2 = "gunShot2",
    EXPLOSION1 = "explosion1",
    EXPLOSION2 = "explosion2",
    EXPLOSION3 = "explosion3",
    CLINK = "clink",
    CLICK = "click",
    BUM1 = "bum1",
    ENGINEHIGH = "engineHigh",
    ENGINELOW = "engineLow",
    BIM = "bim",
    RELOAD = "reload",
    VICTORY = "victory",
    MINEBEEP = "mineBeep",
    MENUSONG = "menuSong",
    CINK = "cink",
    WHIP = "whip",
    ENGINETURRET = "turretEngine",
    WIND = "wind",
    BOUNCE = "bounce",
    RESPAWN = "respawn",
    SONG1 = "song1"

}