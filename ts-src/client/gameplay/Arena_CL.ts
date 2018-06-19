/// <reference path="../refs.ts" />

class Arena_CL extends THGame_CL {
    constructor(socketManager: SocketManager_CL) {
        super(socketManager);
      
    } 
    /**
	 * Respawn packet contains:
	 * serverTime, respawnDelay, immunityTime
	 * Player state info - his new position and rotation - packet can be passed to tank.applyStatePacket()
	 * @param {*} data Packet
	 */
	processRespawn(data: PacketRespawn) {
		
		if (this.hasPlayer(data.plID)) {
			this.players[data.plID].tank.applyStatePacket(data);
		}
		TH.game.time.events.add(data.respawnDelay, this.players[data.plID].tank.revive, this.players[data.plID].tank);
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

		this.players[packet.id] = player;

		// Check if its me
		if (packet.id == this.socketManager.getID()) { // If so, make tank blue and bind camera with this
			this.playerMe = player;
			tank.defaultColor = Color.Blue;
            tank.color = Color.Blue;
			this.setCamera();
		} else { // if its an enemy, make it red
			tank.defaultColor = Color.Red;
			tank.color = Color.Red;
        }
        
        // Hide it in case its not alive
        if (!packet.alive) {
            tank.hide();
        }

		// Eventually add tank to the game
		tank.addToScene();
	}


}