
class LoopManager {

	constructor(tankhunt) {

		this.th = tankhunt;
		this.gm = tankhunt.gameManager;

		this.mainLoop = null;
		this.lastTick = null;
	}

	start() {
		var that = this;
		this.mainLoop = setInterval(function() { that.serverLoop(); }, 1000 / 60);
		this.lastTick = Date.now();
		console.log("Server loop has been started!");
	}

	serverLoop() {
		Date.serverTime = Date.now();
		var deltaSec = (Date.serverTime - this.lastTick) / 1000;

       	this.gm.loopTick(deltaSec);

        this.lastTick += deltaSec * 1000;
    }
}

module.exports = LoopManager;