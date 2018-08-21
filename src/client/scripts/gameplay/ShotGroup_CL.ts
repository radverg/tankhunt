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

    removeShot(shot: Shot_CL) {
        let shts: Shot_CL[] = (<any>Object).values(this.shots);
        let index = shts.indexOf(shot);

        if (index != -1) {
            delete this.shots[Object.keys(this.shots)[index]];
        }
    }

    clear() {
        this.shots = { };
        this.removeAll(true);
    }
}