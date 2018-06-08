var Geom = require("./Geometry");
var GO = require("./GameObject");
var Prop = require("./AllProperties");
var Mt = require("./MyMath");
var LC = require("./LevelCreator");
var Gm = require("./THGame");

class TestGame extends Gm {

    constructor() {
        super();
        this.running = true;
        this.level = LC.newDefaultLevel();    
    }

    update(deltaSec) {
        if (!this.running) return;
        this.updateCounter++;

        // Move, rotate, collide players
        for (var pl = 0; pl < this.players.length; pl++) {
            
            this.players[pl].tank.update(deltaSec);
            this.players[pl].tank.wallCollide(this.level);

        }

        // Move, collide shots
        for (var sh = 0; sh < this.shots.length; sh++) {
            this.shots[sh].update(deltaSec);

            // Handle shot removing
            if (this.shots[sh].remove) {
                this.shots.splice(sh, 1);
                sh -= 1;
                continue;
            }

            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].tank.body.rotContains(this.shots[sh].x, this.shots[sh].y)) {

                    this.killPlayer(this.players[i], this.shots[sh].owner, this.shots[sh]);
                }
            }
            // var col = this.shots[sh].checkOverlapArray(this.players);
            // if (col) {
            //     this.killPlayer(col, this.shots[sh].owner, this.shots[sh]);
            // }
        }

        // Send players state every third frame ( 20 per second)
        if ((this.updateCounter % 3) == 0) {
            this.emitMovable();
        }

    }

    addPlayer(player) {
        player.game = this;
        this.players.push(player);
        this.emitLevelPl(player);

    }

    playerDisconnected(player) {
        var index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
        }

        this.manager.sendTo(this.players, "removePlayer", player.socket.id);
    }

    emitLevelPl(player) {
        this.emitDataPl("level", this.level, player);
    };
}

module.exports = TestGame;