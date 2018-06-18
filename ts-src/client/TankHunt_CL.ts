/// <reference path="refs.ts" />

class TH {

    static game: Phaser.Game;

    public socketManager: SocketManager_CL;
    public loadManager: LoadManager_CL;
    public playManager: PlayManager_CL;

    static sizeCoeff: number;
    
    constructor() {
        
        this.socketManager = new SocketManager_CL(this);
        this.loadManager = new LoadManager_CL();
        this.playManager = new PlayManager_CL(this);
    }

    init() {
        this.initPhaser();

        // Connect after some time - when Phaser is loaded
        setTimeout(() => { this.socketManager.connect() }, 500);
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
}