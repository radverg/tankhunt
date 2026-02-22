var UIGameChat_CL = (function () {
    function UIGameChat_CL(game, thGame) {
        var _this = this;
        this.maxMessages = 10;
        this.chatKeyCode = Phaser.Keyboard.ENTER;
        this.game = game;
        this.thGame = thGame;
        this.messGroup = new Phaser.Group(game);
        this.messGroup.fixedToCamera = true;
        this.messGroup.cameraOffset.setTo(game.camera.view.centerX - 300, game.camera.view.bottom - 200);
        this.thGame.onChat.add(this.messageHere, this);
        this.thGame.onLeave.add(this.destroy, this);
        this.thGame.onGameFinish.add(function (packet) { if (!packet.subgame)
            this.destroy(); }, this);
        $("#gameChatCont").remove();
        var $chatCont = $("<div id='gameChatCont'><input maxlength='70' type='text' id='gameChatInp'></div>");
        $("body").append($chatCont);
        $chatCont.on("keydown", function (e) { if (e.keyCode == 13)
            _this.sendMessage(); });
        this.chatKey = game.input.keyboard.addKey(this.chatKeyCode);
        this.chatKey.onDown.add(this.showInput, this);
    }
    UIGameChat_CL.prototype.messageHere = function (packet) {
        if (this.game.paused)
            return;
        var playerFrom = this.thGame.playerGroup.getPlayer(packet.id);
        var plMe = this.thGame.playerGroup.me;
        if (!playerFrom)
            return;
        var name = playerFrom.name;
        var mess = "[".concat(name, "] ") + $("<div></div>").text(packet.mess).text();
        if (this.messGroup.children.length == this.maxMessages) {
            this.messGroup.getChildAt(0).destroy();
        }
        this.messGroup.subAll("y", 30, false, false);
        var newMess = this.game.make.text(0, 0, mess);
        newMess.wordWrap = true;
        newMess.wordWrapWidth = 800;
        this.messGroup.add(newMess);
        var nameColor = (plMe == playerFrom) ? "blue" : (plMe.isEnemyOf(playerFrom)) ? "red" : "green";
        newMess.addColor(nameColor, 0);
        newMess.addColor("black", name.length + 3);
        var twnTimer = this.game.add.tween(newMess).to({ alpha: 0.98 }, 6000, Phaser.Easing.Default);
        twnTimer.onComplete.add(function () { this.destroy(); }, newMess);
        twnTimer.start();
    };
    UIGameChat_CL.prototype.destroy = function () {
        this.game.input.keyboard.removeKey(this.chatKeyCode);
    };
    UIGameChat_CL.prototype.showInput = function () {
        this.game.input.keyboard.enabled = false;
        var $cont = $("#gameChatCont");
        var $canvas = $(this.game.canvas);
        $cont.css("top", ($canvas.height() - 80) + "px");
        $cont.css("left", ($canvas.width() / 2 - $cont.width() / 2) + "px");
        $cont.show();
        $("#gameChatInp").focus();
    };
    UIGameChat_CL.prototype.hideInput = function () {
        this.game.input.keyboard.enabled = true;
        var $cont = $("#gameChatCont");
        $cont.hide();
        $("#gameChatInp").val("");
        $(this.game.canvas).focus();
    };
    UIGameChat_CL.prototype.sendMessage = function () {
        var mess = $("#gameChatInp").val();
        if (mess == "") {
            this.hideInput();
            return;
        }
        var packet = {
            mess: mess.toString()
        };
        this.thGame.socketManager.emit("gameChat", packet);
        this.hideInput();
    };
    return UIGameChat_CL;
}());
