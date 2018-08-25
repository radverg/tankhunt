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

    	console.log("New client has connected from " + socket.handshake.address + 
    		" with id " + socket.id +  "!");

    	this.initSocket(socket);

    	// For debugging, add it directly to the test game
    	this.th.gameManager.newPlayer(new Player_SE(socket, "noname"));

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
		socket.player = new Player_SE(socket, data.playerName);
		this.th.gameManager.processGameRequest(socket.player, data);
	}
}

export {SocketManager_SE};


