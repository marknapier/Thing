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
module.exports = ".Pattern.GraphPaper {\n  background-color: #003;\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\n  background-image:\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\n}\n\n.Pattern.Grid {\n  background-size: 100px 100px, 100px 100px;\n  background-position: -2px -2px, -2px -2px;\n  background-image:\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\n}\n\n.Pattern.SofaDark {\n  background:\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\n  background-color: #300;\n  background-size: 25% 25%;\n}\n\n.Pattern.Sofa {\n  background:\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\n  background-color: #300;\n  background-size: 25% 25%;\n}\n\n.Pattern.YellowCirclesWithViolet {\n    background-image: radial-gradient(#ffd679 17%, #3d5443 17.5%, #3d5443 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3dabc7 12%, #49ab3c 13.5%, #38822e 14%, #ffdb89 14.5%, #ffdb89 19%, #fff57a 20%, #fcffb5 28%, #fffebd 29%);\n    background-size: 25%, 25%;\n    background-position: 0% 0%, 17% 17%;\n}\n\n.Pattern.YellowCirclesWithViolet2 {\n  background-image: radial-gradient(#ffdd90 17%, black 17.5%, black 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3cdada 17%, gray 17.5%, gray 18%, #ffdd90 19%, #ffdd90 24%, #ffff90 30%, #ffff90 36%);\n  background-size: 25%, 25%;\n  background-position: 0% 0%, 17% 17%;\n}\n\n.Pattern.PolkaDots {\n  background-image:\n    radial-gradient(white 15%, transparent 17%),\n    radial-gradient(white 15%, transparent 17%);\n  background-size: 60px 60px;\n  background-position: 0 0, 30px 30px;\n}\n\n.Pattern.PolkaDotsLarge {\n  background-image:\n    radial-gradient(white 15%, transparent 17%),\n    radial-gradient(white 15%, transparent 17%);\n  background-size: 10%;\n  background-position: 0 0, 50% 50%;\n}\n\n.Pattern.BlueBalls {\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\n  background-size: 25% 25%;\n}\n\n.Pattern.Stripes {\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\n  background-size: 15%;\n}\n\n.Pattern.StripesOchre {\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,205,25,1) 50%);\n  background-size: 15%;\n}\n\n.Pattern.StripesWhiteRedGreen {\n  background-image:\n    linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),\n    linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),\n    linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%);\n  background-position: 0%, 0%, 0%;\n  background-size: 15%, 15%, 15%;\n}\n\n.Pattern.PlaidRed {\n  background-color: hsl(0, 86%, 34%);\n  background-image:\n    repeating-linear-gradient(transparent,\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\n      rgba(0,60,0,.5) 232px, transparent 232px),\n    repeating-linear-gradient(270deg, transparent,\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\n      rgba(0,60,0,.5) 232px, transparent 232px),\n    repeating-linear-gradient(125deg, transparent,\n      transparent 2px, rgba(0,0,0,.2) 2px,\n      rgba(0,0,0,.2) 3px, transparent 3px,\n      transparent 5px, rgba(0,0,0,.2) 5px);\n}\n\n.Pattern.DiagonalStripes {\n  background-image: linear-gradient(45deg, black 25%, transparent 25.15%, transparent 50%, black 50.15%, black 75%, transparent 75.15%, transparent);\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\n        /* ie. 32% 16% for an element with w=100 h=200 */\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\n}\n\n.Pattern.DiagonalStripesViolet {\n  background-image: linear-gradient(45deg, #0f0035 25%, transparent 25.15%, transparent 50%, #0f0035 50.15%, #0f0035 75%, transparent 75.15%, transparent);\n  background-size: 6%;\n}\n\n.Pattern.BlueCascade {\n  background-color: #026873;\n  background-image: linear-gradient(91deg, rgba(255,255,25,0.17) 50%, transparent 51.5%),\n    linear-gradient(89deg, rgba(25,255,255,0.23) 50%, transparent 54.5%),\n    linear-gradient(90.5deg, transparent 50%, rgba(252, 255, 162, 0.37) 54.5%),\n    linear-gradient(90deg, transparent 50.75%, red 51%, red 51.5%, transparent 51.75%);\n  background-size: 5% 100%, 3% 100%, 9% 100%, 8% 100%;\n}\n\n /*Perlin Noise-ish radial blurs*/\n  /*RGB*/\n  /*background-image: radial-gradient(rgba(255, 42, 0, .5) 1%, transparent 200%), radial-gradient(rgba(86, 250, 2, .5) 1%, transparent 200%), radial-gradient(rgba(0, 7, 255, 0.6) 1%, transparent 150%);\n  background-size: 161px, 134px, 188px;\n  background-position: -54px, 57px, 55px;\n  */\n\n  /*Monochrome - better blurs*/\n/*\n  background-image: radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%);\n  background-size: 188px 347px, 170px, 209px;\n  background-position: -54px, 57px, 55px;\n*/\n\n.Pattern.GreenOvalsXray {\n  background-color: #131c0c;\n  background-image:\n    radial-gradient(rgba(18, 0, 255, 0) 0%, rgba(3, 179, 255, 0.09) 48%, rgba(199, 237, 44, 0.19) 65%, rgba(9, 1, 112, 0) 94%),\n    radial-gradient(rgba(9, 1, 112, 0) 0%, rgba(205, 0, 0, 0.07) 48%, rgba(254, 204, 0, 0.11) 65%, rgba(255, 210, 8, 0) 94%),\n    radial-gradient(rgba(9, 1, 112, 0.01) 0%, rgba(85, 255, 59, 0.08) 48%, rgba(174, 202, 0, 0.16) 65%, rgba(9, 1, 112, 0) 94%);\n    background-size: 188px 347px, 170px, 209px;\n  background-position: -54px, 57px, 55px;\n}\n";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9DdWJlL0N1YmUuaHRtbCIsInNyYy9saWIvQ3ViZS9DdWJlLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUm9vbS9Sb29tLmpzIiwic3JjL2xpYi9UZXh0UGFuZS9UZXh0UGFuZS5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9UcmlhbmdsZS9UcmlhbmdsZS5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgQWN0aW9uIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdH1cblxuXHRpbml0IChwcm9wcykge1xuXHRcdHRoaXMucHJvcHMgPSBwcm9wcyB8fCB7fTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGdvICgpIHtcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5nbygpJyk7XG5cdH1cblxuXHRzdG9wICgpIHtcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5zdG9wKCknKTtcblx0fVxuXG5cdHN0YXRpYyBtYWtlICgpIHtcblx0ICB2YXIgY2xzID0gdGhpcztcblx0ICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XG5cdCAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcblx0ICByZXR1cm4gaW5zdGFuY2U7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKEFjdGlvbik7XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi8qIHJlcXVpcmVkIGZvciBhcnJvdyAqL1xcbi5hcnJvdy1oZWFkIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxuICB3aWR0aDogMDsgXFxuICBoZWlnaHQ6IDA7IFxcbiAgYm9yZGVyLXRvcDogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1ib3R0b206IDMwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItbGVmdDogMzBweCBzb2xpZCBncmVlbjtcXG59XFxuXFxuLmFycm93LWJvZHkge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xcbiAgd2lkdGg6IDQwcHg7XFxuICBoZWlnaHQ6IDIwcHg7XFxuICBtYXJnaW46IDA7XFxuICBtYXJnaW4tdG9wOiAyMHB4O1xcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcXG4gIGJvcmRlci1sZWZ0OiAwO1xcbiAgYm9yZGVyLXJpZ2h0OiAwO1xcbn1cXG5cXG4uYXJyb3ctd3JhcHBlciB7XFxuICB3aWR0aDogNzBweDsgICAvKiBhcnJvdy1ib2R5IHdpZHRoICsgYXJyb3ctaGVhZCBib3JkZXIgd2lkdGggKi9cXG59XFxuXFxuLkFycm93IHtcXG4gIC8qIEZvciBzb21lIG5pY2UgYW5pbWF0aW9uIG9uIHRoZSByb3RhdGVzOiAqL1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuMnM7XFxuICAgICAtbW96LXRyYW5zaXRpb246ICAgIC1tb3otdHJhbnNmb3JtIC4ycztcXG4gICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgICB0cmFuc2Zvcm0gLjJzO1xcbn1cXG5cXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIEFycm93IGV4dGVuZHMgVGhpbmcge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG5cdFx0dGhpcy50eXBlID0gJ0Fycm93Jztcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3Ncblx0XHR0aGlzLnNldENvbG9yKHRoaXMucHJvcHMuY29sb3IpOyAgLy8gaGF2ZSB0byBtYWtlIGFycm93IGJlZm9yZSBjYWxsaW5nIHRoaXNcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0c3VwZXIucmVuZGVyKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRzZXRDb2xvciAoYykge1xuXHRcdHRoaXMuJGVsZW1lbnQuZmluZCgnLmFycm93LWhlYWQnKS5jc3Moe2JvcmRlckxlZnRDb2xvcjpjfSk7XG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctYm9keScpLmNzcyh7YmFja2dyb3VuZENvbG9yOmN9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGh0bWwgKCkge1xuXHRcdHJldHVybiBcIjxkaXY+PGRpdiBjbGFzcz0nYXJyb3ctd3JhcHBlcic+PGRpdiBjbGFzcz0nYXJyb3ctYm9keSc+PC9kaXY+PGRpdiBjbGFzcz0nYXJyb3ctaGVhZCc+PC9kaXY+PC9kaXY+PC9kaXY+XCI7XG5cdH1cblxuXHRzdGF0aWMgY3JlYXRlQXJyb3dFbGVtZW50ICgpIHtcblx0XHR2YXIgJGFycm93ID0gJChcIjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PlwiKTtcblx0XHRyZXR1cm4gJGFycm93O1xuXHR9XG5cblx0c3RhdGljIGNzcyAoKSB7XG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKEFycm93KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJvdztcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIEJHSW1nIGV4dGVuZHMgVGhpbmcge1xuICBpbml0IChwcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICB1cmw6ICcnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICBsZWZ0OiAnMHB4JyxcbiAgICAgIHRvcDogJzBweCdcbiAgICB9O1xuICAgIHByb3BzID0gdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuICAgIHRoaXMudHlwZSA9ICdCR0ltZyc7XG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIGJhY2tncm91bmQ6ICd1cmwoXCInICsgcHJvcHMudXJsICsgJ1wiKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgIGJhY2tncm91bmRTaXplOiAnY292ZXInICAvLzEwMCUgMTAwJSdcbiAgICB9KTtcbiAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoQkdJbWcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJHSW1nO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgQm94IGV4dGVuZHMgVGhpbmcge1xuICBpbml0IChwcm9wcykge1xuICBcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG4gIFx0dGhpcy50eXBlID0gJ0JveCc7XG4gIFx0dGhpcy5pdGVtcyA9IFtdO1xuICBcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgfVxuXG4gIGFkZCAoYWRkSXRlbXMpIHtcbiAgXHRpZiAoYWRkSXRlbXMpIHtcbiAgICAgIGlmICghKGFkZEl0ZW1zIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIGFkZEl0ZW1zID0gW2FkZEl0ZW1zXTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGk9MDsgaSA8IGFkZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuaXRlbXMucHVzaChhZGRJdGVtc1tpXSk7XG4gICAgICAgIGFkZEl0ZW1zW2ldLnBhcmVudCA9IHRoaXM7ICAgICAgICBcbiAgICAgIH1cbiAgXHR9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgaXRlbSBmcm9tIHRoaXMgYm94IChmcm9tIHRoZSBkb20gYW5kIHRoZSBpdGVtcyBsaXN0KVxuICByZW1vdmUgKGl0ZW0pIHtcbiAgXHRpZiAoaXRlbSkge1xuICBcdFx0dmFyIGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xuICBcdFx0aWYgKGluZGV4ID4gLTEpIHtcbiAgXHRcdCAgICB0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gIFx0XHRcdGl0ZW0uJGVsZW1lbnQucmVtb3ZlKCk7XG4gIFx0XHRcdGl0ZW0ucGFyZW50ID0gbnVsbDtcbiAgXHRcdH1cbiAgXHR9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBudW1FbGVtZW50cyAoKSB7XG4gIFx0cmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xuICB9XG5cbiAgZ2V0RWxlbWVudEJvdW5kcyAoKSB7XG4gICAgdmFyIGJvdW5kcyA9IHt4Ojk5OTk5OSwgeTo5OTk5OTksIGJvdHRvbTowLCByaWdodDowfTtcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9zID0gdGhpcy5pdGVtc1tpXS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgYm91bmRzLnggPSAocG9zLnggPCBib3VuZHMueCkgPyBwb3MueCA6IGJvdW5kcy54O1xuICAgICAgYm91bmRzLnkgPSAocG9zLnkgPCBib3VuZHMueSkgPyBwb3MueSA6IGJvdW5kcy55O1xuICAgICAgYm91bmRzLmJvdHRvbSA9IChwb3MuYm90dG9tID4gYm91bmRzLmJvdHRvbSkgPyBwb3MuYm90dG9tIDogYm91bmRzLmJvdHRvbTtcbiAgICAgIGJvdW5kcy5yaWdodCA9IChwb3MucmlnaHQgPiBib3VuZHMucmlnaHQpID8gcG9zLnJpZ2h0IDogYm91bmRzLnJpZ2h0O1xuICAgIH1cbiAgICBib3VuZHMudyA9IGJvdW5kcy5yaWdodCAtIGJvdW5kcy54O1xuICAgIGJvdW5kcy5oID0gYm91bmRzLmJvdHRvbSAtIGJvdW5kcy55O1xuICAgIHJldHVybiBib3VuZHM7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICBcdHN1cGVyLnJlbmRlcigpO1xuICBcdGZvciAodmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgXHRcdHRoaXMuaXRlbXNbaV0ucmVuZGVyKCk7XG4gIFx0fVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5UaGluZy5hZGRDbGFzcyhCb3gpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJveDtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIENpcmNsZSBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xuICAgICAgdGV4dDogJycsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgcjogMjUsXG4gICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxuICAgICAgZm9udFNpemU6ICcyNHB4JyxcbiAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgIGNvbG9yOiAnIzBmMCcsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMjIyJyxcbiAgICAgIGJvcmRlckNvbG9yOiAnI0JBREE1NScsXG4gICAgICBib3JkZXJXaWR0aDogNVxuICAgIH07XG5cbiAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcbiAgICBzdXBlci5pbml0KHByb3BzKTtcbiAgICB0aGlzLnR5cGUgPSAnQ2lyY2xlJztcbiAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xuXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG5cbiAgICAvLyBhcHBseSBjaXJjbGUgY3NzXG4gICAgdmFyIG9mZnNldCA9IHByb3BzLnIgKyBwcm9wcy5ib3JkZXJXaWR0aDtcbiAgICB0aGlzLmNzcyh7XG4gICAgICAgICdsZWZ0JzogJycgKyAocHJvcHMubGVmdC1vZmZzZXQpICsgJ3B4JyxcbiAgICAgICAgJ3RvcCc6ICcnICsgKHByb3BzLnRvcC1vZmZzZXQpICsgJ3B4JyxcbiAgICAgICAgJ3dpZHRoJzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxuICAgICAgICAnaGVpZ2h0JzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxuICAgICAgICAnbGluZUhlaWdodCc6ICcnICsgcHJvcHMucioyICsgJ3B4JyxcbiAgICAgICAgJ2JvcmRlcic6IHByb3BzLmJvcmRlcldpZHRoICsgJ3B4IHNvbGlkICcgKyBwcm9wcy5ib3JkZXJDb2xvcixcbiAgICAgICAgJ2JvcmRlclJhZGl1cyc6ICcxMDAwMHB4JyxcbiAgICAgICAgJ3RleHRBbGlnbic6ICdjZW50ZXInLFxuICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJ1xuICAgICAgfSk7XG5cbiAgICB0aGlzLnNldFRleHQodGhpcy50ZXh0KTtcbiAgfVxuXG4gIHNldFRleHQgKHR4dCkge1xuICAgIHRoaXMudGV4dCA9IHR4dDtcbiAgICB0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHR4dCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHN1cGVyLnJlbmRlcigpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5UaGluZy5hZGRDbGFzcyhDaXJjbGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENpcmNsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2PjxkaXYgaWQ9Y3ViZSBjbGFzcz1zaG93LWZyb250PjxmaWd1cmUgY2xhc3M9ZnJvbnQ+RjwvZmlndXJlPjxmaWd1cmUgY2xhc3M9YmFjaz5CPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz1yaWdodD5SPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz1sZWZ0Pkw8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPXRvcD5UPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz1ib3R0b20+RzwvZmlndXJlPjwvZGl2PjwvZGl2PlwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuLyoqXG4gKiAgdywgaCwgZGVwdGhcbiAqL1xuY2xhc3MgQ3ViZSBleHRlbmRzIFRoaW5nIHtcblx0aW5pdCAocHJvcHMpIHtcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xuXHRcdFx0dzogNTAwLFxuXHRcdFx0aDogNTAwLFxuXHRcdFx0ZDogNTAwXG5cdFx0fTtcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcblx0XHR0aGlzLncgPSBwcm9wcy53O1xuXHRcdHRoaXMuaCA9IHByb3BzLmg7XG5cdFx0dGhpcy5kID0gcHJvcHMuZDtcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuXHRcdHRoaXMudHlwZSA9ICdDdWJlJztcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3Ncblx0XHR0aGlzLnNldHVwQ3ViZSh0aGlzLiRlbGVtZW50KTtcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0c3VwZXIucmVuZGVyKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRzZXR1cEN1YmUoJGVsKSB7XG5cdFx0dmFyICRjb250YWluZXIgID0gJGVsO1xuXHRcdHZhciAkY3ViZSAgICAgICA9ICRlbC5maW5kKCcjY3ViZScpO1xuXHRcdHZhciAkZmFjZUZyb250ICA9ICRlbC5maW5kKCcjY3ViZSAuZnJvbnQgJyk7XG5cdFx0dmFyICRmYWNlQmFjayAgID0gJGVsLmZpbmQoJyNjdWJlIC5iYWNrICAnKTtcblx0XHR2YXIgJGZhY2VSaWdodCAgPSAkZWwuZmluZCgnI2N1YmUgLnJpZ2h0ICcpO1xuXHRcdHZhciAkZmFjZUxlZnQgICA9ICRlbC5maW5kKCcjY3ViZSAubGVmdCAgJyk7XG5cdFx0dmFyICRmYWNlVG9wICAgID0gJGVsLmZpbmQoJyNjdWJlIC50b3AgICAnKTtcblx0XHR2YXIgJGZhY2VCb3R0b20gPSAkZWwuZmluZCgnI2N1YmUgLmJvdHRvbScpO1xuXG5cdFx0dmFyIGhhbGZIZWlnaHQgPSB0aGlzLmgvMjtcblx0XHR2YXIgaGFsZldpZHRoID0gdGhpcy53LzI7XG5cdFx0dmFyIGhhbGZEZXB0aCA9IHRoaXMuZC8yO1xuXG5cdFx0JGNvbnRhaW5lci5jc3Moe1xuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdGxlZnQ6ICcwcHgnLFxuXHRcdFx0dG9wOiAnMHB4Jyxcblx0XHRcdHBlcnNwZWN0aXZlOiAnNjAwMHB4Jyxcblx0XHRcdHpJbmRleDogMjAwMDBcblx0XHR9KTtcblxuXHRcdCRjdWJlLmNzcyh7XG5cdFx0XHR3aWR0aDogJzEwMCUnLFxuXHRcdFx0aGVpZ2h0OiAnMTAwJScsXG5cdFx0XHR6SW5kZXg6IDIwMDAwLFxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHR0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJyxcblx0XHRcdHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMXMnXG5cdFx0fSk7XG5cblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUZyb250LCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAuMiknLFxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xuXHRcdH0pO1xuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlQmFjaywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoICAwLCAgIDAsICAgMCwgLjUpJyxcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcblx0XHR9KTtcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZVJpZ2h0LCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsICAgMCwgIDU1LCAuNSknLFxuXHRcdCAgXHR3aWR0aDogdGhpcy5kICsgJ3B4Jyxcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLCBcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWSggICA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJyAgLyogaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpICovXG5cdFx0fSk7XG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VMZWZ0LCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgICAwLCAuNSknLFxuXHRcdCAgXHR3aWR0aDogdGhpcy5kICsgJ3B4Jyxcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLCBcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWSggIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJyAgLyogaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpICovXG5cdFx0fSk7XG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VUb3AsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgIDU1LCAyNTUsIC41KScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsIFxuXHRcdCAgXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAgIDkwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xuXHRcdH0pO1xuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlQm90dG9tLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsIDI1NSwgICAwLCAuNSknLFxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLCBcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkhlaWdodCArIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICsgJ3B4ICknXG5cdFx0fSk7XG5cdH1cblxuXHRzZXR1cEZhY2UoJGZhY2UsIGNzc1ZhbHMpIHtcblx0XHR2YXIgZGVmYXVsdENTUyA9IHtcblx0XHRcdGRpc3BsYXk6ICdibG9jaycsXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdGxpbmVIZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0XHRmb250U2l6ZTogKHRoaXMuaC8zKSArJ3B4Jyxcblx0XHRcdGZvbnRXZWlnaHQ6ICdib2xkJyxcblx0XHRcdGNvbG9yOiAnd2hpdGUnLFxuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdH07XG5cdFx0JGZhY2UuY3NzKCQuZXh0ZW5kKHt9LCBkZWZhdWx0Q1NTLCBjc3NWYWxzKSk7XG5cdH1cblxuXHRodG1sICgpIHtcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9DdWJlLmh0bWwnKTtcblx0fVxuXG5cdHN0YXRpYyBjc3MgKCkge1xuXHRcdC8vIHJldHVybiByZXF1aXJlKCcuL0N1YmUuY3NzJyk7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKEN1YmUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEN1YmU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuLkRlbW9Cb3gge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbWFyZ2luOiAyMHB4O1xcbiAgd2lkdGg6IDIwMHB4OyBcXG4gIGhlaWdodDogMjAwcHg7IFxcbiAgYm9yZGVyOiAycHggZGFzaGVkICNlZWU7XFxufVxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcbnZhciBCb3ggPSByZXF1aXJlKCcuLi9Cb3gvQm94LmpzJyk7XG5cbmNsYXNzIERlbW9Cb3ggZXh0ZW5kcyBCb3gge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHByb3BzID0gcHJvcHMgfHwge307XG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XG5cdFx0cHJvcHMud2lkdGggPSBwcm9wcy53aWR0aCB8fCAyMDA7XG5cdFx0cHJvcHMuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0IHx8IDIwMDtcblx0XHRwcm9wcy5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cdFx0dGhpcy50eXBlID0gJ0RlbW9Cb3gnO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0c3VwZXIucmVuZGVyKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRzdGF0aWMgY3NzICgpIHtcblx0XHRyZXR1cm4gcmVxdWlyZSgnLi9EZW1vQm94LmNzcycpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhEZW1vQm94KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZW1vQm94O1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuLy8gTGlrZSBVbml4IHBpcGU6IG91dHB1dCBvZiBvbmUgY29tbWFuZCBpcyBpbnB1dCB0byB0aGUgbmV4dFxuLy8gRWFjaCBmdW5jdGlvbiB0YWtlcyBhICdwcm9wcycgb2JqZWN0IGFzIGFyZ3VtZW50XG4vLyBFYWNoIGZ1bmN0aW9uIHJldHVybnMgYW4gb2JqZWN0IHdpdGggcmVzdWx0cywgd2hpY2ggaXMgcGFzc2VkIGFzIHByb3BzIHRvIHRoZSBuZXh0XG4vLyBEbygpIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgZXhlY3V0ZSB0aGUgRG8gY2hhaW5cblxuLy8gUC5wdWxzZS5zZXRUbyhcbi8vICAgICBEbyhSLmdldFJhbmRvbU51bWJlciwge2Zyb206MCwgdG86MTB9KSAgIC8vIHJldHVybnM6ICB7ZGF0YTogOH1cbi8vICAgICAuRG8oQy5waWNrQ29sb3IpICAgIC8vIHJlYWRzIGlucHV0IDgsIHJldHVybnMge2RhdGE6ICcjY2ZmJ31cbi8vICAgICAuRG8oQi5jaGFuZ2VDb2xvcikgICAvLyByZWFkcyBpbnB1dCAnI2NmZicsIGNoYW5nZXMgY29sb3Igb24gQmxpbmtlclxuLy8gKTtcblxuXG5mdW5jdGlvbiBEbyhfYUZ1bmN0aW9uLCBfcHJvcHMsIF9maXJzdERvKSB7XG4gICAgdmFyIGFGdW5jdGlvbiA9IF9hRnVuY3Rpb247XG4gICAgdmFyIHByb3BzID0gX3Byb3BzO1xuICAgIHZhciBmaXJzdERvID0gX2ZpcnN0RG8gfHwgZXhlY3V0b3I7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnYWZ1bmN0aW9uPScsIGFGdW5jdGlvbik7XG4gICAgLy8gY29uc29sZS5sb2coJ3Byb3BzPScsIHByb3BzKTtcbiAgICAvLyBjb25zb2xlLmxvZygnZmlyc3REbz0nLCBmaXJzdERvKTtcblxuICAgIC8vIFJ1biB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzLlxuICAgIC8vIFBhc3MgdGhlIHJlc3VsdHMgdG8gdGhlIG5leHQgY2hhaW5lZCBmdW5jdGlvbiAoaWYgYW55KS5cbiAgICAvLyBSZXR1cm4gcmVzdWx0cyBvZiB0aGlzIGZ1bmN0aW9uIG9yIG9mIHRoZSBjaGFpblxuICAgIGZ1bmN0aW9uIGV4ZWN1dG9yIChwaXBlZFByb3BzKSB7XG4gICAgICAgIHZhciByZXR1cm5WYWwgPSBhRnVuY3Rpb24ocHJvcHMgfHwgcGlwZWRQcm9wcyk7XG4gICAgICAgIHJldHVybiAoZXhlY3V0b3IubmV4dERvID8gZXhlY3V0b3IubmV4dERvKHJldHVyblZhbCkgOiByZXR1cm5WYWwpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgbGFzdCAnRG8nIGluIHRoZSBjaGFpblxuICAgIGZ1bmN0aW9uIGdldExhc3REbyAoKSB7XG4gICAgICAgIHZhciB0bXBEbyA9IGZpcnN0RG87XG4gICAgICAgIHdoaWxlICh0bXBEby5uZXh0RG8pIHsgdG1wRG8gPSB0bXBEby5uZXh0RG87IH1cbiAgICAgICAgcmV0dXJuIHRtcERvO1xuICAgIH1cblxuICAgIC8vIEFkZCBhIG5ldyAnRG8nIHRvIHRoZSBlbmQgb2YgdGhlIGNoYWluLlxuICAgIGV4ZWN1dG9yLkRvID0gZnVuY3Rpb24gKGFGdW5jdGlvbiwgcHJvcHMpIHtcbiAgICAgICAgZ2V0TGFzdERvKCkubmV4dERvID0gRG8oYUZ1bmN0aW9uLCBwcm9wcywgZmlyc3REbyk7XG4gICAgICAgIHJldHVybiBmaXJzdERvOyAgLy8gQWx3YXlzIHJldHVybiB0aGUgZmlyc3QgJ0RvJyBpbiB0aGUgY2hhaW5cbiAgICB9O1xuXG4gICAgZXhlY3V0b3IubmV4dERvID0gbnVsbDtcblxuICAgIHJldHVybiBleGVjdXRvcjtcbn1cblxuVGhpbmcuRG8gPSBEbztcblxuLypcbi8vIGNoYWluZWQsIGVhY2ggRG8gaGFzIGl0cyBvd24gcGFyYW1ldGVyc1xudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpO30sIHthcmcxOidoZWxsbzEnfSlcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCB7YXJnMjonaGVsbG8gdG8gMjIyMjInfSlcblxuLy8gY2hhaW5lZCwgd2l0aCBmaXJzdCBEbyBwaXBpbmcgcmVzdWx0cyB0byBzZWNvbmQgRG9cbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwgbnVsbClcblxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTsgcmV0dXJuIHtuZXdQcm9wOnByb3BzLnBpcGVkcHJvcCsyfX0pXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDMnLCBwcm9wcyk7fSlcbiovXG5cbm1vZHVsZS5leHBvcnRzID0gRG87XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG4vKlxuICAgIHNyYzogPGZpbGUgcGF0aD5cbiAgICBjZW50ZXI6IHRydWV8ZmFsc2VcbiAgICBzaXplOiBjb250YWlufGNvdmVyfHN0cmV0Y2hcbiovXG5cbmNsYXNzIEltZyBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgICB2YXIgcGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFNZ0FBQURJQ0FZQUFBQ3RXSzZlQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUJWOUpSRUZVZUp6dDNjMXUzVVFjaCtGL0VCSzlBc1FDVldmVlFxNENiaHh1QTRFcXNTbWgrN0l1aTlRQ1F2STdZeCtQUDU5SDhpNnlabzdtemZna2xuMVhWWjhLZU5ZWGF3OEF0a3dnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ2VETEVUOTcxMjBVc0x5bU8wanNJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJTSs3Vk5WM2F3OWlRZmRWOVhydFFXelZwOGJqTEM1VjlYdFZQZFE1SXJtdnFnOVY5YTdPRlVuenVoZklQeTcxR01jdzU2TkhNc1F4elBkTWtRaGtwRXY5TjQ2alIvSTBqck5GSXBBUkx2VjhIRWVONUtVNHpoU0pRQnBkS3NkeHRFaXV4WEdXU0FUUzRGSnRjUndsa3RZNHpoQ0pRSzY0MUxnNC9oM0o5NHVQOW5aajR6aDZKQUlKTGpVdGpyMUdNaldPSTBjaWtCZGM2clk0OWhiSnJYRWNOUktCUE9OUzg4U3hsMGptaXVPSWtUVE4rV3kzbXJ5cXFxOW1QTjgzVmZWVGJUT1MrNnI2dWFxK252R2NyejRmcDNLbUhhVHFjVEUvMUh5L1ZiZTRrOHk5YzN5cXF2ZFY5V2JKU1hUbUVpczRjaVRpYUNPUUs0NFlpVGphQ2FSQmowaitySFVpRWNjNEFtbDBoRWpFTVo1QVJ0aHpKT0tZUmlBamZWK1BpM3BQa1loak9vRk1zS2RJZXNUeFI1MGpqaXFCVExhSFNNUnhPNEhjWU11UmlHTWVBcmxScjBqdWJ4aVRPT1lqa0Jsc0tSSnh6RXNnTTlsQ0pPS1luMEJtdEdZazR1aERJRE5iSXhKeDlDT1FEdTVydVVoNnhmRjJsazlpL3dUU3lSS1JpS00vZ1hUVU14SnhMRU1nbmZXSTVFT0pZeWtDV1VDUFNNU3hESUVzWkt1UmlDTVR5SUo2Zkc4UVIxOENXZGhXSW5rb2NiUVF5QXJXamtRYzdRU3lrclVpRWNjNEFsblIwcEdJWXp5QnJHeXBTTVF4alVBMm9IY2s0cGhPSUJ2Ukt4SngzS2JwY3o3YjA5MlA1bTd0QVp5QkhhU2ZKUzZ4OXZ6T3hEVzV4RnJaa2wvU1JUS2VRRmEweHA5NVJUS09RRmF5NWo4S1JkSk9JQ3ZZd3EwbUlta2prSVd0SFlkSXhoSElncllTaDBqYUNXUWhXNHRESkcwRXNvQ3R4aUdTNndUU1dZODRIcXJQaTBWRjhuOEM2YWhYSEcvcmNUR0xwRCtCZE5JempvRkkraE5JQjB2RU1SQkpYd0taMlpKeERFVFNqMEJtdEVZY0E1SDBJWkNackJuSFFDVHpFOGdNdGhESFFDVHpFc2lOdHZpVWRaSE1SeUEzMkdJY0E1SE1ReUFUYlRtT2dVaHVKNUFKOWhESFFDUzNFY2hJZTRwaklKTHBCRExDSHVNWWlHUWFnVFRhY3h3RGtZd25rQVpIaUdNZ2tuRUVja1d2T040c09Za25STkpPSU1FUjR4aUlwSTFBWG5Ea09BWWl1VTRnenpoREhJTmVrUnpsaWZKTmN6N2IwOTAvZmo3bThsQlZQMVRWcnpPZWN5Ni9WTldQOWZpSzZybDhyS3EvWmp6ZkxweHBCNm1xZWwxVjcrcTRPOGRUYyswa3YxWFZ0d3VQdlNlWFdNR3RrZXdsanNHdGtSd3RqaXFCWERVMWt2ZTFyemdHVXlNNVloeFZBbWt5TnBLOXhqRVlHOGxSNDZnU1NMUFdTUFlleDZBMWtpUEhVU1dRVWE1RmNwUTRCdGNpT1hvY1ZRSVo3YVZJamhiSDRLVkl6aEJIbFVBbWVSckpVZU1ZUEkza0xIRlVDV1N5SVpLanh6RVlJamxUSEZVQ3VjbnJPa2NjZzdkMXJqaXFHdGY5WGJVdmZpK3Q1MGlhMXYzWjdzV0NVUVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFIQlhWWi9XSGdSc2xSMEVBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFZ3I4QmlRVnpxOUx2MU9vQUFBQUFTVVZPUks1Q1lJST0nO1xuXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICBwcm9wcy5zcmMgPSBwcm9wcy5zcmMgfHwgcGxhY2Vob2xkZXI7XG4gICAgLy8gcHJvcHMuYmFja2dyb3VuZCA9ICd1cmwoXCInICsgcHJvcHMuc3JjICsgJ1wiKSBuby1yZXBlYXQgJyArIChwcm9wcy5jZW50ZXIgPyAnY2VudGVyJyA6ICdsZWZ0IHRvcCcpO1xuICAgIC8vIHByb3BzLmJhY2tncm91bmRTaXplID0gKHByb3BzLnNpemUgPT09ICdjb250YWluJyB8fCBwcm9wcy5zaXplID09PSAnY292ZXInID8gcHJvcHMuc2l6ZSA6IChwcm9wcy5zaXplPT09J3N0cmV0Y2gnID8gJzEwMCUgMTAwJScgOiB1bmRlZmluZWQpICk7XG5cbiAgICB0aGlzLnByb3BzID0gVGhpbmcuY2xlYW51cChwcm9wcyk7XG5cbiAgICB0aGlzLnR5cGUgPSAnSW1nJztcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gMTtcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc3JjID0gcHJvcHMuc3JjO1xuICAgIHRoaXMueCA9IHByb3BzLnggfHwgdW5kZWZpbmVkO1xuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgdW5kZWZpbmVkO1xuICAgIHRoaXMudyA9IHByb3BzLncgfHwgdW5kZWZpbmVkO1xuICAgIHRoaXMuaCA9IHByb3BzLmggfHwgdW5kZWZpbmVkO1xuXG4gICAgSW1nLmxvYWRpbmcodGhpcyk7XG4gICAgbG9hZEltYWdlKHByb3BzLnNyYywgdGhpcy5vbmxvYWQuYmluZCh0aGlzKSwgdGhpcy5vbmVycm9yLmJpbmQodGhpcykpO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZShwcm9wcyk7XG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xuICB9XG5cbiAgb25sb2FkIChpbWcpIHtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltYWdlIExvYWRlZDonLCBpbWcsIGltZy5zcmMsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSBpbWcuaGVpZ2h0IC8gaW1nLndpZHRoOyAgLy8gYXNwZWN0IHJhdGlvIG9mIG9yaWdpbmFsIGltYWdlXG4gICAgdGhpcy53ID0gdGhpcy53IHx8IGltZy53aWR0aDtcbiAgICB0aGlzLmggPSB0aGlzLmggfHwgKHRoaXMudyAqIHRoaXMuYXNwZWN0UmF0aW8pO1xuICAgIHRoaXMuY3NzKHtcbiAgICAgICAgd2lkdGg6IHRoaXMudyxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmgsXG4gICAgICAgIGJhY2tncm91bmQ6ICd1cmwoJyAraW1nLnNyYysgJykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xuICAgIH0pO1xuICAgIEltZy5sb2FkZWQodGhpcyk7XG4gIH1cblxuICBvbmVycm9yIChpbWcpIHtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ0ltZy5vbmVycm9yJywgaW1nLnNyYywgJ2ZhaWxlZCcpO1xuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgPSAwO1xuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSAxO1xuICAgIEltZy5sb2FkZWQodGhpcyk7XG4gIH1cblxuICBzZXRXaWR0aCAodykge1xuICAgIHRoaXMud2lkdGggPSB3O1xuICAgIHRoaXMuaGVpZ2h0ID0gdyAqIHRoaXMuYXNwZWN0UmF0aW87XG4gICAgdGhpcy5jc3Moe1xuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhdGljIGxvYWRpbmcgKGltZykge1xuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIklNRy5sb2FkaW5nKCk6XCIsIGltZy5zcmMpO1xuICAgIEltZy5xdWV1ZWRJbWdzID0gSW1nLnF1ZXVlZEltZ3MgfHwgW107XG4gICAgaWYgKGltZyAmJiAhaW1nLmxvYWRlZCkge1xuICAgICAgICBJbWcucXVldWVkSW1ncy5wdXNoKGltZyk7XG4gICAgfVxuICAgIHJldHVybiBJbWcucXVldWVkSW1ncy5sZW5ndGg7XG4gIH1cblxuICBzdGF0aWMgbG9hZGVkIChpbWcpIHtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coXCJJTUcubG9hZGVkKCk6XCIsIGltZy5zcmMsIEltZy5xdWV1ZWRJbWdzLmxlbmd0aCk7XG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcbiAgICBpZiAoaW1nICYmIGltZy5sb2FkZWQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gSW1nLnF1ZXVlZEltZ3MuaW5kZXhPZihpbWcpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgSW1nLnF1ZXVlZEltZ3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoSW1nLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBJbWcub25BbGxMb2FkZWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSW1nLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgc3RhdGljIG9uQWxsTG9hZGVkICgpIHtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coXCJJTUcub25BbGxMb2FkZWQoKTogdHJpZ2dlcmVkXCIpO1xuICB9XG5cbn1cblRoaW5nLmFkZENsYXNzKEltZyk7XG5cblxuZnVuY3Rpb24gbG9hZEltYWdlIChzcmMsIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsbGJhY2sodGhpcyk7XG4gICAgfTtcbiAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXJyb3JDYWxsYmFjayh0aGlzKTtcbiAgICB9O1xuICAgIGltZy5zcmMgPSBzcmM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1nO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgTGFiZWwgZXh0ZW5kcyBUaGluZyB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcblx0XHRcdGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXG5cdFx0XHRmb250U2l6ZTogJzE0cHgnLFxuXHRcdFx0Y29sb3I6ICcjMDAwJ1xuXHRcdH07XG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcblx0XHR0aGlzLnR5cGUgPSAnTGFiZWwnO1xuXHRcdHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG5cdFx0dGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy50ZXh0KTtcblx0fVxuXG5cdHNldFRleHQgKHR4dCkge1xuXHRcdHRoaXMudGV4dCA9IHR4dDtcblx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHR4dCk7XG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhMYWJlbCk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuLkxpbmUge1xcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxufVxcblxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgTGluZSBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgICAvLyBleHBlY3RpbmcgcHJvcHM6IHsgeDE6MCwgeTE6MCwgeDI6NTAsIHkyOjUwIH1cbiAgICBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgPSBwcm9wcyAmJiAocHJvcHMuYmFja2dyb3VuZENvbG9yIHx8IHByb3BzLmNvbG9yIHx8ICdibGFjaycpO1xuICAgIHN1cGVyLmluaXQocHJvcHMpO1xuICAgIHRoaXMudHlwZSA9ICdMaW5lJztcbiAgICB0aGlzLmxlbmd0aCA9IDEwO1xuICAgIHRoaXMud2lkdGggPSAxO1xuICAgIHRoaXMuYW5nbGUgPSAwO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHRoaXMudHlwZSk7XG4gICAgdGhpcy5jcmVhdGVMaW5lKHByb3BzLngxLCBwcm9wcy55MSwgcHJvcHMueDIsIHByb3BzLnkyLCBwcm9wcy53aWR0aCwgcHJvcHMuYXJyb3csIHByb3BzLnNob3J0ZW4pO1xuICB9XG5cbiAgY3JlYXRlTGluZSAoeDEseTEsIHgyLHkyLCB3aWR0aCwgYXJyb3csIHNob3J0ZW4pIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgMjtcbiAgICB0aGlzLmxlbmd0aCA9IE1hdGguc3FydCgoeDEteDIpKih4MS14MikgKyAoeTEteTIpKih5MS15MikpIC0gKGFycm93PyB0aGlzLndpZHRoKjIgOiAwKTsgIC8vIHNob3J0ZW4gdGhlIGxlbmd0aCB0byBtYWtlIHJvb20gZm9yIGFycm93aGVhZFxuICAgIHRoaXMuYW5nbGUgID0gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKSAqIDE4MCAvIE1hdGguUEk7XG4gICAgdGhpcy5sZW5ndGggLT0gc2hvcnRlbiB8fCAwOyAgLy8gc2hvcnRlbiB0aGUgbGluZSBhIGJpdCAobWFrZXMgcm9vbSBmb3IgYXJyb3doZWFkKVxuICAgIHRoaXMuY3NzKHtcbiAgICAgICAgJ2xlZnQnOiAnJyArIHgxICsgJ3B4JyxcbiAgICAgICAgJ3RvcCc6ICcnICsgKHkxLSh0aGlzLndpZHRoLzIpKSArICdweCcsXG4gICAgICAgICd3aWR0aCc6ICcnICsgdGhpcy5sZW5ndGggKyAncHgnLFxuICAgICAgICAnaGVpZ2h0JzogJycgKyB0aGlzLndpZHRoICsgJ3B4JyxcbiAgICAgICAgLy8gcm90YXRlIGFyb3VuZCBzdGFydCBwb2ludCBvZiBsaW5lXG4gICAgICAgICd0cmFuc2Zvcm0tb3JpZ2luJzogJzAgNTAlJ1xuICAgICAgfSk7XG4gICAgdGhpcy5yb3RhdGVUbyh0aGlzLmFuZ2xlKTtcbiAgICBpZiAoYXJyb3cpIHtcbiAgICAgIHRoaXMuYWRkQXJyb3dIZWFkKHRoaXMubGVuZ3RoLCB0aGlzLndpZHRoLCB0aGlzLndpZHRoKjIsIHRoaXMucHJvcHMuYmFja2dyb3VuZENvbG9yKTtcbiAgICB9XG4gIH1cblxuICAvLyBsZW4gb2YgbGluZSwgd2lkdGggb2YgbGluZSwgc2l6ZSBvZiB0cmlhbmdsZSAoaWUuIDEwIHdpbGwgYmUgMTBweCB3aWRlIGFuZCAyMHB4IGhpZ2gpXG4gIGFkZEFycm93SGVhZCAobGVuLCB3aWR0aCwgc2l6ZSwgY29sb3IpIHtcbiAgICB0aGlzLmFycm93SGVhZCA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgdGhpcy5hcnJvd0hlYWQuY3NzKHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6IDAsIFxuICAgICAgaGVpZ2h0OiAwLCBcbiAgICAgIGZvbnRTaXplOiAwLFxuICAgICAgbGluZUhlaWdodDogMCxcbiAgICAgIGxlZnQ6IGxlbiArICdweCcsXG4gICAgICB0b3A6IC0oc2l6ZS0od2lkdGgvMikpICsgJ3B4JyxcbiAgICAgIGJvcmRlckJvdHRvbTogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICBib3JkZXJUb3A6IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgYm9yZGVyTGVmdDogc2l6ZSArICdweCBzb2xpZCAnICsgY29sb3JcbiAgICB9KTtcbiAgICB0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHRoaXMuYXJyb3dIZWFkKTtcbiAgfVxuXG4gIHN0YXRpYyBjc3MgKCkge1xuICBcdHJldHVybiByZXF1aXJlKCcuL0xpbmUuY3NzJyk7XG4gIH1cbn1cblRoaW5nLmFkZENsYXNzKExpbmUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLlBhdHRlcm4uR3JhcGhQYXBlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAzO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHgsIDIwcHggMjBweCwgMjBweCAyMHB4O1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTJweCAtMnB4LCAtMnB4IC0ycHgsIC0xcHggLTFweCwgLTFweCAtMXB4O1xcbiAgYmFja2dyb3VuZC1pbWFnZTpcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC4zKSAxcHgsIHRyYW5zcGFyZW50IDFweCksXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMykgMXB4LCB0cmFuc3BhcmVudCAxcHgpO1xcbn1cXG5cXG4uUGF0dGVybi5HcmlkIHtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTAwcHggMTAwcHgsIDEwMHB4IDEwMHB4O1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTJweCAtMnB4LCAtMnB4IC0ycHg7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KTtcXG59XFxuXFxuLlBhdHRlcm4uU29mYURhcmsge1xcbiAgYmFja2dyb3VuZDpcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA5JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDklKSAwIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgMTAwJSwgMjclKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSAxMCUpIDUwJSA1MCUsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDMwJSwgMC44KSAyMCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgNTAlIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDMwJSwgMC44KSAyMCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgMCA1MCUsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSA1MCUgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDEwMCUgNTAlLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAxNSUsIDAuNyksIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgMCAwLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAxNSUsIDAuNyksIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgNTAlIDUwJSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMCxcXG4gICAgbGluZWFyLWdyYWRpZW50KC00NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzAwO1xcbiAgYmFja2dyb3VuZC1zaXplOiAyNSUgMjUlO1xcbn1cXG5cXG4uUGF0dGVybi5Tb2ZhIHtcXG4gIGJhY2tncm91bmQ6XFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgOTklLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA5JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDklKSAwIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgMTAwJSwgNDAlKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSAxMCUpIDUwJSA1MCUsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDQ2JSwgMC44KSAyMCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgNTAlIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDQxJSwgMC44KSAyMCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgMCA1MCUsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgMTAwJSwgMjMlKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDUwJSAwLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgMTAwJSA1MCUsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDk2JSwgNCUsIDAuNyksIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgMCAwLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAxNSUsIDAuNyksIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgNTAlIDUwJSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMCxcXG4gICAgbGluZWFyLWdyYWRpZW50KC00NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzAwO1xcbiAgYmFja2dyb3VuZC1zaXplOiAyNSUgMjUlO1xcbn1cXG5cXG4uUGF0dGVybi5ZZWxsb3dDaXJjbGVzV2l0aFZpb2xldCB7XFxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHJhZGlhbC1ncmFkaWVudCgjZmZkNjc5IDE3JSwgIzNkNTQ0MyAxNy41JSwgIzNkNTQ0MyAxOC4yJSwgIzNjZGFkYSAxOSUsICM2ZGU4ZTggMjQlLCAjZWRjYmZiIDMwJSwgdHJhbnNwYXJlbnQgMzYlKSwgcmFkaWFsLWdyYWRpZW50KCMzZGFiYzcgMTIlLCAjNDlhYjNjIDEzLjUlLCAjMzg4MjJlIDE0JSwgI2ZmZGI4OSAxNC41JSwgI2ZmZGI4OSAxOSUsICNmZmY1N2EgMjAlLCAjZmNmZmI1IDI4JSwgI2ZmZmViZCAyOSUpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDI1JSwgMjUlO1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSAwJSwgMTclIDE3JTtcXG59XFxuXFxuLlBhdHRlcm4uWWVsbG93Q2lyY2xlc1dpdGhWaW9sZXQyIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHJhZGlhbC1ncmFkaWVudCgjZmZkZDkwIDE3JSwgYmxhY2sgMTcuNSUsIGJsYWNrIDE4LjIlLCAjM2NkYWRhIDE5JSwgIzZkZThlOCAyNCUsICNlZGNiZmIgMzAlLCB0cmFuc3BhcmVudCAzNiUpLCByYWRpYWwtZ3JhZGllbnQoIzNjZGFkYSAxNyUsIGdyYXkgMTcuNSUsIGdyYXkgMTglLCAjZmZkZDkwIDE5JSwgI2ZmZGQ5MCAyNCUsICNmZmZmOTAgMzAlLCAjZmZmZjkwIDM2JSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSwgMjUlO1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCUgMCUsIDE3JSAxNyU7XFxufVxcblxcbi5QYXR0ZXJuLlBvbGthRG90cyB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICByYWRpYWwtZ3JhZGllbnQod2hpdGUgMTUlLCB0cmFuc3BhcmVudCAxNyUpLFxcbiAgICByYWRpYWwtZ3JhZGllbnQod2hpdGUgMTUlLCB0cmFuc3BhcmVudCAxNyUpO1xcbiAgYmFja2dyb3VuZC1zaXplOiA2MHB4IDYwcHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwIDAsIDMwcHggMzBweDtcXG59XFxuXFxuLlBhdHRlcm4uUG9sa2FEb3RzTGFyZ2Uge1xcbiAgYmFja2dyb3VuZC1pbWFnZTpcXG4gICAgcmFkaWFsLWdyYWRpZW50KHdoaXRlIDE1JSwgdHJhbnNwYXJlbnQgMTclKSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KHdoaXRlIDE1JSwgdHJhbnNwYXJlbnQgMTclKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTAlO1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCAwLCA1MCUgNTAlO1xcbn1cXG5cXG4uUGF0dGVybi5CbHVlQmFsbHMge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNhY2YgNzclLCByZ2JhKDg4LDk5LDI1NSwuODgpIDgwJSwgdHJhbnNwYXJlbnQgODMlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXG59XFxuXFxuLlBhdHRlcm4uU3RyaXBlcyB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgyNTUsMjU1LDI1LDEpIDUwJSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JTtcXG59XFxuXFxuLlBhdHRlcm4uU3RyaXBlc09jaHJlIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1NSwyMDUsMjUsMSkgNTAlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTUlO1xcbn1cXG5cXG4uUGF0dGVybi5TdHJpcGVzV2hpdGVSZWRHcmVlbiB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUxJSwgI2ZmZmZjOCA1MSUsICNmZmZmYzggNTklLCB0cmFuc3BhcmVudCA1OSUpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDQzJSwgI2YzMzA1NCA0MyUsICNmMzMwNTQgNjclLCB0cmFuc3BhcmVudCA2NyUpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICMwMjliNGYgMzQlLCAjMjYyNjI2IDM0JSwgIzI2MjYyNiA3NSUsICMwMjliNGYgNzUlKTtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAlLCAwJSwgMCU7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JSwgMTUlLCAxNSU7XFxufVxcblxcbi5QYXR0ZXJuLlBsYWlkUmVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA4NiUsIDM0JSk7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LFxcbiAgICAgIHRyYW5zcGFyZW50IDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUzcHgsIHRyYW5zcGFyZW50IDUzcHgsXFxuICAgICAgdHJhbnNwYXJlbnQgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjZweCwgdHJhbnNwYXJlbnQgNjZweCxcXG4gICAgICB0cmFuc3BhcmVudCAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjlweCwgcmdiYSgwLDYwLDAsLjUpIDE2OXB4LFxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE4MnB4LCByZ2JhKDAsNjAsMCwuNSkgMTgycHgsXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDIzMnB4LCB0cmFuc3BhcmVudCAyMzJweCksXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMjcwZGVnLCB0cmFuc3BhcmVudCxcXG4gICAgICB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LFxcbiAgICAgIHRyYW5zcGFyZW50IDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDY2cHgsIHRyYW5zcGFyZW50IDY2cHgsXFxuICAgICAgdHJhbnNwYXJlbnQgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY5cHgsIHJnYmEoMCw2MCwwLC41KSAxNjlweCxcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxODJweCwgcmdiYSgwLDYwLDAsLjUpIDE4MnB4LFxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAyMzJweCwgdHJhbnNwYXJlbnQgMjMycHgpLFxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDEyNWRlZywgdHJhbnNwYXJlbnQsXFxuICAgICAgdHJhbnNwYXJlbnQgMnB4LCByZ2JhKDAsMCwwLC4yKSAycHgsXFxuICAgICAgcmdiYSgwLDAsMCwuMikgM3B4LCB0cmFuc3BhcmVudCAzcHgsXFxuICAgICAgdHJhbnNwYXJlbnQgNXB4LCByZ2JhKDAsMCwwLC4yKSA1cHgpO1xcbn1cXG5cXG4uUGF0dGVybi5EaWFnb25hbFN0cmlwZXMge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBibGFjayAyNSUsIHRyYW5zcGFyZW50IDI1LjE1JSwgdHJhbnNwYXJlbnQgNTAlLCBibGFjayA1MC4xNSUsIGJsYWNrIDc1JSwgdHJhbnNwYXJlbnQgNzUuMTUlLCB0cmFuc3BhcmVudCk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDE2JSAxNiU7ICAvKiBtdXN0IG1hdGNoIGFzcGVjdCByYXRpbyBvZiBjb250YWluaW5nIGVsZW1lbnQgb3IgbGluZXMgd2lsbCBicmVhayAqL1xcbiAgICAgICAgLyogaWUuIDMyJSAxNiUgZm9yIGFuIGVsZW1lbnQgd2l0aCB3PTEwMCBoPTIwMCAqL1xcbiAgICAgICAgLyogUG93ZXJzIG9mIDIgd29yayBiZXN0IChvdGhlciB2YWx1ZXMsIGxpa2UgNyBvciAyMywgbWFrZSBqYWdneSBhbGlhc2luZykgKi9cXG59XFxuXFxuLlBhdHRlcm4uRGlhZ29uYWxTdHJpcGVzVmlvbGV0IHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg0NWRlZywgIzBmMDAzNSAyNSUsIHRyYW5zcGFyZW50IDI1LjE1JSwgdHJhbnNwYXJlbnQgNTAlLCAjMGYwMDM1IDUwLjE1JSwgIzBmMDAzNSA3NSUsIHRyYW5zcGFyZW50IDc1LjE1JSwgdHJhbnNwYXJlbnQpO1xcbiAgYmFja2dyb3VuZC1zaXplOiA2JTtcXG59XFxuXFxuLlBhdHRlcm4uQmx1ZUNhc2NhZGUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAyNjg3MztcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MWRlZywgcmdiYSgyNTUsMjU1LDI1LDAuMTcpIDUwJSwgdHJhbnNwYXJlbnQgNTEuNSUpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoODlkZWcsIHJnYmEoMjUsMjU1LDI1NSwwLjIzKSA1MCUsIHRyYW5zcGFyZW50IDU0LjUlKSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwLjVkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgyNTIsIDI1NSwgMTYyLCAwLjM3KSA1NC41JSksXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAuNzUlLCByZWQgNTElLCByZWQgNTEuNSUsIHRyYW5zcGFyZW50IDUxLjc1JSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDUlIDEwMCUsIDMlIDEwMCUsIDklIDEwMCUsIDglIDEwMCU7XFxufVxcblxcbiAvKlBlcmxpbiBOb2lzZS1pc2ggcmFkaWFsIGJsdXJzKi9cXG4gIC8qUkdCKi9cXG4gIC8qYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KHJnYmEoMjU1LCA0MiwgMCwgLjUpIDElLCB0cmFuc3BhcmVudCAyMDAlKSwgcmFkaWFsLWdyYWRpZW50KHJnYmEoODYsIDI1MCwgMiwgLjUpIDElLCB0cmFuc3BhcmVudCAyMDAlKSwgcmFkaWFsLWdyYWRpZW50KHJnYmEoMCwgNywgMjU1LCAwLjYpIDElLCB0cmFuc3BhcmVudCAxNTAlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTYxcHgsIDEzNHB4LCAxODhweDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC01NHB4LCA1N3B4LCA1NXB4O1xcbiAgKi9cXG5cXG4gIC8qTW9ub2Nocm9tZSAtIGJldHRlciBibHVycyovXFxuLypcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC41NikgMCUsIHJnYmEoOSwgMSwgMTEyLCAwLjI1KSA0OCUsIHJnYmEoOSwgMSwgMTEyLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwLjEyKSA5NCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuNTYpIDAlLCByZ2JhKDksIDEsIDExMiwgMC4yNSkgNDglLCByZ2JhKDksIDEsIDExMiwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMC4xMikgOTQlKSwgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjU2KSAwJSwgcmdiYSg5LCAxLCAxMTIsIDAuMjUpIDQ4JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTIpIDk0JSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDE4OHB4IDM0N3B4LCAxNzBweCwgMjA5cHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtNTRweCwgNTdweCwgNTVweDtcXG4qL1xcblxcbi5QYXR0ZXJuLkdyZWVuT3ZhbHNYcmF5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMzFjMGM7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICByYWRpYWwtZ3JhZGllbnQocmdiYSgxOCwgMCwgMjU1LCAwKSAwJSwgcmdiYSgzLCAxNzksIDI1NSwgMC4wOSkgNDglLCByZ2JhKDE5OSwgMjM3LCA0NCwgMC4xOSkgNjUlLCByZ2JhKDksIDEsIDExMiwgMCkgOTQlKSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwKSAwJSwgcmdiYSgyMDUsIDAsIDAsIDAuMDcpIDQ4JSwgcmdiYSgyNTQsIDIwNCwgMCwgMC4xMSkgNjUlLCByZ2JhKDI1NSwgMjEwLCA4LCAwKSA5NCUpLFxcbiAgICByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuMDEpIDAlLCByZ2JhKDg1LCAyNTUsIDU5LCAwLjA4KSA0OCUsIHJnYmEoMTc0LCAyMDIsIDAsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDApIDk0JSk7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogMTg4cHggMzQ3cHgsIDE3MHB4LCAyMDlweDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC01NHB4LCA1N3B4LCA1NXB4O1xcbn1cXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIFBhdHRlcm4gZXh0ZW5kcyBUaGluZyB7XG4gIGluaXQgKHByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgbGVmdDogJzBweCcsXG4gICAgICB0b3A6ICcwcHgnLFxuICAgICAgY29sb3I6ICcjZGRkJyxcbiAgICAgIHBhdHRlcm46ICdHcmFwaFBhcGVyJyxcbiAgICAgIGNlbGxXaWR0aDogMTAwLFxuICAgICAgY2VsbEhlaWdodDogMTAwLFxuICAgICAgbGluZVdpZHRoOiAyXG4gICAgfTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcbiAgICB0aGlzLnR5cGUgPSAnUGF0dGVybic7XG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MocHJvcHMucGF0dGVybik7XG4gICAgaWYgKHByb3BzLnBhdHRlcm4gPT09ICdncmlkJykge1xuICAgICAgdGhpcy5jc3MoIFBhdHRlcm4ubWFrZUdyaWRDU1MocHJvcHMuY2VsbFdpZHRoLCBwcm9wcy5jZWxsV2lkdGgsIHByb3BzLmxpbmVXaWR0aCkgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIC8vIHJlbmRlciBmaXJzdCwgdGhpcyB3aWxsIHNldCBhIHBhcmVudCBlbGVtZW50XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gICAgLy8gdGhlbiBhZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xuICAgIHZhciBzaXplID0gTWF0aC5tYXgodGhpcy5wYXJlbnQuJGVsZW1lbnQud2lkdGgoKSwgdGhpcy5wYXJlbnQuJGVsZW1lbnQuaGVpZ2h0KCkpO1xuICAgIHRoaXMuY3NzKHt3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdGF0aWMgbWFrZUdyaWRDU1MgKGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgbGluZVdpZHRoKSB7XG4gICAgdmFyIHByb3BzID0ge307XG4gICAgdmFyIHBvcyA9ICctJyArIGxpbmVXaWR0aCArICdweCc7XG4gICAgcHJvcHMuYmFja2dyb3VuZFNpemUgPSAnJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCwgJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCc7XG4gICAgcHJvcHMuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zICsgJyAnICsgcG9zICsgJywnICsgcG9zICsgJyAnICsgcG9zO1xuICAgIHByb3BzLmJhY2tncm91bmRJbWFnZSA9XG4gICAgICAnbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpICcgK2xpbmVXaWR0aCsgJ3B4LCB0cmFuc3BhcmVudCAnICtsaW5lV2lkdGgrICdweCksJyArXG4gICAgICAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC41KSAnICtsaW5lV2lkdGgrICdweCwgdHJhbnNwYXJlbnQgJyArbGluZVdpZHRoKyAncHgpJztcbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICBzdGF0aWMgY3NzICgpIHtcbiAgICByZXR1cm4gcmVxdWlyZSgnLi9QYXR0ZXJuLmNzcycpO1xuICB9XG59XG5UaGluZy5hZGRDbGFzcyhQYXR0ZXJuKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xuXG5cbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XG5cdFx0dGhpcy5UID0gVGltZXIubWFrZSh7Y2FsbGJhY2s6IHRoaXMudHJpZ2dlci5iaW5kKHRoaXMpLCBkZWxheTogdGhpcy5kZWxheX0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Z28gKCkge1xuXHRcdHRoaXMuVC5nbygpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c3RvcCAoKSB7XG5cdFx0dGhpcy5ULnN0b3AoKTtcblx0fVxuXG5cdHRyaWdnZXIgKCkge1xuXHRcdHRoaXMuY2FsbGJhY2soKTtcblx0XHR0aGlzLlQuZ28oKTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoUHVsc2FyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQdWxzYXI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG52YXIgUEkgPSAzLjE0MTU5MjY1MzU5O1xudmFyIEhBTEZQSSA9IFBJLzIuMDtcblxuY2xhc3MgUmFuZCB7XG5cdHN0YXRpYyByYW5kSXRlbShhcnIpIHtcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYXJyWyBSYW5kLnJhbmRJbnQoMCwgYXJyLmxlbmd0aC0xKSBdO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGluY2x1ZGVkKVxuXHQvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcblx0c3RhdGljIHJhbmRJbnQobWluLCBtYXgpIHtcblx0XHRtaW4gPSBNYXRoLmNlaWwobWlufHwwKTtcblx0XHRtYXggPSBNYXRoLmZsb29yKG1heHx8MSk7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG5cdH1cblxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAuOTk5OTk5XG5cdHN0YXRpYyByYW5kRmxvYXQoKSB7XG5cdCAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcblx0fVxuXG5cdHN0YXRpYyByYW5kUGVyY2VudCh0aHJlc2hvbGQpIHtcblx0XHRyZXR1cm4gUmFuZC5yYW5kSW50KDEsMTAwKSA8IHRocmVzaG9sZDtcblx0fVxuXG5cdC8vIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiBtYXhEaXN0YW5jZSBvZiB0YXJnZXQgKGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgdGFyZ2V0KVxuXHRzdGF0aWMgcmFuZENsb3NlVG8odGFyZ2V0LCBtYXhEaXN0YW5jZSkge1xuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXG5cdFx0Ly8gcmV0dXJuIHRhcmdldCArIChtYXhEaXN0YW5jZSAqIHJhbmRTaW4yKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgc29tZXdoYXQgY29uY2VudHJhdGVkIHRvd2FyZHMgY2VudGVyIFxuXHRcdHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiBSYW5kLnJhbmRQb3cyKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgd2l0aCBzaGFycCBjb25jZW50cmF0aW9uIGFyb3VuZCBjZW50ZXJcblx0fVxuXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcblx0c3RhdGljIHJhbmRQb3coKSB7XG5cdFx0cmV0dXJuIE1hdGgucG93KDEuMCAtIFJhbmQucmFuZEZsb2F0KCksIDQpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gMCBhbmQgMSwgZGlzdHJpYnV0ZWQgdG93YXJkIDFcblx0c3RhdGljIHJhbmRTaW4oKSB7XG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcblx0c3RhdGljIHJhbmRQb3cyKCkge1xuXHRcdHJldHVybiBSYW5kLnJhbmRQb3coKSAtIFJhbmQucmFuZFBvdygpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgMFxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcblx0XHRyZXR1cm4gKChSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkpIC0gMy4wKSAvIDMuMDtcblx0fVxuXG4gICAgLy8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGNsb3NlciB0byAwXG4gICAgc3RhdGljIHJhbmRTaW4yKCkge1xuICAgICAgICByZXR1cm4gUmFuZC5yYW5kU2luKCkgLSBSYW5kLnJhbmRTaW4oKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gYXJyYXkgb2YgMyBpbnRzLCBlYWNoIDAtMjU1XG4gICAgc3RhdGljIHJhbmRSR0IoKSB7XG4gICAgICAgIHJldHVybiBbUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KV07XG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRSR0JzdHIoKSB7XG5cdFx0dmFyIHJnYiA9IFJhbmQucmFuZFJHQigpO1xuICAgICAgICByZXR1cm4gJ3JnYmEoJyArcmdiWzBdKyAnLCcgK3JnYlsxXSsgJywnICtyZ2JbMl0rICcsIC45KSc7XG4gICAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoUmFuZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmFuZDtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xuXG4vKipcbiAqICB3LCBoLCBkZXB0aFxuICovXG5jbGFzcyBSb29tIGV4dGVuZHMgQm94IHtcblx0aW5pdCAocHJvcHMpIHtcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xuXHRcdFx0dzogMTUwMCxcblx0XHRcdGg6IDEwMDAsXG5cdFx0XHRkOiAgODAwLFxuXHRcdFx0Ym9yZGVyOiAnMXB4IHNvbGlkIGJsYWNrJyxcblx0XHRcdHBlcnNwZWN0aXZlOiAnaW5oZXJpdCcgIC8vICc4MDAwcHgnXG5cdFx0fTtcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcblx0XHR0aGlzLncgPSBwcm9wcy53O1xuXHRcdHRoaXMuaCA9IHByb3BzLmg7XG5cdFx0dGhpcy5kID0gcHJvcHMuZDtcblx0XHR0aGlzLndhbGxzID0ge307XG5cblx0XHRzdXBlci5pbml0KHByb3BzKTtcblx0XHQvLyB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuXG5cdFx0dGhpcy50eXBlID0gJ1Jvb20nO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xuXHRcdHRoaXMubWFrZVJvb20odGhpcy4kZWxlbWVudCk7XG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0bWFrZVJvb20oKSB7XG5cdFx0dmFyIHJvb20gPSB0aGlzO1xuXHRcdHZhciB3YWxscyA9IFtdO1xuXHRcdHZhciBoYWxmSGVpZ2h0ID0gdGhpcy5oLzI7XG5cdFx0dmFyIGhhbGZXaWR0aCA9IHRoaXMudy8yO1xuXHRcdHZhciBoYWxmRGVwdGggPSB0aGlzLmQvMjtcblxuXHRcdHZhciB3cmFwcGVyID0gQm94Lm1ha2Uoe1xuXHRcdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdFx0ekluZGV4OiAyMDAwMCxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0dHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCcsXG5cdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDFzJ1xuXHRcdH0pO1xuXG5cdFx0Ly8gSW5uZXIgZmFjaW5nIHdhbGxzXG5cdFx0Ly8gd2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnZnJvbnQnLCB7XG5cdFx0Ly8gXHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKScsXG5cdFx0Ly8gXHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHQvLyBcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHQvLyBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdC8vIH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnYmFjaycsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDEpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgncmlnaHQnLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDAsIDU1LCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnbGVmdCcsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgndG9wJywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgNTUsIDI1NSwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZkhlaWdodCAtIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnYm90dG9tJywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMjU1LCAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDg5ZGVnICkgdHJhbnNsYXRlWiggJyArICgtKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSkgKyAncHggKSdcblx0XHR9KSApO1xuXG5cdFx0Ly8gT3V0ZXIgZmFjaW5nIHdhbGxzXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0ZnJvbnQnLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwKScsXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVooICcgKyAoaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0YmFjaycsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDEpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcblx0XHR9KSApO1xuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHJpZ2h0Jywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDEwMCwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoKGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkpICsgJ3B4ICknXG5cdFx0fSkgKTtcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRsZWZ0Jywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDEwMCwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKSdcblx0XHR9KSApO1xuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHRvcCcsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDEwMCwgMTAwLCAyMDAsIDEpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXG5cdFx0fSkgKTtcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRib3R0b20nLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDIwMCwgMTAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkhlaWdodCArIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICsgJ3B4ICknXG5cdFx0fSkgKTtcblxuXHRcdC8vIGNvcHkgd2FsbHMgYXJyYXkgdG8gb2JqZWN0XG5cdFx0Zm9yICh2YXIgaT0wOyBpIDwgd2FsbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRoaXMud2FsbHNbIHdhbGxzW2ldLndoaWNoIF0gPSB3YWxsc1tpXTtcblx0XHR9XG5cblx0XHR3cmFwcGVyLmFkZCh3YWxscyk7XG5cdFx0cm9vbS5hZGQod3JhcHBlcik7XG5cdH1cblxuXHRtYWtlV2FsbCh3aGljaCwgY3NzVmFscykge1xuXHRcdHZhciBkZWZhdWx0Q1NTID0ge1xuXHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0Ly8gbGluZUhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdC8vIGZvbnRTaXplOiAodGhpcy5oLzMpICsncHgnLFxuXHRcdFx0Ly8gZm9udFdlaWdodDogJ2JvbGQnLFxuXHRcdFx0Ly8gdGV4dEFsaWduOiAnY2VudGVyJyxcblx0XHRcdC8vIGNvbG9yOiAnd2hpdGUnLFxuXHRcdFx0YmFja2ZhY2VWaXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdH07XG5cdFx0dmFyIHdhbGwgPSBUaGluZy5jbGFzc2VzLkJveC5tYWtlKCQuZXh0ZW5kKHt9LCBkZWZhdWx0Q1NTLCBjc3NWYWxzKSk7XG5cdFx0d2FsbC4kZWxlbWVudC5hZGRDbGFzcygnd2FsbCcpO1xuXHRcdHdhbGwuJGVsZW1lbnQuYWRkQ2xhc3Mod2hpY2gpO1xuXHRcdC8vIHdhbGwuJGVsZW1lbnQuYXBwZW5kKHdoaWNoKTtcblx0XHR3YWxsLndoaWNoID0gd2hpY2g7XG5cdFx0cmV0dXJuIHdhbGw7XG5cdH1cblxuXHRzdGF0aWMgY3NzICgpIHtcblx0XHQvLyByZXR1cm4gcmVxdWlyZSgnLi9Sb29tLmNzcycpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhSb29tKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb29tO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgVGV4dFBhbmUgZXh0ZW5kcyBUaGluZyB7XG4gICAgaW5pdCAocHJvcHMpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBWZXJkYW5hLCBBcmlhbCwgc2Fucy1zZXJpZicsXG4gICAgICAgICAgICBmb250U2l6ZTogJzI0cHgnLFxuICAgICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXG4gICAgICAgICAgICBjb2xvcjogJ3JnYigyMDAsIDIwMCwgMjAwKScsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICB3OiAxMDAsXG4gICAgICAgICAgICBoOiAxMDBcbiAgICAgICAgfTtcbiAgICAgICAgcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG4gICAgICAgIHN1cGVyLmluaXQocHJvcHMpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnVGV4dFBhbmUnO1xuICAgICAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xuICAgICAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcbiAgICB9XG5cbiAgICBmaWxsVGV4dCAoKSB7XG4gICAgICAgIHZhciBtYXhIZWlnaHQgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpO1xuICAgICAgICB2YXIgbWF4ID0gMTAwMDtcbiAgICAgICAgdmFyICRzcGFuID0gJCgnPHNwYW4+PC9zcGFuPicpO1xuICAgICAgICB2YXIgc3BhbkhlaWdodCA9IDA7XG5cbiAgICAgICAgLy8gZWxlbWVudCBoYXMgdG8gYmUgYXBwZW5kZWQgdG8gYm9keSBwcmlvciwgb3Igc3BhbkhlaWdodCB3aWxsIGJlIDBcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJHNwYW4pO1xuICAgICAgICB3aGlsZSAoc3BhbkhlaWdodCA8IG1heEhlaWdodCAmJiBtYXgtLSA+IDApIHtcbiAgICAgICAgICAgICRzcGFuLmFwcGVuZCh0aGlzLnRleHQpO1xuICAgICAgICAgICAgc3BhbkhlaWdodCA9ICRzcGFuLmhlaWdodCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyICgpIHtcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XG4gICAgICAgIHRoaXMuZmlsbFRleHQodGhpcy50ZXh0KTtcbiAgICB9XG59XG5cblRoaW5nLmFkZENsYXNzKFRleHRQYW5lKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0UGFuZTtcbiIsInZhciBlbGVtZW50Q291bnRlciA9IDA7XG5cbmNsYXNzIFRoaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGluaXQgKHByb3BzKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcbiAgICB0aGlzLnR5cGUgPSAnVGhpbmcnO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgfVxuXG4gIGluaXRpYWxpemUgKHByb3BzKSB7XG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICAvLyBDU1MgcHJvcHMgZ28gaW50byB0aGlzLnByb3BzXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xuICAgIC8vIGtlZXAgdGhlc2UgcHJvcGVydGllcyBvbiAndGhpcydcbiAgICB0aGlzLnJvdGF0aW9uID0gcHJvcHMucm90YXRlIHx8IDA7XG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IHByb3BzLnNjYWxlIHx8IDE7XG4gICAgdGhpcy54ID0gcHJvcHMueCB8fCAwO1xuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgMDtcbiAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xuICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kKHRoaXMuJGVsZW1lbnQpO1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHRoaXMucHJvcHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGVsZW1lbnQgZnJvbSBkb20gYW5kIG51bGwgaXQgb3V0XG4gIHVuUmVuZGVyICgpIHtcbiAgICBpZiAodGhpcy4kZWxlbWVudCkge1xuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldERpbWVuc2lvbnMgKCkge1xuICAgIHJldHVybiB7dzogdGhpcy4kZWxlbWVudC53aWR0aCgpLCBoOiB0aGlzLiRlbGVtZW50LmhlaWdodCgpfTtcbiAgfVxuXG4gIGdldEJvdW5kaW5nQm94ICgpIHtcbiAgICAvLyByZWxhdGl2ZSB0byBwYWdlXG4gICAgdmFyIHNjcm9sbHRvcCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xuICAgIHZhciBzY3JvbGxsZWZ0ID0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpO1xuICAgIHZhciBib3VuZHMgPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBib3VuZHMubGVmdCtzY3JvbGxsZWZ0LFxuICAgICAgeTogYm91bmRzLnRvcCtzY3JvbGx0b3AsXG4gICAgICB3OiBib3VuZHMud2lkdGgsXG4gICAgICBoOiBib3VuZHMuaGVpZ2h0LFxuICAgICAgYm90dG9tOiBib3VuZHMuYm90dG9tK3Njcm9sbHRvcCxcbiAgICAgIHJpZ2h0OiBib3VuZHMucmlnaHQrc2Nyb2xsbGVmdFxuICAgIH07XG4gIH1cblxuICBnZXRQb3NpdGlvbiAoKSB7XG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxuICAgIHZhciB4eSA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XG4gICAgdmFyIHogPSB0aGlzLiRlbGVtZW50LmNzcygnei1pbmRleCcpO1xuICAgIHogPSB6ID8gcGFyc2VJbnQoeikgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIFt4eS5sZWZ0LCB4eS50b3AsIHpdO1xuICB9XG5cbiAgLy8gcmV0dXJuIHRoZSBlbGVtZW50J3MgQ1NTIHRyYW5zZm9ybSBtYXRyaXggYXMgYXJyYXkgb2YgNiB2YWx1ZXNcbiAgZ2V0Q1NTVHJhbnNmb3JtICgpIHtcbiAgICB2YXIgbVN0ciA9IHRoaXMuJGVsZW1lbnQuY3NzKCd0cmFuc2Zvcm0nKS5tYXRjaCgvLT9bXFxkXFwuXSsvZyk7XG4gICAgdmFyIG1WYWwgPSBbXTtcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBtU3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBtVmFsW2ldID0gcGFyc2VGbG9hdChtU3RyW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIG1WYWw7ICBcbiAgfVxuXG4gIHJvdGF0ZSAoZGVncmVlcykge1xuICAgIHRoaXMucm90YXRpb24gKz0gZGVncmVlcztcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcm90YXRlVG8gKGFuZ2xlKSB7XG4gICAgdGhpcy5yb3RhdGlvbiA9IGFuZ2xlO1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzY2FsZSAoZmFjdG9yKSB7XG4gICAgdGhpcy5zY2FsZUZhY3RvciArPSBmYWN0b3I7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNjYWxlVG8gKGZhY3Rvcikge1xuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBmYWN0b3I7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRyYW5zbGF0ZSAoeCwgeSkge1xuICAgIHRoaXMueCArPSB4O1xuICAgIHRoaXMueSArPSB5O1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0cmFuc2xhdGVUbyAoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdHJhbnNmb3JtICgpIHtcbiAgICB0aGlzLmNzcyh7XG4gICAgICB0cmFuc2Zvcm06IFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1ModGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZUZhY3RvciwgdGhpcy54LCB0aGlzLnkpXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjc3MgKHByb3BzKSB7XG4gICAgdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHRoaXMucHJvcHMsIHByb3BzKTtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhwcm9wcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBodG1sICgpIHtcbiAgICByZXR1cm4gJzxkaXY+PC9kaXY+JztcbiAgfVxuXG4gIHN0YXRpYyBjc3MgKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc3RhdGljIG1ha2UgKCkge1xuICAgIHZhciBjbHMgPSB0aGlzO1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjbHMoKTtcbiAgICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIHN0YXRpYyBhZGRDbGFzcyAoY2xzKSB7XG4gICAgVGhpbmcuY2xhc3NlcyA9IFRoaW5nLmNsYXNzZXMgfHwge307XG4gICAgVGhpbmcuY2xhc3Nlc1tjbHMubmFtZV0gPSBjbHM7XG5cbiAgICAvLyBsb2FkIHRoZSBjbGFzcyBzdHlsZXMgKHRoZXNlIGFyZSBpbmNsdWRlZCBpbiB0aGUgYnVuZGxlIGF0IGJ1aWxkIHRpbWUpXG4gICAgY2xzLmNzcyAmJiBUaGluZy5hZGRDU1NTdHJpbmcoY2xzLmNzcygpLCBjbHMubmFtZSk7XG5cbiAgICAvLyBhZGQgYWRkaXRpb25hbCBjc3MgZmlsZSBhdCBsb2FkIHRpbWVcbiAgICBUaGluZy5hZGRDU1NGaWxlKGNscy5uYW1lICsgJy8nICsgY2xzLm5hbWUgKyAnLmNzcycsICdjc3MnK2Nscy5uYW1lKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDbGFzcyAobmFtZSkge1xuICAgIHJldHVybiBUaGluZy5jbGFzc2VzW25hbWVdO1xuICB9XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ1NTIG1hbmFnZW1lbnQgZnVuY3Rpb25zXG5cbiAgc3RhdGljIG1ha2VTdHlsZXMgKHByb3BzKSB7XG4gICAgdmFyIHN0eWxlcyA9IHByb3BzIHx8IHt9O1xuICAgICQuZXh0ZW5kKHN0eWxlcywge1xuICAgICAgLy8gbGVmdDogcHJvcHMubGVmdCB8fCAocHJvcHMueCAmJiAocHJvcHMueCArIFwicHhcIikpLFxuICAgICAgLy8gdG9wOiBwcm9wcy50b3AgfHwgKHByb3BzLnkgJiYgKHByb3BzLnkgKyBcInB4XCIpKSxcbiAgICAgIHdpZHRoOiBwcm9wcy53aWR0aCB8fCAocHJvcHMudyAmJiAocHJvcHMudyArIFwicHhcIikpLFxuICAgICAgaGVpZ2h0OiBwcm9wcy5oZWlnaHQgfHwgKHByb3BzLmggJiYgKHByb3BzLmggKyBcInB4XCIpKSxcbiAgICAgIHpJbmRleDogcHJvcHMuekluZGV4IHx8IHByb3BzLnosXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHByb3BzLmJhY2tncm91bmRDb2xvcixcbiAgICAgIHRyYW5zZm9ybTogcHJvcHMudHJhbnNmb3JtIHx8IChUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHByb3BzLnJvdGF0ZSwgcHJvcHMuc2NhbGUsIHByb3BzLngsIHByb3BzLnkpKSxcbiAgICAgIHBvc2l0aW9uOiBwcm9wcy5wb3NpdGlvbiB8fCAnYWJzb2x1dGUnXG4gICAgfSk7XG4gICAgZGVsZXRlIHN0eWxlcy5yb3RhdGU7XG4gICAgZGVsZXRlIHN0eWxlcy5zY2FsZTtcbiAgICBkZWxldGUgc3R5bGVzLng7XG4gICAgZGVsZXRlIHN0eWxlcy55O1xuICAgIGRlbGV0ZSBzdHlsZXMuejtcbiAgICBkZWxldGUgc3R5bGVzLnc7XG4gICAgZGVsZXRlIHN0eWxlcy5oO1xuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cblxuICBzdGF0aWMgbWFrZVRyYW5zZm9ybUNTUyAocm90YXRlLCBzY2FsZSwgdHgsIHR5KSB7XG4gICAgdmFyIHRyYW5zZm9ybSA9ICcnO1xuICAgIHRyYW5zZm9ybSArPSAodHggfHwgdHkpID8gKFRoaW5nLm1ha2VUcmFuc2xhdGVDU1ModHgsIHR5KSArICcgJykgOiAnJztcbiAgICB0cmFuc2Zvcm0gKz0gVGhpbmcuaXNOdW1lcmljKHJvdGF0ZSkgPyAoVGhpbmcubWFrZUFuZ2xlQ1NTKHJvdGF0ZSkgKyAnICcpIDogJyc7XG4gICAgdHJhbnNmb3JtICs9IHNjYWxlID8gKFRoaW5nLm1ha2VTY2FsZUNTUyhzY2FsZSkgKyAnICcpIDogJyc7XG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlQW5nbGVDU1MgKGFuZ2xlKSB7XG4gICAgcmV0dXJuICdyb3RhdGUoJythbmdsZSsnZGVnKSc7XG4gIH1cblxuICBzdGF0aWMgbWFrZVNjYWxlQ1NTIChzY2FsZSkge1xuICAgIHJldHVybiAnc2NhbGUoJytzY2FsZSsnKSc7XG4gIH1cblxuICAvLyBOT1RFOiB0cmFuc2xhdGlvbiBjb29yZHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBlbGVtZW50J3MgcG9zaXRpb24gaW4gdGhlIGRvY3VtZW50IGZsb3cuXG4gIC8vIFRoZXkgYXJlIG5vdCB0aGUgc2FtZSBhcyBzZXR0aW5nIGxlZnQvdG9wIHZhbHVlcywgd2hpY2ggYXJlIGFic29sdXRlIGNvb3JkaW5hdGVzXG4gIC8vIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudC5cbiAgc3RhdGljIG1ha2VUcmFuc2xhdGVDU1MgKHgsIHkpIHtcbiAgICB4ID0geCB8fCAnMCc7XG4gICAgeSA9IHkgfHwgJzAnO1xuICAgIHJldHVybiAndHJhbnNsYXRlKCcrIHggKyAncHgsICcgKyB5ICsncHgpJztcbiAgfVxuXG4gIHN0YXRpYyBtYWtlRWxlbWVudCAoaHRtbCwgcHJvcHMsIHR5cGUpIHtcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGh0bWwpXG4gICAgICAuY3NzKFRoaW5nLm1ha2VTdHlsZXMocHJvcHMpKVxuICAgICAgLmFkZENsYXNzKHR5cGUgfHwgJ3JhbmRvbScpXG4gICAgICAuYXR0cignaWQnLCAodHlwZSB8fCAncmFuZG9tJykgKyAoKytlbGVtZW50Q291bnRlcikpO1xuICAgIHJldHVybiAkZWxlbWVudDtcbiAgfVxuXG4gIHN0YXRpYyBpc051bWVyaWMobikge1xuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgbmVjZXNzYXJ5IENTUyBwcm9wZXJ0aWVzIGFyZSBwcmVzZW50IG9yIGRlZmF1bHRlZCB0byBzb21ldGhpbmcgc2FuZVxuICBzdGF0aWMgY2xlYW51cCAocHJvcHMpIHtcbiAgICB2YXIgY3AgPSBwcm9wcyB8fCB7fTtcbiAgICBjcC5wb3NpdGlvbiA9IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSc7ICAgLy8gZGVmYXVsdCB0byBhYnNvbHV0ZSBwb3NpdGlvbmluZ1xuICAgIC8vIGNwLnggPSBwcm9wcy54IHx8IHByb3BzLmxlZnQgfHwgMDtcbiAgICAvLyBjcC55ID0gcHJvcHMueSB8fCBwcm9wcy50b3AgfHwgMDtcbiAgICAvLyBjcC56ID0gcHJvcHMueiB8fCBwcm9wcy56SW5kZXg7XG4gICAgLy8gY3AudyA9IHByb3BzLncgfHwgcHJvcHMud2lkdGg7XG4gICAgLy8gY3AuaCA9IHByb3BzLmggfHwgcHJvcHMuaGVpZ2h0O1xuICAgIGNwLnJvdGF0aW9uID0gcHJvcHMucm90YXRpb24gfHwgMDtcbiAgICBjcC5zY2FsZSA9IHByb3BzLnNjYWxlIHx8IDE7XG4gICAgcmV0dXJuIGNwO1xuICB9XG5cbiAgc3RhdGljIGFkZENTU0ZpbGUoZmlsZU5hbWUsIGlkKSB7XG4gICAgIHZhciBsaW5rID0gJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiJyArIGZpbGVOYW1lICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XG4gICAgICQoJ2hlYWQnKS5maW5kKCcjJyArIGlkKS5yZW1vdmUoKTtcbiAgICAgJCgnaGVhZCcpLmFwcGVuZChsaW5rKTtcbiAgfVxuXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZCkge1xuICAgIGlmIChjc3NTdHJpbmcpIHtcbiAgICAgIC8vIHZhciBkb2MgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgICB2YXIgc3R5bGVFbCA9ICQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICtjc3NTdHJpbmcrICc8L3N0eWxlPicpXG4gICAgICAgIC5hdHRyKCdpZCcsIChpZCB8fCAnVGhpbmcnKSArICctc3R5bGVzJyk7XG4gICAgICAkKCdoZWFkJykuYXBwZW5kKHN0eWxlRWwpO1xuICAgIH1cbiAgfVxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbn1cblRoaW5nLmFkZENsYXNzKFRoaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaGluZztcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xuXG5jbGFzcyBUaW1lciBleHRlbmRzIEFjdGlvbiB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XG5cdFx0dGhpcy50aW1lcklEID0gbnVsbDtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGdvICgpIHtcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcblx0XHR0aGlzLnRpbWVySUQgPSBzZXRUaW1lb3V0KHRoaXMuY2FsbGJhY2ssIHRoaXMuZGVsYXkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c3RvcCAoKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XG5cdFx0dGhpcy50aW1lcklEID0gbnVsbDtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoVGltZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgVHJpYW5nbGUgZXh0ZW5kcyBUaGluZyB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcblx0XHRcdHNpemU6IDEwLFxuXHRcdFx0Y29sb3I6ICcjQkFEQTU1J1xuXHRcdH07XG5cdFx0cHJvcHMgPSAkLmV4dGVuZChwcm9wcywgZGVmYXVsdFByb3BzKTtcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuXHRcdHRoaXMudHlwZSA9ICdUcmlhbmdsZSc7XG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG5cdFx0dGhpcy5tYWtlVHJpYW5nbGUodGhpcy5wcm9wcy5zaXplLCB0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBlbGVtZW50IGJlZm9yZSBjYWxsaW5nIHRoaXNcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0c3VwZXIucmVuZGVyKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRtYWtlVHJpYW5nbGUgKHNpemUsIGNvbG9yKSB7XG5cdFx0Y29sb3IgPSBjb2xvciB8fCAnI0JBREE1NSc7XG5cdFx0c2l6ZSA9IHNpemUgfHwgMTA7XG5cdFx0dGhpcy5jc3Moe1xuXHRcdFx0d2lkdGg6IDAsIFxuXHRcdFx0aGVpZ2h0OiAwLCBcblx0XHRcdGZvbnRTaXplOiAwLFxuXHRcdFx0bGluZUhlaWdodDogMCxcblx0XHRcdGJvcmRlckJvdHRvbTogc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXG5cdFx0XHRib3JkZXJUb3A6IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxuXHRcdFx0Ym9yZGVyTGVmdDogc2l6ZSArICdweCBzb2xpZCAnICsgY29sb3Jcblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoVHJpYW5nbGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWFuZ2xlO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi9UaGluZy9UaGluZy5qcycpO1xucmVxdWlyZSgnLi9Cb3gvQm94LmpzJyk7XG5yZXF1aXJlKCcuL0Fycm93L0Fycm93LmpzJyk7XG5yZXF1aXJlKCcuL0RlbW9Cb3gvRGVtb0JveC5qcycpO1xucmVxdWlyZSgnLi9BY3Rpb24vQWN0aW9uLmpzJyk7XG5yZXF1aXJlKCcuL1RpbWVyL1RpbWVyLmpzJyk7XG5yZXF1aXJlKCcuL1JhbmQvUmFuZC5qcycpO1xucmVxdWlyZSgnLi9QdWxzYXIvUHVsc2FyLmpzJyk7XG5yZXF1aXJlKCcuL0RvL0RvLmpzJyk7XG5yZXF1aXJlKCcuL0xhYmVsL0xhYmVsLmpzJyk7XG5yZXF1aXJlKCcuL0xpbmUvTGluZS5qcycpO1xucmVxdWlyZSgnLi9JbWcvSW1nLmpzJyk7XG5yZXF1aXJlKCcuL1BhdHRlcm4vUGF0dGVybi5qcycpO1xucmVxdWlyZSgnLi9CR0ltZy9CR0ltZy5qcycpO1xucmVxdWlyZSgnLi9UZXh0UGFuZS9UZXh0UGFuZS5qcycpO1xucmVxdWlyZSgnLi9DaXJjbGUvQ2lyY2xlLmpzJyk7XG5yZXF1aXJlKCcuL1RyaWFuZ2xlL1RyaWFuZ2xlLmpzJyk7XG5yZXF1aXJlKCcuL0N1YmUvQ3ViZS5qcycpO1xucmVxdWlyZSgnLi9Sb29tL1Jvb20uanMnKTtcblxud2luZG93LlRoaW5nID0gVGhpbmc7XG4iXX0=
