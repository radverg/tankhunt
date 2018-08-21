/// <reference path="../refs.ts" />

class Arena_CL extends THGame_CL {

	private arenaView: UIPlayerManager_CL;
	private notifView: UINotification_CL;
	private uiLadder: UILadder_CL;

    constructor(socketManager: SocketManager_CL, packet: PacketGameStart) {
		super(socketManager);
		
		this.arenaView = new UIPlayerManager_CL(TH.game, this);
		this.notifView = new UINotification_CL(TH.game, this);
		this.uiLadder = new UILadder_CL(TH.game, this);

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