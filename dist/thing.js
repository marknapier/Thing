(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Action {
	constructor() {
	}

	init (props) {
		this.props = props || {};
		return this;
	}

	go () {
		window.console.log('Action.go()');
	}

	stop () {
		window.console.log('Action.stop()');
	}

	static make () {
	  var cls = this;
	  var instance = new cls();
	  instance.init.apply(instance, arguments);
	  return instance;
	}
}
Thing.addClass(Action);

module.exports = Action;

},{"../Thing/Thing.js":9}],2:[function(require,module,exports){
module.exports = "/* required for arrow */\r\n.arrow-head {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  width: 0; \r\n  height: 0; \r\n  border-top: 30px solid transparent;\r\n  border-bottom: 30px solid transparent;\r\n  border-left: 30px solid green;\r\n}\r\n\r\n.arrow-body {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  background-color: green;\r\n  width: 40px;\r\n  height: 20px;\r\n  margin: 0;\r\n  margin-top: 20px;\r\n  margin-bottom: 20px;\r\n  border-left: 0;\r\n  border-right: 0;\r\n}\r\n\r\n.arrow-wrapper {\r\n  width: 70px;   /* arrow-body width + arrow-head border width */\r\n}\r\n\r\n.Arrow {\r\n  /* For some nice animation on the rotates: */\r\n  -webkit-transition: -webkit-transform .2s;\r\n     -moz-transition:    -moz-transform .2s;\r\n          transition:         transform .2s;\r\n}\r\n\r\n";

},{}],3:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Arrow extends Thing {
	init (props) {
		this.initialize(props);
		this.type = 'Arrow';
		this.$element = Thing.makeElement(Arrow.html(), this.props, this.type);  // basic Thing div with ID and class
		this.setColor(this.props.color);  // have to make arrow before calling this
	}

	render () {
		super.render();

		// var parentElement = (this.parent && this.parent.$element) || $(document.body);
		// parentElement.append(this.$element);
		// this.$element.css(this.props);
	}

	setColor (c) {
		this.$element.find('.arrow-head').css({borderLeftColor:c});
		this.$element.find('.arrow-body').css({backgroundColor:c});
	}

	static createArrowElement () {
		var $arrow = $("<div class='arrow-wrapper'><div class='arrow-body'></div><div class='arrow-head'></div></div>");
		return $arrow;
	}

	static html () {
		return "<div><div class='arrow-wrapper'><div class='arrow-body'></div><div class='arrow-head'></div></div></div>";
	}

	static css () {
		return require('./Arrow.css');
	}
}
Thing.addClass(Arrow);

module.exports = Arrow;

},{"../Thing/Thing.js":9,"./Arrow.css":2}],4:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Box extends Thing {
  init (props) {
  	this.initialize(props);
  	this.type = 'Box';
  	this.items = [];
  	this.$element = Thing.makeElement(this.html(), this.props, this.type);
  }

  add (item) {
  	if (item) {
  		this.items.push(item);
  		item.parent = this;
  	}
  }

  // remove item from this box (from the dom and the items list)
  remove (item) {
	if (item) {
		var index = this.items.indexOf(item);
		if (index > -1) {
		    this.items.splice(index, 1);
			item.$element.remove();
			item.parent = null;
		}
	}
  }

  numElements () {
  	return this.items.length;
  }

  render () {
  	super.render();
  	for (var i=0; i < this.items.length; i++) {
  		this.items[i].render();
  	}
  }
}
Thing.addClass(Box);

module.exports = Box;

},{"../Thing/Thing.js":9}],5:[function(require,module,exports){
module.exports = "\r\n.DemoBox {\r\n  display: inline-block;\r\n  position: relative;\r\n  margin: 20px;\r\n  width: 200px; \r\n  height: 200px; \r\n  border: 2px dashed #eee;\r\n}\r\n";

},{}],6:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var Box = require('../Box/Box.js');

class DemoBox extends Box {
	init (props) {
		props = props || {};
		super.init(props);
		props.width = props.width || 200;
		props.height = props.height || 200;
		props.position = 'relative';
		this.type = 'DemoBox';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);
	}

	render () {
		super.render();
	}

	static css () {
		return require('./DemoBox.css');
	}
}
Thing.addClass(DemoBox);

module.exports = DemoBox;

},{"../Box/Box.js":4,"../Thing/Thing.js":9,"./DemoBox.css":5}],7:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var Action = require('../Action/Action.js');
var Timer = require('../Timer/Timer.js');


class Pulsar extends Action {
	init (props) {
		props = props || {};
		this.callback = props.callback || function () {};
		this.delay = props.delay || 1000;
		this.T = Timer.make({callback: this.trigger.bind(this), delay: this.delay});
		return this;
	}

	go () {
		this.T.go();
		return this;
	}

	stop () {
		this.T.stop();
	}

	trigger () {
		this.callback();
		this.T.go();
	}
}
Thing.addClass(Pulsar);

module.exports = Pulsar;

},{"../Action/Action.js":1,"../Thing/Thing.js":9,"../Timer/Timer.js":10}],8:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

var PI = 3.14159265359;
var HALFPI = PI/2.0;

class Rand {
	static randItem(arr) {
		if (arr && arr.length > 0) {
			return arr[ Rand.randInt(0, arr.length-1) ];
		}
	}

	// Returns a random integer between min (included) and max (included)
	// Using Math.round() will give you a non-uniform distribution!
	static randInt(min, max) {
		min = Math.ceil(min||0);
		max = Math.floor(max||1);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// return float between 0 and .999999
	static randFloat() {
	    return Math.random();
	}

	static randPercent(threshold) {
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
}
Thing.addClass(Rand);

module.exports = Rand;

},{"../Thing/Thing.js":9}],9:[function(require,module,exports){
var elementCounter = 0;

class Thing {
  constructor() {
  }

  init (props) {
    this.initialize(props);
    this.type = 'Thing';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
  }

  initialize (props) {
    props = props || {};
    // CSS props go into this.props
    this.props = Thing.cleanup(props);
    // keep these properties on 'this'
    this.rotation = props.rotate || 0;
    this.scaleFactor = props.scale || 1;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.$element = null;
    this.parent = null;
  }

  render () {
    var parentElement = (this.parent && this.parent.$element) || $(document.body);
    parentElement.append(this.$element);
    this.$element.css(this.props);
  }

  // remove element from dom and null it out
  unRender () {
    if (this.$element) {
      this.$element.remove();
      this.$element = null;
    }
  }

  rotate (degrees) {
    this.rotation += degrees;
    this.transform();
  }

  rotateTo (angle) {
    this.rotation = angle;
    this.transform();
  }

  scale (factor) {
    this.scaleFactor += factor;
    this.transform();
  }

  scaleTo (factor) {
    this.scaleFactor = factor;
    this.transform();
  }

  translate (x, y) {
    this.x += x;
    this.y += y;
    this.transform();
  }

  translateTo (x, y) {
    this.x = x;
    this.y = y;
    this.transform();
  }

  transform () {
    this.css({ 
      transform: Thing.makeTransformCSS(this.rotation, this.scaleFactor, this.x, this.y)
    });
  }

  css (props) {
    this.props = $.extend(this.props, props);
    this.$element.css(props);
  }

  html () {
    return '<div></div>';
  }

  static css () {
    return null;
  }

  static make () {
    var cls = this;
    var instance = new cls();
    instance.init.apply(instance, arguments);
    return instance;
  }

  static addClass (cls) {
    Thing.classes = Thing.classes || {};
    Thing.classes[cls.name] = cls;

    // load the class styles (these are included in the bundle at build time)
    cls.css && Thing.addCSSString(cls.css(), cls.name);

    // add additional css file at load time
    Thing.addCSSFile(cls.name + '/' + cls.name + '.css', 'css'+cls.name);
  }

  static getClass (name) {
    return Thing.classes[name];
  }

  //---------------------------------------------------------
  // CSS management functions

  static makeStyles (props) {
    var styles = props || {};
    $.extend(styles, {
      // left: props.left || (props.x && (props.x + "px")),
      // top: props.top || (props.y && (props.y + "px")),
      width: props.width || (props.w && (props.w + "px")),
      height: props.height || (props.h && (props.h + "px")),
      zIndex: props.zIndex || props.z,
      backgroundColor: (props.backgroundColor || 'transparent'),
      transform: props.transform || (Thing.makeTransformCSS(props.rotate, props.scale, props.x, props.y)),
      position: props.position || 'absolute'
    });
    delete styles.rotate;
    delete styles.scale;
    delete styles.x;
    delete styles.y;
    delete styles.z;
    delete styles.w;
    delete styles.h;
    return styles;
  }

  static makeTransformCSS (rotate, scale, tx, ty) {
    var transform = '';
    transform += (tx || ty) ? (Thing.makeTranslateCSS(tx, ty) + ' ') : '';
    transform += Thing.isNumeric(rotate) ? (Thing.makeAngleCSS(rotate) + ' ') : '';
    transform += scale ? (Thing.makeScaleCSS(scale) + ' ') : '';
    return transform;
  }

  static makeAngleCSS (angle) {
    return 'rotate('+angle+'deg)';
  }

  static makeScaleCSS (scale) {
    return 'scale('+scale+')';
  }

  static makeTranslateCSS (x, y) {
    x = x || '0';
    y = y || '0';
    return 'translate('+ x + 'px, ' + y +'px)';
  }

  static makeElement (html, props, type) {
    var $element = $(html)
      .css(Thing.makeStyles(props))
      .addClass(type || 'random')
      .attr('id', (type || 'random') + (++elementCounter));
    return $element;
  }

  static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // Make sure necessary CSS properties are present or defaulted to something sane
  static cleanup (props) {
    var cp = props || {};
    cp.position = props.position || 'absolute';   // default to absolute positioning
    // cp.x = props.x || props.left || 0;
    // cp.y = props.y || props.top || 0;
    // cp.z = props.z || props.zIndex;
    // cp.w = props.w || props.width;
    // cp.h = props.h || props.height;
    cp.rotation = props.rotation || 0;
    cp.scale = props.scale || 1;
    return cp;
  }

  static addCSSFile(fileName, id) {
     var link = '<link rel="stylesheet" type="text/css" href="' + fileName + '" id="' + id + '">';
     $('head').find('#' + id).remove();
     $('head').append(link);
  }

  static addCSSString(cssString, id) {
    if (cssString) {
      // var doc = window.document;
      var styleEl = $('<style type="text/css">' +cssString+ '</style>')     
        .attr('id', (id || 'Thing') + '-styles');
      $('head').append(styleEl);
    }
  }

  //---------------------------------------------------------

}
Thing.addClass(Thing);

module.exports = Thing;

},{}],10:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var Action = require('../Action/Action.js');

class Timer extends Action {
	init (props) {
		props = props || {};
		this.callback = props.callback || function () {};
		this.delay = props.delay || 1000;
		this.timerID = null;
		return this;
	}

	go () {
		clearTimeout(this.timerID);
		this.timerID = setTimeout(this.callback, this.delay);
		return this;
	}

	stop () {
		clearTimeout(this.timerID);
		this.timerID = null;
	}
}
Thing.addClass(Timer);

module.exports = Timer;

},{"../Action/Action.js":1,"../Thing/Thing.js":9}],11:[function(require,module,exports){
var Thing = require('./Thing/Thing.js');
require('./Box/Box.js');
require('./Arrow/Arrow.js');
require('./DemoBox/DemoBox.js');
require('./Action/Action.js');
require('./Timer/Timer.js');
require('./Rand/Rand.js');
require('./Pulsar/Pulsar.js');

window.Thing = Thing;

},{"./Action/Action.js":1,"./Arrow/Arrow.js":3,"./Box/Box.js":4,"./DemoBox/DemoBox.js":6,"./Pulsar/Pulsar.js":7,"./Rand/Rand.js":8,"./Thing/Thing.js":9,"./Timer/Timer.js":10}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JveC9Cb3guanMiLCJzcmMvbGliL0RlbW9Cb3gvRGVtb0JveC5jc3MiLCJzcmMvbGliL0RlbW9Cb3gvRGVtb0JveC5qcyIsInNyYy9saWIvUHVsc2FyL1B1bHNhci5qcyIsInNyYy9saWIvUmFuZC9SYW5kLmpzIiwic3JjL2xpYi9UaGluZy9UaGluZy5qcyIsInNyYy9saWIvVGltZXIvVGltZXIuanMiLCJzcmMvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb24ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxuXHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMucHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uZ28oKScpO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5zdG9wKCknKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBtYWtlICgpIHtcclxuXHQgIHZhciBjbHMgPSB0aGlzO1xyXG5cdCAgdmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xyXG5cdCAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcclxuXHQgIHJldHVybiBpbnN0YW5jZTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQWN0aW9uKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLyogcmVxdWlyZWQgZm9yIGFycm93ICovXFxyXFxuLmFycm93LWhlYWQge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXHJcXG4gIHdpZHRoOiAwOyBcXHJcXG4gIGhlaWdodDogMDsgXFxyXFxuICBib3JkZXItdG9wOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWJvdHRvbTogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1sZWZ0OiAzMHB4IHNvbGlkIGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uYXJyb3ctYm9keSB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxuICB3aWR0aDogNDBweDtcXHJcXG4gIGhlaWdodDogMjBweDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxyXFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDA7XFxyXFxuICBib3JkZXItcmlnaHQ6IDA7XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy13cmFwcGVyIHtcXHJcXG4gIHdpZHRoOiA3MHB4OyAgIC8qIGFycm93LWJvZHkgd2lkdGggKyBhcnJvdy1oZWFkIGJvcmRlciB3aWR0aCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uQXJyb3cge1xcclxcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxyXFxufVxcclxcblxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEFycm93IGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0Fycm93JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudChBcnJvdy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuc2V0Q29sb3IodGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgYXJyb3cgYmVmb3JlIGNhbGxpbmcgdGhpc1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cclxuXHRcdC8vIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xyXG5cdFx0Ly8gcGFyZW50RWxlbWVudC5hcHBlbmQodGhpcy4kZWxlbWVudCk7XHJcblx0XHQvLyB0aGlzLiRlbGVtZW50LmNzcyh0aGlzLnByb3BzKTtcclxuXHR9XHJcblxyXG5cdHNldENvbG9yIChjKSB7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1oZWFkJykuY3NzKHtib3JkZXJMZWZ0Q29sb3I6Y30pO1xyXG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctYm9keScpLmNzcyh7YmFja2dyb3VuZENvbG9yOmN9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjcmVhdGVBcnJvd0VsZW1lbnQgKCkge1xyXG5cdFx0dmFyICRhcnJvdyA9ICQoXCI8ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj5cIik7XHJcblx0XHRyZXR1cm4gJGFycm93O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGh0bWwgKCkge1xyXG5cdFx0cmV0dXJuIFwiPGRpdj48ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj48L2Rpdj5cIjtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEFycm93KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBCb3ggZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICBcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgXHR0aGlzLnR5cGUgPSAnQm94JztcclxuICBcdHRoaXMuaXRlbXMgPSBbXTtcclxuICBcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIGFkZCAoaXRlbSkge1xyXG4gIFx0aWYgKGl0ZW0pIHtcclxuICBcdFx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gIFx0XHRpdGVtLnBhcmVudCA9IHRoaXM7XHJcbiAgXHR9XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgaXRlbSBmcm9tIHRoaXMgYm94IChmcm9tIHRoZSBkb20gYW5kIHRoZSBpdGVtcyBsaXN0KVxyXG4gIHJlbW92ZSAoaXRlbSkge1xyXG5cdGlmIChpdGVtKSB7XHJcblx0XHR2YXIgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XHJcblx0XHRpZiAoaW5kZXggPiAtMSkge1xyXG5cdFx0ICAgIHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0aXRlbS4kZWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdFx0aXRlbS5wYXJlbnQgPSBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuICB9XHJcblxyXG4gIG51bUVsZW1lbnRzICgpIHtcclxuICBcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgXHRzdXBlci5yZW5kZXIoKTtcclxuICBcdGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICBcdFx0dGhpcy5pdGVtc1tpXS5yZW5kZXIoKTtcclxuICBcdH1cclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQm94KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm94O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxyXFxuLkRlbW9Cb3gge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgbWFyZ2luOiAyMHB4O1xcclxcbiAgd2lkdGg6IDIwMHB4OyBcXHJcXG4gIGhlaWdodDogMjAwcHg7IFxcclxcbiAgYm9yZGVyOiAycHggZGFzaGVkICNlZWU7XFxyXFxufVxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEJveCA9IHJlcXVpcmUoJy4uL0JveC9Cb3guanMnKTtcclxuXHJcbmNsYXNzIERlbW9Cb3ggZXh0ZW5kcyBCb3gge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XHJcblx0XHRwcm9wcy53aWR0aCA9IHByb3BzLndpZHRoIHx8IDIwMDtcclxuXHRcdHByb3BzLmhlaWdodCA9IHByb3BzLmhlaWdodCB8fCAyMDA7XHJcblx0XHRwcm9wcy5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHR0aGlzLnR5cGUgPSAnRGVtb0JveCc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3NzICgpIHtcclxuXHRcdHJldHVybiByZXF1aXJlKCcuL0RlbW9Cb3guY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKERlbW9Cb3gpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZW1vQm94O1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xyXG5cclxuXHJcbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMuVCA9IFRpbWVyLm1ha2Uoe2NhbGxiYWNrOiB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgZGVsYXk6IHRoaXMuZGVsYXl9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0dGhpcy5ULnN0b3AoKTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIgKCkge1xyXG5cdFx0dGhpcy5jYWxsYmFjaygpO1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFB1bHNhcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFB1bHNhcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbnZhciBQSSA9IDMuMTQxNTkyNjUzNTk7XHJcbnZhciBIQUxGUEkgPSBQSS8yLjA7XHJcblxyXG5jbGFzcyBSYW5kIHtcclxuXHRzdGF0aWMgcmFuZEl0ZW0oYXJyKSB7XHJcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBhcnJbIFJhbmQucmFuZEludCgwLCBhcnIubGVuZ3RoLTEpIF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gKGluY2x1ZGVkKSBhbmQgbWF4IChpbmNsdWRlZClcclxuXHQvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcclxuXHRzdGF0aWMgcmFuZEludChtaW4sIG1heCkge1xyXG5cdFx0bWluID0gTWF0aC5jZWlsKG1pbnx8MCk7XHJcblx0XHRtYXggPSBNYXRoLmZsb29yKG1heHx8MSk7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIC45OTk5OTlcclxuXHRzdGF0aWMgcmFuZEZsb2F0KCkge1xyXG5cdCAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyByYW5kUGVyY2VudCh0aHJlc2hvbGQpIHtcclxuXHRcdHJldHVybiBSYW5kLnJhbmRJbnQoMSwxMDApIDwgdGhyZXNob2xkO1xyXG5cdH1cclxuXHJcblx0Ly8gcmFuZG9tIGludGVnZXIgd2l0aGluIG1heERpc3RhbmNlIG9mIHRhcmdldCAoZGlzdHJpYnV0ZWQgaW4gYSBiZWxsIGN1cnZlIGFyb3VuZCB0YXJnZXQpXHJcblx0c3RhdGljIHJhbmRDbG9zZVRvKHRhcmdldCwgbWF4RGlzdGFuY2UpIHtcclxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXHJcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZFNpbjIoKSk7ICAgLy8gc3ByZWFkIG92ZXIgZW50aXJlIHJhbmdlLCBzb21ld2hhdCBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgXHJcblx0XHRyZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogUmFuZC5yYW5kUG93MigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHdpdGggc2hhcnAgY29uY2VudHJhdGlvbiBhcm91bmQgY2VudGVyXHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXHJcblx0c3RhdGljIHJhbmRQb3coKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5wb3coMS4wIC0gUmFuZC5yYW5kRmxvYXQoKSwgNCk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCB0b3dhcmQgMVxyXG5cdHN0YXRpYyByYW5kU2luKCkge1xyXG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdzIoKSB7XHJcblx0XHRyZXR1cm4gUmFuZC5yYW5kUG93KCkgLSBSYW5kLnJhbmRQb3coKTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIDBcclxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcclxuXHRcdHJldHVybiAoKFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSkgLSAzLjApIC8gMy4wO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGNsb3NlciB0byAwXHJcblx0c3RhdGljIHJhbmRTaW4yKCkge1xyXG5cdFx0cmV0dXJuIFJhbmQucmFuZFNpbigpIC0gUmFuZC5yYW5kU2luKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFJhbmQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSYW5kO1xyXG4iLCJ2YXIgZWxlbWVudENvdW50ZXIgPSAwO1xyXG5cclxuY2xhc3MgVGhpbmcge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnVGhpbmcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZSAocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICAvLyBDU1MgcHJvcHMgZ28gaW50byB0aGlzLnByb3BzXHJcbiAgICB0aGlzLnByb3BzID0gVGhpbmcuY2xlYW51cChwcm9wcyk7XHJcbiAgICAvLyBrZWVwIHRoZXNlIHByb3BlcnRpZXMgb24gJ3RoaXMnXHJcbiAgICB0aGlzLnJvdGF0aW9uID0gcHJvcHMucm90YXRlIHx8IDA7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gcHJvcHMuc2NhbGUgfHwgMTtcclxuICAgIHRoaXMueCA9IHByb3BzLnggfHwgMDtcclxuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgMDtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgcGFyZW50RWxlbWVudC5hcHBlbmQodGhpcy4kZWxlbWVudCk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh0aGlzLnByb3BzKTtcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxyXG4gIHVuUmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLiRlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcm90YXRlIChkZWdyZWVzKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IGRlZ3JlZXM7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlVG8gKGFuZ2xlKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uID0gYW5nbGU7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgc2NhbGUgKGZhY3Rvcikge1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciArPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgc2NhbGVUbyAoZmFjdG9yKSB7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIHRyYW5zbGF0ZSAoeCwgeSkge1xyXG4gICAgdGhpcy54ICs9IHg7XHJcbiAgICB0aGlzLnkgKz0geTtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGVUbyAoeCwgeSkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNmb3JtICgpIHtcclxuICAgIHRoaXMuY3NzKHsgXHJcbiAgICAgIHRyYW5zZm9ybTogVGhpbmcubWFrZVRyYW5zZm9ybUNTUyh0aGlzLnJvdGF0aW9uLCB0aGlzLnNjYWxlRmFjdG9yLCB0aGlzLngsIHRoaXMueSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY3NzIChwcm9wcykge1xyXG4gICAgdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHRoaXMucHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHByb3BzKTtcclxuICB9XHJcblxyXG4gIGh0bWwgKCkge1xyXG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2UgKCkge1xyXG4gICAgdmFyIGNscyA9IHRoaXM7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcbiAgICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENsYXNzIChjbHMpIHtcclxuICAgIFRoaW5nLmNsYXNzZXMgPSBUaGluZy5jbGFzc2VzIHx8IHt9O1xyXG4gICAgVGhpbmcuY2xhc3Nlc1tjbHMubmFtZV0gPSBjbHM7XHJcblxyXG4gICAgLy8gbG9hZCB0aGUgY2xhc3Mgc3R5bGVzICh0aGVzZSBhcmUgaW5jbHVkZWQgaW4gdGhlIGJ1bmRsZSBhdCBidWlsZCB0aW1lKVxyXG4gICAgY2xzLmNzcyAmJiBUaGluZy5hZGRDU1NTdHJpbmcoY2xzLmNzcygpLCBjbHMubmFtZSk7XHJcblxyXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgY3NzIGZpbGUgYXQgbG9hZCB0aW1lXHJcbiAgICBUaGluZy5hZGRDU1NGaWxlKGNscy5uYW1lICsgJy8nICsgY2xzLm5hbWUgKyAnLmNzcycsICdjc3MnK2Nscy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRDbGFzcyAobmFtZSkge1xyXG4gICAgcmV0dXJuIFRoaW5nLmNsYXNzZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xyXG5cclxuICBzdGF0aWMgbWFrZVN0eWxlcyAocHJvcHMpIHtcclxuICAgIHZhciBzdHlsZXMgPSBwcm9wcyB8fCB7fTtcclxuICAgICQuZXh0ZW5kKHN0eWxlcywge1xyXG4gICAgICAvLyBsZWZ0OiBwcm9wcy5sZWZ0IHx8IChwcm9wcy54ICYmIChwcm9wcy54ICsgXCJweFwiKSksXHJcbiAgICAgIC8vIHRvcDogcHJvcHMudG9wIHx8IChwcm9wcy55ICYmIChwcm9wcy55ICsgXCJweFwiKSksXHJcbiAgICAgIHdpZHRoOiBwcm9wcy53aWR0aCB8fCAocHJvcHMudyAmJiAocHJvcHMudyArIFwicHhcIikpLFxyXG4gICAgICBoZWlnaHQ6IHByb3BzLmhlaWdodCB8fCAocHJvcHMuaCAmJiAocHJvcHMuaCArIFwicHhcIikpLFxyXG4gICAgICB6SW5kZXg6IHByb3BzLnpJbmRleCB8fCBwcm9wcy56LFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IChwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJ3RyYW5zcGFyZW50JyksXHJcbiAgICAgIHRyYW5zZm9ybTogcHJvcHMudHJhbnNmb3JtIHx8IChUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHByb3BzLnJvdGF0ZSwgcHJvcHMuc2NhbGUsIHByb3BzLngsIHByb3BzLnkpKSxcclxuICAgICAgcG9zaXRpb246IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSdcclxuICAgIH0pO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5yb3RhdGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLnNjYWxlO1xyXG4gICAgZGVsZXRlIHN0eWxlcy54O1xyXG4gICAgZGVsZXRlIHN0eWxlcy55O1xyXG4gICAgZGVsZXRlIHN0eWxlcy56O1xyXG4gICAgZGVsZXRlIHN0eWxlcy53O1xyXG4gICAgZGVsZXRlIHN0eWxlcy5oO1xyXG4gICAgcmV0dXJuIHN0eWxlcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlVHJhbnNmb3JtQ1NTIChyb3RhdGUsIHNjYWxlLCB0eCwgdHkpIHtcclxuICAgIHZhciB0cmFuc2Zvcm0gPSAnJztcclxuICAgIHRyYW5zZm9ybSArPSAodHggfHwgdHkpID8gKFRoaW5nLm1ha2VUcmFuc2xhdGVDU1ModHgsIHR5KSArICcgJykgOiAnJztcclxuICAgIHRyYW5zZm9ybSArPSBUaGluZy5pc051bWVyaWMocm90YXRlKSA/IChUaGluZy5tYWtlQW5nbGVDU1Mocm90YXRlKSArICcgJykgOiAnJztcclxuICAgIHRyYW5zZm9ybSArPSBzY2FsZSA/IChUaGluZy5tYWtlU2NhbGVDU1Moc2NhbGUpICsgJyAnKSA6ICcnO1xyXG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlQW5nbGVDU1MgKGFuZ2xlKSB7XHJcbiAgICByZXR1cm4gJ3JvdGF0ZSgnK2FuZ2xlKydkZWcpJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlU2NhbGVDU1MgKHNjYWxlKSB7XHJcbiAgICByZXR1cm4gJ3NjYWxlKCcrc2NhbGUrJyknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VUcmFuc2xhdGVDU1MgKHgsIHkpIHtcclxuICAgIHggPSB4IHx8ICcwJztcclxuICAgIHkgPSB5IHx8ICcwJztcclxuICAgIHJldHVybiAndHJhbnNsYXRlKCcrIHggKyAncHgsICcgKyB5ICsncHgpJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlRWxlbWVudCAoaHRtbCwgcHJvcHMsIHR5cGUpIHtcclxuICAgIHZhciAkZWxlbWVudCA9ICQoaHRtbClcclxuICAgICAgLmNzcyhUaGluZy5tYWtlU3R5bGVzKHByb3BzKSlcclxuICAgICAgLmFkZENsYXNzKHR5cGUgfHwgJ3JhbmRvbScpXHJcbiAgICAgIC5hdHRyKCdpZCcsICh0eXBlIHx8ICdyYW5kb20nKSArICgrK2VsZW1lbnRDb3VudGVyKSk7XHJcbiAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaXNOdW1lcmljKG4pIHtcclxuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbiAgfVxyXG5cclxuICAvLyBNYWtlIHN1cmUgbmVjZXNzYXJ5IENTUyBwcm9wZXJ0aWVzIGFyZSBwcmVzZW50IG9yIGRlZmF1bHRlZCB0byBzb21ldGhpbmcgc2FuZVxyXG4gIHN0YXRpYyBjbGVhbnVwIChwcm9wcykge1xyXG4gICAgdmFyIGNwID0gcHJvcHMgfHwge307XHJcbiAgICBjcC5wb3NpdGlvbiA9IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSc7ICAgLy8gZGVmYXVsdCB0byBhYnNvbHV0ZSBwb3NpdGlvbmluZ1xyXG4gICAgLy8gY3AueCA9IHByb3BzLnggfHwgcHJvcHMubGVmdCB8fCAwO1xyXG4gICAgLy8gY3AueSA9IHByb3BzLnkgfHwgcHJvcHMudG9wIHx8IDA7XHJcbiAgICAvLyBjcC56ID0gcHJvcHMueiB8fCBwcm9wcy56SW5kZXg7XHJcbiAgICAvLyBjcC53ID0gcHJvcHMudyB8fCBwcm9wcy53aWR0aDtcclxuICAgIC8vIGNwLmggPSBwcm9wcy5oIHx8IHByb3BzLmhlaWdodDtcclxuICAgIGNwLnJvdGF0aW9uID0gcHJvcHMucm90YXRpb24gfHwgMDtcclxuICAgIGNwLnNjYWxlID0gcHJvcHMuc2NhbGUgfHwgMTtcclxuICAgIHJldHVybiBjcDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NGaWxlKGZpbGVOYW1lLCBpZCkge1xyXG4gICAgIHZhciBsaW5rID0gJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiJyArIGZpbGVOYW1lICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XHJcbiAgICAgJCgnaGVhZCcpLmZpbmQoJyMnICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgICQoJ2hlYWQnKS5hcHBlbmQobGluayk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ1NTU3RyaW5nKGNzc1N0cmluZywgaWQpIHtcclxuICAgIGlmIChjc3NTdHJpbmcpIHtcclxuICAgICAgLy8gdmFyIGRvYyA9IHdpbmRvdy5kb2N1bWVudDtcclxuICAgICAgdmFyIHN0eWxlRWwgPSAkKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+JyArY3NzU3RyaW5nKyAnPC9zdHlsZT4nKSAgICAgXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgKGlkIHx8ICdUaGluZycpICsgJy1zdHlsZXMnKTtcclxuICAgICAgJCgnaGVhZCcpLmFwcGVuZChzdHlsZUVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRoaW5nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGhpbmc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcblxyXG5jbGFzcyBUaW1lciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdvICgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xyXG5cdFx0dGhpcy50aW1lcklEID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLmRlbGF5KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRpbWVyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcclxucmVxdWlyZSgnLi9Cb3gvQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQXJyb3cvQXJyb3cuanMnKTtcclxucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGltZXIvVGltZXIuanMnKTtcclxucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcclxucmVxdWlyZSgnLi9QdWxzYXIvUHVsc2FyLmpzJyk7XHJcblxyXG53aW5kb3cuVGhpbmcgPSBUaGluZztcclxuIl19
