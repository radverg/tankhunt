/// <reference path="../refs.ts" />

abstract class Tank_CL extends Sprite {
	public player: Player_CL | null = null;

	public frameStart: number = 1;

	protected turret: Sprite;

	
	private showTween: Phaser.Tween;
	private hideTween: Phaser.Tween;

	constructor(asset: string) {
		super(TH.game, 0, 0, asset);

		this.maxHealth = 1;
		this.health = 1;
		
	}

	rotationTurretServerUpdate(rot: number) {
		this.turret.rotationServerUpdate(rot - this.remAngle);
	}

	// addToScene(group: Phaser.Group) {
	// 	group.add(this);
	// 	TH.game.add.existing(this.turret);
	// 	if (!visible) this.kill();
	// }

	applyStatePacket(packet: PacketTank) {
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
		
		//this.turret.jumpToRemote();
		//this.updateTurret();
	}

	setColor(colorIndex: number) {
		this.colorIndex = colorIndex;
		this.turret.colorIndex = colorIndex;
	}

	setDefaultColor(colorIndex: number) {
		this.defaultColorIndex = colorIndex;
		this.turret.defaultColorIndex = colorIndex;
	}

	kill(): any {
		super.kill();
		this.turret.kill();

		if (this.player.stats.maxRow < this.player.stats.inRow) {
			this.player.stats.maxRow = this.player.stats.inRow;
		}

		this.player.stats.deaths++;
		this.player.stats.inRow = 0;
		this.explosionEffect();
	}

	revive(): any {
		super.revive();
		this.turret.revive();
	}

	destroy(): any {
		super.destroy(true);
		this.turret.destroy();
	}

	hide(animate: boolean = true) {
		this.visible = false;
		this.turret.visible = false;
	}

	show(animate: boolean = true) {
		this.visible = true;
		this.turret.visible = true;
	}

	interpolationUpdate() {
		this.interpolate();
		this.interpolateAngle();
		//this.updateTurret();
		this.turret.interpolateAngle();
	}

	update() {
		this.interpolationUpdate();

		// Update player view, if any
		if (this.player.plView) {

			this.player.plView.x = this.x;
			this.player.plView.y = this.y;

			this.player.plView.visible = this.visible;
		}

	}

	shotExplodeEffect() {
		let ang = this.turret.rotation + this.rotation;
		let dist = this.turret.height / 1.3;

		let x = this.x + Math.sin(ang) * dist; 
		let y = this.y - Math.cos(ang) * dist;
		let rnd = Math.floor(Math.random() * 5) + 1;

		let explodeSpr = this.game.add.sprite(x, y, `shotExplode${rnd}`);
		explodeSpr.anchor.setTo(0.5);
		explodeSpr.scale.setTo(0.5);
		explodeSpr.rotation = ang;

		let expAnim = explodeSpr.animations.add("shotExplode", null, 40);
		expAnim.onComplete.add(function() { this.destroy(); }, expAnim);
		expAnim.play();

	}

	explosionEffect() {

		// Firstly, hide this sprite - effect will be created from new sprites
		this.hide();

		// Set up explosion animation 
		let explosionSpr = this.game.add.sprite(this.x, this.y, "explosion");
		explosionSpr.anchor.setTo(0.5);
		let expAnim = explosionSpr.animations.add("expAnim", null, 50);
		expAnim.onComplete.add(function() { this.destroy(); }, expAnim);
		expAnim.play();

		// Now animate parts of tank, there are six parts of tank
		let duration = 1000;
		for (let i = 0; i < 6; i++) {
			// Create part
			let partSpr = this.game.add.sprite(this.x, this.y, "tankParts", i + ((this.frameStart / this.framesInRow) * 6) );
			partSpr.anchor.setTo(0.5);

			// Rotate part
			let angDir = (Math.random() > 0.5) ? -1 : 1;
			let toAng = Math.random() * Math.PI * 8 * angDir;
			
			// Move part
			let moveAng = Math.random() * Math.PI * 2;
			let moveDist = TH.sizeCoeff * 2 + Math.random() * TH.sizeCoeff * 3;
			let toPos = { x: this.x + Math.sin(moveAng) * moveDist, y: this.y - Math.cos(moveAng) * moveDist };
			
			// Final tween
			let twn = this.game.add.tween(partSpr).to({ x: toPos.x, y: toPos.y, rotation: toAng, alpha: 0 }, duration);
			twn.onComplete.add(function() { this.destroy(); }, partSpr);
			twn.start();
		}

		// Now lets animate turret, if any
		if (this.turret) {
			let turretSpr = this.game.add.sprite(this.x, this.y, this.turret.key, this.turret.frame);
			turretSpr.width = this.turret.width;
			turretSpr.height = this.turret.height;
			turretSpr.anchor.setTo(this.turret.anchor.x, this.turret.anchor.y * Math.random());

			let angDir = (Math.random() > 0.5) ? -1 : 1;
			let toAng = Math.random() * Math.PI * 8 * angDir;

			let moveAng = Math.random() * Math.PI * 2;
			let moveDist = TH.sizeCoeff * 2 + Math.random() * TH.sizeCoeff * 3;
			let toPos = { x: this.x + Math.sin(moveAng) * moveDist, y: this.y - Math.cos(moveAng) * moveDist };

			let twn = this.game.add.tween(turretSpr).to({ x: toPos.x, y: toPos.y, rotation: toAng, alpha: 0 }, duration);
			twn.onComplete.add(function() { this.destroy(); }, turretSpr);
			twn.start();
		}

		// Now play sound effect
		this.game.sound.play("explosion1_sound");

	}
}