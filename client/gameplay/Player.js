class Player {

	constructor(tank, id, name) {
		this.id = id;

		this.name = name || "unnamed";

		this.tank = null;
		if (tank) { this.attachTank(tank); };
	}

	// Binds a player and a tank together
	attachTank(tank) {
		this.tank = tank;
		tank.player = this;
	};

	removeTank() {
		if (!this.tank) return;
		this.tank.turret.destroy();
		this.tank.destroy();
		this.tank = null;
	};

	/**
	 * Sets properties of this player and his tank according to the player info packet received from the server
	 * @param {*} packet Player packet from the server
	 */
	applyPacket(packet) {

	}
}


