var TestGame = require("./gameplay/gamemodes/TestGame");

class GameManager {

	constructor(tankhunt) {
		this.th = tankhunt;

		this.games = [];

		// Here starts the test game!!!!!
		this.testGame = new TestGame();
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