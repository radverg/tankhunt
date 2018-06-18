/// <reference path="../refs.ts" />

class THGame_CL {

	public socketManager: SocketManager_CL;
	public players: any = {};
	public playerMe: Player_CL | null = null;
	public shots: any = {};
	public items: any = {};
	public running: boolean = false;
	public level: any = null;

	constructor(socketManager: SocketManager_CL) {
		this.socketManager = socketManager;
	
	}

	update() {
		// Move and rotate players
		var pkeys = Object.keys(this.players);
		for (var i = 0; i < pkeys.length; i++) {
			this.players[pkeys[i]].tank.interpolate();
			this.players[pkeys[i]].tank.interpolateAngle();
			this.players[pkeys[i]].tank.updateTurret();
			this.players[pkeys[i]].tank.turret.interpolateAngle();
		}
	}

	addPlayer(player: Player_CL) {
		this.players[player.id] = player;
	}

	/**
	 * Determines if player with this id is in the game
	 * @param {string} id Id of desired player
	 */
	hasPlayer(id: string) {
		return this.players[id];
	}

	removePlayer(player: Player_CL) {
		this.players[player.id].removeTank();
		delete this.players[player.id];
	}

	start() {
		this.running = true;
		console.log("Game is running!");
	}

	newPlayerFromPacket(packet: PacketPlayerInfo) {
	}

	processStateInfo(data) {
		if (!this.running) return;

		for (var i = 0; i < data.players.length; i++) {
			if (!this.hasPlayer(data.players[i].plID)) continue;
		
			this.players[data.players[i].plID].tank.applyStatePacket(data.players[i]);			
		}
	}

	processNewShot(data) {
		if (!this.running) return;
		var type = data.type;
		var sh = new Shots[type](data);
		this.shots[data.id] = sh;
	};

	processNewItem(data) {
		this.items[data.id] = new Item_CL(data.x, data.y, data.typeIndex);
	}

	processItemCollect(data) {
		// Collector id is in data.playerID
		if (this.items[data.id]) {
			this.items[data.id].getCollected();
		}
	}

	processGameInfo(data) {
		// Generate players
		for (var pl in data.players) {
			
			if (!this.hasPlayer(data.players[pl].id)) {
				this.newPlayerFromPacket(data.players[pl]);
			}
		}

		// Generate items
		for (var it in data.items) {
			if (!this.items[data.items[it].id])
				this.processNewItem(data.items[it]);
		}
	}

	processNewPlayer(data) {
		if (this.players[data.id]) return;
		this.newPlayerFromPacket(data);
	}

	processKill(data) {

		if (this.hasPlayer(data.killedID)) {
			this.players[data.killedID].tank.kill();
		}

	}

	processLevel(data) {
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

			TH.game.add.existing(borderSprite);		
		}

		// Set world bounds
		var woffset = 200;
		TH.game.world.setBounds(-woffset, -woffset, (this.level.levelRect.w * TH.sizeCoeff) + 2*woffset, 
			(this.level.levelRect.h * TH.sizeCoeff) + 2*woffset);

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
						TH.game.add.existing(wallSprite);

					}	
				}
			}
		}

		console.log("Level is here!");
	};

	processRespawn(data) {
		
	}

	setCamera() {
		TH.game.camera.follow(this.playerMe.tank);
		TH.game.camera.lerp.setTo(0.1, 0.1);
	}

}
