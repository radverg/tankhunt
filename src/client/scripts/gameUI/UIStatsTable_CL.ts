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

    /**
     * Colobject's keys are property names and their values will be shown in table head
     */
    constructor(thGame: THGame_CL, allowedItems: string[], sortKey: string) {
        this.thGame = thGame;
        this.sortKey = sortKey;
        this.allowedItems = allowedItems;

        // Create table container
        this.$tableCont = $("<div></div>")
            .css({ position: "absolute "});
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
        
    }

    refresh() {
        this.$tbody.empty();
        let players = this.thGame.playerGroup.players;

        for (const i in players) {
           
        }
    }

    createPlayerRow(player: Player_CL): string {
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
}