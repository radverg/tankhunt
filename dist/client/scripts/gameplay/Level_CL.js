var Level_CL = (function () {
    function Level_CL() {
    }
    Level_CL.prototype.getSqrSize = function () {
        return this.squareSize;
    };
    Level_CL.prototype.fromJSON = function (jsonString, wallGroup) {
        var jsonLvl = null;
        wallGroup.removeAll(true);
        this.wallGroup = wallGroup;
        try {
            jsonLvl = JSON.parse(jsonString);
        }
        catch (error) {
            console.log("Cannot parse JSON string! " + error.message);
        }
        this.tilesCountX = jsonLvl.tilesCountX;
        this.tilesCountY = jsonLvl.tilesCountY;
        this.wallThickness = jsonLvl.wallThickness * TH.sizeCoeff;
        this.squareSize = jsonLvl.squareSize * TH.sizeCoeff;
        var lvlWidth = this.tilesCountX * this.squareSize;
        var lvlHeight = this.tilesCountY * this.squareSize;
        var wallWidth = this.squareSize + this.wallThickness;
        var wallHeight = 18;
        var woffsetX = TH.game.width / 2;
        var woffsetY = TH.game.height / 2;
        TH.game.world.setBounds(-woffsetX, -woffsetY, (lvlWidth) + woffsetX * 2, (lvlHeight) + 2 * woffsetY);
        var groundAsset = "ground".concat(Math.floor(Math.random() * 7) + 1);
        var outBack = 1000;
        var bcg = TH.game.make.tileSprite(-woffsetX, -woffsetY, TH.game.world.width + woffsetX * 2, TH.game.world.height + woffsetY * 2, groundAsset, 0);
        wallGroup.add(bcg);
        var wallFrame = Math.floor(Math.random() * 3);
        for (var i in jsonLvl.walls) {
            var splitted = jsonLvl.walls[i].split("|");
            var y = parseInt(splitted[1]) * this.squareSize;
            var x = parseInt(splitted[0]) * this.squareSize;
            var type = parseInt(splitted[2]);
            var wallSpr = TH.game.make.sprite(x, y, "wallTriple");
            wallSpr.frame = wallFrame;
            wallSpr.width = wallWidth;
            wallSpr.height = wallHeight;
            wallSpr.anchor.setTo(0.5);
            if (type === 0) {
                wallSpr.x += this.squareSize / 2;
            }
            else {
                wallSpr.y += this.squareSize / 2;
                wallSpr.rotation = Math.PI / 2;
            }
            wallGroup.add(wallSpr);
        }
        this.generateBorders();
        console.log("Level parsed!");
    };
    Level_CL.prototype.generateBorders = function () {
        var lvlWidth = this.tilesCountX * this.squareSize;
        var lvlHeight = this.tilesCountY * this.squareSize;
        var targetSize = 580;
        var borderCount = Math.ceil(lvlWidth / targetSize);
        var realSize = lvlWidth / borderCount;
        var thickness = null;
        var trim = 30;
        var borderAsset = "wallTest";
        var borderNum = Math.floor(Math.random() * 4);
        for (var i = 0; i < borderCount; i++) {
            var spr1 = TH.game.make.sprite((realSize * i) + realSize / 2, 0, borderAsset);
            spr1.anchor.setTo(0.5);
            spr1.width = realSize;
            spr1.scale.y = spr1.scale.x;
            thickness = spr1.height;
            spr1.y = -thickness / 2 + trim;
            var frm = borderNum * 3 + (i % 3);
            spr1.frame = frm;
            var spr2 = TH.game.make.sprite((realSize * i) + realSize / 2, 0, borderAsset);
            spr2.anchor.setTo(0.5);
            spr2.width = realSize;
            spr2.scale.y = spr2.scale.x;
            spr2.y = lvlHeight + thickness / 2 - trim;
            spr2.frame = frm;
            this.wallGroup.add(spr1);
            this.wallGroup.add(spr2);
        }
        var thck = thickness - trim * 1.65;
        borderCount = Math.ceil((lvlHeight + thck * 2) / targetSize);
        realSize = (lvlHeight + (thck * 2)) / borderCount;
        var verThickness = null;
        for (var i = 0; i < borderCount; i++) {
            var spr1 = TH.game.make.sprite(0, (realSize * i) + realSize / 2 - thck, borderAsset);
            spr1.anchor.setTo(0.5);
            spr1.width = realSize;
            spr1.rotation = Math.PI / 2;
            spr1.scale.y = spr1.scale.x;
            verThickness = spr1.height;
            spr1.x = -verThickness / 2 + trim;
            var frm = borderNum * 3 + (i % 3);
            spr1.frame = frm;
            var spr2 = TH.game.make.sprite(lvlWidth + verThickness / 2 - trim, (realSize * i) + realSize / 2 - thck, borderAsset);
            spr2.anchor.setTo(0.5);
            spr2.width = realSize;
            spr2.rotation = Math.PI / 2;
            spr2.scale.y = spr2.scale.x;
            spr2.frame = frm;
            this.wallGroup.add(spr1);
            this.wallGroup.add(spr2);
        }
    };
    return Level_CL;
}());
