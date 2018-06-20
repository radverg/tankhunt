/// <reference path="refs.ts" />

class TH {

    static game: Phaser.Game;

    public socketManager: SocketManager_CL;
    public loadManager: LoadManager_CL;
    public playManager: PlayManager_CL;

    static sizeCoeff: number;
    
    constructor() {
        
        this.socketManager = new SocketManager_CL(this);
        this.loadManager = new LoadManager_CL(this);
        this.playManager = new PlayManager_CL(this);
    }

    init() {
        this.initPhaser();
        // After phaser is completely loaded, onPhaserLoad will be called and Websocket connection will be
        // established
    }
    
    initPhaser() {

        var phaserConfig = {
            width: 1920,
            height: 1080,
           // forceSetTimeOut: true
        }

        TH.game = new Phaser.Game(phaserConfig);
        TH.game.state.add("load", this.loadManager);
        TH.game.state.add("play", this.playManager);
        TH.game.state.start("load");
        TH.sizeCoeff = 70;
    }

    onPhaserLoad() {
        this.socketManager.connect();
    }
}