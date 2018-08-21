
class Item_CL extends Sprite {

    private rotTween: Phaser.Tween;

    constructor(x: number, y: number, typeIndex: number) {
        super(TH.game, x * TH.sizeCoeff, y * TH.sizeCoeff, "shadow"); // For now tits black rect, but it will be spritesheet

        this.width = Data.Items.size * TH.sizeCoeff;
        this.height = Data.Items.size * TH.sizeCoeff;

        let itemSpr = this.game.make.sprite(0, 0, "items");
        itemSpr.anchor.setTo(0.5);
        itemSpr.scale.setTo(3.2);
        this.addChild(itemSpr);
        itemSpr.frame = typeIndex;

        this.anchor.setTo(0.5);

        // Item rotation effect:
        this.rotation = 0;
        this.rotTween = this.game.add.tween(this).from( { rotation: Math.PI * 2 }, 2000, Phaser.Easing.Default, true, 0, -1);
        
        

      //  TH.game.add.existing(this);
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
}