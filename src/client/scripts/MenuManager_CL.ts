class MenuManager_CL extends Phaser.State {

    constructor() {
        super();    
    }

    create() {
        this.state.start("play");
    }
}