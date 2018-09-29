import { Player_SE } from "./Player_SE";

class Stats_SE implements PlayerStats {

    wins: number = 0;
    kills:number = 0;
    deaths: number = 0;
    
    /**
     * Suicides
     */
    suic: number = 0;
    /**
     * Team kills
     */
    teamK: number = 0;
    /**
     * Current kills in a row
     */
    inRow: number = 0;
    /**
     * Maximum kills in a row
     */
    maxRow: number = 0;
    /**
     * Damage dealt to the opponents
     */
    dmgD: number = 0;
    /**
     * Damage received from the opponents
     */
    dmgR: number = 0;
    /**
     * Number of shots blocked by armor
     */
    blockC: number = 0;
    /**
     * Amount of captured enemy bases 
     */
    caps: number = 0;

    /**
     * Generates packet from this stats object
     */
    exportPacket(): PlayerStats {
        return {
            deaths: this.deaths,
            kills: this.kills,
            dmgD: this.dmgD,
            dmgR: this.dmgR,
            inRow: this.inRow,
            suic: this.suic,
            maxRow: this.maxRow,
            teamK: this.teamK,
            wins: this.wins,
            blockC: this.blockC,
            caps: this.caps
        }
    }

    /**
     * Very useful method that is called on the attacker's stats, it counts everything related to hit 
     * and modifies defender's stats as well
     */
    countHit(attackerPl: Player_SE, targetPl: Player_SE, healthBef: number, healthAft: number) {
        let attStats = attackerPl.stats;
        let targetStats = targetPl.stats;
        let dmg = healthBef - healthAft;

        if (dmg <= 0) {
            // Shot was blocked
            targetStats.blockC++;
            return;
        }

        // Player is shooting himself
        if (attackerPl === targetPl) {
            targetStats.dmgR += dmg;
            if (healthAft <= 0) {
                // Suicide 
                targetStats.suic++;
                targetStats.deaths++;
                targetStats.inRow = 0;
            }
        } 
        else 
        {
            // Player is shooting somebody else
            if (attackerPl.isEnemyOf(targetPl)) {
                // Player is shooting an enemy
                attStats.dmgD += dmg;
                targetStats.dmgR += dmg;
                if (healthAft <= 0) {
                    // Kill
                    attStats.kills++;
                    attStats.inRow++;
                    attStats.maxRow = Math.max(attStats.maxRow, attStats.inRow);
                    targetStats.deaths++;
                    targetStats.inRow = 0;
                }
            } else {
                // Player is shooting an ally
                if (healthAft <= 0) {
                    targetStats.deaths++;
                    targetStats.inRow = 0;
                    attStats.teamK++;
                }
            }
        }
    }

}

export { Stats_SE }