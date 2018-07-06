var LoadManager_CL = (function () {
    function LoadManager_CL(th) {
        this.th = th;
        var imagesPath = "assets/images/";
        this.images = [
            { assetName: "blackRect", path: imagesPath + "blackRect.png" },
            { assetName: "whiteRect", path: imagesPath + "whiteRect.png" },
            { assetName: "ammo", path: imagesPath + "ammo.png" }
        ];
        this.spritesheets = [
            { assetName: "tankBodys", path: imagesPath + "tank_bodys.png", frameSizeX: 96, frameSizeY: 138, frameCount: 4 },
            { assetName: "defaultTurrets", path: imagesPath + "default_turrets.png", frameSizeX: 60, frameSizeY: 194, frameCount: 4 },
            { assetName: "items", path: imagesPath + "items.png", frameSizeX: 46, frameSizeY: 46, frameCount: 8 },
        ];
    }
    LoadManager_CL.prototype.preload = function () {
        for (var z = 0; z < this.images.length; z++) {
            var img = this.images[z];
            TH.game.load.image(img.assetName, img.path);
        }
        for (var i in this.spritesheets) {
            var sheet = this.spritesheets[i];
            TH.game.load.spritesheet(sheet.assetName, sheet.path, sheet.frameSizeX, sheet.frameSizeY, sheet.frameCount);
        }
    };
    LoadManager_CL.prototype.create = function () {
        TH.game.state.start("play");
    };
    return LoadManager_CL;
}());
