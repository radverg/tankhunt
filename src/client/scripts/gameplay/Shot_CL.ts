class Shot_CL extends Sprite {

	protected delay: number = 16;
	protected moveTween: Phaser.Tween | null = null;

	protected speed: number;
	protected dist?: number;
	protected time?: number;

	protected startX: number;
	protected startY: number;

	protected endX?: number;
	protected endY?: number;
	protected startTime: number;

	protected ownerPl: Player_CL;

	protected shotGroup: ShotGroup_CL = TH.thGame.shotGroup;

	constructor(dataPack: PacketShotStart, asset?: string) {
		super(TH.game, dataPack.startX * TH.sizeCoeff, dataPack.startY * TH.sizeCoeff, asset || "whiteRect");
		
		// Extract datapack from server
		this.startX = dataPack.startX * TH.sizeCoeff;
		this.startY = dataPack.startY * TH.sizeCoeff;

		this.endX = dataPack.endX * TH.sizeCoeff;
		this.endY = dataPack.endY * TH.sizeCoeff;
		
		this.x = dataPack.startX * TH.sizeCoeff;
		this.y = dataPack.startY * TH.sizeCoeff;

		this.rotation = dataPack.rot;
		
		this.startTime = dataPack.startTime;

		this.speed = dataPack.speed * TH.sizeCoeff;
		
		this.ownerPl = dataPack.ownerObj || null;
		
		this.delay = TH.timeManager.getDelay(dataPack.startTime) || 16;

		this.events.onDestroy.add(() => { if (this.shotGroup && this.shotGroup.removeShot) this.shotGroup.removeShot(this); }, this);
	}

	start() {

	}

	stop() {

	}

	blast(dataPack: PacketShotHit) {
		
	}
}

class LaserDirect_CL extends Shot_CL {

	constructor(dataPack: PacketShotStart) {
		super(dataPack, "lasers");

		this.anchor.set(0.5, 0);
		this.width = 0.13 * TH.sizeCoeff;
		this.rotation += Math.PI;
		this.speed = dataPack.speed * TH.sizeCoeff;

		this.dist = TH.game.math.distance(this.endX, this.endY, this.startX, this.startY);
		this.time = (this.dist / this.speed) * 1000;

		this.frame = this.ownerPl.tank.defaultColorIndex;

		// Start laser
		// Move laser forwards according to delay
		this.height = (this.speed / 1000) * this.delay;

		TH.game.add.existing(this);
		var twn = TH.game.add.tween(this);
		twn.to({ height: this.dist }, this.time);
		twn.onComplete.add(function() { this.destroy(); }, this);
		twn.start();

		TH.effects.playLaser3(this.x, this.y);
	}
}

class APCR_CL extends Shot_CL {

	constructor(dataPack: PacketShotStart) {
		super(dataPack, "shot");

		this.anchor.set(0.5, 0.5);

		this.scale.setTo(0.5);
		//this.width = 0.07 * TH.sizeCoeff;
		//this.height = 0.3 * TH.sizeCoeff;

		this.dist = TH.game.math.distance(this.endX, this.endY, this.startX, this.startY);
		this.time = (this.dist / this.speed) * 1000;

	}

	start() {
		this.moveTween = TH.game.add.tween(this);
		this.moveTween.to({ x: this.endX, y: this.endY }, this.time);
		this.moveTween.onComplete.add(function() { 
			TH.effects.shotDebrisEffect(this.x, this.y);
			this.destroy(); 
		}, this);
		this.moveTween.start();

		let anim = this.animations.add("shotFlight", null, 20, true);
		anim.play();

		this.shotGroup.add(this);
		
		// Effects
		TH.effects.playSound("bum1_sound", 0.4, this.x, this.y);
		this.ownerPl.tank.shotExplodeEffect();
	}

	stop() {
		this.moveTween.stop();
		this.destroy();
	}
}

class FlatLaser_CL extends Shot_CL {

	private size: number; 

	constructor(dataPack: PacketShotStart) {
		super(dataPack,  "lasers");

		this.size = 3 * TH.sizeCoeff;

		this.anchor.setTo(0.5);
		this.width = this.size;
		this.height = 0.2 * TH.sizeCoeff;

		this.dist = TH.game.math.distance(this.endX, this.endY, this.startX, this.startY);
		this.time = (this.dist / this.speed) * 1000;
		this.frame = this.ownerPl.tank.defaultColorIndex;

		/* this.tint = 0x7D1ADF; */

		// Start this shot
		this.shotGroup.add(this);
		let twn = TH.game.add.tween(this);
		twn.to({ x: this.endX, y: this.endY }, this.time);
		twn.onComplete.add(function() { this.destroy(); }, this);
		twn.start();

		TH.effects.playLaser2(this.x, this.y);

	
	}
}

class Bouncer_CL extends Shot_CL {

	protected currentBounce: number = 0;
	private tweens: Phaser.Tween[] = [];
	protected wayPoints: WayPoint[] = [];

	constructor(dataPack: PacketBouncerShotStart, asset: string) {
		super(dataPack, asset || "shot");

		this.wayPoints = dataPack.pts;

		// Parse points from server units to client
		for (let i = 0; i < this.wayPoints.length; i++) {
			this.wayPoints[i].x *= TH.sizeCoeff;
			this.wayPoints[i].y *= TH.sizeCoeff;
		}

		this.anchor.set(0.5, 0);
		this.scale.setTo(0.5);
		
	}

	start() {

		for (let i = 1; i < this.wayPoints.length; i++) {
			let ptX = this.wayPoints[i].x; 
			let ptY = this.wayPoints[i].y;
			// Count distance and time
			let dist = TH.game.math.distance(ptX, ptY, this.wayPoints[i - 1].x, this.wayPoints[i - 1].y);
			let time = (dist / this.speed) * 1000;
		 
			let twn = TH.game.add.tween(this);
			twn.to({ x: ptX, y: ptY }, time);
			twn.onComplete.add(function() {
				// This happens when each tween completes
				this.currentBounce++;
				if (this.tweens[this.currentBounce]) {

					this.rotation = this.wayPoints[this.currentBounce].ang;
					this.tweens[this.currentBounce].start();	
				} else {
					// No other tween - shot ends here
					this.stop();
				}

			}, this);

			this.tweens.push(twn);
		}

		this.shotGroup.add(this);
		this.tweens[0].start();

		TH.effects.playSound("bum1_sound", 0.4, this.x, this.y);
		this.ownerPl.tank.shotExplodeEffect();
	}

	stop() {
		this.destroy();
	}
}

class PolygonalBouncer_CL extends Bouncer_CL {

	private rotTween: Phaser.Tween;

	constructor(dataPack: PacketBouncerShotStart) {
		super(dataPack, "blackRect");

		this.anchor.setTo(0.5);
		this.width = 0.2 * TH.sizeCoeff;
		this.height = 0.2 * TH.sizeCoeff;

		// This shot should be rotating
		this.rotTween = this.game.add.tween(this);
		this.rotTween.to({ rotation: 100 }, 6000);
	}

	start() {
		super.start();
		this.rotTween.start();
		TH.effects.playSound("bum1_sound", 0.4, this.x, this.y);
		this.ownerPl.tank.shotExplodeEffect();
		this.shotGroup.add(this);
	}

	stop() {
		this.rotTween.stop();
		this.destroy();
	}
}

class Eliminator_CL extends Bouncer_CL {

	private splintersData: any[] = [];
	private splinterTime: number;
	private rotTween: Phaser.Tween;

	constructor(dataPack: PacketEliminatorStart) {
		super(dataPack, "ball");

		this.width = 25;
		this.height = 25;
		this.anchor.setTo(0.5);

		this.splintersData = dataPack.spl;
		this.splinterTime = dataPack.splTime;

		this.rotTween = this.game.add.tween(this);
		this.rotTween.to({ rotation: 150 }, 10000);
		this.rotTween.start();


	}

	start() {
		super.start();
	}

	stop() {
		this.rotTween.stop();
		this.destroy();
	}

	blast(dataPack: PacketShotHit) {
		console.log("Eliminator blasted!");

		for (let i = 0; i < this.splintersData.length; i++) {
			let spd = this.splintersData[i].speed * TH.sizeCoeff;
			let ang = this.splintersData[i].ang;
			let time = this.splinterTime;

			let splinterSprite: Phaser.Sprite = this.shotGroup.create(dataPack.x * TH.sizeCoeff, dataPack.y * TH.sizeCoeff, "ammo");
			splinterSprite.rotation = ang;
			
			splinterSprite.anchor.set(0.5, 0);
			splinterSprite.width = 0.07 * TH.sizeCoeff;
			splinterSprite.height = 0.3 * TH.sizeCoeff;

			let dist = spd * (time / 1000);
			
			let twn = this.game.add.tween(splinterSprite);
			let endPoint = { x: splinterSprite.x + Math.sin(ang) * dist, y: splinterSprite.y - Math.cos(ang) * dist };
			twn.to({ x: endPoint.x, y: endPoint.y }, time);
			twn.onComplete.add(function() { this.destroy(); }, splinterSprite);
			twn.start();
			
		}

		this.stop();
	}
}
class BouncingLaser_CL extends Bouncer_CL {

	private laserLinesGrp: Phaser.Group; 

	constructor(dataPack: PacketBouncerShotStart) {
		super(dataPack, "whiteRect");

		this.laserLinesGrp = new Phaser.Group(this.game);
		this.shotGroup.add(this.laserLinesGrp);


	}

	start() {
		TH.effects.playLaser1(this.x, this.y);
		this.nextLaserLine();
	}

	nextLaserLine() {
		let currB = this.currentBounce;
		if (currB >= this.wayPoints.length - 1) {
			return;
		}

		let pt1 = this.wayPoints[this.currentBounce];
		let pt2 = this.wayPoints[this.currentBounce + 1];

		let lineSpr = new Sprite(this.game, pt1.x, pt1.y, "lasers");
		this.laserLinesGrp.add(lineSpr);

		lineSpr.frame = this.ownerPl.tank.defaultColorIndex;
		lineSpr.anchor.setTo(0.5, 0);
		lineSpr.rotation = pt1.ang + Math.PI;
		lineSpr.width = 0.2 * TH.sizeCoeff;

		let dist = TH.game.math.distance(pt1.x, pt1.y, pt2.x, pt2.y);
		let time = (dist / this.speed) * 1000;

		// Now do the tween
		let twn = this.game.add.tween(lineSpr);
		twn.to({ height: dist }, time);

		if (currB == this.wayPoints.length - 2) { // This is the last one
			// After it is finished, stop the shot
			twn.onComplete.add(function() { this.stop(); }, this);
		} else {
			// This is not the last one, continue with next
			twn.onComplete.add(function() { this.nextLaserLine(); }, this);
		}

		twn.start();
		this.currentBounce++;
	}

	stop() {
		this.laserLinesGrp.destroy(true, false);
		this.destroy();
	}
}

class Mine_CL extends Shot_CL {

	constructor(dataPack: PacketShotStart) {
		super(dataPack, "mine");

		this.anchor.setTo(0.5);
		this.width = TH.sizeCoeff;
		this.height = TH.sizeCoeff;
	}

	start() {
		this.game.add.tween(this).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
		this.shotGroup.add(this);
	}
}

var Shots: { [key: string]: typeof Shot_CL } = {
	LaserDirect: LaserDirect_CL,
	APCR: APCR_CL,
	FlatLaser: FlatLaser_CL,
	Bouncer: Bouncer_CL,
	BouncingLaser: BouncingLaser_CL ,
	PolygonalBouncer: PolygonalBouncer_CL,
	Eliminator: Eliminator_CL,
	Mine: Mine_CL
}