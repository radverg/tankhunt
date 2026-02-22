var TextMaker_CL = (function () {
    function TextMaker_CL() {
    }
    TextMaker_CL.playerName = function (text, x, y) {
        var textSprite = TH.game.make.text(x, y, text);
        textSprite.font = "Orbitron";
        textSprite.fontSize = TH.sizeCoeff * 0.3;
        textSprite.alpha = 0.65;
        textSprite.anchor.setTo(0.5);
        return textSprite;
    };
    TextMaker_CL.goUpText = function (text, x, y, color) {
        if (color === void 0) { color = "#e02626"; }
        var textSprite = TH.game.make.text(x, y, text);
        textSprite.font = "Revalia";
        textSprite.fontSize = 27;
        textSprite.fill = color;
        textSprite.stroke = "black";
        textSprite.strokeThickness = 2;
        textSprite.anchor.setTo(0, 0.5);
        var textTwn = TH.game.add.tween(textSprite);
        textTwn.to({ y: textSprite.y - 120, alpha: 0 }, 1200);
        textTwn.onComplete.add(function () { this.destroy(); }, textSprite);
        textTwn.start();
        return textSprite;
    };
    TextMaker_CL.goTextBigUp = function (text, x, y, color) {
        if (color === void 0) { color = "#216ae0"; }
        var offsetInitial = 30;
        var offset = 300;
        var middleOffset = 2;
        var duration = 3500;
        var textSpr = TH.game.make.text(x, y + offsetInitial, text);
        textSpr.font = "Orbitron";
        textSpr.fontSize = 27;
        textSpr.stroke = "black";
        textSpr.strokeThickness = 3;
        textSpr.anchor.setTo(0.5);
        textSpr.fill = color;
        textSpr.setShadow(0, 0, "black", 10);
        textSpr.alpha = 0;
        var firstTwn = TH.game.add.tween(textSpr).to({ y: y, alpha: 1 }, 300);
        var secondTwn = TH.game.add.tween(textSpr).to({ x: x - middleOffset }, 2500);
        var thirdTween = TH.game.add.tween(textSpr).to({ alpha: 0 }, 300);
        thirdTween.onComplete.add(function () { this.destroy(); }, textSpr);
        firstTwn.chain(secondTwn, thirdTween);
        firstTwn.start();
        return textSpr;
    };
    TextMaker_CL.goTextBig = function (text, x, y, goRight, color) {
        if (goRight === void 0) { goRight = false; }
        if (color === void 0) { color = "#216ae0"; }
        var offsetInitial = 500;
        var offset = 300;
        var middleOffset = 50;
        var duration = 3500;
        if (goRight) {
            offsetInitial *= -1;
            offset *= -1;
            middleOffset *= -1;
        }
        var textSpr = TH.game.make.text(x + offsetInitial, y, text);
        textSpr.font = "Orbitron";
        textSpr.fontSize = 33;
        textSpr.stroke = "black";
        textSpr.strokeThickness = 3;
        textSpr.anchor.setTo(0.5);
        textSpr.fill = color;
        textSpr.setShadow(0, 0, "black", 10);
        textSpr.alpha = 0;
        var firstTwn = TH.game.add.tween(textSpr).to({ x: x, alpha: 1 }, 300);
        var secondTwn = TH.game.add.tween(textSpr).to({ x: x - middleOffset }, 2500);
        var thirdTween = TH.game.add.tween(textSpr).to({ x: x - middleOffset - offset, alpha: 0 }, 300);
        thirdTween.onComplete.add(function () { this.destroy(); }, textSpr);
        firstTwn.chain(secondTwn, thirdTween);
        firstTwn.start();
        return textSpr;
    };
    TextMaker_CL.log = function (text) {
        var offset = 200;
        var textSpr = TH.game.make.text(offset, 0, text);
        textSpr.font = "Arial";
        textSpr.alpha = 0;
        textSpr.fill = "white";
        textSpr.fontSize = 30;
        textSpr.stroke = "black";
        textSpr.strokeThickness = 2;
        var twn = TH.game.add.tween(textSpr).to({ x: 0, alpha: 1 }, 300, Phaser.Easing.Default, true);
        var twnFadeOut = TH.game.add.tween(textSpr).to({ alpha: 0 }, 600);
        twnFadeOut.onComplete.add(function () { this.destroy(); }, textSpr);
        TH.game.time.events.add(6000, function () { twnFadeOut.start(); });
        return textSpr;
    };
    TextMaker_CL.rankNumber = function (rank, x, y) {
        var textSpr = TH.game.make.text(x, y, "".concat(rank, "."));
        textSpr.font = "Sans Serif";
        textSpr.fill = "white";
        textSpr.fontSize = 40;
        textSpr.stroke = "black";
        textSpr.strokeThickness = 2;
        return textSpr;
    };
    TextMaker_CL.winText = function (x, y) {
        var textSpr = TH.game.make.text(x, y, "VICTORY");
        textSpr.font = "Orbitron";
        textSpr.fontSize = 3;
        textSpr.setShadow(0, 0, "#0000ff", 10);
        textSpr.fill = "#216ae0";
        textSpr.stroke = "black";
        textSpr.strokeThickness = 4;
        textSpr.alpha = 0.3;
        textSpr.anchor.setTo(0.5);
        var twn = TH.game.add.tween(textSpr).to({ rotation: Math.PI * 10, fontSize: 90, alpha: 1 }, 600, Phaser.Easing.Default, true);
        return textSpr;
    };
    TextMaker_CL.defText = function (x, y) {
        var textSpr = TH.game.make.text(x, y, "DEFEAT");
        textSpr.font = "Orbitron";
        textSpr.fontSize = 3;
        textSpr.setShadow(0, 0, "#ff0000", 10);
        textSpr.stroke = "black";
        textSpr.strokeThickness = 3;
        textSpr.alpha = 0.3;
        textSpr.anchor.setTo(0.5);
        var twn = TH.game.add.tween(textSpr).to({ rotation: Math.PI * 10, fontSize: 90, alpha: 1 }, 600, Phaser.Easing.Default, true);
        return textSpr;
    };
    return TextMaker_CL;
}());
