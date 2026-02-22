var EffectManager = (function () {
    function EffectManager(game) {
        this.game = game;
        this.effectGroup = game.world;
    }
    EffectManager.prototype.initPool = function () {
        this.pool = new Pool_CL(this.game);
        for (var i = 0; i < 5; i++) {
            this.pool.createMultiple(1, "shotExplode".concat(i + 1));
            this.pool.createMultiple(1, "explosion".concat(i + 1));
        }
        this.pool.createMultiple(5, "shotDamage");
        this.pool.createMultiple(40, "wallDebrisDarker");
        this.pool.createMultiple(34, "tankParts");
    };
    EffectManager.prototype.getPool = function () {
        return this.pool;
    };
    EffectManager.prototype.should = function (sourceSpr, tolerance) {
        if (tolerance === void 0) { tolerance = 0; }
        if (!sourceSpr)
            return !TH.suspended;
        var badBounds = sourceSpr.getBounds();
        var cam = TH.game.camera;
        return !TH.suspended && cam.view.intersects(new Phaser.Rectangle(badBounds.x + cam.x, badBounds.y + cam.y, badBounds.width, badBounds.height), tolerance);
    };
    EffectManager.prototype.shouldByXY = function (x, y) {
        return !TH.suspended && TH.game.camera.view.contains(x, y);
    };
    EffectManager.prototype.playAudio = function (name, sourceSpr, x, y) {
        if (!this.audioSprite || !this.audioSprite.get(name))
            return;
        var volScale = 1;
        var vol = this.audioSprite.config.spritemap[name].volume || 1;
        if (sourceSpr) {
            volScale = this.getVolumeCoeff(sourceSpr.x, sourceSpr.y);
        }
        else if (x !== undefined && y !== undefined) {
            volScale = this.getVolumeCoeff(x, y);
        }
        if (volScale === 0)
            return;
        vol *= volScale;
        this.audioSprite.play(name, vol);
    };
    EffectManager.prototype.playAudioLooping = function (name) {
        var sound = this.audioSprite.get(name);
        if (sound) {
            sound.play(name, null, this.audioSprite.config.spritemap[name].volume || 1, true);
        }
    };
    EffectManager.prototype.fadeOutAndStop = function (name) {
        var sound = this.audioSprite.get(name);
        if (!sound || !sound.isPlaying)
            return;
        sound.onFadeComplete.addOnce(function () { this.stop(); }, sound);
        sound.fadeOut();
    };
    EffectManager.prototype.getSound = function (name) {
        return this.audioSprite.get(name);
    };
    EffectManager.prototype.stopAudio = function (name) {
        if (!name)
            name = null;
        this.audioSprite.stop(name);
    };
    EffectManager.prototype.getVolumeCoeff = function (x, y) {
        var cam = this.game.camera;
        var dist = TH.game.math.distance(cam.view.centerX, cam.view.centerY, x, y);
        if (cam.view.height > dist)
            return 1;
        var coeff = (cam.view.height) / (dist * 1.5);
        if (coeff < 0.03)
            coeff = 0;
        return coeff;
    };
    EffectManager.prototype.createAudioSprite = function () {
        if (this.audioSprite)
            return;
        this.audioSprite = this.game.add.audioSprite("audioSprite");
    };
    EffectManager.prototype.smokeEffect = function (x, y, scale) {
        if (scale === void 0) { scale = 1; }
        var smokeSpr = this.game.add.sprite(x, y, "smoke");
        smokeSpr.anchor.setTo(0.5);
        smokeSpr.scale.setTo(scale);
        var smokeAnim = smokeSpr.animations.add("smokeAnim", null, 42);
        smokeAnim.onComplete.add(function () { this.destroy(); }, smokeSpr);
        smokeAnim.play();
    };
    EffectManager.prototype.shotDebrisEffect = function (x, y) {
        if (!x || !y) {
            return;
        }
        if (!this.shouldByXY(x, y))
            return;
        var debrisCount = Math.floor(Math.random() * 5) + 4;
        var duration = 300;
        for (var i = 0; i < debrisCount; i++) {
            var ang = Math.random() * Math.PI * 2;
            var dist = Math.random() * TH.sizeCoeff * 2;
            var pos = { x: x + Math.sin(ang) * dist, y: y - Math.cos(ang) * dist };
            var debrisSpr = this.game.add.sprite(x, y, "blackRect");
            debrisSpr.anchor.setTo(0.5);
            debrisSpr.width = TH.sizeCoeff * 0.04;
            debrisSpr.height = TH.sizeCoeff * 0.2;
            debrisSpr.rotation = ang;
            var twn = this.game.add.tween(debrisSpr);
            twn.to({ x: pos.x, y: pos.y, alpha: 0 }, duration);
            twn.onComplete.add(function () { this.destroy(); }, debrisSpr);
            twn.start();
        }
    };
    EffectManager.prototype.wallDebrisEffect = function (x, y, count, soundName) {
        if (count === void 0) { count = 10; }
        if (soundName === void 0) { soundName = SoundNames.SPLASH; }
        var duration = 400;
        var frames = 10;
        if (soundName)
            this.playAudio(SoundNames.SPLASH, null, x, y);
        if (!this.shouldByXY(x, y))
            return;
        var debSprs = this.pool.getAllFreeByKey("wallDebrisDarker");
        if (debSprs.length < count) {
            debSprs.push.apply(debSprs, this.pool.createMultiple(count - length, "wallDebrisDarker"));
        }
        for (var i = 0; i < count; i++) {
            var ang = Math.random() * Math.PI * 2;
            var dist = Math.random() * 90;
            var pos = { x: x + Math.sin(ang) * dist, y: y - Math.cos(ang) * dist };
            var debrisSpr = debSprs[i];
            debrisSpr.anchor.setTo(0.5);
            debrisSpr.scale.setTo(0.6);
            debrisSpr.alpha = 1;
            debrisSpr.frame = Math.floor(Math.random() * frames);
            debrisSpr.position.setTo(x, y);
            debrisSpr.exists = true;
            debrisSpr.rotation = ang;
            var twn = this.game.add.tween(debrisSpr);
            twn.to({ x: pos.x, y: pos.y, alpha: 0, rotation: debrisSpr.rotation + (Math.PI * 2 * Math.random()) }, duration);
            twn.onComplete.add(function () { this.exists = false; }, debrisSpr);
            twn.start();
        }
    };
    EffectManager.prototype.shotDamageEffect = function (x, y) {
        if (!x || !y) {
            return;
        }
        if (!this.shouldByXY(x, y))
            return;
        var spr = this.game.add.sprite(x, y, "shotDamage");
        spr.anchor.setTo(0.5);
        spr.scale.setTo(0.7);
        var anim = spr.animations.add("burst", null, 60);
        anim.onComplete.add(function () { this.destroy(); }, spr);
        anim.play();
    };
    return EffectManager;
}());
var SoundNames;
(function (SoundNames) {
    SoundNames["LASER1"] = "laser1";
    SoundNames["LASER2"] = "laser2";
    SoundNames["LASER3"] = "laser3";
    SoundNames["LASER4"] = "laser4";
    SoundNames["LOSS"] = "loss";
    SoundNames["MULTIKILL"] = "multiKill";
    SoundNames["FIVE"] = "five";
    SoundNames["TEN"] = "ten";
    SoundNames["FIFTEEN"] = "fifteen";
    SoundNames["SHOTSMALL"] = "shotSmall";
    SoundNames["SPLASH"] = "splash";
    SoundNames["TADA"] = "tada";
    SoundNames["TICK"] = "tick";
    SoundNames["TICKMEGA"] = "tickMega";
    SoundNames["TWENTY"] = "twenty";
    SoundNames["SHOTMEGAEXP"] = "shotMegaExplosion";
    SoundNames["GUNSHOT1"] = "gunShot1";
    SoundNames["GUNSHOT2"] = "gunShot2";
    SoundNames["EXPLOSION1"] = "explosion1";
    SoundNames["EXPLOSION2"] = "explosion2";
    SoundNames["EXPLOSION3"] = "explosion3";
    SoundNames["CLINK"] = "clink";
    SoundNames["CLICK"] = "click";
    SoundNames["BUM1"] = "bum1";
    SoundNames["ENGINEHIGH"] = "engineHigh";
    SoundNames["ENGINELOW"] = "engineLow";
    SoundNames["BIM"] = "bim";
    SoundNames["RELOAD"] = "reload";
    SoundNames["VICTORY"] = "victory";
    SoundNames["MINEBEEP"] = "mineBeep";
    SoundNames["MENUSONG"] = "menuSong";
    SoundNames["CINK"] = "cink";
    SoundNames["WHIP"] = "whip";
    SoundNames["ENGINETURRET"] = "turretEngine";
    SoundNames["WIND"] = "wind";
    SoundNames["BOUNCE"] = "bounce";
    SoundNames["RESPAWN"] = "respawn";
    SoundNames["SONG1"] = "song1";
})(SoundNames || (SoundNames = {}));
