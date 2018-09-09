
class UITeamNotification_CL extends UINotification_CL {

    private plMe: Player_CL;
    
    constructor(game: Phaser.Game, thGame: TeamFight_CL) {
        super(game, thGame);

        this.topGroup.cameraOffset.y = 130;
    }

    initialize() {
        this.thGame.onPlayerRemove.add(function(player: Player_CL) { this.logText(`Player ${player.name} has left the game!`)}, this);
        this.thGame.onHit.add(this.playerHit, this);
        (this.thGame as TeamFight_CL).onCapture.add(this.captureCallback, this);

    }

    playerHit(packet: PacketShotHit, player: Player_CL) {

        let me = this.thGame.playerGroup.me;
        if (packet.healthAft > 0) return;
        if (me.team === player.team) {
            if (player.me) {
               this.logBig("You have been killed!", "red");
            } else {
                this.logBig("Team mate killed!", "red");
            }
        } else {
            this.logBig("Enemy killed!", "green");
        }
    }

    captureCallback(packet: PacketCapture) {

        let mineCap = packet.tm === this.thGame.playerGroup.me.team;

        if (packet.st) {

            if (mineCap) {
                this.logBig("An enemy is capturing!", "red");
            } else {
                this.logBig("Our team is capturing!", "green");
            }

        } else if (packet.fin) {

            if (mineCap) {
                this.logBig("Our base has been captured!", "red");
            } else {
                this.logBig("Enemy base has been captured!", "green");
            }

        }
    }

    logBig(text: string, color: string) {
        if (!TH.effects.should()) return;

        let offsetY = this.topGroup.children.length * 30;
        this.topGroup.add(TextMaker_CL.goTextBigUp(text, 0, offsetY, color));
    }
}