"use strict";
var LoadManager = /** @class */ (function () {
    function LoadManager() {
        var imagesPath = "assets/images/";
        // Assets ----------------------------------------------------------------------------
        this.images = [
            { assetName: "blackRect", path: imagesPath + "blackRect.png" },
            { assetName: "whiteRect", path: imagesPath + "whiteRect.png" },
            { assetName: "defaultTurret", path: imagesPath + "default_turret.png" },
            { assetName: "ammo", path: imagesPath + "ammo.png" }
        ];
        this.spritesheets = [
            { assetName: "tankBodys", path: imagesPath + "tank_bodys.png", frameSizeX: 96, frameSizeY: 138, frameCount: 4 },
        ];
        // -----------------------------------------------------------------------------------	
    }
    LoadManager.prototype.preload = function () {
        // Load images --------------------------------
        for (var i = 0; i < this.images.length; i++) {
            var img = this.images[i];
            game.load.image(img.assetName, img.path);
        }
        // --------------------------------------------
        // Load spritesheets --------------------------
        for (var i in this.spritesheets) {
            var sheet = this.spritesheets[i];
            game.load.spritesheet(sheet.assetName, sheet.path, sheet.frameSizeX, sheet.frameSizeY, sheet.frameCount);
        }
    };
    LoadManager.prototype.create = function () {
        game.state.start("play");
    };
    return LoadManager;
}());
