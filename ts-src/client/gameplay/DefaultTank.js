var DefaultTankProps = {
	ASSET_NAME: "tankBodys",
	ANCHORX: 0.5,
	ANCHORY: 0.5,
	SIZEX: 1,
	SIZEY: 1.4375
}

class DefaultTank extends Tank {

	constructor() {
		super(DefaultTankProps.ASSET_NAME);

		this.anchor.setTo(DefaultTankProps.ANCHORX, DefaultTankProps.ANCHORY);
		this.width = DefaultTankProps.SIZEX * game.sizeCoeff;
		this.height = DefaultTankProps.SIZEY * game.sizeCoeff;

		this.framesInRow = 1;

		this.turret = new Phaser.Sprite(game, this.x, this.y, "defaultTurret");
		this.turret.remAngle = 0;
		this.turret.anchor.setTo(0.5, 0.8453);
		this.turret.width = 0.625 * game.sizeCoeff;
		this.turret.height = 0.625 * 3.23 * game.sizeCoeff;
	}
}
