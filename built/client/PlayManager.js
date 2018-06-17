"use strict";
var PlayManager = /** @class */ (function () {
    function PlayManager(tankhunt) {
        this.th = tankhunt;
        // Create test game
        this.thGame = new Arena(tankhunt.socketManager);
    }
    PlayManager.prototype.preload = function () { };
    // This method is called by Phaser when switching to PlayState
    PlayManager.prototype.create = function () {
        var that = this;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.world.setBounds(-400, -400, 3000, 2000);
        this.initInput();
        game.stage.backgroundColor = "#ffffff";
        game.stage.disableVisibilityChange = true;
        this.thGame.start();
    };
    // This method is called by Phaser, it's the main game loop
    PlayManager.prototype.update = function () {
        if (this.thGame.running) {
            this.thGame.update();
        }
    };
    PlayManager.prototype.render = function () {
        // Debug shit here
    };
    PlayManager.prototype.initInput = function () {
        var that = this;
        var callback = function (key) {
            that.sendInput(key);
        };
        // Init keys
        var up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(callback);
        up.onUp.add(callback);
        up.name = "inpForw";
        var down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(callback);
        down.onUp.add(callback);
        down.name = "inpBackw";
        var right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(callback);
        right.onUp.add(callback);
        right.name = "inpRight";
        var left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left.onDown.add(callback);
        left.onUp.add(callback);
        left.name = "inpLeft";
        var turrLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
        turrLeft.onDown.add(callback);
        turrLeft.onUp.add(callback);
        turrLeft.name = "inpTurrLeft";
        var turrRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
        turrRight.onDown.add(callback);
        turrRight.onUp.add(callback);
        turrRight.name = "inpTurrRight";
        var shot = game.input.keyboard.addKey(Phaser.Keyboard.S);
        shot.onDown.add(callback);
        shot.name = "inpShot";
        var shotBouncing = game.input.keyboard.addKey(Phaser.Keyboard.W);
        shotBouncing.onDown.add(callback);
        shotBouncing.name = "inpShotBouncing";
        var shotSpecial = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        shotSpecial.onDown.add(callback);
        shotSpecial.name = "inpShotSpecial";
        shot.onUp.add(callback);
    };
    PlayManager.prototype.sendInput = function (key) {
        var type = (key.isDown) ? key.name + "On" : key.name + "Off";
        this.th.socketManager.emitInput(type);
    };
    return PlayManager;
}());
