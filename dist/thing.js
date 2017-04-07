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

},{"../Thing/Thing.js":24}],2:[function(require,module,exports){
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

},{"../Thing/Thing.js":24,"./Arrow.css":2}],4:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],5:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],6:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],7:[function(require,module,exports){
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

},{"../Thing/Thing.js":24,"./Cube.html":7}],9:[function(require,module,exports){
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

},{"../Box/Box.js":5,"../Thing/Thing.js":24,"./DemoBox.css":9}],11:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],12:[function(require,module,exports){
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
    loadImage(props.src, this.onload.bind(this), this.onError.bind(this));

    super.initialize(props);
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
  }

  onload (img) {
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

  onError (img) {
    Thing.msg('Img.onError: Failed to load ' + img.src);
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
    Img.queuedImgs = Img.queuedImgs || [];
    if (img && !img.loaded) {
        Img.queuedImgs.push(img);
    }
    return Img.queuedImgs.length;
  }

  static loaded (img) {
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
    Thing.msg("IMG.onAllLoaded(): triggered");
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

},{"../Thing/Thing.js":24}],13:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Label extends Thing {
	init (props) {
		var defaultProps = {
			text: '',
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
		this.$element.empty().text(txt);
	}

	render () {
		super.render();
	}
}
Thing.addClass(Label);

module.exports = Label;

},{"../Thing/Thing.js":24}],14:[function(require,module,exports){
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

  dashed (dashSize) {
    dashSize = dashSize===undefined ? 10 : dashSize;
    this.css({
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(90deg, transparent 30%, ' +this.props.backgroundColor+ ' 30%)',
      backgroundSize: dashSize + 'px'
    });
    return this;
  }

  static css () {
  	return require('./Line.css');
  }
}
Thing.addClass(Line);

module.exports = Line;

},{"../Thing/Thing.js":24,"./Line.css":14}],16:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class PatternPolkaDots extends Thing {
  init (props) {
    var defaultProps = {
      color: '#fffdd7',
      radius: 100,
      size: 500
    };
    props.radius = props.radius || props.size/5;
    this.props = props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'PatternPolkaDots';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    // polka dots background
    this.css({
      backgroundImage: 'radial-gradient(' +props.color+ ' ' +props.radius+ 'px, transparent ' +(props.radius+3)+ 'px), radial-gradient(' +props.color+ ' ' +props.radius+ 'px, transparent ' +(props.radius+3)+ 'px)',
      backgroundSize: props.size + 'px',
      backgroundPosition: '0 0, ' +(props.size/2)+ 'px ' +(props.size/2)+ 'px'
    });
  }

  render () {
    if (this.parent) {
      super.render();
      // Adjust pattern to fill parent with a square aspect ratio
      var size = Math.max(this.parent.$element.width(), this.parent.$element.height());
      this.css({
        position: 'absolute',
        left: '0px', top: '0px',
        width: size, height: size
      });
    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }

}
Thing.addClass(PatternPolkaDots);

module.exports = PatternPolkaDots;

},{"../Thing/Thing.js":24}],17:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class PatternStripes extends Thing {
  init (props) {
    var defaultProps = {
      color: 'rgba(255,205,25,1)',
      radius: 100,
      size: 500
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'PatternStripes';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    // stripes background
    this.css({
      backgroundImage: 'linear-gradient(90deg, transparent 50%, ' +props.color+ ' 50%)',
      backgroundSize: props.size + 'px'
    });
  }

  render () {
    if (this.parent) {
      super.render();
      // Adjust pattern to fill parent with a square aspect ratio
      var size = Math.max(this.parent.$element.width(), this.parent.$element.height());
      this.css({
        position: 'absolute',
        left: '0px', top: '0px',
        width: size, height: size
      });
    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }

}
Thing.addClass(PatternStripes);

module.exports = PatternStripes;

},{"../Thing/Thing.js":24}],18:[function(require,module,exports){
module.exports = ".Pattern.GraphPaper {\r\n  background-color: #003;\r\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\r\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\r\n  background-image:\r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\r\n}\r\n\r\n.Pattern.Grid {\r\n  background-size: 100px 100px, 100px 100px;\r\n  background-position: -2px -2px, -2px -2px;\r\n  background-image:\r\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\r\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\r\n}\r\n\r\n.Pattern.SofaDark {\r\n  background:\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Sofa {\r\n  background:\r\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.YellowCirclesWithViolet {\r\n    background-image: radial-gradient(#ffd679 17%, #3d5443 17.5%, #3d5443 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3dabc7 12%, #49ab3c 13.5%, #38822e 14%, #ffdb89 14.5%, #ffdb89 19%, #fff57a 20%, #fcffb5 28%, #fffebd 29%);\r\n    background-size: 25%, 25%;\r\n    background-position: 0% 0%, 17% 17%;\r\n}\r\n\r\n.Pattern.YellowCirclesWithViolet2 {\r\n  background-image: radial-gradient(#ffdd90 17%, black 17.5%, black 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3cdada 17%, gray 17.5%, gray 18%, #ffdd90 19%, #ffdd90 24%, #ffff90 30%, #ffff90 36%);\r\n  background-size: 25%, 25%;\r\n  background-position: 0% 0%, 17% 17%;\r\n}\r\n\r\n.Pattern.PolkaDots {\r\n  background-image:\r\n    radial-gradient(white 15%, transparent 17%),\r\n    radial-gradient(white 15%, transparent 17%);\r\n  background-size: 60px 60px;\r\n  background-position: 0 0, 30px 30px;\r\n}\r\n\r\n.Pattern.PolkaDotsLarge {\r\n  background-image:\r\n    radial-gradient(#fffdd7 100px, transparent 103px),\r\n    radial-gradient(#fffdd7 100px, transparent 103px);\r\n  background-size: 500px;\r\n  background-position: 0 0, 250px 250px;\r\n}\r\n\r\n.Pattern.PolkaDiamondsWhiteGreen {\r\n    background-image:\r\n      radial-gradient(#fffdd7 9px, transparent 103px),\r\n      radial-gradient(#fffdd7 111px, transparent 103px);\r\n    background-size: 200px;\r\n    background-position: 0 0, 100px 100px;\r\n}\r\n\r\n.Pattern.BlueBalls {\r\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\r\n  background-size: 25% 25%;\r\n}\r\n\r\n.Pattern.Stripes {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.StripesOchre {\r\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,205,25,1) 50%);\r\n  background-size: 15%;\r\n}\r\n\r\n.Pattern.StripesWhiteRedGreen {\r\n  background-image:\r\n    linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),\r\n    linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),\r\n    linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%);\r\n  background-position: 0%, 0%, 0%;\r\n  background-size: 15%, 15%, 15%;\r\n}\r\n\r\n.Pattern.PlaidRed {\r\n  background-color: hsl(0, 86%, 34%);\r\n  background-image:\r\n    repeating-linear-gradient(transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(270deg, transparent,\r\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\r\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\r\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\r\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\r\n      rgba(0,60,0,.5) 232px, transparent 232px),\r\n    repeating-linear-gradient(125deg, transparent,\r\n      transparent 2px, rgba(0,0,0,.2) 2px,\r\n      rgba(0,0,0,.2) 3px, transparent 3px,\r\n      transparent 5px, rgba(0,0,0,.2) 5px);\r\n}\r\n\r\n.Pattern.PlaidRedLarge {\r\n  background-color: hsl(0, 86%, 34%);\r\n  background-image:\r\n    repeating-linear-gradient(transparent,\r\n      transparent 200px, rgba(40,0,160,.4) 200px, rgba(40,0,160,.4) 212px, transparent 212px,\r\n      transparent 252px, rgba(40,0,160,.4) 252px, rgba(40,0,160,.4) 264px, transparent 264px,\r\n      transparent 464px, rgba(0,60,0,.5) 464px, rgba(0,60,0,.5) 664px, rgba(255,255,200,.3) 664px, rgba(255,255,200,.3) 676px, rgba(0,60,0,.5) 676px,\r\n      rgba(0,60,0,.5) 716px, rgba(255,255,200,.3) 716px, rgba(255,255,200,.3) 728px, rgba(0,60,0,.5) 728px,\r\n      rgba(0,60,0,.5) 928px, transparent 928px),\r\n    repeating-linear-gradient(270deg, transparent,\r\n      transparent 200px, rgba(40,0,160,.4) 200px, rgba(40,0,160,.4) 212px, transparent 212px,\r\n      transparent 252px, rgba(40,0,160,.4) 252px, rgba(40,0,160,.4) 264px, transparent 264px,\r\n      transparent 464px, rgba(0,60,0,.5) 464px, rgba(0,60,0,.5) 664px, rgba(255,255,200,.3) 664px, rgba(255,255,200,.3) 676px, rgba(0,60,0,.5) 676px,\r\n      rgba(0,60,0,.5) 716px, rgba(255,255,200,.3) 716px, rgba(255,255,200,.3) 728px, rgba(0,60,0,.5) 728px,\r\n      rgba(0,60,0,.5) 928px, transparent 928px),\r\n    repeating-linear-gradient(125deg, transparent,\r\n      transparent 8px, rgba(0,0,0,.2) 8px,\r\n      rgba(0,0,0,.2) 12px, transparent 12px,\r\n      transparent 20px, rgba(0,0,0,.2) 20px);\r\n}\r\n\r\n.Pattern.PlaidRedLargeX {\r\n  background-color: hsl(0, 86%, 34%);\r\n  background-image:\r\n    repeating-linear-gradient(transparent,\r\n      transparent 250px, rgba(40,0,160,.4) 250px, rgba(40,0,160,.4) 265px, transparent 265px,\r\n      transparent 315px, rgba(40,0,160,.4) 315px, rgba(40,0,160,.4) 330px, transparent 330px,\r\n      transparent 580px, rgba(0,60,0,.5) 580px, rgba(0,60,0,.5) 830px, rgba(255,255,200,.3) 830px, rgba(255,255,200,.3) 845px, rgba(0,60,0,.5) 845px,\r\n      rgba(0,60,0,.5) 895px, rgba(255,255,200,.3) 895px, rgba(255,255,200,.3) 910px, rgba(0,60,0,.5) 910px,\r\n      rgba(0,60,0,.5) 1160px, transparent 1160px),\r\n    repeating-linear-gradient(270deg, transparent,\r\n      transparent 250px, rgba(40,0,160,.4) 250px, rgba(40,0,160,.4) 265px, transparent 265px,\r\n      transparent 315px, rgba(40,0,160,.4) 315px, rgba(40,0,160,.4) 330px, transparent 330px,\r\n      transparent 580px, rgba(0,60,0,.5) 580px, rgba(0,60,0,.5) 830px, rgba(255,255,200,.3) 830px, rgba(255,255,200,.3) 845px, rgba(0,60,0,.5) 845px,\r\n      rgba(0,60,0,.5) 895px, rgba(255,255,200,.3) 895px, rgba(255,255,200,.3) 910px, rgba(0,60,0,.5) 910px,\r\n      rgba(0,60,0,.5) 1160px, transparent 1160px),\r\n    repeating-linear-gradient(125deg, transparent,\r\n      transparent 10px, rgba(0,0,0,.2) 10px,\r\n      rgba(0,0,0,.2) 15px, transparent 15px,\r\n      transparent 25px, rgba(0,0,0,.2) 25px);\r\n}\r\n\r\n.Pattern.DiagonalStripes {\r\n  background-image: linear-gradient(45deg, black 25%, transparent 25.15%, transparent 50%, black 50.15%, black 75%, transparent 75.15%, transparent);\r\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\r\n        /* ie. 32% 16% for an element with w=100 h=200 */\r\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\r\n}\r\n\r\n.Pattern.DiagonalStripesViolet {\r\n  background-image: linear-gradient(45deg, #0e0030 25%, transparent 25.15%, transparent 50%, #0e0030 50.15%, #0e0030 75%, transparent 75.15%, transparent);\r\n  background-size: 6%;\r\n}\r\n\r\n.Pattern.BlueCascade {\r\n  background-color: #026873;\r\n  background-image: linear-gradient(91deg, rgba(255,255,25,0.17) 50%, transparent 51.5%),\r\n    linear-gradient(89deg, rgba(25,255,255,0.23) 50%, transparent 54.5%),\r\n    linear-gradient(90.5deg, transparent 50%, rgba(252, 255, 162, 0.37) 54.5%),\r\n    linear-gradient(90deg, transparent 50.75%, red 51%, red 51.5%, transparent 51.75%);\r\n  background-size: 5% 100%, 3% 100%, 9% 100%, 8% 100%;\r\n}\r\n\r\n /*Perlin Noise-ish radial blurs*/\r\n  /*RGB*/\r\n  /*background-image: radial-gradient(rgba(255, 42, 0, .5) 1%, transparent 200%), radial-gradient(rgba(86, 250, 2, .5) 1%, transparent 200%), radial-gradient(rgba(0, 7, 255, 0.6) 1%, transparent 150%);\r\n  background-size: 161px, 134px, 188px;\r\n  background-position: -54px, 57px, 55px;\r\n  */\r\n\r\n  /*Monochrome - better blurs*/\r\n/*\r\n  background-image: radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%);\r\n  background-size: 188px 347px, 170px, 209px;\r\n  background-position: -54px, 57px, 55px;\r\n*/\r\n\r\n.Pattern.GreenOvalsXray {\r\n  background-color: #131c0c;\r\n  background-image:\r\n    radial-gradient(rgba(18, 0, 255, 0) 0%, rgba(3, 179, 255, 0.09) 48%, rgba(199, 237, 44, 0.19) 65%, rgba(9, 1, 112, 0) 94%),\r\n    radial-gradient(rgba(9, 1, 112, 0) 0%, rgba(205, 0, 0, 0.07) 48%, rgba(254, 204, 0, 0.11) 65%, rgba(255, 210, 8, 0) 94%),\r\n    radial-gradient(rgba(9, 1, 112, 0.01) 0%, rgba(85, 255, 59, 0.08) 48%, rgba(174, 202, 0, 0.16) 65%, rgba(9, 1, 112, 0) 94%);\r\n    background-size: 188px 347px, 170px, 209px;\r\n  background-position: -54px, 57px, 55px;\r\n}\r\n\r\n.Pattern.DarkDonuts {\r\n    background-image:\r\n      radial-gradient(black 10%, #fffdd7 60%, transparent 61%),\r\n      radial-gradient(#292929 1%, #fffdd7 50%, #fffdd7 62%, #4a4a4a 61%);\r\n    background-size: 800px;\r\n    background-position: 0 0, 400px 400px;\r\n}\r\n";

},{}],19:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Pattern extends Thing {
  init (props) {
    var defaultProps = {
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
    super.render();

    // Adjust pattern to fill parent with a square aspect ratio
    var size = Math.max(this.parent.$element.width(), this.parent.$element.height());
    this.css({
      position: 'absolute',
      left: '0px', top: '0px',
      width: size, height: size
    });

    // Tweak the size
    if (this.props.size) {
      this.css({backgroundSize: this.props.size + '%'});
    }

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

},{"../Thing/Thing.js":24,"./Pattern.css":18}],20:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":24,"../Timer/Timer.js":25}],21:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],22:[function(require,module,exports){
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

},{"../Box/Box.js":5,"../Thing/Thing.js":24}],23:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],24:[function(require,module,exports){
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
    transform += Thing.isNumeric(rotate) ? (Thing.makeRotationCSS(rotate) ) : '';
    transform += scale ? (Thing.makeScaleCSS(scale) + ' ') : '';
    return transform;
  }

  static makeRotationCSS (angle) {
    var css = '';
    if (angle !== undefined && angle !== null) {
      if (typeof angle === 'object') {
        $.each(angle, function (axisName, angle) {
          css += 'rotate' + axisName.toUpperCase() + '(' +angle+ 'deg) ';
        });
      }
      else {
        css = 'rotateZ('+angle+'deg) ';
      }
    }
    return css;
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

  static msg(s) {
    window.console.log(s);
  }
}
Thing.addClass(Thing);

module.exports = Thing;

},{}],25:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":24}],26:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],27:[function(require,module,exports){
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
require('./PatternPolkaDots/PatternPolkaDots.js');
require('./PatternStripes/PatternStripes.js');
require('./BGImg/BGImg.js');
require('./TextPane/TextPane.js');
require('./Circle/Circle.js');
require('./Triangle/Triangle.js');
require('./Cube/Cube.js');
require('./Room/Room.js');

window.Thing = Thing;

},{"./Action/Action.js":1,"./Arrow/Arrow.js":3,"./BGImg/BGImg.js":4,"./Box/Box.js":5,"./Circle/Circle.js":6,"./Cube/Cube.js":8,"./DemoBox/DemoBox.js":10,"./Do/Do.js":11,"./Img/Img.js":12,"./Label/Label.js":13,"./Line/Line.js":15,"./Pattern/Pattern.js":19,"./PatternPolkaDots/PatternPolkaDots.js":16,"./PatternStripes/PatternStripes.js":17,"./Pulsar/Pulsar.js":20,"./Rand/Rand.js":21,"./Room/Room.js":22,"./TextPane/TextPane.js":23,"./Thing/Thing.js":24,"./Timer/Timer.js":25,"./Triangle/Triangle.js":26}]},{},[27])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9DdWJlL0N1YmUuaHRtbCIsInNyYy9saWIvQ3ViZS9DdWJlLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuUG9sa2FEb3RzL1BhdHRlcm5Qb2xrYURvdHMuanMiLCJzcmMvbGliL1BhdHRlcm5TdHJpcGVzL1BhdHRlcm5TdHJpcGVzLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUm9vbS9Sb29tLmpzIiwic3JjL2xpYi9UZXh0UGFuZS9UZXh0UGFuZS5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9UcmlhbmdsZS9UcmlhbmdsZS5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb24ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxuXHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMucHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uZ28oKScpO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5zdG9wKCknKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBtYWtlICgpIHtcclxuXHQgIHZhciBjbHMgPSB0aGlzO1xyXG5cdCAgdmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xyXG5cdCAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcclxuXHQgIHJldHVybiBpbnN0YW5jZTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQWN0aW9uKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLyogcmVxdWlyZWQgZm9yIGFycm93ICovXFxyXFxuLmFycm93LWhlYWQge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXHJcXG4gIHdpZHRoOiAwOyBcXHJcXG4gIGhlaWdodDogMDsgXFxyXFxuICBib3JkZXItdG9wOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWJvdHRvbTogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1sZWZ0OiAzMHB4IHNvbGlkIGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uYXJyb3ctYm9keSB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxuICB3aWR0aDogNDBweDtcXHJcXG4gIGhlaWdodDogMjBweDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxyXFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDA7XFxyXFxuICBib3JkZXItcmlnaHQ6IDA7XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy13cmFwcGVyIHtcXHJcXG4gIHdpZHRoOiA3MHB4OyAgIC8qIGFycm93LWJvZHkgd2lkdGggKyBhcnJvdy1oZWFkIGJvcmRlciB3aWR0aCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uQXJyb3cge1xcclxcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxyXFxufVxcclxcblxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEFycm93IGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0Fycm93JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy5zZXRDb2xvcih0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBhcnJvdyBiZWZvcmUgY2FsbGluZyB0aGlzXHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHNldENvbG9yIChjKSB7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1oZWFkJykuY3NzKHtib3JkZXJMZWZ0Q29sb3I6Y30pO1xyXG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctYm9keScpLmNzcyh7YmFja2dyb3VuZENvbG9yOmN9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0aHRtbCAoKSB7XHJcblx0XHRyZXR1cm4gXCI8ZGl2PjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PjwvZGl2PlwiO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNyZWF0ZUFycm93RWxlbWVudCAoKSB7XHJcblx0XHR2YXIgJGFycm93ID0gJChcIjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PlwiKTtcclxuXHRcdHJldHVybiAkYXJyb3c7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3NzICgpIHtcclxuXHRcdHJldHVybiByZXF1aXJlKCcuL0Fycm93LmNzcycpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhBcnJvdyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFycm93O1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQkdJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHVybDogJycsXHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgbGVmdDogJzBweCcsXHJcbiAgICAgIHRvcDogJzBweCdcclxuICAgIH07XHJcbiAgICBwcm9wcyA9IHRoaXMucHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0JHSW1nJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcclxuICAgICAgYmFja2dyb3VuZDogJ3VybChcIicgKyBwcm9wcy51cmwgKyAnXCIpIG5vLXJlcGVhdCBjZW50ZXInLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogJ2NvdmVyJyAgLy8xMDAlIDEwMCUnXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQkdJbWcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR0ltZztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEJveCBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gIFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuICBcdHRoaXMudHlwZSA9ICdCb3gnO1xyXG4gIFx0dGhpcy5pdGVtcyA9IFtdO1xyXG4gIFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgYWRkIChhZGRJdGVtcykge1xyXG4gIFx0aWYgKGFkZEl0ZW1zKSB7XHJcbiAgICAgIGlmICghKGFkZEl0ZW1zIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgICAgYWRkSXRlbXMgPSBbYWRkSXRlbXNdO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAodmFyIGk9MDsgaSA8IGFkZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGFkZEl0ZW1zW2ldKTtcclxuICAgICAgICBhZGRJdGVtc1tpXS5wYXJlbnQgPSB0aGlzOyAgICAgICAgXHJcbiAgICAgIH1cclxuICBcdH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSB0aGlzIGJveCAoZnJvbSB0aGUgZG9tIGFuZCB0aGUgaXRlbXMgbGlzdClcclxuICByZW1vdmUgKGl0ZW0pIHtcclxuICBcdGlmIChpdGVtKSB7XHJcbiAgXHRcdHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKTtcclxuICBcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuICBcdFx0ICAgIHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICBcdFx0XHRpdGVtLiRlbGVtZW50LnJlbW92ZSgpO1xyXG4gIFx0XHRcdGl0ZW0ucGFyZW50ID0gbnVsbDtcclxuICBcdFx0fVxyXG4gIFx0fVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBudW1FbGVtZW50cyAoKSB7XHJcbiAgXHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50Qm91bmRzICgpIHtcclxuICAgIHZhciBib3VuZHMgPSB7eDo5OTk5OTksIHk6OTk5OTk5LCBib3R0b206MCwgcmlnaHQ6MH07XHJcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPCAxKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3MgPSB0aGlzLml0ZW1zW2ldLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgIGJvdW5kcy54ID0gKHBvcy54IDwgYm91bmRzLngpID8gcG9zLnggOiBib3VuZHMueDtcclxuICAgICAgYm91bmRzLnkgPSAocG9zLnkgPCBib3VuZHMueSkgPyBwb3MueSA6IGJvdW5kcy55O1xyXG4gICAgICBib3VuZHMuYm90dG9tID0gKHBvcy5ib3R0b20gPiBib3VuZHMuYm90dG9tKSA/IHBvcy5ib3R0b20gOiBib3VuZHMuYm90dG9tO1xyXG4gICAgICBib3VuZHMucmlnaHQgPSAocG9zLnJpZ2h0ID4gYm91bmRzLnJpZ2h0KSA/IHBvcy5yaWdodCA6IGJvdW5kcy5yaWdodDtcclxuICAgIH1cclxuICAgIGJvdW5kcy53ID0gYm91bmRzLnJpZ2h0IC0gYm91bmRzLng7XHJcbiAgICBib3VuZHMuaCA9IGJvdW5kcy5ib3R0b20gLSBib3VuZHMueTtcclxuICAgIHJldHVybiBib3VuZHM7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gIFx0c3VwZXIucmVuZGVyKCk7XHJcbiAgXHRmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRcdHRoaXMuaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQm94KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm94O1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQ2lyY2xlIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICB0ZXh0OiAnJyxcclxuICAgICAgbGVmdDogMCxcclxuICAgICAgdG9wOiAwLFxyXG4gICAgICByOiAyNSxcclxuICAgICAgZm9udEZhbWlseTogJ0NhbGlicmksIEFyaWFsLCBzYW5zLXNlcmlmJyxcclxuICAgICAgZm9udFNpemU6ICcyNHB4JyxcclxuICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxyXG4gICAgICBjb2xvcjogJyMwZjAnLFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMjIyJyxcclxuICAgICAgYm9yZGVyQ29sb3I6ICcjQkFEQTU1JyxcclxuICAgICAgYm9yZGVyV2lkdGg6IDVcclxuICAgIH07XHJcblxyXG4gICAgcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICBzdXBlci5pbml0KHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdDaXJjbGUnO1xyXG4gICAgdGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHJcbiAgICAvLyBhcHBseSBjaXJjbGUgY3NzXHJcbiAgICB2YXIgb2Zmc2V0ID0gcHJvcHMuciArIHByb3BzLmJvcmRlcldpZHRoO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgICdsZWZ0JzogJycgKyAocHJvcHMubGVmdC1vZmZzZXQpICsgJ3B4JyxcclxuICAgICAgICAndG9wJzogJycgKyAocHJvcHMudG9wLW9mZnNldCkgKyAncHgnLFxyXG4gICAgICAgICd3aWR0aCc6ICcnICsgcHJvcHMucioyICsgJ3B4JyxcclxuICAgICAgICAnaGVpZ2h0JzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxyXG4gICAgICAgICdsaW5lSGVpZ2h0JzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxyXG4gICAgICAgICdib3JkZXInOiBwcm9wcy5ib3JkZXJXaWR0aCArICdweCBzb2xpZCAnICsgcHJvcHMuYm9yZGVyQ29sb3IsXHJcbiAgICAgICAgJ2JvcmRlclJhZGl1cyc6ICcxMDAwMHB4JyxcclxuICAgICAgICAndGV4dEFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgJ292ZXJmbG93JzogJ2hpZGRlbidcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5zZXRUZXh0KHRoaXMudGV4dCk7XHJcbiAgfVxyXG5cclxuICBzZXRUZXh0ICh0eHQpIHtcclxuICAgIHRoaXMudGV4dCA9IHR4dDtcclxuICAgIHRoaXMuJGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQodHh0KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKENpcmNsZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENpcmNsZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXY+PGRpdiBpZD1jdWJlIGNsYXNzPXNob3ctZnJvbnQ+PGZpZ3VyZSBjbGFzcz1mcm9udD5GPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz1iYWNrPkI8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPXJpZ2h0PlI8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPWxlZnQ+TDwvZmlndXJlPjxmaWd1cmUgY2xhc3M9dG9wPlQ8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPWJvdHRvbT5HPC9maWd1cmU+PC9kaXY+PC9kaXY+XCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLyoqXHJcbiAqICB3LCBoLCBkZXB0aFxyXG4gKi9cclxuY2xhc3MgQ3ViZSBleHRlbmRzIFRoaW5nIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuXHRcdFx0dzogNTAwLFxyXG5cdFx0XHRoOiA1MDAsXHJcblx0XHRcdGQ6IDUwMFxyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0dGhpcy53ID0gcHJvcHMudztcclxuXHRcdHRoaXMuaCA9IHByb3BzLmg7XHJcblx0XHR0aGlzLmQgPSBwcm9wcy5kO1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHRcdHRoaXMudHlwZSA9ICdDdWJlJztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy5zZXR1cEN1YmUodGhpcy4kZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHNldHVwQ3ViZSgkZWwpIHtcclxuXHRcdHZhciAkY29udGFpbmVyICA9ICRlbDtcclxuXHRcdHZhciAkY3ViZSAgICAgICA9ICRlbC5maW5kKCcjY3ViZScpO1xyXG5cdFx0dmFyICRmYWNlRnJvbnQgID0gJGVsLmZpbmQoJyNjdWJlIC5mcm9udCAnKTtcclxuXHRcdHZhciAkZmFjZUJhY2sgICA9ICRlbC5maW5kKCcjY3ViZSAuYmFjayAgJyk7XHJcblx0XHR2YXIgJGZhY2VSaWdodCAgPSAkZWwuZmluZCgnI2N1YmUgLnJpZ2h0ICcpO1xyXG5cdFx0dmFyICRmYWNlTGVmdCAgID0gJGVsLmZpbmQoJyNjdWJlIC5sZWZ0ICAnKTtcclxuXHRcdHZhciAkZmFjZVRvcCAgICA9ICRlbC5maW5kKCcjY3ViZSAudG9wICAgJyk7XHJcblx0XHR2YXIgJGZhY2VCb3R0b20gPSAkZWwuZmluZCgnI2N1YmUgLmJvdHRvbScpO1xyXG5cclxuXHRcdHZhciBoYWxmSGVpZ2h0ID0gdGhpcy5oLzI7XHJcblx0XHR2YXIgaGFsZldpZHRoID0gdGhpcy53LzI7XHJcblx0XHR2YXIgaGFsZkRlcHRoID0gdGhpcy5kLzI7XHJcblxyXG5cdFx0JGNvbnRhaW5lci5jc3Moe1xyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuXHRcdFx0bGVmdDogJzBweCcsXHJcblx0XHRcdHRvcDogJzBweCcsXHJcblx0XHRcdHBlcnNwZWN0aXZlOiAnNjAwMHB4JyxcclxuXHRcdFx0ekluZGV4OiAyMDAwMFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JGN1YmUuY3NzKHtcclxuXHRcdFx0d2lkdGg6ICcxMDAlJyxcclxuXHRcdFx0aGVpZ2h0OiAnMTAwJScsXHJcblx0XHRcdHpJbmRleDogMjAwMDAsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHR0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJyxcclxuXHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxcydcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlRnJvbnQsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjIpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggMGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VCYWNrLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgICAwLCAgIDAsIC41KScsXHJcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIC0xODBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlUmlnaHQsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAgIDAsICA1NSwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoICAgOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKScgIC8qIGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSAqL1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUxlZnQsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsICAgMCwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoICAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKScgIC8qIGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSAqL1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZVRvcCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsICA1NSwgMjU1LCAuNSknLFxyXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0ICBcdGhlaWdodDogdGhpcy5kICsgJ3B4JywgXHJcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggICA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VCb3R0b20sIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoICAwLCAyNTUsICAgMCwgLjUpJyxcclxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuZCArICdweCcsIFxyXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoICAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSArICdweCApJ1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZXR1cEZhY2UoJGZhY2UsIGNzc1ZhbHMpIHtcclxuXHRcdHZhciBkZWZhdWx0Q1NTID0ge1xyXG5cdFx0XHRkaXNwbGF5OiAnYmxvY2snLFxyXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuXHRcdFx0bGluZUhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0Zm9udFNpemU6ICh0aGlzLmgvMykgKydweCcsXHJcblx0XHRcdGZvbnRXZWlnaHQ6ICdib2xkJyxcclxuXHRcdFx0Y29sb3I6ICd3aGl0ZScsXHJcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcclxuXHRcdH07XHJcblx0XHQkZmFjZS5jc3MoJC5leHRlbmQoe30sIGRlZmF1bHRDU1MsIGNzc1ZhbHMpKTtcclxuXHR9XHJcblxyXG5cdGh0bWwgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQ3ViZS5odG1sJyk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3NzICgpIHtcclxuXHRcdC8vIHJldHVybiByZXF1aXJlKCcuL0N1YmUuY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEN1YmUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDdWJlO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxyXFxuLkRlbW9Cb3gge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgbWFyZ2luOiAyMHB4O1xcclxcbiAgd2lkdGg6IDIwMHB4OyBcXHJcXG4gIGhlaWdodDogMjAwcHg7IFxcclxcbiAgYm9yZGVyOiAycHggZGFzaGVkICNlZWU7XFxyXFxufVxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEJveCA9IHJlcXVpcmUoJy4uL0JveC9Cb3guanMnKTtcclxuXHJcbmNsYXNzIERlbW9Cb3ggZXh0ZW5kcyBCb3gge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XHJcblx0XHRwcm9wcy53aWR0aCA9IHByb3BzLndpZHRoIHx8IDIwMDtcclxuXHRcdHByb3BzLmhlaWdodCA9IHByb3BzLmhlaWdodCB8fCAyMDA7XHJcblx0XHRwcm9wcy5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHR0aGlzLnR5cGUgPSAnRGVtb0JveCc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vRGVtb0JveC5jc3MnKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoRGVtb0JveCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlbW9Cb3g7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vLyBMaWtlIFVuaXggcGlwZTogb3V0cHV0IG9mIG9uZSBjb21tYW5kIGlzIGlucHV0IHRvIHRoZSBuZXh0XHJcbi8vIEVhY2ggZnVuY3Rpb24gdGFrZXMgYSAncHJvcHMnIG9iamVjdCBhcyBhcmd1bWVudFxyXG4vLyBFYWNoIGZ1bmN0aW9uIHJldHVybnMgYW4gb2JqZWN0IHdpdGggcmVzdWx0cywgd2hpY2ggaXMgcGFzc2VkIGFzIHByb3BzIHRvIHRoZSBuZXh0XHJcbi8vIERvKCkgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBleGVjdXRlIHRoZSBEbyBjaGFpblxyXG5cclxuLy8gUC5wdWxzZS5zZXRUbyhcclxuLy8gICAgIERvKFIuZ2V0UmFuZG9tTnVtYmVyLCB7ZnJvbTowLCB0bzoxMH0pICAgLy8gcmV0dXJuczogIHtkYXRhOiA4fVxyXG4vLyAgICAgLkRvKEMucGlja0NvbG9yKSAgICAvLyByZWFkcyBpbnB1dCA4LCByZXR1cm5zIHtkYXRhOiAnI2NmZid9XHJcbi8vICAgICAuRG8oQi5jaGFuZ2VDb2xvcikgICAvLyByZWFkcyBpbnB1dCAnI2NmZicsIGNoYW5nZXMgY29sb3Igb24gQmxpbmtlclxyXG4vLyApO1xyXG5cclxuXHJcbmZ1bmN0aW9uIERvKF9hRnVuY3Rpb24sIF9wcm9wcywgX2ZpcnN0RG8pIHtcclxuICAgIHZhciBhRnVuY3Rpb24gPSBfYUZ1bmN0aW9uO1xyXG4gICAgdmFyIHByb3BzID0gX3Byb3BzO1xyXG4gICAgdmFyIGZpcnN0RG8gPSBfZmlyc3REbyB8fCBleGVjdXRvcjtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWZ1bmN0aW9uPScsIGFGdW5jdGlvbik7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncHJvcHM9JywgcHJvcHMpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2ZpcnN0RG89JywgZmlyc3REbyk7XHJcblxyXG4gICAgLy8gUnVuIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMuXHJcbiAgICAvLyBQYXNzIHRoZSByZXN1bHRzIHRvIHRoZSBuZXh0IGNoYWluZWQgZnVuY3Rpb24gKGlmIGFueSkuXHJcbiAgICAvLyBSZXR1cm4gcmVzdWx0cyBvZiB0aGlzIGZ1bmN0aW9uIG9yIG9mIHRoZSBjaGFpblxyXG4gICAgZnVuY3Rpb24gZXhlY3V0b3IgKHBpcGVkUHJvcHMpIHtcclxuICAgICAgICB2YXIgcmV0dXJuVmFsID0gYUZ1bmN0aW9uKHByb3BzIHx8IHBpcGVkUHJvcHMpO1xyXG4gICAgICAgIHJldHVybiAoZXhlY3V0b3IubmV4dERvID8gZXhlY3V0b3IubmV4dERvKHJldHVyblZhbCkgOiByZXR1cm5WYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldHVybiB0aGUgbGFzdCAnRG8nIGluIHRoZSBjaGFpblxyXG4gICAgZnVuY3Rpb24gZ2V0TGFzdERvICgpIHtcclxuICAgICAgICB2YXIgdG1wRG8gPSBmaXJzdERvO1xyXG4gICAgICAgIHdoaWxlICh0bXBEby5uZXh0RG8pIHsgdG1wRG8gPSB0bXBEby5uZXh0RG87IH1cclxuICAgICAgICByZXR1cm4gdG1wRG87XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGEgbmV3ICdEbycgdG8gdGhlIGVuZCBvZiB0aGUgY2hhaW4uXHJcbiAgICBleGVjdXRvci5EbyA9IGZ1bmN0aW9uIChhRnVuY3Rpb24sIHByb3BzKSB7XHJcbiAgICAgICAgZ2V0TGFzdERvKCkubmV4dERvID0gRG8oYUZ1bmN0aW9uLCBwcm9wcywgZmlyc3REbyk7XHJcbiAgICAgICAgcmV0dXJuIGZpcnN0RG87ICAvLyBBbHdheXMgcmV0dXJuIHRoZSBmaXJzdCAnRG8nIGluIHRoZSBjaGFpblxyXG4gICAgfTtcclxuXHJcbiAgICBleGVjdXRvci5uZXh0RG8gPSBudWxsO1xyXG5cclxuICAgIHJldHVybiBleGVjdXRvcjtcclxufVxyXG5cclxuVGhpbmcuRG8gPSBEbztcclxuXHJcbi8qXHJcbi8vIGNoYWluZWQsIGVhY2ggRG8gaGFzIGl0cyBvd24gcGFyYW1ldGVyc1xyXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7fSwge2FyZzE6J2hlbGxvMSd9KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwge2FyZzI6J2hlbGxvIHRvIDIyMjIyJ30pXHJcblxyXG4vLyBjaGFpbmVkLCB3aXRoIGZpcnN0IERvIHBpcGluZyByZXN1bHRzIHRvIHNlY29uZCBEb1xyXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7IHJldHVybiB7cGlwZWRwcm9wOjEyMzR9fSwge2FyZzE6J2hlbGxvMSd9KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwgbnVsbClcclxuXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTsgcmV0dXJuIHtuZXdQcm9wOnByb3BzLnBpcGVkcHJvcCsyfX0pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMycsIHByb3BzKTt9KVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEbztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbi8qXHJcbiAgICBzcmM6IDxmaWxlIHBhdGg+XHJcbiAgICBjZW50ZXI6IHRydWV8ZmFsc2VcclxuICAgIHNpemU6IGNvbnRhaW58Y292ZXJ8c3RyZXRjaFxyXG4qL1xyXG5cclxuY2xhc3MgSW1nIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgcGxhY2Vob2xkZXIgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFNZ0FBQURJQ0FZQUFBQ3RXSzZlQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFMRXdBQUN4TUJBSnFjR0FBQUJWOUpSRUZVZUp6dDNjMXUzVVFjaCtGL0VCSzlBc1FDVldmVlFxNENiaHh1QTRFcXNTbWgrN0l1aTlRQ1F2STdZeCtQUDU5SDhpNnlabzdtemZna2xuMVhWWjhLZU5ZWGF3OEF0a3dnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ2VETEVUOTcxMjBVc0x5bU8wanNJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJTSs3Vk5WM2F3OWlRZmRWOVhydFFXelZwOGJqTEM1VjlYdFZQZFE1SXJtdnFnOVY5YTdPRlVuenVoZklQeTcxR01jdzU2TkhNc1F4elBkTWtRaGtwRXY5TjQ2alIvSTBqck5GSXBBUkx2VjhIRWVONUtVNHpoU0pRQnBkS3NkeHRFaXV4WEdXU0FUUzRGSnRjUndsa3RZNHpoQ0pRSzY0MUxnNC9oM0o5NHVQOW5aajR6aDZKQUlKTGpVdGpyMUdNaldPSTBjaWtCZGM2clk0OWhiSnJYRWNOUktCUE9OUzg4U3hsMGptaXVPSWtUVE4rV3kzbXJ5cXFxOW1QTjgzVmZWVGJUT1MrNnI2dWFxK252R2NyejRmcDNLbUhhVHFjVEUvMUh5L1ZiZTRrOHk5YzN5cXF2ZFY5V2JKU1hUbUVpczRjaVRpYUNPUUs0NFlpVGphQ2FSQmowaitySFVpRWNjNEFtbDBoRWpFTVo1QVJ0aHpKT0tZUmlBamZWK1BpM3BQa1loak9vRk1zS2RJZXNUeFI1MGpqaXFCVExhSFNNUnhPNEhjWU11UmlHTWVBcmxScjBqdWJ4aVRPT1lqa0Jsc0tSSnh6RXNnTTlsQ0pPS1luMEJtdEdZazR1aERJRE5iSXhKeDlDT1FEdTVydVVoNnhmRjJsazlpL3dUU3lSS1JpS00vZ1hUVU14SnhMRU1nbmZXSTVFT0pZeWtDV1VDUFNNU3hESUVzWkt1UmlDTVR5SUo2Zkc4UVIxOENXZGhXSW5rb2NiUVF5QXJXamtRYzdRU3lrclVpRWNjNEFsblIwcEdJWXp5QnJHeXBTTVF4alVBMm9IY2s0cGhPSUJ2Ukt4SngzS2JwY3o3YjA5MlA1bTd0QVp5QkhhU2ZKUzZ4OXZ6T3hEVzV4RnJaa2wvU1JUS2VRRmEweHA5NVJUS09RRmF5NWo4S1JkSk9JQ3ZZd3EwbUlta2prSVd0SFlkSXhoSElncllTaDBqYUNXUWhXNHRESkcwRXNvQ3R4aUdTNndUU1dZODRIcXJQaTBWRjhuOEM2YWhYSEcvcmNUR0xwRCtCZE5JempvRkkraE5JQjB2RU1SQkpYd0taMlpKeERFVFNqMEJtdEVZY0E1SDBJWkNackJuSFFDVHpFOGdNdGhESFFDVHpFc2lOdHZpVWRaSE1SeUEzMkdJY0E1SE1ReUFUYlRtT2dVaHVKNUFKOWhESFFDUzNFY2hJZTRwaklKTHBCRExDSHVNWWlHUWFnVFRhY3h3RGtZd25rQVpIaUdNZ2tuRUVja1d2T040c09Za25STkpPSU1FUjR4aUlwSTFBWG5Ea09BWWl1VTRnenpoREhJTmVrUnpsaWZKTmN6N2IwOTAvZmo3bThsQlZQMVRWcnpPZWN5Ni9WTldQOWZpSzZybDhyS3EvWmp6ZkxweHBCNm1xZWwxVjcrcTRPOGRUYyswa3YxWFZ0d3VQdlNlWFdNR3RrZXdsanNHdGtSd3RqaXFCWERVMWt2ZTFyemdHVXlNNVloeFZBbWt5TnBLOXhqRVlHOGxSNDZnU1NMUFdTUFlleDZBMWtpUEhVU1dRVWE1RmNwUTRCdGNpT1hvY1ZRSVo3YVZJamhiSDRLVkl6aEJIbFVBbWVSckpVZU1ZUEkza0xIRlVDV1N5SVpLanh6RVlJamxUSEZVQ3VjbnJPa2NjZzdkMXJqaXFHdGY5WGJVdmZpK3Q1MGlhMXYzWjdzV0NVUVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFIQlhWWi9XSGdSc2xSMEVBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFZ3I4QmlRVnpxOUx2MU9vQUFBQUFTVVZPUks1Q1lJST0nO1xyXG5cclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICBwcm9wcy5zcmMgPSBwcm9wcy5zcmMgfHwgcGxhY2Vob2xkZXI7XHJcbiAgICAvLyBwcm9wcy5iYWNrZ3JvdW5kID0gJ3VybChcIicgKyBwcm9wcy5zcmMgKyAnXCIpIG5vLXJlcGVhdCAnICsgKHByb3BzLmNlbnRlciA/ICdjZW50ZXInIDogJ2xlZnQgdG9wJyk7XHJcbiAgICAvLyBwcm9wcy5iYWNrZ3JvdW5kU2l6ZSA9IChwcm9wcy5zaXplID09PSAnY29udGFpbicgfHwgcHJvcHMuc2l6ZSA9PT0gJ2NvdmVyJyA/IHByb3BzLnNpemUgOiAocHJvcHMuc2l6ZT09PSdzdHJldGNoJyA/ICcxMDAlIDEwMCUnIDogdW5kZWZpbmVkKSApO1xyXG5cclxuICAgIHRoaXMucHJvcHMgPSBUaGluZy5jbGVhbnVwKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnR5cGUgPSAnSW1nJztcclxuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSAxO1xyXG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuc3JjID0gcHJvcHMuc3JjO1xyXG4gICAgdGhpcy54ID0gcHJvcHMueCB8fCB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IHVuZGVmaW5lZDtcclxuICAgIHRoaXMudyA9IHByb3BzLncgfHwgdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5oID0gcHJvcHMuaCB8fCB1bmRlZmluZWQ7XHJcblxyXG4gICAgSW1nLmxvYWRpbmcodGhpcyk7XHJcbiAgICBsb2FkSW1hZ2UocHJvcHMuc3JjLCB0aGlzLm9ubG9hZC5iaW5kKHRoaXMpLCB0aGlzLm9uRXJyb3IuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgc3VwZXIuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgfVxyXG5cclxuICBvbmxvYWQgKGltZykge1xyXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IGltZy5oZWlnaHQgLyBpbWcud2lkdGg7ICAvLyBhc3BlY3QgcmF0aW8gb2Ygb3JpZ2luYWwgaW1hZ2VcclxuICAgIHRoaXMudyA9IHRoaXMudyB8fCBpbWcud2lkdGg7XHJcbiAgICB0aGlzLmggPSB0aGlzLmggfHwgKHRoaXMudyAqIHRoaXMuYXNwZWN0UmF0aW8pO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLncsXHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmgsXHJcbiAgICAgICAgYmFja2dyb3VuZDogJ3VybCgnICtpbWcuc3JjKyAnKSBuby1yZXBlYXQgY2VudGVyJyxcclxuICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogJzEwMCUgMTAwJSdcclxuICAgIH0pO1xyXG4gICAgSW1nLmxvYWRlZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIG9uRXJyb3IgKGltZykge1xyXG4gICAgVGhpbmcubXNnKCdJbWcub25FcnJvcjogRmFpbGVkIHRvIGxvYWQgJyArIGltZy5zcmMpO1xyXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5lcnJvciA9IHRydWU7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICBJbWcubG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0V2lkdGggKHcpIHtcclxuICAgIHRoaXMud2lkdGggPSB3O1xyXG4gICAgdGhpcy5oZWlnaHQgPSB3ICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxvYWRpbmcgKGltZykge1xyXG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcclxuICAgIGlmIChpbWcgJiYgIWltZy5sb2FkZWQpIHtcclxuICAgICAgICBJbWcucXVldWVkSW1ncy5wdXNoKGltZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gSW1nLnF1ZXVlZEltZ3MubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxvYWRlZCAoaW1nKSB7XHJcbiAgICBJbWcucXVldWVkSW1ncyA9IEltZy5xdWV1ZWRJbWdzIHx8IFtdO1xyXG4gICAgaWYgKGltZyAmJiBpbWcubG9hZGVkKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gSW1nLnF1ZXVlZEltZ3MuaW5kZXhPZihpbWcpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIEltZy5xdWV1ZWRJbWdzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChJbWcucXVldWVkSW1ncy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgSW1nLm9uQWxsTG9hZGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aCA9PT0gMDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBvbkFsbExvYWRlZCAoKSB7XHJcbiAgICBUaGluZy5tc2coXCJJTUcub25BbGxMb2FkZWQoKTogdHJpZ2dlcmVkXCIpO1xyXG4gIH1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoSW1nKTtcclxuXHJcblxyXG5mdW5jdGlvbiBsb2FkSW1hZ2UgKHNyYywgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcclxuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjYWxsYmFjayh0aGlzKTtcclxuICAgIH07XHJcbiAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBlcnJvckNhbGxiYWNrKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIGltZy5zcmMgPSBzcmM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgTGFiZWwgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdHRleHQ6ICcnLFxyXG5cdFx0XHRmb250RmFtaWx5OiAnQ2FsaWJyaSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG5cdFx0XHRmb250U2l6ZTogJzE0cHgnLFxyXG5cdFx0XHRjb2xvcjogJyMwMDAnXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0xhYmVsJztcclxuXHRcdHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMudGV4dCk7XHJcblx0fVxyXG5cclxuXHRzZXRUZXh0ICh0eHQpIHtcclxuXHRcdHRoaXMudGV4dCA9IHR4dDtcclxuXHRcdHRoaXMuJGVsZW1lbnQuZW1wdHkoKS50ZXh0KHR4dCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKExhYmVsKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXHJcXG4uTGluZSB7XFxyXFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXHJcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxyXFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXHJcXG59XFxyXFxuXFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgTGluZSBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgLy8gZXhwZWN0aW5nIHByb3BzOiB7IHgxOjAsIHkxOjAsIHgyOjUwLCB5Mjo1MCB9XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgPSBwcm9wcyAmJiAocHJvcHMuYmFja2dyb3VuZENvbG9yIHx8IHByb3BzLmNvbG9yIHx8ICdibGFjaycpO1xyXG4gICAgc3VwZXIuaW5pdChwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnTGluZSc7XHJcbiAgICB0aGlzLmxlbmd0aCA9IDEwO1xyXG4gICAgdGhpcy53aWR0aCA9IDE7XHJcbiAgICB0aGlzLmFuZ2xlID0gMDtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3ModGhpcy50eXBlKTtcclxuICAgIHRoaXMuY3JlYXRlTGluZShwcm9wcy54MSwgcHJvcHMueTEsIHByb3BzLngyLCBwcm9wcy55MiwgcHJvcHMud2lkdGgsIHByb3BzLmFycm93LCBwcm9wcy5zaG9ydGVuKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUxpbmUgKHgxLHkxLCB4Mix5Miwgd2lkdGgsIGFycm93LCBzaG9ydGVuKSB7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgMjtcclxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5zcXJ0KCh4MS14MikqKHgxLXgyKSArICh5MS15MikqKHkxLXkyKSkgLSAoYXJyb3c/IHRoaXMud2lkdGgqMiA6IDApOyAgLy8gc2hvcnRlbiB0aGUgbGVuZ3RoIHRvIG1ha2Ugcm9vbSBmb3IgYXJyb3doZWFkXHJcbiAgICB0aGlzLmFuZ2xlICA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgdGhpcy5sZW5ndGggLT0gc2hvcnRlbiB8fCAwOyAgLy8gc2hvcnRlbiB0aGUgbGluZSBhIGJpdCAobWFrZXMgcm9vbSBmb3IgYXJyb3doZWFkKVxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgICdsZWZ0JzogJycgKyB4MSArICdweCcsXHJcbiAgICAgICAgJ3RvcCc6ICcnICsgKHkxLSh0aGlzLndpZHRoLzIpKSArICdweCcsXHJcbiAgICAgICAgJ3dpZHRoJzogJycgKyB0aGlzLmxlbmd0aCArICdweCcsXHJcbiAgICAgICAgJ2hlaWdodCc6ICcnICsgdGhpcy53aWR0aCArICdweCcsXHJcbiAgICAgICAgLy8gcm90YXRlIGFyb3VuZCBzdGFydCBwb2ludCBvZiBsaW5lXHJcbiAgICAgICAgJ3RyYW5zZm9ybS1vcmlnaW4nOiAnMCA1MCUnXHJcbiAgICAgIH0pO1xyXG4gICAgdGhpcy5yb3RhdGVUbyh0aGlzLmFuZ2xlKTtcclxuICAgIGlmIChhcnJvdykge1xyXG4gICAgICB0aGlzLmFkZEFycm93SGVhZCh0aGlzLmxlbmd0aCwgdGhpcy53aWR0aCwgdGhpcy53aWR0aCoyLCB0aGlzLnByb3BzLmJhY2tncm91bmRDb2xvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBsZW4gb2YgbGluZSwgd2lkdGggb2YgbGluZSwgc2l6ZSBvZiB0cmlhbmdsZSAoaWUuIDEwIHdpbGwgYmUgMTBweCB3aWRlIGFuZCAyMHB4IGhpZ2gpXHJcbiAgYWRkQXJyb3dIZWFkIChsZW4sIHdpZHRoLCBzaXplLCBjb2xvcikge1xyXG4gICAgdGhpcy5hcnJvd0hlYWQgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgdGhpcy5hcnJvd0hlYWQuY3NzKHtcclxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgIHdpZHRoOiAwLCBcclxuICAgICAgaGVpZ2h0OiAwLCBcclxuICAgICAgZm9udFNpemU6IDAsXHJcbiAgICAgIGxpbmVIZWlnaHQ6IDAsXHJcbiAgICAgIGxlZnQ6IGxlbiArICdweCcsXHJcbiAgICAgIHRvcDogLShzaXplLSh3aWR0aC8yKSkgKyAncHgnLFxyXG4gICAgICBib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJUb3A6IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJMZWZ0OiBzaXplICsgJ3B4IHNvbGlkICcgKyBjb2xvclxyXG4gICAgfSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHRoaXMuYXJyb3dIZWFkKTtcclxuICB9XHJcblxyXG4gIGRhc2hlZCAoZGFzaFNpemUpIHtcclxuICAgIGRhc2hTaXplID0gZGFzaFNpemU9PT11bmRlZmluZWQgPyAxMCA6IGRhc2hTaXplO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgMzAlLCAnICt0aGlzLnByb3BzLmJhY2tncm91bmRDb2xvcisgJyAzMCUpJyxcclxuICAgICAgYmFja2dyb3VuZFNpemU6IGRhc2hTaXplICsgJ3B4J1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gIFx0cmV0dXJuIHJlcXVpcmUoJy4vTGluZS5jc3MnKTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoTGluZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBQYXR0ZXJuUG9sa2FEb3RzIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBjb2xvcjogJyNmZmZkZDcnLFxyXG4gICAgICByYWRpdXM6IDEwMCxcclxuICAgICAgc2l6ZTogNTAwXHJcbiAgICB9O1xyXG4gICAgcHJvcHMucmFkaXVzID0gcHJvcHMucmFkaXVzIHx8IHByb3BzLnNpemUvNTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnUGF0dGVyblBvbGthRG90cyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICAvLyBwb2xrYSBkb3RzIGJhY2tncm91bmRcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiAncmFkaWFsLWdyYWRpZW50KCcgK3Byb3BzLmNvbG9yKyAnICcgK3Byb3BzLnJhZGl1cysgJ3B4LCB0cmFuc3BhcmVudCAnICsocHJvcHMucmFkaXVzKzMpKyAncHgpLCByYWRpYWwtZ3JhZGllbnQoJyArcHJvcHMuY29sb3IrICcgJyArcHJvcHMucmFkaXVzKyAncHgsIHRyYW5zcGFyZW50ICcgKyhwcm9wcy5yYWRpdXMrMykrICdweCknLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogcHJvcHMuc2l6ZSArICdweCcsXHJcbiAgICAgIGJhY2tncm91bmRQb3NpdGlvbjogJzAgMCwgJyArKHByb3BzLnNpemUvMikrICdweCAnICsocHJvcHMuc2l6ZS8yKSsgJ3B4J1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgICAvLyBBZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xyXG4gICAgICB2YXIgc2l6ZSA9IE1hdGgubWF4KHRoaXMucGFyZW50LiRlbGVtZW50LndpZHRoKCksIHRoaXMucGFyZW50LiRlbGVtZW50LmhlaWdodCgpKTtcclxuICAgICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgIGxlZnQ6ICcwcHgnLCB0b3A6ICcwcHgnLFxyXG4gICAgICAgIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemVcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgVGhpbmcubXNnKCdQYXR0ZXJuLnJlbmRlcigpOiBQYXR0ZXJuIG5lZWRzIHRvIGJlIGFkZGVkIHRvIGEgcGFyZW50IGJlZm9yZSBjYWxsaW5nIHJlbmRlci4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUGF0dGVyblBvbGthRG90cyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhdHRlcm5Qb2xrYURvdHM7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBQYXR0ZXJuU3RyaXBlcyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgY29sb3I6ICdyZ2JhKDI1NSwyMDUsMjUsMSknLFxyXG4gICAgICByYWRpdXM6IDEwMCxcclxuICAgICAgc2l6ZTogNTAwXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuU3RyaXBlcyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICAvLyBzdHJpcGVzIGJhY2tncm91bmRcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MCUsICcgK3Byb3BzLmNvbG9yKyAnIDUwJSknLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogcHJvcHMuc2l6ZSArICdweCdcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgICAgLy8gQWRqdXN0IHBhdHRlcm4gdG8gZmlsbCBwYXJlbnQgd2l0aCBhIHNxdWFyZSBhc3BlY3QgcmF0aW9cclxuICAgICAgdmFyIHNpemUgPSBNYXRoLm1heCh0aGlzLnBhcmVudC4kZWxlbWVudC53aWR0aCgpLCB0aGlzLnBhcmVudC4kZWxlbWVudC5oZWlnaHQoKSk7XHJcbiAgICAgIHRoaXMuY3NzKHtcclxuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgICBsZWZ0OiAnMHB4JywgdG9wOiAnMHB4JyxcclxuICAgICAgICB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIFRoaW5nLm1zZygnUGF0dGVybi5yZW5kZXIoKTogUGF0dGVybiBuZWVkcyB0byBiZSBhZGRlZCB0byBhIHBhcmVudCBiZWZvcmUgY2FsbGluZyByZW5kZXIuJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm5TdHJpcGVzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblN0cmlwZXM7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuUGF0dGVybi5HcmFwaFBhcGVyIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDM7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweCwgMjBweCAyMHB4LCAyMHB4IDIwcHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweCwgLTFweCAtMXB4LCAtMXB4IC0xcHg7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4zKSAxcHgsIHRyYW5zcGFyZW50IDFweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkdyaWQge1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHg7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweDtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5Tb2ZhRGFyayB7XFxyXFxuICBiYWNrZ3JvdW5kOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgMTAwJSA1MCUsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlNvZmEge1xcclxcbiAgYmFja2dyb3VuZDpcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCA5OSUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDYlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDElLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyMyUpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgNTAlIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSAxMDAlIDUwJSxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgOTYlLCA0JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlllbGxvd0NpcmNsZXNXaXRoVmlvbGV0IHtcXHJcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmQ2NzkgMTclLCAjM2Q1NDQzIDE3LjUlLCAjM2Q1NDQzIDE4LjIlLCAjM2NkYWRhIDE5JSwgIzZkZThlOCAyNCUsICNlZGNiZmIgMzAlLCB0cmFuc3BhcmVudCAzNiUpLCByYWRpYWwtZ3JhZGllbnQoIzNkYWJjNyAxMiUsICM0OWFiM2MgMTMuNSUsICMzODgyMmUgMTQlLCAjZmZkYjg5IDE0LjUlLCAjZmZkYjg5IDE5JSwgI2ZmZjU3YSAyMCUsICNmY2ZmYjUgMjglLCAjZmZmZWJkIDI5JSk7XFxyXFxuICAgIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxyXFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAlIDAlLCAxNyUgMTclO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5ZZWxsb3dDaXJjbGVzV2l0aFZpb2xldDIge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmRkOTAgMTclLCBibGFjayAxNy41JSwgYmxhY2sgMTguMiUsICMzY2RhZGEgMTklLCAjNmRlOGU4IDI0JSwgI2VkY2JmYiAzMCUsIHRyYW5zcGFyZW50IDM2JSksIHJhZGlhbC1ncmFkaWVudCgjM2NkYWRhIDE3JSwgZ3JheSAxNy41JSwgZ3JheSAxOCUsICNmZmRkOTAgMTklLCAjZmZkZDkwIDI0JSwgI2ZmZmY5MCAzMCUsICNmZmZmOTAgMzYlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxyXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSAwJSwgMTclIDE3JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uUG9sa2FEb3RzIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSksXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDYwcHggNjBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMzBweCAzMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5Qb2xrYURvdHNMYXJnZSB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyAxMDBweCwgdHJhbnNwYXJlbnQgMTAzcHgpLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyAxMDBweCwgdHJhbnNwYXJlbnQgMTAzcHgpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiA1MDBweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMjUwcHggMjUwcHg7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlBvbGthRGlhbW9uZHNXaGl0ZUdyZWVuIHtcXHJcXG4gICAgYmFja2dyb3VuZC1pbWFnZTpcXHJcXG4gICAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyA5cHgsIHRyYW5zcGFyZW50IDEwM3B4KSxcXHJcXG4gICAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyAxMTFweCwgdHJhbnNwYXJlbnQgMTAzcHgpO1xcclxcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDIwMHB4O1xcclxcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwIDAsIDEwMHB4IDEwMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5CbHVlQmFsbHMge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNhY2YgNzclLCByZ2JhKDg4LDk5LDI1NSwuODgpIDgwJSwgdHJhbnNwYXJlbnQgODMlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uU3RyaXBlcyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgyNTUsMjU1LDI1LDEpIDUwJSk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JTtcXHJcXG59XFxyXFxuXFxyXFxuLlBhdHRlcm4uU3RyaXBlc09jaHJlIHtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1NSwyMDUsMjUsMSkgNTAlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTUlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5TdHJpcGVzV2hpdGVSZWRHcmVlbiB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUxJSwgI2ZmZmZjOCA1MSUsICNmZmZmYzggNTklLCB0cmFuc3BhcmVudCA1OSUpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDQzJSwgI2YzMzA1NCA0MyUsICNmMzMwNTQgNjclLCB0cmFuc3BhcmVudCA2NyUpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICMwMjliNGYgMzQlLCAjMjYyNjI2IDM0JSwgIzI2MjYyNiA3NSUsICMwMjliNGYgNzUlKTtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAlLCAwJSwgMCU7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JSwgMTUlLCAxNSU7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlBsYWlkUmVkIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA4NiUsIDM0JSk7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUzcHgsIHRyYW5zcGFyZW50IDUzcHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjZweCwgdHJhbnNwYXJlbnQgNjZweCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjlweCwgcmdiYSgwLDYwLDAsLjUpIDE2OXB4LFxcclxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE4MnB4LCByZ2JhKDAsNjAsMCwuNSkgMTgycHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDIzMnB4LCB0cmFuc3BhcmVudCAyMzJweCksXFxyXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMjcwZGVnLCB0cmFuc3BhcmVudCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDY2cHgsIHRyYW5zcGFyZW50IDY2cHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY5cHgsIHJnYmEoMCw2MCwwLC41KSAxNjlweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxODJweCwgcmdiYSgwLDYwLDAsLjUpIDE4MnB4LFxcclxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAyMzJweCwgdHJhbnNwYXJlbnQgMjMycHgpLFxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDEyNWRlZywgdHJhbnNwYXJlbnQsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMnB4LCByZ2JhKDAsMCwwLC4yKSAycHgsXFxyXFxuICAgICAgcmdiYSgwLDAsMCwuMikgM3B4LCB0cmFuc3BhcmVudCAzcHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNXB4LCByZ2JhKDAsMCwwLC4yKSA1cHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5QbGFpZFJlZExhcmdlIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA4NiUsIDM0JSk7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDIwMHB4LCByZ2JhKDQwLDAsMTYwLC40KSAyMDBweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjEycHgsIHRyYW5zcGFyZW50IDIxMnB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDI1MnB4LCByZ2JhKDQwLDAsMTYwLC40KSAyNTJweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjY0cHgsIHRyYW5zcGFyZW50IDI2NHB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDQ2NHB4LCByZ2JhKDAsNjAsMCwuNSkgNDY0cHgsIHJnYmEoMCw2MCwwLC41KSA2NjRweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgNjY0cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDY3NnB4LCByZ2JhKDAsNjAsMCwuNSkgNjc2cHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDcxNnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA3MTZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgNzI4cHgsIHJnYmEoMCw2MCwwLC41KSA3MjhweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgOTI4cHgsIHRyYW5zcGFyZW50IDkyOHB4KSxcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgyNzBkZWcsIHRyYW5zcGFyZW50LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDIwMHB4LCByZ2JhKDQwLDAsMTYwLC40KSAyMDBweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjEycHgsIHRyYW5zcGFyZW50IDIxMnB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDI1MnB4LCByZ2JhKDQwLDAsMTYwLC40KSAyNTJweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjY0cHgsIHRyYW5zcGFyZW50IDI2NHB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDQ2NHB4LCByZ2JhKDAsNjAsMCwuNSkgNDY0cHgsIHJnYmEoMCw2MCwwLC41KSA2NjRweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgNjY0cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDY3NnB4LCByZ2JhKDAsNjAsMCwuNSkgNjc2cHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDcxNnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA3MTZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgNzI4cHgsIHJnYmEoMCw2MCwwLC41KSA3MjhweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgOTI4cHgsIHRyYW5zcGFyZW50IDkyOHB4KSxcXHJcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgxMjVkZWcsIHRyYW5zcGFyZW50LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDhweCwgcmdiYSgwLDAsMCwuMikgOHB4LFxcclxcbiAgICAgIHJnYmEoMCwwLDAsLjIpIDEycHgsIHRyYW5zcGFyZW50IDEycHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMjBweCwgcmdiYSgwLDAsMCwuMikgMjBweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLlBsYWlkUmVkTGFyZ2VYIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA4NiUsIDM0JSk7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDI1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSAyNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjY1cHgsIHRyYW5zcGFyZW50IDI2NXB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDMxNXB4LCByZ2JhKDQwLDAsMTYwLC40KSAzMTVweCwgcmdiYSg0MCwwLDE2MCwuNCkgMzMwcHgsIHRyYW5zcGFyZW50IDMzMHB4LFxcclxcbiAgICAgIHRyYW5zcGFyZW50IDU4MHB4LCByZ2JhKDAsNjAsMCwuNSkgNTgwcHgsIHJnYmEoMCw2MCwwLC41KSA4MzBweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgODMwcHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDg0NXB4LCByZ2JhKDAsNjAsMCwuNSkgODQ1cHgsXFxyXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDg5NXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA4OTVweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgOTEwcHgsIHJnYmEoMCw2MCwwLC41KSA5MTBweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTE2MHB4LCB0cmFuc3BhcmVudCAxMTYwcHgpLFxcclxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDI3MGRlZywgdHJhbnNwYXJlbnQsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMjUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDI1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSAyNjVweCwgdHJhbnNwYXJlbnQgMjY1cHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMzE1cHgsIHJnYmEoNDAsMCwxNjAsLjQpIDMxNXB4LCByZ2JhKDQwLDAsMTYwLC40KSAzMzBweCwgdHJhbnNwYXJlbnQgMzMwcHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgNTgwcHgsIHJnYmEoMCw2MCwwLC41KSA1ODBweCwgcmdiYSgwLDYwLDAsLjUpIDgzMHB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA4MzBweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgODQ1cHgsIHJnYmEoMCw2MCwwLC41KSA4NDVweCxcXHJcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgODk1cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDg5NXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA5MTBweCwgcmdiYSgwLDYwLDAsLjUpIDkxMHB4LFxcclxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAxMTYwcHgsIHRyYW5zcGFyZW50IDExNjBweCksXFxyXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMTI1ZGVnLCB0cmFuc3BhcmVudCxcXHJcXG4gICAgICB0cmFuc3BhcmVudCAxMHB4LCByZ2JhKDAsMCwwLC4yKSAxMHB4LFxcclxcbiAgICAgIHJnYmEoMCwwLDAsLjIpIDE1cHgsIHRyYW5zcGFyZW50IDE1cHgsXFxyXFxuICAgICAgdHJhbnNwYXJlbnQgMjVweCwgcmdiYSgwLDAsMCwuMikgMjVweCk7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkRpYWdvbmFsU3RyaXBlcyB7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGJsYWNrIDI1JSwgdHJhbnNwYXJlbnQgMjUuMTUlLCB0cmFuc3BhcmVudCA1MCUsIGJsYWNrIDUwLjE1JSwgYmxhY2sgNzUlLCB0cmFuc3BhcmVudCA3NS4xNSUsIHRyYW5zcGFyZW50KTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTYlIDE2JTsgIC8qIG11c3QgbWF0Y2ggYXNwZWN0IHJhdGlvIG9mIGNvbnRhaW5pbmcgZWxlbWVudCBvciBsaW5lcyB3aWxsIGJyZWFrICovXFxyXFxuICAgICAgICAvKiBpZS4gMzIlIDE2JSBmb3IgYW4gZWxlbWVudCB3aXRoIHc9MTAwIGg9MjAwICovXFxyXFxuICAgICAgICAvKiBQb3dlcnMgb2YgMiB3b3JrIGJlc3QgKG90aGVyIHZhbHVlcywgbGlrZSA3IG9yIDIzLCBtYWtlIGphZ2d5IGFsaWFzaW5nKSAqL1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5EaWFnb25hbFN0cmlwZXNWaW9sZXQge1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCAjMGUwMDMwIDI1JSwgdHJhbnNwYXJlbnQgMjUuMTUlLCB0cmFuc3BhcmVudCA1MCUsICMwZTAwMzAgNTAuMTUlLCAjMGUwMDMwIDc1JSwgdHJhbnNwYXJlbnQgNzUuMTUlLCB0cmFuc3BhcmVudCk7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDYlO1xcclxcbn1cXHJcXG5cXHJcXG4uUGF0dGVybi5CbHVlQ2FzY2FkZSB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDI2ODczO1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDkxZGVnLCByZ2JhKDI1NSwyNTUsMjUsMC4xNykgNTAlLCB0cmFuc3BhcmVudCA1MS41JSksXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg4OWRlZywgcmdiYSgyNSwyNTUsMjU1LDAuMjMpIDUwJSwgdHJhbnNwYXJlbnQgNTQuNSUpLFxcclxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTAuNWRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1MiwgMjU1LCAxNjIsIDAuMzcpIDU0LjUlKSxcXHJcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MC43NSUsIHJlZCA1MSUsIHJlZCA1MS41JSwgdHJhbnNwYXJlbnQgNTEuNzUlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogNSUgMTAwJSwgMyUgMTAwJSwgOSUgMTAwJSwgOCUgMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuIC8qUGVybGluIE5vaXNlLWlzaCByYWRpYWwgYmx1cnMqL1xcclxcbiAgLypSR0IqL1xcclxcbiAgLypiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQocmdiYSgyNTUsIDQyLCAwLCAuNSkgMSUsIHRyYW5zcGFyZW50IDIwMCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSg4NiwgMjUwLCAyLCAuNSkgMSUsIHRyYW5zcGFyZW50IDIwMCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSgwLCA3LCAyNTUsIDAuNikgMSUsIHRyYW5zcGFyZW50IDE1MCUpO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiAxNjFweCwgMTM0cHgsIDE4OHB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTU0cHgsIDU3cHgsIDU1cHg7XFxyXFxuICAqL1xcclxcblxcclxcbiAgLypNb25vY2hyb21lIC0gYmV0dGVyIGJsdXJzKi9cXHJcXG4vKlxcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjU2KSAwJSwgcmdiYSg5LCAxLCAxMTIsIDAuMjUpIDQ4JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTIpIDk0JSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC41NikgMCUsIHJnYmEoOSwgMSwgMTEyLCAwLjI1KSA0OCUsIHJnYmEoOSwgMSwgMTEyLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwLjEyKSA5NCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuNTYpIDAlLCByZ2JhKDksIDEsIDExMiwgMC4yNSkgNDglLCByZ2JhKDksIDEsIDExMiwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMC4xMikgOTQlKTtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTg4cHggMzQ3cHgsIDE3MHB4LCAyMDlweDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC01NHB4LCA1N3B4LCA1NXB4O1xcclxcbiovXFxyXFxuXFxyXFxuLlBhdHRlcm4uR3JlZW5PdmFsc1hyYXkge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzEzMWMwYztcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChyZ2JhKDE4LCAwLCAyNTUsIDApIDAlLCByZ2JhKDMsIDE3OSwgMjU1LCAwLjA5KSA0OCUsIHJnYmEoMTk5LCAyMzcsIDQ0LCAwLjE5KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwKSA5NCUpLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDApIDAlLCByZ2JhKDIwNSwgMCwgMCwgMC4wNykgNDglLCByZ2JhKDI1NCwgMjA0LCAwLCAwLjExKSA2NSUsIHJnYmEoMjU1LCAyMTAsIDgsIDApIDk0JSksXFxyXFxuICAgIHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC4wMSkgMCUsIHJnYmEoODUsIDI1NSwgNTksIDAuMDgpIDQ4JSwgcmdiYSgxNzQsIDIwMiwgMCwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMCkgOTQlKTtcXHJcXG4gICAgYmFja2dyb3VuZC1zaXplOiAxODhweCAzNDdweCwgMTcwcHgsIDIwOXB4O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTU0cHgsIDU3cHgsIDU1cHg7XFxyXFxufVxcclxcblxcclxcbi5QYXR0ZXJuLkRhcmtEb251dHMge1xcclxcbiAgICBiYWNrZ3JvdW5kLWltYWdlOlxcclxcbiAgICAgIHJhZGlhbC1ncmFkaWVudChibGFjayAxMCUsICNmZmZkZDcgNjAlLCB0cmFuc3BhcmVudCA2MSUpLFxcclxcbiAgICAgIHJhZGlhbC1ncmFkaWVudCgjMjkyOTI5IDElLCAjZmZmZGQ3IDUwJSwgI2ZmZmRkNyA2MiUsICM0YTRhNGEgNjElKTtcXHJcXG4gICAgYmFja2dyb3VuZC1zaXplOiA4MDBweDtcXHJcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCAwLCA0MDBweCA0MDBweDtcXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgUGF0dGVybiBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgY29sb3I6ICcjZGRkJyxcclxuICAgICAgcGF0dGVybjogJ0dyYXBoUGFwZXInLFxyXG4gICAgICBjZWxsV2lkdGg6IDEwMCxcclxuICAgICAgY2VsbEhlaWdodDogMTAwLFxyXG4gICAgICBsaW5lV2lkdGg6IDJcclxuICAgIH07XHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1BhdHRlcm4nO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhwcm9wcy5wYXR0ZXJuKTtcclxuICAgIGlmIChwcm9wcy5wYXR0ZXJuID09PSAnZ3JpZCcpIHtcclxuICAgICAgdGhpcy5jc3MoIFBhdHRlcm4ubWFrZUdyaWRDU1MocHJvcHMuY2VsbFdpZHRoLCBwcm9wcy5jZWxsV2lkdGgsIHByb3BzLmxpbmVXaWR0aCkgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBzdXBlci5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyBBZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xyXG4gICAgdmFyIHNpemUgPSBNYXRoLm1heCh0aGlzLnBhcmVudC4kZWxlbWVudC53aWR0aCgpLCB0aGlzLnBhcmVudC4kZWxlbWVudC5oZWlnaHQoKSk7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICBsZWZ0OiAnMHB4JywgdG9wOiAnMHB4JyxcclxuICAgICAgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVHdlYWsgdGhlIHNpemVcclxuICAgIGlmICh0aGlzLnByb3BzLnNpemUpIHtcclxuICAgICAgdGhpcy5jc3Moe2JhY2tncm91bmRTaXplOiB0aGlzLnByb3BzLnNpemUgKyAnJSd9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlR3JpZENTUyAoY2VsbFdpZHRoLCBjZWxsSGVpZ2h0LCBsaW5lV2lkdGgpIHtcclxuICAgIHZhciBwcm9wcyA9IHt9O1xyXG4gICAgdmFyIHBvcyA9ICctJyArIGxpbmVXaWR0aCArICdweCc7XHJcbiAgICBwcm9wcy5iYWNrZ3JvdW5kU2l6ZSA9ICcnICsgY2VsbFdpZHRoICsgJ3B4ICcgKyBjZWxsSGVpZ2h0ICsgJ3B4LCAnICsgY2VsbFdpZHRoICsgJ3B4ICcgKyBjZWxsSGVpZ2h0ICsgJ3B4JztcclxuICAgIHByb3BzLmJhY2tncm91bmRQb3NpdGlvbiA9IHBvcyArICcgJyArIHBvcyArICcsJyArIHBvcyArICcgJyArIHBvcztcclxuICAgIHByb3BzLmJhY2tncm91bmRJbWFnZSA9XHJcbiAgICAgICdsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSwnICtcclxuICAgICAgJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgJyArbGluZVdpZHRoKyAncHgsIHRyYW5zcGFyZW50ICcgK2xpbmVXaWR0aCsgJ3B4KSc7XHJcbiAgICByZXR1cm4gcHJvcHM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICAgIHJldHVybiByZXF1aXJlKCcuL1BhdHRlcm4uY3NzJyk7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm4pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xyXG5cclxuXHJcbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMuVCA9IFRpbWVyLm1ha2Uoe2NhbGxiYWNrOiB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgZGVsYXk6IHRoaXMuZGVsYXl9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0dGhpcy5ULnN0b3AoKTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIgKCkge1xyXG5cdFx0dGhpcy5jYWxsYmFjaygpO1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFB1bHNhcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFB1bHNhcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbnZhciBQSSA9IDMuMTQxNTkyNjUzNTk7XHJcbnZhciBIQUxGUEkgPSBQSS8yLjA7XHJcblxyXG5jbGFzcyBSYW5kIHtcclxuXHRzdGF0aWMgcmFuZEl0ZW0oYXJyKSB7XHJcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBhcnJbIFJhbmQucmFuZEludCgwLCBhcnIubGVuZ3RoLTEpIF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gKGluY2x1ZGVkKSBhbmQgbWF4IChpbmNsdWRlZClcclxuXHQvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcclxuXHRzdGF0aWMgcmFuZEludChtaW4sIG1heCkge1xyXG5cdFx0bWluID0gTWF0aC5jZWlsKG1pbnx8MCk7XHJcblx0XHRtYXggPSBNYXRoLmZsb29yKG1heHx8MSk7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIC45OTk5OTlcclxuXHRzdGF0aWMgcmFuZEZsb2F0KCkge1xyXG5cdCAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyByYW5kUGVyY2VudCh0aHJlc2hvbGQpIHtcclxuXHRcdHJldHVybiBSYW5kLnJhbmRJbnQoMSwxMDApIDwgdGhyZXNob2xkO1xyXG5cdH1cclxuXHJcblx0Ly8gcmFuZG9tIGludGVnZXIgd2l0aGluIG1heERpc3RhbmNlIG9mIHRhcmdldCAoZGlzdHJpYnV0ZWQgaW4gYSBiZWxsIGN1cnZlIGFyb3VuZCB0YXJnZXQpXHJcblx0c3RhdGljIHJhbmRDbG9zZVRvKHRhcmdldCwgbWF4RGlzdGFuY2UpIHtcclxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXHJcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZFNpbjIoKSk7ICAgLy8gc3ByZWFkIG92ZXIgZW50aXJlIHJhbmdlLCBzb21ld2hhdCBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgXHJcblx0XHRyZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogUmFuZC5yYW5kUG93MigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHdpdGggc2hhcnAgY29uY2VudHJhdGlvbiBhcm91bmQgY2VudGVyXHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXHJcblx0c3RhdGljIHJhbmRQb3coKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5wb3coMS4wIC0gUmFuZC5yYW5kRmxvYXQoKSwgNCk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCB0b3dhcmQgMVxyXG5cdHN0YXRpYyByYW5kU2luKCkge1xyXG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdzIoKSB7XHJcblx0XHRyZXR1cm4gUmFuZC5yYW5kUG93KCkgLSBSYW5kLnJhbmRQb3coKTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIDBcclxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcclxuXHRcdHJldHVybiAoKFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSkgLSAzLjApIC8gMy4wO1xyXG5cdH1cclxuXHJcbiAgICAvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgY2xvc2VyIHRvIDBcclxuICAgIHN0YXRpYyByYW5kU2luMigpIHtcclxuICAgICAgICByZXR1cm4gUmFuZC5yYW5kU2luKCkgLSBSYW5kLnJhbmRTaW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gYXJyYXkgb2YgMyBpbnRzLCBlYWNoIDAtMjU1XHJcbiAgICBzdGF0aWMgcmFuZFJHQigpIHtcclxuICAgICAgICByZXR1cm4gW1JhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSldO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByYW5kUkdCc3RyKCkge1xyXG5cdFx0dmFyIHJnYiA9IFJhbmQucmFuZFJHQigpO1xyXG4gICAgICAgIHJldHVybiAncmdiYSgnICtyZ2JbMF0rICcsJyArcmdiWzFdKyAnLCcgK3JnYlsyXSsgJywgLjkpJztcclxuICAgIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhSYW5kKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEJveCA9IHJlcXVpcmUoJy4uL0JveC9Cb3guanMnKTtcclxuXHJcbi8qKlxyXG4gKiAgdywgaCwgZGVwdGhcclxuICovXHJcbmNsYXNzIFJvb20gZXh0ZW5kcyBCb3gge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHR3OiAxNTAwLFxyXG5cdFx0XHRoOiAxMDAwLFxyXG5cdFx0XHRkOiAgODAwLFxyXG5cdFx0XHRib3JkZXI6ICcxcHggc29saWQgYmxhY2snLFxyXG5cdFx0XHRwZXJzcGVjdGl2ZTogJ2luaGVyaXQnICAvLyAnODAwMHB4J1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0dGhpcy53ID0gcHJvcHMudztcclxuXHRcdHRoaXMuaCA9IHByb3BzLmg7XHJcblx0XHR0aGlzLmQgPSBwcm9wcy5kO1xyXG5cdFx0dGhpcy53YWxscyA9IHt9O1xyXG5cclxuXHRcdHN1cGVyLmluaXQocHJvcHMpO1xyXG5cdFx0Ly8gdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnR5cGUgPSAnUm9vbSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMubWFrZVJvb20odGhpcy4kZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0c3VwZXIucmVuZGVyKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdG1ha2VSb29tKCkge1xyXG5cdFx0dmFyIHJvb20gPSB0aGlzO1xyXG5cdFx0dmFyIHdhbGxzID0gW107XHJcblx0XHR2YXIgaGFsZkhlaWdodCA9IHRoaXMuaC8yO1xyXG5cdFx0dmFyIGhhbGZXaWR0aCA9IHRoaXMudy8yO1xyXG5cdFx0dmFyIGhhbGZEZXB0aCA9IHRoaXMuZC8yO1xyXG5cclxuXHRcdHZhciB3cmFwcGVyID0gQm94Lm1ha2Uoe1xyXG5cdFx0XHR3aWR0aDogJzEwMCUnLFxyXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcclxuXHRcdFx0ekluZGV4OiAyMDAwMCxcclxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXHJcblx0XHRcdHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxyXG5cdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDFzJ1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gSW5uZXIgZmFjaW5nIHdhbGxzXHJcblx0XHQvLyB3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdmcm9udCcsIHtcclxuXHRcdC8vIFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknLFxyXG5cdFx0Ly8gXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdC8vIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0Ly8gXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAxODBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdC8vIH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdiYWNrJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgwLCAwLCAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVooICcgKyAoLWhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdyaWdodCcsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAwLCA1NSwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdsZWZ0Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLWhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCd0b3AnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDU1LCAyNTUsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtKGhhbGZIZWlnaHQgLSAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdib3R0b20nLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDI1NSwgMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCA4OWRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmSGVpZ2h0ICsgKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cclxuXHRcdC8vIE91dGVyIGZhY2luZyB3YWxsc1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0ZnJvbnQnLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDApJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArIChoYWxmRGVwdGgpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0YmFjaycsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMCwgMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtMTgwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHJpZ2h0Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDEwMCwgMTAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgoaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRsZWZ0Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDEwMCwgMTAwLCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHRvcCcsIHtcclxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDIwMCwgMSknLFxyXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRib3R0b20nLCB7XHJcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDEwMCwgMjAwLCAxMDAsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmSGVpZ2h0ICsgKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkgKyAncHggKSdcclxuXHRcdH0pICk7XHJcblxyXG5cdFx0Ly8gY29weSB3YWxscyBhcnJheSB0byBvYmplY3RcclxuXHRcdGZvciAodmFyIGk9MDsgaSA8IHdhbGxzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMud2FsbHNbIHdhbGxzW2ldLndoaWNoIF0gPSB3YWxsc1tpXTtcclxuXHRcdH1cclxuXHJcblx0XHR3cmFwcGVyLmFkZCh3YWxscyk7XHJcblx0XHRyb29tLmFkZCh3cmFwcGVyKTtcclxuXHR9XHJcblxyXG5cdG1ha2VXYWxsKHdoaWNoLCBjc3NWYWxzKSB7XHJcblx0XHR2YXIgZGVmYXVsdENTUyA9IHtcclxuXHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcclxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXHJcblx0XHRcdC8vIGxpbmVIZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdC8vIGZvbnRTaXplOiAodGhpcy5oLzMpICsncHgnLFxyXG5cdFx0XHQvLyBmb250V2VpZ2h0OiAnYm9sZCcsXHJcblx0XHRcdC8vIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcblx0XHRcdC8vIGNvbG9yOiAnd2hpdGUnLFxyXG5cdFx0XHRiYWNrZmFjZVZpc2liaWxpdHk6ICdoaWRkZW4nXHJcblx0XHR9O1xyXG5cdFx0dmFyIHdhbGwgPSBUaGluZy5jbGFzc2VzLkJveC5tYWtlKCQuZXh0ZW5kKHt9LCBkZWZhdWx0Q1NTLCBjc3NWYWxzKSk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKCd3YWxsJyk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKHdoaWNoKTtcclxuXHRcdC8vIHdhbGwuJGVsZW1lbnQuYXBwZW5kKHdoaWNoKTtcclxuXHRcdHdhbGwud2hpY2ggPSB3aGljaDtcclxuXHRcdHJldHVybiB3YWxsO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNzcyAoKSB7XHJcblx0XHQvLyByZXR1cm4gcmVxdWlyZSgnLi9Sb29tLmNzcycpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhSb29tKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUm9vbTtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFRleHRQYW5lIGV4dGVuZHMgVGhpbmcge1xyXG4gICAgaW5pdCAocHJvcHMpIHtcclxuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgVmVyZGFuYSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICAgICAgICBmb250U2l6ZTogJzI0cHgnLFxyXG4gICAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgICAgICAgICAgY29sb3I6ICdyZ2IoMjAwLCAyMDAsIDIwMCknLFxyXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgIHc6IDEwMCxcclxuICAgICAgICAgICAgaDogMTAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgICAgICBzdXBlci5pbml0KHByb3BzKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSAnVGV4dFBhbmUnO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcbiAgICB9XHJcblxyXG4gICAgZmlsbFRleHQgKCkge1xyXG4gICAgICAgIHZhciBtYXhIZWlnaHQgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBtYXggPSAxMDAwO1xyXG4gICAgICAgIHZhciAkc3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcclxuICAgICAgICB2YXIgc3BhbkhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgIC8vIGVsZW1lbnQgaGFzIHRvIGJlIGFwcGVuZGVkIHRvIGJvZHkgcHJpb3IsIG9yIHNwYW5IZWlnaHQgd2lsbCBiZSAwXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJHNwYW4pO1xyXG4gICAgICAgIHdoaWxlIChzcGFuSGVpZ2h0IDwgbWF4SGVpZ2h0ICYmIG1heC0tID4gMCkge1xyXG4gICAgICAgICAgICAkc3Bhbi5hcHBlbmQodGhpcy50ZXh0KTtcclxuICAgICAgICAgICAgc3BhbkhlaWdodCA9ICRzcGFuLmhlaWdodCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIgKCkge1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuZmlsbFRleHQodGhpcy50ZXh0KTtcclxuICAgIH1cclxufVxyXG5cclxuVGhpbmcuYWRkQ2xhc3MoVGV4dFBhbmUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0UGFuZTtcclxuIiwidmFyIGVsZW1lbnRDb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRoaW5nIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1RoaW5nJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUgKHByb3BzKSB7XHJcbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG4gICAgLy8gQ1NTIHByb3BzIGdvIGludG8gdGhpcy5wcm9wc1xyXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xyXG4gICAgLy8ga2VlcCB0aGVzZSBwcm9wZXJ0aWVzIG9uICd0aGlzJ1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IHByb3BzLnJvdGF0ZSB8fCAwO1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IHByb3BzLnNjYWxlIHx8IDE7XHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IDA7XHJcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IDA7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICB2YXIgcGFyZW50RWxlbWVudCA9ICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC4kZWxlbWVudCkgfHwgJChkb2N1bWVudC5ib2R5KTtcclxuICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kKHRoaXMuJGVsZW1lbnQpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5jc3ModGhpcy5wcm9wcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxyXG4gIHVuUmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLiRlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0RGltZW5zaW9ucyAoKSB7XHJcbiAgICByZXR1cm4ge3c6IHRoaXMuJGVsZW1lbnQud2lkdGgoKSwgaDogdGhpcy4kZWxlbWVudC5oZWlnaHQoKX07XHJcbiAgfVxyXG5cclxuICBnZXRCb3VuZGluZ0JveCAoKSB7XHJcbiAgICAvLyByZWxhdGl2ZSB0byBwYWdlXHJcbiAgICB2YXIgc2Nyb2xsdG9wID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICB2YXIgc2Nyb2xsbGVmdCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcclxuICAgIHZhciBib3VuZHMgPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogYm91bmRzLmxlZnQrc2Nyb2xsbGVmdCxcclxuICAgICAgeTogYm91bmRzLnRvcCtzY3JvbGx0b3AsXHJcbiAgICAgIHc6IGJvdW5kcy53aWR0aCxcclxuICAgICAgaDogYm91bmRzLmhlaWdodCxcclxuICAgICAgYm90dG9tOiBib3VuZHMuYm90dG9tK3Njcm9sbHRvcCxcclxuICAgICAgcmlnaHQ6IGJvdW5kcy5yaWdodCtzY3JvbGxsZWZ0XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0UG9zaXRpb24gKCkge1xyXG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxyXG4gICAgdmFyIHh5ID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKTtcclxuICAgIHZhciB6ID0gdGhpcy4kZWxlbWVudC5jc3MoJ3otaW5kZXgnKTtcclxuICAgIHogPSB6ID8gcGFyc2VJbnQoeikgOiB1bmRlZmluZWQ7XHJcbiAgICByZXR1cm4gW3h5LmxlZnQsIHh5LnRvcCwgel07XHJcbiAgfVxyXG5cclxuICAvLyByZXR1cm4gdGhlIGVsZW1lbnQncyBDU1MgdHJhbnNmb3JtIG1hdHJpeCBhcyBhcnJheSBvZiA2IHZhbHVlc1xyXG4gIGdldENTU1RyYW5zZm9ybSAoKSB7XHJcbiAgICB2YXIgbVN0ciA9IHRoaXMuJGVsZW1lbnQuY3NzKCd0cmFuc2Zvcm0nKS5tYXRjaCgvLT9bXFxkXFwuXSsvZyk7XHJcbiAgICB2YXIgbVZhbCA9IFtdO1xyXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbVN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtVmFsW2ldID0gcGFyc2VGbG9hdChtU3RyW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtVmFsO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlIChkZWdyZWVzKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IGRlZ3JlZXM7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByb3RhdGVUbyAoYW5nbGUpIHtcclxuICAgIHRoaXMucm90YXRpb24gPSBhbmdsZTtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNjYWxlIChmYWN0b3IpIHtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgKz0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGVUbyAoZmFjdG9yKSB7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNsYXRlICh4LCB5KSB7XHJcbiAgICB0aGlzLnggKz0geDtcclxuICAgIHRoaXMueSArPSB5O1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNsYXRlVG8gKHgsIHkpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNmb3JtICgpIHtcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgdHJhbnNmb3JtOiBUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGVGYWN0b3IsIHRoaXMueCwgdGhpcy55KVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGNzcyAocHJvcHMpIHtcclxuICAgIHRoaXMucHJvcHMgPSAkLmV4dGVuZCh0aGlzLnByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhwcm9wcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGh0bWwgKCkge1xyXG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3NzICgpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2UgKCkge1xyXG4gICAgdmFyIGNscyA9IHRoaXM7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XHJcbiAgICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENsYXNzIChjbHMpIHtcclxuICAgIFRoaW5nLmNsYXNzZXMgPSBUaGluZy5jbGFzc2VzIHx8IHt9O1xyXG4gICAgVGhpbmcuY2xhc3Nlc1tjbHMubmFtZV0gPSBjbHM7XHJcblxyXG4gICAgLy8gbG9hZCB0aGUgY2xhc3Mgc3R5bGVzICh0aGVzZSBhcmUgaW5jbHVkZWQgaW4gdGhlIGJ1bmRsZSBhdCBidWlsZCB0aW1lKVxyXG4gICAgY2xzLmNzcyAmJiBUaGluZy5hZGRDU1NTdHJpbmcoY2xzLmNzcygpLCBjbHMubmFtZSk7XHJcblxyXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgY3NzIGZpbGUgYXQgbG9hZCB0aW1lXHJcbiAgICBUaGluZy5hZGRDU1NGaWxlKGNscy5uYW1lICsgJy8nICsgY2xzLm5hbWUgKyAnLmNzcycsICdjc3MnK2Nscy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRDbGFzcyAobmFtZSkge1xyXG4gICAgcmV0dXJuIFRoaW5nLmNsYXNzZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xyXG5cclxuICBzdGF0aWMgbWFrZVN0eWxlcyAocHJvcHMpIHtcclxuICAgIHZhciBzdHlsZXMgPSBwcm9wcyB8fCB7fTtcclxuICAgICQuZXh0ZW5kKHN0eWxlcywge1xyXG4gICAgICAvLyBsZWZ0OiBwcm9wcy5sZWZ0IHx8IChwcm9wcy54ICYmIChwcm9wcy54ICsgXCJweFwiKSksXHJcbiAgICAgIC8vIHRvcDogcHJvcHMudG9wIHx8IChwcm9wcy55ICYmIChwcm9wcy55ICsgXCJweFwiKSksXHJcbiAgICAgIHdpZHRoOiBwcm9wcy53aWR0aCB8fCAocHJvcHMudyAmJiAocHJvcHMudyArIFwicHhcIikpLFxyXG4gICAgICBoZWlnaHQ6IHByb3BzLmhlaWdodCB8fCAocHJvcHMuaCAmJiAocHJvcHMuaCArIFwicHhcIikpLFxyXG4gICAgICB6SW5kZXg6IHByb3BzLnpJbmRleCB8fCBwcm9wcy56LFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHByb3BzLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgdHJhbnNmb3JtOiBwcm9wcy50cmFuc2Zvcm0gfHwgKFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1MocHJvcHMucm90YXRlLCBwcm9wcy5zY2FsZSwgcHJvcHMueCwgcHJvcHMueSkpLFxyXG4gICAgICBwb3NpdGlvbjogcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJ1xyXG4gICAgfSk7XHJcbiAgICBkZWxldGUgc3R5bGVzLnJvdGF0ZTtcclxuICAgIGRlbGV0ZSBzdHlsZXMuc2NhbGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLng7XHJcbiAgICBkZWxldGUgc3R5bGVzLnk7XHJcbiAgICBkZWxldGUgc3R5bGVzLno7XHJcbiAgICBkZWxldGUgc3R5bGVzLnc7XHJcbiAgICBkZWxldGUgc3R5bGVzLmg7XHJcbiAgICByZXR1cm4gc3R5bGVzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VUcmFuc2Zvcm1DU1MgKHJvdGF0ZSwgc2NhbGUsIHR4LCB0eSkge1xyXG4gICAgdmFyIHRyYW5zZm9ybSA9ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9ICh0eCB8fCB0eSkgPyAoVGhpbmcubWFrZVRyYW5zbGF0ZUNTUyh0eCwgdHkpICsgJyAnKSA6ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9IFRoaW5nLmlzTnVtZXJpYyhyb3RhdGUpID8gKFRoaW5nLm1ha2VSb3RhdGlvbkNTUyhyb3RhdGUpICkgOiAnJztcclxuICAgIHRyYW5zZm9ybSArPSBzY2FsZSA/IChUaGluZy5tYWtlU2NhbGVDU1Moc2NhbGUpICsgJyAnKSA6ICcnO1xyXG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlUm90YXRpb25DU1MgKGFuZ2xlKSB7XHJcbiAgICB2YXIgY3NzID0gJyc7XHJcbiAgICBpZiAoYW5nbGUgIT09IHVuZGVmaW5lZCAmJiBhbmdsZSAhPT0gbnVsbCkge1xyXG4gICAgICBpZiAodHlwZW9mIGFuZ2xlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICQuZWFjaChhbmdsZSwgZnVuY3Rpb24gKGF4aXNOYW1lLCBhbmdsZSkge1xyXG4gICAgICAgICAgY3NzICs9ICdyb3RhdGUnICsgYXhpc05hbWUudG9VcHBlckNhc2UoKSArICcoJyArYW5nbGUrICdkZWcpICc7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY3NzID0gJ3JvdGF0ZVooJythbmdsZSsnZGVnKSAnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY3NzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VTY2FsZUNTUyAoc2NhbGUpIHtcclxuICAgIHJldHVybiAnc2NhbGUoJytzY2FsZSsnKSc7XHJcbiAgfVxyXG5cclxuICAvLyBOT1RFOiB0cmFuc2xhdGlvbiBjb29yZHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBlbGVtZW50J3MgcG9zaXRpb24gaW4gdGhlIGRvY3VtZW50IGZsb3cuXHJcbiAgLy8gVGhleSBhcmUgbm90IHRoZSBzYW1lIGFzIHNldHRpbmcgbGVmdC90b3AgdmFsdWVzLCB3aGljaCBhcmUgYWJzb2x1dGUgY29vcmRpbmF0ZXNcclxuICAvLyByZWxhdGl2ZSB0byB0aGUgcGFyZW50IGVsZW1lbnQuXHJcbiAgc3RhdGljIG1ha2VUcmFuc2xhdGVDU1MgKHgsIHkpIHtcclxuICAgIHggPSB4IHx8ICcwJztcclxuICAgIHkgPSB5IHx8ICcwJztcclxuICAgIHJldHVybiAndHJhbnNsYXRlKCcrIHggKyAncHgsICcgKyB5ICsncHgpJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlRWxlbWVudCAoaHRtbCwgcHJvcHMsIHR5cGUpIHtcclxuICAgIHZhciAkZWxlbWVudCA9ICQoaHRtbClcclxuICAgICAgLmNzcyhUaGluZy5tYWtlU3R5bGVzKHByb3BzKSlcclxuICAgICAgLmFkZENsYXNzKHR5cGUgfHwgJ3JhbmRvbScpXHJcbiAgICAgIC5hdHRyKCdpZCcsICh0eXBlIHx8ICdyYW5kb20nKSArICgrK2VsZW1lbnRDb3VudGVyKSk7XHJcbiAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaXNOdW1lcmljKG4pIHtcclxuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbiAgfVxyXG5cclxuICAvLyBNYWtlIHN1cmUgbmVjZXNzYXJ5IENTUyBwcm9wZXJ0aWVzIGFyZSBwcmVzZW50IG9yIGRlZmF1bHRlZCB0byBzb21ldGhpbmcgc2FuZVxyXG4gIHN0YXRpYyBjbGVhbnVwIChwcm9wcykge1xyXG4gICAgdmFyIGNwID0gcHJvcHMgfHwge307XHJcbiAgICBjcC5wb3NpdGlvbiA9IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSc7ICAgLy8gZGVmYXVsdCB0byBhYnNvbHV0ZSBwb3NpdGlvbmluZ1xyXG4gICAgLy8gY3AueCA9IHByb3BzLnggfHwgcHJvcHMubGVmdCB8fCAwO1xyXG4gICAgLy8gY3AueSA9IHByb3BzLnkgfHwgcHJvcHMudG9wIHx8IDA7XHJcbiAgICAvLyBjcC56ID0gcHJvcHMueiB8fCBwcm9wcy56SW5kZXg7XHJcbiAgICAvLyBjcC53ID0gcHJvcHMudyB8fCBwcm9wcy53aWR0aDtcclxuICAgIC8vIGNwLmggPSBwcm9wcy5oIHx8IHByb3BzLmhlaWdodDtcclxuICAgIGNwLnJvdGF0aW9uID0gcHJvcHMucm90YXRpb24gfHwgMDtcclxuICAgIGNwLnNjYWxlID0gcHJvcHMuc2NhbGUgfHwgMTtcclxuICAgIHJldHVybiBjcDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NGaWxlKGZpbGVOYW1lLCBpZCkge1xyXG4gICAgIHZhciBsaW5rID0gJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiJyArIGZpbGVOYW1lICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XHJcbiAgICAgJCgnaGVhZCcpLmZpbmQoJyMnICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgICQoJ2hlYWQnKS5hcHBlbmQobGluayk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ1NTU3RyaW5nKGNzc1N0cmluZywgaWQpIHtcclxuICAgIGlmIChjc3NTdHJpbmcpIHtcclxuICAgICAgLy8gdmFyIGRvYyA9IHdpbmRvdy5kb2N1bWVudDtcclxuICAgICAgdmFyIHN0eWxlRWwgPSAkKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+JyArY3NzU3RyaW5nKyAnPC9zdHlsZT4nKVxyXG4gICAgICAgIC5hdHRyKCdpZCcsIChpZCB8fCAnVGhpbmcnKSArICctc3R5bGVzJyk7XHJcbiAgICAgICQoJ2hlYWQnKS5hcHBlbmQoc3R5bGVFbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBzdGF0aWMgbXNnKHMpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhzKTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoVGhpbmcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaGluZztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIEFjdGlvbiA9IHJlcXVpcmUoJy4uL0FjdGlvbi9BY3Rpb24uanMnKTtcclxuXHJcbmNsYXNzIFRpbWVyIGV4dGVuZHMgQWN0aW9uIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHRoaXMuY2FsbGJhY2sgPSBwcm9wcy5jYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcclxuXHRcdHRoaXMuZGVsYXkgPSBwcm9wcy5kZWxheSB8fCAxMDAwO1xyXG5cdFx0dGhpcy50aW1lcklEID0gbnVsbDtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XHJcblx0XHR0aGlzLnRpbWVySUQgPSBzZXRUaW1lb3V0KHRoaXMuY2FsbGJhY2ssIHRoaXMuZGVsYXkpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzdG9wICgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xyXG5cdFx0dGhpcy50aW1lcklEID0gbnVsbDtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoVGltZXIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFRyaWFuZ2xlIGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHRzaXplOiAxMCxcclxuXHRcdFx0Y29sb3I6ICcjQkFEQTU1J1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQocHJvcHMsIGRlZmF1bHRQcm9wcyk7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ1RyaWFuZ2xlJztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy5tYWtlVHJpYW5nbGUodGhpcy5wcm9wcy5zaXplLCB0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBlbGVtZW50IGJlZm9yZSBjYWxsaW5nIHRoaXNcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0bWFrZVRyaWFuZ2xlIChzaXplLCBjb2xvcikge1xyXG5cdFx0Y29sb3IgPSBjb2xvciB8fCAnI0JBREE1NSc7XHJcblx0XHRzaXplID0gc2l6ZSB8fCAxMDtcclxuXHRcdHRoaXMuY3NzKHtcclxuXHRcdFx0d2lkdGg6IDAsIFxyXG5cdFx0XHRoZWlnaHQ6IDAsIFxyXG5cdFx0XHRmb250U2l6ZTogMCxcclxuXHRcdFx0bGluZUhlaWdodDogMCxcclxuXHRcdFx0Ym9yZGVyQm90dG9tOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuXHRcdFx0Ym9yZGVyVG9wOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuXHRcdFx0Ym9yZGVyTGVmdDogc2l6ZSArICdweCBzb2xpZCAnICsgY29sb3JcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRyaWFuZ2xlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJpYW5nbGU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcclxucmVxdWlyZSgnLi9Cb3gvQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQXJyb3cvQXJyb3cuanMnKTtcclxucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGltZXIvVGltZXIuanMnKTtcclxucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcclxucmVxdWlyZSgnLi9QdWxzYXIvUHVsc2FyLmpzJyk7XHJcbnJlcXVpcmUoJy4vRG8vRG8uanMnKTtcclxucmVxdWlyZSgnLi9MYWJlbC9MYWJlbC5qcycpO1xyXG5yZXF1aXJlKCcuL0xpbmUvTGluZS5qcycpO1xyXG5yZXF1aXJlKCcuL0ltZy9JbWcuanMnKTtcclxucmVxdWlyZSgnLi9QYXR0ZXJuL1BhdHRlcm4uanMnKTtcclxucmVxdWlyZSgnLi9QYXR0ZXJuUG9sa2FEb3RzL1BhdHRlcm5Qb2xrYURvdHMuanMnKTtcclxucmVxdWlyZSgnLi9QYXR0ZXJuU3RyaXBlcy9QYXR0ZXJuU3RyaXBlcy5qcycpO1xyXG5yZXF1aXJlKCcuL0JHSW1nL0JHSW1nLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGV4dFBhbmUvVGV4dFBhbmUuanMnKTtcclxucmVxdWlyZSgnLi9DaXJjbGUvQ2lyY2xlLmpzJyk7XHJcbnJlcXVpcmUoJy4vVHJpYW5nbGUvVHJpYW5nbGUuanMnKTtcclxucmVxdWlyZSgnLi9DdWJlL0N1YmUuanMnKTtcclxucmVxdWlyZSgnLi9Sb29tL1Jvb20uanMnKTtcclxuXHJcbndpbmRvdy5UaGluZyA9IFRoaW5nO1xyXG4iXX0=
