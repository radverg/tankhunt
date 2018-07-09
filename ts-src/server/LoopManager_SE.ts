import { GameManager_SE } from "./GameManager_SE";
import { TankHunt_SE } from "./TankHunt_SE";

class LoopManager_SE {

	th: TankHunt_SE;
	gm: GameManager_SE;
	mainLoop: any = null;
	lastTick: number | null = null;

	constructor(tankhunt: TankHunt_SE) {

		this.th = tankhunt;
		this.gm = tankhunt.gameManager;

	}

	start() {
		this.mainLoop = setInterval(() => { this.serverLoop(); }, 1000 / 60);
		this.lastTick = Date.now();
		console.log("Server loop has been started!");
	}

	serverLoop() {

		var deltaSec = (Date.now() - this.lastTick) / 1000;

       	this.gm.loopTick(deltaSec);

		this.lastTick += deltaSec * 1000;

    }
}

export {LoopManager_SE};