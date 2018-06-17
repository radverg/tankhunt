/// <reference path="../refs.ts" />

class Item extends Sprite {

    constructor(x: number, y: number, typeIndex: number) {
        super(TH.game, x * TH.sizeCoeff, y * TH.sizeCoeff, "blackRect"); // For now tits black rect, but it will be spritesheet

        this.anchor.setTo(0.5);
        
        this.width = Data.Items.size * TH.sizeCoeff;
        this.height = Data.Items.size * TH.sizeCoeff;

        TH.game.add.existing(this);
    }

    public getCollected() {
        this.destroy();
    }
}