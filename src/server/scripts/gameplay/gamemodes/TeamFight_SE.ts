import { THGame_SE } from "./THGame_SE";
import { Level_SE } from "../Level_SE";
import { Player_SE } from "../Player_SE";
import { Tank_SE } from "../Tank_SE";
import { Capture_SE } from "../Capture_SE";
import { getRandomInt } from "../utils/MyMath_SE";

class TeamFight_SE extends THGame_SE {

    private playersPerTeam: number = 3;
    private startCountDown: number = 8000;

    private capsPerTeam: number = 10;
    private capTime: number = 4000;
    private team1Caps: number = 0;
    private team2Caps: number = 0;

    private over: boolean = false;

    private debug: boolean = true;

    private respawnTime: number = 5000;
    private health: number = 2000;

    private caps: { [key: string]: Capture_SE } = { };

    constructor() {
        super();

        this.gameType = "TeamFight";
        this.running = true;
        this.itemManager.startSpawning();
        this.itemManager.maxItems = 20;


        this.level = new Level_SE();
        this.level.parseJSONLevel("team1");

        // Generate caps
        let capSqueres1 = this.level.getRandomUniqueSquares(3, 0, this.level.tilesCountX / 2 - 1, this.level.tilesCountY - 1, this.capsPerTeam);
        let capSqueres2 = this.level.getRandomUniqueSquares(this.level.tilesCountX / 2, 0, this.level.tilesCountX - 4, this.level.tilesCountY - 1, this.capsPerTeam);

        for (let i = 0; i < this.capsPerTeam; i++) {

            let cap1 = new Capture_SE(capSqueres1[i].sqrX, capSqueres1[i].y, this.level.squareSize, 1, this.capTime);
            let cap2 = new Capture_SE(capSqueres2[i].sqrX, capSqueres2[i].y, this.level.squareSize, 2, this.capTime);

            this.caps[cap1.id] = cap1;
            this.caps[cap2.id] = cap2;          
        }

        console.log("Generating caps...");
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
            plr.tank.maxHealth = this.health;
            plr.tank.health = this.health;
          
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
            capTime: this.capTime,
            caps: []
        }

        for (let i = 0; i < this.players.length; i++) {
            packet.players.push(this.players[i].getInfoPacket());
        }

        for (const key in this.caps) {
           let cap = this.caps[key];
           packet.caps.push(cap.getPacket());
        }
 
        this.emitData("gameStart", packet);
 
    }

    wholeGameEnd(winnerTeam: number) {
        
        let pack: PacketGameFinish = {
            winnerTeam: winnerTeam
        }

        this.emitData("gFinish", pack);
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

            // Captures
            let capPack = this.handleCapture(this.players[pl]);
            if (capPack) {
                this.emitCapture(capPack);
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

                // Can hit only enemies
                if (!this.shots[sh].owner.isEnemyOf(this.players[pl])) continue;

                if (this.shots[sh].isHittingTank(this.players[pl].tank)) {
                    let hitPack = this.shots[sh].hit(this.players[pl].tank);
            
                    let healPack: PacketHeal = null;
                    let attackerTank = this.shots[sh].owner.tank;  
                    let targetTank = this.players[pl].tank;
                    if (hitPack.healthAft < hitPack.healthBef && targetTank.owner.capture) {
                        // Damage done, reset capture
                        targetTank.owner.capture.resetCapturing();
                    }
                    
                    let wasKilled = hitPack.healthAft <= 0;

                    if (wasKilled) {
                        hitPack.resTime = this.countResTime();
                        healPack = { } as any;
                    }

                    this.shots[sh].owner.stats.countHit(attackerTank.owner, targetTank.owner, hitPack.healthBef, hitPack.healthAft);

                    this.emitHit(hitPack);

                    if (healPack) {
                       // this.emitHeal(healPack);
                    }

                    if (wasKilled) {
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
            player.tank.health = player.tank.maxHealth;

            var packet: PacketRespawn = player.tank.getStatePacket() as PacketRespawn;
            packet.health = player.tank.health;
        
            this.emitRespawn(packet);

        }, this.respawnTime);
    }

    countResTime() {
        let delta = Date.now() - this.startTime;
        let halfMins = Math.round(delta / 30000);

        return Math.min(3 + halfMins, 40) * 1000;
    }

    handleCapture(player: Player_SE): PacketCapture | null {

        let cap = this.caps[`a${this.level.getSqrX(player.tank.x)}|${this.level.getSqrX(player.tank.y)}`];
        
        if (cap && !cap.remove && cap.team !== player.team) {
            // Player is standing in enemy cap
            if (player.capture !== cap) {
                if (player.capture) {
                    return player.capture.cancelCapturing();
                }
                // Start capturing, if it is not being captured
                if (!cap.capturing)
                    return cap.startCapturing(player);
            } else {
                // Standing still...
                if (cap.isCaptured()) {
                    if (cap.team === 1) this.team1Caps++;
                    else this.team2Caps++;
                    this.checkFinish();
                    return cap.finishCapturing();   
                }
            }

        }
        else {
            // Player is not standing in a cap or the cap is different
            if (player.capture !== null) {
                // He was capping previously
                return player.capture.cancelCapturing();
            }

        }

        return null;
    }

    checkFinish() {

        if (this.team1Caps < this.capsPerTeam && this.team2Caps < this.capsPerTeam && !this.over) return;

        let winnerTeam = (this.team1Caps > this.team2Caps) ? 1 : 2;
        this.over = true;
        
        setTimeout(() => {
            this.wholeGameEnd(winnerTeam);
        }, 500);
      
    }



}

export { TeamFight_SE };