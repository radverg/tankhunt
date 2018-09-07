
class Item_CL extends Sprite {

    private rotTween: Phaser.Tween;
    private itemSize: number = 0.9;
    private itemSpr: Phaser.Sprite;

    constructor(x: number, y: number, typeIndex: number) {
        super(TH.game, x * TH.sizeCoeff, y * TH.sizeCoeff, "shadow"); // For now tits black rect, but it will be spritesheet

        this.width = this.itemSize * TH.sizeCoeff;
        this.height = this.itemSize * TH.sizeCoeff;

        let itemSpr = this.game.make.sprite(0, 0, "items");
        itemSpr.anchor.setTo(0.5);
        itemSpr.scale.setTo(3);
        this.addChild(itemSpr);
        itemSpr.frame = typeIndex;
        this.itemSpr = itemSpr;

        this.anchor.setTo(0.5);

        // Item rotation effect:
        this.rotation = Math.random() * Math.PI * 2;
        this.rotTween = this.game.add.tween(this).to( { rotation: Math.PI * 2 + this.rotation }, 4500, Phaser.Easing.Default, true, 0, -1);

    }

    getCollected(noeffect: boolean = false) {

        this.rotTween.stop();

        if (noeffect) {
            this.destroy(true);
            return;
        }

        // Effect
        let twn = TH.game.add.tween(this);
        twn.to({ "width": 0, "height": 0 }, 300, Phaser.Easing.Back.In, true);        

    }

    getSprFrame()  {
        return this.itemSpr.frame;
    }
}