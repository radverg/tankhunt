import { THGame_SE } from "./THGame_SE";
import { Level_SE } from "../Level_SE";
import { Player_SE } from "../Player_SE";
import { Tank_SE } from "../Tank_SE";

class TeamFight_SE extends THGame_SE {

    private playersPerTeam: number = 3;
    private startCountDown: number = 8000;
    private debug: boolean = true;

    private respawnTime: number = 5000;

    constructor() {
        super();

        this.gameType = "TeamFight";
        this.running = true;
        this.itemManager.startSpawning();
        this.itemManager.maxItems = 20;


        this.level = new Level_SE();
        this.level.parseJSONLevel("team1");

        console.log("Starting TeamFight game...");

    }

     /**
     * Binds player with this game, creates new tank for the player and emits the information to the clients
     * @param {Player_SE} player 
     */
    addPlayer(player: Player_SE) {
        player.game = this; // Bind player with this game
        player.tank = new Tank_SE(player); // Bind player with new tank for this game

        player.alive = true;

        this.players.push(player);

        let index = this.players.length - 1;
        player.team = (index < this.playersPerTeam) ? 1 : 2;

    }

    start() {
        this.startTime = Date.now();
        this.running = true;

        // initial spawn
        for (const plr of this.players) {
            let plDiag = plr.tank.body.hDiagonal;
            let spos = (plr.team == 1) ? this.level.getRandomSpawn1(plDiag, plDiag) :
                this.level.getRandomSpawn2(plDiag, plDiag);

            plr.tank.setPos(spos.x,  spos.y);
            plr.tank.randomizeAngle();
          
        }

        
        this.emitGameStart();
    }
    

    emitGameStart() {
        
        let packet: PacketTeamGameStart = {
            serverTime: Date.now(),
            players: [],
            gameType: this.gameType,
            items: null,
            level: { name: this.level.name },
            countDown: this.startCountDown,

        }

        for (let i = 0; i < this.players.length; i++) {
            packet.players.push(this.players[i].getInfoPacket());
        }
 
        this.emitData("gameStart", packet);
 
    }

    wholeGameEnd(winnerTeam: number) {
       // this.destroy();
       this.remove = true;
    }

    playerDisconnected(player: Player_SE) {
        this.players.splice(this.players.indexOf(player), 1);
        player.game = null;

        // DEBUG !!!!!!
        this.wholeGameEnd(0);
        // if (this.players.length === 1) {
        //     this.wholeGameEnd(1);
        //     console.log("Aborting Team game!");
        // }
    }

     /**
     * Core method of the game, repeatedly called by the game manager. Manages movement, collisions and data emitting
     * @param {number} deltaSec 
     */
    update(deltaSec: number) {
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

                // Can hit only enemies
                if (!this.shots[sh].owner.isEnemyOf(this.players[pl])) continue;

                if (this.shots[sh].isHittingTank(this.players[pl].tank)) {
                    let hitPack = this.shots[sh].hit(this.players[pl].tank);
            
                    let healPack: PacketHeal = null;
                    let attackerTank = this.shots[sh].owner.tank;  
                    let targetTank = this.players[pl].tank;
                    
                    let wasKilled = hitPack.healthAft <= 0;

                    if (wasKilled) {
                        hitPack.resTime = this.respawnTime;
                        healPack = { } as any;
                    }

                    this.shots[sh].owner.stats.countHit(attackerTank.owner, targetTank.owner, hitPack.healthBef, hitPack.healthAft);

                    this.emitHit(hitPack);

                    if (healPack) {
                       // this.emitHeal(healPack);
                    }

                    if (hitPack.healthAft <= 0) {
                        // Respawn player cus he's dead
                        // In arena, new health of attacker needs to be counted
                        this.respawn(this.players[pl]);
                    }
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

    respawn(player: Player_SE) {
        
        setTimeout(() => {

            if (!player.game) return;
            
            let plDiag = player.tank.body.hDiagonal;
            let spos = (player.team == 1) ? this.level.getRandomSpawn1(plDiag, plDiag) :
                this.level.getRandomSpawn2(plDiag, plDiag);

            player.tank.setPos(spos.x,  spos.y);
            player.alive = true;

            var packet: PacketRespawn = player.tank.getStatePacket() as PacketRespawn;
            this.emitRespawn(packet);

        }, this.respawnTime);
    }



}

export { TeamFight_SE };