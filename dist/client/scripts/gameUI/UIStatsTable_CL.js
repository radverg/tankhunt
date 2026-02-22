var UIStatsTable_CL = (function () {
    function UIStatsTable_CL(thGame, allowedItems, sortKey) {
        this.phaserKeyCode = Phaser.Keyboard.TAB;
        this.items = {
            wins: { thead: "Wins:" },
            kills: { thead: "Kills:" },
            deaths: { thead: "Deaths:", asc: true },
            inRow: { thead: "Kills in a row:" },
            maxRow: { thead: "Max in a row:" },
            dmgD: { thead: "Damage dealt:" },
            dmgR: { thead: "Damage received:", asc: true },
            suic: { thead: "Suicides:", asc: true },
            blockC: { thead: "Blocked shots:" },
            caps: { thead: "Captures:" },
        };
        this.sortAsc = false;
        this.thGame = thGame;
        this.sortKey = sortKey;
        this.allowedItems = allowedItems;
        $("#statsCont").remove();
        this.$tableCont = $("<div id='statsCont'></div>")
            .css({ position: "absolute", display: "none" });
        this.$table = $("<table id='statsTable'></table>");
        this.$tableCont.append(this.$table);
        var $thead = $("<thead></thead>");
        this.$table.append($thead);
        $thead.append("<td data-key=\"name\">Rank</td>");
        $thead.append("<td data-key=\"name\">Player</td>");
        for (var i = 0; i < allowedItems.length; i++) {
            var key = allowedItems[i];
            var thead = this.items[allowedItems[i]].thead;
            var $thd = $("<td data-key=".concat(key, ">").concat(thead, "</td>"));
            $thead.append($thd);
        }
        this.$tbody = $("<tbody></tbody>");
        this.$table.append(this.$tbody);
        $("body").append(this.$tableCont);
        this.phaserKeyObj = this.thGame.game.input.keyboard.addKey(this.phaserKeyCode);
        this.thGame.game.input.keyboard.addKeyCapture(this.phaserKeyCode);
        this.phaserKeyObj.onDown.add(this.show, this);
        this.phaserKeyObj.onUp.add(this.hide, this);
        this.thGame.onGameFinish.add(function (packet) {
            if (!packet.subgame) {
                this.refresh();
                this.closeKeyHandler();
            }
            else
                this.onChange();
        }, this);
        this.thGame.onHit.add(this.onChange, this);
        this.thGame.onLeave.add(this.closeKeyHandler, this);
    }
    UIStatsTable_CL.prototype.onChange = function () {
        if (this.$tableCont.css("display") == "block") {
            this.refresh();
        }
    };
    UIStatsTable_CL.prototype.closeKeyHandler = function () {
        this.phaserKeyObj.reset(true);
    };
    UIStatsTable_CL.prototype.refresh = function () {
        this.$tbody.empty();
        var players = this.thGame.playerGroup.players;
        var sortedIDs = this.thGame.playerGroup.getSortedIDsByStats(this.sortKey, this.sortAsc);
        for (var i = 0; i < sortedIDs.length; i++) {
            var id = sortedIDs[i];
            var plrRowHtml = this.createPlayerRow(players[id], i);
            this.$tbody.append(plrRowHtml);
        }
        var _loop_1 = function (i) {
            var colKey = this_1.allowedItems[i];
            var colIndex = this_1.$table.find("thead td[data-key=\"".concat(colKey, "\"]")).index() + 1;
            var $cells = this_1.$tbody.find("tr td:nth-child(".concat(colIndex, ")"));
            var mapped = $cells.map(function () { return $(this).text(); }).get();
            var best = (this_1.items[colKey].asc) ? Math.min.apply(Math, mapped) : Math.max.apply(Math, mapped);
            var worst = (this_1.items[colKey].asc) ? Math.max.apply(Math, mapped) : Math.min.apply(Math, mapped);
            $cells.filter(function () { return $(this).text() === best.toString(); }).addClass("bestCell");
            $cells.filter(function () { return $(this).text() === worst.toString(); }).addClass("worstCell");
        };
        var this_1 = this;
        for (var i = 0; i < this.allowedItems.length; i++) {
            _loop_1(i);
        }
    };
    UIStatsTable_CL.prototype.createPlayerRow = function (player, index) {
        var trClass = (player.me) ? "statsRowMe" : (player.isEnemyOf(this.thGame.playerGroup.me) ? "statsRowEnemy" : "statsRowAlly");
        var row = "<tr class=\"".concat(trClass, "\">");
        row += "<td>".concat(index + 1, ".</td>");
        row += "<td>".concat(player.name, "</td>");
        for (var i = 0; i < this.allowedItems.length; i++) {
            var colKey = this.allowedItems[i];
            row += "<td>".concat(Math.round(player.stats[colKey]), "</td>");
        }
        row += "</tr>";
        return row;
    };
    UIStatsTable_CL.prototype.show = function () {
        this.refresh();
        TH.effects.playAudio(SoundNames.WHIP);
        var $tblCont = this.$tableCont;
        var targetLeft = $(window).width() / 2 - $tblCont.width() / 2;
        var targetTop = $(window).height() / 2 - $tblCont.height() / 2;
        $tblCont.css({ left: "".concat(targetLeft, "px"),
            top: "".concat(targetTop + $($tblCont).height() / 2, "px") });
        $tblCont.stop();
        $tblCont.animate({ top: "".concat(targetTop, "px") }, 300);
        $tblCont.fadeIn({ queue: false, duration: 300 });
    };
    UIStatsTable_CL.prototype.hide = function () {
        var $tblCont = this.$tableCont;
        $tblCont.stop();
        $tblCont.fadeOut(300);
    };
    return UIStatsTable_CL;
}());
