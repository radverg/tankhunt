var PlayManager_CL = (function () {
    function PlayManager_CL(tankhunt) {
        this.th = tankhunt;
        this.thGame = new Arena_CL(tankhunt.socketManager);
    }
    PlayManager_CL.prototype.preload = function () { };
    PlayManager_CL.prototype.create = function () {
        TH.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        TH.game.scale.pageAlignHorizontally = true;
        TH.game.world.setBounds(-400, -400, 3000, 2000);
        this.initInput();
        TH.game.stage.backgroundColor = "#ffffff";
        TH.game.stage.disableVisibilityChange = true;
        this.thGame.start();
    };
    PlayManager_CL.prototype.update = function () {
        if (this.thGame.running) {
            this.thGame.update();
        }
    };
    PlayManager_CL.prototype.render = function () {
    };
    PlayManager_CL.prototype.initInput = function () {
        var _this = this;
        var callback = function (key) {
            _this.sendInput(key);
        };
        var up = TH.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(callback);
        up.onUp.add(callback);
        up.name = "inpForw";
        var down = TH.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(callback);
        down.onUp.add(callback);
        down.name = "inpBackw";
        var right = TH.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(callback);
        right.onUp.add(callback);
        right.name = "inpRight";
        var left = TH.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left.onDown.add(callback);
        left.onUp.add(callback);
        left.name = "inpLeft";
        var turrLeft = TH.game.input.keyboard.addKey(Phaser.Keyboard.A);
        turrLeft.onDown.add(callback);
        turrLeft.onUp.add(callback);
        turrLeft.name = "inpTurrLeft";
        var turrRight = TH.game.input.keyboard.addKey(Phaser.Keyboard.D);
        turrRight.onDown.add(callback);
        turrRight.onUp.add(callback);
        turrRight.name = "inpTurrRight";
        var shot = TH.game.input.keyboard.addKey(Phaser.Keyboard.S);
        shot.onDown.add(callback);
        shot.name = "inpShot";
        var shotBouncing = TH.game.input.keyboard.addKey(Phaser.Keyboard.W);
        shotBouncing.onDown.add(callback);
        shotBouncing.name = "inpShotBouncing";
        var shotSpecial = TH.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        shotSpecial.onDown.add(callback);
        shotSpecial.name = "inpShotSpecial";
        shot.onUp.add(callback);
    };
    PlayManager_CL.prototype.sendInput = function (key) {
        var type = (key.isDown) ? key.name + "On" : key.name + "Off";
        this.th.socketManager.emitInput(type);
    };
    return PlayManager_CL;
}());
