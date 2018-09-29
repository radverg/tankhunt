
class SocketManager_CL {

    public th: TH;
    
    private socket: SocketIOClient.Socket | null = null;

    private firstConnection: boolean = true;
    
    constructor(tankhunt: TH) {
        this.th = tankhunt;
    }
    
    /**
     * Creates websocket connection via socket.io and calls initSocket()
     */
    connect() {

        this.socket = io.connect();
        this.initSocket();
    }

    /**
     * Returns ID of the socket
     */
    getID() {
        return this.socket.id;
    }
    
    /**
     * Creates callback for all possible incoming emits via socket.io
     */
    initSocket() {
        var that = this;
        
        this.socket.on("connect", (socket: SocketIOClient.Socket) => { this.onConnection(socket); });
        this.socket.on("disconnect", function() { console.log("Disconnected!"); });
        
        this.socket.on("ms", function(data: PacketMovable) { if (that.th.playManager.thGame) that.th.playManager.thGame.processStateInfo(data); });
        this.socket.on("gameInfo", function(data: PacketGameInfo) { if (that.th.playManager.thGame) that.th.playManager.thGame.processGameInfo(data); });
        this.socket.on("removePlayer", function(data: string) { if (that.th.playManager.thGame) that.th.playManager.thGame.processPlayerRemove(data); });
        this.socket.on("shot", function(data: PacketShotStart) { if (that.th.playManager.thGame) that.th.playManager.thGame.processNewShot(data); });
        this.socket.on("level", function(data: any) { if (that.th.playManager.thGame) that.th.playManager.thGame.processLevel(data); }); 
        this.socket.on("itemSpawn", function(data: PacketItem) { if (that.th.playManager.thGame) that.th.playManager.thGame.processNewItem(data); }); 
        this.socket.on("itemCollect", function(data: PacketItemCollect) { if (that.th.playManager.thGame) that.th.playManager.thGame.processItemCollect(data); }); 
        this.socket.on("newPlayer", function(data: PacketPlayerInfo) { if (that.th.playManager.thGame) that.th.playManager.thGame.processNewPlayer(data); }); 
        this.socket.on("respawn", function(data: PacketRespawn) { if (that.th.playManager.thGame) that.th.playManager.thGame.processRespawn(data); }); 
        this.socket.on("hit", function(data: PacketShotHit) { if (that.th.playManager.thGame) that.th.playManager.thGame.processHit(data); });         
        this.socket.on("gameStart", function(data: PacketGameStart) { that.th.playManager.processGameStart(data); }); 
        this.socket.on("appear", function(data: PacketAppear) { if (that.th.playManager.thGame) that.th.playManager.thGame.processAppear(data); });
        this.socket.on("disappear", function(data: PacketDisappear){ if (that.th.playManager.thGame) that.th.playManager.thGame.processDisappear(data); });
        this.socket.on("heal", function(data: PacketHeal){ if (that.th.playManager.thGame) that.th.playManager.thGame.processHeal(data); });
        this.socket.on("gFinish", function(data: PacketGameFinish) { if (that.th.playManager.thGame) that.th.playManager.thGame.processGameFinish(data) ; });
        this.socket.on("cap", function(data: PacketCapture) { if (that.th.playManager.thGame) that.th.playManager.thGame.processCapture(data) ; });
        this.socket.on("wo", function(data: any) { if (that.th.playManager.thGame) that.th.playManager.thGame.processItemUse(data) ; });

        this.socket.on("menuChat", function(data: PacketChatMessage) { that.th.menuManager.processChat(data); });
        this.socket.on("gameChat", function(data: PacketChatMessage) { if (that.th.playManager.thGame) that.th.playManager.thGame.processChatMessage(data); });
        this.socket.on("menuInfo", function(data: PacketMenuInfo) { that.th.menuManager.processMenuInfo(data); });

        this.socket.on("pongg", function(data: number) { that.th.tManager.onSynchronizeResponse(data); });
    } 
    
    /**
     * Called when Websocket connection is established, this refers to the new socket
     */
    onConnection(socket: SocketIOClient.Socket) {
        if (this.firstConnection) {
            console.log("Connected to the server!");// + socket.id);
            this.firstConnection = false;
        }
        else {
            // This is reconnection!
            console.log("Reconnected!");
            if (this.th.playManager.thGame) {
                this.th.playManager.thGame.destroy();
                TH.game.state.start("menu");
            }
        }
    }

    /**
     * Sends input information to the server
     * @param {*} data Text representation of the input (example: inpTurrLeftOn)
     */
    emitInput(data: string) {
        this.socket.emit("input", data);
    }

    emitGameRequest(data: PacketGameRequest) {
        this.socket.emit("gameRequest", data);
    }

    emitPingRequest() {
        this.socket.emit("pingg", {} );
    }

    emitLeave() {
        this.socket.emit("leave");
    }

    emit(emName: string, data: any) {
        this.socket.emit(emName, data);
    }
}