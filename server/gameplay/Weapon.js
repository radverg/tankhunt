var Shts = require("./Shot");

class Weapon {

	constructor(owner) {
		this._reloadTime = 3000;
		this._ammoCount = 10;
		this._shotType = "APCR";

		this._currentShot = null;	
		this._lastShotTime = 0;

		this.owner = owner || null;
		this.shots = [];
	}

	shoot() {
		this._lastShotTime = Date.serverTime;
		this._ammoCount--;
	}

	canShoot() {
		return (this._ammoCount > 0) && ((Date.serverTime - this._lastShotTime) > this._reloadTime);
	}

	onPress() { return false; }
	onRelease() { return false; }

}



// Laser direct ------------------------------------------------------------------------------
class Laser extends Weapon {

	constructor(owner) {
		super(owner);

		this._ammoCount = 100;
		this._shotType = "LaserDirect";
	}

	onPress(game) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getLaserPosition();

			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}

			this.shoot();
			var shot = new Shts.LaserDirect(this, shps.x, shps.y, this.owner.tank.angle, game);
			game.shoot(shot);
		}
	}
}
// ---------------------------------------------------------------------------------------

// APCR ----------------------------------------------------------------------------------
class APCRGun extends Weapon {

	constructor(owner) {
		super(owner);

		this._ammoCount = 10000;
		this._shotType = "APCRGun";
		this._reloadTime = 1000;
	}

	onPress(game) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getShotPosition();

			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}

			this.shoot();
			var shot = new Shts.APCR(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
			game.shoot(shot);
		}
	}
}

module.exports = {
	Laser: Laser,
	APCRGun: APCRGun
}