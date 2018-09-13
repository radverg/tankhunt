class Pool_CL extends Phaser.Group {

    constructor(pgame: Phaser.Game, container?: Phaser.Group) {
        super(pgame, container || pgame.world);

        
    }

    createMultiple(quantity: number, key: string): Phaser.Sprite[] {
        let objects: Phaser.Sprite[] = super.createMultiple(quantity || 1, key, 0, false);


        for (const sprite of objects) {
            // Create animations 
            let anim = sprite.animations.add("allFrames", null);
        }

        return objects;
    }

    getAllFreeByKey(key: string): Phaser.Sprite[] {

        return this.filter((child: Phaser.Sprite) => {
            return !child.exists && (<string>child.key).substr(0, key.length) === key;
        }).list;
    }


    
}