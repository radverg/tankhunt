/// <reference path="../refs.ts" />

class THGame_CL {
    
	public socketManager: SocketManager_CL;
	public shots: any = {};
	public running: boolean = false;
	public level: any = null;

	protected levelGroup: Phaser.Group = null;
	protected itemGroup: ItemGroup_CL = null;
	protected playerGroup: PlayerGroup_CL = null;

	onPlayerRemove: Phaser.Signal = new Phaser.Signal();
	onItemSpawn: Phaser.Signal = new Phaser.Signal();

	constructor(socketManager: SocketManager_CL) {
		this.socketManager = socketManager;
	
	}

	update() {
		// Move and rotate players
		// var pkeys = Object.keys(this.players);
		// for (var i = 0; i < pkeys.length; i++) {
		// 	this.players[pkeys[i]].tank.interpolate();
		// 	this.players[pkeys[i]].tank.interpolateAngle();
		// 	this.players[pkeys[i]].tank.updateTurret();
		// 	this.players[pkeys[i]].tank.turret.interpolateAngle();
		// }

		this.playerGroup.updateTanks();
	}

	debug()  {
		if (this.playerGroup.me)
			TH.game.debug.spriteInfo(this.playerGroup.me.tank, 10, 10, "black");
			TH.game.debug.cameraInfo(TH.game.camera, 10, 500, "black");
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

	newPlayerFromPacket(packet: PacketPlayerInfo) {
	}

	processStateInfo(data: PacketMovable) {
		if (!this.running) return;

		for (var i = 0; i < data.players.length; i++) {

			let player = this.playerGroup.getPlayer(data.players[i].plID);
			if (!player) continue;
		
			player.tank.applyStatePacket(data.players[i]);			
		}
	}

	processNewShot(data: PacketShotStart) {
		if (!this.running) return;
		var type = data.type;
		var sh = new Shots[type.toString()](data);
		this.shots[data.id] = sh;
	};

	processNewItem(data: PacketItem) {
		let newItem = new Item_CL(data.x, data.y, data.typeIndex);
		this.itemGroup.items[data.id] = newItem;
		this.onItemSpawn.dispatch(newItem);
	}

	processItemCollect(data: PacketItem) {
		// Collector id is in data.playerID
		// if (this.items[data.id]) {
		// 	this.items[data.id].getCollected();
		// }
	}

	processGameInfo(data: PacketGameInfo) {
		// Generate players
		for (var pl in data.players) {
			
			if (!this.playerGroup.getPlayer(data.players[pl].id)) {
				this.newPlayerFromPacket(data.players[pl]);
			}
		}

		// Generate items
		for (var it in data.items) {
			if (!this.itemGroup.getItem(data.items[it].id))
				this.processNewItem(data.items[it]);
		}
	}

	processNewPlayer(data: PacketPlayerInfo) {
		if (this.playerGroup.getPlayer(data.id)) return;
		this.newPlayerFromPacket(data);
	}

	processKill(data: PacketKill) {

		if (this.playerGroup.getPlayer(data.killedID)) {
			this.playerGroup.getTank(data.killedID).kill();
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

		// Create wall sprites
		for (var x = 0; x < this.level.walls.length; x++) {
			for (var y = 0; y < this.level.walls[x].length; y++) {
				for (var i = 0; i < 2; i++) {

					var wallData = this.level.walls[x][y][i];
					if (wallData) {
						var wallSprite = new Phaser.Sprite(TH.game, wallData.cX * TH.sizeCoeff, wallData.cY * TH.sizeCoeff, "blackRect");
						wallSprite.anchor.setTo(0.5, 0.5);
						wallSprite.width = wallData._w * TH.sizeCoeff;
						wallSprite.height = wallData._h * TH.sizeCoeff;
						this.levelGroup.add(wallSprite);

					}	
				}
			}
		}

		console.log("Level is here!");
	};

	processRespawn(data: PacketRespawn) { };

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
		// Than we have players
		this.playerGroup = new PlayerGroup_CL();
		
	}

}
