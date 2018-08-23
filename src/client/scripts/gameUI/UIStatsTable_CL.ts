class UIStatsTable_CL {
    
    private thGame: THGame_CL;
    private $tableCont: JQuery;
    private $table: JQuery;
    private $tbody: JQuery;

    private collCount: number;

    private items: any = {
        wins: { thead: "Wins:" },
        kills: { thead: "Kills:" },
        deaths: { thead: "Deaths:", asc: true },
        inRow: { thead: "Kills in a row:" },
        dmgD: { thead: "Damage dealt: " },
        dmgR: { thead: "Damage received:", asc: true }
    }

    private allowedItems: string[];
    private sortKey: string;
    private sortAsc: boolean = false;

    constructor(thGame: THGame_CL, allowedItems: string[], sortKey: string) {
        this.thGame = thGame;
        this.sortKey = sortKey;
        this.allowedItems = allowedItems;

        // Create table container
        this.$tableCont = $("<div></div>")
            .css({ position: "absolute", display: "none" });
        this.$table = $("<table></table>");
        this.$tableCont.append(this.$table);
    
        // Table head
        let $thead = $("<thead></thead>");
        this.$table.append($thead);

        for (let i = 0; i < allowedItems.length; i++) {
            let key = allowedItems[i];
            let thead = this.items[allowedItems[i]].thead;

            let $thd = $(`<td data-key=${key}>${thead}</td>`);
            $thead.append($thd);

        }

        this.$tbody = $("<tbody></tbody>");
        this.$table.append(this.$tbody);

        $("body").append(this.$tableCont);
        
    }

    refresh() {
        this.$tbody.empty();
        let players = this.thGame.playerGroup.players;
        let sortedIDs = this.thGame.playerGroup.getSortedIDsByStats(this.sortKey, this.sortAsc);
        
        for (let i = 0; i < sortedIDs.length; i++) {
            let id = sortedIDs[i];
            let plrRowHtml = this.createPlayerRow(players[id]);
            this.$tbody.append(plrRowHtml);
        }
    }

    private createPlayerRow(player: Player_CL): string {
        let trClass = (player.me) ? "statsRowMe" : (player.isEnemyOf(this.thGame.playerGroup.me) ? "statsRowEnemy" : "statsRowAlly");
        let row = `<tr class="${trClass}">`;
        // Iterate through alloweItems (=columns)
        for (let i = 0; i < this.allowedItems.length; i++) {
            let colKey = this.allowedItems[i];

            row += `<td>${player.stats[colKey]}</td>`;

        }

        row += "</tr>"
        return row;
    }

    show() {
        this.refresh();
        let $tblCont = this.$tableCont;
        $tblCont.css( { left: `${$(window).width() / 2 - $tblCont.width() / 2}px`,
                        top: `${$(window).height() / 2 - $tblCont.height() / 2}px` });

        $tblCont.stop();
        $tblCont.fadeIn();
    }

    hide() {
        let $tblCont = this.$tableCont;

        $tblCont.stop();
        $tblCont.fadeOut();
        
    }
}