var TH = (function () {
    function TH() {
        this.socketManager = new SocketManager_CL(this);
        this.loadManager = new LoadManager_CL(this);
        this.playManager = new PlayManager_CL(this);
    }
    TH.prototype.init = function () {
        this.initPhaser();
    };
    TH.prototype.initPhaser = function () {
        var phaserConfig = {
            width: 1920,
            height: 1080,
        };
        TH.game = new Phaser.Game(phaserConfig);
        TH.game.state.add("load", this.loadManager);
        TH.game.state.add("play", this.playManager);
        TH.game.state.start("load");
        TH.sizeCoeff = 70;
    };
    TH.prototype.onPhaserLoad = function () {
        this.socketManager.connect();
    };
    return TH;
}());
