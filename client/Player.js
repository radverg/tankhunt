class Player {

	constructor(tank, id) {
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
}


