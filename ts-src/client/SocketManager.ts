/// <reference path="refs.ts" />

class SocketManager {

    public th: TH;
    
    private socket: SocketIOClient.Socket | null = null;
    
    constructor(tankhunt) {
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
        
        this.socket.on("connect", this.onConnection);
        this.socket.on("movableState", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processStateInfo(data); });
        this.socket.on("gameInfo", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processGameInfo(data); });
        this.socket.on("removePlayer", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.removePlayer(data); });
        this.socket.on("shot", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processNewShot(data); });
        this.socket.on("level", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processLevel(data); }); 
        this.socket.on("itemSpawn", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processNewItem(data); }); 
        this.socket.on("itemCollect", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processItemCollect(data); }); 
        this.socket.on("newPlayer", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processNewPlayer(data); }); 
        this.socket.on("respawn", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processRespawn(data); }); 
        this.socket.on("kill", function(data) { if (that.th.playManager.thGame) that.th.playManager.thGame.processKill(data); }); 
    } 
    
    /**
     * Called when Websocket connection is established, this refers to the new socket
     */
    onConnection(socket: SocketIOClient.Socket) {
        console.log("Connected to the server!");// + socket.id);
    }

    /**
     * Sends input information to the server
     * @param {*} data Text representation of the input (example: inpTurrLeftOn)
     */
    emitInput(data) {
        this.socket.emit("input", data);
    }
}