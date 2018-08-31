

class UITeamFight_CL {

    private game: Phaser.Game;
    private thGame: TeamFight_CL;

    private centerGrp: Phaser.Group;

    private uiStats: UIStatsTable_CL;
    private uiNotification: UINotification_CL;
    private uiChat: UIGameChat_CL;
    private uiPlayerManager: UIPlayerManager_CL;

    constructor(phaserGame: Phaser.Game, thGame: TeamFight_CL) {
        this.game = phaserGame;
        this.thGame = thGame;

        this.centerGrp = new Phaser.Group(phaserGame);
        this.centerGrp.fixedToCamera = true;
        this.centerGrp.cameraOffset.setTo(phaserGame.camera.view.halfWidth, 0);

        this.uiStats = new UIStatsTable_CL(thGame, ["kills", "deaths", "suic", "blockC", "dmgD", "dmgR", "caps"], "kills");
        this.thGame.onCapture.add(this.uiStats.refresh, this.uiStats);
        
        this.uiChat = new UIGameChat_CL(phaserGame, thGame);
        this.uiNotification = new UINotification_CL(phaserGame, thGame);
        this.uiNotification.displayInRow = false;
        this.uiPlayerManager = new UIPlayerManager_CL(phaserGame, thGame);
        

    }
}