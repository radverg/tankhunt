
class PlayManager_CL extends Phaser.State  {

    public th: TH;
    public thGame: THGame_CL;
    private pingerTimer: Phaser.Timer;

    private first: boolean = true;

	constructor(tankhunt: TH) {
        super();
		this.th = tankhunt;

	}

	preload() { }

	// This method is called by Phaser when switching to PlayState
	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.world.setBounds(-400, -400, 3000, 2000);
        this.stage.backgroundColor = "#D4DBE1";
        this.stage.disableVisibilityChange = true;

        if (this.thGame && this.thGame.remove) {
            this.thGame = null;
            TH.thGame = null;
        }


        this.initInput();
        this.input.keyboard.enabled = false;

        // Code below happens only once

        if (!this.first) return;

        this.th.loadManager.precreate();

        this.pingerTimer = TH.game.time.create(false);
        this.pingerTimer.loop(3000, TH.timeManager.synchronizeRequest, TH.timeManager);
        this.pingerTimer.start(1000);

        this.game.onResume.add(this.gameResumed, this);

        this.first = false;
        
        // Everything is ready => send game request
        console.log("Requesting game...");
       
     
    }

    gameResumed() {
        if (!this.thGame) return;
      
        // let twns = this.game.tweens.getAll();

        // for (const twn of twns) {
        //     if (twn.)
        //     twn.stop(true);
        // }

        //this.time.removeAll();
    }
    
    processGameStart(packet: PacketGameStart) {
        this.world.removeAll(true);
        if (packet.gameType == "Arena") {
            console.log("Starting arena!");
            this.thGame = new Arena_CL(this.th.socketManager, packet);
        } else if (packet.gameType == "Duel") {
            this.thGame = new Duel_CL(this.th.socketManager, packet);
        } else if (packet.gameType == "TeamFight") {
            this.thGame = new TeamFight_CL(this.th.socketManager, packet as PacketTeamGameStart);
        }
        else {
            console.log("Unknown game type!");
            return;
        }

        this.camera.flash(0x000000, 1000);

        $(this.game.canvas).show();
        $("#menuCont").hide();
        this.input.keyboard.enabled = true;
    }

	// This method is called by Phaser, it's the main game loop
	update() {
		if (this.thGame && this.thGame.running) {
			this.thGame.update();
		}
	}

    // This method is called by Phaser, useful for debugging
	render() {
        if (this.thGame && this.thGame.running) {
            this.thGame.debug();
        }
	}

	initInput() {
		var callback = (key: Phaser.Key) => {
			this.sendInput(key);
		}

		// Init keys
        var up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(callback); up.onUp.add(callback);
        up.name = "inpForw";

        var down = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(callback); down.onUp.add(callback);
        down.name = "inpBackw";

        var right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(callback); right.onUp.add(callback);
        right.name = "inpRight";

        var left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		left.onDown.add(callback); left.onUp.add(callback);
        left.name = "inpLeft";

        var turrLeft = this.input.keyboard.addKey(Phaser.Keyboard.A);
        turrLeft.onDown.add(callback); turrLeft.onUp.add(callback);
        turrLeft.name = "inpTurrLeft";

        var turrRight = this.input.keyboard.addKey(Phaser.Keyboard.D);
        turrRight.onDown.add(callback); turrRight.onUp.add(callback);
        turrRight.name = "inpTurrRight";

        var shot = this.input.keyboard.addKey(Phaser.Keyboard.S);
        shot.onDown.add(callback); 
        shot.name = "inpShot";

        var shotBouncing = this.input.keyboard.addKey(Phaser.Keyboard.W);
        shotBouncing.onDown.add(callback);
        shotBouncing.name = "inpShotBouncing";

        var shotSpecial = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        shotSpecial.onDown.add(callback);
        shotSpecial.name = "inpShotSpecial"; shot.onUp.add(callback);
	}

	sendInput(key: Phaser.Key) {
		var type = (key.isDown) ? key.name + "On" : key.name + "Off";
		this.th.socketManager.emitInput(type);
	}
}