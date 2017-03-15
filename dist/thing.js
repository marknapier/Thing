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
module.exports = "\n.DemoBox {\n  display: inline-block;\n  position: relative;\n  margin: 20px;\n  width: 200px; \n  height: 200px; \n  border: 2px dashed #eee;\n}\n";

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
module.exports = "\n.Line {\n  /* For some nice animation on the rotates: */\n  -webkit-transition: -webkit-transform .2s;\n     -moz-transition:    -moz-transform .2s;\n          transition:         transform .2s;\n}\n\n";

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
module.exports = ".Pattern.GraphPaper {\n  background-color: #003;\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\n  background-image:\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\n}\n\n.Pattern.Grid {\n  background-size: 100px 100px, 100px 100px;\n  background-position: -2px -2px, -2px -2px;\n  background-image:\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\n}\n\n.Pattern.SofaDark {\n  background:\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\n  background-color: #300;\n  background-size: 25% 25%;\n}\n\n.Pattern.Sofa {\n  background:\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\n  background-color: #300;\n  background-size: 25% 25%;\n}\n\n.Pattern.YellowCirclesWithViolet {\n    background-image: radial-gradient(#ffd679 17%, #3d5443 17.5%, #3d5443 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3dabc7 12%, #49ab3c 13.5%, #38822e 14%, #ffdb89 14.5%, #ffdb89 19%, #fff57a 20%, #fcffb5 28%, #fffebd 29%);\n    background-size: 25%, 25%;\n    background-position: 0% 0%, 17% 17%;\n}\n\n.Pattern.YellowCirclesWithViolet2 {\n  background-image: radial-gradient(#ffdd90 17%, black 17.5%, black 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3cdada 17%, gray 17.5%, gray 18%, #ffdd90 19%, #ffdd90 24%, #ffff90 30%, #ffff90 36%);\n  background-size: 25%, 25%;\n  background-position: 0% 0%, 17% 17%;\n}\n\n.Pattern.PolkaDots {\n  background-image:\n    radial-gradient(white 15%, transparent 17%),\n    radial-gradient(white 15%, transparent 17%);\n  background-size: 60px 60px;\n  background-position: 0 0, 30px 30px;\n}\n\n\n\n.Pattern.BlueBalls {\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\n  background-size: 25% 25%;\n}\n\n.Pattern.Stripes {\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\n  background-size: 15%;\n}\n\n.Pattern.StripesWhiteRedGreen {\n  background-image:\n    linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),\n    linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),\n    linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%);\n  background-position: 0%, 0%, 0%;\n  background-size: 15%, 15%, 15%;\n}\n\n.Pattern.PlaidRed {\n  background-color: hsl(0, 86%, 34%);\n  background-image:\n    repeating-linear-gradient(transparent,\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\n      rgba(0,60,0,.5) 232px, transparent 232px),\n    repeating-linear-gradient(270deg, transparent,\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\n      rgba(0,60,0,.5) 232px, transparent 232px),\n    repeating-linear-gradient(125deg, transparent,\n      transparent 2px, rgba(0,0,0,.2) 2px,\n      rgba(0,0,0,.2) 3px, transparent 3px,\n      transparent 5px, rgba(0,0,0,.2) 5px);\n}\n\n.Pattern.DiagonalStripes {\n  background-image: linear-gradient(45deg, black 25%, transparent 25.5%, transparent 50%, black 50.5%, black 75%, transparent 75.5%, transparent);\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\n        /* ie. 32% 16% for an element with w=100 h=200 */\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\n}\n\n.Pattern.BlueCascade {\n  background-color: #026873;\n  background-image: linear-gradient(91deg, rgba(255,255,25,0.17) 50%, transparent 51.5%),\n    linear-gradient(89deg, rgba(25,255,255,0.23) 50%, transparent 54.5%),\n    linear-gradient(90.5deg, transparent 50%, rgba(252, 255, 162, 0.37) 54.5%),\n    linear-gradient(90deg, transparent 50.75%, red 51%, red 51.5%, transparent 51.75%);\n  background-size: 5% 100%, 3% 100%, 9% 100%, 8% 100%;\n}\n\n /*Perlin Noise-ish radial blurs*/\n  /*RGB*/\n  /*background-image: radial-gradient(rgba(255, 42, 0, .5) 1%, transparent 200%), radial-gradient(rgba(86, 250, 2, .5) 1%, transparent 200%), radial-gradient(rgba(0, 7, 255, 0.6) 1%, transparent 150%);\n  background-size: 161px, 134px, 188px;\n  background-position: -54px, 57px, 55px;\n  */\n\n  /*Monochrome - better blurs*/\n/*\n  background-image: radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%);\n  background-size: 188px 347px, 170px, 209px;\n  background-position: -54px, 57px, 55px;\n*/\n\n.Pattern.GreenOvalsXray {\n  background-color: #131c0c;\n  background-image: \n    radial-gradient(rgba(18, 0, 255, 0) 0%, rgba(3, 179, 255, 0.09) 48%, rgba(199, 237, 44, 0.19) 65%, rgba(9, 1, 112, 0) 94%), \n    radial-gradient(rgba(9, 1, 112, 0) 0%, rgba(205, 0, 0, 0.07) 48%, rgba(254, 204, 0, 0.11) 65%, rgba(255, 210, 8, 0) 94%), \n    radial-gradient(rgba(9, 1, 112, 0.01) 0%, rgba(85, 255, 59, 0.08) 48%, rgba(174, 202, 0, 0.16) 65%, rgba(9, 1, 112, 0) 94%);\n    background-size: 188px 347px, 170px, 209px;\n  background-position: -54px, 57px, 55px;\n}\n";

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

		// Inner facing walls
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

		// Outer facing walls
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9DdWJlL0N1YmUuaHRtbCIsInNyYy9saWIvQ3ViZS9DdWJlLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUm9vbS9Sb29tLmpzIiwic3JjL2xpYi9UZXh0UGFuZS9UZXh0UGFuZS5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9UcmlhbmdsZS9UcmlhbmdsZS5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBBY3Rpb24ge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0fVxuXG5cdGluaXQgKHByb3BzKSB7XG5cdFx0dGhpcy5wcm9wcyA9IHByb3BzIHx8IHt9O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Z28gKCkge1xuXHRcdHdpbmRvdy5jb25zb2xlLmxvZygnQWN0aW9uLmdvKCknKTtcblx0fVxuXG5cdHN0b3AgKCkge1xuXHRcdHdpbmRvdy5jb25zb2xlLmxvZygnQWN0aW9uLnN0b3AoKScpO1xuXHR9XG5cblx0c3RhdGljIG1ha2UgKCkge1xuXHQgIHZhciBjbHMgPSB0aGlzO1xuXHQgIHZhciBpbnN0YW5jZSA9IG5ldyBjbHMoKTtcblx0ICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xuXHQgIHJldHVybiBpbnN0YW5jZTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoQWN0aW9uKTtcblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLyogcmVxdWlyZWQgZm9yIGFycm93ICovXFxuLmFycm93LWhlYWQge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXG4gIHdpZHRoOiAwOyBcXG4gIGhlaWdodDogMDsgXFxuICBib3JkZXItdG9wOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWJvdHRvbTogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1sZWZ0OiAzMHB4IHNvbGlkIGdyZWVuO1xcbn1cXG5cXG4uYXJyb3ctYm9keSB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxuICB3aWR0aDogNDBweDtcXG4gIGhlaWdodDogMjBweDtcXG4gIG1hcmdpbjogMDtcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcbiAgYm9yZGVyLWxlZnQ6IDA7XFxuICBib3JkZXItcmlnaHQ6IDA7XFxufVxcblxcbi5hcnJvdy13cmFwcGVyIHtcXG4gIHdpZHRoOiA3MHB4OyAgIC8qIGFycm93LWJvZHkgd2lkdGggKyBhcnJvdy1oZWFkIGJvcmRlciB3aWR0aCAqL1xcbn1cXG5cXG4uQXJyb3cge1xcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxufVxcblxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgQXJyb3cgZXh0ZW5kcyBUaGluZyB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcblx0XHR0aGlzLnR5cGUgPSAnQXJyb3cnO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xuXHRcdHRoaXMuc2V0Q29sb3IodGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgYXJyb3cgYmVmb3JlIGNhbGxpbmcgdGhpc1xuXHR9XG5cblx0cmVuZGVyICgpIHtcblx0XHRzdXBlci5yZW5kZXIoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldENvbG9yIChjKSB7XG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctaGVhZCcpLmNzcyh7Ym9yZGVyTGVmdENvbG9yOmN9KTtcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1ib2R5JykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6Y30pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0aHRtbCAoKSB7XG5cdFx0cmV0dXJuIFwiPGRpdj48ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj48L2Rpdj5cIjtcblx0fVxuXG5cdHN0YXRpYyBjcmVhdGVBcnJvd0VsZW1lbnQgKCkge1xuXHRcdHZhciAkYXJyb3cgPSAkKFwiPGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+XCIpO1xuXHRcdHJldHVybiAkYXJyb3c7XG5cdH1cblxuXHRzdGF0aWMgY3NzICgpIHtcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9BcnJvdy5jc3MnKTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoQXJyb3cpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycm93O1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgQkdJbWcgZXh0ZW5kcyBUaGluZyB7XG4gIGluaXQgKHByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIHVybDogJycsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIGxlZnQ6ICcwcHgnLFxuICAgICAgdG9wOiAnMHB4J1xuICAgIH07XG4gICAgcHJvcHMgPSB0aGlzLnByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG4gICAgdGhpcy50eXBlID0gJ0JHSW1nJztcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgYmFja2dyb3VuZDogJ3VybChcIicgKyBwcm9wcy51cmwgKyAnXCIpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgYmFja2dyb3VuZFNpemU6ICdjb3ZlcicgIC8vMTAwJSAxMDAlJ1xuICAgIH0pO1xuICB9XG59XG5UaGluZy5hZGRDbGFzcyhCR0ltZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQkdJbWc7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBCb3ggZXh0ZW5kcyBUaGluZyB7XG4gIGluaXQgKHByb3BzKSB7XG4gIFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcbiAgXHR0aGlzLnR5cGUgPSAnQm94JztcbiAgXHR0aGlzLml0ZW1zID0gW107XG4gIFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xuICB9XG5cbiAgYWRkIChhZGRJdGVtcykge1xuICBcdGlmIChhZGRJdGVtcykge1xuICAgICAgaWYgKCEoYWRkSXRlbXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgYWRkSXRlbXMgPSBbYWRkSXRlbXNdO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaT0wOyBpIDwgYWRkSXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGFkZEl0ZW1zW2ldKTtcbiAgICAgICAgYWRkSXRlbXNbaV0ucGFyZW50ID0gdGhpczsgICAgICAgIFxuICAgICAgfVxuICBcdH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBpdGVtIGZyb20gdGhpcyBib3ggKGZyb20gdGhlIGRvbSBhbmQgdGhlIGl0ZW1zIGxpc3QpXG4gIHJlbW92ZSAoaXRlbSkge1xuICBcdGlmIChpdGVtKSB7XG4gIFx0XHR2YXIgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XG4gIFx0XHRpZiAoaW5kZXggPiAtMSkge1xuICBcdFx0ICAgIHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgXHRcdFx0aXRlbS4kZWxlbWVudC5yZW1vdmUoKTtcbiAgXHRcdFx0aXRlbS5wYXJlbnQgPSBudWxsO1xuICBcdFx0fVxuICBcdH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG51bUVsZW1lbnRzICgpIHtcbiAgXHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG4gIH1cblxuICBnZXRFbGVtZW50Qm91bmRzICgpIHtcbiAgICB2YXIgYm91bmRzID0ge3g6OTk5OTk5LCB5Ojk5OTk5OSwgYm90dG9tOjAsIHJpZ2h0OjB9O1xuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwb3MgPSB0aGlzLml0ZW1zW2ldLmdldEJvdW5kaW5nQm94KCk7XG4gICAgICBib3VuZHMueCA9IChwb3MueCA8IGJvdW5kcy54KSA/IHBvcy54IDogYm91bmRzLng7XG4gICAgICBib3VuZHMueSA9IChwb3MueSA8IGJvdW5kcy55KSA/IHBvcy55IDogYm91bmRzLnk7XG4gICAgICBib3VuZHMuYm90dG9tID0gKHBvcy5ib3R0b20gPiBib3VuZHMuYm90dG9tKSA/IHBvcy5ib3R0b20gOiBib3VuZHMuYm90dG9tO1xuICAgICAgYm91bmRzLnJpZ2h0ID0gKHBvcy5yaWdodCA+IGJvdW5kcy5yaWdodCkgPyBwb3MucmlnaHQgOiBib3VuZHMucmlnaHQ7XG4gICAgfVxuICAgIGJvdW5kcy53ID0gYm91bmRzLnJpZ2h0IC0gYm91bmRzLng7XG4gICAgYm91bmRzLmggPSBib3VuZHMuYm90dG9tIC0gYm91bmRzLnk7XG4gICAgcmV0dXJuIGJvdW5kcztcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gIFx0c3VwZXIucmVuZGVyKCk7XG4gIFx0Zm9yICh2YXIgaT0wOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xuICBcdFx0dGhpcy5pdGVtc1tpXS5yZW5kZXIoKTtcbiAgXHR9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblRoaW5nLmFkZENsYXNzKEJveCk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm94O1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgQ2lyY2xlIGV4dGVuZHMgVGhpbmcge1xuICBpbml0IChwcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICB0ZXh0OiAnJyxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICByOiAyNSxcbiAgICAgIGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXG4gICAgICBmb250U2l6ZTogJzI0cHgnLFxuICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgY29sb3I6ICcjMGYwJyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxuICAgICAgYm9yZGVyQ29sb3I6ICcjQkFEQTU1JyxcbiAgICAgIGJvcmRlcldpZHRoOiA1XG4gICAgfTtcblxuICAgIHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICAgIHN1cGVyLmluaXQocHJvcHMpO1xuICAgIHRoaXMudHlwZSA9ICdDaXJjbGUnO1xuICAgIHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XG5cbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcblxuICAgIC8vIGFwcGx5IGNpcmNsZSBjc3NcbiAgICB2YXIgb2Zmc2V0ID0gcHJvcHMuciArIHByb3BzLmJvcmRlcldpZHRoO1xuICAgIHRoaXMuY3NzKHtcbiAgICAgICAgJ2xlZnQnOiAnJyArIChwcm9wcy5sZWZ0LW9mZnNldCkgKyAncHgnLFxuICAgICAgICAndG9wJzogJycgKyAocHJvcHMudG9wLW9mZnNldCkgKyAncHgnLFxuICAgICAgICAnd2lkdGgnOiAnJyArIHByb3BzLnIqMiArICdweCcsXG4gICAgICAgICdoZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXG4gICAgICAgICdsaW5lSGVpZ2h0JzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxuICAgICAgICAnYm9yZGVyJzogcHJvcHMuYm9yZGVyV2lkdGggKyAncHggc29saWQgJyArIHByb3BzLmJvcmRlckNvbG9yLFxuICAgICAgICAnYm9yZGVyUmFkaXVzJzogJzEwMDAwcHgnLFxuICAgICAgICAndGV4dEFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICdvdmVyZmxvdyc6ICdoaWRkZW4nXG4gICAgICB9KTtcblxuICAgIHRoaXMuc2V0VGV4dCh0aGlzLnRleHQpO1xuICB9XG5cbiAgc2V0VGV4dCAodHh0KSB7XG4gICAgdGhpcy50ZXh0ID0gdHh0O1xuICAgIHRoaXMuJGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQodHh0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblRoaW5nLmFkZENsYXNzKENpcmNsZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2lyY2xlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXY+PGRpdiBpZD1jdWJlIGNsYXNzPXNob3ctZnJvbnQ+PGZpZ3VyZSBjbGFzcz1mcm9udD5GPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz1iYWNrPkI8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPXJpZ2h0PlI8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPWxlZnQ+TDwvZmlndXJlPjxmaWd1cmUgY2xhc3M9dG9wPlQ8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPWJvdHRvbT5HPC9maWd1cmU+PC9kaXY+PC9kaXY+XCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG4vKipcbiAqICB3LCBoLCBkZXB0aFxuICovXG5jbGFzcyBDdWJlIGV4dGVuZHMgVGhpbmcge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XG5cdFx0XHR3OiA1MDAsXG5cdFx0XHRoOiA1MDAsXG5cdFx0XHRkOiA1MDBcblx0XHR9O1xuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xuXHRcdHRoaXMudyA9IHByb3BzLnc7XG5cdFx0dGhpcy5oID0gcHJvcHMuaDtcblx0XHR0aGlzLmQgPSBwcm9wcy5kO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG5cdFx0dGhpcy50eXBlID0gJ0N1YmUnO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xuXHRcdHRoaXMuc2V0dXBDdWJlKHRoaXMuJGVsZW1lbnQpO1xuXHR9XG5cblx0cmVuZGVyICgpIHtcblx0XHRzdXBlci5yZW5kZXIoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldHVwQ3ViZSgkZWwpIHtcblx0XHR2YXIgJGNvbnRhaW5lciAgPSAkZWw7XG5cdFx0dmFyICRjdWJlICAgICAgID0gJGVsLmZpbmQoJyNjdWJlJyk7XG5cdFx0dmFyICRmYWNlRnJvbnQgID0gJGVsLmZpbmQoJyNjdWJlIC5mcm9udCAnKTtcblx0XHR2YXIgJGZhY2VCYWNrICAgPSAkZWwuZmluZCgnI2N1YmUgLmJhY2sgICcpO1xuXHRcdHZhciAkZmFjZVJpZ2h0ICA9ICRlbC5maW5kKCcjY3ViZSAucmlnaHQgJyk7XG5cdFx0dmFyICRmYWNlTGVmdCAgID0gJGVsLmZpbmQoJyNjdWJlIC5sZWZ0ICAnKTtcblx0XHR2YXIgJGZhY2VUb3AgICAgPSAkZWwuZmluZCgnI2N1YmUgLnRvcCAgICcpO1xuXHRcdHZhciAkZmFjZUJvdHRvbSA9ICRlbC5maW5kKCcjY3ViZSAuYm90dG9tJyk7XG5cblx0XHR2YXIgaGFsZkhlaWdodCA9IHRoaXMuaC8yO1xuXHRcdHZhciBoYWxmV2lkdGggPSB0aGlzLncvMjtcblx0XHR2YXIgaGFsZkRlcHRoID0gdGhpcy5kLzI7XG5cblx0XHQkY29udGFpbmVyLmNzcyh7XG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0bGVmdDogJzBweCcsXG5cdFx0XHR0b3A6ICcwcHgnLFxuXHRcdFx0cGVyc3BlY3RpdmU6ICc2MDAwcHgnLFxuXHRcdFx0ekluZGV4OiAyMDAwMFxuXHRcdH0pO1xuXG5cdFx0JGN1YmUuY3NzKHtcblx0XHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRcdHpJbmRleDogMjAwMDAsXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxuXHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxcydcblx0XHR9KTtcblxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlRnJvbnQsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIC4yKScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXG5cdFx0fSk7XG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VCYWNrLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsICAgMCwgICAwLCAuNSknLFxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtMTgwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xuXHRcdH0pO1xuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlUmlnaHQsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgICAwLCAgNTUsIC41KScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsIFxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAgIDkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpICsgJ3B4ICknICAvKiBoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkgKi9cblx0XHR9KTtcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUxlZnQsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAgIDAsIC41KScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsIFxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAgLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmV2lkdGggLSAoaGFsZldpZHRoLWhhbGZEZXB0aCkpICsgJ3B4ICknICAvKiBoYWxmV2lkdGggLSAoaGFsZldpZHRoLWhhbGZEZXB0aCkgKi9cblx0XHR9KTtcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZVRvcCwge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoICAwLCAgNTUsIDI1NSwgLjUpJyxcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXG5cdFx0ICBcdGhlaWdodDogdGhpcy5kICsgJ3B4JywgXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoICAgOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXG5cdFx0fSk7XG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VCb3R0b20sIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgMjU1LCAgIDAsIC41KScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsIFxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAgLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmSGVpZ2h0ICsgKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkgKyAncHggKSdcblx0XHR9KTtcblx0fVxuXG5cdHNldHVwRmFjZSgkZmFjZSwgY3NzVmFscykge1xuXHRcdHZhciBkZWZhdWx0Q1NTID0ge1xuXHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0bGluZUhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdGZvbnRTaXplOiAodGhpcy5oLzMpICsncHgnLFxuXHRcdFx0Zm9udFdlaWdodDogJ2JvbGQnLFxuXHRcdFx0Y29sb3I6ICd3aGl0ZScsXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0fTtcblx0XHQkZmFjZS5jc3MoJC5leHRlbmQoe30sIGRlZmF1bHRDU1MsIGNzc1ZhbHMpKTtcblx0fVxuXG5cdGh0bWwgKCkge1xuXHRcdHJldHVybiByZXF1aXJlKCcuL0N1YmUuaHRtbCcpO1xuXHR9XG5cblx0c3RhdGljIGNzcyAoKSB7XG5cdFx0Ly8gcmV0dXJuIHJlcXVpcmUoJy4vQ3ViZS5jc3MnKTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoQ3ViZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ3ViZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG4uRGVtb0JveCB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBtYXJnaW46IDIwcHg7XFxuICB3aWR0aDogMjAwcHg7IFxcbiAgaGVpZ2h0OiAyMDBweDsgXFxuICBib3JkZXI6IDJweCBkYXNoZWQgI2VlZTtcXG59XFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xudmFyIEJveCA9IHJlcXVpcmUoJy4uL0JveC9Cb3guanMnKTtcblxuY2xhc3MgRGVtb0JveCBleHRlbmRzIEJveCB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcblx0XHRzdXBlci5pbml0KHByb3BzKTtcblx0XHRwcm9wcy53aWR0aCA9IHByb3BzLndpZHRoIHx8IDIwMDtcblx0XHRwcm9wcy5oZWlnaHQgPSBwcm9wcy5oZWlnaHQgfHwgMjAwO1xuXHRcdHByb3BzLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblx0XHR0aGlzLnR5cGUgPSAnRGVtb0JveCc7XG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xuXHR9XG5cblx0cmVuZGVyICgpIHtcblx0XHRzdXBlci5yZW5kZXIoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHN0YXRpYyBjc3MgKCkge1xuXHRcdHJldHVybiByZXF1aXJlKCcuL0RlbW9Cb3guY3NzJyk7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKERlbW9Cb3gpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlbW9Cb3g7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG4vLyBMaWtlIFVuaXggcGlwZTogb3V0cHV0IG9mIG9uZSBjb21tYW5kIGlzIGlucHV0IHRvIHRoZSBuZXh0XG4vLyBFYWNoIGZ1bmN0aW9uIHRha2VzIGEgJ3Byb3BzJyBvYmplY3QgYXMgYXJndW1lbnRcbi8vIEVhY2ggZnVuY3Rpb24gcmV0dXJucyBhbiBvYmplY3Qgd2l0aCByZXN1bHRzLCB3aGljaCBpcyBwYXNzZWQgYXMgcHJvcHMgdG8gdGhlIG5leHRcbi8vIERvKCkgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBleGVjdXRlIHRoZSBEbyBjaGFpblxuXG4vLyBQLnB1bHNlLnNldFRvKFxuLy8gICAgIERvKFIuZ2V0UmFuZG9tTnVtYmVyLCB7ZnJvbTowLCB0bzoxMH0pICAgLy8gcmV0dXJuczogIHtkYXRhOiA4fVxuLy8gICAgIC5EbyhDLnBpY2tDb2xvcikgICAgLy8gcmVhZHMgaW5wdXQgOCwgcmV0dXJucyB7ZGF0YTogJyNjZmYnfVxuLy8gICAgIC5EbyhCLmNoYW5nZUNvbG9yKSAgIC8vIHJlYWRzIGlucHV0ICcjY2ZmJywgY2hhbmdlcyBjb2xvciBvbiBCbGlua2VyXG4vLyApO1xuXG5cbmZ1bmN0aW9uIERvKF9hRnVuY3Rpb24sIF9wcm9wcywgX2ZpcnN0RG8pIHtcbiAgICB2YXIgYUZ1bmN0aW9uID0gX2FGdW5jdGlvbjtcbiAgICB2YXIgcHJvcHMgPSBfcHJvcHM7XG4gICAgdmFyIGZpcnN0RG8gPSBfZmlyc3REbyB8fCBleGVjdXRvcjtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdhZnVuY3Rpb249JywgYUZ1bmN0aW9uKTtcbiAgICAvLyBjb25zb2xlLmxvZygncHJvcHM9JywgcHJvcHMpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdmaXJzdERvPScsIGZpcnN0RG8pO1xuXG4gICAgLy8gUnVuIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMuXG4gICAgLy8gUGFzcyB0aGUgcmVzdWx0cyB0byB0aGUgbmV4dCBjaGFpbmVkIGZ1bmN0aW9uIChpZiBhbnkpLlxuICAgIC8vIFJldHVybiByZXN1bHRzIG9mIHRoaXMgZnVuY3Rpb24gb3Igb2YgdGhlIGNoYWluXG4gICAgZnVuY3Rpb24gZXhlY3V0b3IgKHBpcGVkUHJvcHMpIHtcbiAgICAgICAgdmFyIHJldHVyblZhbCA9IGFGdW5jdGlvbihwcm9wcyB8fCBwaXBlZFByb3BzKTtcbiAgICAgICAgcmV0dXJuIChleGVjdXRvci5uZXh0RG8gPyBleGVjdXRvci5uZXh0RG8ocmV0dXJuVmFsKSA6IHJldHVyblZhbCk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBsYXN0ICdEbycgaW4gdGhlIGNoYWluXG4gICAgZnVuY3Rpb24gZ2V0TGFzdERvICgpIHtcbiAgICAgICAgdmFyIHRtcERvID0gZmlyc3REbztcbiAgICAgICAgd2hpbGUgKHRtcERvLm5leHREbykgeyB0bXBEbyA9IHRtcERvLm5leHREbzsgfVxuICAgICAgICByZXR1cm4gdG1wRG87XG4gICAgfVxuXG4gICAgLy8gQWRkIGEgbmV3ICdEbycgdG8gdGhlIGVuZCBvZiB0aGUgY2hhaW4uXG4gICAgZXhlY3V0b3IuRG8gPSBmdW5jdGlvbiAoYUZ1bmN0aW9uLCBwcm9wcykge1xuICAgICAgICBnZXRMYXN0RG8oKS5uZXh0RG8gPSBEbyhhRnVuY3Rpb24sIHByb3BzLCBmaXJzdERvKTtcbiAgICAgICAgcmV0dXJuIGZpcnN0RG87ICAvLyBBbHdheXMgcmV0dXJuIHRoZSBmaXJzdCAnRG8nIGluIHRoZSBjaGFpblxuICAgIH07XG5cbiAgICBleGVjdXRvci5uZXh0RG8gPSBudWxsO1xuXG4gICAgcmV0dXJuIGV4ZWN1dG9yO1xufVxuXG5UaGluZy5EbyA9IERvO1xuXG4vKlxuLy8gY2hhaW5lZCwgZWFjaCBEbyBoYXMgaXRzIG93biBwYXJhbWV0ZXJzXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7fSwge2FyZzE6J2hlbGxvMSd9KVxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpO30sIHthcmcyOidoZWxsbyB0byAyMjIyMid9KVxuXG4vLyBjaGFpbmVkLCB3aXRoIGZpcnN0IERvIHBpcGluZyByZXN1bHRzIHRvIHNlY29uZCBEb1xudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCBudWxsKVxuXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7IHJldHVybiB7cGlwZWRwcm9wOjEyMzR9fSwge2FyZzE6J2hlbGxvMSd9KVxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpOyByZXR1cm4ge25ld1Byb3A6cHJvcHMucGlwZWRwcm9wKzJ9fSlcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMycsIHByb3BzKTt9KVxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBEbztcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbi8qXG4gICAgc3JjOiA8ZmlsZSBwYXRoPlxuICAgIGNlbnRlcjogdHJ1ZXxmYWxzZVxuICAgIHNpemU6IGNvbnRhaW58Y292ZXJ8c3RyZXRjaFxuKi9cblxuY2xhc3MgSW1nIGV4dGVuZHMgVGhpbmcge1xuICBpbml0IChwcm9wcykge1xuICAgIHZhciBwbGFjZWhvbGRlciA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBRElDQVlBQUFDdFdLNmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQlY5SlJFRlVlSnp0M2MxdTNVUWNoK0YvRUJLOUFzUUNWV2ZWUXE0Q2JoeHVBNEVxc1NtaCs3SXVpOVFDUXZJN1l4K1BQNTlIOGk2eVpvN216ZmdrbG4xWFZaOEtlTllYYXc4QXRrd2dFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnZURMRVQ5NzEyMFVzTHltTzBqc0lCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlNKzdWTlYzYXc5aVFmZFY5WHJ0UVd6VnA4YmpMQzVWOVh0VlBkUTVJcm12cWc5VjlhN09GVW56dWhmSVB5NzFHTWN3NTZOSE1zUXh6UGRNa1Foa3BFdjlONDZqUi9JMGpyTkZJcEFSTHZWOEhFZU41S1U0emhTSlFCcGRLc2R4dEVpdXhYR1dTQVRTNEZKdGNSd2xrdFk0emhDSlFLNjQxTGc0L2gzSjk0dVA5blpqNHpoNkpBSUpMalV0anIxR01qV09JMGNpa0JkYzZyWTQ5aGJKclhFY05SS0JQT05TODhTeGwwam1pdU9Ja1RUTitXeTNtcnlxcXE5bVBOODNWZlZUYlRPUys2cjZ1YXErbnZHY3J6NGZwM0ttSGFUcWNURS8xSHkvVmJlNGs4eTljM3lxcXZkVjlXYkpTWFRtRWlzNGNpVGlhQ09RSzQ0WWlUamFDYVJCajBqK3JIVWlFY2M0QW1sMGhFakVNWjVBUnRoekpPS1lSaUFqZlYrUGkzcFBrWWhqT29GTXNLZEllc1R4UjUwamppcUJUTGFIU01SeE80SGNZTXVSaUdNZUFybFJyMGp1YnhpVE9PWWprQmxzS1JKeHpFc2dNOWxDSk9LWW4wQm10R1lrNHVoRElETmJJeEp4OUNPUUR1NXJ1VWg2eGZGMmxrOWkvd1RTeVJLUmlLTS9nWFRVTXhKeExFTWduZldJNUVPSll5a0NXVUNQU01TeERJRXNaS3VSaUNNVHlJSjZmRzhRUjE4Q1dkaFdJbmtvY2JRUXlBcldqa1FjN1FTeWtyVWlFY2M0QWxuUjBwR0lZenlCckd5cFNNUXhqVUEyb0hjazRwaE9JQnZSS3hKeDNLYnBjejdiMDkyUDVtN3RBWnlCSGFTZkpTNng5dnpPeERXNXhGclprbC9TUlRLZVFGYTB4cDk1UlRLT1FGYXk1ajhLUmRKT0lDdll3cTBtSW1ramtJV3RIWWRJeGhISWdyWVNoMGphQ1dRaFc0dERKRzBFc29DdHhpR1M2d1RTV1k4NEhxclBpMFZGOG44QzZhaFhIRy9yY1RHTHBEK0JkTkl6am9GSStoTklCMHZFTVJCSlh3S1oyWkp4REVUU2owQm10RVljQTVIMElaQ1pyQm5IUUNUekU4Z010aERIUUNUekVzaU50dmlVZFpITVJ5QTMyR0ljQTVITVF5QVRiVG1PZ1VodUo1QUo5aERIUUNTM0VjaEllNHBqSUpMcEJETENIdU1ZaUdRYWdUVGFjeHdEa1l3bmtBWkhpR01na25FRWNrV3ZPTjRzT1lrblJOSk9JTUVSNHhpSXBJMUFYbkRrT0FZaXVVNGd6emhESElOZWtSemxpZkpOY3o3YjA5MC9majdtOGxCVlAxVFZyek9lY3k2L1ZOV1A5ZmlLNnJsOHJLcS9aanpmTHB4cEI2bXFlbDFWNytxNE84ZFRjKzBrdjFYVnR3dVB2U2VYV01HdGtld2xqc0d0a1J3dGppcUJYRFUxa3ZlMXJ6Z0dVeU01WWh4VkFta3lOcEs5eGpFWUc4bFI0NmdTU0xQV1NQWWV4NkExa2lQSFVTV1FVYTVGY3BRNEJ0Y2lPWG9jVlFJWjdhVklqaGJINEtWSXpoQkhsVUFtZVJySlVlTVlQSTNrTEhGVUNXU3lJWktqeHpFWUlqbFRIRlVDdWNuck9rY2NnN2QxcmppcUd0ZjlYYlV2ZmkrdDUwaWExdjNaN3NXQ1VRUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUhCWFZaL1dIZ1JzbFIwRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VncjhCaVFWenE5THYxT29BQUFBQVNVVk9SSzVDWUlJPSc7XG5cbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuICAgIHByb3BzLnNyYyA9IHByb3BzLnNyYyB8fCBwbGFjZWhvbGRlcjtcbiAgICAvLyBwcm9wcy5iYWNrZ3JvdW5kID0gJ3VybChcIicgKyBwcm9wcy5zcmMgKyAnXCIpIG5vLXJlcGVhdCAnICsgKHByb3BzLmNlbnRlciA/ICdjZW50ZXInIDogJ2xlZnQgdG9wJyk7XG4gICAgLy8gcHJvcHMuYmFja2dyb3VuZFNpemUgPSAocHJvcHMuc2l6ZSA9PT0gJ2NvbnRhaW4nIHx8IHByb3BzLnNpemUgPT09ICdjb3ZlcicgPyBwcm9wcy5zaXplIDogKHByb3BzLnNpemU9PT0nc3RyZXRjaCcgPyAnMTAwJSAxMDAlJyA6IHVuZGVmaW5lZCkgKTtcblxuICAgIHRoaXMucHJvcHMgPSBUaGluZy5jbGVhbnVwKHByb3BzKTtcblxuICAgIHRoaXMudHlwZSA9ICdJbWcnO1xuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSAxO1xuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5zcmMgPSBwcm9wcy5zcmM7XG4gICAgdGhpcy54ID0gcHJvcHMueCB8fCB1bmRlZmluZWQ7XG4gICAgdGhpcy55ID0gcHJvcHMueSB8fCB1bmRlZmluZWQ7XG4gICAgdGhpcy53ID0gcHJvcHMudyB8fCB1bmRlZmluZWQ7XG4gICAgdGhpcy5oID0gcHJvcHMuaCB8fCB1bmRlZmluZWQ7XG5cbiAgICBJbWcubG9hZGluZyh0aGlzKTtcbiAgICBsb2FkSW1hZ2UocHJvcHMuc3JjLCB0aGlzLm9ubG9hZC5iaW5kKHRoaXMpLCB0aGlzLm9uZXJyb3IuYmluZCh0aGlzKSk7XG5cbiAgICBzdXBlci5pbml0aWFsaXplKHByb3BzKTtcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gIH1cblxuICBvbmxvYWQgKGltZykge1xuICAgIHdpbmRvdy5jb25zb2xlLmxvZygnSW1hZ2UgTG9hZGVkOicsIGltZywgaW1nLnNyYywgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IGltZy5oZWlnaHQgLyBpbWcud2lkdGg7ICAvLyBhc3BlY3QgcmF0aW8gb2Ygb3JpZ2luYWwgaW1hZ2VcbiAgICB0aGlzLncgPSB0aGlzLncgfHwgaW1nLndpZHRoO1xuICAgIHRoaXMuaCA9IHRoaXMuaCB8fCAodGhpcy53ICogdGhpcy5hc3BlY3RSYXRpbyk7XG4gICAgdGhpcy5jc3Moe1xuICAgICAgICB3aWR0aDogdGhpcy53LFxuICAgICAgICBoZWlnaHQ6IHRoaXMuaCxcbiAgICAgICAgYmFja2dyb3VuZDogJ3VybCgnICtpbWcuc3JjKyAnKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgICAgYmFja2dyb3VuZFNpemU6ICcxMDAlIDEwMCUnXG4gICAgfSk7XG4gICAgSW1nLmxvYWRlZCh0aGlzKTtcbiAgfVxuXG4gIG9uZXJyb3IgKGltZykge1xuICAgIHdpbmRvdy5jb25zb2xlLmxvZygnSW1nLm9uZXJyb3InLCBpbWcuc3JjLCAnZmFpbGVkJyk7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuZXJyb3IgPSB0cnVlO1xuICAgIHRoaXMud2lkdGggPSB0aGlzLmhlaWdodCA9IDA7XG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XG4gICAgSW1nLmxvYWRlZCh0aGlzKTtcbiAgfVxuXG4gIHNldFdpZHRoICh3KSB7XG4gICAgdGhpcy53aWR0aCA9IHc7XG4gICAgdGhpcy5oZWlnaHQgPSB3ICogdGhpcy5hc3BlY3RSYXRpbztcbiAgICB0aGlzLmNzcyh7XG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdGF0aWMgbG9hZGluZyAoaW1nKSB7XG4gICAgd2luZG93LmNvbnNvbGUubG9nKFwiSU1HLmxvYWRpbmcoKTpcIiwgaW1nLnNyYyk7XG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcbiAgICBpZiAoaW1nICYmICFpbWcubG9hZGVkKSB7XG4gICAgICAgIEltZy5xdWV1ZWRJbWdzLnB1c2goaW1nKTtcbiAgICB9XG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aDtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkZWQgKGltZykge1xuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5sb2FkZWQoKTpcIiwgaW1nLnNyYywgSW1nLnF1ZXVlZEltZ3MubGVuZ3RoKTtcbiAgICBJbWcucXVldWVkSW1ncyA9IEltZy5xdWV1ZWRJbWdzIHx8IFtdO1xuICAgIGlmIChpbWcgJiYgaW1nLmxvYWRlZCkge1xuICAgICAgICB2YXIgaW5kZXggPSBJbWcucXVldWVkSW1ncy5pbmRleE9mKGltZyk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBJbWcucXVldWVkSW1ncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJbWcucXVldWVkSW1ncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIEltZy5vbkFsbExvYWRlZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJbWcucXVldWVkSW1ncy5sZW5ndGggPT09IDA7XG4gIH1cblxuICBzdGF0aWMgb25BbGxMb2FkZWQgKCkge1xuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5vbkFsbExvYWRlZCgpOiB0cmlnZ2VyZWRcIik7XG4gIH1cblxufVxuVGhpbmcuYWRkQ2xhc3MoSW1nKTtcblxuXG5mdW5jdGlvbiBsb2FkSW1hZ2UgKHNyYywgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxsYmFjayh0aGlzKTtcbiAgICB9O1xuICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBlcnJvckNhbGxiYWNrKHRoaXMpO1xuICAgIH07XG4gICAgaW1nLnNyYyA9IHNyYztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbWc7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBMYWJlbCBleHRlbmRzIFRoaW5nIHtcblx0aW5pdCAocHJvcHMpIHtcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xuXHRcdFx0Zm9udEZhbWlseTogJ0NhbGlicmksIEFyaWFsLCBzYW5zLXNlcmlmJyxcblx0XHRcdGZvbnRTaXplOiAnMTRweCcsXG5cdFx0XHRjb2xvcjogJyMwMDAnXG5cdFx0fTtcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuXHRcdHRoaXMudHlwZSA9ICdMYWJlbCc7XG5cdFx0dGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3Ncblx0XHR0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLnRleHQpO1xuXHR9XG5cblx0c2V0VGV4dCAodHh0KSB7XG5cdFx0dGhpcy50ZXh0ID0gdHh0O1xuXHRcdHRoaXMuJGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQodHh0KTtcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0c3VwZXIucmVuZGVyKCk7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKExhYmVsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBMYWJlbDtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG4uTGluZSB7XFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXG59XFxuXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBMaW5lIGV4dGVuZHMgVGhpbmcge1xuICBpbml0IChwcm9wcykge1xuICAgIC8vIGV4cGVjdGluZyBwcm9wczogeyB4MTowLCB5MTowLCB4Mjo1MCwgeTI6NTAgfVxuICAgIHByb3BzLmJhY2tncm91bmRDb2xvciA9IHByb3BzICYmIChwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgcHJvcHMuY29sb3IgfHwgJ2JsYWNrJyk7XG4gICAgc3VwZXIuaW5pdChwcm9wcyk7XG4gICAgdGhpcy50eXBlID0gJ0xpbmUnO1xuICAgIHRoaXMubGVuZ3RoID0gMTA7XG4gICAgdGhpcy53aWR0aCA9IDE7XG4gICAgdGhpcy5hbmdsZSA9IDA7XG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3ModGhpcy50eXBlKTtcbiAgICB0aGlzLmNyZWF0ZUxpbmUocHJvcHMueDEsIHByb3BzLnkxLCBwcm9wcy54MiwgcHJvcHMueTIsIHByb3BzLndpZHRoLCBwcm9wcy5hcnJvdywgcHJvcHMuc2hvcnRlbik7XG4gIH1cblxuICBjcmVhdGVMaW5lICh4MSx5MSwgeDIseTIsIHdpZHRoLCBhcnJvdywgc2hvcnRlbikge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCAyO1xuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5zcXJ0KCh4MS14MikqKHgxLXgyKSArICh5MS15MikqKHkxLXkyKSkgLSAoYXJyb3c/IHRoaXMud2lkdGgqMiA6IDApOyAgLy8gc2hvcnRlbiB0aGUgbGVuZ3RoIHRvIG1ha2Ugcm9vbSBmb3IgYXJyb3doZWFkXG4gICAgdGhpcy5hbmdsZSAgPSBNYXRoLmF0YW4yKHkyIC0geTEsIHgyIC0geDEpICogMTgwIC8gTWF0aC5QSTtcbiAgICB0aGlzLmxlbmd0aCAtPSBzaG9ydGVuIHx8IDA7ICAvLyBzaG9ydGVuIHRoZSBsaW5lIGEgYml0IChtYWtlcyByb29tIGZvciBhcnJvd2hlYWQpXG4gICAgdGhpcy5jc3Moe1xuICAgICAgICAnbGVmdCc6ICcnICsgeDEgKyAncHgnLFxuICAgICAgICAndG9wJzogJycgKyAoeTEtKHRoaXMud2lkdGgvMikpICsgJ3B4JyxcbiAgICAgICAgJ3dpZHRoJzogJycgKyB0aGlzLmxlbmd0aCArICdweCcsXG4gICAgICAgICdoZWlnaHQnOiAnJyArIHRoaXMud2lkdGggKyAncHgnLFxuICAgICAgICAvLyByb3RhdGUgYXJvdW5kIHN0YXJ0IHBvaW50IG9mIGxpbmVcbiAgICAgICAgJ3RyYW5zZm9ybS1vcmlnaW4nOiAnMCA1MCUnXG4gICAgICB9KTtcbiAgICB0aGlzLnJvdGF0ZVRvKHRoaXMuYW5nbGUpO1xuICAgIGlmIChhcnJvdykge1xuICAgICAgdGhpcy5hZGRBcnJvd0hlYWQodGhpcy5sZW5ndGgsIHRoaXMud2lkdGgsIHRoaXMud2lkdGgqMiwgdGhpcy5wcm9wcy5iYWNrZ3JvdW5kQ29sb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGxlbiBvZiBsaW5lLCB3aWR0aCBvZiBsaW5lLCBzaXplIG9mIHRyaWFuZ2xlIChpZS4gMTAgd2lsbCBiZSAxMHB4IHdpZGUgYW5kIDIwcHggaGlnaClcbiAgYWRkQXJyb3dIZWFkIChsZW4sIHdpZHRoLCBzaXplLCBjb2xvcikge1xuICAgIHRoaXMuYXJyb3dIZWFkID0gJCgnPGRpdj48L2Rpdj4nKTtcbiAgICB0aGlzLmFycm93SGVhZC5jc3Moe1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB3aWR0aDogMCwgXG4gICAgICBoZWlnaHQ6IDAsIFxuICAgICAgZm9udFNpemU6IDAsXG4gICAgICBsaW5lSGVpZ2h0OiAwLFxuICAgICAgbGVmdDogbGVuICsgJ3B4JyxcbiAgICAgIHRvcDogLShzaXplLSh3aWR0aC8yKSkgKyAncHgnLFxuICAgICAgYm9yZGVyQm90dG9tOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgIGJvcmRlclRvcDogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICBib3JkZXJMZWZ0OiBzaXplICsgJ3B4IHNvbGlkICcgKyBjb2xvclxuICAgIH0pO1xuICAgIHRoaXMuJGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQodGhpcy5hcnJvd0hlYWQpO1xuICB9XG5cbiAgc3RhdGljIGNzcyAoKSB7XG4gIFx0cmV0dXJuIHJlcXVpcmUoJy4vTGluZS5jc3MnKTtcbiAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoTGluZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuUGF0dGVybi5HcmFwaFBhcGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDM7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweCwgMjBweCAyMHB4LCAyMHB4IDIwcHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweCwgLTFweCAtMXB4LCAtMXB4IC0xcHg7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4zKSAxcHgsIHRyYW5zcGFyZW50IDFweCk7XFxufVxcblxcbi5QYXR0ZXJuLkdyaWQge1xcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweDtcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpO1xcbn1cXG5cXG4uUGF0dGVybi5Tb2ZhRGFyayB7XFxuICBiYWNrZ3JvdW5kOlxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDUwJSAwLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgMTAwJSA1MCUsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxufVxcblxcbi5QYXR0ZXJuLlNvZmEge1xcbiAgYmFja2dyb3VuZDpcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCA5OSUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDYlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDElLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyMyUpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgNTAlIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSAxMDAlIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgOTYlLCA0JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxufVxcblxcbi5QYXR0ZXJuLlllbGxvd0NpcmNsZXNXaXRoVmlvbGV0IHtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmQ2NzkgMTclLCAjM2Q1NDQzIDE3LjUlLCAjM2Q1NDQzIDE4LjIlLCAjM2NkYWRhIDE5JSwgIzZkZThlOCAyNCUsICNlZGNiZmIgMzAlLCB0cmFuc3BhcmVudCAzNiUpLCByYWRpYWwtZ3JhZGllbnQoIzNkYWJjNyAxMiUsICM0OWFiM2MgMTMuNSUsICMzODgyMmUgMTQlLCAjZmZkYjg5IDE0LjUlLCAjZmZkYjg5IDE5JSwgI2ZmZjU3YSAyMCUsICNmY2ZmYjUgMjglLCAjZmZmZWJkIDI5JSk7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAlIDAlLCAxNyUgMTclO1xcbn1cXG5cXG4uUGF0dGVybi5ZZWxsb3dDaXJjbGVzV2l0aFZpb2xldDIge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmRkOTAgMTclLCBibGFjayAxNy41JSwgYmxhY2sgMTguMiUsICMzY2RhZGEgMTklLCAjNmRlOGU4IDI0JSwgI2VkY2JmYiAzMCUsIHRyYW5zcGFyZW50IDM2JSksIHJhZGlhbC1ncmFkaWVudCgjM2NkYWRhIDE3JSwgZ3JheSAxNy41JSwgZ3JheSAxOCUsICNmZmRkOTAgMTklLCAjZmZkZDkwIDI0JSwgI2ZmZmY5MCAzMCUsICNmZmZmOTAgMzYlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSAwJSwgMTclIDE3JTtcXG59XFxuXFxuLlBhdHRlcm4uUG9sa2FEb3RzIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSksXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDYwcHggNjBweDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMzBweCAzMHB4O1xcbn1cXG5cXG5cXG5cXG4uUGF0dGVybi5CbHVlQmFsbHMge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNhY2YgNzclLCByZ2JhKDg4LDk5LDI1NSwuODgpIDgwJSwgdHJhbnNwYXJlbnQgODMlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXG59XFxuXFxuLlBhdHRlcm4uU3RyaXBlcyB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgyNTUsMjU1LDI1LDEpIDUwJSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JTtcXG59XFxuXFxuLlBhdHRlcm4uU3RyaXBlc1doaXRlUmVkR3JlZW4ge1xcbiAgYmFja2dyb3VuZC1pbWFnZTpcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MSUsICNmZmZmYzggNTElLCAjZmZmZmM4IDU5JSwgdHJhbnNwYXJlbnQgNTklKSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA0MyUsICNmMzMwNTQgNDMlLCAjZjMzMDU0IDY3JSwgdHJhbnNwYXJlbnQgNjclKSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjMDI5YjRmIDM0JSwgIzI2MjYyNiAzNCUsICMyNjI2MjYgNzUlLCAjMDI5YjRmIDc1JSk7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSwgMCUsIDAlO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxNSUsIDE1JSwgMTUlO1xcbn1cXG5cXG4uUGF0dGVybi5QbGFpZFJlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBoc2woMCwgODYlLCAzNCUpO1xcbiAgYmFja2dyb3VuZC1pbWFnZTpcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCh0cmFuc3BhcmVudCxcXG4gICAgICB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LFxcbiAgICAgIHRyYW5zcGFyZW50IDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDY2cHgsIHRyYW5zcGFyZW50IDY2cHgsXFxuICAgICAgdHJhbnNwYXJlbnQgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY5cHgsIHJnYmEoMCw2MCwwLC41KSAxNjlweCxcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxODJweCwgcmdiYSgwLDYwLDAsLjUpIDE4MnB4LFxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAyMzJweCwgdHJhbnNwYXJlbnQgMjMycHgpLFxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDI3MGRlZywgdHJhbnNwYXJlbnQsXFxuICAgICAgdHJhbnNwYXJlbnQgNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgNTNweCwgdHJhbnNwYXJlbnQgNTNweCxcXG4gICAgICB0cmFuc3BhcmVudCA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2M3B4LCByZ2JhKDQwLDAsMTYwLC40KSA2NnB4LCB0cmFuc3BhcmVudCA2NnB4LFxcbiAgICAgIHRyYW5zcGFyZW50IDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2OXB4LCByZ2JhKDAsNjAsMCwuNSkgMTY5cHgsXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTgycHgsIHJnYmEoMCw2MCwwLC41KSAxODJweCxcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMjMycHgsIHRyYW5zcGFyZW50IDIzMnB4KSxcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgxMjVkZWcsIHRyYW5zcGFyZW50LFxcbiAgICAgIHRyYW5zcGFyZW50IDJweCwgcmdiYSgwLDAsMCwuMikgMnB4LFxcbiAgICAgIHJnYmEoMCwwLDAsLjIpIDNweCwgdHJhbnNwYXJlbnQgM3B4LFxcbiAgICAgIHRyYW5zcGFyZW50IDVweCwgcmdiYSgwLDAsMCwuMikgNXB4KTtcXG59XFxuXFxuLlBhdHRlcm4uRGlhZ29uYWxTdHJpcGVzIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg0NWRlZywgYmxhY2sgMjUlLCB0cmFuc3BhcmVudCAyNS41JSwgdHJhbnNwYXJlbnQgNTAlLCBibGFjayA1MC41JSwgYmxhY2sgNzUlLCB0cmFuc3BhcmVudCA3NS41JSwgdHJhbnNwYXJlbnQpO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxNiUgMTYlOyAgLyogbXVzdCBtYXRjaCBhc3BlY3QgcmF0aW8gb2YgY29udGFpbmluZyBlbGVtZW50IG9yIGxpbmVzIHdpbGwgYnJlYWsgKi9cXG4gICAgICAgIC8qIGllLiAzMiUgMTYlIGZvciBhbiBlbGVtZW50IHdpdGggdz0xMDAgaD0yMDAgKi9cXG4gICAgICAgIC8qIFBvd2VycyBvZiAyIHdvcmsgYmVzdCAob3RoZXIgdmFsdWVzLCBsaWtlIDcgb3IgMjMsIG1ha2UgamFnZ3kgYWxpYXNpbmcpICovXFxufVxcblxcbi5QYXR0ZXJuLkJsdWVDYXNjYWRlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMjY4NzM7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoOTFkZWcsIHJnYmEoMjU1LDI1NSwyNSwwLjE3KSA1MCUsIHRyYW5zcGFyZW50IDUxLjUlKSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDg5ZGVnLCByZ2JhKDI1LDI1NSwyNTUsMC4yMykgNTAlLCB0cmFuc3BhcmVudCA1NC41JSksXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MC41ZGVnLCB0cmFuc3BhcmVudCA1MCUsIHJnYmEoMjUyLCAyNTUsIDE2MiwgMC4zNykgNTQuNSUpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwLjc1JSwgcmVkIDUxJSwgcmVkIDUxLjUlLCB0cmFuc3BhcmVudCA1MS43NSUpO1xcbiAgYmFja2dyb3VuZC1zaXplOiA1JSAxMDAlLCAzJSAxMDAlLCA5JSAxMDAlLCA4JSAxMDAlO1xcbn1cXG5cXG4gLypQZXJsaW4gTm9pc2UtaXNoIHJhZGlhbCBibHVycyovXFxuICAvKlJHQiovXFxuICAvKmJhY2tncm91bmQtaW1hZ2U6IHJhZGlhbC1ncmFkaWVudChyZ2JhKDI1NSwgNDIsIDAsIC41KSAxJSwgdHJhbnNwYXJlbnQgMjAwJSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDg2LCAyNTAsIDIsIC41KSAxJSwgdHJhbnNwYXJlbnQgMjAwJSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDAsIDcsIDI1NSwgMC42KSAxJSwgdHJhbnNwYXJlbnQgMTUwJSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDE2MXB4LCAxMzRweCwgMTg4cHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtNTRweCwgNTdweCwgNTVweDtcXG4gICovXFxuXFxuICAvKk1vbm9jaHJvbWUgLSBiZXR0ZXIgYmx1cnMqL1xcbi8qXFxuICBiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuNTYpIDAlLCByZ2JhKDksIDEsIDExMiwgMC4yNSkgNDglLCByZ2JhKDksIDEsIDExMiwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMC4xMikgOTQlKSwgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjU2KSAwJSwgcmdiYSg5LCAxLCAxMTIsIDAuMjUpIDQ4JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTIpIDk0JSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC41NikgMCUsIHJnYmEoOSwgMSwgMTEyLCAwLjI1KSA0OCUsIHJnYmEoOSwgMSwgMTEyLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwLjEyKSA5NCUpO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxODhweCAzNDdweCwgMTcwcHgsIDIwOXB4O1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTU0cHgsIDU3cHgsIDU1cHg7XFxuKi9cXG5cXG4uUGF0dGVybi5HcmVlbk92YWxzWHJheSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTMxYzBjO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogXFxuICAgIHJhZGlhbC1ncmFkaWVudChyZ2JhKDE4LCAwLCAyNTUsIDApIDAlLCByZ2JhKDMsIDE3OSwgMjU1LCAwLjA5KSA0OCUsIHJnYmEoMTk5LCAyMzcsIDQ0LCAwLjE5KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwKSA5NCUpLCBcXG4gICAgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwKSAwJSwgcmdiYSgyMDUsIDAsIDAsIDAuMDcpIDQ4JSwgcmdiYSgyNTQsIDIwNCwgMCwgMC4xMSkgNjUlLCByZ2JhKDI1NSwgMjEwLCA4LCAwKSA5NCUpLCBcXG4gICAgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjAxKSAwJSwgcmdiYSg4NSwgMjU1LCA1OSwgMC4wOCkgNDglLCByZ2JhKDE3NCwgMjAyLCAwLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwKSA5NCUpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDE4OHB4IDM0N3B4LCAxNzBweCwgMjA5cHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtNTRweCwgNTdweCwgNTVweDtcXG59XFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBQYXR0ZXJuIGV4dGVuZHMgVGhpbmcge1xuICBpbml0IChwcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGxlZnQ6ICcwcHgnLFxuICAgICAgdG9wOiAnMHB4JyxcbiAgICAgIGNvbG9yOiAnI2RkZCcsXG4gICAgICBwYXR0ZXJuOiAnR3JhcGhQYXBlcicsXG4gICAgICBjZWxsV2lkdGg6IDEwMCxcbiAgICAgIGNlbGxIZWlnaHQ6IDEwMCxcbiAgICAgIGxpbmVXaWR0aDogMlxuICAgIH07XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG4gICAgdGhpcy50eXBlID0gJ1BhdHRlcm4nO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHByb3BzLnBhdHRlcm4pO1xuICAgIGlmIChwcm9wcy5wYXR0ZXJuID09PSAnZ3JpZCcpIHtcbiAgICAgIHRoaXMuY3NzKCBQYXR0ZXJuLm1ha2VHcmlkQ1NTKHByb3BzLmNlbGxXaWR0aCwgcHJvcHMuY2VsbFdpZHRoLCBwcm9wcy5saW5lV2lkdGgpICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICAvLyByZW5kZXIgZmlyc3QsIHRoaXMgd2lsbCBzZXQgYSBwYXJlbnQgZWxlbWVudFxuICAgIHN1cGVyLnJlbmRlcigpO1xuICAgIC8vIHRoZW4gYWRqdXN0IHBhdHRlcm4gdG8gZmlsbCBwYXJlbnQgd2l0aCBhIHNxdWFyZSBhc3BlY3QgcmF0aW9cbiAgICB2YXIgc2l6ZSA9IE1hdGgubWF4KHRoaXMucGFyZW50LiRlbGVtZW50LndpZHRoKCksIHRoaXMucGFyZW50LiRlbGVtZW50LmhlaWdodCgpKTtcbiAgICB0aGlzLmNzcyh7d2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhdGljIG1ha2VHcmlkQ1NTIChjZWxsV2lkdGgsIGNlbGxIZWlnaHQsIGxpbmVXaWR0aCkge1xuICAgIHZhciBwcm9wcyA9IHt9O1xuICAgIHZhciBwb3MgPSAnLScgKyBsaW5lV2lkdGggKyAncHgnO1xuICAgIHByb3BzLmJhY2tncm91bmRTaXplID0gJycgKyBjZWxsV2lkdGggKyAncHggJyArIGNlbGxIZWlnaHQgKyAncHgsICcgKyBjZWxsV2lkdGggKyAncHggJyArIGNlbGxIZWlnaHQgKyAncHgnO1xuICAgIHByb3BzLmJhY2tncm91bmRQb3NpdGlvbiA9IHBvcyArICcgJyArIHBvcyArICcsJyArIHBvcyArICcgJyArIHBvcztcbiAgICBwcm9wcy5iYWNrZ3JvdW5kSW1hZ2UgPVxuICAgICAgJ2xpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAnICtsaW5lV2lkdGgrICdweCwgdHJhbnNwYXJlbnQgJyArbGluZVdpZHRoKyAncHgpLCcgK1xuICAgICAgJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSc7XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgc3RhdGljIGNzcyAoKSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoJy4vUGF0dGVybi5jc3MnKTtcbiAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoUGF0dGVybik7XG5cbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xudmFyIFRpbWVyID0gcmVxdWlyZSgnLi4vVGltZXIvVGltZXIuanMnKTtcblxuXG5jbGFzcyBQdWxzYXIgZXh0ZW5kcyBBY3Rpb24ge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHByb3BzID0gcHJvcHMgfHwge307XG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXHRcdHRoaXMuZGVsYXkgPSBwcm9wcy5kZWxheSB8fCAxMDAwO1xuXHRcdHRoaXMuVCA9IFRpbWVyLm1ha2Uoe2NhbGxiYWNrOiB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgZGVsYXk6IHRoaXMuZGVsYXl9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGdvICgpIHtcblx0XHR0aGlzLlQuZ28oKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHN0b3AgKCkge1xuXHRcdHRoaXMuVC5zdG9wKCk7XG5cdH1cblxuXHR0cmlnZ2VyICgpIHtcblx0XHR0aGlzLmNhbGxiYWNrKCk7XG5cdFx0dGhpcy5ULmdvKCk7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKFB1bHNhcik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHVsc2FyO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxudmFyIFBJID0gMy4xNDE1OTI2NTM1OTtcbnZhciBIQUxGUEkgPSBQSS8yLjA7XG5cbmNsYXNzIFJhbmQge1xuXHRzdGF0aWMgcmFuZEl0ZW0oYXJyKSB7XG5cdFx0aWYgKGFyciAmJiBhcnIubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGFyclsgUmFuZC5yYW5kSW50KDAsIGFyci5sZW5ndGgtMSkgXTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gKGluY2x1ZGVkKSBhbmQgbWF4IChpbmNsdWRlZClcblx0Ly8gVXNpbmcgTWF0aC5yb3VuZCgpIHdpbGwgZ2l2ZSB5b3UgYSBub24tdW5pZm9ybSBkaXN0cmlidXRpb24hXG5cdHN0YXRpYyByYW5kSW50KG1pbiwgbWF4KSB7XG5cdFx0bWluID0gTWF0aC5jZWlsKG1pbnx8MCk7XG5cdFx0bWF4ID0gTWF0aC5mbG9vcihtYXh8fDEpO1xuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gMCBhbmQgLjk5OTk5OVxuXHRzdGF0aWMgcmFuZEZsb2F0KCkge1xuXHQgICAgcmV0dXJuIE1hdGgucmFuZG9tKCk7XG5cdH1cblxuXHRzdGF0aWMgcmFuZFBlcmNlbnQodGhyZXNob2xkKSB7XG5cdFx0cmV0dXJuIFJhbmQucmFuZEludCgxLDEwMCkgPCB0aHJlc2hvbGQ7XG5cdH1cblxuXHQvLyByYW5kb20gaW50ZWdlciB3aXRoaW4gbWF4RGlzdGFuY2Ugb2YgdGFyZ2V0IChkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIHRhcmdldClcblx0c3RhdGljIHJhbmRDbG9zZVRvKHRhcmdldCwgbWF4RGlzdGFuY2UpIHtcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZE5vcm1hbCgpKTsgICAgLy8gY29uY2VudHJhdGVkIHRvd2FyZHMgY2VudGVyIDUwJSBvZiByYW5nZVxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kU2luMigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHNvbWV3aGF0IGNvbmNlbnRyYXRlZCB0b3dhcmRzIGNlbnRlciBcblx0XHRyZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogUmFuZC5yYW5kUG93MigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHdpdGggc2hhcnAgY29uY2VudHJhdGlvbiBhcm91bmQgY2VudGVyXG5cdH1cblxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXG5cdHN0YXRpYyByYW5kUG93KCkge1xuXHRcdHJldHVybiBNYXRoLnBvdygxLjAgLSBSYW5kLnJhbmRGbG9hdCgpLCA0KTtcblx0fVxuXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIHRvd2FyZCAxXG5cdHN0YXRpYyByYW5kU2luKCkge1xuXHRcdHJldHVybiBNYXRoLnNpbihSYW5kLnJhbmRGbG9hdCgpICogSEFMRlBJKTtcblx0fVxuXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXG5cdHN0YXRpYyByYW5kUG93MigpIHtcblx0XHRyZXR1cm4gUmFuZC5yYW5kUG93KCkgLSBSYW5kLnJhbmRQb3coKTtcblx0fVxuXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIDBcblx0c3RhdGljIHJhbmROb3JtYWwoKSB7XG5cdFx0cmV0dXJuICgoUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpKSAtIDMuMCkgLyAzLjA7XG5cdH1cblxuICAgIC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBjbG9zZXIgdG8gMFxuICAgIHN0YXRpYyByYW5kU2luMigpIHtcbiAgICAgICAgcmV0dXJuIFJhbmQucmFuZFNpbigpIC0gUmFuZC5yYW5kU2luKCk7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIGFycmF5IG9mIDMgaW50cywgZWFjaCAwLTI1NVxuICAgIHN0YXRpYyByYW5kUkdCKCkge1xuICAgICAgICByZXR1cm4gW1JhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSldO1xuICAgIH1cblxuICAgIHN0YXRpYyByYW5kUkdCc3RyKCkge1xuXHRcdHZhciByZ2IgPSBSYW5kLnJhbmRSR0IoKTtcbiAgICAgICAgcmV0dXJuICdyZ2JhKCcgK3JnYlswXSsgJywnICtyZ2JbMV0rICcsJyArcmdiWzJdKyAnLCAuOSknO1xuICAgIH1cbn1cblRoaW5nLmFkZENsYXNzKFJhbmQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmQ7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xudmFyIEJveCA9IHJlcXVpcmUoJy4uL0JveC9Cb3guanMnKTtcblxuLyoqXG4gKiAgdywgaCwgZGVwdGhcbiAqL1xuY2xhc3MgUm9vbSBleHRlbmRzIEJveCB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcblx0XHRcdHc6IDE1MDAsXG5cdFx0XHRoOiAxMDAwLFxuXHRcdFx0ZDogIDgwMCxcblx0XHRcdGJvcmRlcjogJzFweCBzb2xpZCBibGFjaycsXG5cdFx0XHRwZXJzcGVjdGl2ZTogJzEwMDAwcHgnXG5cdFx0fTtcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcblx0XHR0aGlzLncgPSBwcm9wcy53O1xuXHRcdHRoaXMuaCA9IHByb3BzLmg7XG5cdFx0dGhpcy5kID0gcHJvcHMuZDtcblx0XHR0aGlzLndhbGxzID0gW107XG5cblx0XHRzdXBlci5pbml0KHByb3BzKTtcblx0XHQvLyB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuXG5cdFx0dGhpcy50eXBlID0gJ1Jvb20nO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xuXHRcdHRoaXMuc2V0dXBSb29tKHRoaXMuJGVsZW1lbnQpO1xuXHR9XG5cblx0cmVuZGVyICgpIHtcblx0XHRzdXBlci5yZW5kZXIoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldHVwUm9vbSgpIHtcblx0XHR2YXIgcm9vbSA9IHRoaXM7XG5cdFx0dmFyIHdhbGxzID0gdGhpcy53YWxscztcblx0XHR2YXIgaGFsZkhlaWdodCA9IHRoaXMuaC8yO1xuXHRcdHZhciBoYWxmV2lkdGggPSB0aGlzLncvMjtcblx0XHR2YXIgaGFsZkRlcHRoID0gdGhpcy5kLzI7XG5cblx0XHR2YXIgd3JhcHBlciA9IEJveC5tYWtlKHtcblx0XHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRcdHpJbmRleDogMjAwMDAsXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxuXHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxcydcblx0XHR9KTtcblxuXHRcdC8vIElubmVyIGZhY2luZyB3YWxsc1xuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2Zyb250Jywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjIpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArIChoYWxmRGVwdGgpICsgJ3B4ICknXG5cdFx0fSkgKTtcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdiYWNrJywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMCwgMCwgLjUpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgncmlnaHQnLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDAsIDU1LCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnbGVmdCcsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgndG9wJywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgNTUsIDI1NSwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZkhlaWdodCAtIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnYm90dG9tJywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMjU1LCAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSkgKyAncHggKSdcblx0XHR9KSApO1xuXG5cdFx0Ly8gT3V0ZXIgZmFjaW5nIHdhbGxzXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0YmFjaycsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDEpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcblx0XHR9KSApO1xuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHJpZ2h0Jywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDEwMCwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoKGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkpICsgJ3B4ICknXG5cdFx0fSkgKTtcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRsZWZ0Jywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDEwMCwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKSdcblx0XHR9KSApO1xuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHRvcCcsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDEwMCwgMTAwLCAyMDAsIDEpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXG5cdFx0fSkgKTtcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRib3R0b20nLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDIwMCwgMTAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkhlaWdodCArIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICsgJ3B4ICknXG5cdFx0fSkgKTtcblxuXHRcdHdyYXBwZXIuYWRkKHdhbGxzKTtcblx0XHRyb29tLmFkZCh3cmFwcGVyKTtcblx0fVxuXG5cdG1ha2VXYWxsKHdoaWNoLCBjc3NWYWxzKSB7XG5cdFx0dmFyIGRlZmF1bHRDU1MgPSB7XG5cdFx0XHRkaXNwbGF5OiAnYmxvY2snLFxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRsaW5lSGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0Zm9udFNpemU6ICh0aGlzLmgvMykgKydweCcsXG5cdFx0XHRmb250V2VpZ2h0OiAnYm9sZCcsXG5cdFx0XHRjb2xvcjogJ3doaXRlJyxcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcicsXG5cdFx0XHRiYWNrZmFjZVZpc2liaWxpdHk6ICdoaWRkZW4nXG5cdFx0fTtcblx0XHR2YXIgd2FsbCA9IFRoaW5nLmNsYXNzZXMuQm94Lm1ha2UoJC5leHRlbmQoe30sIGRlZmF1bHRDU1MsIGNzc1ZhbHMpKTtcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKCd3YWxsJyk7XG5cdFx0d2FsbC4kZWxlbWVudC5hZGRDbGFzcyh3aGljaCk7XG5cdFx0d2FsbC4kZWxlbWVudC5hcHBlbmQod2hpY2gpO1xuXHRcdHdhbGwud2hpY2ggPSB3aGljaDtcblx0XHRyZXR1cm4gd2FsbDtcblx0fVxuXG5cdHNldHVwUm9vbU9sZCgkZWwpIHtcblx0XHR2YXIgJGNvbnRhaW5lciAgPSAkZWw7XG5cdFx0dmFyICRjdWJlICAgICAgID0gJGVsLmZpbmQoJyNjdWJlJyk7XG5cdFx0dmFyICRmYWNlRnJvbnQgID0gJGVsLmZpbmQoJyNjdWJlIC5mcm9udCAnKTtcblx0XHR2YXIgJGZhY2VCYWNrICAgPSAkZWwuZmluZCgnI2N1YmUgLmJhY2sgICcpO1xuXHRcdHZhciAkZmFjZVJpZ2h0ICA9ICRlbC5maW5kKCcjY3ViZSAucmlnaHQgJyk7XG5cdFx0dmFyICRmYWNlTGVmdCAgID0gJGVsLmZpbmQoJyNjdWJlIC5sZWZ0ICAnKTtcblx0XHR2YXIgJGZhY2VUb3AgICAgPSAkZWwuZmluZCgnI2N1YmUgLnRvcCAgICcpO1xuXHRcdHZhciAkZmFjZUJvdHRvbSA9ICRlbC5maW5kKCcjY3ViZSAuYm90dG9tJyk7XG5cblx0XHR2YXIgaGFsZkhlaWdodCA9IHRoaXMuaC8yO1xuXHRcdHZhciBoYWxmV2lkdGggPSB0aGlzLncvMjtcblx0XHR2YXIgaGFsZkRlcHRoID0gdGhpcy5kLzI7XG5cblx0XHQkY29udGFpbmVyLmNzcyh7XG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0bGVmdDogJzBweCcsXG5cdFx0XHR0b3A6ICcwcHgnLFxuXHRcdFx0cGVyc3BlY3RpdmU6ICc2MDAwcHgnLFxuXHRcdFx0ekluZGV4OiAyMDAwMFxuXHRcdH0pO1xuXG5cdFx0JGN1YmUuY3NzKHtcblx0XHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRcdHpJbmRleDogMjAwMDAsXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxuXHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxcydcblx0XHR9KTtcblxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlRnJvbnQsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIC4yKScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXG5cdFx0fSk7XG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VCYWNrLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsICAgMCwgICAwLCAuNSknLFxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtMTgwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xuXHRcdH0pO1xuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlUmlnaHQsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgICAwLCAgNTUsIC41KScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoICAgOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKScgIC8qIGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSAqL1xuXHRcdH0pO1xuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlTGVmdCwge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsICAgMCwgLjUpJyxcblx0XHQgIFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWSggIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJyAgLyogaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpICovXG5cdFx0fSk7XG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VUb3AsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgIDU1LCAyNTUsIC41KScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoICAgOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXG5cdFx0fSk7XG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VCb3R0b20sIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgMjU1LCAgIDAsIC41KScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoICAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSArICdweCApJ1xuXHRcdH0pO1xuXHR9XG5cblx0c2V0dXBGYWNlKCRmYWNlLCBjc3NWYWxzKSB7XG5cdFx0dmFyIGRlZmF1bHRDU1MgPSB7XG5cdFx0XHRkaXNwbGF5OiAnYmxvY2snLFxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRsaW5lSGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0Zm9udFNpemU6ICh0aGlzLmgvMykgKydweCcsXG5cdFx0XHRmb250V2VpZ2h0OiAnYm9sZCcsXG5cdFx0XHRjb2xvcjogJ3doaXRlJyxcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcblx0XHR9O1xuXHRcdCRmYWNlLmNzcygkLmV4dGVuZCh7fSwgZGVmYXVsdENTUywgY3NzVmFscykpO1xuXHR9XG5cblx0c3RhdGljIGNzcyAoKSB7XG5cdFx0Ly8gcmV0dXJuIHJlcXVpcmUoJy4vUm9vbS5jc3MnKTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoUm9vbSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUm9vbTtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIFRleHRQYW5lIGV4dGVuZHMgVGhpbmcge1xuICAgIGluaXQgKHByb3BzKSB7XG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgVmVyZGFuYSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxuICAgICAgICAgICAgZm9udFNpemU6ICcyNHB4JyxcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxuICAgICAgICAgICAgY29sb3I6ICdyZ2IoMjAwLCAyMDAsIDIwMCknLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgdzogMTAwLFxuICAgICAgICAgICAgaDogMTAwXG4gICAgICAgIH07XG4gICAgICAgIHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICAgICAgICBzdXBlci5pbml0KHByb3BzKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ1RleHRQYW5lJztcbiAgICAgICAgdGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG4gICAgfVxuXG4gICAgZmlsbFRleHQgKCkge1xuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKTtcbiAgICAgICAgdmFyIG1heCA9IDEwMDA7XG4gICAgICAgIHZhciAkc3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcbiAgICAgICAgdmFyIHNwYW5IZWlnaHQgPSAwO1xuXG4gICAgICAgIC8vIGVsZW1lbnQgaGFzIHRvIGJlIGFwcGVuZGVkIHRvIGJvZHkgcHJpb3IsIG9yIHNwYW5IZWlnaHQgd2lsbCBiZSAwXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYXBwZW5kKCRzcGFuKTtcbiAgICAgICAgd2hpbGUgKHNwYW5IZWlnaHQgPCBtYXhIZWlnaHQgJiYgbWF4LS0gPiAwKSB7XG4gICAgICAgICAgICAkc3Bhbi5hcHBlbmQodGhpcy50ZXh0KTtcbiAgICAgICAgICAgIHNwYW5IZWlnaHQgPSAkc3Bhbi5oZWlnaHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlciAoKSB7XG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xuICAgICAgICB0aGlzLmZpbGxUZXh0KHRoaXMudGV4dCk7XG4gICAgfVxufVxuXG5UaGluZy5hZGRDbGFzcyhUZXh0UGFuZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dFBhbmU7XG4iLCJ2YXIgZWxlbWVudENvdW50ZXIgPSAwO1xuXG5jbGFzcyBUaGluZyB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBpbml0IChwcm9wcykge1xuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG4gICAgdGhpcy50eXBlID0gJ1RoaW5nJztcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gIH1cblxuICBpbml0aWFsaXplIChwcm9wcykge1xuICAgIHByb3BzID0gcHJvcHMgfHwge307XG4gICAgLy8gQ1NTIHByb3BzIGdvIGludG8gdGhpcy5wcm9wc1xuICAgIHRoaXMucHJvcHMgPSBUaGluZy5jbGVhbnVwKHByb3BzKTtcbiAgICAvLyBrZWVwIHRoZXNlIHByb3BlcnRpZXMgb24gJ3RoaXMnXG4gICAgdGhpcy5yb3RhdGlvbiA9IHByb3BzLnJvdGF0ZSB8fCAwO1xuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBwcm9wcy5zY2FsZSB8fCAxO1xuICAgIHRoaXMueCA9IHByb3BzLnggfHwgMDtcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IDA7XG4gICAgdGhpcy4kZWxlbWVudCA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgcGFyZW50RWxlbWVudCA9ICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC4kZWxlbWVudCkgfHwgJChkb2N1bWVudC5ib2R5KTtcbiAgICBwYXJlbnRFbGVtZW50LmFwcGVuZCh0aGlzLiRlbGVtZW50KTtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh0aGlzLnByb3BzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxuICB1blJlbmRlciAoKSB7XG4gICAgaWYgKHRoaXMuJGVsZW1lbnQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBnZXREaW1lbnNpb25zICgpIHtcbiAgICByZXR1cm4ge3c6IHRoaXMuJGVsZW1lbnQud2lkdGgoKSwgaDogdGhpcy4kZWxlbWVudC5oZWlnaHQoKX07XG4gIH1cblxuICBnZXRCb3VuZGluZ0JveCAoKSB7XG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxuICAgIHZhciBzY3JvbGx0b3AgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcbiAgICB2YXIgc2Nyb2xsbGVmdCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcbiAgICB2YXIgYm91bmRzID0gdGhpcy4kZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogYm91bmRzLmxlZnQrc2Nyb2xsbGVmdCxcbiAgICAgIHk6IGJvdW5kcy50b3Arc2Nyb2xsdG9wLFxuICAgICAgdzogYm91bmRzLndpZHRoLFxuICAgICAgaDogYm91bmRzLmhlaWdodCxcbiAgICAgIGJvdHRvbTogYm91bmRzLmJvdHRvbStzY3JvbGx0b3AsXG4gICAgICByaWdodDogYm91bmRzLnJpZ2h0K3Njcm9sbGxlZnRcbiAgICB9O1xuICB9XG5cbiAgZ2V0UG9zaXRpb24gKCkge1xuICAgIC8vIHJlbGF0aXZlIHRvIHBhZ2VcbiAgICB2YXIgeHkgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpO1xuICAgIHZhciB6ID0gdGhpcy4kZWxlbWVudC5jc3MoJ3otaW5kZXgnKTtcbiAgICB6ID0geiA/IHBhcnNlSW50KHopIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBbeHkubGVmdCwgeHkudG9wLCB6XTtcbiAgfVxuXG4gIC8vIHJldHVybiB0aGUgZWxlbWVudCdzIENTUyB0cmFuc2Zvcm0gbWF0cml4IGFzIGFycmF5IG9mIDYgdmFsdWVzXG4gIGdldENTU1RyYW5zZm9ybSAoKSB7XG4gICAgdmFyIG1TdHIgPSB0aGlzLiRlbGVtZW50LmNzcygndHJhbnNmb3JtJykubWF0Y2goLy0/W1xcZFxcLl0rL2cpO1xuICAgIHZhciBtVmFsID0gW107XG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbVN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgbVZhbFtpXSA9IHBhcnNlRmxvYXQobVN0cltpXSk7XG4gICAgfVxuICAgIHJldHVybiBtVmFsOyAgXG4gIH1cblxuICByb3RhdGUgKGRlZ3JlZXMpIHtcbiAgICB0aGlzLnJvdGF0aW9uICs9IGRlZ3JlZXM7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJvdGF0ZVRvIChhbmdsZSkge1xuICAgIHRoaXMucm90YXRpb24gPSBhbmdsZTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2NhbGUgKGZhY3Rvcikge1xuICAgIHRoaXMuc2NhbGVGYWN0b3IgKz0gZmFjdG9yO1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzY2FsZVRvIChmYWN0b3IpIHtcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gZmFjdG9yO1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0cmFuc2xhdGUgKHgsIHkpIHtcbiAgICB0aGlzLnggKz0geDtcbiAgICB0aGlzLnkgKz0geTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdHJhbnNsYXRlVG8gKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRyYW5zZm9ybSAoKSB7XG4gICAgdGhpcy5jc3Moe1xuICAgICAgdHJhbnNmb3JtOiBUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGVGYWN0b3IsIHRoaXMueCwgdGhpcy55KVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY3NzIChwcm9wcykge1xuICAgIHRoaXMucHJvcHMgPSAkLmV4dGVuZCh0aGlzLnByb3BzLCBwcm9wcyk7XG4gICAgdGhpcy4kZWxlbWVudC5jc3MocHJvcHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaHRtbCAoKSB7XG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XG4gIH1cblxuICBzdGF0aWMgY3NzICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlICgpIHtcbiAgICB2YXIgY2xzID0gdGhpcztcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XG4gICAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBzdGF0aWMgYWRkQ2xhc3MgKGNscykge1xuICAgIFRoaW5nLmNsYXNzZXMgPSBUaGluZy5jbGFzc2VzIHx8IHt9O1xuICAgIFRoaW5nLmNsYXNzZXNbY2xzLm5hbWVdID0gY2xzO1xuXG4gICAgLy8gbG9hZCB0aGUgY2xhc3Mgc3R5bGVzICh0aGVzZSBhcmUgaW5jbHVkZWQgaW4gdGhlIGJ1bmRsZSBhdCBidWlsZCB0aW1lKVxuICAgIGNscy5jc3MgJiYgVGhpbmcuYWRkQ1NTU3RyaW5nKGNscy5jc3MoKSwgY2xzLm5hbWUpO1xuXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgY3NzIGZpbGUgYXQgbG9hZCB0aW1lXG4gICAgVGhpbmcuYWRkQ1NTRmlsZShjbHMubmFtZSArICcvJyArIGNscy5uYW1lICsgJy5jc3MnLCAnY3NzJytjbHMubmFtZSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0Q2xhc3MgKG5hbWUpIHtcbiAgICByZXR1cm4gVGhpbmcuY2xhc3Nlc1tuYW1lXTtcbiAgfVxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xuXG4gIHN0YXRpYyBtYWtlU3R5bGVzIChwcm9wcykge1xuICAgIHZhciBzdHlsZXMgPSBwcm9wcyB8fCB7fTtcbiAgICAkLmV4dGVuZChzdHlsZXMsIHtcbiAgICAgIC8vIGxlZnQ6IHByb3BzLmxlZnQgfHwgKHByb3BzLnggJiYgKHByb3BzLnggKyBcInB4XCIpKSxcbiAgICAgIC8vIHRvcDogcHJvcHMudG9wIHx8IChwcm9wcy55ICYmIChwcm9wcy55ICsgXCJweFwiKSksXG4gICAgICB3aWR0aDogcHJvcHMud2lkdGggfHwgKHByb3BzLncgJiYgKHByb3BzLncgKyBcInB4XCIpKSxcbiAgICAgIGhlaWdodDogcHJvcHMuaGVpZ2h0IHx8IChwcm9wcy5oICYmIChwcm9wcy5oICsgXCJweFwiKSksXG4gICAgICB6SW5kZXg6IHByb3BzLnpJbmRleCB8fCBwcm9wcy56LFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICB0cmFuc2Zvcm06IHByb3BzLnRyYW5zZm9ybSB8fCAoVGhpbmcubWFrZVRyYW5zZm9ybUNTUyhwcm9wcy5yb3RhdGUsIHByb3BzLnNjYWxlLCBwcm9wcy54LCBwcm9wcy55KSksXG4gICAgICBwb3NpdGlvbjogcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJ1xuICAgIH0pO1xuICAgIGRlbGV0ZSBzdHlsZXMucm90YXRlO1xuICAgIGRlbGV0ZSBzdHlsZXMuc2NhbGU7XG4gICAgZGVsZXRlIHN0eWxlcy54O1xuICAgIGRlbGV0ZSBzdHlsZXMueTtcbiAgICBkZWxldGUgc3R5bGVzLno7XG4gICAgZGVsZXRlIHN0eWxlcy53O1xuICAgIGRlbGV0ZSBzdHlsZXMuaDtcbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgc3RhdGljIG1ha2VUcmFuc2Zvcm1DU1MgKHJvdGF0ZSwgc2NhbGUsIHR4LCB0eSkge1xuICAgIHZhciB0cmFuc2Zvcm0gPSAnJztcbiAgICB0cmFuc2Zvcm0gKz0gKHR4IHx8IHR5KSA/IChUaGluZy5tYWtlVHJhbnNsYXRlQ1NTKHR4LCB0eSkgKyAnICcpIDogJyc7XG4gICAgdHJhbnNmb3JtICs9IFRoaW5nLmlzTnVtZXJpYyhyb3RhdGUpID8gKFRoaW5nLm1ha2VBbmdsZUNTUyhyb3RhdGUpICsgJyAnKSA6ICcnO1xuICAgIHRyYW5zZm9ybSArPSBzY2FsZSA/IChUaGluZy5tYWtlU2NhbGVDU1Moc2NhbGUpICsgJyAnKSA6ICcnO1xuICAgIHJldHVybiB0cmFuc2Zvcm07XG4gIH1cblxuICBzdGF0aWMgbWFrZUFuZ2xlQ1NTIChhbmdsZSkge1xuICAgIHJldHVybiAncm90YXRlKCcrYW5nbGUrJ2RlZyknO1xuICB9XG5cbiAgc3RhdGljIG1ha2VTY2FsZUNTUyAoc2NhbGUpIHtcbiAgICByZXR1cm4gJ3NjYWxlKCcrc2NhbGUrJyknO1xuICB9XG5cbiAgLy8gTk9URTogdHJhbnNsYXRpb24gY29vcmRzIGFyZSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCdzIHBvc2l0aW9uIGluIHRoZSBkb2N1bWVudCBmbG93LlxuICAvLyBUaGV5IGFyZSBub3QgdGhlIHNhbWUgYXMgc2V0dGluZyBsZWZ0L3RvcCB2YWx1ZXMsIHdoaWNoIGFyZSBhYnNvbHV0ZSBjb29yZGluYXRlc1xuICAvLyByZWxhdGl2ZSB0byB0aGUgcGFyZW50IGVsZW1lbnQuXG4gIHN0YXRpYyBtYWtlVHJhbnNsYXRlQ1NTICh4LCB5KSB7XG4gICAgeCA9IHggfHwgJzAnO1xuICAgIHkgPSB5IHx8ICcwJztcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnKyB4ICsgJ3B4LCAnICsgeSArJ3B4KSc7XG4gIH1cblxuICBzdGF0aWMgbWFrZUVsZW1lbnQgKGh0bWwsIHByb3BzLCB0eXBlKSB7XG4gICAgdmFyICRlbGVtZW50ID0gJChodG1sKVxuICAgICAgLmNzcyhUaGluZy5tYWtlU3R5bGVzKHByb3BzKSlcbiAgICAgIC5hZGRDbGFzcyh0eXBlIHx8ICdyYW5kb20nKVxuICAgICAgLmF0dHIoJ2lkJywgKHR5cGUgfHwgJ3JhbmRvbScpICsgKCsrZWxlbWVudENvdW50ZXIpKTtcbiAgICByZXR1cm4gJGVsZW1lbnQ7XG4gIH1cblxuICBzdGF0aWMgaXNOdW1lcmljKG4pIHtcbiAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIG5lY2Vzc2FyeSBDU1MgcHJvcGVydGllcyBhcmUgcHJlc2VudCBvciBkZWZhdWx0ZWQgdG8gc29tZXRoaW5nIHNhbmVcbiAgc3RhdGljIGNsZWFudXAgKHByb3BzKSB7XG4gICAgdmFyIGNwID0gcHJvcHMgfHwge307XG4gICAgY3AucG9zaXRpb24gPSBwcm9wcy5wb3NpdGlvbiB8fCAnYWJzb2x1dGUnOyAgIC8vIGRlZmF1bHQgdG8gYWJzb2x1dGUgcG9zaXRpb25pbmdcbiAgICAvLyBjcC54ID0gcHJvcHMueCB8fCBwcm9wcy5sZWZ0IHx8IDA7XG4gICAgLy8gY3AueSA9IHByb3BzLnkgfHwgcHJvcHMudG9wIHx8IDA7XG4gICAgLy8gY3AueiA9IHByb3BzLnogfHwgcHJvcHMuekluZGV4O1xuICAgIC8vIGNwLncgPSBwcm9wcy53IHx8IHByb3BzLndpZHRoO1xuICAgIC8vIGNwLmggPSBwcm9wcy5oIHx8IHByb3BzLmhlaWdodDtcbiAgICBjcC5yb3RhdGlvbiA9IHByb3BzLnJvdGF0aW9uIHx8IDA7XG4gICAgY3Auc2NhbGUgPSBwcm9wcy5zY2FsZSB8fCAxO1xuICAgIHJldHVybiBjcDtcbiAgfVxuXG4gIHN0YXRpYyBhZGRDU1NGaWxlKGZpbGVOYW1lLCBpZCkge1xuICAgICB2YXIgbGluayA9ICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cIicgKyBmaWxlTmFtZSArICdcIiBpZD1cIicgKyBpZCArICdcIj4nO1xuICAgICAkKCdoZWFkJykuZmluZCgnIycgKyBpZCkucmVtb3ZlKCk7XG4gICAgICQoJ2hlYWQnKS5hcHBlbmQobGluayk7XG4gIH1cblxuICBzdGF0aWMgYWRkQ1NTU3RyaW5nKGNzc1N0cmluZywgaWQpIHtcbiAgICBpZiAoY3NzU3RyaW5nKSB7XG4gICAgICAvLyB2YXIgZG9jID0gd2luZG93LmRvY3VtZW50O1xuICAgICAgdmFyIHN0eWxlRWwgPSAkKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+JyArY3NzU3RyaW5nKyAnPC9zdHlsZT4nKVxuICAgICAgICAuYXR0cignaWQnLCAoaWQgfHwgJ1RoaW5nJykgKyAnLXN0eWxlcycpO1xuICAgICAgJCgnaGVhZCcpLmFwcGVuZChzdHlsZUVsKTtcbiAgICB9XG4gIH1cblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG59XG5UaGluZy5hZGRDbGFzcyhUaGluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGhpbmc7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xudmFyIEFjdGlvbiA9IHJlcXVpcmUoJy4uL0FjdGlvbi9BY3Rpb24uanMnKTtcblxuY2xhc3MgVGltZXIgZXh0ZW5kcyBBY3Rpb24ge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHByb3BzID0gcHJvcHMgfHwge307XG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXHRcdHRoaXMuZGVsYXkgPSBwcm9wcy5kZWxheSB8fCAxMDAwO1xuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnbyAoKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XG5cdFx0dGhpcy50aW1lcklEID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLmRlbGF5KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHN0b3AgKCkge1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKFRpbWVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIFRyaWFuZ2xlIGV4dGVuZHMgVGhpbmcge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XG5cdFx0XHRzaXplOiAxMCxcblx0XHRcdGNvbG9yOiAnI0JBREE1NSdcblx0XHR9O1xuXHRcdHByb3BzID0gJC5leHRlbmQocHJvcHMsIGRlZmF1bHRQcm9wcyk7XG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcblx0XHR0aGlzLnR5cGUgPSAnVHJpYW5nbGUnO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xuXHRcdHRoaXMubWFrZVRyaWFuZ2xlKHRoaXMucHJvcHMuc2l6ZSwgdGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgZWxlbWVudCBiZWZvcmUgY2FsbGluZyB0aGlzXG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0bWFrZVRyaWFuZ2xlIChzaXplLCBjb2xvcikge1xuXHRcdGNvbG9yID0gY29sb3IgfHwgJyNCQURBNTUnO1xuXHRcdHNpemUgPSBzaXplIHx8IDEwO1xuXHRcdHRoaXMuY3NzKHtcblx0XHRcdHdpZHRoOiAwLCBcblx0XHRcdGhlaWdodDogMCwgXG5cdFx0XHRmb250U2l6ZTogMCxcblx0XHRcdGxpbmVIZWlnaHQ6IDAsXG5cdFx0XHRib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxuXHRcdFx0Ym9yZGVyVG9wOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50Jyxcblx0XHRcdGJvcmRlckxlZnQ6IHNpemUgKyAncHggc29saWQgJyArIGNvbG9yXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKFRyaWFuZ2xlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmlhbmdsZTtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcbnJlcXVpcmUoJy4vQm94L0JveC5qcycpO1xucmVxdWlyZSgnLi9BcnJvdy9BcnJvdy5qcycpO1xucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcbnJlcXVpcmUoJy4vQWN0aW9uL0FjdGlvbi5qcycpO1xucmVxdWlyZSgnLi9UaW1lci9UaW1lci5qcycpO1xucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcbnJlcXVpcmUoJy4vUHVsc2FyL1B1bHNhci5qcycpO1xucmVxdWlyZSgnLi9Eby9Eby5qcycpO1xucmVxdWlyZSgnLi9MYWJlbC9MYWJlbC5qcycpO1xucmVxdWlyZSgnLi9MaW5lL0xpbmUuanMnKTtcbnJlcXVpcmUoJy4vSW1nL0ltZy5qcycpO1xucmVxdWlyZSgnLi9QYXR0ZXJuL1BhdHRlcm4uanMnKTtcbnJlcXVpcmUoJy4vQkdJbWcvQkdJbWcuanMnKTtcbnJlcXVpcmUoJy4vVGV4dFBhbmUvVGV4dFBhbmUuanMnKTtcbnJlcXVpcmUoJy4vQ2lyY2xlL0NpcmNsZS5qcycpO1xucmVxdWlyZSgnLi9UcmlhbmdsZS9UcmlhbmdsZS5qcycpO1xucmVxdWlyZSgnLi9DdWJlL0N1YmUuanMnKTtcbnJlcXVpcmUoJy4vUm9vbS9Sb29tLmpzJyk7XG5cbndpbmRvdy5UaGluZyA9IFRoaW5nO1xuIl19
