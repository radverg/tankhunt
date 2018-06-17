class Shot extends Sprite {

	protected delay: number = 16;
	protected moveTween: Phaser.Tween | null = null;
	protected endPoint?: any;

	protected speed?: number;
	protected dist?: number;
	protected time?: number;
	protected startX?: number;
	protected startY?: number;

	constructor(dataPack, asset?: string) {
		super(TH.game, dataPack.startX * TH.sizeCoeff, dataPack.startY * TH.sizeCoeff, asset || "whiteRect");

		// Extract datapack from server
		// contains: id, rot, type, startX, startY, startTime, ownerID
		var dataKeys = Object.keys(dataPack);
		for (var i = 0; i < dataKeys.length; i++) {
		 	this[dataKeys[i]] = dataPack[dataKeys[i]];
		}

		this.delay = (Date.now() - dataPack.startTime) || 16;
	}
}

class LaserDirect extends Shot {

	constructor(dataPack) {
		super(dataPack);

		this.anchor.set(0.5, 0);
		this.width = 0.07 * TH.sizeCoeff;
		this.rotation = dataPack.rot + Math.PI;
		this.endPoint = { x: dataPack.endX * TH.sizeCoeff, y: dataPack.endY * TH.sizeCoeff };
		this.speed = dataPack.speed * TH.sizeCoeff;

		this.dist = TH.game.math.distance(this.endPoint.x, this.endPoint.y, this.startX * TH.sizeCoeff, this.startY * TH.sizeCoeff);
		this.time = (this.dist / this.speed) * 1000;

		this.tint = 0xF80000;

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

class APCR extends Shot {

	constructor(dataPack) {
		super(dataPack, "ammo");

		this.anchor.set(0.5, 0);
		this.rotation = dataPack.rot;
		this.width = 0.07 * TH.sizeCoeff;
		this.height = 0.3 * TH.sizeCoeff;
		this.endPoint = { x: dataPack.endX * TH.sizeCoeff, y: dataPack.endY * TH.sizeCoeff };
		this.speed = dataPack.speed * TH.sizeCoeff;

		this.dist = TH.game.math.distance(this.endPoint.x, this.endPoint.y, this.startX * TH.sizeCoeff, this.startY * TH.sizeCoeff);
		this.time = (this.dist / this.speed) * 1000;

		// Start the shot 
		TH.game.add.existing(this);
		this.moveTween = TH.game.add.tween(this);
		this.moveTween.to({ x: this.endPoint.x, y: this.endPoint.y }, this.time);
		this.moveTween.onComplete.add(function() { this.destroy(); }, this);
		this.moveTween.start();
	}
}

var Shots = {
	LaserDirect: LaserDirect,
	APCR: APCR
}