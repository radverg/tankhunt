/// <reference path="../refs.ts" />

class Player_CL {

	public id: string;
	
	public name: string = "unnamed";
	public tank: Tank_CL | null = null;

	public me: boolean = false;

	public stats: Stats_CL = new Stats_CL();
	public team: any = null;
	public plView: UIPlayer_CL | null = null;

	constructor(id: string, tank?: Tank_CL, name?: string) {
		this.id = id;
		this.name = name || "unnamed";

		if (tank) { this.attachTank(tank); };
	}

	/**
	 * Binds player and tank together
	 */
	attachTank(tank: Tank_CL) {
		this.tank = tank;
		tank.player = this;
	};

	removeTank() {
		if (!this.tank) return;
		this.tank.destroy();
		this.tank = null;
	};

	isEnemyOf(player: Player_CL) {

		if (this == player) return false;

		if (!this.team || !player.team) return true;
		
		return this.team !== player.team;
	}

	// /**
	//  * Sets properties of this player and his tank according to the player info packet received from the server
	//  * @param {*} packet Player packet from the server
	//  */
	// applyPacket(packet) {

	// }
}


