function extendPhaserSprite() {
    Phaser.Sprite.prototype.interpolate = function() {
        var diffX = this.remX - this.x;
        var diffY = this.remY - this.y;

        var dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist < 2) { // Jump directly to the remote position
            this.x = this.remX;
            this.y = this.remY;
            return;
        }

        this.x += diffX * this.interpolationConst;
        this.y += diffY * this.interpolationConst;

    }

    Phaser.Sprite.prototype.interpolateAngle = function() {
        var diff = this.remAngle - this.rotation;

        if (Math.abs(diff) < Math.PI / 90) {
            this.rotation = this.remAngle;
            return;
        }

        this.rotation += diff * this.interpolationConst;
    }

    Phaser.Sprite.prototype.interpolationConst = 0.2;
}