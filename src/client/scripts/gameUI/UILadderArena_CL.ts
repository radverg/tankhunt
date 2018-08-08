
class UILadderArena_CL {

    private thGame: Arena_CL;
    private game: Phaser.Game;

    private rankGroups: Phaser.Group[] = [];
    private groupHeight: number = 64;

    constructor(game: Phaser.Game, thGame: Arena_CL) {

        this.thGame = thGame;
        this.game = game;

        this.initialize();
    }

    initialize() {
        // Create six groups - 5 for the first five players and sixth for this player
        for (let i = 0; i < 6; i++) {
            let grp = new Phaser.Group(this.game);
            this.rankGroups.push(grp);
            grp.fixedToCamera = true;
            grp.cameraOffset.setTo(10, i * this.groupHeight);

            // Create rank number
            let rankPos = { x: 10, y: 10 };
            let numSpr: Phaser.Sprite = null;

            if (i < 3) {
                numSpr = grp.create(rankPos.x, rankPos.y, "medals", i);
                numSpr.scale.setTo(0.7);
            } else {
                numSpr = TextMaker_CL.rankNumber(i + 1, rankPos.x, rankPos.y);
                grp.add(numSpr);
            }

            let offsetX = 67;
            // Then comes the name text
            let style: Phaser.PhaserTextStyle = {
                font: "Arial",
                fontSize: 20,
                fill: "brown",
                fontStyle: "bold"
                // stroke: "white",
                // strokeThickness: 1,

            }
            let nameSpr = this.game.make.text(offsetX, 0, "Radem - 6 in a row", style);
            grp.add(nameSpr);

            // Then comes stats

            style.fontSize = 14;
         //   style.fontStyle = "bold";
            let statsText = this.game.make.text(offsetX, 20, "Kills: 5, Deaths: 7, K/D: 2", style);
            grp.add(statsText);
        
            
            
            
        }

        // Initialize callbacks 
        this.thGame.onNewPlayer.add(this.update, this);
        this.thGame.onHit.add(this.update, this);

    }

    update() {
        let players = this.thGame.playerGroup.players;

        let keys= Object.keys(players);
        keys.sort(function(a,b) {
            return players[b].stats.kills - players[a].stats.kills;
        });

        let meInTop = false;

        for (let i = 0; i < 5; i++) {

            let grp = this.rankGroups[i];
            let player = (keys[i]) ? players[keys[i]] : null;

            //meInTop = player.me;

            let nameText = (player) ? `${player.name} - ${player.stats.inRow} in a row` : "";
            let statsText = (player) ? `Kills: ${player.stats.kills}, Deaths: ${player.stats.deaths}, K/D: ${(player.stats.kills / player.stats.deaths).toFixed(2)}` : "";

            (grp.getChildAt(1) as Phaser.Text).text = nameText;
            (grp.getChildAt(2) as Phaser.Text).text = statsText;

       }

        if (!meInTop) {
            let lastGrp = this.rankGroups[this.rankGroups.length - 1];
            let myRank = keys.indexOf(this.thGame.playerGroup.me.id) + 1;

        }
    }


}