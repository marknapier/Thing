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

},{"../Thing/Thing.js":17}],2:[function(require,module,exports){
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

},{"../Thing/Thing.js":17,"./Arrow.css":2}],4:[function(require,module,exports){
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

},{"../Thing/Thing.js":17}],5:[function(require,module,exports){
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

},{"../Thing/Thing.js":17}],6:[function(require,module,exports){
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

},{"../Box/Box.js":5,"../Thing/Thing.js":17,"./DemoBox.css":6}],8:[function(require,module,exports){
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

},{"../Thing/Thing.js":17}],9:[function(require,module,exports){
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

},{"../Thing/Thing.js":17}],10:[function(require,module,exports){
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
	}

	render () {
		super.render();
	}
}
Thing.addClass(Label);

module.exports = Label;

},{"../Thing/Thing.js":17}],11:[function(require,module,exports){
module.exports = "\r\n.Line {\r\n  /* For some nice animation on the rotates: */\r\n  -webkit-transition: -webkit-transform .2s;\r\n     -moz-transition:    -moz-transform .2s;\r\n          transition:         transform .2s;\r\n}\r\n\r\n";

},{}],12:[function(require,module,exports){
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

},{"../Thing/Thing.js":17,"./Line.css":11}],13:[function(require,module,exports){
module.exports = ".Pattern.GraphPaper {\r\n  background-color: #003;\r\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\r\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\r\n  background-image: \r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\r\n}\r\n\r\n.Pattern.Grid {\r\n  background-size: 100px 100px, 100px 100px;\r\n  background-position: -2px -2px, -2px -2px;\r\n  background-image: \r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\r\n}\r\n\r\n.Pattern.Sofa {\r\n  background:\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.PolkaDots {\r\n  background-image: \r\n    radial-gradient(white 15%, transparent 16%),\r\n    radial-gradient(white 15%, transparent 16%);\r\n  background-size: 60px 60px;\r\n  background-position: 0 0, 30px 30px;\r\n}\r\n\r\n.Pattern.BlueBalls {\r\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Stripes {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.PlaidRed {\r\n  background-color: hsl(2, 57%, 40%);\r\n  background-image: \r\n    repeating-linear-gradient(transparent, transparent 50px, rgba(0,0,0,.4) 50px, rgba(0,0,0,.4) 53px, transparent 53px, transparent 63px, rgba(0,0,0,.4) 63px, rgba(0,0,0,.4) 66px, transparent 66px, transparent 116px, rgba(0,0,0,.5) 116px, rgba(0,0,0,.5) 166px, rgba(255,255,255,.2) 166px, rgba(255,255,255,.2) 169px, rgba(0,0,0,.5) 169px, rgba(0,0,0,.5) 179px, rgba(255,255,255,.2) 179px, rgba(255,255,255,.2) 182px, rgba(0,0,0,.5) 182px, rgba(0,0,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(270deg, transparent, transparent 50px, rgba(0,0,0,.4) 50px, rgba(0,0,0,.4) 53px, transparent 53px, transparent 63px, rgba(0,0,0,.4) 63px, rgba(0,0,0,.4) 66px, transparent 66px, transparent 116px, rgba(0,0,0,.5) 116px, rgba(0,0,0,.5) 166px, rgba(255,255,255,.2) 166px, rgba(255,255,255,.2) 169px, rgba(0,0,0,.5) 169px, rgba(0,0,0,.5) 179px, rgba(255,255,255,.2) 179px, rgba(255,255,255,.2) 182px, rgba(0,0,0,.5) 182px, rgba(0,0,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(125deg, transparent, transparent 2px, rgba(0,0,0,.2) 2px, rgba(0,0,0,.2) 3px, transparent 3px, transparent 5px, rgba(0,0,0,.2) 5px);\r\n}\r\n\r\n.Pattern.DiagonalStripes {\r\n  background-image: linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent);\r\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\r\n        /* ie. 32% 16% for an element with w=100 h=200 */\r\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\r\n}\r\n";

},{}],14:[function(require,module,exports){
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

},{"../Thing/Thing.js":17,"./Pattern.css":13}],15:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":17,"../Timer/Timer.js":18}],16:[function(require,module,exports){
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

},{"../Thing/Thing.js":17}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":17}],19:[function(require,module,exports){
var Thing = require('./Thing/Thing.js');
require('./Box/Box.js');
require('./Arrow/Arrow.js');
require('./DemoBox/DemoBox.js');
require('./Action/Action.js');
require('./Timer/Timer.js');
require('./Rand/Rand.js');
require('./Pulsar/Pulsar.js');
require('./Do/Do.js');
require('./Label/Label.js');
require('./Line/Line.js');
require('./Img/Img.js');
require('./Pattern/Pattern.js');
require('./BGImg/BGImg.js');

window.Thing = Thing;

},{"./Action/Action.js":1,"./Arrow/Arrow.js":3,"./BGImg/BGImg.js":4,"./Box/Box.js":5,"./DemoBox/DemoBox.js":7,"./Do/Do.js":8,"./Img/Img.js":9,"./Label/Label.js":10,"./Line/Line.js":12,"./Pattern/Pattern.js":14,"./Pulsar/Pulsar.js":15,"./Rand/Rand.js":16,"./Thing/Thing.js":17,"./Timer/Timer.js":18}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEFjdGlvbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0fVxyXG5cclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dGhpcy5wcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5nbygpJyk7XHJcblx0fVxyXG5cclxuXHRzdG9wICgpIHtcclxuXHRcdHdpbmRvdy5jb25zb2xlLmxvZygnQWN0aW9uLnN0b3AoKScpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1ha2UgKCkge1xyXG5cdCAgdmFyIGNscyA9IHRoaXM7XHJcblx0ICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcblx0ICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG5cdCAgcmV0dXJuIGluc3RhbmNlO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhBY3Rpb24pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIvKiByZXF1aXJlZCBmb3IgYXJyb3cgKi9cXHJcXG4uYXJyb3ctaGVhZCB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgd2lkdGg6IDA7IFxcclxcbiAgaGVpZ2h0OiAwOyBcXHJcXG4gIGJvcmRlci10b3A6IDMwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItYm90dG9tOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDMwcHggc29saWQgZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy1ib2R5IHtcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcXHJcXG4gIHdpZHRoOiA0MHB4O1xcclxcbiAgaGVpZ2h0OiAyMHB4O1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbiAgbWFyZ2luLXRvcDogMjBweDtcXHJcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxyXFxuICBib3JkZXItbGVmdDogMDtcXHJcXG4gIGJvcmRlci1yaWdodDogMDtcXHJcXG59XFxyXFxuXFxyXFxuLmFycm93LXdyYXBwZXIge1xcclxcbiAgd2lkdGg6IDcwcHg7ICAgLyogYXJyb3ctYm9keSB3aWR0aCArIGFycm93LWhlYWQgYm9yZGVyIHdpZHRoICovXFxyXFxufVxcclxcblxcclxcbi5BcnJvdyB7XFxyXFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXHJcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXHJcXG59XFxyXFxuXFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQXJyb3cgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnQXJyb3cnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLnNldENvbG9yKHRoaXMucHJvcHMuY29sb3IpOyAgLy8gaGF2ZSB0byBtYWtlIGFycm93IGJlZm9yZSBjYWxsaW5nIHRoaXNcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c2V0Q29sb3IgKGMpIHtcclxuXHRcdHRoaXMuJGVsZW1lbnQuZmluZCgnLmFycm93LWhlYWQnKS5jc3Moe2JvcmRlckxlZnRDb2xvcjpjfSk7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1ib2R5JykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6Y30pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRodG1sICgpIHtcclxuXHRcdHJldHVybiBcIjxkaXY+PGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+PC9kaXY+XCI7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3JlYXRlQXJyb3dFbGVtZW50ICgpIHtcclxuXHRcdHZhciAkYXJyb3cgPSAkKFwiPGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+XCIpO1xyXG5cdFx0cmV0dXJuICRhcnJvdztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEFycm93KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBCR0ltZyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgdXJsOiAnJyxcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICBsZWZ0OiAnMHB4JyxcclxuICAgICAgdG9wOiAnMHB4J1xyXG4gICAgfTtcclxuICAgIHByb3BzID0gdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnQkdJbWcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kOiAndXJsKFwiJyArIHByb3BzLnVybCArICdcIikgbm8tcmVwZWF0IGNlbnRlcicsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiAnY292ZXInICAvLzEwMCUgMTAwJSdcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCR0ltZyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJHSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQm94IGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgXHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gIFx0dGhpcy50eXBlID0gJ0JveCc7XHJcbiAgXHR0aGlzLml0ZW1zID0gW107XHJcbiAgXHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgfVxyXG5cclxuICBhZGQgKGFkZEl0ZW1zKSB7XHJcbiAgXHRpZiAoYWRkSXRlbXMpIHtcclxuICAgICAgaWYgKCEoYWRkSXRlbXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgICBhZGRJdGVtcyA9IFthZGRJdGVtc107XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgaT0wOyBpIDwgYWRkSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLml0ZW1zLnB1c2goYWRkSXRlbXNbaV0pO1xyXG4gICAgICAgIGFkZEl0ZW1zW2ldLnBhcmVudCA9IHRoaXM7ICAgICAgICBcclxuICAgICAgfVxyXG4gIFx0fVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgaXRlbSBmcm9tIHRoaXMgYm94IChmcm9tIHRoZSBkb20gYW5kIHRoZSBpdGVtcyBsaXN0KVxyXG4gIHJlbW92ZSAoaXRlbSkge1xyXG4gIFx0aWYgKGl0ZW0pIHtcclxuICBcdFx0dmFyIGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xyXG4gIFx0XHRpZiAoaW5kZXggPiAtMSkge1xyXG4gIFx0XHQgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIFx0XHRcdGl0ZW0uJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgXHRcdFx0aXRlbS5wYXJlbnQgPSBudWxsO1xyXG4gIFx0XHR9XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIG51bUVsZW1lbnRzICgpIHtcclxuICBcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnRCb3VuZHMgKCkge1xyXG4gICAgdmFyIGJvdW5kcyA9IHt4Ojk5OTk5OSwgeTo5OTk5OTksIGJvdHRvbTowLCByaWdodDowfTtcclxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA8IDEpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvcyA9IHRoaXMuaXRlbXNbaV0uZ2V0Qm91bmRpbmdCb3goKTtcclxuICAgICAgYm91bmRzLnggPSAocG9zLnggPCBib3VuZHMueCkgPyBwb3MueCA6IGJvdW5kcy54O1xyXG4gICAgICBib3VuZHMueSA9IChwb3MueSA8IGJvdW5kcy55KSA/IHBvcy55IDogYm91bmRzLnk7XHJcbiAgICAgIGJvdW5kcy5ib3R0b20gPSAocG9zLmJvdHRvbSA+IGJvdW5kcy5ib3R0b20pID8gcG9zLmJvdHRvbSA6IGJvdW5kcy5ib3R0b207XHJcbiAgICAgIGJvdW5kcy5yaWdodCA9IChwb3MucmlnaHQgPiBib3VuZHMucmlnaHQpID8gcG9zLnJpZ2h0IDogYm91bmRzLnJpZ2h0O1xyXG4gICAgfVxyXG4gICAgYm91bmRzLncgPSBib3VuZHMucmlnaHQgLSBib3VuZHMueDtcclxuICAgIGJvdW5kcy5oID0gYm91bmRzLmJvdHRvbSAtIGJvdW5kcy55O1xyXG4gICAgcmV0dXJuIGJvdW5kcztcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgXHRzdXBlci5yZW5kZXIoKTtcclxuICBcdGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICBcdFx0dGhpcy5pdGVtc1tpXS5yZW5kZXIoKTtcclxuICBcdH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCb3gpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb3g7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXHJcXG4uRGVtb0JveCB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICBtYXJnaW46IDIwcHg7XFxyXFxuICB3aWR0aDogMjAwcHg7IFxcclxcbiAgaGVpZ2h0OiAyMDBweDsgXFxyXFxuICBib3JkZXI6IDJweCBkYXNoZWQgI2VlZTtcXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xyXG5cclxuY2xhc3MgRGVtb0JveCBleHRlbmRzIEJveCB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHRzdXBlci5pbml0KHByb3BzKTtcclxuXHRcdHByb3BzLndpZHRoID0gcHJvcHMud2lkdGggfHwgMjAwO1xyXG5cdFx0cHJvcHMuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0IHx8IDIwMDtcclxuXHRcdHByb3BzLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRcdHRoaXMudHlwZSA9ICdEZW1vQm94JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNzcyAoKSB7XHJcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9EZW1vQm94LmNzcycpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhEZW1vQm94KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVtb0JveDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbi8vIExpa2UgVW5peCBwaXBlOiBvdXRwdXQgb2Ygb25lIGNvbW1hbmQgaXMgaW5wdXQgdG8gdGhlIG5leHRcclxuLy8gRWFjaCBmdW5jdGlvbiB0YWtlcyBhICdwcm9wcycgb2JqZWN0IGFzIGFyZ3VtZW50XHJcbi8vIEVhY2ggZnVuY3Rpb24gcmV0dXJucyBhbiBvYmplY3Qgd2l0aCByZXN1bHRzLCB3aGljaCBpcyBwYXNzZWQgYXMgcHJvcHMgdG8gdGhlIG5leHRcclxuLy8gRG8oKSByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgdGhlIERvIGNoYWluXHJcblxyXG4vLyBQLnB1bHNlLnNldFRvKFxyXG4vLyAgICAgRG8oUi5nZXRSYW5kb21OdW1iZXIsIHtmcm9tOjAsIHRvOjEwfSkgICAvLyByZXR1cm5zOiAge2RhdGE6IDh9XHJcbi8vICAgICAuRG8oQy5waWNrQ29sb3IpICAgIC8vIHJlYWRzIGlucHV0IDgsIHJldHVybnMge2RhdGE6ICcjY2ZmJ31cclxuLy8gICAgIC5EbyhCLmNoYW5nZUNvbG9yKSAgIC8vIHJlYWRzIGlucHV0ICcjY2ZmJywgY2hhbmdlcyBjb2xvciBvbiBCbGlua2VyXHJcbi8vICk7XHJcblxyXG5cclxuZnVuY3Rpb24gRG8oX2FGdW5jdGlvbiwgX3Byb3BzLCBfZmlyc3REbykge1xyXG4gICAgdmFyIGFGdW5jdGlvbiA9IF9hRnVuY3Rpb247XHJcbiAgICB2YXIgcHJvcHMgPSBfcHJvcHM7XHJcbiAgICB2YXIgZmlyc3REbyA9IF9maXJzdERvIHx8IGV4ZWN1dG9yO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdhZnVuY3Rpb249JywgYUZ1bmN0aW9uKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdwcm9wcz0nLCBwcm9wcyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZmlyc3REbz0nLCBmaXJzdERvKTtcclxuXHJcbiAgICAvLyBSdW4gdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cy5cclxuICAgIC8vIFBhc3MgdGhlIHJlc3VsdHMgdG8gdGhlIG5leHQgY2hhaW5lZCBmdW5jdGlvbiAoaWYgYW55KS5cclxuICAgIC8vIFJldHVybiByZXN1bHRzIG9mIHRoaXMgZnVuY3Rpb24gb3Igb2YgdGhlIGNoYWluXHJcbiAgICBmdW5jdGlvbiBleGVjdXRvciAocGlwZWRQcm9wcykge1xyXG4gICAgICAgIHZhciByZXR1cm5WYWwgPSBhRnVuY3Rpb24ocHJvcHMgfHwgcGlwZWRQcm9wcyk7XHJcbiAgICAgICAgcmV0dXJuIChleGVjdXRvci5uZXh0RG8gPyBleGVjdXRvci5uZXh0RG8ocmV0dXJuVmFsKSA6IHJldHVyblZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV0dXJuIHRoZSBsYXN0ICdEbycgaW4gdGhlIGNoYWluXHJcbiAgICBmdW5jdGlvbiBnZXRMYXN0RG8gKCkge1xyXG4gICAgICAgIHZhciB0bXBEbyA9IGZpcnN0RG87XHJcbiAgICAgICAgd2hpbGUgKHRtcERvLm5leHREbykgeyB0bXBEbyA9IHRtcERvLm5leHREbzsgfVxyXG4gICAgICAgIHJldHVybiB0bXBEbztcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgYSBuZXcgJ0RvJyB0byB0aGUgZW5kIG9mIHRoZSBjaGFpbi5cclxuICAgIGV4ZWN1dG9yLkRvID0gZnVuY3Rpb24gKGFGdW5jdGlvbiwgcHJvcHMpIHtcclxuICAgICAgICBnZXRMYXN0RG8oKS5uZXh0RG8gPSBEbyhhRnVuY3Rpb24sIHByb3BzLCBmaXJzdERvKTtcclxuICAgICAgICByZXR1cm4gZmlyc3REbzsgIC8vIEFsd2F5cyByZXR1cm4gdGhlIGZpcnN0ICdEbycgaW4gdGhlIGNoYWluXHJcbiAgICB9O1xyXG5cclxuICAgIGV4ZWN1dG9yLm5leHREbyA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIGV4ZWN1dG9yO1xyXG59XHJcblxyXG5UaGluZy5EbyA9IERvO1xyXG5cclxuLypcclxuLy8gY2hhaW5lZCwgZWFjaCBEbyBoYXMgaXRzIG93biBwYXJhbWV0ZXJzXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTt9LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCB7YXJnMjonaGVsbG8gdG8gMjIyMjInfSlcclxuXHJcbi8vIGNoYWluZWQsIHdpdGggZmlyc3QgRG8gcGlwaW5nIHJlc3VsdHMgdG8gc2Vjb25kIERvXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCBudWxsKVxyXG5cclxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpOyByZXR1cm4ge25ld1Byb3A6cHJvcHMucGlwZWRwcm9wKzJ9fSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAzJywgcHJvcHMpO30pXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERvO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLypcclxuICAgIHNyYzogPGZpbGUgcGF0aD5cclxuICAgIGNlbnRlcjogdHJ1ZXxmYWxzZVxyXG4gICAgc2l6ZTogY29udGFpbnxjb3ZlcnxzdHJldGNoXHJcbiovXHJcblxyXG5jbGFzcyBJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBwbGFjZWhvbGRlciA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBRElDQVlBQUFDdFdLNmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQlY5SlJFRlVlSnp0M2MxdTNVUWNoK0YvRUJLOUFzUUNWV2ZWUXE0Q2JoeHVBNEVxc1NtaCs3SXVpOVFDUXZJN1l4K1BQNTlIOGk2eVpvN216ZmdrbG4xWFZaOEtlTllYYXc4QXRrd2dFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnZURMRVQ5NzEyMFVzTHltTzBqc0lCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlNKzdWTlYzYXc5aVFmZFY5WHJ0UVd6VnA4YmpMQzVWOVh0VlBkUTVJcm12cWc5VjlhN09GVW56dWhmSVB5NzFHTWN3NTZOSE1zUXh6UGRNa1Foa3BFdjlONDZqUi9JMGpyTkZJcEFSTHZWOEhFZU41S1U0emhTSlFCcGRLc2R4dEVpdXhYR1dTQVRTNEZKdGNSd2xrdFk0emhDSlFLNjQxTGc0L2gzSjk0dVA5blpqNHpoNkpBSUpMalV0anIxR01qV09JMGNpa0JkYzZyWTQ5aGJKclhFY05SS0JQT05TODhTeGwwam1pdU9Ja1RUTitXeTNtcnlxcXE5bVBOODNWZlZUYlRPUys2cjZ1YXErbnZHY3J6NGZwM0ttSGFUcWNURS8xSHkvVmJlNGs4eTljM3lxcXZkVjlXYkpTWFRtRWlzNGNpVGlhQ09RSzQ0WWlUamFDYVJCajBqK3JIVWlFY2M0QW1sMGhFakVNWjVBUnRoekpPS1lSaUFqZlYrUGkzcFBrWWhqT29GTXNLZEllc1R4UjUwamppcUJUTGFIU01SeE80SGNZTXVSaUdNZUFybFJyMGp1YnhpVE9PWWprQmxzS1JKeHpFc2dNOWxDSk9LWW4wQm10R1lrNHVoRElETmJJeEp4OUNPUUR1NXJ1VWg2eGZGMmxrOWkvd1RTeVJLUmlLTS9nWFRVTXhKeExFTWduZldJNUVPSll5a0NXVUNQU01TeERJRXNaS3VSaUNNVHlJSjZmRzhRUjE4Q1dkaFdJbmtvY2JRUXlBcldqa1FjN1FTeWtyVWlFY2M0QWxuUjBwR0lZenlCckd5cFNNUXhqVUEyb0hjazRwaE9JQnZSS3hKeDNLYnBjejdiMDkyUDVtN3RBWnlCSGFTZkpTNng5dnpPeERXNXhGclprbC9TUlRLZVFGYTB4cDk1UlRLT1FGYXk1ajhLUmRKT0lDdll3cTBtSW1ramtJV3RIWWRJeGhISWdyWVNoMGphQ1dRaFc0dERKRzBFc29DdHhpR1M2d1RTV1k4NEhxclBpMFZGOG44QzZhaFhIRy9yY1RHTHBEK0JkTkl6am9GSStoTklCMHZFTVJCSlh3S1oyWkp4REVUU2owQm10RVljQTVIMElaQ1pyQm5IUUNUekU4Z010aERIUUNUekVzaU50dmlVZFpITVJ5QTMyR0ljQTVITVF5QVRiVG1PZ1VodUo1QUo5aERIUUNTM0VjaEllNHBqSUpMcEJETENIdU1ZaUdRYWdUVGFjeHdEa1l3bmtBWkhpR01na25FRWNrV3ZPTjRzT1lrblJOSk9JTUVSNHhpSXBJMUFYbkRrT0FZaXVVNGd6emhESElOZWtSemxpZkpOY3o3YjA5MC9majdtOGxCVlAxVFZyek9lY3k2L1ZOV1A5ZmlLNnJsOHJLcS9aanpmTHB4cEI2bXFlbDFWNytxNE84ZFRjKzBrdjFYVnR3dVB2U2VYV01HdGtld2xqc0d0a1J3dGppcUJYRFUxa3ZlMXJ6Z0dVeU01WWh4VkFta3lOcEs5eGpFWUc4bFI0NmdTU0xQV1NQWWV4NkExa2lQSFVTV1FVYTVGY3BRNEJ0Y2lPWG9jVlFJWjdhVklqaGJINEtWSXpoQkhsVUFtZVJySlVlTVlQSTNrTEhGVUNXU3lJWktqeHpFWUlqbFRIRlVDdWNuck9rY2NnN2QxcmppcUd0ZjlYYlV2ZmkrdDUwaWExdjNaN3NXQ1VRUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUhCWFZaL1dIZ1JzbFIwRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VncjhCaVFWenE5THYxT29BQUFBQVNVVk9SSzVDWUlJPSc7XHJcblxyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuICAgIHByb3BzLnNyYyA9IHByb3BzLnNyYyB8fCBwbGFjZWhvbGRlcjtcclxuICAgIC8vIHByb3BzLmJhY2tncm91bmQgPSAndXJsKFwiJyArIHByb3BzLnNyYyArICdcIikgbm8tcmVwZWF0ICcgKyAocHJvcHMuY2VudGVyID8gJ2NlbnRlcicgOiAnbGVmdCB0b3AnKTtcclxuICAgIC8vIHByb3BzLmJhY2tncm91bmRTaXplID0gKHByb3BzLnNpemUgPT09ICdjb250YWluJyB8fCBwcm9wcy5zaXplID09PSAnY292ZXInID8gcHJvcHMuc2l6ZSA6IChwcm9wcy5zaXplPT09J3N0cmV0Y2gnID8gJzEwMCUgMTAwJScgOiB1bmRlZmluZWQpICk7XHJcblxyXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xyXG5cclxuICAgIHRoaXMudHlwZSA9ICdJbWcnO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zcmMgPSBwcm9wcy5zcmM7XHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IHVuZGVmaW5lZDtcclxuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgdW5kZWZpbmVkO1xyXG4gICAgdGhpcy53ID0gcHJvcHMudyB8fCB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLmggPSBwcm9wcy5oIHx8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBJbWcubG9hZGluZyh0aGlzKTtcclxuICAgIGxvYWRJbWFnZShwcm9wcy5zcmMsIHRoaXMub25sb2FkLmJpbmQodGhpcyksIHRoaXMub25lcnJvci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBzdXBlci5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIG9ubG9hZCAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltYWdlIExvYWRlZDonLCBpbWcsIGltZy5zcmMsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLncgPSB0aGlzLncgfHwgaW1nLndpZHRoO1xyXG4gICAgdGhpcy5oID0gdGhpcy5oIHx8IGltZy5oZWlnaHQ7XHJcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gdGhpcy5oIC8gdGhpcy53O1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLncsIFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5oLCBcclxuICAgICAgICBiYWNrZ3JvdW5kOiAndXJsKCcgK2ltZy5zcmMrICcpIG5vLXJlcGVhdCBjZW50ZXInLFxyXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xyXG4gICAgfSk7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgb25lcnJvciAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltZy5vbmVycm9yJywgaW1nLnNyYywgJ2ZhaWxlZCcpO1xyXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5lcnJvciA9IHRydWU7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0V2lkdGggKHcpIHtcclxuICAgIHRoaXMud2lkdGggPSB3O1xyXG4gICAgdGhpcy5oZWlnaHQgPSB3ICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkaW5nIChpbWcpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5sb2FkaW5nKCk6XCIsIGltZy5zcmMpO1xyXG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcclxuICAgIGlmIChpbWcgJiYgIWltZy5sb2FkZWQpIHtcclxuICAgICAgICBJbWcucXVldWVkSW1ncy5wdXNoKGltZyk7XHJcbiAgICB9IFxyXG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkZWQgKGltZykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwiSU1HLmxvYWRlZCgpOlwiLCBpbWcuc3JjLCBJbWcucXVldWVkSW1ncy5sZW5ndGgpO1xyXG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcclxuICAgIGlmIChpbWcgJiYgaW1nLmxvYWRlZCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IEltZy5xdWV1ZWRJbWdzLmluZGV4T2YoaW1nKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBJbWcucXVldWVkSW1ncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoSW1nLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIEltZy5vbkFsbExvYWRlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBJbWcucXVldWVkSW1ncy5sZW5ndGggPT09IDA7ICAgICAgICBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBvbkFsbExvYWRlZCAoKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coXCJJTUcub25BbGxMb2FkZWQoKTogdHJpZ2dlcmVkXCIpO1xyXG4gIH1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoSW1nKTtcclxuXHJcblxyXG5mdW5jdGlvbiBsb2FkSW1hZ2UgKHNyYywgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcclxuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjYWxsYmFjayh0aGlzKTtcclxuICAgIH07XHJcbiAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBlcnJvckNhbGxiYWNrKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIGltZy5zcmMgPSBzcmM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgTGFiZWwgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXHJcblx0XHRcdGZvbnRTaXplOiAnMTRweCcsXHJcblx0XHRcdGNvbG9yOiAnIzAwMCdcclxuXHRcdH07XHJcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnTGFiZWwnO1xyXG5cdFx0dGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy50ZXh0KTtcclxuXHR9XHJcblxyXG5cdHNldFRleHQgKHR4dCkge1xyXG5cdFx0dGhpcy50ZXh0ID0gdHh0O1xyXG5cdFx0dGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0eHQpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhMYWJlbCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExhYmVsO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxyXFxuLkxpbmUge1xcclxcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxyXFxufVxcclxcblxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIExpbmUgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIC8vIGV4cGVjdGluZyBwcm9wczogeyB4MTowLCB5MTowLCB4Mjo1MCwgeTI6NTAgfVxyXG4gICAgcHJvcHMuYmFja2dyb3VuZENvbG9yID0gcHJvcHMgJiYgKHByb3BzLmJhY2tncm91bmRDb2xvciB8fCBwcm9wcy5jb2xvciB8fCAnYmxhY2snKTtcclxuICAgIHN1cGVyLmluaXQocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0xpbmUnO1xyXG4gICAgdGhpcy5sZW5ndGggPSAxMDtcclxuICAgIHRoaXMud2lkdGggPSAxO1xyXG4gICAgdGhpcy5hbmdsZSA9IDA7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLmNyZWF0ZUxpbmUocHJvcHMueDEsIHByb3BzLnkxLCBwcm9wcy54MiwgcHJvcHMueTIsIHByb3BzLndpZHRoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUxpbmUgKHgxLHkxLCB4Mix5Miwgd2lkdGgpIHtcclxuICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCAyO1xyXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoKHgxLXgyKSooeDEteDIpICsgKHkxLXkyKSooeTEteTIpKTtcclxuICAgIHRoaXMuYW5nbGUgID0gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKSAqIDE4MCAvIE1hdGguUEk7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgJ2xlZnQnOiAnJyArIHgxICsgJ3B4JyxcclxuICAgICAgICAndG9wJzogJycgKyAoeTEtKHRoaXMud2lkdGgvMikpICsgJ3B4JyxcclxuICAgICAgICAnd2lkdGgnOiAnJyArIHRoaXMubGVuZ3RoICsgJ3B4JyxcclxuICAgICAgICAnaGVpZ2h0JzogJycgKyB0aGlzLndpZHRoICsgJ3B4JyxcclxuICAgICAgICAvLyByb3RhdGUgYXJvdW5kIHN0YXJ0IHBvaW50IG9mIGxpbmVcclxuICAgICAgICAndHJhbnNmb3JtLW9yaWdpbic6ICcwIDUwJSdcclxuICAgICAgfSk7XHJcbiAgICB0aGlzLnJvdGF0ZVRvKHRoaXMuYW5nbGUpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNzcyAoKSB7XHJcbiAgXHRyZXR1cm4gcmVxdWlyZSgnLi9MaW5lLmNzcycpO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhMaW5lKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGluZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5QYXR0ZXJuLkdyYXBoUGFwZXIge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMztcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTAwcHggMTAwcHgsIDEwMHB4IDEwMHB4LCAyMHB4IDIwcHgsIDIwcHggMjBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC0ycHggLTJweCwgLTJweCAtMnB4LCAtMXB4IC0xcHgsIC0xcHggLTFweDtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4zKSAxcHgsIHRyYW5zcGFyZW50IDFweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkdyaWQge1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweDtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uU29mYSB7XFxyXFxuICBiYWNrZ3JvdW5kOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgMTAwJSA1MCUsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlBvbGthRG90cyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHdoaXRlIDE1JSwgdHJhbnNwYXJlbnQgMTYlKSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHdoaXRlIDE1JSwgdHJhbnNwYXJlbnQgMTYlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogNjBweCA2MHB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCAwLCAzMHB4IDMwcHg7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkJsdWVCYWxscyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQoI2FjZiA3NyUsIHJnYmEoODgsOTksMjU1LC44OCkgODAlLCB0cmFuc3BhcmVudCA4MyUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAyNSUgMjUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5TdHJpcGVzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1NSwyNTUsMjUsMSkgNTAlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5QbGFpZFJlZCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBoc2woMiwgNTclLCA0MCUpO1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxyXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQodHJhbnNwYXJlbnQsIHRyYW5zcGFyZW50IDUwcHgsIHJnYmEoMCwwLDAsLjQpIDUwcHgsIHJnYmEoMCwwLDAsLjQpIDUzcHgsIHRyYW5zcGFyZW50IDUzcHgsIHRyYW5zcGFyZW50IDYzcHgsIHJnYmEoMCwwLDAsLjQpIDYzcHgsIHJnYmEoMCwwLDAsLjQpIDY2cHgsIHRyYW5zcGFyZW50IDY2cHgsIHRyYW5zcGFyZW50IDExNnB4LCByZ2JhKDAsMCwwLC41KSAxMTZweCwgcmdiYSgwLDAsMCwuNSkgMTY2cHgsIHJnYmEoMjU1LDI1NSwyNTUsLjIpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjU1LC4yKSAxNjlweCwgcmdiYSgwLDAsMCwuNSkgMTY5cHgsIHJnYmEoMCwwLDAsLjUpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjU1LC4yKSAxNzlweCwgcmdiYSgyNTUsMjU1LDI1NSwuMikgMTgycHgsIHJnYmEoMCwwLDAsLjUpIDE4MnB4LCByZ2JhKDAsMCwwLC41KSAyMzJweCwgdHJhbnNwYXJlbnQgMjMycHgpLFxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDI3MGRlZywgdHJhbnNwYXJlbnQsIHRyYW5zcGFyZW50IDUwcHgsIHJnYmEoMCwwLDAsLjQpIDUwcHgsIHJnYmEoMCwwLDAsLjQpIDUzcHgsIHRyYW5zcGFyZW50IDUzcHgsIHRyYW5zcGFyZW50IDYzcHgsIHJnYmEoMCwwLDAsLjQpIDYzcHgsIHJnYmEoMCwwLDAsLjQpIDY2cHgsIHRyYW5zcGFyZW50IDY2cHgsIHRyYW5zcGFyZW50IDExNnB4LCByZ2JhKDAsMCwwLC41KSAxMTZweCwgcmdiYSgwLDAsMCwuNSkgMTY2cHgsIHJnYmEoMjU1LDI1NSwyNTUsLjIpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjU1LC4yKSAxNjlweCwgcmdiYSgwLDAsMCwuNSkgMTY5cHgsIHJnYmEoMCwwLDAsLjUpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjU1LC4yKSAxNzlweCwgcmdiYSgyNTUsMjU1LDI1NSwuMikgMTgycHgsIHJnYmEoMCwwLDAsLjUpIDE4MnB4LCByZ2JhKDAsMCwwLC41KSAyMzJweCwgdHJhbnNwYXJlbnQgMjMycHgpLFxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDEyNWRlZywgdHJhbnNwYXJlbnQsIHRyYW5zcGFyZW50IDJweCwgcmdiYSgwLDAsMCwuMikgMnB4LCByZ2JhKDAsMCwwLC4yKSAzcHgsIHRyYW5zcGFyZW50IDNweCwgdHJhbnNwYXJlbnQgNXB4LCByZ2JhKDAsMCwwLC4yKSA1cHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5EaWFnb25hbFN0cmlwZXMge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBibGFjayAyNSUsIHRyYW5zcGFyZW50IDI1JSwgdHJhbnNwYXJlbnQgNTAlLCBibGFjayA1MCUsIGJsYWNrIDc1JSwgdHJhbnNwYXJlbnQgNzUlLCB0cmFuc3BhcmVudCk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE2JSAxNiU7ICAvKiBtdXN0IG1hdGNoIGFzcGVjdCByYXRpbyBvZiBjb250YWluaW5nIGVsZW1lbnQgb3IgbGluZXMgd2lsbCBicmVhayAqL1xcclxcbiAgICAgICAgLyogaWUuIDMyJSAxNiUgZm9yIGFuIGVsZW1lbnQgd2l0aCB3PTEwMCBoPTIwMCAqL1xcclxcbiAgICAgICAgLyogUG93ZXJzIG9mIDIgd29yayBiZXN0IChvdGhlciB2YWx1ZXMsIGxpa2UgNyBvciAyMywgbWFrZSBqYWdneSBhbGlhc2luZykgKi9cXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgUGF0dGVybiBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICBsZWZ0OiAnMHB4JyxcclxuICAgICAgdG9wOiAnMHB4JyxcclxuICAgICAgY29sb3I6ICcjZGRkJyxcclxuICAgICAgcGF0dGVybjogJ0dyYXBoUGFwZXInXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MocHJvcHMucGF0dGVybik7XHJcbiAgICBpZiAocHJvcHMucGF0dGVybiA9PT0gJ2dyaWQnKSB7XHJcbiAgICAgIHRoaXMuY3NzKCBQYXR0ZXJuLm1ha2VHcmlkQ1NTKHByb3BzLmNlbGxXaWR0aCB8fCAxMDAsIHByb3BzLmNlbGxIZWlnaHQgfHwgMTAwLCBwcm9wcy5saW5lV2lkdGggfHwgMikgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlR3JpZENTUyAoY2VsbFdpZHRoLCBjZWxsSGVpZ2h0LCBsaW5lV2lkdGgpIHtcclxuICAgIHZhciBwcm9wcyA9IHt9O1xyXG4gICAgdmFyIHBvcyA9ICctJyArIGxpbmVXaWR0aCArICdweCc7XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kU2l6ZSA9ICcnICsgY2VsbFdpZHRoICsgJ3B4ICcgKyBjZWxsSGVpZ2h0ICsgJ3B4LCAnICsgY2VsbFdpZHRoICsgJ3B4ICcgKyBjZWxsSGVpZ2h0ICsgJ3B4JztcclxuICAgIHByb3BzLmJhY2tncm91bmRQb3NpdGlvbiA9IHBvcyArICcgJyArIHBvcyArICcsJyArIHBvcyArICcgJyArIHBvcztcclxuICAgIHByb3BzLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICdsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSwnICtcclxuICAgICAgJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSc7XHJcbiAgICByZXR1cm4gcHJvcHM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICAgIHJldHVybiByZXF1aXJlKCcuL1BhdHRlcm4uY3NzJyk7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm4pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xyXG5cclxuXHJcbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMuVCA9IFRpbWVyLm1ha2Uoe2NhbGxiYWNrOiB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgZGVsYXk6IHRoaXMuZGVsYXl9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0dGhpcy5ULnN0b3AoKTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIgKCkge1xyXG5cdFx0dGhpcy5jYWxsYmFjaygpO1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFB1bHNhcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFB1bHNhcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbnZhciBQSSA9IDMuMTQxNTkyNjUzNTk7XHJcbnZhciBIQUxGUEkgPSBQSS8yLjA7XHJcblxyXG5jbGFzcyBSYW5kIHtcclxuXHRzdGF0aWMgcmFuZEl0ZW0oYXJyKSB7XHJcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBhcnJbIFJhbmQucmFuZEludCgwLCBhcnIubGVuZ3RoLTEpIF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gKGluY2x1ZGVkKSBhbmQgbWF4IChpbmNsdWRlZClcclxuXHQvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcclxuXHRzdGF0aWMgcmFuZEludChtaW4sIG1heCkge1xyXG5cdFx0bWluID0gTWF0aC5jZWlsKG1pbnx8MCk7XHJcblx0XHRtYXggPSBNYXRoLmZsb29yKG1heHx8MSk7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIC45OTk5OTlcclxuXHRzdGF0aWMgcmFuZEZsb2F0KCkge1xyXG5cdCAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyByYW5kUGVyY2VudCh0aHJlc2hvbGQpIHtcclxuXHRcdHJldHVybiBSYW5kLnJhbmRJbnQoMSwxMDApIDwgdGhyZXNob2xkO1xyXG5cdH1cclxuXHJcblx0Ly8gcmFuZG9tIGludGVnZXIgd2l0aGluIG1heERpc3RhbmNlIG9mIHRhcmdldCAoZGlzdHJpYnV0ZWQgaW4gYSBiZWxsIGN1cnZlIGFyb3VuZCB0YXJnZXQpXHJcblx0c3RhdGljIHJhbmRDbG9zZVRvKHRhcmdldCwgbWF4RGlzdGFuY2UpIHtcclxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXHJcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZFNpbjIoKSk7ICAgLy8gc3ByZWFkIG92ZXIgZW50aXJlIHJhbmdlLCBzb21ld2hhdCBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgXHJcblx0XHRyZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogUmFuZC5yYW5kUG93MigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHdpdGggc2hhcnAgY29uY2VudHJhdGlvbiBhcm91bmQgY2VudGVyXHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXHJcblx0c3RhdGljIHJhbmRQb3coKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5wb3coMS4wIC0gUmFuZC5yYW5kRmxvYXQoKSwgNCk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCB0b3dhcmQgMVxyXG5cdHN0YXRpYyByYW5kU2luKCkge1xyXG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdzIoKSB7XHJcblx0XHRyZXR1cm4gUmFuZC5yYW5kUG93KCkgLSBSYW5kLnJhbmRQb3coKTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIDBcclxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcclxuXHRcdHJldHVybiAoKFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSkgLSAzLjApIC8gMy4wO1xyXG5cdH1cclxuXHJcbiAgICAvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgY2xvc2VyIHRvIDBcclxuICAgIHN0YXRpYyByYW5kU2luMigpIHtcclxuICAgICAgICByZXR1cm4gUmFuZC5yYW5kU2luKCkgLSBSYW5kLnJhbmRTaW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gYXJyYXkgb2YgMyBpbnRzLCBlYWNoIDAtMjU1XHJcbiAgICBzdGF0aWMgcmFuZFJHQigpIHtcclxuICAgICAgICByZXR1cm4gW1JhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSldO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByYW5kUkdCc3RyKCkge1xyXG5cdFx0dmFyIHJnYiA9IFJhbmQucmFuZFJHQigpO1xyXG4gICAgICAgIHJldHVybiAncmdiYSgnICtyZ2JbMF0rICcsJyArcmdiWzFdKyAnLCcgK3JnYlsyXSsgJywgLjkpJztcclxuICAgIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhSYW5kKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZDtcclxuIiwidmFyIGVsZW1lbnRDb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRoaW5nIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1RoaW5nJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUgKHByb3BzKSB7XHJcbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG4gICAgLy8gQ1NTIHByb3BzIGdvIGludG8gdGhpcy5wcm9wc1xyXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xyXG4gICAgLy8ga2VlcCB0aGVzZSBwcm9wZXJ0aWVzIG9uICd0aGlzJ1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IHByb3BzLnJvdGF0ZSB8fCAwO1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IHByb3BzLnNjYWxlIHx8IDE7XHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IDA7XHJcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IDA7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICB2YXIgcGFyZW50RWxlbWVudCA9ICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC4kZWxlbWVudCkgfHwgJChkb2N1bWVudC5ib2R5KTtcclxuICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kKHRoaXMuJGVsZW1lbnQpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3ModGhpcy5wcm9wcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxyXG4gIHVuUmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLiRlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0RGltZW5zaW9ucyAoKSB7XHJcbiAgICByZXR1cm4ge3c6IHRoaXMuJGVsZW1lbnQud2lkdGgoKSwgaDogdGhpcy4kZWxlbWVudC5oZWlnaHQoKX07XHJcbiAgfVxyXG5cclxuICBnZXRCb3VuZGluZ0JveCAoKSB7XHJcbiAgICAvLyByZWxhdGl2ZSB0byBwYWdlXHJcbiAgICB2YXIgc2Nyb2xsdG9wID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICB2YXIgc2Nyb2xsbGVmdCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcclxuICAgIHZhciBib3VuZHMgPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogYm91bmRzLmxlZnQrc2Nyb2xsbGVmdCxcclxuICAgICAgeTogYm91bmRzLnRvcCtzY3JvbGx0b3AsXHJcbiAgICAgIHc6IGJvdW5kcy53aWR0aCxcclxuICAgICAgaDogYm91bmRzLmhlaWdodCxcclxuICAgICAgYm90dG9tOiBib3VuZHMuYm90dG9tK3Njcm9sbHRvcCxcclxuICAgICAgcmlnaHQ6IGJvdW5kcy5yaWdodCtzY3JvbGxsZWZ0XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcm90YXRlIChkZWdyZWVzKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IGRlZ3JlZXM7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByb3RhdGVUbyAoYW5nbGUpIHtcclxuICAgIHRoaXMucm90YXRpb24gPSBhbmdsZTtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNjYWxlIChmYWN0b3IpIHtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgKz0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGVUbyAoZmFjdG9yKSB7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNsYXRlICh4LCB5KSB7XHJcbiAgICB0aGlzLnggKz0geDtcclxuICAgIHRoaXMueSArPSB5O1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNsYXRlVG8gKHgsIHkpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNmb3JtICgpIHtcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgdHJhbnNmb3JtOiBUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGVGYWN0b3IsIHRoaXMueCwgdGhpcy55KVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGNzcyAocHJvcHMpIHtcclxuICAgIHRoaXMucHJvcHMgPSAkLmV4dGVuZCh0aGlzLnByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhwcm9wcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGh0bWwgKCkge1xyXG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2UgKCkge1xyXG4gICAgdmFyIGNscyA9IHRoaXM7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcbiAgICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENsYXNzIChjbHMpIHtcclxuICAgIFRoaW5nLmNsYXNzZXMgPSBUaGluZy5jbGFzc2VzIHx8IHt9O1xyXG4gICAgVGhpbmcuY2xhc3Nlc1tjbHMubmFtZV0gPSBjbHM7XHJcblxyXG4gICAgLy8gbG9hZCB0aGUgY2xhc3Mgc3R5bGVzICh0aGVzZSBhcmUgaW5jbHVkZWQgaW4gdGhlIGJ1bmRsZSBhdCBidWlsZCB0aW1lKVxyXG4gICAgY2xzLmNzcyAmJiBUaGluZy5hZGRDU1NTdHJpbmcoY2xzLmNzcygpLCBjbHMubmFtZSk7XHJcblxyXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgY3NzIGZpbGUgYXQgbG9hZCB0aW1lXHJcbiAgICBUaGluZy5hZGRDU1NGaWxlKGNscy5uYW1lICsgJy8nICsgY2xzLm5hbWUgKyAnLmNzcycsICdjc3MnK2Nscy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRDbGFzcyAobmFtZSkge1xyXG4gICAgcmV0dXJuIFRoaW5nLmNsYXNzZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xyXG5cclxuICBzdGF0aWMgbWFrZVN0eWxlcyAocHJvcHMpIHtcclxuICAgIHZhciBzdHlsZXMgPSBwcm9wcyB8fCB7fTtcclxuICAgICQuZXh0ZW5kKHN0eWxlcywge1xyXG4gICAgICAvLyBsZWZ0OiBwcm9wcy5sZWZ0IHx8IChwcm9wcy54ICYmIChwcm9wcy54ICsgXCJweFwiKSksXHJcbiAgICAgIC8vIHRvcDogcHJvcHMudG9wIHx8IChwcm9wcy55ICYmIChwcm9wcy55ICsgXCJweFwiKSksXHJcbiAgICAgIHdpZHRoOiBwcm9wcy53aWR0aCB8fCAocHJvcHMudyAmJiAocHJvcHMudyArIFwicHhcIikpLFxyXG4gICAgICBoZWlnaHQ6IHByb3BzLmhlaWdodCB8fCAocHJvcHMuaCAmJiAocHJvcHMuaCArIFwicHhcIikpLFxyXG4gICAgICB6SW5kZXg6IHByb3BzLnpJbmRleCB8fCBwcm9wcy56LFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHByb3BzLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgdHJhbnNmb3JtOiBwcm9wcy50cmFuc2Zvcm0gfHwgKFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1MocHJvcHMucm90YXRlLCBwcm9wcy5zY2FsZSwgcHJvcHMueCwgcHJvcHMueSkpLFxyXG4gICAgICBwb3NpdGlvbjogcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJ1xyXG4gICAgfSk7XHJcbiAgICBkZWxldGUgc3R5bGVzLnJvdGF0ZTtcclxuICAgIGRlbGV0ZSBzdHlsZXMuc2NhbGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLng7XHJcbiAgICBkZWxldGUgc3R5bGVzLnk7XHJcbiAgICBkZWxldGUgc3R5bGVzLno7XHJcbiAgICBkZWxldGUgc3R5bGVzLnc7XHJcbiAgICBkZWxldGUgc3R5bGVzLmg7XHJcbiAgICByZXR1cm4gc3R5bGVzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VUcmFuc2Zvcm1DU1MgKHJvdGF0ZSwgc2NhbGUsIHR4LCB0eSkge1xyXG4gICAgdmFyIHRyYW5zZm9ybSA9ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9ICh0eCB8fCB0eSkgPyAoVGhpbmcubWFrZVRyYW5zbGF0ZUNTUyh0eCwgdHkpICsgJyAnKSA6ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9IFRoaW5nLmlzTnVtZXJpYyhyb3RhdGUpID8gKFRoaW5nLm1ha2VBbmdsZUNTUyhyb3RhdGUpICsgJyAnKSA6ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9IHNjYWxlID8gKFRoaW5nLm1ha2VTY2FsZUNTUyhzY2FsZSkgKyAnICcpIDogJyc7XHJcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VBbmdsZUNTUyAoYW5nbGUpIHtcclxuICAgIHJldHVybiAncm90YXRlKCcrYW5nbGUrJ2RlZyknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VTY2FsZUNTUyAoc2NhbGUpIHtcclxuICAgIHJldHVybiAnc2NhbGUoJytzY2FsZSsnKSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVRyYW5zbGF0ZUNTUyAoeCwgeSkge1xyXG4gICAgeCA9IHggfHwgJzAnO1xyXG4gICAgeSA9IHkgfHwgJzAnO1xyXG4gICAgcmV0dXJuICd0cmFuc2xhdGUoJysgeCArICdweCwgJyArIHkgKydweCknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VFbGVtZW50IChodG1sLCBwcm9wcywgdHlwZSkge1xyXG4gICAgdmFyICRlbGVtZW50ID0gJChodG1sKVxyXG4gICAgICAuY3NzKFRoaW5nLm1ha2VTdHlsZXMocHJvcHMpKVxyXG4gICAgICAuYWRkQ2xhc3ModHlwZSB8fCAncmFuZG9tJylcclxuICAgICAgLmF0dHIoJ2lkJywgKHR5cGUgfHwgJ3JhbmRvbScpICsgKCsrZWxlbWVudENvdW50ZXIpKTtcclxuICAgIHJldHVybiAkZWxlbWVudDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpc051bWVyaWMobikge1xyXG4gICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxuICB9XHJcblxyXG4gIC8vIE1ha2Ugc3VyZSBuZWNlc3NhcnkgQ1NTIHByb3BlcnRpZXMgYXJlIHByZXNlbnQgb3IgZGVmYXVsdGVkIHRvIHNvbWV0aGluZyBzYW5lXHJcbiAgc3RhdGljIGNsZWFudXAgKHByb3BzKSB7XHJcbiAgICB2YXIgY3AgPSBwcm9wcyB8fCB7fTtcclxuICAgIGNwLnBvc2l0aW9uID0gcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJzsgICAvLyBkZWZhdWx0IHRvIGFic29sdXRlIHBvc2l0aW9uaW5nXHJcbiAgICAvLyBjcC54ID0gcHJvcHMueCB8fCBwcm9wcy5sZWZ0IHx8IDA7XHJcbiAgICAvLyBjcC55ID0gcHJvcHMueSB8fCBwcm9wcy50b3AgfHwgMDtcclxuICAgIC8vIGNwLnogPSBwcm9wcy56IHx8IHByb3BzLnpJbmRleDtcclxuICAgIC8vIGNwLncgPSBwcm9wcy53IHx8IHByb3BzLndpZHRoO1xyXG4gICAgLy8gY3AuaCA9IHByb3BzLmggfHwgcHJvcHMuaGVpZ2h0O1xyXG4gICAgY3Aucm90YXRpb24gPSBwcm9wcy5yb3RhdGlvbiB8fCAwO1xyXG4gICAgY3Auc2NhbGUgPSBwcm9wcy5zY2FsZSB8fCAxO1xyXG4gICAgcmV0dXJuIGNwO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENTU0ZpbGUoZmlsZU5hbWUsIGlkKSB7XHJcbiAgICAgdmFyIGxpbmsgPSAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCInICsgZmlsZU5hbWUgKyAnXCIgaWQ9XCInICsgaWQgKyAnXCI+JztcclxuICAgICAkKCdoZWFkJykuZmluZCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICAgJCgnaGVhZCcpLmFwcGVuZChsaW5rKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZCkge1xyXG4gICAgaWYgKGNzc1N0cmluZykge1xyXG4gICAgICAvLyB2YXIgZG9jID0gd2luZG93LmRvY3VtZW50O1xyXG4gICAgICB2YXIgc3R5bGVFbCA9ICQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICtjc3NTdHJpbmcrICc8L3N0eWxlPicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgKGlkIHx8ICdUaGluZycpICsgJy1zdHlsZXMnKTtcclxuICAgICAgJCgnaGVhZCcpLmFwcGVuZChzdHlsZUVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRoaW5nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGhpbmc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcblxyXG5jbGFzcyBUaW1lciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdvICgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xyXG5cdFx0dGhpcy50aW1lcklEID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLmRlbGF5KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRpbWVyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcclxucmVxdWlyZSgnLi9Cb3gvQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQXJyb3cvQXJyb3cuanMnKTtcclxucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGltZXIvVGltZXIuanMnKTtcclxucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcclxucmVxdWlyZSgnLi9QdWxzYXIvUHVsc2FyLmpzJyk7XHJcbnJlcXVpcmUoJy4vRG8vRG8uanMnKTtcclxucmVxdWlyZSgnLi9MYWJlbC9MYWJlbC5qcycpO1xyXG5yZXF1aXJlKCcuL0xpbmUvTGluZS5qcycpO1xyXG5yZXF1aXJlKCcuL0ltZy9JbWcuanMnKTtcclxucmVxdWlyZSgnLi9QYXR0ZXJuL1BhdHRlcm4uanMnKTtcclxucmVxdWlyZSgnLi9CR0ltZy9CR0ltZy5qcycpO1xyXG5cclxud2luZG93LlRoaW5nID0gVGhpbmc7XHJcbiJdfQ==
