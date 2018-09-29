class Player_CL {

	public id: string;
	public name: string = "unnamed";

	/**
	 * Reference for the player's tank
	 */
	public tank: Tank_CL = null;

	/**
	 * Specifies whether this player object belongs to this client
	 */
	public me: boolean = false;

	public stats: Stats_CL = new Stats_CL();
	
	/**
	 * Player's team. 0 means no team => everyone is an opponent
	 */
	public team: number = 0;

	/**
	 * Reference for player's UI, is updated each frame if exists
	 */
	public UIpl: UIPlayer_CL | null = null;

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

	/**
	 * Destroys player's tank and nulls the reference
	 */
	removeTank() {
		if (!this.tank) return;
		this.tank.destroy();
		this.tank = null;
	};

	/**
	 * Compares the team of this player to team of another player and
	 * determines whether they are opponents
	 * @param player Another player for comparison
	 */
	isEnemyOf(player: Player_CL) {

		if (this == player) return false;

		if (!this.team || !player.team) return true;
		
		return this.team !== player.team;
	}
}


