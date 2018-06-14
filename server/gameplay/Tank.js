var GO = require("./utils/GameObject");
var Wp = require("./Weapon");

class Tank extends GO {

	constructor(owner) {
		super(2, 2, 1, 1.4375);

		this.owner = owner;

		this.turret = new Turret();
		this.maxSpeed = 4; // !!!
		this.maxAngularVel = Math.PI;

		// Weapons: ------------------------
		this.apcrGun = new Wp.APCRGun(owner);
		this.specialGun = new Wp.Laser(owner);
		this.bouncerGun = null;
	}

	getShotPosition() {
		return this.turret.countShotPos(this.x, this.y);
	}

	getLaserPosition() {
		return {
			x: this.x + this.direction.x * (this.body.hWidth + 0.4),
			y: this.y + this.direction.y * (this.body.hWidth + 0.4)
		}
	}

	update(deltaSec) {
		this.turret.rotate(deltaSec);
		this.move(deltaSec);
		this.rotate(deltaSec);
		this.body.updateVertices();
		this.turret.angle = this.turret.selfAngle + this.angle;
	}

	wallCollide(level) {
		var sqrX1 = level.getSqrX(this.body.vertices[0].x);
		var sqrY1 = level.getSqrY(this.body.vertices[0].y);

		level.squareLineWallColl(sqrX1, sqrY1, this);

		var sqrX2 = level.getSqrX(this.body.vertices[1].x);
		var sqrY2 = level.getSqrY(this.body.vertices[1].y);

		if (sqrX2 != sqrX1 || sqrY2 != sqrY1) {
			level.squareLineWallColl(sqrX2, sqrY2, this);
		}

		var sqrX3 = level.getSqrX(this.body.vertices[2].x);
		var sqrY3 = level.getSqrY(this.body.vertices[2].y);

		if ((sqrX3 != sqrX2 || sqrY3 != sqrY2) && (sqrX3 != sqrX1 || sqrY3 != sqrY1)) {
			level.squareLineWallColl(sqrX3, sqrY3, this);
		}

		var sqrX4 = level.getSqrX(this.body.vertices[3].x);
		var sqrY4 = level.getSqrY(this.body.vertices[3].y);

		if ((sqrX4 != sqrX3 || sqrY4 != sqrY3) && (sqrX4 != sqrX2 || sqrY4 != sqrY2) && (sqrX4 != sqrX1 || sqrY4 != sqrY1)) {
			level.squareLineWallColl(sqrX4, sqrY4, this);
		}
	}
}

class Turret extends GO {
	
	constructor() {
		super();

		this.anchor = { x: 0.5, y: 0.5 };
		this._barrelDist = 1.5;
		this.selfAngle = 0;

		this.maxAngularVel = 3;
	}

	countShotPos(fromX,fromY) {
		return {
			x: fromX + this._barrelDist * this.direction.x,
			y: fromY + this._barrelDist * this.direction.y
		}
	}

	rotate(deltaSec) {
		if (this.angularVel) {
			this.selfAngle += this.angularVel * deltaSec;
		}
	}

}

module.exports = Tank;