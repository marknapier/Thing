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

	static sortY (points) {
		var clone = points.map(function (p) {
			return {
				x: p.x,
				y: p.y,
				_targetThing: p, // keep a reference to the source thing
			};
		});
		clone.sort(function(a,b) {
			return a.y - b.y;
		});
		return clone;
	}

	static makePointsAtX (points, x, offset) {
		var xpoints = points.map(function (p) {
			return {
				x: x !== undefined ? x : (p.x + offset),
				y: p.y,
				_targetThing: p._targetThing || p, // keep a reference to the source thing
			};
		});
		return xpoints;
	}

	static jiggle (points, maxDistance = 0) {
		return points.map(function (p) {
			var jiggle = Thing.Rand.randFloat(-1, 1);
			return {
				x: p.x + (jiggle * maxDistance),
				y: p.y + (jiggle * maxDistance),
				_targetThing: p._targetThing, // keep a reference to the source thing
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
				_targetThing: p._targetThing, // keep a reference to the source thing
			};
		});
		return newPoints;
	}

	static makeAdjacentPoints(props = {points:[], minY: 0, maxY: 100, offset: -100, jiggle: 0}) {
		var x = props.x;
		var offset = props.offset || -100;
		var minY = Points.getMinY(props.points);
		var maxY = Points.getMaxY(props.points);

		var aPoints = Points.makePointsAtX(props.points, x, offset);
		aPoints = Points.jiggle(aPoints, props.jiggle);
		aPoints = Points.stretchY(aPoints, props.stretch, minY, maxY);

		return aPoints;
	}
}
Thing.addClass(Points);

module.exports = Points;
