class Shot extends Phaser.Sprite {

	constructor(dataPack, asset) {
		super(game, dataPack.startX * game.sizeCoeff, dataPack.startY * game.sizeCoeff, asset || "whiteRect");

		// Extract datapack from server
		// contains: id, rot, type, startX, startY, startTime, ownerID
		var dataKeys = Object.keys(dataPack);
		for (var i = 0; i < dataKeys.length; i++) {
		 	this[dataKeys[i]] = dataPack[dataKeys[i]];
		}

		this.delay = (Date.now() - dataPack.startTime) || 10;
		this.moveTween = null;
	}
}

class LaserDirect extends Shot {

	constructor(dataPack) {
		super(dataPack);

		this.anchor.set(0.5, 0);
		this.width = 0.07 * game.sizeCoeff;
		this.rotation = this.rot + Math.PI;
		this.endPoint = { x: dataPack.endX * game.sizeCoeff, y: dataPack.endY * game.sizeCoeff };
		this.speed = dataPack.speed * game.sizeCoeff;

		this.dist = game.math.distance(this.endPoint.x, this.endPoint.y, this.startX * game.sizeCoeff, this.startY * game.sizeCoeff);
		this.time = (this.dist / this.speed) * 1000;

		this.tint = 0xF80000;

		// Start laser
		// Move laser forwards according to delay
		this.height = (this.speed / 1000) * this.delay;

		game.add.existing(this);
		var twn = game.add.tween(this);
		twn.to({ height: this.dist }, this.time);
		twn.onComplete.add(function() { this.destroy(); }, this);
		twn.start();
	}
}

class APCR extends Shot {

	constructor(dataPack) {
		super(dataPack, "ammo");

		this.anchor.set(0.5, 0);
		this.rotation = this.rot;
		this.width = 0.07 * game.sizeCoeff;
		this.height = 0.3 * game.sizeCoeff;
		this.endPoint = { x: dataPack.endX * game.sizeCoeff, y: dataPack.endY * game.sizeCoeff };
		this.speed = dataPack.speed * game.sizeCoeff;

		this.dist = game.math.distance(this.endPoint.x, this.endPoint.y, this.startX * game.sizeCoeff, this.startY * game.sizeCoeff);
		this.time = (this.dist / this.speed) * 1000;

		// Start the shot 
		game.add.existing(this);
		this.moveTween = game.add.tween(this);
		this.moveTween.to({ x: this.endPoint.x, y: this.endPoint.y }, this.time);
		this.moveTween.onComplete.add(function() { this.destroy(); }, this);
		this.moveTween.start();
	}
}

var Shots = {
	LaserDirect: LaserDirect,
	APCR: APCR
}