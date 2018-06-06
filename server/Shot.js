var GO = require("./GameObject");

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

}

// APCR ------------------------------------------------------------------------------------
class APCR extends Shot {

	constructor(weapon, startX, startY, startAng) {
		super(weapon, startX, startY, startAng);

		this.type = "APCR";
		this.maxSpeed = 10;
		this.fullForward();

		// TODO: get the possible endpoint
	}
}

// Laser direct -------------------------------------------------------------------------------------
class LaserDirect extends Shot {

	constructor(weapon, startX, startY, startAng, game) {
		super(weapon, startX, startY, startAng);

		this.type = "LaserDirect";
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
}

var Shots = {
	APCR: APCR,
	LaserDirect: LaserDirect
}

module.exports = Shots;