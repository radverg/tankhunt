import { SocketManager_SE } from "./SocketManager_SE";
import { GameManager_SE } from "./GameManager_SE";
import { LoopManager_SE } from "./LoopManager_SE";

class TankHunt_SE {
	
	private nodeserver: any;
	private io: SocketIO.Server;
	startTime: number;
	socketManager: SocketManager_SE;
	gameManager: GameManager_SE;
	loopManager: LoopManager_SE;

	constructor(server: SocketIO.Server) {

		this.nodeserver = server;

		// Start game server
		this.io = require("socket.io").listen(server);
		this.startTime = Date.now();

		// Managers
		this.socketManager = new SocketManager_SE(this, this.io);
		this.gameManager = new GameManager_SE(this);
		this.loopManager = new LoopManager_SE(this); 

		// Start Loop:
		this.loopManager.start();

		console.log("Socket IO is now listening for Websockets!");
		console.log("TankHunt is ready!");
	}
}

export {TankHunt_SE};