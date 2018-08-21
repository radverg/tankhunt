class ItemGroup_CL extends Phaser.Group {

    public items: { [key: string] : Item_CL } = { };

    constructor() {
        super(TH.game);
        
    }

     /**
     * Returns item with specified ID
     * @param {string} itemID 
     */
    getItem(itemID: string): Item_CL | undefined {
        return this.items[itemID];
    }

    addItem(item: Item_CL, itemID: string) {
        this.add(item);
        this.items[itemID] = item;
    }

    clear() {
        this.items = { };
        this.removeAll(true);
    }
}