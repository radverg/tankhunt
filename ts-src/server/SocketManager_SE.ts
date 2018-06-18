import { Player_SE } from "./gameplay/Player_SE";
import { TankHunt_SE } from "./TankHunt_SE";

// Manage clients and their sockets
class SocketManager_SE {

	th: TankHunt_SE;
	io: SocketIO.Server;

	constructor(tankhunt, io: SocketIO.Server) {

		this.th = tankhunt;
		this.io = io;

		io.sockets.on("connection", (socket) => { this.onConnection(socket) });
	}

	onConnection(socket) {

    	console.log("New client has connected from " + socket.handshake.address + 
    		" with id " + socket.id +  "!");

    	this.initSocket(socket);

    	// For debugging, add it directly to the test game
    	this.th.gameManager.newPlayer(new Player_SE(socket, "noname"));

	}

	initSocket(socket) {

		socket.on("disconnect", this.onDisconnect);
		socket.on("input", this.onInput);
	}

	// Socket emit callbacks -------------------------
	onDisconnect() {
		console.log("Client " + this.handshake.address + " has disconnected!");

		if (this.player && this.player.game) {
			this.player.game.playerDisconnected(this.player);		
		}
	}

	onInput(data: string) {
		if (this.player && this.player.game) {
		    this.player.game.handleInput(data, this.player);
		}
	}

	// To make compiler silent 
	[x: string]: any;
}

export {SocketManager_SE};


