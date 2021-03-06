class THGame_CL {
    
	public game: Phaser.Game = TH.game;
	public socketManager: SocketManager_CL;
	public running: boolean = false;
	public level: Level_CL = new Level_CL();
	public remove: boolean = false;

	protected background: Phaser.TileSprite = null;
	protected levelGroup: Phaser.Group = null;
	protected itemGroup: ItemGroup_CL = null;

	public shotGroup: ShotGroup_CL = null;
	public playerGroup: PlayerGroup_CL = null;

	private cameraArrowControl: boolean = false;
	private cameraMoveSpeed: number = 4;

	private camSpeed: number = 4;

	// Phaser signals - game interface can listen to them and react -------------------------------------
	onItemSpawn: Phaser.Signal = new Phaser.Signal();
	onPlayerRemove: Phaser.Signal = new Phaser.Signal();
	onRespawn: Phaser.Signal = new Phaser.Signal();
	onNewPlayer: Phaser.Signal = new Phaser.Signal();
	onGameFinish: Phaser.Signal = new Phaser.Signal();
	onGameInfo: Phaser.Signal = new Phaser.Signal();
	onGameStart: Phaser.Signal = new Phaser.Signal();
	onLeave: Phaser.Signal = new Phaser.Signal();
	onMeItemUse: Phaser.Signal = new Phaser.Signal();
	onChat: Phaser.Signal = new Phaser.Signal();
	/**
	 * First argument is item that was collecte and second argument is collector (player object)
	 */
	onItemCollect: Phaser.Signal = new Phaser.Signal();
	/**
	 * Hit packet from the server is passed as argument, second argument is player that was hit
	 */
	onHit: Phaser.Signal = new Phaser.Signal();
	/**
	 * Player_CL object is passed as an argument
	 */
	onNewPlayerConnected: Phaser.Signal = new Phaser.Signal();
	/**
	 * Player_CL object is first argument, PacketHeal second
	 */
	onHeal: Phaser.Signal = new Phaser.Signal();
	// ----------------------------------------------------------------------------------------------------

	constructor(socketManager: SocketManager_CL) {
		
		this.socketManager = socketManager;
		TH.thGame = this;
		this.init();
		TH.effects.initPool();
	}

	update() {
		this.playerGroup.updateTanks();
		
		// Camera control
		if (!this.game.camera.target) {
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
				this.game.camera.y -= this.camSpeed;
			}

			if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
				this.game.camera.y += this.camSpeed;
			}

			if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
				this.game.camera.x -= this.camSpeed;
			}

			if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
				this.game.camera.x += this.camSpeed;
			}
		}
	}

	debug()  {
		// if (TH.timeManager.ping)
		// 	TH.game.debug.text(TH.timeManager.ping.toString(), 10, 1000); 
    }

	processPlayerRemove(playerID: string) {
		let player = this.playerGroup.getPlayer(playerID);
		this.onPlayerRemove.dispatch(player);
		
		if (player.me) {
			this.destroy();
			this.game.state.start("menu");
		} else  {
			this.shotGroup.tidyPlayerShots(player);
			this.playerGroup.removePlayer(playerID);
		}
	}

	processItemUse(data: any) {
		// This player just used an item
		this.onMeItemUse.dispatch();
    };

	start() {
		this.running = true;
		console.log("Game is running!");
	}

	processStateInfo(data: PacketMovable) {

		if (!this.running) return;
		this.playerGroup.stateUpdate(data);	
	}

	processNewShot(data: PacketShotStart) {

		if (!this.running) return;
		data.ownerObj = this.playerGroup.getPlayer(data.ownerID);
		this.shotGroup.newShot(data);
	};

	processNewItem(data: PacketItem) {

		let newItem = new Item_CL(data.x, data.y, data.typeIndex);
		this.itemGroup.addItem(newItem, data.id);
		this.onItemSpawn.dispatch(newItem);
	}

	processItemCollect(data: PacketItemCollect) {
		
		var item = this.itemGroup.getItem(data.id);
		if (!item) return;

		var collector = this.playerGroup.getPlayer(data.playerID);

		if (collector === this.playerGroup.me) {
			// This happens if item was collected by THIS player
			TH.effects.playAudio(SoundNames.RELOAD);
		}
		item.getCollected();
		this.onItemCollect.dispatch(item, collector);		
	}

	processGameInfo(data: PacketGameInfo) {
		// Generate players
		for (var pl in data.players) {
			
			if (!this.playerGroup.getPlayer(data.players[pl].id)) {
				this.newPlayerFromPacket(data.players[pl], false);
			}
		}

		// Generate items
		for (var it in data.items) {
			if (!this.itemGroup.getItem(data.items[it].id))
				this.processNewItem(data.items[it]);
		}

		this.onGameInfo.dispatch();
	}

	processNewPlayer(data: PacketPlayerInfo) {

		if (this.playerGroup.getPlayer(data.id)) return;
		this.newPlayerFromPacket(data);
	}

	processHit(data: PacketShotHit) {

		let shot = this.shotGroup.getShot(data.shotID);
		let playerHit = this.playerGroup.getPlayer(data.plID);
		let playerAtt = this.playerGroup.getPlayer(data.plAttID);

		if (data.blast && shot) {
			shot.blast(data);
		}

		if (data.rm && shot) {
			shot.stop();
		}

		if (!playerHit) return;
		
		let tank = playerHit.tank;
		tank.health = data.healthAft;

		// If tank is not visible at the moment of destruction, move it to the position
		// received from packet hit
		if (!tank.visible) {
			tank.positionServerUpdate(data.xTank, data.yTank);
			tank.jumpToRemote();
		}

		if (data.healthAft < data.healthBef) {
			// Damage effect
			TH.effects.shotDamageEffect(data.x * TH.sizeCoeff || tank.x , (data.y * TH.sizeCoeff) || tank.y);
			TH.effects.playAudio(SoundNames.SHOTSMALL, playerHit.tank);
		}
		else  {
			// Bounce effect
			TH.effects.shotDebrisEffect(data.x * TH.sizeCoeff || tank.x , (data.y * TH.sizeCoeff) || tank.y);
			TH.effects.playAudio(SoundNames.CINK, playerHit.tank);
		}

		if (tank.health == 0) {
			
			tank.kill();

			// Handle multikill effect
			if (shot && playerHit !== this.playerGroup.me) {
				shot.killCount++;
				if (shot.killCount > 1 && shot.getOwner() === this.playerGroup.me) {
					shot.killCount = -100;
					TH.game.time.events.add(700, function() { TH.effects.playAudio(SoundNames.MULTIKILL); });
				}
			}
		}

		playerAtt.stats.countHit(playerAtt, playerHit, data.healthBef, data.healthAft);

		this.onHit.dispatch(data, playerHit);
	}

	processChatMessage(data: PacketChatMessage) {
		this.onChat.dispatch(data);
	}

	processHeal(data: PacketHeal) {
		let plr = this.playerGroup.getPlayer(data.plID);

		if (plr) {
			plr.tank.maxHealth = data.maxHealthAft
			plr.tank.health = data.healthAft;

			this.onHeal.dispatch(plr, data);
		}
	}

	processLevel(data: PacketLevel) {
		
		if (!this.level) {
			this.level = new Level_CL();
		}

		if (data.json) {
			this.level.fromJSON(data.json, this.levelGroup);
		} else {
			// This happens when level is specified by a name
			this.level.fromJSON(Levels[data.name], this.levelGroup);
		}

		console.log(`Level is here! Payload: ${JSON.stringify(data).length} characters | bytes`);
	};


	processAppear(data: PacketAppear) {
		let plr = this.playerGroup.getPlayer(data.plID);
		if (!plr) return;

		if (plr.isEnemyOf(this.playerGroup.me)) {
			plr.tank.show();
			plr.tank.positionServerUpdate(data.atX * TH.sizeCoeff, data.atY * TH.sizeCoeff)
			plr.tank.jumpToRemote();
		} else {
			plr.tank.alphaShow();

		}
	}

	processDisappear(data: PacketDisappear) {

		let plr = this.playerGroup.getPlayer(data.plID);
		if (!plr) return;

		if (plr.isEnemyOf(this.playerGroup.me)) {

			plr.tank.hide();
		} else {

			plr.tank.alphaHide();
		}
	}

	processRespawn(data: PacketRespawn) { };
	processGameFinish(data: PacketGameFinish) { };
	processCapture(data: PacketCapture) { };

	setCameraFollow() {
		this.cameraArrowControl = false;
		TH.game.camera.follow(this.playerGroup.me.tank);
		TH.game.camera.lerp.setTo(0.1, 0.1);
	}

	setCameraFree() {
		this.cameraArrowControl = true;
		this.game.camera.unfollow();
	}

	newPlayerFromPacket(packet: PacketPlayerInfo, dispatchConnected: boolean = true) {

		var tank = new DefaultTank_CL();
		var player = new Player_CL(packet.id, tank, packet.name);
		player.team = packet.team || null;
		player.stats.importPacket(packet.stats);

		if (packet.tank) {
            tank.applyStatePacket(packet.tank);
            tank.jumpToRemote();
		}

		tank.health = packet.health;
		tank.maxHealth = packet.maxHealth;

		this.playerGroup.addPlayer(player);

		// Check if its me
		if (packet.socketID == this.socketManager.getID()) { // If so, make tank blue and bind camera with this
			this.playerGroup.setMe(player);
			(player.tank as DefaultTank_CL).initEngineSound();
			this.setCameraFollow();
		} else { 
			this.playerGroup.setEnemy(player);
        }
        
        // Hide it in case its not alive
        if (!packet.alive) {
            tank.hide();
		}
		
		if (dispatchConnected)
			this.onNewPlayerConnected.dispatch(player);

		this.onNewPlayer.dispatch(player);

		return player;	
	}

	/**
	 * Destroys items and shots
	 */
	tidy() {
		this.shotGroup.clear();
		this.itemGroup.clear();
	}

	/**
	 * Stops the game, nulls the references and disposes signals
	 */
	destroy() {

		TH.thGame = null;
		this.remove = true;
		this.running = false;
		this.tidy();
		this.shotGroup.destroy(true);
		this.playerGroup.players = null;
		this.playerGroup.destroy(true);
		this.itemGroup.destroy(true);
		this.levelGroup.destroy(true);

		this.onGameFinish.dispose();
		this.onGameInfo.dispose();
		this.onHeal.dispose();
		this.onGameStart.dispose();
		this.onHit.dispose();
		this.onItemCollect.dispose();
		this.onItemSpawn.dispose();
		this.onLeave.dispose();
		this.onNewPlayer.dispose();
		this.onNewPlayerConnected.dispose();
		this.onPlayerRemove.dispose();
		this.onRespawn.dispose();
		this.onChat.dispose();
		this.onMeItemUse.dispose();
	}

	leaveToMenu() {
		this.onLeave.dispatch();
	}

	/**
	 * Create Phaser.Groups for game objects
	 * this have to be called after phaser instance in TH.game is initialized
	 */
	init() {

		// Create first layer level
		this.levelGroup = TH.game.add.group();
		// Then we have items
		this.itemGroup = new ItemGroup_CL();
		// Than we have players
		this.playerGroup = new PlayerGroup_CL();
		// Than we have shots 
		this.shotGroup = new ShotGroup_CL();
	}

}
