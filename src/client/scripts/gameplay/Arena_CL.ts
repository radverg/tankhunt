
class Arena_CL extends THGame_CL {

	private arenaView: UIPlayerManager_CL;
	private notifView: UINotification_CL;
	private uiLadder: UILadder_CL;
	private uiStats: UIStatsTable_CL;

	private tabKey: Phaser.Key;

    constructor(socketManager: SocketManager_CL, packet: PacketGameStart) {
		super(socketManager);
		
		this.arenaView = new UIPlayerManager_CL(TH.game, this);
		this.notifView = new UINotification_CL(TH.game, this);
		this.uiLadder = new UILadder_CL(TH.game, this);
		this.uiStats = new UIStatsTable_CL(this, ["inRow", "maxRow", "kills", "deaths", "suic", "blockC", "dmgD", "dmgR",], "inRow");

		// Leave button
		let btnExit = TH.game.add.button(TH.game.width - 70, 20, "panels", function(){ this.socketManager.emitLeave();}, this, 1, 0);
		let btnText = TH.game.make.text(0, 0, "Quit");
		btnExit.scale.setTo(0.5);
		btnExit.anchor.setTo(0.5);
		btnText.anchor.setTo(0.5);
		btnExit.addChild(btnText);
		btnExit.fixedToCamera = true;
		btnExit.alpha = 0.7;
	  
		this.processLevel(packet.level);
		this.processGameInfo(packet);
		this.running = true;

		// Associate tab key for stats table
		this.tabKey = TH.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
		this.tabKey.onDown.add(function() { this.uiStats.show(); console.log("Showing stats..."); }, this);
		this.tabKey.onUp.add(function() { this.uiStats.hide() }, this);

		
    } 
    /**
	 * Respawn packet contains:
	 * serverTime, respawnDelay, immunityTime
	 * Player state info - his new position and rotation - packet can be passed to tank.applyStatePacket()
	 * @param {*} data Packet
	 */
	processRespawn(data: PacketRespawn) {
		let player: Player_CL = this.playerGroup.getPlayer(data.plID);
		if (!player) return;
		
		player.tank.maxHealth = data.health;
		player.tank.health = data.health;
		
		player.tank.applyStatePacket(data);
		player.tank.jumpToRemote();
		player.tank.setColor(Color.Gray);
		
		TH.game.time.events.add(data.respawnDelay, player.tank.revive, player.tank);
		TH.game.time.events.add(data.respawnDelay + data.immunityTime, function() { this.setColor(this.defaultColorIndex); }, player.tank);		

		this.onRespawn.dispatch(player);
    }
    
    


}