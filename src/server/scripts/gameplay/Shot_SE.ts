import { GameObject_SE } from "./utils/GameObject_SE";
import { Player_SE } from "./Player_SE";
import { dist, distVec } from "./utils/MyMath_SE";
import { Tank_SE } from "./Tank_SE";
import { Weapon_SE } from "./Weapon_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";
import { Vec2 } from "./utils/Geometry_SE";

// Shot constructor takes the weapon it was shot from as a parameter
// This class is abstract (it is not included in module.exports)
abstract class Shot_SE extends GameObject_SE {

	protected startX: number;
	protected startY: number;
	protected endPoint: { x: number; y: number; };
	protected type: string;
	protected startTime: number;
	protected weapon: Weapon_SE;
	public owner: Player_SE;
	protected removeAfterHit: boolean;
	protected game: THGame_SE;


	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(startX, startY, 0.2, 0.2);

		this.game = game;

		this.startX = startX;
		this.startY = startY;

		this.endPoint = { x: startX, y: startY };

		this.type = "unknown";

		this.startTime = Date.now();

		this.weapon = weapon;
		this.owner = weapon.owner;

		this.angle = startAng;

		this.removeAfterHit = true;
	}

	getStartPacket(): PacketShotStart {
		let packet: PacketShotStart = super.getStatePacket() as PacketShotStart;
				
		packet.type = this.type,
		packet.startX = this.startX,
		packet.startY = this.startY,
		packet.startTime = this.startTime,
		packet.ownerID = this.owner.socket.id
		
		return packet;
	}

	isBeyond() {
		return dist(this.x, this.y, this.startX, this.startY) >= dist(this.startX, this.startY, this.endPoint.x, this.endPoint.y);
	}

	abstract isHittingTank(tank: Tank_SE): boolean;

}

// APCR ------------------------------------------------------------------------------------
class APCR_SE extends Shot_SE {

	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(weapon, startX, startY, startAng, game);

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

	isHittingTank(tank: Tank_SE) {
		if (tank.body.rectCircleVSCircle((this.x + this.prevBody.cX) / 2, (this.y + this.prevBody.cY) / 2, dist(this.x, this.y, this.prevBody.cX,
			this.prevBody.cY) / 2)) {

			return tank.body.lineInt(this.x, this.y, this.prevBody.cX, this.prevBody.cY);
		}

		return false;
	}

	update(deltaSec: number) {
		GameObject_SE.prototype.update.call(this, deltaSec);
		this.remove = this.isBeyond();
	}
}

// Laser direct -------------------------------------------------------------------------------------
class LaserDirect_SE extends Shot_SE {

	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(weapon, startX, startY, startAng, game);

		this.type = "LaserDirect";
		this.removeAfterHit = false;
		this.maxSpeed = 40;
		this.fullForward();

		// Get the end point (at level border)
		var points = game.level.levelRect.simpleLineIntPoints(startX, startY, startX + Math.sin(startAng) * 10000, startY 
			- Math.cos(startAng) * 10000);
		this.endPoint = points[0];

	}

	getStartPacket() {
		var packet = super.getStartPacket();
		packet.endX = this.endPoint.x;
		packet.endY = this.endPoint.y;
		packet.speed = this.maxSpeed;
		return packet;
	}

	isHittingTank(tank: Tank_SE) {
		if (tank.owner == this.owner) return false; // This laser cannot kill its owner
		return tank.body.lineInt(this.startX, this.startY, this.x, this.y);
	}

	update(deltaSec: number) {
		GameObject_SE.prototype.update.call(this, deltaSec);
		this.remove = this.isBeyond();
	}
}

// Flat laser -------------------------------
class FlatLaser_SE extends Shot_SE {
	
	private point1: Vec2 = new Vec2(0, 0);
	private point2: Vec2 = new Vec2(0, 0);

	private size: number = 3;

	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(weapon, startX, startY, startAng, game);

		this.type = "FlatLaser";
		this.removeAfterHit = false;
		this.maxSpeed = 20;
		this.fullForward();

		// Get the end point (at level border)
		var points = game.level.levelRect.simpleLineIntPoints(startX, startY, startX + Math.sin(startAng) * 10000, startY 
			- Math.cos(startAng) * 10000);
		this.endPoint = points[0];

		this.setPoints();

	}

	private setPoints() {
		this.point1.set(this.x + (Math.sin(this.angle + (Math.PI / 2))) * (this.size / 2), 
			this.y - (Math.cos(this.angle + (Math.PI / 2))) * (this.size / 2));

		this.point2.set(this.x + (Math.sin(this.angle - (Math.PI / 2))) * (this.size / 2), 
			this.y - (Math.cos(this.angle - (Math.PI / 2))) * (this.size / 2));
	}

	getStartPacket() {
		var packet = super.getStartPacket();
		packet.endX = this.endPoint.x;
		packet.endY = this.endPoint.y;
		packet.speed = this.maxSpeed;
		return packet;
	}

	isHittingTank(tank: Tank_SE) {
		if (tank.owner == this.owner) return false; // This laser cannot kill its owner
		return tank.body.lineInt(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
	}

	update(deltaSec: number) {
		GameObject_SE.prototype.update.call(this, deltaSec);
		this.setPoints();
		this.remove = this.isBeyond();
	}
}

// Bouncing shot -------------------------------
class Bouncer_SE extends Shot_SE {
	
	protected maxLength: number = 50;
	private maxBounces: number = 5;
	protected wayPoints: WayPoint[] = [];
	private totalDist: number = 0;
	protected currentBounce: number = 0;

	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE, findPath: boolean = true) {
		super(weapon, startX, startY, startAng, game);

		this.type = "Bouncer";
		this.removeAfterHit = true;
		this.maxSpeed = 10;
		this.fullForward();

		if (findPath)
			this.createWayPoints();

		
	}

	createWayPoints() {
		// Get the end points (at level border)
		let currLength = 0;
		let currBounces = 0;
		let nextStartX = this.startX;
		let nextStartY = this.startY;
		let nextDirX = this.direction.x;
		let nextDirY = this.direction.y;

		// Add the start point
		this.wayPoints.push({x: nextStartX, y: nextStartY, ang: Math.atan2(nextDirX, -nextDirY)});

		while (currLength < this.maxLength)
		{
			let point = this.game.level.wallCheckLoop(nextStartX, nextStartY, nextDirX, nextDirY);
			let newLength = dist(point.x, point.y, nextStartX, nextStartY);

			if (currLength + newLength > this.maxLength) {
				// Well this was too much far away => make it short
				newLength = this.maxLength - currLength;
				point.x = nextStartX + nextDirX * newLength;
				point.y = nextStartY + nextDirY * newLength;
			}


			nextDirX = this.game.level.dirXBounce(point.x, nextDirX);
			nextDirY = this.game.level.dirYBounce(point.y, nextDirY);

			nextStartX = point.x + 0.001 * (nextDirX / Math.abs(nextDirX));
			nextStartY = point.y + 0.001 * (nextDirY / Math.abs(nextDirY));

			currLength += newLength;

			this.wayPoints.push({x: point.x, y: point.y, ang: Math.atan2(nextDirX, -nextDirY)});
		}

	}

	getStartPacket() {
		var packet = super.getStartPacket();
		packet.endX = this.endPoint.x;
		packet.endY = this.endPoint.y;
		packet.speed = this.maxSpeed;
		packet.pts = this.wayPoints;
		return packet;
	}

	isHittingTank(tank: Tank_SE) {
		if (tank.body.rectCircleVSCircle((this.x + this.prevBody.cX) / 2, (this.y + this.prevBody.cY) / 2, dist(this.x, this.y, this.prevBody.cX,
			this.prevBody.cY) / 2)) {

			return tank.body.lineInt(this.x, this.y, this.prevBody.cX, this.prevBody.cY);
		}

		return false;
	}

	update(deltaSec: number) {
		GameObject_SE.prototype.update.call(this, deltaSec);
		this.totalDist += this.distOfFrameMove();

		// Check if it is finished
		if (this.totalDist >= this.maxLength) {
			this.remove = true;
			return;
		}

		// Get the length of current line
		let lineDist = distVec(this.wayPoints[this.currentBounce] as any, this.wayPoints[this.currentBounce + 1] as any);
		let shotFromPointDist = dist(this.wayPoints[this.currentBounce].x, this.wayPoints[this.currentBounce].y, this.x, this.y);

		if (shotFromPointDist >= lineDist) { // Next bounce line
			this.currentBounce++;
			this.setPos(this.wayPoints[this.currentBounce].x, this.wayPoints[this.currentBounce].y);
			this.angle = this.wayPoints[this.currentBounce].ang;
		}

		
	}
}

// Bouncing laser
class BouncingLaser_SE extends Bouncer_SE {

	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(weapon, startX, startY, startAng, game);

		this.maxSpeed = 35;
		this.fullForward();

		this.type = "BouncingLaser";
	}

	isHittingTank(tank: Tank_SE) {

		// In case this tank is owner, check just laser's current end position
		if (tank.owner == this.owner) {
			return tank.body.rotContains(this.x, this.y);
		}
		
		// If it is someone else, check all laser lines
		for (let i = 0; i <= this.currentBounce; i++) {

			let pt1 = this.wayPoints[this.currentBounce];
			let pt2 = this.wayPoints[this.currentBounce + 1];

			if (tank.body.lineInt(pt1.x, pt1.y, pt2.x, pt2.y)) {
				return true;
			}
			
		}

		return false;
		
	}
}

class PolygonalBouncer_SE extends Bouncer_SE {
	
	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(weapon, startX, startY, startAng, game);

		this.type = "PolygonalBouncer";
	}
}

class Splinter_SE extends Shot_SE {
	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(weapon, startX, startY, startAng, game);
	}

	isHittingTank(tank: Tank_SE) {
		// Same as apcr, use that method
		return APCR_SE.prototype.isHittingTank.call(this, tank);	
	}
}

class Eliminator_SE extends Bouncer_SE {

	private splinterCount: number = 20;
	private splinterTime: number = 2000;

	private maxSplinterSpeed = 40;
	private minSplinterSpeed = 2;

	private blasted: boolean = false;

	private splintersData: { speed: number, ang: number }[] = [];

	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(weapon, startX, startY, startAng, game, false);

		this.type = "Eliminator";

		this.maxLength = 10;
		this.maxSpeed = 5;

		this.createWayPoints();
		this.fullForward();

		// Generate splinters data
		for (let i = 0; i < this.splinterCount; i++) {
			this.splintersData.push(
				{ 	
					speed: Math.random() * (this.maxSplinterSpeed - this.minSplinterSpeed) + this.minSplinterSpeed,
					ang: Math.random() * Math.PI * 2
				}
			);		
		}
	}

	getStartPacket() {
		var packet = super.getStartPacket() as PacketEliminatorStart;
		packet.endX = this.endPoint.x;
		packet.endY = this.endPoint.y;
		packet.speed = this.maxSpeed;
		packet.spl = this.splintersData;
		packet.splTime = this.splinterTime;
		return packet;
	}

	blast() {
		for (let i = 0; i < this.splintersData.length; i++) {

			let newSpl = new Splinter_SE(this.weapon, this.x, this.y, this.splintersData[i].ang, this.game);
			newSpl.maxSpeed = this.splintersData[i].speed;
			newSpl.fullForward();
			this.game.shoot(newSpl, false);
			let splDist = newSpl.speed * (this.splinterTime / 1000);
			this.endPoint = { x: this.startX + (this.direction.x * splDist), y: this.startY + (this.direction.y * splDist) };
		}

		this.remove = true;
		this.blasted = true;

		let hitPacket: PacketShotHit = {
			blast: true, dmg: 0, kill: false, plID: "", rm: true, shotID: this.id, x: this.x, y: this.y
		} 

		this.game.emitHit(hitPacket);

	}

	update(deltaSec: number) {
		super.update(deltaSec);

		if (this.remove) {
			this.blast();
			this.weapon.wornOut = true;
		}
		
	}
}

class Mine_SE extends Shot_SE {

	protected active: boolean = false;

	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number, game: THGame_SE) {
		super(weapon, startX, startY, startAng, game);
		
		this.body.setSize(1, 1);
		this.type = "Mine";
		this.removeAfterHit = true;

		setTimeout(() => { this.active = true; }, 1000); // Activate after one second

	}

	isHittingTank(tank: Tank_SE) {
		if (!this.active) return false;
		return this.body.circularIntersect(tank.body);
	}
}




var Shots: { [key: string]:  any } = {
 	APCR_SE: APCR_SE,
	LaserDirect_SE: LaserDirect_SE,
	FlatLaser_SE: FlatLaser_SE,
	Bouncer_SE: Bouncer_SE,
	BouncingLaser_SE: BouncingLaser_SE,
	PolygonalBouncer_SE: PolygonalBouncer_SE,
	Eliminator_SE: Eliminator_SE,
	Mine_SE: Mine_SE
 }

 export { Shots, LaserDirect_SE, APCR_SE, Shot_SE, FlatLaser_SE, Bouncer_SE, BouncingLaser_SE, Eliminator_SE, Mine_SE };

