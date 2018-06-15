class Item extends Phaser.Sprite {

    constructor(x, y, typeIndex) {
        super(game, x * game.sizeCoeff, y * game.sizeCoeff, "blackRect"); // For now tits black rect, but it will be spritesheet

        this.anchor.setTo(0.5);
        
        this.width = Data.Items.size * game.sizeCoeff;
        this.height = Data.Items.size * game.sizeCoeff;

        game.add.existing(this);
    }

    getCollected() {
        this.destroy();
    }
}