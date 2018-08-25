class UIStatsTable_CL {
    
    private thGame: THGame_CL;
    private $tableCont: JQuery;
    private $table: JQuery;
    private $tbody: JQuery;

    private collCount: number;

    private phaserKeyCode: number = Phaser.Keyboard.CONTROL;
    private phaserKeyObj: Phaser.Key;

    private items: any = {
        wins: { thead: "Wins:" },
        kills: { thead: "Kills:" },
        deaths: { thead: "Deaths:", asc: true },
        inRow: { thead: "Kills in a row:" },
        maxRow: { thead: "Max in a row:" },
        dmgD: { thead: "Damage dealt:" },
        dmgR: { thead: "Damage received:", asc: true },
        suic: { thead: "Suicides:", asc: true },
        blockC: { thead: "Blocked shots:" }
    }

    private allowedItems: string[];
    private sortKey: string;
    private sortAsc: boolean = false;

    constructor(thGame: THGame_CL, allowedItems: string[], sortKey: string) {
        this.thGame = thGame;
        this.sortKey = sortKey;
        this.allowedItems = allowedItems;

        // Create table container
        this.$tableCont = $("<div id='statsCont'></div>")
            .css({ position: "absolute", display: "none" });
        this.$table = $("<table id='statsTable'></table>");
        this.$tableCont.append(this.$table);
    
        // Table head
        let $thead = $("<thead></thead>");
        this.$table.append($thead);

        $thead.append(`<td data-key="name">Rank</td>`);
        $thead.append(`<td data-key="name">Player</td>`);

        for (let i = 0; i < allowedItems.length; i++) {
            let key = allowedItems[i];
            let thead = this.items[allowedItems[i]].thead;

            let $thd = $(`<td data-key=${key}>${thead}</td>`);
            $thead.append($thd);

        }

        this.$tbody = $("<tbody></tbody>");
        this.$table.append(this.$tbody);

        $("body").append(this.$tableCont);

        // Key handling and events
        this.phaserKeyObj = this.thGame.game.input.keyboard.addKey(this.phaserKeyCode);
        this.phaserKeyObj.onDown.add(this.show, this);
        this.phaserKeyObj.onUp.add(this.hide, this);

        this.thGame.onGameFinish.add(function(packet: PacketGameFinish) {
            if (!packet.subgame) 
            {
                this.refresh();
                this.closeKeyHandler();
            }
            else 
                this.onChange();
        }, this);
        this.thGame.onHit.add(this.onChange, this);
        this.thGame.onLeave.add(this.closeKeyHandler, this);
        
    }

    onChange() {
        if (this.$tableCont.css("display") == "block") {
            this.refresh();
        }
    }

    closeKeyHandler() {
        this.phaserKeyObj.reset(true);
    }

    refresh() {
        this.$tbody.empty();
        let players = this.thGame.playerGroup.players;
        let sortedIDs = this.thGame.playerGroup.getSortedIDsByStats(this.sortKey, this.sortAsc);
        
        for (let i = 0; i < sortedIDs.length; i++) {
            let id = sortedIDs[i];
            let plrRowHtml = this.createPlayerRow(players[id], i);
            this.$tbody.append(plrRowHtml);
        }

        // Iterate throungh columns and set best and worse cells
        for (let i = 0; i < this.allowedItems.length; i++) {
            let colKey = this.allowedItems[i];

            let colIndex = this.$table.find(`thead td[data-key="${colKey}"]`).index() + 1;
            let $cells = this.$tbody.find(`tr td:nth-child(${colIndex})`);
            let mapped: any = $cells.map(function() { return $(this).text(); }).get();

            let best = (this.items[colKey].asc) ? Math.min(...mapped) : Math.max(...mapped);
            let worst =  (this.items[colKey].asc) ? Math.max(...mapped) : Math.min(...mapped);

            $cells.filter(function() { return $(this).text() === best.toString() }).addClass("bestCell");
            $cells.filter(function() { return $(this).text() === worst.toString() }).addClass("worstCell");
            
        }
    }

    private createPlayerRow(player: Player_CL, index: number): string {
        let trClass = (player.me) ? "statsRowMe" : (player.isEnemyOf(this.thGame.playerGroup.me) ? "statsRowEnemy" : "statsRowAlly");
        let row = `<tr class="${trClass}">`;
        row += `<td>${index + 1}.</td>`;
        row += `<td>${player.name}</td>`;
        // Iterate through alloweItems (=columns)
        for (let i = 0; i < this.allowedItems.length; i++) {
            let colKey = this.allowedItems[i];

            row += `<td>${Math.round(player.stats[colKey])}</td>`;

        }

        row += "</tr>"
        return row;
    }

    show() {
        this.refresh();
        let $tblCont = this.$tableCont;
        let targetLeft = $(window).width() / 2 - $tblCont.width() / 2;
        let targetTop = $(window).height() / 2 - $tblCont.height() / 2;
        $tblCont.css( { left: `${targetLeft}px`,
                        top: `${targetTop + $($tblCont).height() / 2}px` });

        $tblCont.stop();
        $tblCont.animate({ top: `${targetTop}px` }, 300)
        $tblCont.fadeIn({ queue: false, duration: 300 });
    }

    hide() {
        let $tblCont = this.$tableCont;

        $tblCont.stop();
        $tblCont.fadeOut(300);
        
    }
}