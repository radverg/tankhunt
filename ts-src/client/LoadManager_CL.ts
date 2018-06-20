/// <reference path="refs.ts" />

class LoadManager_CL  {

	private images: ImageAsset[];
	private spritesheets: SpritesheetAsset[];
	private th: TH;
	
	constructor(th: TH) {
		this.th = th;
		var imagesPath = "assets/images/";

		// Assets ----------------------------------------------------------------------------
		this.images = [
			{ assetName: "blackRect", path: imagesPath + "blackRect.png" },
			{ assetName: "whiteRect", path: imagesPath + "whiteRect.png" },
			{ assetName: "defaultTurret", path: imagesPath + "default_turret.png" },
			{ assetName: "ammo", path: imagesPath + "ammo.png" }
		];
		
		this.spritesheets = [
			{ assetName: "tankBodys", path: imagesPath + "tank_bodys.png", frameSizeX: 96, frameSizeY: 138, frameCount: 4 },
			
		];
		// -----------------------------------------------------------------------------------	
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
		
	}
	
	create() {
		// Phaser is completely loaded - call method on TankHunt class
		this.th.onPhaserLoad();

		TH.game.state.start("play");
	}
}

interface ImageAsset {
	assetName: string,
	path: string
}

interface SpritesheetAsset extends ImageAsset {
	frameSizeX: number,
	frameSizeY: number,
	frameCount: number
}