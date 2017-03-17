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
module.exports = ".Pattern.GraphPaper {\r\n  background-color: #003;\r\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\r\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\r\n  background-image:\r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\r\n}\r\n\r\n.Pattern.Grid {\r\n  background-size: 100px 100px, 100px 100px;\r\n  background-position: -2px -2px, -2px -2px;\r\n  background-image:\r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\r\n}\r\n\r\n.Pattern.SofaDark {\r\n  background:\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Sofa {\r\n  background:\r\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.YellowCirclesWithViolet {\r\n    background-image: radial-gradient(#ffd679 17%, #3d5443 17.5%, #3d5443 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3dabc7 12%, #49ab3c 13.5%, #38822e 14%, #ffdb89 14.5%, #ffdb89 19%, #fff57a 20%, #fcffb5 28%, #fffebd 29%);\r\n    background-size: 25%, 25%;\r\n    background-position: 0% 0%, 17% 17%;\r\n}\r\n\r\n.Pattern.YellowCirclesWithViolet2 {\r\n  background-image: radial-gradient(#ffdd90 17%, black 17.5%, black 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3cdada 17%, gray 17.5%, gray 18%, #ffdd90 19%, #ffdd90 24%, #ffff90 30%, #ffff90 36%);\r\n  background-size: 25%, 25%;\r\n  background-position: 0% 0%, 17% 17%;\r\n}\r\n\r\n.Pattern.PolkaDots {\r\n  background-image:\r\n    radial-gradient(white 15%, transparent 17%),\r\n    radial-gradient(white 15%, transparent 17%);\r\n  background-size: 60px 60px;\r\n  background-position: 0 0, 30px 30px;\r\n}\r\n\r\n\r\n\r\n.Pattern.BlueBalls {\r\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Stripes {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.StripesWhiteRedGreen {\r\n  background-image:\r\n    linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),\r\n    linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),\r\n    linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%);\r\n  background-position: 0%, 0%, 0%;\r\n  background-size: 15%, 15%, 15%;\r\n}\r\n\r\n.Pattern.PlaidRed {\r\n  background-color: hsl(0, 86%, 34%);\r\n  background-image:\r\n    repeating-linear-gradient(transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(270deg, transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(125deg, transparent,\r\n      transparent 2px, rgba(0,0,0,.2) 2px,\r\n      rgba(0,0,0,.2) 3px, transparent 3px,\r\n      transparent 5px, rgba(0,0,0,.2) 5px);\r\n}\r\n\r\n.Pattern.DiagonalStripes {\r\n  background-image: linear-gradient(45deg, black 25%, transparent 25.25%, transparent 50%, black 50.25%, black 75%, transparent 75.25%, transparent);\r\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\r\n        /* ie. 32% 16% for an element with w=100 h=200 */\r\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\r\n}\r\n\r\n.Pattern.BlueCascade {\r\n  background-color: #026873;\r\n  background-image: linear-gradient(91deg, rgba(255,255,25,0.17) 50%, transparent 51.5%),\r\n    linear-gradient(89deg, rgba(25,255,255,0.23) 50%, transparent 54.5%),\r\n    linear-gradient(90.5deg, transparent 50%, rgba(252, 255, 162, 0.37) 54.5%),\r\n    linear-gradient(90deg, transparent 50.75%, red 51%, red 51.5%, transparent 51.75%);\r\n  background-size: 5% 100%, 3% 100%, 9% 100%, 8% 100%;\r\n}\r\n\r\n /*Perlin Noise-ish radial blurs*/\r\n  /*RGB*/\r\n  /*background-image: radial-gradient(rgba(255, 42, 0, .5) 1%, transparent 200%), radial-gradient(rgba(86, 250, 2, .5) 1%, transparent 200%), radial-gradient(rgba(0, 7, 255, 0.6) 1%, transparent 150%);\r\n  background-size: 161px, 134px, 188px;\r\n  background-position: -54px, 57px, 55px;\r\n  */\r\n\r\n  /*Monochrome - better blurs*/\r\n/*\r\n  background-image: radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%);\r\n  background-size: 188px 347px, 170px, 209px;\r\n  background-position: -54px, 57px, 55px;\r\n*/\r\n\r\n.Pattern.GreenOvalsXray {\r\n  background-color: #131c0c;\r\n  background-image: \r\n    radial-gradient(rgba(18, 0, 255, 0) 0%, rgba(3, 179, 255, 0.09) 48%, rgba(199, 237, 44, 0.19) 65%, rgba(9, 1, 112, 0) 94%), \r\n    radial-gradient(rgba(9, 1, 112, 0) 0%, rgba(205, 0, 0, 0.07) 48%, rgba(254, 204, 0, 0.11) 65%, rgba(255, 210, 8, 0) 94%), \r\n    radial-gradient(rgba(9, 1, 112, 0.01) 0%, rgba(85, 255, 59, 0.08) 48%, rgba(174, 202, 0, 0.16) 65%, rgba(9, 1, 112, 0) 94%);\r\n    background-size: 188px 347px, 170px, 209px;\r\n  background-position: -54px, 57px, 55px;\r\n}\r\n";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9DdWJlL0N1YmUuaHRtbCIsInNyYy9saWIvQ3ViZS9DdWJlLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUm9vbS9Sb29tLmpzIiwic3JjL2xpYi9UZXh0UGFuZS9UZXh0UGFuZS5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9UcmlhbmdsZS9UcmlhbmdsZS5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEFjdGlvbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0fVxyXG5cclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dGhpcy5wcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5nbygpJyk7XHJcblx0fVxyXG5cclxuXHRzdG9wICgpIHtcclxuXHRcdHdpbmRvdy5jb25zb2xlLmxvZygnQWN0aW9uLnN0b3AoKScpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1ha2UgKCkge1xyXG5cdCAgdmFyIGNscyA9IHRoaXM7XHJcblx0ICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcblx0ICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG5cdCAgcmV0dXJuIGluc3RhbmNlO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhBY3Rpb24pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIvKiByZXF1aXJlZCBmb3IgYXJyb3cgKi9cXHJcXG4uYXJyb3ctaGVhZCB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgd2lkdGg6IDA7IFxcclxcbiAgaGVpZ2h0OiAwOyBcXHJcXG4gIGJvcmRlci10b3A6IDMwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItYm90dG9tOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDMwcHggc29saWQgZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy1ib2R5IHtcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcXHJcXG4gIHdpZHRoOiA0MHB4O1xcclxcbiAgaGVpZ2h0OiAyMHB4O1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbiAgbWFyZ2luLXRvcDogMjBweDtcXHJcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxyXFxuICBib3JkZXItbGVmdDogMDtcXHJcXG4gIGJvcmRlci1yaWdodDogMDtcXHJcXG59XFxyXFxuXFxyXFxuLmFycm93LXdyYXBwZXIge1xcclxcbiAgd2lkdGg6IDcwcHg7ICAgLyogYXJyb3ctYm9keSB3aWR0aCArIGFycm93LWhlYWQgYm9yZGVyIHdpZHRoICovXFxyXFxufVxcclxcblxcclxcbi5BcnJvdyB7XFxyXFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXHJcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXHJcXG59XFxyXFxuXFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQXJyb3cgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnQXJyb3cnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLnNldENvbG9yKHRoaXMucHJvcHMuY29sb3IpOyAgLy8gaGF2ZSB0byBtYWtlIGFycm93IGJlZm9yZSBjYWxsaW5nIHRoaXNcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c2V0Q29sb3IgKGMpIHtcclxuXHRcdHRoaXMuJGVsZW1lbnQuZmluZCgnLmFycm93LWhlYWQnKS5jc3Moe2JvcmRlckxlZnRDb2xvcjpjfSk7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1ib2R5JykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6Y30pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRodG1sICgpIHtcclxuXHRcdHJldHVybiBcIjxkaXY+PGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+PC9kaXY+XCI7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3JlYXRlQXJyb3dFbGVtZW50ICgpIHtcclxuXHRcdHZhciAkYXJyb3cgPSAkKFwiPGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+XCIpO1xyXG5cdFx0cmV0dXJuICRhcnJvdztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEFycm93KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBCR0ltZyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgdXJsOiAnJyxcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICBsZWZ0OiAnMHB4JyxcclxuICAgICAgdG9wOiAnMHB4J1xyXG4gICAgfTtcclxuICAgIHByb3BzID0gdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnQkdJbWcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kOiAndXJsKFwiJyArIHByb3BzLnVybCArICdcIikgbm8tcmVwZWF0IGNlbnRlcicsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiAnY292ZXInICAvLzEwMCUgMTAwJSdcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCR0ltZyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJHSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQm94IGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgXHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gIFx0dGhpcy50eXBlID0gJ0JveCc7XHJcbiAgXHR0aGlzLml0ZW1zID0gW107XHJcbiAgXHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgfVxyXG5cclxuICBhZGQgKGFkZEl0ZW1zKSB7XHJcbiAgXHRpZiAoYWRkSXRlbXMpIHtcclxuICAgICAgaWYgKCEoYWRkSXRlbXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgICBhZGRJdGVtcyA9IFthZGRJdGVtc107XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgaT0wOyBpIDwgYWRkSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLml0ZW1zLnB1c2goYWRkSXRlbXNbaV0pO1xyXG4gICAgICAgIGFkZEl0ZW1zW2ldLnBhcmVudCA9IHRoaXM7ICAgICAgICBcclxuICAgICAgfVxyXG4gIFx0fVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgaXRlbSBmcm9tIHRoaXMgYm94IChmcm9tIHRoZSBkb20gYW5kIHRoZSBpdGVtcyBsaXN0KVxyXG4gIHJlbW92ZSAoaXRlbSkge1xyXG4gIFx0aWYgKGl0ZW0pIHtcclxuICBcdFx0dmFyIGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xyXG4gIFx0XHRpZiAoaW5kZXggPiAtMSkge1xyXG4gIFx0XHQgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIFx0XHRcdGl0ZW0uJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgXHRcdFx0aXRlbS5wYXJlbnQgPSBudWxsO1xyXG4gIFx0XHR9XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIG51bUVsZW1lbnRzICgpIHtcclxuICBcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnRCb3VuZHMgKCkge1xyXG4gICAgdmFyIGJvdW5kcyA9IHt4Ojk5OTk5OSwgeTo5OTk5OTksIGJvdHRvbTowLCByaWdodDowfTtcclxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA8IDEpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvcyA9IHRoaXMuaXRlbXNbaV0uZ2V0Qm91bmRpbmdCb3goKTtcclxuICAgICAgYm91bmRzLnggPSAocG9zLnggPCBib3VuZHMueCkgPyBwb3MueCA6IGJvdW5kcy54O1xyXG4gICAgICBib3VuZHMueSA9IChwb3MueSA8IGJvdW5kcy55KSA/IHBvcy55IDogYm91bmRzLnk7XHJcbiAgICAgIGJvdW5kcy5ib3R0b20gPSAocG9zLmJvdHRvbSA+IGJvdW5kcy5ib3R0b20pID8gcG9zLmJvdHRvbSA6IGJvdW5kcy5ib3R0b207XHJcbiAgICAgIGJvdW5kcy5yaWdodCA9IChwb3MucmlnaHQgPiBib3VuZHMucmlnaHQpID8gcG9zLnJpZ2h0IDogYm91bmRzLnJpZ2h0O1xyXG4gICAgfVxyXG4gICAgYm91bmRzLncgPSBib3VuZHMucmlnaHQgLSBib3VuZHMueDtcclxuICAgIGJvdW5kcy5oID0gYm91bmRzLmJvdHRvbSAtIGJvdW5kcy55O1xyXG4gICAgcmV0dXJuIGJvdW5kcztcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgXHRzdXBlci5yZW5kZXIoKTtcclxuICBcdGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICBcdFx0dGhpcy5pdGVtc1tpXS5yZW5kZXIoKTtcclxuICBcdH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCb3gpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb3g7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBDaXJjbGUgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHRleHQ6ICcnLFxyXG4gICAgICBsZWZ0OiAwLFxyXG4gICAgICB0b3A6IDAsXHJcbiAgICAgIHI6IDI1LFxyXG4gICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICBmb250U2l6ZTogJzI0cHgnLFxyXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgIGNvbG9yOiAnIzBmMCcsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxyXG4gICAgICBib3JkZXJDb2xvcjogJyNCQURBNTUnLFxyXG4gICAgICBib3JkZXJXaWR0aDogNVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHN1cGVyLmluaXQocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0NpcmNsZSc7XHJcbiAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cclxuICAgIC8vIGFwcGx5IGNpcmNsZSBjc3NcclxuICAgIHZhciBvZmZzZXQgPSBwcm9wcy5yICsgcHJvcHMuYm9yZGVyV2lkdGg7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgJ2xlZnQnOiAnJyArIChwcm9wcy5sZWZ0LW9mZnNldCkgKyAncHgnLFxyXG4gICAgICAgICd0b3AnOiAnJyArIChwcm9wcy50b3Atb2Zmc2V0KSArICdweCcsXHJcbiAgICAgICAgJ3dpZHRoJzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxyXG4gICAgICAgICdoZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2xpbmVIZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2JvcmRlcic6IHByb3BzLmJvcmRlcldpZHRoICsgJ3B4IHNvbGlkICcgKyBwcm9wcy5ib3JkZXJDb2xvcixcclxuICAgICAgICAnYm9yZGVyUmFkaXVzJzogJzEwMDAwcHgnLFxyXG4gICAgICAgICd0ZXh0QWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB0aGlzLnNldFRleHQodGhpcy50ZXh0KTtcclxuICB9XHJcblxyXG4gIHNldFRleHQgKHR4dCkge1xyXG4gICAgdGhpcy50ZXh0ID0gdHh0O1xyXG4gICAgdGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0eHQpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQ2lyY2xlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2lyY2xlO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdj48ZGl2IGlkPWN1YmUgY2xhc3M9c2hvdy1mcm9udD48ZmlndXJlIGNsYXNzPWZyb250PkY8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPWJhY2s+QjwvZmlndXJlPjxmaWd1cmUgY2xhc3M9cmlnaHQ+UjwvZmlndXJlPjxmaWd1cmUgY2xhc3M9bGVmdD5MPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz10b3A+VDwvZmlndXJlPjxmaWd1cmUgY2xhc3M9Ym90dG9tPkc8L2ZpZ3VyZT48L2Rpdj48L2Rpdj5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vKipcclxuICogIHcsIGgsIGRlcHRoXHJcbiAqL1xyXG5jbGFzcyBDdWJlIGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHR3OiA1MDAsXHJcblx0XHRcdGg6IDUwMCxcclxuXHRcdFx0ZDogNTAwXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcblx0XHR0aGlzLncgPSBwcm9wcy53O1xyXG5cdFx0dGhpcy5oID0gcHJvcHMuaDtcclxuXHRcdHRoaXMuZCA9IHByb3BzLmQ7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0N1YmUnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLnNldHVwQ3ViZSh0aGlzLiRlbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c2V0dXBDdWJlKCRlbCkge1xyXG5cdFx0dmFyICRjb250YWluZXIgID0gJGVsO1xyXG5cdFx0dmFyICRjdWJlICAgICAgID0gJGVsLmZpbmQoJyNjdWJlJyk7XHJcblx0XHR2YXIgJGZhY2VGcm9udCAgPSAkZWwuZmluZCgnI2N1YmUgLmZyb250ICcpO1xyXG5cdFx0dmFyICRmYWNlQmFjayAgID0gJGVsLmZpbmQoJyNjdWJlIC5iYWNrICAnKTtcclxuXHRcdHZhciAkZmFjZVJpZ2h0ICA9ICRlbC5maW5kKCcjY3ViZSAucmlnaHQgJyk7XHJcblx0XHR2YXIgJGZhY2VMZWZ0ICAgPSAkZWwuZmluZCgnI2N1YmUgLmxlZnQgICcpO1xyXG5cdFx0dmFyICRmYWNlVG9wICAgID0gJGVsLmZpbmQoJyNjdWJlIC50b3AgICAnKTtcclxuXHRcdHZhciAkZmFjZUJvdHRvbSA9ICRlbC5maW5kKCcjY3ViZSAuYm90dG9tJyk7XHJcblxyXG5cdFx0dmFyIGhhbGZIZWlnaHQgPSB0aGlzLmgvMjtcclxuXHRcdHZhciBoYWxmV2lkdGggPSB0aGlzLncvMjtcclxuXHRcdHZhciBoYWxmRGVwdGggPSB0aGlzLmQvMjtcclxuXHJcblx0XHQkY29udGFpbmVyLmNzcyh7XHJcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHRsZWZ0OiAnMHB4JyxcclxuXHRcdFx0dG9wOiAnMHB4JyxcclxuXHRcdFx0cGVyc3BlY3RpdmU6ICc2MDAwcHgnLFxyXG5cdFx0XHR6SW5kZXg6IDIwMDAwXHJcblx0XHR9KTtcclxuXHJcblx0XHQkY3ViZS5jc3Moe1xyXG5cdFx0XHR3aWR0aDogJzEwMCUnLFxyXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcclxuXHRcdFx0ekluZGV4OiAyMDAwMCxcclxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXHJcblx0XHRcdHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxyXG5cdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDFzJ1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VGcm9udCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAuMiknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUJhY2ssIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoICAwLCAgIDAsICAgMCwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VSaWdodCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsICAgMCwgIDU1LCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JywgXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWSggICA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJyAgLyogaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpICovXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlTGVmdCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgICAwLCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JywgXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWSggIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJyAgLyogaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpICovXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlVG9wLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgIDU1LCAyNTUsIC41KScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLCBcclxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAgIDkwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUJvdHRvbSwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsIDI1NSwgICAwLCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5kICsgJ3B4JywgXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkhlaWdodCArIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICsgJ3B4ICknXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNldHVwRmFjZSgkZmFjZSwgY3NzVmFscykge1xyXG5cdFx0dmFyIGRlZmF1bHRDU1MgPSB7XHJcblx0XHRcdGRpc3BsYXk6ICdibG9jaycsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHRsaW5lSGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHRmb250U2l6ZTogKHRoaXMuaC8zKSArJ3B4JyxcclxuXHRcdFx0Zm9udFdlaWdodDogJ2JvbGQnLFxyXG5cdFx0XHRjb2xvcjogJ3doaXRlJyxcclxuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xyXG5cdFx0fTtcclxuXHRcdCRmYWNlLmNzcygkLmV4dGVuZCh7fSwgZGVmYXVsdENTUywgY3NzVmFscykpO1xyXG5cdH1cclxuXHJcblx0aHRtbCAoKSB7XHJcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9DdWJlLmh0bWwnKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0Ly8gcmV0dXJuIHJlcXVpcmUoJy4vQ3ViZS5jc3MnKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQ3ViZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1YmU7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXHJcXG4uRGVtb0JveCB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICBtYXJnaW46IDIwcHg7XFxyXFxuICB3aWR0aDogMjAwcHg7IFxcclxcbiAgaGVpZ2h0OiAyMDBweDsgXFxyXFxuICBib3JkZXI6IDJweCBkYXNoZWQgI2VlZTtcXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xyXG5cclxuY2xhc3MgRGVtb0JveCBleHRlbmRzIEJveCB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHRzdXBlci5pbml0KHByb3BzKTtcclxuXHRcdHByb3BzLndpZHRoID0gcHJvcHMud2lkdGggfHwgMjAwO1xyXG5cdFx0cHJvcHMuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0IHx8IDIwMDtcclxuXHRcdHByb3BzLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRcdHRoaXMudHlwZSA9ICdEZW1vQm94JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNzcyAoKSB7XHJcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9EZW1vQm94LmNzcycpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhEZW1vQm94KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVtb0JveDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbi8vIExpa2UgVW5peCBwaXBlOiBvdXRwdXQgb2Ygb25lIGNvbW1hbmQgaXMgaW5wdXQgdG8gdGhlIG5leHRcclxuLy8gRWFjaCBmdW5jdGlvbiB0YWtlcyBhICdwcm9wcycgb2JqZWN0IGFzIGFyZ3VtZW50XHJcbi8vIEVhY2ggZnVuY3Rpb24gcmV0dXJucyBhbiBvYmplY3Qgd2l0aCByZXN1bHRzLCB3aGljaCBpcyBwYXNzZWQgYXMgcHJvcHMgdG8gdGhlIG5leHRcclxuLy8gRG8oKSByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgdGhlIERvIGNoYWluXHJcblxyXG4vLyBQLnB1bHNlLnNldFRvKFxyXG4vLyAgICAgRG8oUi5nZXRSYW5kb21OdW1iZXIsIHtmcm9tOjAsIHRvOjEwfSkgICAvLyByZXR1cm5zOiAge2RhdGE6IDh9XHJcbi8vICAgICAuRG8oQy5waWNrQ29sb3IpICAgIC8vIHJlYWRzIGlucHV0IDgsIHJldHVybnMge2RhdGE6ICcjY2ZmJ31cclxuLy8gICAgIC5EbyhCLmNoYW5nZUNvbG9yKSAgIC8vIHJlYWRzIGlucHV0ICcjY2ZmJywgY2hhbmdlcyBjb2xvciBvbiBCbGlua2VyXHJcbi8vICk7XHJcblxyXG5cclxuZnVuY3Rpb24gRG8oX2FGdW5jdGlvbiwgX3Byb3BzLCBfZmlyc3REbykge1xyXG4gICAgdmFyIGFGdW5jdGlvbiA9IF9hRnVuY3Rpb247XHJcbiAgICB2YXIgcHJvcHMgPSBfcHJvcHM7XHJcbiAgICB2YXIgZmlyc3REbyA9IF9maXJzdERvIHx8IGV4ZWN1dG9yO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdhZnVuY3Rpb249JywgYUZ1bmN0aW9uKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdwcm9wcz0nLCBwcm9wcyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZmlyc3REbz0nLCBmaXJzdERvKTtcclxuXHJcbiAgICAvLyBSdW4gdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cy5cclxuICAgIC8vIFBhc3MgdGhlIHJlc3VsdHMgdG8gdGhlIG5leHQgY2hhaW5lZCBmdW5jdGlvbiAoaWYgYW55KS5cclxuICAgIC8vIFJldHVybiByZXN1bHRzIG9mIHRoaXMgZnVuY3Rpb24gb3Igb2YgdGhlIGNoYWluXHJcbiAgICBmdW5jdGlvbiBleGVjdXRvciAocGlwZWRQcm9wcykge1xyXG4gICAgICAgIHZhciByZXR1cm5WYWwgPSBhRnVuY3Rpb24ocHJvcHMgfHwgcGlwZWRQcm9wcyk7XHJcbiAgICAgICAgcmV0dXJuIChleGVjdXRvci5uZXh0RG8gPyBleGVjdXRvci5uZXh0RG8ocmV0dXJuVmFsKSA6IHJldHVyblZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV0dXJuIHRoZSBsYXN0ICdEbycgaW4gdGhlIGNoYWluXHJcbiAgICBmdW5jdGlvbiBnZXRMYXN0RG8gKCkge1xyXG4gICAgICAgIHZhciB0bXBEbyA9IGZpcnN0RG87XHJcbiAgICAgICAgd2hpbGUgKHRtcERvLm5leHREbykgeyB0bXBEbyA9IHRtcERvLm5leHREbzsgfVxyXG4gICAgICAgIHJldHVybiB0bXBEbztcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgYSBuZXcgJ0RvJyB0byB0aGUgZW5kIG9mIHRoZSBjaGFpbi5cclxuICAgIGV4ZWN1dG9yLkRvID0gZnVuY3Rpb24gKGFGdW5jdGlvbiwgcHJvcHMpIHtcclxuICAgICAgICBnZXRMYXN0RG8oKS5uZXh0RG8gPSBEbyhhRnVuY3Rpb24sIHByb3BzLCBmaXJzdERvKTtcclxuICAgICAgICByZXR1cm4gZmlyc3REbzsgIC8vIEFsd2F5cyByZXR1cm4gdGhlIGZpcnN0ICdEbycgaW4gdGhlIGNoYWluXHJcbiAgICB9O1xyXG5cclxuICAgIGV4ZWN1dG9yLm5leHREbyA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIGV4ZWN1dG9yO1xyXG59XHJcblxyXG5UaGluZy5EbyA9IERvO1xyXG5cclxuLypcclxuLy8gY2hhaW5lZCwgZWFjaCBEbyBoYXMgaXRzIG93biBwYXJhbWV0ZXJzXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTt9LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCB7YXJnMjonaGVsbG8gdG8gMjIyMjInfSlcclxuXHJcbi8vIGNoYWluZWQsIHdpdGggZmlyc3QgRG8gcGlwaW5nIHJlc3VsdHMgdG8gc2Vjb25kIERvXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCBudWxsKVxyXG5cclxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpOyByZXR1cm4ge25ld1Byb3A6cHJvcHMucGlwZWRwcm9wKzJ9fSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAzJywgcHJvcHMpO30pXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERvO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLypcclxuICAgIHNyYzogPGZpbGUgcGF0aD5cclxuICAgIGNlbnRlcjogdHJ1ZXxmYWxzZVxyXG4gICAgc2l6ZTogY29udGFpbnxjb3ZlcnxzdHJldGNoXHJcbiovXHJcblxyXG5jbGFzcyBJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBwbGFjZWhvbGRlciA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBRElDQVlBQUFDdFdLNmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQlY5SlJFRlVlSnp0M2MxdTNVUWNoK0YvRUJLOUFzUUNWV2ZWUXE0Q2JoeHVBNEVxc1NtaCs3SXVpOVFDUXZJN1l4K1BQNTlIOGk2eVpvN216ZmdrbG4xWFZaOEtlTllYYXc4QXRrd2dFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnZURMRVQ5NzEyMFVzTHltTzBqc0lCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlNKzdWTlYzYXc5aVFmZFY5WHJ0UVd6VnA4YmpMQzVWOVh0VlBkUTVJcm12cWc5VjlhN09GVW56dWhmSVB5NzFHTWN3NTZOSE1zUXh6UGRNa1Foa3BFdjlONDZqUi9JMGpyTkZJcEFSTHZWOEhFZU41S1U0emhTSlFCcGRLc2R4dEVpdXhYR1dTQVRTNEZKdGNSd2xrdFk0emhDSlFLNjQxTGc0L2gzSjk0dVA5blpqNHpoNkpBSUpMalV0anIxR01qV09JMGNpa0JkYzZyWTQ5aGJKclhFY05SS0JQT05TODhTeGwwam1pdU9Ja1RUTitXeTNtcnlxcXE5bVBOODNWZlZUYlRPUys2cjZ1YXErbnZHY3J6NGZwM0ttSGFUcWNURS8xSHkvVmJlNGs4eTljM3lxcXZkVjlXYkpTWFRtRWlzNGNpVGlhQ09RSzQ0WWlUamFDYVJCajBqK3JIVWlFY2M0QW1sMGhFakVNWjVBUnRoekpPS1lSaUFqZlYrUGkzcFBrWWhqT29GTXNLZEllc1R4UjUwamppcUJUTGFIU01SeE80SGNZTXVSaUdNZUFybFJyMGp1YnhpVE9PWWprQmxzS1JKeHpFc2dNOWxDSk9LWW4wQm10R1lrNHVoRElETmJJeEp4OUNPUUR1NXJ1VWg2eGZGMmxrOWkvd1RTeVJLUmlLTS9nWFRVTXhKeExFTWduZldJNUVPSll5a0NXVUNQU01TeERJRXNaS3VSaUNNVHlJSjZmRzhRUjE4Q1dkaFdJbmtvY2JRUXlBcldqa1FjN1FTeWtyVWlFY2M0QWxuUjBwR0lZenlCckd5cFNNUXhqVUEyb0hjazRwaE9JQnZSS3hKeDNLYnBjejdiMDkyUDVtN3RBWnlCSGFTZkpTNng5dnpPeERXNXhGclprbC9TUlRLZVFGYTB4cDk1UlRLT1FGYXk1ajhLUmRKT0lDdll3cTBtSW1ramtJV3RIWWRJeGhISWdyWVNoMGphQ1dRaFc0dERKRzBFc29DdHhpR1M2d1RTV1k4NEhxclBpMFZGOG44QzZhaFhIRy9yY1RHTHBEK0JkTkl6am9GSStoTklCMHZFTVJCSlh3S1oyWkp4REVUU2owQm10RVljQTVIMElaQ1pyQm5IUUNUekU4Z010aERIUUNUekVzaU50dmlVZFpITVJ5QTMyR0ljQTVITVF5QVRiVG1PZ1VodUo1QUo5aERIUUNTM0VjaEllNHBqSUpMcEJETENIdU1ZaUdRYWdUVGFjeHdEa1l3bmtBWkhpR01na25FRWNrV3ZPTjRzT1lrblJOSk9JTUVSNHhpSXBJMUFYbkRrT0FZaXVVNGd6emhESElOZWtSemxpZkpOY3o3YjA5MC9majdtOGxCVlAxVFZyek9lY3k2L1ZOV1A5ZmlLNnJsOHJLcS9aanpmTHB4cEI2bXFlbDFWNytxNE84ZFRjKzBrdjFYVnR3dVB2U2VYV01HdGtld2xqc0d0a1J3dGppcUJYRFUxa3ZlMXJ6Z0dVeU01WWh4VkFta3lOcEs5eGpFWUc4bFI0NmdTU0xQV1NQWWV4NkExa2lQSFVTV1FVYTVGY3BRNEJ0Y2lPWG9jVlFJWjdhVklqaGJINEtWSXpoQkhsVUFtZVJySlVlTVlQSTNrTEhGVUNXU3lJWktqeHpFWUlqbFRIRlVDdWNuck9rY2NnN2QxcmppcUd0ZjlYYlV2ZmkrdDUwaWExdjNaN3NXQ1VRUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUhCWFZaL1dIZ1JzbFIwRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VncjhCaVFWenE5THYxT29BQUFBQVNVVk9SSzVDWUlJPSc7XHJcblxyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuICAgIHByb3BzLnNyYyA9IHByb3BzLnNyYyB8fCBwbGFjZWhvbGRlcjtcclxuICAgIC8vIHByb3BzLmJhY2tncm91bmQgPSAndXJsKFwiJyArIHByb3BzLnNyYyArICdcIikgbm8tcmVwZWF0ICcgKyAocHJvcHMuY2VudGVyID8gJ2NlbnRlcicgOiAnbGVmdCB0b3AnKTtcclxuICAgIC8vIHByb3BzLmJhY2tncm91bmRTaXplID0gKHByb3BzLnNpemUgPT09ICdjb250YWluJyB8fCBwcm9wcy5zaXplID09PSAnY292ZXInID8gcHJvcHMuc2l6ZSA6IChwcm9wcy5zaXplPT09J3N0cmV0Y2gnID8gJzEwMCUgMTAwJScgOiB1bmRlZmluZWQpICk7XHJcblxyXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xyXG5cclxuICAgIHRoaXMudHlwZSA9ICdJbWcnO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zcmMgPSBwcm9wcy5zcmM7XHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IHVuZGVmaW5lZDtcclxuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgdW5kZWZpbmVkO1xyXG4gICAgdGhpcy53ID0gcHJvcHMudyB8fCB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLmggPSBwcm9wcy5oIHx8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBJbWcubG9hZGluZyh0aGlzKTtcclxuICAgIGxvYWRJbWFnZShwcm9wcy5zcmMsIHRoaXMub25sb2FkLmJpbmQodGhpcyksIHRoaXMub25lcnJvci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBzdXBlci5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIG9ubG9hZCAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltYWdlIExvYWRlZDonLCBpbWcsIGltZy5zcmMsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gaW1nLmhlaWdodCAvIGltZy53aWR0aDsgIC8vIGFzcGVjdCByYXRpbyBvZiBvcmlnaW5hbCBpbWFnZVxyXG4gICAgdGhpcy53ID0gdGhpcy53IHx8IGltZy53aWR0aDtcclxuICAgIHRoaXMuaCA9IHRoaXMuaCB8fCAodGhpcy53ICogdGhpcy5hc3BlY3RSYXRpbyk7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgd2lkdGg6IHRoaXMudyxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaCxcclxuICAgICAgICBiYWNrZ3JvdW5kOiAndXJsKCcgK2ltZy5zcmMrICcpIG5vLXJlcGVhdCBjZW50ZXInLFxyXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xyXG4gICAgfSk7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgb25lcnJvciAoaW1nKSB7XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltZy5vbmVycm9yJywgaW1nLnNyYywgJ2ZhaWxlZCcpO1xyXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5lcnJvciA9IHRydWU7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0V2lkdGggKHcpIHtcclxuICAgIHRoaXMud2lkdGggPSB3O1xyXG4gICAgdGhpcy5oZWlnaHQgPSB3ICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxvYWRpbmcgKGltZykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwiSU1HLmxvYWRpbmcoKTpcIiwgaW1nLnNyYyk7XHJcbiAgICBJbWcucXVldWVkSW1ncyA9IEltZy5xdWV1ZWRJbWdzIHx8IFtdO1xyXG4gICAgaWYgKGltZyAmJiAhaW1nLmxvYWRlZCkge1xyXG4gICAgICAgIEltZy5xdWV1ZWRJbWdzLnB1c2goaW1nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBJbWcucXVldWVkSW1ncy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbG9hZGVkIChpbWcpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5sb2FkZWQoKTpcIiwgaW1nLnNyYywgSW1nLnF1ZXVlZEltZ3MubGVuZ3RoKTtcclxuICAgIEltZy5xdWV1ZWRJbWdzID0gSW1nLnF1ZXVlZEltZ3MgfHwgW107XHJcbiAgICBpZiAoaW1nICYmIGltZy5sb2FkZWQpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBJbWcucXVldWVkSW1ncy5pbmRleE9mKGltZyk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgSW1nLnF1ZXVlZEltZ3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEltZy5xdWV1ZWRJbWdzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBJbWcub25BbGxMb2FkZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gSW1nLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG9uQWxsTG9hZGVkICgpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5vbkFsbExvYWRlZCgpOiB0cmlnZ2VyZWRcIik7XHJcbiAgfVxyXG5cclxufVxyXG5UaGluZy5hZGRDbGFzcyhJbWcpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGxvYWRJbWFnZSAoc3JjLCBjYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xyXG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGVycm9yQ2FsbGJhY2sodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgaW1nLnNyYyA9IHNyYztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBMYWJlbCBleHRlbmRzIFRoaW5nIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuXHRcdFx0Zm9udEZhbWlseTogJ0NhbGlicmksIEFyaWFsLCBzYW5zLXNlcmlmJyxcclxuXHRcdFx0Zm9udFNpemU6ICcxNHB4JyxcclxuXHRcdFx0Y29sb3I6ICcjMDAwJ1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHRcdHRoaXMudHlwZSA9ICdMYWJlbCc7XHJcblx0XHR0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLnRleHQpO1xyXG5cdH1cclxuXHJcblx0c2V0VGV4dCAodHh0KSB7XHJcblx0XHR0aGlzLnRleHQgPSB0eHQ7XHJcblx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHR4dCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKExhYmVsKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXHJcXG4uTGluZSB7XFxyXFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXHJcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXHJcXG59XFxyXFxuXFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgTGluZSBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgLy8gZXhwZWN0aW5nIHByb3BzOiB7IHgxOjAsIHkxOjAsIHgyOjUwLCB5Mjo1MCB9XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgPSBwcm9wcyAmJiAocHJvcHMuYmFja2dyb3VuZENvbG9yIHx8IHByb3BzLmNvbG9yIHx8ICdibGFjaycpO1xyXG4gICAgc3VwZXIuaW5pdChwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnTGluZSc7XHJcbiAgICB0aGlzLmxlbmd0aCA9IDEwO1xyXG4gICAgdGhpcy53aWR0aCA9IDE7XHJcbiAgICB0aGlzLmFuZ2xlID0gMDtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3ModGhpcy50eXBlKTtcclxuICAgIHRoaXMuY3JlYXRlTGluZShwcm9wcy54MSwgcHJvcHMueTEsIHByb3BzLngyLCBwcm9wcy55MiwgcHJvcHMud2lkdGgsIHByb3BzLmFycm93LCBwcm9wcy5zaG9ydGVuKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUxpbmUgKHgxLHkxLCB4Mix5Miwgd2lkdGgsIGFycm93LCBzaG9ydGVuKSB7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgMjtcclxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5zcXJ0KCh4MS14MikqKHgxLXgyKSArICh5MS15MikqKHkxLXkyKSkgLSAoYXJyb3c/IHRoaXMud2lkdGgqMiA6IDApOyAgLy8gc2hvcnRlbiB0aGUgbGVuZ3RoIHRvIG1ha2Ugcm9vbSBmb3IgYXJyb3doZWFkXHJcbiAgICB0aGlzLmFuZ2xlICA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgdGhpcy5sZW5ndGggLT0gc2hvcnRlbiB8fCAwOyAgLy8gc2hvcnRlbiB0aGUgbGluZSBhIGJpdCAobWFrZXMgcm9vbSBmb3IgYXJyb3doZWFkKVxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgICdsZWZ0JzogJycgKyB4MSArICdweCcsXHJcbiAgICAgICAgJ3RvcCc6ICcnICsgKHkxLSh0aGlzLndpZHRoLzIpKSArICdweCcsXHJcbiAgICAgICAgJ3dpZHRoJzogJycgKyB0aGlzLmxlbmd0aCArICdweCcsXHJcbiAgICAgICAgJ2hlaWdodCc6ICcnICsgdGhpcy53aWR0aCArICdweCcsXHJcbiAgICAgICAgLy8gcm90YXRlIGFyb3VuZCBzdGFydCBwb2ludCBvZiBsaW5lXHJcbiAgICAgICAgJ3RyYW5zZm9ybS1vcmlnaW4nOiAnMCA1MCUnXHJcbiAgICAgIH0pO1xyXG4gICAgdGhpcy5yb3RhdGVUbyh0aGlzLmFuZ2xlKTtcclxuICAgIGlmIChhcnJvdykge1xyXG4gICAgICB0aGlzLmFkZEFycm93SGVhZCh0aGlzLmxlbmd0aCwgdGhpcy53aWR0aCwgdGhpcy53aWR0aCoyLCB0aGlzLnByb3BzLmJhY2tncm91bmRDb2xvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBsZW4gb2YgbGluZSwgd2lkdGggb2YgbGluZSwgc2l6ZSBvZiB0cmlhbmdsZSAoaWUuIDEwIHdpbGwgYmUgMTBweCB3aWRlIGFuZCAyMHB4IGhpZ2gpXHJcbiAgYWRkQXJyb3dIZWFkIChsZW4sIHdpZHRoLCBzaXplLCBjb2xvcikge1xyXG4gICAgdGhpcy5hcnJvd0hlYWQgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgdGhpcy5hcnJvd0hlYWQuY3NzKHtcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIHdpZHRoOiAwLCBcclxuICAgICAgaGVpZ2h0OiAwLCBcclxuICAgICAgZm9udFNpemU6IDAsXHJcbiAgICAgIGxpbmVIZWlnaHQ6IDAsXHJcbiAgICAgIGxlZnQ6IGxlbiArICdweCcsXHJcbiAgICAgIHRvcDogLShzaXplLSh3aWR0aC8yKSkgKyAncHgnLFxyXG4gICAgICBib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJUb3A6IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJMZWZ0OiBzaXplICsgJ3B4IHNvbGlkICcgKyBjb2xvclxyXG4gICAgfSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHRoaXMuYXJyb3dIZWFkKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gIFx0cmV0dXJuIHJlcXVpcmUoJy4vTGluZS5jc3MnKTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoTGluZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuUGF0dGVybi5HcmFwaFBhcGVyIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDM7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweCwgMjBweCAyMHB4LCAyMHB4IDIwcHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweCwgLTFweCAtMXB4LCAtMXB4IC0xcHg7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4zKSAxcHgsIHRyYW5zcGFyZW50IDFweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkdyaWQge1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweDtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5Tb2ZhRGFyayB7XFxyXFxuICBiYWNrZ3JvdW5kOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgMTAwJSA1MCUsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlNvZmEge1xcclxcbiAgYmFja2dyb3VuZDpcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCA5OSUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDYlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDElLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyMyUpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgNTAlIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSAxMDAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgOTYlLCA0JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlllbGxvd0NpcmNsZXNXaXRoVmlvbGV0IHtcXHJcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmQ2NzkgMTclLCAjM2Q1NDQzIDE3LjUlLCAjM2Q1NDQzIDE4LjIlLCAjM2NkYWRhIDE5JSwgIzZkZThlOCAyNCUsICNlZGNiZmIgMzAlLCB0cmFuc3BhcmVudCAzNiUpLCByYWRpYWwtZ3JhZGllbnQoIzNkYWJjNyAxMiUsICM0OWFiM2MgMTMuNSUsICMzODgyMmUgMTQlLCAjZmZkYjg5IDE0LjUlLCAjZmZkYjg5IDE5JSwgI2ZmZjU3YSAyMCUsICNmY2ZmYjUgMjglLCAjZmZmZWJkIDI5JSk7XFxyXFxuICAgIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxyXFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAlIDAlLCAxNyUgMTclO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5ZZWxsb3dDaXJjbGVzV2l0aFZpb2xldDIge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmRkOTAgMTclLCBibGFjayAxNy41JSwgYmxhY2sgMTguMiUsICMzY2RhZGEgMTklLCAjNmRlOGU4IDI0JSwgI2VkY2JmYiAzMCUsIHRyYW5zcGFyZW50IDM2JSksIHJhZGlhbC1ncmFkaWVudCgjM2NkYWRhIDE3JSwgZ3JheSAxNy41JSwgZ3JheSAxOCUsICNmZmRkOTAgMTklLCAjZmZkZDkwIDI0JSwgI2ZmZmY5MCAzMCUsICNmZmZmOTAgMzYlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSAwJSwgMTclIDE3JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uUG9sa2FEb3RzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSksXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDYwcHggNjBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMzBweCAzMHB4O1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG5cXHJcXG4uUGF0dGVybi5CbHVlQmFsbHMge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNhY2YgNzclLCByZ2JhKDg4LDk5LDI1NSwuODgpIDgwJSwgdHJhbnNwYXJlbnQgODMlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uU3RyaXBlcyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgyNTUsMjU1LDI1LDEpIDUwJSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uU3RyaXBlc1doaXRlUmVkR3JlZW4ge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTpcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MSUsICNmZmZmYzggNTElLCAjZmZmZmM4IDU5JSwgdHJhbnNwYXJlbnQgNTklKSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA0MyUsICNmMzMwNTQgNDMlLCAjZjMzMDU0IDY3JSwgdHJhbnNwYXJlbnQgNjclKSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjMDI5YjRmIDM0JSwgIzI2MjYyNiAzNCUsICMyNjI2MjYgNzUlLCAjMDI5YjRmIDc1JSk7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSwgMCUsIDAlO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxNSUsIDE1JSwgMTUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5QbGFpZFJlZCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBoc2woMCwgODYlLCAzNCUpO1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTpcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCh0cmFuc3BhcmVudCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDY2cHgsIHRyYW5zcGFyZW50IDY2cHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY5cHgsIHJnYmEoMCw2MCwwLC41KSAxNjlweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxODJweCwgcmdiYSgwLDYwLDAsLjUpIDE4MnB4LFxcclxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAyMzJweCwgdHJhbnNwYXJlbnQgMjMycHgpLFxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDI3MGRlZywgdHJhbnNwYXJlbnQsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgNTNweCwgdHJhbnNwYXJlbnQgNTNweCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2NnB4LCB0cmFuc3BhcmVudCA2NnB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2OXB4LCByZ2JhKDAsNjAsMCwuNSkgMTY5cHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTgycHgsIHJnYmEoMCw2MCwwLC41KSAxODJweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMjMycHgsIHRyYW5zcGFyZW50IDIzMnB4KSxcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgxMjVkZWcsIHRyYW5zcGFyZW50LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDJweCwgcmdiYSgwLDAsMCwuMikgMnB4LFxcclxcbiAgICAgIHJnYmEoMCwwLDAsLjIpIDNweCwgdHJhbnNwYXJlbnQgM3B4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDVweCwgcmdiYSgwLDAsMCwuMikgNXB4KTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uRGlhZ29uYWxTdHJpcGVzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg0NWRlZywgYmxhY2sgMjUlLCB0cmFuc3BhcmVudCAyNS4yNSUsIHRyYW5zcGFyZW50IDUwJSwgYmxhY2sgNTAuMjUlLCBibGFjayA3NSUsIHRyYW5zcGFyZW50IDc1LjI1JSwgdHJhbnNwYXJlbnQpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxNiUgMTYlOyAgLyogbXVzdCBtYXRjaCBhc3BlY3QgcmF0aW8gb2YgY29udGFpbmluZyBlbGVtZW50IG9yIGxpbmVzIHdpbGwgYnJlYWsgKi9cXHJcXG4gICAgICAgIC8qIGllLiAzMiUgMTYlIGZvciBhbiBlbGVtZW50IHdpdGggdz0xMDAgaD0yMDAgKi9cXHJcXG4gICAgICAgIC8qIFBvd2VycyBvZiAyIHdvcmsgYmVzdCAob3RoZXIgdmFsdWVzLCBsaWtlIDcgb3IgMjMsIG1ha2UgamFnZ3kgYWxpYXNpbmcpICovXFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkJsdWVDYXNjYWRlIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMjY4NzM7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoOTFkZWcsIHJnYmEoMjU1LDI1NSwyNSwwLjE3KSA1MCUsIHRyYW5zcGFyZW50IDUxLjUlKSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDg5ZGVnLCByZ2JhKDI1LDI1NSwyNTUsMC4yMykgNTAlLCB0cmFuc3BhcmVudCA1NC41JSksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MC41ZGVnLCB0cmFuc3BhcmVudCA1MCUsIHJnYmEoMjUyLCAyNTUsIDE2MiwgMC4zNykgNTQuNSUpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwLjc1JSwgcmVkIDUxJSwgcmVkIDUxLjUlLCB0cmFuc3BhcmVudCA1MS43NSUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiA1JSAxMDAlLCAzJSAxMDAlLCA5JSAxMDAlLCA4JSAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4gLypQZXJsaW4gTm9pc2UtaXNoIHJhZGlhbCBibHVycyovXFxyXFxuICAvKlJHQiovXFxyXFxuICAvKmJhY2tncm91bmQtaW1hZ2U6IHJhZGlhbC1ncmFkaWVudChyZ2JhKDI1NSwgNDIsIDAsIC41KSAxJSwgdHJhbnNwYXJlbnQgMjAwJSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDg2LCAyNTAsIDIsIC41KSAxJSwgdHJhbnNwYXJlbnQgMjAwJSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDAsIDcsIDI1NSwgMC42KSAxJSwgdHJhbnNwYXJlbnQgMTUwJSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE2MXB4LCAxMzRweCwgMTg4cHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtNTRweCwgNTdweCwgNTVweDtcXHJcXG4gICovXFxyXFxuXFxyXFxuICAvKk1vbm9jaHJvbWUgLSBiZXR0ZXIgYmx1cnMqL1xcclxcbi8qXFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuNTYpIDAlLCByZ2JhKDksIDEsIDExMiwgMC4yNSkgNDglLCByZ2JhKDksIDEsIDExMiwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMC4xMikgOTQlKSwgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjU2KSAwJSwgcmdiYSg5LCAxLCAxMTIsIDAuMjUpIDQ4JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTIpIDk0JSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC41NikgMCUsIHJnYmEoOSwgMSwgMTEyLCAwLjI1KSA0OCUsIHJnYmEoOSwgMSwgMTEyLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwLjEyKSA5NCUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxODhweCAzNDdweCwgMTcwcHgsIDIwOXB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTU0cHgsIDU3cHgsIDU1cHg7XFxyXFxuKi9cXHJcXG5cXHJcXG4uUGF0dGVybi5HcmVlbk92YWxzWHJheSB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTMxYzBjO1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChyZ2JhKDE4LCAwLCAyNTUsIDApIDAlLCByZ2JhKDMsIDE3OSwgMjU1LCAwLjA5KSA0OCUsIHJnYmEoMTk5LCAyMzcsIDQ0LCAwLjE5KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwKSA5NCUpLCBcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwKSAwJSwgcmdiYSgyMDUsIDAsIDAsIDAuMDcpIDQ4JSwgcmdiYSgyNTQsIDIwNCwgMCwgMC4xMSkgNjUlLCByZ2JhKDI1NSwgMjEwLCA4LCAwKSA5NCUpLCBcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjAxKSAwJSwgcmdiYSg4NSwgMjU1LCA1OSwgMC4wOCkgNDglLCByZ2JhKDE3NCwgMjAyLCAwLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwKSA5NCUpO1xcclxcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDE4OHB4IDM0N3B4LCAxNzBweCwgMjA5cHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtNTRweCwgNTdweCwgNTVweDtcXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgUGF0dGVybiBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIGxlZnQ6ICcwcHgnLFxyXG4gICAgICB0b3A6ICcwcHgnLFxyXG4gICAgICBjb2xvcjogJyNkZGQnLFxyXG4gICAgICBwYXR0ZXJuOiAnR3JhcGhQYXBlcicsXHJcbiAgICAgIGNlbGxXaWR0aDogMTAwLFxyXG4gICAgICBjZWxsSGVpZ2h0OiAxMDAsXHJcbiAgICAgIGxpbmVXaWR0aDogMlxyXG4gICAgfTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnUGF0dGVybic7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHByb3BzLnBhdHRlcm4pO1xyXG4gICAgaWYgKHByb3BzLnBhdHRlcm4gPT09ICdncmlkJykge1xyXG4gICAgICB0aGlzLmNzcyggUGF0dGVybi5tYWtlR3JpZENTUyhwcm9wcy5jZWxsV2lkdGgsIHByb3BzLmNlbGxXaWR0aCwgcHJvcHMubGluZVdpZHRoKSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIC8vIHJlbmRlciBmaXJzdCwgdGhpcyB3aWxsIHNldCBhIHBhcmVudCBlbGVtZW50XHJcbiAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIC8vIHRoZW4gYWRqdXN0IHBhdHRlcm4gdG8gZmlsbCBwYXJlbnQgd2l0aCBhIHNxdWFyZSBhc3BlY3QgcmF0aW9cclxuICAgIHZhciBzaXplID0gTWF0aC5tYXgodGhpcy5wYXJlbnQuJGVsZW1lbnQud2lkdGgoKSwgdGhpcy5wYXJlbnQuJGVsZW1lbnQuaGVpZ2h0KCkpO1xyXG4gICAgdGhpcy5jc3Moe3dpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VHcmlkQ1NTIChjZWxsV2lkdGgsIGNlbGxIZWlnaHQsIGxpbmVXaWR0aCkge1xyXG4gICAgdmFyIHByb3BzID0ge307XHJcbiAgICB2YXIgcG9zID0gJy0nICsgbGluZVdpZHRoICsgJ3B4JztcclxuICAgIHByb3BzLmJhY2tncm91bmRTaXplID0gJycgKyBjZWxsV2lkdGggKyAncHggJyArIGNlbGxIZWlnaHQgKyAncHgsICcgKyBjZWxsV2lkdGggKyAncHggJyArIGNlbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgcHJvcHMuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zICsgJyAnICsgcG9zICsgJywnICsgcG9zICsgJyAnICsgcG9zO1xyXG4gICAgcHJvcHMuYmFja2dyb3VuZEltYWdlID1cclxuICAgICAgJ2xpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAnICtsaW5lV2lkdGgrICdweCwgdHJhbnNwYXJlbnQgJyArbGluZVdpZHRoKyAncHgpLCcgK1xyXG4gICAgICAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC41KSAnICtsaW5lV2lkdGgrICdweCwgdHJhbnNwYXJlbnQgJyArbGluZVdpZHRoKyAncHgpJztcclxuICAgIHJldHVybiBwcm9wcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gICAgcmV0dXJuIHJlcXVpcmUoJy4vUGF0dGVybi5jc3MnKTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUGF0dGVybik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhdHRlcm47XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcbnZhciBUaW1lciA9IHJlcXVpcmUoJy4uL1RpbWVyL1RpbWVyLmpzJyk7XHJcblxyXG5cclxuY2xhc3MgUHVsc2FyIGV4dGVuZHMgQWN0aW9uIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHRoaXMuY2FsbGJhY2sgPSBwcm9wcy5jYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcclxuXHRcdHRoaXMuZGVsYXkgPSBwcm9wcy5kZWxheSB8fCAxMDAwO1xyXG5cdFx0dGhpcy5UID0gVGltZXIubWFrZSh7Y2FsbGJhY2s6IHRoaXMudHJpZ2dlci5iaW5kKHRoaXMpLCBkZWxheTogdGhpcy5kZWxheX0pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHR0aGlzLlQuZ28oKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHR0aGlzLlQuc3RvcCgpO1xyXG5cdH1cclxuXHJcblx0dHJpZ2dlciAoKSB7XHJcblx0XHR0aGlzLmNhbGxiYWNrKCk7XHJcblx0XHR0aGlzLlQuZ28oKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUHVsc2FyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHVsc2FyO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxudmFyIFBJID0gMy4xNDE1OTI2NTM1OTtcclxudmFyIEhBTEZQSSA9IFBJLzIuMDtcclxuXHJcbmNsYXNzIFJhbmQge1xyXG5cdHN0YXRpYyByYW5kSXRlbShhcnIpIHtcclxuXHRcdGlmIChhcnIgJiYgYXJyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIGFyclsgUmFuZC5yYW5kSW50KDAsIGFyci5sZW5ndGgtMSkgXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGluY2x1ZGVkKVxyXG5cdC8vIFVzaW5nIE1hdGgucm91bmQoKSB3aWxsIGdpdmUgeW91IGEgbm9uLXVuaWZvcm0gZGlzdHJpYnV0aW9uIVxyXG5cdHN0YXRpYyByYW5kSW50KG1pbiwgbWF4KSB7XHJcblx0XHRtaW4gPSBNYXRoLmNlaWwobWlufHwwKTtcclxuXHRcdG1heCA9IE1hdGguZmxvb3IobWF4fHwxKTtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gMCBhbmQgLjk5OTk5OVxyXG5cdHN0YXRpYyByYW5kRmxvYXQoKSB7XHJcblx0ICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIHJhbmRQZXJjZW50KHRocmVzaG9sZCkge1xyXG5cdFx0cmV0dXJuIFJhbmQucmFuZEludCgxLDEwMCkgPCB0aHJlc2hvbGQ7XHJcblx0fVxyXG5cclxuXHQvLyByYW5kb20gaW50ZWdlciB3aXRoaW4gbWF4RGlzdGFuY2Ugb2YgdGFyZ2V0IChkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIHRhcmdldClcclxuXHRzdGF0aWMgcmFuZENsb3NlVG8odGFyZ2V0LCBtYXhEaXN0YW5jZSkge1xyXG5cdFx0Ly8gcmV0dXJuIHRhcmdldCArIChtYXhEaXN0YW5jZSAqIHJhbmROb3JtYWwoKSk7ICAgIC8vIGNvbmNlbnRyYXRlZCB0b3dhcmRzIGNlbnRlciA1MCUgb2YgcmFuZ2VcclxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kU2luMigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHNvbWV3aGF0IGNvbmNlbnRyYXRlZCB0b3dhcmRzIGNlbnRlciBcclxuXHRcdHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiBSYW5kLnJhbmRQb3cyKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgd2l0aCBzaGFycCBjb25jZW50cmF0aW9uIGFyb3VuZCBjZW50ZXJcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdygpIHtcclxuXHRcdHJldHVybiBNYXRoLnBvdygxLjAgLSBSYW5kLnJhbmRGbG9hdCgpLCA0KTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIHRvd2FyZCAxXHJcblx0c3RhdGljIHJhbmRTaW4oKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5zaW4oUmFuZC5yYW5kRmxvYXQoKSAqIEhBTEZQSSk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgZXhwb25lbnRpYWxseSBjbG9zZXIgdG8gMFxyXG5cdHN0YXRpYyByYW5kUG93MigpIHtcclxuXHRcdHJldHVybiBSYW5kLnJhbmRQb3coKSAtIFJhbmQucmFuZFBvdygpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgMFxyXG5cdHN0YXRpYyByYW5kTm9ybWFsKCkge1xyXG5cdFx0cmV0dXJuICgoUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpKSAtIDMuMCkgLyAzLjA7XHJcblx0fVxyXG5cclxuICAgIC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBjbG9zZXIgdG8gMFxyXG4gICAgc3RhdGljIHJhbmRTaW4yKCkge1xyXG4gICAgICAgIHJldHVybiBSYW5kLnJhbmRTaW4oKSAtIFJhbmQucmFuZFNpbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybiBhcnJheSBvZiAzIGludHMsIGVhY2ggMC0yNTVcclxuICAgIHN0YXRpYyByYW5kUkdCKCkge1xyXG4gICAgICAgIHJldHVybiBbUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KV07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJhbmRSR0JzdHIoKSB7XHJcblx0XHR2YXIgcmdiID0gUmFuZC5yYW5kUkdCKCk7XHJcbiAgICAgICAgcmV0dXJuICdyZ2JhKCcgK3JnYlswXSsgJywnICtyZ2JbMV0rICcsJyArcmdiWzJdKyAnLCAuOSknO1xyXG4gICAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFJhbmQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSYW5kO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xyXG5cclxuLyoqXHJcbiAqICB3LCBoLCBkZXB0aFxyXG4gKi9cclxuY2xhc3MgUm9vbSBleHRlbmRzIEJveCB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdHc6IDE1MDAsXHJcblx0XHRcdGg6IDEwMDAsXHJcblx0XHRcdGQ6ICA4MDAsXHJcblx0XHRcdGJvcmRlcjogJzFweCBzb2xpZCBibGFjaycsXHJcblx0XHRcdHBlcnNwZWN0aXZlOiAnaW5oZXJpdCcgIC8vICc4MDAwcHgnXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcblx0XHR0aGlzLncgPSBwcm9wcy53O1xyXG5cdFx0dGhpcy5oID0gcHJvcHMuaDtcclxuXHRcdHRoaXMuZCA9IHByb3BzLmQ7XHJcblx0XHR0aGlzLndhbGxzID0ge307XHJcblxyXG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XHJcblx0XHQvLyB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cclxuXHRcdHRoaXMudHlwZSA9ICdSb29tJztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy5tYWtlUm9vbSh0aGlzLiRlbGVtZW50KTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0bWFrZVJvb20oKSB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXM7XHJcblx0XHR2YXIgd2FsbHMgPSBbXTtcclxuXHRcdHZhciBoYWxmSGVpZ2h0ID0gdGhpcy5oLzI7XHJcblx0XHR2YXIgaGFsZldpZHRoID0gdGhpcy53LzI7XHJcblx0XHR2YXIgaGFsZkRlcHRoID0gdGhpcy5kLzI7XHJcblxyXG5cdFx0dmFyIHdyYXBwZXIgPSBCb3gubWFrZSh7XHJcblx0XHRcdHdpZHRoOiAnMTAwJScsXHJcblx0XHRcdGhlaWdodDogJzEwMCUnLFxyXG5cdFx0XHR6SW5kZXg6IDIwMDAwLFxyXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuXHRcdFx0dHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCcsXHJcblx0XHRcdHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMXMnXHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBJbm5lciBmYWNpbmcgd2FsbHNcclxuXHRcdC8vIHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2Zyb250Jywge1xyXG5cdFx0Ly8gXHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKScsXHJcblx0XHQvLyBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0Ly8gXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHQvLyBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkRlcHRoKSArICdweCApJ1xyXG5cdFx0Ly8gfSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2JhY2snLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ3JpZ2h0Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDAsIDU1LCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2xlZnQnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ3RvcCcsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgNTUsIDI1NSwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZkhlaWdodCAtIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2JvdHRvbScsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMjU1LCAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDg5ZGVnICkgdHJhbnNsYXRlWiggJyArICgtKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblxyXG5cdFx0Ly8gT3V0ZXIgZmFjaW5nIHdhbGxzXHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRmcm9udCcsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVaKCAnICsgKGhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRiYWNrJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgwLCAwLCAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIC0xODBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0cmlnaHQnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDEwMCwgMTAwLCAxMDAsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWSggOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKChoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dGxlZnQnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDEwMCwgMTAwLCAxMDAsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWSggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmV2lkdGggLSAoaGFsZldpZHRoLWhhbGZEZXB0aCkpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0dG9wJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDEwMCwgMjAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dGJvdHRvbScsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAyMDAsIDEwMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHJcblx0XHQvLyBjb3B5IHdhbGxzIGFycmF5IHRvIG9iamVjdFxyXG5cdFx0Zm9yICh2YXIgaT0wOyBpIDwgd2FsbHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy53YWxsc1sgd2FsbHNbaV0ud2hpY2ggXSA9IHdhbGxzW2ldO1xyXG5cdFx0fVxyXG5cclxuXHRcdHdyYXBwZXIuYWRkKHdhbGxzKTtcclxuXHRcdHJvb20uYWRkKHdyYXBwZXIpO1xyXG5cdH1cclxuXHJcblx0bWFrZVdhbGwod2hpY2gsIGNzc1ZhbHMpIHtcclxuXHRcdHZhciBkZWZhdWx0Q1NTID0ge1xyXG5cdFx0XHRkaXNwbGF5OiAnYmxvY2snLFxyXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuXHRcdFx0Ly8gbGluZUhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0Ly8gZm9udFNpemU6ICh0aGlzLmgvMykgKydweCcsXHJcblx0XHRcdC8vIGZvbnRXZWlnaHQ6ICdib2xkJyxcclxuXHRcdFx0Ly8gdGV4dEFsaWduOiAnY2VudGVyJyxcclxuXHRcdFx0Ly8gY29sb3I6ICd3aGl0ZScsXHJcblx0XHRcdGJhY2tmYWNlVmlzaWJpbGl0eTogJ2hpZGRlbidcclxuXHRcdH07XHJcblx0XHR2YXIgd2FsbCA9IFRoaW5nLmNsYXNzZXMuQm94Lm1ha2UoJC5leHRlbmQoe30sIGRlZmF1bHRDU1MsIGNzc1ZhbHMpKTtcclxuXHRcdHdhbGwuJGVsZW1lbnQuYWRkQ2xhc3MoJ3dhbGwnKTtcclxuXHRcdHdhbGwuJGVsZW1lbnQuYWRkQ2xhc3Mod2hpY2gpO1xyXG5cdFx0Ly8gd2FsbC4kZWxlbWVudC5hcHBlbmQod2hpY2gpO1xyXG5cdFx0d2FsbC53aGljaCA9IHdoaWNoO1xyXG5cdFx0cmV0dXJuIHdhbGw7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3NzICgpIHtcclxuXHRcdC8vIHJldHVybiByZXF1aXJlKCcuL1Jvb20uY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFJvb20pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSb29tO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgVGV4dFBhbmUgZXh0ZW5kcyBUaGluZyB7XHJcbiAgICBpbml0IChwcm9wcykge1xyXG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBWZXJkYW5hLCBBcmlhbCwgc2Fucy1zZXJpZicsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMjRweCcsXHJcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgICAgICAgICBjb2xvcjogJ3JnYigyMDAsIDIwMCwgMjAwKScsXHJcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgdzogMTAwLFxyXG4gICAgICAgICAgICBoOiAxMDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgICAgIHN1cGVyLmluaXQocHJvcHMpO1xyXG4gICAgICAgIHRoaXMudHlwZSA9ICdUZXh0UGFuZSc7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuICAgIH1cclxuXHJcbiAgICBmaWxsVGV4dCAoKSB7XHJcbiAgICAgICAgdmFyIG1heEhlaWdodCA9IHRoaXMuJGVsZW1lbnQuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIG1heCA9IDEwMDA7XHJcbiAgICAgICAgdmFyICRzcGFuID0gJCgnPHNwYW4+PC9zcGFuPicpO1xyXG4gICAgICAgIHZhciBzcGFuSGVpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgLy8gZWxlbWVudCBoYXMgdG8gYmUgYXBwZW5kZWQgdG8gYm9keSBwcmlvciwgb3Igc3BhbkhlaWdodCB3aWxsIGJlIDBcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmFwcGVuZCgkc3Bhbik7XHJcbiAgICAgICAgd2hpbGUgKHNwYW5IZWlnaHQgPCBtYXhIZWlnaHQgJiYgbWF4LS0gPiAwKSB7XHJcbiAgICAgICAgICAgICRzcGFuLmFwcGVuZCh0aGlzLnRleHQpO1xyXG4gICAgICAgICAgICBzcGFuSGVpZ2h0ID0gJHNwYW4uaGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlciAoKSB7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5maWxsVGV4dCh0aGlzLnRleHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5UaGluZy5hZGRDbGFzcyhUZXh0UGFuZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRQYW5lO1xyXG4iLCJ2YXIgZWxlbWVudENvdW50ZXIgPSAwO1xyXG5cclxuY2xhc3MgVGhpbmcge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnVGhpbmcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZSAocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICAvLyBDU1MgcHJvcHMgZ28gaW50byB0aGlzLnByb3BzXHJcbiAgICB0aGlzLnByb3BzID0gVGhpbmcuY2xlYW51cChwcm9wcyk7XHJcbiAgICAvLyBrZWVwIHRoZXNlIHByb3BlcnRpZXMgb24gJ3RoaXMnXHJcbiAgICB0aGlzLnJvdGF0aW9uID0gcHJvcHMucm90YXRlIHx8IDA7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gcHJvcHMuc2NhbGUgfHwgMTtcclxuICAgIHRoaXMueCA9IHByb3BzLnggfHwgMDtcclxuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgMDtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgcGFyZW50RWxlbWVudC5hcHBlbmQodGhpcy4kZWxlbWVudCk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh0aGlzLnByb3BzKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIGVsZW1lbnQgZnJvbSBkb20gYW5kIG51bGwgaXQgb3V0XHJcbiAgdW5SZW5kZXIgKCkge1xyXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQpIHtcclxuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgdGhpcy4kZWxlbWVudCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXREaW1lbnNpb25zICgpIHtcclxuICAgIHJldHVybiB7dzogdGhpcy4kZWxlbWVudC53aWR0aCgpLCBoOiB0aGlzLiRlbGVtZW50LmhlaWdodCgpfTtcclxuICB9XHJcblxyXG4gIGdldEJvdW5kaW5nQm94ICgpIHtcclxuICAgIC8vIHJlbGF0aXZlIHRvIHBhZ2VcclxuICAgIHZhciBzY3JvbGx0b3AgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcclxuICAgIHZhciBzY3JvbGxsZWZ0ID0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpO1xyXG4gICAgdmFyIGJvdW5kcyA9IHRoaXMuJGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiBib3VuZHMubGVmdCtzY3JvbGxsZWZ0LFxyXG4gICAgICB5OiBib3VuZHMudG9wK3Njcm9sbHRvcCxcclxuICAgICAgdzogYm91bmRzLndpZHRoLFxyXG4gICAgICBoOiBib3VuZHMuaGVpZ2h0LFxyXG4gICAgICBib3R0b206IGJvdW5kcy5ib3R0b20rc2Nyb2xsdG9wLFxyXG4gICAgICByaWdodDogYm91bmRzLnJpZ2h0K3Njcm9sbGxlZnRcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRQb3NpdGlvbiAoKSB7XHJcbiAgICAvLyByZWxhdGl2ZSB0byBwYWdlXHJcbiAgICB2YXIgeHkgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpO1xyXG4gICAgdmFyIHogPSB0aGlzLiRlbGVtZW50LmNzcygnei1pbmRleCcpO1xyXG4gICAgeiA9IHogPyBwYXJzZUludCh6KSA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiBbeHkubGVmdCwgeHkudG9wLCB6XTtcclxuICB9XHJcblxyXG4gIC8vIHJldHVybiB0aGUgZWxlbWVudCdzIENTUyB0cmFuc2Zvcm0gbWF0cml4IGFzIGFycmF5IG9mIDYgdmFsdWVzXHJcbiAgZ2V0Q1NTVHJhbnNmb3JtICgpIHtcclxuICAgIHZhciBtU3RyID0gdGhpcy4kZWxlbWVudC5jc3MoJ3RyYW5zZm9ybScpLm1hdGNoKC8tP1tcXGRcXC5dKy9nKTtcclxuICAgIHZhciBtVmFsID0gW107XHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBtU3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG1WYWxbaV0gPSBwYXJzZUZsb2F0KG1TdHJbaV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1WYWw7ICBcclxuICB9XHJcblxyXG4gIHJvdGF0ZSAoZGVncmVlcykge1xyXG4gICAgdGhpcy5yb3RhdGlvbiArPSBkZWdyZWVzO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlVG8gKGFuZ2xlKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uID0gYW5nbGU7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzY2FsZSAoZmFjdG9yKSB7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yICs9IGZhY3RvcjtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNjYWxlVG8gKGZhY3Rvcikge1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IGZhY3RvcjtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHRyYW5zbGF0ZSAoeCwgeSkge1xyXG4gICAgdGhpcy54ICs9IHg7XHJcbiAgICB0aGlzLnkgKz0geTtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHRyYW5zbGF0ZVRvICh4LCB5KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHRyYW5zZm9ybSAoKSB7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgIHRyYW5zZm9ybTogVGhpbmcubWFrZVRyYW5zZm9ybUNTUyh0aGlzLnJvdGF0aW9uLCB0aGlzLnNjYWxlRmFjdG9yLCB0aGlzLngsIHRoaXMueSlcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBjc3MgKHByb3BzKSB7XHJcbiAgICB0aGlzLnByb3BzID0gJC5leHRlbmQodGhpcy5wcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3MocHJvcHMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBodG1sICgpIHtcclxuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNzcyAoKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlICgpIHtcclxuICAgIHZhciBjbHMgPSB0aGlzO1xyXG4gICAgdmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xyXG4gICAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcclxuICAgIHJldHVybiBpbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDbGFzcyAoY2xzKSB7XHJcbiAgICBUaGluZy5jbGFzc2VzID0gVGhpbmcuY2xhc3NlcyB8fCB7fTtcclxuICAgIFRoaW5nLmNsYXNzZXNbY2xzLm5hbWVdID0gY2xzO1xyXG5cclxuICAgIC8vIGxvYWQgdGhlIGNsYXNzIHN0eWxlcyAodGhlc2UgYXJlIGluY2x1ZGVkIGluIHRoZSBidW5kbGUgYXQgYnVpbGQgdGltZSlcclxuICAgIGNscy5jc3MgJiYgVGhpbmcuYWRkQ1NTU3RyaW5nKGNscy5jc3MoKSwgY2xzLm5hbWUpO1xyXG5cclxuICAgIC8vIGFkZCBhZGRpdGlvbmFsIGNzcyBmaWxlIGF0IGxvYWQgdGltZVxyXG4gICAgVGhpbmcuYWRkQ1NTRmlsZShjbHMubmFtZSArICcvJyArIGNscy5uYW1lICsgJy5jc3MnLCAnY3NzJytjbHMubmFtZSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0Q2xhc3MgKG5hbWUpIHtcclxuICAgIHJldHVybiBUaGluZy5jbGFzc2VzW25hbWVdO1xyXG4gIH1cclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyBDU1MgbWFuYWdlbWVudCBmdW5jdGlvbnNcclxuXHJcbiAgc3RhdGljIG1ha2VTdHlsZXMgKHByb3BzKSB7XHJcbiAgICB2YXIgc3R5bGVzID0gcHJvcHMgfHwge307XHJcbiAgICAkLmV4dGVuZChzdHlsZXMsIHtcclxuICAgICAgLy8gbGVmdDogcHJvcHMubGVmdCB8fCAocHJvcHMueCAmJiAocHJvcHMueCArIFwicHhcIikpLFxyXG4gICAgICAvLyB0b3A6IHByb3BzLnRvcCB8fCAocHJvcHMueSAmJiAocHJvcHMueSArIFwicHhcIikpLFxyXG4gICAgICB3aWR0aDogcHJvcHMud2lkdGggfHwgKHByb3BzLncgJiYgKHByb3BzLncgKyBcInB4XCIpKSxcclxuICAgICAgaGVpZ2h0OiBwcm9wcy5oZWlnaHQgfHwgKHByb3BzLmggJiYgKHByb3BzLmggKyBcInB4XCIpKSxcclxuICAgICAgekluZGV4OiBwcm9wcy56SW5kZXggfHwgcHJvcHMueixcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgIHRyYW5zZm9ybTogcHJvcHMudHJhbnNmb3JtIHx8IChUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHByb3BzLnJvdGF0ZSwgcHJvcHMuc2NhbGUsIHByb3BzLngsIHByb3BzLnkpKSxcclxuICAgICAgcG9zaXRpb246IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSdcclxuICAgIH0pO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5yb3RhdGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLnNjYWxlO1xyXG4gICAgZGVsZXRlIHN0eWxlcy54O1xyXG4gICAgZGVsZXRlIHN0eWxlcy55O1xyXG4gICAgZGVsZXRlIHN0eWxlcy56O1xyXG4gICAgZGVsZXRlIHN0eWxlcy53O1xyXG4gICAgZGVsZXRlIHN0eWxlcy5oO1xyXG4gICAgcmV0dXJuIHN0eWxlcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlVHJhbnNmb3JtQ1NTIChyb3RhdGUsIHNjYWxlLCB0eCwgdHkpIHtcclxuICAgIHZhciB0cmFuc2Zvcm0gPSAnJztcclxuICAgIHRyYW5zZm9ybSArPSAodHggfHwgdHkpID8gKFRoaW5nLm1ha2VUcmFuc2xhdGVDU1ModHgsIHR5KSArICcgJykgOiAnJztcclxuICAgIHRyYW5zZm9ybSArPSBUaGluZy5pc051bWVyaWMocm90YXRlKSA/IChUaGluZy5tYWtlQW5nbGVDU1Mocm90YXRlKSArICcgJykgOiAnJztcclxuICAgIHRyYW5zZm9ybSArPSBzY2FsZSA/IChUaGluZy5tYWtlU2NhbGVDU1Moc2NhbGUpICsgJyAnKSA6ICcnO1xyXG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlQW5nbGVDU1MgKGFuZ2xlKSB7XHJcbiAgICByZXR1cm4gJ3JvdGF0ZSgnK2FuZ2xlKydkZWcpJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlU2NhbGVDU1MgKHNjYWxlKSB7XHJcbiAgICByZXR1cm4gJ3NjYWxlKCcrc2NhbGUrJyknO1xyXG4gIH1cclxuXHJcbiAgLy8gTk9URTogdHJhbnNsYXRpb24gY29vcmRzIGFyZSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCdzIHBvc2l0aW9uIGluIHRoZSBkb2N1bWVudCBmbG93LlxyXG4gIC8vIFRoZXkgYXJlIG5vdCB0aGUgc2FtZSBhcyBzZXR0aW5nIGxlZnQvdG9wIHZhbHVlcywgd2hpY2ggYXJlIGFic29sdXRlIGNvb3JkaW5hdGVzXHJcbiAgLy8gcmVsYXRpdmUgdG8gdGhlIHBhcmVudCBlbGVtZW50LlxyXG4gIHN0YXRpYyBtYWtlVHJhbnNsYXRlQ1NTICh4LCB5KSB7XHJcbiAgICB4ID0geCB8fCAnMCc7XHJcbiAgICB5ID0geSB8fCAnMCc7XHJcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnKyB4ICsgJ3B4LCAnICsgeSArJ3B4KSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUVsZW1lbnQgKGh0bWwsIHByb3BzLCB0eXBlKSB7XHJcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGh0bWwpXHJcbiAgICAgIC5jc3MoVGhpbmcubWFrZVN0eWxlcyhwcm9wcykpXHJcbiAgICAgIC5hZGRDbGFzcyh0eXBlIHx8ICdyYW5kb20nKVxyXG4gICAgICAuYXR0cignaWQnLCAodHlwZSB8fCAncmFuZG9tJykgKyAoKytlbGVtZW50Q291bnRlcikpO1xyXG4gICAgcmV0dXJuICRlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGlzTnVtZXJpYyhuKSB7XHJcbiAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xyXG4gIH1cclxuXHJcbiAgLy8gTWFrZSBzdXJlIG5lY2Vzc2FyeSBDU1MgcHJvcGVydGllcyBhcmUgcHJlc2VudCBvciBkZWZhdWx0ZWQgdG8gc29tZXRoaW5nIHNhbmVcclxuICBzdGF0aWMgY2xlYW51cCAocHJvcHMpIHtcclxuICAgIHZhciBjcCA9IHByb3BzIHx8IHt9O1xyXG4gICAgY3AucG9zaXRpb24gPSBwcm9wcy5wb3NpdGlvbiB8fCAnYWJzb2x1dGUnOyAgIC8vIGRlZmF1bHQgdG8gYWJzb2x1dGUgcG9zaXRpb25pbmdcclxuICAgIC8vIGNwLnggPSBwcm9wcy54IHx8IHByb3BzLmxlZnQgfHwgMDtcclxuICAgIC8vIGNwLnkgPSBwcm9wcy55IHx8IHByb3BzLnRvcCB8fCAwO1xyXG4gICAgLy8gY3AueiA9IHByb3BzLnogfHwgcHJvcHMuekluZGV4O1xyXG4gICAgLy8gY3AudyA9IHByb3BzLncgfHwgcHJvcHMud2lkdGg7XHJcbiAgICAvLyBjcC5oID0gcHJvcHMuaCB8fCBwcm9wcy5oZWlnaHQ7XHJcbiAgICBjcC5yb3RhdGlvbiA9IHByb3BzLnJvdGF0aW9uIHx8IDA7XHJcbiAgICBjcC5zY2FsZSA9IHByb3BzLnNjYWxlIHx8IDE7XHJcbiAgICByZXR1cm4gY3A7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ1NTRmlsZShmaWxlTmFtZSwgaWQpIHtcclxuICAgICB2YXIgbGluayA9ICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cIicgKyBmaWxlTmFtZSArICdcIiBpZD1cIicgKyBpZCArICdcIj4nO1xyXG4gICAgICQoJ2hlYWQnKS5maW5kKCcjJyArIGlkKS5yZW1vdmUoKTtcclxuICAgICAkKCdoZWFkJykuYXBwZW5kKGxpbmspO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENTU1N0cmluZyhjc3NTdHJpbmcsIGlkKSB7XHJcbiAgICBpZiAoY3NzU3RyaW5nKSB7XHJcbiAgICAgIC8vIHZhciBkb2MgPSB3aW5kb3cuZG9jdW1lbnQ7XHJcbiAgICAgIHZhciBzdHlsZUVsID0gJCgnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPicgK2Nzc1N0cmluZysgJzwvc3R5bGU+JylcclxuICAgICAgICAuYXR0cignaWQnLCAoaWQgfHwgJ1RoaW5nJykgKyAnLXN0eWxlcycpO1xyXG4gICAgICAkKCdoZWFkJykuYXBwZW5kKHN0eWxlRWwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoVGhpbmcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaGluZztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEFjdGlvbiA9IHJlcXVpcmUoJy4uL0FjdGlvbi9BY3Rpb24uanMnKTtcclxuXHJcbmNsYXNzIFRpbWVyIGV4dGVuZHMgQWN0aW9uIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHRoaXMuY2FsbGJhY2sgPSBwcm9wcy5jYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcclxuXHRcdHRoaXMuZGVsYXkgPSBwcm9wcy5kZWxheSB8fCAxMDAwO1xyXG5cdFx0dGhpcy50aW1lcklEID0gbnVsbDtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XHJcblx0XHR0aGlzLnRpbWVySUQgPSBzZXRUaW1lb3V0KHRoaXMuY2FsbGJhY2ssIHRoaXMuZGVsYXkpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzdG9wICgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xyXG5cdFx0dGhpcy50aW1lcklEID0gbnVsbDtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoVGltZXIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFRyaWFuZ2xlIGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHRzaXplOiAxMCxcclxuXHRcdFx0Y29sb3I6ICcjQkFEQTU1J1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQocHJvcHMsIGRlZmF1bHRQcm9wcyk7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ1RyaWFuZ2xlJztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy5tYWtlVHJpYW5nbGUodGhpcy5wcm9wcy5zaXplLCB0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBlbGVtZW50IGJlZm9yZSBjYWxsaW5nIHRoaXNcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0bWFrZVRyaWFuZ2xlIChzaXplLCBjb2xvcikge1xyXG5cdFx0Y29sb3IgPSBjb2xvciB8fCAnI0JBREE1NSc7XHJcblx0XHRzaXplID0gc2l6ZSB8fCAxMDtcclxuXHRcdHRoaXMuY3NzKHtcclxuXHRcdFx0d2lkdGg6IDAsIFxyXG5cdFx0XHRoZWlnaHQ6IDAsIFxyXG5cdFx0XHRmb250U2l6ZTogMCxcclxuXHRcdFx0bGluZUhlaWdodDogMCxcclxuXHRcdFx0Ym9yZGVyQm90dG9tOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuXHRcdFx0Ym9yZGVyVG9wOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuXHRcdFx0Ym9yZGVyTGVmdDogc2l6ZSArICdweCBzb2xpZCAnICsgY29sb3JcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRyaWFuZ2xlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJpYW5nbGU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcclxucmVxdWlyZSgnLi9Cb3gvQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQXJyb3cvQXJyb3cuanMnKTtcclxucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGltZXIvVGltZXIuanMnKTtcclxucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcclxucmVxdWlyZSgnLi9QdWxzYXIvUHVsc2FyLmpzJyk7XHJcbnJlcXVpcmUoJy4vRG8vRG8uanMnKTtcclxucmVxdWlyZSgnLi9MYWJlbC9MYWJlbC5qcycpO1xyXG5yZXF1aXJlKCcuL0xpbmUvTGluZS5qcycpO1xyXG5yZXF1aXJlKCcuL0ltZy9JbWcuanMnKTtcclxucmVxdWlyZSgnLi9QYXR0ZXJuL1BhdHRlcm4uanMnKTtcclxucmVxdWlyZSgnLi9CR0ltZy9CR0ltZy5qcycpO1xyXG5yZXF1aXJlKCcuL1RleHRQYW5lL1RleHRQYW5lLmpzJyk7XHJcbnJlcXVpcmUoJy4vQ2lyY2xlL0NpcmNsZS5qcycpO1xyXG5yZXF1aXJlKCcuL1RyaWFuZ2xlL1RyaWFuZ2xlLmpzJyk7XHJcbnJlcXVpcmUoJy4vQ3ViZS9DdWJlLmpzJyk7XHJcbnJlcXVpcmUoJy4vUm9vbS9Sb29tLmpzJyk7XHJcblxyXG53aW5kb3cuVGhpbmcgPSBUaGluZztcclxuIl19
