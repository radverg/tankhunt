import { dist, getAngleToAxis, checkIntersection, getLineIntPoint } from "./MyMath_SE";

//var li = require("line-intersect");

class Rect {

    /**
     * X coor of the rectangle's center
     */
    public cX: number;

    /**
     * Y coor of the rectangle's center
     */
    public cY: number;

    /**
     *  Width of the rectangle
     */
    get w(): number { return this._w; } ;
    private _w: number;

    /**
     * Height of the rectangle
     */
    get h(): number { return this._h; } ;
    private _h: number;

    /**
     * Half width of the rectangle
     */
    get hWidth(): number { return this._hWidth; };
    private _hWidth: number;

    /**
     * Half height of the rectangle
     */
    get hHeight(): number { return this._hHeight; };
    private _hHeight: number;

    /**
     * Radius of a circle around this rectangle
     */
    get r(): number { return this._r; }
    private _r: number;

    /**
     * Half of rectangle's diagonal (value is equal to "r")
     */
    get hDiagonal(): number { return this._hDiagonal; }
    private _hDiagonal: number;

    /**
     * Angle between axis and diagonal, useful for counting vertices
     */
    private _diagAng: number;

    /**
     * Rotation of the rectangle in RADIANS
     */
    public ang: number;

    /**
     * Positions of rectangle's vertices, this has to be updated
     * manually by updateVertices() as it's useful only in a few cases.
     */
    public vertices: Vec2[];

    get bottom(): number { return this.cY + this.hHeight; };
    get top(): number { return this.cY - this.hHeight; };
    get left(): number { return this.cX - this.hWidth; };
    get right(): number { return this.cX + this.hWidth; };

    constructor(x?: number, y?: number, w?: number, h?: number) {
        
        this._w = w || 1;
        this._h = h || 1;

        this._hWidth = this.w / 2;
        this._hHeight = this.h / 2;

        this._hDiagonal = Math.sqrt(this._hWidth * this._hWidth + this._hHeight * this._hHeight);
        this._diagAng = Math.atan(this._hWidth / this._hHeight);

        this.cX = x || 0;
        this.cY = y || 0;

        this.ang = 0;

        this.vertices = [
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0)
        ];

        this.vertices[4] = this.vertices[0];

        this.updateVertices();

        this._r = this._hDiagonal;       
    }

    setSize(w?: number, h?: number) {
        this._w = w || this._w;
        this._h = h || this._h;
        this._r = Math.sqrt(Math.pow(this.w / 2, 2) + Math.pow(this.h / 2, 2));
        this._hDiagonal = this._r;
        this.updateVertices();
    }

    setPos(x: number, y: number) {
        this.cX = x; 
        this.cY = y;
    }

    updateVertices() {
        // Top left
        this.vertices[0].set(this.cX + Math.sin(this.ang - this._diagAng) * this.hDiagonal,
             this.cY - Math.cos(this.ang - this._diagAng) * this.hDiagonal);

        // Top right
        this.vertices[1].set(this.cX + Math.sin(this.ang + this._diagAng) * this.hDiagonal,
             this.cY - Math.cos(this.ang + this._diagAng) * this.hDiagonal);

        // Botom right
        this.vertices[2].set(this.cX + Math.sin(this.ang + (Math.PI - this._diagAng)) * this.hDiagonal,
             this.cY - Math.cos(this.ang + (Math.PI - this._diagAng)) * this.hDiagonal);

        // Bottom left
        this.vertices[3].set(this.cX + Math.sin(this.ang + (Math.PI + this._diagAng)) * this.hDiagonal,
             this.cY - Math.cos(this.ang + (Math.PI + this._diagAng)) * this.hDiagonal);
    }

    getClosestVertice(x: number, y: number): Vec2 {
        var closest = this.vertices[0];

        for (var i = 1; i < this.vertices.length; i++) {
            if (dist(this.vertices[i].x, this.vertices[i].y, x, y) < 
                dist(closest.x, closest.y, x, y)) {
                closest = this.vertices[i];
            }
        }

        return closest;
    }

    updateVerticesSimple() {
        this.vertices[0].set(this.left, this.top);
        this.vertices[1].set(this.right, this.top);
        this.vertices[2].set(this.right, this.bottom);
        this.vertices[3].set(this.left, this.bottom);
    }

    circularIntersect(anotherRect: Rect): boolean {
        var dx = this.cX - anotherRect.cX;
        var dy = this.cY - anotherRect.cY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        return dist < this.hDiagonal + anotherRect.hDiagonal;
    }

    rotContains(x: number, y: number): boolean {
        // Do the point transfer
        var ang = getAngleToAxis(this.cX, this.cY, x, y) - this.ang;
        var dis: number = dist(this.cX, this.cY, x, y);
        
        return this.contains(this.cX + dis * Math.sin(ang), this.cY - dis * Math.cos(ang));
    }

    contains(x: number, y: number): boolean {
        return !(x < this.left || x > this.right ||
            y < this.top || y > this.bottom);
    }

    intersects(rect: Rect): boolean {
        return !(this.left > rect.right || this.right < rect.left || this.top > rect.bottom || this.bottom < rect.top);
    }

    containsRect(rect: Rect): boolean {
        return rect.top >= this.top && rect.right <= this.right && rect.bottom <= this.bottom && rect.left >= this.left;
    }

    containsCircleRect(rect: Rect): boolean {
        return rect.cY - rect.r >= this.top && rect.cX + rect.r <= this.right && 
            rect.cY + rect.r <= this.bottom && rect.cX - rect.r >= this.left;
    }

    rectCircleVSCircle(x1: number, y1: number, r: number): boolean {
        return dist(x1, y1, this.cX, this.cY) < this.hDiagonal + r;
    }

    simpleLineInt(x1: number, y1: number, x2: number, y2: number): boolean {
        return (
            checkIntersection(x1, y1, x2, y2, this.left, this.top, this.right, this.top) || // Top line
            checkIntersection(x1, y1, x2, y2, this.right, this.bottom, this.right, this.top) || // Right line
            checkIntersection(x1, y1, x2, y2, this.left, this.bottom, this.right, this.bottom) || // Bottom line
            checkIntersection(x1, y1, x2, y2, this.left, this.top, this.left, this.bottom) // Left line
        );
    }

    lineInt(x1: number, y1: number, x2: number, y2: number): any {
        return (
            checkIntersection(x1, y1, x2, y2, this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y) || // Top line
            checkIntersection(x1, y1, x2, y2, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y) || // Right line
            checkIntersection(x1, y1, x2, y2, this.vertices[2].x, this.vertices[2].y, this.vertices[3].x, this.vertices[3].y) || // Bottom line
            checkIntersection(x1, y1, x2, y2, this.vertices[0].x, this.vertices[0].y, this.vertices[3].x, this.vertices[3].y) // Left line
        );
    }

    /**
     * Given line points, this method determines which side of rectangle this line intersects.
     * If it intersects two lines, only that one with closest point will be returned,
     * Update vertices needs to be called before this
     */
    whichSideLineInt(startX: number, startY: number, endX: number, endY: number): {x: number, y: number, side: number} {
        let side = -1;
        let closestX = null;
        let closestY = null; 


        for (let i = 0; i < 4; i++) {
            let pt: any = getLineIntPoint(startX, startY, endX, endY, this.vertices[i].x, this.vertices[i].y, this.vertices[i + 1].x, this.vertices[i + 1].y);

            if (pt) { // Intersection
               if (closestX === null && closestY === null) {
                   // Not set yet
                   closestX = pt.x;
                   closestY = pt.y;
                   side = i;
               } else {
                   // Compare
                    if (dist(closestX, closestY, startX, startY) > dist(pt.x, pt.y, startX, startY)) {
                        // This one is closer
                        closestX = pt.x;
                        closestY = pt.y;
                        side = i;
                    }
               }
            }
        }

        return { x: closestX, y: closestY, side: side };
    }

    lineIntPoints(x1: number, y1: number, x2: number, y2: number): Vec2[] {
        var points: any[] = [];
        
        var point: any = getLineIntPoint(x1, y1, x2, y2, this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y);
        if (point) points.push(point);

        point = getLineIntPoint(x1, y1, x2, y2, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y);
        if (point) points.push(point);

        point = getLineIntPoint(x1, y1, x2, y2, this.vertices[2].x, this.vertices[2].y, this.vertices[3].x, this.vertices[3].y);
        if (point) points.push(point);

        point = getLineIntPoint(x1, y1, x2, y2, this.vertices[0].x, this.vertices[0].y, this.vertices[3].x, this.vertices[3].y);
        if (point) points.push(point);

        return points;
    }

    simpleLineIntPoints(x1: number, y1: number, x2: number, y2: number): Vec2[] {
        var points: any[] = [];
        
        var point: any = getLineIntPoint(x1, y1, x2, y2, this.left, this.top, this.right, this.top);
        if (point) points.push(point);

        point = getLineIntPoint(x1, y1, x2, y2, this.right, this.bottom, this.right, this.top);
        if (point) points.push(point);

        point = getLineIntPoint(x1, y1, x2, y2, this.left, this.bottom, this.right, this.bottom);
        if (point) points.push(point);

        point = getLineIntPoint(x1, y1, x2, y2, this.left, this.top, this.left, this.bottom);
        if (point) points.push(point);

        return points;
    }

}

class Vec2 {

    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    set(x: number, y: number) {
        this.x = x || 0;
        this.y = y || 0;
    }
}

export { Vec2, Rect }