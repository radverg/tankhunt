import { THGame_SE } from "./gameplay/gamemodes/THGame_SE";
import { Arena_SE } from "./gameplay/gamemodes/Arena_SE";
import { Player_SE } from "./gameplay/Player_SE";
import { TankHunt_SE } from "./TankHunt_SE";
import { Duel_SE } from "./gameplay/gamemodes/Duel_SE";
import { TeamFight_SE } from "./gameplay/gamemodes/TeamFight_SE";
import { Stats_SE } from "./gameplay/Stats_SE";

class GameManager_SE {

	private th: TankHunt_SE;

	// Games
	private arenas: Arena_SE[] = [];
	private duels: Duel_SE[] = [];
	private teamFights: TeamFight_SE[] = [];

	private plDuelPending: Player_SE = null;
	private teamFightQueue: Player_SE[] = [];

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
				this.destroyGame(this.arenas[i]);
				this.arenas.splice(i, 1);
				continue;
			}

			// Update the game
			this.arenas[i].update(deltaSec);
		}

		// Update duels
		for (var i = 0; i < this.duels.length; i++) {

			// Handle game removing 
			if (this.duels[i].remove) {
				this.destroyGame(this.duels[i]);
				this.duels.splice(i, 1);
				continue;
			}

			// Update the game
			this.duels[i].update(deltaSec);
		}

		// Update team fights
		for (var i = 0; i < this.teamFights.length; i++) {

			// Handle game removing 
			if (this.teamFights[i].remove) {
				this.destroyGame(this.teamFights[i]);
				this.teamFights.splice(i, 1);
				continue;
			}

			// Update the game
			this.teamFights[i].update(deltaSec);
		}
	}

	destroyGame(game: THGame_SE) {
		for (const plr of game.players) {
			if (plr.socket && plr.socket.connected) {
				this.th.menuManager.addSocket(plr.socket);
			}
		}
		game.destroy();
		this.th.menuManager.emitMenuInfo();
	}

	getArenaCount() {
		return this.arenas.length;
	}

	getDuelCount() {
		return this.duels.length;
	}

	getTeamFightCount() {
		return this.teamFights.length;
	}

	getTeamQueueCount() {
		return this.teamFightQueue.length;
	}

	onSocketDisconnected(socket: SocketIO.Socket) {
		if (!socket.player) return;

		if (socket.player.game) {
			socket.player.game.playerDisconnected(socket.player);	
			return;	
		}

		this.removeFromTeamQueue(socket);
		this.th.menuManager.emitMenuInfo();
	}

	private removeFromTeamQueue(socket: SocketIO.Socket) {

		let teamQueueIndex = this.teamFightQueue.indexOf(socket.player);
		if (teamQueueIndex !== -1) {
			this.teamFightQueue.splice(teamQueueIndex, 1);
		} 
	}

	private addToTeamQueue(socket: SocketIO.Socket) {
		let index = this.teamFightQueue.indexOf(socket.player);
		console.log(index);
		if (index !== -1) return false;
		this.teamFightQueue.push(socket.player); 
		return true;
	}

	processGameRequest(player: Player_SE, packet: PacketGameRequest) {
		if (player.game) return;

		if (this.plDuelPending == player) {
			this.plDuelPending = null;
		}

		if (packet.gameType == "nogame") {
			// Remove player from queue
			if (player == this.plDuelPending) this.plDuelPending = null;
		}
		
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
			this.th.menuManager.emitMenuInfo();
		}

		if (packet.gameType == "Duel") {

			if (this.plDuelPending && this.plDuelPending.socket.connected) { // Somebody is waiting, create the game
				let dGame = new Duel_SE();
				dGame.addPlayer(this.plDuelPending);
				dGame.addPlayer(player);
				dGame.start();
				this.duels.push(dGame);

				this.th.menuManager.removeSocket(player.socket);
				this.th.menuManager.removeSocket(this.plDuelPending.socket);
				this.th.menuManager.emitMenuInfo();

				this.plDuelPending = null;

			} else {
				this.plDuelPending = player;
			}
		}
		
		if (packet.gameType == "TeamFight") {

			// // Just debugging !!!!!!
			// let tGame = new TeamFight_SE();
			// tGame.addPlayer(player);

			// // Debug - add 5 more pseudoplayers
			// for (let i = 0; i < 5; i++) {
			// 	tGame.addPlayer(new Player_SE(null, `comp${i}`));
			// }
			if (!this.addToTeamQueue(player.socket)) {
				// Already here => get him out
				this.removeFromTeamQueue(player.socket);
			}

			console.log("In queue: " + this.teamFightQueue.length);
			if (this.teamFightQueue.length === 4) {
				// Start the game
				let tGame = new TeamFight_SE();

				for (const plr of this.teamFightQueue) {
					this.th.menuManager.removeSocket(player.socket);
					
					tGame.addPlayer(plr);
				}

				// Clear queue
				this.teamFightQueue = [];

				tGame.start();
				this.teamFights.push(tGame);
			}

			this.th.menuManager.emitMenuInfo();
			
		}
	}
}

export {GameManager_SE};
