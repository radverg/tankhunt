class Tank extends Phaser.Sprite {

	constructor(asset) {
		super(game, 0, 0, asset);

		this.remX = 0;
		this.remY = 0;
		this.remAngle = 0;

		this.player = null;

		this._defaultColor = Color.Red;
		this._color = this._defaultColor;

		this.color = Color.Red;

		this.frameStart = 1;
	}

	set defaultColor(val) { this._defaultColor = val; }
	set color(val) { 
		this._color = val;
		this.frameStart = val * (this.framesInRow || 1);
		this.frame = this.frameStart;
	}

	positionServerUpdate(x, y) {
		this.remX = x * game.sizeCoeff;
		this.remY = y * game.sizeCoeff;
	}

	updateTurret() {
		this.turret.x = this.x;
		this.turret.y = this.y;
	}

	rotationServerUpdate(rot) {
		this.remAngle = rot;
		
	}

	rotationTurretServerUpdate(rot) {
		this.turret.remAngle = rot;
	}

	addToScene(visible) {
		game.add.existing(this);
		game.add.existing(this.turret);
		//if (!visible) this.kill();
	}

	applyStatePacket(packet) {
		this.rotationServerUpdate(packet.rot);
		this.rotationTurretServerUpdate(packet.turrRot);
		this.positionServerUpdate(packet.x, packet.y);
	}

	/**
	 * Sets immediatelly tank's position, rotation and turret rotation to remote values, without interpolation
	 */
	jumpToRemote() {
		this.x = this.remX;
		this.y = this.remY;
		this.rotation = this.remAngle;
		this.turret.rotation = this.turret.remAngle;
	}

	kill() {
		super.kill();
		this.turret.kill();
	}

	revive() {
		super.revive();
		this.turret.revive();
	}

	hide() {
		this.visible = false;
		this.turret.visible = false;
	}

	show() {
		this.visible = true;
		this.turret.visible = true;
	}
}