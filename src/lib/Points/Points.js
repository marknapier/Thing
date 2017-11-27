var Thing = require('../Thing/Thing.js');

class Points {
	static getMaxY(points) {
		var p = points && points.reduce((accumulator, currentValue) => accumulator.y > currentValue.y ? accumulator : currentValue);
		return (p && p.y) || 0;
	}

	static getMinY(points) {
		var p = points && points.reduce((accumulator, currentValue) => accumulator.y < currentValue.y ? accumulator : currentValue);
		return (p && p.y) || 100;
	}

	static evenSpaceY (points, minY, maxY, x, offset, spacing) {
		var gap = points.length < 2 ? 0 : (maxY - minY) / (points.length - 1);
		/*
		if even spacing
			sorted = sort array + reference to point in points
			sorted.map ( make new y position based on i*gap )
			copy new y position back into points using reference

			var clone = myArray.slice(0);

			var myarray=[25, 8, 7, 41]
			myarray.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
			    return b - a
			})
		*/
		return points.map(function (p, i) {
			window.console.log("SHIT", minY, p.y, i, (i*gap));
			return {
				x: x !== undefined ? x : (p.x + offset),
				// y: spacing === 'even' ? (minY + (i * gap)) : p.y,
				y: p.y,
			};
		});
	}

	static jiggle (points, maxDistance = 0) {
		return points.map(function (p) {
			var jiggle = Thing.Rand.randFloat(-1, 1);
			return {
				x: p.x + (jiggle * maxDistance),
				y: p.y + (jiggle * maxDistance),
			};
		});
	}

	static stretchY (points, amount = 1, minY = 0, maxY = 100) {
		var origHeight = maxY - minY;
		var newHeight = origHeight * amount;
		var newStartY = minY - ((newHeight - origHeight) / 2);
		var newPoints = points.map(function (p) {
			var origYposAsPercent = (p.y - minY) / origHeight;
			return {
				x: p.x,
				y: newStartY + (origYposAsPercent * newHeight),
			};
		});
		return newPoints;
	}

	static makeAdjacentPoints(props = {points:[], minY: 0, maxY: 100, offset: -100, jiggle: 0}) {
		var x = props.x;
		var offset = props.offset || -100;
		var spacing = props.spacing;
		var minY = Points.getMinY(props.points);
		var maxY = Points.getMaxY(props.points);

		var aPoints = Points.evenSpaceY(props.points, minY, maxY, x, offset, spacing);
		aPoints = Points.jiggle(aPoints, props.jiggle);
		aPoints = Points.stretchY(aPoints, props.stretch, minY, maxY);

		return aPoints;
	}
}
Thing.addClass(Points);

module.exports = Points;
