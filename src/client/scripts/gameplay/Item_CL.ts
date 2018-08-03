/// <reference path="../refs.ts" />

class Item_CL extends Sprite {

    constructor(x: number, y: number, typeIndex: number) {
        super(TH.game, x * TH.sizeCoeff, y * TH.sizeCoeff, "items"); // For now tits black rect, but it will be spritesheet

        this.anchor.setTo(0.5);
        this.frame = typeIndex;
        
        this.width = Data.Items.size * TH.sizeCoeff;
        this.height = Data.Items.size * TH.sizeCoeff;

      //  TH.game.add.existing(this);
    }

    getCollected(noeffect: boolean = false) {

        if (noeffect) {
            this.destroy();
            return;
        }

        // Effect
        let twn = TH.game.add.tween(this);
        twn.to({ "width": 0, "height": 0 }, 500, Phaser.Easing.Back.In, true);        

    }
}