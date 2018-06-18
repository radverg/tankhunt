function getRandomInt (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getAngleToAxis(centerX: number, centerY: number, pointX: number, pointY: number): number {

	var dx: number = pointX - centerX;
	var dy: number = pointY - centerY;
	var result: number = 0;

	// Top right quadrant
	if (dy < 0 && dx >= 0) {
		result = Math.atan(dx / Math.abs(dy));
	} else if (dx >= 0 && dy > 0) { // Bottom right quadrant 
		result = Math.PI - Math.atan(dx / dy);
	} else if (dx <= 0 && dy > 0) { // Bottom left quadrant
		result = Math.PI + Math.atan(Math.abs(dx) / dy);
	} else { // Top left quadrant
		result = Math.PI * 2 - Math.atan(Math.abs(dx) / Math.abs(dy));
	}

	return result;

}

function dist(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export { getRandomInt, getAngleToAxis, dist };