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
		console.log(this._ammoCount);
		return (this._ammoCount > 0) && ((Date.serverTime - this._lastShotTime) > this._reloadTime);
	}

	onPress() { return false; }
	onRelease() { return false; }

}



// Laser direct ------------------------------------------------------------------------------
class Laser extends Weapon {

	constructor(owner) {
		super(owner);

		this._ammoCount = 3;
		this._shotType = "LaserDirect";
	}

	onPress(game) {
		// Shoot here
		if (this.canShoot()) {
			this.shoot();
			var shps = this.owner.tank.getLaserPosition();
			var shot = new Shts.LaserDirect(this, shps.x, shps.y, this.owner.tank.angle, game);
			game.shoot(shot);
		}
	}
}
// ---------------------------------------------------------------------------------------

module.exports = {
	Weapon: Weapon,
	Laser: Laser
}