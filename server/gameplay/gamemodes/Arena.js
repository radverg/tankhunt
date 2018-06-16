var THGame = require("./THGame");
var Tank = require("../Tank");
var ItemManager = require("../ItemManager");
var Level = require("../Level");
var Levels = require("../../../shared/Levels");
/**
 * Arena game class
 */
class Arena extends THGame {

    constructor(capacity) {
        super();

        this.capacity = capacity || 20;
        this.running = true;
        this.itemManager = new ItemManager(this);
        this.itemManager.startSpawning();
        this.level = new Level();
        this.level.parseJSONLevel(Levels.arena1);  

        this.respawnDelay = 1000;
        this.immunityTime = 3000; 

        console.log("Starting Arena game...");  
    }

    /**
     * Binds player with this game, creates new tank for the player and emits the information to the clients
     * @param {Player} player 
     */
    addPlayer(player) {
        player.game = this; // Bind player with this game
        player.tank = new Tank(player); // Bind player with new tank for this game

        player.alive = false; // Player is going to be included in the game by respawn

        this.players.push(player);

        this.emitLevelPl(player);
        this.emitInfoToPl(player);
        this.emitNewPl(player);
        this.respawn(player);

        console.log("New player joined the arena!");
    }

    /**
     * This method is called by socket manager when a client disconnects
     * and is in the game at that moment.
     * @param {player} player 
     */
    playerDisconnected(player) {
        var index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
        
        this.emitRemove(player.socket.id);
    }

    /**
     * Sets new random position and rotation to the player's tank,
     * Generates the packets and emits info about respawn
     * Creates timeout for reviving tank according to respawnDelay property
     * @param {player} player Player to perform respawn on
     */
    respawn(player) {
        var spawnPos = this.level.getRandomSpawn1(player.tank.body.hDiagonal, player.tank.body.hDiagonal);
        player.tank.randomizeAngle();
        player.tank.turret.randomizeAngle();
        player.tank.setPos(spawnPos.x, spawnPos.y);

        var packet = player.tank.getStatePacket();
        
        packet.serverTime = Date.serverTime;
        packet.respawnDelay = this.respawnDelay;
        packet.immunityTime = this.immunityTime;

        setTimeout(function() { player.alive = true; }, this.respawnDelay); // Timeout for player revival

        this.emitRespawn(packet);
    }

    /**
     * Sets players property alive to false
     * Sets the players' stats
     * Emits info about this kill
     * Respawns killed player
     * @param {Player} killed Player that was killed
     * @param {Player} killer Player that was killing
     * @param {Shot} shot Shot that was killing
     */
    killPlayer(killed, killer, shot) {
        killed.die();
        if (killer !== killed) killer.stats.kills++;
       
        this.emitKill(killed.id, killer.id, shot.id);
        this.respawn(killed);
    }

    /**
     * Core method of the game, repeatedly called by the game manager. Manages movement, collisions and data emitting
     * @param {number} deltaSec 
     */
    update(deltaSec) {
        if (!this.running) return;
        this.updateCounter++;
        
        let firstTank = true;
        // Update tanks
        for (var pl = 0; pl < this.players.length; pl++) {
            if (!this.players[pl].alive) continue; // Skip dead players
            
            this.players[pl].tank.update(deltaSec);
            this.players[pl].tank.wallCollide(this.level);

            // Check players against items
            this.itemManager.checkForTank(this.players[pl].tank);
            
            // Update shots
            for (let sh = 0; sh < this.shots.length; sh++) {
                
                if (firstTank) { // Its for the first time => update
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

            firstTank = false;
        }

        // Update (spawn) items
        this.itemManager.update();
        
        // Send players state every third frame ( 20 per second)
        if ((this.updateCounter % 3) == 0) {
            this.emitMovable();
        }
    }

     /**
     * Sends packet to specified player containing all players' id, names, positions, rotations, stats.
     * Also contains all items currently in the game.
     * DOES NOT CONTAIN LEVEL
     * @param {player} player 
     */
    emitInfoToPl(player) {
        var data = {
            players: [],
            items: this.itemManager.getItemsPacket()
        }

        for (let i = 0; i < this.players.length; i++) {
           data.players.push(this.players[i].getInfoPacket());
        }

        this.emitDataPl("gameInfo", data, player);
    }

    /**
     * Sends to everyone info about a player
     * @param {player} player 
     */
    emitNewPl(player) {
        this.emitData("newPlayer", player.getInfoPacket());
    }

    emitRespawn(data) {
        this.emitData("respawn", data);
    }
}

module.exports = Arena;