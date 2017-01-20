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

		// bind member functions to the instance
		Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(function (key) {
			if (typeof instance[key] === 'function' && key !== 'constructor' && key !== 'init') {
				instance[key] = instance[key].bind(instance);
				window.console.log('BOUND', instance.constructor.name, key);
		    }
		});

		return instance;
	}
}
Thing.addClass(Action);

module.exports = Action;

},{"../Thing/Thing.js":18}],2:[function(require,module,exports){
module.exports = "/* required for arrow */\r\n.arrow-head {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  width: 0; \r\n  height: 0; \r\n  border-top: 30px solid transparent;\r\n  border-bottom: 30px solid transparent;\r\n  border-left: 30px solid green;\r\n}\r\n\r\n.arrow-body {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  background-color: green;\r\n  width: 40px;\r\n  height: 20px;\r\n  margin: 0;\r\n  margin-top: 20px;\r\n  margin-bottom: 20px;\r\n  border-left: 0;\r\n  border-right: 0;\r\n}\r\n\r\n.arrow-wrapper {\r\n  width: 70px;   /* arrow-body width + arrow-head border width */\r\n}\r\n\r\n.Arrow {\r\n  /* For some nice animation on the rotates: */\r\n  -webkit-transition: -webkit-transform .2s;\r\n     -moz-transition:    -moz-transform .2s;\r\n          transition:         transform .2s;\r\n}\r\n\r\n";

},{}],3:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Arrow extends Thing {
	init (props) {
		this.initialize(props);
		this.type = 'Arrow';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.setColor(this.props.color);  // have to make arrow before calling this
	}

	render () {
		super.render();
		return this;
	}

	setColor (c) {
		this.$element.find('.arrow-head').css({borderLeftColor:c});
		this.$element.find('.arrow-body').css({backgroundColor:c});
		return this;
	}

	html () {
		return "<div><div class='arrow-wrapper'><div class='arrow-body'></div><div class='arrow-head'></div></div></div>";
	}

	static createArrowElement () {
		var $arrow = $("<div class='arrow-wrapper'><div class='arrow-body'></div><div class='arrow-head'></div></div>");
		return $arrow;
	}

	static css () {
		return require('./Arrow.css');
	}
}
Thing.addClass(Arrow);

module.exports = Arrow;

},{"../Thing/Thing.js":18,"./Arrow.css":2}],4:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class BGImg extends Thing {
  init (props) {
    var defaultProps = {
      url: '',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: '0px',
      top: '0px'
    };
    props = this.props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'BGImg';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.css({
      background: 'url("' + props.url + '") no-repeat center',
      backgroundSize: 'cover'  //100% 100%'
    });
  }
}
Thing.addClass(BGImg);

module.exports = BGImg;

},{"../Thing/Thing.js":18}],5:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Box extends Thing {
  init (props) {
  	this.initialize(props);
  	this.type = 'Box';
  	this.items = [];
  	this.$element = Thing.makeElement(this.html(), this.props, this.type);
  }

  add (addItems) {
  	if (addItems) {
      if (!(addItems instanceof Array)) {
        addItems = [addItems];
      }
      for (var i=0; i < addItems.length; i++) {
        this.items.push(addItems[i]);
        addItems[i].parent = this;        
      }
  	}
    return this;
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
    return this;
  }

  numElements () {
  	return this.items.length;
  }

  getElementBounds () {
    var bounds = {x:999999, y:999999, bottom:0, right:0};
    if (this.items.length < 1) {
      return undefined;
    }
    for (var i=0; i < this.items.length; i++) {
      var pos = this.items[i].getBoundingBox();
      bounds.x = (pos.x < bounds.x) ? pos.x : bounds.x;
      bounds.y = (pos.y < bounds.y) ? pos.y : bounds.y;
      bounds.bottom = (pos.bottom > bounds.bottom) ? pos.bottom : bounds.bottom;
      bounds.right = (pos.right > bounds.right) ? pos.right : bounds.right;
    }
    bounds.w = bounds.right - bounds.x;
    bounds.h = bounds.bottom - bounds.y;
    return bounds;
  }

  render () {
  	super.render();
  	for (var i=0; i < this.items.length; i++) {
  		this.items[i].render();
  	}
    return this;
  }
}
Thing.addClass(Box);

module.exports = Box;

},{"../Thing/Thing.js":18}],6:[function(require,module,exports){
module.exports = "\r\n.DemoBox {\r\n  display: inline-block;\r\n  position: relative;\r\n  margin: 20px;\r\n  width: 200px; \r\n  height: 200px; \r\n  border: 2px dashed #eee;\r\n}\r\n";

},{}],7:[function(require,module,exports){
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
		return this;
	}

	static css () {
		return require('./DemoBox.css');
	}
}
Thing.addClass(DemoBox);

module.exports = DemoBox;

},{"../Box/Box.js":5,"../Thing/Thing.js":18,"./DemoBox.css":6}],8:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

// Like Unix pipe: output of one command is input to the next
// Each function takes a 'props' object as argument
// Each function returns an object with results, which is passed as props to the next
// Do() returns a function that will execute the Do chain

// P.pulse.setTo(
//     Do(R.getRandomNumber, {from:0, to:10})   // returns:  {data: 8}
//     .Do(C.pickColor)    // reads input 8, returns {data: '#cff'}
//     .Do(B.changeColor)   // reads input '#cff', changes color on Blinker
// );


function Do(_aFunction, _props, _firstDo) {
    var aFunction = _aFunction;
    var props = _props;
    var firstDo = _firstDo || executor;

    // console.log('afunction=', aFunction);
    // console.log('props=', props);
    // console.log('firstDo=', firstDo);

    // Run the given function with the given arguments.
    // Pass the results to the next chained function (if any).
    // Return results of this function or of the chain
    function executor (pipedProps) {
        var returnVal = aFunction(props || pipedProps);
        return (executor.nextDo ? executor.nextDo(returnVal) : returnVal);
    }

    // Return the last 'Do' in the chain
    function getLastDo () {
        var tmpDo = firstDo;
        while (tmpDo.nextDo) { tmpDo = tmpDo.nextDo; }
        return tmpDo;
    }

    // Add a new 'Do' to the end of the chain.
    executor.Do = function (aFunction, props) {
        getLastDo().nextDo = Do(aFunction, props, firstDo);
        return firstDo;  // Always return the first 'Do' in the chain
    };

    executor.nextDo = null;

    return executor;
}

Thing.Do = Do;

/*
// chained, each Do has its own parameters
var d = Do(function (props) {console.log('step 1', props);}, {arg1:'hello1'})
                .Do(function (props) {console.log('step 2', props);}, {arg2:'hello to 22222'})

// chained, with first Do piping results to second Do
var d = Do(function (props) {console.log('step 1', props); return {pipedprop:1234}}, {arg1:'hello1'})
                .Do(function (props) {console.log('step 2', props);}, null)

var d = Do(function (props) {console.log('step 1', props); return {pipedprop:1234}}, {arg1:'hello1'})
                .Do(function (props) {console.log('step 2', props); return {newProp:props.pipedprop+2}})
                .Do(function (props) {console.log('step 3', props);})
*/

module.exports = Do;

},{"../Thing/Thing.js":18}],9:[function(require,module,exports){
/**
 *  Wrap a function inside a module so that the function can be
 *  overriden from outside the module with a custom function.  The 
 *  customized function is available both outside and inside the 
 *  requirified module.
 *
 *  In the module:
 *      var overridableFunction = External( function (a) {
 *          ...
 *      });
 *      module.exports = { overridableFunction: overridableFunction };
 *
 *  In the calling module:
 *      SomeModule.overridableFunction.BIND(myCustomFunction);
 *      SomeModule.overridableFunction();  // will run myCustomFunction
 *
 *  @module External
 */

var Thing = require('../Thing/Thing.js');

function External (callFunction, callContext) {
    var callMe, context;

    function setFunction (newFunc, newContext) {
        callMe = newFunc;
        context = newContext || {};
    }

    function wrapper () {
        return callMe.apply(context, arguments);
    }

    wrapper.BIND = setFunction;

    setFunction(callFunction, callContext);

    return wrapper;
}

Thing.External = External;

module.exports = External;

},{"../Thing/Thing.js":18}],10:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

/*
    src: <file path>
    center: true|false
    size: contain|cover|stretch
*/

class Img extends Thing {
  init (props) {
    var placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABV9JREFUeJzt3c1u3UQch+F/EBK9AsQCVWfVQq4CbhxuA4EqsSmh+7Iui9QCQvI7Yx+PP59H8i6yZo7mzfgkln1XVZ8KeNYXaw8AtkwgEAgEAoFAIBAIBAKBQCAQCAQCgeDLET97120UsLymO0jsIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIM+7VNV3aw9iQfdV9XrtQWzVp8bjLC5V9XtVPdQ5Irmvqg9V9a7OFUnzuhfIPy71GMcw56NHMsQxzPdMkQhkpEv9N46jR/I0jrNFIpARLvV8HEeN5KU4zhSJQBpdKsdxtEiuxXGWSATS4FJtcRwlktY4zhCJQK641Lg4/h3J94uP9nZj4zh6JAIJLjUtjr1GMjWOI0cikBdc6rY49hbJrXEcNRKBPONS88Sxl0jmiuOIkTTN+Wy3mryqqq9mPN83VfVTbTOS+6r6uaq+nvGcrz4fp3KmHaTqcTE/1Hy/Vbe4k8y9c3yqqvdV9WbJSXTmEis4ciTiaCOQK44YiTjaCaRBj0j+rHUiEcc4Aml0hEjEMZ5ARthzJOKYRiAjfV+Pi3pPkYhjOoFMsKdIesTxR50jjiqBTLaHSMRxO4HcYMuRiGMeArlRr0jubxiTOOYjkBlsKRJxzEsgM9lCJOKYn0BmtGYk4uhDIDNbIxJx9COQDu5ruUh6xfF2lk9i/wTSyRKRiKM/gXTUMxJxLEMgnfWI5EOJYykCWUCPSMSxDIEsZKuRiCMTyIJ6fG8QR18CWdhWInkocbQQyArWjkQc7QSykrUiEcc4AlnR0pGIYzyBrGypSMQxjUA2oHck4phOIBvRKxJx3Kbpcz7b092P5m7tAZyBHaSfJS6x9vzOxDW5xFrZkl/SRTKeQFa0xp95RTKOQFay5j8KRdJOICvYwq0mImkjkIWtHYdIxhHIgrYSh0jaCWQhW4tDJG0EsoCtxiGS6wTSWY84HqrPi0VF8n8C6ahXHG/rcTGLpD+BdNIzjoFI+hNIB0vEMRBJXwKZ2ZJxDETSj0BmtEYcA5H0IZCZrBnHQCTzE8gMthDHQCTzEsiNtviUdZHMRyA32GIcA5HMQyATbTmOgUhuJ5AJ9hDHQCS3EchIe4pjIJLpBDLCHuMYiGQagTTacxwDkYwnkAZHiGMgknEEckWvON4sOYknRNJOIMER4xiIpI1AXnDkOAYiuU4gzzhDHINekRzlifJNcz7b090/fj7m8lBVP1TVrzOecy6/VNWP9fiK6rl8rKq/ZjzfLpxpB6mqel1V7+q4O8dTc+0kv1XVtwuPvSeXWMGtkewljsGtkRwtjiqBXDU1kve1rzgGUyM5YhxVAmkyNpK9xjEYG8lR46gSSLPWSPYex6A1kiPHUSWQUa5FcpQ4BtciOXocVQIZ7aVIjhbH4KVIzhBHlUAmeRrJUeMYPI3kLHFUCWSyIZKjxzEYIjlTHFUCucnrOkccg7d1rjiqGtf9XbUvfi+t50ia1v3Z7sWCUQQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQHBXVZ/WHgRslR0EAoFAIBAIBAKBQCAQCAQCgUAgEAgEgr8BiQVzq9Lv1OoAAAAASUVORK5CYII=';

    props = props || {};
    props.src = props.src || placeholder;
    // props.background = 'url("' + props.src + '") no-repeat ' + (props.center ? 'center' : 'left top');
    // props.backgroundSize = (props.size === 'contain' || props.size === 'cover' ? props.size : (props.size==='stretch' ? '100% 100%' : undefined) );

    this.props = Thing.cleanup(props);

    this.type = 'Img';
    this.aspectRatio = 1;
    this.loaded = false;
    this.src = props.src;
    this.x = props.x || undefined;
    this.y = props.y || undefined;
    this.w = props.w || undefined;
    this.h = props.h || undefined;

    Img.loading(this);
    loadImage(props.src, this.onload.bind(this), this.onerror.bind(this));

    super.initialize(props);
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
  }

  onload (img) {
    window.console.log('Image Loaded:', img, img.src, img.width, img.height);
    this.loaded = true;
    this.w = this.w || img.width;
    this.h = this.h || img.height;
    this.aspectRatio = this.h / this.w;
    this.css({
        width: this.w, 
        height: this.h, 
        background: 'url(' +img.src+ ') no-repeat center',
        backgroundSize: '100% 100%'
    });
    Img.loaded(this);
  }

  onerror (img) {
    window.console.log('Img.onerror', img.src, 'failed');
    this.loaded = true;
    this.error = true;
    this.width = this.height = 0;
    this.aspectRatio = 1;
    Img.loaded(this);
  }

  setWidth (w) {
    this.width = w;
    this.height = w * this.aspectRatio;
    this.css({
        width: this.width,
        height: this.height
    });
  }

  static loading (img) {
    window.console.log("IMG.loading():", img.src);
    Img.queuedImgs = Img.queuedImgs || [];
    if (img && !img.loaded) {
        Img.queuedImgs.push(img);
    } 
    return Img.queuedImgs.length;
  }

  static loaded (img) {
    window.console.log("IMG.loaded():", img.src, Img.queuedImgs.length);
    Img.queuedImgs = Img.queuedImgs || [];
    if (img && img.loaded) {
        var index = Img.queuedImgs.indexOf(img);
        if (index > -1) {
            Img.queuedImgs.splice(index, 1);
        }
        if (Img.queuedImgs.length === 0) {
            Img.onAllLoaded();
        }
    }
    return Img.queuedImgs.length === 0;        
  }

  static onAllLoaded () {
    window.console.log("IMG.onAllLoaded(): triggered");
  }

}
Thing.addClass(Img);


function loadImage (src, callback, errorCallback) {
    var img = new Image();
    img.onload = function() {
        callback(this);
    };
    img.onerror = function () {
        errorCallback(this);
    };
    img.src = src;
}

module.exports = Img;

},{"../Thing/Thing.js":18}],11:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Label extends Thing {
	init (props) {
		var defaultProps = {
			fontFamily: 'Calibri, Arial, sans-serif',
			fontSize: '14px',
			color: '#000'
		};
		props = $.extend({}, defaultProps, props);
		this.initialize(props);
		this.type = 'Label';
		this.text = props.text;
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.$element.append(this.text);
	}

	setText (txt) {
		this.text = txt;
		this.$element.empty().append(txt);
		return this;
	}

	render () {
		super.render();
		return this;
	}
}
Thing.addClass(Label);

module.exports = Label;

},{"../Thing/Thing.js":18}],12:[function(require,module,exports){
module.exports = "\r\n.Line {\r\n  /* For some nice animation on the rotates: */\r\n  -webkit-transition: -webkit-transform .2s;\r\n     -moz-transition:    -moz-transform .2s;\r\n          transition:         transform .2s;\r\n}\r\n\r\n";

},{}],13:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Line extends Thing {
  init (props) {
    // expecting props: { x1:0, y1:0, x2:50, y2:50 }
    props.backgroundColor = props && (props.backgroundColor || props.color || 'black');
    super.init(props);
    this.type = 'Line';
    this.length = 10;
    this.width = 1;
    this.angle = 0;
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.addClass(this.type);
    this.createLine(props.x1, props.y1, props.x2, props.y2, props.width);
  }

  createLine (x1,y1, x2,y2, width) {
    this.width = width || 2;
    this.length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    this.angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    this.css({
        'left': '' + x1 + 'px',
        'top': '' + (y1-(this.width/2)) + 'px',
        'width': '' + this.length + 'px',
        'height': '' + this.width + 'px',
        // rotate around start point of line
        'transform-origin': '0 50%'
      });
    this.rotateTo(this.angle);
  }

  static css () {
  	return require('./Line.css');
  }
}
Thing.addClass(Line);

module.exports = Line;

},{"../Thing/Thing.js":18,"./Line.css":12}],14:[function(require,module,exports){
module.exports = ".Pattern.GraphPaper {\r\n  background-color: #003;\r\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\r\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\r\n  background-image: \r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\r\n}\r\n\r\n.Pattern.Grid {\r\n  background-size: 100px 100px, 100px 100px;\r\n  background-position: -2px -2px, -2px -2px;\r\n  background-image: \r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\r\n}\r\n\r\n.Pattern.Sofa {\r\n  background:\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.PolkaDots {\r\n  background-image: \r\n    radial-gradient(white 15%, transparent 16%),\r\n    radial-gradient(white 15%, transparent 16%);\r\n  background-size: 60px 60px;\r\n  background-position: 0 0, 30px 30px;\r\n}\r\n\r\n.Pattern.BlueBalls {\r\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Stripes {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.PlaidRed {\r\n  background-color: hsl(2, 57%, 40%);\r\n  background-image: \r\n    repeating-linear-gradient(transparent, transparent 50px, rgba(0,0,0,.4) 50px, rgba(0,0,0,.4) 53px, transparent 53px, transparent 63px, rgba(0,0,0,.4) 63px, rgba(0,0,0,.4) 66px, transparent 66px, transparent 116px, rgba(0,0,0,.5) 116px, rgba(0,0,0,.5) 166px, rgba(255,255,255,.2) 166px, rgba(255,255,255,.2) 169px, rgba(0,0,0,.5) 169px, rgba(0,0,0,.5) 179px, rgba(255,255,255,.2) 179px, rgba(255,255,255,.2) 182px, rgba(0,0,0,.5) 182px, rgba(0,0,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(270deg, transparent, transparent 50px, rgba(0,0,0,.4) 50px, rgba(0,0,0,.4) 53px, transparent 53px, transparent 63px, rgba(0,0,0,.4) 63px, rgba(0,0,0,.4) 66px, transparent 66px, transparent 116px, rgba(0,0,0,.5) 116px, rgba(0,0,0,.5) 166px, rgba(255,255,255,.2) 166px, rgba(255,255,255,.2) 169px, rgba(0,0,0,.5) 169px, rgba(0,0,0,.5) 179px, rgba(255,255,255,.2) 179px, rgba(255,255,255,.2) 182px, rgba(0,0,0,.5) 182px, rgba(0,0,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(125deg, transparent, transparent 2px, rgba(0,0,0,.2) 2px, rgba(0,0,0,.2) 3px, transparent 3px, transparent 5px, rgba(0,0,0,.2) 5px);\r\n}\r\n\r\n.Pattern.DiagonalStripes {\r\n  background-image: linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent);\r\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\r\n        /* ie. 32% 16% for an element with w=100 h=200 */\r\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\r\n}\r\n";

},{}],15:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Pattern extends Thing {
  init (props) {
    var defaultProps = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: '0px',
      top: '0px',
      color: '#ddd',
      pattern: 'GraphPaper'
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'Pattern';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.addClass(props.pattern);
    if (props.pattern === 'grid') {
      this.css( Pattern.makeGridCSS(props.cellWidth || 100, props.cellHeight || 100, props.lineWidth || 2) );
    }
  }

  static makeGridCSS (cellWidth, cellHeight, lineWidth) {
    var props = {};
    var pos = '-' + lineWidth + 'px';
    props.backgroundSize = '' + cellWidth + 'px ' + cellHeight + 'px, ' + cellWidth + 'px ' + cellHeight + 'px';
    props.backgroundPosition = pos + ' ' + pos + ',' + pos + ' ' + pos;
    props.backgroundImage =
      'linear-gradient(rgba(255,255,255,.5) ' +lineWidth+ 'px, transparent ' +lineWidth+ 'px),' +
      'linear-gradient(90deg, rgba(255,255,255,.5) ' +lineWidth+ 'px, transparent ' +lineWidth+ 'px)';
    return props;
  }

  static css () {
    return require('./Pattern.css');
  }
}
Thing.addClass(Pattern);

module.exports = Pattern;

},{"../Thing/Thing.js":18,"./Pattern.css":14}],16:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var Action = require('../Action/Action.js');
var Timer = require('../Timer/Timer.js');
var External = require('../External/External.js');


class Pulsar extends Action {
	init (props) {
		props = props || {};
		this.callback = props.callback || function () {};
		this.delay = props.delay || 1000;
		this.T = Timer.make({callback: this.trigger.bind(this), delay: this.delay});

		// Create external function
		this.action = External(function action () {});

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
		this.action(); // call external function
		this.T.go();
	}
}
Thing.addClass(Pulsar);

module.exports = Pulsar;

},{"../Action/Action.js":1,"../External/External.js":9,"../Thing/Thing.js":18,"../Timer/Timer.js":19}],17:[function(require,module,exports){
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

    // return array of 3 ints, each 0-255
    static randRGB() {
        return [Rand.randInt(0,255), Rand.randInt(0,255), Rand.randInt(0,255)];
    }

    static randRGBstr() {
		var rgb = Rand.randRGB();
        return 'rgba(' +rgb[0]+ ',' +rgb[1]+ ',' +rgb[2]+ ', .9)';
    }
}
Thing.addClass(Rand);

module.exports = Rand;

},{"../Thing/Thing.js":18}],18:[function(require,module,exports){
var elementCounter = 0;

class Thing {
  constructor() {}

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
    return this;
  }

  // remove element from dom and null it out
  unRender () {
    if (this.$element) {
      this.$element.remove();
      this.$element = null;
    }
  }

  getDimensions () {
    return {w: this.$element.width(), h: this.$element.height()};
  }

  getBoundingBox () {
    // relative to page
    var scrolltop = $(document).scrollTop();
    var scrollleft = $(document).scrollLeft();
    var bounds = this.$element[0].getBoundingClientRect();
    return {
      x: bounds.left+scrollleft,
      y: bounds.top+scrolltop,
      w: bounds.width,
      h: bounds.height,
      bottom: bounds.bottom+scrolltop,
      right: bounds.right+scrollleft
    };
  }

  rotate (degrees) {
    this.rotation += degrees;
    this.transform();
    return this;
  }

  rotateTo (angle) {
    this.rotation = angle;
    this.transform();
    return this;
  }

  scale (factor) {
    this.scaleFactor += factor;
    this.transform();
    return this;
  }

  scaleTo (factor) {
    this.scaleFactor = factor;
    this.transform();
    return this;
  }

  translate (x, y) {
    this.x += x;
    this.y += y;
    this.transform();
    return this;
  }

  translateTo (x, y) {
    this.x = x;
    this.y = y;
    this.transform();
    return this;
  }

  transform () {
    this.css({
      transform: Thing.makeTransformCSS(this.rotation, this.scaleFactor, this.x, this.y)
    });
    return this;
  }

  css (props) {
    this.props = $.extend(this.props, props);
    this.$element.css(props);
    return this;
  }

  html () {
    return '<div></div>';
  }

  static css () {
    return null;
  }

  static make () {
    // cls will be the class that make() was called on (if Box.make() was called, cls will be Box)
    var cls = this;

    // Create an instance of the class
    var instance = new cls();

    // Init the instance
    instance.init.apply(instance, arguments);

    // bind member functions to the instance
    // instance.__proto__
    // Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(instance)))  // superclass members
    Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(function (key) {
      if (typeof instance[key] === 'function' && key !== 'constructor' && key !== 'init') {
        instance[key] = instance[key].bind(instance);
        window.console.log('BOUND', instance.constructor.name, key);        
      }
    });

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
      backgroundColor: props.backgroundColor,
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

},{}],19:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":18}],20:[function(require,module,exports){
var Thing = require('./Thing/Thing.js');
require('./Box/Box.js');
require('./Arrow/Arrow.js');
require('./DemoBox/DemoBox.js');
require('./Action/Action.js');
require('./Timer/Timer.js');
require('./Rand/Rand.js');
require('./Pulsar/Pulsar.js');
require('./Do/Do.js');
require('./External/External.js');
require('./Label/Label.js');
require('./Line/Line.js');
require('./Img/Img.js');
require('./Pattern/Pattern.js');
require('./BGImg/BGImg.js');

window.Thing = Thing;

},{"./Action/Action.js":1,"./Arrow/Arrow.js":3,"./BGImg/BGImg.js":4,"./Box/Box.js":5,"./DemoBox/DemoBox.js":7,"./Do/Do.js":8,"./External/External.js":9,"./Img/Img.js":10,"./Label/Label.js":11,"./Line/Line.js":13,"./Pattern/Pattern.js":15,"./Pulsar/Pulsar.js":16,"./Rand/Rand.js":17,"./Thing/Thing.js":18,"./Timer/Timer.js":19}]},{},[20])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9FeHRlcm5hbC9FeHRlcm5hbC5qcyIsInNyYy9saWIvSW1nL0ltZy5qcyIsInNyYy9saWIvTGFiZWwvTGFiZWwuanMiLCJzcmMvbGliL0xpbmUvTGluZS5jc3MiLCJzcmMvbGliL0xpbmUvTGluZS5qcyIsInNyYy9saWIvUGF0dGVybi9QYXR0ZXJuLmNzcyIsInNyYy9saWIvUGF0dGVybi9QYXR0ZXJuLmpzIiwic3JjL2xpYi9QdWxzYXIvUHVsc2FyLmpzIiwic3JjL2xpYi9SYW5kL1JhbmQuanMiLCJzcmMvbGliL1RoaW5nL1RoaW5nLmpzIiwic3JjL2xpYi9UaW1lci9UaW1lci5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb24ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxuXHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMucHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uZ28oKScpO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5zdG9wKCknKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBtYWtlICgpIHtcclxuXHRcdHZhciBjbHMgPSB0aGlzO1xyXG5cdFx0dmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xyXG5cdFx0aW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcclxuXHJcblx0XHQvLyBiaW5kIG1lbWJlciBmdW5jdGlvbnMgdG8gdGhlIGluc3RhbmNlXHJcblx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5zdGFuY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBpbnN0YW5jZVtrZXldID09PSAnZnVuY3Rpb24nICYmIGtleSAhPT0gJ2NvbnN0cnVjdG9yJyAmJiBrZXkgIT09ICdpbml0Jykge1xyXG5cdFx0XHRcdGluc3RhbmNlW2tleV0gPSBpbnN0YW5jZVtrZXldLmJpbmQoaW5zdGFuY2UpO1xyXG5cdFx0XHRcdHdpbmRvdy5jb25zb2xlLmxvZygnQk9VTkQnLCBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lLCBrZXkpO1xyXG5cdFx0ICAgIH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBpbnN0YW5jZTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQWN0aW9uKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLyogcmVxdWlyZWQgZm9yIGFycm93ICovXFxyXFxuLmFycm93LWhlYWQge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXHJcXG4gIHdpZHRoOiAwOyBcXHJcXG4gIGhlaWdodDogMDsgXFxyXFxuICBib3JkZXItdG9wOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWJvdHRvbTogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1sZWZ0OiAzMHB4IHNvbGlkIGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uYXJyb3ctYm9keSB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxuICB3aWR0aDogNDBweDtcXHJcXG4gIGhlaWdodDogMjBweDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxyXFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDA7XFxyXFxuICBib3JkZXItcmlnaHQ6IDA7XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy13cmFwcGVyIHtcXHJcXG4gIHdpZHRoOiA3MHB4OyAgIC8qIGFycm93LWJvZHkgd2lkdGggKyBhcnJvdy1oZWFkIGJvcmRlciB3aWR0aCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uQXJyb3cge1xcclxcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxyXFxufVxcclxcblxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEFycm93IGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0Fycm93JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy5zZXRDb2xvcih0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBhcnJvdyBiZWZvcmUgY2FsbGluZyB0aGlzXHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHNldENvbG9yIChjKSB7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1oZWFkJykuY3NzKHtib3JkZXJMZWZ0Q29sb3I6Y30pO1xyXG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctYm9keScpLmNzcyh7YmFja2dyb3VuZENvbG9yOmN9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0aHRtbCAoKSB7XHJcblx0XHRyZXR1cm4gXCI8ZGl2PjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PjwvZGl2PlwiO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNyZWF0ZUFycm93RWxlbWVudCAoKSB7XHJcblx0XHR2YXIgJGFycm93ID0gJChcIjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PlwiKTtcclxuXHRcdHJldHVybiAkYXJyb3c7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3NzICgpIHtcclxuXHRcdHJldHVybiByZXF1aXJlKCcuL0Fycm93LmNzcycpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhBcnJvdyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFycm93O1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQkdJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHVybDogJycsXHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgbGVmdDogJzBweCcsXHJcbiAgICAgIHRvcDogJzBweCdcclxuICAgIH07XHJcbiAgICBwcm9wcyA9IHRoaXMucHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0JHSW1nJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcclxuICAgICAgYmFja2dyb3VuZDogJ3VybChcIicgKyBwcm9wcy51cmwgKyAnXCIpIG5vLXJlcGVhdCBjZW50ZXInLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogJ2NvdmVyJyAgLy8xMDAlIDEwMCUnXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQkdJbWcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR0ltZztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEJveCBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gIFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuICBcdHRoaXMudHlwZSA9ICdCb3gnO1xyXG4gIFx0dGhpcy5pdGVtcyA9IFtdO1xyXG4gIFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgYWRkIChhZGRJdGVtcykge1xyXG4gIFx0aWYgKGFkZEl0ZW1zKSB7XHJcbiAgICAgIGlmICghKGFkZEl0ZW1zIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgICAgYWRkSXRlbXMgPSBbYWRkSXRlbXNdO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAodmFyIGk9MDsgaSA8IGFkZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGFkZEl0ZW1zW2ldKTtcclxuICAgICAgICBhZGRJdGVtc1tpXS5wYXJlbnQgPSB0aGlzOyAgICAgICAgXHJcbiAgICAgIH1cclxuICBcdH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSB0aGlzIGJveCAoZnJvbSB0aGUgZG9tIGFuZCB0aGUgaXRlbXMgbGlzdClcclxuICByZW1vdmUgKGl0ZW0pIHtcclxuICBcdGlmIChpdGVtKSB7XHJcbiAgXHRcdHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKTtcclxuICBcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuICBcdFx0ICAgIHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICBcdFx0XHRpdGVtLiRlbGVtZW50LnJlbW92ZSgpO1xyXG4gIFx0XHRcdGl0ZW0ucGFyZW50ID0gbnVsbDtcclxuICBcdFx0fVxyXG4gIFx0fVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBudW1FbGVtZW50cyAoKSB7XHJcbiAgXHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50Qm91bmRzICgpIHtcclxuICAgIHZhciBib3VuZHMgPSB7eDo5OTk5OTksIHk6OTk5OTk5LCBib3R0b206MCwgcmlnaHQ6MH07XHJcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPCAxKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3MgPSB0aGlzLml0ZW1zW2ldLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgIGJvdW5kcy54ID0gKHBvcy54IDwgYm91bmRzLngpID8gcG9zLnggOiBib3VuZHMueDtcclxuICAgICAgYm91bmRzLnkgPSAocG9zLnkgPCBib3VuZHMueSkgPyBwb3MueSA6IGJvdW5kcy55O1xyXG4gICAgICBib3VuZHMuYm90dG9tID0gKHBvcy5ib3R0b20gPiBib3VuZHMuYm90dG9tKSA/IHBvcy5ib3R0b20gOiBib3VuZHMuYm90dG9tO1xyXG4gICAgICBib3VuZHMucmlnaHQgPSAocG9zLnJpZ2h0ID4gYm91bmRzLnJpZ2h0KSA/IHBvcy5yaWdodCA6IGJvdW5kcy5yaWdodDtcclxuICAgIH1cclxuICAgIGJvdW5kcy53ID0gYm91bmRzLnJpZ2h0IC0gYm91bmRzLng7XHJcbiAgICBib3VuZHMuaCA9IGJvdW5kcy5ib3R0b20gLSBib3VuZHMueTtcclxuICAgIHJldHVybiBib3VuZHM7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gIFx0c3VwZXIucmVuZGVyKCk7XHJcbiAgXHRmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRcdHRoaXMuaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQm94KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm94O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxyXFxuLkRlbW9Cb3gge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgbWFyZ2luOiAyMHB4O1xcclxcbiAgd2lkdGg6IDIwMHB4OyBcXHJcXG4gIGhlaWdodDogMjAwcHg7IFxcclxcbiAgYm9yZGVyOiAycHggZGFzaGVkICNlZWU7XFxyXFxufVxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEJveCA9IHJlcXVpcmUoJy4uL0JveC9Cb3guanMnKTtcclxuXHJcbmNsYXNzIERlbW9Cb3ggZXh0ZW5kcyBCb3gge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XHJcblx0XHRwcm9wcy53aWR0aCA9IHByb3BzLndpZHRoIHx8IDIwMDtcclxuXHRcdHByb3BzLmhlaWdodCA9IHByb3BzLmhlaWdodCB8fCAyMDA7XHJcblx0XHRwcm9wcy5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHR0aGlzLnR5cGUgPSAnRGVtb0JveCc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vRGVtb0JveC5jc3MnKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoRGVtb0JveCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlbW9Cb3g7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vLyBMaWtlIFVuaXggcGlwZTogb3V0cHV0IG9mIG9uZSBjb21tYW5kIGlzIGlucHV0IHRvIHRoZSBuZXh0XHJcbi8vIEVhY2ggZnVuY3Rpb24gdGFrZXMgYSAncHJvcHMnIG9iamVjdCBhcyBhcmd1bWVudFxyXG4vLyBFYWNoIGZ1bmN0aW9uIHJldHVybnMgYW4gb2JqZWN0IHdpdGggcmVzdWx0cywgd2hpY2ggaXMgcGFzc2VkIGFzIHByb3BzIHRvIHRoZSBuZXh0XHJcbi8vIERvKCkgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBleGVjdXRlIHRoZSBEbyBjaGFpblxyXG5cclxuLy8gUC5wdWxzZS5zZXRUbyhcclxuLy8gICAgIERvKFIuZ2V0UmFuZG9tTnVtYmVyLCB7ZnJvbTowLCB0bzoxMH0pICAgLy8gcmV0dXJuczogIHtkYXRhOiA4fVxyXG4vLyAgICAgLkRvKEMucGlja0NvbG9yKSAgICAvLyByZWFkcyBpbnB1dCA4LCByZXR1cm5zIHtkYXRhOiAnI2NmZid9XHJcbi8vICAgICAuRG8oQi5jaGFuZ2VDb2xvcikgICAvLyByZWFkcyBpbnB1dCAnI2NmZicsIGNoYW5nZXMgY29sb3Igb24gQmxpbmtlclxyXG4vLyApO1xyXG5cclxuXHJcbmZ1bmN0aW9uIERvKF9hRnVuY3Rpb24sIF9wcm9wcywgX2ZpcnN0RG8pIHtcclxuICAgIHZhciBhRnVuY3Rpb24gPSBfYUZ1bmN0aW9uO1xyXG4gICAgdmFyIHByb3BzID0gX3Byb3BzO1xyXG4gICAgdmFyIGZpcnN0RG8gPSBfZmlyc3REbyB8fCBleGVjdXRvcjtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWZ1bmN0aW9uPScsIGFGdW5jdGlvbik7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncHJvcHM9JywgcHJvcHMpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2ZpcnN0RG89JywgZmlyc3REbyk7XHJcblxyXG4gICAgLy8gUnVuIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMuXHJcbiAgICAvLyBQYXNzIHRoZSByZXN1bHRzIHRvIHRoZSBuZXh0IGNoYWluZWQgZnVuY3Rpb24gKGlmIGFueSkuXHJcbiAgICAvLyBSZXR1cm4gcmVzdWx0cyBvZiB0aGlzIGZ1bmN0aW9uIG9yIG9mIHRoZSBjaGFpblxyXG4gICAgZnVuY3Rpb24gZXhlY3V0b3IgKHBpcGVkUHJvcHMpIHtcclxuICAgICAgICB2YXIgcmV0dXJuVmFsID0gYUZ1bmN0aW9uKHByb3BzIHx8IHBpcGVkUHJvcHMpO1xyXG4gICAgICAgIHJldHVybiAoZXhlY3V0b3IubmV4dERvID8gZXhlY3V0b3IubmV4dERvKHJldHVyblZhbCkgOiByZXR1cm5WYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldHVybiB0aGUgbGFzdCAnRG8nIGluIHRoZSBjaGFpblxyXG4gICAgZnVuY3Rpb24gZ2V0TGFzdERvICgpIHtcclxuICAgICAgICB2YXIgdG1wRG8gPSBmaXJzdERvO1xyXG4gICAgICAgIHdoaWxlICh0bXBEby5uZXh0RG8pIHsgdG1wRG8gPSB0bXBEby5uZXh0RG87IH1cclxuICAgICAgICByZXR1cm4gdG1wRG87XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGEgbmV3ICdEbycgdG8gdGhlIGVuZCBvZiB0aGUgY2hhaW4uXHJcbiAgICBleGVjdXRvci5EbyA9IGZ1bmN0aW9uIChhRnVuY3Rpb24sIHByb3BzKSB7XHJcbiAgICAgICAgZ2V0TGFzdERvKCkubmV4dERvID0gRG8oYUZ1bmN0aW9uLCBwcm9wcywgZmlyc3REbyk7XHJcbiAgICAgICAgcmV0dXJuIGZpcnN0RG87ICAvLyBBbHdheXMgcmV0dXJuIHRoZSBmaXJzdCAnRG8nIGluIHRoZSBjaGFpblxyXG4gICAgfTtcclxuXHJcbiAgICBleGVjdXRvci5uZXh0RG8gPSBudWxsO1xyXG5cclxuICAgIHJldHVybiBleGVjdXRvcjtcclxufVxyXG5cclxuVGhpbmcuRG8gPSBEbztcclxuXHJcbi8qXHJcbi8vIGNoYWluZWQsIGVhY2ggRG8gaGFzIGl0cyBvd24gcGFyYW1ldGVyc1xyXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7fSwge2FyZzE6J2hlbGxvMSd9KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwge2FyZzI6J2hlbGxvIHRvIDIyMjIyJ30pXHJcblxyXG4vLyBjaGFpbmVkLCB3aXRoIGZpcnN0IERvIHBpcGluZyByZXN1bHRzIHRvIHNlY29uZCBEb1xyXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7IHJldHVybiB7cGlwZWRwcm9wOjEyMzR9fSwge2FyZzE6J2hlbGxvMSd9KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwgbnVsbClcclxuXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTsgcmV0dXJuIHtuZXdQcm9wOnByb3BzLnBpcGVkcHJvcCsyfX0pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMycsIHByb3BzKTt9KVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEbztcclxuIiwiLyoqXHJcbiAqICBXcmFwIGEgZnVuY3Rpb24gaW5zaWRlIGEgbW9kdWxlIHNvIHRoYXQgdGhlIGZ1bmN0aW9uIGNhbiBiZVxyXG4gKiAgb3ZlcnJpZGVuIGZyb20gb3V0c2lkZSB0aGUgbW9kdWxlIHdpdGggYSBjdXN0b20gZnVuY3Rpb24uICBUaGUgXHJcbiAqICBjdXN0b21pemVkIGZ1bmN0aW9uIGlzIGF2YWlsYWJsZSBib3RoIG91dHNpZGUgYW5kIGluc2lkZSB0aGUgXHJcbiAqICByZXF1aXJpZmllZCBtb2R1bGUuXHJcbiAqXHJcbiAqICBJbiB0aGUgbW9kdWxlOlxyXG4gKiAgICAgIHZhciBvdmVycmlkYWJsZUZ1bmN0aW9uID0gRXh0ZXJuYWwoIGZ1bmN0aW9uIChhKSB7XHJcbiAqICAgICAgICAgIC4uLlxyXG4gKiAgICAgIH0pO1xyXG4gKiAgICAgIG1vZHVsZS5leHBvcnRzID0geyBvdmVycmlkYWJsZUZ1bmN0aW9uOiBvdmVycmlkYWJsZUZ1bmN0aW9uIH07XHJcbiAqXHJcbiAqICBJbiB0aGUgY2FsbGluZyBtb2R1bGU6XHJcbiAqICAgICAgU29tZU1vZHVsZS5vdmVycmlkYWJsZUZ1bmN0aW9uLkJJTkQobXlDdXN0b21GdW5jdGlvbik7XHJcbiAqICAgICAgU29tZU1vZHVsZS5vdmVycmlkYWJsZUZ1bmN0aW9uKCk7ICAvLyB3aWxsIHJ1biBteUN1c3RvbUZ1bmN0aW9uXHJcbiAqXHJcbiAqICBAbW9kdWxlIEV4dGVybmFsXHJcbiAqL1xyXG5cclxudmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmZ1bmN0aW9uIEV4dGVybmFsIChjYWxsRnVuY3Rpb24sIGNhbGxDb250ZXh0KSB7XHJcbiAgICB2YXIgY2FsbE1lLCBjb250ZXh0O1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldEZ1bmN0aW9uIChuZXdGdW5jLCBuZXdDb250ZXh0KSB7XHJcbiAgICAgICAgY2FsbE1lID0gbmV3RnVuYztcclxuICAgICAgICBjb250ZXh0ID0gbmV3Q29udGV4dCB8fCB7fTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB3cmFwcGVyICgpIHtcclxuICAgICAgICByZXR1cm4gY2FsbE1lLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgd3JhcHBlci5CSU5EID0gc2V0RnVuY3Rpb247XHJcblxyXG4gICAgc2V0RnVuY3Rpb24oY2FsbEZ1bmN0aW9uLCBjYWxsQ29udGV4dCk7XHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXI7XHJcbn1cclxuXHJcblRoaW5nLkV4dGVybmFsID0gRXh0ZXJuYWw7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEV4dGVybmFsO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLypcclxuICAgIHNyYzogPGZpbGUgcGF0aD5cclxuICAgIGNlbnRlcjogdHJ1ZXxmYWxzZVxyXG4gICAgc2l6ZTogY29udGFpbnxjb3ZlcnxzdHJldGNoXHJcbiovXHJcblxyXG5jbGFzcyBJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBwbGFjZWhvbGRlciA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBRElDQVlBQUFDdFdLNmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQlY5SlJFRlVlSnp0M2MxdTNVUWNoK0YvRUJLOUFzUUNWV2ZWUXE0Q2JoeHVBNEVxc1NtaCs3SXVpOVFDUXZJN1l4K1BQNTlIOGk2eVpvN216ZmdrbG4xWFZaOEtlTllYYXc4QXRrd2dFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnZURMRVQ5NzEyMFVzTHltTzBqc0lCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlNKzdWTlYzYXc5aVFmZFY5WHJ0UVd6VnA4YmpMQzVWOVh0VlBkUTVJcm12cWc5VjlhN09GVW56dWhmSVB5NzFHTWN3NTZOSE1zUXh6UGRNa1Foa3BFdjlONDZqUi9JMGpyTkZJcEFSTHZWOEhFZU41S1U0emhTSlFCcGRLc2R4dEVpdXhYR1dTQVRTNEZKdGNSd2xrdFk0emhDSlFLNjQxTGc0L2gzSjk0dVA5blpqNHpoNkpBSUpMalV0anIxR01qV09JMGNpa0JkYzZyWTQ5aGJKclhFY05SS0JQT05TODhTeGwwam1pdU9Ja1RUTitXeTNtcnlxcXE5bVBOODNWZlZUYlRPUys2cjZ1YXErbnZHY3J6NGZwM0ttSGFUcWNURS8xSHkvVmJlNGs4eTljM3lxcXZkVjlXYkpTWFRtRWlzNGNpVGlhQ09RSzQ0WWlUamFDYVJCajBqK3JIVWlFY2M0QW1sMGhFakVNWjVBUnRoekpPS1lSaUFqZlYrUGkzcFBrWWhqT29GTXNLZEllc1R4UjUwamppcUJUTGFIU01SeE80SGNZTXVSaUdNZUFybFJyMGp1YnhpVE9PWWprQmxzS1JKeHpFc2dNOWxDSk9LWW4wQm10R1lrNHVoRElETmJJeEp4OUNPUUR1NXJ1VWg2eGZGMmxrOWkvd1RTeVJLUmlLTS9nWFRVTXhKeExFTWduZldJNUVPSll5a0NXVUNQU01TeERJRXNaS3VSaUNNVHlJSjZmRzhRUjE4Q1dkaFdJbmtvY2JRUXlBcldqa1FjN1FTeWtyVWlFY2M0QWxuUjBwR0lZenlCckd5cFNNUXhqVUEyb0hjazRwaE9JQnZSS3hKeDNLYnBjejdiMDkyUDVtN3RBWnlCSGFTZkpTNng5dnpPeERXNXhGclprbC9TUlRLZVFGYTB4cDk1UlRLT1FGYXk1ajhLUmRKT0lDdll3cTBtSW1ramtJV3RIWWRJeGhISWdyWVNoMGphQ1dRaFc0dERKRzBFc29DdHhpR1M2d1RTV1k4NEhxclBpMFZGOG44QzZhaFhIRy9yY1RHTHBEK0JkTkl6am9GSStoTklCMHZFTVJCSlh3S1oyWkp4REVUU2owQm10RVljQTVIMElaQ1pyQm5IUUNUekU4Z010aERIUUNUekVzaU50dmlVZFpITVJ5QTMyR0ljQTVITVF5QVRiVG1PZ1VodUo1QUo5aERIUUNTM0VjaEllNHBqSUpMcEJETENIdU1ZaUdRYWdUVGFjeHdEa1l3bmtBWkhpR01na25FRWNrV3ZPTjRzT1lrblJOSk9JTUVSNHhpSXBJMUFYbkRrT0FZaXVVNGd6emhESElOZWtSemxpZkpOY3o3YjA5MC9majdtOGxCVlAxVFZyek9lY3k2L1ZOV1A5ZmlLNnJsOHJLcS9aanpmTHB4cEI2bXFlbDFWNytxNE84ZFRjKzBrdjFYVnR3dVB2U2VYV01HdGtld2xqc0d0a1J3dGppcUJYRFUxa3ZlMXJ6Z0dVeU01WWh4VkFta3lOcEs5eGpFWUc4bFI0NmdTU0xQV1NQWWV4NkExa2lQSFVTV1FVYTVGY3BRNEJ0Y2lPWG9jVlFJWjdhVklqaGJINEtWSXpoQkhsVUFtZVJySlVlTVlQSTNrTEhGVUNXU3lJWktqeHpFWUlqbFRIRlVDdWNuck9rY2NnN2QxcmppcUd0ZjlYYlV2ZmkrdDUwaWExdjNaN3NXQ1VRUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUhCWFZaL1dIZ1JzbFIwRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VncjhCaVFWenE5THYxT29BQUFBQVNVVk9SSzVDWUlJPSc7XHJcblxyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuICAgIHByb3BzLnNyYyA9IHByb3BzLnNyYyB8fCBwbGFjZWhvbGRlcjtcclxuICAgIC8vIHByb3BzLmJhY2tncm91bmQgPSAndXJsKFwiJyArIHByb3BzLnNyYyArICdcIikgbm8tcmVwZWF0ICcgKyAocHJvcHMuY2VudGVyID8gJ2NlbnRlcicgOiAnbGVmdCB0b3AnKTtcclxuICAgIC8vIHByb3BzLmJhY2tncm91bmRTaXplID0gKHByb3BzLnNpemUgPT09ICdjb250YWluJyB8fCBwcm9wcy5zaXplID09PSAnY292ZXInID8gcHJvcHMuc2l6ZSA6IChwcm9wcy5zaXplPT09J3N0cmV0Y2gnID8gJzEwMCUgMTAwJScgOiB1bmRlZmluZWQpICk7XHJcblxyXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xyXG5cclxuICAgIHRoaXMudHlwZSA9ICdJbWcnO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zcmMgPSBwcm9wcy5zcmM7XHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IHVuZGVmaW5lZDtcclxuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgdW5kZWZpbmVkO1xyXG4gICAgdGhpcy53ID0gcHJvcHMudyB8fCB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLmggPSBwcm9wcy5oIHx8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBJbWcubG9hZGluZyh0aGlzKTtcclxuICAgIGxvYWRJbWFnZShwcm9wcy5zcmMsIHRoaXMub25sb2FkLmJpbmQodGhpcyksIHRoaXMub25lcnJvci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBzdXBlci5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIG9ubG9hZCAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltYWdlIExvYWRlZDonLCBpbWcsIGltZy5zcmMsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLncgPSB0aGlzLncgfHwgaW1nLndpZHRoO1xyXG4gICAgdGhpcy5oID0gdGhpcy5oIHx8IGltZy5oZWlnaHQ7XHJcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gdGhpcy5oIC8gdGhpcy53O1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLncsIFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5oLCBcclxuICAgICAgICBiYWNrZ3JvdW5kOiAndXJsKCcgK2ltZy5zcmMrICcpIG5vLXJlcGVhdCBjZW50ZXInLFxyXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xyXG4gICAgfSk7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgb25lcnJvciAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltZy5vbmVycm9yJywgaW1nLnNyYywgJ2ZhaWxlZCcpO1xyXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5lcnJvciA9IHRydWU7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0V2lkdGggKHcpIHtcclxuICAgIHRoaXMud2lkdGggPSB3O1xyXG4gICAgdGhpcy5oZWlnaHQgPSB3ICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkaW5nIChpbWcpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5sb2FkaW5nKCk6XCIsIGltZy5zcmMpO1xyXG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcclxuICAgIGlmIChpbWcgJiYgIWltZy5sb2FkZWQpIHtcclxuICAgICAgICBJbWcucXVldWVkSW1ncy5wdXNoKGltZyk7XHJcbiAgICB9IFxyXG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkZWQgKGltZykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwiSU1HLmxvYWRlZCgpOlwiLCBpbWcuc3JjLCBJbWcucXVldWVkSW1ncy5sZW5ndGgpO1xyXG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcclxuICAgIGlmIChpbWcgJiYgaW1nLmxvYWRlZCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IEltZy5xdWV1ZWRJbWdzLmluZGV4T2YoaW1nKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBJbWcucXVldWVkSW1ncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoSW1nLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIEltZy5vbkFsbExvYWRlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBJbWcucXVldWVkSW1ncy5sZW5ndGggPT09IDA7ICAgICAgICBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBvbkFsbExvYWRlZCAoKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coXCJJTUcub25BbGxMb2FkZWQoKTogdHJpZ2dlcmVkXCIpO1xyXG4gIH1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoSW1nKTtcclxuXHJcblxyXG5mdW5jdGlvbiBsb2FkSW1hZ2UgKHNyYywgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcclxuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjYWxsYmFjayh0aGlzKTtcclxuICAgIH07XHJcbiAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBlcnJvckNhbGxiYWNrKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIGltZy5zcmMgPSBzcmM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgTGFiZWwgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXHJcblx0XHRcdGZvbnRTaXplOiAnMTRweCcsXHJcblx0XHRcdGNvbG9yOiAnIzAwMCdcclxuXHRcdH07XHJcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnTGFiZWwnO1xyXG5cdFx0dGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy50ZXh0KTtcclxuXHR9XHJcblxyXG5cdHNldFRleHQgKHR4dCkge1xyXG5cdFx0dGhpcy50ZXh0ID0gdHh0O1xyXG5cdFx0dGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0eHQpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoTGFiZWwpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYWJlbDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcclxcbi5MaW5lIHtcXHJcXG4gIC8qIEZvciBzb21lIG5pY2UgYW5pbWF0aW9uIG9uIHRoZSByb3RhdGVzOiAqL1xcclxcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAtbW96LXRyYW5zaXRpb246ICAgIC1tb3otdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgICB0cmFuc2Zvcm0gLjJzO1xcclxcbn1cXHJcXG5cXHJcXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBMaW5lIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICAvLyBleHBlY3RpbmcgcHJvcHM6IHsgeDE6MCwgeTE6MCwgeDI6NTAsIHkyOjUwIH1cclxuICAgIHByb3BzLmJhY2tncm91bmRDb2xvciA9IHByb3BzICYmIChwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgcHJvcHMuY29sb3IgfHwgJ2JsYWNrJyk7XHJcbiAgICBzdXBlci5pbml0KHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdMaW5lJztcclxuICAgIHRoaXMubGVuZ3RoID0gMTA7XHJcbiAgICB0aGlzLndpZHRoID0gMTtcclxuICAgIHRoaXMuYW5nbGUgPSAwO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyh0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy5jcmVhdGVMaW5lKHByb3BzLngxLCBwcm9wcy55MSwgcHJvcHMueDIsIHByb3BzLnkyLCBwcm9wcy53aWR0aCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVMaW5lICh4MSx5MSwgeDIseTIsIHdpZHRoKSB7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgMjtcclxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5zcXJ0KCh4MS14MikqKHgxLXgyKSArICh5MS15MikqKHkxLXkyKSk7XHJcbiAgICB0aGlzLmFuZ2xlICA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgICdsZWZ0JzogJycgKyB4MSArICdweCcsXHJcbiAgICAgICAgJ3RvcCc6ICcnICsgKHkxLSh0aGlzLndpZHRoLzIpKSArICdweCcsXHJcbiAgICAgICAgJ3dpZHRoJzogJycgKyB0aGlzLmxlbmd0aCArICdweCcsXHJcbiAgICAgICAgJ2hlaWdodCc6ICcnICsgdGhpcy53aWR0aCArICdweCcsXHJcbiAgICAgICAgLy8gcm90YXRlIGFyb3VuZCBzdGFydCBwb2ludCBvZiBsaW5lXHJcbiAgICAgICAgJ3RyYW5zZm9ybS1vcmlnaW4nOiAnMCA1MCUnXHJcbiAgICAgIH0pO1xyXG4gICAgdGhpcy5yb3RhdGVUbyh0aGlzLmFuZ2xlKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gIFx0cmV0dXJuIHJlcXVpcmUoJy4vTGluZS5jc3MnKTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoTGluZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuUGF0dGVybi5HcmFwaFBhcGVyIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDM7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweCwgMjBweCAyMHB4LCAyMHB4IDIwcHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweCwgLTFweCAtMXB4LCAtMXB4IC0xcHg7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC4zKSAxcHgsIHRyYW5zcGFyZW50IDFweCksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMykgMXB4LCB0cmFuc3BhcmVudCAxcHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5HcmlkIHtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTAwcHggMTAwcHgsIDEwMHB4IDEwMHB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTJweCAtMnB4LCAtMnB4IC0ycHg7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlNvZmEge1xcclxcbiAgYmFja2dyb3VuZDpcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA5JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDklKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgMTAwJSwgMjclKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSAxMCUpIDUwJSA1MCUsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDMwJSwgMC44KSAyMCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgNTAlIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDMwJSwgMC44KSAyMCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgMCA1MCUsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDEwMCUgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAxNSUsIDAuNyksIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgMCAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAxNSUsIDAuNyksIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgNTAlIDUwJSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMCxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KC00NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDA7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzAwO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAyNSUgMjUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5Qb2xrYURvdHMge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE2JSksXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE2JSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDYwcHggNjBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMzBweCAzMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5CbHVlQmFsbHMge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNhY2YgNzclLCByZ2JhKDg4LDk5LDI1NSwuODgpIDgwJSwgdHJhbnNwYXJlbnQgODMlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uU3RyaXBlcyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgyNTUsMjU1LDI1LDEpIDUwJSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uUGxhaWRSZWQge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogaHNsKDIsIDU3JSwgNDAlKTtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IFxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LCB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDAsMCwwLC40KSA1MHB4LCByZ2JhKDAsMCwwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LCB0cmFuc3BhcmVudCA2M3B4LCByZ2JhKDAsMCwwLC40KSA2M3B4LCByZ2JhKDAsMCwwLC40KSA2NnB4LCB0cmFuc3BhcmVudCA2NnB4LCB0cmFuc3BhcmVudCAxMTZweCwgcmdiYSgwLDAsMCwuNSkgMTE2cHgsIHJnYmEoMCwwLDAsLjUpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjU1LC4yKSAxNjZweCwgcmdiYSgyNTUsMjU1LDI1NSwuMikgMTY5cHgsIHJnYmEoMCwwLDAsLjUpIDE2OXB4LCByZ2JhKDAsMCwwLC41KSAxNzlweCwgcmdiYSgyNTUsMjU1LDI1NSwuMikgMTc5cHgsIHJnYmEoMjU1LDI1NSwyNTUsLjIpIDE4MnB4LCByZ2JhKDAsMCwwLC41KSAxODJweCwgcmdiYSgwLDAsMCwuNSkgMjMycHgsIHRyYW5zcGFyZW50IDIzMnB4KSxcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgyNzBkZWcsIHRyYW5zcGFyZW50LCB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDAsMCwwLC40KSA1MHB4LCByZ2JhKDAsMCwwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LCB0cmFuc3BhcmVudCA2M3B4LCByZ2JhKDAsMCwwLC40KSA2M3B4LCByZ2JhKDAsMCwwLC40KSA2NnB4LCB0cmFuc3BhcmVudCA2NnB4LCB0cmFuc3BhcmVudCAxMTZweCwgcmdiYSgwLDAsMCwuNSkgMTE2cHgsIHJnYmEoMCwwLDAsLjUpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjU1LC4yKSAxNjZweCwgcmdiYSgyNTUsMjU1LDI1NSwuMikgMTY5cHgsIHJnYmEoMCwwLDAsLjUpIDE2OXB4LCByZ2JhKDAsMCwwLC41KSAxNzlweCwgcmdiYSgyNTUsMjU1LDI1NSwuMikgMTc5cHgsIHJnYmEoMjU1LDI1NSwyNTUsLjIpIDE4MnB4LCByZ2JhKDAsMCwwLC41KSAxODJweCwgcmdiYSgwLDAsMCwuNSkgMjMycHgsIHRyYW5zcGFyZW50IDIzMnB4KSxcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgxMjVkZWcsIHRyYW5zcGFyZW50LCB0cmFuc3BhcmVudCAycHgsIHJnYmEoMCwwLDAsLjIpIDJweCwgcmdiYSgwLDAsMCwuMikgM3B4LCB0cmFuc3BhcmVudCAzcHgsIHRyYW5zcGFyZW50IDVweCwgcmdiYSgwLDAsMCwuMikgNXB4KTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uRGlhZ29uYWxTdHJpcGVzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg0NWRlZywgYmxhY2sgMjUlLCB0cmFuc3BhcmVudCAyNSUsIHRyYW5zcGFyZW50IDUwJSwgYmxhY2sgNTAlLCBibGFjayA3NSUsIHRyYW5zcGFyZW50IDc1JSwgdHJhbnNwYXJlbnQpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxNiUgMTYlOyAgLyogbXVzdCBtYXRjaCBhc3BlY3QgcmF0aW8gb2YgY29udGFpbmluZyBlbGVtZW50IG9yIGxpbmVzIHdpbGwgYnJlYWsgKi9cXHJcXG4gICAgICAgIC8qIGllLiAzMiUgMTYlIGZvciBhbiBlbGVtZW50IHdpdGggdz0xMDAgaD0yMDAgKi9cXHJcXG4gICAgICAgIC8qIFBvd2VycyBvZiAyIHdvcmsgYmVzdCAob3RoZXIgdmFsdWVzLCBsaWtlIDcgb3IgMjMsIG1ha2UgamFnZ3kgYWxpYXNpbmcpICovXFxyXFxufVxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFBhdHRlcm4gZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgbGVmdDogJzBweCcsXHJcbiAgICAgIHRvcDogJzBweCcsXHJcbiAgICAgIGNvbG9yOiAnI2RkZCcsXHJcbiAgICAgIHBhdHRlcm46ICdHcmFwaFBhcGVyJ1xyXG4gICAgfTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnUGF0dGVybic7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHByb3BzLnBhdHRlcm4pO1xyXG4gICAgaWYgKHByb3BzLnBhdHRlcm4gPT09ICdncmlkJykge1xyXG4gICAgICB0aGlzLmNzcyggUGF0dGVybi5tYWtlR3JpZENTUyhwcm9wcy5jZWxsV2lkdGggfHwgMTAwLCBwcm9wcy5jZWxsSGVpZ2h0IHx8IDEwMCwgcHJvcHMubGluZVdpZHRoIHx8IDIpICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUdyaWRDU1MgKGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgbGluZVdpZHRoKSB7XHJcbiAgICB2YXIgcHJvcHMgPSB7fTtcclxuICAgIHZhciBwb3MgPSAnLScgKyBsaW5lV2lkdGggKyAncHgnO1xyXG4gICAgcHJvcHMuYmFja2dyb3VuZFNpemUgPSAnJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCwgJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCc7XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kUG9zaXRpb24gPSBwb3MgKyAnICcgKyBwb3MgKyAnLCcgKyBwb3MgKyAnICcgKyBwb3M7XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kSW1hZ2UgPVxyXG4gICAgICAnbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpICcgK2xpbmVXaWR0aCsgJ3B4LCB0cmFuc3BhcmVudCAnICtsaW5lV2lkdGgrICdweCksJyArXHJcbiAgICAgICdsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpICcgK2xpbmVXaWR0aCsgJ3B4LCB0cmFuc3BhcmVudCAnICtsaW5lV2lkdGgrICdweCknO1xyXG4gICAgcmV0dXJuIHByb3BzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNzcyAoKSB7XHJcbiAgICByZXR1cm4gcmVxdWlyZSgnLi9QYXR0ZXJuLmNzcycpO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhQYXR0ZXJuKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEFjdGlvbiA9IHJlcXVpcmUoJy4uL0FjdGlvbi9BY3Rpb24uanMnKTtcclxudmFyIFRpbWVyID0gcmVxdWlyZSgnLi4vVGltZXIvVGltZXIuanMnKTtcclxudmFyIEV4dGVybmFsID0gcmVxdWlyZSgnLi4vRXh0ZXJuYWwvRXh0ZXJuYWwuanMnKTtcclxuXHJcblxyXG5jbGFzcyBQdWxzYXIgZXh0ZW5kcyBBY3Rpb24ge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xyXG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XHJcblx0XHR0aGlzLlQgPSBUaW1lci5tYWtlKHtjYWxsYmFjazogdGhpcy50cmlnZ2VyLmJpbmQodGhpcyksIGRlbGF5OiB0aGlzLmRlbGF5fSk7XHJcblxyXG5cdFx0Ly8gQ3JlYXRlIGV4dGVybmFsIGZ1bmN0aW9uXHJcblx0XHR0aGlzLmFjdGlvbiA9IEV4dGVybmFsKGZ1bmN0aW9uIGFjdGlvbiAoKSB7fSk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHR0aGlzLlQuZ28oKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHR0aGlzLlQuc3RvcCgpO1xyXG5cdH1cclxuXHJcblx0dHJpZ2dlciAoKSB7XHJcblx0XHR0aGlzLmFjdGlvbigpOyAvLyBjYWxsIGV4dGVybmFsIGZ1bmN0aW9uXHJcblx0XHR0aGlzLlQuZ28oKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUHVsc2FyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHVsc2FyO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxudmFyIFBJID0gMy4xNDE1OTI2NTM1OTtcclxudmFyIEhBTEZQSSA9IFBJLzIuMDtcclxuXHJcbmNsYXNzIFJhbmQge1xyXG5cdHN0YXRpYyByYW5kSXRlbShhcnIpIHtcclxuXHRcdGlmIChhcnIgJiYgYXJyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIGFyclsgUmFuZC5yYW5kSW50KDAsIGFyci5sZW5ndGgtMSkgXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGluY2x1ZGVkKVxyXG5cdC8vIFVzaW5nIE1hdGgucm91bmQoKSB3aWxsIGdpdmUgeW91IGEgbm9uLXVuaWZvcm0gZGlzdHJpYnV0aW9uIVxyXG5cdHN0YXRpYyByYW5kSW50KG1pbiwgbWF4KSB7XHJcblx0XHRtaW4gPSBNYXRoLmNlaWwobWlufHwwKTtcclxuXHRcdG1heCA9IE1hdGguZmxvb3IobWF4fHwxKTtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gMCBhbmQgLjk5OTk5OVxyXG5cdHN0YXRpYyByYW5kRmxvYXQoKSB7XHJcblx0ICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIHJhbmRQZXJjZW50KHRocmVzaG9sZCkge1xyXG5cdFx0cmV0dXJuIFJhbmQucmFuZEludCgxLDEwMCkgPCB0aHJlc2hvbGQ7XHJcblx0fVxyXG5cclxuXHQvLyByYW5kb20gaW50ZWdlciB3aXRoaW4gbWF4RGlzdGFuY2Ugb2YgdGFyZ2V0IChkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIHRhcmdldClcclxuXHRzdGF0aWMgcmFuZENsb3NlVG8odGFyZ2V0LCBtYXhEaXN0YW5jZSkge1xyXG5cdFx0Ly8gcmV0dXJuIHRhcmdldCArIChtYXhEaXN0YW5jZSAqIHJhbmROb3JtYWwoKSk7ICAgIC8vIGNvbmNlbnRyYXRlZCB0b3dhcmRzIGNlbnRlciA1MCUgb2YgcmFuZ2VcclxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kU2luMigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHNvbWV3aGF0IGNvbmNlbnRyYXRlZCB0b3dhcmRzIGNlbnRlciBcclxuXHRcdHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiBSYW5kLnJhbmRQb3cyKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgd2l0aCBzaGFycCBjb25jZW50cmF0aW9uIGFyb3VuZCBjZW50ZXJcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdygpIHtcclxuXHRcdHJldHVybiBNYXRoLnBvdygxLjAgLSBSYW5kLnJhbmRGbG9hdCgpLCA0KTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIHRvd2FyZCAxXHJcblx0c3RhdGljIHJhbmRTaW4oKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5zaW4oUmFuZC5yYW5kRmxvYXQoKSAqIEhBTEZQSSk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgZXhwb25lbnRpYWxseSBjbG9zZXIgdG8gMFxyXG5cdHN0YXRpYyByYW5kUG93MigpIHtcclxuXHRcdHJldHVybiBSYW5kLnJhbmRQb3coKSAtIFJhbmQucmFuZFBvdygpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgMFxyXG5cdHN0YXRpYyByYW5kTm9ybWFsKCkge1xyXG5cdFx0cmV0dXJuICgoUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpKSAtIDMuMCkgLyAzLjA7XHJcblx0fVxyXG5cclxuICAgIC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBjbG9zZXIgdG8gMFxyXG4gICAgc3RhdGljIHJhbmRTaW4yKCkge1xyXG4gICAgICAgIHJldHVybiBSYW5kLnJhbmRTaW4oKSAtIFJhbmQucmFuZFNpbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybiBhcnJheSBvZiAzIGludHMsIGVhY2ggMC0yNTVcclxuICAgIHN0YXRpYyByYW5kUkdCKCkge1xyXG4gICAgICAgIHJldHVybiBbUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KV07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJhbmRSR0JzdHIoKSB7XHJcblx0XHR2YXIgcmdiID0gUmFuZC5yYW5kUkdCKCk7XHJcbiAgICAgICAgcmV0dXJuICdyZ2JhKCcgK3JnYlswXSsgJywnICtyZ2JbMV0rICcsJyArcmdiWzJdKyAnLCAuOSknO1xyXG4gICAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFJhbmQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSYW5kO1xyXG4iLCJ2YXIgZWxlbWVudENvdW50ZXIgPSAwO1xyXG5cclxuY2xhc3MgVGhpbmcge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnVGhpbmcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZSAocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICAvLyBDU1MgcHJvcHMgZ28gaW50byB0aGlzLnByb3BzXHJcbiAgICB0aGlzLnByb3BzID0gVGhpbmcuY2xlYW51cChwcm9wcyk7XHJcbiAgICAvLyBrZWVwIHRoZXNlIHByb3BlcnRpZXMgb24gJ3RoaXMnXHJcbiAgICB0aGlzLnJvdGF0aW9uID0gcHJvcHMucm90YXRlIHx8IDA7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gcHJvcHMuc2NhbGUgfHwgMTtcclxuICAgIHRoaXMueCA9IHByb3BzLnggfHwgMDtcclxuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgMDtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgcGFyZW50RWxlbWVudC5hcHBlbmQodGhpcy4kZWxlbWVudCk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh0aGlzLnByb3BzKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIGVsZW1lbnQgZnJvbSBkb20gYW5kIG51bGwgaXQgb3V0XHJcbiAgdW5SZW5kZXIgKCkge1xyXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQpIHtcclxuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgdGhpcy4kZWxlbWVudCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXREaW1lbnNpb25zICgpIHtcclxuICAgIHJldHVybiB7dzogdGhpcy4kZWxlbWVudC53aWR0aCgpLCBoOiB0aGlzLiRlbGVtZW50LmhlaWdodCgpfTtcclxuICB9XHJcblxyXG4gIGdldEJvdW5kaW5nQm94ICgpIHtcclxuICAgIC8vIHJlbGF0aXZlIHRvIHBhZ2VcclxuICAgIHZhciBzY3JvbGx0b3AgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcclxuICAgIHZhciBzY3JvbGxsZWZ0ID0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpO1xyXG4gICAgdmFyIGJvdW5kcyA9IHRoaXMuJGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiBib3VuZHMubGVmdCtzY3JvbGxsZWZ0LFxyXG4gICAgICB5OiBib3VuZHMudG9wK3Njcm9sbHRvcCxcclxuICAgICAgdzogYm91bmRzLndpZHRoLFxyXG4gICAgICBoOiBib3VuZHMuaGVpZ2h0LFxyXG4gICAgICBib3R0b206IGJvdW5kcy5ib3R0b20rc2Nyb2xsdG9wLFxyXG4gICAgICByaWdodDogYm91bmRzLnJpZ2h0K3Njcm9sbGxlZnRcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByb3RhdGUgKGRlZ3JlZXMpIHtcclxuICAgIHRoaXMucm90YXRpb24gKz0gZGVncmVlcztcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHJvdGF0ZVRvIChhbmdsZSkge1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IGFuZ2xlO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGUgKGZhY3Rvcikge1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciArPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzY2FsZVRvIChmYWN0b3IpIHtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGUgKHgsIHkpIHtcclxuICAgIHRoaXMueCArPSB4O1xyXG4gICAgdGhpcy55ICs9IHk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGVUbyAoeCwgeSkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2Zvcm0gKCkge1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICB0cmFuc2Zvcm06IFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1ModGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZUZhY3RvciwgdGhpcy54LCB0aGlzLnkpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgY3NzIChwcm9wcykge1xyXG4gICAgdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHRoaXMucHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHByb3BzKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgaHRtbCAoKSB7XHJcbiAgICByZXR1cm4gJzxkaXY+PC9kaXY+JztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZSAoKSB7XHJcbiAgICAvLyBjbHMgd2lsbCBiZSB0aGUgY2xhc3MgdGhhdCBtYWtlKCkgd2FzIGNhbGxlZCBvbiAoaWYgQm94Lm1ha2UoKSB3YXMgY2FsbGVkLCBjbHMgd2lsbCBiZSBCb3gpXHJcbiAgICB2YXIgY2xzID0gdGhpcztcclxuXHJcbiAgICAvLyBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzXHJcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcblxyXG4gICAgLy8gSW5pdCB0aGUgaW5zdGFuY2VcclxuICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgLy8gYmluZCBtZW1iZXIgZnVuY3Rpb25zIHRvIHRoZSBpbnN0YW5jZVxyXG4gICAgLy8gaW5zdGFuY2UuX19wcm90b19fXHJcbiAgICAvLyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPYmplY3QuZ2V0UHJvdG90eXBlT2YoT2JqZWN0LmdldFByb3RvdHlwZU9mKGluc3RhbmNlKSkpICAvLyBzdXBlcmNsYXNzIG1lbWJlcnNcclxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE9iamVjdC5nZXRQcm90b3R5cGVPZihpbnN0YW5jZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlW2tleV0gPT09ICdmdW5jdGlvbicgJiYga2V5ICE9PSAnY29uc3RydWN0b3InICYmIGtleSAhPT0gJ2luaXQnKSB7XHJcbiAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGluc3RhbmNlW2tleV0uYmluZChpbnN0YW5jZSk7XHJcbiAgICAgICAgd2luZG93LmNvbnNvbGUubG9nKCdCT1VORCcsIGluc3RhbmNlLmNvbnN0cnVjdG9yLm5hbWUsIGtleSk7ICAgICAgICBcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENsYXNzIChjbHMpIHtcclxuICAgIFRoaW5nLmNsYXNzZXMgPSBUaGluZy5jbGFzc2VzIHx8IHt9O1xyXG4gICAgVGhpbmcuY2xhc3Nlc1tjbHMubmFtZV0gPSBjbHM7XHJcblxyXG4gICAgLy8gbG9hZCB0aGUgY2xhc3Mgc3R5bGVzICh0aGVzZSBhcmUgaW5jbHVkZWQgaW4gdGhlIGJ1bmRsZSBhdCBidWlsZCB0aW1lKVxyXG4gICAgY2xzLmNzcyAmJiBUaGluZy5hZGRDU1NTdHJpbmcoY2xzLmNzcygpLCBjbHMubmFtZSk7XHJcblxyXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgY3NzIGZpbGUgYXQgbG9hZCB0aW1lXHJcbiAgICBUaGluZy5hZGRDU1NGaWxlKGNscy5uYW1lICsgJy8nICsgY2xzLm5hbWUgKyAnLmNzcycsICdjc3MnK2Nscy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRDbGFzcyAobmFtZSkge1xyXG4gICAgcmV0dXJuIFRoaW5nLmNsYXNzZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xyXG5cclxuICBzdGF0aWMgbWFrZVN0eWxlcyAocHJvcHMpIHtcclxuICAgIHZhciBzdHlsZXMgPSBwcm9wcyB8fCB7fTtcclxuICAgICQuZXh0ZW5kKHN0eWxlcywge1xyXG4gICAgICAvLyBsZWZ0OiBwcm9wcy5sZWZ0IHx8IChwcm9wcy54ICYmIChwcm9wcy54ICsgXCJweFwiKSksXHJcbiAgICAgIC8vIHRvcDogcHJvcHMudG9wIHx8IChwcm9wcy55ICYmIChwcm9wcy55ICsgXCJweFwiKSksXHJcbiAgICAgIHdpZHRoOiBwcm9wcy53aWR0aCB8fCAocHJvcHMudyAmJiAocHJvcHMudyArIFwicHhcIikpLFxyXG4gICAgICBoZWlnaHQ6IHByb3BzLmhlaWdodCB8fCAocHJvcHMuaCAmJiAocHJvcHMuaCArIFwicHhcIikpLFxyXG4gICAgICB6SW5kZXg6IHByb3BzLnpJbmRleCB8fCBwcm9wcy56LFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHByb3BzLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgdHJhbnNmb3JtOiBwcm9wcy50cmFuc2Zvcm0gfHwgKFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1MocHJvcHMucm90YXRlLCBwcm9wcy5zY2FsZSwgcHJvcHMueCwgcHJvcHMueSkpLFxyXG4gICAgICBwb3NpdGlvbjogcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJ1xyXG4gICAgfSk7XHJcbiAgICBkZWxldGUgc3R5bGVzLnJvdGF0ZTtcclxuICAgIGRlbGV0ZSBzdHlsZXMuc2NhbGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLng7XHJcbiAgICBkZWxldGUgc3R5bGVzLnk7XHJcbiAgICBkZWxldGUgc3R5bGVzLno7XHJcbiAgICBkZWxldGUgc3R5bGVzLnc7XHJcbiAgICBkZWxldGUgc3R5bGVzLmg7XHJcbiAgICByZXR1cm4gc3R5bGVzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VUcmFuc2Zvcm1DU1MgKHJvdGF0ZSwgc2NhbGUsIHR4LCB0eSkge1xyXG4gICAgdmFyIHRyYW5zZm9ybSA9ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9ICh0eCB8fCB0eSkgPyAoVGhpbmcubWFrZVRyYW5zbGF0ZUNTUyh0eCwgdHkpICsgJyAnKSA6ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9IFRoaW5nLmlzTnVtZXJpYyhyb3RhdGUpID8gKFRoaW5nLm1ha2VBbmdsZUNTUyhyb3RhdGUpICsgJyAnKSA6ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9IHNjYWxlID8gKFRoaW5nLm1ha2VTY2FsZUNTUyhzY2FsZSkgKyAnICcpIDogJyc7XHJcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VBbmdsZUNTUyAoYW5nbGUpIHtcclxuICAgIHJldHVybiAncm90YXRlKCcrYW5nbGUrJ2RlZyknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VTY2FsZUNTUyAoc2NhbGUpIHtcclxuICAgIHJldHVybiAnc2NhbGUoJytzY2FsZSsnKSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVRyYW5zbGF0ZUNTUyAoeCwgeSkge1xyXG4gICAgeCA9IHggfHwgJzAnO1xyXG4gICAgeSA9IHkgfHwgJzAnO1xyXG4gICAgcmV0dXJuICd0cmFuc2xhdGUoJysgeCArICdweCwgJyArIHkgKydweCknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VFbGVtZW50IChodG1sLCBwcm9wcywgdHlwZSkge1xyXG4gICAgdmFyICRlbGVtZW50ID0gJChodG1sKVxyXG4gICAgICAuY3NzKFRoaW5nLm1ha2VTdHlsZXMocHJvcHMpKVxyXG4gICAgICAuYWRkQ2xhc3ModHlwZSB8fCAncmFuZG9tJylcclxuICAgICAgLmF0dHIoJ2lkJywgKHR5cGUgfHwgJ3JhbmRvbScpICsgKCsrZWxlbWVudENvdW50ZXIpKTtcclxuICAgIHJldHVybiAkZWxlbWVudDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpc051bWVyaWMobikge1xyXG4gICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxuICB9XHJcblxyXG4gIC8vIE1ha2Ugc3VyZSBuZWNlc3NhcnkgQ1NTIHByb3BlcnRpZXMgYXJlIHByZXNlbnQgb3IgZGVmYXVsdGVkIHRvIHNvbWV0aGluZyBzYW5lXHJcbiAgc3RhdGljIGNsZWFudXAgKHByb3BzKSB7XHJcbiAgICB2YXIgY3AgPSBwcm9wcyB8fCB7fTtcclxuICAgIGNwLnBvc2l0aW9uID0gcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJzsgICAvLyBkZWZhdWx0IHRvIGFic29sdXRlIHBvc2l0aW9uaW5nXHJcbiAgICAvLyBjcC54ID0gcHJvcHMueCB8fCBwcm9wcy5sZWZ0IHx8IDA7XHJcbiAgICAvLyBjcC55ID0gcHJvcHMueSB8fCBwcm9wcy50b3AgfHwgMDtcclxuICAgIC8vIGNwLnogPSBwcm9wcy56IHx8IHByb3BzLnpJbmRleDtcclxuICAgIC8vIGNwLncgPSBwcm9wcy53IHx8IHByb3BzLndpZHRoO1xyXG4gICAgLy8gY3AuaCA9IHByb3BzLmggfHwgcHJvcHMuaGVpZ2h0O1xyXG4gICAgY3Aucm90YXRpb24gPSBwcm9wcy5yb3RhdGlvbiB8fCAwO1xyXG4gICAgY3Auc2NhbGUgPSBwcm9wcy5zY2FsZSB8fCAxO1xyXG4gICAgcmV0dXJuIGNwO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENTU0ZpbGUoZmlsZU5hbWUsIGlkKSB7XHJcbiAgICAgdmFyIGxpbmsgPSAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCInICsgZmlsZU5hbWUgKyAnXCIgaWQ9XCInICsgaWQgKyAnXCI+JztcclxuICAgICAkKCdoZWFkJykuZmluZCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICAgJCgnaGVhZCcpLmFwcGVuZChsaW5rKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZCkge1xyXG4gICAgaWYgKGNzc1N0cmluZykge1xyXG4gICAgICAvLyB2YXIgZG9jID0gd2luZG93LmRvY3VtZW50O1xyXG4gICAgICB2YXIgc3R5bGVFbCA9ICQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICtjc3NTdHJpbmcrICc8L3N0eWxlPicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgKGlkIHx8ICdUaGluZycpICsgJy1zdHlsZXMnKTtcclxuICAgICAgJCgnaGVhZCcpLmFwcGVuZChzdHlsZUVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRoaW5nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGhpbmc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcblxyXG5jbGFzcyBUaW1lciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdvICgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xyXG5cdFx0dGhpcy50aW1lcklEID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLmRlbGF5KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRpbWVyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcclxucmVxdWlyZSgnLi9Cb3gvQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQXJyb3cvQXJyb3cuanMnKTtcclxucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGltZXIvVGltZXIuanMnKTtcclxucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcclxucmVxdWlyZSgnLi9QdWxzYXIvUHVsc2FyLmpzJyk7XHJcbnJlcXVpcmUoJy4vRG8vRG8uanMnKTtcclxucmVxdWlyZSgnLi9FeHRlcm5hbC9FeHRlcm5hbC5qcycpO1xyXG5yZXF1aXJlKCcuL0xhYmVsL0xhYmVsLmpzJyk7XHJcbnJlcXVpcmUoJy4vTGluZS9MaW5lLmpzJyk7XHJcbnJlcXVpcmUoJy4vSW1nL0ltZy5qcycpO1xyXG5yZXF1aXJlKCcuL1BhdHRlcm4vUGF0dGVybi5qcycpO1xyXG5yZXF1aXJlKCcuL0JHSW1nL0JHSW1nLmpzJyk7XHJcblxyXG53aW5kb3cuVGhpbmcgPSBUaGluZztcclxuIl19
