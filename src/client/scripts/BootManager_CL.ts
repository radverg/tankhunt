class BootManager_CL extends Phaser.State {

    constructor() {
        super();    
    }

    preload() {
        this.load.path = "assets/";
        this.load.image("itSplash", "images/itnetwork_splash.jpg");
        this.load.image("loadBar", "images/panel_loading.png");
        this.load.image("logoBig", "images/logo_big.png");

       
    }

    create() {
        this.state.start("load");
    }
}