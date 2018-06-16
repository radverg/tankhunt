var TestGame = require("./gameplay/gamemodes/TestGame");
var Arena = require("./gameplay/gamemodes/Arena");

class GameManager {

	constructor(tankhunt) {
		this.th = tankhunt;

		this.games = [];

		// Here starts the arena game for testing!!!!!
		this.testGame = new Arena(20);
		this.games.push(this.testGame);
	}

	newPlayer(pl) {
		this.testGame.addPlayer(pl);
	}

	loopTick(deltaSec) {

		for (var i = 0; i < this.games.length; i++) {
			this.games[i].update(deltaSec);
		}
	}
}

module.exports = GameManager;