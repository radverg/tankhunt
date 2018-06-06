var Mt = require("./MyMath");
var li = require("line-intersect");

class Rect {
    constructor(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;

        this.w = w || 0;
        this.h = h || 0;

        this.hWidth = this.w / 2;
        this.hHeight = this.h / 2;

        this.hDiagonal = Math.sqrt(this.hWidth * this.hWidth + this.hHeight * this.hHeight) / 2;
        this.diagAng = Math.atan(this.hWidth / this.hHeight);

        this.cX = x || 0;
        this.cY = y || 0;

        this.ang = 0;

        this.vertices = [
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0)
        ];

        this.updateVertices();

        this.r = this.hDiagonal;       
    }

    get bottom() { return this.cY + this.hHeight; }
    get top() { return this.cY - this.hHeight; }
    get left() { return this.cX - this.hWidth; }
    get right() { return this.cX + this.hWidth; }

    setSize(w, h) {
        this.w = w;
        this.h = h;
        this.r = Math.sqrt(Math.pow(this.w / 2, 2) + Math.pow(this.h / 2, 2));
    }

    setPos(x, y) {
        this.cX = x; 
        this.cY = y;
    }

    updateVertices() {
        // Top left
        this.vertices[0].set(this.cX + Math.sin(this.ang - this.diagAng) * this.hDiagonal,
             this.cY - Math.cos(this.ang - this.diagAng) * this.hDiagonal);

        // Top right
        this.vertices[1].set(this.cX + Math.sin(this.ang + this.diagAng) * this.hDiagonal,
             this.cY - Math.cos(this.ang + this.diagAng) * this.hDiagonal);

        // Botom right
        this.vertices[2].set(this.cX + Math.sin(this.ang + (Math.PI - this.diagAng)) * this.hDiagonal,
             this.cY - Math.cos(this.ang + (Math.PI - this.diagAng)) * this.hDiagonal);

        // Bottom left
        this.vertices[3].set(this.cX + Math.sin(this.ang + (Math.PI + this.diagAng)) * this.hDiagonal,
             this.cY - Math.cos(this.ang + (Math.PI + this.diagAng)) * this.hDiagonal);
    }

    updateVerticesSimple() {
        this.vertices[0].set(this.left, this.top);
        this.vertices[1].set(this.right, this.top);
        this.vertices[2].set(this.right, this.bottom);
        this.vertices[3].set(this.left, this.bottom);
    }

    circularIntersect(anotherRect) {
        var dx = this.cX - anotherRect.cX;
        var dy = this.cY - anotherRect.cY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        return dist < this.hDiagonal + anotherRect.hDiagonal;
    }

    rotContains(x, y) {
        // Do the point transfer
        var ang = Mt.getAngleToAxis(this.cX, this.cY, x, y) - this.ang;
        var dist = Mt.dist(this.cX, this.cY, x, y);
        
        return this.contains(this.cX + dist * Math.sin(ang), this.cY - dist * Math.cos(ang));
    }

    contains(x, y) {
        return !(x < this.left || x > this.right ||
            y < this.top || y > this.bottom);
    }

    intersects(rect) {
        return !(this.left > rect.right || this.right < rect.left || this.top > rect.bottom || this.bottom < rect.top);
    }

    containsRect(rect) {
        return rect.top >= this.top && rect.right <= this.right && rect.bottom <= this.bottom && rect.left >= this.left;
    }

    containsCircleRect(rect) {
        return rect.cY - rect.r >= this.top && rect.cX + rect.r <= this.right && 
            rect.cY + rect.r <= this.bottom && rect.cX - rect.r >= this.left;
    }

    simpleLineInt(x1, y1, x2, y2) {
        return (
            li.checkIntersection(x1, y1, x2, y2, this.left, this.top, this.right, this.top).point || // Top line
            li.checkIntersection(x1, y1, x2, y2, this.right, this.bottom, this.right, this.top).point || // Right line
            li.checkIntersection(x1, y1, x2, y2, this.left, this.bottom, this.right, this.bottom).point || // Bottom line
            li.checkIntersection(x1, y1, x2, y2, this.left, this.top, this.left, this.bottom).point // Left line
        );
    }

    simpleLineIntPoints(x1, y1, x2, y2) {
        var points = [];
        
        var point = li.checkIntersection(x1, y1, x2, y2, this.left, this.top, this.right, this.top).point;
        if (point) points.push(point);

        point = li.checkIntersection(x1, y1, x2, y2, this.right, this.bottom, this.right, this.top).point;
        if (point) points.push(point);

        point = li.checkIntersection(x1, y1, x2, y2, this.left, this.bottom, this.right, this.bottom).point;
        if (point) points.push(point);

        point = li.checkIntersection(x1, y1, x2, y2, this.left, this.top, this.left, this.bottom).point;
        if (point) points.push(point);

        if (points.length > 0) return points;
        else return false;
    }

}

class Vec2 {

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    set(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
}

module.exports = {
    rect: Rect,
    vec2: Vec2,
}