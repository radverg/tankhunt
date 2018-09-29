import { THGame_SE } from "./THGame_SE";
import { Player_SE } from "../Player_SE";
import { Tank_SE } from "../Tank_SE";
import { Level_SE, LoadedLevels } from "../Level_SE";
import { getRandomInt } from "../utils/MyMath_SE";
import { Stats_SE } from "../Stats_SE";

class Duel_SE extends THGame_SE {

    private playerCount: number = 2;
    private startDelay: number = 2000;
    private endDelay: number = 3500;
    private isWinPending: boolean = false;
    private maxWins: number = 15;
    private currentRound: number = 0;
    private duelMapCount: number = 20;

    private levels: Level_SE[] = [];

    private maxHealth: number = 2500;
    private minHealth: number = 100;

    private subGameRunning: boolean = false;

    constructor() {
        super();

        this.gameType = "Duel";

        // Generate levels
        for (let i = 0; i < this.duelMapCount; i++) {
            let ll: any = LoadedLevels;
            this.levels.push(ll[`duel${i+1}`]);
        }

        this.itemManager.maxItems = 8;
        this.itemManager.spawning = true;

        this.blockInput = true;
    }

    playerDisconnected(player: Player_SE) {

        this.players.splice(this.players.indexOf(player), 1);
        player.game = null;

        if (this.players.length === 1) {
            this.wholeGameEnd(this.players[0]);
            console.log("Aborting duel game!");
        }
    }

    /**
     * Binds player with this game, creates new tank for the player and emits the information to the clients
     * @param {Player_SE} player 
     */
    addPlayer(player: Player_SE) {
        player.game = this; // Bind player with this game
        player.tank = new Tank_SE(player); // Bind player with new tank for this game

        player.alive = true;
        player.stats = new Stats_SE();

        this.players.push(player);
    }

    subgameEnd(winner: Player_SE) {

        this.currentRound++;
        this.blockInput = true;
        this.subGameRunning = false;

        let nextLevel = this.levels[Math.floor(Math.random() * this.levels.length)];

        let packet: PacketGameFinish = {
            subgame: true,

            nextDelay: this.startDelay,
            nextLevel: {
                name: nextLevel.name
            }
        }

        this.itemManager.clear();
        this.itemManager.spawning = false;
        this.shots = [];
        this.level = nextLevel;

        if (winner) { // No tie
            packet.winnerID = winner.id;
            winner.stats.wins++;
        

            if (winner.stats.wins >= this.maxWins) { // Game finished
                this.wholeGameEnd(winner);
                return;
            } 
        }

        this.generatePostions();
        this.reviveAll();

        if (this.players[0]) {
            packet.nextHealth = this.players[0].tank.health;
        }

        setTimeout(() => { this.subGameRunning = true; this.blockInput = false; this.itemManager.spawning = true; }, this.startDelay);

        this.emitData("gFinish", packet);
    }

    winPending(winAdept: Player_SE) {
		if (this.isWinPending) return;
        this.isWinPending = true;

        setTimeout(() => {
            if (this.remove) return;
            this.isWinPending = false;
            let winner = (winAdept.alive) ? winAdept : null;
            this.subGameRunning = false;
            this.subgameEnd(winner);

        }, this.endDelay);
    }

    wholeGameEnd(winner: Player_SE) {
        let packet: PacketGameFinish = {
            winnerID: winner.id
        }

        this.emitData("gFinish", packet);

        this.remove = true;
    }

    reviveAll() {
        let rndHealt = getRandomInt(this.minHealth, this.maxHealth);

        for (const plr of this.players) {
            plr.alive = true;
            plr.invisible = false;
            plr.tank.stopCompletely();
            plr.tank.maxHealth = rndHealt;
            plr.tank.health = rndHealt;
            plr.tank.specialGun = null;
        }
        
    }

    emitGameStart() {
        var packet: PacketGameStart = {
            serverTime: Date.now(),
            players: [],
            items: null,
            gameType: this.gameType,
            level: {
                name: this.level.name
            }, 
            countDown: this.startDelay,
            winCount: this.maxWins
        }

        for (let i = 0; i < this.players.length; i++) {
           packet.players.push(this.players[i].getInfoPacket());
        }

        this.emitData("gameStart", packet);
    }

    start() {
        this.startTime = Date.now();
        this.running = true;
        this.level = this.levels[0];
        this.generatePostions();
        this.reviveAll();

        this.emitGameStart();

        setTimeout(() => { this.subGameRunning = true; this.blockInput = false; }, this.startDelay);
    }

    generatePostions() {
        for (let i = 0; i < this.players.length; i++) {
            let plr = this.players[i];
            let pos = this.level.getRandomSpawn1(plr.tank.body.w, plr.tank.body.h);
            plr.tank.randomizeAngle();
            plr.tank.turret.angle = 0;
            plr.tank.setPos(pos.x, pos.y);
        }
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
                if (this.shots[sh].isHittingTank(this.players[pl].tank)) {

                    let packet = this.shots[sh].hit(this.players[pl].tank, true);
                    let attackerTank = this.shots[sh].owner.tank;
                    let targetTank = this.players[pl].tank;

                    attackerTank.owner.stats.countHit(attackerTank.owner, targetTank.owner, packet.healthBef, packet.healthAft);

                    // Check if only one is alive
                    let livingPlrs = this.players.filter(function(value: Player_SE) {
                        return value.alive;
                    });

                    if (livingPlrs.length == 1) {
                        this.winPending(livingPlrs[0]);
                    }

                    this.emitHit(packet);
              
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

    destroy() {
        super.destroy();
        this.levels = null;
    }
}

export { Duel_SE }