
class LoadManager_CL extends Phaser.State  {

	private images: ImageAsset[];
	private spritesheets: SpritesheetAsset[];
	private audio: AudioAsset[];
	private th: TH;

	private useItnetworkDelay: boolean = false;
	private itnetworkDelay: number = 4000;

	private startTime = Date.now();
	
	constructor(th: TH) {
		super();
		this.th = th;
		var imagesPath = "images/";
		var soundsPath = "sounds/";

		// Assets ----------------------------------------------------------------------------
		this.images = [
			{ assetName: "blackRect", path: imagesPath + "blackRect.png" },
			{ assetName: "whiteRect", path: imagesPath + "whiteRect.png" },

			// Grounds
			{ assetName: "ground1", path: imagesPath + "ground1.png" },
			{ assetName: "ground2", path: imagesPath + "ground2.png" },
			{ assetName: "ground3", path: imagesPath + "ground3.png" },
			{ assetName: "ground4", path: imagesPath + "ground4.png" },
			{ assetName: "ground5", path: imagesPath + "ground5.png" },
			{ assetName: "ground6", path: imagesPath + "ground6.png" },
			{ assetName: "ground7", path: imagesPath + "ground7.png" },

			{ assetName: "shadow", path: imagesPath + "shadow_box.png" },
			{ assetName: "mine", path: imagesPath + "mine.png" },
			
			{ assetName: "ball", path: imagesPath + "ball.png" },


		];
		
		this.spritesheets = [
			{ assetName: "tankBodys", path: imagesPath + "tank_bodys_pokus.png", frameSizeX: 94, frameSizeY: 135, frameCount: 16 },
			{ assetName: "defaultTurrets", path: imagesPath + "default_turrets.png", frameSizeX: 60, frameSizeY: 194, frameCount: 4 },	
			{ assetName: "items", path: imagesPath + "items.png", frameSizeX: 54, frameSizeY: 54, frameCount: 9 },	
			{ assetName: "lasers", path: imagesPath + "lasers.png", frameSizeX: 20, frameSizeY: 20, frameCount: 3 },
			{ assetName: "exhaust", path: imagesPath + "exhaust.png", frameSizeX: 200, frameSizeY: 200, frameCount: 35 },
			{ assetName: "exhaust2", path: imagesPath + "exhaust2.png", frameSizeX: 200, frameSizeY: 200, frameCount: 35 },
			{ assetName: "smoke", path: imagesPath + "smoke.png", frameSizeX: 200, frameSizeY: 200, frameCount: 16, precreate: true },
			{ assetName: "tankParts", path: imagesPath + "tank_parts.png", frameSizeX: 94, frameSizeY: 137, frameCount: 18 },
			{ assetName: "shotDamage", path: imagesPath + "shot_damage.png", frameSizeX: 150, frameSizeY: 150, frameCount: 21, precreate: true },

			{ assetName: "shot", path: imagesPath + "bullets.png", frameSizeX: 23, frameSizeY: 81, frameCount: 4, precreate: true },
			{ assetName: "shotDarker", path: imagesPath + "bullets_darker.png", frameSizeX: 23, frameSizeY: 81, frameCount: 4, precreate: true },

			{ assetName: "shotExplode1", path: imagesPath + "shot_explode1.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
			{ assetName: "shotExplode2", path: imagesPath + "shot_explode2.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
			{ assetName: "shotExplode3", path: imagesPath + "shot_explode3.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
			{ assetName: "shotExplode4", path: imagesPath + "shot_explode4.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
			{ assetName: "shotExplode5", path: imagesPath + "shot_explode5.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },

			{ assetName: "explosion1", path: imagesPath + "explosion1.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
			{ assetName: "explosion2", path: imagesPath + "explosion2.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
			{ assetName: "explosion3", path: imagesPath + "explosion3.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
			{ assetName: "explosion4", path: imagesPath + "explosion4.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
			{ assetName: "explosion5", path: imagesPath + "explosion5.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },

			{ assetName: "medals", path: imagesPath + "medals.png", frameSizeX: 64, frameSizeY: 64, frameCount: 3 },
			{ assetName: "panels", path: imagesPath + "panels.png", frameSizeX: 190, frameSizeY: 49, frameCount: 3 },

			{ assetName: "wallSideTriple", path: imagesPath + "wall_side_triple.png", frameSizeX: 1187, frameSizeY: 94, frameCount: 3 },
			{ assetName: "wallSideTripleAdv", path: imagesPath + "side_wall_triple_adv.png", frameSizeX: 1778, frameSizeY: 108, frameCount: 3 },

			// Wall test
			{ assetName: "wallTest", path: imagesPath + "wall_test.png", frameSizeX: 580, frameSizeY: 120, frameCount: 3 },


			{ assetName: "wallTriple", path: imagesPath + "wall_triple.png", frameSizeX: 272, frameSizeY: 24, frameCount: 3 },

			{ assetName: "wallDebris", path: imagesPath + "wall_debris.png", frameSizeX: 40, frameSizeY: 40, frameCount: 10 },
			{ assetName: "wallDebrisDarker", path: imagesPath + "wall_debris_darker.png", frameSizeX: 40, frameSizeY: 40, frameCount: 10 }


		];

		this.audio = [
			{ assetName: "explosion1_sound", path: [soundsPath + "explosion1.ogg", soundsPath + "explosion1.wav"] },
			{ assetName: "laser1_sound", path: [soundsPath + "laser1.ogg", soundsPath + "laser1.wav"] },
			{ assetName: "laser2_sound", path: [soundsPath + "laser2.ogg", soundsPath + "laser2.wav"] },
			{ assetName: "laser3_sound", path: [soundsPath + "laser3.ogg", soundsPath + "laser3.wav"] },
			{ assetName: "bum1_sound", path: [soundsPath + "bum1.ogg", soundsPath + "bum1.wav"] },
			{ assetName: "test", path: [soundsPath + "test.ogg"] },
		]
		// -----------------------------------------------------------------------------------	

		let win = window as any;
		win.WebFontConfig = {
			google: {
				families: [
					'Revalia',
					'Fredoka One',
					'Orbitron'
				]
			},

			active: function() { console.log("Google fonts loaded!"); }
		}
	}
	
	preload() {

		TH.game.stage.backgroundColor = 0x222326; // 0xd4dbe1;
		// Load images --------------------------------
		for (var z = 0; z < this.images.length; z++) {
			var img = this.images[z];
			TH.game.load.image(img.assetName, img.path);
		}
		// --------------------------------------------

		// Load spritesheets --------------------------
		for (var i in this.spritesheets) {
			var sheet = this.spritesheets[i];
			TH.game.load.spritesheet(sheet.assetName, sheet.path, sheet.frameSizeX, sheet.frameSizeY, sheet.frameCount);
		}

		// Load audio --------------------------------
		for (let i = 0; i < this.audio.length; i++) {
			var audio = this.audio[i];
			TH.game.load.audio(audio.assetName, audio.path);
			
		}

		// Load google web fonts
		TH.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		let centerX = this.camera.view.centerX;
		// Loading screen -
		let preloadBg = TH.game.add.sprite(0, 950, "loadBar");
		let loadBarWidth = preloadBg.width; //TH.game.width / 0.8;
		preloadBg.x = TH.game.world.centerX - loadBarWidth / 2;
		preloadBg.anchor.y = 0.5;
		preloadBg.tint = 0x444444;
		let preloadSprite = TH.game.add.sprite(TH.game.world.centerX - loadBarWidth / 2, preloadBg.y, "loadBar");
		preloadSprite.anchor.setTo(0, 0.5);
		TH.game.load.setPreloadSprite(preloadSprite);

		// Loading text
		let loadingText = this.add.text(centerX, preloadBg.y, "Loading...");
		loadingText.anchor.setTo(0.5);
		loadingText.fontSize = 20;
		loadingText.fill = "white";

		// Logo
		// let logo = this.add.sprite(this.camera.view.centerX, 0, "logoBig");
		
		// Itnetwork splash
		let itSplash = this.add.sprite(centerX, 20, "itSplash");
		itSplash.anchor.setTo(0.5, 0);

		// Full screen text
		let fsText = this.add.text(centerX, 810, "Set fullscreen mode - press F11 (in most browsers)");
		fsText.anchor.setTo(0.5);
		fsText.fill = "#ffc58e";
		fsText.fontSize = 40;

		// Help text
		let helpText = this.add.text(centerX, 860, "Press CTRL key anytime to show info panel (controls)");
		helpText.anchor.setTo(0.5);
		helpText.fill = "#ffc58e";
		helpText.fontSize = 35;

		// Created text
		let crText = this.add.text(centerX, 990, "2018 - Created by Radek Veverka, Vojtěch Veverka, Dominik Plachý");
		crText.anchor.setTo(0.5);
		crText.fontSize = 19;
		crText.fill = "white";


		TH.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		TH.game.scale.pageAlignHorizontally = true;

		
	}
	
	create() {

		// Audio
		let audioSpr = this.game.add.audio("test");
		TH.effects.sounds = audioSpr;
		audioSpr.allowMultiple = true;
		audioSpr.addMarker("mark1", 0, 1.9);
		audioSpr.addMarker("mark2", 2, 4.5);
		audioSpr.addMarker("mark3", 5, 55);


		let loadTime = Date.now() - this.startTime;

		if (loadTime <= this.itnetworkDelay && this.useItnetworkDelay) {
			TH.game.time.events.add(this.itnetworkDelay - loadTime, this.switchToMenu, this);
		} else {
			this.switchToMenu();
		}

	}

	private switchToMenu() {
		this.state.start("menu");
	}

	precreate() {
 
		for (var i in this.spritesheets) {
			var sheet = this.spritesheets[i];
			if (!sheet.precreate) continue;

			let spr = TH.game.add.sprite(0, 0, sheet.assetName);
		}
	}
}

interface ImageAsset {
	assetName: string,
	path: string
}

interface SpritesheetAsset extends ImageAsset {
	frameSizeX: number,
	frameSizeY: number,
	frameCount: number,
	precreate?: boolean
}

interface AudioAsset {
	assetName: string,
	path: string[]
}
 