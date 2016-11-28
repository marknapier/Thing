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
module.exports = "/* required for arrow */\n.arrow-head {\n  display: inline-block;\n  vertical-align: middle;\n  width: 0; \n  height: 0; \n  border-top: 30px solid transparent;\n  border-bottom: 30px solid transparent;\n  border-left: 30px solid green;\n}\n\n.arrow-body {\n  display: inline-block;\n  vertical-align: middle;\n  background-color: green;\n  width: 40px;\n  height: 20px;\n  margin: 0;\n  margin-top: 20px;\n  margin-bottom: 20px;\n  border-left: 0;\n  border-right: 0;\n}\n\n.arrow-wrapper {\n  width: 70px;   /* arrow-body width + arrow-head border width */\n}\n\n.Arrow {\n  /* For some nice animation on the rotates: */\n  -webkit-transition: -webkit-transform .2s;\n     -moz-transition:    -moz-transform .2s;\n          transition:         transform .2s;\n}\n\n";

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
module.exports = "\n.DemoBox {\n  display: inline-block;\n  position: relative;\n  margin: 20px;\n  width: 200px; \n  height: 200px; \n  border: 2px dashed #eee;\n}\n";

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
module.exports = "\n.Line {\n  /* For some nice animation on the rotates: */\n  -webkit-transition: -webkit-transform .2s;\n     -moz-transition:    -moz-transform .2s;\n          transition:         transform .2s;\n}\n\n";

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
module.exports = ".Pattern.GraphPaper {\n  background-color: #003;\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\n  background-image: \n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\n}\n\n.Pattern.Grid {\n  background-size: 100px 100px, 100px 100px;\n  background-position: -2px -2px, -2px -2px;\n  background-image: \n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\n}\n\n.Pattern.Sofa {\n  background:\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\n  background-color: #300;\n  background-size: 25% 25%;\n}\n\n.Pattern.PolkaDots {\n  background-image: \n    radial-gradient(white 15%, transparent 16%),\n    radial-gradient(white 15%, transparent 16%);\n  background-size: 60px 60px;\n  background-position: 0 0, 30px 30px;\n}\n\n.Pattern.BlueBalls {\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\n  background-size: 25% 25%;\n}\n\n.Pattern.Stripes {\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\n  background-size: 15%;\n}\n\n.Pattern.PlaidRed {\n  background-color: hsl(2, 57%, 40%);\n  background-image: \n    repeating-linear-gradient(transparent, transparent 50px, rgba(0,0,0,.4) 50px, rgba(0,0,0,.4) 53px, transparent 53px, transparent 63px, rgba(0,0,0,.4) 63px, rgba(0,0,0,.4) 66px, transparent 66px, transparent 116px, rgba(0,0,0,.5) 116px, rgba(0,0,0,.5) 166px, rgba(255,255,255,.2) 166px, rgba(255,255,255,.2) 169px, rgba(0,0,0,.5) 169px, rgba(0,0,0,.5) 179px, rgba(255,255,255,.2) 179px, rgba(255,255,255,.2) 182px, rgba(0,0,0,.5) 182px, rgba(0,0,0,.5) 232px, transparent 232px),\n    repeating-linear-gradient(270deg, transparent, transparent 50px, rgba(0,0,0,.4) 50px, rgba(0,0,0,.4) 53px, transparent 53px, transparent 63px, rgba(0,0,0,.4) 63px, rgba(0,0,0,.4) 66px, transparent 66px, transparent 116px, rgba(0,0,0,.5) 116px, rgba(0,0,0,.5) 166px, rgba(255,255,255,.2) 166px, rgba(255,255,255,.2) 169px, rgba(0,0,0,.5) 169px, rgba(0,0,0,.5) 179px, rgba(255,255,255,.2) 179px, rgba(255,255,255,.2) 182px, rgba(0,0,0,.5) 182px, rgba(0,0,0,.5) 232px, transparent 232px),\n    repeating-linear-gradient(125deg, transparent, transparent 2px, rgba(0,0,0,.2) 2px, rgba(0,0,0,.2) 3px, transparent 3px, transparent 5px, rgba(0,0,0,.2) 5px);\n}\n\n.Pattern.DiagonalStripes {\n  background-image: linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent);\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\n        /* ie. 32% 16% for an element with w=100 h=200 */\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\n}\n";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIEFjdGlvbiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHR9XG5cblx0aW5pdCAocHJvcHMpIHtcblx0XHR0aGlzLnByb3BzID0gcHJvcHMgfHwge307XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnbyAoKSB7XG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uZ28oKScpO1xuXHR9XG5cblx0c3RvcCAoKSB7XG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uc3RvcCgpJyk7XG5cdH1cblxuXHRzdGF0aWMgbWFrZSAoKSB7XG5cdCAgdmFyIGNscyA9IHRoaXM7XG5cdCAgdmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xuXHQgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cdCAgcmV0dXJuIGluc3RhbmNlO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhBY3Rpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbjtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIvKiByZXF1aXJlZCBmb3IgYXJyb3cgKi9cXG4uYXJyb3ctaGVhZCB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcbiAgd2lkdGg6IDA7IFxcbiAgaGVpZ2h0OiAwOyBcXG4gIGJvcmRlci10b3A6IDMwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWxlZnQ6IDMwcHggc29saWQgZ3JlZW47XFxufVxcblxcbi5hcnJvdy1ib2R5IHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgaGVpZ2h0OiAyMHB4O1xcbiAgbWFyZ2luOiAwO1xcbiAgbWFyZ2luLXRvcDogMjBweDtcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxuICBib3JkZXItbGVmdDogMDtcXG4gIGJvcmRlci1yaWdodDogMDtcXG59XFxuXFxuLmFycm93LXdyYXBwZXIge1xcbiAgd2lkdGg6IDcwcHg7ICAgLyogYXJyb3ctYm9keSB3aWR0aCArIGFycm93LWhlYWQgYm9yZGVyIHdpZHRoICovXFxufVxcblxcbi5BcnJvdyB7XFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXG59XFxuXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBBcnJvdyBleHRlbmRzIFRoaW5nIHtcblx0aW5pdCAocHJvcHMpIHtcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuXHRcdHRoaXMudHlwZSA9ICdBcnJvdyc7XG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG5cdFx0dGhpcy5zZXRDb2xvcih0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBhcnJvdyBiZWZvcmUgY2FsbGluZyB0aGlzXG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c2V0Q29sb3IgKGMpIHtcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1oZWFkJykuY3NzKHtib3JkZXJMZWZ0Q29sb3I6Y30pO1xuXHRcdHRoaXMuJGVsZW1lbnQuZmluZCgnLmFycm93LWJvZHknKS5jc3Moe2JhY2tncm91bmRDb2xvcjpjfSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRodG1sICgpIHtcblx0XHRyZXR1cm4gXCI8ZGl2PjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PjwvZGl2PlwiO1xuXHR9XG5cblx0c3RhdGljIGNyZWF0ZUFycm93RWxlbWVudCAoKSB7XG5cdFx0dmFyICRhcnJvdyA9ICQoXCI8ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj5cIik7XG5cdFx0cmV0dXJuICRhcnJvdztcblx0fVxuXG5cdHN0YXRpYyBjc3MgKCkge1xuXHRcdHJldHVybiByZXF1aXJlKCcuL0Fycm93LmNzcycpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhBcnJvdyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBCR0ltZyBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgbGVmdDogJzBweCcsXG4gICAgICB0b3A6ICcwcHgnXG4gICAgfTtcbiAgICBwcm9wcyA9IHRoaXMucHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcbiAgICB0aGlzLnR5cGUgPSAnQkdJbWcnO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBiYWNrZ3JvdW5kOiAndXJsKFwiJyArIHByb3BzLnVybCArICdcIikgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogJ2NvdmVyJyAgLy8xMDAlIDEwMCUnXG4gICAgfSk7XG4gIH1cbn1cblRoaW5nLmFkZENsYXNzKEJHSW1nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCR0ltZztcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIEJveCBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgXHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuICBcdHRoaXMudHlwZSA9ICdCb3gnO1xuICBcdHRoaXMuaXRlbXMgPSBbXTtcbiAgXHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gIH1cblxuICBhZGQgKGFkZEl0ZW1zKSB7XG4gIFx0aWYgKGFkZEl0ZW1zKSB7XG4gICAgICBpZiAoIShhZGRJdGVtcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICBhZGRJdGVtcyA9IFthZGRJdGVtc107XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpPTA7IGkgPCBhZGRJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLml0ZW1zLnB1c2goYWRkSXRlbXNbaV0pO1xuICAgICAgICBhZGRJdGVtc1tpXS5wYXJlbnQgPSB0aGlzOyAgICAgICAgXG4gICAgICB9XG4gIFx0fVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSB0aGlzIGJveCAoZnJvbSB0aGUgZG9tIGFuZCB0aGUgaXRlbXMgbGlzdClcbiAgcmVtb3ZlIChpdGVtKSB7XG4gIFx0aWYgKGl0ZW0pIHtcbiAgXHRcdHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKTtcbiAgXHRcdGlmIChpbmRleCA+IC0xKSB7XG4gIFx0XHQgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICBcdFx0XHRpdGVtLiRlbGVtZW50LnJlbW92ZSgpO1xuICBcdFx0XHRpdGVtLnBhcmVudCA9IG51bGw7XG4gIFx0XHR9XG4gIFx0fVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbnVtRWxlbWVudHMgKCkge1xuICBcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgfVxuXG4gIGdldEVsZW1lbnRCb3VuZHMgKCkge1xuICAgIHZhciBib3VuZHMgPSB7eDo5OTk5OTksIHk6OTk5OTk5LCBib3R0b206MCwgcmlnaHQ6MH07XG4gICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZm9yICh2YXIgaT0wOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcyA9IHRoaXMuaXRlbXNbaV0uZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgIGJvdW5kcy54ID0gKHBvcy54IDwgYm91bmRzLngpID8gcG9zLnggOiBib3VuZHMueDtcbiAgICAgIGJvdW5kcy55ID0gKHBvcy55IDwgYm91bmRzLnkpID8gcG9zLnkgOiBib3VuZHMueTtcbiAgICAgIGJvdW5kcy5ib3R0b20gPSAocG9zLmJvdHRvbSA+IGJvdW5kcy5ib3R0b20pID8gcG9zLmJvdHRvbSA6IGJvdW5kcy5ib3R0b207XG4gICAgICBib3VuZHMucmlnaHQgPSAocG9zLnJpZ2h0ID4gYm91bmRzLnJpZ2h0KSA/IHBvcy5yaWdodCA6IGJvdW5kcy5yaWdodDtcbiAgICB9XG4gICAgYm91bmRzLncgPSBib3VuZHMucmlnaHQgLSBib3VuZHMueDtcbiAgICBib3VuZHMuaCA9IGJvdW5kcy5ib3R0b20gLSBib3VuZHMueTtcbiAgICByZXR1cm4gYm91bmRzO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgXHRzdXBlci5yZW5kZXIoKTtcbiAgXHRmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIFx0XHR0aGlzLml0ZW1zW2ldLnJlbmRlcigpO1xuICBcdH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoQm94KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb3g7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuLkRlbW9Cb3gge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbWFyZ2luOiAyMHB4O1xcbiAgd2lkdGg6IDIwMHB4OyBcXG4gIGhlaWdodDogMjAwcHg7IFxcbiAgYm9yZGVyOiAycHggZGFzaGVkICNlZWU7XFxufVxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcbnZhciBCb3ggPSByZXF1aXJlKCcuLi9Cb3gvQm94LmpzJyk7XG5cbmNsYXNzIERlbW9Cb3ggZXh0ZW5kcyBCb3gge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHByb3BzID0gcHJvcHMgfHwge307XG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XG5cdFx0cHJvcHMud2lkdGggPSBwcm9wcy53aWR0aCB8fCAyMDA7XG5cdFx0cHJvcHMuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0IHx8IDIwMDtcblx0XHRwcm9wcy5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cdFx0dGhpcy50eXBlID0gJ0RlbW9Cb3gnO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0c3VwZXIucmVuZGVyKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRzdGF0aWMgY3NzICgpIHtcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9EZW1vQm94LmNzcycpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhEZW1vQm94KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZW1vQm94O1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuLy8gTGlrZSBVbml4IHBpcGU6IG91dHB1dCBvZiBvbmUgY29tbWFuZCBpcyBpbnB1dCB0byB0aGUgbmV4dFxuLy8gRWFjaCBmdW5jdGlvbiB0YWtlcyBhICdwcm9wcycgb2JqZWN0IGFzIGFyZ3VtZW50XG4vLyBFYWNoIGZ1bmN0aW9uIHJldHVybnMgYW4gb2JqZWN0IHdpdGggcmVzdWx0cywgd2hpY2ggaXMgcGFzc2VkIGFzIHByb3BzIHRvIHRoZSBuZXh0XG4vLyBEbygpIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgZXhlY3V0ZSB0aGUgRG8gY2hhaW5cblxuLy8gUC5wdWxzZS5zZXRUbyhcbi8vICAgICBEbyhSLmdldFJhbmRvbU51bWJlciwge2Zyb206MCwgdG86MTB9KSAgIC8vIHJldHVybnM6ICB7ZGF0YTogOH1cbi8vICAgICAuRG8oQy5waWNrQ29sb3IpICAgIC8vIHJlYWRzIGlucHV0IDgsIHJldHVybnMge2RhdGE6ICcjY2ZmJ31cbi8vICAgICAuRG8oQi5jaGFuZ2VDb2xvcikgICAvLyByZWFkcyBpbnB1dCAnI2NmZicsIGNoYW5nZXMgY29sb3Igb24gQmxpbmtlclxuLy8gKTtcblxuXG5mdW5jdGlvbiBEbyhfYUZ1bmN0aW9uLCBfcHJvcHMsIF9maXJzdERvKSB7XG4gICAgdmFyIGFGdW5jdGlvbiA9IF9hRnVuY3Rpb247XG4gICAgdmFyIHByb3BzID0gX3Byb3BzO1xuICAgIHZhciBmaXJzdERvID0gX2ZpcnN0RG8gfHwgZXhlY3V0b3I7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnYWZ1bmN0aW9uPScsIGFGdW5jdGlvbik7XG4gICAgLy8gY29uc29sZS5sb2coJ3Byb3BzPScsIHByb3BzKTtcbiAgICAvLyBjb25zb2xlLmxvZygnZmlyc3REbz0nLCBmaXJzdERvKTtcblxuICAgIC8vIFJ1biB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzLlxuICAgIC8vIFBhc3MgdGhlIHJlc3VsdHMgdG8gdGhlIG5leHQgY2hhaW5lZCBmdW5jdGlvbiAoaWYgYW55KS5cbiAgICAvLyBSZXR1cm4gcmVzdWx0cyBvZiB0aGlzIGZ1bmN0aW9uIG9yIG9mIHRoZSBjaGFpblxuICAgIGZ1bmN0aW9uIGV4ZWN1dG9yIChwaXBlZFByb3BzKSB7XG4gICAgICAgIHZhciByZXR1cm5WYWwgPSBhRnVuY3Rpb24ocHJvcHMgfHwgcGlwZWRQcm9wcyk7XG4gICAgICAgIHJldHVybiAoZXhlY3V0b3IubmV4dERvID8gZXhlY3V0b3IubmV4dERvKHJldHVyblZhbCkgOiByZXR1cm5WYWwpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgbGFzdCAnRG8nIGluIHRoZSBjaGFpblxuICAgIGZ1bmN0aW9uIGdldExhc3REbyAoKSB7XG4gICAgICAgIHZhciB0bXBEbyA9IGZpcnN0RG87XG4gICAgICAgIHdoaWxlICh0bXBEby5uZXh0RG8pIHsgdG1wRG8gPSB0bXBEby5uZXh0RG87IH1cbiAgICAgICAgcmV0dXJuIHRtcERvO1xuICAgIH1cblxuICAgIC8vIEFkZCBhIG5ldyAnRG8nIHRvIHRoZSBlbmQgb2YgdGhlIGNoYWluLlxuICAgIGV4ZWN1dG9yLkRvID0gZnVuY3Rpb24gKGFGdW5jdGlvbiwgcHJvcHMpIHtcbiAgICAgICAgZ2V0TGFzdERvKCkubmV4dERvID0gRG8oYUZ1bmN0aW9uLCBwcm9wcywgZmlyc3REbyk7XG4gICAgICAgIHJldHVybiBmaXJzdERvOyAgLy8gQWx3YXlzIHJldHVybiB0aGUgZmlyc3QgJ0RvJyBpbiB0aGUgY2hhaW5cbiAgICB9O1xuXG4gICAgZXhlY3V0b3IubmV4dERvID0gbnVsbDtcblxuICAgIHJldHVybiBleGVjdXRvcjtcbn1cblxuVGhpbmcuRG8gPSBEbztcblxuLypcbi8vIGNoYWluZWQsIGVhY2ggRG8gaGFzIGl0cyBvd24gcGFyYW1ldGVyc1xudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpO30sIHthcmcxOidoZWxsbzEnfSlcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCB7YXJnMjonaGVsbG8gdG8gMjIyMjInfSlcblxuLy8gY2hhaW5lZCwgd2l0aCBmaXJzdCBEbyBwaXBpbmcgcmVzdWx0cyB0byBzZWNvbmQgRG9cbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwgbnVsbClcblxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTsgcmV0dXJuIHtuZXdQcm9wOnByb3BzLnBpcGVkcHJvcCsyfX0pXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDMnLCBwcm9wcyk7fSlcbiovXG5cbm1vZHVsZS5leHBvcnRzID0gRG87XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG4vKlxuICAgIHNyYzogPGZpbGUgcGF0aD5cbiAgICBjZW50ZXI6IHRydWV8ZmFsc2VcbiAgICBzaXplOiBjb250YWlufGNvdmVyfHN0cmV0Y2hcbiovXG5cbmNsYXNzIEltZyBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgICB2YXIgcGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFNZ0FBQURJQ0FZQUFBQ3RXSzZlQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUJWOUpSRUZVZUp6dDNjMXUzVVFjaCtGL0VCSzlBc1FDVldmVlFxNENiaHh1QTRFcXNTbWgrN0l1aTlRQ1F2STdZeCtQUDU5SDhpNnlabzdtemZna2xuMVhWWjhLZU5ZWGF3OEF0a3dnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ2VETEVUOTcxMjBVc0x5bU8wanNJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJTSs3Vk5WM2F3OWlRZmRWOVhydFFXelZwOGJqTEM1VjlYdFZQZFE1SXJtdnFnOVY5YTdPRlVuenVoZklQeTcxR01jdzU2TkhNc1F4elBkTWtRaGtwRXY5TjQ2alIvSTBqck5GSXBBUkx2VjhIRWVONUtVNHpoU0pRQnBkS3NkeHRFaXV4WEdXU0FUUzRGSnRjUndsa3RZNHpoQ0pRSzY0MUxnNC9oM0o5NHVQOW5aajR6aDZKQUlKTGpVdGpyMUdNaldPSTBjaWtCZGM2clk0OWhiSnJYRWNOUktCUE9OUzg4U3hsMGptaXVPSWtUVE4rV3kzbXJ5cXFxOW1QTjgzVmZWVGJUT1MrNnI2dWFxK252R2NyejRmcDNLbUhhVHFjVEUvMUh5L1ZiZTRrOHk5YzN5cXF2ZFY5V2JKU1hUbUVpczRjaVRpYUNPUUs0NFlpVGphQ2FSQmowaitySFVpRWNjNEFtbDBoRWpFTVo1QVJ0aHpKT0tZUmlBamZWK1BpM3BQa1loak9vRk1zS2RJZXNUeFI1MGpqaXFCVExhSFNNUnhPNEhjWU11UmlHTWVBcmxScjBqdWJ4aVRPT1lqa0Jsc0tSSnh6RXNnTTlsQ0pPS1luMEJtdEdZazR1aERJRE5iSXhKeDlDT1FEdTVydVVoNnhmRjJsazlpL3dUU3lSS1JpS00vZ1hUVU14SnhMRU1nbmZXSTVFT0pZeWtDV1VDUFNNU3hESUVzWkt1UmlDTVR5SUo2Zkc4UVIxOENXZGhXSW5rb2NiUVF5QXJXamtRYzdRU3lrclVpRWNjNEFsblIwcEdJWXp5QnJHeXBTTVF4alVBMm9IY2s0cGhPSUJ2Ukt4SngzS2JwY3o3YjA5MlA1bTd0QVp5QkhhU2ZKUzZ4OXZ6T3hEVzV4RnJaa2wvU1JUS2VRRmEweHA5NVJUS09RRmF5NWo4S1JkSk9JQ3ZZd3EwbUlta2prSVd0SFlkSXhoSElncllTaDBqYUNXUWhXNHRESkcwRXNvQ3R4aUdTNndUU1dZODRIcXJQaTBWRjhuOEM2YWhYSEcvcmNUR0xwRCtCZE5JempvRkkraE5JQjB2RU1SQkpYd0taMlpKeERFVFNqMEJtdEVZY0E1SDBJWkNackJuSFFDVHpFOGdNdGhESFFDVHpFc2lOdHZpVWRaSE1SeUEzMkdJY0E1SE1ReUFUYlRtT2dVaHVKNUFKOWhESFFDUzNFY2hJZTRwaklKTHBCRExDSHVNWWlHUWFnVFRhY3h3RGtZd25rQVpIaUdNZ2tuRUVja1d2T040c09Za25STkpPSU1FUjR4aUlwSTFBWG5Ea09BWWl1VTRnenpoREhJTmVrUnpsaWZKTmN6N2IwOTAvZmo3bThsQlZQMVRWcnpPZWN5Ni9WTldQOWZpSzZybDhyS3EvWmp6ZkxweHBCNm1xZWwxVjcrcTRPOGRUYyswa3YxWFZ0d3VQdlNlWFdNR3RrZXdsanNHdGtSd3RqaXFCWERVMWt2ZTFyemdHVXlNNVloeFZBbWt5TnBLOXhqRVlHOGxSNDZnU1NMUFdTUFlleDZBMWtpUEhVU1dRVWE1RmNwUTRCdGNpT1hvY1ZRSVo3YVZJamhiSDRLVkl6aEJIbFVBbWVSckpVZU1ZUEkza0xIRlVDV1N5SVpLanh6RVlJamxUSEZVQ3VjbnJPa2NjZzdkMXJqaXFHdGY5WGJVdmZpK3Q1MGlhMXYzWjdzV0NVUVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFIQlhWWi9XSGdSc2xSMEVBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFZ3I4QmlRVnpxOUx2MU9vQUFBQUFTVVZPUks1Q1lJST0nO1xuXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICBwcm9wcy5zcmMgPSBwcm9wcy5zcmMgfHwgcGxhY2Vob2xkZXI7XG4gICAgLy8gcHJvcHMuYmFja2dyb3VuZCA9ICd1cmwoXCInICsgcHJvcHMuc3JjICsgJ1wiKSBuby1yZXBlYXQgJyArIChwcm9wcy5jZW50ZXIgPyAnY2VudGVyJyA6ICdsZWZ0IHRvcCcpO1xuICAgIC8vIHByb3BzLmJhY2tncm91bmRTaXplID0gKHByb3BzLnNpemUgPT09ICdjb250YWluJyB8fCBwcm9wcy5zaXplID09PSAnY292ZXInID8gcHJvcHMuc2l6ZSA6IChwcm9wcy5zaXplPT09J3N0cmV0Y2gnID8gJzEwMCUgMTAwJScgOiB1bmRlZmluZWQpICk7XG5cbiAgICB0aGlzLnByb3BzID0gVGhpbmcuY2xlYW51cChwcm9wcyk7XG5cbiAgICB0aGlzLnR5cGUgPSAnSW1nJztcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gMTtcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc3JjID0gcHJvcHMuc3JjO1xuICAgIHRoaXMueCA9IHByb3BzLnggfHwgdW5kZWZpbmVkO1xuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgdW5kZWZpbmVkO1xuICAgIHRoaXMudyA9IHByb3BzLncgfHwgdW5kZWZpbmVkO1xuICAgIHRoaXMuaCA9IHByb3BzLmggfHwgdW5kZWZpbmVkO1xuXG4gICAgSW1nLmxvYWRpbmcodGhpcyk7XG4gICAgbG9hZEltYWdlKHByb3BzLnNyYywgdGhpcy5vbmxvYWQuYmluZCh0aGlzKSwgdGhpcy5vbmVycm9yLmJpbmQodGhpcykpO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZShwcm9wcyk7XG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xuICB9XG5cbiAgb25sb2FkIChpbWcpIHtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltYWdlIExvYWRlZDonLCBpbWcsIGltZy5zcmMsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMudyA9IHRoaXMudyB8fCBpbWcud2lkdGg7XG4gICAgdGhpcy5oID0gdGhpcy5oIHx8IGltZy5oZWlnaHQ7XG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IHRoaXMuaCAvIHRoaXMudztcbiAgICB0aGlzLmNzcyh7XG4gICAgICAgIHdpZHRoOiB0aGlzLncsIFxuICAgICAgICBoZWlnaHQ6IHRoaXMuaCwgXG4gICAgICAgIGJhY2tncm91bmQ6ICd1cmwoJyAraW1nLnNyYysgJykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xuICAgIH0pO1xuICAgIEltZy5sb2FkZWQodGhpcyk7XG4gIH1cblxuICBvbmVycm9yIChpbWcpIHtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltZy5vbmVycm9yJywgaW1nLnNyYywgJ2ZhaWxlZCcpO1xuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgPSAwO1xuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSAxO1xuICAgIEltZy5sb2FkZWQodGhpcyk7XG4gIH1cblxuICBzZXRXaWR0aCAodykge1xuICAgIHRoaXMud2lkdGggPSB3O1xuICAgIHRoaXMuaGVpZ2h0ID0gdyAqIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgdGhpcy5jc3Moe1xuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGxvYWRpbmcgKGltZykge1xuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5sb2FkaW5nKCk6XCIsIGltZy5zcmMpO1xuICAgIEltZy5xdWV1ZWRJbWdzID0gSW1nLnF1ZXVlZEltZ3MgfHwgW107XG4gICAgaWYgKGltZyAmJiAhaW1nLmxvYWRlZCkge1xuICAgICAgICBJbWcucXVldWVkSW1ncy5wdXNoKGltZyk7XG4gICAgfSBcbiAgICByZXR1cm4gSW1nLnF1ZXVlZEltZ3MubGVuZ3RoO1xuICB9XG5cbiAgc3RhdGljIGxvYWRlZCAoaW1nKSB7XG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwiSU1HLmxvYWRlZCgpOlwiLCBpbWcuc3JjLCBJbWcucXVldWVkSW1ncy5sZW5ndGgpO1xuICAgIEltZy5xdWV1ZWRJbWdzID0gSW1nLnF1ZXVlZEltZ3MgfHwgW107XG4gICAgaWYgKGltZyAmJiBpbWcubG9hZGVkKSB7XG4gICAgICAgIHZhciBpbmRleCA9IEltZy5xdWV1ZWRJbWdzLmluZGV4T2YoaW1nKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIEltZy5xdWV1ZWRJbWdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEltZy5xdWV1ZWRJbWdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgSW1nLm9uQWxsTG9hZGVkKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aCA9PT0gMDsgICAgICAgIFxuICB9XG5cbiAgc3RhdGljIG9uQWxsTG9hZGVkICgpIHtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coXCJJTUcub25BbGxMb2FkZWQoKTogdHJpZ2dlcmVkXCIpO1xuICB9XG5cbn1cblRoaW5nLmFkZENsYXNzKEltZyk7XG5cblxuZnVuY3Rpb24gbG9hZEltYWdlIChzcmMsIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsbGJhY2sodGhpcyk7XG4gICAgfTtcbiAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXJyb3JDYWxsYmFjayh0aGlzKTtcbiAgICB9O1xuICAgIGltZy5zcmMgPSBzcmM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1nO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgTGFiZWwgZXh0ZW5kcyBUaGluZyB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcblx0XHRcdGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXG5cdFx0XHRmb250U2l6ZTogJzE0cHgnLFxuXHRcdFx0Y29sb3I6ICcjMDAwJ1xuXHRcdH07XG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcblx0XHR0aGlzLnR5cGUgPSAnTGFiZWwnO1xuXHRcdHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG5cdFx0dGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy50ZXh0KTtcblx0fVxuXG5cdHNldFRleHQgKHR4dCkge1xuXHRcdHRoaXMudGV4dCA9IHR4dDtcblx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHR4dCk7XG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhMYWJlbCk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuLkxpbmUge1xcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxufVxcblxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgTGluZSBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgICAvLyBleHBlY3RpbmcgcHJvcHM6IHsgeDE6MCwgeTE6MCwgeDI6NTAsIHkyOjUwIH1cbiAgICBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgPSBwcm9wcyAmJiAocHJvcHMuYmFja2dyb3VuZENvbG9yIHx8IHByb3BzLmNvbG9yIHx8ICdibGFjaycpO1xuICAgIHN1cGVyLmluaXQocHJvcHMpO1xuICAgIHRoaXMudHlwZSA9ICdMaW5lJztcbiAgICB0aGlzLmxlbmd0aCA9IDEwO1xuICAgIHRoaXMud2lkdGggPSAxO1xuICAgIHRoaXMuYW5nbGUgPSAwO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHRoaXMudHlwZSk7XG4gICAgdGhpcy5jcmVhdGVMaW5lKHByb3BzLngxLCBwcm9wcy55MSwgcHJvcHMueDIsIHByb3BzLnkyLCBwcm9wcy53aWR0aCk7XG4gIH1cblxuICBjcmVhdGVMaW5lICh4MSx5MSwgeDIseTIsIHdpZHRoKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IDI7XG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoKHgxLXgyKSooeDEteDIpICsgKHkxLXkyKSooeTEteTIpKTtcbiAgICB0aGlzLmFuZ2xlICA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiAxODAgLyBNYXRoLlBJO1xuICAgIHRoaXMuY3NzKHtcbiAgICAgICAgJ2xlZnQnOiAnJyArIHgxICsgJ3B4JyxcbiAgICAgICAgJ3RvcCc6ICcnICsgKHkxLSh0aGlzLndpZHRoLzIpKSArICdweCcsXG4gICAgICAgICd3aWR0aCc6ICcnICsgdGhpcy5sZW5ndGggKyAncHgnLFxuICAgICAgICAnaGVpZ2h0JzogJycgKyB0aGlzLndpZHRoICsgJ3B4JyxcbiAgICAgICAgLy8gcm90YXRlIGFyb3VuZCBzdGFydCBwb2ludCBvZiBsaW5lXG4gICAgICAgICd0cmFuc2Zvcm0tb3JpZ2luJzogJzAgNTAlJ1xuICAgICAgfSk7XG4gICAgdGhpcy5yb3RhdGVUbyh0aGlzLmFuZ2xlKTtcbiAgfVxuXG4gIHN0YXRpYyBjc3MgKCkge1xuICBcdHJldHVybiByZXF1aXJlKCcuL0xpbmUuY3NzJyk7XG4gIH1cbn1cblRoaW5nLmFkZENsYXNzKExpbmUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLlBhdHRlcm4uR3JhcGhQYXBlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAzO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHgsIDIwcHggMjBweCwgMjBweCAyMHB4O1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTJweCAtMnB4LCAtMnB4IC0ycHgsIC0xcHggLTFweCwgLTFweCAtMXB4O1xcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuMykgMXB4LCB0cmFuc3BhcmVudCAxcHgpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KTtcXG59XFxuXFxuLlBhdHRlcm4uR3JpZCB7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC0ycHggLTJweCwgLTJweCAtMnB4O1xcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpO1xcbn1cXG5cXG4uUGF0dGVybi5Tb2ZhIHtcXG4gIGJhY2tncm91bmQ6XFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgMTAwJSwgMjclKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA5JSkgMCAwLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDglLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgMTAlKSA1MCUgNTAlLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAzMCUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSAwLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAzMCUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgNTAlLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgNTAlIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSAxMDAlIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMTUlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMTUlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSA1MCUsXFxuICAgIGxpbmVhci1ncmFkaWVudCg0NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDAsXFxuICAgIGxpbmVhci1ncmFkaWVudCgtNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMwMDtcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXG59XFxuXFxuLlBhdHRlcm4uUG9sa2FEb3RzIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IFxcbiAgICByYWRpYWwtZ3JhZGllbnQod2hpdGUgMTUlLCB0cmFuc3BhcmVudCAxNiUpLFxcbiAgICByYWRpYWwtZ3JhZGllbnQod2hpdGUgMTUlLCB0cmFuc3BhcmVudCAxNiUpO1xcbiAgYmFja2dyb3VuZC1zaXplOiA2MHB4IDYwcHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwIDAsIDMwcHggMzBweDtcXG59XFxuXFxuLlBhdHRlcm4uQmx1ZUJhbGxzIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHJhZGlhbC1ncmFkaWVudCgjYWNmIDc3JSwgcmdiYSg4OCw5OSwyNTUsLjg4KSA4MCUsIHRyYW5zcGFyZW50IDgzJSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxufVxcblxcbi5QYXR0ZXJuLlN0cmlwZXMge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MCUsIHJnYmEoMjU1LDI1NSwyNSwxKSA1MCUpO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxNSU7XFxufVxcblxcbi5QYXR0ZXJuLlBsYWlkUmVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgyLCA1NyUsIDQwJSk7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCh0cmFuc3BhcmVudCwgdHJhbnNwYXJlbnQgNTBweCwgcmdiYSgwLDAsMCwuNCkgNTBweCwgcmdiYSgwLDAsMCwuNCkgNTNweCwgdHJhbnNwYXJlbnQgNTNweCwgdHJhbnNwYXJlbnQgNjNweCwgcmdiYSgwLDAsMCwuNCkgNjNweCwgcmdiYSgwLDAsMCwuNCkgNjZweCwgdHJhbnNwYXJlbnQgNjZweCwgdHJhbnNwYXJlbnQgMTE2cHgsIHJnYmEoMCwwLDAsLjUpIDExNnB4LCByZ2JhKDAsMCwwLC41KSAxNjZweCwgcmdiYSgyNTUsMjU1LDI1NSwuMikgMTY2cHgsIHJnYmEoMjU1LDI1NSwyNTUsLjIpIDE2OXB4LCByZ2JhKDAsMCwwLC41KSAxNjlweCwgcmdiYSgwLDAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyNTUsLjIpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjU1LC4yKSAxODJweCwgcmdiYSgwLDAsMCwuNSkgMTgycHgsIHJnYmEoMCwwLDAsLjUpIDIzMnB4LCB0cmFuc3BhcmVudCAyMzJweCksXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMjcwZGVnLCB0cmFuc3BhcmVudCwgdHJhbnNwYXJlbnQgNTBweCwgcmdiYSgwLDAsMCwuNCkgNTBweCwgcmdiYSgwLDAsMCwuNCkgNTNweCwgdHJhbnNwYXJlbnQgNTNweCwgdHJhbnNwYXJlbnQgNjNweCwgcmdiYSgwLDAsMCwuNCkgNjNweCwgcmdiYSgwLDAsMCwuNCkgNjZweCwgdHJhbnNwYXJlbnQgNjZweCwgdHJhbnNwYXJlbnQgMTE2cHgsIHJnYmEoMCwwLDAsLjUpIDExNnB4LCByZ2JhKDAsMCwwLC41KSAxNjZweCwgcmdiYSgyNTUsMjU1LDI1NSwuMikgMTY2cHgsIHJnYmEoMjU1LDI1NSwyNTUsLjIpIDE2OXB4LCByZ2JhKDAsMCwwLC41KSAxNjlweCwgcmdiYSgwLDAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyNTUsLjIpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjU1LC4yKSAxODJweCwgcmdiYSgwLDAsMCwuNSkgMTgycHgsIHJnYmEoMCwwLDAsLjUpIDIzMnB4LCB0cmFuc3BhcmVudCAyMzJweCksXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMTI1ZGVnLCB0cmFuc3BhcmVudCwgdHJhbnNwYXJlbnQgMnB4LCByZ2JhKDAsMCwwLC4yKSAycHgsIHJnYmEoMCwwLDAsLjIpIDNweCwgdHJhbnNwYXJlbnQgM3B4LCB0cmFuc3BhcmVudCA1cHgsIHJnYmEoMCwwLDAsLjIpIDVweCk7XFxufVxcblxcbi5QYXR0ZXJuLkRpYWdvbmFsU3RyaXBlcyB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGJsYWNrIDI1JSwgdHJhbnNwYXJlbnQgMjUlLCB0cmFuc3BhcmVudCA1MCUsIGJsYWNrIDUwJSwgYmxhY2sgNzUlLCB0cmFuc3BhcmVudCA3NSUsIHRyYW5zcGFyZW50KTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTYlIDE2JTsgIC8qIG11c3QgbWF0Y2ggYXNwZWN0IHJhdGlvIG9mIGNvbnRhaW5pbmcgZWxlbWVudCBvciBsaW5lcyB3aWxsIGJyZWFrICovXFxuICAgICAgICAvKiBpZS4gMzIlIDE2JSBmb3IgYW4gZWxlbWVudCB3aXRoIHc9MTAwIGg9MjAwICovXFxuICAgICAgICAvKiBQb3dlcnMgb2YgMiB3b3JrIGJlc3QgKG90aGVyIHZhbHVlcywgbGlrZSA3IG9yIDIzLCBtYWtlIGphZ2d5IGFsaWFzaW5nKSAqL1xcbn1cXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIFBhdHRlcm4gZXh0ZW5kcyBUaGluZyB7XG4gIGluaXQgKHByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgbGVmdDogJzBweCcsXG4gICAgICB0b3A6ICcwcHgnLFxuICAgICAgY29sb3I6ICcjZGRkJyxcbiAgICAgIHBhdHRlcm46ICdHcmFwaFBhcGVyJ1xuICAgIH07XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG4gICAgdGhpcy50eXBlID0gJ1BhdHRlcm4nO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHByb3BzLnBhdHRlcm4pO1xuICAgIGlmIChwcm9wcy5wYXR0ZXJuID09PSAnZ3JpZCcpIHtcbiAgICAgIHRoaXMuY3NzKCBQYXR0ZXJuLm1ha2VHcmlkQ1NTKHByb3BzLmNlbGxXaWR0aCB8fCAxMDAsIHByb3BzLmNlbGxIZWlnaHQgfHwgMTAwLCBwcm9wcy5saW5lV2lkdGggfHwgMikgKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbWFrZUdyaWRDU1MgKGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgbGluZVdpZHRoKSB7XG4gICAgdmFyIHByb3BzID0ge307XG4gICAgdmFyIHBvcyA9ICctJyArIGxpbmVXaWR0aCArICdweCc7XG4gICAgcHJvcHMuYmFja2dyb3VuZFNpemUgPSAnJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCwgJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCc7XG4gICAgcHJvcHMuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zICsgJyAnICsgcG9zICsgJywnICsgcG9zICsgJyAnICsgcG9zO1xuICAgIHByb3BzLmJhY2tncm91bmRJbWFnZSA9XG4gICAgICAnbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpICcgK2xpbmVXaWR0aCsgJ3B4LCB0cmFuc3BhcmVudCAnICtsaW5lV2lkdGgrICdweCksJyArXG4gICAgICAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC41KSAnICtsaW5lV2lkdGgrICdweCwgdHJhbnNwYXJlbnQgJyArbGluZVdpZHRoKyAncHgpJztcbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICBzdGF0aWMgY3NzICgpIHtcbiAgICByZXR1cm4gcmVxdWlyZSgnLi9QYXR0ZXJuLmNzcycpO1xuICB9XG59XG5UaGluZy5hZGRDbGFzcyhQYXR0ZXJuKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xuXG5cbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XG5cdFx0dGhpcy5UID0gVGltZXIubWFrZSh7Y2FsbGJhY2s6IHRoaXMudHJpZ2dlci5iaW5kKHRoaXMpLCBkZWxheTogdGhpcy5kZWxheX0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Z28gKCkge1xuXHRcdHRoaXMuVC5nbygpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c3RvcCAoKSB7XG5cdFx0dGhpcy5ULnN0b3AoKTtcblx0fVxuXG5cdHRyaWdnZXIgKCkge1xuXHRcdHRoaXMuY2FsbGJhY2soKTtcblx0XHR0aGlzLlQuZ28oKTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoUHVsc2FyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQdWxzYXI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG52YXIgUEkgPSAzLjE0MTU5MjY1MzU5O1xudmFyIEhBTEZQSSA9IFBJLzIuMDtcblxuY2xhc3MgUmFuZCB7XG5cdHN0YXRpYyByYW5kSXRlbShhcnIpIHtcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYXJyWyBSYW5kLnJhbmRJbnQoMCwgYXJyLmxlbmd0aC0xKSBdO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGluY2x1ZGVkKVxuXHQvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcblx0c3RhdGljIHJhbmRJbnQobWluLCBtYXgpIHtcblx0XHRtaW4gPSBNYXRoLmNlaWwobWlufHwwKTtcblx0XHRtYXggPSBNYXRoLmZsb29yKG1heHx8MSk7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG5cdH1cblxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAuOTk5OTk5XG5cdHN0YXRpYyByYW5kRmxvYXQoKSB7XG5cdCAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcblx0fVxuXG5cdHN0YXRpYyByYW5kUGVyY2VudCh0aHJlc2hvbGQpIHtcblx0XHRyZXR1cm4gUmFuZC5yYW5kSW50KDEsMTAwKSA8IHRocmVzaG9sZDtcblx0fVxuXG5cdC8vIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiBtYXhEaXN0YW5jZSBvZiB0YXJnZXQgKGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgdGFyZ2V0KVxuXHRzdGF0aWMgcmFuZENsb3NlVG8odGFyZ2V0LCBtYXhEaXN0YW5jZSkge1xuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXG5cdFx0Ly8gcmV0dXJuIHRhcmdldCArIChtYXhEaXN0YW5jZSAqIHJhbmRTaW4yKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgc29tZXdoYXQgY29uY2VudHJhdGVkIHRvd2FyZHMgY2VudGVyIFxuXHRcdHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiBSYW5kLnJhbmRQb3cyKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgd2l0aCBzaGFycCBjb25jZW50cmF0aW9uIGFyb3VuZCBjZW50ZXJcblx0fVxuXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcblx0c3RhdGljIHJhbmRQb3coKSB7XG5cdFx0cmV0dXJuIE1hdGgucG93KDEuMCAtIFJhbmQucmFuZEZsb2F0KCksIDQpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gMCBhbmQgMSwgZGlzdHJpYnV0ZWQgdG93YXJkIDFcblx0c3RhdGljIHJhbmRTaW4oKSB7XG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcblx0c3RhdGljIHJhbmRQb3cyKCkge1xuXHRcdHJldHVybiBSYW5kLnJhbmRQb3coKSAtIFJhbmQucmFuZFBvdygpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgMFxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcblx0XHRyZXR1cm4gKChSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkpIC0gMy4wKSAvIDMuMDtcblx0fVxuXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBjbG9zZXIgdG8gMFxuXHRzdGF0aWMgcmFuZFNpbjIoKSB7XG5cdFx0cmV0dXJuIFJhbmQucmFuZFNpbigpIC0gUmFuZC5yYW5kU2luKCk7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKFJhbmQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmQ7XG4iLCJ2YXIgZWxlbWVudENvdW50ZXIgPSAwO1xuXG5jbGFzcyBUaGluZyB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBpbml0IChwcm9wcykge1xuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG4gICAgdGhpcy50eXBlID0gJ1RoaW5nJztcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gIH1cblxuICBpbml0aWFsaXplIChwcm9wcykge1xuICAgIHByb3BzID0gcHJvcHMgfHwge307XG4gICAgLy8gQ1NTIHByb3BzIGdvIGludG8gdGhpcy5wcm9wc1xuICAgIHRoaXMucHJvcHMgPSBUaGluZy5jbGVhbnVwKHByb3BzKTtcbiAgICAvLyBrZWVwIHRoZXNlIHByb3BlcnRpZXMgb24gJ3RoaXMnXG4gICAgdGhpcy5yb3RhdGlvbiA9IHByb3BzLnJvdGF0ZSB8fCAwO1xuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBwcm9wcy5zY2FsZSB8fCAxO1xuICAgIHRoaXMueCA9IHByb3BzLnggfHwgMDtcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IDA7XG4gICAgdGhpcy4kZWxlbWVudCA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgcGFyZW50RWxlbWVudCA9ICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC4kZWxlbWVudCkgfHwgJChkb2N1bWVudC5ib2R5KTtcbiAgICBwYXJlbnRFbGVtZW50LmFwcGVuZCh0aGlzLiRlbGVtZW50KTtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh0aGlzLnByb3BzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxuICB1blJlbmRlciAoKSB7XG4gICAgaWYgKHRoaXMuJGVsZW1lbnQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBnZXREaW1lbnNpb25zICgpIHtcbiAgICByZXR1cm4ge3c6IHRoaXMuJGVsZW1lbnQud2lkdGgoKSwgaDogdGhpcy4kZWxlbWVudC5oZWlnaHQoKX07XG4gIH1cblxuICBnZXRCb3VuZGluZ0JveCAoKSB7XG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxuICAgIHZhciBzY3JvbGx0b3AgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcbiAgICB2YXIgc2Nyb2xsbGVmdCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcbiAgICB2YXIgYm91bmRzID0gdGhpcy4kZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogYm91bmRzLmxlZnQrc2Nyb2xsbGVmdCxcbiAgICAgIHk6IGJvdW5kcy50b3Arc2Nyb2xsdG9wLFxuICAgICAgdzogYm91bmRzLndpZHRoLFxuICAgICAgaDogYm91bmRzLmhlaWdodCxcbiAgICAgIGJvdHRvbTogYm91bmRzLmJvdHRvbStzY3JvbGx0b3AsXG4gICAgICByaWdodDogYm91bmRzLnJpZ2h0K3Njcm9sbGxlZnRcbiAgICB9O1xuICB9XG5cbiAgcm90YXRlIChkZWdyZWVzKSB7XG4gICAgdGhpcy5yb3RhdGlvbiArPSBkZWdyZWVzO1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByb3RhdGVUbyAoYW5nbGUpIHtcbiAgICB0aGlzLnJvdGF0aW9uID0gYW5nbGU7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNjYWxlIChmYWN0b3IpIHtcbiAgICB0aGlzLnNjYWxlRmFjdG9yICs9IGZhY3RvcjtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2NhbGVUbyAoZmFjdG9yKSB7XG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IGZhY3RvcjtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdHJhbnNsYXRlICh4LCB5KSB7XG4gICAgdGhpcy54ICs9IHg7XG4gICAgdGhpcy55ICs9IHk7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRyYW5zbGF0ZVRvICh4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0cmFuc2Zvcm0gKCkge1xuICAgIHRoaXMuY3NzKHtcbiAgICAgIHRyYW5zZm9ybTogVGhpbmcubWFrZVRyYW5zZm9ybUNTUyh0aGlzLnJvdGF0aW9uLCB0aGlzLnNjYWxlRmFjdG9yLCB0aGlzLngsIHRoaXMueSlcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNzcyAocHJvcHMpIHtcbiAgICB0aGlzLnByb3BzID0gJC5leHRlbmQodGhpcy5wcm9wcywgcHJvcHMpO1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHByb3BzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGh0bWwgKCkge1xuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nO1xuICB9XG5cbiAgc3RhdGljIGNzcyAoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzdGF0aWMgbWFrZSAoKSB7XG4gICAgdmFyIGNscyA9IHRoaXM7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xuICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgc3RhdGljIGFkZENsYXNzIChjbHMpIHtcbiAgICBUaGluZy5jbGFzc2VzID0gVGhpbmcuY2xhc3NlcyB8fCB7fTtcbiAgICBUaGluZy5jbGFzc2VzW2Nscy5uYW1lXSA9IGNscztcblxuICAgIC8vIGxvYWQgdGhlIGNsYXNzIHN0eWxlcyAodGhlc2UgYXJlIGluY2x1ZGVkIGluIHRoZSBidW5kbGUgYXQgYnVpbGQgdGltZSlcbiAgICBjbHMuY3NzICYmIFRoaW5nLmFkZENTU1N0cmluZyhjbHMuY3NzKCksIGNscy5uYW1lKTtcblxuICAgIC8vIGFkZCBhZGRpdGlvbmFsIGNzcyBmaWxlIGF0IGxvYWQgdGltZVxuICAgIFRoaW5nLmFkZENTU0ZpbGUoY2xzLm5hbWUgKyAnLycgKyBjbHMubmFtZSArICcuY3NzJywgJ2NzcycrY2xzLm5hbWUpO1xuICB9XG5cbiAgc3RhdGljIGdldENsYXNzIChuYW1lKSB7XG4gICAgcmV0dXJuIFRoaW5nLmNsYXNzZXNbbmFtZV07XG4gIH1cblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDU1MgbWFuYWdlbWVudCBmdW5jdGlvbnNcblxuICBzdGF0aWMgbWFrZVN0eWxlcyAocHJvcHMpIHtcbiAgICB2YXIgc3R5bGVzID0gcHJvcHMgfHwge307XG4gICAgJC5leHRlbmQoc3R5bGVzLCB7XG4gICAgICAvLyBsZWZ0OiBwcm9wcy5sZWZ0IHx8IChwcm9wcy54ICYmIChwcm9wcy54ICsgXCJweFwiKSksXG4gICAgICAvLyB0b3A6IHByb3BzLnRvcCB8fCAocHJvcHMueSAmJiAocHJvcHMueSArIFwicHhcIikpLFxuICAgICAgd2lkdGg6IHByb3BzLndpZHRoIHx8IChwcm9wcy53ICYmIChwcm9wcy53ICsgXCJweFwiKSksXG4gICAgICBoZWlnaHQ6IHByb3BzLmhlaWdodCB8fCAocHJvcHMuaCAmJiAocHJvcHMuaCArIFwicHhcIikpLFxuICAgICAgekluZGV4OiBwcm9wcy56SW5kZXggfHwgcHJvcHMueixcbiAgICAgIGJhY2tncm91bmRDb2xvcjogcHJvcHMuYmFja2dyb3VuZENvbG9yLFxuICAgICAgdHJhbnNmb3JtOiBwcm9wcy50cmFuc2Zvcm0gfHwgKFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1MocHJvcHMucm90YXRlLCBwcm9wcy5zY2FsZSwgcHJvcHMueCwgcHJvcHMueSkpLFxuICAgICAgcG9zaXRpb246IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSdcbiAgICB9KTtcbiAgICBkZWxldGUgc3R5bGVzLnJvdGF0ZTtcbiAgICBkZWxldGUgc3R5bGVzLnNjYWxlO1xuICAgIGRlbGV0ZSBzdHlsZXMueDtcbiAgICBkZWxldGUgc3R5bGVzLnk7XG4gICAgZGVsZXRlIHN0eWxlcy56O1xuICAgIGRlbGV0ZSBzdHlsZXMudztcbiAgICBkZWxldGUgc3R5bGVzLmg7XG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxuXG4gIHN0YXRpYyBtYWtlVHJhbnNmb3JtQ1NTIChyb3RhdGUsIHNjYWxlLCB0eCwgdHkpIHtcbiAgICB2YXIgdHJhbnNmb3JtID0gJyc7XG4gICAgdHJhbnNmb3JtICs9ICh0eCB8fCB0eSkgPyAoVGhpbmcubWFrZVRyYW5zbGF0ZUNTUyh0eCwgdHkpICsgJyAnKSA6ICcnO1xuICAgIHRyYW5zZm9ybSArPSBUaGluZy5pc051bWVyaWMocm90YXRlKSA/IChUaGluZy5tYWtlQW5nbGVDU1Mocm90YXRlKSArICcgJykgOiAnJztcbiAgICB0cmFuc2Zvcm0gKz0gc2NhbGUgPyAoVGhpbmcubWFrZVNjYWxlQ1NTKHNjYWxlKSArICcgJykgOiAnJztcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xuICB9XG5cbiAgc3RhdGljIG1ha2VBbmdsZUNTUyAoYW5nbGUpIHtcbiAgICByZXR1cm4gJ3JvdGF0ZSgnK2FuZ2xlKydkZWcpJztcbiAgfVxuXG4gIHN0YXRpYyBtYWtlU2NhbGVDU1MgKHNjYWxlKSB7XG4gICAgcmV0dXJuICdzY2FsZSgnK3NjYWxlKycpJztcbiAgfVxuXG4gIHN0YXRpYyBtYWtlVHJhbnNsYXRlQ1NTICh4LCB5KSB7XG4gICAgeCA9IHggfHwgJzAnO1xuICAgIHkgPSB5IHx8ICcwJztcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnKyB4ICsgJ3B4LCAnICsgeSArJ3B4KSc7XG4gIH1cblxuICBzdGF0aWMgbWFrZUVsZW1lbnQgKGh0bWwsIHByb3BzLCB0eXBlKSB7XG4gICAgdmFyICRlbGVtZW50ID0gJChodG1sKVxuICAgICAgLmNzcyhUaGluZy5tYWtlU3R5bGVzKHByb3BzKSlcbiAgICAgIC5hZGRDbGFzcyh0eXBlIHx8ICdyYW5kb20nKVxuICAgICAgLmF0dHIoJ2lkJywgKHR5cGUgfHwgJ3JhbmRvbScpICsgKCsrZWxlbWVudENvdW50ZXIpKTtcbiAgICByZXR1cm4gJGVsZW1lbnQ7XG4gIH1cblxuICBzdGF0aWMgaXNOdW1lcmljKG4pIHtcbiAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIG5lY2Vzc2FyeSBDU1MgcHJvcGVydGllcyBhcmUgcHJlc2VudCBvciBkZWZhdWx0ZWQgdG8gc29tZXRoaW5nIHNhbmVcbiAgc3RhdGljIGNsZWFudXAgKHByb3BzKSB7XG4gICAgdmFyIGNwID0gcHJvcHMgfHwge307XG4gICAgY3AucG9zaXRpb24gPSBwcm9wcy5wb3NpdGlvbiB8fCAnYWJzb2x1dGUnOyAgIC8vIGRlZmF1bHQgdG8gYWJzb2x1dGUgcG9zaXRpb25pbmdcbiAgICAvLyBjcC54ID0gcHJvcHMueCB8fCBwcm9wcy5sZWZ0IHx8IDA7XG4gICAgLy8gY3AueSA9IHByb3BzLnkgfHwgcHJvcHMudG9wIHx8IDA7XG4gICAgLy8gY3AueiA9IHByb3BzLnogfHwgcHJvcHMuekluZGV4O1xuICAgIC8vIGNwLncgPSBwcm9wcy53IHx8IHByb3BzLndpZHRoO1xuICAgIC8vIGNwLmggPSBwcm9wcy5oIHx8IHByb3BzLmhlaWdodDtcbiAgICBjcC5yb3RhdGlvbiA9IHByb3BzLnJvdGF0aW9uIHx8IDA7XG4gICAgY3Auc2NhbGUgPSBwcm9wcy5zY2FsZSB8fCAxO1xuICAgIHJldHVybiBjcDtcbiAgfVxuXG4gIHN0YXRpYyBhZGRDU1NGaWxlKGZpbGVOYW1lLCBpZCkge1xuICAgICB2YXIgbGluayA9ICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cIicgKyBmaWxlTmFtZSArICdcIiBpZD1cIicgKyBpZCArICdcIj4nO1xuICAgICAkKCdoZWFkJykuZmluZCgnIycgKyBpZCkucmVtb3ZlKCk7XG4gICAgICQoJ2hlYWQnKS5hcHBlbmQobGluayk7XG4gIH1cblxuICBzdGF0aWMgYWRkQ1NTU3RyaW5nKGNzc1N0cmluZywgaWQpIHtcbiAgICBpZiAoY3NzU3RyaW5nKSB7XG4gICAgICAvLyB2YXIgZG9jID0gd2luZG93LmRvY3VtZW50O1xuICAgICAgdmFyIHN0eWxlRWwgPSAkKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+JyArY3NzU3RyaW5nKyAnPC9zdHlsZT4nKVxuICAgICAgICAuYXR0cignaWQnLCAoaWQgfHwgJ1RoaW5nJykgKyAnLXN0eWxlcycpO1xuICAgICAgJCgnaGVhZCcpLmFwcGVuZChzdHlsZUVsKTtcbiAgICB9XG4gIH1cblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG59XG5UaGluZy5hZGRDbGFzcyhUaGluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGhpbmc7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xudmFyIEFjdGlvbiA9IHJlcXVpcmUoJy4uL0FjdGlvbi9BY3Rpb24uanMnKTtcblxuY2xhc3MgVGltZXIgZXh0ZW5kcyBBY3Rpb24ge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHByb3BzID0gcHJvcHMgfHwge307XG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXHRcdHRoaXMuZGVsYXkgPSBwcm9wcy5kZWxheSB8fCAxMDAwO1xuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnbyAoKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XG5cdFx0dGhpcy50aW1lcklEID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLmRlbGF5KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHN0b3AgKCkge1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKFRpbWVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcbnJlcXVpcmUoJy4vQm94L0JveC5qcycpO1xucmVxdWlyZSgnLi9BcnJvdy9BcnJvdy5qcycpO1xucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcbnJlcXVpcmUoJy4vQWN0aW9uL0FjdGlvbi5qcycpO1xucmVxdWlyZSgnLi9UaW1lci9UaW1lci5qcycpO1xucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcbnJlcXVpcmUoJy4vUHVsc2FyL1B1bHNhci5qcycpO1xucmVxdWlyZSgnLi9Eby9Eby5qcycpO1xucmVxdWlyZSgnLi9MYWJlbC9MYWJlbC5qcycpO1xucmVxdWlyZSgnLi9MaW5lL0xpbmUuanMnKTtcbnJlcXVpcmUoJy4vSW1nL0ltZy5qcycpO1xucmVxdWlyZSgnLi9QYXR0ZXJuL1BhdHRlcm4uanMnKTtcbnJlcXVpcmUoJy4vQkdJbWcvQkdJbWcuanMnKTtcblxud2luZG93LlRoaW5nID0gVGhpbmc7XG4iXX0=
