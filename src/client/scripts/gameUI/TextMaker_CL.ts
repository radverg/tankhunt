class TextMaker_CL {


    static playerName(text: string, x: number, y: number): Phaser.Text {

        let textSprite = TH.game.make.text(x, y,  text);
        textSprite.font = "Orbitron";
        textSprite.fontSize = TH.sizeCoeff * 0.3;
        textSprite.alpha = 0.65;
        textSprite.anchor.setTo(0.5);

        return textSprite;

    }

    static goUpText(text: string, x: number, y: number, color: string = "#e02626"): Phaser.Text {

        let textSprite = TH.game.make.text(x, y,  text);
        textSprite.font = "Revalia";
        textSprite.fontSize = 25;
        textSprite.fill = color;
        textSprite.stroke = "black";
        textSprite.strokeThickness = 2;

        textSprite.anchor.setTo(0, 0.5);

        // This text moves up
        let textTwn = TH.game.add.tween(textSprite);
        textTwn.to({y: textSprite.y - 100, alpha: 0 }, 1000);
        textTwn.onComplete.add(function() { this.destroy(); }, textSprite);
        textTwn.start();

        return textSprite;
    }

    static goTextBig(text: string, x: number, y: number, goRight: boolean = false, color: string = "#216ae0"): Phaser.Text {
        let offsetInitial = 500;
        let offset = 300;
        let middleOffset = 50;
        let duration = 3500;

        if (goRight) {
            offsetInitial *= -1;
            offset *= -1;
            middleOffset *= -1;
        }

        let textSpr = TH.game.make.text(x + offsetInitial, y, text);

        textSpr.font = "Orbitron";
        textSpr.fontSize = 33;
        textSpr.stroke = "black";
        textSpr.strokeThickness = 3;
        textSpr.anchor.setTo(0.5);
        textSpr.fill = color;
        textSpr.setShadow(0, 0, "black", 10);
        textSpr.alpha = 0;
        
        // Move  and show
        let firstTwn = TH.game.add.tween(textSpr).to({x: x, alpha: 1 }, 300);
        let secondTwn = TH.game.add.tween(textSpr).to({ x: x - middleOffset }, 2500);
        let thirdTween = TH.game.add.tween(textSpr).to({ x: x - middleOffset - offset, alpha: 0 }, 300);
        thirdTween.onComplete.add(function() { this.destroy(); }, textSpr);

        firstTwn.chain(secondTwn, thirdTween);

        firstTwn.start();


        return textSpr;
    }

    static log(text: string) {
        let offset = 200;
        let textSpr = TH.game.make.text(offset, 0, text);
        
        textSpr.font = "Arial";
        textSpr.alpha = 0;
        textSpr.fill = "white";
        textSpr.fontSize = 30;
        textSpr.stroke = "black";
        textSpr.strokeThickness = 2;

        // This text disappears after 6 seconds
        let twn = TH.game.add.tween(textSpr).to({ x: 0, alpha: 1}, 300, Phaser.Easing.Default, true);
        let twnFadeOut = TH.game.add.tween(textSpr).to({ alpha: 0 }, 600);
        twnFadeOut.onComplete.add(function() { this.destroy(); }, textSpr);

        TH.game.time.events.add(6000, function() { twnFadeOut.start(); });

        return textSpr;
    }

    static rankNumber(rank: number, x: number, y: number) {
        let textSpr = TH.game.make.text(x, y, `${rank}.`);
        
        textSpr.font = "Sans Serif";
       // textSpr.anchor.setTo(0.5);
        textSpr.fill = "white";
        textSpr.fontSize = 40;
        textSpr.stroke = "black";
        textSpr.strokeThickness = 2;

        return textSpr;

    }

    static winText(x: number, y: number) {

        let textSpr = TH.game.make.text(x, y, "VICTORY");

        textSpr.font = "Orbitron";
        textSpr.fontSize = 3;
        textSpr.setShadow(0, 0, "#0000ff", 10);
        textSpr.fill = "#216ae0";
        textSpr.stroke = "black";
        textSpr.strokeThickness = 4;
        textSpr.alpha = 0.3;
        textSpr.anchor.setTo(0.5);

        let twn = TH.game.add.tween(textSpr).to({ rotation: Math.PI * 10, fontSize: 90, alpha: 1 }, 600, Phaser.Easing.Default, true);

        return textSpr;
    }

    static defText(x: number, y: number) {

        let textSpr = TH.game.make.text(x, y, "DEFEAT");

        textSpr.font = "Orbitron";
        textSpr.fontSize = 3;
        textSpr.setShadow(0, 0, "#ff0000", 10);
        textSpr.stroke = "black";
        textSpr.strokeThickness = 3;
        textSpr.alpha = 0.3;
        textSpr.anchor.setTo(0.5);

        let twn = TH.game.add.tween(textSpr).to({ rotation: Math.PI * 10, fontSize: 90, alpha: 1 }, 600, Phaser.Easing.Default, true);

        return textSpr;
    }

}