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
			{ assetName: "ammo", path: imagesPath + "ammo.png" },
			{ assetName: "ground1", path: imagesPath + "ground_1.png" },
			{ assetName: "shadow", path: imagesPath + "shadow_box.png" }
		];
		
		this.spritesheets = [
			{ assetName: "tankBodys", path: imagesPath + "tank_bodys_pokus.png", frameSizeX: 94, frameSizeY: 135, frameCount: 16 },
			{ assetName: "defaultTurrets", path: imagesPath + "default_turrets.png", frameSizeX: 60, frameSizeY: 194, frameCount: 4 },	
			{ assetName: "items", path: imagesPath + "items.png", frameSizeX: 46, frameSizeY: 46, frameCount: 8 },	
			{ assetName: "lasers", path: imagesPath + "lasers.png", frameSizeX: 20, frameSizeY: 20, frameCount: 3 },
			{ assetName: "exhaust", path: imagesPath + "exhaust.png", frameSizeX: 200, frameSizeY: 200, frameCount: 35 },
			{ assetName: "exhaust2", path: imagesPath + "exhaust2.png", frameSizeX: 200, frameSizeY: 200, frameCount: 35 },
			{ assetName: "smoke", path: imagesPath + "smoke.png", frameSizeX: 200, frameSizeY: 200, frameCount: 16 }

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
