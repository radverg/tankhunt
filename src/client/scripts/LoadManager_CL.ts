/// <reference path="refs.ts" />

class LoadManager_CL  {

	private images: ImageAsset[];
	private spritesheets: SpritesheetAsset[];
	private audio: AudioAsset[];
	private th: TH;
	
	constructor(th: TH) {
		this.th = th;
		var imagesPath = "images/";
		var soundsPath = "sounds/";

		// Assets ----------------------------------------------------------------------------
		this.images = [
			{ assetName: "blackRect", path: imagesPath + "blackRect.png" },
			{ assetName: "whiteRect", path: imagesPath + "whiteRect.png" },
			{ assetName: "ammo", path: imagesPath + "ammo.png" },
			{ assetName: "ground1", path: imagesPath + "ground_1.png" },
			{ assetName: "shadow", path: imagesPath + "shadow_box.png" },
			{ assetName: "mine", path: imagesPath + "mine.png" },
			{ assetName: "wall1", path: imagesPath + "wall1.png" },
			{ assetName: "wallSide", path: imagesPath + "wall_side.png" },
			{ assetName: "wallSide1", path: imagesPath + "wall_side1.png" },
			{ assetName: "wallShadow", path: imagesPath + "wall_shadow.png"},
			{ assetName: "ball", path: imagesPath + "ball.png" },


		];
		
		this.spritesheets = [
			{ assetName: "tankBodys", path: imagesPath + "tank_bodys_pokus.png", frameSizeX: 94, frameSizeY: 135, frameCount: 16 },
			{ assetName: "defaultTurrets", path: imagesPath + "default_turrets.png", frameSizeX: 60, frameSizeY: 194, frameCount: 4 },	
			{ assetName: "items", path: imagesPath + "items.png", frameSizeX: 46, frameSizeY: 46, frameCount: 8 },	
			{ assetName: "lasers", path: imagesPath + "lasers.png", frameSizeX: 20, frameSizeY: 20, frameCount: 3 },
			{ assetName: "exhaust", path: imagesPath + "exhaust.png", frameSizeX: 200, frameSizeY: 200, frameCount: 35 },
			{ assetName: "exhaust2", path: imagesPath + "exhaust2.png", frameSizeX: 200, frameSizeY: 200, frameCount: 35 },
			{ assetName: "smoke", path: imagesPath + "smoke.png", frameSizeX: 200, frameSizeY: 200, frameCount: 16, precreate: true },
			{ assetName: "tankParts", path: imagesPath + "tank_parts.png", frameSizeX: 94, frameSizeY: 137, frameCount: 18 },
			{ assetName: "shotDamage", path: imagesPath + "shot_damage.png", frameSizeX: 150, frameSizeY: 150, frameCount: 21, precreate: true },

			{ assetName: "shot", path: imagesPath + "bullets.png", frameSizeX: 23, frameSizeY: 81, frameCount: 4, precreate: true },

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
			{ assetName: "panels", path: imagesPath + "panels.png", frameSizeX: 190, frameSizeY: 49, frameCount: 3 }


		];

		this.audio = [
			{ assetName: "explosion1_sound", path: [soundsPath + "explosion1.ogg", soundsPath + "explosion1.wav"] },
			{ assetName: "laser1_sound", path: [soundsPath + "laser1.ogg", soundsPath + "laser1.wav"] },
			{ assetName: "laser2_sound", path: [soundsPath + "laser2.ogg", soundsPath + "laser2.wav"] },
			{ assetName: "laser3_sound", path: [soundsPath + "laser3.ogg", soundsPath + "laser3.wav"] },
			{ assetName: "bum1_sound", path: [soundsPath + "bum1.ogg", soundsPath + "bum1.wav"] },


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

		// Loading screen -
		let preloadSprite = TH.game.add.sprite(TH.game.world.centerX, 800, "loadBar");
		preloadSprite.anchor.setTo(0.5);
		TH.game.load.setPreloadSprite(preloadSprite);

		TH.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		
	}
	
	create() {
		// Precreate 
		for (var i in this.spritesheets) {
			var sheet = this.spritesheets[i];
			if (!sheet.precreate) continue;

			let spr = TH.game.add.sprite(0, 0, sheet.assetName);
			console.log("creating");
		}

		TH.game.time.events.add(500, function() { console.log("event"); TH.game.state.start("menu"); });

		//TH.game.state.start("menu");
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
 