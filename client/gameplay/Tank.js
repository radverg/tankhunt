class Tank extends Phaser.Sprite {

	constructor(asset) {
		super(game, 0, 0, asset);

		this.remX = 0;
		this.remY = 0;
		this.remAngle = 0;

		this.player = null;
	}

	positionServerUpdate(x, y) {
		this.remX = x * game.sizeCoeff;
		this.remY = y * game.sizeCoeff;

		// this.turret.remX = x * game.sizeCoeff;
		// this.turret.remY = y * game.sizeCoeff;
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

	addToScene() {
		game.add.existing(this);
		game.add.existing(this.turret);
	}
}