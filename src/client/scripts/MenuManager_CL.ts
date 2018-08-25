class MenuManager_CL extends Phaser.State {

    private debugJump: boolean = true;

    constructor() {
        super();    
    }

    create() {

        if (this.debugJump) {
            this.state.start("play");
            return;
        }

        $(this.game.canvas).fadeOut();


    }
}