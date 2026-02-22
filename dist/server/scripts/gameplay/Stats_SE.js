"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats_SE = void 0;
var Stats_SE = (function () {
    function Stats_SE() {
        this.wins = 0;
        this.kills = 0;
        this.deaths = 0;
        this.suic = 0;
        this.teamK = 0;
        this.inRow = 0;
        this.maxRow = 0;
        this.dmgD = 0;
        this.dmgR = 0;
        this.blockC = 0;
        this.caps = 0;
    }
    Stats_SE.prototype.exportPacket = function () {
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
        };
    };
    Stats_SE.prototype.countHit = function (attackerPl, targetPl, healthBef, healthAft) {
        var attStats = attackerPl.stats;
        var targetStats = targetPl.stats;
        var dmg = healthBef - healthAft;
        if (dmg <= 0) {
            targetStats.blockC++;
            return;
        }
        if (attackerPl === targetPl) {
            targetStats.dmgR += dmg;
            if (healthAft <= 0) {
                targetStats.suic++;
                targetStats.deaths++;
                targetStats.inRow = 0;
            }
        }
        else {
            if (attackerPl.isEnemyOf(targetPl)) {
                attStats.dmgD += dmg;
                targetStats.dmgR += dmg;
                if (healthAft <= 0) {
                    attStats.kills++;
                    attStats.inRow++;
                    attStats.maxRow = Math.max(attStats.maxRow, attStats.inRow);
                    targetStats.deaths++;
                    targetStats.inRow = 0;
                }
            }
            else {
                if (healthAft <= 0) {
                    targetStats.deaths++;
                    targetStats.inRow = 0;
                    attStats.teamK++;
                }
            }
        }
    };
    return Stats_SE;
}());
exports.Stats_SE = Stats_SE;
