import { THGame_SE } from "./gameplay/gamemodes/THGame_SE";
import { Arena_SE } from "./gameplay/gamemodes/Arena_SE";
import { Player_SE } from "./gameplay/Player_SE";
import { TankHunt_SE } from "./TankHunt_SE";
import { Duel_SE } from "./gameplay/gamemodes/Duel_SE";

class GameManager_SE {

	private th: TankHunt_SE;
	private games: THGame_SE[] = [];
	private testGame: Arena_SE;


	private plDuelPending: Player_SE = null;

	constructor(tankhunt: TankHunt_SE) {
		this.th = tankhunt;

		// Here starts the arena game for testing!!!!!
		this.testGame = new Arena_SE(20);
		this.games.push(this.testGame);
	}

	newPlayer(pl: Player_SE) {
		//this.testGame.addPlayer(pl);
	}

	loopTick(deltaSec: number) {

		for (var i = 0; i < this.games.length; i++) {

			// Handle game removing 
			if (this.games[i].remove) {
				this.games.splice(i, 1);
				continue;
			}

			// Update the game
			this.games[i].update(deltaSec);
		}
	}

	processGameRequest(player: Player_SE, packet: PacketGameRequest) {
		if (player.game) return;
		
		if (packet.gameType == "Arena") {
			// For debugging, put player in test game
			this.testGame.addPlayer(player);
		}

		if (packet.gameType == "Duel") {
			if (this.plDuelPending && this.plDuelPending.socket.connected) { // Somebody is waiting, create the game
				let dGame = new Duel_SE();
				dGame.addPlayer(this.plDuelPending);
				this.plDuelPending = null;
				dGame.addPlayer(player);
				dGame.start();
				this.games.push(dGame);
			} else {
				this.plDuelPending = player;
			}
		}
	}
}

export {GameManager_SE};
