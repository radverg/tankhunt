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

        if (this.first) {

            this.first = false;

            this.th.loadManager.precreate();

            $("#arenaMode").on("click", () => { this.arenaJoinClick(); });
            $("#duelMode").on("click", () => { this.duelJoinClick(); });
            $("#btnChatSubmit").on("click", () => { this.submitChat(); });
            $("#chatInp").on("keydown", (e) => { if (e.keyCode == 13) this.submitChat(); });

        }

        $("#coverDuel").css("display", "none");
       // this.time.events.add(500, function() { this.state.start("play"); }, this);
        this.game.state.start("play");
    }

    processMenuInfo(packet: PacketMenuInfo) {
        $("#totalPlayers").text(packet.totalP);
        $("#menuPlayers").text(packet.menuP);
        $("#gamePlayers").text(packet.totalP - packet.menuP);
        $("#arenaGames").text(packet.arenaG);
        $("#duelGames").text(packet.duelG);

    }

    submitChat() {
        let mess = $("#chatInp").val().toString();
        if (mess == "") {
            return;
        }
        $("#chatInp").val("");
        let packet: PacketChatMessage = {
            name: $("#inpName").val().toString(),
            mess: mess
        }
        this.th.socketManager.emit("menuChat", packet);
    }

    processChat(packet: PacketChatMessage) {
        let $messCont = $("#messCont");
        let date = new Date();
        let $newMess = $("<div class='mess'><div>").text(`${date.toLocaleTimeString()} [${packet.name || "unnamed"}] - ${packet.mess}`)
        $messCont.prepend($newMess);        
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

    duelJoinClick() {
        let name = this.validateName($("#inpName").val().toString() || `player${(Math.random()*10000).toFixed(0)}`);

        if (name === false) {
            $("#inpName").addClass("wrongInput");
            return;
        } else {
            $("#inpName").removeClass("wrongInput");
        }

        if ($("#coverDuel").css("display") != "none") {
            this.th.socketManager.emitGameRequest({ playerName: name, gameType: "nogame" });
            $("#coverDuel").hide();
            return;
        }

        this.th.socketManager.emitGameRequest({ playerName: name, gameType: "Duel" });
        $("#coverDuel").css("display", "flex");

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