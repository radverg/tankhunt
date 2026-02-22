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
var LoadManager_CL = (function (_super) {
    __extends(LoadManager_CL, _super);
    function LoadManager_CL(th) {
        var _this = _super.call(this) || this;
        _this.startTime = Date.now();
        _this.th = th;
        var imagesPath = "images/";
        var soundsPath = "sounds/";
        _this.images = [
            { assetName: "blackRect", path: imagesPath + "blackRect.png" },
            { assetName: "whiteRect", path: imagesPath + "whiteRect.png" },
            { assetName: "ground1", path: imagesPath + "ground1.png" },
            { assetName: "ground2", path: imagesPath + "ground2.png" },
            { assetName: "ground3", path: imagesPath + "ground3.png" },
            { assetName: "ground4", path: imagesPath + "ground4.png" },
            { assetName: "ground5", path: imagesPath + "ground5.png" },
            { assetName: "ground6", path: imagesPath + "ground6.png" },
            { assetName: "ground7", path: imagesPath + "ground7.png" },
            { assetName: "shadow", path: imagesPath + "shadow_box.png" },
            { assetName: "mine", path: imagesPath + "mine.png" },
            { assetName: "ball", path: imagesPath + "ball.png" },
        ];
        _this.spritesheets = [
            { assetName: "tankBodys", path: imagesPath + "tank_bodys_pokus.png", frameSizeX: 94, frameSizeY: 135, frameCount: 16 },
            { assetName: "defaultTurrets", path: imagesPath + "default_turrets.png", frameSizeX: 60, frameSizeY: 194, frameCount: 4 },
            { assetName: "items", path: imagesPath + "items.png", frameSizeX: 54, frameSizeY: 54, frameCount: 10 },
            { assetName: "lasers", path: imagesPath + "lasers.png", frameSizeX: 20, frameSizeY: 20, frameCount: 3 },
            { assetName: "exhaust", path: imagesPath + "exhaust.png", frameSizeX: 200, frameSizeY: 200, frameCount: 35 },
            { assetName: "exhaust2", path: imagesPath + "exhaust2.png", frameSizeX: 200, frameSizeY: 200, frameCount: 35 },
            { assetName: "smoke", path: imagesPath + "smoke.png", frameSizeX: 200, frameSizeY: 200, frameCount: 16, precreate: true },
            { assetName: "tankParts", path: imagesPath + "tank_parts.png", frameSizeX: 94, frameSizeY: 137, frameCount: 18 },
            { assetName: "shotDamage", path: imagesPath + "shot_damage.png", frameSizeX: 150, frameSizeY: 150, frameCount: 21, precreate: true },
            { assetName: "shot", path: imagesPath + "bullets.png", frameSizeX: 23, frameSizeY: 81, frameCount: 4, precreate: true },
            { assetName: "shotDarker", path: imagesPath + "bullets_darker.png", frameSizeX: 23, frameSizeY: 81, frameCount: 4, precreate: true },
            { assetName: "shotExplode1", path: imagesPath + "shot_explode1.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
            { assetName: "shotExplode2", path: imagesPath + "shot_explode2.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
            { assetName: "shotExplode3", path: imagesPath + "shot_explode3.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
            { assetName: "shotExplode4", path: imagesPath + "shot_explode4.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
            { assetName: "shotExplode5", path: imagesPath + "shot_explode5.png", frameSizeX: 400, frameSizeY: 400, frameCount: 35, precreate: true },
            { assetName: "explosion1", path: imagesPath + "explosion1.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
            { assetName: "explosion2", path: imagesPath + "explosion2.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
            { assetName: "explosion3", path: imagesPath + "explosion3.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
            { assetName: "explosion4", path: imagesPath + "explosion4.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
            { assetName: "explosion5", path: imagesPath + "explosion5.png", frameSizeX: 400, frameSizeY: 400, frameCount: 55, precreate: true },
            { assetName: "medals", path: imagesPath + "medals.png", frameSizeX: 64, frameSizeY: 64, frameCount: 3 },
            { assetName: "panels", path: imagesPath + "panels.png", frameSizeX: 190, frameSizeY: 49, frameCount: 3 },
            { assetName: "wallSideTriple", path: imagesPath + "wall_side_triple.png", frameSizeX: 1187, frameSizeY: 94, frameCount: 3 },
            { assetName: "wallSideTripleAdv", path: imagesPath + "side_wall_triple_adv.png", frameSizeX: 1778, frameSizeY: 108, frameCount: 3 },
            { assetName: "flagRed", path: imagesPath + "flags_red.png", frameSizeX: 414, frameSizeY: 235, frameCount: 40 },
            { assetName: "flagGreen", path: imagesPath + "flags_green.png", frameSizeX: 414, frameSizeY: 235, frameCount: 40 },
            { assetName: "wallTest", path: imagesPath + "wall_test.png", frameSizeX: 580, frameSizeY: 120, frameCount: 12 },
            { assetName: "sideWalls", path: imagesPath + "sidewalls.png", frameSizeX: 580, frameSizeY: 120, frameCount: 12 },
            { assetName: "wallTriple", path: imagesPath + "wall_triple.png", frameSizeX: 272, frameSizeY: 24, frameCount: 3 },
            { assetName: "wallDebris", path: imagesPath + "wall_debris.png", frameSizeX: 40, frameSizeY: 40, frameCount: 10 },
            { assetName: "wallDebrisDarker", path: imagesPath + "wall_debris_darker.png", frameSizeX: 40, frameSizeY: 40, frameCount: 10 }
        ];
        var win = window;
        win.WebFontConfig = {
            google: {
                families: [
                    'Revalia',
                    'Fredoka One',
                    'Orbitron'
                ]
            },
            active: function () { console.log("Google fonts loaded!"); }
        };
        return _this;
    }
    LoadManager_CL.prototype.preload = function () {
        TH.game.stage.backgroundColor = 0x222326;
        for (var z = 0; z < this.images.length; z++) {
            var img = this.images[z];
            TH.game.load.image(img.assetName, img.path);
        }
        for (var i in this.spritesheets) {
            var sheet = this.spritesheets[i];
            TH.game.load.spritesheet(sheet.assetName, sheet.path, sheet.frameSizeX, sheet.frameSizeY, sheet.frameCount);
        }
        this.game.load.audiosprite("audioSprite", ["sounds/audioSprite.ogg", "sounds/audioSprite.m4a",
            "sounds/audioSprite.mp3", "sounds/audioSprite.ac3"], "sounds/audioSprite.json");
        TH.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        var centerX = this.camera.view.centerX;
        var preloadBg = TH.game.add.sprite(0, 950, "loadBar");
        var loadBarWidth = preloadBg.width;
        preloadBg.x = TH.game.world.centerX - loadBarWidth / 2;
        preloadBg.anchor.y = 0.5;
        preloadBg.tint = 0x444444;
        var preloadSprite = TH.game.add.sprite(TH.game.world.centerX - loadBarWidth / 2, preloadBg.y, "loadBar");
        preloadSprite.anchor.setTo(0, 0.5);
        TH.game.load.setPreloadSprite(preloadSprite);
        this.loadingText = this.add.text(centerX, preloadBg.y, "Loading...");
        this.loadingText.anchor.setTo(0.5);
        this.loadingText.fontSize = 20;
        this.loadingText.fill = "white";
        var logo = this.add.sprite(centerX, 500, "logoSmall");
        logo.anchor.setTo(0.5);
        var thText = this.add.text(centerX, 150, "TANK HUNT ONLINE");
        thText.anchor.setTo(0.5);
        thText.fontSize = 120;
        thText.fontWeight = "bold";
        thText.stroke = "blue";
        thText.strokeThickness = 5;
        var grd = thText.context.createLinearGradient(0, 0, 0, thText.height);
        grd.addColorStop(0, '#8ed7ff');
        grd.addColorStop(1, '#004cb2');
        thText.fill = grd;
        var fsText = this.add.text(centerX, 800, "Set fullscreen mode - press F11 (in most browsers)");
        fsText.anchor.setTo(0.5);
        fsText.fill = "#ffc58e";
        fsText.fontSize = 40;
        var helpText = this.add.text(centerX, 850, "Press CTRL key anytime to show info panel (controls)");
        helpText.anchor.setTo(0.5);
        helpText.fill = "#ffc58e";
        helpText.fontSize = 35;
        var ieComText = this.add.text(centerX, 900, "Compatible browsers: Chrome, Firefox, Opera, Edge, Safari (NOT Internet explorer yet!)");
        ieComText.anchor.setTo(0.5);
        ieComText.fill = "red";
        ieComText.fontSize = 35;
        var crText = this.add.text(centerX, 980, "2018 - Created by Radek Veverka, Vojtěch Veverka, Dominik Plachý");
        crText.anchor.setTo(0.5);
        crText.fontSize = 19;
        crText.fill = "white";
        TH.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        TH.game.scale.pageAlignHorizontally = true;
    };
    LoadManager_CL.prototype.create = function () {
        TH.effects.createAudioSprite();
        this.loadingText.text = "Processing...";
        this.precreate();
        TH.game.time.events.add(1000, this.switchToMenu, this);
    };
    LoadManager_CL.prototype.switchToMenu = function () {
        this.state.start("menu");
    };
    LoadManager_CL.prototype.precreate = function () {
        for (var i in this.spritesheets) {
            var sheet = this.spritesheets[i];
            if (!sheet.precreate)
                continue;
            var spr = TH.game.add.sprite(0, 0, sheet.assetName);
            spr.alpha = 0.01;
        }
    };
    return LoadManager_CL;
}(Phaser.State));
