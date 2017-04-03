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
module.exports = ".Pattern.GraphPaper {\n  background-color: #003;\n  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;\n  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;\n  background-image:\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);\n}\n\n.Pattern.Grid {\n  background-size: 100px 100px, 100px 100px;\n  background-position: -2px -2px, -2px -2px;\n  background-image:\n    linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),\n    linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px);\n}\n\n.Pattern.SofaDark {\n  background:\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\n    radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\n    radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\n  background-color: #300;\n  background-size: 25% 25%;\n}\n\n.Pattern.Sofa {\n  background:\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\n  background-color: #300;\n  background-size: 25% 25%;\n}\n\n.Pattern.YellowCirclesWithViolet {\n    background-image: radial-gradient(#ffd679 17%, #3d5443 17.5%, #3d5443 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3dabc7 12%, #49ab3c 13.5%, #38822e 14%, #ffdb89 14.5%, #ffdb89 19%, #fff57a 20%, #fcffb5 28%, #fffebd 29%);\n    background-size: 25%, 25%;\n    background-position: 0% 0%, 17% 17%;\n}\n\n.Pattern.YellowCirclesWithViolet2 {\n  background-image: radial-gradient(#ffdd90 17%, black 17.5%, black 18.2%, #3cdada 19%, #6de8e8 24%, #edcbfb 30%, transparent 36%), radial-gradient(#3cdada 17%, gray 17.5%, gray 18%, #ffdd90 19%, #ffdd90 24%, #ffff90 30%, #ffff90 36%);\n  background-size: 25%, 25%;\n  background-position: 0% 0%, 17% 17%;\n}\n\n.Pattern.PolkaDots {\n  background-image:\n    radial-gradient(white 15%, transparent 17%),\n    radial-gradient(white 15%, transparent 17%);\n  background-size: 60px 60px;\n  background-position: 0 0, 30px 30px;\n}\n\n.Pattern.PolkaDotsLarge {\n  background-image:\n    radial-gradient(#fffdd7 100px, transparent 103px),\n    radial-gradient(#fffdd7 100px, transparent 103px);\n  background-size: 500px;\n  background-position: 0 0, 250px 250px;\n}\n\n.Pattern.PolkaDiamondsWhiteGreen {\n    background-image:\n      radial-gradient(#fffdd7 9px, transparent 103px),\n      radial-gradient(#fffdd7 111px, transparent 103px);\n    background-size: 200px;\n    background-position: 0 0, 100px 100px;\n}\n\n.Pattern.BlueBalls {\n  background-image: radial-gradient(#acf 77%, rgba(88,99,255,.88) 80%, transparent 83%);\n  background-size: 25% 25%;\n}\n\n.Pattern.Stripes {\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,25,1) 50%);\n  background-size: 15%;\n}\n\n.Pattern.StripesOchre {\n  background-image: linear-gradient(90deg, transparent 50%, rgba(255,205,25,1) 50%);\n  background-size: 15%;\n}\n\n.Pattern.StripesWhiteRedGreen {\n  background-image:\n    linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),\n    linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),\n    linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%);\n  background-position: 0%, 0%, 0%;\n  background-size: 15%, 15%, 15%;\n}\n\n.Pattern.PlaidRed {\n  background-color: hsl(0, 86%, 34%);\n  background-image:\n    repeating-linear-gradient(transparent,\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\n      rgba(0,60,0,.5) 232px, transparent 232px),\n    repeating-linear-gradient(270deg, transparent,\n      transparent 50px, rgba(40,0,160,.4) 50px, rgba(40,0,160,.4) 53px, transparent 53px,\n      transparent 63px, rgba(40,0,160,.4) 63px, rgba(40,0,160,.4) 66px, transparent 66px,\n      transparent 116px, rgba(0,60,0,.5) 116px, rgba(0,60,0,.5) 166px, rgba(255,255,200,.3) 166px, rgba(255,255,200,.3) 169px, rgba(0,60,0,.5) 169px,\n      rgba(0,60,0,.5) 179px, rgba(255,255,200,.3) 179px, rgba(255,255,200,.3) 182px, rgba(0,60,0,.5) 182px,\n      rgba(0,60,0,.5) 232px, transparent 232px),\n    repeating-linear-gradient(125deg, transparent,\n      transparent 2px, rgba(0,0,0,.2) 2px,\n      rgba(0,0,0,.2) 3px, transparent 3px,\n      transparent 5px, rgba(0,0,0,.2) 5px);\n}\n\n.Pattern.PlaidRedLarge {\n  background-color: hsl(0, 86%, 34%);\n  background-image:\n    repeating-linear-gradient(transparent,\n      transparent 200px, rgba(40,0,160,.4) 200px, rgba(40,0,160,.4) 212px, transparent 212px,\n      transparent 252px, rgba(40,0,160,.4) 252px, rgba(40,0,160,.4) 264px, transparent 264px,\n      transparent 464px, rgba(0,60,0,.5) 464px, rgba(0,60,0,.5) 664px, rgba(255,255,200,.3) 664px, rgba(255,255,200,.3) 676px, rgba(0,60,0,.5) 676px,\n      rgba(0,60,0,.5) 716px, rgba(255,255,200,.3) 716px, rgba(255,255,200,.3) 728px, rgba(0,60,0,.5) 728px,\n      rgba(0,60,0,.5) 928px, transparent 928px),\n    repeating-linear-gradient(270deg, transparent,\n      transparent 200px, rgba(40,0,160,.4) 200px, rgba(40,0,160,.4) 212px, transparent 212px,\n      transparent 252px, rgba(40,0,160,.4) 252px, rgba(40,0,160,.4) 264px, transparent 264px,\n      transparent 464px, rgba(0,60,0,.5) 464px, rgba(0,60,0,.5) 664px, rgba(255,255,200,.3) 664px, rgba(255,255,200,.3) 676px, rgba(0,60,0,.5) 676px,\n      rgba(0,60,0,.5) 716px, rgba(255,255,200,.3) 716px, rgba(255,255,200,.3) 728px, rgba(0,60,0,.5) 728px,\n      rgba(0,60,0,.5) 928px, transparent 928px),\n    repeating-linear-gradient(125deg, transparent,\n      transparent 8px, rgba(0,0,0,.2) 8px,\n      rgba(0,0,0,.2) 12px, transparent 12px,\n      transparent 20px, rgba(0,0,0,.2) 20px);\n}\n\n.Pattern.PlaidRedLargeX {\n  background-color: hsl(0, 86%, 34%);\n  background-image:\n    repeating-linear-gradient(transparent,\n      transparent 250px, rgba(40,0,160,.4) 250px, rgba(40,0,160,.4) 265px, transparent 265px,\n      transparent 315px, rgba(40,0,160,.4) 315px, rgba(40,0,160,.4) 330px, transparent 330px,\n      transparent 580px, rgba(0,60,0,.5) 580px, rgba(0,60,0,.5) 830px, rgba(255,255,200,.3) 830px, rgba(255,255,200,.3) 845px, rgba(0,60,0,.5) 845px,\n      rgba(0,60,0,.5) 895px, rgba(255,255,200,.3) 895px, rgba(255,255,200,.3) 910px, rgba(0,60,0,.5) 910px,\n      rgba(0,60,0,.5) 1160px, transparent 1160px),\n    repeating-linear-gradient(270deg, transparent,\n      transparent 250px, rgba(40,0,160,.4) 250px, rgba(40,0,160,.4) 265px, transparent 265px,\n      transparent 315px, rgba(40,0,160,.4) 315px, rgba(40,0,160,.4) 330px, transparent 330px,\n      transparent 580px, rgba(0,60,0,.5) 580px, rgba(0,60,0,.5) 830px, rgba(255,255,200,.3) 830px, rgba(255,255,200,.3) 845px, rgba(0,60,0,.5) 845px,\n      rgba(0,60,0,.5) 895px, rgba(255,255,200,.3) 895px, rgba(255,255,200,.3) 910px, rgba(0,60,0,.5) 910px,\n      rgba(0,60,0,.5) 1160px, transparent 1160px),\n    repeating-linear-gradient(125deg, transparent,\n      transparent 10px, rgba(0,0,0,.2) 10px,\n      rgba(0,0,0,.2) 15px, transparent 15px,\n      transparent 25px, rgba(0,0,0,.2) 25px);\n}\n\n.Pattern.DiagonalStripes {\n  background-image: linear-gradient(45deg, black 25%, transparent 25.15%, transparent 50%, black 50.15%, black 75%, transparent 75.15%, transparent);\n  background-size: 16% 16%;  /* must match aspect ratio of containing element or lines will break */\n        /* ie. 32% 16% for an element with w=100 h=200 */\n        /* Powers of 2 work best (other values, like 7 or 23, make jaggy aliasing) */\n}\n\n.Pattern.DiagonalStripesViolet {\n  background-image: linear-gradient(45deg, #0e0030 25%, transparent 25.15%, transparent 50%, #0e0030 50.15%, #0e0030 75%, transparent 75.15%, transparent);\n  background-size: 6%;\n}\n\n.Pattern.BlueCascade {\n  background-color: #026873;\n  background-image: linear-gradient(91deg, rgba(255,255,25,0.17) 50%, transparent 51.5%),\n    linear-gradient(89deg, rgba(25,255,255,0.23) 50%, transparent 54.5%),\n    linear-gradient(90.5deg, transparent 50%, rgba(252, 255, 162, 0.37) 54.5%),\n    linear-gradient(90deg, transparent 50.75%, red 51%, red 51.5%, transparent 51.75%);\n  background-size: 5% 100%, 3% 100%, 9% 100%, 8% 100%;\n}\n\n /*Perlin Noise-ish radial blurs*/\n  /*RGB*/\n  /*background-image: radial-gradient(rgba(255, 42, 0, .5) 1%, transparent 200%), radial-gradient(rgba(86, 250, 2, .5) 1%, transparent 200%), radial-gradient(rgba(0, 7, 255, 0.6) 1%, transparent 150%);\n  background-size: 161px, 134px, 188px;\n  background-position: -54px, 57px, 55px;\n  */\n\n  /*Monochrome - better blurs*/\n/*\n  background-image: radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%), radial-gradient(rgba(9, 1, 112, 0.56) 0%, rgba(9, 1, 112, 0.25) 48%, rgba(9, 1, 112, 0.16) 65%, rgba(9, 1, 112, 0.12) 94%);\n  background-size: 188px 347px, 170px, 209px;\n  background-position: -54px, 57px, 55px;\n*/\n\n.Pattern.GreenOvalsXray {\n  background-color: #131c0c;\n  background-image:\n    radial-gradient(rgba(18, 0, 255, 0) 0%, rgba(3, 179, 255, 0.09) 48%, rgba(199, 237, 44, 0.19) 65%, rgba(9, 1, 112, 0) 94%),\n    radial-gradient(rgba(9, 1, 112, 0) 0%, rgba(205, 0, 0, 0.07) 48%, rgba(254, 204, 0, 0.11) 65%, rgba(255, 210, 8, 0) 94%),\n    radial-gradient(rgba(9, 1, 112, 0.01) 0%, rgba(85, 255, 59, 0.08) 48%, rgba(174, 202, 0, 0.16) 65%, rgba(9, 1, 112, 0) 94%);\n    background-size: 188px 347px, 170px, 209px;\n  background-position: -54px, 57px, 55px;\n}\n\n.Pattern.DarkDonuts {\n    background-image:\n      radial-gradient(black 10%, #fffdd7 60%, transparent 61%),\n      radial-gradient(#292929 1%, #fffdd7 50%, #fffdd7 62%, #4a4a4a 61%);\n    background-size: 800px;\n    background-position: 0 0, 400px 400px;\n}\n";

},{}],17:[function(require,module,exports){
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

},{"../Thing/Thing.js":24,"./Pattern.css":16}],18:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],19:[function(require,module,exports){
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

},{"../Thing/Thing.js":24}],20:[function(require,module,exports){
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

},{"./Action/Action.js":1,"./Arrow/Arrow.js":3,"./BGImg/BGImg.js":4,"./Box/Box.js":5,"./Circle/Circle.js":6,"./Cube/Cube.js":8,"./DemoBox/DemoBox.js":10,"./Do/Do.js":11,"./Img/Img.js":12,"./Label/Label.js":13,"./Line/Line.js":15,"./Pattern/Pattern.js":17,"./PatternPolkaDots/PatternPolkaDots.js":18,"./PatternStripes/PatternStripes.js":19,"./Pulsar/Pulsar.js":20,"./Rand/Rand.js":21,"./Room/Room.js":22,"./TextPane/TextPane.js":23,"./Thing/Thing.js":24,"./Timer/Timer.js":25,"./Triangle/Triangle.js":26}]},{},[27])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9DdWJlL0N1YmUuaHRtbCIsInNyYy9saWIvQ3ViZS9DdWJlLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guY3NzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmNzcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uY3NzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1BhdHRlcm5Qb2xrYURvdHMvUGF0dGVyblBvbGthRG90cy5qcyIsInNyYy9saWIvUGF0dGVyblN0cmlwZXMvUGF0dGVyblN0cmlwZXMuanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUm9vbS9Sb29tLmpzIiwic3JjL2xpYi9UZXh0UGFuZS9UZXh0UGFuZS5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL1RpbWVyL1RpbWVyLmpzIiwic3JjL2xpYi9UcmlhbmdsZS9UcmlhbmdsZS5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIEFjdGlvbiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHR9XG5cblx0aW5pdCAocHJvcHMpIHtcblx0XHR0aGlzLnByb3BzID0gcHJvcHMgfHwge307XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnbyAoKSB7XG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uZ28oKScpO1xuXHR9XG5cblx0c3RvcCAoKSB7XG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uc3RvcCgpJyk7XG5cdH1cblxuXHRzdGF0aWMgbWFrZSAoKSB7XG5cdCAgdmFyIGNscyA9IHRoaXM7XG5cdCAgdmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xuXHQgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cdCAgcmV0dXJuIGluc3RhbmNlO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhBY3Rpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbjtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIvKiByZXF1aXJlZCBmb3IgYXJyb3cgKi9cXG4uYXJyb3ctaGVhZCB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcbiAgd2lkdGg6IDA7IFxcbiAgaGVpZ2h0OiAwOyBcXG4gIGJvcmRlci10b3A6IDMwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWxlZnQ6IDMwcHggc29saWQgZ3JlZW47XFxufVxcblxcbi5hcnJvdy1ib2R5IHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgaGVpZ2h0OiAyMHB4O1xcbiAgbWFyZ2luOiAwO1xcbiAgbWFyZ2luLXRvcDogMjBweDtcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxuICBib3JkZXItbGVmdDogMDtcXG4gIGJvcmRlci1yaWdodDogMDtcXG59XFxuXFxuLmFycm93LXdyYXBwZXIge1xcbiAgd2lkdGg6IDcwcHg7ICAgLyogYXJyb3ctYm9keSB3aWR0aCArIGFycm93LWhlYWQgYm9yZGVyIHdpZHRoICovXFxufVxcblxcbi5BcnJvdyB7XFxuICAvKiBGb3Igc29tZSBuaWNlIGFuaW1hdGlvbiBvbiB0aGUgcm90YXRlczogKi9cXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjJzO1xcbiAgICAgLW1vei10cmFuc2l0aW9uOiAgICAtbW96LXRyYW5zZm9ybSAuMnM7XFxuICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgdHJhbnNmb3JtIC4ycztcXG59XFxuXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBBcnJvdyBleHRlbmRzIFRoaW5nIHtcblx0aW5pdCAocHJvcHMpIHtcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuXHRcdHRoaXMudHlwZSA9ICdBcnJvdyc7XG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG5cdFx0dGhpcy5zZXRDb2xvcih0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBhcnJvdyBiZWZvcmUgY2FsbGluZyB0aGlzXG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c2V0Q29sb3IgKGMpIHtcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1oZWFkJykuY3NzKHtib3JkZXJMZWZ0Q29sb3I6Y30pO1xuXHRcdHRoaXMuJGVsZW1lbnQuZmluZCgnLmFycm93LWJvZHknKS5jc3Moe2JhY2tncm91bmRDb2xvcjpjfSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRodG1sICgpIHtcblx0XHRyZXR1cm4gXCI8ZGl2PjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PjwvZGl2PlwiO1xuXHR9XG5cblx0c3RhdGljIGNyZWF0ZUFycm93RWxlbWVudCAoKSB7XG5cdFx0dmFyICRhcnJvdyA9ICQoXCI8ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj5cIik7XG5cdFx0cmV0dXJuICRhcnJvdztcblx0fVxuXG5cdHN0YXRpYyBjc3MgKCkge1xuXHRcdHJldHVybiByZXF1aXJlKCcuL0Fycm93LmNzcycpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhBcnJvdyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBCR0ltZyBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgbGVmdDogJzBweCcsXG4gICAgICB0b3A6ICcwcHgnXG4gICAgfTtcbiAgICBwcm9wcyA9IHRoaXMucHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcbiAgICB0aGlzLnR5cGUgPSAnQkdJbWcnO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBiYWNrZ3JvdW5kOiAndXJsKFwiJyArIHByb3BzLnVybCArICdcIikgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogJ2NvdmVyJyAgLy8xMDAlIDEwMCUnXG4gICAgfSk7XG4gIH1cbn1cblRoaW5nLmFkZENsYXNzKEJHSW1nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCR0ltZztcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIEJveCBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgXHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuICBcdHRoaXMudHlwZSA9ICdCb3gnO1xuICBcdHRoaXMuaXRlbXMgPSBbXTtcbiAgXHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gIH1cblxuICBhZGQgKGFkZEl0ZW1zKSB7XG4gIFx0aWYgKGFkZEl0ZW1zKSB7XG4gICAgICBpZiAoIShhZGRJdGVtcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICBhZGRJdGVtcyA9IFthZGRJdGVtc107XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpPTA7IGkgPCBhZGRJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLml0ZW1zLnB1c2goYWRkSXRlbXNbaV0pO1xuICAgICAgICBhZGRJdGVtc1tpXS5wYXJlbnQgPSB0aGlzOyAgICAgICAgXG4gICAgICB9XG4gIFx0fVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSB0aGlzIGJveCAoZnJvbSB0aGUgZG9tIGFuZCB0aGUgaXRlbXMgbGlzdClcbiAgcmVtb3ZlIChpdGVtKSB7XG4gIFx0aWYgKGl0ZW0pIHtcbiAgXHRcdHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKTtcbiAgXHRcdGlmIChpbmRleCA+IC0xKSB7XG4gIFx0XHQgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICBcdFx0XHRpdGVtLiRlbGVtZW50LnJlbW92ZSgpO1xuICBcdFx0XHRpdGVtLnBhcmVudCA9IG51bGw7XG4gIFx0XHR9XG4gIFx0fVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbnVtRWxlbWVudHMgKCkge1xuICBcdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgfVxuXG4gIGdldEVsZW1lbnRCb3VuZHMgKCkge1xuICAgIHZhciBib3VuZHMgPSB7eDo5OTk5OTksIHk6OTk5OTk5LCBib3R0b206MCwgcmlnaHQ6MH07XG4gICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZm9yICh2YXIgaT0wOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvcyA9IHRoaXMuaXRlbXNbaV0uZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgIGJvdW5kcy54ID0gKHBvcy54IDwgYm91bmRzLngpID8gcG9zLnggOiBib3VuZHMueDtcbiAgICAgIGJvdW5kcy55ID0gKHBvcy55IDwgYm91bmRzLnkpID8gcG9zLnkgOiBib3VuZHMueTtcbiAgICAgIGJvdW5kcy5ib3R0b20gPSAocG9zLmJvdHRvbSA+IGJvdW5kcy5ib3R0b20pID8gcG9zLmJvdHRvbSA6IGJvdW5kcy5ib3R0b207XG4gICAgICBib3VuZHMucmlnaHQgPSAocG9zLnJpZ2h0ID4gYm91bmRzLnJpZ2h0KSA/IHBvcy5yaWdodCA6IGJvdW5kcy5yaWdodDtcbiAgICB9XG4gICAgYm91bmRzLncgPSBib3VuZHMucmlnaHQgLSBib3VuZHMueDtcbiAgICBib3VuZHMuaCA9IGJvdW5kcy5ib3R0b20gLSBib3VuZHMueTtcbiAgICByZXR1cm4gYm91bmRzO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgXHRzdXBlci5yZW5kZXIoKTtcbiAgXHRmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIFx0XHR0aGlzLml0ZW1zW2ldLnJlbmRlcigpO1xuICBcdH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoQm94KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb3g7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBDaXJjbGUgZXh0ZW5kcyBUaGluZyB7XG4gIGluaXQgKHByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIHRleHQ6ICcnLFxuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIHI6IDI1LFxuICAgICAgZm9udEZhbWlseTogJ0NhbGlicmksIEFyaWFsLCBzYW5zLXNlcmlmJyxcbiAgICAgIGZvbnRTaXplOiAnMjRweCcsXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICBjb2xvcjogJyMwZjAnLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzIyMicsXG4gICAgICBib3JkZXJDb2xvcjogJyNCQURBNTUnLFxuICAgICAgYm9yZGVyV2lkdGg6IDVcbiAgICB9O1xuXG4gICAgcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG4gICAgc3VwZXIuaW5pdChwcm9wcyk7XG4gICAgdGhpcy50eXBlID0gJ0NpcmNsZSc7XG4gICAgdGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcblxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xuXG4gICAgLy8gYXBwbHkgY2lyY2xlIGNzc1xuICAgIHZhciBvZmZzZXQgPSBwcm9wcy5yICsgcHJvcHMuYm9yZGVyV2lkdGg7XG4gICAgdGhpcy5jc3Moe1xuICAgICAgICAnbGVmdCc6ICcnICsgKHByb3BzLmxlZnQtb2Zmc2V0KSArICdweCcsXG4gICAgICAgICd0b3AnOiAnJyArIChwcm9wcy50b3Atb2Zmc2V0KSArICdweCcsXG4gICAgICAgICd3aWR0aCc6ICcnICsgcHJvcHMucioyICsgJ3B4JyxcbiAgICAgICAgJ2hlaWdodCc6ICcnICsgcHJvcHMucioyICsgJ3B4JyxcbiAgICAgICAgJ2xpbmVIZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXG4gICAgICAgICdib3JkZXInOiBwcm9wcy5ib3JkZXJXaWR0aCArICdweCBzb2xpZCAnICsgcHJvcHMuYm9yZGVyQ29sb3IsXG4gICAgICAgICdib3JkZXJSYWRpdXMnOiAnMTAwMDBweCcsXG4gICAgICAgICd0ZXh0QWxpZ24nOiAnY2VudGVyJyxcbiAgICAgICAgJ292ZXJmbG93JzogJ2hpZGRlbidcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5zZXRUZXh0KHRoaXMudGV4dCk7XG4gIH1cblxuICBzZXRUZXh0ICh0eHQpIHtcbiAgICB0aGlzLnRleHQgPSB0eHQ7XG4gICAgdGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0eHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBzdXBlci5yZW5kZXIoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoQ2lyY2xlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdj48ZGl2IGlkPWN1YmUgY2xhc3M9c2hvdy1mcm9udD48ZmlndXJlIGNsYXNzPWZyb250PkY8L2ZpZ3VyZT48ZmlndXJlIGNsYXNzPWJhY2s+QjwvZmlndXJlPjxmaWd1cmUgY2xhc3M9cmlnaHQ+UjwvZmlndXJlPjxmaWd1cmUgY2xhc3M9bGVmdD5MPC9maWd1cmU+PGZpZ3VyZSBjbGFzcz10b3A+VDwvZmlndXJlPjxmaWd1cmUgY2xhc3M9Ym90dG9tPkc8L2ZpZ3VyZT48L2Rpdj48L2Rpdj5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbi8qKlxuICogIHcsIGgsIGRlcHRoXG4gKi9cbmNsYXNzIEN1YmUgZXh0ZW5kcyBUaGluZyB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcblx0XHRcdHc6IDUwMCxcblx0XHRcdGg6IDUwMCxcblx0XHRcdGQ6IDUwMFxuXHRcdH07XG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG5cdFx0dGhpcy53ID0gcHJvcHMudztcblx0XHR0aGlzLmggPSBwcm9wcy5oO1xuXHRcdHRoaXMuZCA9IHByb3BzLmQ7XG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcblx0XHR0aGlzLnR5cGUgPSAnQ3ViZSc7XG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG5cdFx0dGhpcy5zZXR1cEN1YmUodGhpcy4kZWxlbWVudCk7XG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c2V0dXBDdWJlKCRlbCkge1xuXHRcdHZhciAkY29udGFpbmVyICA9ICRlbDtcblx0XHR2YXIgJGN1YmUgICAgICAgPSAkZWwuZmluZCgnI2N1YmUnKTtcblx0XHR2YXIgJGZhY2VGcm9udCAgPSAkZWwuZmluZCgnI2N1YmUgLmZyb250ICcpO1xuXHRcdHZhciAkZmFjZUJhY2sgICA9ICRlbC5maW5kKCcjY3ViZSAuYmFjayAgJyk7XG5cdFx0dmFyICRmYWNlUmlnaHQgID0gJGVsLmZpbmQoJyNjdWJlIC5yaWdodCAnKTtcblx0XHR2YXIgJGZhY2VMZWZ0ICAgPSAkZWwuZmluZCgnI2N1YmUgLmxlZnQgICcpO1xuXHRcdHZhciAkZmFjZVRvcCAgICA9ICRlbC5maW5kKCcjY3ViZSAudG9wICAgJyk7XG5cdFx0dmFyICRmYWNlQm90dG9tID0gJGVsLmZpbmQoJyNjdWJlIC5ib3R0b20nKTtcblxuXHRcdHZhciBoYWxmSGVpZ2h0ID0gdGhpcy5oLzI7XG5cdFx0dmFyIGhhbGZXaWR0aCA9IHRoaXMudy8yO1xuXHRcdHZhciBoYWxmRGVwdGggPSB0aGlzLmQvMjtcblxuXHRcdCRjb250YWluZXIuY3NzKHtcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRsZWZ0OiAnMHB4Jyxcblx0XHRcdHRvcDogJzBweCcsXG5cdFx0XHRwZXJzcGVjdGl2ZTogJzYwMDBweCcsXG5cdFx0XHR6SW5kZXg6IDIwMDAwXG5cdFx0fSk7XG5cblx0XHQkY3ViZS5jc3Moe1xuXHRcdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdFx0ekluZGV4OiAyMDAwMCxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0dHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCcsXG5cdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDFzJ1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VGcm9udCwge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjIpJyxcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggMGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcblx0XHR9KTtcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUJhY2ssIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKCAgMCwgICAwLCAgIDAsIC41KScsXG5cdFx0ICBcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdCAgXHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIC0xODBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXG5cdFx0fSk7XG5cdFx0dGhpcy5zZXR1cEZhY2UoJGZhY2VSaWdodCwge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAgIDAsICA1NSwgLjUpJyxcblx0XHQgIFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JywgXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoICAgOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKScgIC8qIGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSAqL1xuXHRcdH0pO1xuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlTGVmdCwge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsICAgMCwgLjUpJyxcblx0XHQgIFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0ICBcdGhlaWdodDogdGhpcy5oICsgJ3B4JywgXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoICAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKScgIC8qIGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSAqL1xuXHRcdH0pO1xuXHRcdHRoaXMuc2V0dXBGYWNlKCRmYWNlVG9wLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSggIDAsICA1NSwgMjU1LCAuNSknLFxuXHRcdCAgXHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHQgIFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLCBcblx0XHQgIFx0dHJhbnNmb3JtOiAncm90YXRlWCggICA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcblx0XHR9KTtcblx0XHR0aGlzLnNldHVwRmFjZSgkZmFjZUJvdHRvbSwge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoICAwLCAyNTUsICAgMCwgLjUpJyxcblx0XHQgIFx0d2lkdGg6IHRoaXMudyArICdweCcsXG5cdFx0ICBcdGhlaWdodDogdGhpcy5kICsgJ3B4JywgXG5cdFx0ICBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoICAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSArICdweCApJ1xuXHRcdH0pO1xuXHR9XG5cblx0c2V0dXBGYWNlKCRmYWNlLCBjc3NWYWxzKSB7XG5cdFx0dmFyIGRlZmF1bHRDU1MgPSB7XG5cdFx0XHRkaXNwbGF5OiAnYmxvY2snLFxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRsaW5lSGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0Zm9udFNpemU6ICh0aGlzLmgvMykgKydweCcsXG5cdFx0XHRmb250V2VpZ2h0OiAnYm9sZCcsXG5cdFx0XHRjb2xvcjogJ3doaXRlJyxcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcidcblx0XHR9O1xuXHRcdCRmYWNlLmNzcygkLmV4dGVuZCh7fSwgZGVmYXVsdENTUywgY3NzVmFscykpO1xuXHR9XG5cblx0aHRtbCAoKSB7XG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQ3ViZS5odG1sJyk7XG5cdH1cblxuXHRzdGF0aWMgY3NzICgpIHtcblx0XHQvLyByZXR1cm4gcmVxdWlyZSgnLi9DdWJlLmNzcycpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhDdWJlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdWJlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcbi5EZW1vQm94IHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG1hcmdpbjogMjBweDtcXG4gIHdpZHRoOiAyMDBweDsgXFxuICBoZWlnaHQ6IDIwMHB4OyBcXG4gIGJvcmRlcjogMnB4IGRhc2hlZCAjZWVlO1xcbn1cXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xuXG5jbGFzcyBEZW1vQm94IGV4dGVuZHMgQm94IHtcblx0aW5pdCAocHJvcHMpIHtcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xuXHRcdHN1cGVyLmluaXQocHJvcHMpO1xuXHRcdHByb3BzLndpZHRoID0gcHJvcHMud2lkdGggfHwgMjAwO1xuXHRcdHByb3BzLmhlaWdodCA9IHByb3BzLmhlaWdodCB8fCAyMDA7XG5cdFx0cHJvcHMucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXHRcdHRoaXMudHlwZSA9ICdEZW1vQm94Jztcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c3RhdGljIGNzcyAoKSB7XG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vRGVtb0JveC5jc3MnKTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoRGVtb0JveCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVtb0JveDtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbi8vIExpa2UgVW5peCBwaXBlOiBvdXRwdXQgb2Ygb25lIGNvbW1hbmQgaXMgaW5wdXQgdG8gdGhlIG5leHRcbi8vIEVhY2ggZnVuY3Rpb24gdGFrZXMgYSAncHJvcHMnIG9iamVjdCBhcyBhcmd1bWVudFxuLy8gRWFjaCBmdW5jdGlvbiByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHJlc3VsdHMsIHdoaWNoIGlzIHBhc3NlZCBhcyBwcm9wcyB0byB0aGUgbmV4dFxuLy8gRG8oKSByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgdGhlIERvIGNoYWluXG5cbi8vIFAucHVsc2Uuc2V0VG8oXG4vLyAgICAgRG8oUi5nZXRSYW5kb21OdW1iZXIsIHtmcm9tOjAsIHRvOjEwfSkgICAvLyByZXR1cm5zOiAge2RhdGE6IDh9XG4vLyAgICAgLkRvKEMucGlja0NvbG9yKSAgICAvLyByZWFkcyBpbnB1dCA4LCByZXR1cm5zIHtkYXRhOiAnI2NmZid9XG4vLyAgICAgLkRvKEIuY2hhbmdlQ29sb3IpICAgLy8gcmVhZHMgaW5wdXQgJyNjZmYnLCBjaGFuZ2VzIGNvbG9yIG9uIEJsaW5rZXJcbi8vICk7XG5cblxuZnVuY3Rpb24gRG8oX2FGdW5jdGlvbiwgX3Byb3BzLCBfZmlyc3REbykge1xuICAgIHZhciBhRnVuY3Rpb24gPSBfYUZ1bmN0aW9uO1xuICAgIHZhciBwcm9wcyA9IF9wcm9wcztcbiAgICB2YXIgZmlyc3REbyA9IF9maXJzdERvIHx8IGV4ZWN1dG9yO1xuXG4gICAgLy8gY29uc29sZS5sb2coJ2FmdW5jdGlvbj0nLCBhRnVuY3Rpb24pO1xuICAgIC8vIGNvbnNvbGUubG9nKCdwcm9wcz0nLCBwcm9wcyk7XG4gICAgLy8gY29uc29sZS5sb2coJ2ZpcnN0RG89JywgZmlyc3REbyk7XG5cbiAgICAvLyBSdW4gdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cy5cbiAgICAvLyBQYXNzIHRoZSByZXN1bHRzIHRvIHRoZSBuZXh0IGNoYWluZWQgZnVuY3Rpb24gKGlmIGFueSkuXG4gICAgLy8gUmV0dXJuIHJlc3VsdHMgb2YgdGhpcyBmdW5jdGlvbiBvciBvZiB0aGUgY2hhaW5cbiAgICBmdW5jdGlvbiBleGVjdXRvciAocGlwZWRQcm9wcykge1xuICAgICAgICB2YXIgcmV0dXJuVmFsID0gYUZ1bmN0aW9uKHByb3BzIHx8IHBpcGVkUHJvcHMpO1xuICAgICAgICByZXR1cm4gKGV4ZWN1dG9yLm5leHREbyA/IGV4ZWN1dG9yLm5leHREbyhyZXR1cm5WYWwpIDogcmV0dXJuVmFsKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdGhlIGxhc3QgJ0RvJyBpbiB0aGUgY2hhaW5cbiAgICBmdW5jdGlvbiBnZXRMYXN0RG8gKCkge1xuICAgICAgICB2YXIgdG1wRG8gPSBmaXJzdERvO1xuICAgICAgICB3aGlsZSAodG1wRG8ubmV4dERvKSB7IHRtcERvID0gdG1wRG8ubmV4dERvOyB9XG4gICAgICAgIHJldHVybiB0bXBEbztcbiAgICB9XG5cbiAgICAvLyBBZGQgYSBuZXcgJ0RvJyB0byB0aGUgZW5kIG9mIHRoZSBjaGFpbi5cbiAgICBleGVjdXRvci5EbyA9IGZ1bmN0aW9uIChhRnVuY3Rpb24sIHByb3BzKSB7XG4gICAgICAgIGdldExhc3REbygpLm5leHREbyA9IERvKGFGdW5jdGlvbiwgcHJvcHMsIGZpcnN0RG8pO1xuICAgICAgICByZXR1cm4gZmlyc3REbzsgIC8vIEFsd2F5cyByZXR1cm4gdGhlIGZpcnN0ICdEbycgaW4gdGhlIGNoYWluXG4gICAgfTtcblxuICAgIGV4ZWN1dG9yLm5leHREbyA9IG51bGw7XG5cbiAgICByZXR1cm4gZXhlY3V0b3I7XG59XG5cblRoaW5nLkRvID0gRG87XG5cbi8qXG4vLyBjaGFpbmVkLCBlYWNoIERvIGhhcyBpdHMgb3duIHBhcmFtZXRlcnNcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTt9LCB7YXJnMTonaGVsbG8xJ30pXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7fSwge2FyZzI6J2hlbGxvIHRvIDIyMjIyJ30pXG5cbi8vIGNoYWluZWQsIHdpdGggZmlyc3QgRG8gcGlwaW5nIHJlc3VsdHMgdG8gc2Vjb25kIERvXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7IHJldHVybiB7cGlwZWRwcm9wOjEyMzR9fSwge2FyZzE6J2hlbGxvMSd9KVxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpO30sIG51bGwpXG5cbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7IHJldHVybiB7bmV3UHJvcDpwcm9wcy5waXBlZHByb3ArMn19KVxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAzJywgcHJvcHMpO30pXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuLypcbiAgICBzcmM6IDxmaWxlIHBhdGg+XG4gICAgY2VudGVyOiB0cnVlfGZhbHNlXG4gICAgc2l6ZTogY29udGFpbnxjb3ZlcnxzdHJldGNoXG4qL1xuXG5jbGFzcyBJbWcgZXh0ZW5kcyBUaGluZyB7XG4gIGluaXQgKHByb3BzKSB7XG4gICAgdmFyIHBsYWNlaG9sZGVyID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBTWdBQUFESUNBWUFBQUN0V0s2ZUFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTEV3QUFDeE1CQUpxY0dBQUFCVjlKUkVGVWVKenQzYzF1M1VRY2grRi9FQks5QXNRQ1ZXZlZRcTRDYmh4dUE0RXFzU21oKzdJdWk5UUNRdkk3WXgrUFA1OUg4aTZ5Wm83bXpmZ2tsbjFYVlo4S2VOWVhhdzhBdGt3Z0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dlRExFVDk3MTIwVXNMeW1PMGpzSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSU0rN1ZOVjNhdzlpUWZkVjlYcnRRV3pWcDhiakxDNVY5WHRWUGRRNUlybXZxZzlWOWE3T0ZVbnp1aGZJUHk3MUdNY3c1Nk5ITXNReHpQZE1rUWhrcEV2OU40NmpSL0kwanJORklwQVJMdlY4SEVlTjVLVTR6aFNKUUJwZEtzZHh0RWl1eFhHV1NBVFM0Rkp0Y1J3bGt0WTR6aENKUUs2NDFMZzQvaDNKOTR1UDluWmo0emg2SkFJSkxqVXRqcjFHTWpXT0kwY2lrQmRjNnJZNDloYkpyWEVjTlJLQlBPTlM4OFN4bDBqbWl1T0lrVFROK1d5M21yeXFxcTltUE44M1ZmVlRiVE9TKzZyNnVhcStudkdjcno0ZnAzS21IYVRxY1RFLzFIeS9WYmU0azh5OWMzeXFxdmRWOVdiSlNYVG1FaXM0Y2lUaWFDT1FLNDRZaVRqYUNhUkJqMGorckhVaUVjYzRBbWwwaEVqRU1aNUFSdGh6Sk9LWVJpQWpmVitQaTNwUGtZaGpPb0ZNc0tkSWVzVHhSNTBqamlxQlRMYUhTTVJ4TzRIY1lNdVJpR01lQXJsUnIwanVieGlUT09ZamtCbHNLUkp4ekVzZ005bENKT0tZbjBCbXRHWWs0dWhESUROYkl4Sng5Q09RRHU1cnVVaDZ4ZkYybGs5aS93VFN5UktSaUtNL2dYVFVNeEp4TEVNZ25mV0k1RU9KWXlrQ1dVQ1BTTVN4RElFc1pLdVJpQ01UeUlKNmZHOFFSMThDV2RoV0lua29jYlFReUFyV2prUWM3UVN5a3JVaUVjYzRBbG5SMHBHSVl6eUJyR3lwU01ReGpVQTJvSGNrNHBoT0lCdlJLeEp4M0ticGN6N2IwOTJQNW03dEFaeUJIYVNmSlM2eDl2ek94RFc1eEZyWmtsL1NSVEtlUUZhMHhwOTVSVEtPUUZheTVqOEtSZEpPSUN2WXdxMG1JbWtqa0lXdEhZZEl4aEhJZ3JZU2gwamFDV1FoVzR0REpHMEVzb0N0eGlHUzZ3VFNXWTg0SHFyUGkwVkY4bjhDNmFoWEhHL3JjVEdMcEQrQmROSXpqb0ZJK2hOSUIwdkVNUkJKWHdLWjJaSnhERVRTajBCbXRFWWNBNUgwSVpDWnJCbkhRQ1R6RThnTXRoREhRQ1R6RXNpTnR2aVVkWkhNUnlBMzJHSWNBNUhNUXlBVGJUbU9nVWh1SjVBSjloREhRQ1MzRWNoSWU0cGpJSkxwQkRMQ0h1TVlpR1FhZ1RUYWN4d0RrWXdua0FaSGlHTWdrbkVFY2tXdk9ONHNPWWtuUk5KT0lNRVI0eGlJcEkxQVhuRGtPQVlpdVU0Z3p6aERISU5la1J6bGlmSk5jejdiMDkwL2ZqN204bEJWUDFUVnJ6T2VjeTYvVk5XUDlmaUs2cmw4cktxL1pqemZMcHhwQjZtcWVsMVY3K3E0TzhkVGMrMGt2MVhWdHd1UHZTZVhXTUd0a2V3bGpzR3RrUnd0amlxQlhEVTFrdmUxcnpnR1V5TTVZaHhWQW1reU5wSzl4akVZRzhsUjQ2Z1NTTFBXU1BZZXg2QTFraVBIVVNXUVVhNUZjcFE0QnRjaU9Yb2NWUUlaN2FWSWpoYkg0S1ZJemhCSGxVQW1lUnJKVWVNWVBJM2tMSEZVQ1dTeUlaS2p4ekVZSWpsVEhGVUN1Y25yT2tjY2c3ZDFyamlxR3RmOVhiVXZmaSt0NTBpYTF2M1o3c1dDVVFRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRQ0FRQ0FRQ2dVQWdFQWdFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRUFvRkFJQkFJQkFLQlFDQVFDQVFDZ1VBZ0VBZ0VBb0ZBSUJBSUJBS0JRSEJYVlovV0hnUnNsUjBFQW9GQUlCQUlCQUtCUUNBUUNBUUNnVUFnRUFnRWdyOEJpUVZ6cTlMdjFPb0FBQUFBU1VWT1JLNUNZSUk9JztcblxuICAgIHByb3BzID0gcHJvcHMgfHwge307XG4gICAgcHJvcHMuc3JjID0gcHJvcHMuc3JjIHx8IHBsYWNlaG9sZGVyO1xuICAgIC8vIHByb3BzLmJhY2tncm91bmQgPSAndXJsKFwiJyArIHByb3BzLnNyYyArICdcIikgbm8tcmVwZWF0ICcgKyAocHJvcHMuY2VudGVyID8gJ2NlbnRlcicgOiAnbGVmdCB0b3AnKTtcbiAgICAvLyBwcm9wcy5iYWNrZ3JvdW5kU2l6ZSA9IChwcm9wcy5zaXplID09PSAnY29udGFpbicgfHwgcHJvcHMuc2l6ZSA9PT0gJ2NvdmVyJyA/IHByb3BzLnNpemUgOiAocHJvcHMuc2l6ZT09PSdzdHJldGNoJyA/ICcxMDAlIDEwMCUnIDogdW5kZWZpbmVkKSApO1xuXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xuXG4gICAgdGhpcy50eXBlID0gJ0ltZyc7XG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNyYyA9IHByb3BzLnNyYztcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IHVuZGVmaW5lZDtcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IHVuZGVmaW5lZDtcbiAgICB0aGlzLncgPSBwcm9wcy53IHx8IHVuZGVmaW5lZDtcbiAgICB0aGlzLmggPSBwcm9wcy5oIHx8IHVuZGVmaW5lZDtcblxuICAgIEltZy5sb2FkaW5nKHRoaXMpO1xuICAgIGxvYWRJbWFnZShwcm9wcy5zcmMsIHRoaXMub25sb2FkLmJpbmQodGhpcyksIHRoaXMub25FcnJvci5iaW5kKHRoaXMpKTtcblxuICAgIHN1cGVyLmluaXRpYWxpemUocHJvcHMpO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgfVxuXG4gIG9ubG9hZCAoaW1nKSB7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSBpbWcuaGVpZ2h0IC8gaW1nLndpZHRoOyAgLy8gYXNwZWN0IHJhdGlvIG9mIG9yaWdpbmFsIGltYWdlXG4gICAgdGhpcy53ID0gdGhpcy53IHx8IGltZy53aWR0aDtcbiAgICB0aGlzLmggPSB0aGlzLmggfHwgKHRoaXMudyAqIHRoaXMuYXNwZWN0UmF0aW8pO1xuICAgIHRoaXMuY3NzKHtcbiAgICAgICAgd2lkdGg6IHRoaXMudyxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmgsXG4gICAgICAgIGJhY2tncm91bmQ6ICd1cmwoJyAraW1nLnNyYysgJykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xuICAgIH0pO1xuICAgIEltZy5sb2FkZWQodGhpcyk7XG4gIH1cblxuICBvbkVycm9yIChpbWcpIHtcbiAgICBUaGluZy5tc2coJ0ltZy5vbkVycm9yOiBGYWlsZWQgdG8gbG9hZCAnICsgaW1nLnNyYyk7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuZXJyb3IgPSB0cnVlO1xuICAgIHRoaXMud2lkdGggPSB0aGlzLmhlaWdodCA9IDA7XG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XG4gICAgSW1nLmxvYWRlZCh0aGlzKTtcbiAgfVxuXG4gIHNldFdpZHRoICh3KSB7XG4gICAgdGhpcy53aWR0aCA9IHc7XG4gICAgdGhpcy5oZWlnaHQgPSB3ICogdGhpcy5hc3BlY3RSYXRpbztcbiAgICB0aGlzLmNzcyh7XG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdGF0aWMgbG9hZGluZyAoaW1nKSB7XG4gICAgSW1nLnF1ZXVlZEltZ3MgPSBJbWcucXVldWVkSW1ncyB8fCBbXTtcbiAgICBpZiAoaW1nICYmICFpbWcubG9hZGVkKSB7XG4gICAgICAgIEltZy5xdWV1ZWRJbWdzLnB1c2goaW1nKTtcbiAgICB9XG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aDtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkZWQgKGltZykge1xuICAgIEltZy5xdWV1ZWRJbWdzID0gSW1nLnF1ZXVlZEltZ3MgfHwgW107XG4gICAgaWYgKGltZyAmJiBpbWcubG9hZGVkKSB7XG4gICAgICAgIHZhciBpbmRleCA9IEltZy5xdWV1ZWRJbWdzLmluZGV4T2YoaW1nKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIEltZy5xdWV1ZWRJbWdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEltZy5xdWV1ZWRJbWdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgSW1nLm9uQWxsTG9hZGVkKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEltZy5xdWV1ZWRJbWdzLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIHN0YXRpYyBvbkFsbExvYWRlZCAoKSB7XG4gICAgVGhpbmcubXNnKFwiSU1HLm9uQWxsTG9hZGVkKCk6IHRyaWdnZXJlZFwiKTtcbiAgfVxuXG59XG5UaGluZy5hZGRDbGFzcyhJbWcpO1xuXG5cbmZ1bmN0aW9uIGxvYWRJbWFnZSAoc3JjLCBjYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMpO1xuICAgIH07XG4gICAgaW1nLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVycm9yQ2FsbGJhY2sodGhpcyk7XG4gICAgfTtcbiAgICBpbWcuc3JjID0gc3JjO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEltZztcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIExhYmVsIGV4dGVuZHMgVGhpbmcge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XG5cdFx0XHR0ZXh0OiAnJyxcblx0XHRcdGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXG5cdFx0XHRmb250U2l6ZTogJzE0cHgnLFxuXHRcdFx0Y29sb3I6ICcjMDAwJ1xuXHRcdH07XG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcblx0XHR0aGlzLnR5cGUgPSAnTGFiZWwnO1xuXHRcdHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXG5cdFx0dGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy50ZXh0KTtcblx0fVxuXG5cdHNldFRleHQgKHR4dCkge1xuXHRcdHRoaXMudGV4dCA9IHR4dDtcblx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkudGV4dCh0eHQpO1xuXHR9XG5cblx0cmVuZGVyICgpIHtcblx0XHRzdXBlci5yZW5kZXIoKTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoTGFiZWwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExhYmVsO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcbi5MaW5lIHtcXG4gIC8qIEZvciBzb21lIG5pY2UgYW5pbWF0aW9uIG9uIHRoZSByb3RhdGVzOiAqL1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuMnM7XFxuICAgICAtbW96LXRyYW5zaXRpb246ICAgIC1tb3otdHJhbnNmb3JtIC4ycztcXG4gICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgICB0cmFuc2Zvcm0gLjJzO1xcbn1cXG5cXG5cIjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIExpbmUgZXh0ZW5kcyBUaGluZyB7XG4gIGluaXQgKHByb3BzKSB7XG4gICAgLy8gZXhwZWN0aW5nIHByb3BzOiB7IHgxOjAsIHkxOjAsIHgyOjUwLCB5Mjo1MCB9XG4gICAgcHJvcHMuYmFja2dyb3VuZENvbG9yID0gcHJvcHMgJiYgKHByb3BzLmJhY2tncm91bmRDb2xvciB8fCBwcm9wcy5jb2xvciB8fCAnYmxhY2snKTtcbiAgICBzdXBlci5pbml0KHByb3BzKTtcbiAgICB0aGlzLnR5cGUgPSAnTGluZSc7XG4gICAgdGhpcy5sZW5ndGggPSAxMDtcbiAgICB0aGlzLndpZHRoID0gMTtcbiAgICB0aGlzLmFuZ2xlID0gMDtcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyh0aGlzLnR5cGUpO1xuICAgIHRoaXMuY3JlYXRlTGluZShwcm9wcy54MSwgcHJvcHMueTEsIHByb3BzLngyLCBwcm9wcy55MiwgcHJvcHMud2lkdGgsIHByb3BzLmFycm93LCBwcm9wcy5zaG9ydGVuKTtcbiAgfVxuXG4gIGNyZWF0ZUxpbmUgKHgxLHkxLCB4Mix5Miwgd2lkdGgsIGFycm93LCBzaG9ydGVuKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IDI7XG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoKHgxLXgyKSooeDEteDIpICsgKHkxLXkyKSooeTEteTIpKSAtIChhcnJvdz8gdGhpcy53aWR0aCoyIDogMCk7ICAvLyBzaG9ydGVuIHRoZSBsZW5ndGggdG8gbWFrZSByb29tIGZvciBhcnJvd2hlYWRcbiAgICB0aGlzLmFuZ2xlICA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiAxODAgLyBNYXRoLlBJO1xuICAgIHRoaXMubGVuZ3RoIC09IHNob3J0ZW4gfHwgMDsgIC8vIHNob3J0ZW4gdGhlIGxpbmUgYSBiaXQgKG1ha2VzIHJvb20gZm9yIGFycm93aGVhZClcbiAgICB0aGlzLmNzcyh7XG4gICAgICAgICdsZWZ0JzogJycgKyB4MSArICdweCcsXG4gICAgICAgICd0b3AnOiAnJyArICh5MS0odGhpcy53aWR0aC8yKSkgKyAncHgnLFxuICAgICAgICAnd2lkdGgnOiAnJyArIHRoaXMubGVuZ3RoICsgJ3B4JyxcbiAgICAgICAgJ2hlaWdodCc6ICcnICsgdGhpcy53aWR0aCArICdweCcsXG4gICAgICAgIC8vIHJvdGF0ZSBhcm91bmQgc3RhcnQgcG9pbnQgb2YgbGluZVxuICAgICAgICAndHJhbnNmb3JtLW9yaWdpbic6ICcwIDUwJSdcbiAgICAgIH0pO1xuICAgIHRoaXMucm90YXRlVG8odGhpcy5hbmdsZSk7XG4gICAgaWYgKGFycm93KSB7XG4gICAgICB0aGlzLmFkZEFycm93SGVhZCh0aGlzLmxlbmd0aCwgdGhpcy53aWR0aCwgdGhpcy53aWR0aCoyLCB0aGlzLnByb3BzLmJhY2tncm91bmRDb2xvcik7XG4gICAgfVxuICB9XG5cbiAgLy8gbGVuIG9mIGxpbmUsIHdpZHRoIG9mIGxpbmUsIHNpemUgb2YgdHJpYW5nbGUgKGllLiAxMCB3aWxsIGJlIDEwcHggd2lkZSBhbmQgMjBweCBoaWdoKVxuICBhZGRBcnJvd0hlYWQgKGxlbiwgd2lkdGgsIHNpemUsIGNvbG9yKSB7XG4gICAgdGhpcy5hcnJvd0hlYWQgPSAkKCc8ZGl2PjwvZGl2PicpO1xuICAgIHRoaXMuYXJyb3dIZWFkLmNzcyh7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHdpZHRoOiAwLCBcbiAgICAgIGhlaWdodDogMCwgXG4gICAgICBmb250U2l6ZTogMCxcbiAgICAgIGxpbmVIZWlnaHQ6IDAsXG4gICAgICBsZWZ0OiBsZW4gKyAncHgnLFxuICAgICAgdG9wOiAtKHNpemUtKHdpZHRoLzIpKSArICdweCcsXG4gICAgICBib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgYm9yZGVyVG9wOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgIGJvcmRlckxlZnQ6IHNpemUgKyAncHggc29saWQgJyArIGNvbG9yXG4gICAgfSk7XG4gICAgdGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0aGlzLmFycm93SGVhZCk7XG4gIH1cblxuICBkYXNoZWQgKGRhc2hTaXplKSB7XG4gICAgZGFzaFNpemUgPSBkYXNoU2l6ZT09PXVuZGVmaW5lZCA/IDEwIDogZGFzaFNpemU7XG4gICAgdGhpcy5jc3Moe1xuICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgYmFja2dyb3VuZEltYWdlOiAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCAzMCUsICcgK3RoaXMucHJvcHMuYmFja2dyb3VuZENvbG9yKyAnIDMwJSknLFxuICAgICAgYmFja2dyb3VuZFNpemU6IGRhc2hTaXplICsgJ3B4J1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhdGljIGNzcyAoKSB7XG4gIFx0cmV0dXJuIHJlcXVpcmUoJy4vTGluZS5jc3MnKTtcbiAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoTGluZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuUGF0dGVybi5HcmFwaFBhcGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDM7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMHB4IDEwMHB4LCAxMDBweCAxMDBweCwgMjBweCAyMHB4LCAyMHB4IDIwcHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweCwgLTFweCAtMXB4LCAtMXB4IC0xcHg7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjUpIDJweCwgdHJhbnNwYXJlbnQgMnB4KSxcXG4gICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjMpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4zKSAxcHgsIHRyYW5zcGFyZW50IDFweCk7XFxufVxcblxcbi5QYXR0ZXJuLkdyaWQge1xcbiAgYmFja2dyb3VuZC1zaXplOiAxMDBweCAxMDBweCwgMTAwcHggMTAwcHg7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMnB4IC0ycHgsIC0ycHggLTJweDtcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxuICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC41KSAycHgsIHRyYW5zcGFyZW50IDJweCksXFxuICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuNSkgMnB4LCB0cmFuc3BhcmVudCAycHgpO1xcbn1cXG5cXG4uUGF0dGVybi5Tb2ZhRGFyayB7XFxuICBiYWNrZ3JvdW5kOlxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDI3JSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyNyUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMzAlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDUwJSAwLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCAyMCUsIDEpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgMTAwJSA1MCUsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxufVxcblxcbi5QYXR0ZXJuLlNvZmEge1xcbiAgYmFja2dyb3VuZDpcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCA5OSUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDklLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgOSUpIDAgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA4JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDEwJSkgNTAlIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDYlLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgMCxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgNDElLCAwLjgpIDIwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyMyUpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgNTAlIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDIwJSwgMSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSAxMDAlIDUwJSxcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgOTYlLCA0JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXFxuICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSA1MCUgNTAlLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMDA7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDI1JSAyNSU7XFxufVxcblxcbi5QYXR0ZXJuLlllbGxvd0NpcmNsZXNXaXRoVmlvbGV0IHtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmQ2NzkgMTclLCAjM2Q1NDQzIDE3LjUlLCAjM2Q1NDQzIDE4LjIlLCAjM2NkYWRhIDE5JSwgIzZkZThlOCAyNCUsICNlZGNiZmIgMzAlLCB0cmFuc3BhcmVudCAzNiUpLCByYWRpYWwtZ3JhZGllbnQoIzNkYWJjNyAxMiUsICM0OWFiM2MgMTMuNSUsICMzODgyMmUgMTQlLCAjZmZkYjg5IDE0LjUlLCAjZmZkYjg5IDE5JSwgI2ZmZjU3YSAyMCUsICNmY2ZmYjUgMjglLCAjZmZmZWJkIDI5JSk7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAlIDAlLCAxNyUgMTclO1xcbn1cXG5cXG4uUGF0dGVybi5ZZWxsb3dDaXJjbGVzV2l0aFZpb2xldDIge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNmZmRkOTAgMTclLCBibGFjayAxNy41JSwgYmxhY2sgMTguMiUsICMzY2RhZGEgMTklLCAjNmRlOGU4IDI0JSwgI2VkY2JmYiAzMCUsIHRyYW5zcGFyZW50IDM2JSksIHJhZGlhbC1ncmFkaWVudCgjM2NkYWRhIDE3JSwgZ3JheSAxNy41JSwgZ3JheSAxOCUsICNmZmRkOTAgMTklLCAjZmZkZDkwIDI0JSwgI2ZmZmY5MCAzMCUsICNmZmZmOTAgMzYlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlLCAyNSU7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSAwJSwgMTclIDE3JTtcXG59XFxuXFxuLlBhdHRlcm4uUG9sa2FEb3RzIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSksXFxuICAgIHJhZGlhbC1ncmFkaWVudCh3aGl0ZSAxNSUsIHRyYW5zcGFyZW50IDE3JSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDYwcHggNjBweDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMzBweCAzMHB4O1xcbn1cXG5cXG4uUGF0dGVybi5Qb2xrYURvdHNMYXJnZSB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyAxMDBweCwgdHJhbnNwYXJlbnQgMTAzcHgpLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyAxMDBweCwgdHJhbnNwYXJlbnQgMTAzcHgpO1xcbiAgYmFja2dyb3VuZC1zaXplOiA1MDBweDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMjUwcHggMjUwcHg7XFxufVxcblxcbi5QYXR0ZXJuLlBvbGthRGlhbW9uZHNXaGl0ZUdyZWVuIHtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTpcXG4gICAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyA5cHgsIHRyYW5zcGFyZW50IDEwM3B4KSxcXG4gICAgICByYWRpYWwtZ3JhZGllbnQoI2ZmZmRkNyAxMTFweCwgdHJhbnNwYXJlbnQgMTAzcHgpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDIwMHB4O1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwIDAsIDEwMHB4IDEwMHB4O1xcbn1cXG5cXG4uUGF0dGVybi5CbHVlQmFsbHMge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KCNhY2YgNzclLCByZ2JhKDg4LDk5LDI1NSwuODgpIDgwJSwgdHJhbnNwYXJlbnQgODMlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXG59XFxuXFxuLlBhdHRlcm4uU3RyaXBlcyB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgyNTUsMjU1LDI1LDEpIDUwJSk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JTtcXG59XFxuXFxuLlBhdHRlcm4uU3RyaXBlc09jaHJlIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1NSwyMDUsMjUsMSkgNTAlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTUlO1xcbn1cXG5cXG4uUGF0dGVybi5TdHJpcGVzV2hpdGVSZWRHcmVlbiB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUxJSwgI2ZmZmZjOCA1MSUsICNmZmZmYzggNTklLCB0cmFuc3BhcmVudCA1OSUpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDQzJSwgI2YzMzA1NCA0MyUsICNmMzMwNTQgNjclLCB0cmFuc3BhcmVudCA2NyUpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICMwMjliNGYgMzQlLCAjMjYyNjI2IDM0JSwgIzI2MjYyNiA3NSUsICMwMjliNGYgNzUlKTtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDAlLCAwJSwgMCU7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDE1JSwgMTUlLCAxNSU7XFxufVxcblxcbi5QYXR0ZXJuLlBsYWlkUmVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA4NiUsIDM0JSk7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LFxcbiAgICAgIHRyYW5zcGFyZW50IDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDUzcHgsIHRyYW5zcGFyZW50IDUzcHgsXFxuICAgICAgdHJhbnNwYXJlbnQgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjNweCwgcmdiYSg0MCwwLDE2MCwuNCkgNjZweCwgdHJhbnNwYXJlbnQgNjZweCxcXG4gICAgICB0cmFuc3BhcmVudCAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDExNnB4LCByZ2JhKDAsNjAsMCwuNSkgMTY2cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjlweCwgcmdiYSgwLDYwLDAsLjUpIDE2OXB4LFxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAxNzlweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE4MnB4LCByZ2JhKDAsNjAsMCwuNSkgMTgycHgsXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDIzMnB4LCB0cmFuc3BhcmVudCAyMzJweCksXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMjcwZGVnLCB0cmFuc3BhcmVudCxcXG4gICAgICB0cmFuc3BhcmVudCA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSA1M3B4LCB0cmFuc3BhcmVudCA1M3B4LFxcbiAgICAgIHRyYW5zcGFyZW50IDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDYzcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDY2cHgsIHRyYW5zcGFyZW50IDY2cHgsXFxuICAgICAgdHJhbnNwYXJlbnQgMTE2cHgsIHJnYmEoMCw2MCwwLC41KSAxMTZweCwgcmdiYSgwLDYwLDAsLjUpIDE2NnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxNjZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgMTY5cHgsIHJnYmEoMCw2MCwwLC41KSAxNjlweCxcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTc5cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDE3OXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAxODJweCwgcmdiYSgwLDYwLDAsLjUpIDE4MnB4LFxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAyMzJweCwgdHJhbnNwYXJlbnQgMjMycHgpLFxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDEyNWRlZywgdHJhbnNwYXJlbnQsXFxuICAgICAgdHJhbnNwYXJlbnQgMnB4LCByZ2JhKDAsMCwwLC4yKSAycHgsXFxuICAgICAgcmdiYSgwLDAsMCwuMikgM3B4LCB0cmFuc3BhcmVudCAzcHgsXFxuICAgICAgdHJhbnNwYXJlbnQgNXB4LCByZ2JhKDAsMCwwLC4yKSA1cHgpO1xcbn1cXG5cXG4uUGF0dGVybi5QbGFpZFJlZExhcmdlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA4NiUsIDM0JSk7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LFxcbiAgICAgIHRyYW5zcGFyZW50IDIwMHB4LCByZ2JhKDQwLDAsMTYwLC40KSAyMDBweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjEycHgsIHRyYW5zcGFyZW50IDIxMnB4LFxcbiAgICAgIHRyYW5zcGFyZW50IDI1MnB4LCByZ2JhKDQwLDAsMTYwLC40KSAyNTJweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjY0cHgsIHRyYW5zcGFyZW50IDI2NHB4LFxcbiAgICAgIHRyYW5zcGFyZW50IDQ2NHB4LCByZ2JhKDAsNjAsMCwuNSkgNDY0cHgsIHJnYmEoMCw2MCwwLC41KSA2NjRweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgNjY0cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDY3NnB4LCByZ2JhKDAsNjAsMCwuNSkgNjc2cHgsXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDcxNnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA3MTZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgNzI4cHgsIHJnYmEoMCw2MCwwLC41KSA3MjhweCxcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgOTI4cHgsIHRyYW5zcGFyZW50IDkyOHB4KSxcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgyNzBkZWcsIHRyYW5zcGFyZW50LFxcbiAgICAgIHRyYW5zcGFyZW50IDIwMHB4LCByZ2JhKDQwLDAsMTYwLC40KSAyMDBweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjEycHgsIHRyYW5zcGFyZW50IDIxMnB4LFxcbiAgICAgIHRyYW5zcGFyZW50IDI1MnB4LCByZ2JhKDQwLDAsMTYwLC40KSAyNTJweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjY0cHgsIHRyYW5zcGFyZW50IDI2NHB4LFxcbiAgICAgIHRyYW5zcGFyZW50IDQ2NHB4LCByZ2JhKDAsNjAsMCwuNSkgNDY0cHgsIHJnYmEoMCw2MCwwLC41KSA2NjRweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgNjY0cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDY3NnB4LCByZ2JhKDAsNjAsMCwuNSkgNjc2cHgsXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDcxNnB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA3MTZweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgNzI4cHgsIHJnYmEoMCw2MCwwLC41KSA3MjhweCxcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgOTI4cHgsIHRyYW5zcGFyZW50IDkyOHB4KSxcXG4gICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgxMjVkZWcsIHRyYW5zcGFyZW50LFxcbiAgICAgIHRyYW5zcGFyZW50IDhweCwgcmdiYSgwLDAsMCwuMikgOHB4LFxcbiAgICAgIHJnYmEoMCwwLDAsLjIpIDEycHgsIHRyYW5zcGFyZW50IDEycHgsXFxuICAgICAgdHJhbnNwYXJlbnQgMjBweCwgcmdiYSgwLDAsMCwuMikgMjBweCk7XFxufVxcblxcbi5QYXR0ZXJuLlBsYWlkUmVkTGFyZ2VYIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbCgwLCA4NiUsIDM0JSk7XFxuICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LFxcbiAgICAgIHRyYW5zcGFyZW50IDI1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSAyNTBweCwgcmdiYSg0MCwwLDE2MCwuNCkgMjY1cHgsIHRyYW5zcGFyZW50IDI2NXB4LFxcbiAgICAgIHRyYW5zcGFyZW50IDMxNXB4LCByZ2JhKDQwLDAsMTYwLC40KSAzMTVweCwgcmdiYSg0MCwwLDE2MCwuNCkgMzMwcHgsIHRyYW5zcGFyZW50IDMzMHB4LFxcbiAgICAgIHRyYW5zcGFyZW50IDU4MHB4LCByZ2JhKDAsNjAsMCwuNSkgNTgwcHgsIHJnYmEoMCw2MCwwLC41KSA4MzBweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgODMwcHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDg0NXB4LCByZ2JhKDAsNjAsMCwuNSkgODQ1cHgsXFxuICAgICAgcmdiYSgwLDYwLDAsLjUpIDg5NXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA4OTVweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgOTEwcHgsIHJnYmEoMCw2MCwwLC41KSA5MTBweCxcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgMTE2MHB4LCB0cmFuc3BhcmVudCAxMTYwcHgpLFxcbiAgICByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDI3MGRlZywgdHJhbnNwYXJlbnQsXFxuICAgICAgdHJhbnNwYXJlbnQgMjUwcHgsIHJnYmEoNDAsMCwxNjAsLjQpIDI1MHB4LCByZ2JhKDQwLDAsMTYwLC40KSAyNjVweCwgdHJhbnNwYXJlbnQgMjY1cHgsXFxuICAgICAgdHJhbnNwYXJlbnQgMzE1cHgsIHJnYmEoNDAsMCwxNjAsLjQpIDMxNXB4LCByZ2JhKDQwLDAsMTYwLC40KSAzMzBweCwgdHJhbnNwYXJlbnQgMzMwcHgsXFxuICAgICAgdHJhbnNwYXJlbnQgNTgwcHgsIHJnYmEoMCw2MCwwLC41KSA1ODBweCwgcmdiYSgwLDYwLDAsLjUpIDgzMHB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA4MzBweCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgODQ1cHgsIHJnYmEoMCw2MCwwLC41KSA4NDVweCxcXG4gICAgICByZ2JhKDAsNjAsMCwuNSkgODk1cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpIDg5NXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSA5MTBweCwgcmdiYSgwLDYwLDAsLjUpIDkxMHB4LFxcbiAgICAgIHJnYmEoMCw2MCwwLC41KSAxMTYwcHgsIHRyYW5zcGFyZW50IDExNjBweCksXFxuICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMTI1ZGVnLCB0cmFuc3BhcmVudCxcXG4gICAgICB0cmFuc3BhcmVudCAxMHB4LCByZ2JhKDAsMCwwLC4yKSAxMHB4LFxcbiAgICAgIHJnYmEoMCwwLDAsLjIpIDE1cHgsIHRyYW5zcGFyZW50IDE1cHgsXFxuICAgICAgdHJhbnNwYXJlbnQgMjVweCwgcmdiYSgwLDAsMCwuMikgMjVweCk7XFxufVxcblxcbi5QYXR0ZXJuLkRpYWdvbmFsU3RyaXBlcyB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoNDVkZWcsIGJsYWNrIDI1JSwgdHJhbnNwYXJlbnQgMjUuMTUlLCB0cmFuc3BhcmVudCA1MCUsIGJsYWNrIDUwLjE1JSwgYmxhY2sgNzUlLCB0cmFuc3BhcmVudCA3NS4xNSUsIHRyYW5zcGFyZW50KTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTYlIDE2JTsgIC8qIG11c3QgbWF0Y2ggYXNwZWN0IHJhdGlvIG9mIGNvbnRhaW5pbmcgZWxlbWVudCBvciBsaW5lcyB3aWxsIGJyZWFrICovXFxuICAgICAgICAvKiBpZS4gMzIlIDE2JSBmb3IgYW4gZWxlbWVudCB3aXRoIHc9MTAwIGg9MjAwICovXFxuICAgICAgICAvKiBQb3dlcnMgb2YgMiB3b3JrIGJlc3QgKG90aGVyIHZhbHVlcywgbGlrZSA3IG9yIDIzLCBtYWtlIGphZ2d5IGFsaWFzaW5nKSAqL1xcbn1cXG5cXG4uUGF0dGVybi5EaWFnb25hbFN0cmlwZXNWaW9sZXQge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCAjMGUwMDMwIDI1JSwgdHJhbnNwYXJlbnQgMjUuMTUlLCB0cmFuc3BhcmVudCA1MCUsICMwZTAwMzAgNTAuMTUlLCAjMGUwMDMwIDc1JSwgdHJhbnNwYXJlbnQgNzUuMTUlLCB0cmFuc3BhcmVudCk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDYlO1xcbn1cXG5cXG4uUGF0dGVybi5CbHVlQ2FzY2FkZSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDI2ODczO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDkxZGVnLCByZ2JhKDI1NSwyNTUsMjUsMC4xNykgNTAlLCB0cmFuc3BhcmVudCA1MS41JSksXFxuICAgIGxpbmVhci1ncmFkaWVudCg4OWRlZywgcmdiYSgyNSwyNTUsMjU1LDAuMjMpIDUwJSwgdHJhbnNwYXJlbnQgNTQuNSUpLFxcbiAgICBsaW5lYXItZ3JhZGllbnQoOTAuNWRlZywgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDI1MiwgMjU1LCAxNjIsIDAuMzcpIDU0LjUlKSxcXG4gICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MC43NSUsIHJlZCA1MSUsIHJlZCA1MS41JSwgdHJhbnNwYXJlbnQgNTEuNzUlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogNSUgMTAwJSwgMyUgMTAwJSwgOSUgMTAwJSwgOCUgMTAwJTtcXG59XFxuXFxuIC8qUGVybGluIE5vaXNlLWlzaCByYWRpYWwgYmx1cnMqL1xcbiAgLypSR0IqL1xcbiAgLypiYWNrZ3JvdW5kLWltYWdlOiByYWRpYWwtZ3JhZGllbnQocmdiYSgyNTUsIDQyLCAwLCAuNSkgMSUsIHRyYW5zcGFyZW50IDIwMCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSg4NiwgMjUwLCAyLCAuNSkgMSUsIHRyYW5zcGFyZW50IDIwMCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSgwLCA3LCAyNTUsIDAuNikgMSUsIHRyYW5zcGFyZW50IDE1MCUpO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxNjFweCwgMTM0cHgsIDE4OHB4O1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTU0cHgsIDU3cHgsIDU1cHg7XFxuICAqL1xcblxcbiAgLypNb25vY2hyb21lIC0gYmV0dGVyIGJsdXJzKi9cXG4vKlxcbiAgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KHJnYmEoOSwgMSwgMTEyLCAwLjU2KSAwJSwgcmdiYSg5LCAxLCAxMTIsIDAuMjUpIDQ4JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTYpIDY1JSwgcmdiYSg5LCAxLCAxMTIsIDAuMTIpIDk0JSksIHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC41NikgMCUsIHJnYmEoOSwgMSwgMTEyLCAwLjI1KSA0OCUsIHJnYmEoOSwgMSwgMTEyLCAwLjE2KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwLjEyKSA5NCUpLCByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDAuNTYpIDAlLCByZ2JhKDksIDEsIDExMiwgMC4yNSkgNDglLCByZ2JhKDksIDEsIDExMiwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMC4xMikgOTQlKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTg4cHggMzQ3cHgsIDE3MHB4LCAyMDlweDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IC01NHB4LCA1N3B4LCA1NXB4O1xcbiovXFxuXFxuLlBhdHRlcm4uR3JlZW5PdmFsc1hyYXkge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzEzMWMwYztcXG4gIGJhY2tncm91bmQtaW1hZ2U6XFxuICAgIHJhZGlhbC1ncmFkaWVudChyZ2JhKDE4LCAwLCAyNTUsIDApIDAlLCByZ2JhKDMsIDE3OSwgMjU1LCAwLjA5KSA0OCUsIHJnYmEoMTk5LCAyMzcsIDQ0LCAwLjE5KSA2NSUsIHJnYmEoOSwgMSwgMTEyLCAwKSA5NCUpLFxcbiAgICByYWRpYWwtZ3JhZGllbnQocmdiYSg5LCAxLCAxMTIsIDApIDAlLCByZ2JhKDIwNSwgMCwgMCwgMC4wNykgNDglLCByZ2JhKDI1NCwgMjA0LCAwLCAwLjExKSA2NSUsIHJnYmEoMjU1LCAyMTAsIDgsIDApIDk0JSksXFxuICAgIHJhZGlhbC1ncmFkaWVudChyZ2JhKDksIDEsIDExMiwgMC4wMSkgMCUsIHJnYmEoODUsIDI1NSwgNTksIDAuMDgpIDQ4JSwgcmdiYSgxNzQsIDIwMiwgMCwgMC4xNikgNjUlLCByZ2JhKDksIDEsIDExMiwgMCkgOTQlKTtcXG4gICAgYmFja2dyb3VuZC1zaXplOiAxODhweCAzNDdweCwgMTcwcHgsIDIwOXB4O1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTU0cHgsIDU3cHgsIDU1cHg7XFxufVxcblxcbi5QYXR0ZXJuLkRhcmtEb251dHMge1xcbiAgICBiYWNrZ3JvdW5kLWltYWdlOlxcbiAgICAgIHJhZGlhbC1ncmFkaWVudChibGFjayAxMCUsICNmZmZkZDcgNjAlLCB0cmFuc3BhcmVudCA2MSUpLFxcbiAgICAgIHJhZGlhbC1ncmFkaWVudCgjMjkyOTI5IDElLCAjZmZmZGQ3IDUwJSwgI2ZmZmRkNyA2MiUsICM0YTRhNGEgNjElKTtcXG4gICAgYmFja2dyb3VuZC1zaXplOiA4MDBweDtcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCAwLCA0MDBweCA0MDBweDtcXG59XFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG5jbGFzcyBQYXR0ZXJuIGV4dGVuZHMgVGhpbmcge1xuICBpbml0IChwcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBjb2xvcjogJyNkZGQnLFxuICAgICAgcGF0dGVybjogJ0dyYXBoUGFwZXInLFxuICAgICAgY2VsbFdpZHRoOiAxMDAsXG4gICAgICBjZWxsSGVpZ2h0OiAxMDAsXG4gICAgICBsaW5lV2lkdGg6IDJcbiAgICB9O1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuJztcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhwcm9wcy5wYXR0ZXJuKTtcbiAgICBpZiAocHJvcHMucGF0dGVybiA9PT0gJ2dyaWQnKSB7XG4gICAgICB0aGlzLmNzcyggUGF0dGVybi5tYWtlR3JpZENTUyhwcm9wcy5jZWxsV2lkdGgsIHByb3BzLmNlbGxXaWR0aCwgcHJvcHMubGluZVdpZHRoKSApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgc3VwZXIucmVuZGVyKCk7XG5cbiAgICAvLyBBZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xuICAgIHZhciBzaXplID0gTWF0aC5tYXgodGhpcy5wYXJlbnQuJGVsZW1lbnQud2lkdGgoKSwgdGhpcy5wYXJlbnQuJGVsZW1lbnQuaGVpZ2h0KCkpO1xuICAgIHRoaXMuY3NzKHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgbGVmdDogJzBweCcsIHRvcDogJzBweCcsXG4gICAgICB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplXG4gICAgfSk7XG5cbiAgICAvLyBUd2VhayB0aGUgc2l6ZVxuICAgIGlmICh0aGlzLnByb3BzLnNpemUpIHtcbiAgICAgIHRoaXMuY3NzKHtiYWNrZ3JvdW5kU2l6ZTogdGhpcy5wcm9wcy5zaXplICsgJyUnfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdGF0aWMgbWFrZUdyaWRDU1MgKGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgbGluZVdpZHRoKSB7XG4gICAgdmFyIHByb3BzID0ge307XG4gICAgdmFyIHBvcyA9ICctJyArIGxpbmVXaWR0aCArICdweCc7XG4gICAgcHJvcHMuYmFja2dyb3VuZFNpemUgPSAnJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCwgJyArIGNlbGxXaWR0aCArICdweCAnICsgY2VsbEhlaWdodCArICdweCc7XG4gICAgcHJvcHMuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zICsgJyAnICsgcG9zICsgJywnICsgcG9zICsgJyAnICsgcG9zO1xuICAgIHByb3BzLmJhY2tncm91bmRJbWFnZSA9XG4gICAgICAnbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjUpICcgK2xpbmVXaWR0aCsgJ3B4LCB0cmFuc3BhcmVudCAnICtsaW5lV2lkdGgrICdweCksJyArXG4gICAgICAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC41KSAnICtsaW5lV2lkdGgrICdweCwgdHJhbnNwYXJlbnQgJyArbGluZVdpZHRoKyAncHgpJztcbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICBzdGF0aWMgY3NzICgpIHtcbiAgICByZXR1cm4gcmVxdWlyZSgnLi9QYXR0ZXJuLmNzcycpO1xuICB9XG59XG5UaGluZy5hZGRDbGFzcyhQYXR0ZXJuKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgUGF0dGVyblBvbGthRG90cyBleHRlbmRzIFRoaW5nIHtcbiAgaW5pdCAocHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xuICAgICAgY29sb3I6ICcjZmZmZGQ3JyxcbiAgICAgIHJhZGl1czogMTAwLFxuICAgICAgc2l6ZTogNTAwXG4gICAgfTtcbiAgICBwcm9wcy5yYWRpdXMgPSBwcm9wcy5yYWRpdXMgfHwgcHJvcHMuc2l6ZS81O1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcbiAgICB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuUG9sa2FEb3RzJztcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gICAgLy8gcG9sa2EgZG90cyBiYWNrZ3JvdW5kXG4gICAgdGhpcy5jc3Moe1xuICAgICAgYmFja2dyb3VuZEltYWdlOiAncmFkaWFsLWdyYWRpZW50KCcgK3Byb3BzLmNvbG9yKyAnICcgK3Byb3BzLnJhZGl1cysgJ3B4LCB0cmFuc3BhcmVudCAnICsocHJvcHMucmFkaXVzKzMpKyAncHgpLCByYWRpYWwtZ3JhZGllbnQoJyArcHJvcHMuY29sb3IrICcgJyArcHJvcHMucmFkaXVzKyAncHgsIHRyYW5zcGFyZW50ICcgKyhwcm9wcy5yYWRpdXMrMykrICdweCknLFxuICAgICAgYmFja2dyb3VuZFNpemU6IHByb3BzLnNpemUgKyAncHgnLFxuICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiAnMCAwLCAnICsocHJvcHMuc2l6ZS8yKSsgJ3B4ICcgKyhwcm9wcy5zaXplLzIpKyAncHgnXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgc3VwZXIucmVuZGVyKCk7XG4gICAgICAvLyBBZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xuICAgICAgdmFyIHNpemUgPSBNYXRoLm1heCh0aGlzLnBhcmVudC4kZWxlbWVudC53aWR0aCgpLCB0aGlzLnBhcmVudC4kZWxlbWVudC5oZWlnaHQoKSk7XG4gICAgICB0aGlzLmNzcyh7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICBsZWZ0OiAnMHB4JywgdG9wOiAnMHB4JyxcbiAgICAgICAgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgVGhpbmcubXNnKCdQYXR0ZXJuLnJlbmRlcigpOiBQYXR0ZXJuIG5lZWRzIHRvIGJlIGFkZGVkIHRvIGEgcGFyZW50IGJlZm9yZSBjYWxsaW5nIHJlbmRlci4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuVGhpbmcuYWRkQ2xhc3MoUGF0dGVyblBvbGthRG90cyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblBvbGthRG90cztcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIFBhdHRlcm5TdHJpcGVzIGV4dGVuZHMgVGhpbmcge1xuICBpbml0IChwcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBjb2xvcjogJ3JnYmEoMjU1LDIwNSwyNSwxKScsXG4gICAgICByYWRpdXM6IDEwMCxcbiAgICAgIHNpemU6IDUwMFxuICAgIH07XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XG4gICAgdGhpcy50eXBlID0gJ1BhdHRlcm5TdHJpcGVzJztcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XG4gICAgLy8gc3RyaXBlcyBiYWNrZ3JvdW5kXG4gICAgdGhpcy5jc3Moe1xuICAgICAgYmFja2dyb3VuZEltYWdlOiAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCB0cmFuc3BhcmVudCA1MCUsICcgK3Byb3BzLmNvbG9yKyAnIDUwJSknLFxuICAgICAgYmFja2dyb3VuZFNpemU6IHByb3BzLnNpemUgKyAncHgnXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgc3VwZXIucmVuZGVyKCk7XG4gICAgICAvLyBBZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xuICAgICAgdmFyIHNpemUgPSBNYXRoLm1heCh0aGlzLnBhcmVudC4kZWxlbWVudC53aWR0aCgpLCB0aGlzLnBhcmVudC4kZWxlbWVudC5oZWlnaHQoKSk7XG4gICAgICB0aGlzLmNzcyh7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICBsZWZ0OiAnMHB4JywgdG9wOiAnMHB4JyxcbiAgICAgICAgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgVGhpbmcubXNnKCdQYXR0ZXJuLnJlbmRlcigpOiBQYXR0ZXJuIG5lZWRzIHRvIGJlIGFkZGVkIHRvIGEgcGFyZW50IGJlZm9yZSBjYWxsaW5nIHJlbmRlci4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuVGhpbmcuYWRkQ2xhc3MoUGF0dGVyblN0cmlwZXMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdHRlcm5TdHJpcGVzO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcbnZhciBBY3Rpb24gPSByZXF1aXJlKCcuLi9BY3Rpb24vQWN0aW9uLmpzJyk7XG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xuXG5cbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XG5cdGluaXQgKHByb3BzKSB7XG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fTtcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XG5cdFx0dGhpcy5UID0gVGltZXIubWFrZSh7Y2FsbGJhY2s6IHRoaXMudHJpZ2dlci5iaW5kKHRoaXMpLCBkZWxheTogdGhpcy5kZWxheX0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Z28gKCkge1xuXHRcdHRoaXMuVC5nbygpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c3RvcCAoKSB7XG5cdFx0dGhpcy5ULnN0b3AoKTtcblx0fVxuXG5cdHRyaWdnZXIgKCkge1xuXHRcdHRoaXMuY2FsbGJhY2soKTtcblx0XHR0aGlzLlQuZ28oKTtcblx0fVxufVxuVGhpbmcuYWRkQ2xhc3MoUHVsc2FyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQdWxzYXI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xuXG52YXIgUEkgPSAzLjE0MTU5MjY1MzU5O1xudmFyIEhBTEZQSSA9IFBJLzIuMDtcblxuY2xhc3MgUmFuZCB7XG5cdHN0YXRpYyByYW5kSXRlbShhcnIpIHtcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYXJyWyBSYW5kLnJhbmRJbnQoMCwgYXJyLmxlbmd0aC0xKSBdO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGluY2x1ZGVkKVxuXHQvLyBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcblx0c3RhdGljIHJhbmRJbnQobWluLCBtYXgpIHtcblx0XHRtaW4gPSBNYXRoLmNlaWwobWlufHwwKTtcblx0XHRtYXggPSBNYXRoLmZsb29yKG1heHx8MSk7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG5cdH1cblxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAuOTk5OTk5XG5cdHN0YXRpYyByYW5kRmxvYXQoKSB7XG5cdCAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcblx0fVxuXG5cdHN0YXRpYyByYW5kUGVyY2VudCh0aHJlc2hvbGQpIHtcblx0XHRyZXR1cm4gUmFuZC5yYW5kSW50KDEsMTAwKSA8IHRocmVzaG9sZDtcblx0fVxuXG5cdC8vIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiBtYXhEaXN0YW5jZSBvZiB0YXJnZXQgKGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgdGFyZ2V0KVxuXHRzdGF0aWMgcmFuZENsb3NlVG8odGFyZ2V0LCBtYXhEaXN0YW5jZSkge1xuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXG5cdFx0Ly8gcmV0dXJuIHRhcmdldCArIChtYXhEaXN0YW5jZSAqIHJhbmRTaW4yKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgc29tZXdoYXQgY29uY2VudHJhdGVkIHRvd2FyZHMgY2VudGVyIFxuXHRcdHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiBSYW5kLnJhbmRQb3cyKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgd2l0aCBzaGFycCBjb25jZW50cmF0aW9uIGFyb3VuZCBjZW50ZXJcblx0fVxuXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcblx0c3RhdGljIHJhbmRQb3coKSB7XG5cdFx0cmV0dXJuIE1hdGgucG93KDEuMCAtIFJhbmQucmFuZEZsb2F0KCksIDQpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gMCBhbmQgMSwgZGlzdHJpYnV0ZWQgdG93YXJkIDFcblx0c3RhdGljIHJhbmRTaW4oKSB7XG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcblx0c3RhdGljIHJhbmRQb3cyKCkge1xuXHRcdHJldHVybiBSYW5kLnJhbmRQb3coKSAtIFJhbmQucmFuZFBvdygpO1xuXHR9XG5cblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgMFxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcblx0XHRyZXR1cm4gKChSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkpIC0gMy4wKSAvIDMuMDtcblx0fVxuXG4gICAgLy8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGNsb3NlciB0byAwXG4gICAgc3RhdGljIHJhbmRTaW4yKCkge1xuICAgICAgICByZXR1cm4gUmFuZC5yYW5kU2luKCkgLSBSYW5kLnJhbmRTaW4oKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gYXJyYXkgb2YgMyBpbnRzLCBlYWNoIDAtMjU1XG4gICAgc3RhdGljIHJhbmRSR0IoKSB7XG4gICAgICAgIHJldHVybiBbUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KV07XG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRSR0JzdHIoKSB7XG5cdFx0dmFyIHJnYiA9IFJhbmQucmFuZFJHQigpO1xuICAgICAgICByZXR1cm4gJ3JnYmEoJyArcmdiWzBdKyAnLCcgK3JnYlsxXSsgJywnICtyZ2JbMl0rICcsIC45KSc7XG4gICAgfVxufVxuVGhpbmcuYWRkQ2xhc3MoUmFuZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmFuZDtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xuXG4vKipcbiAqICB3LCBoLCBkZXB0aFxuICovXG5jbGFzcyBSb29tIGV4dGVuZHMgQm94IHtcblx0aW5pdCAocHJvcHMpIHtcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xuXHRcdFx0dzogMTUwMCxcblx0XHRcdGg6IDEwMDAsXG5cdFx0XHRkOiAgODAwLFxuXHRcdFx0Ym9yZGVyOiAnMXB4IHNvbGlkIGJsYWNrJyxcblx0XHRcdHBlcnNwZWN0aXZlOiAnaW5oZXJpdCcgIC8vICc4MDAwcHgnXG5cdFx0fTtcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcblx0XHR0aGlzLncgPSBwcm9wcy53O1xuXHRcdHRoaXMuaCA9IHByb3BzLmg7XG5cdFx0dGhpcy5kID0gcHJvcHMuZDtcblx0XHR0aGlzLndhbGxzID0ge307XG5cblx0XHRzdXBlci5pbml0KHByb3BzKTtcblx0XHQvLyB0aGlzLmluaXRpYWxpemUocHJvcHMpO1xuXG5cdFx0dGhpcy50eXBlID0gJ1Jvb20nO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xuXHRcdHRoaXMubWFrZVJvb20odGhpcy4kZWxlbWVudCk7XG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0bWFrZVJvb20oKSB7XG5cdFx0dmFyIHJvb20gPSB0aGlzO1xuXHRcdHZhciB3YWxscyA9IFtdO1xuXHRcdHZhciBoYWxmSGVpZ2h0ID0gdGhpcy5oLzI7XG5cdFx0dmFyIGhhbGZXaWR0aCA9IHRoaXMudy8yO1xuXHRcdHZhciBoYWxmRGVwdGggPSB0aGlzLmQvMjtcblxuXHRcdHZhciB3cmFwcGVyID0gQm94Lm1ha2Uoe1xuXHRcdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdFx0ekluZGV4OiAyMDAwMCxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0dHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCcsXG5cdFx0XHR0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDFzJ1xuXHRcdH0pO1xuXG5cdFx0Ly8gSW5uZXIgZmFjaW5nIHdhbGxzXG5cdFx0Ly8gd2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnZnJvbnQnLCB7XG5cdFx0Ly8gXHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKScsXG5cdFx0Ly8gXHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHQvLyBcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHQvLyBcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdC8vIH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnYmFjaycsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDEpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgncmlnaHQnLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDAsIDU1LCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnbGVmdCcsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgndG9wJywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgNTUsIDI1NSwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZkhlaWdodCAtIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnYm90dG9tJywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMjU1LCAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIDg5ZGVnICkgdHJhbnNsYXRlWiggJyArICgtKGhhbGZIZWlnaHQgKyAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSkgKyAncHggKSdcblx0XHR9KSApO1xuXG5cdFx0Ly8gT3V0ZXIgZmFjaW5nIHdhbGxzXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0ZnJvbnQnLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwKScsXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVooICcgKyAoaGFsZkRlcHRoKSArICdweCApJ1xuXHRcdH0pICk7XG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0YmFjaycsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDEpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcblx0XHR9KSApO1xuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHJpZ2h0Jywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDEwMCwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoKGhhbGZXaWR0aCArIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkpICsgJ3B4ICknXG5cdFx0fSkgKTtcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRsZWZ0Jywge1xuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDEwMCwgMSknLFxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVZKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZXaWR0aCAtIChoYWxmV2lkdGgtaGFsZkRlcHRoKSkgKyAncHggKSdcblx0XHR9KSApO1xuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHRvcCcsIHtcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDEwMCwgMTAwLCAyMDAsIDEpJyxcblx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxuXHRcdFx0aGVpZ2h0OiB0aGlzLmQgKyAncHgnLFxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXG5cdFx0fSkgKTtcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRib3R0b20nLCB7XG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDIwMCwgMTAwLCAxKScsXG5cdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4Jyxcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4Jyxcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVgoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZkhlaWdodCArIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICsgJ3B4ICknXG5cdFx0fSkgKTtcblxuXHRcdC8vIGNvcHkgd2FsbHMgYXJyYXkgdG8gb2JqZWN0XG5cdFx0Zm9yICh2YXIgaT0wOyBpIDwgd2FsbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRoaXMud2FsbHNbIHdhbGxzW2ldLndoaWNoIF0gPSB3YWxsc1tpXTtcblx0XHR9XG5cblx0XHR3cmFwcGVyLmFkZCh3YWxscyk7XG5cdFx0cm9vbS5hZGQod3JhcHBlcik7XG5cdH1cblxuXHRtYWtlV2FsbCh3aGljaCwgY3NzVmFscykge1xuXHRcdHZhciBkZWZhdWx0Q1NTID0ge1xuXHRcdFx0ZGlzcGxheTogJ2Jsb2NrJyxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0Ly8gbGluZUhlaWdodDogdGhpcy5oICsgJ3B4Jyxcblx0XHRcdC8vIGZvbnRTaXplOiAodGhpcy5oLzMpICsncHgnLFxuXHRcdFx0Ly8gZm9udFdlaWdodDogJ2JvbGQnLFxuXHRcdFx0Ly8gdGV4dEFsaWduOiAnY2VudGVyJyxcblx0XHRcdC8vIGNvbG9yOiAnd2hpdGUnLFxuXHRcdFx0YmFja2ZhY2VWaXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdH07XG5cdFx0dmFyIHdhbGwgPSBUaGluZy5jbGFzc2VzLkJveC5tYWtlKCQuZXh0ZW5kKHt9LCBkZWZhdWx0Q1NTLCBjc3NWYWxzKSk7XG5cdFx0d2FsbC4kZWxlbWVudC5hZGRDbGFzcygnd2FsbCcpO1xuXHRcdHdhbGwuJGVsZW1lbnQuYWRkQ2xhc3Mod2hpY2gpO1xuXHRcdC8vIHdhbGwuJGVsZW1lbnQuYXBwZW5kKHdoaWNoKTtcblx0XHR3YWxsLndoaWNoID0gd2hpY2g7XG5cdFx0cmV0dXJuIHdhbGw7XG5cdH1cblxuXHRzdGF0aWMgY3NzICgpIHtcblx0XHQvLyByZXR1cm4gcmVxdWlyZSgnLi9Sb29tLmNzcycpO1xuXHR9XG59XG5UaGluZy5hZGRDbGFzcyhSb29tKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb29tO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcblxuY2xhc3MgVGV4dFBhbmUgZXh0ZW5kcyBUaGluZyB7XG4gICAgaW5pdCAocHJvcHMpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBWZXJkYW5hLCBBcmlhbCwgc2Fucy1zZXJpZicsXG4gICAgICAgICAgICBmb250U2l6ZTogJzI0cHgnLFxuICAgICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXG4gICAgICAgICAgICBjb2xvcjogJ3JnYigyMDAsIDIwMCwgMjAwKScsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICB3OiAxMDAsXG4gICAgICAgICAgICBoOiAxMDBcbiAgICAgICAgfTtcbiAgICAgICAgcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG4gICAgICAgIHN1cGVyLmluaXQocHJvcHMpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnVGV4dFBhbmUnO1xuICAgICAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xuICAgICAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcbiAgICB9XG5cbiAgICBmaWxsVGV4dCAoKSB7XG4gICAgICAgIHZhciBtYXhIZWlnaHQgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpO1xuICAgICAgICB2YXIgbWF4ID0gMTAwMDtcbiAgICAgICAgdmFyICRzcGFuID0gJCgnPHNwYW4+PC9zcGFuPicpO1xuICAgICAgICB2YXIgc3BhbkhlaWdodCA9IDA7XG5cbiAgICAgICAgLy8gZWxlbWVudCBoYXMgdG8gYmUgYXBwZW5kZWQgdG8gYm9keSBwcmlvciwgb3Igc3BhbkhlaWdodCB3aWxsIGJlIDBcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJHNwYW4pO1xuICAgICAgICB3aGlsZSAoc3BhbkhlaWdodCA8IG1heEhlaWdodCAmJiBtYXgtLSA+IDApIHtcbiAgICAgICAgICAgICRzcGFuLmFwcGVuZCh0aGlzLnRleHQpO1xuICAgICAgICAgICAgc3BhbkhlaWdodCA9ICRzcGFuLmhlaWdodCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyICgpIHtcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XG4gICAgICAgIHRoaXMuZmlsbFRleHQodGhpcy50ZXh0KTtcbiAgICB9XG59XG5cblRoaW5nLmFkZENsYXNzKFRleHRQYW5lKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0UGFuZTtcbiIsInZhciBlbGVtZW50Q291bnRlciA9IDA7XG5cbmNsYXNzIFRoaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGluaXQgKHByb3BzKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcbiAgICB0aGlzLnR5cGUgPSAnVGhpbmcnO1xuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcbiAgfVxuXG4gIGluaXRpYWxpemUgKHByb3BzKSB7XG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICAvLyBDU1MgcHJvcHMgZ28gaW50byB0aGlzLnByb3BzXG4gICAgdGhpcy5wcm9wcyA9IFRoaW5nLmNsZWFudXAocHJvcHMpO1xuICAgIC8vIGtlZXAgdGhlc2UgcHJvcGVydGllcyBvbiAndGhpcydcbiAgICB0aGlzLnJvdGF0aW9uID0gcHJvcHMucm90YXRlIHx8IDA7XG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IHByb3BzLnNjYWxlIHx8IDE7XG4gICAgdGhpcy54ID0gcHJvcHMueCB8fCAwO1xuICAgIHRoaXMueSA9IHByb3BzLnkgfHwgMDtcbiAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xuICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kKHRoaXMuJGVsZW1lbnQpO1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHRoaXMucHJvcHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGVsZW1lbnQgZnJvbSBkb20gYW5kIG51bGwgaXQgb3V0XG4gIHVuUmVuZGVyICgpIHtcbiAgICBpZiAodGhpcy4kZWxlbWVudCkge1xuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldERpbWVuc2lvbnMgKCkge1xuICAgIHJldHVybiB7dzogdGhpcy4kZWxlbWVudC53aWR0aCgpLCBoOiB0aGlzLiRlbGVtZW50LmhlaWdodCgpfTtcbiAgfVxuXG4gIGdldEJvdW5kaW5nQm94ICgpIHtcbiAgICAvLyByZWxhdGl2ZSB0byBwYWdlXG4gICAgdmFyIHNjcm9sbHRvcCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xuICAgIHZhciBzY3JvbGxsZWZ0ID0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpO1xuICAgIHZhciBib3VuZHMgPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBib3VuZHMubGVmdCtzY3JvbGxsZWZ0LFxuICAgICAgeTogYm91bmRzLnRvcCtzY3JvbGx0b3AsXG4gICAgICB3OiBib3VuZHMud2lkdGgsXG4gICAgICBoOiBib3VuZHMuaGVpZ2h0LFxuICAgICAgYm90dG9tOiBib3VuZHMuYm90dG9tK3Njcm9sbHRvcCxcbiAgICAgIHJpZ2h0OiBib3VuZHMucmlnaHQrc2Nyb2xsbGVmdFxuICAgIH07XG4gIH1cblxuICBnZXRQb3NpdGlvbiAoKSB7XG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxuICAgIHZhciB4eSA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XG4gICAgdmFyIHogPSB0aGlzLiRlbGVtZW50LmNzcygnei1pbmRleCcpO1xuICAgIHogPSB6ID8gcGFyc2VJbnQoeikgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIFt4eS5sZWZ0LCB4eS50b3AsIHpdO1xuICB9XG5cbiAgLy8gcmV0dXJuIHRoZSBlbGVtZW50J3MgQ1NTIHRyYW5zZm9ybSBtYXRyaXggYXMgYXJyYXkgb2YgNiB2YWx1ZXNcbiAgZ2V0Q1NTVHJhbnNmb3JtICgpIHtcbiAgICB2YXIgbVN0ciA9IHRoaXMuJGVsZW1lbnQuY3NzKCd0cmFuc2Zvcm0nKS5tYXRjaCgvLT9bXFxkXFwuXSsvZyk7XG4gICAgdmFyIG1WYWwgPSBbXTtcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBtU3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBtVmFsW2ldID0gcGFyc2VGbG9hdChtU3RyW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIG1WYWw7XG4gIH1cblxuICByb3RhdGUgKGRlZ3JlZXMpIHtcbiAgICB0aGlzLnJvdGF0aW9uICs9IGRlZ3JlZXM7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJvdGF0ZVRvIChhbmdsZSkge1xuICAgIHRoaXMucm90YXRpb24gPSBhbmdsZTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2NhbGUgKGZhY3Rvcikge1xuICAgIHRoaXMuc2NhbGVGYWN0b3IgKz0gZmFjdG9yO1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzY2FsZVRvIChmYWN0b3IpIHtcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gZmFjdG9yO1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0cmFuc2xhdGUgKHgsIHkpIHtcbiAgICB0aGlzLnggKz0geDtcbiAgICB0aGlzLnkgKz0geTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdHJhbnNsYXRlVG8gKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRyYW5zZm9ybSAoKSB7XG4gICAgdGhpcy5jc3Moe1xuICAgICAgdHJhbnNmb3JtOiBUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGVGYWN0b3IsIHRoaXMueCwgdGhpcy55KVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY3NzIChwcm9wcykge1xuICAgIHRoaXMucHJvcHMgPSAkLmV4dGVuZCh0aGlzLnByb3BzLCBwcm9wcyk7XG4gICAgdGhpcy4kZWxlbWVudC5jc3MocHJvcHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaHRtbCAoKSB7XG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XG4gIH1cblxuICBzdGF0aWMgY3NzICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlICgpIHtcbiAgICB2YXIgY2xzID0gdGhpcztcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKCk7XG4gICAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBzdGF0aWMgYWRkQ2xhc3MgKGNscykge1xuICAgIFRoaW5nLmNsYXNzZXMgPSBUaGluZy5jbGFzc2VzIHx8IHt9O1xuICAgIFRoaW5nLmNsYXNzZXNbY2xzLm5hbWVdID0gY2xzO1xuXG4gICAgLy8gbG9hZCB0aGUgY2xhc3Mgc3R5bGVzICh0aGVzZSBhcmUgaW5jbHVkZWQgaW4gdGhlIGJ1bmRsZSBhdCBidWlsZCB0aW1lKVxuICAgIGNscy5jc3MgJiYgVGhpbmcuYWRkQ1NTU3RyaW5nKGNscy5jc3MoKSwgY2xzLm5hbWUpO1xuXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgY3NzIGZpbGUgYXQgbG9hZCB0aW1lXG4gICAgVGhpbmcuYWRkQ1NTRmlsZShjbHMubmFtZSArICcvJyArIGNscy5uYW1lICsgJy5jc3MnLCAnY3NzJytjbHMubmFtZSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0Q2xhc3MgKG5hbWUpIHtcbiAgICByZXR1cm4gVGhpbmcuY2xhc3Nlc1tuYW1lXTtcbiAgfVxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xuXG4gIHN0YXRpYyBtYWtlU3R5bGVzIChwcm9wcykge1xuICAgIHZhciBzdHlsZXMgPSBwcm9wcyB8fCB7fTtcbiAgICAkLmV4dGVuZChzdHlsZXMsIHtcbiAgICAgIC8vIGxlZnQ6IHByb3BzLmxlZnQgfHwgKHByb3BzLnggJiYgKHByb3BzLnggKyBcInB4XCIpKSxcbiAgICAgIC8vIHRvcDogcHJvcHMudG9wIHx8IChwcm9wcy55ICYmIChwcm9wcy55ICsgXCJweFwiKSksXG4gICAgICB3aWR0aDogcHJvcHMud2lkdGggfHwgKHByb3BzLncgJiYgKHByb3BzLncgKyBcInB4XCIpKSxcbiAgICAgIGhlaWdodDogcHJvcHMuaGVpZ2h0IHx8IChwcm9wcy5oICYmIChwcm9wcy5oICsgXCJweFwiKSksXG4gICAgICB6SW5kZXg6IHByb3BzLnpJbmRleCB8fCBwcm9wcy56LFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICB0cmFuc2Zvcm06IHByb3BzLnRyYW5zZm9ybSB8fCAoVGhpbmcubWFrZVRyYW5zZm9ybUNTUyhwcm9wcy5yb3RhdGUsIHByb3BzLnNjYWxlLCBwcm9wcy54LCBwcm9wcy55KSksXG4gICAgICBwb3NpdGlvbjogcHJvcHMucG9zaXRpb24gfHwgJ2Fic29sdXRlJ1xuICAgIH0pO1xuICAgIGRlbGV0ZSBzdHlsZXMucm90YXRlO1xuICAgIGRlbGV0ZSBzdHlsZXMuc2NhbGU7XG4gICAgZGVsZXRlIHN0eWxlcy54O1xuICAgIGRlbGV0ZSBzdHlsZXMueTtcbiAgICBkZWxldGUgc3R5bGVzLno7XG4gICAgZGVsZXRlIHN0eWxlcy53O1xuICAgIGRlbGV0ZSBzdHlsZXMuaDtcbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgc3RhdGljIG1ha2VUcmFuc2Zvcm1DU1MgKHJvdGF0ZSwgc2NhbGUsIHR4LCB0eSkge1xuICAgIHZhciB0cmFuc2Zvcm0gPSAnJztcbiAgICB0cmFuc2Zvcm0gKz0gKHR4IHx8IHR5KSA/IChUaGluZy5tYWtlVHJhbnNsYXRlQ1NTKHR4LCB0eSkgKyAnICcpIDogJyc7XG4gICAgdHJhbnNmb3JtICs9IFRoaW5nLmlzTnVtZXJpYyhyb3RhdGUpID8gKFRoaW5nLm1ha2VSb3RhdGlvbkNTUyhyb3RhdGUpICkgOiAnJztcbiAgICB0cmFuc2Zvcm0gKz0gc2NhbGUgPyAoVGhpbmcubWFrZVNjYWxlQ1NTKHNjYWxlKSArICcgJykgOiAnJztcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xuICB9XG5cbiAgc3RhdGljIG1ha2VSb3RhdGlvbkNTUyAoYW5nbGUpIHtcbiAgICB2YXIgY3NzID0gJyc7XG4gICAgaWYgKGFuZ2xlICE9PSB1bmRlZmluZWQgJiYgYW5nbGUgIT09IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2YgYW5nbGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICQuZWFjaChhbmdsZSwgZnVuY3Rpb24gKGF4aXNOYW1lLCBhbmdsZSkge1xuICAgICAgICAgIGNzcyArPSAncm90YXRlJyArIGF4aXNOYW1lLnRvVXBwZXJDYXNlKCkgKyAnKCcgK2FuZ2xlKyAnZGVnKSAnO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjc3MgPSAncm90YXRlWignK2FuZ2xlKydkZWcpICc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjc3M7XG4gIH1cblxuICBzdGF0aWMgbWFrZVNjYWxlQ1NTIChzY2FsZSkge1xuICAgIHJldHVybiAnc2NhbGUoJytzY2FsZSsnKSc7XG4gIH1cblxuICAvLyBOT1RFOiB0cmFuc2xhdGlvbiBjb29yZHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBlbGVtZW50J3MgcG9zaXRpb24gaW4gdGhlIGRvY3VtZW50IGZsb3cuXG4gIC8vIFRoZXkgYXJlIG5vdCB0aGUgc2FtZSBhcyBzZXR0aW5nIGxlZnQvdG9wIHZhbHVlcywgd2hpY2ggYXJlIGFic29sdXRlIGNvb3JkaW5hdGVzXG4gIC8vIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudC5cbiAgc3RhdGljIG1ha2VUcmFuc2xhdGVDU1MgKHgsIHkpIHtcbiAgICB4ID0geCB8fCAnMCc7XG4gICAgeSA9IHkgfHwgJzAnO1xuICAgIHJldHVybiAndHJhbnNsYXRlKCcrIHggKyAncHgsICcgKyB5ICsncHgpJztcbiAgfVxuXG4gIHN0YXRpYyBtYWtlRWxlbWVudCAoaHRtbCwgcHJvcHMsIHR5cGUpIHtcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGh0bWwpXG4gICAgICAuY3NzKFRoaW5nLm1ha2VTdHlsZXMocHJvcHMpKVxuICAgICAgLmFkZENsYXNzKHR5cGUgfHwgJ3JhbmRvbScpXG4gICAgICAuYXR0cignaWQnLCAodHlwZSB8fCAncmFuZG9tJykgKyAoKytlbGVtZW50Q291bnRlcikpO1xuICAgIHJldHVybiAkZWxlbWVudDtcbiAgfVxuXG4gIHN0YXRpYyBpc051bWVyaWMobikge1xuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgbmVjZXNzYXJ5IENTUyBwcm9wZXJ0aWVzIGFyZSBwcmVzZW50IG9yIGRlZmF1bHRlZCB0byBzb21ldGhpbmcgc2FuZVxuICBzdGF0aWMgY2xlYW51cCAocHJvcHMpIHtcbiAgICB2YXIgY3AgPSBwcm9wcyB8fCB7fTtcbiAgICBjcC5wb3NpdGlvbiA9IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSc7ICAgLy8gZGVmYXVsdCB0byBhYnNvbHV0ZSBwb3NpdGlvbmluZ1xuICAgIC8vIGNwLnggPSBwcm9wcy54IHx8IHByb3BzLmxlZnQgfHwgMDtcbiAgICAvLyBjcC55ID0gcHJvcHMueSB8fCBwcm9wcy50b3AgfHwgMDtcbiAgICAvLyBjcC56ID0gcHJvcHMueiB8fCBwcm9wcy56SW5kZXg7XG4gICAgLy8gY3AudyA9IHByb3BzLncgfHwgcHJvcHMud2lkdGg7XG4gICAgLy8gY3AuaCA9IHByb3BzLmggfHwgcHJvcHMuaGVpZ2h0O1xuICAgIGNwLnJvdGF0aW9uID0gcHJvcHMucm90YXRpb24gfHwgMDtcbiAgICBjcC5zY2FsZSA9IHByb3BzLnNjYWxlIHx8IDE7XG4gICAgcmV0dXJuIGNwO1xuICB9XG5cbiAgc3RhdGljIGFkZENTU0ZpbGUoZmlsZU5hbWUsIGlkKSB7XG4gICAgIHZhciBsaW5rID0gJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiJyArIGZpbGVOYW1lICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XG4gICAgICQoJ2hlYWQnKS5maW5kKCcjJyArIGlkKS5yZW1vdmUoKTtcbiAgICAgJCgnaGVhZCcpLmFwcGVuZChsaW5rKTtcbiAgfVxuXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZCkge1xuICAgIGlmIChjc3NTdHJpbmcpIHtcbiAgICAgIC8vIHZhciBkb2MgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgICB2YXIgc3R5bGVFbCA9ICQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICtjc3NTdHJpbmcrICc8L3N0eWxlPicpXG4gICAgICAgIC5hdHRyKCdpZCcsIChpZCB8fCAnVGhpbmcnKSArICctc3R5bGVzJyk7XG4gICAgICAkKCdoZWFkJykuYXBwZW5kKHN0eWxlRWwpO1xuICAgIH1cbiAgfVxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc3RhdGljIG1zZyhzKSB7XG4gICAgd2luZG93LmNvbnNvbGUubG9nKHMpO1xuICB9XG59XG5UaGluZy5hZGRDbGFzcyhUaGluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGhpbmc7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xudmFyIEFjdGlvbiA9IHJlcXVpcmUoJy4uL0FjdGlvbi9BY3Rpb24uanMnKTtcblxuY2xhc3MgVGltZXIgZXh0ZW5kcyBBY3Rpb24ge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHByb3BzID0gcHJvcHMgfHwge307XG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXHRcdHRoaXMuZGVsYXkgPSBwcm9wcy5kZWxheSB8fCAxMDAwO1xuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnbyAoKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XG5cdFx0dGhpcy50aW1lcklEID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLmRlbGF5KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHN0b3AgKCkge1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVySUQpO1xuXHRcdHRoaXMudGltZXJJRCA9IG51bGw7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKFRpbWVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XG5cbmNsYXNzIFRyaWFuZ2xlIGV4dGVuZHMgVGhpbmcge1xuXHRpbml0IChwcm9wcykge1xuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XG5cdFx0XHRzaXplOiAxMCxcblx0XHRcdGNvbG9yOiAnI0JBREE1NSdcblx0XHR9O1xuXHRcdHByb3BzID0gJC5leHRlbmQocHJvcHMsIGRlZmF1bHRQcm9wcyk7XG5cdFx0dGhpcy5pbml0aWFsaXplKHByb3BzKTtcblx0XHR0aGlzLnR5cGUgPSAnVHJpYW5nbGUnO1xuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xuXHRcdHRoaXMubWFrZVRyaWFuZ2xlKHRoaXMucHJvcHMuc2l6ZSwgdGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgZWxlbWVudCBiZWZvcmUgY2FsbGluZyB0aGlzXG5cdH1cblxuXHRyZW5kZXIgKCkge1xuXHRcdHN1cGVyLnJlbmRlcigpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0bWFrZVRyaWFuZ2xlIChzaXplLCBjb2xvcikge1xuXHRcdGNvbG9yID0gY29sb3IgfHwgJyNCQURBNTUnO1xuXHRcdHNpemUgPSBzaXplIHx8IDEwO1xuXHRcdHRoaXMuY3NzKHtcblx0XHRcdHdpZHRoOiAwLCBcblx0XHRcdGhlaWdodDogMCwgXG5cdFx0XHRmb250U2l6ZTogMCxcblx0XHRcdGxpbmVIZWlnaHQ6IDAsXG5cdFx0XHRib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxuXHRcdFx0Ym9yZGVyVG9wOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50Jyxcblx0XHRcdGJvcmRlckxlZnQ6IHNpemUgKyAncHggc29saWQgJyArIGNvbG9yXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblRoaW5nLmFkZENsYXNzKFRyaWFuZ2xlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmlhbmdsZTtcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcbnJlcXVpcmUoJy4vQm94L0JveC5qcycpO1xucmVxdWlyZSgnLi9BcnJvdy9BcnJvdy5qcycpO1xucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcbnJlcXVpcmUoJy4vQWN0aW9uL0FjdGlvbi5qcycpO1xucmVxdWlyZSgnLi9UaW1lci9UaW1lci5qcycpO1xucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcbnJlcXVpcmUoJy4vUHVsc2FyL1B1bHNhci5qcycpO1xucmVxdWlyZSgnLi9Eby9Eby5qcycpO1xucmVxdWlyZSgnLi9MYWJlbC9MYWJlbC5qcycpO1xucmVxdWlyZSgnLi9MaW5lL0xpbmUuanMnKTtcbnJlcXVpcmUoJy4vSW1nL0ltZy5qcycpO1xucmVxdWlyZSgnLi9QYXR0ZXJuL1BhdHRlcm4uanMnKTtcbnJlcXVpcmUoJy4vUGF0dGVyblBvbGthRG90cy9QYXR0ZXJuUG9sa2FEb3RzLmpzJyk7XG5yZXF1aXJlKCcuL1BhdHRlcm5TdHJpcGVzL1BhdHRlcm5TdHJpcGVzLmpzJyk7XG5yZXF1aXJlKCcuL0JHSW1nL0JHSW1nLmpzJyk7XG5yZXF1aXJlKCcuL1RleHRQYW5lL1RleHRQYW5lLmpzJyk7XG5yZXF1aXJlKCcuL0NpcmNsZS9DaXJjbGUuanMnKTtcbnJlcXVpcmUoJy4vVHJpYW5nbGUvVHJpYW5nbGUuanMnKTtcbnJlcXVpcmUoJy4vQ3ViZS9DdWJlLmpzJyk7XG5yZXF1aXJlKCcuL1Jvb20vUm9vbS5qcycpO1xuXG53aW5kb3cuVGhpbmcgPSBUaGluZztcbiJdfQ==
