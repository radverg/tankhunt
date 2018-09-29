class Duel_CL extends THGame_CL {

    // UI reference
    private uiDuel: UIDuel_CL;
  
    /**
     * Received from the server, specifies maximum amount of victories
     */
    public winCount: number;

    constructor(sm: SocketManager_CL, packet: PacketGameStart) {
        super(sm);

        console.log("Creating duel game...");

        this.winCount = packet.winCount;
        this.uiDuel = new UIDuel_CL(TH.game, this);

        // Create players
        for (let i = 0; i < packet.players.length; i++) {
            
            this.newPlayerFromPacket(packet.players[i]);
        }

        // Level setup
        this.processLevel(packet.level);

        // Game start
        this.running = true;    
        this.onGameStart.dispatch(packet);

    }

    processGameFinish(data: PacketGameFinish) {

        // Duel subgame finished
        if (data.subgame) {
            this.playerGroup.setAll("maxHealth", data.nextHealth);
            this.playerGroup.setAll("health", data.nextHealth);      
            
            this.tidy();
            this.processLevel(data.nextLevel);

            // Cancel invisibility of players
           this.playerGroup.callAll("alphaShow", null);
           this.playerGroup.callAll("revive", null);
            
   
        } else {
            console.log("Duel ends!");
        }

        this.onGameFinish.dispatch(data);
    }
}