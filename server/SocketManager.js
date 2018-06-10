// Manage clients and their sockets
var Player = require("./Player");

class SocketManager {

	constructor(tankhunt, io) {

		this.th = tankhunt;
		this.io = io;

		var that = this;
		io.sockets.on("connection", function(socket) { that.onConnection(socket) });

	}

	onConnection(socket) {

    	console.log("New client has connected from " + socket.handshake.address + 
    		" with id " + socket.id +  "!");

    	this.initSocket(socket);

    	// For debugging, add it directly to the test game
    	this.th.gameManager.newPlayer(new Player(socket, "noname"));

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

	onInput(data) {
		if (this.player && this.player.game) {
		    this.player.game.handleInput(data, this.player);
		}
	}


}

module.exports = SocketManager;