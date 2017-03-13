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

},{"../Thing/Thing.js":22}],2:[function(require,module,exports){
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

},{"../Thing/Thing.js":22,"./Arrow.css":2}],4:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],5:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],6:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],7:[function(require,module,exports){
module.exports = "<div><div id=cube class=show-front><figure class=front>F</figure><figure class=back>B</figure><figure class=right>R</figure><figure class=left>L</figure><figure class=top>T</figure><figure class=bottom>G</figure></div></div>";

},{}],8:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

/**
 *  w, h, depth
 */
class Cube extends Thing {
	init (props) {
		var defaultProps = {
			w: 500,
			h: 500,
			d: 500
		};
		props = $.extend({}, defaultProps, props);
		this.w = props.w;
		this.h = props.h;
		this.d = props.d;
		this.initialize(props);
		this.type = 'Cube';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.setupCube(this.$element);
	}

	render () {
		super.render();
		return this;
	}

	setupCube($el) {
		var $container  = $el;
		var $cube       = $el.find('#cube');
		var $faceFront  = $el.find('#cube .front ');
		var $faceBack   = $el.find('#cube .back  ');
		var $faceRight  = $el.find('#cube .right ');
		var $faceLeft   = $el.find('#cube .left  ');
		var $faceTop    = $el.find('#cube .top   ');
		var $faceBottom = $el.find('#cube .bottom');

		var halfHeight = this.h/2;
		var halfWidth = this.w/2;
		var halfDepth = this.d/2;

		$container.css({
			width: this.w + 'px',
			height: this.h + 'px',
			position: 'absolute',
			left: '0px',
			top: '0px',
			perspective: '6000px',
			zIndex: 20000
		});

		$cube.css({
			width: '100%',
			height: '100%',
			zIndex: 20000,
			position: 'absolute',
			transformStyle: 'preserve-3d',
			transition: 'transform 1s'
		});

		this.setupFace($faceFront, {
			background: 'rgba(255, 255, 255, .2)',
		  	width: this.w + 'px',
		  	height: this.h + 'px',
		  	transform: 'rotateX( 0deg ) translateZ( ' + halfDepth + 'px )'
		});
		this.setupFace($faceBack, {
			background: 'rgba(  0,   0,   0, .5)',
		  	width: this.w + 'px',
		  	height: this.h + 'px',
		  	transform: 'rotateX( -180deg ) translateZ( ' + halfDepth + 'px )'
		});
		this.setupFace($faceRight, {
			background: 'rgba(255,   0,  55, .5)',
		  	width: this.d + 'px',
		  	height: this.h + 'px', 
		  	transform: 'rotateY(   90deg ) translateZ( ' + (halfWidth + (halfWidth-halfDepth)) + 'px )'  /* halfWidth + (halfWidth-halfDepth) */
		});
		this.setupFace($faceLeft, {
			background: 'rgba(255, 255,   0, .5)',
		  	width: this.d + 'px',
		  	height: this.h + 'px', 
		  	transform: 'rotateY(  -90deg ) translateZ( ' + (halfWidth - (halfWidth-halfDepth)) + 'px )'  /* halfWidth - (halfWidth-halfDepth) */
		});
		this.setupFace($faceTop, {
			background: 'rgba(  0,  55, 255, .5)',
		  	width: this.w + 'px',
		  	height: this.d + 'px', 
		  	transform: 'rotateX(   90deg ) translateZ( ' + halfDepth + 'px )'
		});
		this.setupFace($faceBottom, {
			background: 'rgba(  0, 255,   0, .5)',
		  	width: this.w + 'px',
		  	height: this.d + 'px', 
		  	transform: 'rotateX(  -90deg ) translateZ( ' + (halfHeight + (halfHeight-halfDepth)) + 'px )'
		});
	}

	setupFace($face, cssVals) {
		var defaultCSS = {
			display: 'block',
			position: 'absolute',
			lineHeight: this.h + 'px',
			fontSize: (this.h/3) +'px',
			fontWeight: 'bold',
			color: 'white',
			textAlign: 'center'
		};
		$face.css($.extend({}, defaultCSS, cssVals));
	}

	html () {
		return require('./Cube.html');
	}

	static css () {
		// return require('./Cube.css');
	}
}
Thing.addClass(Cube);

module.exports = Cube;

},{"../Thing/Thing.js":22,"./Cube.html":7}],9:[function(require,module,exports){
module.exports = "\r\n.DemoBox {\r\n  display: inline-block;\r\n  position: relative;\r\n  margin: 20px;\r\n  width: 200px; \r\n  height: 200px; \r\n  border: 2px dashed #eee;\r\n}\r\n";

},{}],10:[function(require,module,exports){
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

},{"../Box/Box.js":5,"../Thing/Thing.js":22,"./DemoBox.css":9}],11:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],12:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],13:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],14:[function(require,module,exports){
module.exports = "\r\n.Line {\r\n  /* For some nice animation on the rotates: */\r\n  -webkit-transition: -webkit-transform .2s;\r\n     -moz-transition:    -moz-transform .2s;\r\n          transition:         transform .2s;\r\n}\r\n\r\n";

},{}],15:[function(require,module,exports){
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

},{"../Thing/Thing.js":22,"./Line.css":14}],16:[function(require,module,exports){
module.exports = ".Pattern.GraphPaper {\r\n  background-color: #003;\r\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\r\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\r\n  background-image:\r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\r\n}\r\n\r\n.Pattern.Grid {\r\n  background-size: 100px 100px, 100px 100px;\r\n  background-position: -2px -2px, -2px -2px;\r\n  background-image:\r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\r\n}\r\n\r\n.Pattern.SofaDark {\r\n  background:\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Sofa {\r\n  background:\r\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.YellowCirclesWithViolet {\r\n    background-image: radial-gradient(#ffd679 17%, #3d5443 17.5%, #3d5443 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3dabc7 12%, #49ab3c 13.5%, #38822e 14%, #ffdb89 14.5%, #ffdb89 19%, #fff57a 20%, #fcffb5 28%, #fffebd 29%);\r\n    background-size: 25%, 25%;\r\n    background-position: 0% 0%, 17% 17%;\r\n}\r\n\r\n.Pattern.YellowCirclesWithViolet2 {\r\n  background-image: radial-gradient(#ffdd90 17%, black 17.5%, black 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3cdada 17%, gray 17.5%, gray 18%, #ffdd90 19%, #ffdd90 24%, #ffff90 30%, #ffff90 36%);\r\n  background-size: 25%, 25%;\r\n  background-position: 0% 0%, 17% 17%;\r\n}\r\n\r\n.Pattern.PolkaDots {\r\n  background-image:\r\n    radial-gradient(white 15%, transparent 17%),\r\n    radial-gradient(white 15%, transparent 17%);\r\n  background-size: 60px 60px;\r\n  background-position: 0 0, 30px 30px;\r\n}\r\n\r\n\r\n\r\n.Pattern.BlueBalls {\r\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Stripes {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.StripesWhiteRedGreen {\r\n  background-image:\r\n    linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),\r\n    linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),\r\n    linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%);\r\n  background-position: 0%, 0%, 0%;\r\n  background-size: 15%, 15%, 15%;\r\n}\r\n\r\n.Pattern.PlaidRed {\r\n  background-color: hsl(0, 86%, 34%);\r\n  background-image:\r\n    repeating-linear-gradient(transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(270deg, transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(125deg, transparent,\r\n      transparent 2px, rgba(0,0,0,.2) 2px,\r\n      rgba(0,0,0,.2) 3px, transparent 3px,\r\n      transparent 5px, rgba(0,0,0,.2) 5px);\r\n}\r\n\r\n.Pattern.DiagonalStripes {\r\n  background-image: linear-gradient(45deg, black 25%, transparent 25.5%, transparent 50%, black 50.5%, black 75%, transparent 75.5%, transparent);\r\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\r\n        /* ie. 32% 16% for an element with w=100 h=200 */\r\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\r\n}\r\n\r\n.Pattern.BlueCascade {\r\n  background-color: #026873;\r\n  background-image: linear-gradient(91deg, rgba(255,255,25,0.17) 50%, transparent 51.5%),\r\n    linear-gradient(89deg, rgba(25,255,255,0.23) 50%, transparent 54.5%),\r\n    linear-gradient(90.5deg, transparent 50%, rgba(252, 255, 162, 0.37) 54.5%),\r\n    linear-gradient(90deg, transparent 50.75%, red 51%, red 51.5%, transparent 51.75%);\r\n  background-size: 5% 100%, 3% 100%, 9% 100%, 8% 100%;\r\n}\r\n\r\n /*Perlin Noise-ish radial blurs*/\r\n  /*RGB*/\r\n  /*background-image: radial-gradient(rgba(255, 42, 0, .5) 1%, transparent 200%), radial-gradient(rgba(86, 250, 2, .5) 1%, transparent 200%), radial-gradient(rgba(0, 7, 255, 0.6) 1%, transparent 150%);\r\n  background-size: 161px, 134px, 188px;\r\n  background-position: -54px, 57px, 55px;\r\n  */\r\n\r\n  /*Monochrome - better blurs*/\r\n/*\r\n  background-image: radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%);\r\n  background-size: 188px 347px, 170px, 209px;\r\n  background-position: -54px, 57px, 55px;\r\n*/\r\n\r\n.Pattern.GreenOvalsXray {\r\n  background-color: #131c0c;\r\n  background-image: \r\n    radial-gradient(rgba(18, 0, 255, 0) 0%, rgba(3, 179, 255, 0.09) 48%, rgba(199, 237, 44, 0.19) 65%, rgba(9, 1, 112, 0) 94%), \r\n    radial-gradient(rgba(9, 1, 112, 0) 0%, rgba(205, 0, 0, 0.07) 48%, rgba(254, 204, 0, 0.11) 65%, rgba(255, 210, 8, 0) 94%), \r\n    radial-gradient(rgba(9, 1, 112, 0.01) 0%, rgba(85, 255, 59, 0.08) 48%, rgba(174, 202, 0, 0.16) 65%, rgba(9, 1, 112, 0) 94%);\r\n    background-size: 188px 347px, 170px, 209px;\r\n  background-position: -54px, 57px, 55px;\r\n}\r\n";

},{}],17:[function(require,module,exports){
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

},{"../Thing/Thing.js":22,"./Pattern.css":16}],18:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":22,"../Timer/Timer.js":23}],19:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],20:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var Box = require('../Box/Box.js');

/**
 *  w, h, depth
 */
class Room extends Box {
	init (props) {
		var defaultProps = {
			w: 1500,
			h: 1000,
			d:  800,
			border: '1px solid black',
			perspective: '10000px'
		};
		props = $.extend({}, defaultProps, props);
		this.w = props.w;
		this.h = props.h;
		this.d = props.d;
		this.walls = [];

		super.init(props);
		// this.initialize(props);

		this.type = 'Room';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.setupRoom(this.$element);
	}

	render () {
		super.render();
		return this;
	}

	setupRoom() {
		var room = this;
		var walls = this.walls;
		var halfHeight = this.h/2;
		var halfWidth = this.w/2;
		var halfDepth = this.d/2;

		var wrapper = Box.make({
			width: '100%',
			height: '100%',
			zIndex: 20000,
			position: 'absolute',
			transformStyle: 'preserve-3d',
			transition: 'transform 1s'
		});

		walls.push( this.makeWall('front', {
			background: 'rgba(255, 255, 255, .2)',
		  	width: this.w + 'px',
		  	height: this.h + 'px',
		  	transform: 'translateZ( ' + (halfDepth) + 'px )'
		}) );
		walls.push( this.makeWall('back', {
			background: 'rgba(0, 0, 0, .5)',
		  	width: this.w + 'px',
		  	height: this.h + 'px',
		  	transform: 'translateZ( ' + (-halfDepth) + 'px )'
		}) );
		walls.push( this.makeWall('right', {
			background: 'rgba(255, 0, 55, 1)',
		  	width: this.d + 'px',
		  	height: this.h + 'px', 
		  	transform: 'rotateY( -90deg ) translateZ( ' + (-(halfWidth + (halfWidth-halfDepth))) + 'px )'
		}) );
		walls.push( this.makeWall('left', {
			background: 'rgba(255, 255, 0, 1)',
		  	width: this.d + 'px',
		  	height: this.h + 'px', 
		  	transform: 'rotateY( 90deg ) translateZ( ' + (-halfDepth) + 'px )'
		}) );
		walls.push( this.makeWall('top', {
			background: 'rgba(0, 55, 255, 1)',
		  	width: this.w + 'px',
		  	height: this.d + 'px', 
		  	transform: 'rotateX( -90deg ) translateZ( ' + (-(halfHeight - (halfHeight-halfDepth))) + 'px )'
		}) );
		walls.push( this.makeWall('bottom', {
			background: 'rgba(0, 255, 0, 1)',
		  	width: this.w + 'px',
		  	height: this.d + 'px', 
		  	transform: 'rotateX( 90deg ) translateZ( ' + (-(halfHeight + (halfHeight-halfDepth))) + 'px )'
		}) );

		wrapper.add(walls);
		room.add(wrapper);
	}

	makeWall(which, cssVals) {
		var defaultCSS = {
			display: 'block',
			position: 'absolute',
			lineHeight: this.h + 'px',
			fontSize: (this.h/3) +'px',
			fontWeight: 'bold',
			color: 'white',
			textAlign: 'center',
			backfaceVisibility: 'hidden'
		};
		var wall = Thing.classes.Box.make($.extend({}, defaultCSS, cssVals));
		wall.$element.addClass('wall');
		wall.$element.addClass(which);
		wall.$element.append(which);
		wall.which = which;
		return wall;
	}

	setupRoomOld($el) {
		var $container  = $el;
		var $cube       = $el.find('#cube');
		var $faceFront  = $el.find('#cube .front ');
		var $faceBack   = $el.find('#cube .back  ');
		var $faceRight  = $el.find('#cube .right ');
		var $faceLeft   = $el.find('#cube .left  ');
		var $faceTop    = $el.find('#cube .top   ');
		var $faceBottom = $el.find('#cube .bottom');

		var halfHeight = this.h/2;
		var halfWidth = this.w/2;
		var halfDepth = this.d/2;

		$container.css({
			width: this.w + 'px',
			height: this.h + 'px',
			position: 'absolute',
			left: '0px',
			top: '0px',
			perspective: '6000px',
			zIndex: 20000
		});

		$cube.css({
			width: '100%',
			height: '100%',
			zIndex: 20000,
			position: 'absolute',
			transformStyle: 'preserve-3d',
			transition: 'transform 1s'
		});

		this.setupFace($faceFront, {
			background: 'rgba(255, 255, 255, .2)',
		  	width: this.w + 'px',
		  	height: this.h + 'px',
		  	transform: 'rotateX( 0deg ) translateZ( ' + halfDepth + 'px )'
		});
		this.setupFace($faceBack, {
			background: 'rgba(  0,   0,   0, .5)',
		  	width: this.w + 'px',
		  	height: this.h + 'px',
		  	transform: 'rotateX( -180deg ) translateZ( ' + halfDepth + 'px )'
		});
		this.setupFace($faceRight, {
			background: 'rgba(255,   0,  55, .5)',
		  	width: this.d + 'px',
		  	height: this.h + 'px', 
		  	transform: 'rotateY(   90deg ) translateZ( ' + (halfWidth + (halfWidth-halfDepth)) + 'px )'  /* halfWidth + (halfWidth-halfDepth) */
		});
		this.setupFace($faceLeft, {
			background: 'rgba(255, 255,   0, .5)',
		  	width: this.d + 'px',
		  	height: this.h + 'px', 
		  	transform: 'rotateY(  -90deg ) translateZ( ' + (halfWidth - (halfWidth-halfDepth)) + 'px )'  /* halfWidth - (halfWidth-halfDepth) */
		});
		this.setupFace($faceTop, {
			background: 'rgba(  0,  55, 255, .5)',
		  	width: this.w + 'px',
		  	height: this.d + 'px', 
		  	transform: 'rotateX(   90deg ) translateZ( ' + halfDepth + 'px )'
		});
		this.setupFace($faceBottom, {
			background: 'rgba(  0, 255,   0, .5)',
		  	width: this.w + 'px',
		  	height: this.d + 'px', 
		  	transform: 'rotateX(  -90deg ) translateZ( ' + (halfHeight + (halfHeight-halfDepth)) + 'px )'
		});
	}

	setupFace($face, cssVals) {
		var defaultCSS = {
			display: 'block',
			position: 'absolute',
			lineHeight: this.h + 'px',
			fontSize: (this.h/3) +'px',
			fontWeight: 'bold',
			color: 'white',
			textAlign: 'center'
		};
		$face.css($.extend({}, defaultCSS, cssVals));
	}

	static css () {
		// return require('./Room.css');
	}
}
Thing.addClass(Room);

module.exports = Room;

},{"../Box/Box.js":5,"../Thing/Thing.js":22}],21:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":22}],24:[function(require,module,exports){
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

},{"../Thing/Thing.js":22}],25:[function(require,module,exports){
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
require('./Cube/Cube.js');
require('./Room/Room.js');

window.Thing = Thing;

},{"./Action/Action.js":1,"./Arrow/Arrow.js":3,"./BGImg/BGImg.js":4,"./Box/Box.js":5,"./Circle/Circle.js":6,"./Cube/Cube.js":8,"./DemoBox/DemoBox.js":10,"./Do/Do.js":11,"./Img/Img.js":12,"./Label/Label.js":13,"./Line/Line.js":15,"./Pattern/Pattern.js":17,"./Pulsar/Pulsar.js":18,"./Rand/Rand.js":19,"./Room/Room.js":20,"./TextPane/TextPane.js":21,"./Thing/Thing.js":22,"./Timer/Timer.js":23,"./Triangle/Triangle.js":24}]},{},[25])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9DdWJlL0N1YmUuaHRtbCIsInNyYy9saWIvQ3ViZS9DdWJlLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUm9vbS9Sb29tLmpzIiwic3JjL2xpYi9UZXh0UGFuZS9UZXh0UGFuZS5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9UcmlhbmdsZS9UcmlhbmdsZS5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQWN0aW9uIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHR9XHJcblxyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR0aGlzLnByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdvICgpIHtcclxuXHRcdHdpbmRvdy5jb25zb2xlLmxvZygnQWN0aW9uLmdvKCknKTtcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uc3RvcCgpJyk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgbWFrZSAoKSB7XHJcblx0ICB2YXIgY2xzID0gdGhpcztcclxuXHQgIHZhciBpbnN0YW5jZSA9IG5ldyBjbHMoKTtcclxuXHQgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XHJcblx0ICByZXR1cm4gaW5zdGFuY2U7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEFjdGlvbik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8qIHJlcXVpcmVkIGZvciBhcnJvdyAqL1xcclxcbi5hcnJvdy1oZWFkIHtcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxyXFxuICB3aWR0aDogMDsgXFxyXFxuICBoZWlnaHQ6IDA7IFxcclxcbiAgYm9yZGVyLXRvcDogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1ib3R0b206IDMwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItbGVmdDogMzBweCBzb2xpZCBncmVlbjtcXHJcXG59XFxyXFxuXFxyXFxuLmFycm93LWJvZHkge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xcclxcbiAgd2lkdGg6IDQwcHg7XFxyXFxuICBoZWlnaHQ6IDIwcHg7XFxyXFxuICBtYXJnaW46IDA7XFxyXFxuICBtYXJnaW4tdG9wOiAyMHB4O1xcclxcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcXHJcXG4gIGJvcmRlci1sZWZ0OiAwO1xcclxcbiAgYm9yZGVyLXJpZ2h0OiAwO1xcclxcbn1cXHJcXG5cXHJcXG4uYXJyb3ctd3JhcHBlciB7XFxyXFxuICB3aWR0aDogNzBweDsgICAvKiBhcnJvdy1ib2R5IHdpZHRoICsgYXJyb3ctaGVhZCBib3JkZXIgd2lkdGggKi9cXHJcXG59XFxyXFxuXFxyXFxuLkFycm93IHtcXHJcXG4gIC8qIEZvciBzb21lIG5pY2UgYW5pbWF0aW9uIG9uIHRoZSByb3RhdGVzOiAqL1xcclxcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAtbW96LXRyYW5zaXRpb246ICAgIC1tb3otdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgICB0cmFuc2Zvcm0gLjJzO1xcclxcbn1cXHJcXG5cXHJcXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBBcnJvdyBleHRlbmRzIFRoaW5nIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHRcdHRoaXMudHlwZSA9ICdBcnJvdyc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuc2V0Q29sb3IodGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgYXJyb3cgYmVmb3JlIGNhbGxpbmcgdGhpc1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzZXRDb2xvciAoYykge1xyXG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctaGVhZCcpLmNzcyh7Ym9yZGVyTGVmdENvbG9yOmN9KTtcclxuXHRcdHRoaXMuJGVsZW1lbnQuZmluZCgnLmFycm93LWJvZHknKS5jc3Moe2JhY2tncm91bmRDb2xvcjpjfSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGh0bWwgKCkge1xyXG5cdFx0cmV0dXJuIFwiPGRpdj48ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj48L2Rpdj5cIjtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjcmVhdGVBcnJvd0VsZW1lbnQgKCkge1xyXG5cdFx0dmFyICRhcnJvdyA9ICQoXCI8ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj5cIik7XHJcblx0XHRyZXR1cm4gJGFycm93O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNzcyAoKSB7XHJcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9BcnJvdy5jc3MnKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQXJyb3cpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcnJvdztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEJHSW1nIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICB1cmw6ICcnLFxyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgIGxlZnQ6ICcwcHgnLFxyXG4gICAgICB0b3A6ICcwcHgnXHJcbiAgICB9O1xyXG4gICAgcHJvcHMgPSB0aGlzLnByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdCR0ltZyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XHJcbiAgICAgIGJhY2tncm91bmQ6ICd1cmwoXCInICsgcHJvcHMudXJsICsgJ1wiKSBuby1yZXBlYXQgY2VudGVyJyxcclxuICAgICAgYmFja2dyb3VuZFNpemU6ICdjb3ZlcicgIC8vMTAwJSAxMDAlJ1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEJHSW1nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQkdJbWc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBCb3ggZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICBcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgXHR0aGlzLnR5cGUgPSAnQm94JztcclxuICBcdHRoaXMuaXRlbXMgPSBbXTtcclxuICBcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIGFkZCAoYWRkSXRlbXMpIHtcclxuICBcdGlmIChhZGRJdGVtcykge1xyXG4gICAgICBpZiAoIShhZGRJdGVtcyBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG4gICAgICAgIGFkZEl0ZW1zID0gW2FkZEl0ZW1zXTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKHZhciBpPTA7IGkgPCBhZGRJdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuaXRlbXMucHVzaChhZGRJdGVtc1tpXSk7XHJcbiAgICAgICAgYWRkSXRlbXNbaV0ucGFyZW50ID0gdGhpczsgICAgICAgIFxyXG4gICAgICB9XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBpdGVtIGZyb20gdGhpcyBib3ggKGZyb20gdGhlIGRvbSBhbmQgdGhlIGl0ZW1zIGxpc3QpXHJcbiAgcmVtb3ZlIChpdGVtKSB7XHJcbiAgXHRpZiAoaXRlbSkge1xyXG4gIFx0XHR2YXIgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XHJcbiAgXHRcdGlmIChpbmRleCA+IC0xKSB7XHJcbiAgXHRcdCAgICB0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgXHRcdFx0aXRlbS4kZWxlbWVudC5yZW1vdmUoKTtcclxuICBcdFx0XHRpdGVtLnBhcmVudCA9IG51bGw7XHJcbiAgXHRcdH1cclxuICBcdH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgbnVtRWxlbWVudHMgKCkge1xyXG4gIFx0cmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgZ2V0RWxlbWVudEJvdW5kcyAoKSB7XHJcbiAgICB2YXIgYm91bmRzID0ge3g6OTk5OTk5LCB5Ojk5OTk5OSwgYm90dG9tOjAsIHJpZ2h0OjB9O1xyXG4gICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoIDwgMSkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcG9zID0gdGhpcy5pdGVtc1tpXS5nZXRCb3VuZGluZ0JveCgpO1xyXG4gICAgICBib3VuZHMueCA9IChwb3MueCA8IGJvdW5kcy54KSA/IHBvcy54IDogYm91bmRzLng7XHJcbiAgICAgIGJvdW5kcy55ID0gKHBvcy55IDwgYm91bmRzLnkpID8gcG9zLnkgOiBib3VuZHMueTtcclxuICAgICAgYm91bmRzLmJvdHRvbSA9IChwb3MuYm90dG9tID4gYm91bmRzLmJvdHRvbSkgPyBwb3MuYm90dG9tIDogYm91bmRzLmJvdHRvbTtcclxuICAgICAgYm91bmRzLnJpZ2h0ID0gKHBvcy5yaWdodCA+IGJvdW5kcy5yaWdodCkgPyBwb3MucmlnaHQgOiBib3VuZHMucmlnaHQ7XHJcbiAgICB9XHJcbiAgICBib3VuZHMudyA9IGJvdW5kcy5yaWdodCAtIGJvdW5kcy54O1xyXG4gICAgYm91bmRzLmggPSBib3VuZHMuYm90dG9tIC0gYm91bmRzLnk7XHJcbiAgICByZXR1cm4gYm91bmRzO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICBcdHN1cGVyLnJlbmRlcigpO1xyXG4gIFx0Zm9yICh2YXIgaT0wOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gIFx0XHR0aGlzLml0ZW1zW2ldLnJlbmRlcigpO1xyXG4gIFx0fVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEJveCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJveDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIENpcmNsZSBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgdGV4dDogJycsXHJcbiAgICAgIGxlZnQ6IDAsXHJcbiAgICAgIHRvcDogMCxcclxuICAgICAgcjogMjUsXHJcbiAgICAgIGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXHJcbiAgICAgIGZvbnRTaXplOiAnMjRweCcsXHJcbiAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcclxuICAgICAgY29sb3I6ICcjMGYwJyxcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzIyMicsXHJcbiAgICAgIGJvcmRlckNvbG9yOiAnI0JBREE1NScsXHJcbiAgICAgIGJvcmRlcldpZHRoOiA1XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgc3VwZXIuaW5pdChwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnQ2lyY2xlJztcclxuICAgIHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcblxyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblxyXG4gICAgLy8gYXBwbHkgY2lyY2xlIGNzc1xyXG4gICAgdmFyIG9mZnNldCA9IHByb3BzLnIgKyBwcm9wcy5ib3JkZXJXaWR0aDtcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgICAnbGVmdCc6ICcnICsgKHByb3BzLmxlZnQtb2Zmc2V0KSArICdweCcsXHJcbiAgICAgICAgJ3RvcCc6ICcnICsgKHByb3BzLnRvcC1vZmZzZXQpICsgJ3B4JyxcclxuICAgICAgICAnd2lkdGgnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2hlaWdodCc6ICcnICsgcHJvcHMucioyICsgJ3B4JyxcclxuICAgICAgICAnbGluZUhlaWdodCc6ICcnICsgcHJvcHMucioyICsgJ3B4JyxcclxuICAgICAgICAnYm9yZGVyJzogcHJvcHMuYm9yZGVyV2lkdGggKyAncHggc29saWQgJyArIHByb3BzLmJvcmRlckNvbG9yLFxyXG4gICAgICAgICdib3JkZXJSYWRpdXMnOiAnMTAwMDBweCcsXHJcbiAgICAgICAgJ3RleHRBbGlnbic6ICdjZW50ZXInLFxyXG4gICAgICAgICdvdmVyZmxvdyc6ICdoaWRkZW4nXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc2V0VGV4dCh0aGlzLnRleHQpO1xyXG4gIH1cclxuXHJcbiAgc2V0VGV4dCAodHh0KSB7XHJcbiAgICB0aGlzLnRleHQgPSB0eHQ7XHJcbiAgICB0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHR4dCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhDaXJjbGUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2PjxkaXYgaWQ9Y3ViZSBjbGFzcz1zaG93LWZyb250PjxmaWd1cmUgY2xhc3M9ZnJvbnQ+RjwvZmlndXJlPjxmaWd1cmUgY2xhc3M9YmFjaz5CPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz1yaWdodD5SPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz1sZWZ0Pkw8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPXRvcD5UPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz1ib3R0b20+RzwvZmlndXJlPjwvZGl2PjwvZGl2PlwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbi8qKlxyXG4gKiAgdywgaCwgZGVwdGhcclxuICovXHJcbmNsYXNzIEN1YmUgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdHc6IDUwMCxcclxuXHRcdFx0aDogNTAwLFxyXG5cdFx0XHRkOiA1MDBcclxuXHRcdH07XHJcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuXHRcdHRoaXMudyA9IHByb3BzLnc7XHJcblx0XHR0aGlzLmggPSBwcm9wcy5oO1xyXG5cdFx0dGhpcy5kID0gcHJvcHMuZDtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnQ3ViZSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuc2V0dXBDdWJlKHRoaXMuJGVsZW1lbnQpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzZXR1cEN1YmUoJGVsKSB7XHJcblx0XHR2YXIgJGNvbnRhaW5lciAgPSAkZWw7XHJcblx0XHR2YXIgJGN1YmUgICAgICAgPSAkZWwuZmluZCgnI2N1YmUnKTtcclxuXHRcdHZhciAkZmFjZUZyb250ICA9ICRlbC5maW5kKCcjY3ViZSAuZnJvbnQgJyk7XHJcblx0XHR2YXIgJGZhY2VCYWNrICAgPSAkZWwuZmluZCgnI2N1YmUgLmJhY2sgICcpO1xyXG5cdFx0dmFyICRmYWNlUmlnaHQgID0gJGVsLmZpbmQoJyNjdWJlIC5yaWdodCAnKTtcclxuXHRcdHZhciAkZmFjZUxlZnQgICA9ICRlbC5maW5kKCcjY3ViZSAubGVmdCAgJyk7XHJcblx0XHR2YXIgJGZhY2VUb3AgICAgPSAkZWwuZmluZCgnI2N1YmUgLnRvcCAgICcpO1xyXG5cdFx0dmFyICRmYWNlQm90dG9tID0gJGVsLmZpbmQoJyNjdWJlIC5ib3R0b20nKTtcclxuXHJcblx0XHR2YXIgaGFsZkhlaWdodCA9IHRoaXMuaC8yO1xyXG5cdFx0dmFyIGhhbGZXaWR0aCA9IHRoaXMudy8yO1xyXG5cdFx0dmFyIGhhbGZEZXB0aCA9IHRoaXMuZC8yO1xyXG5cclxuXHRcdCRjb250YWluZXIuY3NzKHtcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXHJcblx0XHRcdGxlZnQ6ICcwcHgnLFxyXG5cdFx0XHR0b3A6ICcwcHgnLFxyXG5cdFx0XHRwZXJzcGVjdGl2ZTogJzYwMDBweCcsXHJcblx0XHRcdHpJbmRleDogMjAwMDBcclxuXHRcdH0pO1xyXG5cclxuXHRcdCRjdWJlLmNzcyh7XHJcblx0XHRcdHdpZHRoOiAnMTAwJScsXHJcblx0XHRcdGhlaWdodDogJzEwMCUnLFxyXG5cdFx0XHR6SW5kZXg6IDIwMDAwLFxyXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuXHRcdFx0dHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCcsXHJcblx0XHRcdHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMXMnXHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUZyb250LCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIC4yKScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlQmFjaywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsICAgMCwgICAwLCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtMTgwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZVJpZ2h0LCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgICAwLCAgNTUsIC41KScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMuZCArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLCBcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAgIDkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpICsgJ3B4ICknICAvKiBoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkgKi9cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VMZWZ0LCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAgIDAsIC41KScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMuZCArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLCBcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAgLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmV2lkdGggLSAoaGFsZldpZHRoLWhhbGZEZXB0aCkpICsgJ3B4ICknICAvKiBoYWxmV2lkdGggLSAoaGFsZldpZHRoLWhhbGZEZXB0aCkgKi9cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VUb3AsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoICAwLCAgNTUsIDI1NSwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoICAgOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlQm90dG9tLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgMjU1LCAgIDAsIC41KScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLCBcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAgLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmSGVpZ2h0ICsgKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkgKyAncHggKSdcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c2V0dXBGYWNlKCRmYWNlLCBjc3NWYWxzKSB7XHJcblx0XHR2YXIgZGVmYXVsdENTUyA9IHtcclxuXHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcclxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXHJcblx0XHRcdGxpbmVIZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdGZvbnRTaXplOiAodGhpcy5oLzMpICsncHgnLFxyXG5cdFx0XHRmb250V2VpZ2h0OiAnYm9sZCcsXHJcblx0XHRcdGNvbG9yOiAnd2hpdGUnLFxyXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXHJcblx0XHR9O1xyXG5cdFx0JGZhY2UuY3NzKCQuZXh0ZW5kKHt9LCBkZWZhdWx0Q1NTLCBjc3NWYWxzKSk7XHJcblx0fVxyXG5cclxuXHRodG1sICgpIHtcclxuXHRcdHJldHVybiByZXF1aXJlKCcuL0N1YmUuaHRtbCcpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNzcyAoKSB7XHJcblx0XHQvLyByZXR1cm4gcmVxdWlyZSgnLi9DdWJlLmNzcycpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhDdWJlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3ViZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcclxcbi5EZW1vQm94IHtcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gIG1hcmdpbjogMjBweDtcXHJcXG4gIHdpZHRoOiAyMDBweDsgXFxyXFxuICBoZWlnaHQ6IDIwMHB4OyBcXHJcXG4gIGJvcmRlcjogMnB4IGRhc2hlZCAjZWVlO1xcclxcbn1cXHJcXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBCb3ggPSByZXF1aXJlKCcuLi9Cb3gvQm94LmpzJyk7XHJcblxyXG5jbGFzcyBEZW1vQm94IGV4dGVuZHMgQm94IHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHN1cGVyLmluaXQocHJvcHMpO1xyXG5cdFx0cHJvcHMud2lkdGggPSBwcm9wcy53aWR0aCB8fCAyMDA7XHJcblx0XHRwcm9wcy5oZWlnaHQgPSBwcm9wcy5oZWlnaHQgfHwgMjAwO1xyXG5cdFx0cHJvcHMucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFx0dGhpcy50eXBlID0gJ0RlbW9Cb3gnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3NzICgpIHtcclxuXHRcdHJldHVybiByZXF1aXJlKCcuL0RlbW9Cb3guY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKERlbW9Cb3gpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZW1vQm94O1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLy8gTGlrZSBVbml4IHBpcGU6IG91dHB1dCBvZiBvbmUgY29tbWFuZCBpcyBpbnB1dCB0byB0aGUgbmV4dFxyXG4vLyBFYWNoIGZ1bmN0aW9uIHRha2VzIGEgJ3Byb3BzJyBvYmplY3QgYXMgYXJndW1lbnRcclxuLy8gRWFjaCBmdW5jdGlvbiByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHJlc3VsdHMsIHdoaWNoIGlzIHBhc3NlZCBhcyBwcm9wcyB0byB0aGUgbmV4dFxyXG4vLyBEbygpIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgZXhlY3V0ZSB0aGUgRG8gY2hhaW5cclxuXHJcbi8vIFAucHVsc2Uuc2V0VG8oXHJcbi8vICAgICBEbyhSLmdldFJhbmRvbU51bWJlciwge2Zyb206MCwgdG86MTB9KSAgIC8vIHJldHVybnM6ICB7ZGF0YTogOH1cclxuLy8gICAgIC5EbyhDLnBpY2tDb2xvcikgICAgLy8gcmVhZHMgaW5wdXQgOCwgcmV0dXJucyB7ZGF0YTogJyNjZmYnfVxyXG4vLyAgICAgLkRvKEIuY2hhbmdlQ29sb3IpICAgLy8gcmVhZHMgaW5wdXQgJyNjZmYnLCBjaGFuZ2VzIGNvbG9yIG9uIEJsaW5rZXJcclxuLy8gKTtcclxuXHJcblxyXG5mdW5jdGlvbiBEbyhfYUZ1bmN0aW9uLCBfcHJvcHMsIF9maXJzdERvKSB7XHJcbiAgICB2YXIgYUZ1bmN0aW9uID0gX2FGdW5jdGlvbjtcclxuICAgIHZhciBwcm9wcyA9IF9wcm9wcztcclxuICAgIHZhciBmaXJzdERvID0gX2ZpcnN0RG8gfHwgZXhlY3V0b3I7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ2FmdW5jdGlvbj0nLCBhRnVuY3Rpb24pO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3Byb3BzPScsIHByb3BzKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdmaXJzdERvPScsIGZpcnN0RG8pO1xyXG5cclxuICAgIC8vIFJ1biB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzLlxyXG4gICAgLy8gUGFzcyB0aGUgcmVzdWx0cyB0byB0aGUgbmV4dCBjaGFpbmVkIGZ1bmN0aW9uIChpZiBhbnkpLlxyXG4gICAgLy8gUmV0dXJuIHJlc3VsdHMgb2YgdGhpcyBmdW5jdGlvbiBvciBvZiB0aGUgY2hhaW5cclxuICAgIGZ1bmN0aW9uIGV4ZWN1dG9yIChwaXBlZFByb3BzKSB7XHJcbiAgICAgICAgdmFyIHJldHVyblZhbCA9IGFGdW5jdGlvbihwcm9wcyB8fCBwaXBlZFByb3BzKTtcclxuICAgICAgICByZXR1cm4gKGV4ZWN1dG9yLm5leHREbyA/IGV4ZWN1dG9yLm5leHREbyhyZXR1cm5WYWwpIDogcmV0dXJuVmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gdGhlIGxhc3QgJ0RvJyBpbiB0aGUgY2hhaW5cclxuICAgIGZ1bmN0aW9uIGdldExhc3REbyAoKSB7XHJcbiAgICAgICAgdmFyIHRtcERvID0gZmlyc3REbztcclxuICAgICAgICB3aGlsZSAodG1wRG8ubmV4dERvKSB7IHRtcERvID0gdG1wRG8ubmV4dERvOyB9XHJcbiAgICAgICAgcmV0dXJuIHRtcERvO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBhIG5ldyAnRG8nIHRvIHRoZSBlbmQgb2YgdGhlIGNoYWluLlxyXG4gICAgZXhlY3V0b3IuRG8gPSBmdW5jdGlvbiAoYUZ1bmN0aW9uLCBwcm9wcykge1xyXG4gICAgICAgIGdldExhc3REbygpLm5leHREbyA9IERvKGFGdW5jdGlvbiwgcHJvcHMsIGZpcnN0RG8pO1xyXG4gICAgICAgIHJldHVybiBmaXJzdERvOyAgLy8gQWx3YXlzIHJldHVybiB0aGUgZmlyc3QgJ0RvJyBpbiB0aGUgY2hhaW5cclxuICAgIH07XHJcblxyXG4gICAgZXhlY3V0b3IubmV4dERvID0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4gZXhlY3V0b3I7XHJcbn1cclxuXHJcblRoaW5nLkRvID0gRG87XHJcblxyXG4vKlxyXG4vLyBjaGFpbmVkLCBlYWNoIERvIGhhcyBpdHMgb3duIHBhcmFtZXRlcnNcclxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpO30sIHthcmcxOidoZWxsbzEnfSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpO30sIHthcmcyOidoZWxsbyB0byAyMjIyMid9KVxyXG5cclxuLy8gY2hhaW5lZCwgd2l0aCBmaXJzdCBEbyBwaXBpbmcgcmVzdWx0cyB0byBzZWNvbmQgRG9cclxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpO30sIG51bGwpXHJcblxyXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7IHJldHVybiB7cGlwZWRwcm9wOjEyMzR9fSwge2FyZzE6J2hlbGxvMSd9KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7IHJldHVybiB7bmV3UHJvcDpwcm9wcy5waXBlZHByb3ArMn19KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDMnLCBwcm9wcyk7fSlcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRG87XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vKlxyXG4gICAgc3JjOiA8ZmlsZSBwYXRoPlxyXG4gICAgY2VudGVyOiB0cnVlfGZhbHNlXHJcbiAgICBzaXplOiBjb250YWlufGNvdmVyfHN0cmV0Y2hcclxuKi9cclxuXHJcbmNsYXNzIEltZyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIHBsYWNlaG9sZGVyID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBTWdBQUFESUNBWUFBQUN0V0s2ZUFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTEV3QUFDeE1CQUpxY0dBQUFCVjlKUkVGVWVKenQzYzF1M1VRY2grRi9FQks5QXNRQ1ZXZlZRcTRDYmh4dUE0RXFzU21oKzdJdWk5UUNRdkk3WXgrUFA1OUg4aTZ5Wm83bXpmZ2tsbjFYVlo4S2VOWVhhdzhBdGt3Z0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dlRExFVDk3MTIwVXNMeW1PMGpzSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSU0rN1ZOVjNhdzlpUWZkVjlYcnRRV3pWcDhiakxDNVY5WHRWUGRRNUlybXZxZzlWOWE3T0ZVbnp1aGZJUHk3MUdNY3c1Nk5ITXNReHpQZE1rUWhrcEV2OU40NmpSL0kwanJORklwQVJMdlY4SEVlTjVLVTR6aFNKUUJwZEtzZHh0RWl1eFhHV1NBVFM0Rkp0Y1J3bGt0WTR6aENKUUs2NDFMZzQvaDNKOTR1UDluWmo0emg2SkFJSkxqVXRqcjFHTWpXT0kwY2lrQmRjNnJZNDloYkpyWEVjTlJLQlBPTlM4OFN4bDBqbWl1T0lrVFROK1d5M21yeXFxcTltUE44M1ZmVlRiVE9TKzZyNnVhcStudkdjcno0ZnAzS21IYVRxY1RFLzFIeS9WYmU0azh5OWMzeXFxdmRWOVdiSlNYVG1FaXM0Y2lUaWFDT1FLNDRZaVRqYUNhUkJqMGorckhVaUVjYzRBbWwwaEVqRU1aNUFSdGh6Sk9LWVJpQWpmVitQaTNwUGtZaGpPb0ZNc0tkSWVzVHhSNTBqamlxQlRMYUhTTVJ4TzRIY1lNdVJpR01lQXJsUnIwanVieGlUT09ZamtCbHNLUkp4ekVzZ005bENKT0tZbjBCbXRHWWs0dWhESUROYkl4Sng5Q09RRHU1cnVVaDZ4ZkYybGs5aS93VFN5UktSaUtNL2dYVFVNeEp4TEVNZ25mV0k1RU9KWXlrQ1dVQ1BTTVN4RElFc1pLdVJpQ01UeUlKNmZHOFFSMThDV2RoV0lua29jYlFReUFyV2prUWM3UVN5a3JVaUVjYzRBbG5SMHBHSVl6eUJyR3lwU01ReGpVQTJvSGNrNHBoT0lCdlJLeEp4M0ticGN6N2IwOTJQNW03dEFaeUJIYVNmSlM2eDl2ek94RFc1eEZyWmtsL1NSVEtlUUZhMHhwOTVSVEtPUUZheTVqOEtSZEpPSUN2WXdxMG1JbWtqa0lXdEhZZEl4aEhJZ3JZU2gwamFDV1FoVzR0REpHMEVzb0N0eGlHUzZ3VFNXWTg0SHFyUGkwVkY4bjhDNmFoWEhHL3JjVEdMcEQrQmROSXpqb0ZJK2hOSUIwdkVNUkJKWHdLWjJaSnhERVRTajBCbXRFWWNBNUgwSVpDWnJCbkhRQ1R6RThnTXRoREhRQ1R6RXNpTnR2aVVkWkhNUnlBMzJHSWNBNUhNUXlBVGJUbU9nVWh1SjVBSjloREhRQ1MzRWNoSWU0cGpJSkxwQkRMQ0h1TVlpR1FhZ1RUYWN4d0RrWXdua0FaSGlHTWdrbkVFY2tXdk9ONHNPWWtuUk5KT0lNRVI0eGlJcEkxQVhuRGtPQVlpdVU0Z3p6aERISU5la1J6bGlmSk5jejdiMDkwL2ZqN204bEJWUDFUVnJ6T2VjeTYvVk5XUDlmaUs2cmw4cktxL1pqemZMcHhwQjZtcWVsMVY3K3E0TzhkVGMrMGt2MVhWdHd1UHZTZVhXTUd0a2V3bGpzR3RrUnd0amlxQlhEVTFrdmUxcnpnR1V5TTVZaHhWQW1reU5wSzl4akVZRzhsUjQ2Z1NTTFBXU1BZZXg2QTFraVBIVVNXUVVhNUZjcFE0QnRjaU9Yb2NWUUlaN2FWSWpoYkg0S1ZJemhCSGxVQW1lUnJKVWVNWVBJM2tMSEZVQ1dTeUlaS2p4ekVZSWpsVEhGVUN1Y25yT2tjY2c3ZDFyamlxR3RmOVhiVXZmaSt0NTBpYTF2M1o3c1dDVVFRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRSEJYVlovV0hnUnNsUjBFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRWdyOEJpUVZ6cTlMdjFPb0FBQUFBU1VWT1JLNUNZSUk9JztcclxuXHJcbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG4gICAgcHJvcHMuc3JjID0gcHJvcHMuc3JjIHx8IHBsYWNlaG9sZGVyO1xyXG4gICAgLy8gcHJvcHMuYmFja2dyb3VuZCA9ICd1cmwoXCInICsgcHJvcHMuc3JjICsgJ1wiKSBuby1yZXBlYXQgJyArIChwcm9wcy5jZW50ZXIgPyAnY2VudGVyJyA6ICdsZWZ0IHRvcCcpO1xyXG4gICAgLy8gcHJvcHMuYmFja2dyb3VuZFNpemUgPSAocHJvcHMuc2l6ZSA9PT0gJ2NvbnRhaW4nIHx8IHByb3BzLnNpemUgPT09ICdjb3ZlcicgPyBwcm9wcy5zaXplIDogKHByb3BzLnNpemU9PT0nc3RyZXRjaCcgPyAnMTAwJSAxMDAlJyA6IHVuZGVmaW5lZCkgKTtcclxuXHJcbiAgICB0aGlzLnByb3BzID0gVGhpbmcuY2xlYW51cChwcm9wcyk7XHJcblxyXG4gICAgdGhpcy50eXBlID0gJ0ltZyc7XHJcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gMTtcclxuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLnNyYyA9IHByb3BzLnNyYztcclxuICAgIHRoaXMueCA9IHByb3BzLnggfHwgdW5kZWZpbmVkO1xyXG4gICAgdGhpcy55ID0gcHJvcHMueSB8fCB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLncgPSBwcm9wcy53IHx8IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuaCA9IHByb3BzLmggfHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIEltZy5sb2FkaW5nKHRoaXMpO1xyXG4gICAgbG9hZEltYWdlKHByb3BzLnNyYywgdGhpcy5vbmxvYWQuYmluZCh0aGlzKSwgdGhpcy5vbmVycm9yLmJpbmQodGhpcykpO1xyXG5cclxuICAgIHN1cGVyLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgb25sb2FkIChpbWcpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZygnSW1hZ2UgTG9hZGVkOicsIGltZywgaW1nLnNyYywgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcclxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSBpbWcuaGVpZ2h0IC8gaW1nLndpZHRoOyAgLy8gYXNwZWN0IHJhdGlvIG9mIG9yaWdpbmFsIGltYWdlXHJcbiAgICB0aGlzLncgPSB0aGlzLncgfHwgaW1nLndpZHRoO1xyXG4gICAgdGhpcy5oID0gdGhpcy5oIHx8ICh0aGlzLncgKiB0aGlzLmFzcGVjdFJhdGlvKTtcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53LFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5oLFxyXG4gICAgICAgIGJhY2tncm91bmQ6ICd1cmwoJyAraW1nLnNyYysgJykgbm8tcmVwZWF0IGNlbnRlcicsXHJcbiAgICAgICAgYmFja2dyb3VuZFNpemU6ICcxMDAlIDEwMCUnXHJcbiAgICB9KTtcclxuICAgIEltZy5sb2FkZWQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBvbmVycm9yIChpbWcpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZygnSW1nLm9uZXJyb3InLCBpbWcuc3JjLCAnZmFpbGVkJyk7XHJcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmVycm9yID0gdHJ1ZTtcclxuICAgIHRoaXMud2lkdGggPSB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gMTtcclxuICAgIEltZy5sb2FkZWQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBzZXRXaWR0aCAodykge1xyXG4gICAgdGhpcy53aWR0aCA9IHc7XHJcbiAgICB0aGlzLmhlaWdodCA9IHcgKiB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHRcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbG9hZGluZyAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coXCJJTUcubG9hZGluZygpOlwiLCBpbWcuc3JjKTtcclxuICAgIEltZy5xdWV1ZWRJbWdzID0gSW1nLnF1ZXVlZEltZ3MgfHwgW107XHJcbiAgICBpZiAoaW1nICYmICFpbWcubG9hZGVkKSB7XHJcbiAgICAgICAgSW1nLnF1ZXVlZEltZ3MucHVzaChpbWcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkZWQgKGltZykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwiSU1HLmxvYWRlZCgpOlwiLCBpbWcuc3JjLCBJbWcucXVldWVkSW1ncy5sZW5ndGgpO1xyXG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcclxuICAgIGlmIChpbWcgJiYgaW1nLmxvYWRlZCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IEltZy5xdWV1ZWRJbWdzLmluZGV4T2YoaW1nKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBJbWcucXVldWVkSW1ncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoSW1nLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIEltZy5vbkFsbExvYWRlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBJbWcucXVldWVkSW1ncy5sZW5ndGggPT09IDA7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgb25BbGxMb2FkZWQgKCkge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwiSU1HLm9uQWxsTG9hZGVkKCk6IHRyaWdnZXJlZFwiKTtcclxuICB9XHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKEltZyk7XHJcblxyXG5cclxuZnVuY3Rpb24gbG9hZEltYWdlIChzcmMsIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY2FsbGJhY2sodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgaW1nLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZXJyb3JDYWxsYmFjayh0aGlzKTtcclxuICAgIH07XHJcbiAgICBpbWcuc3JjID0gc3JjO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEltZztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIExhYmVsIGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHRmb250RmFtaWx5OiAnQ2FsaWJyaSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG5cdFx0XHRmb250U2l6ZTogJzE0cHgnLFxyXG5cdFx0XHRjb2xvcjogJyMwMDAnXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0xhYmVsJztcclxuXHRcdHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMudGV4dCk7XHJcblx0fVxyXG5cclxuXHRzZXRUZXh0ICh0eHQpIHtcclxuXHRcdHRoaXMudGV4dCA9IHR4dDtcclxuXHRcdHRoaXMuJGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQodHh0KTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoTGFiZWwpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYWJlbDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcclxcbi5MaW5lIHtcXHJcXG4gIC8qIEZvciBzb21lIG5pY2UgYW5pbWF0aW9uIG9uIHRoZSByb3RhdGVzOiAqL1xcclxcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAtbW96LXRyYW5zaXRpb246ICAgIC1tb3otdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgICB0cmFuc2Zvcm0gLjJzO1xcclxcbn1cXHJcXG5cXHJcXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBMaW5lIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICAvLyBleHBlY3RpbmcgcHJvcHM6IHsgeDE6MCwgeTE6MCwgeDI6NTAsIHkyOjUwIH1cclxuICAgIHByb3BzLmJhY2tncm91bmRDb2xvciA9IHByb3BzICYmIChwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgcHJvcHMuY29sb3IgfHwgJ2JsYWNrJyk7XHJcbiAgICBzdXBlci5pbml0KHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdMaW5lJztcclxuICAgIHRoaXMubGVuZ3RoID0gMTA7XHJcbiAgICB0aGlzLndpZHRoID0gMTtcclxuICAgIHRoaXMuYW5nbGUgPSAwO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyh0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy5jcmVhdGVMaW5lKHByb3BzLngxLCBwcm9wcy55MSwgcHJvcHMueDIsIHByb3BzLnkyLCBwcm9wcy53aWR0aCwgcHJvcHMuYXJyb3csIHByb3BzLnNob3J0ZW4pO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlTGluZSAoeDEseTEsIHgyLHkyLCB3aWR0aCwgYXJyb3csIHNob3J0ZW4pIHtcclxuICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCAyO1xyXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoKHgxLXgyKSooeDEteDIpICsgKHkxLXkyKSooeTEteTIpKSAtIChhcnJvdz8gdGhpcy53aWR0aCoyIDogMCk7ICAvLyBzaG9ydGVuIHRoZSBsZW5ndGggdG8gbWFrZSByb29tIGZvciBhcnJvd2hlYWRcclxuICAgIHRoaXMuYW5nbGUgID0gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKSAqIDE4MCAvIE1hdGguUEk7XHJcbiAgICB0aGlzLmxlbmd0aCAtPSBzaG9ydGVuIHx8IDA7ICAvLyBzaG9ydGVuIHRoZSBsaW5lIGEgYml0IChtYWtlcyByb29tIGZvciBhcnJvd2hlYWQpXHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgJ2xlZnQnOiAnJyArIHgxICsgJ3B4JyxcclxuICAgICAgICAndG9wJzogJycgKyAoeTEtKHRoaXMud2lkdGgvMikpICsgJ3B4JyxcclxuICAgICAgICAnd2lkdGgnOiAnJyArIHRoaXMubGVuZ3RoICsgJ3B4JyxcclxuICAgICAgICAnaGVpZ2h0JzogJycgKyB0aGlzLndpZHRoICsgJ3B4JyxcclxuICAgICAgICAvLyByb3RhdGUgYXJvdW5kIHN0YXJ0IHBvaW50IG9mIGxpbmVcclxuICAgICAgICAndHJhbnNmb3JtLW9yaWdpbic6ICcwIDUwJSdcclxuICAgICAgfSk7XHJcbiAgICB0aGlzLnJvdGF0ZVRvKHRoaXMuYW5nbGUpO1xyXG4gICAgaWYgKGFycm93KSB7XHJcbiAgICAgIHRoaXMuYWRkQXJyb3dIZWFkKHRoaXMubGVuZ3RoLCB0aGlzLndpZHRoLCB0aGlzLndpZHRoKjIsIHRoaXMucHJvcHMuYmFja2dyb3VuZENvbG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGxlbiBvZiBsaW5lLCB3aWR0aCBvZiBsaW5lLCBzaXplIG9mIHRyaWFuZ2xlIChpZS4gMTAgd2lsbCBiZSAxMHB4IHdpZGUgYW5kIDIwcHggaGlnaClcclxuICBhZGRBcnJvd0hlYWQgKGxlbiwgd2lkdGgsIHNpemUsIGNvbG9yKSB7XHJcbiAgICB0aGlzLmFycm93SGVhZCA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICB0aGlzLmFycm93SGVhZC5jc3Moe1xyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgd2lkdGg6IDAsIFxyXG4gICAgICBoZWlnaHQ6IDAsIFxyXG4gICAgICBmb250U2l6ZTogMCxcclxuICAgICAgbGluZUhlaWdodDogMCxcclxuICAgICAgbGVmdDogbGVuICsgJ3B4JyxcclxuICAgICAgdG9wOiAtKHNpemUtKHdpZHRoLzIpKSArICdweCcsXHJcbiAgICAgIGJvcmRlckJvdHRvbTogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXHJcbiAgICAgIGJvcmRlclRvcDogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXHJcbiAgICAgIGJvcmRlckxlZnQ6IHNpemUgKyAncHggc29saWQgJyArIGNvbG9yXHJcbiAgICB9KTtcclxuICAgIHRoaXMuJGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQodGhpcy5hcnJvd0hlYWQpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNzcyAoKSB7XHJcbiAgXHRyZXR1cm4gcmVxdWlyZSgnLi9MaW5lLmNzcycpO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhMaW5lKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGluZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5QYXR0ZXJuLkdyYXBoUGFwZXIge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMztcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTAwcHggMTAwcHgsIDEwMHB4IDEwMHB4LCAyMHB4IDIwcHgsIDIwcHggMjBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC0ycHggLTJweCwgLTJweCAtMnB4LCAtMXB4IC0xcHgsIC0xcHggLTFweDtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuMykgMXB4LCB0cmFuc3BhcmVudCAxcHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uR3JpZCB7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC0ycHggLTJweCwgLTJweCAtMnB4O1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTpcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlNvZmFEYXJrIHtcXHJcXG4gIGJhY2tncm91bmQ6XFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgMTAwJSwgMjclKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA5JSkgMCAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDglLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgMTAlKSA1MCUgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAzMCUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAzMCUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgNTAlIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSAxMDAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMTUlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMTUlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSA1MCUsXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg0NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDAsXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCgtNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMwMDtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uU29mYSB7XFxyXFxuICBiYWNrZ3JvdW5kOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDk5JSwgNDAlKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA5JSkgMCAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDglLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgMTAlKSA1MCUgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCA0NiUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCA0MSUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDIzJSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDEwMCUgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCA5NiUsIDQlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMTUlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSA1MCUsXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg0NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDAsXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCgtNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMwMDtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uWWVsbG93Q2lyY2xlc1dpdGhWaW9sZXQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQoI2ZmZDY3OSAxNyUsICMzZDU0NDMgMTcuNSUsICMzZDU0NDMgMTguMiUsICMzY2RhZGEgMTklLCAjNmRlOGU4IDI0JSwgI2VkY2JmYiAzMCUsIHRyYW5zcGFyZW50IDM2JSksIHJhZGlhbC1ncmFkaWVudCgjM2RhYmM3IDEyJSwgIzQ5YWIzYyAxMy41JSwgIzM4ODIyZSAxNCUsICNmZmRiODkgMTQuNSUsICNmZmRiODkgMTklLCAjZmZmNTdhIDIwJSwgI2ZjZmZiNSAyOCUsICNmZmZlYmQgMjklKTtcXHJcXG4gICAgYmFja2dyb3VuZC1zaXplOiAyNSUsIDI1JTtcXHJcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCUgMCUsIDE3JSAxNyU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlllbGxvd0NpcmNsZXNXaXRoVmlvbGV0MiB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQoI2ZmZGQ5MCAxNyUsIGJsYWNrIDE3LjUlLCBibGFjayAxOC4yJSwgIzNjZGFkYSAxOSUsICM2ZGU4ZTggMjQlLCAjZWRjYmZiIDMwJSwgdHJhbnNwYXJlbnQgMzYlKSwgcmFkaWFsLWdyYWRpZW50KCMzY2RhZGEgMTclLCBncmF5IDE3LjUlLCBncmF5IDE4JSwgI2ZmZGQ5MCAxOSUsICNmZmRkOTAgMjQlLCAjZmZmZjkwIDMwJSwgI2ZmZmY5MCAzNiUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAyNSUsIDI1JTtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAlIDAlLCAxNyUgMTclO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5Qb2xrYURvdHMge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTpcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHdoaXRlIDE1JSwgdHJhbnNwYXJlbnQgMTclKSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHdoaXRlIDE1JSwgdHJhbnNwYXJlbnQgMTclKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogNjBweCA2MHB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCAwLCAzMHB4IDMwcHg7XFxyXFxufVxcclxcblxcclxcblxcclxcblxcclxcbi5QYXR0ZXJuLkJsdWVCYWxscyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQoI2FjZiA3NyUsIHJnYmEoODgsOTksMjU1LC44OCkgODAlLCB0cmFuc3BhcmVudCA4MyUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAyNSUgMjUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5TdHJpcGVzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1NSwyNTUsMjUsMSkgNTAlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5TdHJpcGVzV2hpdGVSZWRHcmVlbiB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUxJSwgI2ZmZmZjOCA1MSUsICNmZmZmYzggNTklLCB0cmFuc3BhcmVudCA1OSUpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDQzJSwgI2YzMzA1NCA0MyUsICNmMzMwNTQgNjclLCB0cmFuc3BhcmVudCA2NyUpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICMwMjliNGYgMzQlLCAjMjYyNjI2IDM0JSwgIzI2MjYyNiA3NSUsICMwMjliNGYgNzUlKTtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAlLCAwJSwgMCU7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JSwgMTUlLCAxNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlBsYWlkUmVkIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA4NiUsIDM0JSk7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUzcHgsIHRyYW5zcGFyZW50IDUzcHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjZweCwgdHJhbnNwYXJlbnQgNjZweCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjlweCwgcmdiYSgwLDYwLDAsLjUpIDE2OXB4LFxcclxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE4MnB4LCByZ2JhKDAsNjAsMCwuNSkgMTgycHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDIzMnB4LCB0cmFuc3BhcmVudCAyMzJweCksXFxyXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMjcwZGVnLCB0cmFuc3BhcmVudCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDY2cHgsIHRyYW5zcGFyZW50IDY2cHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY5cHgsIHJnYmEoMCw2MCwwLC41KSAxNjlweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxODJweCwgcmdiYSgwLDYwLDAsLjUpIDE4MnB4LFxcclxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAyMzJweCwgdHJhbnNwYXJlbnQgMjMycHgpLFxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDEyNWRlZywgdHJhbnNwYXJlbnQsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMnB4LCByZ2JhKDAsMCwwLC4yKSAycHgsXFxyXFxuICAgICAgcmdiYSgwLDAsMCwuMikgM3B4LCB0cmFuc3BhcmVudCAzcHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNXB4LCByZ2JhKDAsMCwwLC4yKSA1cHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5EaWFnb25hbFN0cmlwZXMge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBibGFjayAyNSUsIHRyYW5zcGFyZW50IDI1LjUlLCB0cmFuc3BhcmVudCA1MCUsIGJsYWNrIDUwLjUlLCBibGFjayA3NSUsIHRyYW5zcGFyZW50IDc1LjUlLCB0cmFuc3BhcmVudCk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE2JSAxNiU7ICAvKiBtdXN0IG1hdGNoIGFzcGVjdCByYXRpbyBvZiBjb250YWluaW5nIGVsZW1lbnQgb3IgbGluZXMgd2lsbCBicmVhayAqL1xcclxcbiAgICAgICAgLyogaWUuIDMyJSAxNiUgZm9yIGFuIGVsZW1lbnQgd2l0aCB3PTEwMCBoPTIwMCAqL1xcclxcbiAgICAgICAgLyogUG93ZXJzIG9mIDIgd29yayBiZXN0IChvdGhlciB2YWx1ZXMsIGxpa2UgNyBvciAyMywgbWFrZSBqYWdneSBhbGlhc2luZykgKi9cXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uQmx1ZUNhc2NhZGUge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAyNjg3MztcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MWRlZywgcmdiYSgyNTUsMjU1LDI1LDAuMTcpIDUwJSwgdHJhbnNwYXJlbnQgNTEuNSUpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoODlkZWcsIHJnYmEoMjUsMjU1LDI1NSwwLjIzKSA1MCUsIHRyYW5zcGFyZW50IDU0LjUlKSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwLjVkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgyNTIsIDI1NSwgMTYyLCAwLjM3KSA1NC41JSksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAuNzUlLCByZWQgNTElLCByZWQgNTEuNSUsIHRyYW5zcGFyZW50IDUxLjc1JSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDUlIDEwMCUsIDMlIDEwMCUsIDklIDEwMCUsIDglIDEwMCU7XFxyXFxufVxcclxcblxcclxcbiAvKlBlcmxpbiBOb2lzZS1pc2ggcmFkaWFsIGJsdXJzKi9cXHJcXG4gIC8qUkdCKi9cXHJcXG4gIC8qYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KHJnYmEoMjU1LCA0MiwgMCwgLjUpIDElLCB0cmFuc3BhcmVudCAyMDAlKSwgcmFkaWFsLWdyYWRpZW50KHJnYmEoODYsIDI1MCwgMiwgLjUpIDElLCB0cmFuc3BhcmVudCAyMDAlKSwgcmFkaWFsLWdyYWRpZW50KHJnYmEoMCwgNywgMjU1LCAwLjYpIDElLCB0cmFuc3BhcmVudCAxNTAlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTYxcHgsIDEzNHB4LCAxODhweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC01NHB4LCA1N3B4LCA1NXB4O1xcclxcbiAgKi9cXHJcXG5cXHJcXG4gIC8qTW9ub2Nocm9tZSAtIGJldHRlciBibHVycyovXFxyXFxuLypcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC41NikgMCUsIHJnYmEoOSwgMSwgMTEyLCAwLjI1KSA0OCUsIHJnYmEoOSwgMSwgMTEyLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwLjEyKSA5NCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuNTYpIDAlLCByZ2JhKDksIDEsIDExMiwgMC4yNSkgNDglLCByZ2JhKDksIDEsIDExMiwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMC4xMikgOTQlKSwgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjU2KSAwJSwgcmdiYSg5LCAxLCAxMTIsIDAuMjUpIDQ4JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTIpIDk0JSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE4OHB4IDM0N3B4LCAxNzBweCwgMjA5cHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtNTRweCwgNTdweCwgNTVweDtcXHJcXG4qL1xcclxcblxcclxcbi5QYXR0ZXJuLkdyZWVuT3ZhbHNYcmF5IHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMzFjMGM7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHJnYmEoMTgsIDAsIDI1NSwgMCkgMCUsIHJnYmEoMywgMTc5LCAyNTUsIDAuMDkpIDQ4JSwgcmdiYSgxOTksIDIzNywgNDQsIDAuMTkpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDApIDk0JSksIFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDApIDAlLCByZ2JhKDIwNSwgMCwgMCwgMC4wNykgNDglLCByZ2JhKDI1NCwgMjA0LCAwLCAwLjExKSA2NSUsIHJnYmEoMjU1LCAyMTAsIDgsIDApIDk0JSksIFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuMDEpIDAlLCByZ2JhKDg1LCAyNTUsIDU5LCAwLjA4KSA0OCUsIHJnYmEoMTc0LCAyMDIsIDAsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDApIDk0JSk7XFxyXFxuICAgIGJhY2tncm91bmQtc2l6ZTogMTg4cHggMzQ3cHgsIDE3MHB4LCAyMDlweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC01NHB4LCA1N3B4LCA1NXB4O1xcclxcbn1cXHJcXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBQYXR0ZXJuIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgbGVmdDogJzBweCcsXHJcbiAgICAgIHRvcDogJzBweCcsXHJcbiAgICAgIGNvbG9yOiAnI2RkZCcsXHJcbiAgICAgIHBhdHRlcm46ICdHcmFwaFBhcGVyJyxcclxuICAgICAgY2VsbFdpZHRoOiAxMDAsXHJcbiAgICAgIGNlbGxIZWlnaHQ6IDEwMCxcclxuICAgICAgbGluZVdpZHRoOiAyXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MocHJvcHMucGF0dGVybik7XHJcbiAgICBpZiAocHJvcHMucGF0dGVybiA9PT0gJ2dyaWQnKSB7XHJcbiAgICAgIHRoaXMuY3NzKCBQYXR0ZXJuLm1ha2VHcmlkQ1NTKHByb3BzLmNlbGxXaWR0aCwgcHJvcHMuY2VsbFdpZHRoLCBwcm9wcy5saW5lV2lkdGgpICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgLy8gcmVuZGVyIGZpcnN0LCB0aGlzIHdpbGwgc2V0IGEgcGFyZW50IGVsZW1lbnRcclxuICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgLy8gdGhlbiBhZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xyXG4gICAgdmFyIHNpemUgPSBNYXRoLm1heCh0aGlzLnBhcmVudC4kZWxlbWVudC53aWR0aCgpLCB0aGlzLnBhcmVudC4kZWxlbWVudC5oZWlnaHQoKSk7XHJcbiAgICB0aGlzLmNzcyh7d2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUdyaWRDU1MgKGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgbGluZVdpZHRoKSB7XHJcbiAgICB2YXIgcHJvcHMgPSB7fTtcclxuICAgIHZhciBwb3MgPSAnLScgKyBsaW5lV2lkdGggKyAncHgnO1xyXG4gICAgcHJvcHMuYmFja2dyb3VuZFNpemUgPSAnJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCwgJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCc7XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kUG9zaXRpb24gPSBwb3MgKyAnICcgKyBwb3MgKyAnLCcgKyBwb3MgKyAnICcgKyBwb3M7XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kSW1hZ2UgPVxyXG4gICAgICAnbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpICcgK2xpbmVXaWR0aCsgJ3B4LCB0cmFuc3BhcmVudCAnICtsaW5lV2lkdGgrICdweCksJyArXHJcbiAgICAgICdsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpICcgK2xpbmVXaWR0aCsgJ3B4LCB0cmFuc3BhcmVudCAnICtsaW5lV2lkdGgrICdweCknO1xyXG4gICAgcmV0dXJuIHByb3BzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNzcyAoKSB7XHJcbiAgICByZXR1cm4gcmVxdWlyZSgnLi9QYXR0ZXJuLmNzcycpO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhQYXR0ZXJuKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEFjdGlvbiA9IHJlcXVpcmUoJy4uL0FjdGlvbi9BY3Rpb24uanMnKTtcclxudmFyIFRpbWVyID0gcmVxdWlyZSgnLi4vVGltZXIvVGltZXIuanMnKTtcclxuXHJcblxyXG5jbGFzcyBQdWxzYXIgZXh0ZW5kcyBBY3Rpb24ge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xyXG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XHJcblx0XHR0aGlzLlQgPSBUaW1lci5tYWtlKHtjYWxsYmFjazogdGhpcy50cmlnZ2VyLmJpbmQodGhpcyksIGRlbGF5OiB0aGlzLmRlbGF5fSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdvICgpIHtcclxuXHRcdHRoaXMuVC5nbygpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzdG9wICgpIHtcclxuXHRcdHRoaXMuVC5zdG9wKCk7XHJcblx0fVxyXG5cclxuXHR0cmlnZ2VyICgpIHtcclxuXHRcdHRoaXMuY2FsbGJhY2soKTtcclxuXHRcdHRoaXMuVC5nbygpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhQdWxzYXIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQdWxzYXI7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG52YXIgUEkgPSAzLjE0MTU5MjY1MzU5O1xyXG52YXIgSEFMRlBJID0gUEkvMi4wO1xyXG5cclxuY2xhc3MgUmFuZCB7XHJcblx0c3RhdGljIHJhbmRJdGVtKGFycikge1xyXG5cdFx0aWYgKGFyciAmJiBhcnIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRyZXR1cm4gYXJyWyBSYW5kLnJhbmRJbnQoMCwgYXJyLmxlbmd0aC0xKSBdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIChpbmNsdWRlZCkgYW5kIG1heCAoaW5jbHVkZWQpXHJcblx0Ly8gVXNpbmcgTWF0aC5yb3VuZCgpIHdpbGwgZ2l2ZSB5b3UgYSBub24tdW5pZm9ybSBkaXN0cmlidXRpb24hXHJcblx0c3RhdGljIHJhbmRJbnQobWluLCBtYXgpIHtcclxuXHRcdG1pbiA9IE1hdGguY2VpbChtaW58fDApO1xyXG5cdFx0bWF4ID0gTWF0aC5mbG9vcihtYXh8fDEpO1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAuOTk5OTk5XHJcblx0c3RhdGljIHJhbmRGbG9hdCgpIHtcclxuXHQgICAgcmV0dXJuIE1hdGgucmFuZG9tKCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcmFuZFBlcmNlbnQodGhyZXNob2xkKSB7XHJcblx0XHRyZXR1cm4gUmFuZC5yYW5kSW50KDEsMTAwKSA8IHRocmVzaG9sZDtcclxuXHR9XHJcblxyXG5cdC8vIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiBtYXhEaXN0YW5jZSBvZiB0YXJnZXQgKGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgdGFyZ2V0KVxyXG5cdHN0YXRpYyByYW5kQ2xvc2VUbyh0YXJnZXQsIG1heERpc3RhbmNlKSB7XHJcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZE5vcm1hbCgpKTsgICAgLy8gY29uY2VudHJhdGVkIHRvd2FyZHMgY2VudGVyIDUwJSBvZiByYW5nZVxyXG5cdFx0Ly8gcmV0dXJuIHRhcmdldCArIChtYXhEaXN0YW5jZSAqIHJhbmRTaW4yKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgc29tZXdoYXQgY29uY2VudHJhdGVkIHRvd2FyZHMgY2VudGVyIFxyXG5cdFx0cmV0dXJuIHRhcmdldCArIChtYXhEaXN0YW5jZSAqIFJhbmQucmFuZFBvdzIoKSk7ICAgLy8gc3ByZWFkIG92ZXIgZW50aXJlIHJhbmdlLCB3aXRoIHNoYXJwIGNvbmNlbnRyYXRpb24gYXJvdW5kIGNlbnRlclxyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gMCBhbmQgMSwgZGlzdHJpYnV0ZWQgZXhwb25lbnRpYWxseSBjbG9zZXIgdG8gMFxyXG5cdHN0YXRpYyByYW5kUG93KCkge1xyXG5cdFx0cmV0dXJuIE1hdGgucG93KDEuMCAtIFJhbmQucmFuZEZsb2F0KCksIDQpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gMCBhbmQgMSwgZGlzdHJpYnV0ZWQgdG93YXJkIDFcclxuXHRzdGF0aWMgcmFuZFNpbigpIHtcclxuXHRcdHJldHVybiBNYXRoLnNpbihSYW5kLnJhbmRGbG9hdCgpICogSEFMRlBJKTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXHJcblx0c3RhdGljIHJhbmRQb3cyKCkge1xyXG5cdFx0cmV0dXJuIFJhbmQucmFuZFBvdygpIC0gUmFuZC5yYW5kUG93KCk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgaW4gYSBiZWxsIGN1cnZlIGFyb3VuZCAwXHJcblx0c3RhdGljIHJhbmROb3JtYWwoKSB7XHJcblx0XHRyZXR1cm4gKChSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkpIC0gMy4wKSAvIDMuMDtcclxuXHR9XHJcblxyXG4gICAgLy8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGNsb3NlciB0byAwXHJcbiAgICBzdGF0aWMgcmFuZFNpbjIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFJhbmQucmFuZFNpbigpIC0gUmFuZC5yYW5kU2luKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmV0dXJuIGFycmF5IG9mIDMgaW50cywgZWFjaCAwLTI1NVxyXG4gICAgc3RhdGljIHJhbmRSR0IoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtSYW5kLnJhbmRJbnQoMCwyNTUpLCBSYW5kLnJhbmRJbnQoMCwyNTUpLCBSYW5kLnJhbmRJbnQoMCwyNTUpXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmFuZFJHQnN0cigpIHtcclxuXHRcdHZhciByZ2IgPSBSYW5kLnJhbmRSR0IoKTtcclxuICAgICAgICByZXR1cm4gJ3JnYmEoJyArcmdiWzBdKyAnLCcgK3JnYlsxXSsgJywnICtyZ2JbMl0rICcsIC45KSc7XHJcbiAgICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUmFuZCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmQ7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBCb3ggPSByZXF1aXJlKCcuLi9Cb3gvQm94LmpzJyk7XHJcblxyXG4vKipcclxuICogIHcsIGgsIGRlcHRoXHJcbiAqL1xyXG5jbGFzcyBSb29tIGV4dGVuZHMgQm94IHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuXHRcdFx0dzogMTUwMCxcclxuXHRcdFx0aDogMTAwMCxcclxuXHRcdFx0ZDogIDgwMCxcclxuXHRcdFx0Ym9yZGVyOiAnMXB4IHNvbGlkIGJsYWNrJyxcclxuXHRcdFx0cGVyc3BlY3RpdmU6ICcxMDAwMHB4J1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0dGhpcy53ID0gcHJvcHMudztcclxuXHRcdHRoaXMuaCA9IHByb3BzLmg7XHJcblx0XHR0aGlzLmQgPSBwcm9wcy5kO1xyXG5cdFx0dGhpcy53YWxscyA9IFtdO1xyXG5cclxuXHRcdHN1cGVyLmluaXQocHJvcHMpO1xyXG5cdFx0Ly8gdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnR5cGUgPSAnUm9vbSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuc2V0dXBSb29tKHRoaXMuJGVsZW1lbnQpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzZXR1cFJvb20oKSB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXM7XHJcblx0XHR2YXIgd2FsbHMgPSB0aGlzLndhbGxzO1xyXG5cdFx0dmFyIGhhbGZIZWlnaHQgPSB0aGlzLmgvMjtcclxuXHRcdHZhciBoYWxmV2lkdGggPSB0aGlzLncvMjtcclxuXHRcdHZhciBoYWxmRGVwdGggPSB0aGlzLmQvMjtcclxuXHJcblx0XHR2YXIgd3JhcHBlciA9IEJveC5tYWtlKHtcclxuXHRcdFx0d2lkdGg6ICcxMDAlJyxcclxuXHRcdFx0aGVpZ2h0OiAnMTAwJScsXHJcblx0XHRcdHpJbmRleDogMjAwMDAsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHR0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJyxcclxuXHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxcydcclxuXHRcdH0pO1xyXG5cclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2Zyb250Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAuMiknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVaKCAnICsgKGhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdiYWNrJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgwLCAwLCAwLCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVaKCAnICsgKC1oYWxmRGVwdGgpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgncmlnaHQnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMCwgNTUsIDEpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2xlZnQnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAwLCAxKScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMuZCArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLCBcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVZKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLWhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCd0b3AnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDU1LCAyNTUsIDEpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmSGVpZ2h0IC0gKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnYm90dG9tJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgwLCAyNTUsIDAsIDEpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblxyXG5cdFx0d3JhcHBlci5hZGQod2FsbHMpO1xyXG5cdFx0cm9vbS5hZGQod3JhcHBlcik7XHJcblx0fVxyXG5cclxuXHRtYWtlV2FsbCh3aGljaCwgY3NzVmFscykge1xyXG5cdFx0dmFyIGRlZmF1bHRDU1MgPSB7XHJcblx0XHRcdGRpc3BsYXk6ICdibG9jaycsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHRsaW5lSGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHRmb250U2l6ZTogKHRoaXMuaC8zKSArJ3B4JyxcclxuXHRcdFx0Zm9udFdlaWdodDogJ2JvbGQnLFxyXG5cdFx0XHRjb2xvcjogJ3doaXRlJyxcclxuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJyxcclxuXHRcdFx0YmFja2ZhY2VWaXNpYmlsaXR5OiAnaGlkZGVuJ1xyXG5cdFx0fTtcclxuXHRcdHZhciB3YWxsID0gVGhpbmcuY2xhc3Nlcy5Cb3gubWFrZSgkLmV4dGVuZCh7fSwgZGVmYXVsdENTUywgY3NzVmFscykpO1xyXG5cdFx0d2FsbC4kZWxlbWVudC5hZGRDbGFzcygnd2FsbCcpO1xyXG5cdFx0d2FsbC4kZWxlbWVudC5hZGRDbGFzcyh3aGljaCk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFwcGVuZCh3aGljaCk7XHJcblx0XHR3YWxsLndoaWNoID0gd2hpY2g7XHJcblx0XHRyZXR1cm4gd2FsbDtcclxuXHR9XHJcblxyXG5cdHNldHVwUm9vbU9sZCgkZWwpIHtcclxuXHRcdHZhciAkY29udGFpbmVyICA9ICRlbDtcclxuXHRcdHZhciAkY3ViZSAgICAgICA9ICRlbC5maW5kKCcjY3ViZScpO1xyXG5cdFx0dmFyICRmYWNlRnJvbnQgID0gJGVsLmZpbmQoJyNjdWJlIC5mcm9udCAnKTtcclxuXHRcdHZhciAkZmFjZUJhY2sgICA9ICRlbC5maW5kKCcjY3ViZSAuYmFjayAgJyk7XHJcblx0XHR2YXIgJGZhY2VSaWdodCAgPSAkZWwuZmluZCgnI2N1YmUgLnJpZ2h0ICcpO1xyXG5cdFx0dmFyICRmYWNlTGVmdCAgID0gJGVsLmZpbmQoJyNjdWJlIC5sZWZ0ICAnKTtcclxuXHRcdHZhciAkZmFjZVRvcCAgICA9ICRlbC5maW5kKCcjY3ViZSAudG9wICAgJyk7XHJcblx0XHR2YXIgJGZhY2VCb3R0b20gPSAkZWwuZmluZCgnI2N1YmUgLmJvdHRvbScpO1xyXG5cclxuXHRcdHZhciBoYWxmSGVpZ2h0ID0gdGhpcy5oLzI7XHJcblx0XHR2YXIgaGFsZldpZHRoID0gdGhpcy53LzI7XHJcblx0XHR2YXIgaGFsZkRlcHRoID0gdGhpcy5kLzI7XHJcblxyXG5cdFx0JGNvbnRhaW5lci5jc3Moe1xyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuXHRcdFx0bGVmdDogJzBweCcsXHJcblx0XHRcdHRvcDogJzBweCcsXHJcblx0XHRcdHBlcnNwZWN0aXZlOiAnNjAwMHB4JyxcclxuXHRcdFx0ekluZGV4OiAyMDAwMFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JGN1YmUuY3NzKHtcclxuXHRcdFx0d2lkdGg6ICcxMDAlJyxcclxuXHRcdFx0aGVpZ2h0OiAnMTAwJScsXHJcblx0XHRcdHpJbmRleDogMjAwMDAsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHR0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJyxcclxuXHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxcydcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlRnJvbnQsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjIpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggMGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VCYWNrLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgICAwLCAgIDAsIC41KScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIC0xODBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlUmlnaHQsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAgIDAsICA1NSwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoICAgOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKScgIC8qIGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSAqL1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUxlZnQsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsICAgMCwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoICAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKScgIC8qIGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSAqL1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZVRvcCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsICA1NSwgMjU1LCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5kICsgJ3B4JywgXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggICA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VCb3R0b20sIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoICAwLCAyNTUsICAgMCwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoICAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSArICdweCApJ1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZXR1cEZhY2UoJGZhY2UsIGNzc1ZhbHMpIHtcclxuXHRcdHZhciBkZWZhdWx0Q1NTID0ge1xyXG5cdFx0XHRkaXNwbGF5OiAnYmxvY2snLFxyXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuXHRcdFx0bGluZUhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0Zm9udFNpemU6ICh0aGlzLmgvMykgKydweCcsXHJcblx0XHRcdGZvbnRXZWlnaHQ6ICdib2xkJyxcclxuXHRcdFx0Y29sb3I6ICd3aGl0ZScsXHJcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcclxuXHRcdH07XHJcblx0XHQkZmFjZS5jc3MoJC5leHRlbmQoe30sIGRlZmF1bHRDU1MsIGNzc1ZhbHMpKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0Ly8gcmV0dXJuIHJlcXVpcmUoJy4vUm9vbS5jc3MnKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUm9vbSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvb207XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBUZXh0UGFuZSBleHRlbmRzIFRoaW5nIHtcclxuICAgIGluaXQgKHByb3BzKSB7XHJcbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgICAgICAgZm9udEZhbWlseTogJ0NhbGlicmksIFZlcmRhbmEsIEFyaWFsLCBzYW5zLXNlcmlmJyxcclxuICAgICAgICAgICAgZm9udFNpemU6ICcyNHB4JyxcclxuICAgICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXHJcbiAgICAgICAgICAgIGNvbG9yOiAncmdiKDIwMCwgMjAwLCAyMDApJyxcclxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICB3OiAxMDAsXHJcbiAgICAgICAgICAgIGg6IDEwMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICAgICAgc3VwZXIuaW5pdChwcm9wcyk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gJ1RleHRQYW5lJztcclxuICAgICAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG4gICAgfVxyXG5cclxuICAgIGZpbGxUZXh0ICgpIHtcclxuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbWF4ID0gMTAwMDtcclxuICAgICAgICB2YXIgJHNwYW4gPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcbiAgICAgICAgdmFyIHNwYW5IZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAvLyBlbGVtZW50IGhhcyB0byBiZSBhcHBlbmRlZCB0byBib2R5IHByaW9yLCBvciBzcGFuSGVpZ2h0IHdpbGwgYmUgMFxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYXBwZW5kKCRzcGFuKTtcclxuICAgICAgICB3aGlsZSAoc3BhbkhlaWdodCA8IG1heEhlaWdodCAmJiBtYXgtLSA+IDApIHtcclxuICAgICAgICAgICAgJHNwYW4uYXBwZW5kKHRoaXMudGV4dCk7XHJcbiAgICAgICAgICAgIHNwYW5IZWlnaHQgPSAkc3Bhbi5oZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyICgpIHtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmZpbGxUZXh0KHRoaXMudGV4dCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblRoaW5nLmFkZENsYXNzKFRleHRQYW5lKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dFBhbmU7XHJcbiIsInZhciBlbGVtZW50Q291bnRlciA9IDA7XHJcblxyXG5jbGFzcyBUaGluZyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdUaGluZyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplIChwcm9wcykge1xyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuICAgIC8vIENTUyBwcm9wcyBnbyBpbnRvIHRoaXMucHJvcHNcclxuICAgIHRoaXMucHJvcHMgPSBUaGluZy5jbGVhbnVwKHByb3BzKTtcclxuICAgIC8vIGtlZXAgdGhlc2UgcHJvcGVydGllcyBvbiAndGhpcydcclxuICAgIHRoaXMucm90YXRpb24gPSBwcm9wcy5yb3RhdGUgfHwgMDtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBwcm9wcy5zY2FsZSB8fCAxO1xyXG4gICAgdGhpcy54ID0gcHJvcHMueCB8fCAwO1xyXG4gICAgdGhpcy55ID0gcHJvcHMueSB8fCAwO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IG51bGw7XHJcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgdmFyIHBhcmVudEVsZW1lbnQgPSAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuJGVsZW1lbnQpIHx8ICQoZG9jdW1lbnQuYm9keSk7XHJcbiAgICBwYXJlbnRFbGVtZW50LmFwcGVuZCh0aGlzLiRlbGVtZW50KTtcclxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHRoaXMucHJvcHMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgZWxlbWVudCBmcm9tIGRvbSBhbmQgbnVsbCBpdCBvdXRcclxuICB1blJlbmRlciAoKSB7XHJcbiAgICBpZiAodGhpcy4kZWxlbWVudCkge1xyXG4gICAgICB0aGlzLiRlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldERpbWVuc2lvbnMgKCkge1xyXG4gICAgcmV0dXJuIHt3OiB0aGlzLiRlbGVtZW50LndpZHRoKCksIGg6IHRoaXMuJGVsZW1lbnQuaGVpZ2h0KCl9O1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm91bmRpbmdCb3ggKCkge1xyXG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxyXG4gICAgdmFyIHNjcm9sbHRvcCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xyXG4gICAgdmFyIHNjcm9sbGxlZnQgPSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCk7XHJcbiAgICB2YXIgYm91bmRzID0gdGhpcy4kZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IGJvdW5kcy5sZWZ0K3Njcm9sbGxlZnQsXHJcbiAgICAgIHk6IGJvdW5kcy50b3Arc2Nyb2xsdG9wLFxyXG4gICAgICB3OiBib3VuZHMud2lkdGgsXHJcbiAgICAgIGg6IGJvdW5kcy5oZWlnaHQsXHJcbiAgICAgIGJvdHRvbTogYm91bmRzLmJvdHRvbStzY3JvbGx0b3AsXHJcbiAgICAgIHJpZ2h0OiBib3VuZHMucmlnaHQrc2Nyb2xsbGVmdFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldFBvc2l0aW9uICgpIHtcclxuICAgIC8vIHJlbGF0aXZlIHRvIHBhZ2VcclxuICAgIHZhciB4eSA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XHJcbiAgICB2YXIgeiA9IHRoaXMuJGVsZW1lbnQuY3NzKCd6LWluZGV4Jyk7XHJcbiAgICB6ID0geiA/IHBhcnNlSW50KHopIDogdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIFt4eS5sZWZ0LCB4eS50b3AsIHpdO1xyXG4gIH1cclxuXHJcbiAgLy8gcmV0dXJuIHRoZSBlbGVtZW50J3MgQ1NTIHRyYW5zZm9ybSBtYXRyaXggYXMgYXJyYXkgb2YgNiB2YWx1ZXNcclxuICBnZXRDU1NUcmFuc2Zvcm0gKCkge1xyXG4gICAgdmFyIG1TdHIgPSB0aGlzLiRlbGVtZW50LmNzcygndHJhbnNmb3JtJykubWF0Y2goLy0/W1xcZFxcLl0rL2cpO1xyXG4gICAgdmFyIG1WYWwgPSBbXTtcclxuICAgIGZvciAodmFyIGk9MDsgaSA8IG1TdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbVZhbFtpXSA9IHBhcnNlRmxvYXQobVN0cltpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbVZhbDsgIFxyXG4gIH1cclxuXHJcbiAgcm90YXRlIChkZWdyZWVzKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IGRlZ3JlZXM7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByb3RhdGVUbyAoYW5nbGUpIHtcclxuICAgIHRoaXMucm90YXRpb24gPSBhbmdsZTtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNjYWxlIChmYWN0b3IpIHtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgKz0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGVUbyAoZmFjdG9yKSB7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNsYXRlICh4LCB5KSB7XHJcbiAgICB0aGlzLnggKz0geDtcclxuICAgIHRoaXMueSArPSB5O1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNsYXRlVG8gKHgsIHkpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNmb3JtICgpIHtcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgdHJhbnNmb3JtOiBUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGVGYWN0b3IsIHRoaXMueCwgdGhpcy55KVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGNzcyAocHJvcHMpIHtcclxuICAgIHRoaXMucHJvcHMgPSAkLmV4dGVuZCh0aGlzLnByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhwcm9wcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGh0bWwgKCkge1xyXG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2UgKCkge1xyXG4gICAgdmFyIGNscyA9IHRoaXM7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcbiAgICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENsYXNzIChjbHMpIHtcclxuICAgIFRoaW5nLmNsYXNzZXMgPSBUaGluZy5jbGFzc2VzIHx8IHt9O1xyXG4gICAgVGhpbmcuY2xhc3Nlc1tjbHMubmFtZV0gPSBjbHM7XHJcblxyXG4gICAgLy8gbG9hZCB0aGUgY2xhc3Mgc3R5bGVzICh0aGVzZSBhcmUgaW5jbHVkZWQgaW4gdGhlIGJ1bmRsZSBhdCBidWlsZCB0aW1lKVxyXG4gICAgY2xzLmNzcyAmJiBUaGluZy5hZGRDU1NTdHJpbmcoY2xzLmNzcygpLCBjbHMubmFtZSk7XHJcblxyXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgY3NzIGZpbGUgYXQgbG9hZCB0aW1lXHJcbiAgICBUaGluZy5hZGRDU1NGaWxlKGNscy5uYW1lICsgJy8nICsgY2xzLm5hbWUgKyAnLmNzcycsICdjc3MnK2Nscy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRDbGFzcyAobmFtZSkge1xyXG4gICAgcmV0dXJuIFRoaW5nLmNsYXNzZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xyXG5cclxuICBzdGF0aWMgbWFrZVN0eWxlcyAocHJvcHMpIHtcclxuICAgIHZhciBzdHlsZXMgPSBwcm9wcyB8fCB7fTtcclxuICAgICQuZXh0ZW5kKHN0eWxlcywge1xyXG4gICAgICAvLyBsZWZ0OiBwcm9wcy5sZWZ0IHx8IChwcm9wcy54ICYmIChwcm9wcy54ICsgXCJweFwiKSksXHJcbiAgICAgIC8vIHRvcDogcHJvcHMudG9wIHx8IChwcm9wcy55ICYmIChwcm9wcy55ICsgXCJweFwiKSksXHJcbiAgICAgIHdpZHRoOiBwcm9wcy53aWR0aCB8fCAocHJvcHMudyAmJiAocHJvcHMudyArIFwicHhcIikpLFxyXG4gICAgICBoZWlnaHQ6IHByb3BzLmhlaWdodCB8fCAocHJvcHMuaCAmJiAocHJvcHMuaCArIFwicHhcIikpLFxyXG4gICAgICB6SW5kZXg6IHByb3BzLnpJbmRleCB8fCBwcm9wcy56LFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHByb3BzLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgdHJhbnNmb3JtOiBwcm9wcy50cmFuc2Zvcm0gfHwgKFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1MocHJvcHMucm90YXRlLCBwcm9wcy5zY2FsZSwgcHJvcHMueCwgcHJvcHMueSkpLFxyXG4gICAgICBwb3NpdGlvbjogcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJ1xyXG4gICAgfSk7XHJcbiAgICBkZWxldGUgc3R5bGVzLnJvdGF0ZTtcclxuICAgIGRlbGV0ZSBzdHlsZXMuc2NhbGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLng7XHJcbiAgICBkZWxldGUgc3R5bGVzLnk7XHJcbiAgICBkZWxldGUgc3R5bGVzLno7XHJcbiAgICBkZWxldGUgc3R5bGVzLnc7XHJcbiAgICBkZWxldGUgc3R5bGVzLmg7XHJcbiAgICByZXR1cm4gc3R5bGVzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VUcmFuc2Zvcm1DU1MgKHJvdGF0ZSwgc2NhbGUsIHR4LCB0eSkge1xyXG4gICAgdmFyIHRyYW5zZm9ybSA9ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9ICh0eCB8fCB0eSkgPyAoVGhpbmcubWFrZVRyYW5zbGF0ZUNTUyh0eCwgdHkpICsgJyAnKSA6ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9IFRoaW5nLmlzTnVtZXJpYyhyb3RhdGUpID8gKFRoaW5nLm1ha2VBbmdsZUNTUyhyb3RhdGUpICsgJyAnKSA6ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9IHNjYWxlID8gKFRoaW5nLm1ha2VTY2FsZUNTUyhzY2FsZSkgKyAnICcpIDogJyc7XHJcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VBbmdsZUNTUyAoYW5nbGUpIHtcclxuICAgIHJldHVybiAncm90YXRlKCcrYW5nbGUrJ2RlZyknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VTY2FsZUNTUyAoc2NhbGUpIHtcclxuICAgIHJldHVybiAnc2NhbGUoJytzY2FsZSsnKSc7XHJcbiAgfVxyXG5cclxuICAvLyBOT1RFOiB0cmFuc2xhdGlvbiBjb29yZHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBlbGVtZW50J3MgcG9zaXRpb24gaW4gdGhlIGRvY3VtZW50IGZsb3cuXHJcbiAgLy8gVGhleSBhcmUgbm90IHRoZSBzYW1lIGFzIHNldHRpbmcgbGVmdC90b3AgdmFsdWVzLCB3aGljaCBhcmUgYWJzb2x1dGUgY29vcmRpbmF0ZXNcclxuICAvLyByZWxhdGl2ZSB0byB0aGUgcGFyZW50IGVsZW1lbnQuXHJcbiAgc3RhdGljIG1ha2VUcmFuc2xhdGVDU1MgKHgsIHkpIHtcclxuICAgIHggPSB4IHx8ICcwJztcclxuICAgIHkgPSB5IHx8ICcwJztcclxuICAgIHJldHVybiAndHJhbnNsYXRlKCcrIHggKyAncHgsICcgKyB5ICsncHgpJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlRWxlbWVudCAoaHRtbCwgcHJvcHMsIHR5cGUpIHtcclxuICAgIHZhciAkZWxlbWVudCA9ICQoaHRtbClcclxuICAgICAgLmNzcyhUaGluZy5tYWtlU3R5bGVzKHByb3BzKSlcclxuICAgICAgLmFkZENsYXNzKHR5cGUgfHwgJ3JhbmRvbScpXHJcbiAgICAgIC5hdHRyKCdpZCcsICh0eXBlIHx8ICdyYW5kb20nKSArICgrK2VsZW1lbnRDb3VudGVyKSk7XHJcbiAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaXNOdW1lcmljKG4pIHtcclxuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbiAgfVxyXG5cclxuICAvLyBNYWtlIHN1cmUgbmVjZXNzYXJ5IENTUyBwcm9wZXJ0aWVzIGFyZSBwcmVzZW50IG9yIGRlZmF1bHRlZCB0byBzb21ldGhpbmcgc2FuZVxyXG4gIHN0YXRpYyBjbGVhbnVwIChwcm9wcykge1xyXG4gICAgdmFyIGNwID0gcHJvcHMgfHwge307XHJcbiAgICBjcC5wb3NpdGlvbiA9IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSc7ICAgLy8gZGVmYXVsdCB0byBhYnNvbHV0ZSBwb3NpdGlvbmluZ1xyXG4gICAgLy8gY3AueCA9IHByb3BzLnggfHwgcHJvcHMubGVmdCB8fCAwO1xyXG4gICAgLy8gY3AueSA9IHByb3BzLnkgfHwgcHJvcHMudG9wIHx8IDA7XHJcbiAgICAvLyBjcC56ID0gcHJvcHMueiB8fCBwcm9wcy56SW5kZXg7XHJcbiAgICAvLyBjcC53ID0gcHJvcHMudyB8fCBwcm9wcy53aWR0aDtcclxuICAgIC8vIGNwLmggPSBwcm9wcy5oIHx8IHByb3BzLmhlaWdodDtcclxuICAgIGNwLnJvdGF0aW9uID0gcHJvcHMucm90YXRpb24gfHwgMDtcclxuICAgIGNwLnNjYWxlID0gcHJvcHMuc2NhbGUgfHwgMTtcclxuICAgIHJldHVybiBjcDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NGaWxlKGZpbGVOYW1lLCBpZCkge1xyXG4gICAgIHZhciBsaW5rID0gJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiJyArIGZpbGVOYW1lICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XHJcbiAgICAgJCgnaGVhZCcpLmZpbmQoJyMnICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgICQoJ2hlYWQnKS5hcHBlbmQobGluayk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ1NTU3RyaW5nKGNzc1N0cmluZywgaWQpIHtcclxuICAgIGlmIChjc3NTdHJpbmcpIHtcclxuICAgICAgLy8gdmFyIGRvYyA9IHdpbmRvdy5kb2N1bWVudDtcclxuICAgICAgdmFyIHN0eWxlRWwgPSAkKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+JyArY3NzU3RyaW5nKyAnPC9zdHlsZT4nKVxyXG4gICAgICAgIC5hdHRyKCdpZCcsIChpZCB8fCAnVGhpbmcnKSArICctc3R5bGVzJyk7XHJcbiAgICAgICQoJ2hlYWQnKS5hcHBlbmQoc3R5bGVFbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxufVxyXG5UaGluZy5hZGRDbGFzcyhUaGluZyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRoaW5nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG5cclxuY2xhc3MgVGltZXIgZXh0ZW5kcyBBY3Rpb24ge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xyXG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XHJcblx0XHR0aGlzLnRpbWVySUQgPSBudWxsO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcclxuXHRcdHRoaXMudGltZXJJRCA9IHNldFRpbWVvdXQodGhpcy5jYWxsYmFjaywgdGhpcy5kZWxheSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XHJcblx0XHR0aGlzLnRpbWVySUQgPSBudWxsO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhUaW1lcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgVHJpYW5nbGUgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdHNpemU6IDEwLFxyXG5cdFx0XHRjb2xvcjogJyNCQURBNTUnXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZChwcm9wcywgZGVmYXVsdFByb3BzKTtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnVHJpYW5nbGUnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLm1ha2VUcmlhbmdsZSh0aGlzLnByb3BzLnNpemUsIHRoaXMucHJvcHMuY29sb3IpOyAgLy8gaGF2ZSB0byBtYWtlIGVsZW1lbnQgYmVmb3JlIGNhbGxpbmcgdGhpc1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRtYWtlVHJpYW5nbGUgKHNpemUsIGNvbG9yKSB7XHJcblx0XHRjb2xvciA9IGNvbG9yIHx8ICcjQkFEQTU1JztcclxuXHRcdHNpemUgPSBzaXplIHx8IDEwO1xyXG5cdFx0dGhpcy5jc3Moe1xyXG5cdFx0XHR3aWR0aDogMCwgXHJcblx0XHRcdGhlaWdodDogMCwgXHJcblx0XHRcdGZvbnRTaXplOiAwLFxyXG5cdFx0XHRsaW5lSGVpZ2h0OiAwLFxyXG5cdFx0XHRib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG5cdFx0XHRib3JkZXJUb3A6IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG5cdFx0XHRib3JkZXJMZWZ0OiBzaXplICsgJ3B4IHNvbGlkICcgKyBjb2xvclxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoVHJpYW5nbGUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUcmlhbmdsZTtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi9UaGluZy9UaGluZy5qcycpO1xyXG5yZXF1aXJlKCcuL0JveC9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BcnJvdy9BcnJvdy5qcycpO1xyXG5yZXF1aXJlKCcuL0RlbW9Cb3gvRGVtb0JveC5qcycpO1xyXG5yZXF1aXJlKCcuL0FjdGlvbi9BY3Rpb24uanMnKTtcclxucmVxdWlyZSgnLi9UaW1lci9UaW1lci5qcycpO1xyXG5yZXF1aXJlKCcuL1JhbmQvUmFuZC5qcycpO1xyXG5yZXF1aXJlKCcuL1B1bHNhci9QdWxzYXIuanMnKTtcclxucmVxdWlyZSgnLi9Eby9Eby5qcycpO1xyXG5yZXF1aXJlKCcuL0xhYmVsL0xhYmVsLmpzJyk7XHJcbnJlcXVpcmUoJy4vTGluZS9MaW5lLmpzJyk7XHJcbnJlcXVpcmUoJy4vSW1nL0ltZy5qcycpO1xyXG5yZXF1aXJlKCcuL1BhdHRlcm4vUGF0dGVybi5qcycpO1xyXG5yZXF1aXJlKCcuL0JHSW1nL0JHSW1nLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGV4dFBhbmUvVGV4dFBhbmUuanMnKTtcclxucmVxdWlyZSgnLi9DaXJjbGUvQ2lyY2xlLmpzJyk7XHJcbnJlcXVpcmUoJy4vVHJpYW5nbGUvVHJpYW5nbGUuanMnKTtcclxucmVxdWlyZSgnLi9DdWJlL0N1YmUuanMnKTtcclxucmVxdWlyZSgnLi9Sb29tL1Jvb20uanMnKTtcclxuXHJcbndpbmRvdy5UaGluZyA9IFRoaW5nO1xyXG4iXX0=
