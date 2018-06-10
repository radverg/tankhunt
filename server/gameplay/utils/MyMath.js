module.exports.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.getAngleToAxis = function(centerX, centerY, pointX, pointY) {

	var dx = pointX - centerX;
	var dy = pointY - centerY;
	var result = 0;

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

module.exports.dist = function(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}