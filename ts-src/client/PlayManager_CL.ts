/// <reference path="refs.ts" />

class PlayManager_CL  {

    public th: TH;
    public thGame: THGame_CL;

	constructor(tankhunt: TH) {
		this.th = tankhunt;

		// Create test game
		this.thGame = new Arena_CL(tankhunt.socketManager);
	}

	preload() { }

	// This method is called by Phaser when switching to PlayState
	create() {
		TH.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        TH.game.scale.pageAlignHorizontally = true;
        TH.game.world.setBounds(-400, -400, 3000, 2000);
        this.initInput();
        TH.game.stage.backgroundColor = "#ffffff";
        TH.game.stage.disableVisibilityChange = true;
        this.thGame.start();
	}

	// This method is called by Phaser, it's the main game loop
	update() {
		if (this.thGame.running) {
			this.thGame.update();
		}
	}

	render() {
		// Debug shit here
	}

	initInput() {
		var callback = (key: Phaser.Key) => {
			this.sendInput(key);
		}

		// Init keys
        var up = TH.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(callback); up.onUp.add(callback);
        up.name = "inpForw";

        var down = TH.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(callback); down.onUp.add(callback);
        down.name = "inpBackw";

        var right = TH.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(callback); right.onUp.add(callback);
        right.name = "inpRight";

        var left = TH.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		left.onDown.add(callback); left.onUp.add(callback);
        left.name = "inpLeft";

        var turrLeft = TH.game.input.keyboard.addKey(Phaser.Keyboard.A);
        turrLeft.onDown.add(callback); turrLeft.onUp.add(callback);
        turrLeft.name = "inpTurrLeft";

        var turrRight = TH.game.input.keyboard.addKey(Phaser.Keyboard.D);
        turrRight.onDown.add(callback); turrRight.onUp.add(callback);
        turrRight.name = "inpTurrRight";

        var shot = TH.game.input.keyboard.addKey(Phaser.Keyboard.S);
        shot.onDown.add(callback); 
        shot.name = "inpShot";

        var shotBouncing = TH.game.input.keyboard.addKey(Phaser.Keyboard.W);
        shotBouncing.onDown.add(callback);
        shotBouncing.name = "inpShotBouncing";

        var shotSpecial = TH.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        shotSpecial.onDown.add(callback);
        shotSpecial.name = "inpShotSpecial"; shot.onUp.add(callback);
	}

	sendInput(key: Phaser.Key) {
		var type = (key.isDown) ? key.name + "On" : key.name + "Off";
		this.th.socketManager.emitInput(type);
	}
}