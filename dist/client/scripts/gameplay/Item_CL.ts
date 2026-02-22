class Item_CL extends Sprite {

    private itemSpr: Phaser.Sprite;
    private itemSize: number = 0.9;
    private rotTween: Phaser.Tween;

    constructor(x: number, y: number, typeIndex: number) {
        super(TH.game, x * TH.sizeCoeff, y * TH.sizeCoeff, "shadow"); 

        this.width = this.itemSize * TH.sizeCoeff;
        this.height = this.itemSize * TH.sizeCoeff;
        this.anchor.setTo(0.5);

        // Create item sprite and place it over this shadow
        let itemSpr = this.game.make.sprite(0, 0, "items");
        itemSpr.anchor.setTo(0.5);
        itemSpr.scale.setTo(3);
        itemSpr.frame = typeIndex;
        this.itemSpr = itemSpr;
        this.addChild(itemSpr);

        // Infinite item rotation effect
        this.rotation = Math.random() * Math.PI * 2;
        this.rotTween = this.game.add.tween(this).to( { rotation: Math.PI * 2 + this.rotation }, 4500, Phaser.Easing.Default, true, 0, -1);
    }

    /**
     * Removes the item from the map
     * @param noeffect Should an animation be performed? 
     */
    getCollected(noeffect: boolean = false) {

        // Stop rotation effect
        this.rotTween.stop();

        if (noeffect) {
            this.destroy(true);
            return;
        }

        // Effect
        let twn = TH.game.add.tween(this);
        twn.to({ "width": 0, "height": 0 }, 300, Phaser.Easing.Back.In);  
        twn.onComplete.add(function() { this.destroy(true); }, this);      
        twn.start();
    }

    /**
     * Gets the frame of item sprite, not shadow
     */
    getSprFrame()  {
        return this.itemSpr.frame;
    }
}