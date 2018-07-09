class Shot_CL extends Sprite {

	protected delay: number = 16;
	protected moveTween: Phaser.Tween | null = null;

	protected speed: number;
	protected dist?: number;
	protected time?: number;

	protected startX: number;
	protected startY: number;

	protected endX?: number;
	protected endY?: number;
	protected startTime: number;

	constructor(dataPack: PacketShotStart, asset?: string) {
		super(TH.game, dataPack.startX * TH.sizeCoeff, dataPack.startY * TH.sizeCoeff, asset || "whiteRect");

		// Extract datapack from server
		this.startX = dataPack.startX * TH.sizeCoeff;
		this.startY = dataPack.startY * TH.sizeCoeff;

		this.endX = dataPack.endX * TH.sizeCoeff;
		this.endY = dataPack.endY * TH.sizeCoeff;
		
		this.x = dataPack.startX * TH.sizeCoeff;
		this.y = dataPack.startY * TH.sizeCoeff;

		this.rotation = dataPack.rot;
		
		this.startTime = dataPack.startTime;

		this.speed = dataPack.speed * TH.sizeCoeff;
		
		
		this.delay = TH.timeManager.getDelay(dataPack.startTime) || 16;
	}
}

class LaserDirect_CL extends Shot_CL {

	constructor(dataPack: PacketShotStart) {
		super(dataPack);

		this.anchor.set(0.5, 0);
		this.width = 0.07 * TH.sizeCoeff;
		this.rotation += Math.PI;
		this.speed = dataPack.speed * TH.sizeCoeff;

		this.dist = TH.game.math.distance(this.endX, this.endY, this.startX, this.startY);
		this.time = (this.dist / this.speed) * 1000;

		this.tint = 0x7D1ADF;

		// Start laser
		// Move laser forwards according to delay
		this.height = (this.speed / 1000) * this.delay;

		TH.game.add.existing(this);
		var twn = TH.game.add.tween(this);
		twn.to({ height: this.dist }, this.time);
		twn.onComplete.add(function() { this.destroy(); }, this);
		twn.start();
	}
}

class APCR_CL extends Shot_CL {

	constructor(dataPack: PacketShotStart) {
		super(dataPack, "ammo");

		this.anchor.set(0.5, 0);
		this.width = 0.07 * TH.sizeCoeff;
		this.height = 0.3 * TH.sizeCoeff;
		this.speed = dataPack.speed * TH.sizeCoeff;

		this.dist = TH.game.math.distance(this.endX, this.endY, this.startX, this.startY);
		this.time = (this.dist / this.speed) * 1000;

		// Start the shot 
		TH.game.add.existing(this);
		this.moveTween = TH.game.add.tween(this);
		this.moveTween.to({ x: this.endX, y: this.endY }, this.time);
		this.moveTween.onComplete.add(function() { this.destroy(); }, this);
		this.moveTween.start();
	}
}

class FlatLaser_CL extends Shot_CL {

	private size: number; 

	constructor(dataPack: PacketShotStart) {
		super(dataPack);

		this.size = 3 * TH.sizeCoeff;

		this.anchor.setTo(0.5);
		this.width = this.size;
		this.height = 0.1 * TH.sizeCoeff;

		this.dist = TH.game.math.distance(this.endX, this.endY, this.startX, this.startY);
		this.time = (this.dist / this.speed) * 1000;

		this.tint = 0x7D1ADF;

		// Start this shot
		TH.game.add.existing(this);
		let twn = TH.game.add.tween(this);
		twn.to({ x: this.endX, y: this.endY }, this.time);
		twn.onComplete.add(function() { this.destroy(); }, this);
		twn.start();

	
	}
}

var Shots: { [key: string]: typeof Shot_CL } = {
	LaserDirect: LaserDirect_CL,
	APCR: APCR_CL,
	FlatLaser: FlatLaser_CL
}