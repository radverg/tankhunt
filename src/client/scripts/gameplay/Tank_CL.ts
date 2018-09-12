
abstract class Tank_CL extends Sprite {
	public player: Player_CL | null = null;

	public frameStart: number = 1;

	protected turret: Sprite;
	shadow: Phaser.Sprite;

	protected tankSpr: Phaser.Sprite;

	
	private showTween: Phaser.Tween;
	private hideTween: Phaser.Tween;

	constructor(asset: string) {
		super(TH.game, 0, 0, asset);

		this.maxHealth = 1;
		this.health = 1;

		this.shadow = this.game.make.sprite(0, 0, "shadow");
		this.shadow.anchor.setTo(0.5);
		
	}

	rotationTurretServerUpdate(rot: number) {
		this.turret.rotationServerUpdate(rot - this.remAngle);
	}


	applyStatePacket(packet: PacketTank) {
		this.rotationServerUpdate(packet.rot);
		this.rotationTurretServerUpdate(packet.turrRot);
		this.positionServerUpdate(packet.x, packet.y);
	}

	applyTinyStatePacket(packet: PacketTankTiny) {
		this.rotationServerUpdate(packet.r);
		this.rotationTurretServerUpdate(packet.t);
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
		this.visible = false;
		this.turret.visible = false;
		this.shadow.visible = false;
		
		if (this.inCamera) {
			this.game.camera.shake(0.01);
		}

		if (this.player.me) {
			this.game.camera.unfollow();
		}

		this.explosionEffect();
	}

	revive(): any {
		this.visible = true;
		this.shadow.revive();
		this.turret.revive();

		if (this.player && this.player.me) {
			this.game.camera.follow(this);
			this.game.camera.lerp.setTo(0.1);
		}
	}

	destroy(): any {
		super.destroy(true);
		this.shadow.destroy();
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

	alphaShow() {
		this.alpha = 1;
		this.shadow.alpha = 1;
	}

	alphaHide() {
		this.alpha = 0.5;
		this.shadow.alpha = 0.2;
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

		// Update shadow if any so it follows the tank and rotates
		if (this.shadow) {
			this.shadow.x = this.x;
			this.shadow.y = this.y;

			this.shadow.visible = this.visible;
			this.shadow.rotation = this.rotation;
		}

	}

	addToGroup(grp: Phaser.Group) {
		grp.add(this.shadow);
		grp.add(this);
	}

	isMovingBackward() {
		//let dist = this.game.math.distance(this.previousPosition.x, this.previousPosition.y, this.x, this.y);
		let moveAngle = this.game.math.normalizeAngle(this.game.math.angleBetweenPointsY(this.previousPosition, this.position));
		let forwardAngle = this.game.math.normalizeAngle(this.rotation);
	}

	isMoving() {
		return !(Math.round(this.previousPosition.x) === Math.round(this.position.x) &&
			Math.round(this.previousPosition.y) === Math.round(this.position.y)); //  !this.previousPosition.fuzzyEquals(this.position, 0.05);
	}

	isRotating() {
		return this.rotation !== this.previousRotation;
	}

	shotExplodeEffect(shot: Shot_CL) {
		if (!TH.effects.should(shot)) return;

		let ang = (this.visible) ? this.turret.rotation + this.rotation : shot.rotation;
		let dist = this.turret.height / 1.3;

		let x = (this.visible) ? this.x + Math.sin(ang) * dist : shot.x; 
		let y = (this.visible) ? this.y - Math.cos(ang) * dist : shot.y;
		let rnd = Math.floor(Math.random() * 5) + 1;

		let explodeSpr = this.game.add.sprite(x, y, `shotExplode${rnd}`);
		explodeSpr.anchor.setTo(0.5);
		explodeSpr.scale.setTo(0.4);
		explodeSpr.rotation = ang;

		let expAnim = explodeSpr.animations.add("shotExplode", null, 60);
		expAnim.onComplete.add(function() { this.destroy(); }, explodeSpr);
		expAnim.play();

	}

	explosionEffect() {

		// Now play sound effect
		// Choose randomly
		let soundName = (Math.random() > 0.5) ? SoundNames.EXPLOSION1 : SoundNames.EXPLOSION2;
		TH.effects.playAudio(soundName, this);

		if (!TH.effects.should(this)) return;

		// Set up explosion animation 
		let rnd = Math.floor(Math.random() * 5) + 1;
		let explosionSpr = this.game.add.sprite(this.x, this.y, `explosion${rnd}`);
		explosionSpr.anchor.setTo(0.5);
		let expAnim = explosionSpr.animations.add("expAnim", null, 50);
		expAnim.onComplete.add(function() { this.destroy(); }, explosionSpr);
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

		

	}
}