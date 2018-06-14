var Geom = require("../utils/Geometry");
var GO = require("../utils/GameObject");
var Mt = require("../utils/MyMath");
var Level = require("../Level");
var Levels = require("../../../shared/Levels.js");
var Gm = require("./THGame");

class TestGame extends Gm {
    
    constructor() {
        super();
        this.running = true;
        this.level = new Level();
        this.level.parseJSONLevel(Levels.arena1);  
        console.log("Starting test game...");  
    }
    
    update(deltaSec) {
        if (!this.running) return;
        this.updateCounter++;
        
        // Update players
        for (var pl = 0; pl < this.players.length; pl++) {
            
            this.players[pl].tank.update(deltaSec);
            this.players[pl].tank.wallCollide(this.level);
            
            // Update shots
            for (let sh = 0; sh < this.shots.length; sh++) {
                
                if (pl == 0) { // Its for the first time => update
                    // Handle shot removing 
                    if (this.shots[sh].remove) {
                        this.shots.splice(sh, 1);
                        sh -= 1;
                        continue;
                    }
                    
                    this.shots[sh].update(deltaSec);
                }
                
                // Shot hitting players
                if (this.shots[sh].isHittingTank(this.players[pl].tank)) {
                    this.killPlayer(this.players[pl], this.shots[sh].owner, this.shots[sh]);
                }  
            }
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
        
        this.emitRemove(player.socket.id);
    }
    
    emitLevelPl(player) {
        this.emitDataPl("level", this.level, player);
    };
}

module.exports = TestGame;