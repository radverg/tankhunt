import { Player_SE } from "../Player_SE";
import { Level_SE, LoadedLevels } from "../Level_SE";
import { Tank_SE } from "../Tank_SE";
import { THGame_SE } from "./THGame_SE";
import { Stats_SE } from "../Stats_SE";
/**
 * Arena game class
 */
class Arena_SE extends THGame_SE {

    private respawnDelay: number = 1800;
    private immunityTime: number = 5000;
    private startUpHealth: number = 500;
    private maxHealth: number = 2500;

    constructor(capacity: number) {
        super();
        this.gameType = "Arena";
        this.capacity = capacity || 10;
        this.running = true;
        this.itemManager.startSpawning();
        
        // Level 
        let ll: any = LoadedLevels;  
        this.level = ll["arena2"];

        console.log("Starting Arena game...");  
    }

    /**
     * Binds player with this game, creates new tank for the player and emits the information to the clients
     * @param {Player_SE} player 
     */
    addPlayer(player: Player_SE) {

        player.game = this; // Bind player with this game
        player.tank = new Tank_SE(player); // Bind player with new tank for this game

        player.alive = false; // Player is going to be included in the game by respawn
        player.lastInput = Date.now();
        player.invisible = false;

        player.stats = new Stats_SE();

        this.players.push(player);

        this.emitGameStartToPl(player);
        this.emitNewPl(player);
        this.respawn(player);

        console.log("New player joined the arena!");
    }

    /**
     * This method is called by socket manager when a client disconnects
     * and is in the game at that moment.
     * @param {Player_SE} player 
     */
    playerDisconnected(player: Player_SE) {

        var index = this.players.indexOf(player);
        this.tidyPlayerShots(player);
        this.emitRemove(player.id);

        if (index !== -1) {
            this.players.splice(index, 1);
        }

        player.game = null; 
    }

    /**
     * Sets new random position and rotation to the player's tank,
     * Generates the packets and emits info about respawn
     * Creates timeout for reviving tank according to respawnDelay property
     * Handles the immunity as well
     * @param {player} player Player to perform respawn on
     */
    respawn(player: Player_SE) {

        var spawnPos = this.level.getRandomSpawn1(player.tank.body.hDiagonal, player.tank.body.hDiagonal);
        player.tank.randomizeAngle();
        player.tank.turret.randomizeAngle();

        // Reset health on respawning
        player.tank.maxHealth = this.startUpHealth;
        player.tank.health = this.startUpHealth;

        var packet: PacketRespawn = player.tank.getStatePacket() as PacketRespawn;
        packet.x = spawnPos.x;
        packet.y = spawnPos.y;
        
        packet.serverTime = Date.now();
        packet.respawnDelay = this.respawnDelay;
        packet.immunityTime = this.immunityTime;
        packet.health = player.tank.health;

        player.invulnerable = true;

        setTimeout(function() { player.alive = true; player.tank.setPos(spawnPos.x, spawnPos.y); }, this.respawnDelay); // Timeout for player revival
        setTimeout(function() { player.invulnerable = false; }, this.respawnDelay + this.immunityTime); // Timeout for immunity

        this.emitRespawn(packet);
    }

    /**
     * Core method of the game, repeatedly called by the game manager. Manages movement, collisions and data emitting
     * @param {number} deltaSec 
     */
    update(deltaSec: number) {
        this.now = Date.now();
        if (!this.running) return;
        this.updateCounter++;
        
        let firstTank = true;
        // Update tanks
        for (var pl = 0; pl < this.players.length; pl++) {
            if (!this.players[pl].alive) continue; // Skip dead players

            if (this.now - this.players[pl].lastInput > 50000) {
                // Kick player for being afk
                this.kickPlayer(this.players[pl]);
                pl--;
                continue;
            }
           
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
                    let hitPack = this.shots[sh].hit(this.players[pl].tank);
                    let healPack: PacketHeal = null;
                    let attackerTank = this.shots[sh].owner.tank;  
                    let targetTank = this.players[pl].tank;
                    
                    let wasKilled = hitPack.healthAft <= 0;

                    if (wasKilled) {
                        healPack = { } as any;

                        healPack.plID = attackerTank.owner.id;
                        healPack.healthBef = attackerTank.health;
                        healPack.maxHealthBef = attackerTank.maxHealth;

                        attackerTank.maxHealth *= 1.3;
                        if (attackerTank.maxHealth > this.maxHealth) {
                            attackerTank.maxHealth = this.maxHealth;
                        }
                        attackerTank.health = attackerTank.maxHealth;

                        healPack.healthAft = attackerTank.health;
                        healPack.maxHealthAft = attackerTank.maxHealth     
                    }

                    this.shots[sh].owner.stats.countHit(attackerTank.owner, targetTank.owner, hitPack.healthBef, hitPack.healthAft);

                    this.emitHit(hitPack);

                    if (healPack) {
                        this.emitHeal(healPack);
                    }

                    if (hitPack.healthAft <= 0) {
                        // Respawn player cus he's dead
                        // In arena, new health of attacker needs to be counted
                        this.respawn(this.players[pl]);
                    }
                }  
            }

            this.players[pl].tank.update(deltaSec);
            this.players[pl].tank.wallCollide(this.level);

            // Check players against items
            this.itemManager.checkForTank(this.players[pl].tank);

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
     * @param {Player_SE} player 
     */
    emitInfoToPl(player: Player_SE) {
        var packet: PacketGameInfo = {
            players: [],
            items: this.itemManager.getItemsPacket()
        }

        for (let i = 0; i < this.players.length; i++) {
           packet.players.push(this.players[i].getInfoPacket());
        }

        this.emitDataPl("gameInfo", packet, player);
    }

    emitGameStartToPl(player: Player_SE) {
        var packet: PacketGameStart = {
            serverTime: Date.now(),
            players: [],
            items: this.itemManager.getItemsPacket(),
            gameType: this.gameType,
            level: {
                name: this.level.name
            }
        }

        for (let i = 0; i < this.players.length; i++) {
           packet.players.push(this.players[i].getInfoPacket());
        }
        this.emitDataPl("gameStart", packet, player);
    }

    /**
     * Sends to everyone info about a player
     * @param {Player_SE} player 
     */
    emitNewPl(player: Player_SE) {
        this.emitData("newPlayer", player.getInfoPacket());
    }
}

export { Arena_SE };