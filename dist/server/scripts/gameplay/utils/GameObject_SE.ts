import { Rect, Vec2 } from "./Geometry_SE";
import { dist } from "./MyMath_SE";

class GameObject_SE {
    /**
     * Global ID counter
     */
    private static _currentID: number = 1;
    private _id: string = GameObject_SE.getNextID();

    public body: Rect;
    public prevBody: Rect;
    public velocity: Vec2 = new Vec2(0, 0);
    public direction: Vec2 = new Vec2(1, 0);
    private _angle: number = 0;
    public speed: number = 0;
    public maxSpeed: number = 2;
    /**
     * Angulare velocity in radians per second
     */
    public angularVel: number = 0;
    maxAngularVel: number;
    remove: boolean = false;
    emitable: boolean = true;
    alive: boolean = true;

    get x(): number { return this.body.cX; }
    get y(): number { return this.body.cY; }
    get id(): string { return this._id; }
    set id(val: string) { this._id = val; }
    get angle(): number { return this._angle; }
    set angle(val: number) { this.setAngle(val); }
    
    
    constructor(x?: number, y?: number, w?: number, h?: number) {
        
        this.body = new Rect(x || 0, y || 0, w || 1, h || 1);
        this.prevBody = new Rect(x || 0, y || 0, w || 1, h || 1);        
    }
    
    /**
     * Global ID passer
     */
    public static getNextID(): string {
        GameObject_SE._currentID++;
		return "a" + GameObject_SE._currentID;
    }
    
    move(deltaSec: number) {
        this.prevBody.setPos(this.body.cX, this.body.cY);
        
        this.body.cX += this.direction.x * deltaSec * this.speed;
        this.body.cY += this.direction.y * deltaSec * this.speed;
    }

    /**
     * Gets the distance between current position and previous position
     */
    distOfFrameMove() {
        return dist(this.body.cX, this.body.cY, this.prevBody.cX, this.prevBody.cY);
    }
    
    setPos(x: number, y: number) {
        this.prevBody.setPos(this.body.cX, this.body.cY);
        this.body.setPos(x, y);
    }
    
    rotate(deltaSec: number) {
        if (this.angularVel) {
            this.setAngle(this._angle + this.angularVel * deltaSec);
        }
    }
    
    setAngle(ang: number) {
        this._angle = ang || 0;
        this.body.ang = ang || 0;
        this.direction.x = Math.sin(ang || 0); 
        this.direction.y = -Math.cos(ang || 0);
    }

    randomizeAngle() {
        this.setAngle(Math.random() * Math.PI * 2);
    }
    
    getAng(): number {
        return this._angle;
    }
    
    fullForward() {
        this.speed = this.maxSpeed;
    }
    
    fullBackward() {
        this.speed = -this.maxSpeed;
    }
    
    stop() {
        this.speed = 0;
    }
    
    fullLeftRotate() {
        this.angularVel = -this.maxAngularVel;
    }
    
    fullRightRotate() {
        this.angularVel = this.maxAngularVel;
    }
    
    stopRotation() {
        this.angularVel = 0;
    }
    
    
    update(deltaSec: number) {
        this.move(deltaSec);
        this.rotate(deltaSec);
    }
    
    getStatePacket(): PacketGameObject {
        return  {
            id: this._id,
            x: parseFloat(this.x.toFixed(4)),
            y: parseFloat(this.y.toFixed(4)),
            rot: parseFloat(this.angle.toFixed(4))
        }
    }
}

export {GameObject_SE};

