var LoadManager_CL = (function () {
    function LoadManager_CL(th) {
        this.th = th;
        var imagesPath = "assets/images/";
        this.images = [
            { assetName: "blackRect", path: imagesPath + "blackRect.png" },
            { assetName: "whiteRect", path: imagesPath + "whiteRect.png" },
            { assetName: "defaultTurret", path: imagesPath + "default_turret.png" },
            { assetName: "ammo", path: imagesPath + "ammo.png" }
        ];
        this.spritesheets = [
            { assetName: "tankBodys", path: imagesPath + "tank_bodys.png", frameSizeX: 96, frameSizeY: 138, frameCount: 4 },
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
        this.th.onPhaserLoad();
        TH.game.state.start("play");
    };
    return LoadManager_CL;
}());
