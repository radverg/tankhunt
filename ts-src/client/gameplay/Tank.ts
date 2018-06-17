/// <reference path="../refs.ts" />

abstract class Tank extends Sprite {
	public player: Player | null = null;

	public frameStart: number = 1;

	private _defaultColor: number = Color.Red
	private _color: number = Color.Red;

	protected turret: Sprite;


	constructor(asset: string) {
		super(TH.game, 0, 0, asset);
		
		this.color = Color.Red;
	}

	set defaultColor(val: number) { this._defaultColor = val; }
	set color(val: number) { 
		this._color = val;
		this.frameStart = val * (this.framesInRow || 1);
		this.frame = this.frameStart;
	}

	

	updateTurret() {
		this.turret.x = this.x;
		this.turret.y = this.y;
	}

	rotationTurretServerUpdate(rot: number) {
		this.turret.rotationServerUpdate(rot);
	}

	addToScene() {
		TH.game.add.existing(this);
		TH.game.add.existing(this.turret);
		//if (!visible) this.kill();
	}

	applyStatePacket(packet) {
		this.rotationServerUpdate(packet.rot);
		this.rotationTurretServerUpdate(packet.turrRot);
		this.positionServerUpdate(packet.x, packet.y);
	}

	/**
	 * Sets immediatelly tank's position, rotation and turret rotation to remote values, without interpolation
	 */
	jumpToRemote() {
		this.x = this.remX;
		this.y = this.remY;
		this.rotation = this.remAngle;
		this.turret.jumpToRemote();
		this.updateTurret();
	}

	kill(): any {
		super.kill();
		this.turret.kill();
	}

	revive(): any {
		super.revive();
		this.turret.revive();
	}

	hide() {
		this.visible = false;
		this.turret.visible = false;
	}

	show() {
		this.visible = true;
		this.turret.visible = true;
	}
}