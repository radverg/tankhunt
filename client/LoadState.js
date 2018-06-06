

var LoadState = {
	// Assets ----------------------------------------------------------------------------
		images: [
			{ assetName: "blackRect", path: "images/blackRect.png" },
			{ assetName: "defaultTurret", path: "images/default_turret.png" },
			{ assetName: "tankBody", path: "images/tank_body.png" }
		],

		spritesheets: [

		],
	// -----------------------------------------------------------------------------------

	preload: function() {
		// Load images --------------------------------
		for (var i = 0; i < this.images.length; i++) {
			var img = this.images[i];
			game.load.image(img.assetName, img.path);
		}
		// --------------------------------------------

	},

	create: function() {
		game.state.start("play");
	}
}