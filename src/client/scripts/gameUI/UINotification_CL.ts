
class UINotification_CL {

    protected topGroup: Phaser.Group;
    protected logGroup: Phaser.Group;

    protected game: Phaser.Game;
    protected thGame: THGame_CL;

    displayInRow: boolean = true;

    constructor(game: Phaser.Game, thGame: THGame_CL) {

        this.game = game;
        this.thGame = thGame;

        this.topGroup = new Phaser.Group(this.game);
        this.topGroup.fixedToCamera = true;
        this.topGroup.cameraOffset.x = this.game.camera.view.width / 2;
        this.topGroup.cameraOffset.y = 100;

        

        this.logGroup = new Phaser.Group(game);
        this.logGroup.fixedToCamera = true;
        this.logGroup.cameraOffset.setTo(20, this.game.camera.view.height - 50);

        this.initialize();
    }

    initialize() {
        this.thGame.onHit.add(this.playerHit, this);
        this.thGame.onPlayerRemove.add(function(player: Player_CL) { this.logText(`Player ${player.name} has left the game!`)}, this);
        this.thGame.onNewPlayerConnected.add(function(player: Player_CL) { this.logText(`Player ${player.name} has joined the game!`)}, this);
    }

    protected playerHit(packet: PacketShotHit, player: Player_CL) {
        if (!TH.effects.should()) return;

        let attacker = this.thGame.playerGroup.getPlayer(packet.plAttID);
        
        if (packet.healthAft === 0) {
            let notifYPos = this.topGroup.children.length * 50;
            if (this.thGame.playerGroup.me === player) {
                if (player === attacker) 
                    this.topGroup.add(TextMaker_CL.goTextBig("You killed yourself!", 0, notifYPos, false, "#e51414"));
                else 
                    this.topGroup.add(TextMaker_CL.goTextBig(`You got killed by ${attacker.name}!`, 0, notifYPos, false, "#e51414"));

            } else if (attacker === this.thGame.playerGroup.me) {

                this.topGroup.add(TextMaker_CL.goTextBig(`Enemy ${player.name} killed!`, 0, notifYPos));
                if (this.displayInRow) {
                    this.topGroup.add(TextMaker_CL.goTextBig(`${attacker.stats.inRow} in a row!`, 0, notifYPos + 50, true, "lightblue"));
                }

            }

            // Log kill
            let logText = (attacker === player && this.thGame.playerGroup.me === player) ?
                `Player ${attacker.name} killed himself!` :
                `Player ${attacker.name} killed ${player.name}!` ;
                
            this.logText(logText);
        }
        
    }

    logText(text: string) {
        this.logGroup.subAll("y", 30, false, false);
        this.logGroup.add(TextMaker_CL.log(text));
    }
}