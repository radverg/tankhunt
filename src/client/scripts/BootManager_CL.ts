class BootManager_CL extends Phaser.State {

    constructor() {
        super();    
    }

    preload() {
        this.load.path = "assets/";
        this.load.image("itSplash", "images/itnetwork_splash.jpg");
        this.load.image("loadBar", "images/panel_loading.png");
        this.load.image("logoBig", "images/logo_big.png");

        TH.game.onPause.add(() => { console.log("Paused!"); TH.suspended = true; });
        TH.game.onResume.add(() => { console.log("Resumed!"); TH.suspended = false; });


       
    }

    create() {
        this.state.start("load");
    }
}