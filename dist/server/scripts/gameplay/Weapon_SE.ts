import { Player_SE } from "./Player_SE";
import { APCR_SE, LaserDirect_SE, Shot_SE, FlatLaser_SE, Bouncer_SE, BouncingLaser_SE, Shots, Eliminator_SE, Mine_SE } from "./Shot_SE";
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
		return (this._ammoCount > 0) && ((Date.now() - this._lastShotTime) > this._reloadTime) && !this.wornOut && this.owner && this.owner.alive;
	}
}



// Laser direct ------------------------------------------------------------------------------
class LaserGun_SE extends Weapon_SE {
	
	constructor(owner?: Player_SE) {
		super(owner, 4);
		
		this._ammoCount = 1;
		this._shotType = "LaserDirect_SE";
	}
	
	onPress(game: THGame_SE) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getShotPosition();
			
			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}
			
			this.shoot();
			var shot = new LaserDirect_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
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
		this._shotType = "APCR_SE";
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
			var shot = new APCR_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
			game.shoot(shot);
		}
	}
}

/**
 * Pulsar is a gun that shoots APCR shots until it's stack is empty or player is killed.
 * Angle dispersion is applied.
 */
class PulsarGun_SE extends Weapon_SE {

	protected maxDispersion: number = 0.8;
	protected game: THGame_SE = null;
	protected wasPressed: boolean = false;
	
	constructor(owner: Player_SE) {
		super(owner, 1); 
		
		this._ammoCount = 10;
		this._shotType = "APCR_SE";
		this._reloadTime = 150;
	}

	onPress(game: THGame_SE) {
		this.game = game;

		// Prevent multiple shooting
		if (this.wasPressed) return;

		this.wasPressed = true;

		// Start stack
		this.shootNext(game);		
	}

	shootNext(game: THGame_SE) {

		if (!this.wornOut && this.owner && this.owner.alive) {
			
			this.shoot();
			
			// Create shot 
			let shps = this.owner.tank.getShotPosition();

			if (!game || !game.level || !game.level.levelRect.contains(shps.x, shps.y)) {
				this.wornOut = true;
				return;
			}

			let dispDir = (Math.random() > 0.5) ? 1 : -1;

			// Apply angle dispersion
			let ang = this.owner.tank.turret.angle + Math.random() * this.maxDispersion * dispDir;

			let shot = new Shots[this._shotType](this, shps.x, shps.y, ang, this.game);

			this.game.shoot(shot);

			setTimeout(() => { this.shootNext(game); }, this._reloadTime);
		} 
	}
}


//- ---------------------------

class BouncerGun_SE extends Weapon_SE {
	constructor(owner: Player_SE, typeIndex?: number) {
		super(owner, typeIndex || 0); 

		this._ammoCount = 10000;
		this._shotType = "BouncerGun_SE";
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

class BouncingLaserGun_SE extends Weapon_SE {
	constructor(owner: Player_SE) {
		super(owner, 5); 

		this._ammoCount = 1;
		this._shotType = "BouncingLaser_SE";
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
			var shot = new BouncingLaser_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
			game.shoot(shot);
		}
	}
}

// Flat laser --------------------------------------------
class FlatLaserGun_SE extends Weapon_SE {
	
	constructor(owner: Player_SE = null) {
		super(owner, 7);
		this._shotType = "FlatLaser_SE";
		
		this._ammoCount = 1;
		this._reloadTime = 500;
	}
	
	onPress(game: THGame_SE) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getShotPosition();
			
			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}
			
			this.shoot();
			var shot = new FlatLaser_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
			game.shoot(shot);
		}
	}
}
// -----------------------------------------------------------

// Multi bouncer gun -----------------
class MultiBouncerGun_SE extends PulsarGun_SE {

	constructor(owner: Player_SE) {
		super(owner);
		this.typeIndex = 2;

		this._shotType = "PolygonalBouncer_SE";

	}
}


// Eliminator gun ----------------------------
class EliminatorGun_SE extends Weapon_SE {

	private canBlast: boolean = false;
	private shot: Eliminator_SE = null;

	constructor(owner: Player_SE) {
		super(owner);

		this.typeIndex = 3;
		this._ammoCount = 1;
		this._shotType = "Eliminator_SE";
	}

	onPress(game: THGame_SE) {

		// Handle blast of eliminator
		if (this.canBlast) {
			this.canBlast = false;
			this.shot.blast();
			this.wornOut = true;
		}

		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getShotPosition();
			
			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}
			
			var shot = new Eliminator_SE(this, shps.x, shps.y, this.owner.tank.turret.angle, game);
			this.shot = shot;
			this.canBlast = true;
			game.shoot(shot);
		}
	}
}

class MineGun_SE extends Weapon_SE {
	constructor(owner: Player_SE) {
		super(owner, 0);

		this._ammoCount = 1;
		this._reloadTime = 100;
	}

	onPress(game: THGame_SE) {
		// Shoot here
		if (this.canShoot()) {
			var shps = this.owner.tank.getRearShotPosition();
			
			if (!game.level.levelRect.contains(shps.x, shps.y)) {
				return;
			}
			
			this.shoot();
			var shot = new Mine_SE(this, shps.x, shps.y, this.owner.tank.angle, game);
			game.shoot(shot);
		}
	}
}

class DoubleMineGun_SE extends MineGun_SE {
	constructor(owner: Player_SE) {
		super(owner);

		this.typeIndex = 6;
		this._ammoCount = 2;
	}
}

class Invisibility_SE extends Item_SE {

	private duration: number = 12000;
	private timeout: number = null;

	constructor(owner: Player_SE) {
		super(8);
		this.owner = owner;
	}

	onPress(game: THGame_SE) {
		if (this.wornOut) return;
		this.wornOut = true;

		this.owner.invisible = true;
		game.emitDisappear(this.owner);

		if (this.timeout !== null) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}

		setTimeout(() => { 
			if (this.owner && this.owner.game == game) {
				this.owner.invisible = false;
				game.emitAppear(this.owner);
				this.timeout = null;
			}
		}, this.duration);	
	}
}

var Guns = {
	LaserGun: LaserGun_SE,
	APCRGun: APCRGun_SE,
	FlatLaserGun: FlatLaserGun_SE,
	BouncerGun: BouncerGun_SE,
	BouncingLaserGun: BouncingLaserGun_SE,
	PulsarGun: PulsarGun_SE,
	MultiBouncerGun: MultiBouncerGun_SE,
	EliminatorGun: EliminatorGun_SE,
	MineGun: MineGun_SE,
	DoubleMineGun: DoubleMineGun_SE
}

export { Guns, APCRGun_SE, LaserGun_SE, Weapon_SE, FlatLaserGun_SE, BouncerGun_SE, MineGun_SE, DoubleMineGun_SE, Invisibility_SE };