import { Vec2 } from "./Geometry_SE";

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

function distVec(v1: Vec2, v2: Vec2) {
	return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y));
}

function checkIntersection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
	var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	var numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
	var numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
	
	if (denom == 0) {
		//   if (numeA == 0 && numeB == 0) {
		// 	return COLINEAR;
		//   }
		
		//   return PARALLEL;
		return false;
	}
	
	var uA = numeA / denom;
	var uB = numeB / denom;
	
	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
		//   return intersecting({
		// 	x: x1 + uA * (x2 - x1),
		// 	y: y1 + uA * (y2 - y1)
		//   });
		
		return true;
	}
	
	return false;
}

function lineIntPoint(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
	var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	var numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
	var numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
	
	if (denom == 0) {
		return false;
	}
	
	var uA = numeA / denom;
	var uB = numeB / denom;
	
	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
		  return {
			x: x1 + uA * (x2 - x1),
			y: y1 + uA * (y2 - y1)
		  };
	}

	return false;
}

export { getRandomInt, getAngleToAxis, dist, distVec, checkIntersection, lineIntPoint };