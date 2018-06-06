var GO = require("./GameObject");
var Wp = require("./Weapon");

class Tank extends GO {

	constructor(owner) {
		super(2, 2, 1, 1.4375);

		this.owner = this;

		this.turret = new Turret();
		this.maxSpeed = 4; // !!!
		this.maxAngularVel = Math.PI;

		this.apcrGun = new Wp.Weapon(owner);
		this.laserGun = new Wp.Laser(owner);
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
		this.turret.angle = this.turret.selfAngle + this.angle;
	}

}

class Turret extends GO {
	
	constructor() {
		super();

		this.anchor = { x: 0.5, y: 0.5 };
		this._barrelDist = 2.6;
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