var THGame = (function () {
    function THGame(socketManager) {
        this.players = {};
        this.playerMe = null;
        this.shots = {};
        this.items = {};
        this.running = false;
        this.level = null;
        this.socketManager = socketManager;
    }
    THGame.prototype.update = function () {
        var pkeys = Object.keys(this.players);
        for (var i = 0; i < pkeys.length; i++) {
            this.players[pkeys[i]].tank.interpolate();
            this.players[pkeys[i]].tank.interpolateAngle();
            this.players[pkeys[i]].tank.updateTurret();
            this.players[pkeys[i]].tank.turret.interpolateAngle();
        }
    };
    THGame.prototype.addPlayer = function (player) {
        this.players[player.id] = player;
    };
    THGame.prototype.hasPlayer = function (id) {
        return this.players[id];
    };
    THGame.prototype.removePlayer = function (player) {
        this.players[player.id].removeTank();
        delete this.players[player.id];
    };
    THGame.prototype.start = function () {
        this.running = true;
        console.log("Game is running!");
    };
    THGame.prototype.newPlayerFromPacket = function (packet) {
    };
    THGame.prototype.processStateInfo = function (data) {
        if (!this.running)
            return;
        for (var i = 0; i < data.players.length; i++) {
            if (!this.hasPlayer(data.players[i].plID))
                continue;
            this.players[data.players[i].plID].tank.applyStatePacket(data.players[i]);
        }
    };
    THGame.prototype.processNewShot = function (data) {
        if (!this.running)
            return;
        var type = data.type;
        var sh = new Shots[type](data);
        this.shots[data.id] = sh;
    };
    ;
    THGame.prototype.processNewItem = function (data) {
        this.items[data.id] = new Item(data.x, data.y, data.typeIndex);
    };
    THGame.prototype.processItemCollect = function (data) {
        if (this.items[data.id]) {
            this.items[data.id].getCollected();
        }
    };
    THGame.prototype.processGameInfo = function (data) {
        for (var pl in data.players) {
            if (!this.hasPlayer(data.players[pl].id)) {
                this.newPlayerFromPacket(data.players[pl]);
            }
        }
        for (var it in data.items) {
            if (!this.items[data.items[it].id])
                this.processNewItem(data.items[it]);
        }
    };
    THGame.prototype.processNewPlayer = function (data) {
        if (this.players[data.id])
            return;
        this.newPlayerFromPacket(data);
    };
    THGame.prototype.processKill = function (data) {
        if (this.hasPlayer(data.killedID)) {
            this.players[data.killedID].tank.kill();
        }
    };
    THGame.prototype.processLevel = function (data) {
        this.level = data;
        for (var i = 0; i < this.level.borders.length; i++) {
            var border = this.level.borders[i];
            var borderSprite = new Phaser.Sprite(TH.game, TH.sizeCoeff * border.cX, TH.sizeCoeff * border.cY, "blackRect");
            borderSprite.width = TH.sizeCoeff * border.w;
            borderSprite.height = TH.sizeCoeff * border.h;
            console.log("Border: " + (border.cX * TH.sizeCoeff) + ", " + (border.cY * TH.sizeCoeff) + ", " +
                (border.w * TH.sizeCoeff) + ", " + (border.h * TH.sizeCoeff));
            borderSprite.anchor.setTo(0.5, 0.5);
            TH.game.add.existing(borderSprite);
        }
        var woffset = 200;
        TH.game.world.setBounds(-woffset, -woffset, (this.level.levelRect.w * TH.sizeCoeff) + 2 * woffset, (this.level.levelRect.h * TH.sizeCoeff) + 2 * woffset);
        for (var x = 0; x < this.level.walls.length; x++) {
            for (var y = 0; y < this.level.walls[x].length; y++) {
                for (var i = 0; i < 2; i++) {
                    var wallData = this.level.walls[x][y][i];
                    if (wallData) {
                        var wallSprite = new Phaser.Sprite(TH.game, wallData.cX * TH.sizeCoeff, wallData.cY * TH.sizeCoeff, "blackRect");
                        wallSprite.anchor.setTo(0.5, 0.5);
                        wallSprite.width = wallData.w * TH.sizeCoeff;
                        wallSprite.height = wallData.h * TH.sizeCoeff;
                        TH.game.add.existing(wallSprite);
                    }
                }
            }
        }
        console.log("Level is here!");
    };
    ;
    THGame.prototype.processRespawn = function (data) {
    };
    THGame.prototype.setCamera = function () {
        TH.game.camera.follow(this.playerMe.tank);
        TH.game.camera.lerp.setTo(0.1, 0.1);
    };
    return THGame;
}());
