class SocketManager {
    
    constructor(tankhunt) {
        this.th = tankhunt;
        this.socket = null;
    }
    
    connect() {
        this.socket = io.connect();
        this.initSocket();
    }

    getID() {
        return this.socket.id;
    }
    
    initSocket() {
        var that = this;
        
        this.socket.on("connect", this.onConnection);
        this.socket.on("movableState", function(data) { that.th.playManager.onGameStateInfo(data); });
        this.socket.on("startInfo", function(data) { that.th.playManager.onStartInfo(data); });
        this.socket.on("removePlayer", function(data) { that.th.playManager.onRemovePlayer(data); });
        this.socket.on("shot", function(data) { that.th.playManager.onNewShot(data); });
        this.socket.on("level", function(data) { that.th.playManager.onLevel(data); }); 
        this.socket.on("itemSpawn", function(data) { that.th.playManager.onItemSpawn(data); }); 
        this.socket.on("itemCollect", function(data) { that.th.playManager.onItemCollect(data); }); 
    } 
    
    onConnection() {
        console.log("Connected to the server! ID is: " + this.id);
    }

    emitInput(data) {
        this.socket.emit("input", data);
    }
}