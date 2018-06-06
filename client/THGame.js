class THGame {

	constructor() {
		this.players = {};
		this.playerMe = null;
		this.shots = {};
		this.running = false;
		this.level = null;
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

		// Move shots
		// var skeys = Object.keys(this.shots);
		// for (var i = 0; i < skeys.length; i++) {
		// 	this.shots[skeys[i]].interpolate();
		// }
	}

	addPlayer(player) {
		this.players[player.id] = player;
	}

	removePlayer(player) {
		this.players[player.id].removeTank();
		delete this.players[player.id];
	}

	start() {
		this.running = true;
		console.log("Game is running!");
	}

	processStateInfo(data) {
		if (!this.running) return;

		for (var i = 0; i < data.players.length; i++) {
			if (!this.players[data.players[i].id]) { // Create the players as it's not yet in the game
				this.players[data.players[i].id] = new Player(new DefaultTank(), data.players[i].id);
				this.players[data.players[i].id].tank.addToScene();
				// check if its me
				if (data.players[i].id == socket.id) {
					this.playerMe = this.players[data.players[i].id];
					console.log("I found myself!");
					this.setCamera();
				}

			} else { // Tank already exists, do standard process
				this.players[data.players[i].id].tank.positionServerUpdate(data.players[i].posX, data.players[i].posY);
				this.players[data.players[i].id].tank.rotationServerUpdate(data.players[i].rot);
				this.players[data.players[i].id].tank.rotationTurretServerUpdate(data.players[i].turrRot);
			}
		}
			
		for (var i = 0; i < data.shots.length; i++) {
			if (!this.shots[data.shots[i].id]) continue;
			this.shots[data.shots[i].id].remX = data.shots[i].posX * game.sizeCoeff;
			this.shots[data.shots[i].id].remY = data.shots[i].posY * game.sizeCoeff;
		}	
	}

	processNewShot(data) {
		if (!this.running) return;
		var type = data.type;
		var sh = new Shots[type](data);
		this.shots[data.id] = sh;
	};

	processLevel(data) {
		this.level = data;
		// Create borders 
		for (var i = 0; i < this.level.borders.length; i++) {
			var border = this.level.borders[i];
			var borderSprite = new Phaser.Sprite(game, game.sizeCoeff * border.cX, game.sizeCoeff * border.cY, "blackRect");
			borderSprite.width =  game.sizeCoeff * border.w;
			borderSprite.height = game.sizeCoeff * border.h;
			console.log("Border: " + (border.cX * game.sizeCoeff) + ", " + (border.cY * game.sizeCoeff) + ", " + 
				(border.w * game.sizeCoeff) + ", " + (border.h * game.sizeCoeff));
			borderSprite.anchor.setTo(0.5, 0.5);

			game.add.existing(borderSprite);		
		}

		// Set world bounds
		var woffset = 200;
		game.world.setBounds(-woffset, -woffset, (this.level.levelRect.w * game.sizeCoeff) + 2*woffset, 
			(this.level.levelRect.h * game.sizeCoeff) + 2*woffset);

		// Create wall sprites
		for (var x = 0; x < this.level.walls.length; x++) {
			for (var y = 0; y < this.level.walls[x].length; y++) {
				for (var i = 0; i < 2; i++) {

					var wallData = this.level.walls[x][y][i];
					if (wallData) {
						var wallSprite = new Phaser.Sprite(game, wallData.cX * game.sizeCoeff, wallData.cY * game.sizeCoeff, "blackRect");
						wallSprite.anchor.setTo(0.5, 0.5);
						wallSprite.width = wallData.w * game.sizeCoeff;
						wallSprite.height = wallData.h * game.sizeCoeff;
						game.add.existing(wallSprite);

					}	
				}
			}
		}

		console.log("Level is here!");
	};

	setCamera() {
		game.camera.follow(this.playerMe.tank);
		game.camera.lerp.setTo(0.1, 0.1);
	}

}
