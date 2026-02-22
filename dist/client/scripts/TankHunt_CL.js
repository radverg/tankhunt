var TH = (function () {
    function TH() {
        this.socketManager = new SocketManager_CL(this);
        this.bootManager = new BootManager_CL();
        this.menuManager = new MenuManager_CL(this);
        this.loadManager = new LoadManager_CL(this);
        this.playManager = new PlayManager_CL(this);
        this.tManager = new TimeManager_CL(this.socketManager);
        TH.timeManager = this.tManager;
    }
    TH.prototype.init = function () {
        this.initPhaser();
        this.initHelpPanel();
        this.socketManager.connect();
    };
    TH.prototype.initPhaser = function () {
        var phaserConfig = {
            width: 1920,
            height: 1080,
            renderer: Phaser.CANVAS
        };
        TH.game = new Phaser.Game(phaserConfig);
        TH.game.state.add("boot", this.bootManager);
        TH.game.state.add("menu", this.menuManager);
        TH.game.state.add("load", this.loadManager);
        TH.game.state.add("play", this.playManager);
        TH.sizeCoeff = 70;
        TH.effects = new EffectManager(TH.game);
        TH.game.state.start("boot");
    };
    TH.prototype.initHelpPanel = function () {
        $("body").on("keydown", function (e) {
            if (e.keyCode != 17)
                return;
            var $hp = $("#helpPanel");
            if ($hp.attr("data-hidden") == "false") {
                $hp.stop();
                $hp.attr("data-hidden", "true");
                $hp.animate({ left: -800 }, 400);
            }
            else {
                $hp.stop();
                $hp.show();
                $hp.attr("data-hidden", "false");
                $hp.animate({ left: 0 }, 400);
            }
        });
    };
    TH.suspended = false;
    return TH;
}());
