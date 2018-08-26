class MenuManager_CL extends Phaser.State {

    private debugJump: boolean = false;
    private first: boolean = true;

    private th: TH;

    constructor(tankhunt: TH) {
        super();    
        this.th = tankhunt;


    }

    create() {

        if (this.debugJump) {
            this.state.start("play");
            return;
        }

        
        $(this.game.canvas).fadeOut();
        $("#menuCont").fadeIn();
        $("#arenaJoin").on("click", () => { this.arenaJoinClick(); });


        // code below is done only once
        //if (!this.first) return;
        //this.first = false;


        //   this.time.events.add(5000, function() { this.state.start("play"); }, this);
        this.game.state.start("play");



    }

    arenaJoinClick() {
        let name = this.validateName($("#inpName").val().toString() || `player${(Math.random()*10000).toFixed(0)}`);

        if (name === false) {
            $("#inpName").addClass("wrongInput");
            return;
        } else {
            $("#inpName").removeClass("wrongInput");
        }

        this.th.socketManager.emitGameRequest({ playerName: name, gameType: "Arena" });
        

    }

    validateName(name: string) {
        let trimmed = name.trim();
        if (trimmed.length < 3) return false;
        if (trimmed.length > 12) {
            return trimmed.substr(0, 12);
        }
        return trimmed;
    }
}