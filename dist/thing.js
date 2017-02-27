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

},{"../Thing/Thing.js":19}],2:[function(require,module,exports){
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

},{"../Thing/Thing.js":19,"./Arrow.css":2}],4:[function(require,module,exports){
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

},{"../Thing/Thing.js":19}],5:[function(require,module,exports){
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

},{"../Thing/Thing.js":19}],6:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Circle extends Thing {
  init (props) {
    var defaultProps = {
      text: '',
      left: 0,
      top: 0,
      r: 25,
      fontFamily: 'Calibri, Arial, sans-serif',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0f0',
      backgroundColor: '#222',
      borderColor: '#BADA55',
      borderWidth: 5
    };

    props = $.extend({}, defaultProps, props);
    super.init(props);
    this.type = 'Circle';
    this.text = props.text;

    this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class

    // apply circle css
    var offset = props.r + props.borderWidth;
    this.css({
        'left': '' + (props.left-offset) + 'px',
        'top': '' + (props.top-offset) + 'px',
        'width': '' + props.r*2 + 'px',
        'height': '' + props.r*2 + 'px',
        'lineHeight': '' + props.r*2 + 'px',
        'border': props.borderWidth + 'px solid ' + props.borderColor,
        'borderRadius': '10000px',
        'textAlign': 'center',
        'overflow': 'hidden'
      });

    this.setText(this.text);
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
Thing.addClass(Circle);

module.exports = Circle;

},{"../Thing/Thing.js":19}],7:[function(require,module,exports){
module.exports = "\r\n.DemoBox {\r\n  display: inline-block;\r\n  position: relative;\r\n  margin: 20px;\r\n  width: 200px; \r\n  height: 200px; \r\n  border: 2px dashed #eee;\r\n}\r\n";

},{}],8:[function(require,module,exports){
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

},{"../Box/Box.js":5,"../Thing/Thing.js":19,"./DemoBox.css":7}],9:[function(require,module,exports){
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

},{"../Thing/Thing.js":19}],10:[function(require,module,exports){
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
    this.aspectRatio = img.height / img.width;  // aspect ratio of original image
    this.w = this.w || img.width;
    this.h = this.h || (this.w * this.aspectRatio);
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
    return this;
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

},{"../Thing/Thing.js":19}],11:[function(require,module,exports){
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

},{"../Thing/Thing.js":19}],12:[function(require,module,exports){
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
    this.createLine(props.x1, props.y1, props.x2, props.y2, props.width, props.arrow, props.shorten);
  }

  createLine (x1,y1, x2,y2, width, arrow, shorten) {
    this.width = width || 2;
    this.length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) - (arrow? this.width*2 : 0);  // shorten the length to make room for arrowhead
    this.angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    this.length -= shorten || 0;  // shorten the line a bit (makes room for arrowhead)
    this.css({
        'left': '' + x1 + 'px',
        'top': '' + (y1-(this.width/2)) + 'px',
        'width': '' + this.length + 'px',
        'height': '' + this.width + 'px',
        // rotate around start point of line
        'transform-origin': '0 50%'
      });
    this.rotateTo(this.angle);
    if (arrow) {
      this.addArrowHead(this.length, this.width, this.width*2, this.props.backgroundColor);
    }
  }

  // len of line, width of line, size of triangle (ie. 10 will be 10px wide and 20px high)
  addArrowHead (len, width, size, color) {
    this.arrowHead = $('<div></div>');
    this.arrowHead.css({
      position: 'absolute',
      width: 0, 
      height: 0, 
      fontSize: 0,
      lineHeight: 0,
      left: len + 'px',
      top: -(size-(width/2)) + 'px',
      borderBottom: size + 'px solid transparent',
      borderTop: size + 'px solid transparent',
      borderLeft: size + 'px solid ' + color
    });
    this.$element.empty().append(this.arrowHead);
  }

  static css () {
  	return require('./Line.css');
  }
}
Thing.addClass(Line);

module.exports = Line;

},{"../Thing/Thing.js":19,"./Line.css":12}],14:[function(require,module,exports){
module.exports = ".Pattern.GraphPaper {\r\n  background-color: #003;\r\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\r\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\r\n  background-image: \r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\r\n}\r\n\r\n.Pattern.Grid {\r\n  background-size: 100px 100px, 100px 100px;\r\n  background-position: -2px -2px, -2px -2px;\r\n  background-image: \r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\r\n}\r\n\r\n.Pattern.SofaDark {\r\n  background:\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Sofa {\r\n  background:\r\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.PolkaDots {\r\n  background-image: \r\n    radial-gradient(white 15%, transparent 17%),\r\n    radial-gradient(white 15%, transparent 17%);\r\n  background-size: 60px 60px;\r\n  background-position: 0 0, 30px 30px;\r\n}\r\n\r\n.Pattern.BlueBalls {\r\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Stripes {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.PlaidRed {\r\n  background-color: hsl(0, 86%, 34%);\r\n  background-image: \r\n    repeating-linear-gradient(transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(270deg, transparent, \r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px, \r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px, \r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px, \r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px, \r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(125deg, transparent, \r\n      transparent 2px, rgba(0,0,0,.2) 2px, \r\n      rgba(0,0,0,.2) 3px, transparent 3px, \r\n      transparent 5px, rgba(0,0,0,.2) 5px);\r\n}\r\n\r\n.Pattern.DiagonalStripes {\r\n  background-image: linear-gradient(45deg, black 25%, transparent 25.5%, transparent 50%, black 50.5%, black 75%, transparent 75.5%, transparent);\r\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\r\n        /* ie. 32% 16% for an element with w=100 h=200 */\r\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\r\n}\r\n";

},{}],15:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Pattern extends Thing {
  init (props) {
    var defaultProps = {
      position: 'absolute',
      left: '0px',
      top: '0px',
      color: '#ddd',
      pattern: 'GraphPaper',
      cellWidth: 100,
      cellHeight: 100,
      lineWidth: 2
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'Pattern';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.addClass(props.pattern);
    if (props.pattern === 'grid') {
      this.css( Pattern.makeGridCSS(props.cellWidth, props.cellWidth, props.lineWidth) );
    }
  }

  render () {
    // render first, this will set a parent element
    super.render();
    // then adjust pattern to fill parent with a square aspect ratio
    var size = Math.max(this.parent.$element.width(), this.parent.$element.height());
    this.css({width: size, height: size});
    return this;
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

},{"../Thing/Thing.js":19,"./Pattern.css":14}],16:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":19,"../Timer/Timer.js":20}],17:[function(require,module,exports){
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

},{"../Thing/Thing.js":19}],18:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class TextPane extends Thing {
    init (props) {
        var defaultProps = {
            fontFamily: 'Calibri, Verdana, Arial, sans-serif',
            fontSize: '24px',
            fontWeight: 'normal',
            color: 'rgb(200, 200, 200)',
            overflow: 'hidden',
            w: 100,
            h: 100
        };
        props = $.extend({}, defaultProps, props);
        super.init(props);
        this.type = 'TextPane';
        this.text = props.text;
        this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
    }

    fillText () {
        var maxHeight = this.$element.height();
        var max = 1000;
        var $span = $('<span></span>');
        var spanHeight = 0;

        // element has to be appended to body prior, or spanHeight will be 0
        this.$element.append($span);
        while (spanHeight < maxHeight && max-- > 0) {
            $span.append(this.text);
            spanHeight = $span.height();
        }
    }

    render () {
        super.render();
        this.fillText(this.text);
    }
}

Thing.addClass(TextPane);

module.exports = TextPane;

},{"../Thing/Thing.js":19}],19:[function(require,module,exports){
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

  getPosition () {
    // relative to page
    var xy = this.$element.offset();
    var z = this.$element.css('z-index');
    z = z ? parseInt(z) : undefined;
    return [xy.left, xy.top, z];
  }

  // return the element's CSS transform matrix as array of 6 values
  getCSSTransform () {
    var mStr = this.$element.css('transform').match(/-?[\d\.]+/g);
    var mVal = [];
    for (var i=0; i < mStr.length; i++) {
      mVal[i] = parseFloat(mStr[i]);
    }
    return mVal;  
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

  // NOTE: translation coords are relative to the element's position in the document flow.
  // They are not the same as setting left/top values, which are absolute coordinates
  // relative to the parent element.
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

},{}],20:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":19}],21:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Triangle extends Thing {
	init (props) {
		var defaultProps = {
			size: 10,
			color: '#BADA55'
		};
		props = $.extend(props, defaultProps);
		this.initialize(props);
		this.type = 'Triangle';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.makeTriangle(this.props.size, this.props.color);  // have to make element before calling this
	}

	render () {
		super.render();
		return this;
	}

	makeTriangle (size, color) {
		color = color || '#BADA55';
		size = size || 10;
		this.css({
			width: 0, 
			height: 0, 
			fontSize: 0,
			lineHeight: 0,
			borderBottom: size + 'px solid transparent',
			borderTop: size + 'px solid transparent',
			borderLeft: size + 'px solid ' + color
		});
		return this;
	}
}
Thing.addClass(Triangle);

module.exports = Triangle;

},{"../Thing/Thing.js":19}],22:[function(require,module,exports){
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
require('./TextPane/TextPane.js');
require('./Circle/Circle.js');
require('./Triangle/Triangle.js');

window.Thing = Thing;

},{"./Action/Action.js":1,"./Arrow/Arrow.js":3,"./BGImg/BGImg.js":4,"./Box/Box.js":5,"./Circle/Circle.js":6,"./DemoBox/DemoBox.js":8,"./Do/Do.js":9,"./Img/Img.js":10,"./Label/Label.js":11,"./Line/Line.js":13,"./Pattern/Pattern.js":15,"./Pulsar/Pulsar.js":16,"./Rand/Rand.js":17,"./TextPane/TextPane.js":18,"./Thing/Thing.js":19,"./Timer/Timer.js":20,"./Triangle/Triangle.js":21}]},{},[22])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvVGV4dFBhbmUvVGV4dFBhbmUuanMiLCJzcmMvbGliL1RoaW5nL1RoaW5nLmpzIiwic3JjL2xpYi9UaW1lci9UaW1lci5qcyIsInNyYy9saWIvVHJpYW5nbGUvVHJpYW5nbGUuanMiLCJzcmMvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEFjdGlvbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0fVxyXG5cclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dGhpcy5wcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5nbygpJyk7XHJcblx0fVxyXG5cclxuXHRzdG9wICgpIHtcclxuXHRcdHdpbmRvdy5jb25zb2xlLmxvZygnQWN0aW9uLnN0b3AoKScpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1ha2UgKCkge1xyXG5cdCAgdmFyIGNscyA9IHRoaXM7XHJcblx0ICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcblx0ICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG5cdCAgcmV0dXJuIGluc3RhbmNlO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhBY3Rpb24pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIvKiByZXF1aXJlZCBmb3IgYXJyb3cgKi9cXHJcXG4uYXJyb3ctaGVhZCB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgd2lkdGg6IDA7IFxcclxcbiAgaGVpZ2h0OiAwOyBcXHJcXG4gIGJvcmRlci10b3A6IDMwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItYm90dG9tOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDMwcHggc29saWQgZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy1ib2R5IHtcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcXHJcXG4gIHdpZHRoOiA0MHB4O1xcclxcbiAgaGVpZ2h0OiAyMHB4O1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbiAgbWFyZ2luLXRvcDogMjBweDtcXHJcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxyXFxuICBib3JkZXItbGVmdDogMDtcXHJcXG4gIGJvcmRlci1yaWdodDogMDtcXHJcXG59XFxyXFxuXFxyXFxuLmFycm93LXdyYXBwZXIge1xcclxcbiAgd2lkdGg6IDcwcHg7ICAgLyogYXJyb3ctYm9keSB3aWR0aCArIGFycm93LWhlYWQgYm9yZGVyIHdpZHRoICovXFxyXFxufVxcclxcblxcclxcbi5BcnJvdyB7XFxyXFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXHJcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXHJcXG59XFxyXFxuXFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQXJyb3cgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnQXJyb3cnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLnNldENvbG9yKHRoaXMucHJvcHMuY29sb3IpOyAgLy8gaGF2ZSB0byBtYWtlIGFycm93IGJlZm9yZSBjYWxsaW5nIHRoaXNcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c2V0Q29sb3IgKGMpIHtcclxuXHRcdHRoaXMuJGVsZW1lbnQuZmluZCgnLmFycm93LWhlYWQnKS5jc3Moe2JvcmRlckxlZnRDb2xvcjpjfSk7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1ib2R5JykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6Y30pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRodG1sICgpIHtcclxuXHRcdHJldHVybiBcIjxkaXY+PGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+PC9kaXY+XCI7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3JlYXRlQXJyb3dFbGVtZW50ICgpIHtcclxuXHRcdHZhciAkYXJyb3cgPSAkKFwiPGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+XCIpO1xyXG5cdFx0cmV0dXJuICRhcnJvdztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEFycm93KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBCR0ltZyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgdXJsOiAnJyxcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICBsZWZ0OiAnMHB4JyxcclxuICAgICAgdG9wOiAnMHB4J1xyXG4gICAgfTtcclxuICAgIHByb3BzID0gdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnQkdJbWcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kOiAndXJsKFwiJyArIHByb3BzLnVybCArICdcIikgbm8tcmVwZWF0IGNlbnRlcicsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiAnY292ZXInICAvLzEwMCUgMTAwJSdcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCR0ltZyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJHSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQm94IGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgXHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gIFx0dGhpcy50eXBlID0gJ0JveCc7XHJcbiAgXHR0aGlzLml0ZW1zID0gW107XHJcbiAgXHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgfVxyXG5cclxuICBhZGQgKGFkZEl0ZW1zKSB7XHJcbiAgXHRpZiAoYWRkSXRlbXMpIHtcclxuICAgICAgaWYgKCEoYWRkSXRlbXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgICBhZGRJdGVtcyA9IFthZGRJdGVtc107XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgaT0wOyBpIDwgYWRkSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLml0ZW1zLnB1c2goYWRkSXRlbXNbaV0pO1xyXG4gICAgICAgIGFkZEl0ZW1zW2ldLnBhcmVudCA9IHRoaXM7ICAgICAgICBcclxuICAgICAgfVxyXG4gIFx0fVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgaXRlbSBmcm9tIHRoaXMgYm94IChmcm9tIHRoZSBkb20gYW5kIHRoZSBpdGVtcyBsaXN0KVxyXG4gIHJlbW92ZSAoaXRlbSkge1xyXG4gIFx0aWYgKGl0ZW0pIHtcclxuICBcdFx0dmFyIGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xyXG4gIFx0XHRpZiAoaW5kZXggPiAtMSkge1xyXG4gIFx0XHQgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIFx0XHRcdGl0ZW0uJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgXHRcdFx0aXRlbS5wYXJlbnQgPSBudWxsO1xyXG4gIFx0XHR9XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIG51bUVsZW1lbnRzICgpIHtcclxuICBcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnRCb3VuZHMgKCkge1xyXG4gICAgdmFyIGJvdW5kcyA9IHt4Ojk5OTk5OSwgeTo5OTk5OTksIGJvdHRvbTowLCByaWdodDowfTtcclxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA8IDEpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvcyA9IHRoaXMuaXRlbXNbaV0uZ2V0Qm91bmRpbmdCb3goKTtcclxuICAgICAgYm91bmRzLnggPSAocG9zLnggPCBib3VuZHMueCkgPyBwb3MueCA6IGJvdW5kcy54O1xyXG4gICAgICBib3VuZHMueSA9IChwb3MueSA8IGJvdW5kcy55KSA/IHBvcy55IDogYm91bmRzLnk7XHJcbiAgICAgIGJvdW5kcy5ib3R0b20gPSAocG9zLmJvdHRvbSA+IGJvdW5kcy5ib3R0b20pID8gcG9zLmJvdHRvbSA6IGJvdW5kcy5ib3R0b207XHJcbiAgICAgIGJvdW5kcy5yaWdodCA9IChwb3MucmlnaHQgPiBib3VuZHMucmlnaHQpID8gcG9zLnJpZ2h0IDogYm91bmRzLnJpZ2h0O1xyXG4gICAgfVxyXG4gICAgYm91bmRzLncgPSBib3VuZHMucmlnaHQgLSBib3VuZHMueDtcclxuICAgIGJvdW5kcy5oID0gYm91bmRzLmJvdHRvbSAtIGJvdW5kcy55O1xyXG4gICAgcmV0dXJuIGJvdW5kcztcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgXHRzdXBlci5yZW5kZXIoKTtcclxuICBcdGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICBcdFx0dGhpcy5pdGVtc1tpXS5yZW5kZXIoKTtcclxuICBcdH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCb3gpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb3g7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBDaXJjbGUgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHRleHQ6ICcnLFxyXG4gICAgICBsZWZ0OiAwLFxyXG4gICAgICB0b3A6IDAsXHJcbiAgICAgIHI6IDI1LFxyXG4gICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICBmb250U2l6ZTogJzI0cHgnLFxyXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgIGNvbG9yOiAnIzBmMCcsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxyXG4gICAgICBib3JkZXJDb2xvcjogJyNCQURBNTUnLFxyXG4gICAgICBib3JkZXJXaWR0aDogNVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHN1cGVyLmluaXQocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0NpcmNsZSc7XHJcbiAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cclxuICAgIC8vIGFwcGx5IGNpcmNsZSBjc3NcclxuICAgIHZhciBvZmZzZXQgPSBwcm9wcy5yICsgcHJvcHMuYm9yZGVyV2lkdGg7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgJ2xlZnQnOiAnJyArIChwcm9wcy5sZWZ0LW9mZnNldCkgKyAncHgnLFxyXG4gICAgICAgICd0b3AnOiAnJyArIChwcm9wcy50b3Atb2Zmc2V0KSArICdweCcsXHJcbiAgICAgICAgJ3dpZHRoJzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxyXG4gICAgICAgICdoZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2xpbmVIZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2JvcmRlcic6IHByb3BzLmJvcmRlcldpZHRoICsgJ3B4IHNvbGlkICcgKyBwcm9wcy5ib3JkZXJDb2xvcixcclxuICAgICAgICAnYm9yZGVyUmFkaXVzJzogJzEwMDAwcHgnLFxyXG4gICAgICAgICd0ZXh0QWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB0aGlzLnNldFRleHQodGhpcy50ZXh0KTtcclxuICB9XHJcblxyXG4gIHNldFRleHQgKHR4dCkge1xyXG4gICAgdGhpcy50ZXh0ID0gdHh0O1xyXG4gICAgdGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0eHQpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQ2lyY2xlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2lyY2xlO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxyXFxuLkRlbW9Cb3gge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgbWFyZ2luOiAyMHB4O1xcclxcbiAgd2lkdGg6IDIwMHB4OyBcXHJcXG4gIGhlaWdodDogMjAwcHg7IFxcclxcbiAgYm9yZGVyOiAycHggZGFzaGVkICNlZWU7XFxyXFxufVxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEJveCA9IHJlcXVpcmUoJy4uL0JveC9Cb3guanMnKTtcclxuXHJcbmNsYXNzIERlbW9Cb3ggZXh0ZW5kcyBCb3gge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XHJcblx0XHRwcm9wcy53aWR0aCA9IHByb3BzLndpZHRoIHx8IDIwMDtcclxuXHRcdHByb3BzLmhlaWdodCA9IHByb3BzLmhlaWdodCB8fCAyMDA7XHJcblx0XHRwcm9wcy5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHR0aGlzLnR5cGUgPSAnRGVtb0JveCc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vRGVtb0JveC5jc3MnKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoRGVtb0JveCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlbW9Cb3g7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vLyBMaWtlIFVuaXggcGlwZTogb3V0cHV0IG9mIG9uZSBjb21tYW5kIGlzIGlucHV0IHRvIHRoZSBuZXh0XHJcbi8vIEVhY2ggZnVuY3Rpb24gdGFrZXMgYSAncHJvcHMnIG9iamVjdCBhcyBhcmd1bWVudFxyXG4vLyBFYWNoIGZ1bmN0aW9uIHJldHVybnMgYW4gb2JqZWN0IHdpdGggcmVzdWx0cywgd2hpY2ggaXMgcGFzc2VkIGFzIHByb3BzIHRvIHRoZSBuZXh0XHJcbi8vIERvKCkgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBleGVjdXRlIHRoZSBEbyBjaGFpblxyXG5cclxuLy8gUC5wdWxzZS5zZXRUbyhcclxuLy8gICAgIERvKFIuZ2V0UmFuZG9tTnVtYmVyLCB7ZnJvbTowLCB0bzoxMH0pICAgLy8gcmV0dXJuczogIHtkYXRhOiA4fVxyXG4vLyAgICAgLkRvKEMucGlja0NvbG9yKSAgICAvLyByZWFkcyBpbnB1dCA4LCByZXR1cm5zIHtkYXRhOiAnI2NmZid9XHJcbi8vICAgICAuRG8oQi5jaGFuZ2VDb2xvcikgICAvLyByZWFkcyBpbnB1dCAnI2NmZicsIGNoYW5nZXMgY29sb3Igb24gQmxpbmtlclxyXG4vLyApO1xyXG5cclxuXHJcbmZ1bmN0aW9uIERvKF9hRnVuY3Rpb24sIF9wcm9wcywgX2ZpcnN0RG8pIHtcclxuICAgIHZhciBhRnVuY3Rpb24gPSBfYUZ1bmN0aW9uO1xyXG4gICAgdmFyIHByb3BzID0gX3Byb3BzO1xyXG4gICAgdmFyIGZpcnN0RG8gPSBfZmlyc3REbyB8fCBleGVjdXRvcjtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWZ1bmN0aW9uPScsIGFGdW5jdGlvbik7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncHJvcHM9JywgcHJvcHMpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2ZpcnN0RG89JywgZmlyc3REbyk7XHJcblxyXG4gICAgLy8gUnVuIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMuXHJcbiAgICAvLyBQYXNzIHRoZSByZXN1bHRzIHRvIHRoZSBuZXh0IGNoYWluZWQgZnVuY3Rpb24gKGlmIGFueSkuXHJcbiAgICAvLyBSZXR1cm4gcmVzdWx0cyBvZiB0aGlzIGZ1bmN0aW9uIG9yIG9mIHRoZSBjaGFpblxyXG4gICAgZnVuY3Rpb24gZXhlY3V0b3IgKHBpcGVkUHJvcHMpIHtcclxuICAgICAgICB2YXIgcmV0dXJuVmFsID0gYUZ1bmN0aW9uKHByb3BzIHx8IHBpcGVkUHJvcHMpO1xyXG4gICAgICAgIHJldHVybiAoZXhlY3V0b3IubmV4dERvID8gZXhlY3V0b3IubmV4dERvKHJldHVyblZhbCkgOiByZXR1cm5WYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldHVybiB0aGUgbGFzdCAnRG8nIGluIHRoZSBjaGFpblxyXG4gICAgZnVuY3Rpb24gZ2V0TGFzdERvICgpIHtcclxuICAgICAgICB2YXIgdG1wRG8gPSBmaXJzdERvO1xyXG4gICAgICAgIHdoaWxlICh0bXBEby5uZXh0RG8pIHsgdG1wRG8gPSB0bXBEby5uZXh0RG87IH1cclxuICAgICAgICByZXR1cm4gdG1wRG87XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGEgbmV3ICdEbycgdG8gdGhlIGVuZCBvZiB0aGUgY2hhaW4uXHJcbiAgICBleGVjdXRvci5EbyA9IGZ1bmN0aW9uIChhRnVuY3Rpb24sIHByb3BzKSB7XHJcbiAgICAgICAgZ2V0TGFzdERvKCkubmV4dERvID0gRG8oYUZ1bmN0aW9uLCBwcm9wcywgZmlyc3REbyk7XHJcbiAgICAgICAgcmV0dXJuIGZpcnN0RG87ICAvLyBBbHdheXMgcmV0dXJuIHRoZSBmaXJzdCAnRG8nIGluIHRoZSBjaGFpblxyXG4gICAgfTtcclxuXHJcbiAgICBleGVjdXRvci5uZXh0RG8gPSBudWxsO1xyXG5cclxuICAgIHJldHVybiBleGVjdXRvcjtcclxufVxyXG5cclxuVGhpbmcuRG8gPSBEbztcclxuXHJcbi8qXHJcbi8vIGNoYWluZWQsIGVhY2ggRG8gaGFzIGl0cyBvd24gcGFyYW1ldGVyc1xyXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7fSwge2FyZzE6J2hlbGxvMSd9KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwge2FyZzI6J2hlbGxvIHRvIDIyMjIyJ30pXHJcblxyXG4vLyBjaGFpbmVkLCB3aXRoIGZpcnN0IERvIHBpcGluZyByZXN1bHRzIHRvIHNlY29uZCBEb1xyXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7IHJldHVybiB7cGlwZWRwcm9wOjEyMzR9fSwge2FyZzE6J2hlbGxvMSd9KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwgbnVsbClcclxuXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTsgcmV0dXJuIHtuZXdQcm9wOnByb3BzLnBpcGVkcHJvcCsyfX0pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMycsIHByb3BzKTt9KVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEbztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbi8qXHJcbiAgICBzcmM6IDxmaWxlIHBhdGg+XHJcbiAgICBjZW50ZXI6IHRydWV8ZmFsc2VcclxuICAgIHNpemU6IGNvbnRhaW58Y292ZXJ8c3RyZXRjaFxyXG4qL1xyXG5cclxuY2xhc3MgSW1nIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgcGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFNZ0FBQURJQ0FZQUFBQ3RXSzZlQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUJWOUpSRUZVZUp6dDNjMXUzVVFjaCtGL0VCSzlBc1FDVldmVlFxNENiaHh1QTRFcXNTbWgrN0l1aTlRQ1F2STdZeCtQUDU5SDhpNnlabzdtemZna2xuMVhWWjhLZU5ZWGF3OEF0a3dnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ2VETEVUOTcxMjBVc0x5bU8wanNJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJTSs3Vk5WM2F3OWlRZmRWOVhydFFXelZwOGJqTEM1VjlYdFZQZFE1SXJtdnFnOVY5YTdPRlVuenVoZklQeTcxR01jdzU2TkhNc1F4elBkTWtRaGtwRXY5TjQ2alIvSTBqck5GSXBBUkx2VjhIRWVONUtVNHpoU0pRQnBkS3NkeHRFaXV4WEdXU0FUUzRGSnRjUndsa3RZNHpoQ0pRSzY0MUxnNC9oM0o5NHVQOW5aajR6aDZKQUlKTGpVdGpyMUdNaldPSTBjaWtCZGM2clk0OWhiSnJYRWNOUktCUE9OUzg4U3hsMGptaXVPSWtUVE4rV3kzbXJ5cXFxOW1QTjgzVmZWVGJUT1MrNnI2dWFxK252R2NyejRmcDNLbUhhVHFjVEUvMUh5L1ZiZTRrOHk5YzN5cXF2ZFY5V2JKU1hUbUVpczRjaVRpYUNPUUs0NFlpVGphQ2FSQmowaitySFVpRWNjNEFtbDBoRWpFTVo1QVJ0aHpKT0tZUmlBamZWK1BpM3BQa1loak9vRk1zS2RJZXNUeFI1MGpqaXFCVExhSFNNUnhPNEhjWU11UmlHTWVBcmxScjBqdWJ4aVRPT1lqa0Jsc0tSSnh6RXNnTTlsQ0pPS1luMEJtdEdZazR1aERJRE5iSXhKeDlDT1FEdTVydVVoNnhmRjJsazlpL3dUU3lSS1JpS00vZ1hUVU14SnhMRU1nbmZXSTVFT0pZeWtDV1VDUFNNU3hESUVzWkt1UmlDTVR5SUo2Zkc4UVIxOENXZGhXSW5rb2NiUVF5QXJXamtRYzdRU3lrclVpRWNjNEFsblIwcEdJWXp5QnJHeXBTTVF4alVBMm9IY2s0cGhPSUJ2Ukt4SngzS2JwY3o3YjA5MlA1bTd0QVp5QkhhU2ZKUzZ4OXZ6T3hEVzV4RnJaa2wvU1JUS2VRRmEweHA5NVJUS09RRmF5NWo4S1JkSk9JQ3ZZd3EwbUlta2prSVd0SFlkSXhoSElncllTaDBqYUNXUWhXNHRESkcwRXNvQ3R4aUdTNndUU1dZODRIcXJQaTBWRjhuOEM2YWhYSEcvcmNUR0xwRCtCZE5JempvRkkraE5JQjB2RU1SQkpYd0taMlpKeERFVFNqMEJtdEVZY0E1SDBJWkNackJuSFFDVHpFOGdNdGhESFFDVHpFc2lOdHZpVWRaSE1SeUEzMkdJY0E1SE1ReUFUYlRtT2dVaHVKNUFKOWhESFFDUzNFY2hJZTRwaklKTHBCRExDSHVNWWlHUWFnVFRhY3h3RGtZd25rQVpIaUdNZ2tuRUVja1d2T040c09Za25STkpPSU1FUjR4aUlwSTFBWG5Ea09BWWl1VTRnenpoREhJTmVrUnpsaWZKTmN6N2IwOTAvZmo3bThsQlZQMVRWcnpPZWN5Ni9WTldQOWZpSzZybDhyS3EvWmp6ZkxweHBCNm1xZWwxVjcrcTRPOGRUYyswa3YxWFZ0d3VQdlNlWFdNR3RrZXdsanNHdGtSd3RqaXFCWERVMWt2ZTFyemdHVXlNNVloeFZBbWt5TnBLOXhqRVlHOGxSNDZnU1NMUFdTUFlleDZBMWtpUEhVU1dRVWE1RmNwUTRCdGNpT1hvY1ZRSVo3YVZJamhiSDRLVkl6aEJIbFVBbWVSckpVZU1ZUEkza0xIRlVDV1N5SVpLanh6RVlJamxUSEZVQ3VjbnJPa2NjZzdkMXJqaXFHdGY5WGJVdmZpK3Q1MGlhMXYzWjdzV0NVUVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFIQlhWWi9XSGdSc2xSMEVBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFZ3I4QmlRVnpxOUx2MU9vQUFBQUFTVVZPUks1Q1lJST0nO1xyXG5cclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICBwcm9wcy5zcmMgPSBwcm9wcy5zcmMgfHwgcGxhY2Vob2xkZXI7XHJcbiAgICAvLyBwcm9wcy5iYWNrZ3JvdW5kID0gJ3VybChcIicgKyBwcm9wcy5zcmMgKyAnXCIpIG5vLXJlcGVhdCAnICsgKHByb3BzLmNlbnRlciA/ICdjZW50ZXInIDogJ2xlZnQgdG9wJyk7XHJcbiAgICAvLyBwcm9wcy5iYWNrZ3JvdW5kU2l6ZSA9IChwcm9wcy5zaXplID09PSAnY29udGFpbicgfHwgcHJvcHMuc2l6ZSA9PT0gJ2NvdmVyJyA/IHByb3BzLnNpemUgOiAocHJvcHMuc2l6ZT09PSdzdHJldGNoJyA/ICcxMDAlIDEwMCUnIDogdW5kZWZpbmVkKSApO1xyXG5cclxuICAgIHRoaXMucHJvcHMgPSBUaGluZy5jbGVhbnVwKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnR5cGUgPSAnSW1nJztcclxuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSAxO1xyXG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuc3JjID0gcHJvcHMuc3JjO1xyXG4gICAgdGhpcy54ID0gcHJvcHMueCB8fCB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IHVuZGVmaW5lZDtcclxuICAgIHRoaXMudyA9IHByb3BzLncgfHwgdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5oID0gcHJvcHMuaCB8fCB1bmRlZmluZWQ7XHJcblxyXG4gICAgSW1nLmxvYWRpbmcodGhpcyk7XHJcbiAgICBsb2FkSW1hZ2UocHJvcHMuc3JjLCB0aGlzLm9ubG9hZC5iaW5kKHRoaXMpLCB0aGlzLm9uZXJyb3IuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgc3VwZXIuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgfVxyXG5cclxuICBvbmxvYWQgKGltZykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKCdJbWFnZSBMb2FkZWQ6JywgaW1nLCBpbWcuc3JjLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xyXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IGltZy5oZWlnaHQgLyBpbWcud2lkdGg7ICAvLyBhc3BlY3QgcmF0aW8gb2Ygb3JpZ2luYWwgaW1hZ2VcclxuICAgIHRoaXMudyA9IHRoaXMudyB8fCBpbWcud2lkdGg7XHJcbiAgICB0aGlzLmggPSB0aGlzLmggfHwgKHRoaXMudyAqIHRoaXMuYXNwZWN0UmF0aW8pO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLncsXHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmgsXHJcbiAgICAgICAgYmFja2dyb3VuZDogJ3VybCgnICtpbWcuc3JjKyAnKSBuby1yZXBlYXQgY2VudGVyJyxcclxuICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogJzEwMCUgMTAwJSdcclxuICAgIH0pO1xyXG4gICAgSW1nLmxvYWRlZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIG9uZXJyb3IgKGltZykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKCdJbWcub25lcnJvcicsIGltZy5zcmMsICdmYWlsZWQnKTtcclxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuZXJyb3IgPSB0cnVlO1xyXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuaGVpZ2h0ID0gMDtcclxuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSAxO1xyXG4gICAgSW1nLmxvYWRlZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHNldFdpZHRoICh3KSB7XHJcbiAgICB0aGlzLndpZHRoID0gdztcclxuICAgIHRoaXMuaGVpZ2h0ID0gdyAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkaW5nIChpbWcpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5sb2FkaW5nKCk6XCIsIGltZy5zcmMpO1xyXG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcclxuICAgIGlmIChpbWcgJiYgIWltZy5sb2FkZWQpIHtcclxuICAgICAgICBJbWcucXVldWVkSW1ncy5wdXNoKGltZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gSW1nLnF1ZXVlZEltZ3MubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxvYWRlZCAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coXCJJTUcubG9hZGVkKCk6XCIsIGltZy5zcmMsIEltZy5xdWV1ZWRJbWdzLmxlbmd0aCk7XHJcbiAgICBJbWcucXVldWVkSW1ncyA9IEltZy5xdWV1ZWRJbWdzIHx8IFtdO1xyXG4gICAgaWYgKGltZyAmJiBpbWcubG9hZGVkKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gSW1nLnF1ZXVlZEltZ3MuaW5kZXhPZihpbWcpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIEltZy5xdWV1ZWRJbWdzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChJbWcucXVldWVkSW1ncy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgSW1nLm9uQWxsTG9hZGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aCA9PT0gMDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBvbkFsbExvYWRlZCAoKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coXCJJTUcub25BbGxMb2FkZWQoKTogdHJpZ2dlcmVkXCIpO1xyXG4gIH1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoSW1nKTtcclxuXHJcblxyXG5mdW5jdGlvbiBsb2FkSW1hZ2UgKHNyYywgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcclxuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjYWxsYmFjayh0aGlzKTtcclxuICAgIH07XHJcbiAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBlcnJvckNhbGxiYWNrKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIGltZy5zcmMgPSBzcmM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgTGFiZWwgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXHJcblx0XHRcdGZvbnRTaXplOiAnMTRweCcsXHJcblx0XHRcdGNvbG9yOiAnIzAwMCdcclxuXHRcdH07XHJcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnTGFiZWwnO1xyXG5cdFx0dGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy50ZXh0KTtcclxuXHR9XHJcblxyXG5cdHNldFRleHQgKHR4dCkge1xyXG5cdFx0dGhpcy50ZXh0ID0gdHh0O1xyXG5cdFx0dGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0eHQpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhMYWJlbCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExhYmVsO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxyXFxuLkxpbmUge1xcclxcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxyXFxufVxcclxcblxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIExpbmUgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIC8vIGV4cGVjdGluZyBwcm9wczogeyB4MTowLCB5MTowLCB4Mjo1MCwgeTI6NTAgfVxyXG4gICAgcHJvcHMuYmFja2dyb3VuZENvbG9yID0gcHJvcHMgJiYgKHByb3BzLmJhY2tncm91bmRDb2xvciB8fCBwcm9wcy5jb2xvciB8fCAnYmxhY2snKTtcclxuICAgIHN1cGVyLmluaXQocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0xpbmUnO1xyXG4gICAgdGhpcy5sZW5ndGggPSAxMDtcclxuICAgIHRoaXMud2lkdGggPSAxO1xyXG4gICAgdGhpcy5hbmdsZSA9IDA7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLmNyZWF0ZUxpbmUocHJvcHMueDEsIHByb3BzLnkxLCBwcm9wcy54MiwgcHJvcHMueTIsIHByb3BzLndpZHRoLCBwcm9wcy5hcnJvdywgcHJvcHMuc2hvcnRlbik7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVMaW5lICh4MSx5MSwgeDIseTIsIHdpZHRoLCBhcnJvdywgc2hvcnRlbikge1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IDI7XHJcbiAgICB0aGlzLmxlbmd0aCA9IE1hdGguc3FydCgoeDEteDIpKih4MS14MikgKyAoeTEteTIpKih5MS15MikpIC0gKGFycm93PyB0aGlzLndpZHRoKjIgOiAwKTsgIC8vIHNob3J0ZW4gdGhlIGxlbmd0aCB0byBtYWtlIHJvb20gZm9yIGFycm93aGVhZFxyXG4gICAgdGhpcy5hbmdsZSAgPSBNYXRoLmF0YW4yKHkyIC0geTEsIHgyIC0geDEpICogMTgwIC8gTWF0aC5QSTtcclxuICAgIHRoaXMubGVuZ3RoIC09IHNob3J0ZW4gfHwgMDsgIC8vIHNob3J0ZW4gdGhlIGxpbmUgYSBiaXQgKG1ha2VzIHJvb20gZm9yIGFycm93aGVhZClcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgICAnbGVmdCc6ICcnICsgeDEgKyAncHgnLFxyXG4gICAgICAgICd0b3AnOiAnJyArICh5MS0odGhpcy53aWR0aC8yKSkgKyAncHgnLFxyXG4gICAgICAgICd3aWR0aCc6ICcnICsgdGhpcy5sZW5ndGggKyAncHgnLFxyXG4gICAgICAgICdoZWlnaHQnOiAnJyArIHRoaXMud2lkdGggKyAncHgnLFxyXG4gICAgICAgIC8vIHJvdGF0ZSBhcm91bmQgc3RhcnQgcG9pbnQgb2YgbGluZVxyXG4gICAgICAgICd0cmFuc2Zvcm0tb3JpZ2luJzogJzAgNTAlJ1xyXG4gICAgICB9KTtcclxuICAgIHRoaXMucm90YXRlVG8odGhpcy5hbmdsZSk7XHJcbiAgICBpZiAoYXJyb3cpIHtcclxuICAgICAgdGhpcy5hZGRBcnJvd0hlYWQodGhpcy5sZW5ndGgsIHRoaXMud2lkdGgsIHRoaXMud2lkdGgqMiwgdGhpcy5wcm9wcy5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gbGVuIG9mIGxpbmUsIHdpZHRoIG9mIGxpbmUsIHNpemUgb2YgdHJpYW5nbGUgKGllLiAxMCB3aWxsIGJlIDEwcHggd2lkZSBhbmQgMjBweCBoaWdoKVxyXG4gIGFkZEFycm93SGVhZCAobGVuLCB3aWR0aCwgc2l6ZSwgY29sb3IpIHtcclxuICAgIHRoaXMuYXJyb3dIZWFkID0gJCgnPGRpdj48L2Rpdj4nKTtcclxuICAgIHRoaXMuYXJyb3dIZWFkLmNzcyh7XHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICB3aWR0aDogMCwgXHJcbiAgICAgIGhlaWdodDogMCwgXHJcbiAgICAgIGZvbnRTaXplOiAwLFxyXG4gICAgICBsaW5lSGVpZ2h0OiAwLFxyXG4gICAgICBsZWZ0OiBsZW4gKyAncHgnLFxyXG4gICAgICB0b3A6IC0oc2l6ZS0od2lkdGgvMikpICsgJ3B4JyxcclxuICAgICAgYm9yZGVyQm90dG9tOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuICAgICAgYm9yZGVyVG9wOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuICAgICAgYm9yZGVyTGVmdDogc2l6ZSArICdweCBzb2xpZCAnICsgY29sb3JcclxuICAgIH0pO1xyXG4gICAgdGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0aGlzLmFycm93SGVhZCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICBcdHJldHVybiByZXF1aXJlKCcuL0xpbmUuY3NzJyk7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKExpbmUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaW5lO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLlBhdHRlcm4uR3JhcGhQYXBlciB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAzO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHgsIDIwcHggMjBweCwgMjBweCAyMHB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTJweCAtMnB4LCAtMnB4IC0ycHgsIC0xcHggLTFweCwgLTFweCAtMXB4O1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuMykgMXB4LCB0cmFuc3BhcmVudCAxcHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uR3JpZCB7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC0ycHggLTJweCwgLTJweCAtMnB4O1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5Tb2ZhRGFyayB7XFxyXFxuICBiYWNrZ3JvdW5kOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgMTAwJSA1MCUsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlNvZmEge1xcclxcbiAgYmFja2dyb3VuZDpcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCA5OSUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDYlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDElLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyMyUpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgNTAlIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSAxMDAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgOTYlLCA0JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlBvbGthRG90cyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHdoaXRlIDE1JSwgdHJhbnNwYXJlbnQgMTclKSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHdoaXRlIDE1JSwgdHJhbnNwYXJlbnQgMTclKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogNjBweCA2MHB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCAwLCAzMHB4IDMwcHg7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkJsdWVCYWxscyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQoI2FjZiA3NyUsIHJnYmEoODgsOTksMjU1LC44OCkgODAlLCB0cmFuc3BhcmVudCA4MyUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAyNSUgMjUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5TdHJpcGVzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1NSwyNTUsMjUsMSkgNTAlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5QbGFpZFJlZCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBoc2woMCwgODYlLCAzNCUpO1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxyXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQodHJhbnNwYXJlbnQsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgNTNweCwgdHJhbnNwYXJlbnQgNTNweCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2NnB4LCB0cmFuc3BhcmVudCA2NnB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2OXB4LCByZ2JhKDAsNjAsMCwuNSkgMTY5cHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTgycHgsIHJnYmEoMCw2MCwwLC41KSAxODJweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMjMycHgsIHRyYW5zcGFyZW50IDIzMnB4KSxcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgyNzBkZWcsIHRyYW5zcGFyZW50LCBcXHJcXG4gICAgICB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LCBcXHJcXG4gICAgICB0cmFuc3BhcmVudCA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2NnB4LCB0cmFuc3BhcmVudCA2NnB4LCBcXHJcXG4gICAgICB0cmFuc3BhcmVudCAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjlweCwgcmdiYSgwLDYwLDAsLjUpIDE2OXB4LCBcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxODJweCwgcmdiYSgwLDYwLDAsLjUpIDE4MnB4LCBcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMjMycHgsIHRyYW5zcGFyZW50IDIzMnB4KSxcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgxMjVkZWcsIHRyYW5zcGFyZW50LCBcXHJcXG4gICAgICB0cmFuc3BhcmVudCAycHgsIHJnYmEoMCwwLDAsLjIpIDJweCwgXFxyXFxuICAgICAgcmdiYSgwLDAsMCwuMikgM3B4LCB0cmFuc3BhcmVudCAzcHgsIFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDVweCwgcmdiYSgwLDAsMCwuMikgNXB4KTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uRGlhZ29uYWxTdHJpcGVzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg0NWRlZywgYmxhY2sgMjUlLCB0cmFuc3BhcmVudCAyNS41JSwgdHJhbnNwYXJlbnQgNTAlLCBibGFjayA1MC41JSwgYmxhY2sgNzUlLCB0cmFuc3BhcmVudCA3NS41JSwgdHJhbnNwYXJlbnQpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxNiUgMTYlOyAgLyogbXVzdCBtYXRjaCBhc3BlY3QgcmF0aW8gb2YgY29udGFpbmluZyBlbGVtZW50IG9yIGxpbmVzIHdpbGwgYnJlYWsgKi9cXHJcXG4gICAgICAgIC8qIGllLiAzMiUgMTYlIGZvciBhbiBlbGVtZW50IHdpdGggdz0xMDAgaD0yMDAgKi9cXHJcXG4gICAgICAgIC8qIFBvd2VycyBvZiAyIHdvcmsgYmVzdCAob3RoZXIgdmFsdWVzLCBsaWtlIDcgb3IgMjMsIG1ha2UgamFnZ3kgYWxpYXNpbmcpICovXFxyXFxufVxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFBhdHRlcm4gZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICBsZWZ0OiAnMHB4JyxcclxuICAgICAgdG9wOiAnMHB4JyxcclxuICAgICAgY29sb3I6ICcjZGRkJyxcclxuICAgICAgcGF0dGVybjogJ0dyYXBoUGFwZXInLFxyXG4gICAgICBjZWxsV2lkdGg6IDEwMCxcclxuICAgICAgY2VsbEhlaWdodDogMTAwLFxyXG4gICAgICBsaW5lV2lkdGg6IDJcclxuICAgIH07XHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1BhdHRlcm4nO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhwcm9wcy5wYXR0ZXJuKTtcclxuICAgIGlmIChwcm9wcy5wYXR0ZXJuID09PSAnZ3JpZCcpIHtcclxuICAgICAgdGhpcy5jc3MoIFBhdHRlcm4ubWFrZUdyaWRDU1MocHJvcHMuY2VsbFdpZHRoLCBwcm9wcy5jZWxsV2lkdGgsIHByb3BzLmxpbmVXaWR0aCkgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICAvLyByZW5kZXIgZmlyc3QsIHRoaXMgd2lsbCBzZXQgYSBwYXJlbnQgZWxlbWVudFxyXG4gICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICAvLyB0aGVuIGFkanVzdCBwYXR0ZXJuIHRvIGZpbGwgcGFyZW50IHdpdGggYSBzcXVhcmUgYXNwZWN0IHJhdGlvXHJcbiAgICB2YXIgc2l6ZSA9IE1hdGgubWF4KHRoaXMucGFyZW50LiRlbGVtZW50LndpZHRoKCksIHRoaXMucGFyZW50LiRlbGVtZW50LmhlaWdodCgpKTtcclxuICAgIHRoaXMuY3NzKHt3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlR3JpZENTUyAoY2VsbFdpZHRoLCBjZWxsSGVpZ2h0LCBsaW5lV2lkdGgpIHtcclxuICAgIHZhciBwcm9wcyA9IHt9O1xyXG4gICAgdmFyIHBvcyA9ICctJyArIGxpbmVXaWR0aCArICdweCc7XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kU2l6ZSA9ICcnICsgY2VsbFdpZHRoICsgJ3B4ICcgKyBjZWxsSGVpZ2h0ICsgJ3B4LCAnICsgY2VsbFdpZHRoICsgJ3B4ICcgKyBjZWxsSGVpZ2h0ICsgJ3B4JztcclxuICAgIHByb3BzLmJhY2tncm91bmRQb3NpdGlvbiA9IHBvcyArICcgJyArIHBvcyArICcsJyArIHBvcyArICcgJyArIHBvcztcclxuICAgIHByb3BzLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICdsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSwnICtcclxuICAgICAgJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSc7XHJcbiAgICByZXR1cm4gcHJvcHM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICAgIHJldHVybiByZXF1aXJlKCcuL1BhdHRlcm4uY3NzJyk7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm4pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xyXG5cclxuXHJcbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMuVCA9IFRpbWVyLm1ha2Uoe2NhbGxiYWNrOiB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgZGVsYXk6IHRoaXMuZGVsYXl9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0dGhpcy5ULnN0b3AoKTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIgKCkge1xyXG5cdFx0dGhpcy5jYWxsYmFjaygpO1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFB1bHNhcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFB1bHNhcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbnZhciBQSSA9IDMuMTQxNTkyNjUzNTk7XHJcbnZhciBIQUxGUEkgPSBQSS8yLjA7XHJcblxyXG5jbGFzcyBSYW5kIHtcclxuXHRzdGF0aWMgcmFuZEl0ZW0oYXJyKSB7XHJcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBhcnJbIFJhbmQucmFuZEludCgwLCBhcnIubGVuZ3RoLTEpIF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gKGluY2x1ZGVkKSBhbmQgbWF4IChpbmNsdWRlZClcclxuXHQvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcclxuXHRzdGF0aWMgcmFuZEludChtaW4sIG1heCkge1xyXG5cdFx0bWluID0gTWF0aC5jZWlsKG1pbnx8MCk7XHJcblx0XHRtYXggPSBNYXRoLmZsb29yKG1heHx8MSk7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIC45OTk5OTlcclxuXHRzdGF0aWMgcmFuZEZsb2F0KCkge1xyXG5cdCAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyByYW5kUGVyY2VudCh0aHJlc2hvbGQpIHtcclxuXHRcdHJldHVybiBSYW5kLnJhbmRJbnQoMSwxMDApIDwgdGhyZXNob2xkO1xyXG5cdH1cclxuXHJcblx0Ly8gcmFuZG9tIGludGVnZXIgd2l0aGluIG1heERpc3RhbmNlIG9mIHRhcmdldCAoZGlzdHJpYnV0ZWQgaW4gYSBiZWxsIGN1cnZlIGFyb3VuZCB0YXJnZXQpXHJcblx0c3RhdGljIHJhbmRDbG9zZVRvKHRhcmdldCwgbWF4RGlzdGFuY2UpIHtcclxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXHJcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZFNpbjIoKSk7ICAgLy8gc3ByZWFkIG92ZXIgZW50aXJlIHJhbmdlLCBzb21ld2hhdCBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgXHJcblx0XHRyZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogUmFuZC5yYW5kUG93MigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHdpdGggc2hhcnAgY29uY2VudHJhdGlvbiBhcm91bmQgY2VudGVyXHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXHJcblx0c3RhdGljIHJhbmRQb3coKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5wb3coMS4wIC0gUmFuZC5yYW5kRmxvYXQoKSwgNCk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCB0b3dhcmQgMVxyXG5cdHN0YXRpYyByYW5kU2luKCkge1xyXG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdzIoKSB7XHJcblx0XHRyZXR1cm4gUmFuZC5yYW5kUG93KCkgLSBSYW5kLnJhbmRQb3coKTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIDBcclxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcclxuXHRcdHJldHVybiAoKFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSkgLSAzLjApIC8gMy4wO1xyXG5cdH1cclxuXHJcbiAgICAvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgY2xvc2VyIHRvIDBcclxuICAgIHN0YXRpYyByYW5kU2luMigpIHtcclxuICAgICAgICByZXR1cm4gUmFuZC5yYW5kU2luKCkgLSBSYW5kLnJhbmRTaW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gYXJyYXkgb2YgMyBpbnRzLCBlYWNoIDAtMjU1XHJcbiAgICBzdGF0aWMgcmFuZFJHQigpIHtcclxuICAgICAgICByZXR1cm4gW1JhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSldO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByYW5kUkdCc3RyKCkge1xyXG5cdFx0dmFyIHJnYiA9IFJhbmQucmFuZFJHQigpO1xyXG4gICAgICAgIHJldHVybiAncmdiYSgnICtyZ2JbMF0rICcsJyArcmdiWzFdKyAnLCcgK3JnYlsyXSsgJywgLjkpJztcclxuICAgIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhSYW5kKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFRleHRQYW5lIGV4dGVuZHMgVGhpbmcge1xyXG4gICAgaW5pdCAocHJvcHMpIHtcclxuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgVmVyZGFuYSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICAgICAgICBmb250U2l6ZTogJzI0cHgnLFxyXG4gICAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgICAgICAgICAgY29sb3I6ICdyZ2IoMjAwLCAyMDAsIDIwMCknLFxyXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgIHc6IDEwMCxcclxuICAgICAgICAgICAgaDogMTAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgICAgICBzdXBlci5pbml0KHByb3BzKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSAnVGV4dFBhbmUnO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcbiAgICB9XHJcblxyXG4gICAgZmlsbFRleHQgKCkge1xyXG4gICAgICAgIHZhciBtYXhIZWlnaHQgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBtYXggPSAxMDAwO1xyXG4gICAgICAgIHZhciAkc3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcclxuICAgICAgICB2YXIgc3BhbkhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgIC8vIGVsZW1lbnQgaGFzIHRvIGJlIGFwcGVuZGVkIHRvIGJvZHkgcHJpb3IsIG9yIHNwYW5IZWlnaHQgd2lsbCBiZSAwXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJHNwYW4pO1xyXG4gICAgICAgIHdoaWxlIChzcGFuSGVpZ2h0IDwgbWF4SGVpZ2h0ICYmIG1heC0tID4gMCkge1xyXG4gICAgICAgICAgICAkc3Bhbi5hcHBlbmQodGhpcy50ZXh0KTtcclxuICAgICAgICAgICAgc3BhbkhlaWdodCA9ICRzcGFuLmhlaWdodCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIgKCkge1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuZmlsbFRleHQodGhpcy50ZXh0KTtcclxuICAgIH1cclxufVxyXG5cclxuVGhpbmcuYWRkQ2xhc3MoVGV4dFBhbmUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0UGFuZTtcclxuIiwidmFyIGVsZW1lbnRDb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRoaW5nIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1RoaW5nJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUgKHByb3BzKSB7XHJcbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG4gICAgLy8gQ1NTIHByb3BzIGdvIGludG8gdGhpcy5wcm9wc1xyXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xyXG4gICAgLy8ga2VlcCB0aGVzZSBwcm9wZXJ0aWVzIG9uICd0aGlzJ1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IHByb3BzLnJvdGF0ZSB8fCAwO1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IHByb3BzLnNjYWxlIHx8IDE7XHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IDA7XHJcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IDA7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICB2YXIgcGFyZW50RWxlbWVudCA9ICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC4kZWxlbWVudCkgfHwgJChkb2N1bWVudC5ib2R5KTtcclxuICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kKHRoaXMuJGVsZW1lbnQpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3ModGhpcy5wcm9wcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxyXG4gIHVuUmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLiRlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0RGltZW5zaW9ucyAoKSB7XHJcbiAgICByZXR1cm4ge3c6IHRoaXMuJGVsZW1lbnQud2lkdGgoKSwgaDogdGhpcy4kZWxlbWVudC5oZWlnaHQoKX07XHJcbiAgfVxyXG5cclxuICBnZXRCb3VuZGluZ0JveCAoKSB7XHJcbiAgICAvLyByZWxhdGl2ZSB0byBwYWdlXHJcbiAgICB2YXIgc2Nyb2xsdG9wID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICB2YXIgc2Nyb2xsbGVmdCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcclxuICAgIHZhciBib3VuZHMgPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogYm91bmRzLmxlZnQrc2Nyb2xsbGVmdCxcclxuICAgICAgeTogYm91bmRzLnRvcCtzY3JvbGx0b3AsXHJcbiAgICAgIHc6IGJvdW5kcy53aWR0aCxcclxuICAgICAgaDogYm91bmRzLmhlaWdodCxcclxuICAgICAgYm90dG9tOiBib3VuZHMuYm90dG9tK3Njcm9sbHRvcCxcclxuICAgICAgcmlnaHQ6IGJvdW5kcy5yaWdodCtzY3JvbGxsZWZ0XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0UG9zaXRpb24gKCkge1xyXG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxyXG4gICAgdmFyIHh5ID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKTtcclxuICAgIHZhciB6ID0gdGhpcy4kZWxlbWVudC5jc3MoJ3otaW5kZXgnKTtcclxuICAgIHogPSB6ID8gcGFyc2VJbnQoeikgOiB1bmRlZmluZWQ7XHJcbiAgICByZXR1cm4gW3h5LmxlZnQsIHh5LnRvcCwgel07XHJcbiAgfVxyXG5cclxuICAvLyByZXR1cm4gdGhlIGVsZW1lbnQncyBDU1MgdHJhbnNmb3JtIG1hdHJpeCBhcyBhcnJheSBvZiA2IHZhbHVlc1xyXG4gIGdldENTU1RyYW5zZm9ybSAoKSB7XHJcbiAgICB2YXIgbVN0ciA9IHRoaXMuJGVsZW1lbnQuY3NzKCd0cmFuc2Zvcm0nKS5tYXRjaCgvLT9bXFxkXFwuXSsvZyk7XHJcbiAgICB2YXIgbVZhbCA9IFtdO1xyXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbVN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtVmFsW2ldID0gcGFyc2VGbG9hdChtU3RyW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtVmFsOyAgXHJcbiAgfVxyXG5cclxuICByb3RhdGUgKGRlZ3JlZXMpIHtcclxuICAgIHRoaXMucm90YXRpb24gKz0gZGVncmVlcztcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHJvdGF0ZVRvIChhbmdsZSkge1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IGFuZ2xlO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGUgKGZhY3Rvcikge1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciArPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzY2FsZVRvIChmYWN0b3IpIHtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGUgKHgsIHkpIHtcclxuICAgIHRoaXMueCArPSB4O1xyXG4gICAgdGhpcy55ICs9IHk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGVUbyAoeCwgeSkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2Zvcm0gKCkge1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICB0cmFuc2Zvcm06IFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1ModGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZUZhY3RvciwgdGhpcy54LCB0aGlzLnkpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgY3NzIChwcm9wcykge1xyXG4gICAgdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHRoaXMucHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHByb3BzKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgaHRtbCAoKSB7XHJcbiAgICByZXR1cm4gJzxkaXY+PC9kaXY+JztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZSAoKSB7XHJcbiAgICB2YXIgY2xzID0gdGhpcztcclxuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjbHMoKTtcclxuICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ2xhc3MgKGNscykge1xyXG4gICAgVGhpbmcuY2xhc3NlcyA9IFRoaW5nLmNsYXNzZXMgfHwge307XHJcbiAgICBUaGluZy5jbGFzc2VzW2Nscy5uYW1lXSA9IGNscztcclxuXHJcbiAgICAvLyBsb2FkIHRoZSBjbGFzcyBzdHlsZXMgKHRoZXNlIGFyZSBpbmNsdWRlZCBpbiB0aGUgYnVuZGxlIGF0IGJ1aWxkIHRpbWUpXHJcbiAgICBjbHMuY3NzICYmIFRoaW5nLmFkZENTU1N0cmluZyhjbHMuY3NzKCksIGNscy5uYW1lKTtcclxuXHJcbiAgICAvLyBhZGQgYWRkaXRpb25hbCBjc3MgZmlsZSBhdCBsb2FkIHRpbWVcclxuICAgIFRoaW5nLmFkZENTU0ZpbGUoY2xzLm5hbWUgKyAnLycgKyBjbHMubmFtZSArICcuY3NzJywgJ2NzcycrY2xzLm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldENsYXNzIChuYW1lKSB7XHJcbiAgICByZXR1cm4gVGhpbmcuY2xhc3Nlc1tuYW1lXTtcclxuICB9XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgLy8gQ1NTIG1hbmFnZW1lbnQgZnVuY3Rpb25zXHJcblxyXG4gIHN0YXRpYyBtYWtlU3R5bGVzIChwcm9wcykge1xyXG4gICAgdmFyIHN0eWxlcyA9IHByb3BzIHx8IHt9O1xyXG4gICAgJC5leHRlbmQoc3R5bGVzLCB7XHJcbiAgICAgIC8vIGxlZnQ6IHByb3BzLmxlZnQgfHwgKHByb3BzLnggJiYgKHByb3BzLnggKyBcInB4XCIpKSxcclxuICAgICAgLy8gdG9wOiBwcm9wcy50b3AgfHwgKHByb3BzLnkgJiYgKHByb3BzLnkgKyBcInB4XCIpKSxcclxuICAgICAgd2lkdGg6IHByb3BzLndpZHRoIHx8IChwcm9wcy53ICYmIChwcm9wcy53ICsgXCJweFwiKSksXHJcbiAgICAgIGhlaWdodDogcHJvcHMuaGVpZ2h0IHx8IChwcm9wcy5oICYmIChwcm9wcy5oICsgXCJweFwiKSksXHJcbiAgICAgIHpJbmRleDogcHJvcHMuekluZGV4IHx8IHByb3BzLnosXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogcHJvcHMuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICB0cmFuc2Zvcm06IHByb3BzLnRyYW5zZm9ybSB8fCAoVGhpbmcubWFrZVRyYW5zZm9ybUNTUyhwcm9wcy5yb3RhdGUsIHByb3BzLnNjYWxlLCBwcm9wcy54LCBwcm9wcy55KSksXHJcbiAgICAgIHBvc2l0aW9uOiBwcm9wcy5wb3NpdGlvbiB8fCAnYWJzb2x1dGUnXHJcbiAgICB9KTtcclxuICAgIGRlbGV0ZSBzdHlsZXMucm90YXRlO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5zY2FsZTtcclxuICAgIGRlbGV0ZSBzdHlsZXMueDtcclxuICAgIGRlbGV0ZSBzdHlsZXMueTtcclxuICAgIGRlbGV0ZSBzdHlsZXMuejtcclxuICAgIGRlbGV0ZSBzdHlsZXMudztcclxuICAgIGRlbGV0ZSBzdHlsZXMuaDtcclxuICAgIHJldHVybiBzdHlsZXM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVRyYW5zZm9ybUNTUyAocm90YXRlLCBzY2FsZSwgdHgsIHR5KSB7XHJcbiAgICB2YXIgdHJhbnNmb3JtID0gJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gKHR4IHx8IHR5KSA/IChUaGluZy5tYWtlVHJhbnNsYXRlQ1NTKHR4LCB0eSkgKyAnICcpIDogJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gVGhpbmcuaXNOdW1lcmljKHJvdGF0ZSkgPyAoVGhpbmcubWFrZUFuZ2xlQ1NTKHJvdGF0ZSkgKyAnICcpIDogJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gc2NhbGUgPyAoVGhpbmcubWFrZVNjYWxlQ1NTKHNjYWxlKSArICcgJykgOiAnJztcclxuICAgIHJldHVybiB0cmFuc2Zvcm07XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUFuZ2xlQ1NTIChhbmdsZSkge1xyXG4gICAgcmV0dXJuICdyb3RhdGUoJythbmdsZSsnZGVnKSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVNjYWxlQ1NTIChzY2FsZSkge1xyXG4gICAgcmV0dXJuICdzY2FsZSgnK3NjYWxlKycpJztcclxuICB9XHJcblxyXG4gIC8vIE5PVEU6IHRyYW5zbGF0aW9uIGNvb3JkcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiB0aGUgZG9jdW1lbnQgZmxvdy5cclxuICAvLyBUaGV5IGFyZSBub3QgdGhlIHNhbWUgYXMgc2V0dGluZyBsZWZ0L3RvcCB2YWx1ZXMsIHdoaWNoIGFyZSBhYnNvbHV0ZSBjb29yZGluYXRlc1xyXG4gIC8vIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudC5cclxuICBzdGF0aWMgbWFrZVRyYW5zbGF0ZUNTUyAoeCwgeSkge1xyXG4gICAgeCA9IHggfHwgJzAnO1xyXG4gICAgeSA9IHkgfHwgJzAnO1xyXG4gICAgcmV0dXJuICd0cmFuc2xhdGUoJysgeCArICdweCwgJyArIHkgKydweCknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VFbGVtZW50IChodG1sLCBwcm9wcywgdHlwZSkge1xyXG4gICAgdmFyICRlbGVtZW50ID0gJChodG1sKVxyXG4gICAgICAuY3NzKFRoaW5nLm1ha2VTdHlsZXMocHJvcHMpKVxyXG4gICAgICAuYWRkQ2xhc3ModHlwZSB8fCAncmFuZG9tJylcclxuICAgICAgLmF0dHIoJ2lkJywgKHR5cGUgfHwgJ3JhbmRvbScpICsgKCsrZWxlbWVudENvdW50ZXIpKTtcclxuICAgIHJldHVybiAkZWxlbWVudDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpc051bWVyaWMobikge1xyXG4gICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxuICB9XHJcblxyXG4gIC8vIE1ha2Ugc3VyZSBuZWNlc3NhcnkgQ1NTIHByb3BlcnRpZXMgYXJlIHByZXNlbnQgb3IgZGVmYXVsdGVkIHRvIHNvbWV0aGluZyBzYW5lXHJcbiAgc3RhdGljIGNsZWFudXAgKHByb3BzKSB7XHJcbiAgICB2YXIgY3AgPSBwcm9wcyB8fCB7fTtcclxuICAgIGNwLnBvc2l0aW9uID0gcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJzsgICAvLyBkZWZhdWx0IHRvIGFic29sdXRlIHBvc2l0aW9uaW5nXHJcbiAgICAvLyBjcC54ID0gcHJvcHMueCB8fCBwcm9wcy5sZWZ0IHx8IDA7XHJcbiAgICAvLyBjcC55ID0gcHJvcHMueSB8fCBwcm9wcy50b3AgfHwgMDtcclxuICAgIC8vIGNwLnogPSBwcm9wcy56IHx8IHByb3BzLnpJbmRleDtcclxuICAgIC8vIGNwLncgPSBwcm9wcy53IHx8IHByb3BzLndpZHRoO1xyXG4gICAgLy8gY3AuaCA9IHByb3BzLmggfHwgcHJvcHMuaGVpZ2h0O1xyXG4gICAgY3Aucm90YXRpb24gPSBwcm9wcy5yb3RhdGlvbiB8fCAwO1xyXG4gICAgY3Auc2NhbGUgPSBwcm9wcy5zY2FsZSB8fCAxO1xyXG4gICAgcmV0dXJuIGNwO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENTU0ZpbGUoZmlsZU5hbWUsIGlkKSB7XHJcbiAgICAgdmFyIGxpbmsgPSAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCInICsgZmlsZU5hbWUgKyAnXCIgaWQ9XCInICsgaWQgKyAnXCI+JztcclxuICAgICAkKCdoZWFkJykuZmluZCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICAgJCgnaGVhZCcpLmFwcGVuZChsaW5rKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZCkge1xyXG4gICAgaWYgKGNzc1N0cmluZykge1xyXG4gICAgICAvLyB2YXIgZG9jID0gd2luZG93LmRvY3VtZW50O1xyXG4gICAgICB2YXIgc3R5bGVFbCA9ICQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICtjc3NTdHJpbmcrICc8L3N0eWxlPicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgKGlkIHx8ICdUaGluZycpICsgJy1zdHlsZXMnKTtcclxuICAgICAgJCgnaGVhZCcpLmFwcGVuZChzdHlsZUVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRoaW5nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGhpbmc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcblxyXG5jbGFzcyBUaW1lciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdvICgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xyXG5cdFx0dGhpcy50aW1lcklEID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLmRlbGF5KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRpbWVyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBUcmlhbmdsZSBleHRlbmRzIFRoaW5nIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuXHRcdFx0c2l6ZTogMTAsXHJcblx0XHRcdGNvbG9yOiAnI0JBREE1NSdcclxuXHRcdH07XHJcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHByb3BzLCBkZWZhdWx0UHJvcHMpO1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHRcdHRoaXMudHlwZSA9ICdUcmlhbmdsZSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMubWFrZVRyaWFuZ2xlKHRoaXMucHJvcHMuc2l6ZSwgdGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgZWxlbWVudCBiZWZvcmUgY2FsbGluZyB0aGlzXHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdG1ha2VUcmlhbmdsZSAoc2l6ZSwgY29sb3IpIHtcclxuXHRcdGNvbG9yID0gY29sb3IgfHwgJyNCQURBNTUnO1xyXG5cdFx0c2l6ZSA9IHNpemUgfHwgMTA7XHJcblx0XHR0aGlzLmNzcyh7XHJcblx0XHRcdHdpZHRoOiAwLCBcclxuXHRcdFx0aGVpZ2h0OiAwLCBcclxuXHRcdFx0Zm9udFNpemU6IDAsXHJcblx0XHRcdGxpbmVIZWlnaHQ6IDAsXHJcblx0XHRcdGJvcmRlckJvdHRvbTogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXHJcblx0XHRcdGJvcmRlclRvcDogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXHJcblx0XHRcdGJvcmRlckxlZnQ6IHNpemUgKyAncHggc29saWQgJyArIGNvbG9yXHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhUcmlhbmdsZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWFuZ2xlO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnJlcXVpcmUoJy4vQm94L0JveC5qcycpO1xyXG5yZXF1aXJlKCcuL0Fycm93L0Fycm93LmpzJyk7XHJcbnJlcXVpcmUoJy4vRGVtb0JveC9EZW1vQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG5yZXF1aXJlKCcuL1RpbWVyL1RpbWVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vUmFuZC9SYW5kLmpzJyk7XHJcbnJlcXVpcmUoJy4vUHVsc2FyL1B1bHNhci5qcycpO1xyXG5yZXF1aXJlKCcuL0RvL0RvLmpzJyk7XHJcbnJlcXVpcmUoJy4vTGFiZWwvTGFiZWwuanMnKTtcclxucmVxdWlyZSgnLi9MaW5lL0xpbmUuanMnKTtcclxucmVxdWlyZSgnLi9JbWcvSW1nLmpzJyk7XHJcbnJlcXVpcmUoJy4vUGF0dGVybi9QYXR0ZXJuLmpzJyk7XHJcbnJlcXVpcmUoJy4vQkdJbWcvQkdJbWcuanMnKTtcclxucmVxdWlyZSgnLi9UZXh0UGFuZS9UZXh0UGFuZS5qcycpO1xyXG5yZXF1aXJlKCcuL0NpcmNsZS9DaXJjbGUuanMnKTtcclxucmVxdWlyZSgnLi9UcmlhbmdsZS9UcmlhbmdsZS5qcycpO1xyXG5cclxud2luZG93LlRoaW5nID0gVGhpbmc7XHJcbiJdfQ==
