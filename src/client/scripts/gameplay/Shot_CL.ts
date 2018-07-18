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

	protected shotGroup: ShotGroup_CL = TH.thGame.shotGroup;

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

	start() {

	}

	stop() {

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

		this.dist = TH.game.math.distance(this.endX, this.endY, this.startX, this.startY);
		this.time = (this.dist / this.speed) * 1000;

		this.start();

	}

	start() {
		this.moveTween = TH.game.add.tween(this);
		this.moveTween.to({ x: this.endX, y: this.endY }, this.time);
		this.moveTween.onComplete.add(function() { this.destroy(); }, this);
		this.moveTween.start();

		this.shotGroup.add(this);
	}

	stop() {
		this.moveTween.stop();
		this.destroy();
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
		this.shotGroup.add(this);
		let twn = TH.game.add.tween(this);
		twn.to({ x: this.endX, y: this.endY }, this.time);
		twn.onComplete.add(function() { this.destroy(); }, this);
		twn.start();

	
	}
}

class Bouncer_CL extends Shot_CL {

	private currentBounce: number = 0;
	private tweens: Phaser.Tween[] = [];
	private bouncePoints: BouncePoint[] = [];

	constructor(dataPack: PacketBouncerShotStart) {
		super(dataPack, "ammo");

		this.bouncePoints = dataPack.pts;

		this.anchor.set(0.5, 0);
		this.width = 0.07 * TH.sizeCoeff;
		this.height = 0.3 * TH.sizeCoeff;

		//let currentBounce = 0;
		for (let i = 1; i < dataPack.pts.length; i++) {
			let ptX = dataPack.pts[i].x * TH.sizeCoeff;
			let ptY = dataPack.pts[i].y * TH.sizeCoeff;
			// Count distance and time
			let dist = TH.game.math.distance(ptX, ptY, dataPack.pts[i - 1].x * TH.sizeCoeff, dataPack.pts[i - 1].y * TH.sizeCoeff);
			let time = (dist / this.speed) * 1000;
		 
			let twn = TH.game.add.tween(this);
			twn.to({ x: ptX, y: ptY }, time);
			twn.onComplete.add(function() {
				// This happens when each tween completes
				this.currentBounce++;
				if (this.tweens[this.currentBounce]) {

					this.rotation = this.bouncePoints[this.currentBounce].ang;
					this.tweens[this.currentBounce].start();	
				} else {
					// No other tween - shot ends here
					this.destroy();
				}

			}, this);

			this.tweens.push(twn);
		}

		this.shotGroup.add(this);
		this.tweens[0].start();

	}
}

var Shots: { [key: string]: typeof Shot_CL } = {
	LaserDirect: LaserDirect_CL,
	APCR: APCR_CL,
	FlatLaser: FlatLaser_CL,
	Bouncer: Bouncer_CL
}