var PlayState = {

	THGame: new THGame(),
	myID: null,

	preload: function() {
	
	},

	create: function() {
		var that = this;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.world.setBounds(-400, -400, 3000, 2000);
        this.initInput();
        game.stage.backgroundColor = "#ffffff";
        game.stage.disableVisibilityChange = true;
        this.THGame.start();
	},

	update: function() {
		if (this.THGame.running) {
			this.THGame.update();
		}
	},

	render: function() {
		

	},

	onGameStateInfo: function(data) {
		this.THGame.processStateInfo(data);
	},

	onNewShot: function(data) {
		this.THGame.processNewShot(data);
	},

	onLevel: function(data) {
		this.THGame.processLevel(data);
	},

	onStartInfo : function(data) {
		for (var i = 0; i < data.players.length; i++) {
			var spr = game.add.sprite(0, 0, "weapItem");
			this.players[data.players[i].id] = spr;

		}		
	},

	onRemovePlayer: function(data) {
		if (this.THGame.players[data]) this.THGame.removePlayer(this.THGame.players[data]);
	},

	initInput: function() {
		// Init keys
        var up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(this.sendInput); up.onUp.add(this.sendInput);
        up.name = "inpForw";

        var down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(this.sendInput); down.onUp.add(this.sendInput);
        down.name = "inpBackw";

        var right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(this.sendInput); right.onUp.add(this.sendInput);
        right.name = "inpRight";

        var left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		left.onDown.add(this.sendInput); left.onUp.add(this.sendInput);
        left.name = "inpLeft";

        var turrLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
        turrLeft.onDown.add(this.sendInput); turrLeft.onUp.add(this.sendInput);
        turrLeft.name = "inpTurrLeft";

        var turrRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
        turrRight.onDown.add(this.sendInput); turrRight.onUp.add(this.sendInput);
        turrRight.name = "inpTurrRight";

        var shot = game.input.keyboard.addKey(Phaser.Keyboard.S);
        shot.onDown.add(this.sendInput); 
        shot.name = "inpShot";

        var shotBouncing = game.input.keyboard.addKey(Phaser.Keyboard.W);
        shotBouncing.onDown.add(this.sendInput);
        shotBouncing.name = "inpShotBouncing";

        var shotSpecial = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        shotSpecial.onDown.add(this.sendInput);
        shotSpecial.name = "inpShotSpecial"; shot.onUp.add(this.sendInput);


	},

	sendInput: function(key) {
		var type = (key.isDown) ? key.name + "On" : key.name + "Off";
		socket.emit("input", type);
	}



}