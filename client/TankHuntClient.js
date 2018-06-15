class TankHuntClient {
    
    constructor() {
        
        this.game = null;
        this.socketManager = new SocketManager(this);
        this.loadManager = new LoadManager();
        this.playManager = new PlayManager(this);
    }

    init() {
        this.initPhaser();

        // Connect after some time - when Phaser is loaded
        var that = this;
        setTimeout(function() { that.socketManager.connect() }, 500);
    }
    
    initPhaser() {
        game = new Phaser.Game(1920, 1080, Phaser.AUTO, '');
        extendPhaserSprite();
        game.state.add("load", this.loadManager);
        game.state.add("play", this.playManager);
        game.state.start("load");
        game.sizeCoeff = 70;
        this.game = game;
    }
}