var THGame_CL = (function () {
    function THGame_CL(socketManager) {
        this.running = false;
        this.level = null;
        this.levelGroup = null;
        this.itemGroup = null;
        this.shotGroup = null;
        this.playerGroup = null;
        this.onPlayerRemove = new Phaser.Signal();
        this.onItemSpawn = new Phaser.Signal();
        this.onItemCollect = new Phaser.Signal();
        this.socketManager = socketManager;
        TH.thGame = this;
        this.init();
    }
    THGame_CL.prototype.update = function () {
        this.playerGroup.updateTanks();
    };
    THGame_CL.prototype.debug = function () {
        if (this.playerGroup.me)
            TH.game.debug.spriteInfo(this.playerGroup.me.tank, 10, 10, "black");
        TH.game.debug.cameraInfo(TH.game.camera, 10, 500, "black");
        if (TH.timeManager.ping)
            TH.game.debug.text(TH.timeManager.ping.toString(), 10, 1000);
    };
    THGame_CL.prototype.processPlayerRemove = function (playerID) {
        var player = this.playerGroup.getPlayer(playerID);
        this.onPlayerRemove.dispatch(player);
        this.playerGroup.removePlayer(playerID);
    };
    THGame_CL.prototype.start = function () {
        this.running = true;
        console.log("Game is running!");
    };
    THGame_CL.prototype.newPlayerFromPacket = function (packet) {
    };
    THGame_CL.prototype.processStateInfo = function (data) {
        if (!this.running)
            return;
        for (var i = 0; i < data.players.length; i++) {
            var player = this.playerGroup.getPlayer(data.players[i].plID);
            if (!player)
                continue;
            player.tank.applyStatePacket(data.players[i]);
        }
    };
    THGame_CL.prototype.processNewShot = function (data) {
        if (!this.running)
            return;
        this.shotGroup.newShot(data);
    };
    ;
    THGame_CL.prototype.processNewItem = function (data) {
        var newItem = new Item_CL(data.x, data.y, data.typeIndex);
        this.itemGroup.addItem(newItem, data.id);
        this.onItemSpawn.dispatch(newItem);
    };
    THGame_CL.prototype.processItemCollect = function (data) {
        console.log("Item collected!");
        var item = this.itemGroup.getItem(data.id);
        if (!item)
            return;
        var collector = this.playerGroup.getPlayer(data.playerID);
        if (collector === this.playerGroup.me) {
        }
        item.getCollected();
        this.onItemCollect.dispatch(item);
    };
    THGame_CL.prototype.processGameInfo = function (data) {
        for (var pl in data.players) {
            if (!this.playerGroup.getPlayer(data.players[pl].id)) {
                this.newPlayerFromPacket(data.players[pl]);
            }
        }
        for (var it in data.items) {
            if (!this.itemGroup.getItem(data.items[it].id))
                this.processNewItem(data.items[it]);
        }
    };
    THGame_CL.prototype.processNewPlayer = function (data) {
        if (this.playerGroup.getPlayer(data.id))
            return;
        this.newPlayerFromPacket(data);
    };
    THGame_CL.prototype.processKill = function (data) {
        if (this.playerGroup.getPlayer(data.killedID)) {
            this.playerGroup.getTank(data.killedID).kill();
        }
    };
    THGame_CL.prototype.processLevel = function (data) {
        this.level = data;
        for (var i = 0; i < this.level.borders.length; i++) {
            var border = this.level.borders[i];
            var borderSprite = new Phaser.Sprite(TH.game, TH.sizeCoeff * border.cX, TH.sizeCoeff * border.cY, "blackRect");
            borderSprite.width = TH.sizeCoeff * border._w;
            borderSprite.height = TH.sizeCoeff * border._h;
            console.log("Border: " + (border.cX * TH.sizeCoeff) + ", " + (border.cY * TH.sizeCoeff) + ", " +
                (border._w * TH.sizeCoeff) + ", " + (border._h * TH.sizeCoeff));
            borderSprite.anchor.setTo(0.5, 0.5);
            this.levelGroup.add(borderSprite);
        }
        var woffset = 200;
        TH.game.world.setBounds(-woffset, -woffset, (this.level.levelRect._w * TH.sizeCoeff) + 2 * woffset, (this.level.levelRect._h * TH.sizeCoeff) + 2 * woffset);
        for (var x = 0; x < this.level.walls.length; x++) {
            for (var y = 0; y < this.level.walls[x].length; y++) {
                for (var i = 0; i < 2; i++) {
                    var wallData = this.level.walls[x][y][i];
                    if (wallData) {
                        var wallSprite = new Phaser.Sprite(TH.game, wallData.cX * TH.sizeCoeff, wallData.cY * TH.sizeCoeff, "blackRect");
                        wallSprite.anchor.setTo(0.5, 0.5);
                        wallSprite.width = wallData._w * TH.sizeCoeff;
                        wallSprite.height = wallData._h * TH.sizeCoeff;
                        this.levelGroup.add(wallSprite);
                    }
                }
            }
        }
        console.log("Level is here!");
    };
    ;
    THGame_CL.prototype.processRespawn = function (data) { };
    ;
    THGame_CL.prototype.setCamera = function () {
        TH.game.camera.follow(this.playerGroup.me.tank);
        TH.game.camera.lerp.setTo(0.1, 0.1);
    };
    THGame_CL.prototype.init = function () {
        this.levelGroup = TH.game.add.group();
        this.itemGroup = new ItemGroup_CL();
        this.shotGroup = new ShotGroup_CL();
        this.playerGroup = new PlayerGroup_CL();
    };
    return THGame_CL;
}());
