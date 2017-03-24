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
module.exports = ".Pattern.GraphPaper {\r\n  background-color: #003;\r\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\r\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\r\n  background-image:\r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\r\n}\r\n\r\n.Pattern.Grid {\r\n  background-size: 100px 100px, 100px 100px;\r\n  background-position: -2px -2px, -2px -2px;\r\n  background-image:\r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\r\n}\r\n\r\n.Pattern.SofaDark {\r\n  background:\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Sofa {\r\n  background:\r\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.YellowCirclesWithViolet {\r\n    background-image: radial-gradient(#ffd679 17%, #3d5443 17.5%, #3d5443 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3dabc7 12%, #49ab3c 13.5%, #38822e 14%, #ffdb89 14.5%, #ffdb89 19%, #fff57a 20%, #fcffb5 28%, #fffebd 29%);\r\n    background-size: 25%, 25%;\r\n    background-position: 0% 0%, 17% 17%;\r\n}\r\n\r\n.Pattern.YellowCirclesWithViolet2 {\r\n  background-image: radial-gradient(#ffdd90 17%, black 17.5%, black 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3cdada 17%, gray 17.5%, gray 18%, #ffdd90 19%, #ffdd90 24%, #ffff90 30%, #ffff90 36%);\r\n  background-size: 25%, 25%;\r\n  background-position: 0% 0%, 17% 17%;\r\n}\r\n\r\n.Pattern.PolkaDots {\r\n  background-image:\r\n    radial-gradient(white 15%, transparent 17%),\r\n    radial-gradient(white 15%, transparent 17%);\r\n  background-size: 60px 60px;\r\n  background-position: 0 0, 30px 30px;\r\n}\r\n\r\n.Pattern.PolkaDotsLarge {\r\n  background-image:\r\n    radial-gradient(#fffdd7 100px, transparent 103px),\r\n    radial-gradient(#fffdd7 100px, transparent 103px);\r\n  background-size: 500px;\r\n  background-position: 0 0, 250px 250px;\r\n}\r\n\r\n.Pattern.PolkaDiamondsWhiteGreen {\r\n    background-image: \r\n      radial-gradient(#fffdd7 9px, transparent 103px), \r\n      radial-gradient(#fffdd7 111px, transparent 103px);\r\n    background-size: 200px;\r\n    background-position: 0 0, 100px 100px;\r\n}\r\n\r\n.Pattern.BlueBalls {\r\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Stripes {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.StripesOchre {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,205,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.StripesWhiteRedGreen {\r\n  background-image:\r\n    linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),\r\n    linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),\r\n    linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%);\r\n  background-position: 0%, 0%, 0%;\r\n  background-size: 15%, 15%, 15%;\r\n}\r\n\r\n.Pattern.PlaidRed {\r\n  background-color: hsl(0, 86%, 34%);\r\n  background-image:\r\n    repeating-linear-gradient(transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(270deg, transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(125deg, transparent,\r\n      transparent 2px, rgba(0,0,0,.2) 2px,\r\n      rgba(0,0,0,.2) 3px, transparent 3px,\r\n      transparent 5px, rgba(0,0,0,.2) 5px);\r\n}\r\n\r\n.Pattern.DiagonalStripes {\r\n  background-image: linear-gradient(45deg, black 25%, transparent 25.15%, transparent 50%, black 50.15%, black 75%, transparent 75.15%, transparent);\r\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\r\n        /* ie. 32% 16% for an element with w=100 h=200 */\r\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\r\n}\r\n\r\n.Pattern.DiagonalStripesViolet {\r\n  background-image: linear-gradient(45deg, #0e0030 25%, transparent 25.15%, transparent 50%, #0e0030 50.15%, #0e0030 75%, transparent 75.15%, transparent);\r\n  background-size: 6%;\r\n}\r\n\r\n.Pattern.BlueCascade {\r\n  background-color: #026873;\r\n  background-image: linear-gradient(91deg, rgba(255,255,25,0.17) 50%, transparent 51.5%),\r\n    linear-gradient(89deg, rgba(25,255,255,0.23) 50%, transparent 54.5%),\r\n    linear-gradient(90.5deg, transparent 50%, rgba(252, 255, 162, 0.37) 54.5%),\r\n    linear-gradient(90deg, transparent 50.75%, red 51%, red 51.5%, transparent 51.75%);\r\n  background-size: 5% 100%, 3% 100%, 9% 100%, 8% 100%;\r\n}\r\n\r\n /*Perlin Noise-ish radial blurs*/\r\n  /*RGB*/\r\n  /*background-image: radial-gradient(rgba(255, 42, 0, .5) 1%, transparent 200%), radial-gradient(rgba(86, 250, 2, .5) 1%, transparent 200%), radial-gradient(rgba(0, 7, 255, 0.6) 1%, transparent 150%);\r\n  background-size: 161px, 134px, 188px;\r\n  background-position: -54px, 57px, 55px;\r\n  */\r\n\r\n  /*Monochrome - better blurs*/\r\n/*\r\n  background-image: radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%);\r\n  background-size: 188px 347px, 170px, 209px;\r\n  background-position: -54px, 57px, 55px;\r\n*/\r\n\r\n.Pattern.GreenOvalsXray {\r\n  background-color: #131c0c;\r\n  background-image:\r\n    radial-gradient(rgba(18, 0, 255, 0) 0%, rgba(3, 179, 255, 0.09) 48%, rgba(199, 237, 44, 0.19) 65%, rgba(9, 1, 112, 0) 94%),\r\n    radial-gradient(rgba(9, 1, 112, 0) 0%, rgba(205, 0, 0, 0.07) 48%, rgba(254, 204, 0, 0.11) 65%, rgba(255, 210, 8, 0) 94%),\r\n    radial-gradient(rgba(9, 1, 112, 0.01) 0%, rgba(85, 255, 59, 0.08) 48%, rgba(174, 202, 0, 0.16) 65%, rgba(9, 1, 112, 0) 94%);\r\n    background-size: 188px 347px, 170px, 209px;\r\n  background-position: -54px, 57px, 55px;\r\n}\r\n";

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
			perspective: 'inherit'  // '8000px'
		};
		props = $.extend({}, defaultProps, props);
		this.w = props.w;
		this.h = props.h;
		this.d = props.d;
		this.walls = {};

		super.init(props);
		// this.initialize(props);

		this.type = 'Room';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.makeRoom(this.$element);
	}

	render () {
		super.render();
		return this;
	}

	makeRoom() {
		var room = this;
		var walls = [];
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

		// Inner facing walls
		// walls.push( this.makeWall('front', {
		// 	background: 'rgba(255, 255, 255, 1)',
		// 	width: this.w + 'px',
		// 	height: this.h + 'px',
		// 	transform: 'rotateX( 180deg ) translateZ( ' + (halfDepth) + 'px )'
		// }) );
		walls.push( this.makeWall('back', {
			background: 'rgba(0, 0, 0, 1)',
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
			transform: 'rotateX( 89deg ) translateZ( ' + (-(halfHeight + (halfHeight-halfDepth))) + 'px )'
		}) );

		// Outer facing walls
		walls.push( this.makeWall('outfront', {
			background: 'rgba(255, 255, 255, 0)',
			width: this.w + 'px',
			height: this.h + 'px',
			transform: 'translateZ( ' + (halfDepth) + 'px )'
		}) );
		walls.push( this.makeWall('outback', {
			background: 'rgba(0, 0, 0, 1)',
			width: this.w + 'px',
			height: this.h + 'px',
			transform: 'rotateX( -180deg ) translateZ( ' + halfDepth + 'px )'
		}) );
		walls.push( this.makeWall('outright', {
			background: 'rgba(100, 100, 100, 1)',
			width: this.d + 'px',
			height: this.h + 'px',
			transform: 'rotateY( 90deg ) translateZ( ' + ((halfWidth + (halfWidth-halfDepth))) + 'px )'
		}) );
		walls.push( this.makeWall('outleft', {
			background: 'rgba(100, 100, 100, 1)',
			width: this.d + 'px',
			height: this.h + 'px',
			transform: 'rotateY( -90deg ) translateZ( ' + (halfWidth - (halfWidth-halfDepth)) + 'px )'
		}) );
		walls.push( this.makeWall('outtop', {
			background: 'rgba(100, 100, 200, 1)',
			width: this.w + 'px',
			height: this.d + 'px',
			transform: 'rotateX( 90deg ) translateZ( ' + halfDepth + 'px )'
		}) );
		walls.push( this.makeWall('outbottom', {
			background: 'rgba(100, 200, 100, 1)',
			width: this.w + 'px',
			height: this.d + 'px',
			transform: 'rotateX( -90deg ) translateZ( ' + (halfHeight + (halfHeight-halfDepth)) + 'px )'
		}) );

		// copy walls array to object
		for (var i=0; i < walls.length; i++) {
			this.walls[ walls[i].which ] = walls[i];
		}

		wrapper.add(walls);
		room.add(wrapper);
	}

	makeWall(which, cssVals) {
		var defaultCSS = {
			display: 'block',
			position: 'absolute',
			// lineHeight: this.h + 'px',
			// fontSize: (this.h/3) +'px',
			// fontWeight: 'bold',
			// textAlign: 'center',
			// color: 'white',
			backfaceVisibility: 'hidden'
		};
		var wall = Thing.classes.Box.make($.extend({}, defaultCSS, cssVals));
		wall.$element.addClass('wall');
		wall.$element.addClass(which);
		// wall.$element.append(which);
		wall.which = which;
		return wall;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9DdWJlL0N1YmUuaHRtbCIsInNyYy9saWIvQ3ViZS9DdWJlLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUm9vbS9Sb29tLmpzIiwic3JjL2xpYi9UZXh0UGFuZS9UZXh0UGFuZS5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9UcmlhbmdsZS9UcmlhbmdsZS5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEFjdGlvbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0fVxyXG5cclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dGhpcy5wcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5nbygpJyk7XHJcblx0fVxyXG5cclxuXHRzdG9wICgpIHtcclxuXHRcdHdpbmRvdy5jb25zb2xlLmxvZygnQWN0aW9uLnN0b3AoKScpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1ha2UgKCkge1xyXG5cdCAgdmFyIGNscyA9IHRoaXM7XHJcblx0ICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcblx0ICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG5cdCAgcmV0dXJuIGluc3RhbmNlO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhBY3Rpb24pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIvKiByZXF1aXJlZCBmb3IgYXJyb3cgKi9cXHJcXG4uYXJyb3ctaGVhZCB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgd2lkdGg6IDA7IFxcclxcbiAgaGVpZ2h0OiAwOyBcXHJcXG4gIGJvcmRlci10b3A6IDMwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItYm90dG9tOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDMwcHggc29saWQgZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy1ib2R5IHtcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcXHJcXG4gIHdpZHRoOiA0MHB4O1xcclxcbiAgaGVpZ2h0OiAyMHB4O1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbiAgbWFyZ2luLXRvcDogMjBweDtcXHJcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxyXFxuICBib3JkZXItbGVmdDogMDtcXHJcXG4gIGJvcmRlci1yaWdodDogMDtcXHJcXG59XFxyXFxuXFxyXFxuLmFycm93LXdyYXBwZXIge1xcclxcbiAgd2lkdGg6IDcwcHg7ICAgLyogYXJyb3ctYm9keSB3aWR0aCArIGFycm93LWhlYWQgYm9yZGVyIHdpZHRoICovXFxyXFxufVxcclxcblxcclxcbi5BcnJvdyB7XFxyXFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXHJcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXHJcXG59XFxyXFxuXFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQXJyb3cgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnQXJyb3cnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLnNldENvbG9yKHRoaXMucHJvcHMuY29sb3IpOyAgLy8gaGF2ZSB0byBtYWtlIGFycm93IGJlZm9yZSBjYWxsaW5nIHRoaXNcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c2V0Q29sb3IgKGMpIHtcclxuXHRcdHRoaXMuJGVsZW1lbnQuZmluZCgnLmFycm93LWhlYWQnKS5jc3Moe2JvcmRlckxlZnRDb2xvcjpjfSk7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1ib2R5JykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6Y30pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRodG1sICgpIHtcclxuXHRcdHJldHVybiBcIjxkaXY+PGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+PC9kaXY+XCI7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3JlYXRlQXJyb3dFbGVtZW50ICgpIHtcclxuXHRcdHZhciAkYXJyb3cgPSAkKFwiPGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+XCIpO1xyXG5cdFx0cmV0dXJuICRhcnJvdztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEFycm93KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBCR0ltZyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgdXJsOiAnJyxcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICBsZWZ0OiAnMHB4JyxcclxuICAgICAgdG9wOiAnMHB4J1xyXG4gICAgfTtcclxuICAgIHByb3BzID0gdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnQkdJbWcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kOiAndXJsKFwiJyArIHByb3BzLnVybCArICdcIikgbm8tcmVwZWF0IGNlbnRlcicsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiAnY292ZXInICAvLzEwMCUgMTAwJSdcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCR0ltZyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJHSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQm94IGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgXHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gIFx0dGhpcy50eXBlID0gJ0JveCc7XHJcbiAgXHR0aGlzLml0ZW1zID0gW107XHJcbiAgXHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgfVxyXG5cclxuICBhZGQgKGFkZEl0ZW1zKSB7XHJcbiAgXHRpZiAoYWRkSXRlbXMpIHtcclxuICAgICAgaWYgKCEoYWRkSXRlbXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgICBhZGRJdGVtcyA9IFthZGRJdGVtc107XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgaT0wOyBpIDwgYWRkSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLml0ZW1zLnB1c2goYWRkSXRlbXNbaV0pO1xyXG4gICAgICAgIGFkZEl0ZW1zW2ldLnBhcmVudCA9IHRoaXM7ICAgICAgICBcclxuICAgICAgfVxyXG4gIFx0fVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgaXRlbSBmcm9tIHRoaXMgYm94IChmcm9tIHRoZSBkb20gYW5kIHRoZSBpdGVtcyBsaXN0KVxyXG4gIHJlbW92ZSAoaXRlbSkge1xyXG4gIFx0aWYgKGl0ZW0pIHtcclxuICBcdFx0dmFyIGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xyXG4gIFx0XHRpZiAoaW5kZXggPiAtMSkge1xyXG4gIFx0XHQgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIFx0XHRcdGl0ZW0uJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgXHRcdFx0aXRlbS5wYXJlbnQgPSBudWxsO1xyXG4gIFx0XHR9XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIG51bUVsZW1lbnRzICgpIHtcclxuICBcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnRCb3VuZHMgKCkge1xyXG4gICAgdmFyIGJvdW5kcyA9IHt4Ojk5OTk5OSwgeTo5OTk5OTksIGJvdHRvbTowLCByaWdodDowfTtcclxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA8IDEpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvcyA9IHRoaXMuaXRlbXNbaV0uZ2V0Qm91bmRpbmdCb3goKTtcclxuICAgICAgYm91bmRzLnggPSAocG9zLnggPCBib3VuZHMueCkgPyBwb3MueCA6IGJvdW5kcy54O1xyXG4gICAgICBib3VuZHMueSA9IChwb3MueSA8IGJvdW5kcy55KSA/IHBvcy55IDogYm91bmRzLnk7XHJcbiAgICAgIGJvdW5kcy5ib3R0b20gPSAocG9zLmJvdHRvbSA+IGJvdW5kcy5ib3R0b20pID8gcG9zLmJvdHRvbSA6IGJvdW5kcy5ib3R0b207XHJcbiAgICAgIGJvdW5kcy5yaWdodCA9IChwb3MucmlnaHQgPiBib3VuZHMucmlnaHQpID8gcG9zLnJpZ2h0IDogYm91bmRzLnJpZ2h0O1xyXG4gICAgfVxyXG4gICAgYm91bmRzLncgPSBib3VuZHMucmlnaHQgLSBib3VuZHMueDtcclxuICAgIGJvdW5kcy5oID0gYm91bmRzLmJvdHRvbSAtIGJvdW5kcy55O1xyXG4gICAgcmV0dXJuIGJvdW5kcztcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgXHRzdXBlci5yZW5kZXIoKTtcclxuICBcdGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICBcdFx0dGhpcy5pdGVtc1tpXS5yZW5kZXIoKTtcclxuICBcdH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCb3gpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb3g7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBDaXJjbGUgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHRleHQ6ICcnLFxyXG4gICAgICBsZWZ0OiAwLFxyXG4gICAgICB0b3A6IDAsXHJcbiAgICAgIHI6IDI1LFxyXG4gICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICBmb250U2l6ZTogJzI0cHgnLFxyXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgIGNvbG9yOiAnIzBmMCcsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxyXG4gICAgICBib3JkZXJDb2xvcjogJyNCQURBNTUnLFxyXG4gICAgICBib3JkZXJXaWR0aDogNVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHN1cGVyLmluaXQocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0NpcmNsZSc7XHJcbiAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cclxuICAgIC8vIGFwcGx5IGNpcmNsZSBjc3NcclxuICAgIHZhciBvZmZzZXQgPSBwcm9wcy5yICsgcHJvcHMuYm9yZGVyV2lkdGg7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgJ2xlZnQnOiAnJyArIChwcm9wcy5sZWZ0LW9mZnNldCkgKyAncHgnLFxyXG4gICAgICAgICd0b3AnOiAnJyArIChwcm9wcy50b3Atb2Zmc2V0KSArICdweCcsXHJcbiAgICAgICAgJ3dpZHRoJzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxyXG4gICAgICAgICdoZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2xpbmVIZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2JvcmRlcic6IHByb3BzLmJvcmRlcldpZHRoICsgJ3B4IHNvbGlkICcgKyBwcm9wcy5ib3JkZXJDb2xvcixcclxuICAgICAgICAnYm9yZGVyUmFkaXVzJzogJzEwMDAwcHgnLFxyXG4gICAgICAgICd0ZXh0QWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB0aGlzLnNldFRleHQodGhpcy50ZXh0KTtcclxuICB9XHJcblxyXG4gIHNldFRleHQgKHR4dCkge1xyXG4gICAgdGhpcy50ZXh0ID0gdHh0O1xyXG4gICAgdGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0eHQpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQ2lyY2xlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2lyY2xlO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdj48ZGl2IGlkPWN1YmUgY2xhc3M9c2hvdy1mcm9udD48ZmlndXJlIGNsYXNzPWZyb250PkY8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPWJhY2s+QjwvZmlndXJlPjxmaWd1cmUgY2xhc3M9cmlnaHQ+UjwvZmlndXJlPjxmaWd1cmUgY2xhc3M9bGVmdD5MPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz10b3A+VDwvZmlndXJlPjxmaWd1cmUgY2xhc3M9Ym90dG9tPkc8L2ZpZ3VyZT48L2Rpdj48L2Rpdj5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vKipcclxuICogIHcsIGgsIGRlcHRoXHJcbiAqL1xyXG5jbGFzcyBDdWJlIGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHR3OiA1MDAsXHJcblx0XHRcdGg6IDUwMCxcclxuXHRcdFx0ZDogNTAwXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcblx0XHR0aGlzLncgPSBwcm9wcy53O1xyXG5cdFx0dGhpcy5oID0gcHJvcHMuaDtcclxuXHRcdHRoaXMuZCA9IHByb3BzLmQ7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0N1YmUnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLnNldHVwQ3ViZSh0aGlzLiRlbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c2V0dXBDdWJlKCRlbCkge1xyXG5cdFx0dmFyICRjb250YWluZXIgID0gJGVsO1xyXG5cdFx0dmFyICRjdWJlICAgICAgID0gJGVsLmZpbmQoJyNjdWJlJyk7XHJcblx0XHR2YXIgJGZhY2VGcm9udCAgPSAkZWwuZmluZCgnI2N1YmUgLmZyb250ICcpO1xyXG5cdFx0dmFyICRmYWNlQmFjayAgID0gJGVsLmZpbmQoJyNjdWJlIC5iYWNrICAnKTtcclxuXHRcdHZhciAkZmFjZVJpZ2h0ICA9ICRlbC5maW5kKCcjY3ViZSAucmlnaHQgJyk7XHJcblx0XHR2YXIgJGZhY2VMZWZ0ICAgPSAkZWwuZmluZCgnI2N1YmUgLmxlZnQgICcpO1xyXG5cdFx0dmFyICRmYWNlVG9wICAgID0gJGVsLmZpbmQoJyNjdWJlIC50b3AgICAnKTtcclxuXHRcdHZhciAkZmFjZUJvdHRvbSA9ICRlbC5maW5kKCcjY3ViZSAuYm90dG9tJyk7XHJcblxyXG5cdFx0dmFyIGhhbGZIZWlnaHQgPSB0aGlzLmgvMjtcclxuXHRcdHZhciBoYWxmV2lkdGggPSB0aGlzLncvMjtcclxuXHRcdHZhciBoYWxmRGVwdGggPSB0aGlzLmQvMjtcclxuXHJcblx0XHQkY29udGFpbmVyLmNzcyh7XHJcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHRsZWZ0OiAnMHB4JyxcclxuXHRcdFx0dG9wOiAnMHB4JyxcclxuXHRcdFx0cGVyc3BlY3RpdmU6ICc2MDAwcHgnLFxyXG5cdFx0XHR6SW5kZXg6IDIwMDAwXHJcblx0XHR9KTtcclxuXHJcblx0XHQkY3ViZS5jc3Moe1xyXG5cdFx0XHR3aWR0aDogJzEwMCUnLFxyXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcclxuXHRcdFx0ekluZGV4OiAyMDAwMCxcclxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXHJcblx0XHRcdHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxyXG5cdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDFzJ1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VGcm9udCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAuMiknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUJhY2ssIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoICAwLCAgIDAsICAgMCwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VSaWdodCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsICAgMCwgIDU1LCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JywgXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWSggICA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJyAgLyogaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpICovXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlTGVmdCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgICAwLCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JywgXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWSggIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJyAgLyogaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpICovXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlVG9wLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgIDU1LCAyNTUsIC41KScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLCBcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAgIDkwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUJvdHRvbSwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsIDI1NSwgICAwLCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5kICsgJ3B4JywgXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkhlaWdodCArIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICsgJ3B4ICknXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNldHVwRmFjZSgkZmFjZSwgY3NzVmFscykge1xyXG5cdFx0dmFyIGRlZmF1bHRDU1MgPSB7XHJcblx0XHRcdGRpc3BsYXk6ICdibG9jaycsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHRsaW5lSGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHRmb250U2l6ZTogKHRoaXMuaC8zKSArJ3B4JyxcclxuXHRcdFx0Zm9udFdlaWdodDogJ2JvbGQnLFxyXG5cdFx0XHRjb2xvcjogJ3doaXRlJyxcclxuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xyXG5cdFx0fTtcclxuXHRcdCRmYWNlLmNzcygkLmV4dGVuZCh7fSwgZGVmYXVsdENTUywgY3NzVmFscykpO1xyXG5cdH1cclxuXHJcblx0aHRtbCAoKSB7XHJcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9DdWJlLmh0bWwnKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0Ly8gcmV0dXJuIHJlcXVpcmUoJy4vQ3ViZS5jc3MnKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQ3ViZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1YmU7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXHJcXG4uRGVtb0JveCB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICBtYXJnaW46IDIwcHg7XFxyXFxuICB3aWR0aDogMjAwcHg7IFxcclxcbiAgaGVpZ2h0OiAyMDBweDsgXFxyXFxuICBib3JkZXI6IDJweCBkYXNoZWQgI2VlZTtcXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xyXG5cclxuY2xhc3MgRGVtb0JveCBleHRlbmRzIEJveCB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHRzdXBlci5pbml0KHByb3BzKTtcclxuXHRcdHByb3BzLndpZHRoID0gcHJvcHMud2lkdGggfHwgMjAwO1xyXG5cdFx0cHJvcHMuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0IHx8IDIwMDtcclxuXHRcdHByb3BzLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRcdHRoaXMudHlwZSA9ICdEZW1vQm94JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNzcyAoKSB7XHJcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9EZW1vQm94LmNzcycpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhEZW1vQm94KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVtb0JveDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbi8vIExpa2UgVW5peCBwaXBlOiBvdXRwdXQgb2Ygb25lIGNvbW1hbmQgaXMgaW5wdXQgdG8gdGhlIG5leHRcclxuLy8gRWFjaCBmdW5jdGlvbiB0YWtlcyBhICdwcm9wcycgb2JqZWN0IGFzIGFyZ3VtZW50XHJcbi8vIEVhY2ggZnVuY3Rpb24gcmV0dXJucyBhbiBvYmplY3Qgd2l0aCByZXN1bHRzLCB3aGljaCBpcyBwYXNzZWQgYXMgcHJvcHMgdG8gdGhlIG5leHRcclxuLy8gRG8oKSByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgdGhlIERvIGNoYWluXHJcblxyXG4vLyBQLnB1bHNlLnNldFRvKFxyXG4vLyAgICAgRG8oUi5nZXRSYW5kb21OdW1iZXIsIHtmcm9tOjAsIHRvOjEwfSkgICAvLyByZXR1cm5zOiAge2RhdGE6IDh9XHJcbi8vICAgICAuRG8oQy5waWNrQ29sb3IpICAgIC8vIHJlYWRzIGlucHV0IDgsIHJldHVybnMge2RhdGE6ICcjY2ZmJ31cclxuLy8gICAgIC5EbyhCLmNoYW5nZUNvbG9yKSAgIC8vIHJlYWRzIGlucHV0ICcjY2ZmJywgY2hhbmdlcyBjb2xvciBvbiBCbGlua2VyXHJcbi8vICk7XHJcblxyXG5cclxuZnVuY3Rpb24gRG8oX2FGdW5jdGlvbiwgX3Byb3BzLCBfZmlyc3REbykge1xyXG4gICAgdmFyIGFGdW5jdGlvbiA9IF9hRnVuY3Rpb247XHJcbiAgICB2YXIgcHJvcHMgPSBfcHJvcHM7XHJcbiAgICB2YXIgZmlyc3REbyA9IF9maXJzdERvIHx8IGV4ZWN1dG9yO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdhZnVuY3Rpb249JywgYUZ1bmN0aW9uKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdwcm9wcz0nLCBwcm9wcyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZmlyc3REbz0nLCBmaXJzdERvKTtcclxuXHJcbiAgICAvLyBSdW4gdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cy5cclxuICAgIC8vIFBhc3MgdGhlIHJlc3VsdHMgdG8gdGhlIG5leHQgY2hhaW5lZCBmdW5jdGlvbiAoaWYgYW55KS5cclxuICAgIC8vIFJldHVybiByZXN1bHRzIG9mIHRoaXMgZnVuY3Rpb24gb3Igb2YgdGhlIGNoYWluXHJcbiAgICBmdW5jdGlvbiBleGVjdXRvciAocGlwZWRQcm9wcykge1xyXG4gICAgICAgIHZhciByZXR1cm5WYWwgPSBhRnVuY3Rpb24ocHJvcHMgfHwgcGlwZWRQcm9wcyk7XHJcbiAgICAgICAgcmV0dXJuIChleGVjdXRvci5uZXh0RG8gPyBleGVjdXRvci5uZXh0RG8ocmV0dXJuVmFsKSA6IHJldHVyblZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV0dXJuIHRoZSBsYXN0ICdEbycgaW4gdGhlIGNoYWluXHJcbiAgICBmdW5jdGlvbiBnZXRMYXN0RG8gKCkge1xyXG4gICAgICAgIHZhciB0bXBEbyA9IGZpcnN0RG87XHJcbiAgICAgICAgd2hpbGUgKHRtcERvLm5leHREbykgeyB0bXBEbyA9IHRtcERvLm5leHREbzsgfVxyXG4gICAgICAgIHJldHVybiB0bXBEbztcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgYSBuZXcgJ0RvJyB0byB0aGUgZW5kIG9mIHRoZSBjaGFpbi5cclxuICAgIGV4ZWN1dG9yLkRvID0gZnVuY3Rpb24gKGFGdW5jdGlvbiwgcHJvcHMpIHtcclxuICAgICAgICBnZXRMYXN0RG8oKS5uZXh0RG8gPSBEbyhhRnVuY3Rpb24sIHByb3BzLCBmaXJzdERvKTtcclxuICAgICAgICByZXR1cm4gZmlyc3REbzsgIC8vIEFsd2F5cyByZXR1cm4gdGhlIGZpcnN0ICdEbycgaW4gdGhlIGNoYWluXHJcbiAgICB9O1xyXG5cclxuICAgIGV4ZWN1dG9yLm5leHREbyA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIGV4ZWN1dG9yO1xyXG59XHJcblxyXG5UaGluZy5EbyA9IERvO1xyXG5cclxuLypcclxuLy8gY2hhaW5lZCwgZWFjaCBEbyBoYXMgaXRzIG93biBwYXJhbWV0ZXJzXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTt9LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCB7YXJnMjonaGVsbG8gdG8gMjIyMjInfSlcclxuXHJcbi8vIGNoYWluZWQsIHdpdGggZmlyc3QgRG8gcGlwaW5nIHJlc3VsdHMgdG8gc2Vjb25kIERvXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCBudWxsKVxyXG5cclxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpOyByZXR1cm4ge25ld1Byb3A6cHJvcHMucGlwZWRwcm9wKzJ9fSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAzJywgcHJvcHMpO30pXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERvO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLypcclxuICAgIHNyYzogPGZpbGUgcGF0aD5cclxuICAgIGNlbnRlcjogdHJ1ZXxmYWxzZVxyXG4gICAgc2l6ZTogY29udGFpbnxjb3ZlcnxzdHJldGNoXHJcbiovXHJcblxyXG5jbGFzcyBJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBwbGFjZWhvbGRlciA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBRElDQVlBQUFDdFdLNmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQlY5SlJFRlVlSnp0M2MxdTNVUWNoK0YvRUJLOUFzUUNWV2ZWUXE0Q2JoeHVBNEVxc1NtaCs3SXVpOVFDUXZJN1l4K1BQNTlIOGk2eVpvN216ZmdrbG4xWFZaOEtlTllYYXc4QXRrd2dFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnZURMRVQ5NzEyMFVzTHltTzBqc0lCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlNKzdWTlYzYXc5aVFmZFY5WHJ0UVd6VnA4YmpMQzVWOVh0VlBkUTVJcm12cWc5VjlhN09GVW56dWhmSVB5NzFHTWN3NTZOSE1zUXh6UGRNa1Foa3BFdjlONDZqUi9JMGpyTkZJcEFSTHZWOEhFZU41S1U0emhTSlFCcGRLc2R4dEVpdXhYR1dTQVRTNEZKdGNSd2xrdFk0emhDSlFLNjQxTGc0L2gzSjk0dVA5blpqNHpoNkpBSUpMalV0anIxR01qV09JMGNpa0JkYzZyWTQ5aGJKclhFY05SS0JQT05TODhTeGwwam1pdU9Ja1RUTitXeTNtcnlxcXE5bVBOODNWZlZUYlRPUys2cjZ1YXErbnZHY3J6NGZwM0ttSGFUcWNURS8xSHkvVmJlNGs4eTljM3lxcXZkVjlXYkpTWFRtRWlzNGNpVGlhQ09RSzQ0WWlUamFDYVJCajBqK3JIVWlFY2M0QW1sMGhFakVNWjVBUnRoekpPS1lSaUFqZlYrUGkzcFBrWWhqT29GTXNLZEllc1R4UjUwamppcUJUTGFIU01SeE80SGNZTXVSaUdNZUFybFJyMGp1YnhpVE9PWWprQmxzS1JKeHpFc2dNOWxDSk9LWW4wQm10R1lrNHVoRElETmJJeEp4OUNPUUR1NXJ1VWg2eGZGMmxrOWkvd1RTeVJLUmlLTS9nWFRVTXhKeExFTWduZldJNUVPSll5a0NXVUNQU01TeERJRXNaS3VSaUNNVHlJSjZmRzhRUjE4Q1dkaFdJbmtvY2JRUXlBcldqa1FjN1FTeWtyVWlFY2M0QWxuUjBwR0lZenlCckd5cFNNUXhqVUEyb0hjazRwaE9JQnZSS3hKeDNLYnBjejdiMDkyUDVtN3RBWnlCSGFTZkpTNng5dnpPeERXNXhGclprbC9TUlRLZVFGYTB4cDk1UlRLT1FGYXk1ajhLUmRKT0lDdll3cTBtSW1ramtJV3RIWWRJeGhISWdyWVNoMGphQ1dRaFc0dERKRzBFc29DdHhpR1M2d1RTV1k4NEhxclBpMFZGOG44QzZhaFhIRy9yY1RHTHBEK0JkTkl6am9GSStoTklCMHZFTVJCSlh3S1oyWkp4REVUU2owQm10RVljQTVIMElaQ1pyQm5IUUNUekU4Z010aERIUUNUekVzaU50dmlVZFpITVJ5QTMyR0ljQTVITVF5QVRiVG1PZ1VodUo1QUo5aERIUUNTM0VjaEllNHBqSUpMcEJETENIdU1ZaUdRYWdUVGFjeHdEa1l3bmtBWkhpR01na25FRWNrV3ZPTjRzT1lrblJOSk9JTUVSNHhpSXBJMUFYbkRrT0FZaXVVNGd6emhESElOZWtSemxpZkpOY3o3YjA5MC9majdtOGxCVlAxVFZyek9lY3k2L1ZOV1A5ZmlLNnJsOHJLcS9aanpmTHB4cEI2bXFlbDFWNytxNE84ZFRjKzBrdjFYVnR3dVB2U2VYV01HdGtld2xqc0d0a1J3dGppcUJYRFUxa3ZlMXJ6Z0dVeU01WWh4VkFta3lOcEs5eGpFWUc4bFI0NmdTU0xQV1NQWWV4NkExa2lQSFVTV1FVYTVGY3BRNEJ0Y2lPWG9jVlFJWjdhVklqaGJINEtWSXpoQkhsVUFtZVJySlVlTVlQSTNrTEhGVUNXU3lJWktqeHpFWUlqbFRIRlVDdWNuck9rY2NnN2QxcmppcUd0ZjlYYlV2ZmkrdDUwaWExdjNaN3NXQ1VRUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUhCWFZaL1dIZ1JzbFIwRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VncjhCaVFWenE5THYxT29BQUFBQVNVVk9SSzVDWUlJPSc7XHJcblxyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuICAgIHByb3BzLnNyYyA9IHByb3BzLnNyYyB8fCBwbGFjZWhvbGRlcjtcclxuICAgIC8vIHByb3BzLmJhY2tncm91bmQgPSAndXJsKFwiJyArIHByb3BzLnNyYyArICdcIikgbm8tcmVwZWF0ICcgKyAocHJvcHMuY2VudGVyID8gJ2NlbnRlcicgOiAnbGVmdCB0b3AnKTtcclxuICAgIC8vIHByb3BzLmJhY2tncm91bmRTaXplID0gKHByb3BzLnNpemUgPT09ICdjb250YWluJyB8fCBwcm9wcy5zaXplID09PSAnY292ZXInID8gcHJvcHMuc2l6ZSA6IChwcm9wcy5zaXplPT09J3N0cmV0Y2gnID8gJzEwMCUgMTAwJScgOiB1bmRlZmluZWQpICk7XHJcblxyXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xyXG5cclxuICAgIHRoaXMudHlwZSA9ICdJbWcnO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zcmMgPSBwcm9wcy5zcmM7XHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IHVuZGVmaW5lZDtcclxuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgdW5kZWZpbmVkO1xyXG4gICAgdGhpcy53ID0gcHJvcHMudyB8fCB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLmggPSBwcm9wcy5oIHx8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBJbWcubG9hZGluZyh0aGlzKTtcclxuICAgIGxvYWRJbWFnZShwcm9wcy5zcmMsIHRoaXMub25sb2FkLmJpbmQodGhpcyksIHRoaXMub25lcnJvci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBzdXBlci5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIG9ubG9hZCAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltYWdlIExvYWRlZDonLCBpbWcsIGltZy5zcmMsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gaW1nLmhlaWdodCAvIGltZy53aWR0aDsgIC8vIGFzcGVjdCByYXRpbyBvZiBvcmlnaW5hbCBpbWFnZVxyXG4gICAgdGhpcy53ID0gdGhpcy53IHx8IGltZy53aWR0aDtcclxuICAgIHRoaXMuaCA9IHRoaXMuaCB8fCAodGhpcy53ICogdGhpcy5hc3BlY3RSYXRpbyk7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgd2lkdGg6IHRoaXMudyxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaCxcclxuICAgICAgICBiYWNrZ3JvdW5kOiAndXJsKCcgK2ltZy5zcmMrICcpIG5vLXJlcGVhdCBjZW50ZXInLFxyXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xyXG4gICAgfSk7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgb25lcnJvciAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltZy5vbmVycm9yJywgaW1nLnNyYywgJ2ZhaWxlZCcpO1xyXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5lcnJvciA9IHRydWU7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0V2lkdGggKHcpIHtcclxuICAgIHRoaXMud2lkdGggPSB3O1xyXG4gICAgdGhpcy5oZWlnaHQgPSB3ICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxvYWRpbmcgKGltZykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwiSU1HLmxvYWRpbmcoKTpcIiwgaW1nLnNyYyk7XHJcbiAgICBJbWcucXVldWVkSW1ncyA9IEltZy5xdWV1ZWRJbWdzIHx8IFtdO1xyXG4gICAgaWYgKGltZyAmJiAhaW1nLmxvYWRlZCkge1xyXG4gICAgICAgIEltZy5xdWV1ZWRJbWdzLnB1c2goaW1nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBJbWcucXVldWVkSW1ncy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbG9hZGVkIChpbWcpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5sb2FkZWQoKTpcIiwgaW1nLnNyYywgSW1nLnF1ZXVlZEltZ3MubGVuZ3RoKTtcclxuICAgIEltZy5xdWV1ZWRJbWdzID0gSW1nLnF1ZXVlZEltZ3MgfHwgW107XHJcbiAgICBpZiAoaW1nICYmIGltZy5sb2FkZWQpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBJbWcucXVldWVkSW1ncy5pbmRleE9mKGltZyk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgSW1nLnF1ZXVlZEltZ3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEltZy5xdWV1ZWRJbWdzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBJbWcub25BbGxMb2FkZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gSW1nLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG9uQWxsTG9hZGVkICgpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5vbkFsbExvYWRlZCgpOiB0cmlnZ2VyZWRcIik7XHJcbiAgfVxyXG5cclxufVxyXG5UaGluZy5hZGRDbGFzcyhJbWcpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGxvYWRJbWFnZSAoc3JjLCBjYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xyXG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGVycm9yQ2FsbGJhY2sodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgaW1nLnNyYyA9IHNyYztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBMYWJlbCBleHRlbmRzIFRoaW5nIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuXHRcdFx0Zm9udEZhbWlseTogJ0NhbGlicmksIEFyaWFsLCBzYW5zLXNlcmlmJyxcclxuXHRcdFx0Zm9udFNpemU6ICcxNHB4JyxcclxuXHRcdFx0Y29sb3I6ICcjMDAwJ1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHRcdHRoaXMudHlwZSA9ICdMYWJlbCc7XHJcblx0XHR0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLnRleHQpO1xyXG5cdH1cclxuXHJcblx0c2V0VGV4dCAodHh0KSB7XHJcblx0XHR0aGlzLnRleHQgPSB0eHQ7XHJcblx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHR4dCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKExhYmVsKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXHJcXG4uTGluZSB7XFxyXFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXHJcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXHJcXG59XFxyXFxuXFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgTGluZSBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgLy8gZXhwZWN0aW5nIHByb3BzOiB7IHgxOjAsIHkxOjAsIHgyOjUwLCB5Mjo1MCB9XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgPSBwcm9wcyAmJiAocHJvcHMuYmFja2dyb3VuZENvbG9yIHx8IHByb3BzLmNvbG9yIHx8ICdibGFjaycpO1xyXG4gICAgc3VwZXIuaW5pdChwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnTGluZSc7XHJcbiAgICB0aGlzLmxlbmd0aCA9IDEwO1xyXG4gICAgdGhpcy53aWR0aCA9IDE7XHJcbiAgICB0aGlzLmFuZ2xlID0gMDtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3ModGhpcy50eXBlKTtcclxuICAgIHRoaXMuY3JlYXRlTGluZShwcm9wcy54MSwgcHJvcHMueTEsIHByb3BzLngyLCBwcm9wcy55MiwgcHJvcHMud2lkdGgsIHByb3BzLmFycm93LCBwcm9wcy5zaG9ydGVuKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUxpbmUgKHgxLHkxLCB4Mix5Miwgd2lkdGgsIGFycm93LCBzaG9ydGVuKSB7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgMjtcclxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5zcXJ0KCh4MS14MikqKHgxLXgyKSArICh5MS15MikqKHkxLXkyKSkgLSAoYXJyb3c/IHRoaXMud2lkdGgqMiA6IDApOyAgLy8gc2hvcnRlbiB0aGUgbGVuZ3RoIHRvIG1ha2Ugcm9vbSBmb3IgYXJyb3doZWFkXHJcbiAgICB0aGlzLmFuZ2xlICA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgdGhpcy5sZW5ndGggLT0gc2hvcnRlbiB8fCAwOyAgLy8gc2hvcnRlbiB0aGUgbGluZSBhIGJpdCAobWFrZXMgcm9vbSBmb3IgYXJyb3doZWFkKVxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgICdsZWZ0JzogJycgKyB4MSArICdweCcsXHJcbiAgICAgICAgJ3RvcCc6ICcnICsgKHkxLSh0aGlzLndpZHRoLzIpKSArICdweCcsXHJcbiAgICAgICAgJ3dpZHRoJzogJycgKyB0aGlzLmxlbmd0aCArICdweCcsXHJcbiAgICAgICAgJ2hlaWdodCc6ICcnICsgdGhpcy53aWR0aCArICdweCcsXHJcbiAgICAgICAgLy8gcm90YXRlIGFyb3VuZCBzdGFydCBwb2ludCBvZiBsaW5lXHJcbiAgICAgICAgJ3RyYW5zZm9ybS1vcmlnaW4nOiAnMCA1MCUnXHJcbiAgICAgIH0pO1xyXG4gICAgdGhpcy5yb3RhdGVUbyh0aGlzLmFuZ2xlKTtcclxuICAgIGlmIChhcnJvdykge1xyXG4gICAgICB0aGlzLmFkZEFycm93SGVhZCh0aGlzLmxlbmd0aCwgdGhpcy53aWR0aCwgdGhpcy53aWR0aCoyLCB0aGlzLnByb3BzLmJhY2tncm91bmRDb2xvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBsZW4gb2YgbGluZSwgd2lkdGggb2YgbGluZSwgc2l6ZSBvZiB0cmlhbmdsZSAoaWUuIDEwIHdpbGwgYmUgMTBweCB3aWRlIGFuZCAyMHB4IGhpZ2gpXHJcbiAgYWRkQXJyb3dIZWFkIChsZW4sIHdpZHRoLCBzaXplLCBjb2xvcikge1xyXG4gICAgdGhpcy5hcnJvd0hlYWQgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgdGhpcy5hcnJvd0hlYWQuY3NzKHtcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIHdpZHRoOiAwLCBcclxuICAgICAgaGVpZ2h0OiAwLCBcclxuICAgICAgZm9udFNpemU6IDAsXHJcbiAgICAgIGxpbmVIZWlnaHQ6IDAsXHJcbiAgICAgIGxlZnQ6IGxlbiArICdweCcsXHJcbiAgICAgIHRvcDogLShzaXplLSh3aWR0aC8yKSkgKyAncHgnLFxyXG4gICAgICBib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJUb3A6IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJMZWZ0OiBzaXplICsgJ3B4IHNvbGlkICcgKyBjb2xvclxyXG4gICAgfSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHRoaXMuYXJyb3dIZWFkKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gIFx0cmV0dXJuIHJlcXVpcmUoJy4vTGluZS5jc3MnKTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoTGluZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuUGF0dGVybi5HcmFwaFBhcGVyIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDM7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweCwgMjBweCAyMHB4LCAyMHB4IDIwcHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweCwgLTFweCAtMXB4LCAtMXB4IC0xcHg7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4zKSAxcHgsIHRyYW5zcGFyZW50IDFweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkdyaWQge1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweDtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5Tb2ZhRGFyayB7XFxyXFxuICBiYWNrZ3JvdW5kOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgMTAwJSA1MCUsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlNvZmEge1xcclxcbiAgYmFja2dyb3VuZDpcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCA5OSUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDYlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDElLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyMyUpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgNTAlIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSAxMDAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgOTYlLCA0JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlllbGxvd0NpcmNsZXNXaXRoVmlvbGV0IHtcXHJcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmQ2NzkgMTclLCAjM2Q1NDQzIDE3LjUlLCAjM2Q1NDQzIDE4LjIlLCAjM2NkYWRhIDE5JSwgIzZkZThlOCAyNCUsICNlZGNiZmIgMzAlLCB0cmFuc3BhcmVudCAzNiUpLCByYWRpYWwtZ3JhZGllbnQoIzNkYWJjNyAxMiUsICM0OWFiM2MgMTMuNSUsICMzODgyMmUgMTQlLCAjZmZkYjg5IDE0LjUlLCAjZmZkYjg5IDE5JSwgI2ZmZjU3YSAyMCUsICNmY2ZmYjUgMjglLCAjZmZmZWJkIDI5JSk7XFxyXFxuICAgIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxyXFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAlIDAlLCAxNyUgMTclO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5ZZWxsb3dDaXJjbGVzV2l0aFZpb2xldDIge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmRkOTAgMTclLCBibGFjayAxNy41JSwgYmxhY2sgMTguMiUsICMzY2RhZGEgMTklLCAjNmRlOGU4IDI0JSwgI2VkY2JmYiAzMCUsIHRyYW5zcGFyZW50IDM2JSksIHJhZGlhbC1ncmFkaWVudCgjM2NkYWRhIDE3JSwgZ3JheSAxNy41JSwgZ3JheSAxOCUsICNmZmRkOTAgMTklLCAjZmZkZDkwIDI0JSwgI2ZmZmY5MCAzMCUsICNmZmZmOTAgMzYlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSAwJSwgMTclIDE3JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uUG9sa2FEb3RzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSksXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDYwcHggNjBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMzBweCAzMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5Qb2xrYURvdHNMYXJnZSB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyAxMDBweCwgdHJhbnNwYXJlbnQgMTAzcHgpLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyAxMDBweCwgdHJhbnNwYXJlbnQgMTAzcHgpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiA1MDBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMjUwcHggMjUwcHg7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlBvbGthRGlhbW9uZHNXaGl0ZUdyZWVuIHtcXHJcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogXFxyXFxuICAgICAgcmFkaWFsLWdyYWRpZW50KCNmZmZkZDcgOXB4LCB0cmFuc3BhcmVudCAxMDNweCksIFxcclxcbiAgICAgIHJhZGlhbC1ncmFkaWVudCgjZmZmZGQ3IDExMXB4LCB0cmFuc3BhcmVudCAxMDNweCk7XFxyXFxuICAgIGJhY2tncm91bmQtc2l6ZTogMjAwcHg7XFxyXFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMTAwcHggMTAwcHg7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkJsdWVCYWxscyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQoI2FjZiA3NyUsIHJnYmEoODgsOTksMjU1LC44OCkgODAlLCB0cmFuc3BhcmVudCA4MyUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAyNSUgMjUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5TdHJpcGVzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1NSwyNTUsMjUsMSkgNTAlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5TdHJpcGVzT2NocmUge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MCUsIHJnYmEoMjU1LDIwNSwyNSwxKSA1MCUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlN0cmlwZXNXaGl0ZVJlZEdyZWVuIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTElLCAjZmZmZmM4IDUxJSwgI2ZmZmZjOCA1OSUsIHRyYW5zcGFyZW50IDU5JSksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNDMlLCAjZjMzMDU0IDQzJSwgI2YzMzA1NCA2NyUsIHRyYW5zcGFyZW50IDY3JSksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgIzAyOWI0ZiAzNCUsICMyNjI2MjYgMzQlLCAjMjYyNjI2IDc1JSwgIzAyOWI0ZiA3NSUpO1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCUsIDAlLCAwJTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTUlLCAxNSUsIDE1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uUGxhaWRSZWQge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogaHNsKDAsIDg2JSwgMzQlKTtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQodHJhbnNwYXJlbnQsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgNTNweCwgdHJhbnNwYXJlbnQgNTNweCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2NnB4LCB0cmFuc3BhcmVudCA2NnB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2OXB4LCByZ2JhKDAsNjAsMCwuNSkgMTY5cHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTgycHgsIHJnYmEoMCw2MCwwLC41KSAxODJweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMjMycHgsIHRyYW5zcGFyZW50IDIzMnB4KSxcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgyNzBkZWcsIHRyYW5zcGFyZW50LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUzcHgsIHRyYW5zcGFyZW50IDUzcHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjZweCwgdHJhbnNwYXJlbnQgNjZweCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjlweCwgcmdiYSgwLDYwLDAsLjUpIDE2OXB4LFxcclxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE4MnB4LCByZ2JhKDAsNjAsMCwuNSkgMTgycHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDIzMnB4LCB0cmFuc3BhcmVudCAyMzJweCksXFxyXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMTI1ZGVnLCB0cmFuc3BhcmVudCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCAycHgsIHJnYmEoMCwwLDAsLjIpIDJweCxcXHJcXG4gICAgICByZ2JhKDAsMCwwLC4yKSAzcHgsIHRyYW5zcGFyZW50IDNweCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCA1cHgsIHJnYmEoMCwwLDAsLjIpIDVweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkRpYWdvbmFsU3RyaXBlcyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGJsYWNrIDI1JSwgdHJhbnNwYXJlbnQgMjUuMTUlLCB0cmFuc3BhcmVudCA1MCUsIGJsYWNrIDUwLjE1JSwgYmxhY2sgNzUlLCB0cmFuc3BhcmVudCA3NS4xNSUsIHRyYW5zcGFyZW50KTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTYlIDE2JTsgIC8qIG11c3QgbWF0Y2ggYXNwZWN0IHJhdGlvIG9mIGNvbnRhaW5pbmcgZWxlbWVudCBvciBsaW5lcyB3aWxsIGJyZWFrICovXFxyXFxuICAgICAgICAvKiBpZS4gMzIlIDE2JSBmb3IgYW4gZWxlbWVudCB3aXRoIHc9MTAwIGg9MjAwICovXFxyXFxuICAgICAgICAvKiBQb3dlcnMgb2YgMiB3b3JrIGJlc3QgKG90aGVyIHZhbHVlcywgbGlrZSA3IG9yIDIzLCBtYWtlIGphZ2d5IGFsaWFzaW5nKSAqL1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5EaWFnb25hbFN0cmlwZXNWaW9sZXQge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCAjMGUwMDMwIDI1JSwgdHJhbnNwYXJlbnQgMjUuMTUlLCB0cmFuc3BhcmVudCA1MCUsICMwZTAwMzAgNTAuMTUlLCAjMGUwMDMwIDc1JSwgdHJhbnNwYXJlbnQgNzUuMTUlLCB0cmFuc3BhcmVudCk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDYlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5CbHVlQ2FzY2FkZSB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDI2ODczO1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDkxZGVnLCByZ2JhKDI1NSwyNTUsMjUsMC4xNykgNTAlLCB0cmFuc3BhcmVudCA1MS41JSksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg4OWRlZywgcmdiYSgyNSwyNTUsMjU1LDAuMjMpIDUwJSwgdHJhbnNwYXJlbnQgNTQuNSUpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTAuNWRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1MiwgMjU1LCAxNjIsIDAuMzcpIDU0LjUlKSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MC43NSUsIHJlZCA1MSUsIHJlZCA1MS41JSwgdHJhbnNwYXJlbnQgNTEuNzUlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogNSUgMTAwJSwgMyUgMTAwJSwgOSUgMTAwJSwgOCUgMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuIC8qUGVybGluIE5vaXNlLWlzaCByYWRpYWwgYmx1cnMqL1xcclxcbiAgLypSR0IqL1xcclxcbiAgLypiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQocmdiYSgyNTUsIDQyLCAwLCAuNSkgMSUsIHRyYW5zcGFyZW50IDIwMCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSg4NiwgMjUwLCAyLCAuNSkgMSUsIHRyYW5zcGFyZW50IDIwMCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSgwLCA3LCAyNTUsIDAuNikgMSUsIHRyYW5zcGFyZW50IDE1MCUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxNjFweCwgMTM0cHgsIDE4OHB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTU0cHgsIDU3cHgsIDU1cHg7XFxyXFxuICAqL1xcclxcblxcclxcbiAgLypNb25vY2hyb21lIC0gYmV0dGVyIGJsdXJzKi9cXHJcXG4vKlxcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjU2KSAwJSwgcmdiYSg5LCAxLCAxMTIsIDAuMjUpIDQ4JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTIpIDk0JSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC41NikgMCUsIHJnYmEoOSwgMSwgMTEyLCAwLjI1KSA0OCUsIHJnYmEoOSwgMSwgMTEyLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwLjEyKSA5NCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuNTYpIDAlLCByZ2JhKDksIDEsIDExMiwgMC4yNSkgNDglLCByZ2JhKDksIDEsIDExMiwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMC4xMikgOTQlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTg4cHggMzQ3cHgsIDE3MHB4LCAyMDlweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC01NHB4LCA1N3B4LCA1NXB4O1xcclxcbiovXFxyXFxuXFxyXFxuLlBhdHRlcm4uR3JlZW5PdmFsc1hyYXkge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzEzMWMwYztcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChyZ2JhKDE4LCAwLCAyNTUsIDApIDAlLCByZ2JhKDMsIDE3OSwgMjU1LCAwLjA5KSA0OCUsIHJnYmEoMTk5LCAyMzcsIDQ0LCAwLjE5KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwKSA5NCUpLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDApIDAlLCByZ2JhKDIwNSwgMCwgMCwgMC4wNykgNDglLCByZ2JhKDI1NCwgMjA0LCAwLCAwLjExKSA2NSUsIHJnYmEoMjU1LCAyMTAsIDgsIDApIDk0JSksXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC4wMSkgMCUsIHJnYmEoODUsIDI1NSwgNTksIDAuMDgpIDQ4JSwgcmdiYSgxNzQsIDIwMiwgMCwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMCkgOTQlKTtcXHJcXG4gICAgYmFja2dyb3VuZC1zaXplOiAxODhweCAzNDdweCwgMTcwcHgsIDIwOXB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTU0cHgsIDU3cHgsIDU1cHg7XFxyXFxufVxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFBhdHRlcm4gZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICBsZWZ0OiAnMHB4JyxcclxuICAgICAgdG9wOiAnMHB4JyxcclxuICAgICAgY29sb3I6ICcjZGRkJyxcclxuICAgICAgcGF0dGVybjogJ0dyYXBoUGFwZXInLFxyXG4gICAgICBjZWxsV2lkdGg6IDEwMCxcclxuICAgICAgY2VsbEhlaWdodDogMTAwLFxyXG4gICAgICBsaW5lV2lkdGg6IDJcclxuICAgIH07XHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1BhdHRlcm4nO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhwcm9wcy5wYXR0ZXJuKTtcclxuICAgIGlmIChwcm9wcy5wYXR0ZXJuID09PSAnZ3JpZCcpIHtcclxuICAgICAgdGhpcy5jc3MoIFBhdHRlcm4ubWFrZUdyaWRDU1MocHJvcHMuY2VsbFdpZHRoLCBwcm9wcy5jZWxsV2lkdGgsIHByb3BzLmxpbmVXaWR0aCkgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICAvLyByZW5kZXIgZmlyc3QsIHRoaXMgd2lsbCBzZXQgYSBwYXJlbnQgZWxlbWVudFxyXG4gICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICAvLyB0aGVuIGFkanVzdCBwYXR0ZXJuIHRvIGZpbGwgcGFyZW50IHdpdGggYSBzcXVhcmUgYXNwZWN0IHJhdGlvXHJcbiAgICB2YXIgc2l6ZSA9IE1hdGgubWF4KHRoaXMucGFyZW50LiRlbGVtZW50LndpZHRoKCksIHRoaXMucGFyZW50LiRlbGVtZW50LmhlaWdodCgpKTtcclxuICAgIHRoaXMuY3NzKHt3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlR3JpZENTUyAoY2VsbFdpZHRoLCBjZWxsSGVpZ2h0LCBsaW5lV2lkdGgpIHtcclxuICAgIHZhciBwcm9wcyA9IHt9O1xyXG4gICAgdmFyIHBvcyA9ICctJyArIGxpbmVXaWR0aCArICdweCc7XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kU2l6ZSA9ICcnICsgY2VsbFdpZHRoICsgJ3B4ICcgKyBjZWxsSGVpZ2h0ICsgJ3B4LCAnICsgY2VsbFdpZHRoICsgJ3B4ICcgKyBjZWxsSGVpZ2h0ICsgJ3B4JztcclxuICAgIHByb3BzLmJhY2tncm91bmRQb3NpdGlvbiA9IHBvcyArICcgJyArIHBvcyArICcsJyArIHBvcyArICcgJyArIHBvcztcclxuICAgIHByb3BzLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICdsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSwnICtcclxuICAgICAgJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSc7XHJcbiAgICByZXR1cm4gcHJvcHM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICAgIHJldHVybiByZXF1aXJlKCcuL1BhdHRlcm4uY3NzJyk7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm4pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xyXG5cclxuXHJcbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMuVCA9IFRpbWVyLm1ha2Uoe2NhbGxiYWNrOiB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgZGVsYXk6IHRoaXMuZGVsYXl9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0dGhpcy5ULnN0b3AoKTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIgKCkge1xyXG5cdFx0dGhpcy5jYWxsYmFjaygpO1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFB1bHNhcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFB1bHNhcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbnZhciBQSSA9IDMuMTQxNTkyNjUzNTk7XHJcbnZhciBIQUxGUEkgPSBQSS8yLjA7XHJcblxyXG5jbGFzcyBSYW5kIHtcclxuXHRzdGF0aWMgcmFuZEl0ZW0oYXJyKSB7XHJcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBhcnJbIFJhbmQucmFuZEludCgwLCBhcnIubGVuZ3RoLTEpIF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gKGluY2x1ZGVkKSBhbmQgbWF4IChpbmNsdWRlZClcclxuXHQvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcclxuXHRzdGF0aWMgcmFuZEludChtaW4sIG1heCkge1xyXG5cdFx0bWluID0gTWF0aC5jZWlsKG1pbnx8MCk7XHJcblx0XHRtYXggPSBNYXRoLmZsb29yKG1heHx8MSk7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIC45OTk5OTlcclxuXHRzdGF0aWMgcmFuZEZsb2F0KCkge1xyXG5cdCAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyByYW5kUGVyY2VudCh0aHJlc2hvbGQpIHtcclxuXHRcdHJldHVybiBSYW5kLnJhbmRJbnQoMSwxMDApIDwgdGhyZXNob2xkO1xyXG5cdH1cclxuXHJcblx0Ly8gcmFuZG9tIGludGVnZXIgd2l0aGluIG1heERpc3RhbmNlIG9mIHRhcmdldCAoZGlzdHJpYnV0ZWQgaW4gYSBiZWxsIGN1cnZlIGFyb3VuZCB0YXJnZXQpXHJcblx0c3RhdGljIHJhbmRDbG9zZVRvKHRhcmdldCwgbWF4RGlzdGFuY2UpIHtcclxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXHJcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZFNpbjIoKSk7ICAgLy8gc3ByZWFkIG92ZXIgZW50aXJlIHJhbmdlLCBzb21ld2hhdCBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgXHJcblx0XHRyZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogUmFuZC5yYW5kUG93MigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHdpdGggc2hhcnAgY29uY2VudHJhdGlvbiBhcm91bmQgY2VudGVyXHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXHJcblx0c3RhdGljIHJhbmRQb3coKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5wb3coMS4wIC0gUmFuZC5yYW5kRmxvYXQoKSwgNCk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCB0b3dhcmQgMVxyXG5cdHN0YXRpYyByYW5kU2luKCkge1xyXG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdzIoKSB7XHJcblx0XHRyZXR1cm4gUmFuZC5yYW5kUG93KCkgLSBSYW5kLnJhbmRQb3coKTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIDBcclxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcclxuXHRcdHJldHVybiAoKFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSkgLSAzLjApIC8gMy4wO1xyXG5cdH1cclxuXHJcbiAgICAvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgY2xvc2VyIHRvIDBcclxuICAgIHN0YXRpYyByYW5kU2luMigpIHtcclxuICAgICAgICByZXR1cm4gUmFuZC5yYW5kU2luKCkgLSBSYW5kLnJhbmRTaW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gYXJyYXkgb2YgMyBpbnRzLCBlYWNoIDAtMjU1XHJcbiAgICBzdGF0aWMgcmFuZFJHQigpIHtcclxuICAgICAgICByZXR1cm4gW1JhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSldO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByYW5kUkdCc3RyKCkge1xyXG5cdFx0dmFyIHJnYiA9IFJhbmQucmFuZFJHQigpO1xyXG4gICAgICAgIHJldHVybiAncmdiYSgnICtyZ2JbMF0rICcsJyArcmdiWzFdKyAnLCcgK3JnYlsyXSsgJywgLjkpJztcclxuICAgIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhSYW5kKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEJveCA9IHJlcXVpcmUoJy4uL0JveC9Cb3guanMnKTtcclxuXHJcbi8qKlxyXG4gKiAgdywgaCwgZGVwdGhcclxuICovXHJcbmNsYXNzIFJvb20gZXh0ZW5kcyBCb3gge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHR3OiAxNTAwLFxyXG5cdFx0XHRoOiAxMDAwLFxyXG5cdFx0XHRkOiAgODAwLFxyXG5cdFx0XHRib3JkZXI6ICcxcHggc29saWQgYmxhY2snLFxyXG5cdFx0XHRwZXJzcGVjdGl2ZTogJ2luaGVyaXQnICAvLyAnODAwMHB4J1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0dGhpcy53ID0gcHJvcHMudztcclxuXHRcdHRoaXMuaCA9IHByb3BzLmg7XHJcblx0XHR0aGlzLmQgPSBwcm9wcy5kO1xyXG5cdFx0dGhpcy53YWxscyA9IHt9O1xyXG5cclxuXHRcdHN1cGVyLmluaXQocHJvcHMpO1xyXG5cdFx0Ly8gdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnR5cGUgPSAnUm9vbSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMubWFrZVJvb20odGhpcy4kZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdG1ha2VSb29tKCkge1xyXG5cdFx0dmFyIHJvb20gPSB0aGlzO1xyXG5cdFx0dmFyIHdhbGxzID0gW107XHJcblx0XHR2YXIgaGFsZkhlaWdodCA9IHRoaXMuaC8yO1xyXG5cdFx0dmFyIGhhbGZXaWR0aCA9IHRoaXMudy8yO1xyXG5cdFx0dmFyIGhhbGZEZXB0aCA9IHRoaXMuZC8yO1xyXG5cclxuXHRcdHZhciB3cmFwcGVyID0gQm94Lm1ha2Uoe1xyXG5cdFx0XHR3aWR0aDogJzEwMCUnLFxyXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcclxuXHRcdFx0ekluZGV4OiAyMDAwMCxcclxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXHJcblx0XHRcdHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxyXG5cdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDFzJ1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gSW5uZXIgZmFjaW5nIHdhbGxzXHJcblx0XHQvLyB3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdmcm9udCcsIHtcclxuXHRcdC8vIFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknLFxyXG5cdFx0Ly8gXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdC8vIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0Ly8gXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAxODBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdC8vIH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdiYWNrJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgwLCAwLCAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVooICcgKyAoLWhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdyaWdodCcsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAwLCA1NSwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdsZWZ0Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLWhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCd0b3AnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDU1LCAyNTUsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtKGhhbGZIZWlnaHQgLSAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdib3R0b20nLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDI1NSwgMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCA4OWRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmSGVpZ2h0ICsgKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cclxuXHRcdC8vIE91dGVyIGZhY2luZyB3YWxsc1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0ZnJvbnQnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDApJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArIChoYWxmRGVwdGgpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0YmFjaycsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMCwgMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtMTgwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHJpZ2h0Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDEwMCwgMTAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgoaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRsZWZ0Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDEwMCwgMTAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHRvcCcsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDIwMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRib3R0b20nLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDEwMCwgMjAwLCAxMDAsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmSGVpZ2h0ICsgKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblxyXG5cdFx0Ly8gY29weSB3YWxscyBhcnJheSB0byBvYmplY3RcclxuXHRcdGZvciAodmFyIGk9MDsgaSA8IHdhbGxzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMud2FsbHNbIHdhbGxzW2ldLndoaWNoIF0gPSB3YWxsc1tpXTtcclxuXHRcdH1cclxuXHJcblx0XHR3cmFwcGVyLmFkZCh3YWxscyk7XHJcblx0XHRyb29tLmFkZCh3cmFwcGVyKTtcclxuXHR9XHJcblxyXG5cdG1ha2VXYWxsKHdoaWNoLCBjc3NWYWxzKSB7XHJcblx0XHR2YXIgZGVmYXVsdENTUyA9IHtcclxuXHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcclxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXHJcblx0XHRcdC8vIGxpbmVIZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdC8vIGZvbnRTaXplOiAodGhpcy5oLzMpICsncHgnLFxyXG5cdFx0XHQvLyBmb250V2VpZ2h0OiAnYm9sZCcsXHJcblx0XHRcdC8vIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcblx0XHRcdC8vIGNvbG9yOiAnd2hpdGUnLFxyXG5cdFx0XHRiYWNrZmFjZVZpc2liaWxpdHk6ICdoaWRkZW4nXHJcblx0XHR9O1xyXG5cdFx0dmFyIHdhbGwgPSBUaGluZy5jbGFzc2VzLkJveC5tYWtlKCQuZXh0ZW5kKHt9LCBkZWZhdWx0Q1NTLCBjc3NWYWxzKSk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKCd3YWxsJyk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKHdoaWNoKTtcclxuXHRcdC8vIHdhbGwuJGVsZW1lbnQuYXBwZW5kKHdoaWNoKTtcclxuXHRcdHdhbGwud2hpY2ggPSB3aGljaDtcclxuXHRcdHJldHVybiB3YWxsO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNzcyAoKSB7XHJcblx0XHQvLyByZXR1cm4gcmVxdWlyZSgnLi9Sb29tLmNzcycpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhSb29tKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUm9vbTtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFRleHRQYW5lIGV4dGVuZHMgVGhpbmcge1xyXG4gICAgaW5pdCAocHJvcHMpIHtcclxuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgVmVyZGFuYSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICAgICAgICBmb250U2l6ZTogJzI0cHgnLFxyXG4gICAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgICAgICAgICAgY29sb3I6ICdyZ2IoMjAwLCAyMDAsIDIwMCknLFxyXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgIHc6IDEwMCxcclxuICAgICAgICAgICAgaDogMTAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgICAgICBzdXBlci5pbml0KHByb3BzKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSAnVGV4dFBhbmUnO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcbiAgICB9XHJcblxyXG4gICAgZmlsbFRleHQgKCkge1xyXG4gICAgICAgIHZhciBtYXhIZWlnaHQgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBtYXggPSAxMDAwO1xyXG4gICAgICAgIHZhciAkc3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcclxuICAgICAgICB2YXIgc3BhbkhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgIC8vIGVsZW1lbnQgaGFzIHRvIGJlIGFwcGVuZGVkIHRvIGJvZHkgcHJpb3IsIG9yIHNwYW5IZWlnaHQgd2lsbCBiZSAwXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJHNwYW4pO1xyXG4gICAgICAgIHdoaWxlIChzcGFuSGVpZ2h0IDwgbWF4SGVpZ2h0ICYmIG1heC0tID4gMCkge1xyXG4gICAgICAgICAgICAkc3Bhbi5hcHBlbmQodGhpcy50ZXh0KTtcclxuICAgICAgICAgICAgc3BhbkhlaWdodCA9ICRzcGFuLmhlaWdodCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIgKCkge1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuZmlsbFRleHQodGhpcy50ZXh0KTtcclxuICAgIH1cclxufVxyXG5cclxuVGhpbmcuYWRkQ2xhc3MoVGV4dFBhbmUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0UGFuZTtcclxuIiwidmFyIGVsZW1lbnRDb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRoaW5nIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1RoaW5nJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUgKHByb3BzKSB7XHJcbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG4gICAgLy8gQ1NTIHByb3BzIGdvIGludG8gdGhpcy5wcm9wc1xyXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xyXG4gICAgLy8ga2VlcCB0aGVzZSBwcm9wZXJ0aWVzIG9uICd0aGlzJ1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IHByb3BzLnJvdGF0ZSB8fCAwO1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IHByb3BzLnNjYWxlIHx8IDE7XHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IDA7XHJcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IDA7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICB2YXIgcGFyZW50RWxlbWVudCA9ICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC4kZWxlbWVudCkgfHwgJChkb2N1bWVudC5ib2R5KTtcclxuICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kKHRoaXMuJGVsZW1lbnQpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3ModGhpcy5wcm9wcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxyXG4gIHVuUmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLiRlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0RGltZW5zaW9ucyAoKSB7XHJcbiAgICByZXR1cm4ge3c6IHRoaXMuJGVsZW1lbnQud2lkdGgoKSwgaDogdGhpcy4kZWxlbWVudC5oZWlnaHQoKX07XHJcbiAgfVxyXG5cclxuICBnZXRCb3VuZGluZ0JveCAoKSB7XHJcbiAgICAvLyByZWxhdGl2ZSB0byBwYWdlXHJcbiAgICB2YXIgc2Nyb2xsdG9wID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICB2YXIgc2Nyb2xsbGVmdCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcclxuICAgIHZhciBib3VuZHMgPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogYm91bmRzLmxlZnQrc2Nyb2xsbGVmdCxcclxuICAgICAgeTogYm91bmRzLnRvcCtzY3JvbGx0b3AsXHJcbiAgICAgIHc6IGJvdW5kcy53aWR0aCxcclxuICAgICAgaDogYm91bmRzLmhlaWdodCxcclxuICAgICAgYm90dG9tOiBib3VuZHMuYm90dG9tK3Njcm9sbHRvcCxcclxuICAgICAgcmlnaHQ6IGJvdW5kcy5yaWdodCtzY3JvbGxsZWZ0XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0UG9zaXRpb24gKCkge1xyXG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxyXG4gICAgdmFyIHh5ID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKTtcclxuICAgIHZhciB6ID0gdGhpcy4kZWxlbWVudC5jc3MoJ3otaW5kZXgnKTtcclxuICAgIHogPSB6ID8gcGFyc2VJbnQoeikgOiB1bmRlZmluZWQ7XHJcbiAgICByZXR1cm4gW3h5LmxlZnQsIHh5LnRvcCwgel07XHJcbiAgfVxyXG5cclxuICAvLyByZXR1cm4gdGhlIGVsZW1lbnQncyBDU1MgdHJhbnNmb3JtIG1hdHJpeCBhcyBhcnJheSBvZiA2IHZhbHVlc1xyXG4gIGdldENTU1RyYW5zZm9ybSAoKSB7XHJcbiAgICB2YXIgbVN0ciA9IHRoaXMuJGVsZW1lbnQuY3NzKCd0cmFuc2Zvcm0nKS5tYXRjaCgvLT9bXFxkXFwuXSsvZyk7XHJcbiAgICB2YXIgbVZhbCA9IFtdO1xyXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbVN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtVmFsW2ldID0gcGFyc2VGbG9hdChtU3RyW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtVmFsOyAgXHJcbiAgfVxyXG5cclxuICByb3RhdGUgKGRlZ3JlZXMpIHtcclxuICAgIHRoaXMucm90YXRpb24gKz0gZGVncmVlcztcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHJvdGF0ZVRvIChhbmdsZSkge1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IGFuZ2xlO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGUgKGZhY3Rvcikge1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciArPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzY2FsZVRvIChmYWN0b3IpIHtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGUgKHgsIHkpIHtcclxuICAgIHRoaXMueCArPSB4O1xyXG4gICAgdGhpcy55ICs9IHk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGVUbyAoeCwgeSkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2Zvcm0gKCkge1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICB0cmFuc2Zvcm06IFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1ModGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZUZhY3RvciwgdGhpcy54LCB0aGlzLnkpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgY3NzIChwcm9wcykge1xyXG4gICAgdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHRoaXMucHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHByb3BzKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgaHRtbCAoKSB7XHJcbiAgICByZXR1cm4gJzxkaXY+PC9kaXY+JztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZSAoKSB7XHJcbiAgICB2YXIgY2xzID0gdGhpcztcclxuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjbHMoKTtcclxuICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ2xhc3MgKGNscykge1xyXG4gICAgVGhpbmcuY2xhc3NlcyA9IFRoaW5nLmNsYXNzZXMgfHwge307XHJcbiAgICBUaGluZy5jbGFzc2VzW2Nscy5uYW1lXSA9IGNscztcclxuXHJcbiAgICAvLyBsb2FkIHRoZSBjbGFzcyBzdHlsZXMgKHRoZXNlIGFyZSBpbmNsdWRlZCBpbiB0aGUgYnVuZGxlIGF0IGJ1aWxkIHRpbWUpXHJcbiAgICBjbHMuY3NzICYmIFRoaW5nLmFkZENTU1N0cmluZyhjbHMuY3NzKCksIGNscy5uYW1lKTtcclxuXHJcbiAgICAvLyBhZGQgYWRkaXRpb25hbCBjc3MgZmlsZSBhdCBsb2FkIHRpbWVcclxuICAgIFRoaW5nLmFkZENTU0ZpbGUoY2xzLm5hbWUgKyAnLycgKyBjbHMubmFtZSArICcuY3NzJywgJ2NzcycrY2xzLm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldENsYXNzIChuYW1lKSB7XHJcbiAgICByZXR1cm4gVGhpbmcuY2xhc3Nlc1tuYW1lXTtcclxuICB9XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgLy8gQ1NTIG1hbmFnZW1lbnQgZnVuY3Rpb25zXHJcblxyXG4gIHN0YXRpYyBtYWtlU3R5bGVzIChwcm9wcykge1xyXG4gICAgdmFyIHN0eWxlcyA9IHByb3BzIHx8IHt9O1xyXG4gICAgJC5leHRlbmQoc3R5bGVzLCB7XHJcbiAgICAgIC8vIGxlZnQ6IHByb3BzLmxlZnQgfHwgKHByb3BzLnggJiYgKHByb3BzLnggKyBcInB4XCIpKSxcclxuICAgICAgLy8gdG9wOiBwcm9wcy50b3AgfHwgKHByb3BzLnkgJiYgKHByb3BzLnkgKyBcInB4XCIpKSxcclxuICAgICAgd2lkdGg6IHByb3BzLndpZHRoIHx8IChwcm9wcy53ICYmIChwcm9wcy53ICsgXCJweFwiKSksXHJcbiAgICAgIGhlaWdodDogcHJvcHMuaGVpZ2h0IHx8IChwcm9wcy5oICYmIChwcm9wcy5oICsgXCJweFwiKSksXHJcbiAgICAgIHpJbmRleDogcHJvcHMuekluZGV4IHx8IHByb3BzLnosXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogcHJvcHMuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICB0cmFuc2Zvcm06IHByb3BzLnRyYW5zZm9ybSB8fCAoVGhpbmcubWFrZVRyYW5zZm9ybUNTUyhwcm9wcy5yb3RhdGUsIHByb3BzLnNjYWxlLCBwcm9wcy54LCBwcm9wcy55KSksXHJcbiAgICAgIHBvc2l0aW9uOiBwcm9wcy5wb3NpdGlvbiB8fCAnYWJzb2x1dGUnXHJcbiAgICB9KTtcclxuICAgIGRlbGV0ZSBzdHlsZXMucm90YXRlO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5zY2FsZTtcclxuICAgIGRlbGV0ZSBzdHlsZXMueDtcclxuICAgIGRlbGV0ZSBzdHlsZXMueTtcclxuICAgIGRlbGV0ZSBzdHlsZXMuejtcclxuICAgIGRlbGV0ZSBzdHlsZXMudztcclxuICAgIGRlbGV0ZSBzdHlsZXMuaDtcclxuICAgIHJldHVybiBzdHlsZXM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVRyYW5zZm9ybUNTUyAocm90YXRlLCBzY2FsZSwgdHgsIHR5KSB7XHJcbiAgICB2YXIgdHJhbnNmb3JtID0gJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gKHR4IHx8IHR5KSA/IChUaGluZy5tYWtlVHJhbnNsYXRlQ1NTKHR4LCB0eSkgKyAnICcpIDogJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gVGhpbmcuaXNOdW1lcmljKHJvdGF0ZSkgPyAoVGhpbmcubWFrZUFuZ2xlQ1NTKHJvdGF0ZSkgKyAnICcpIDogJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gc2NhbGUgPyAoVGhpbmcubWFrZVNjYWxlQ1NTKHNjYWxlKSArICcgJykgOiAnJztcclxuICAgIHJldHVybiB0cmFuc2Zvcm07XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUFuZ2xlQ1NTIChhbmdsZSkge1xyXG4gICAgcmV0dXJuICdyb3RhdGUoJythbmdsZSsnZGVnKSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVNjYWxlQ1NTIChzY2FsZSkge1xyXG4gICAgcmV0dXJuICdzY2FsZSgnK3NjYWxlKycpJztcclxuICB9XHJcblxyXG4gIC8vIE5PVEU6IHRyYW5zbGF0aW9uIGNvb3JkcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiB0aGUgZG9jdW1lbnQgZmxvdy5cclxuICAvLyBUaGV5IGFyZSBub3QgdGhlIHNhbWUgYXMgc2V0dGluZyBsZWZ0L3RvcCB2YWx1ZXMsIHdoaWNoIGFyZSBhYnNvbHV0ZSBjb29yZGluYXRlc1xyXG4gIC8vIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudC5cclxuICBzdGF0aWMgbWFrZVRyYW5zbGF0ZUNTUyAoeCwgeSkge1xyXG4gICAgeCA9IHggfHwgJzAnO1xyXG4gICAgeSA9IHkgfHwgJzAnO1xyXG4gICAgcmV0dXJuICd0cmFuc2xhdGUoJysgeCArICdweCwgJyArIHkgKydweCknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VFbGVtZW50IChodG1sLCBwcm9wcywgdHlwZSkge1xyXG4gICAgdmFyICRlbGVtZW50ID0gJChodG1sKVxyXG4gICAgICAuY3NzKFRoaW5nLm1ha2VTdHlsZXMocHJvcHMpKVxyXG4gICAgICAuYWRkQ2xhc3ModHlwZSB8fCAncmFuZG9tJylcclxuICAgICAgLmF0dHIoJ2lkJywgKHR5cGUgfHwgJ3JhbmRvbScpICsgKCsrZWxlbWVudENvdW50ZXIpKTtcclxuICAgIHJldHVybiAkZWxlbWVudDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpc051bWVyaWMobikge1xyXG4gICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxuICB9XHJcblxyXG4gIC8vIE1ha2Ugc3VyZSBuZWNlc3NhcnkgQ1NTIHByb3BlcnRpZXMgYXJlIHByZXNlbnQgb3IgZGVmYXVsdGVkIHRvIHNvbWV0aGluZyBzYW5lXHJcbiAgc3RhdGljIGNsZWFudXAgKHByb3BzKSB7XHJcbiAgICB2YXIgY3AgPSBwcm9wcyB8fCB7fTtcclxuICAgIGNwLnBvc2l0aW9uID0gcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJzsgICAvLyBkZWZhdWx0IHRvIGFic29sdXRlIHBvc2l0aW9uaW5nXHJcbiAgICAvLyBjcC54ID0gcHJvcHMueCB8fCBwcm9wcy5sZWZ0IHx8IDA7XHJcbiAgICAvLyBjcC55ID0gcHJvcHMueSB8fCBwcm9wcy50b3AgfHwgMDtcclxuICAgIC8vIGNwLnogPSBwcm9wcy56IHx8IHByb3BzLnpJbmRleDtcclxuICAgIC8vIGNwLncgPSBwcm9wcy53IHx8IHByb3BzLndpZHRoO1xyXG4gICAgLy8gY3AuaCA9IHByb3BzLmggfHwgcHJvcHMuaGVpZ2h0O1xyXG4gICAgY3Aucm90YXRpb24gPSBwcm9wcy5yb3RhdGlvbiB8fCAwO1xyXG4gICAgY3Auc2NhbGUgPSBwcm9wcy5zY2FsZSB8fCAxO1xyXG4gICAgcmV0dXJuIGNwO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENTU0ZpbGUoZmlsZU5hbWUsIGlkKSB7XHJcbiAgICAgdmFyIGxpbmsgPSAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCInICsgZmlsZU5hbWUgKyAnXCIgaWQ9XCInICsgaWQgKyAnXCI+JztcclxuICAgICAkKCdoZWFkJykuZmluZCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICAgJCgnaGVhZCcpLmFwcGVuZChsaW5rKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZCkge1xyXG4gICAgaWYgKGNzc1N0cmluZykge1xyXG4gICAgICAvLyB2YXIgZG9jID0gd2luZG93LmRvY3VtZW50O1xyXG4gICAgICB2YXIgc3R5bGVFbCA9ICQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICtjc3NTdHJpbmcrICc8L3N0eWxlPicpXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgKGlkIHx8ICdUaGluZycpICsgJy1zdHlsZXMnKTtcclxuICAgICAgJCgnaGVhZCcpLmFwcGVuZChzdHlsZUVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRoaW5nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGhpbmc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcblxyXG5jbGFzcyBUaW1lciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdvICgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xyXG5cdFx0dGhpcy50aW1lcklEID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLmRlbGF5KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcclxuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRpbWVyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBUcmlhbmdsZSBleHRlbmRzIFRoaW5nIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuXHRcdFx0c2l6ZTogMTAsXHJcblx0XHRcdGNvbG9yOiAnI0JBREE1NSdcclxuXHRcdH07XHJcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHByb3BzLCBkZWZhdWx0UHJvcHMpO1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHRcdHRoaXMudHlwZSA9ICdUcmlhbmdsZSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMubWFrZVRyaWFuZ2xlKHRoaXMucHJvcHMuc2l6ZSwgdGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgZWxlbWVudCBiZWZvcmUgY2FsbGluZyB0aGlzXHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdG1ha2VUcmlhbmdsZSAoc2l6ZSwgY29sb3IpIHtcclxuXHRcdGNvbG9yID0gY29sb3IgfHwgJyNCQURBNTUnO1xyXG5cdFx0c2l6ZSA9IHNpemUgfHwgMTA7XHJcblx0XHR0aGlzLmNzcyh7XHJcblx0XHRcdHdpZHRoOiAwLCBcclxuXHRcdFx0aGVpZ2h0OiAwLCBcclxuXHRcdFx0Zm9udFNpemU6IDAsXHJcblx0XHRcdGxpbmVIZWlnaHQ6IDAsXHJcblx0XHRcdGJvcmRlckJvdHRvbTogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXHJcblx0XHRcdGJvcmRlclRvcDogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXHJcblx0XHRcdGJvcmRlckxlZnQ6IHNpemUgKyAncHggc29saWQgJyArIGNvbG9yXHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhUcmlhbmdsZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWFuZ2xlO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnJlcXVpcmUoJy4vQm94L0JveC5qcycpO1xyXG5yZXF1aXJlKCcuL0Fycm93L0Fycm93LmpzJyk7XHJcbnJlcXVpcmUoJy4vRGVtb0JveC9EZW1vQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG5yZXF1aXJlKCcuL1RpbWVyL1RpbWVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vUmFuZC9SYW5kLmpzJyk7XHJcbnJlcXVpcmUoJy4vUHVsc2FyL1B1bHNhci5qcycpO1xyXG5yZXF1aXJlKCcuL0RvL0RvLmpzJyk7XHJcbnJlcXVpcmUoJy4vTGFiZWwvTGFiZWwuanMnKTtcclxucmVxdWlyZSgnLi9MaW5lL0xpbmUuanMnKTtcclxucmVxdWlyZSgnLi9JbWcvSW1nLmpzJyk7XHJcbnJlcXVpcmUoJy4vUGF0dGVybi9QYXR0ZXJuLmpzJyk7XHJcbnJlcXVpcmUoJy4vQkdJbWcvQkdJbWcuanMnKTtcclxucmVxdWlyZSgnLi9UZXh0UGFuZS9UZXh0UGFuZS5qcycpO1xyXG5yZXF1aXJlKCcuL0NpcmNsZS9DaXJjbGUuanMnKTtcclxucmVxdWlyZSgnLi9UcmlhbmdsZS9UcmlhbmdsZS5qcycpO1xyXG5yZXF1aXJlKCcuL0N1YmUvQ3ViZS5qcycpO1xyXG5yZXF1aXJlKCcuL1Jvb20vUm9vbS5qcycpO1xyXG5cclxud2luZG93LlRoaW5nID0gVGhpbmc7XHJcbiJdfQ==
