var SocketManager = require("./SocketManager");
var GameManager = require("./GameManager");
var LoopManager = require("./LoopManager");

class TankHunt {

	constructor(server) {

		this.nodeserver = server;

		// Start game server
		this.io = require("socket.io").listen(server);
		this.startTime = Date.now();

		// Managers
		this.socketManager = new SocketManager(this, this.io);
		this.gameManager = new GameManager(this);
		this.loopManager = new LoopManager(this); 

		// Global ID
		Math._currentID = "a1";
		Math.getNextID = function() {
		    Math._currentID++;
		    return "a" + Math._currentID;
		}

		// Start Loop:
		this.loopManager.start();

		console.log("Socket IO is now listening for Websockets!");
		console.log("TankHunt is ready!");
	}
}

module.exports = TankHunt;