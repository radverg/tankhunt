class Shot extends Phaser.Sprite {

	constructor(dataPack) {
		super(game, dataPack.startX * game.sizeCoeff, dataPack.startY * game.sizeCoeff, "blackRect");

		// Extract datapack from server
		// contains: id, rot, type, startX, startY, startTime, ownerID
		var dataKeys = Object.keys(dataPack);
		for (var i = 0; i < dataKeys.length; i++) {
		 	this[dataKeys[i]] = dataPack[dataKeys[i]];
		}

		this.delay = (Date.now() - dataPack.startTime) || 10;
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

var Shots = {
	LaserDirect: LaserDirect
}