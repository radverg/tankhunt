var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PlayManager_CL = (function (_super) {
    __extends(PlayManager_CL, _super);
    function PlayManager_CL(tankhunt) {
        var _this = _super.call(this) || this;
        _this.first = true;
        _this.th = tankhunt;
        return _this;
    }
    PlayManager_CL.prototype.preload = function () { };
    PlayManager_CL.prototype.create = function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.world.setBounds(-400, -400, 3000, 2000);
        this.stage.backgroundColor = "#D4DBE1";
        if (this.thGame && this.thGame.remove) {
            this.thGame = null;
            TH.thGame = null;
        }
        this.initInput();
        this.input.keyboard.enabled = false;
        if (!this.first)
            return;
        this.pingerTimer = TH.game.time.create(false);
        this.pingerTimer.loop(3000, TH.timeManager.synchronizeRequest, TH.timeManager);
        this.pingerTimer.start(1000);
        this.game.onResume.add(this.gameResumed, this);
        this.first = false;
        console.log("Requesting game...");
    };
    PlayManager_CL.prototype.gameResumed = function () { };
    PlayManager_CL.prototype.processGameStart = function (packet) {
        this.world.removeAll(true);
        TH.effects.fadeOutAndStop(SoundNames.MENUSONG);
        if (packet.gameType == "Arena") {
            console.log("Starting arena!");
            this.thGame = new Arena_CL(this.th.socketManager, packet);
        }
        else if (packet.gameType == "Duel") {
            this.thGame = new Duel_CL(this.th.socketManager, packet);
        }
        else if (packet.gameType == "TeamFight") {
            this.thGame = new TeamFight_CL(this.th.socketManager, packet);
        }
        else {
            console.log("Unknown game type!");
            return;
        }
        this.camera.flash(0x000000, 1000);
        $(this.game.canvas).show();
        $("#menuCont").hide();
        $("#logoCont").hide();
        this.input.keyboard.enabled = true;
    };
    PlayManager_CL.prototype.update = function () {
        if (this.thGame && this.thGame.running) {
            this.thGame.update();
        }
    };
    PlayManager_CL.prototype.render = function () {
        if (this.thGame && this.thGame.running) {
            this.thGame.debug();
        }
    };
    PlayManager_CL.prototype.initInput = function () {
        var _this = this;
        var callback = function (key) {
            _this.sendInput(key);
        };
        var up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(callback);
        up.onUp.add(callback);
        up.name = "inpForw";
        var down = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(callback);
        down.onUp.add(callback);
        down.name = "inpBackw";
        var right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(callback);
        right.onUp.add(callback);
        right.name = "inpRight";
        var left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left.onDown.add(callback);
        left.onUp.add(callback);
        left.name = "inpLeft";
        var turrLeft = this.input.keyboard.addKey(Phaser.Keyboard.A);
        turrLeft.onDown.add(callback);
        turrLeft.onUp.add(callback);
        turrLeft.name = "inpTurrLeft";
        var turrRight = this.input.keyboard.addKey(Phaser.Keyboard.D);
        turrRight.onDown.add(callback);
        turrRight.onUp.add(callback);
        turrRight.name = "inpTurrRight";
        var shot = this.input.keyboard.addKey(Phaser.Keyboard.S);
        shot.onDown.add(callback);
        shot.name = "inpShot";
        var shotBouncing = this.input.keyboard.addKey(Phaser.Keyboard.W);
        shotBouncing.onDown.add(callback);
        shotBouncing.name = "inpShotBouncing";
        var shotSpecial = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        shotSpecial.onDown.add(callback);
        shotSpecial.name = "inpShotSpecial";
        shot.onUp.add(callback);
    };
    PlayManager_CL.prototype.sendInput = function (key) {
        var type = (key.isDown) ? key.name + "On" : key.name + "Off";
        this.th.socketManager.emitInput(type);
    };
    return PlayManager_CL;
}(Phaser.State));
