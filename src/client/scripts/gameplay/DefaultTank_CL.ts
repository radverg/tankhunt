class DefaultTank_CL extends Tank_CL {

	// Properties for exhaust effect management
	private leftExSpr: Phaser.Sprite = null;
	private rightExSpr: Phaser.Sprite = null;

	private rightExTween: Phaser.Tween = null;
	private leftExTween: Phaser.Tween = null;
	//-----------------------------------------

	// Sound instance references
	private engineSound: Phaser.Sound;
	private turretEngineSound: Phaser.Sound;

	private currAnimName: string = "tracks1";

	constructor() {
		super("tankBodys");

		this.anchor.setTo(0.5);
		this.width = TH.sizeCoeff;
		this.height = 1.4375 * TH.sizeCoeff;

		this.shadow.width = this.width + 20;
		this.shadow.height = this.height + 20;

		this.framesInRow = 4;
		this.frameStart = 0;

		// Create and setup turret
		this.turret = new Sprite(TH.game, this.x, this.y, "defaultTurrets");
		this.turret.anchor.setTo(0.5, 0.8453);
		this.turret.width = 0.825 * TH.sizeCoeff;
		this.turret.height = 0.825 * 3.23 * TH.sizeCoeff;

		this.addChild(this.turret);

		this.onColorChange.add((val: number) => { this.adjustTrackAnim(val); }, this);

		this.initExhaustAnim();
		this.initTrackAnim();

		this.onIntMoveStart.add(this.startExhaustEffect, this);
		this.onIntMoveStop.add(this.stopExhaustEffect, this);
	}

	/**
	 * Tank's core update method, responsible for interpolating angles and positions,
	 * playing audio and animations, etc...
	 */
	update() {

		super.update();

		if (this.isMoving() || this.isRotating()) {
			this.animations.play(this.currAnimName);
		} else {
			this.animations.stop(this.currAnimName);
		}

		if (this.turretEngineSound) {
			if (this.turret.isRotating()) {
				if (!this.turretEngineSound.isPlaying) {

					TH.effects.playAudio(SoundNames.ENGINETURRET);
				}
			}
			else if (this.turretEngineSound.isPlaying) {

				TH.effects.stopAudio(SoundNames.ENGINETURRET);	
			}
		}
	}

	// Tracks management ---------------------------------------
	initTrackAnim() {

		let fps = 20;

		this.animations.add("tracks1", [0, 1, 2, 3], fps); //, true);
		this.animations.add("tracks2", [4, 5, 6, 7], fps); //, true);
		this.animations.add("tracks3", [8, 9, 10, 11], fps); //, true);
		this.animations.add("tracks4", [12, 13, 14, 15], fps); //, true);
	}

	adjustTrackAnim(colorIndex: number) {
		let currAnim = this.animations.getAnimation(this.currAnimName);
		if (!currAnim) return;
		let startNext = currAnim.isPlaying;
		currAnim.stop();

		this.frame = this.frameStart;
		this.currAnimName = `tracks${colorIndex + 1}`;
		if (startNext)
			this.animations.play(this.currAnimName);

	}
	// ----------------------------------------------------

	// Exhaust management ---------------------------------
	initExhaustAnim() {

		let exLeftSpr = this.game.make.sprite(TH.sizeCoeff * 0.3 + TH.sizeCoeff * 1.5, TH.sizeCoeff * 3.6, "exhaust");
		let exRightSpr = this.game.make.sprite(-TH.sizeCoeff * 0.3 + TH.sizeCoeff * 1.5, TH.sizeCoeff * 3.6, "exhaust2");

		// Set blend mode so the smokes do not overlap but mix
		exLeftSpr.blendMode = PIXI.blendModes.MULTIPLY;
		exRightSpr.blendMode = PIXI.blendModes.MULTIPLY;

		this.leftExSpr = exLeftSpr;
		this.rightExSpr = exRightSpr;

		exLeftSpr.rotation = Math.PI;
		exRightSpr.rotation = Math.PI;
			
		exLeftSpr.alpha = 0.2;
		exRightSpr.alpha = 0.2;

		this.leftExTween = this.game.add.tween(exLeftSpr);
		this.rightExTween = this.game.add.tween(exRightSpr);

		exLeftSpr.animations.add("blow", null, 20, true);
		exRightSpr.animations.add("blow", null, 40, true);

		exLeftSpr.animations.play("blow");
		exRightSpr.animations.play("blow");

		this.addChild(exLeftSpr);
		this.addChild(exRightSpr);
	}

	private startExhaustEffect() {
		this.rightExTween.stop();
		this.leftExTween.stop();

		this.rightExTween = this.game.add.tween(this.rightExSpr).to({ alpha: 0.8 }, 500, Phaser.Easing.Default, true);
		this.leftExTween = this.game.add.tween(this.leftExSpr).to({ alpha: 0.8 }, 500, Phaser.Easing.Default, true);

		if (this.engineSound) {
			this.engineSound.fadeTo(250, 0.15);
		}
	}

	private stopExhaustEffect() {
		this.rightExTween.stop();
		this.leftExTween.stop();

		this.rightExTween = this.game.add.tween(this.rightExSpr).to({ alpha: 0.2 }, 500, Phaser.Easing.Default, true);
		this.leftExTween = this.game.add.tween(this.leftExSpr).to({ alpha: 0.2 }, 500, Phaser.Easing.Default, true);

		if (this.engineSound) {
			this.engineSound.fadeTo(250, 0.0001);
		}
	}
	// -----------------------------------------------------

	/**
	 * Called only for current players' tank, others have no sounds
	 */
	initEngineSound() {
		this.engineSound = TH.effects.getSound(SoundNames.ENGINELOW);
		this.engineSound.loop = true;
		this.engineSound.play(SoundNames.ENGINELOW, null, 0.0001, true);

		this.turretEngineSound = TH.effects.getSound(SoundNames.ENGINETURRET);
	}

	destroy() {
		super.destroy();
		if (this.engineSound)
			this.engineSound.stop();
	}
}
