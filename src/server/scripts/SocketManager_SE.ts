import { Player_SE } from "./gameplay/Player_SE";
import { TankHunt_SE } from "./TankHunt_SE";
import { SocketWithPlayer } from "./GameManager_SE"

// Manage clients and their sockets
class SocketManager_SE {

	th: TankHunt_SE;
	io: SocketIO.Server;

	socketCount: number = 0;
	private totalConnectionCount: number = 0;

	constructor(tankhunt: TankHunt_SE, io: SocketIO.Server) {

		this.th = tankhunt;
		this.io = io;

		io.sockets.on("connection", (socket) => { this.onConnection(socket as SocketWithPlayer) });
	}

	onConnection(socket: SocketWithPlayer) {

		this.socketCount++;
		this.totalConnectionCount++;

    	console.log("New client has connected from " + socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress + 
			" with id " + socket.id +  "!");
		console.log("Total connections: " + this.totalConnectionCount);
		
		this.th.menuManager.addSocket(socket);
		this.th.menuManager.emitMenuInfo();
		this.initSocket(socket);
	}

	initSocket(socket: SocketWithPlayer) {
		socket.on("disconnect", () => this.onDisconnect(socket));
		socket.on("input", (data: string) => this.onInput(socket, data));
		socket.on("leave", () => this.onLeave(socket));
		socket.on("gameRequest", (data: PacketGameRequest) => this.onGameRequest(socket, data));
		socket.on("pingg", () => { socket.emit("pongg", Date.now()); });
		socket.on("menuChat", (data: PacketChatMessage) => { this.th.menuManager.processMenuChat(data); });
		socket.on("gameChat", (data: PacketChatMessage) => { if (socket.player && socket.player.game) socket.player.game.processChatMessage(data, socket.player); });
	}

	// Socket emit callbacks -------------------------
	onDisconnect(socket: SocketWithPlayer) {
		console.log("Client " + socket.request.connection.remoteAddress + " has disconnected!");
		this.th.gameManager.onSocketDisconnected(socket);

		this.socketCount--;
		this.th.menuManager.removeSocket(socket);
		this.th.menuManager.emitMenuInfo();
	}

	onInput(socket: SocketWithPlayer, data: string) {
		if (socket.player && socket.player.game) {
		    socket.player.game.handleInput(data, socket.player);
		}
	}

	onLeave(socket:SocketWithPlayer) {
		console.log("Player left a game!");
		if (socket.player && socket.player.game) {
			socket.player.game.playerDisconnected(socket.player);	
			this.th.menuManager.addSocket(socket);	
			this.th.menuManager.emitMenuInfo();
		}
	}

	onGameRequest(socket: SocketWithPlayer, data: PacketGameRequest) {

		let name = data.playerName.trim();
		if (name.length < 3 || name.length > 12) 
			name = "hacker";

		if (!socket.player)
			socket.player = new Player_SE(socket, name);
		else 
			socket.player.name = name;

		this.th.gameManager.processGameRequest(socket.player, data);
	}
}

export {SocketManager_SE};