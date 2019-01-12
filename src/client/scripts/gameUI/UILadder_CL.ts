class UILadder_CL {

    private thGame: THGame_CL;
    private game: Phaser.Game;

    private rankGroups: Phaser.Group[] = [];
    private groupHeight: number = 64;
    private slots: number;

    sortKey: string = "kills";
    sortAsc: boolean = false;

    constructor(game: Phaser.Game, thGame: THGame_CL, slots: number = 4) {

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
            panel.width = 240;
            panel.height = this.groupHeight;
            panel.alpha = 0.6;
            panel.frame = 1;

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
           let nameText = this.getStatsText1(me);
            let statsText = this.getStatsText2(me);

           (<Phaser.Text>myGrp.getChildAt(1)).text = myRank.toString();
           (<Phaser.Text>myGrp.getChildAt(2)).text = nameText;
           (<Phaser.Text>myGrp.getChildAt(3)).text = statsText;

       } else {
           myGrp.visible = false;
       }
    }

    protected getStatsText1(player: Player_CL) {
        return (player) ? player.name : "";
    }

    protected getStatsText2(player: Player_CL) {
        return (player) ? `${player.stats.inRow} kills in a row` : "";
    }


}

class UILadderDuel_CL extends UILadder_CL {

    constructor(game: Phaser.Game, thGame: THGame_CL) {
        super(game, thGame, 3);

        this.sortKey = "wins";
    }

    protected getStatsText1(player: Player_CL) {
        return (player) ? player.name : "";
    }

    protected getStatsText2(player: Player_CL) {
        return (player) ? `${player.stats.wins} wins` : "";
    }
}