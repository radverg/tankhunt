import { THGame_SE } from "./gameplay/gamemodes/THGame_SE";
import { Arena_SE } from "./gameplay/gamemodes/Arena_SE";
import { Player_SE } from "./gameplay/Player_SE";
import { TankHunt_SE } from "./TankHunt_SE";
import { Duel_SE } from "./gameplay/gamemodes/Duel_SE";

class GameManager_SE {

	private th: TankHunt_SE;
	private games: THGame_SE[] = [];

	private arenas: Arena_SE[] = [];
	private testGame: Arena_SE;


	private plDuelPending: Player_SE = null;

	constructor(tankhunt: TankHunt_SE) {
		this.th = tankhunt;

		// Base arena game
		this.arenas.push(new Arena_SE(10));
	}

	loopTick(deltaSec: number) {

		// Update arenas 
		for (var i = 0; i < this.arenas.length; i++) {

			// Handle game removing 
			if (this.arenas[i].isEmpty() && this.arenas.length > 1) {
				this.arenas[i].destroy();
				this.arenas.splice(i, 1);
				continue;
			}

			// Update the game
			this.arenas[i].update(deltaSec);
		}

		// Update games
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
			// Find arena with highest amount of players, but not full
			let arenaToJoin = this.arenas[0];
			for (let ar = 0; ar < this.arenas.length; ar++) {
				if (this.arenas[ar].getPlayerCount() > arenaToJoin.getPlayerCount() || arenaToJoin.isFull())
					arenaToJoin = this.arenas[ar];	
			}

			if (arenaToJoin.isFull()) {
				// Create new arena game
				let arena = new Arena_SE(10);
				this.arenas.push(arena);
				arenaToJoin = arena;
			}

			arenaToJoin.addPlayer(player);
			this.th.menuManager.removeSocket(player.socket);
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
