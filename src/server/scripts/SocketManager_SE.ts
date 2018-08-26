import { Player_SE } from "./gameplay/Player_SE";
import { TankHunt_SE } from "./TankHunt_SE";

// Manage clients and their sockets
class SocketManager_SE {

	th: TankHunt_SE;
	io: SocketIO.Server;

	constructor(tankhunt: TankHunt_SE, io: SocketIO.Server) {

		this.th = tankhunt;
		this.io = io;

		io.sockets.on("connection", (socket) => { this.onConnection(socket) });
	}

	onConnection(socket: SocketIO.Socket) {

    	console.log("New client has connected from " + socket.request.connection.remoteAddress + 
    		" with id " + socket.id +  "!");

    	this.initSocket(socket);
	}

	initSocket(socket: SocketIO.Socket) {
		socket.on("disconnect", () => this.onDisconnect(socket));
		socket.on("input", (data: string) => this.onInput(socket, data));
		socket.on("leave", () => this.onLeave(socket));
		socket.on("gameRequest", (data: PacketGameRequest) => this.onGameRequest(socket, data));
		socket.on("pingg", () => { socket.emit("pongg", Date.now()); });
	}

	// Socket emit callbacks -------------------------
	onDisconnect(socket: SocketIO.Socket) {
		console.log("Client " + socket.request.connection.remoteAddress + " has disconnected!");

		if (socket.player && socket.player.game) {
			socket.player.game.playerDisconnected(socket.player);		
		}
	}

	onInput(socket: SocketIO.Socket, data: string) {
		if (socket.player && socket.player.game) {
		    socket.player.game.handleInput(data, socket.player);
		}
	}

	onLeave(socket:SocketIO.Socket) {
		console.log("Player left a game!");
		if (socket.player && socket.player.game) {
			socket.player.game.playerDisconnected(socket.player);		
		}
	}

	onGameRequest(socket: SocketIO.Socket, data: PacketGameRequest) {

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


