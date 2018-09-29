/**
 * Shot container and manager
 */
class ShotGroup_CL extends Phaser.Group {

    /**
     * ID-indexed shot container
     */
    public shots: { [key: string]: Shot_CL } = {};

    constructor() {
        super(TH.game);
    }

    /**
     * Called when new shot is received from the server.
     * Creates new shot from the given packet.
     * @param data 
     */
    newShot(data: PacketShotStart) {

        // Do not create anything when the game is suspended
        if (TH.suspended) return; 
        
        var type = data.type;
		var sh = new Shots[type.toString()](data);
        sh.start();
        this.shots[data.id] = sh;
    }

    /**
     * Returns shot with specified id, undefined if the shot does not exist
     * @param id 
     */
    getShot(id: string): Shot_CL | undefined {
        return this.shots[id];
    }

    /**
     * Finds the shot and removes it from the id-indexed object container
     * @param shot 
     */
    removeShot(shot: Shot_CL) {

        let shts: Shot_CL[] = Object.keys(this.shots).map((key: string) => { return this.shots[key]; } );
        let index = shts.indexOf(shot);

        if (index != -1) {
            delete this.shots[Object.keys(this.shots)[index]];
        }
    }

    /**
     * Removes all shots from the map and resets references
     */
    clear() {
        this.shots = { };
        this.removeAll(true);
    }

    /**
     * Removes shots with specified owner
     * @param player Owner
     */
    tidyPlayerShots(player: Player_CL) {

        let shots: Shot_CL[] = Object.keys(this.shots).map((key: string) => { return this.shots[key]; } ) ;
        
        for (const sh of shots) {
            if (sh.getOwner() == player) {
                sh.stop();
            }
        }
    }
}