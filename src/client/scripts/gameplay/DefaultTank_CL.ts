/// <reference path="../refs.ts" />

class DefaultTank_CL extends Tank_CL {

	constructor() {
		super(Data.DefaultTank.asset);

		this.anchor.setTo(Data.DefaultTank.anchorX, Data.DefaultTank.anchorY);
		this.width = Data.DefaultTank.sizeX * TH.sizeCoeff;
		this.height = Data.DefaultTank.sizeY * TH.sizeCoeff;

		this.framesInRow = 1;

		this.turret = new Sprite(TH.game, this.x, this.y, "defaultTurrets");
		this.turret.anchor.setTo(0.5, 0.8453);
		this.turret.width = 0.825 * TH.sizeCoeff;
		this.turret.height = 0.825 * 3.23 * TH.sizeCoeff;

		this.addChild(this.turret);
	}
}
