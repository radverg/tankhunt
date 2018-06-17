/// <reference path="refs.ts" />

class TH {

    static game: Phaser.Game;

    public socketManager: SocketManager;
    public loadManager: LoadManager;
    public playManager: PlayManager;

    static sizeCoeff: number;
    
    constructor() {
        
        this.socketManager = new SocketManager(this);
        this.loadManager = new LoadManager();
        this.playManager = new PlayManager(this);
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