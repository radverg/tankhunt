import { Player_SE } from "./Player_SE";
import { APCR_SE, LaserDirect_SE, Shot_SE, FlatLaser_SE, Bouncer_SE } from "./Shot_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";
import { Item_SE } from "./Item_SE";

abstract class Weapon_SE extends Item_SE {
	
	protected _reloadTime: number;
	protected _ammoCount: number;
	protected _shotType: string;
	protected _currentShot: Shot_SE | null = null;
	protected _lastShotTime: number = 0;
	protected shots: Shot_SE[] = [];
	
	constructor(owner: Player_SE, typeIndex: number = 0) {
		super(typeIndex);
		this._reloadTime = 3000;
		this._ammoCount = 10;
		this._shotType = "none";
		
		this._currentShot = null;	
		this._lastShotTime = 0;
		
		this.owner = owner || null;
		this.shots = [];
	}
	
	shoot() {
		this._lastShotTime = Date.now();
		this._ammoCount--;
		this.wornOut = (this._ammoCount < 1);
	}
	
	canShoot() {
		return (this._ammoCount > 0) && ((Date.now() - this._lastShotTime) > this._reloadTime);
	}
}



// Laser direct ------------------------------------------------------------------------------
class LaserGun_SE extends Weapon_SE {
	
	constructor(owner?: Player_SE) {
		super(owner, 4);
		
		this._ammoCount = 1;
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

// Pulsar ----------------------------------------------------------------------------------
class PulsarGun extends Weapon_SE {
	
	constructor(owner: Player_SE) {
		super(owner); 
		
		this._ammoCount = 10;
		this._shotType = "APCR";
		this._reloadTime = 150;
	}
}


//- ---------------------------

class BouncerGun_SE extends Weapon_SE {
	constructor(owner: Player_SE) {
		super(owner); 

		this._ammoCount = 10000;
		this._shotType = "BouncerGun";
		this._reloadTime = 2000;
	}

	onPress(game: THGame_SE) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getShotPosition();
			
			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}
			
			this.shoot();
			var shot = new Bouncer_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
			game.shoot(shot);
		}
	}
}

// Flat laser --------------------------------------------
class FlatLaserGun_SE extends Weapon_SE {
	
	/**
	*
	*/
	constructor(owner: Player_SE = null) {
		super(owner);
		this._shotType = "FlatLaser";
		
		this._ammoCount = 10;
		this._reloadTime = 500;
	}
	
	onPress(game: THGame_SE) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getLaserPosition();
			
			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}
			
			this.shoot();
			var shot = new FlatLaser_SE(this, shps.x, shps.y, this.owner.tank.angle, game);
			game.shoot(shot);
		}
	}
}

var Guns = {
	LaserGun: LaserGun_SE,
	APCRGun: APCRGun_SE,
	FlatLaserGun: FlatLaserGun_SE,
	BouncerGun: BouncerGun_SE
}


export { Guns, APCRGun_SE, LaserGun_SE, Weapon_SE, FlatLaserGun_SE, BouncerGun_SE };