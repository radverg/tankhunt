var TH = (function () {
    function TH() {
        this.socketManager = new SocketManager(this);
        this.loadManager = new LoadManager();
        this.playManager = new PlayManager(this);
    }
    TH.prototype.init = function () {
        var _this = this;
        this.initPhaser();
        setTimeout(function () { _this.socketManager.connect(); }, 500);
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
    return TH;
}());
