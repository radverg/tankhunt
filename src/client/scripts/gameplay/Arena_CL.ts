/// <reference path="../refs.ts" />

class Arena_CL extends THGame_CL {
    constructor(socketManager: SocketManager_CL, packet: PacketGameStart) {
        super(socketManager);
	  
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
		
		if (player) {
			player.tank.applyStatePacket(data);
		}
		TH.game.time.events.add(data.respawnDelay, player.tank.revive, player.tank);
    }
    
    newPlayerFromPacket(packet: PacketPlayerInfo) {
		// Handle tank type in future
		var tank = new DefaultTank_CL();

		var player = new Player_CL(packet.id, tank, packet.name);
		player.stats = packet.stats;

		if (packet.tank) {
            tank.applyStatePacket(packet.tank);
            tank.jumpToRemote();
		}

		this.playerGroup.add(player);

		// Check if its me
		if (packet.id == this.socketManager.getID()) { // If so, make tank blue and bind camera with this
			this.playerGroup.setMe(player);
			this.setCamera();
		} else { // if its an enemy, make it red
			this.playerGroup.setEnemy(player);
        }
        
        // Hide it in case its not alive
        if (!packet.alive) {
            tank.hide();
        }
	}


}