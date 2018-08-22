class Duel_CL extends THGame_CL {

    private uiDuel: UIDuel_CL;

    constructor(sm: SocketManager_CL, packet: PacketGameStart) {
        super(sm);

        console.log("Creating duel game...");
        this.uiDuel = new UIDuel_CL(TH.game, this);

        // Create players
        for (let i = 0; i < packet.players.length; i++) {
            let plr = packet.players[i];

            this.newPlayerFromPacket(packet.players[i]);
        }

        this.processLevel(packet.level);

        this.running = true;     

    }

    processGameFinish(data: PacketGameFinish) {
        // Duel subgame finished
        if (data.subgame) {
            this.tidy();
            this.processLevel(data.nextLevel);
            
   
        } else {
            console.log("Duel ends!");
        }

        this.onGameFinish.dispatch(data);

    }

    subgameEnd(nextLevel: Level_CL, timeout: number) {

    }
}