/// <reference path="../refs.ts" />

class DefaultTank_CL extends Tank_CL {

	// Properties for exhaust effect management
	private leftExSpr: Phaser.Sprite = null;
	private rightExSpr: Phaser.Sprite = null;

	private rightExTween: Phaser.Tween = null;
	private leftExTween: Phaser.Tween = null;
	//-----------------------------------------

	constructor() {
		super(Data.DefaultTank.asset);

		this.anchor.setTo(Data.DefaultTank.anchorX, Data.DefaultTank.anchorY);
		this.width = Data.DefaultTank.sizeX * TH.sizeCoeff;
		this.height = Data.DefaultTank.sizeY * TH.sizeCoeff;

		this.framesInRow = 4;
		this.frameStart = 0;

		this.turret = new Sprite(TH.game, this.x, this.y, "defaultTurrets");
		this.turret.anchor.setTo(0.5, 0.8453);
		this.turret.width = 0.825 * TH.sizeCoeff;
		this.turret.height = 0.825 * 3.23 * TH.sizeCoeff;

		this.addChild(this.turret);

		// Init animation of track
		let frs = this.frameStart;
	
		this.onIntMoveStart.add(() => { this.animations.play("tracks"); }, this);
		this.onIntMoveStop.add(() => { this.animations.stop("tracks"); }, this);

		

		
		this.onColorChange.add(() => { this.initTrackAnim(); }, this);

		this.initExhaustAnim();

		this.onIntMoveStart.add(this.startExhaustEffect, this);
		this.onIntMoveStop.add(this.stopExhaustEffect, this);
		
	}

	initTrackAnim() {
		let wasRunning = false;
		let anim = this.animations.getAnimation("tracks"); 
		
		if (anim) {
			wasRunning = anim.isPlaying;
			anim.destroy();
		}
		

	
		let frs = this.frameStart;
		this.animations.add("tracks", [frs, frs+1, frs+2,frs+3], 25, true);

		// let fps = 16;

		// this.animations.add("tracks1", [0, 1, 2, 3], fps, true);
		// this.animations.add("tracks2", [4, 5, 6, 7], fps, true);
		// this.animations.add("tracks3", [8, 9, 10, 11], fps, true);
		// this.animations.add("tracks4", [12, 13, 14, 15], fps, true);


		if (wasRunning) {
			this.animations.play("tracks");
		}

	}

	initExhaustAnim() {
		let exLeftSpr = this.game.make.sprite(TH.sizeCoeff * 0.3 + TH.sizeCoeff * 1.5, TH.sizeCoeff * 3.6, "exhaust");
		let exRightSpr = this.game.make.sprite(-TH.sizeCoeff * 0.3 + TH.sizeCoeff * 1.5, TH.sizeCoeff * 3.6, "exhaust2");

		this.leftExSpr = exLeftSpr;
		this.rightExSpr = exRightSpr;

		exLeftSpr.rotation = Math.PI;
		exRightSpr.rotation = Math.PI;
		
		
		
		exLeftSpr.alpha = 0.2;
		exRightSpr.alpha = 0.2;

		this.leftExTween = this.game.add.tween(exLeftSpr);
		this.rightExTween = this.game.add.tween(exRightSpr);


		let lAnim = exLeftSpr.animations.add("blow", null, 20, true);
		let rAnim = exRightSpr.animations.add("blow", null, 40, true);


		exLeftSpr.animations.play("blow");
		exRightSpr.animations.play("blow");

		this.addChild(exLeftSpr);
		this.addChild(exRightSpr);

	}

	startExhaustEffect() {
		this.rightExTween.stop();
		this.leftExTween.stop();

		this.rightExTween = this.game.add.tween(this.rightExSpr).to({ alpha: 0.8 }, 500, Phaser.Easing.Default, true);
		this.leftExTween = this.game.add.tween(this.leftExSpr).to({ alpha: 0.8 }, 500, Phaser.Easing.Default, true);

	}

	stopExhaustEffect() {
		this.rightExTween.stop();
		this.leftExTween.stop();

		this.rightExTween = this.game.add.tween(this.rightExSpr).to({ alpha: 0.2 }, 500, Phaser.Easing.Default, true);
		this.leftExTween = this.game.add.tween(this.leftExSpr).to({ alpha: 0.2 }, 500, Phaser.Easing.Default, true);

	}
}
