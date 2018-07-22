class ShotGroup_CL extends Phaser.Group {

    public shots: { [key: string]: Shot_CL } = {};

    constructor() {
        super(TH.game);
    }

    newShot(data: PacketShotStart) {
        var type = data.type;
		var sh = new Shots[type.toString()](data);
        sh.start();
        this.shots[data.id] = sh;
    }

    getShot(id: string) {
        return this.shots[id];
    }
}