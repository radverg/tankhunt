import { GameObject_SE } from "./utils/GameObject_SE";
import { Player_SE } from "./Player_SE";
import { dist } from "./utils/MyMath_SE";
import { Tank_SE } from "./Tank_SE";
import { Weapon_SE } from "./Weapon_SE";
import { THGame_SE } from "./gamemodes/THGame_SE";

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

	constructor(weapon: Weapon_SE, startX: number, startY: number, startAng: number) {
		super(startX, startY, 0.2, 0.2);

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
		super(weapon, startX, startY, startAng);

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
		super(weapon, startX, startY, startAng);

		this.type = "LaserDirect";
		this.removeAfterHit = false;
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

	isHittingTank(tank: Tank_SE) {
		if (tank.owner == this.owner) return false; // This laser cannot kill its owner
		return tank.body.lineInt(this.startX, this.startY, this.x, this.y);
	}

	update(deltaSec: number) {
		GameObject_SE.prototype.update.call(this, deltaSec);
		this.remove = this.isBeyond();
	}
}

var Shots = {
 	APCR_SE: APCR_SE,
 	LaserDirect_SE: LaserDirect_SE
 }

 export { Shots, LaserDirect_SE, APCR_SE, Shot_SE };

