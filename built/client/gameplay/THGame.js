"use strict";
var THGame = /** @class */ (function () {
    function THGame(socketManager) {
        this.socketManager = socketManager;
        this.players = {};
        this.playerMe = null;
        this.shots = {};
        this.items = {};
        this.running = false;
        this.level = null;
    }
    THGame.prototype.update = function () {
        // Move and rotate players
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
    /**
     * Determines if player with this id is in the game
     * @param {string} id Id of desired player
     */
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
        return false;
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
        // Collector id is in data.playerID
        if (this.items[data.id]) {
            this.items[data.id].getCollected();
        }
    };
    THGame.prototype.processGameInfo = function (data) {
        // Generate players
        for (var pl in data.players) {
            if (!this.hasPlayer(data.players[pl].id)) {
                this.newPlayerFromPacket(data.players[pl]);
            }
        }
        // Generate items
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
        // Create borders 
        for (var i = 0; i < this.level.borders.length; i++) {
            var border = this.level.borders[i];
            var borderSprite = new Phaser.Sprite(game, game.sizeCoeff * border.cX, game.sizeCoeff * border.cY, "blackRect");
            borderSprite.width = game.sizeCoeff * border.w;
            borderSprite.height = game.sizeCoeff * border.h;
            console.log("Border: " + (border.cX * game.sizeCoeff) + ", " + (border.cY * game.sizeCoeff) + ", " +
                (border.w * game.sizeCoeff) + ", " + (border.h * game.sizeCoeff));
            borderSprite.anchor.setTo(0.5, 0.5);
            game.add.existing(borderSprite);
        }
        // Set world bounds
        var woffset = 200;
        game.world.setBounds(-woffset, -woffset, (this.level.levelRect.w * game.sizeCoeff) + 2 * woffset, (this.level.levelRect.h * game.sizeCoeff) + 2 * woffset);
        // Create wall sprites
        for (var x = 0; x < this.level.walls.length; x++) {
            for (var y = 0; y < this.level.walls[x].length; y++) {
                for (var i = 0; i < 2; i++) {
                    var wallData = this.level.walls[x][y][i];
                    if (wallData) {
                        var wallSprite = new Phaser.Sprite(game, wallData.cX * game.sizeCoeff, wallData.cY * game.sizeCoeff, "blackRect");
                        wallSprite.anchor.setTo(0.5, 0.5);
                        wallSprite.width = wallData.w * game.sizeCoeff;
                        wallSprite.height = wallData.h * game.sizeCoeff;
                        game.add.existing(wallSprite);
                    }
                }
            }
        }
        console.log("Level is here!");
    };
    ;
    THGame.prototype.processRespawn = function (data) {
        return false;
    };
    THGame.prototype.setCamera = function () {
        game.camera.follow(this.playerMe.tank);
        game.camera.lerp.setTo(0.1, 0.1);
    };
    return THGame;
}());
