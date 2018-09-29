/**
 * Container for items and their management
 */
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

    /**
     * Adds new item with specified ID
     * @param item 
     * @param itemID 
     */
    addItem(item: Item_CL, itemID: string) {
        this.add(item);
        this.items[itemID] = item;
    }

    /**
     * Removes all items from the map and resets references
     */
    clear() {
        this.items = { };
        this.removeAll(true);
    }
}