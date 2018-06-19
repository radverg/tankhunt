import { Player_SE } from "./Player_SE";
import { APCR_SE, LaserDirect_SE, Shot_SE } from "./Shot_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";

abstract class Weapon_SE {

	protected _reloadTime: number;
	protected _ammoCount: number;
	protected _shotType: string;
	protected _currentShot: Shot_SE | null = null;
	protected _lastShotTime: number = 0;
	public owner: Player_SE;
	protected shots: Shot_SE[] = [];
	public wornOut: boolean = false;

	constructor(owner: Player_SE) {
		this._reloadTime = 3000;
		this._ammoCount = 10;
		this._shotType = "none";

		this._currentShot = null;	
		this._lastShotTime = 0;

		this.owner = owner || null;
		this.shots = [];

		this.wornOut = false;
	}

	shoot() {
		this._lastShotTime = Date.now();
		this._ammoCount--;
		this.wornOut = (this._ammoCount < 1);
	}

	canShoot() {
		return (this._ammoCount > 0) && ((Date.now() - this._lastShotTime) > this._reloadTime);
	}

	onPress(game: THGame_SE){};
	onRelease(game: THGame_SE){};

}



// Laser direct ------------------------------------------------------------------------------
class LaserGun_SE extends Weapon_SE {

	constructor(owner: Player_SE) {
		super(owner);

		this._ammoCount = 100;
		this._shotType = "LaserDirect";
	}

	onPress(game: THGame_SE) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getLaserPosition();

			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}

			this.shoot();
			var shot = new LaserDirect_SE(this, shps.x, shps.y, this.owner.tank.angle, game);
			game.shoot(shot);
		}
	}
}
// ---------------------------------------------------------------------------------------

// APCR ----------------------------------------------------------------------------------
class APCRGun_SE extends Weapon_SE {

	constructor(owner: Player_SE) {
		super(owner);

		this._ammoCount = 10000;
		this._shotType = "APCRGun";
		this._reloadTime = 1000;
	}

	onPress(game: THGame_SE) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getShotPosition();

			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}

			this.shoot();
			var shot = new APCR_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
			game.shoot(shot);
		}
	}
}

 var Guns = {
 	Laser: LaserGun_SE,
 	APCRGun: APCRGun_SE
 }

 export { Guns, APCRGun_SE, LaserGun_SE, Weapon_SE };