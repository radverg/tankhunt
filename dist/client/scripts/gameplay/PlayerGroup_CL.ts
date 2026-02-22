/**
 * This class is a manager of players and their tanks,
 * extends Phaser.Group.
 * Players are indexed in object players, their tanks are Sprite members of this Phaser.Group
 */
class PlayerGroup_CL extends Phaser.Group {

    public players: { [key: string]: Player_CL } = { };

    /**
     * ID of a player that is this client
     */
    private myID: string | null = null;

    /**
     * Gets the player that is this client, if the player does not exist returns undefined
     */
    get me() { return this.players[this.myID || "notspecified"]; };

    constructor() {
        super(TH.game);   
    }

    /**
     * Adds player to the array, if it has it's tank property set,
     * tank will be added to this group
     * @param player Player to add
     */
    addPlayer(player: Player_CL) {
        if (player.tank) {
            player.tank.addToGroup(this);
        }
        else 
            throw "Cannot add a player without tank!";
        this.players[player.id] = player;
    }

    /**
     * Returns player with specified ID
     * @param playerID 
     */
    getPlayer(playerID: string): Player_CL | undefined {
        return this.players[playerID];
    }

    /**
     * Returns tank of specified playerID
     * @param playerID 
     */
    getTank(playerID: string): Tank_CL {
        return this.players[playerID].tank;
    }

    /**
     * Updates each tank from this group
     */
    updateTanks() {
        this.forEach(this.updateTank);
    }

    /**
     * Completely removes player from players[] and destroys his tank 
     */
    removePlayer(plID: string) {
        this.players[plID].removeTank();
        delete this.players[plID];
    }

    /**
     * Called when update packet is received from server. Updates remote positions, rotations and visibility.
     * @param data Packet
     */
    stateUpdate(data: PacketMovable) {

        var keys = Object.keys(this.players);

        for (let i = 0; i < keys.length; i++) {
            let plr = this.players[keys[i]];
            
            if (data.p[plr.id]) {
                // This player is included in the packet
                plr.tank.show();
                plr.tank.applyTinyStatePacket(data.p[plr.id]);
            } else {
                // This player is not included in the packet - means that this
                // particular client does not see it
                plr.tank.hide();
            }
        }
    }

    /**
     * Callback for method updateTanks
     * @param tank 
     */
    private updateTank(tank: Tank_CL) {
        tank.update();
    }

    /**
     * Sets given player to be this client
     * @param player 
     */
    public setMe(player: Player_CL) {
        this.myID = player.id;
        player.me = true;
        player.tank.setDefaultColor(Color.Blue);
        player.tank.setColor(Color.Blue);
    }

    /**
     * Sets given player to be an enemy of this client.
     * Changes only colors.
     * @param player 
     */
    public setEnemy(player: Player_CL) {
        player.tank.setDefaultColor(Color.Enemy);
        player.tank.setColor(Color.Enemy);
    }

     /**
     * Sets given player to be an ally of this client
     * Changes only colors.
     * @param player 
     */
    public setFriend(player: Player_CL) {
        player.tank.setDefaultColor(Color.Friend);
        player.tank.setColor(Color.Friend);
    }

    /**
     * Returns an array of keys of the players. 
     * The array is sorted by the given key from player stats object and ordered as specified.
     * @param sortKey Key from stats object.
     * @param asc Whether result values should be ascending.
     */
    public getSortedIDsByStats(sortKey: string, asc: boolean) {
        let players = this.players;
        let sortDir = asc ? -1 : 1;

        let keys = Object.keys(players);
        keys.sort(function(a, b) {
            return (players[b].stats[sortKey] - players[a].stats[sortKey]) * sortDir;
        });

        return keys;
    }
}
