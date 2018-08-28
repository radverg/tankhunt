class UIGameChat_CL {

    private game: Phaser.Game;
    private thGame: THGame_CL;

    private messGroup: Phaser.Group;
    private maxMessages: number = 10;

    private chatKey: Phaser.Key;
    private chatKeyCode: number = Phaser.Keyboard.ENTER;

    constructor(game: Phaser.Game, thGame: THGame_CL) {
    
        this.game = game;
        this.thGame = thGame;

        this.messGroup = new Phaser.Group(game);
        this.messGroup.fixedToCamera = true;
        this.messGroup.cameraOffset.setTo(game.camera.view.centerX - 300, game.camera.view.bottom - 200);

        this.thGame.onChat.add(this.messageHere, this);

        this.thGame.onLeave.add(this.destroy, this);
        this.thGame.onGameFinish.add(function(packet: PacketGameFinish) { if (!packet.subgame) this.destroy() }, this);

        $("#gameChatCont").remove();
        let $chatCont = $("<div id='gameChatCont'><input maxlength='70' type='text' id='gameChatInp'></div>");
        $("body").append($chatCont);
        $chatCont.on("keydown", (e) => { if (e.keyCode == 13) this.sendMessage(); });
        
        this.chatKey = game.input.keyboard.addKey(this.chatKeyCode);
        this.chatKey.onDown.add(this.showInput, this);
    }

    private messageHere(packet : PacketChatMessage) {

        if (this.game.paused) return;
        
        let playerFrom = this.thGame.playerGroup.getPlayer(packet.id);
        let plMe = this.thGame.playerGroup.me;

        if (!playerFrom) return;

        // Escape message
        let name = playerFrom.name;
        let mess = `[${name}] ` + $("<div></div>").text(packet.mess).text();

        // In case message stack is full, remove the topmost
        if (this.messGroup.children.length == this.maxMessages) {
            (this.messGroup.getChildAt(0) as Phaser.Sprite).destroy();
        }

        // Push all messages up and create newone
        this.messGroup.subAll("y", 30, false, false);

        let newMess = this.game.make.text(0, 0, mess);
        newMess.wordWrap = true;
        newMess.wordWrapWidth = 800;

        this.messGroup.add(newMess);

        let nameColor = (plMe == playerFrom) ? "blue" : (plMe.isEnemyOf(playerFrom)) ? "red" : "green";
        newMess.addColor(nameColor, 0);
        newMess.addColor("black", name.length + 3);

        // Just use tween as a timer
        let twnTimer = this.game.add.tween(newMess).to({alpha: 0.98}, 6000, Phaser.Easing.Default);
        twnTimer.onComplete.add(function() { this.destroy(); }, newMess);
        twnTimer.start();

        // Beep sound

        // ---


    }

    private destroy() {
        this.game.input.keyboard.removeKey(this.chatKeyCode);
    }

    private showInput() {
        this.game.input.keyboard.enabled = false;
        let $cont = $("#gameChatCont");

        // Set position according to canvas
        let $canvas = $(this.game.canvas);
        $cont.css("top", ($canvas.height() - 80) + "px");
        $cont.css("left", ($canvas.width() / 2 - $cont.width() / 2) + "px");

        $cont.show();
        $("#gameChatInp").focus();
    }

    private hideInput() {
        this.game.input.keyboard.enabled = true;
        let $cont = $("#gameChatCont");
        $cont.hide();
        $("#gameChatInp").val("");
        $(this.game.canvas).focus();
    }

    private sendMessage() {
        
        let mess = $("#gameChatInp").val();
        if (mess == "") {
            this.hideInput();
            return;
        }

        let packet: PacketChatMessage = {
            mess: mess.toString()
        }

        this.thGame.socketManager.emit("gameChat", packet);
        this.hideInput();
    }
}