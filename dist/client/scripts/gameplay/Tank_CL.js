var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Tank_CL = (function (_super) {
    __extends(Tank_CL, _super);
    function Tank_CL(asset) {
        var _this = _super.call(this, TH.game, 0, 0, asset) || this;
        _this.player = null;
        _this.frameStart = 1;
        _this.maxHealth = 1;
        _this.health = 1;
        _this.shadow = _this.game.make.sprite(0, 0, "shadow");
        _this.shadow.anchor.setTo(0.5);
        return _this;
    }
    Tank_CL.prototype.rotationTurretServerUpdate = function (rot) {
        this.turret.rotationServerUpdate(rot - this.remAngle);
    };
    Tank_CL.prototype.applyStatePacket = function (packet) {
        this.rotationServerUpdate(packet.rot);
        this.rotationTurretServerUpdate(packet.turrRot);
        this.positionServerUpdate(packet.x, packet.y);
    };
    Tank_CL.prototype.applyTinyStatePacket = function (packet) {
        this.rotationServerUpdate(packet.r);
        this.rotationTurretServerUpdate(packet.t);
        this.positionServerUpdate(packet.x, packet.y);
    };
    Tank_CL.prototype.jumpToRemote = function () {
        this.x = this.remX;
        this.y = this.remY;
        this.rotation = this.remAngle;
    };
    Tank_CL.prototype.setColor = function (colorIndex) {
        this.colorIndex = colorIndex;
        this.turret.colorIndex = colorIndex;
    };
    Tank_CL.prototype.setDefaultColor = function (colorIndex) {
        this.defaultColorIndex = colorIndex;
        this.turret.defaultColorIndex = colorIndex;
    };
    Tank_CL.prototype.kill = function () {
        this.visible = false;
        this.turret.visible = false;
        this.shadow.visible = false;
        if (this.inCamera) {
            this.game.camera.shake(0.01);
        }
        if (this.player.me) {
            this.game.camera.unfollow();
        }
        this.explosionEffect();
    };
    Tank_CL.prototype.revive = function () {
        this.visible = true;
        this.shadow.revive();
        this.turret.revive();
        if (this.player && this.player.me) {
            this.game.camera.follow(this);
            this.game.camera.lerp.setTo(0.1);
        }
    };
    Tank_CL.prototype.destroy = function () {
        _super.prototype.destroy.call(this, true);
        this.shadow.destroy();
        this.turret.destroy();
    };
    Tank_CL.prototype.hide = function () {
        this.visible = false;
        this.turret.visible = false;
    };
    Tank_CL.prototype.show = function () {
        this.visible = true;
        this.turret.visible = true;
    };
    Tank_CL.prototype.alphaShow = function () {
        this.alpha = 1;
        this.shadow.alpha = 1;
    };
    Tank_CL.prototype.alphaHide = function () {
        this.alpha = 0.5;
        this.shadow.alpha = 0.2;
    };
    Tank_CL.prototype.interpolationUpdate = function () {
        this.interpolate();
        this.interpolateAngle();
        this.turret.interpolateAngle();
    };
    Tank_CL.prototype.update = function () {
        this.interpolationUpdate();
        if (this.player.UIpl) {
            this.player.UIpl.x = this.x;
            this.player.UIpl.y = this.y;
            this.player.UIpl.visible = this.visible;
        }
        if (this.shadow) {
            this.shadow.x = this.x;
            this.shadow.y = this.y;
            this.shadow.visible = this.visible;
            this.shadow.rotation = this.rotation;
        }
    };
    Tank_CL.prototype.addToGroup = function (grp) {
        grp.add(this.shadow);
        grp.add(this);
    };
    Tank_CL.prototype.shotExplodeEffect = function (shot) {
        if (!TH.effects.should(shot))
            return;
        var pool = TH.effects.getPool();
        var exps = pool.getAllFreeByKey("shotExplode");
        var explodeSpr = null;
        if (exps.length == 0) {
            explodeSpr = pool.createMultiple(1, "shotExplode".concat(Math.floor(Math.random() * 5) + 1))[0];
        }
        else {
            explodeSpr = exps[Math.floor(Math.random() * exps.length)];
        }
        var ang = (this.visible) ? this.turret.rotation + this.rotation : shot.rotation;
        var dist = this.turret.height / 1.3;
        var x = (this.visible) ? this.x + Math.sin(ang) * dist : shot.x;
        var y = (this.visible) ? this.y - Math.cos(ang) * dist : shot.y;
        explodeSpr.exists = true;
        explodeSpr.position.setTo(x, y);
        explodeSpr.anchor.setTo(0.5);
        explodeSpr.scale.setTo(0.4);
        explodeSpr.rotation = ang;
        var expAnim = explodeSpr.animations.getAnimation("allFrames");
        expAnim.onComplete.addOnce(function () { this.exists = false; }, explodeSpr);
        expAnim.play();
    };
    Tank_CL.prototype.explosionEffect = function () {
        var soundName = "explosion".concat(Math.floor((Math.random() * 3) + 1));
        TH.effects.playAudio(soundName, this);
        if (!TH.effects.should(this))
            return;
        var pool = TH.effects.getPool();
        var exps = pool.getAllFreeByKey("explosion");
        var explosionSpr = null;
        if (exps.length == 0) {
            explosionSpr = pool.createMultiple(1, "explosion".concat(Math.floor(Math.random() * 5)))[0];
        }
        else {
            explosionSpr = exps[Math.floor(Math.random() * exps.length)];
        }
        explosionSpr.exists = true;
        explosionSpr.position.setTo(this.x, this.y);
        explosionSpr.anchor.setTo(0.5);
        var expAnim = explosionSpr.animations.getAnimation("allFrames");
        expAnim.onComplete.addOnce(function () { this.exists = false; }, explosionSpr);
        expAnim.play(40);
        var duration = 1000;
        var partSprs = pool.getAllFreeByKey("tankParts");
        for (var i = 0; i < 6; i++) {
            var partSpr = partSprs[i] || pool.createMultiple(1, "tankParts")[0];
            partSpr.frame = i + ((this.frameStart / this.framesInRow) * 6);
            partSpr.position.setTo(this.x, this.y);
            partSpr.exists = true;
            partSpr.anchor.setTo(0.5);
            partSpr.alpha = 1;
            var angDir = (Math.random() > 0.5) ? -1 : 1;
            var toAng = Math.random() * Math.PI * 8 * angDir;
            var moveAng = Math.random() * Math.PI * 2;
            var moveDist = TH.sizeCoeff * 2 + Math.random() * TH.sizeCoeff * 3;
            var toPos = { x: this.x + Math.sin(moveAng) * moveDist, y: this.y - Math.cos(moveAng) * moveDist };
            var twn = this.game.add.tween(partSpr).to({ x: toPos.x, y: toPos.y, rotation: toAng, alpha: 0 }, duration);
            twn.onComplete.addOnce(function () { this.exists = false; }, partSpr);
            twn.start();
        }
        if (this.turret) {
            var turretSpr = this.game.add.sprite(this.x, this.y, this.turret.key, this.turret.frame);
            turretSpr.width = this.turret.width;
            turretSpr.height = this.turret.height;
            turretSpr.anchor.setTo(this.turret.anchor.x, this.turret.anchor.y * Math.random());
            var angDir = (Math.random() > 0.5) ? -1 : 1;
            var toAng = Math.random() * Math.PI * 8 * angDir;
            var moveAng = Math.random() * Math.PI * 2;
            var moveDist = TH.sizeCoeff * 2 + Math.random() * TH.sizeCoeff * 3;
            var toPos = { x: this.x + Math.sin(moveAng) * moveDist, y: this.y - Math.cos(moveAng) * moveDist };
            var twn = this.game.add.tween(turretSpr).to({ x: toPos.x, y: toPos.y, rotation: toAng, alpha: 0 }, duration);
            twn.onComplete.add(function () { this.destroy(); }, turretSpr);
            twn.start();
        }
    };
    return Tank_CL;
}(Sprite));
