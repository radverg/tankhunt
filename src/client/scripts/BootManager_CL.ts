class BootManager_CL extends Phaser.State {

    constructor() {
        super();    
    }

    preload() {
        this.load.path = "assets/";
        this.load.image("loadBar", "images/panel_loading.png");
        this.load.image("logoSmall", "images/logo_small.png");

        TH.game.onPause.add(() => { TH.suspended = true; });
        TH.game.onResume.add(() => { TH.suspended = false; TH.game.camera.flash(0x000000, 1500); });      
    }

    create() {
        this.state.start("load");
    }
}