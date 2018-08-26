class MenuManager_CL extends Phaser.State {

    private debugJump: boolean = false;

    constructor() {
        super();    
    }

    create() {

        if (this.debugJump) {
            this.state.start("play");
            return;
        }

        
        $(this.game.canvas).fadeOut();
        $("#menuCont").fadeIn();

     //   this.time.events.add(5000, function() { this.state.start("play"); }, this);


    }
}