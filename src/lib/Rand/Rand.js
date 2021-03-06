var Thing = require('../Thing/Thing.js');
var MersenneTwister = require('./mersenne-twister.js');

var MTRand = null;
var seed = null;
var PI = 3.14159265359;
var HALFPI = PI/2.0;

class Rand {
	static init(s) {
		seed = (s !== undefined) ? s : (new Date()).getTime();
		MTRand = new MersenneTwister(seed);
	}

	static getSeed() {
		return seed;
	}

	static setSeed(s) {
		seed = s;
		MTRand = new MersenneTwister(seed);
	}

	static random() {
		MTRand || Rand.init();
		return MTRand.random();
	}

	// return a random element from an array
	static randItem(arr) {
		if (arr && arr.length > 0) {
			return arr[ Rand.randInt(0, arr.length-1) ];
		}
	}

	// return a random element from an array, and remove it from array
	static pickItem(arr) {
		if (arr && arr.length > 0) {
			var index = Rand.randInt(0, arr.length-1);
			return arr.splice(index,1)[0];
		}
	}

	static randItems(arr, n=3) {
		var items = [];
		if (arr) {
			for (var i=0; i < n; i++) {
			  items.push(Rand.randItem(arr));
			}
		}
		return items;
	}

	// Returns a random integer between min (included) and max (included)
	// Using Math.round() will give you a non-uniform distribution!
	static randInt(min, max) {
		min = Math.ceil(min || 0);
		max = Math.floor(max === undefined ? 1 : max);
		return Math.floor(Rand.random() * (max - min + 1)) + min;
	}

	// Return a random float between min and max (0 and .99999 by default)
	static randFloat(min=0.0, max=0.99999) {
	    return min + (Rand.random() * (max - min));
	}

	// return true some percentage of the time (defaults to 50%)
	static randBoolean(threshold=50) {
		return Rand.randInt(1,100) < threshold;
	}

	// random integer within maxDistance of target (distributed in a bell curve around target)
	static randCloseTo(target, maxDistance) {
		// return target + (maxDistance * randNormal());    // concentrated towards center 50% of range
		// return target + (maxDistance * randSin2());   // spread over entire range, somewhat concentrated towards center
		return target + (maxDistance * Rand.randPow2());   // spread over entire range, with sharp concentration around center
	}

	// return float between 0 and 1, distributed exponentially closer to 0
	static randPow() {
		return Math.pow(1.0 - Rand.randFloat(), 4);
	}

	// return float between 0 and 1, distributed toward 1
	static randSin() {
		return Math.sin(Rand.randFloat() * HALFPI);
	}

	// return float between -1 and 1, distributed exponentially closer to 0
	static randPow2() {
		return Rand.randPow() - Rand.randPow();
	}

	// return float between -1 and 1, distributed in a bell curve around 0
	static randNormal() {
		return ((Rand.randFloat() + Rand.randFloat() + Rand.randFloat() + Rand.randFloat() + Rand.randFloat() + Rand.randFloat()) - 3.0) / 3.0;
	}

  // return float between -1 and 1, distributed closer to 0
  static randSin2() {
    return Rand.randSin() - Rand.randSin();
  }

  // return array of 3 ints, each 0-255
  static randRGB() {
    return [Rand.randInt(0,255), Rand.randInt(0,255), Rand.randInt(0,255)];
  }

  static randRGBstr(alpha) {
		var rgb = Rand.randRGB();
    return 'rgba(' +rgb[0]+ ',' +rgb[1]+ ',' +rgb[2]+ ', ' + (alpha || 0.9) + ')';
  }
}
Thing.addClass(Rand);

module.exports = Rand;
