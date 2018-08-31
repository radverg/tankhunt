
class Stats_CL implements PlayerStats {

    wins: number = 0;
    kills:number = 0;
    deaths: number = 0;
    suic: number = 0;
    teamK: number = 0;

    inRow: number = 0;
    maxRow: number = 0;

    dmgD: number = 0;
    dmgR: number = 0;

    blockC: number = 0;

    caps: number = 0;

    [key: string]: any;

    
    importPacket(packet: PlayerStats) {
        for (const key in packet) {
            (<any>this)[key] = packet[key];
        }
    }

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
    countHit(attackerPl: Player_CL, targetPl: Player_CL, healthBef: number, healthAft: number) {
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
