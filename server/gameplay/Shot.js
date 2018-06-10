var GO = require("./utils/GameObject");
var mymath = require("./utils/MyMath");

// Shot constructor takes the weapon it was shot from as a parameter
// This class is abstract (it is not included in module.exports)
class Shot extends GO {

	constructor(weapon, startX, startY, startAng) {
		super(startX, startY, 0.2, 0.2);

		this.startX = startX;
		this.startY = startY;

		this.type = "unknown";

		this.startTime = Date.serverTime;

		this.weapon = weapon;
		if (weapon) this.owner = weapon.owner;

		this.angle = startAng;

		this.removeAfterHit = true;
	}

	getStartPacket() {
		return {
			id: this.id,
			rot: this.angle,
			type: this.type,
			startX: this.startX,
			startY: this.startY,
			startTime: this.startTime,
			ownerID: this.owner.socket.id
		}
	}

	remove(game) {
		var index = game.shots.indexOf(this);
		if (index !== -1)
			game.shots.splice(index, 1);
	}

}

// APCR ------------------------------------------------------------------------------------
class APCR extends Shot {

	constructor(weapon, startX, startY, startAng, game) {
		super(weapon, startX, startY, startAng);

		this.type = "APCR";
		this.maxSpeed = 25;
		this.fullForward();

		// Get the end point
		this.endPoint = game.level.wallCheckLoop(startX, startY, this.direction.x, this.direction.y);
	}

	getStartPacket() {
		var packet = super.getStartPacket();
		packet.endX = this.endPoint.x;
		packet.endY = this.endPoint.y;
		packet.speed = this.maxSpeed;
		return packet;
	}

	isHittingPlayer(player) {
		if (player.body.rectCircleVSCircle((this.x + this.prevBody.cX) / 2, (this.y + this.prevBody.cY) / 2, mymath.dist(this.x, this.y, this.prevBody.cX,
			this.prevBody.cY) / 2)) {

			return player.body.lineInt(this.x, this.y, this.prevBody.cX, this.prevBody.cY);
		}

		return false;
	}
}

// Laser direct -------------------------------------------------------------------------------------
class LaserDirect extends Shot {

	constructor(weapon, startX, startY, startAng, game) {
		super(weapon, startX, startY, startAng);

		this.type = "LaserDirect";
		this.removeAfterHit = false;
		this.maxSpeed = 40;
		this.fullForward();

		// Get the end point (at level border)
		var points = game.level.levelRect.simpleLineIntPoints(startX, startY, startX + Math.sin(startAng) * 1000, startY 
			- Math.cos(startAng) * 1000);
		this.endPoint = points[0];

	}

	getStartPacket() {
		var packet = super.getStartPacket();
		packet.endX = this.endPoint.x;
		packet.endY = this.endPoint.y;
		packet.speed = this.maxSpeed;
		return packet;
	}

	isHittingPlayer(player) {
		if (player.id == this.owner.id) return false; // This laser cannot kill its owner
		return player.body.lineInt(this.startX, this.startY, this.x, this.y);
	}
}

var Shots = {
	APCR: APCR,
	LaserDirect: LaserDirect
}

module.exports = Shots;