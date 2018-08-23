

class UILadder_CL {

    private thGame: THGame_CL;
    private game: Phaser.Game;

    private rankGroups: Phaser.Group[] = [];
    private groupHeight: number = 64;
    private slots: number;

    sortKey: string = "inRow";
    sortAsc: boolean = false;

    constructor(game: Phaser.Game, thGame: THGame_CL, slots: number = 6) {

        this.thGame = thGame;
        this.game = game;
        this.slots = slots;
        

        this.initialize();
    }

    initialize() {
        // Create six groups - 5 for the first five players and sixth for this player
        let offsetY = 20;
        for (let i = 0; i < this.slots; i++) {
            let grp = new Phaser.Group(this.game);
            this.rankGroups.push(grp);
            grp.fixedToCamera = true;
            grp.cameraOffset.setTo(10, offsetY + i * this.groupHeight);
            let panel = grp.create(0,0, "panels");
            panel.width = 320;
            panel.height = this.groupHeight;
            panel.alpha = 0.6;
            panel.frame = 1;
          //  panel.tint = 0xff0000;

            // Create rank number
            let rankPos = { x: 7, y: 7 };
            let numSpr: Phaser.Sprite = null;

            if (i < 3) {
                numSpr = grp.create(rankPos.x, rankPos.y, "medals", i);
                numSpr.scale.setTo(0.7);
            } else {
                numSpr = TextMaker_CL.rankNumber(i + 1, rankPos.x + 10, rankPos.y);
                grp.add(numSpr);
            }

            let offsetX = 62;
            // Then comes the name text
            let style: Phaser.PhaserTextStyle = {
                font: "Arial",
                fontSize: 22,
                fill: "white",
                fontStyle: "bold"
                // stroke: "white",
                // strokeThickness: 1,

            }
            let nameSpr = this.game.make.text(offsetX, 5, "0", style);
            grp.add(nameSpr);

            // Then comes stats

            style.fontSize = 16;
         //   style.fontStyle = "bold";
            let statsText = this.game.make.text(offsetX, 30, "0", style);
            grp.add(statsText);
        }

        (this.rankGroups[this.slots - 1].getChildAt(0) as Phaser.Sprite).frame = 0;

        // Initialize callbacks 
        this.thGame.onNewPlayerConnected.add(this.update, this);
        this.thGame.onGameInfo.add(this.update, this);
        this.thGame.onHit.add(this.update, this);

    }

    update() {
        let players = this.thGame.playerGroup.players;
        let me = this.thGame.playerGroup.me;

        let keys = this.thGame.playerGroup.getSortedIDsByStats(this.sortKey, this.sortAsc);

        for (let i = 0; i < this.slots - 1; i++) {

            let grp = this.rankGroups[i];
            let player = (keys[i]) ? players[keys[i]] : null;

            

            let nameText = this.getStatsText1(player);
            let statsText = this.getStatsText2(player);

            (grp.getChildAt(0) as Phaser.Sprite).frame = (player) ? ((player.me) ? 0 : 1) : 1;
            (grp.getChildAt(2) as Phaser.Text).text = nameText;
            (grp.getChildAt(3) as Phaser.Text).text = statsText;

       }

       if (!me) return;
       let myRank = keys.indexOf(me.id) + 1;

       let myGrp = this.rankGroups[this.rankGroups.length - 1];
       if (myRank > this.slots - 1) {
           myGrp.visible = true;
           (<Phaser.Text>myGrp.getChildAt(1)).text = myRank.toString();
           (<Phaser.Text>myGrp.getChildAt(2)).text = `${me.name} - ${me.stats.inRow} in a row`;
           (<Phaser.Text>myGrp.getChildAt(3)).text = `Kills: ${me.stats.kills}, Deaths: ${me.stats.deaths}, K/D: ${(me.stats.kills / me.stats.deaths).toFixed(2)}`;

       } else {
           myGrp.visible = false;
       }
    }

    protected getStatsText1(player: Player_CL) {
        return (player) ? `${player.name} - ${player.stats.inRow} in a row` : "";
    }

    protected getStatsText2(player: Player_CL) {
        return (player) ? `Kills: ${player.stats.kills}, Deaths: ${player.stats.deaths}, K/D: ${(player.stats.kills / player.stats.deaths).toFixed(2)}` : "";
    }


}

class UILadderDuel_CL extends UILadder_CL {

    constructor(game: Phaser.Game, thGame: THGame_CL) {
        super(game, thGame, 3);

        this.sortKey = "wins";
        
    }

    protected getStatsText1(player: Player_CL) {
        return (player) ? `${player.name} - ${player.stats.wins} wins` : "";
    }

    protected getStatsText2(player: Player_CL) {
        return (player) ? `Kills: ${player.stats.kills}, Deaths: ${player.stats.deaths}, K/D: ${(player.stats.kills / player.stats.deaths).toFixed(2)}` : "";
    }
}