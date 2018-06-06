var G = require("./Geometry");

class GameObject {

    constructor(x, y, w, h) {
        this._id = Math.getNextID();

        this.body = new G.rect(x || 0, y || 0, w || 1, h || 1);
        this.prevBody = new G.rect(x || 0, y || 0, w || 1, h || 1);

        this.velocity = new G.vec2(0, 0);

        this.direction = new G.vec2(1, 0);

        this.speed = 0;
        this.maxSpeed = 2;

         // Angle is in radians, angularVel in radians per second
        this._angle = 0;
        this.angularVel = 0;
        this.maxAngularVel = Math.PI / 3;

        this.remove = false;
        
        this.emitable = true;
        this.alive = true;
    }

    get x() { return this.body.cX; }
    get y() { return this.body.cY; }
    get id() { return this._id; }
    get angle() { return this._angle; }
    set angle(val) { this.setAngle(val); }

    move (deltaSec) {
        this.prevBody.setPos(this.body.cX, this.body.cY);

        this.body.cX += this.direction.x * deltaSec * this.speed;
        this.body.cY += this.direction.y * deltaSec * this.speed;
    }

    setPos(x, y) {
        this.prevBody.setPos(this.body.cX, this.body.cY);
        this.body.setPos(x, y);
    }

    rotate(deltaSec) {
        if (this.angularVel) {
            this.setAngle(this._angle + this.angularVel * deltaSec);
        }
    }

    setAngle(ang) {
        this._angle = ang || 0;
        this.body.ang = ang || 0;
        this.direction.x = Math.sin(ang || 0); 
        this.direction.y = -Math.cos(ang || 0);
    }

    getAng() {
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


    update(deltaSec) {
        this.move(deltaSec);
        this.rotate(deltaSec);
    }

    checkOverlapArray(gobjects) {
        var returnObj = null;
        for (var i = 0; i < gobjects.length; i++) {
            if (this.body.intersects(gobjects[i].body)) {
                 returnObj = gobjects[i];
            }
        }
    }

    multiOverlap(obj) {
        var dx = this.body.cX - this.prevBody.cX;
        var dy = this.body.cY - this.prevBody.cY;

        var dist = Math.sqrt(dx * dx + dy * dy);

        var count = Math.ceil(dist / this.r);

        var subdist = dist / count;
        var tmpRect = new G.rect(this.body.cX - subdist * dx, this.body.cY - subdist * dy, this.body.w, this.body.h);

        for (var i = 0; i < count; i++) {
            tmpRect.setPos(tmpRect.cX + subdist * dx, tmpRect.cY + subdist * dy);
        }
    }

    overlap(obj) {
    }
}

module.exports = GameObject;




