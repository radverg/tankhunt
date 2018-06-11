

class LoadManager  {
	
	constructor() {
		var imagesPath = "assets/images/";

		// Assets ----------------------------------------------------------------------------
		this.images = [
			{ assetName: "blackRect", path: imagesPath + "blackRect.png" },
			{ assetName: "whiteRect", path: imagesPath + "whiteRect.png" },
			{ assetName: "defaultTurret", path: imagesPath + "default_turret.png" },
			{ assetName: "tankBody", path: imagesPath + "tank_body.png" },
			{ assetName: "ammo", path: imagesPath + "ammo.png" }
		];
		
		this.spritesheets = [
			
		];
		// -----------------------------------------------------------------------------------	
	}
	
	preload() {
		// Load images --------------------------------
		for (var i = 0; i < this.images.length; i++) {
			var img = this.images[i];
			game.load.image(img.assetName, img.path);
		}
		// --------------------------------------------
		
	}
	
	create() {
		game.state.start("play");
	}
}