/// <reference path="../refs.ts" />

class THGame_CL {
    
	public socketManager: SocketManager_CL;
	public running: boolean = false;
	public level: any = null;

	protected background: Phaser.TileSprite = null;
	protected levelGroup: Phaser.Group = null;
	protected itemGroup: ItemGroup_CL = null;
	shotGroup: ShotGroup_CL = null;
	playerGroup: PlayerGroup_CL = null;

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

	onGameInfo: Phaser.Signal = new Phaser.Signal();

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

		// TH.game.debug.cameraInfo(TH.game.camera, 10, 500, "black");

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

	newPlayerFromPacket(packet: PacketPlayerInfo, dispatchEvent: boolean = true) {
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

		TH.effects.shotDebrisEffect(data.x * TH.sizeCoeff || tank.x , (data.y * TH.sizeCoeff) || tank.y);

		if (tank.health == 0) {
			// If tank is not visible in the moment of destruction, move it to the position
			// sent in packet hit
			if (!tank.visible && data.xTank) {
				tank.positionServerUpdate(data.xTank, data.yTank);
				tank.jumpToRemote();
			}

			if (playerAtt !== playerHit) { 
				playerAtt.stats.kills++;
				playerAtt.stats.inRow++;
			}
			tank.kill();
		}

		this.onHit.dispatch(data, playerHit);
		
	}

	processHeal(data: PacketHeal) {
		let plr = this.playerGroup.getPlayer(data.plID);

		if (plr) {
			plr.tank.maxHealth = data.maxHealthAft
			plr.tank.health = data.healthAft;

			this.onHeal.dispatch(plr, data);
		}
	}

	processLevel(data: any) {
		this.level = data;
		// Create borders 
		for (var i = 0; i < this.level.borders.length; i++) {
			var border = this.level.borders[i];
			var borderSprite = new Phaser.Sprite(TH.game, TH.sizeCoeff * border.cX, TH.sizeCoeff * border.cY, "blackRect");
			
			borderSprite.width =  TH.sizeCoeff * border._w;
			borderSprite.height = TH.sizeCoeff * border._h;
			console.log("Border: " + (border.cX * TH.sizeCoeff) + ", " + (border.cY * TH.sizeCoeff) + ", " + 
				(border._w * TH.sizeCoeff) + ", " + (border._h * TH.sizeCoeff));
			borderSprite.anchor.setTo(0.5, 0.5);

			this.levelGroup.add(borderSprite);		
		}

		// Set world bounds
		var woffset = 200;
		TH.game.world.setBounds(-woffset, -woffset, (this.level.levelRect._w * TH.sizeCoeff) + 2*woffset, 
			(this.level.levelRect._h * TH.sizeCoeff) + 2*woffset);

		// Now add background
		let bcg = TH.game.make.tileSprite(0, 0, TH.game.world.width - woffset *2,  TH.game.world.height - woffset*2, "ground1",0) ;
		this.levelGroup.add(bcg);


		// Create wall sprites
		for (var x = 0; x < this.level.walls.length; x++) {
			for (var y = 0; y < this.level.walls[x].length; y++) {
				for (var i = 0; i < 2; i++) {

					var wallData = this.level.walls[x][y][i];
					if (wallData) {
						var wallSprite = new Phaser.Sprite(TH.game, wallData.cX * TH.sizeCoeff, wallData.cY * TH.sizeCoeff, "wall1");
						wallSprite.anchor.setTo(0.5, 0.5);

						wallSprite.width = wallData._w * TH.sizeCoeff;
						wallSprite.height = 18;
					//	wallSprite.scale.setTo();

						if (wallData._w < wallData._h) { // Horizontal
							wallSprite.rotation = Math.PI / 2;
							 wallSprite.width = wallData._h * TH.sizeCoeff;
						} 
						
						this.levelGroup.add(wallSprite);

					}	
				}
			}
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


	setCamera() {
		
		TH.game.camera.follow(this.playerGroup.me.tank);
		TH.game.camera.lerp.setTo(0.1, 0.1);
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
