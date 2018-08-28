
class THGame_CL {
    
	public socketManager: SocketManager_CL;
	public running: boolean = false;
	public level: Level_CL = new Level_CL();
	public game: Phaser.Game = TH.game;

	protected background: Phaser.TileSprite = null;
	protected levelGroup: Phaser.Group = null;
	protected itemGroup: ItemGroup_CL = null;

	shotGroup: ShotGroup_CL = null;
	playerGroup: PlayerGroup_CL = null;

	remove: boolean = false;


	// Phaser signals - game interface can listen to them and react
	onPlayerRemove: Phaser.Signal = new Phaser.Signal();
	onItemSpawn: Phaser.Signal = new Phaser.Signal();
	/**
	 * First argument is item that was collecte and second argument is collector (player object)
	 */
	onItemCollect: Phaser.Signal = new Phaser.Signal();
	/**
	 * Hit packet from the server is passed as argument, second argument is player that was hit
	 */
	onHit: Phaser.Signal = new Phaser.Signal();
	onRespawn: Phaser.Signal = new Phaser.Signal();
	/**
	 * Player_CL object is passed as an argument
	 */
	onNewPlayer: Phaser.Signal = new Phaser.Signal();
	onNewPlayerConnected: Phaser.Signal = new Phaser.Signal();
	/**
	 * Player_CL object is first argument, PacketHeal second
	 */
	onHeal: Phaser.Signal = new Phaser.Signal();

	onGameFinish: Phaser.Signal = new Phaser.Signal();

	onGameInfo: Phaser.Signal = new Phaser.Signal();

	onGameStart: Phaser.Signal = new Phaser.Signal();

	onLeave: Phaser.Signal = new Phaser.Signal();

	onChat: Phaser.Signal = new Phaser.Signal();

	constructor(socketManager: SocketManager_CL) {
		this.socketManager = socketManager;
		TH.thGame = this;
		this.init();
	
	}

	update() {
		this.playerGroup.updateTanks();
	}

	debug()  {
		//  if (this.playerGroup.me)
		// 	TH.game.debug.spriteInfo(this.playerGroup.me.tank, 10, 10, "black");

		 //TH.game.debug.cameraInfo(TH.game.camera, 10, 500, "black");

		if (TH.timeManager.ping)
			TH.game.debug.text(TH.timeManager.ping.toString(), 10, 1000); 
    }


	processPlayerRemove(playerID: string) {
		let player = this.playerGroup.getPlayer(playerID);
		this.onPlayerRemove.dispatch(player);	
		this.playerGroup.removePlayer(playerID);
	}

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
		console.log("Item collected!");
		
		var item = this.itemGroup.getItem(data.id);
		if (!item) return;

		var collector = this.playerGroup.getPlayer(data.playerID);

		if (collector === this.playerGroup.me) {
			// This happens if item was collected by THIS player
		}
		item.getCollected();
		this.onItemCollect.dispatch(item, collector);		
		// Collector id is in data.playerID
		// if (this.items[data.id]) {
		// 	this.items[data.id].getCollected();
		// }
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

		if (data.blast) {
			shot.blast(data);
		}

		if (data.rm && shot) {
			shot.stop();
		}

		if (!playerHit) return;
		
		let tank = playerHit.tank;
		tank.health = data.healthAft;

		if (data.healthAft < data.healthBef)
			TH.effects.shotDamageEffect(data.x * TH.sizeCoeff || tank.x , (data.y * TH.sizeCoeff) || tank.y);
		else 
			TH.effects.shotDebrisEffect(data.x * TH.sizeCoeff || tank.x , (data.y * TH.sizeCoeff) || tank.y);

		if (tank.health == 0) {
			// If tank is not visible in the moment of destruction, move it to the position
			// sent in packet hit
			if (!tank.visible && data.xTank) {
				tank.positionServerUpdate(data.xTank, data.yTank);
				tank.jumpToRemote();
			}
			tank.kill();
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

	processRespawn(data: PacketRespawn) { };

	processAppear(data: PacketAppear) {
		let plr = this.playerGroup.getPlayer(data.plID);
		if (!plr) return;

		if (plr.isEnemyOf(this.playerGroup.me)) {
			plr.tank.show(true);
			plr.tank.positionServerUpdate(data.atX * TH.sizeCoeff, data.atY * TH.sizeCoeff)
			plr.tank.jumpToRemote();
		} else {
			plr.tank.alpha = 1;
		}
	}

	processDisappear(data: PacketDisappear) {
		let plr = this.playerGroup.getPlayer(data.plID);
		if (!plr) return;

		if (plr.isEnemyOf(this.playerGroup.me)) {
			plr.tank.hide(true);
		} else {
			plr.tank.alpha = 0.5;
		}
	}

	processGameFinish(data: PacketGameFinish) {
	}


	setCamera() {
		
		TH.game.camera.follow(this.playerGroup.me.tank);
		TH.game.camera.lerp.setTo(0.1, 0.1);
	}

	newPlayerFromPacket(packet: PacketPlayerInfo, dispatchConnected: boolean = true) {
		// Handle tank type in future
		var tank = new DefaultTank_CL();

		var player = new Player_CL(packet.id, tank, packet.name);
		player.stats.importPacket(packet.stats);

		if (packet.tank) {
            tank.applyStatePacket(packet.tank);
            tank.jumpToRemote();
		}

		tank.health = packet.health;
		tank.maxHealth = packet.maxHealth;

		this.playerGroup.addPlayer(player);

		// Check if its me
		if (packet.id == this.socketManager.getID()) { // If so, make tank blue and bind camera with this
			this.playerGroup.setMe(player);
			this.setCamera();
		} else { // if its an enemy, make it red
			this.playerGroup.setEnemy(player);
        }
        
        // Hide it in case its not alive
        if (!packet.alive) {
            tank.hide();
		}
		
		if (dispatchConnected)
			this.onNewPlayerConnected.dispatch(player);

		this.onNewPlayer.dispatch(player);
				
	}

	/**
	 * Destroys items and shots
	 */
	tidy() {
		this.shotGroup.clear();
		this.itemGroup.clear();
	}

	destroy() {
		TH.thGame = null;
		this.remove = true;
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

	}

	/** 
	 * Switches game state to menu state and dispatches onLeave signal
	*/
	leaveToMenu() {
		this.onLeave.dispatch();
		this.running = false;
		this.destroy();
		TH.game.state.start("menu");
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
		// Than we have shots 
		this.shotGroup = new ShotGroup_CL();
		// Than we have players
		this.playerGroup = new PlayerGroup_CL();
		
	}

}
