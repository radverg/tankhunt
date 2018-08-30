
class TeamFight_CL extends THGame_CL {

    private uiTeamFight: UITeamFight_CL;

    constructor(sm: SocketManager_CL, packet: PacketGameStart) {
        super(sm);

        this.uiTeamFight = new UITeamFight_CL(this.game, this);

        this.processGameInfo(packet);

        // Set colors
        let me = this.playerGroup.me;
        for (const key in this.playerGroup.players) {
            const plr = this.playerGroup.players[key];
                
            if (!plr.isEnemyOf(me) && plr !== me) {
                // Set green color
                this.playerGroup.setFriend(plr);
            }
        }

        this.processLevel(packet.level);

        this.running = true;
    }

    processRespawn(data: PacketRespawn) {
        let player: Player_CL = this.playerGroup.getPlayer(data.plID);
		if (!player) return;
		
		player.tank.maxHealth = data.health;
		player.tank.health = data.health;
		
		player.tank.applyStatePacket(data);
        player.tank.jumpToRemote();
        
        this.onRespawn.dispatch(player);
    }
}