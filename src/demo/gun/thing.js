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

},{"../Thing/Thing.js":27}],2:[function(require,module,exports){
module.exports = "/* required for arrow */\r\n.arrow-head {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  width: 0; \r\n  height: 0; \r\n  border-top: 30px solid transparent;\r\n  border-bottom: 30px solid transparent;\r\n  border-left: 30px solid green;\r\n}\r\n\r\n.arrow-body {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  background-color: green;\r\n  width: 40px;\r\n  height: 20px;\r\n  margin: 0;\r\n  margin-top: 20px;\r\n  margin-bottom: 20px;\r\n  border-left: 0;\r\n  border-right: 0;\r\n}\r\n\r\n.arrow-wrapper {\r\n  width: 70px;   /* arrow-body width + arrow-head border width */\r\n}\r\n\r\n.Arrow {\r\n  /* For some nice animation on the rotates: */\r\n  -webkit-transition: -webkit-transform .2s;\r\n     -moz-transition:    -moz-transform .2s;\r\n          transition:         transform .2s;\r\n}\r\n\r\n";

},{}],3:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var CSS = require('./Arrow.css');

class Arrow extends Thing {
	init (props) {
		this.setDefaultProps(props);
		this.type = 'Arrow';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.setColor(this.props.color);  // have to make arrow before calling this
		Thing.addCSSString(CSS, 'Arrow');
	}

	setColor (c) {
		this.$element.find('.arrow-head').css({borderLeftColor:c});
		this.$element.find('.arrow-body').css({backgroundColor:c});
		return this;
	}

	html () {
		return "<div><div class='arrow-wrapper'><div class='arrow-body'></div><div class='arrow-head'></div></div></div>";
	}
}
Thing.addClass(Arrow);

module.exports = Arrow;

},{"../Thing/Thing.js":27,"./Arrow.css":2}],4:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class BGImg extends Thing {
  init (props) {
    var defaultProps = {
      url: '',   // fully formed image definition e.g. url(img/blah.jpg) or linear-gradient() etc.
      src: '',   // image path e.g. 'img/blah.jpg'. Pass EITHER url OR src NOT BOTH.
      position: 'absolute',
      width: '100%',
      height: '100%',
      center: true,
      repeat: false,
      size: 'cover'    // contain|cover|100% 100%
    };
    props = this.props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
    this.type = 'BGImg';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.css(BGImg.makeBGImgCSS(props));
  }

  static makeBGImgCSS (props) {
    var url = props.url || ('url("' + props.src + '")');
    return {
      backgroundImage: url,
      backgroundRepeat: props.repeat ? 'repeat' : 'no-repeat',
      backgroundPosition: props.center ? 'center' : '0 0',
      backgroundSize: props.size
    };
  }
}
Thing.addClass(BGImg);

module.exports = BGImg;

},{"../Thing/Thing.js":27}],5:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Box extends Thing {
  init (props = {}) {
  	this.setDefaultProps(props);
  	this.type = 'Box';
  	this.items = [];
  	this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.addMask(props.mask);
  }

  add (thing) {
    if (thing) {
      if (thing instanceof Array) {
        thing.forEach(this.add.bind(this));
      }
      else {
        this.items.push(thing);
        thing.parent = this;
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

  each (func) {
    func && this.items.forEach(func);
    return this;
  }
}
Thing.addClass(Box);

module.exports = Box;

},{"../Thing/Thing.js":27}],6:[function(require,module,exports){
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
    this.setDefaultProps(props);
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
}
Thing.addClass(Circle);

module.exports = Circle;

},{"../Thing/Thing.js":27}],7:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

// var blendModes = [
//   'normal',
//   // darker
//   'darken',
//   'multiply',
//   'color-burn',
//   // lighter
//   'lighten',
//   'color-dodge',
//   'screen',
//   // contrast
//   'overlay',
//   'hard-light',
//   'soft-light',
//   // inversion
//   'exclusion',
//   'difference',
//   // components
//   'hue',
//   'saturation',
//   'color',
//   'luminosity',
// ];

// {
//     position: relative;
//     display: inline-block;
//     background-color: rgb(255, 174, 174);
//     margin: 20px;
//     width: 300px;
//     height: 600px;
//     background-image: url(img/faceparts/washington_eye_left_round.png), url(img/faceparts/washington_eye_left_round.png);
//     background-size: 100% 50%, 110% 53%;
//     background-blend-mode: darken, color-burn;
//     background-position: 0px 0px, -13px -2px;
//     background-repeat: no-repeat, no-repeat;
// }



// // very high contrast
// {
//     position: relative;
//     display: inline-block;
//     background-color: rgb(128, 128, 128);
//     margin: 20px;
//     width: 300px;
//     height: 600px;
//     background-image: url(img/faceparts/washington_eye_left_round.png), url(img/faceparts/washington_eye_left_round.png);
//     background-size: 100% 50%, 100% 50%;
//     background-blend-mode: color-dodge, color-burn;
//     background-position: 0px 0px, -0px 0px;
//     background-repeat: no-repeat, no-repeat;
// }



class CompositeImg extends Thing {
  init (props = {}) {
    this.type = 'CompositeImg';
    this.layers = [];

    if (props.layers) {
      this.addLayer(props.layers);
      delete props.layers;  // don't let this propagate into css
    }

    this.setDefaultProps(props);

    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.applyLayers();  // will add layer CSS props to pops object so makeElement() will pick them up
    this.addMask(props.mask);  // make this part of convertToCSS()
  }

  addLayer (props = {}) {
    if (props instanceof Array) {
      props.forEach(this.addLayer.bind(this));
    }
    else if (props) {
      var layerProps = {
        backgroundImage: props.image || props.backgroundImage,
        backgroundSize: props.size || props.backgroundSize || '100% 100%',
        backgroundBlendMode: props.blendMode || props.backgroundMode || 'normal',
        backgroundPosition: props.position || props.backgroundPosition || '0px 0px',
        backgroundRepeat: props.repeat || props.backgroundRepeat || 'no-repeat',
      };
      this.layers.push(layerProps);
    }
  }

  // merge all layer properties into one background properties CSS object
  makeCSS () {
    var mergedLayers = {};
    if (this.layers.length > 0) {
      mergedLayers = this.layers.reverse().reduce(function (merged, layerProps) {
        merged.backgroundImage += (', ' + layerProps.backgroundImage); 
        merged.backgroundSize += (', ' + layerProps.backgroundSize); 
        merged.backgroundBlendMode += (', ' + layerProps.backgroundBlendMode); 
        merged.backgroundPosition += (', ' + layerProps.backgroundPosition); 
        merged.backgroundRepeat += (', ' + layerProps.backgroundRepeat); 
        return merged;
      });
    }
    return mergedLayers;
  }

  // make (props) {
  //   return Thing.make($.extend({
  //     w: 1200,
  //     h: 2750,
  //     backgroundColor: 'red',
  //   }, props));
  // }

  applyLayers () {
    this.css(this.makeCSS());
  }
}
Thing.addClass(CompositeImg);

module.exports = CompositeImg;

},{"../Thing/Thing.js":27}],8:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var Box = require('../Box/Box.js');

class DemoBox extends Box {
	init (props) {
		var defaultProps = {
		  display: 'inline-block',
		  position: 'relative',
		  margin: '20px',
		  width: '200px',
		  height: '200px',
		  border: '2px dashed #eee'
		};
		props = $.extend({}, defaultProps, props);
		super.init(props);
		this.type = 'DemoBox';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);
	}
}
Thing.addClass(DemoBox);

module.exports = DemoBox;

},{"../Box/Box.js":5,"../Thing/Thing.js":27}],9:[function(require,module,exports){
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

},{"../Thing/Thing.js":27}],10:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

/*
// works with star.svg as base64
-webkit-mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiI…tzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gIDwvZz48L3N2Zz4=);
-webkit-mask-repeat: no-repeat;
-webkit-mask-size: 100%;

// circle svg also works
-webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><circle shape-rendering='geometricPrecision' cx='15' cy='15' r='10' stroke='black' stroke-width='5' fill='none'/></svg>");
-webkit-mask-repeat: no-repeat;
-webkit-mask-size: 100%;

.star {
  -webkit-mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB2ZXJzaW9uPSIxLjEiICAgaWQ9InN2ZzIiICAgdmlld0JveD0iMCAwIDk5Ljk5OTk5NyA5OS45OTk5OTciICAgaGVpZ2h0PSIxMDAiICAgd2lkdGg9IjEwMCI+ICA8ZGVmcyAgICAgaWQ9ImRlZnM0IiAvPiAgPG1ldGFkYXRhICAgICBpZD0ibWV0YWRhdGE3Ij4gICAgPHJkZjpSREY+ICAgICAgPGNjOldvcmsgICAgICAgICByZGY6YWJvdXQ9IiI+ICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4gICAgICAgIDxkYzp0eXBlICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+ICAgICAgPC9jYzpXb3JrPiAgICA8L3JkZjpSREY+ICA8L21ldGFkYXRhPiAgPGcgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTk1Mi4zNjIyMykiICAgICBpZD0ibGF5ZXIxIj4gICAgPHBhdGggICAgICAgZD0iTSA1MC4wMDAwMDEsOTU0LjgwOTM5IDY1LjQ1MDg0OCw5ODYuMTE2MjQgMTAwLDk5MS4xMzY1MiA3NC45OTk5OTgsMTAxNS41MDU1IDgwLjkwMTY5OSwxMDQ5LjkxNSA1MCwxMDMzLjY2OTEgMTkuMDk4Mjk4LDEwNDkuOTE1IDI1LjAwMDAwMSwxMDE1LjUwNTUgLTEuMjEzNDMzNmUtNiw5OTEuMTM2NTIgMzQuNTQ5MTUxLDk4Ni4xMTYyNCBaIiAgICAgICBpZD0icGF0aDQxMzYiICAgICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eTowLjUwMjIyMjI0O3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoyMi42NzcxNjU5OTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gIDwvZz48L3N2Zz4=);
}
*/

class ImgSVG extends Thing {
  init (props) {
    var defaultProps = {
      lineWidth: 5,
      radius: 10
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
    this.type = 'ImgSVG';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.addClass(props.pattern);
  }

  render () {
    let svgTag = ImgSVG.makeCircleSVG(this.props.radius, this.props.lineWidth);
    super.render();
    this.$element.append(svgTag);
  }

  getURL () {
    return ImgSVG.makeURL(ImgSVG.makeCircleSVG(this.props.radius, this.props.lineWidth));
  }

  static makeURL (svgTag) {
    return `url("data:image/svg+xml;utf8,${svgTag}")`;
  }

  static makeCircleSVG (radius, lineWidth) {
    let outerRadius = radius + lineWidth;
    let width = (outerRadius) * 2;
    let svgTag = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${width}'><circle shape-rendering='geometricPrecision' cx='${outerRadius}' cy='${outerRadius}' r='${radius}' stroke='black' stroke-width='${lineWidth}' fill='none'/></svg>`;
    return svgTag;
  }

  // radius: radius of dot (will be capped at 1/4 of size, so dots don't overflow image bounds)
  // size: size of two-dot image (square)
  //
  // SVGs scale up/down very well, so there's no need to set a large size. Just use 100 and scale the image in CSS.
  static makePolkaDotsSVG (radius=20, size=100) {
    let left = size * 0.25;
    let right = size * 0.75;
    let r = radius > size * 0.25 ? size * 0.25 : radius;
    let svgTag = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle shape-rendering='geometricPrecision' cx='${left}' cy='${left}' r='${r}' fill='black'/><circle shape-rendering='geometricPrecision' cx='${right}' cy='${right}' r='${r}' fill='black'/></svg>`;
    return svgTag;
  }
}

Thing.addClass(ImgSVG);

module.exports = ImgSVG;


/** SVG Polka dot pattern, filled into rectangle

<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
        <pattern x="561.2000122070312" y="167" id="pattern-output" width="400" height="350" patternUnits="userSpaceOnUse">
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="350">
                <rect width="100%" height="100%" fill="#fbfbfb"></rect>
                <g transform="translate(99, 89), rotate(0, 0, 0), scale(1)" fill="#000000" stroke-width="2" stroke="none">
                    <circle r="25" transform="translate(0, 0), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(400, 0), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(0, 350), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(400, 350), rotate(0, 0, 0), scale(4.5)"></circle>
                    <rect transform="translate(0, 0), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none" class="shape-overlay"></rect>
                    <rect transform="translate(400, 0), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                    <rect transform="translate(0, 350), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                    <rect transform="translate(400, 350), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                </g>
                <g transform="translate(302, 258), rotate(0, 0, 0), scale(1)" fill="#000000" stroke-width="2" stroke="none">
                    <circle r="25" transform="translate(0, 0), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(-400, 0), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(0, -350), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(-400, -350), rotate(0, 0, 0), scale(4.5)"></circle>
                    <rect transform="translate(0, 0), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none" class="shape-overlay"></rect>
                    <rect transform="translate(-400, 0), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                    <rect transform="translate(0, -350), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                    <rect transform="translate(-400, -350), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                </g>
            </svg>
        </pattern>
    </defs>
    <rect class="preview-output" width="100%" height="100%" fill="url(#pattern-output)"></rect>
</svg>
*/

},{"../Thing/Thing.js":27}],11:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

/*
    src: <file path>
*/
class Img extends Thing {
  init (props) {
    props = props || {};

    this.type = 'Img';
    this.aspectRatio = 1;
    this.loaded = false;
    this.onImgLoaded = props.onImgLoaded;
    this.onImgError = props.onImgError;
    this.src = props.src;

    this.setDefaultProps(props);
    this.$element = Thing.makeElement(this.html(), this.props, this.type);

    // track the image load
    pageImgQueue.add(this);

    // load the image
    loadImage(props.src, this.onLoad.bind(this), this.onError.bind(this));
  }

  onLoad (img) {
    this.loaded = true;
    this.aspectRatio = img.height / img.width;  // aspect ratio of original image
    if (this.w || (!this.w && !this.h)) {
        this.w = this.w || img.width;
        this.h = this.h || (this.w * this.aspectRatio);
    }
    else {
        this.h = this.h;
        this.w = (this.h * (1/this.aspectRatio));
        window.console.log('img loaded', this.h, this.aspectRatio, (1/this.aspectRatio), this.w);
    }
    // set the image as the div's background
    this.css({
        width: this.w,
        height: this.h,
        background: 'url(' +img.src+ ') no-repeat center ' + (this.props.backgroundColor || ''),
        backgroundSize: '100% 100%'
    });
    // apply transforms now that we know image width and height
    this.transform();
    // clear image from the load queue
    pageImgQueue.remove(this);
    // exec callback if any
    this.onImgLoaded && this.onImgLoaded(this);
  }

  onError (img) {
    Thing.msg('Img.onError: Failed to load ' + img.src);
    this.loaded = true;
    this.width = this.height = 0;
    this.aspectRatio = 1;
    pageImgQueue.remove(this);
    // exec callback if any
    this.onImgError && this.onImgError(this);
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

  static onAllLoaded (func) {
    if (typeof func === 'function') {
        onLoadFunctions.push(func);
    }
    else {
        Thing.msg("IMG.onAllLoaded(): triggered");
        onLoadFunctions.forEach( (f) => { f(); } );
    }
  }

  static loadBatch (propsArray = [], onBatchLoaded = () => {}) {
    let q = new ImgQueue({onEmpty: () => { onBatchLoaded(loaded); }});
    let loaded = [];
    propsArray.forEach(function (props) {
        props.onImgLoaded = (img) => { 
            loaded.push(img); // has to be BEFORE q.remoe() so last image is included when q.onEmpty() fires.
            q.remove(img); 
        };
        props.onImgError = (img) => { 
            q.remove(img); 
        };
        q.add(Img.make(props));
    });
  }
}

Thing.addClass(Img);


class ImgQueue {
    constructor (props = {onEmpty: function () {}}) {
        this.queuedImgs = [];
        this.onEmpty = props.onEmpty;
    }

    add (img) {
        if (img && !img.loaded) {
            this.queuedImgs.push(img);
        }
        return this.queuedImgs.length;
    }

    remove (img) {
        if (img && img.loaded) {
            var index = this.queuedImgs.indexOf(img);
            if (index > -1) {
                this.queuedImgs.splice(index, 1);
            }
            if (this.queuedImgs.length === 0) {
                this.onEmpty && this.onEmpty();
            }
        }
        return this.queuedImgs.length;
    }

    remaining () {
        return this.queuedImgs.length;
    }
}

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

var onLoadFunctions = [];
var pageImgQueue = new ImgQueue({onEmpty: () => Img.onAllLoaded()});

module.exports = Img;

},{"../Thing/Thing.js":27}],12:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Label extends Thing {
	init (props) {
		var defaultProps = {
			text: '',
			html: false,
			fontFamily: 'Roboto, Calibri, Arial, sans-serif',
			fontSize: '14px',
			color: '#000'
		};
		props = $.extend({}, defaultProps, props);
		this.setDefaultProps(props);
		this.type = 'Label';
		this.text = props.text;
		this.isHTML = props.html;
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.setText(props.text);

		Thing.addFontURL('https://fonts.googleapis.com/css?family=Roboto:100,400,700,900', 'roboto_font');
	}

	setText (txt) {
		this.text = txt;
		if (this.isHTML) {
			// will respect html tags
			this.$element.empty().html(txt);
		}
		else {
			// literal text - will show angle brackets
			this.$element.empty().text(txt);
		}
		return this;
	}
}
Thing.addClass(Label);

module.exports = Label;

},{"../Thing/Thing.js":27}],13:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Line extends Thing {
  init (props) {
    // expecting props: { x:0, y:0, x2:50, y2:50, lineWidth:5 }
    // call it 'lineWidth' to avoid collision with CSS 'width' property

    // fix old property names
    props.x = props.x || props.x1 || 0;
    props.y = props.y || props.y1 || 0;
    delete props.x1;
    delete props.y1;

    // need to set origin to far left of line
    props.transformOrigin = '0 50%';
    props.backgroundColor = props && (props.backgroundColor || props.color || 'black');
    super.setDefaultProps(props);

    this.type = 'Line';

    this.createLine(props.x, props.y, props.x2, props.y2, props.lineWidth, props.arrow, props.shorten);
  }

  createLine (x1,y1, x2,y2, lineWidth, arrow, shorten) {
    this.lineWidth = lineWidth || 2;
    this.length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) - (arrow? this.lineWidth*2 : 0);  // shorten the length to make room for arrowhead
    this.angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    this.length -= shorten || 0;  // shorten the line a bit (makes room for arrowhead)

    // grrrrrr... some funcs read from props.x, some read this.x
    this.x = this.props.x = x1;
    this.y = this.props.y = (y1-(this.lineWidth/2));
    this.w = this.props.w = this.length;
    this.h = this.props.h = this.lineWidth;
    this.rotation = this.props.rotate = {z: this.angle};

    this.$element = Thing.makeElement(this.html(), this.props, this.type);

    if (arrow) {
      this.addArrowHead(this.length, this.lineWidth, this.lineWidth*2, this.props.backgroundColor);
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
}
Thing.addClass(Line);

module.exports = Line;

},{"../Thing/Thing.js":27}],14:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Page {
    static download(data, filename, type) {
        var file = new Blob([data], {type: type});
        var url = URL.createObjectURL(file);
        var a = window.document.createElement("a");
        a.href = url;
        a.download = filename;
        window.document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            window.document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    static getDocumentHTML () {
        var entireDoc = window.document.getElementsByTagName('html')[0];
        var entireDocStr = '<html>' + entireDoc.innerHTML + '</html>';
        return entireDocStr;
    }

    static saveDocToFile() {
        var randnum = parseInt(Math.random()*100000000);

        // html only: don't save scripts
        $('script').remove();

        Page.download(Page.getDocumentHTML(), 'Thing_saved_file_' + randnum + '.html', 'text/html');
    }

    static setScale (scale) {
        if (scale !== undefined) {
            var el = document.body;
            el.style.transformOrigin = 'left top';
            el.style.transform = 'scale(' + scale + ')';
        }
    }

    static initEvents() {
        // Listen for keypress
        document.addEventListener('keypress', (function (e) {
                  var el = document.body;
                  var n = Number(e.key);
                  if (n >= 0 && n <= 9) {
                    // Number keys scale the page from .1 to .9. 0 is fullsize
                    var scale = n === 0 ? 1 : n/10;
                    this.setScale(scale);
                  }
                  else if (e.key === 's') {
                    // s toggles scrolling on/off
                    el.style.overflow = (el.style.overflow === 'hidden') ? 'scroll' : 'hidden';
                  }
                }).bind(this));
    }

    static parseKeyvalString(str, delimiter = '&', associativeOperator = '=') {
        const result = {};
        const decodedStr = str ? decodeURIComponent(str) : null;

        if (decodedStr) {
            const keyvals = decodedStr.split(delimiter);
            keyvals.forEach((kv) => {
                const keyval = kv.split(associativeOperator);
                if (keyval.length >= 2) {
                    const key = keyval.shift();
                    if (key) {
                        const val = keyval.join('=');
                        result[key.trim()] = val.trim();
                    }
                }
            });
        }

        return result;
    }

    static getParams() {
        return this.parseKeyvalString(window.location.search.slice(1));
    }

    static setup() {
        var pageParams = Thing.Page.getParams();
        Page.setScale(pageParams.scale || 1);
        Page.initEvents();
    }
}
Thing.addClass(Page);

module.exports = Page;

},{"../Thing/Thing.js":27}],15:[function(require,module,exports){
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
    this.setDefaultProps(props);
    this.type = 'PatternPolkaDots';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    // polka dots background
    this.css({
      backgroundImage: 'radial-gradient(' +props.color+ ' ' +props.radius+ 'px, transparent ' +(props.radius+2)+ 'px), radial-gradient(' +props.color+ ' ' +props.radius+ 'px, transparent ' +(props.radius+2)+ 'px)',
      backgroundSize: props.size + 'px ' + props.size + 'px',
      backgroundPosition: '0 0, ' +(props.size/2)+ 'px ' +(props.size/2)+ 'px'
    });
  }

  render () {
    if (this.parent) {
      super.render();
      // Adjust pattern to fill parent
      super.fillParent(this.props.stretch);
    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }

}
Thing.addClass(PatternPolkaDots);

module.exports = PatternPolkaDots;

},{"../Thing/Thing.js":27}],16:[function(require,module,exports){
module.exports = ".PatternSofa {\r\n  background:\r\n    radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,\r\n    radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,\r\n    radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50%,\r\n    radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,\r\n    radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,\r\n    radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,\r\n    radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,\r\n    linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,\r\n    linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0;\r\n  background-color: #300;\r\n  background-size: 25% 25%;\r\n}\r\n";

},{}],17:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var CSS = require('./PatternSofa.css');

class PatternSofa extends Thing {
  init (props) {
    var defaultProps = {
      size: 25
    };
    props = props || {};
    this.props = props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
    this.type = 'PatternSofa';
    this.patternSizes = [5, 10, 12.5, 16.6, 25, 50]; // percent background sizes that don't distort pattern
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    Thing.addCSSString(CSS, 'PatternSofa');
  }

  render () {
    if (this.parent) {
      super.render();

      // resize pattern to fill parent element with a square aspect ratio
      this.fillParent(this.props.stretch);

      // Tweak the pattern size
      if (this.props.size) {
        this.css({backgroundSize: (this.patternSizes[this.props.size] || 25) + '%'});
      }
    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }
}
Thing.addClass(PatternSofa);

module.exports = PatternSofa;

},{"../Thing/Thing.js":27,"./PatternSofa.css":16}],18:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class PatternStripes extends Thing {
  init (props) {
    var defaultProps = {
      color: 'rgba(255,205,25,1)',
      radius: 100,
      size: 500
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
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
      // Adjust pattern to fill parent
      super.fillParent(this.props.stretch);
    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }

}
Thing.addClass(PatternStripes);

module.exports = PatternStripes;

},{"../Thing/Thing.js":27}],19:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class PatternTileMarble extends Thing {
  init (props) {
    var defaultProps = {
      size: 500
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
    this.type = 'PatternTileMarble';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
  }

  render () {
    if (this.parent) {
      super.render();

      var patternW = 3630;
      var patternH = 3000;
      var tileW = 500;
      var tileH = 500;
      var numTiles = (parseInt(patternW/tileW) + 1) * (parseInt(patternH/tileH) + 1);

      // var BG = Thing.Box.make({
      //   backgroundImage: 'url(img/concrete_1.jpg)',
      //   position: 'absolute',
      //   w: patternW,
      //   h: patternH
      // });

      this.css({backgroundImage: 'url(img/concrete_1.jpg)'});

      for (var i=0; i < numTiles; i++) {
        var randX = Thing.Rand.randInt(0,2000) * -1;  // less than width of background Texture
        var randY = Thing.Rand.randInt(0,1000) * -1;  // less than height of background Texture
        var tile = Thing.make({
          border: '1px solid rgba(0, 0, 0, 0.15)',
          boxShadow: 'rgb(255, 255, 255) 12px 12px 25px inset, rgb(180, 180, 180) -12px -12px 25px inset, rgba(33, 33, 33, 0.4) 6px 6px 8px',
          // backgroundImage: 'radial-gradient(ellipse farthest-corner at 140px 20px , rgba(250, 250, 250, 0.9) 30%, rgba(238, 238, 238, 0.8) 85%)',
          backgroundImage: 'url(img/white-marble-texture-lite.jpg)',
          backgroundPosition: randX+'px '+ randY+'px',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          float: 'left',
          w: tileW,
          h: tileH,
          margin: '5px'
        });
        this.$element.append(tile.$element);
        // BG.add(tile);
      }

    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }

}
Thing.addClass(PatternTileMarble);

module.exports = PatternTileMarble;

},{"../Thing/Thing.js":27}],20:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
// var CSS = require('./Pattern.css');

function oneLine(s) {
  return (s.replace(/\r?\n|\r|\t/gm, '')).trim();
}


class Pattern extends Thing {
  init (props) {
    var defaultProps = {
      pattern: 'GraphPaper',
      stretch: true
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
    this.type = 'Pattern';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.addClass(props.pattern);

    // Add the Patterns css (will add only once)
    // Thing.addCSSString(CSS, 'Pattern');
  }

  render () {
    super.render();

    // Adjust pattern to fill parent with a square aspect ratio
    super.fillParent(this.props.stretch);

    if (this.props.pattern && patternTemplates[this.props.pattern]) {
      var patternTemplate = patternTemplates[this.props.pattern];
      this.css( patternTemplate(this.props) );
    }
    else if (this.props.size) { // Tweak the size
      this.css({backgroundSize: this.props.size + '%'});
    }

    return this;
  }

  static makeGridPatternCSS(props) {
    props = props || {};

    let size = props.size || 50;
    let color = props.color || 'rgba(255,255,255,.5)';
    let bgColor = props.backgroundColor || 'transparent';
    let lineWidth = props.lineWidth || 2;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px, ${size}px ${size}px`,
      backgroundPosition: `-${lineWidth}px -${lineWidth}px, -${lineWidth}px -${lineWidth}px`,
      backgroundImage: oneLine(`linear-gradient(${color} ${lineWidth}px, transparent ${lineWidth}px),
          linear-gradient(90deg, ${color} ${lineWidth}px, transparent ${lineWidth}px)`),
    };

    return patternCSS;
  }

  static makeGraphPaperPatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let divSize = size / 5;
    let color = props.color || 'rgba(255,255,255,.3)';
    let bgColor = props.backgroundColor || '#003';
    let lineWidth = props.lineWidth || 4;
    let lWidth = lineWidth / 2;
    let bgImg = `
        linear-gradient(${color} ${lineWidth}px, transparent ${lineWidth}px),
        linear-gradient(90deg, ${color} ${lineWidth}px, transparent ${lineWidth}px),
        linear-gradient(${color} ${lWidth}px, transparent ${lWidth}px),
        linear-gradient(90deg, ${color} ${lWidth}px, transparent ${lWidth}px)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${divSize}px ${divSize}px, ${divSize}px ${divSize}px`,
      backgroundPosition: `-${lineWidth}px -${lineWidth}px, -${lineWidth}px -${lineWidth}px, -${lWidth}px -${lWidth}px, -${lWidth}px -${lWidth}px`,
      backgroundImage: oneLine(bgImg),
    };

    return patternCSS;
  }

  static makeDiagonalStripePatternCSS(props) {
    props = props || {};

    let size = props.size || 50;
    let color = props.color || '#0e0030';
    let bgColor = props.backgroundColor || 'transparent';
    let bgImg = `linear-gradient(45deg, ${color} 25%, transparent 25.15%, transparent 50%, ${color} 50.15%, ${color} 75%, transparent 75.15%, transparent)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px`,
      backgroundImage: oneLine(bgImg),
    };

    return patternCSS;
  }

  static makeVerticalStripePatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let color = props.color || 'rgba(255,205,25,1)';
    let bgColor = props.backgroundColor || 'transparent';
    let bgImg = `linear-gradient(90deg, transparent 50%, ${color} 50%)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px`,
      backgroundImage: bgImg,
    };

    return patternCSS;
  }

  static makePolkaDotPatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let mid = size / 2;
    let radius = props.radius || (size/5);
    let color = props.color || '#fffdd7';
    let bgColor = props.backgroundColor || 'transparent';
    let bgImg =
      `radial-gradient(${color} ${radius}px, transparent ${radius+1}px),
      radial-gradient(${color} ${radius}px, transparent ${radius+1}px)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px`,
      backgroundPosition: `0 0, ${mid}px ${mid}px`,
      backgroundImage: oneLine(bgImg),
    };

    return patternCSS;
  }

  static makeSofaPatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let mid = size / 2;
    let bgColor = props.backgroundColor || '#300';
    let bg =
      `radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,
      radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) ${mid}px ${mid}px,
      radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) ${mid}px 0,
      radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 ${mid}px,
      radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) ${mid}px 0,
      radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) ${size}px ${mid}px,
      radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,
      radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) ${mid}px ${mid}px,
      linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,
      linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0`;
    let patternCSS = {
      background: oneLine(bg),  // This has to come before backgroundSize or it doesn't show(?!)
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px`,
    };

    return patternCSS;
  }

  static makePlaidRedPatternCSS(props) {
    props = props || {};

    let size = props.size || 1000;
    // thin blue line
    let tiny1a = size * 0.200;
    let tiny1b = size * 0.212;
    // thin blue line
    let tiny2a = size * 0.252;
    let tiny2b = size * 0.264;
    // upper wide greenish band
    let wide1a = size * 0.464;
    let wide1b = size * 0.664;
    // middle greenish band
    let wide2a = size * 0.676;
    let wide2b = size * 0.716;
    // upper wide greenish band
    let wide3a = size * 0.728;
    let wide3b = size * 0.928;
    // background hatching
    let hatchA = size * 0.008;
    let hatchB = size * 0.012;
    let hatchC = size * 0.020;

    let bgColor = props.backgroundColor || 'hsl(0, 86%, 34%)';
    let bgImg =
      `repeating-linear-gradient(
        transparent, transparent ${tiny1a}px,
        rgba(40,0,160,.4) ${tiny1a}px, rgba(40,0,160,.4) ${tiny1b}px,
        transparent ${tiny1b}px, transparent ${tiny2a}px,
        rgba(40,0,160,.4) ${tiny2a}px, rgba(40,0,160,.4) ${tiny2b}px,
        transparent ${tiny2b}px, transparent ${wide1a}px,
        rgba(0,60,0,.5) ${wide1a}px, rgba(0,60,0,.5) ${wide1b}px,
        rgba(255,255,200,.3) ${wide1b}px, rgba(255,255,200,.3) ${wide2a}px,
        rgba(0,60,0,.5) ${wide2a}px, rgba(0,60,0,.5) ${wide2b}px,
        rgba(255,255,200,.3) ${wide2b}px, rgba(255,255,200,.3) ${wide3a}px,
        rgba(0,60,0,.5) ${wide3a}px, rgba(0,60,0,.5) ${wide3b}px, transparent ${wide3b}px),
      repeating-linear-gradient(270deg,
        transparent, transparent ${tiny1a}px,
        rgba(40,0,160,.4) ${tiny1a}px, rgba(40,0,160,.4) ${tiny1b}px,
        transparent ${tiny1b}px, transparent ${tiny2a}px,
        rgba(40,0,160,.4) ${tiny2a}px, rgba(40,0,160,.4) ${tiny2b}px,
        transparent ${tiny2b}px, transparent ${wide1a}px,
        rgba(0,60,0,.5) ${wide1a}px, rgba(0,60,0,.5) ${wide1b}px,
        rgba(255,255,200,.3) ${wide1b}px, rgba(255,255,200,.3) ${wide2a}px,
        rgba(0,60,0,.5) ${wide2a}px, rgba(0,60,0,.5) ${wide2b}px,
        rgba(255,255,200,.3) ${wide2b}px, rgba(255,255,200,.3) ${wide3a}px,
        rgba(0,60,0,.5) ${wide3a}px, rgba(0,60,0,.5) ${wide3b}px, transparent ${wide3b}px),
      repeating-linear-gradient(125deg,
        transparent, transparent ${hatchA}px,
        rgba(0,0,0,.2) ${hatchA}px, rgba(0,0,0,.2) ${hatchB}px,
        transparent ${hatchB}px, transparent ${hatchC}px, rgba(0,0,0,.2) ${hatchC}px)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundImage: oneLine(bgImg),
    };

    return patternCSS;
  }

  static makePatternFromCSS(css) {
    return this.make({pattern: 'none', size: null, stretch: true}).css(css);
  }
}

var patternTemplates = {
  Grid: Pattern.makeGridPatternCSS,
  GraphPaper: Pattern.makeGraphPaperPatternCSS,
  DiagonalStripes: Pattern.makeDiagonalStripePatternCSS,
  DiagonalStripesViolet: Pattern.makeDiagonalStripePatternCSS,
  VerticalStripes: Pattern.makeVerticalStripePatternCSS,
  Stripes: Pattern.makeVerticalStripePatternCSS,
  PatternStripes: Pattern.makeVerticalStripePatternCSS,
  PolkaDots: Pattern.makePolkaDotPatternCSS,
  PatternPolkaDots: Pattern.makePolkaDotPatternCSS,
  Sofa: Pattern.makeSofaPatternCSS,
  PlaidRed: Pattern.makePlaidRedPatternCSS,
};

Thing.addClass(Pattern);

module.exports = Pattern;

},{"../Thing/Thing.js":27}],21:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Points {
	static getMaxY(points) {
		var p = points && points.reduce((accumulator, currentValue) => accumulator.y > currentValue.y ? accumulator : currentValue);
		return (p && p.y) || 0;
	}

	static getMinY(points) {
		var p = points && points.reduce((accumulator, currentValue) => accumulator.y < currentValue.y ? accumulator : currentValue);
		return (p && p.y) || 100;
	}

	static sortY (points) {
		var clone = points.map(function (p) {
			return {
				x: p.x,
				y: p.y,
				_targetThing: p, // keep a reference to the source thing
			};
		});
		clone.sort(function(a,b) {
			return a.y - b.y;
		});
		return clone;
	}

	static makePointsAtX (points, x, offset) {
		var xpoints = points.map(function (p) {
			return {
				x: x !== undefined ? x : (p.x + offset),
				y: p.y,
				_targetThing: p._targetThing || p, // keep a reference to the source thing
			};
		});
		return xpoints;
	}

	static jiggle (points, maxDistance = 0) {
		return points.map(function (p) {
			var jiggle = Thing.Rand.randFloat(-1, 1);
			return {
				x: p.x + (jiggle * maxDistance),
				y: p.y + (jiggle * maxDistance),
				_targetThing: p._targetThing, // keep a reference to the source thing
			};
		});
	}

	static stretchY (points, amount = 1, minY = 0, maxY = 100) {
		var origHeight = maxY - minY;
		var newHeight = origHeight * amount;
		var newStartY = minY - ((newHeight - origHeight) / 2);
		var newPoints = points.map(function (p) {
			var origYposAsPercent = (p.y - minY) / origHeight;
			return {
				x: p.x,
				y: newStartY + (origYposAsPercent * newHeight),
				_targetThing: p._targetThing, // keep a reference to the source thing
			};
		});
		return newPoints;
	}

	static makeAdjacentPoints(props = {points:[], minY: 0, maxY: 100, offset: -100, jiggle: 0}) {
		var x = props.x;
		var offset = props.offset || -100;
		var minY = Points.getMinY(props.points);
		var maxY = Points.getMaxY(props.points);

		var aPoints = Points.makePointsAtX(props.points, x, offset);
		aPoints = Points.jiggle(aPoints, props.jiggle);
		aPoints = Points.stretchY(aPoints, props.stretch, minY, maxY);

		return aPoints;
	}
}
Thing.addClass(Points);

module.exports = Points;

},{"../Thing/Thing.js":27}],22:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":27,"../Timer/Timer.js":28}],23:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var MersenneTwister = require('./mersenne-twister.js');

var MTRand = null;
var seed = null;
var PI = 3.14159265359;
var HALFPI = PI/2.0;

class Rand {
	static init(s) {
		seed = (s !== undefined) ? s : (new Date()).getTime();
		MTRand = new MersenneTwister(seed);
	}

	static getSeed() {
		return seed;
	}

	static random() {
		MTRand || Rand.init();
		return MTRand.random();
	}

	static randItem(arr) {
		if (arr && arr.length > 0) {
			return arr[ Rand.randInt(0, arr.length-1) ];
		}
	}

	static randItems(arr, n=3) {
		var items = [];
		if (arr) {
			for (var i=0; i < n; i++) {
			  items.push(Rand.randItem(arr));
			}
		}
		return items;
	}

	// Returns a random integer between min (included) and max (included)
	// Using Math.round() will give you a non-uniform distribution!
	static randInt(min, max) {
		min = Math.ceil(min||0);
		max = Math.floor(max||1);
		return Math.floor(Rand.random() * (max - min + 1)) + min;
	}

	// Return a random float between min and max (0 and .99999 by default)
	static randFloat(min=0.0, max=0.99999) {
	    return min + (Rand.random() * (max - min));
	}

	// return true some percentage of the time (defaults to 50%)
	static randBoolean(threshold) {
		return Rand.randInt(1,100) < (threshold===undefined ? 50 : threshold);
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

  static randRGBstr(alpha) {
		var rgb = Rand.randRGB();
    return 'rgba(' +rgb[0]+ ',' +rgb[1]+ ',' +rgb[2]+ ', ' + (alpha || 0.9) + ')';
  }
}
Thing.addClass(Rand);

module.exports = Rand;

},{"../Thing/Thing.js":27,"./mersenne-twister.js":24}],24:[function(require,module,exports){

/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.

  If you want to use this as a substitute for Math.random(), use the random()
  method like so:

  var m = new MersenneTwister();
  var randomNumber = m.random();

  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/

/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

var MersenneTwister = function(seed) {
  if (seed === undefined) {
    seed = new Date().getTime();
  }
  /* Period parameters */
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;   /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

  this.init_genrand(seed);
};

/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(seed) {
  this.mt[0] = seed >>> 0;
  for (this.mti=1; this.mti<this.N; this.mti++) {
      var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
      this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
  }
};

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
  var i, j, k;
  this.init_genrand(19650218);
  i=1; j=0;
  k = (this.N>key_length ? this.N : key_length);
  for (; k; k--) {
    let s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++; j++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
    if (j>=key_length) { j=0; }
  }
  for (k=this.N-1; k; k--) {
    let s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
  }

  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
};

/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) { /* generate N words at one time */
    var kk;

    if (this.mti === this.N+1) {  /* if init_genrand() has not been called, */
      this.init_genrand(5489); /* a default initial seed is used */
    }
    for (kk=0;kk<this.N-this.M;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (;kk<this.N-1;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
    this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
};

/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
  return (this.genrand_int32()>>>1);
};

/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
  return this.genrand_int32()*(1.0/4294967295.0);
  /* divided by 2^32-1 */
};

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
  return this.genrand_int32()*(1.0/4294967296.0);
  /* divided by 2^32 */
};

/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
  /* divided by 2^32 */
};

/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() {
  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
  return(a*67108864.0+b)*(1.0/9007199254740992.0);
};

/* These real versions are due to Isaku Wada, 2002/01/09 added */

module.exports = MersenneTwister;

},{}],25:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var Box = require('../Box/Box.js');

/**
 *  w, h, d, showOuter

 	Parent element must have perspective set to some pixel value or room will be flat.

	var r = Thing.Room.make({
		x:1000, y:-500,
		w:1000, h:3625,
		d:3000,
		showOuter: false
	});
 */
class Room extends Box {
	init (props) {
		var defaultProps = {
			w: 1500,
			h: 1000,
			d:  800,
			transformStyle: 'preserve-3d',
			showOuter: false
		};
		props = $.extend({}, defaultProps, props);
		props.overflow = undefined;
		this.w = props.w;
		this.h = props.h;
		this.d = props.d;
		this.walls = {};

		super.init(props);

		this.type = 'Room';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.makeRoom(this.$element);
	}

	makeRoom() {
		var walls = [];
		var halfHeight = this.h/2;
		var halfWidth = this.w/2;
		var halfDepth = this.d/2;

		// this box is the outer wrapper div around all the walls - with its own perspective
		// NOTE: do not put "overflow: hidden" on this element, it will bork Z axis layering
		var room = this;  //Box.make({
		// 	width: '100%',
		// 	height: '100%',
		// 	position: 'absolute',
		// 	transformStyle: 'preserve-3d'
		// });

		// Inner facing walls
		// walls.push( this.makeWall('front', {
		// 	background: 'rgba(255, 255, 255, 1)',
		// 	width: this.w + 'px',
		// 	height: this.h + 'px',
		// 	transform: 'rotateX( 180deg ) translateZ( ' + (halfDepth) + 'px )'
		// }) );
		walls.push( this.makeWall('back', {
			backgroundColor: 'rgba(0, 0, 0, 1)',
			width: this.w + 'px',
			height: this.h + 'px',
			transform: 'translateZ( ' + (-halfDepth * 0.997) + 'px )'    // push back slightly less than full amount (0.997) or we get a slight gap at corners
		}) );
		walls.push( this.makeWall('right', {
			backgroundColor: 'rgba(255, 0, 55, 1)',
			width: this.d + 'px',
			height: this.h + 'px',
			transform: 'rotateY( -90deg ) translateZ( ' + (-(halfWidth + (halfWidth-halfDepth))) + 'px )'
		}) );
		walls.push( this.makeWall('left', {
			backgroundColor: 'rgba(255, 255, 0, 1)',
			width: this.d + 'px',
			height: this.h + 'px',
			transform: 'rotateY( 90deg ) translateZ( ' + (-halfDepth) + 'px )'
		}) );
		walls.push( this.makeWall('top', {
			backgroundColor: 'rgba(0, 55, 255, 1)',
			width: this.w + 'px',
			height: this.d + 'px',
			transform: 'rotateX( -90deg ) translateZ( ' + (-(halfHeight - (halfHeight-halfDepth)) * 0.997) + 'px )'
		}) );
		walls.push( this.makeWall('bottom', {
			backgroundColor: 'rgba(0, 255, 0, 1)',
			width: this.w + 'px',
			height: this.d + 'px',
			transform: 'rotateX( 90deg ) translateZ( ' + (-(halfHeight + (halfHeight-halfDepth)) * 0.997) + 'px )'
		}) );

		// Outer facing walls
		if (this.props.showOuter) {
			walls.push( this.makeWall('outfront', {
				backgroundColor: 'rgba(255, 255, 255, 0)',
				width: this.w + 'px',
				height: this.h + 'px',
				transform: 'translateZ( ' + (halfDepth) + 'px )'
			}) );
			walls.push( this.makeWall('outback', {
				backgroundColor: 'rgba(0, 0, 0, 1)',
				width: this.w + 'px',
				height: this.h + 'px',
				transform: 'rotateX( -180deg ) translateZ( ' + halfDepth + 'px )'
			}) );
			walls.push( this.makeWall('outright', {
				backgroundColor: 'rgba(100, 100, 100, 1)',
				width: this.d + 'px',
				height: this.h + 'px',
				transform: 'rotateY( 90deg ) translateZ( ' + ((halfWidth + (halfWidth-halfDepth))) + 'px )'
			}) );
			walls.push( this.makeWall('outleft', {
				backgroundColor: 'rgba(100, 100, 100, 1)',
				width: this.d + 'px',
				height: this.h + 'px',
				transform: 'rotateY( -90deg ) translateZ( ' + (halfWidth - (halfWidth-halfDepth)) + 'px )'
			}) );
			walls.push( this.makeWall('outtop', {
				backgroundColor: 'rgba(100, 100, 200, 1)',
				width: this.w + 'px',
				height: this.d + 'px',
				transform: 'rotateX( 90deg ) translateZ( ' + halfDepth + 'px )'
			}) );
			walls.push( this.makeWall('outbottom', {
				backgroundColor: 'rgba(100, 200, 100, 1)',
				width: this.w + 'px',
				height: this.d + 'px',
				transform: 'rotateX( -90deg ) translateZ( ' + (halfHeight + (halfHeight-halfDepth)) + 'px )'
			}) );
		}

		// copy walls array to object
		for (var i=0; i < walls.length; i++) {
			this.walls[ walls[i].which ] = walls[i];
			this[walls[i].which] = walls[i];
		}

		room.add(walls);
		// this.add(room);
		this.wallsA = walls;
		// this.room = room;
	}

	makeWall(which, cssVals) {
		var defaultCSS = {
			display: 'block',
			position: 'absolute',
			backfaceVisibility: 'hidden',
			overflow: 'hidden'
		};
		var wall = Thing.Box.make($.extend({}, defaultCSS, cssVals));
		wall.$element.addClass('wall');
		wall.$element.addClass(which);
		wall.which = which;
		return wall;
	}
}
Thing.addClass(Room);

module.exports = Room;

},{"../Box/Box.js":5,"../Thing/Thing.js":27}],26:[function(require,module,exports){
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
        this.setDefaultProps(props);
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

},{"../Thing/Thing.js":27}],27:[function(require,module,exports){
var elementCounter = 0;

class Thing {
  constructor(props) {
    this.init(props);
  }

  init (props = {}) {
    this.setDefaultProps(props);
    this.type = 'Thing';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.addMask(props.mask);  // make this part of convertToCSS()
  }

  // Set essential default properties on 'this' (x,y,z,w,h)
  // Additional properties in the props object are assumed to be CSS
  setDefaultProps (props) {
    props = props || {};

    // default to absolute positioning
    props.position = props.position || 'absolute';

    // keep the props object on instance
    this.props = props;

    this.renderOnCenter = props.renderOnCenter || false;
    this.rotation = props.rotate || null;
    this.scaleFactor = props.scale || 1;

    // position is the given x,y,z or 0,0,0 (this becomes CSS translate3d())
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.z = props.z || 0;

    // dimensions are the given w,h or undefined (this becomes CSS width/height)
    this.w = props.w;
    this.h = props.h;

    this.$element = null;
    this.parent = null;
  }

  render () {
    var parentElement = (this.parent && this.parent.$element) || $(document.body);
    parentElement.append(this.$element);
    this.$element.css(Thing.convertToCSS(this.props));
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

  // get position of element relative to page
  // only works after element is rendered on page
  getPosition () {
    var xy = this.$element.offset();
    var z = this.$element.css('z-index');
    z = z ? parseInt(z) : undefined;
    return [xy.left, xy.top, z];
  }

  getPos () {
    let x = this.x;
    let y = this.y;
    let z = this.z;
    if (this.renderOnCenter) {
      x -= (this.w || 0)/2;
      y -= (this.h || 0)/2;
    }
    return {x, y, z};
  }

  // Return the element's CSS transform matrix as array of 6 or 16 values.
  // 6 values for a 2D matrix (no rotation or only rotated around Z axis),
  // 16 values for a 3D matrix.
  getCSSTransform () {
    var mStr = this.$element.css('transform').match(/(-?[\d\.]+)[,)]/g);
    if (!mStr) {
      return null;
    }

    var mVal = [];
    for (var i=0; i < mStr.length; i++) {
      mVal[i] = parseFloat(mStr[i]);
    }
    return mVal;
  }

  // return Z axis rotation from 6x6 matrix
  // todo: 3d matrix http://nghiaho.com/?page_id=846
  // https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  getRotation () {
    var r = this.rotation || {x:0, y:0, z:0};
    return {
      x: r.x || 0,
      y: r.y || 0,
      z: r.z || 0
    };
  }

  getTranslation () {
    return {x: this.x, y: this.y, z: this.z};
  }

  // Increment the current rotation by the given degrees.
  // Expecting 'axes' to be {x: 90, y: 0, z: 45}
  // Axes are in the order they will be applied, and can be just one e.g.:
  // {z:180, y:90, x:45}  or  {y:45, x:90}   or   {z: 180}
  rotate (axes) {
    if (axes) {
      if (typeof axes !== 'object') {
        axes = {x:0, y:0, z:axes};    // assuming axes is a number here
      }
      this.rotation = this.rotation || {x:0, y:0, z:0};
      axes.x && (this.rotation.x += axes.x);
      axes.y && (this.rotation.y += axes.y);
      axes.z && (this.rotation.z += axes.z);
      this.transform();
    }
    return this;
  }

  rotateTo (axes) {
    if (axes) {
      this.rotation = {x:0, y:0, z:0};  // reset rotation
      this.rotate(axes);
      this.transform();
    }
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

  translate (x, y, z) {
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    this.transform();
    return this;
  }

  translateTo (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.transform();
    return this;
  }

  transform () {
    this.css({
      transform: Thing.makeTransformCSS(this.rotation, this.scaleFactor, this.x, this.y, this.z, this.renderOnCenter, this.w, this.h)
    });
    return this;
  }

  css (props) {
    // add new css properties to this.props object
    this.props = $.extend(this.props, props);
    // set css properties on the html element
    this.$element.css(props);
    return this;
  }

  html () {
    return '<div></div>';
  }

  // Size element to fill parent with a square aspect ratio
  fillParent (stretch=false) {
    if (this.parent) {
      let parentW = this.parent.$element.width();
      let parentH = this.parent.$element.height();
      let parentElementSize = Math.max(parentW, parentH);
      this.css({
        position: 'absolute',
        left: '0px', top: '0px',
        width: stretch ? parentW : parentElementSize,
        height: stretch ? parentH : parentElementSize
      });
    }
    return this;
  }

  // Mask the contents of this div.
  // Defaults to a single mask image covering entire element, no repeat.
  //
  // Examples:
  // addMask('url(img/my_mask_image.png)')
  // addMask('radial-gradient(white 25%, transparent 26%)')
  // addMask({image: 'url(img/my_mask_image.png'), repeat: 'repeat', size: '10% 10%'})
  //
  addMask (maskProps) {
    if (maskProps) {
      if (typeof maskProps === 'string') {
        maskProps = {image: maskProps};
      }
      var maskCSSprops = {
        WebkitMaskImage: maskProps.image,
        WebkitMaskRepeat: maskProps.repeat || 'no-repeat',
        WebkitMaskSize: maskProps.size || '100% 100%',
        WebkitMaskPosition: maskProps.position || '50% 50%',
      };
      this.css(maskCSSprops);
    }
    return this;
  }

  static make (props) {
    var cls = this;
    var instance = new cls(props);
    return instance;
  }

  static addClass (cls) {
    Thing.classes = Thing.classes || {};
    Thing[cls.name] = Thing.classes[cls.name] = cls;
  }

  //---------------------------------------------------------
  // CSS management functions

  // Return the props converted to legit CSS properties.
  // Most props are already css properties, and will be returned unchanged.
  // Shorthand properties (x,y,z,w,h,rotate,scale,size) will be converted to
  // css properties and removed from the props object.
  static convertToCSS (props) {
    var styles = $.extend({}, props);
    styles.width = props.width || (props.w && (props.w + "px")),
    styles.height = props.height || (props.h && (props.h + "px")),
    styles.transform = props.transform || (Thing.makeTransformCSS(props.rotate, props.scale, props.x, props.y, props.z, props.renderOnCenter, props.w, props.h)),

    // These are not true CSS properties so remove them
    delete styles.id;
    delete styles.rotate;
    delete styles.scale;
    delete styles.size;
    delete styles.x;
    delete styles.y;
    delete styles.z;
    delete styles.w;
    delete styles.h;
    delete styles.r;
    delete styles.mask;
    delete styles.renderOnCenter;
    delete styles.onImgLoaded;
    delete styles.onImgError;

    return styles;
  }

  static makeTransformCSS (rotate, scale, tx, ty, tz, renderOnCenter, w, h) {
    var transform = '';
    transform += (tx || ty || tz) ? (Thing.makeTranslateCSS(tx, ty, tz, renderOnCenter, w, h) + ' ') : '';
    transform += rotate ? (Thing.makeRotationCSS(rotate) ) : '';
    transform += scale ? (Thing.makeScaleCSS(scale) + ' ') : '';
    return transform;
  }

  static makeRotationCSS (angle) {
    var css = '';
    if (angle !== undefined && angle !== null) {
      if (typeof angle === 'object') {
        // turn object {x:10, y:20, z:30} into a css transform command
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
    return (scale === undefined || scale === null) ? '' : 'scale('+scale+') ';
  }

  // NOTE: translation coords are relative to the element's position in the document flow.
  // They are not the same as setting left/top values, which are absolute coordinates
  // relative to the parent element.
  static makeTranslateCSS (x, y, z, renderOnCenter, w, h) {
    x = x || '0';
    y = y || '0';
    z = z || '0';
    if (renderOnCenter) {
      x -= w/2;
      y -= h/2;
    }
    return 'translate3d('+ x + 'px, ' + y + 'px, ' + z +'px)';
  }

  static makeElement (html, props, type) {
    var $element = $(html)
      .css(Thing.convertToCSS(props))
      .addClass(type || 'random')
      .attr('id', props.id || (type + (++elementCounter)));
    return $element;
  }

  static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // add font family to page - will load only once
  static addFontURL(fontFamilyURL, id) {
    if (fontFamilyURL && id && $('head').find('#' + id).length === 0) {
      var link = '<link rel="stylesheet" href="' + fontFamilyURL + '" id="' + id + '">';
      $('head').append(link);
    }
  }

  static addCSSFile(fileName, id='Thing') {
    if (fileName) {
      var link = '<link rel="stylesheet" type="text/css" href="' + fileName + '" id="' + id + '">';
      $('head').find('#' + id).remove();
      $('head').append(link);
    }
  }

  static addCSSString(cssString, id='Thing') {
    if (cssString) {
      var styleID = id + '-styles';
      var styleEl = $('<style type="text/css">' +cssString+ '</style>')
        .attr('id', styleID);
      $('head #' + styleID).remove(); // clear the existing style if any
      $('head').append(styleEl);
    }
  }

  //---------------------------------------------------------

  /*
  function bindargs(func, props) {
    return function (moreProps) {
      let p = $.extend({}, props, moreProps);
      return func.call({}, p);
    }
  }

  function instantiator(cls, props) {
    return function (moreProps) {
      let p = $.extend({}, props, moreProps);
      return cls.make.call(cls, p);
    }
  }
  */

  static msg(s) {
    window.console.log(s);
  }
}
Thing.addClass(Thing);

module.exports = Thing;

},{}],28:[function(require,module,exports){
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

},{"../Action/Action.js":1,"../Thing/Thing.js":27}],29:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Triangle extends Thing {
	init (props) {
		var defaultProps = {
			size: 10,
			color: '#BADA55'
		};
		props = $.extend(props, defaultProps);
		this.setDefaultProps(props);
		this.type = 'Triangle';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.makeTriangle(this.props.size, this.props.color);  // have to make element before calling this
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

},{"../Thing/Thing.js":27}],30:[function(require,module,exports){
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
require('./ImgSVG/ImgSVG.js');
require('./Pattern/Pattern.js');
require('./PatternPolkaDots/PatternPolkaDots.js');
require('./PatternStripes/PatternStripes.js');
require('./PatternSofa/PatternSofa.js');
require('./PatternTileMarble/PatternTileMarble.js');
require('./BGImg/BGImg.js');
require('./TextPane/TextPane.js');
require('./Circle/Circle.js');
require('./Triangle/Triangle.js');
require('./Room/Room.js');
require('./Page/Page.js');
require('./CompositeImg/CompositeImg.js');
require('./Points/Points.js');

window.Thing = Thing;

},{"./Action/Action.js":1,"./Arrow/Arrow.js":3,"./BGImg/BGImg.js":4,"./Box/Box.js":5,"./Circle/Circle.js":6,"./CompositeImg/CompositeImg.js":7,"./DemoBox/DemoBox.js":8,"./Do/Do.js":9,"./Img/Img.js":11,"./ImgSVG/ImgSVG.js":10,"./Label/Label.js":12,"./Line/Line.js":13,"./Page/Page.js":14,"./Pattern/Pattern.js":20,"./PatternPolkaDots/PatternPolkaDots.js":15,"./PatternSofa/PatternSofa.js":17,"./PatternStripes/PatternStripes.js":18,"./PatternTileMarble/PatternTileMarble.js":19,"./Points/Points.js":21,"./Pulsar/Pulsar.js":22,"./Rand/Rand.js":23,"./Room/Room.js":25,"./TextPane/TextPane.js":26,"./Thing/Thing.js":27,"./Timer/Timer.js":28,"./Triangle/Triangle.js":29}]},{},[30])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9Db21wb3NpdGVJbWcvQ29tcG9zaXRlSW1nLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWdTVkcvSW1nU1ZHLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYWdlL1BhZ2UuanMiLCJzcmMvbGliL1BhdHRlcm5Qb2xrYURvdHMvUGF0dGVyblBvbGthRG90cy5qcyIsInNyYy9saWIvUGF0dGVyblNvZmEvUGF0dGVyblNvZmEuY3NzIiwic3JjL2xpYi9QYXR0ZXJuU29mYS9QYXR0ZXJuU29mYS5qcyIsInNyYy9saWIvUGF0dGVyblN0cmlwZXMvUGF0dGVyblN0cmlwZXMuanMiLCJzcmMvbGliL1BhdHRlcm5UaWxlTWFyYmxlL1BhdHRlcm5UaWxlTWFyYmxlLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1BvaW50cy9Qb2ludHMuanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUmFuZC9tZXJzZW5uZS10d2lzdGVyLmpzIiwic3JjL2xpYi9Sb29tL1Jvb20uanMiLCJzcmMvbGliL1RleHRQYW5lL1RleHRQYW5lLmpzIiwic3JjL2xpYi9UaGluZy9UaGluZy5qcyIsInNyYy9saWIvVGltZXIvVGltZXIuanMiLCJzcmMvbGliL1RyaWFuZ2xlL1RyaWFuZ2xlLmpzIiwic3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb24ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxuXHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMucHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uZ28oKScpO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5zdG9wKCknKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBtYWtlICgpIHtcclxuXHQgIHZhciBjbHMgPSB0aGlzO1xyXG5cdCAgdmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xyXG5cdCAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcclxuXHQgIHJldHVybiBpbnN0YW5jZTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQWN0aW9uKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLyogcmVxdWlyZWQgZm9yIGFycm93ICovXFxyXFxuLmFycm93LWhlYWQge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXHJcXG4gIHdpZHRoOiAwOyBcXHJcXG4gIGhlaWdodDogMDsgXFxyXFxuICBib3JkZXItdG9wOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWJvdHRvbTogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1sZWZ0OiAzMHB4IHNvbGlkIGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uYXJyb3ctYm9keSB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxuICB3aWR0aDogNDBweDtcXHJcXG4gIGhlaWdodDogMjBweDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxyXFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDA7XFxyXFxuICBib3JkZXItcmlnaHQ6IDA7XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy13cmFwcGVyIHtcXHJcXG4gIHdpZHRoOiA3MHB4OyAgIC8qIGFycm93LWJvZHkgd2lkdGggKyBhcnJvdy1oZWFkIGJvcmRlciB3aWR0aCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uQXJyb3cge1xcclxcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxyXFxufVxcclxcblxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIENTUyA9IHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XHJcblxyXG5jbGFzcyBBcnJvdyBleHRlbmRzIFRoaW5nIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0Fycm93JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy5zZXRDb2xvcih0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBhcnJvdyBiZWZvcmUgY2FsbGluZyB0aGlzXHJcblx0XHRUaGluZy5hZGRDU1NTdHJpbmcoQ1NTLCAnQXJyb3cnKTtcclxuXHR9XHJcblxyXG5cdHNldENvbG9yIChjKSB7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1oZWFkJykuY3NzKHtib3JkZXJMZWZ0Q29sb3I6Y30pO1xyXG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctYm9keScpLmNzcyh7YmFja2dyb3VuZENvbG9yOmN9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0aHRtbCAoKSB7XHJcblx0XHRyZXR1cm4gXCI8ZGl2PjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PjwvZGl2PlwiO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhBcnJvdyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFycm93O1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQkdJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHVybDogJycsICAgLy8gZnVsbHkgZm9ybWVkIGltYWdlIGRlZmluaXRpb24gZS5nLiB1cmwoaW1nL2JsYWguanBnKSBvciBsaW5lYXItZ3JhZGllbnQoKSBldGMuXHJcbiAgICAgIHNyYzogJycsICAgLy8gaW1hZ2UgcGF0aCBlLmcuICdpbWcvYmxhaC5qcGcnLiBQYXNzIEVJVEhFUiB1cmwgT1Igc3JjIE5PVCBCT1RILlxyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgIGNlbnRlcjogdHJ1ZSxcclxuICAgICAgcmVwZWF0OiBmYWxzZSxcclxuICAgICAgc2l6ZTogJ2NvdmVyJyAgICAvLyBjb250YWlufGNvdmVyfDEwMCUgMTAwJVxyXG4gICAgfTtcclxuICAgIHByb3BzID0gdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdCR0ltZyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhCR0ltZy5tYWtlQkdJbWdDU1MocHJvcHMpKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlQkdJbWdDU1MgKHByb3BzKSB7XHJcbiAgICB2YXIgdXJsID0gcHJvcHMudXJsIHx8ICgndXJsKFwiJyArIHByb3BzLnNyYyArICdcIiknKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogdXJsLFxyXG4gICAgICBiYWNrZ3JvdW5kUmVwZWF0OiBwcm9wcy5yZXBlYXQgPyAncmVwZWF0JyA6ICduby1yZXBlYXQnLFxyXG4gICAgICBiYWNrZ3JvdW5kUG9zaXRpb246IHByb3BzLmNlbnRlciA/ICdjZW50ZXInIDogJzAgMCcsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBwcm9wcy5zaXplXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCR0ltZyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJHSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQm94IGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzID0ge30pIHtcclxuICBcdHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICBcdHRoaXMudHlwZSA9ICdCb3gnO1xyXG4gIFx0dGhpcy5pdGVtcyA9IFtdO1xyXG4gIFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy5hZGRNYXNrKHByb3BzLm1hc2spO1xyXG4gIH1cclxuXHJcbiAgYWRkICh0aGluZykge1xyXG4gICAgaWYgKHRoaW5nKSB7XHJcbiAgICAgIGlmICh0aGluZyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgdGhpbmcuZm9yRWFjaCh0aGlzLmFkZC5iaW5kKHRoaXMpKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLml0ZW1zLnB1c2godGhpbmcpO1xyXG4gICAgICAgIHRoaW5nLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSB0aGlzIGJveCAoZnJvbSB0aGUgZG9tIGFuZCB0aGUgaXRlbXMgbGlzdClcclxuICByZW1vdmUgKGl0ZW0pIHtcclxuICBcdGlmIChpdGVtKSB7XHJcbiAgXHRcdHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKTtcclxuICBcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuICBcdFx0ICAgIHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICBcdFx0XHRpdGVtLiRlbGVtZW50LnJlbW92ZSgpO1xyXG4gIFx0XHRcdGl0ZW0ucGFyZW50ID0gbnVsbDtcclxuICBcdFx0fVxyXG4gIFx0fVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBudW1FbGVtZW50cyAoKSB7XHJcbiAgXHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50Qm91bmRzICgpIHtcclxuICAgIHZhciBib3VuZHMgPSB7eDo5OTk5OTksIHk6OTk5OTk5LCBib3R0b206MCwgcmlnaHQ6MH07XHJcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPCAxKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3MgPSB0aGlzLml0ZW1zW2ldLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgIGJvdW5kcy54ID0gKHBvcy54IDwgYm91bmRzLngpID8gcG9zLnggOiBib3VuZHMueDtcclxuICAgICAgYm91bmRzLnkgPSAocG9zLnkgPCBib3VuZHMueSkgPyBwb3MueSA6IGJvdW5kcy55O1xyXG4gICAgICBib3VuZHMuYm90dG9tID0gKHBvcy5ib3R0b20gPiBib3VuZHMuYm90dG9tKSA/IHBvcy5ib3R0b20gOiBib3VuZHMuYm90dG9tO1xyXG4gICAgICBib3VuZHMucmlnaHQgPSAocG9zLnJpZ2h0ID4gYm91bmRzLnJpZ2h0KSA/IHBvcy5yaWdodCA6IGJvdW5kcy5yaWdodDtcclxuICAgIH1cclxuICAgIGJvdW5kcy53ID0gYm91bmRzLnJpZ2h0IC0gYm91bmRzLng7XHJcbiAgICBib3VuZHMuaCA9IGJvdW5kcy5ib3R0b20gLSBib3VuZHMueTtcclxuICAgIHJldHVybiBib3VuZHM7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gIFx0c3VwZXIucmVuZGVyKCk7XHJcbiAgXHRmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRcdHRoaXMuaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGVhY2ggKGZ1bmMpIHtcclxuICAgIGZ1bmMgJiYgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEJveCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJveDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIENpcmNsZSBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgdGV4dDogJycsXHJcbiAgICAgIGxlZnQ6IDAsXHJcbiAgICAgIHRvcDogMCxcclxuICAgICAgcjogMjUsXHJcbiAgICAgIGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBBcmlhbCwgc2Fucy1zZXJpZicsXHJcbiAgICAgIGZvbnRTaXplOiAnMjRweCcsXHJcbiAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcclxuICAgICAgY29sb3I6ICcjMGYwJyxcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzIyMicsXHJcbiAgICAgIGJvcmRlckNvbG9yOiAnI0JBREE1NScsXHJcbiAgICAgIGJvcmRlcldpZHRoOiA1XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0NpcmNsZSc7XHJcbiAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cclxuICAgIC8vIGFwcGx5IGNpcmNsZSBjc3NcclxuICAgIHZhciBvZmZzZXQgPSBwcm9wcy5yICsgcHJvcHMuYm9yZGVyV2lkdGg7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgJ2xlZnQnOiAnJyArIChwcm9wcy5sZWZ0LW9mZnNldCkgKyAncHgnLFxyXG4gICAgICAgICd0b3AnOiAnJyArIChwcm9wcy50b3Atb2Zmc2V0KSArICdweCcsXHJcbiAgICAgICAgJ3dpZHRoJzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxyXG4gICAgICAgICdoZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2xpbmVIZWlnaHQnOiAnJyArIHByb3BzLnIqMiArICdweCcsXHJcbiAgICAgICAgJ2JvcmRlcic6IHByb3BzLmJvcmRlcldpZHRoICsgJ3B4IHNvbGlkICcgKyBwcm9wcy5ib3JkZXJDb2xvcixcclxuICAgICAgICAnYm9yZGVyUmFkaXVzJzogJzEwMDAwcHgnLFxyXG4gICAgICAgICd0ZXh0QWxpZ24nOiAnY2VudGVyJyxcclxuICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB0aGlzLnNldFRleHQodGhpcy50ZXh0KTtcclxuICB9XHJcblxyXG4gIHNldFRleHQgKHR4dCkge1xyXG4gICAgdGhpcy50ZXh0ID0gdHh0O1xyXG4gICAgdGhpcy4kZWxlbWVudC5lbXB0eSgpLmFwcGVuZCh0eHQpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKENpcmNsZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENpcmNsZTtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbi8vIHZhciBibGVuZE1vZGVzID0gW1xyXG4vLyAgICdub3JtYWwnLFxyXG4vLyAgIC8vIGRhcmtlclxyXG4vLyAgICdkYXJrZW4nLFxyXG4vLyAgICdtdWx0aXBseScsXHJcbi8vICAgJ2NvbG9yLWJ1cm4nLFxyXG4vLyAgIC8vIGxpZ2h0ZXJcclxuLy8gICAnbGlnaHRlbicsXHJcbi8vICAgJ2NvbG9yLWRvZGdlJyxcclxuLy8gICAnc2NyZWVuJyxcclxuLy8gICAvLyBjb250cmFzdFxyXG4vLyAgICdvdmVybGF5JyxcclxuLy8gICAnaGFyZC1saWdodCcsXHJcbi8vICAgJ3NvZnQtbGlnaHQnLFxyXG4vLyAgIC8vIGludmVyc2lvblxyXG4vLyAgICdleGNsdXNpb24nLFxyXG4vLyAgICdkaWZmZXJlbmNlJyxcclxuLy8gICAvLyBjb21wb25lbnRzXHJcbi8vICAgJ2h1ZScsXHJcbi8vICAgJ3NhdHVyYXRpb24nLFxyXG4vLyAgICdjb2xvcicsXHJcbi8vICAgJ2x1bWlub3NpdHknLFxyXG4vLyBdO1xyXG5cclxuLy8ge1xyXG4vLyAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4vLyAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4vLyAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMTc0LCAxNzQpO1xyXG4vLyAgICAgbWFyZ2luOiAyMHB4O1xyXG4vLyAgICAgd2lkdGg6IDMwMHB4O1xyXG4vLyAgICAgaGVpZ2h0OiA2MDBweDtcclxuLy8gICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChpbWcvZmFjZXBhcnRzL3dhc2hpbmd0b25fZXllX2xlZnRfcm91bmQucG5nKSwgdXJsKGltZy9mYWNlcGFydHMvd2FzaGluZ3Rvbl9leWVfbGVmdF9yb3VuZC5wbmcpO1xyXG4vLyAgICAgYmFja2dyb3VuZC1zaXplOiAxMDAlIDUwJSwgMTEwJSA1MyU7XHJcbi8vICAgICBiYWNrZ3JvdW5kLWJsZW5kLW1vZGU6IGRhcmtlbiwgY29sb3ItYnVybjtcclxuLy8gICAgIGJhY2tncm91bmQtcG9zaXRpb246IDBweCAwcHgsIC0xM3B4IC0ycHg7XHJcbi8vICAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0LCBuby1yZXBlYXQ7XHJcbi8vIH1cclxuXHJcblxyXG5cclxuLy8gLy8gdmVyeSBoaWdoIGNvbnRyYXN0XHJcbi8vIHtcclxuLy8gICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuLy8gICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuLy8gICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxMjgsIDEyOCwgMTI4KTtcclxuLy8gICAgIG1hcmdpbjogMjBweDtcclxuLy8gICAgIHdpZHRoOiAzMDBweDtcclxuLy8gICAgIGhlaWdodDogNjAwcHg7XHJcbi8vICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoaW1nL2ZhY2VwYXJ0cy93YXNoaW5ndG9uX2V5ZV9sZWZ0X3JvdW5kLnBuZyksIHVybChpbWcvZmFjZXBhcnRzL3dhc2hpbmd0b25fZXllX2xlZnRfcm91bmQucG5nKTtcclxuLy8gICAgIGJhY2tncm91bmQtc2l6ZTogMTAwJSA1MCUsIDEwMCUgNTAlO1xyXG4vLyAgICAgYmFja2dyb3VuZC1ibGVuZC1tb2RlOiBjb2xvci1kb2RnZSwgY29sb3ItYnVybjtcclxuLy8gICAgIGJhY2tncm91bmQtcG9zaXRpb246IDBweCAwcHgsIC0wcHggMHB4O1xyXG4vLyAgICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdCwgbm8tcmVwZWF0O1xyXG4vLyB9XHJcblxyXG5cclxuXHJcbmNsYXNzIENvbXBvc2l0ZUltZyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcyA9IHt9KSB7XHJcbiAgICB0aGlzLnR5cGUgPSAnQ29tcG9zaXRlSW1nJztcclxuICAgIHRoaXMubGF5ZXJzID0gW107XHJcblxyXG4gICAgaWYgKHByb3BzLmxheWVycykge1xyXG4gICAgICB0aGlzLmFkZExheWVyKHByb3BzLmxheWVycyk7XHJcbiAgICAgIGRlbGV0ZSBwcm9wcy5sYXllcnM7ICAvLyBkb24ndCBsZXQgdGhpcyBwcm9wYWdhdGUgaW50byBjc3NcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcblxyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy5hcHBseUxheWVycygpOyAgLy8gd2lsbCBhZGQgbGF5ZXIgQ1NTIHByb3BzIHRvIHBvcHMgb2JqZWN0IHNvIG1ha2VFbGVtZW50KCkgd2lsbCBwaWNrIHRoZW0gdXBcclxuICAgIHRoaXMuYWRkTWFzayhwcm9wcy5tYXNrKTsgIC8vIG1ha2UgdGhpcyBwYXJ0IG9mIGNvbnZlcnRUb0NTUygpXHJcbiAgfVxyXG5cclxuICBhZGRMYXllciAocHJvcHMgPSB7fSkge1xyXG4gICAgaWYgKHByb3BzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgcHJvcHMuZm9yRWFjaCh0aGlzLmFkZExheWVyLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocHJvcHMpIHtcclxuICAgICAgdmFyIGxheWVyUHJvcHMgPSB7XHJcbiAgICAgICAgYmFja2dyb3VuZEltYWdlOiBwcm9wcy5pbWFnZSB8fCBwcm9wcy5iYWNrZ3JvdW5kSW1hZ2UsXHJcbiAgICAgICAgYmFja2dyb3VuZFNpemU6IHByb3BzLnNpemUgfHwgcHJvcHMuYmFja2dyb3VuZFNpemUgfHwgJzEwMCUgMTAwJScsXHJcbiAgICAgICAgYmFja2dyb3VuZEJsZW5kTW9kZTogcHJvcHMuYmxlbmRNb2RlIHx8IHByb3BzLmJhY2tncm91bmRNb2RlIHx8ICdub3JtYWwnLFxyXG4gICAgICAgIGJhY2tncm91bmRQb3NpdGlvbjogcHJvcHMucG9zaXRpb24gfHwgcHJvcHMuYmFja2dyb3VuZFBvc2l0aW9uIHx8ICcwcHggMHB4JyxcclxuICAgICAgICBiYWNrZ3JvdW5kUmVwZWF0OiBwcm9wcy5yZXBlYXQgfHwgcHJvcHMuYmFja2dyb3VuZFJlcGVhdCB8fCAnbm8tcmVwZWF0JyxcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5sYXllcnMucHVzaChsYXllclByb3BzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIG1lcmdlIGFsbCBsYXllciBwcm9wZXJ0aWVzIGludG8gb25lIGJhY2tncm91bmQgcHJvcGVydGllcyBDU1Mgb2JqZWN0XHJcbiAgbWFrZUNTUyAoKSB7XHJcbiAgICB2YXIgbWVyZ2VkTGF5ZXJzID0ge307XHJcbiAgICBpZiAodGhpcy5sYXllcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBtZXJnZWRMYXllcnMgPSB0aGlzLmxheWVycy5yZXZlcnNlKCkucmVkdWNlKGZ1bmN0aW9uIChtZXJnZWQsIGxheWVyUHJvcHMpIHtcclxuICAgICAgICBtZXJnZWQuYmFja2dyb3VuZEltYWdlICs9ICgnLCAnICsgbGF5ZXJQcm9wcy5iYWNrZ3JvdW5kSW1hZ2UpOyBcclxuICAgICAgICBtZXJnZWQuYmFja2dyb3VuZFNpemUgKz0gKCcsICcgKyBsYXllclByb3BzLmJhY2tncm91bmRTaXplKTsgXHJcbiAgICAgICAgbWVyZ2VkLmJhY2tncm91bmRCbGVuZE1vZGUgKz0gKCcsICcgKyBsYXllclByb3BzLmJhY2tncm91bmRCbGVuZE1vZGUpOyBcclxuICAgICAgICBtZXJnZWQuYmFja2dyb3VuZFBvc2l0aW9uICs9ICgnLCAnICsgbGF5ZXJQcm9wcy5iYWNrZ3JvdW5kUG9zaXRpb24pOyBcclxuICAgICAgICBtZXJnZWQuYmFja2dyb3VuZFJlcGVhdCArPSAoJywgJyArIGxheWVyUHJvcHMuYmFja2dyb3VuZFJlcGVhdCk7IFxyXG4gICAgICAgIHJldHVybiBtZXJnZWQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1lcmdlZExheWVycztcclxuICB9XHJcblxyXG4gIC8vIG1ha2UgKHByb3BzKSB7XHJcbiAgLy8gICByZXR1cm4gVGhpbmcubWFrZSgkLmV4dGVuZCh7XHJcbiAgLy8gICAgIHc6IDEyMDAsXHJcbiAgLy8gICAgIGg6IDI3NTAsXHJcbiAgLy8gICAgIGJhY2tncm91bmRDb2xvcjogJ3JlZCcsXHJcbiAgLy8gICB9LCBwcm9wcykpO1xyXG4gIC8vIH1cclxuXHJcbiAgYXBwbHlMYXllcnMgKCkge1xyXG4gICAgdGhpcy5jc3ModGhpcy5tYWtlQ1NTKCkpO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhDb21wb3NpdGVJbWcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGVJbWc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBCb3ggPSByZXF1aXJlKCcuLi9Cb3gvQm94LmpzJyk7XHJcblxyXG5jbGFzcyBEZW1vQm94IGV4dGVuZHMgQm94IHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuXHRcdCAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXHJcblx0XHQgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG5cdFx0ICBtYXJnaW46ICcyMHB4JyxcclxuXHRcdCAgd2lkdGg6ICcyMDBweCcsXHJcblx0XHQgIGhlaWdodDogJzIwMHB4JyxcclxuXHRcdCAgYm9yZGVyOiAnMnB4IGRhc2hlZCAjZWVlJ1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XHJcblx0XHR0aGlzLnR5cGUgPSAnRGVtb0JveCc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKERlbW9Cb3gpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZW1vQm94O1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLy8gTGlrZSBVbml4IHBpcGU6IG91dHB1dCBvZiBvbmUgY29tbWFuZCBpcyBpbnB1dCB0byB0aGUgbmV4dFxyXG4vLyBFYWNoIGZ1bmN0aW9uIHRha2VzIGEgJ3Byb3BzJyBvYmplY3QgYXMgYXJndW1lbnRcclxuLy8gRWFjaCBmdW5jdGlvbiByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHJlc3VsdHMsIHdoaWNoIGlzIHBhc3NlZCBhcyBwcm9wcyB0byB0aGUgbmV4dFxyXG4vLyBEbygpIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgZXhlY3V0ZSB0aGUgRG8gY2hhaW5cclxuXHJcbi8vIFAucHVsc2Uuc2V0VG8oXHJcbi8vICAgICBEbyhSLmdldFJhbmRvbU51bWJlciwge2Zyb206MCwgdG86MTB9KSAgIC8vIHJldHVybnM6ICB7ZGF0YTogOH1cclxuLy8gICAgIC5EbyhDLnBpY2tDb2xvcikgICAgLy8gcmVhZHMgaW5wdXQgOCwgcmV0dXJucyB7ZGF0YTogJyNjZmYnfVxyXG4vLyAgICAgLkRvKEIuY2hhbmdlQ29sb3IpICAgLy8gcmVhZHMgaW5wdXQgJyNjZmYnLCBjaGFuZ2VzIGNvbG9yIG9uIEJsaW5rZXJcclxuLy8gKTtcclxuXHJcblxyXG5mdW5jdGlvbiBEbyhfYUZ1bmN0aW9uLCBfcHJvcHMsIF9maXJzdERvKSB7XHJcbiAgICB2YXIgYUZ1bmN0aW9uID0gX2FGdW5jdGlvbjtcclxuICAgIHZhciBwcm9wcyA9IF9wcm9wcztcclxuICAgIHZhciBmaXJzdERvID0gX2ZpcnN0RG8gfHwgZXhlY3V0b3I7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ2FmdW5jdGlvbj0nLCBhRnVuY3Rpb24pO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3Byb3BzPScsIHByb3BzKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdmaXJzdERvPScsIGZpcnN0RG8pO1xyXG5cclxuICAgIC8vIFJ1biB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzLlxyXG4gICAgLy8gUGFzcyB0aGUgcmVzdWx0cyB0byB0aGUgbmV4dCBjaGFpbmVkIGZ1bmN0aW9uIChpZiBhbnkpLlxyXG4gICAgLy8gUmV0dXJuIHJlc3VsdHMgb2YgdGhpcyBmdW5jdGlvbiBvciBvZiB0aGUgY2hhaW5cclxuICAgIGZ1bmN0aW9uIGV4ZWN1dG9yIChwaXBlZFByb3BzKSB7XHJcbiAgICAgICAgdmFyIHJldHVyblZhbCA9IGFGdW5jdGlvbihwcm9wcyB8fCBwaXBlZFByb3BzKTtcclxuICAgICAgICByZXR1cm4gKGV4ZWN1dG9yLm5leHREbyA/IGV4ZWN1dG9yLm5leHREbyhyZXR1cm5WYWwpIDogcmV0dXJuVmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gdGhlIGxhc3QgJ0RvJyBpbiB0aGUgY2hhaW5cclxuICAgIGZ1bmN0aW9uIGdldExhc3REbyAoKSB7XHJcbiAgICAgICAgdmFyIHRtcERvID0gZmlyc3REbztcclxuICAgICAgICB3aGlsZSAodG1wRG8ubmV4dERvKSB7IHRtcERvID0gdG1wRG8ubmV4dERvOyB9XHJcbiAgICAgICAgcmV0dXJuIHRtcERvO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBhIG5ldyAnRG8nIHRvIHRoZSBlbmQgb2YgdGhlIGNoYWluLlxyXG4gICAgZXhlY3V0b3IuRG8gPSBmdW5jdGlvbiAoYUZ1bmN0aW9uLCBwcm9wcykge1xyXG4gICAgICAgIGdldExhc3REbygpLm5leHREbyA9IERvKGFGdW5jdGlvbiwgcHJvcHMsIGZpcnN0RG8pO1xyXG4gICAgICAgIHJldHVybiBmaXJzdERvOyAgLy8gQWx3YXlzIHJldHVybiB0aGUgZmlyc3QgJ0RvJyBpbiB0aGUgY2hhaW5cclxuICAgIH07XHJcblxyXG4gICAgZXhlY3V0b3IubmV4dERvID0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4gZXhlY3V0b3I7XHJcbn1cclxuXHJcblRoaW5nLkRvID0gRG87XHJcblxyXG4vKlxyXG4vLyBjaGFpbmVkLCBlYWNoIERvIGhhcyBpdHMgb3duIHBhcmFtZXRlcnNcclxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpO30sIHthcmcxOidoZWxsbzEnfSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpO30sIHthcmcyOidoZWxsbyB0byAyMjIyMid9KVxyXG5cclxuLy8gY2hhaW5lZCwgd2l0aCBmaXJzdCBEbyBwaXBpbmcgcmVzdWx0cyB0byBzZWNvbmQgRG9cclxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpO30sIG51bGwpXHJcblxyXG52YXIgZCA9IERvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDEnLCBwcm9wcyk7IHJldHVybiB7cGlwZWRwcm9wOjEyMzR9fSwge2FyZzE6J2hlbGxvMSd9KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDInLCBwcm9wcyk7IHJldHVybiB7bmV3UHJvcDpwcm9wcy5waXBlZHByb3ArMn19KVxyXG4gICAgICAgICAgICAgICAgLkRvKGZ1bmN0aW9uIChwcm9wcykge2NvbnNvbGUubG9nKCdzdGVwIDMnLCBwcm9wcyk7fSlcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRG87XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vKlxyXG4vLyB3b3JrcyB3aXRoIHN0YXIuc3ZnIGFzIGJhc2U2NFxyXG4td2Via2l0LW1hc2staW1hZ2U6IHVybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQmxibU52WkdsdVp6MGlWVlJHTFRnaUnigKZ0emRISnZhMlV0WkdGemFHRnljbUY1T201dmJtVTdjM1J5YjJ0bExXOXdZV05wZEhrNk1TSWdMejRnSUR3dlp6NDhMM04yWno0PSk7XHJcbi13ZWJraXQtbWFzay1yZXBlYXQ6IG5vLXJlcGVhdDtcclxuLXdlYmtpdC1tYXNrLXNpemU6IDEwMCU7XHJcblxyXG4vLyBjaXJjbGUgc3ZnIGFsc28gd29ya3NcclxuLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJz48Y2lyY2xlIHNoYXBlLXJlbmRlcmluZz0nZ2VvbWV0cmljUHJlY2lzaW9uJyBjeD0nMTUnIGN5PScxNScgcj0nMTAnIHN0cm9rZT0nYmxhY2snIHN0cm9rZS13aWR0aD0nNScgZmlsbD0nbm9uZScvPjwvc3ZnPlwiKTtcclxuLXdlYmtpdC1tYXNrLXJlcGVhdDogbm8tcmVwZWF0O1xyXG4td2Via2l0LW1hc2stc2l6ZTogMTAwJTtcclxuXHJcbi5zdGFyIHtcclxuICAtd2Via2l0LW1hc2staW1hZ2U6IHVybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQmxibU52WkdsdVp6MGlWVlJHTFRnaUlITjBZVzVrWVd4dmJtVTlJbTV2SWo4K1BITjJaeUFnSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnSUNCNGJXeHVjenBqWXowaWFIUjBjRG92TDJOeVpXRjBhWFpsWTI5dGJXOXVjeTV2Y21jdmJuTWpJaUFnSUhodGJHNXpPbkprWmowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzh3TWk4eU1pMXlaR1l0YzNsdWRHRjRMVzV6SXlJZ0lDQjRiV3h1Y3pwemRtYzlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JaUFnSUhodGJHNXpQU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaeUlnSUNCMlpYSnphVzl1UFNJeExqRWlJQ0FnYVdROUluTjJaeklpSUNBZ2RtbGxkMEp2ZUQwaU1DQXdJRGs1TGprNU9UazVOeUE1T1M0NU9UazVPVGNpSUNBZ2FHVnBaMmgwUFNJeE1EQWlJQ0FnZDJsa2RHZzlJakV3TUNJK0lDQThaR1ZtY3lBZ0lDQWdhV1E5SW1SbFpuTTBJaUF2UGlBZ1BHMWxkR0ZrWVhSaElDQWdJQ0JwWkQwaWJXVjBZV1JoZEdFM0lqNGdJQ0FnUEhKa1pqcFNSRVkrSUNBZ0lDQWdQR05qT2xkdmNtc2dJQ0FnSUNBZ0lDQnlaR1k2WVdKdmRYUTlJaUkrSUNBZ0lDQWdJQ0E4WkdNNlptOXliV0YwUG1sdFlXZGxMM04yWnl0NGJXdzhMMlJqT21admNtMWhkRDRnSUNBZ0lDQWdJRHhrWXpwMGVYQmxJQ0FnSUNBZ0lDQWdJQ0J5WkdZNmNtVnpiM1Z5WTJVOUltaDBkSEE2THk5d2RYSnNMbTl5Wnk5a1l5OWtZMjFwZEhsd1pTOVRkR2xzYkVsdFlXZGxJaUF2UGlBZ0lDQWdJQ0FnUEdSak9uUnBkR3hsUGp3dlpHTTZkR2wwYkdVK0lDQWdJQ0FnUEM5all6cFhiM0pyUGlBZ0lDQThMM0prWmpwU1JFWStJQ0E4TDIxbGRHRmtZWFJoUGlBZ1BHY2dJQ0FnSUhSeVlXNXpabTl5YlQwaWRISmhibk5zWVhSbEtEQXNMVGsxTWk0ek5qSXlNeWtpSUNBZ0lDQnBaRDBpYkdGNVpYSXhJajRnSUNBZ1BIQmhkR2dnSUNBZ0lDQWdaRDBpVFNBMU1DNHdNREF3TURFc09UVTBMamd3T1RNNUlEWTFMalExTURnME9DdzVPRFl1TVRFMk1qUWdNVEF3TERrNU1TNHhNelkxTWlBM05DNDVPVGs1T1Rnc01UQXhOUzQxTURVMUlEZ3dMamt3TVRZNU9Td3hNRFE1TGpreE5TQTFNQ3d4TURNekxqWTJPVEVnTVRrdU1EazRNams0TERFd05Ea3VPVEUxSURJMUxqQXdNREF3TVN3eE1ERTFMalV3TlRVZ0xURXVNakV6TkRNek5tVXROaXc1T1RFdU1UTTJOVElnTXpRdU5UUTVNVFV4TERrNE5pNHhNVFl5TkNCYUlpQWdJQ0FnSUNCcFpEMGljR0YwYURReE16WWlJQ0FnSUNBZ0lITjBlV3hsUFNKdmNHRmphWFI1T2pFN1ptbHNiRG9qTURBd01EQXdPMlpwYkd3dGIzQmhZMmwwZVRvd0xqVXdNakl5TWpJME8zTjBjbTlyWlRwdWIyNWxPM04wY205clpTMTNhV1IwYURveU1pNDJOemN4TmpVNU9UdHpkSEp2YTJVdGJHbHVaV3B2YVc0NmNtOTFibVE3YzNSeWIydGxMVzFwZEdWeWJHbHRhWFE2TkR0emRISnZhMlV0WkdGemFHRnljbUY1T201dmJtVTdjM1J5YjJ0bExXOXdZV05wZEhrNk1TSWdMejRnSUR3dlp6NDhMM04yWno0PSk7XHJcbn1cclxuKi9cclxuXHJcbmNsYXNzIEltZ1NWRyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgbGluZVdpZHRoOiA1LFxyXG4gICAgICByYWRpdXM6IDEwXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ0ltZ1NWRyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHByb3BzLnBhdHRlcm4pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIGxldCBzdmdUYWcgPSBJbWdTVkcubWFrZUNpcmNsZVNWRyh0aGlzLnByb3BzLnJhZGl1cywgdGhpcy5wcm9wcy5saW5lV2lkdGgpO1xyXG4gICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmFwcGVuZChzdmdUYWcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VVJMICgpIHtcclxuICAgIHJldHVybiBJbWdTVkcubWFrZVVSTChJbWdTVkcubWFrZUNpcmNsZVNWRyh0aGlzLnByb3BzLnJhZGl1cywgdGhpcy5wcm9wcy5saW5lV2lkdGgpKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlVVJMIChzdmdUYWcpIHtcclxuICAgIHJldHVybiBgdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsJHtzdmdUYWd9XCIpYDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlQ2lyY2xlU1ZHIChyYWRpdXMsIGxpbmVXaWR0aCkge1xyXG4gICAgbGV0IG91dGVyUmFkaXVzID0gcmFkaXVzICsgbGluZVdpZHRoO1xyXG4gICAgbGV0IHdpZHRoID0gKG91dGVyUmFkaXVzKSAqIDI7XHJcbiAgICBsZXQgc3ZnVGFnID0gYDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nJHt3aWR0aH0nIGhlaWdodD0nJHt3aWR0aH0nPjxjaXJjbGUgc2hhcGUtcmVuZGVyaW5nPSdnZW9tZXRyaWNQcmVjaXNpb24nIGN4PScke291dGVyUmFkaXVzfScgY3k9JyR7b3V0ZXJSYWRpdXN9JyByPScke3JhZGl1c30nIHN0cm9rZT0nYmxhY2snIHN0cm9rZS13aWR0aD0nJHtsaW5lV2lkdGh9JyBmaWxsPSdub25lJy8+PC9zdmc+YDtcclxuICAgIHJldHVybiBzdmdUYWc7XHJcbiAgfVxyXG5cclxuICAvLyByYWRpdXM6IHJhZGl1cyBvZiBkb3QgKHdpbGwgYmUgY2FwcGVkIGF0IDEvNCBvZiBzaXplLCBzbyBkb3RzIGRvbid0IG92ZXJmbG93IGltYWdlIGJvdW5kcylcclxuICAvLyBzaXplOiBzaXplIG9mIHR3by1kb3QgaW1hZ2UgKHNxdWFyZSlcclxuICAvL1xyXG4gIC8vIFNWR3Mgc2NhbGUgdXAvZG93biB2ZXJ5IHdlbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZCB0byBzZXQgYSBsYXJnZSBzaXplLiBKdXN0IHVzZSAxMDAgYW5kIHNjYWxlIHRoZSBpbWFnZSBpbiBDU1MuXHJcbiAgc3RhdGljIG1ha2VQb2xrYURvdHNTVkcgKHJhZGl1cz0yMCwgc2l6ZT0xMDApIHtcclxuICAgIGxldCBsZWZ0ID0gc2l6ZSAqIDAuMjU7XHJcbiAgICBsZXQgcmlnaHQgPSBzaXplICogMC43NTtcclxuICAgIGxldCByID0gcmFkaXVzID4gc2l6ZSAqIDAuMjUgPyBzaXplICogMC4yNSA6IHJhZGl1cztcclxuICAgIGxldCBzdmdUYWcgPSBgPHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScke3NpemV9JyBoZWlnaHQ9JyR7c2l6ZX0nPjxjaXJjbGUgc2hhcGUtcmVuZGVyaW5nPSdnZW9tZXRyaWNQcmVjaXNpb24nIGN4PScke2xlZnR9JyBjeT0nJHtsZWZ0fScgcj0nJHtyfScgZmlsbD0nYmxhY2snLz48Y2lyY2xlIHNoYXBlLXJlbmRlcmluZz0nZ2VvbWV0cmljUHJlY2lzaW9uJyBjeD0nJHtyaWdodH0nIGN5PScke3JpZ2h0fScgcj0nJHtyfScgZmlsbD0nYmxhY2snLz48L3N2Zz5gO1xyXG4gICAgcmV0dXJuIHN2Z1RhZztcclxuICB9XHJcbn1cclxuXHJcblRoaW5nLmFkZENsYXNzKEltZ1NWRyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEltZ1NWRztcclxuXHJcblxyXG4vKiogU1ZHIFBvbGthIGRvdCBwYXR0ZXJuLCBmaWxsZWQgaW50byByZWN0YW5nbGVcclxuXHJcbjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cclxuICAgIDxkZWZzPlxyXG4gICAgICAgIDxwYXR0ZXJuIHg9XCI1NjEuMjAwMDEyMjA3MDMxMlwiIHk9XCIxNjdcIiBpZD1cInBhdHRlcm4tb3V0cHV0XCIgd2lkdGg9XCI0MDBcIiBoZWlnaHQ9XCIzNTBcIiBwYXR0ZXJuVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxyXG4gICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjQwMFwiIGhlaWdodD1cIjM1MFwiPlxyXG4gICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGZpbGw9XCIjZmJmYmZiXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDk5LCA4OSksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoMSlcIiBmaWxsPVwiIzAwMDAwMFwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2U9XCJub25lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSByPVwiMjVcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwgMCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgcj1cIjI1XCIgY2xhc3M9XCJjbG9uZVwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg0MDAsIDApLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDQuNSlcIj48L2NpcmNsZT5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIHI9XCIyNVwiIGNsYXNzPVwiY2xvbmVcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwgMzUwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCI+PC9jaXJjbGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSByPVwiMjVcIiBjbGFzcz1cImNsb25lXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDQwMCwgMzUwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCI+PC9jaXJjbGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPHJlY3QgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAsIDApLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDQuNSlcIiB4PVwiLTI1XCIgeT1cIi0yNVwiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIGZpbGw9XCJ0cmFuc3BhcmVudFwiIHN0cm9rZT1cIm5vbmVcIiBjbGFzcz1cInNoYXBlLW92ZXJsYXlcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgPHJlY3QgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDQwMCwgMCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiIHg9XCItMjVcIiB5PVwiLTI1XCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cInRyYW5zcGFyZW50XCIgc3Ryb2tlPVwibm9uZVwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwgMzUwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCIgeD1cIi0yNVwiIHk9XCItMjVcIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBmaWxsPVwidHJhbnNwYXJlbnRcIiBzdHJva2U9XCJub25lXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg0MDAsIDM1MCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiIHg9XCItMjVcIiB5PVwiLTI1XCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cInRyYW5zcGFyZW50XCIgc3Ryb2tlPVwibm9uZVwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgIDwvZz5cclxuICAgICAgICAgICAgICAgIDxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgzMDIsIDI1OCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoMSlcIiBmaWxsPVwiIzAwMDAwMFwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2U9XCJub25lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSByPVwiMjVcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwgMCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgcj1cIjI1XCIgY2xhc3M9XCJjbG9uZVwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtNDAwLCAwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCI+PC9jaXJjbGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSByPVwiMjVcIiBjbGFzcz1cImNsb25lXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAsIC0zNTApLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDQuNSlcIj48L2NpcmNsZT5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIHI9XCIyNVwiIGNsYXNzPVwiY2xvbmVcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTQwMCwgLTM1MCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwLCAwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCIgeD1cIi0yNVwiIHk9XCItMjVcIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBmaWxsPVwidHJhbnNwYXJlbnRcIiBzdHJva2U9XCJub25lXCIgY2xhc3M9XCJzaGFwZS1vdmVybGF5XCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtNDAwLCAwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCIgeD1cIi0yNVwiIHk9XCItMjVcIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBmaWxsPVwidHJhbnNwYXJlbnRcIiBzdHJva2U9XCJub25lXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwLCAtMzUwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCIgeD1cIi0yNVwiIHk9XCItMjVcIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBmaWxsPVwidHJhbnNwYXJlbnRcIiBzdHJva2U9XCJub25lXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtNDAwLCAtMzUwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCIgeD1cIi0yNVwiIHk9XCItMjVcIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBmaWxsPVwidHJhbnNwYXJlbnRcIiBzdHJva2U9XCJub25lXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9nPlxyXG4gICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICA8L3BhdHRlcm4+XHJcbiAgICA8L2RlZnM+XHJcbiAgICA8cmVjdCBjbGFzcz1cInByZXZpZXctb3V0cHV0XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGZpbGw9XCJ1cmwoI3BhdHRlcm4tb3V0cHV0KVwiPjwvcmVjdD5cclxuPC9zdmc+XHJcbiovXHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vKlxyXG4gICAgc3JjOiA8ZmlsZSBwYXRoPlxyXG4qL1xyXG5jbGFzcyBJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgdGhpcy50eXBlID0gJ0ltZyc7XHJcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gMTtcclxuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLm9uSW1nTG9hZGVkID0gcHJvcHMub25JbWdMb2FkZWQ7XHJcbiAgICB0aGlzLm9uSW1nRXJyb3IgPSBwcm9wcy5vbkltZ0Vycm9yO1xyXG4gICAgdGhpcy5zcmMgPSBwcm9wcy5zcmM7XHJcblxyXG4gICAgdGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG5cclxuICAgIC8vIHRyYWNrIHRoZSBpbWFnZSBsb2FkXHJcbiAgICBwYWdlSW1nUXVldWUuYWRkKHRoaXMpO1xyXG5cclxuICAgIC8vIGxvYWQgdGhlIGltYWdlXHJcbiAgICBsb2FkSW1hZ2UocHJvcHMuc3JjLCB0aGlzLm9uTG9hZC5iaW5kKHRoaXMpLCB0aGlzLm9uRXJyb3IuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBvbkxvYWQgKGltZykge1xyXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IGltZy5oZWlnaHQgLyBpbWcud2lkdGg7ICAvLyBhc3BlY3QgcmF0aW8gb2Ygb3JpZ2luYWwgaW1hZ2VcclxuICAgIGlmICh0aGlzLncgfHwgKCF0aGlzLncgJiYgIXRoaXMuaCkpIHtcclxuICAgICAgICB0aGlzLncgPSB0aGlzLncgfHwgaW1nLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaCA9IHRoaXMuaCB8fCAodGhpcy53ICogdGhpcy5hc3BlY3RSYXRpbyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmggPSB0aGlzLmg7XHJcbiAgICAgICAgdGhpcy53ID0gKHRoaXMuaCAqICgxL3RoaXMuYXNwZWN0UmF0aW8pKTtcclxuICAgICAgICB3aW5kb3cuY29uc29sZS5sb2coJ2ltZyBsb2FkZWQnLCB0aGlzLmgsIHRoaXMuYXNwZWN0UmF0aW8sICgxL3RoaXMuYXNwZWN0UmF0aW8pLCB0aGlzLncpO1xyXG4gICAgfVxyXG4gICAgLy8gc2V0IHRoZSBpbWFnZSBhcyB0aGUgZGl2J3MgYmFja2dyb3VuZFxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLncsXHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmgsXHJcbiAgICAgICAgYmFja2dyb3VuZDogJ3VybCgnICtpbWcuc3JjKyAnKSBuby1yZXBlYXQgY2VudGVyICcgKyAodGhpcy5wcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJycpLFxyXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xyXG4gICAgfSk7XHJcbiAgICAvLyBhcHBseSB0cmFuc2Zvcm1zIG5vdyB0aGF0IHdlIGtub3cgaW1hZ2Ugd2lkdGggYW5kIGhlaWdodFxyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIC8vIGNsZWFyIGltYWdlIGZyb20gdGhlIGxvYWQgcXVldWVcclxuICAgIHBhZ2VJbWdRdWV1ZS5yZW1vdmUodGhpcyk7XHJcbiAgICAvLyBleGVjIGNhbGxiYWNrIGlmIGFueVxyXG4gICAgdGhpcy5vbkltZ0xvYWRlZCAmJiB0aGlzLm9uSW1nTG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgb25FcnJvciAoaW1nKSB7XHJcbiAgICBUaGluZy5tc2coJ0ltZy5vbkVycm9yOiBGYWlsZWQgdG8gbG9hZCAnICsgaW1nLnNyYyk7XHJcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICBwYWdlSW1nUXVldWUucmVtb3ZlKHRoaXMpO1xyXG4gICAgLy8gZXhlYyBjYWxsYmFjayBpZiBhbnlcclxuICAgIHRoaXMub25JbWdFcnJvciAmJiB0aGlzLm9uSW1nRXJyb3IodGhpcyk7XHJcbiAgfVxyXG5cclxuICBzZXRXaWR0aCAodykge1xyXG4gICAgdGhpcy53aWR0aCA9IHc7XHJcbiAgICB0aGlzLmhlaWdodCA9IHcgKiB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHRcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgb25BbGxMb2FkZWQgKGZ1bmMpIHtcclxuICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIG9uTG9hZEZ1bmN0aW9ucy5wdXNoKGZ1bmMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgVGhpbmcubXNnKFwiSU1HLm9uQWxsTG9hZGVkKCk6IHRyaWdnZXJlZFwiKTtcclxuICAgICAgICBvbkxvYWRGdW5jdGlvbnMuZm9yRWFjaCggKGYpID0+IHsgZigpOyB9ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbG9hZEJhdGNoIChwcm9wc0FycmF5ID0gW10sIG9uQmF0Y2hMb2FkZWQgPSAoKSA9PiB7fSkge1xyXG4gICAgbGV0IHEgPSBuZXcgSW1nUXVldWUoe29uRW1wdHk6ICgpID0+IHsgb25CYXRjaExvYWRlZChsb2FkZWQpOyB9fSk7XHJcbiAgICBsZXQgbG9hZGVkID0gW107XHJcbiAgICBwcm9wc0FycmF5LmZvckVhY2goZnVuY3Rpb24gKHByb3BzKSB7XHJcbiAgICAgICAgcHJvcHMub25JbWdMb2FkZWQgPSAoaW1nKSA9PiB7IFxyXG4gICAgICAgICAgICBsb2FkZWQucHVzaChpbWcpOyAvLyBoYXMgdG8gYmUgQkVGT1JFIHEucmVtb2UoKSBzbyBsYXN0IGltYWdlIGlzIGluY2x1ZGVkIHdoZW4gcS5vbkVtcHR5KCkgZmlyZXMuXHJcbiAgICAgICAgICAgIHEucmVtb3ZlKGltZyk7IFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJvcHMub25JbWdFcnJvciA9IChpbWcpID0+IHsgXHJcbiAgICAgICAgICAgIHEucmVtb3ZlKGltZyk7IFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcS5hZGQoSW1nLm1ha2UocHJvcHMpKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuVGhpbmcuYWRkQ2xhc3MoSW1nKTtcclxuXHJcblxyXG5jbGFzcyBJbWdRdWV1ZSB7XHJcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMgPSB7b25FbXB0eTogZnVuY3Rpb24gKCkge319KSB7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRJbWdzID0gW107XHJcbiAgICAgICAgdGhpcy5vbkVtcHR5ID0gcHJvcHMub25FbXB0eTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKGltZykge1xyXG4gICAgICAgIGlmIChpbWcgJiYgIWltZy5sb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWV1ZWRJbWdzLnB1c2goaW1nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWVkSW1ncy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlIChpbWcpIHtcclxuICAgICAgICBpZiAoaW1nICYmIGltZy5sb2FkZWQpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5xdWV1ZWRJbWdzLmluZGV4T2YoaW1nKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVldWVkSW1ncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRW1wdHkgJiYgdGhpcy5vbkVtcHR5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWVkSW1ncy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtYWluaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZWRJbWdzLmxlbmd0aDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEltYWdlIChzcmMsIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY2FsbGJhY2sodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgaW1nLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZXJyb3JDYWxsYmFjayh0aGlzKTtcclxuICAgIH07XHJcbiAgICBpbWcuc3JjID0gc3JjO1xyXG59XHJcblxyXG52YXIgb25Mb2FkRnVuY3Rpb25zID0gW107XHJcbnZhciBwYWdlSW1nUXVldWUgPSBuZXcgSW1nUXVldWUoe29uRW1wdHk6ICgpID0+IEltZy5vbkFsbExvYWRlZCgpfSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEltZztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIExhYmVsIGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHR0ZXh0OiAnJyxcclxuXHRcdFx0aHRtbDogZmFsc2UsXHJcblx0XHRcdGZvbnRGYW1pbHk6ICdSb2JvdG8sIENhbGlicmksIEFyaWFsLCBzYW5zLXNlcmlmJyxcclxuXHRcdFx0Zm9udFNpemU6ICcxNHB4JyxcclxuXHRcdFx0Y29sb3I6ICcjMDAwJ1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0dGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0xhYmVsJztcclxuXHRcdHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcblx0XHR0aGlzLmlzSFRNTCA9IHByb3BzLmh0bWw7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuc2V0VGV4dChwcm9wcy50ZXh0KTtcclxuXHJcblx0XHRUaGluZy5hZGRGb250VVJMKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvOjEwMCw0MDAsNzAwLDkwMCcsICdyb2JvdG9fZm9udCcpO1xyXG5cdH1cclxuXHJcblx0c2V0VGV4dCAodHh0KSB7XHJcblx0XHR0aGlzLnRleHQgPSB0eHQ7XHJcblx0XHRpZiAodGhpcy5pc0hUTUwpIHtcclxuXHRcdFx0Ly8gd2lsbCByZXNwZWN0IGh0bWwgdGFnc1xyXG5cdFx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkuaHRtbCh0eHQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIGxpdGVyYWwgdGV4dCAtIHdpbGwgc2hvdyBhbmdsZSBicmFja2V0c1xyXG5cdFx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkudGV4dCh0eHQpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKExhYmVsKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBMaW5lIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICAvLyBleHBlY3RpbmcgcHJvcHM6IHsgeDowLCB5OjAsIHgyOjUwLCB5Mjo1MCwgbGluZVdpZHRoOjUgfVxyXG4gICAgLy8gY2FsbCBpdCAnbGluZVdpZHRoJyB0byBhdm9pZCBjb2xsaXNpb24gd2l0aCBDU1MgJ3dpZHRoJyBwcm9wZXJ0eVxyXG5cclxuICAgIC8vIGZpeCBvbGQgcHJvcGVydHkgbmFtZXNcclxuICAgIHByb3BzLnggPSBwcm9wcy54IHx8IHByb3BzLngxIHx8IDA7XHJcbiAgICBwcm9wcy55ID0gcHJvcHMueSB8fCBwcm9wcy55MSB8fCAwO1xyXG4gICAgZGVsZXRlIHByb3BzLngxO1xyXG4gICAgZGVsZXRlIHByb3BzLnkxO1xyXG5cclxuICAgIC8vIG5lZWQgdG8gc2V0IG9yaWdpbiB0byBmYXIgbGVmdCBvZiBsaW5lXHJcbiAgICBwcm9wcy50cmFuc2Zvcm1PcmlnaW4gPSAnMCA1MCUnO1xyXG4gICAgcHJvcHMuYmFja2dyb3VuZENvbG9yID0gcHJvcHMgJiYgKHByb3BzLmJhY2tncm91bmRDb2xvciB8fCBwcm9wcy5jb2xvciB8fCAnYmxhY2snKTtcclxuICAgIHN1cGVyLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcblxyXG4gICAgdGhpcy50eXBlID0gJ0xpbmUnO1xyXG5cclxuICAgIHRoaXMuY3JlYXRlTGluZShwcm9wcy54LCBwcm9wcy55LCBwcm9wcy54MiwgcHJvcHMueTIsIHByb3BzLmxpbmVXaWR0aCwgcHJvcHMuYXJyb3csIHByb3BzLnNob3J0ZW4pO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlTGluZSAoeDEseTEsIHgyLHkyLCBsaW5lV2lkdGgsIGFycm93LCBzaG9ydGVuKSB7XHJcbiAgICB0aGlzLmxpbmVXaWR0aCA9IGxpbmVXaWR0aCB8fCAyO1xyXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoKHgxLXgyKSooeDEteDIpICsgKHkxLXkyKSooeTEteTIpKSAtIChhcnJvdz8gdGhpcy5saW5lV2lkdGgqMiA6IDApOyAgLy8gc2hvcnRlbiB0aGUgbGVuZ3RoIHRvIG1ha2Ugcm9vbSBmb3IgYXJyb3doZWFkXHJcbiAgICB0aGlzLmFuZ2xlICA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgdGhpcy5sZW5ndGggLT0gc2hvcnRlbiB8fCAwOyAgLy8gc2hvcnRlbiB0aGUgbGluZSBhIGJpdCAobWFrZXMgcm9vbSBmb3IgYXJyb3doZWFkKVxyXG5cclxuICAgIC8vIGdycnJycnIuLi4gc29tZSBmdW5jcyByZWFkIGZyb20gcHJvcHMueCwgc29tZSByZWFkIHRoaXMueFxyXG4gICAgdGhpcy54ID0gdGhpcy5wcm9wcy54ID0geDE7XHJcbiAgICB0aGlzLnkgPSB0aGlzLnByb3BzLnkgPSAoeTEtKHRoaXMubGluZVdpZHRoLzIpKTtcclxuICAgIHRoaXMudyA9IHRoaXMucHJvcHMudyA9IHRoaXMubGVuZ3RoO1xyXG4gICAgdGhpcy5oID0gdGhpcy5wcm9wcy5oID0gdGhpcy5saW5lV2lkdGg7XHJcbiAgICB0aGlzLnJvdGF0aW9uID0gdGhpcy5wcm9wcy5yb3RhdGUgPSB7ejogdGhpcy5hbmdsZX07XHJcblxyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG5cclxuICAgIGlmIChhcnJvdykge1xyXG4gICAgICB0aGlzLmFkZEFycm93SGVhZCh0aGlzLmxlbmd0aCwgdGhpcy5saW5lV2lkdGgsIHRoaXMubGluZVdpZHRoKjIsIHRoaXMucHJvcHMuYmFja2dyb3VuZENvbG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGxlbiBvZiBsaW5lLCB3aWR0aCBvZiBsaW5lLCBzaXplIG9mIHRyaWFuZ2xlIChpZS4gMTAgd2lsbCBiZSAxMHB4IHdpZGUgYW5kIDIwcHggaGlnaClcclxuICBhZGRBcnJvd0hlYWQgKGxlbiwgd2lkdGgsIHNpemUsIGNvbG9yKSB7XHJcbiAgICB0aGlzLmFycm93SGVhZCA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICB0aGlzLmFycm93SGVhZC5jc3Moe1xyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgd2lkdGg6IDAsXHJcbiAgICAgIGhlaWdodDogMCxcclxuICAgICAgZm9udFNpemU6IDAsXHJcbiAgICAgIGxpbmVIZWlnaHQ6IDAsXHJcbiAgICAgIGxlZnQ6IGxlbiArICdweCcsXHJcbiAgICAgIHRvcDogLShzaXplLSh3aWR0aC8yKSkgKyAncHgnLFxyXG4gICAgICBib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJUb3A6IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJMZWZ0OiBzaXplICsgJ3B4IHNvbGlkICcgKyBjb2xvclxyXG4gICAgfSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHRoaXMuYXJyb3dIZWFkKTtcclxuICB9XHJcblxyXG4gIGRhc2hlZCAoZGFzaFNpemUpIHtcclxuICAgIGRhc2hTaXplID0gZGFzaFNpemU9PT11bmRlZmluZWQgPyAxMCA6IGRhc2hTaXplO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgMzAlLCAnICt0aGlzLnByb3BzLmJhY2tncm91bmRDb2xvcisgJyAzMCUpJyxcclxuICAgICAgYmFja2dyb3VuZFNpemU6IGRhc2hTaXplICsgJ3B4J1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoTGluZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBQYWdlIHtcclxuICAgIHN0YXRpYyBkb3dubG9hZChkYXRhLCBmaWxlbmFtZSwgdHlwZSkge1xyXG4gICAgICAgIHZhciBmaWxlID0gbmV3IEJsb2IoW2RhdGFdLCB7dHlwZTogdHlwZX0pO1xyXG4gICAgICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xyXG4gICAgICAgIHZhciBhID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGEuaHJlZiA9IHVybDtcclxuICAgICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XHJcbiAgICAgICAgd2luZG93LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgYS5jbGljaygpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xyXG4gICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xyXG4gICAgICAgIH0sIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXREb2N1bWVudEhUTUwgKCkge1xyXG4gICAgICAgIHZhciBlbnRpcmVEb2MgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2h0bWwnKVswXTtcclxuICAgICAgICB2YXIgZW50aXJlRG9jU3RyID0gJzxodG1sPicgKyBlbnRpcmVEb2MuaW5uZXJIVE1MICsgJzwvaHRtbD4nO1xyXG4gICAgICAgIHJldHVybiBlbnRpcmVEb2NTdHI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNhdmVEb2NUb0ZpbGUoKSB7XHJcbiAgICAgICAgdmFyIHJhbmRudW0gPSBwYXJzZUludChNYXRoLnJhbmRvbSgpKjEwMDAwMDAwMCk7XHJcblxyXG4gICAgICAgIC8vIGh0bWwgb25seTogZG9uJ3Qgc2F2ZSBzY3JpcHRzXHJcbiAgICAgICAgJCgnc2NyaXB0JykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIFBhZ2UuZG93bmxvYWQoUGFnZS5nZXREb2N1bWVudEhUTUwoKSwgJ1RoaW5nX3NhdmVkX2ZpbGVfJyArIHJhbmRudW0gKyAnLmh0bWwnLCAndGV4dC9odG1sJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldFNjYWxlIChzY2FsZSkge1xyXG4gICAgICAgIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdsZWZ0IHRvcCc7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbml0RXZlbnRzKCkge1xyXG4gICAgICAgIC8vIExpc3RlbiBmb3Iga2V5cHJlc3NcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICAgICAgICB2YXIgbiA9IE51bWJlcihlLmtleSk7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChuID49IDAgJiYgbiA8PSA5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTnVtYmVyIGtleXMgc2NhbGUgdGhlIHBhZ2UgZnJvbSAuMSB0byAuOS4gMCBpcyBmdWxsc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IG4gPT09IDAgPyAxIDogbi8xMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNjYWxlKHNjYWxlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNlIGlmIChlLmtleSA9PT0gJ3MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcyB0b2dnbGVzIHNjcm9sbGluZyBvbi9vZmZcclxuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5vdmVyZmxvdyA9IChlbC5zdHlsZS5vdmVyZmxvdyA9PT0gJ2hpZGRlbicpID8gJ3Njcm9sbCcgOiAnaGlkZGVuJztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlS2V5dmFsU3RyaW5nKHN0ciwgZGVsaW1pdGVyID0gJyYnLCBhc3NvY2lhdGl2ZU9wZXJhdG9yID0gJz0nKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XHJcbiAgICAgICAgY29uc3QgZGVjb2RlZFN0ciA9IHN0ciA/IGRlY29kZVVSSUNvbXBvbmVudChzdHIpIDogbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKGRlY29kZWRTdHIpIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5dmFscyA9IGRlY29kZWRTdHIuc3BsaXQoZGVsaW1pdGVyKTtcclxuICAgICAgICAgICAga2V5dmFscy5mb3JFYWNoKChrdikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5dmFsID0ga3Yuc3BsaXQoYXNzb2NpYXRpdmVPcGVyYXRvcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5dmFsLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5dmFsLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSBrZXl2YWwuam9pbignPScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5LnRyaW0oKV0gPSB2YWwudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRQYXJhbXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VLZXl2YWxTdHJpbmcod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldHVwKCkge1xyXG4gICAgICAgIHZhciBwYWdlUGFyYW1zID0gVGhpbmcuUGFnZS5nZXRQYXJhbXMoKTtcclxuICAgICAgICBQYWdlLnNldFNjYWxlKHBhZ2VQYXJhbXMuc2NhbGUgfHwgMSk7XHJcbiAgICAgICAgUGFnZS5pbml0RXZlbnRzKCk7XHJcbiAgICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUGFnZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2U7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBQYXR0ZXJuUG9sa2FEb3RzIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBjb2xvcjogJyNmZmZkZDcnLFxyXG4gICAgICByYWRpdXM6IDEwMCxcclxuICAgICAgc2l6ZTogNTAwXHJcbiAgICB9O1xyXG4gICAgcHJvcHMucmFkaXVzID0gcHJvcHMucmFkaXVzIHx8IHByb3BzLnNpemUvNTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuUG9sa2FEb3RzJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIC8vIHBvbGthIGRvdHMgYmFja2dyb3VuZFxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6ICdyYWRpYWwtZ3JhZGllbnQoJyArcHJvcHMuY29sb3IrICcgJyArcHJvcHMucmFkaXVzKyAncHgsIHRyYW5zcGFyZW50ICcgKyhwcm9wcy5yYWRpdXMrMikrICdweCksIHJhZGlhbC1ncmFkaWVudCgnICtwcm9wcy5jb2xvcisgJyAnICtwcm9wcy5yYWRpdXMrICdweCwgdHJhbnNwYXJlbnQgJyArKHByb3BzLnJhZGl1cysyKSsgJ3B4KScsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBwcm9wcy5zaXplICsgJ3B4ICcgKyBwcm9wcy5zaXplICsgJ3B4JyxcclxuICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiAnMCAwLCAnICsocHJvcHMuc2l6ZS8yKSsgJ3B4ICcgKyhwcm9wcy5zaXplLzIpKyAncHgnXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICAgIC8vIEFkanVzdCBwYXR0ZXJuIHRvIGZpbGwgcGFyZW50XHJcbiAgICAgIHN1cGVyLmZpbGxQYXJlbnQodGhpcy5wcm9wcy5zdHJldGNoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBUaGluZy5tc2coJ1BhdHRlcm4ucmVuZGVyKCk6IFBhdHRlcm4gbmVlZHMgdG8gYmUgYWRkZWQgdG8gYSBwYXJlbnQgYmVmb3JlIGNhbGxpbmcgcmVuZGVyLicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxufVxyXG5UaGluZy5hZGRDbGFzcyhQYXR0ZXJuUG9sa2FEb3RzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblBvbGthRG90cztcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5QYXR0ZXJuU29mYSB7XFxyXFxuICBiYWNrZ3JvdW5kOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDk5JSwgNDAlKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA5JSkgMCAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDglLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgMTAlKSA1MCUgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCA0NiUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCA0MSUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDIzJSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDEwMCUgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCA5NiUsIDQlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMTUlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSA1MCUsXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg0NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDAsXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCgtNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMwMDtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQ1NTID0gcmVxdWlyZSgnLi9QYXR0ZXJuU29mYS5jc3MnKTtcclxuXHJcbmNsYXNzIFBhdHRlcm5Tb2ZhIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBzaXplOiAyNVxyXG4gICAgfTtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnUGF0dGVyblNvZmEnO1xyXG4gICAgdGhpcy5wYXR0ZXJuU2l6ZXMgPSBbNSwgMTAsIDEyLjUsIDE2LjYsIDI1LCA1MF07IC8vIHBlcmNlbnQgYmFja2dyb3VuZCBzaXplcyB0aGF0IGRvbid0IGRpc3RvcnQgcGF0dGVyblxyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgVGhpbmcuYWRkQ1NTU3RyaW5nKENTUywgJ1BhdHRlcm5Tb2ZhJyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG5cclxuICAgICAgLy8gcmVzaXplIHBhdHRlcm4gdG8gZmlsbCBwYXJlbnQgZWxlbWVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xyXG4gICAgICB0aGlzLmZpbGxQYXJlbnQodGhpcy5wcm9wcy5zdHJldGNoKTtcclxuXHJcbiAgICAgIC8vIFR3ZWFrIHRoZSBwYXR0ZXJuIHNpemVcclxuICAgICAgaWYgKHRoaXMucHJvcHMuc2l6ZSkge1xyXG4gICAgICAgIHRoaXMuY3NzKHtiYWNrZ3JvdW5kU2l6ZTogKHRoaXMucGF0dGVyblNpemVzW3RoaXMucHJvcHMuc2l6ZV0gfHwgMjUpICsgJyUnfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBUaGluZy5tc2coJ1BhdHRlcm4ucmVuZGVyKCk6IFBhdHRlcm4gbmVlZHMgdG8gYmUgYWRkZWQgdG8gYSBwYXJlbnQgYmVmb3JlIGNhbGxpbmcgcmVuZGVyLicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm5Tb2ZhKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblNvZmE7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBQYXR0ZXJuU3RyaXBlcyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgY29sb3I6ICdyZ2JhKDI1NSwyMDUsMjUsMSknLFxyXG4gICAgICByYWRpdXM6IDEwMCxcclxuICAgICAgc2l6ZTogNTAwXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1BhdHRlcm5TdHJpcGVzJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIC8vIHN0cmlwZXMgYmFja2dyb3VuZFxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6ICdsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgJyArcHJvcHMuY29sb3IrICcgNTAlKScsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBwcm9wcy5zaXplICsgJ3B4J1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgICAvLyBBZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudFxyXG4gICAgICBzdXBlci5maWxsUGFyZW50KHRoaXMucHJvcHMuc3RyZXRjaCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgVGhpbmcubXNnKCdQYXR0ZXJuLnJlbmRlcigpOiBQYXR0ZXJuIG5lZWRzIHRvIGJlIGFkZGVkIHRvIGEgcGFyZW50IGJlZm9yZSBjYWxsaW5nIHJlbmRlci4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUGF0dGVyblN0cmlwZXMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuU3RyaXBlcztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFBhdHRlcm5UaWxlTWFyYmxlIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBzaXplOiA1MDBcclxuICAgIH07XHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnUGF0dGVyblRpbGVNYXJibGUnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICBzdXBlci5yZW5kZXIoKTtcclxuXHJcbiAgICAgIHZhciBwYXR0ZXJuVyA9IDM2MzA7XHJcbiAgICAgIHZhciBwYXR0ZXJuSCA9IDMwMDA7XHJcbiAgICAgIHZhciB0aWxlVyA9IDUwMDtcclxuICAgICAgdmFyIHRpbGVIID0gNTAwO1xyXG4gICAgICB2YXIgbnVtVGlsZXMgPSAocGFyc2VJbnQocGF0dGVyblcvdGlsZVcpICsgMSkgKiAocGFyc2VJbnQocGF0dGVybkgvdGlsZUgpICsgMSk7XHJcblxyXG4gICAgICAvLyB2YXIgQkcgPSBUaGluZy5Cb3gubWFrZSh7XHJcbiAgICAgIC8vICAgYmFja2dyb3VuZEltYWdlOiAndXJsKGltZy9jb25jcmV0ZV8xLmpwZyknLFxyXG4gICAgICAvLyAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAvLyAgIHc6IHBhdHRlcm5XLFxyXG4gICAgICAvLyAgIGg6IHBhdHRlcm5IXHJcbiAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgdGhpcy5jc3Moe2JhY2tncm91bmRJbWFnZTogJ3VybChpbWcvY29uY3JldGVfMS5qcGcpJ30pO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wOyBpIDwgbnVtVGlsZXM7IGkrKykge1xyXG4gICAgICAgIHZhciByYW5kWCA9IFRoaW5nLlJhbmQucmFuZEludCgwLDIwMDApICogLTE7ICAvLyBsZXNzIHRoYW4gd2lkdGggb2YgYmFja2dyb3VuZCBUZXh0dXJlXHJcbiAgICAgICAgdmFyIHJhbmRZID0gVGhpbmcuUmFuZC5yYW5kSW50KDAsMTAwMCkgKiAtMTsgIC8vIGxlc3MgdGhhbiBoZWlnaHQgb2YgYmFja2dyb3VuZCBUZXh0dXJlXHJcbiAgICAgICAgdmFyIHRpbGUgPSBUaGluZy5tYWtlKHtcclxuICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMTUpJyxcclxuICAgICAgICAgIGJveFNoYWRvdzogJ3JnYigyNTUsIDI1NSwgMjU1KSAxMnB4IDEycHggMjVweCBpbnNldCwgcmdiKDE4MCwgMTgwLCAxODApIC0xMnB4IC0xMnB4IDI1cHggaW5zZXQsIHJnYmEoMzMsIDMzLCAzMywgMC40KSA2cHggNnB4IDhweCcsXHJcbiAgICAgICAgICAvLyBiYWNrZ3JvdW5kSW1hZ2U6ICdyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBmYXJ0aGVzdC1jb3JuZXIgYXQgMTQwcHggMjBweCAsIHJnYmEoMjUwLCAyNTAsIDI1MCwgMC45KSAzMCUsIHJnYmEoMjM4LCAyMzgsIDIzOCwgMC44KSA4NSUpJyxcclxuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogJ3VybChpbWcvd2hpdGUtbWFyYmxlLXRleHR1cmUtbGl0ZS5qcGcpJyxcclxuICAgICAgICAgIGJhY2tncm91bmRQb3NpdGlvbjogcmFuZFgrJ3B4ICcrIHJhbmRZKydweCcsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kUmVwZWF0OiAnbm8tcmVwZWF0JyxcclxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgZmxvYXQ6ICdsZWZ0JyxcclxuICAgICAgICAgIHc6IHRpbGVXLFxyXG4gICAgICAgICAgaDogdGlsZUgsXHJcbiAgICAgICAgICBtYXJnaW46ICc1cHgnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQodGlsZS4kZWxlbWVudCk7XHJcbiAgICAgICAgLy8gQkcuYWRkKHRpbGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIFRoaW5nLm1zZygnUGF0dGVybi5yZW5kZXIoKTogUGF0dGVybiBuZWVkcyB0byBiZSBhZGRlZCB0byBhIHBhcmVudCBiZWZvcmUgY2FsbGluZyByZW5kZXIuJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm5UaWxlTWFyYmxlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblRpbGVNYXJibGU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbi8vIHZhciBDU1MgPSByZXF1aXJlKCcuL1BhdHRlcm4uY3NzJyk7XHJcblxyXG5mdW5jdGlvbiBvbmVMaW5lKHMpIHtcclxuICByZXR1cm4gKHMucmVwbGFjZSgvXFxyP1xcbnxcXHJ8XFx0L2dtLCAnJykpLnRyaW0oKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIFBhdHRlcm4gZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHBhdHRlcm46ICdHcmFwaFBhcGVyJyxcclxuICAgICAgc3RyZXRjaDogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MocHJvcHMucGF0dGVybik7XHJcblxyXG4gICAgLy8gQWRkIHRoZSBQYXR0ZXJucyBjc3MgKHdpbGwgYWRkIG9ubHkgb25jZSlcclxuICAgIC8vIFRoaW5nLmFkZENTU1N0cmluZyhDU1MsICdQYXR0ZXJuJyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgc3VwZXIucmVuZGVyKCk7XHJcblxyXG4gICAgLy8gQWRqdXN0IHBhdHRlcm4gdG8gZmlsbCBwYXJlbnQgd2l0aCBhIHNxdWFyZSBhc3BlY3QgcmF0aW9cclxuICAgIHN1cGVyLmZpbGxQYXJlbnQodGhpcy5wcm9wcy5zdHJldGNoKTtcclxuXHJcbiAgICBpZiAodGhpcy5wcm9wcy5wYXR0ZXJuICYmIHBhdHRlcm5UZW1wbGF0ZXNbdGhpcy5wcm9wcy5wYXR0ZXJuXSkge1xyXG4gICAgICB2YXIgcGF0dGVyblRlbXBsYXRlID0gcGF0dGVyblRlbXBsYXRlc1t0aGlzLnByb3BzLnBhdHRlcm5dO1xyXG4gICAgICB0aGlzLmNzcyggcGF0dGVyblRlbXBsYXRlKHRoaXMucHJvcHMpICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnByb3BzLnNpemUpIHsgLy8gVHdlYWsgdGhlIHNpemVcclxuICAgICAgdGhpcy5jc3Moe2JhY2tncm91bmRTaXplOiB0aGlzLnByb3BzLnNpemUgKyAnJSd9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlR3JpZFBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDUwO1xyXG4gICAgbGV0IGNvbG9yID0gcHJvcHMuY29sb3IgfHwgJ3JnYmEoMjU1LDI1NSwyNTUsLjUpJztcclxuICAgIGxldCBiZ0NvbG9yID0gcHJvcHMuYmFja2dyb3VuZENvbG9yIHx8ICd0cmFuc3BhcmVudCc7XHJcbiAgICBsZXQgbGluZVdpZHRoID0gcHJvcHMubGluZVdpZHRoIHx8IDI7XHJcbiAgICBsZXQgcGF0dGVybkNTUyA9IHtcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogYCR7c2l6ZX1weCAke3NpemV9cHgsICR7c2l6ZX1weCAke3NpemV9cHhgLFxyXG4gICAgICBiYWNrZ3JvdW5kUG9zaXRpb246IGAtJHtsaW5lV2lkdGh9cHggLSR7bGluZVdpZHRofXB4LCAtJHtsaW5lV2lkdGh9cHggLSR7bGluZVdpZHRofXB4YCxcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiBvbmVMaW5lKGBsaW5lYXItZ3JhZGllbnQoJHtjb2xvcn0gJHtsaW5lV2lkdGh9cHgsIHRyYW5zcGFyZW50ICR7bGluZVdpZHRofXB4KSxcclxuICAgICAgICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgJHtjb2xvcn0gJHtsaW5lV2lkdGh9cHgsIHRyYW5zcGFyZW50ICR7bGluZVdpZHRofXB4KWApLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gcGF0dGVybkNTUztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlR3JhcGhQYXBlclBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDEwMDtcclxuICAgIGxldCBkaXZTaXplID0gc2l6ZSAvIDU7XHJcbiAgICBsZXQgY29sb3IgPSBwcm9wcy5jb2xvciB8fCAncmdiYSgyNTUsMjU1LDI1NSwuMyknO1xyXG4gICAgbGV0IGJnQ29sb3IgPSBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMwMDMnO1xyXG4gICAgbGV0IGxpbmVXaWR0aCA9IHByb3BzLmxpbmVXaWR0aCB8fCA0O1xyXG4gICAgbGV0IGxXaWR0aCA9IGxpbmVXaWR0aCAvIDI7XHJcbiAgICBsZXQgYmdJbWcgPSBgXHJcbiAgICAgICAgbGluZWFyLWdyYWRpZW50KCR7Y29sb3J9ICR7bGluZVdpZHRofXB4LCB0cmFuc3BhcmVudCAke2xpbmVXaWR0aH1weCksXHJcbiAgICAgICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCAke2NvbG9yfSAke2xpbmVXaWR0aH1weCwgdHJhbnNwYXJlbnQgJHtsaW5lV2lkdGh9cHgpLFxyXG4gICAgICAgIGxpbmVhci1ncmFkaWVudCgke2NvbG9yfSAke2xXaWR0aH1weCwgdHJhbnNwYXJlbnQgJHtsV2lkdGh9cHgpLFxyXG4gICAgICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgJHtjb2xvcn0gJHtsV2lkdGh9cHgsIHRyYW5zcGFyZW50ICR7bFdpZHRofXB4KWA7XHJcbiAgICBsZXQgcGF0dGVybkNTUyA9IHtcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogYCR7c2l6ZX1weCAke3NpemV9cHgsICR7c2l6ZX1weCAke3NpemV9cHgsICR7ZGl2U2l6ZX1weCAke2RpdlNpemV9cHgsICR7ZGl2U2l6ZX1weCAke2RpdlNpemV9cHhgLFxyXG4gICAgICBiYWNrZ3JvdW5kUG9zaXRpb246IGAtJHtsaW5lV2lkdGh9cHggLSR7bGluZVdpZHRofXB4LCAtJHtsaW5lV2lkdGh9cHggLSR7bGluZVdpZHRofXB4LCAtJHtsV2lkdGh9cHggLSR7bFdpZHRofXB4LCAtJHtsV2lkdGh9cHggLSR7bFdpZHRofXB4YCxcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiBvbmVMaW5lKGJnSW1nKSxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHBhdHRlcm5DU1M7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZURpYWdvbmFsU3RyaXBlUGF0dGVybkNTUyhwcm9wcykge1xyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHJcbiAgICBsZXQgc2l6ZSA9IHByb3BzLnNpemUgfHwgNTA7XHJcbiAgICBsZXQgY29sb3IgPSBwcm9wcy5jb2xvciB8fCAnIzBlMDAzMCc7XHJcbiAgICBsZXQgYmdDb2xvciA9IHByb3BzLmJhY2tncm91bmRDb2xvciB8fCAndHJhbnNwYXJlbnQnO1xyXG4gICAgbGV0IGJnSW1nID0gYGxpbmVhci1ncmFkaWVudCg0NWRlZywgJHtjb2xvcn0gMjUlLCB0cmFuc3BhcmVudCAyNS4xNSUsIHRyYW5zcGFyZW50IDUwJSwgJHtjb2xvcn0gNTAuMTUlLCAke2NvbG9yfSA3NSUsIHRyYW5zcGFyZW50IDc1LjE1JSwgdHJhbnNwYXJlbnQpYDtcclxuICAgIGxldCBwYXR0ZXJuQ1NTID0ge1xyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJnQ29sb3IsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBgJHtzaXplfXB4ICR7c2l6ZX1weGAsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogb25lTGluZShiZ0ltZyksXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYXR0ZXJuQ1NTO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VWZXJ0aWNhbFN0cmlwZVBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDEwMDtcclxuICAgIGxldCBjb2xvciA9IHByb3BzLmNvbG9yIHx8ICdyZ2JhKDI1NSwyMDUsMjUsMSknO1xyXG4gICAgbGV0IGJnQ29sb3IgPSBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJ3RyYW5zcGFyZW50JztcclxuICAgIGxldCBiZ0ltZyA9IGBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgJHtjb2xvcn0gNTAlKWA7XHJcbiAgICBsZXQgcGF0dGVybkNTUyA9IHtcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogYCR7c2l6ZX1weGAsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYmdJbWcsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYXR0ZXJuQ1NTO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VQb2xrYURvdFBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDEwMDtcclxuICAgIGxldCBtaWQgPSBzaXplIC8gMjtcclxuICAgIGxldCByYWRpdXMgPSBwcm9wcy5yYWRpdXMgfHwgKHNpemUvNSk7XHJcbiAgICBsZXQgY29sb3IgPSBwcm9wcy5jb2xvciB8fCAnI2ZmZmRkNyc7XHJcbiAgICBsZXQgYmdDb2xvciA9IHByb3BzLmJhY2tncm91bmRDb2xvciB8fCAndHJhbnNwYXJlbnQnO1xyXG4gICAgbGV0IGJnSW1nID1cclxuICAgICAgYHJhZGlhbC1ncmFkaWVudCgke2NvbG9yfSAke3JhZGl1c31weCwgdHJhbnNwYXJlbnQgJHtyYWRpdXMrMX1weCksXHJcbiAgICAgIHJhZGlhbC1ncmFkaWVudCgke2NvbG9yfSAke3JhZGl1c31weCwgdHJhbnNwYXJlbnQgJHtyYWRpdXMrMX1weClgO1xyXG4gICAgbGV0IHBhdHRlcm5DU1MgPSB7XHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogYmdDb2xvcixcclxuICAgICAgYmFja2dyb3VuZFNpemU6IGAke3NpemV9cHggJHtzaXplfXB4YCxcclxuICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiBgMCAwLCAke21pZH1weCAke21pZH1weGAsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogb25lTGluZShiZ0ltZyksXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYXR0ZXJuQ1NTO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VTb2ZhUGF0dGVybkNTUyhwcm9wcykge1xyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHJcbiAgICBsZXQgc2l6ZSA9IHByb3BzLnNpemUgfHwgMTAwO1xyXG4gICAgbGV0IG1pZCA9IHNpemUgLyAyO1xyXG4gICAgbGV0IGJnQ29sb3IgPSBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMzMDAnO1xyXG4gICAgbGV0IGJnID1cclxuICAgICAgYHJhZGlhbC1ncmFkaWVudChoc2woMCwgOTklLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA5JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDklKSAwIDAsXHJcbiAgICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgMTAwJSwgNDAlKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSAxMCUpICR7bWlkfXB4ICR7bWlkfXB4LFxyXG4gICAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCA0NiUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpICR7bWlkfXB4IDAsXHJcbiAgICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDQxJSwgMC44KSAyMCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgMCAke21pZH1weCxcclxuICAgICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyMyUpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgJHttaWR9cHggMCxcclxuICAgICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpICR7c2l6ZX1weCAke21pZH1weCxcclxuICAgICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgOTYlLCA0JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXHJcbiAgICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAke21pZH1weCAke21pZH1weCxcclxuICAgICAgbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMCxcclxuICAgICAgbGluZWFyLWdyYWRpZW50KC00NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDBgO1xyXG4gICAgbGV0IHBhdHRlcm5DU1MgPSB7XHJcbiAgICAgIGJhY2tncm91bmQ6IG9uZUxpbmUoYmcpLCAgLy8gVGhpcyBoYXMgdG8gY29tZSBiZWZvcmUgYmFja2dyb3VuZFNpemUgb3IgaXQgZG9lc24ndCBzaG93KD8hKVxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJnQ29sb3IsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBgJHtzaXplfXB4ICR7c2l6ZX1weGAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYXR0ZXJuQ1NTO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VQbGFpZFJlZFBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDEwMDA7XHJcbiAgICAvLyB0aGluIGJsdWUgbGluZVxyXG4gICAgbGV0IHRpbnkxYSA9IHNpemUgKiAwLjIwMDtcclxuICAgIGxldCB0aW55MWIgPSBzaXplICogMC4yMTI7XHJcbiAgICAvLyB0aGluIGJsdWUgbGluZVxyXG4gICAgbGV0IHRpbnkyYSA9IHNpemUgKiAwLjI1MjtcclxuICAgIGxldCB0aW55MmIgPSBzaXplICogMC4yNjQ7XHJcbiAgICAvLyB1cHBlciB3aWRlIGdyZWVuaXNoIGJhbmRcclxuICAgIGxldCB3aWRlMWEgPSBzaXplICogMC40NjQ7XHJcbiAgICBsZXQgd2lkZTFiID0gc2l6ZSAqIDAuNjY0O1xyXG4gICAgLy8gbWlkZGxlIGdyZWVuaXNoIGJhbmRcclxuICAgIGxldCB3aWRlMmEgPSBzaXplICogMC42NzY7XHJcbiAgICBsZXQgd2lkZTJiID0gc2l6ZSAqIDAuNzE2O1xyXG4gICAgLy8gdXBwZXIgd2lkZSBncmVlbmlzaCBiYW5kXHJcbiAgICBsZXQgd2lkZTNhID0gc2l6ZSAqIDAuNzI4O1xyXG4gICAgbGV0IHdpZGUzYiA9IHNpemUgKiAwLjkyODtcclxuICAgIC8vIGJhY2tncm91bmQgaGF0Y2hpbmdcclxuICAgIGxldCBoYXRjaEEgPSBzaXplICogMC4wMDg7XHJcbiAgICBsZXQgaGF0Y2hCID0gc2l6ZSAqIDAuMDEyO1xyXG4gICAgbGV0IGhhdGNoQyA9IHNpemUgKiAwLjAyMDtcclxuXHJcbiAgICBsZXQgYmdDb2xvciA9IHByb3BzLmJhY2tncm91bmRDb2xvciB8fCAnaHNsKDAsIDg2JSwgMzQlKSc7XHJcbiAgICBsZXQgYmdJbWcgPVxyXG4gICAgICBgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudChcclxuICAgICAgICB0cmFuc3BhcmVudCwgdHJhbnNwYXJlbnQgJHt0aW55MWF9cHgsXHJcbiAgICAgICAgcmdiYSg0MCwwLDE2MCwuNCkgJHt0aW55MWF9cHgsIHJnYmEoNDAsMCwxNjAsLjQpICR7dGlueTFifXB4LFxyXG4gICAgICAgIHRyYW5zcGFyZW50ICR7dGlueTFifXB4LCB0cmFuc3BhcmVudCAke3RpbnkyYX1weCxcclxuICAgICAgICByZ2JhKDQwLDAsMTYwLC40KSAke3RpbnkyYX1weCwgcmdiYSg0MCwwLDE2MCwuNCkgJHt0aW55MmJ9cHgsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQgJHt0aW55MmJ9cHgsIHRyYW5zcGFyZW50ICR7d2lkZTFhfXB4LFxyXG4gICAgICAgIHJnYmEoMCw2MCwwLC41KSAke3dpZGUxYX1weCwgcmdiYSgwLDYwLDAsLjUpICR7d2lkZTFifXB4LFxyXG4gICAgICAgIHJnYmEoMjU1LDI1NSwyMDAsLjMpICR7d2lkZTFifXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAke3dpZGUyYX1weCxcclxuICAgICAgICByZ2JhKDAsNjAsMCwuNSkgJHt3aWRlMmF9cHgsIHJnYmEoMCw2MCwwLC41KSAke3dpZGUyYn1weCxcclxuICAgICAgICByZ2JhKDI1NSwyNTUsMjAwLC4zKSAke3dpZGUyYn1weCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgJHt3aWRlM2F9cHgsXHJcbiAgICAgICAgcmdiYSgwLDYwLDAsLjUpICR7d2lkZTNhfXB4LCByZ2JhKDAsNjAsMCwuNSkgJHt3aWRlM2J9cHgsIHRyYW5zcGFyZW50ICR7d2lkZTNifXB4KSxcclxuICAgICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgyNzBkZWcsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQsIHRyYW5zcGFyZW50ICR7dGlueTFhfXB4LFxyXG4gICAgICAgIHJnYmEoNDAsMCwxNjAsLjQpICR7dGlueTFhfXB4LCByZ2JhKDQwLDAsMTYwLC40KSAke3RpbnkxYn1weCxcclxuICAgICAgICB0cmFuc3BhcmVudCAke3RpbnkxYn1weCwgdHJhbnNwYXJlbnQgJHt0aW55MmF9cHgsXHJcbiAgICAgICAgcmdiYSg0MCwwLDE2MCwuNCkgJHt0aW55MmF9cHgsIHJnYmEoNDAsMCwxNjAsLjQpICR7dGlueTJifXB4LFxyXG4gICAgICAgIHRyYW5zcGFyZW50ICR7dGlueTJifXB4LCB0cmFuc3BhcmVudCAke3dpZGUxYX1weCxcclxuICAgICAgICByZ2JhKDAsNjAsMCwuNSkgJHt3aWRlMWF9cHgsIHJnYmEoMCw2MCwwLC41KSAke3dpZGUxYn1weCxcclxuICAgICAgICByZ2JhKDI1NSwyNTUsMjAwLC4zKSAke3dpZGUxYn1weCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgJHt3aWRlMmF9cHgsXHJcbiAgICAgICAgcmdiYSgwLDYwLDAsLjUpICR7d2lkZTJhfXB4LCByZ2JhKDAsNjAsMCwuNSkgJHt3aWRlMmJ9cHgsXHJcbiAgICAgICAgcmdiYSgyNTUsMjU1LDIwMCwuMykgJHt3aWRlMmJ9cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpICR7d2lkZTNhfXB4LFxyXG4gICAgICAgIHJnYmEoMCw2MCwwLC41KSAke3dpZGUzYX1weCwgcmdiYSgwLDYwLDAsLjUpICR7d2lkZTNifXB4LCB0cmFuc3BhcmVudCAke3dpZGUzYn1weCksXHJcbiAgICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMTI1ZGVnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50LCB0cmFuc3BhcmVudCAke2hhdGNoQX1weCxcclxuICAgICAgICByZ2JhKDAsMCwwLC4yKSAke2hhdGNoQX1weCwgcmdiYSgwLDAsMCwuMikgJHtoYXRjaEJ9cHgsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQgJHtoYXRjaEJ9cHgsIHRyYW5zcGFyZW50ICR7aGF0Y2hDfXB4LCByZ2JhKDAsMCwwLC4yKSAke2hhdGNoQ31weClgO1xyXG4gICAgbGV0IHBhdHRlcm5DU1MgPSB7XHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogYmdDb2xvcixcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiBvbmVMaW5lKGJnSW1nKSxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHBhdHRlcm5DU1M7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVBhdHRlcm5Gcm9tQ1NTKGNzcykge1xyXG4gICAgcmV0dXJuIHRoaXMubWFrZSh7cGF0dGVybjogJ25vbmUnLCBzaXplOiBudWxsLCBzdHJldGNoOiB0cnVlfSkuY3NzKGNzcyk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgcGF0dGVyblRlbXBsYXRlcyA9IHtcclxuICBHcmlkOiBQYXR0ZXJuLm1ha2VHcmlkUGF0dGVybkNTUyxcclxuICBHcmFwaFBhcGVyOiBQYXR0ZXJuLm1ha2VHcmFwaFBhcGVyUGF0dGVybkNTUyxcclxuICBEaWFnb25hbFN0cmlwZXM6IFBhdHRlcm4ubWFrZURpYWdvbmFsU3RyaXBlUGF0dGVybkNTUyxcclxuICBEaWFnb25hbFN0cmlwZXNWaW9sZXQ6IFBhdHRlcm4ubWFrZURpYWdvbmFsU3RyaXBlUGF0dGVybkNTUyxcclxuICBWZXJ0aWNhbFN0cmlwZXM6IFBhdHRlcm4ubWFrZVZlcnRpY2FsU3RyaXBlUGF0dGVybkNTUyxcclxuICBTdHJpcGVzOiBQYXR0ZXJuLm1ha2VWZXJ0aWNhbFN0cmlwZVBhdHRlcm5DU1MsXHJcbiAgUGF0dGVyblN0cmlwZXM6IFBhdHRlcm4ubWFrZVZlcnRpY2FsU3RyaXBlUGF0dGVybkNTUyxcclxuICBQb2xrYURvdHM6IFBhdHRlcm4ubWFrZVBvbGthRG90UGF0dGVybkNTUyxcclxuICBQYXR0ZXJuUG9sa2FEb3RzOiBQYXR0ZXJuLm1ha2VQb2xrYURvdFBhdHRlcm5DU1MsXHJcbiAgU29mYTogUGF0dGVybi5tYWtlU29mYVBhdHRlcm5DU1MsXHJcbiAgUGxhaWRSZWQ6IFBhdHRlcm4ubWFrZVBsYWlkUmVkUGF0dGVybkNTUyxcclxufTtcclxuXHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm4pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgUG9pbnRzIHtcclxuXHRzdGF0aWMgZ2V0TWF4WShwb2ludHMpIHtcclxuXHRcdHZhciBwID0gcG9pbnRzICYmIHBvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50VmFsdWUpID0+IGFjY3VtdWxhdG9yLnkgPiBjdXJyZW50VmFsdWUueSA/IGFjY3VtdWxhdG9yIDogY3VycmVudFZhbHVlKTtcclxuXHRcdHJldHVybiAocCAmJiBwLnkpIHx8IDA7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0TWluWShwb2ludHMpIHtcclxuXHRcdHZhciBwID0gcG9pbnRzICYmIHBvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50VmFsdWUpID0+IGFjY3VtdWxhdG9yLnkgPCBjdXJyZW50VmFsdWUueSA/IGFjY3VtdWxhdG9yIDogY3VycmVudFZhbHVlKTtcclxuXHRcdHJldHVybiAocCAmJiBwLnkpIHx8IDEwMDtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBzb3J0WSAocG9pbnRzKSB7XHJcblx0XHR2YXIgY2xvbmUgPSBwb2ludHMubWFwKGZ1bmN0aW9uIChwKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0eDogcC54LFxyXG5cdFx0XHRcdHk6IHAueSxcclxuXHRcdFx0XHRfdGFyZ2V0VGhpbmc6IHAsIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHNvdXJjZSB0aGluZ1xyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHJcblx0XHRjbG9uZS5zb3J0KGZ1bmN0aW9uKGEsYikge1xyXG5cdFx0XHRyZXR1cm4gYS55IC0gYi55O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gY2xvbmU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgbWFrZVBvaW50c0F0WCAocG9pbnRzLCB4LCBvZmZzZXQpIHtcclxuXHRcdHZhciB4cG9pbnRzID0gcG9pbnRzLm1hcChmdW5jdGlvbiAocCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHg6IHggIT09IHVuZGVmaW5lZCA/IHggOiAocC54ICsgb2Zmc2V0KSxcclxuXHRcdFx0XHR5OiBwLnksXHJcblx0XHRcdFx0X3RhcmdldFRoaW5nOiBwLl90YXJnZXRUaGluZyB8fCBwLCAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBzb3VyY2UgdGhpbmdcclxuXHRcdFx0fTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHhwb2ludHM7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgamlnZ2xlIChwb2ludHMsIG1heERpc3RhbmNlID0gMCkge1xyXG5cdFx0cmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24gKHApIHtcclxuXHRcdFx0dmFyIGppZ2dsZSA9IFRoaW5nLlJhbmQucmFuZEZsb2F0KC0xLCAxKTtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHR4OiBwLnggKyAoamlnZ2xlICogbWF4RGlzdGFuY2UpLFxyXG5cdFx0XHRcdHk6IHAueSArIChqaWdnbGUgKiBtYXhEaXN0YW5jZSksXHJcblx0XHRcdFx0X3RhcmdldFRoaW5nOiBwLl90YXJnZXRUaGluZywgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgc291cmNlIHRoaW5nXHJcblx0XHRcdH07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBzdHJldGNoWSAocG9pbnRzLCBhbW91bnQgPSAxLCBtaW5ZID0gMCwgbWF4WSA9IDEwMCkge1xyXG5cdFx0dmFyIG9yaWdIZWlnaHQgPSBtYXhZIC0gbWluWTtcclxuXHRcdHZhciBuZXdIZWlnaHQgPSBvcmlnSGVpZ2h0ICogYW1vdW50O1xyXG5cdFx0dmFyIG5ld1N0YXJ0WSA9IG1pblkgLSAoKG5ld0hlaWdodCAtIG9yaWdIZWlnaHQpIC8gMik7XHJcblx0XHR2YXIgbmV3UG9pbnRzID0gcG9pbnRzLm1hcChmdW5jdGlvbiAocCkge1xyXG5cdFx0XHR2YXIgb3JpZ1lwb3NBc1BlcmNlbnQgPSAocC55IC0gbWluWSkgLyBvcmlnSGVpZ2h0O1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHg6IHAueCxcclxuXHRcdFx0XHR5OiBuZXdTdGFydFkgKyAob3JpZ1lwb3NBc1BlcmNlbnQgKiBuZXdIZWlnaHQpLFxyXG5cdFx0XHRcdF90YXJnZXRUaGluZzogcC5fdGFyZ2V0VGhpbmcsIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHNvdXJjZSB0aGluZ1xyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3UG9pbnRzO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1ha2VBZGphY2VudFBvaW50cyhwcm9wcyA9IHtwb2ludHM6W10sIG1pblk6IDAsIG1heFk6IDEwMCwgb2Zmc2V0OiAtMTAwLCBqaWdnbGU6IDB9KSB7XHJcblx0XHR2YXIgeCA9IHByb3BzLng7XHJcblx0XHR2YXIgb2Zmc2V0ID0gcHJvcHMub2Zmc2V0IHx8IC0xMDA7XHJcblx0XHR2YXIgbWluWSA9IFBvaW50cy5nZXRNaW5ZKHByb3BzLnBvaW50cyk7XHJcblx0XHR2YXIgbWF4WSA9IFBvaW50cy5nZXRNYXhZKHByb3BzLnBvaW50cyk7XHJcblxyXG5cdFx0dmFyIGFQb2ludHMgPSBQb2ludHMubWFrZVBvaW50c0F0WChwcm9wcy5wb2ludHMsIHgsIG9mZnNldCk7XHJcblx0XHRhUG9pbnRzID0gUG9pbnRzLmppZ2dsZShhUG9pbnRzLCBwcm9wcy5qaWdnbGUpO1xyXG5cdFx0YVBvaW50cyA9IFBvaW50cy5zdHJldGNoWShhUG9pbnRzLCBwcm9wcy5zdHJldGNoLCBtaW5ZLCBtYXhZKTtcclxuXHJcblx0XHRyZXR1cm4gYVBvaW50cztcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUG9pbnRzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUG9pbnRzO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xyXG5cclxuXHJcbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMuVCA9IFRpbWVyLm1ha2Uoe2NhbGxiYWNrOiB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgZGVsYXk6IHRoaXMuZGVsYXl9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0dGhpcy5ULnN0b3AoKTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIgKCkge1xyXG5cdFx0dGhpcy5jYWxsYmFjaygpO1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFB1bHNhcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFB1bHNhcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIE1lcnNlbm5lVHdpc3RlciA9IHJlcXVpcmUoJy4vbWVyc2VubmUtdHdpc3Rlci5qcycpO1xyXG5cclxudmFyIE1UUmFuZCA9IG51bGw7XHJcbnZhciBzZWVkID0gbnVsbDtcclxudmFyIFBJID0gMy4xNDE1OTI2NTM1OTtcclxudmFyIEhBTEZQSSA9IFBJLzIuMDtcclxuXHJcbmNsYXNzIFJhbmQge1xyXG5cdHN0YXRpYyBpbml0KHMpIHtcclxuXHRcdHNlZWQgPSAocyAhPT0gdW5kZWZpbmVkKSA/IHMgOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xyXG5cdFx0TVRSYW5kID0gbmV3IE1lcnNlbm5lVHdpc3RlcihzZWVkKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRTZWVkKCkge1xyXG5cdFx0cmV0dXJuIHNlZWQ7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcmFuZG9tKCkge1xyXG5cdFx0TVRSYW5kIHx8IFJhbmQuaW5pdCgpO1xyXG5cdFx0cmV0dXJuIE1UUmFuZC5yYW5kb20oKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyByYW5kSXRlbShhcnIpIHtcclxuXHRcdGlmIChhcnIgJiYgYXJyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIGFyclsgUmFuZC5yYW5kSW50KDAsIGFyci5sZW5ndGgtMSkgXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyByYW5kSXRlbXMoYXJyLCBuPTMpIHtcclxuXHRcdHZhciBpdGVtcyA9IFtdO1xyXG5cdFx0aWYgKGFycikge1xyXG5cdFx0XHRmb3IgKHZhciBpPTA7IGkgPCBuOyBpKyspIHtcclxuXHRcdFx0ICBpdGVtcy5wdXNoKFJhbmQucmFuZEl0ZW0oYXJyKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBpdGVtcztcclxuXHR9XHJcblxyXG5cdC8vIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGluY2x1ZGVkKVxyXG5cdC8vIFVzaW5nIE1hdGgucm91bmQoKSB3aWxsIGdpdmUgeW91IGEgbm9uLXVuaWZvcm0gZGlzdHJpYnV0aW9uIVxyXG5cdHN0YXRpYyByYW5kSW50KG1pbiwgbWF4KSB7XHJcblx0XHRtaW4gPSBNYXRoLmNlaWwobWlufHwwKTtcclxuXHRcdG1heCA9IE1hdGguZmxvb3IobWF4fHwxKTtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKFJhbmQucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG5cdH1cclxuXHJcblx0Ly8gUmV0dXJuIGEgcmFuZG9tIGZsb2F0IGJldHdlZW4gbWluIGFuZCBtYXggKDAgYW5kIC45OTk5OSBieSBkZWZhdWx0KVxyXG5cdHN0YXRpYyByYW5kRmxvYXQobWluPTAuMCwgbWF4PTAuOTk5OTkpIHtcclxuXHQgICAgcmV0dXJuIG1pbiArIChSYW5kLnJhbmRvbSgpICogKG1heCAtIG1pbikpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIHRydWUgc29tZSBwZXJjZW50YWdlIG9mIHRoZSB0aW1lIChkZWZhdWx0cyB0byA1MCUpXHJcblx0c3RhdGljIHJhbmRCb29sZWFuKHRocmVzaG9sZCkge1xyXG5cdFx0cmV0dXJuIFJhbmQucmFuZEludCgxLDEwMCkgPCAodGhyZXNob2xkPT09dW5kZWZpbmVkID8gNTAgOiB0aHJlc2hvbGQpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmFuZG9tIGludGVnZXIgd2l0aGluIG1heERpc3RhbmNlIG9mIHRhcmdldCAoZGlzdHJpYnV0ZWQgaW4gYSBiZWxsIGN1cnZlIGFyb3VuZCB0YXJnZXQpXHJcblx0c3RhdGljIHJhbmRDbG9zZVRvKHRhcmdldCwgbWF4RGlzdGFuY2UpIHtcclxuXHRcdC8vIHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiByYW5kTm9ybWFsKCkpOyAgICAvLyBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXIgNTAlIG9mIHJhbmdlXHJcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZFNpbjIoKSk7ICAgLy8gc3ByZWFkIG92ZXIgZW50aXJlIHJhbmdlLCBzb21ld2hhdCBjb25jZW50cmF0ZWQgdG93YXJkcyBjZW50ZXJcclxuXHRcdHJldHVybiB0YXJnZXQgKyAobWF4RGlzdGFuY2UgKiBSYW5kLnJhbmRQb3cyKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgd2l0aCBzaGFycCBjb25jZW50cmF0aW9uIGFyb3VuZCBjZW50ZXJcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdygpIHtcclxuXHRcdHJldHVybiBNYXRoLnBvdygxLjAgLSBSYW5kLnJhbmRGbG9hdCgpLCA0KTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIDAgYW5kIDEsIGRpc3RyaWJ1dGVkIHRvd2FyZCAxXHJcblx0c3RhdGljIHJhbmRTaW4oKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5zaW4oUmFuZC5yYW5kRmxvYXQoKSAqIEhBTEZQSSk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgZXhwb25lbnRpYWxseSBjbG9zZXIgdG8gMFxyXG5cdHN0YXRpYyByYW5kUG93MigpIHtcclxuXHRcdHJldHVybiBSYW5kLnJhbmRQb3coKSAtIFJhbmQucmFuZFBvdygpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgMFxyXG5cdHN0YXRpYyByYW5kTm9ybWFsKCkge1xyXG5cdFx0cmV0dXJuICgoUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpKSAtIDMuMCkgLyAzLjA7XHJcblx0fVxyXG5cclxuICAvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAtMSBhbmQgMSwgZGlzdHJpYnV0ZWQgY2xvc2VyIHRvIDBcclxuICBzdGF0aWMgcmFuZFNpbjIoKSB7XHJcbiAgICByZXR1cm4gUmFuZC5yYW5kU2luKCkgLSBSYW5kLnJhbmRTaW4oKTtcclxuICB9XHJcblxyXG4gIC8vIHJldHVybiBhcnJheSBvZiAzIGludHMsIGVhY2ggMC0yNTVcclxuICBzdGF0aWMgcmFuZFJHQigpIHtcclxuICAgIHJldHVybiBbUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KSwgUmFuZC5yYW5kSW50KDAsMjU1KV07XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmFuZFJHQnN0cihhbHBoYSkge1xyXG5cdFx0dmFyIHJnYiA9IFJhbmQucmFuZFJHQigpO1xyXG4gICAgcmV0dXJuICdyZ2JhKCcgK3JnYlswXSsgJywnICtyZ2JbMV0rICcsJyArcmdiWzJdKyAnLCAnICsgKGFscGhhIHx8IDAuOSkgKyAnKSc7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFJhbmQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSYW5kO1xyXG4iLCJcclxuLypcclxuICBJJ3ZlIHdyYXBwZWQgTWFrb3RvIE1hdHN1bW90byBhbmQgVGFrdWppIE5pc2hpbXVyYSdzIGNvZGUgaW4gYSBuYW1lc3BhY2VcclxuICBzbyBpdCdzIGJldHRlciBlbmNhcHN1bGF0ZWQuIE5vdyB5b3UgY2FuIGhhdmUgbXVsdGlwbGUgcmFuZG9tIG51bWJlciBnZW5lcmF0b3JzXHJcbiAgYW5kIHRoZXkgd29uJ3Qgc3RvbXAgYWxsIG92ZXIgZWFjaG90aGVyJ3Mgc3RhdGUuXHJcblxyXG4gIElmIHlvdSB3YW50IHRvIHVzZSB0aGlzIGFzIGEgc3Vic3RpdHV0ZSBmb3IgTWF0aC5yYW5kb20oKSwgdXNlIHRoZSByYW5kb20oKVxyXG4gIG1ldGhvZCBsaWtlIHNvOlxyXG5cclxuICB2YXIgbSA9IG5ldyBNZXJzZW5uZVR3aXN0ZXIoKTtcclxuICB2YXIgcmFuZG9tTnVtYmVyID0gbS5yYW5kb20oKTtcclxuXHJcbiAgWW91IGNhbiBhbHNvIGNhbGwgdGhlIG90aGVyIGdlbnJhbmRfe2Zvb30oKSBtZXRob2RzIG9uIHRoZSBpbnN0YW5jZS5cclxuXHJcbiAgSWYgeW91IHdhbnQgdG8gdXNlIGEgc3BlY2lmaWMgc2VlZCBpbiBvcmRlciB0byBnZXQgYSByZXBlYXRhYmxlIHJhbmRvbVxyXG4gIHNlcXVlbmNlLCBwYXNzIGFuIGludGVnZXIgaW50byB0aGUgY29uc3RydWN0b3I6XHJcblxyXG4gIHZhciBtID0gbmV3IE1lcnNlbm5lVHdpc3RlcigxMjMpO1xyXG5cclxuICBhbmQgdGhhdCB3aWxsIGFsd2F5cyBwcm9kdWNlIHRoZSBzYW1lIHJhbmRvbSBzZXF1ZW5jZS5cclxuXHJcbiAgU2VhbiBNY0N1bGxvdWdoIChiYW5rc2VhbkBnbWFpbC5jb20pXHJcbiovXHJcblxyXG4vKlxyXG4gICBBIEMtcHJvZ3JhbSBmb3IgTVQxOTkzNywgd2l0aCBpbml0aWFsaXphdGlvbiBpbXByb3ZlZCAyMDAyLzEvMjYuXHJcbiAgIENvZGVkIGJ5IFRha3VqaSBOaXNoaW11cmEgYW5kIE1ha290byBNYXRzdW1vdG8uXHJcblxyXG4gICBCZWZvcmUgdXNpbmcsIGluaXRpYWxpemUgdGhlIHN0YXRlIGJ5IHVzaW5nIGluaXRfZ2VucmFuZChzZWVkKVxyXG4gICBvciBpbml0X2J5X2FycmF5KGluaXRfa2V5LCBrZXlfbGVuZ3RoKS5cclxuXHJcbiAgIENvcHlyaWdodCAoQykgMTk5NyAtIDIwMDIsIE1ha290byBNYXRzdW1vdG8gYW5kIFRha3VqaSBOaXNoaW11cmEsXHJcbiAgIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblxyXG4gICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcclxuICAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zXHJcbiAgIGFyZSBtZXQ6XHJcblxyXG4gICAgIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbiAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG5cclxuICAgICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxyXG4gICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcclxuICAgICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG5cclxuICAgICAzLiBUaGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgbm90IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlXHJcbiAgICAgICAgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuXHJcbiAgICAgICAgcGVybWlzc2lvbi5cclxuXHJcbiAgIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcclxuICAgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVFxyXG4gICBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcclxuICAgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SXHJcbiAgIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxyXG4gICBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sXHJcbiAgIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUlxyXG4gICBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GXHJcbiAgIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcbiAgIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xyXG4gICBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuXHJcblxyXG4gICBBbnkgZmVlZGJhY2sgaXMgdmVyeSB3ZWxjb21lLlxyXG4gICBodHRwOi8vd3d3Lm1hdGguc2NpLmhpcm9zaGltYS11LmFjLmpwL35tLW1hdC9NVC9lbXQuaHRtbFxyXG4gICBlbWFpbDogbS1tYXQgQCBtYXRoLnNjaS5oaXJvc2hpbWEtdS5hYy5qcCAocmVtb3ZlIHNwYWNlKVxyXG4qL1xyXG5cclxudmFyIE1lcnNlbm5lVHdpc3RlciA9IGZ1bmN0aW9uKHNlZWQpIHtcclxuICBpZiAoc2VlZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBzZWVkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgfVxyXG4gIC8qIFBlcmlvZCBwYXJhbWV0ZXJzICovXHJcbiAgdGhpcy5OID0gNjI0O1xyXG4gIHRoaXMuTSA9IDM5NztcclxuICB0aGlzLk1BVFJJWF9BID0gMHg5OTA4YjBkZjsgICAvKiBjb25zdGFudCB2ZWN0b3IgYSAqL1xyXG4gIHRoaXMuVVBQRVJfTUFTSyA9IDB4ODAwMDAwMDA7IC8qIG1vc3Qgc2lnbmlmaWNhbnQgdy1yIGJpdHMgKi9cclxuICB0aGlzLkxPV0VSX01BU0sgPSAweDdmZmZmZmZmOyAvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cclxuXHJcbiAgdGhpcy5tdCA9IG5ldyBBcnJheSh0aGlzLk4pOyAvKiB0aGUgYXJyYXkgZm9yIHRoZSBzdGF0ZSB2ZWN0b3IgKi9cclxuICB0aGlzLm10aT10aGlzLk4rMTsgLyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXHJcblxyXG4gIHRoaXMuaW5pdF9nZW5yYW5kKHNlZWQpO1xyXG59O1xyXG5cclxuLyogaW5pdGlhbGl6ZXMgbXRbTl0gd2l0aCBhIHNlZWQgKi9cclxuTWVyc2VubmVUd2lzdGVyLnByb3RvdHlwZS5pbml0X2dlbnJhbmQgPSBmdW5jdGlvbihzZWVkKSB7XHJcbiAgdGhpcy5tdFswXSA9IHNlZWQgPj4+IDA7XHJcbiAgZm9yICh0aGlzLm10aT0xOyB0aGlzLm10aTx0aGlzLk47IHRoaXMubXRpKyspIHtcclxuICAgICAgdmFyIHMgPSB0aGlzLm10W3RoaXMubXRpLTFdIF4gKHRoaXMubXRbdGhpcy5tdGktMV0gPj4+IDMwKTtcclxuICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPSAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTgxMjQzMzI1MykgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE4MTI0MzMyNTMpICsgdGhpcy5tdGk7XHJcbiAgICAgIC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xyXG4gICAgICAvKiBJbiB0aGUgcHJldmlvdXMgdmVyc2lvbnMsIE1TQnMgb2YgdGhlIHNlZWQgYWZmZWN0ICAgKi9cclxuICAgICAgLyogb25seSBNU0JzIG9mIHRoZSBhcnJheSBtdFtdLiAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgIC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xyXG4gICAgICB0aGlzLm10W3RoaXMubXRpXSA+Pj49IDA7XHJcbiAgICAgIC8qIGZvciA+MzIgYml0IG1hY2hpbmVzICovXHJcbiAgfVxyXG59O1xyXG5cclxuLyogaW5pdGlhbGl6ZSBieSBhbiBhcnJheSB3aXRoIGFycmF5LWxlbmd0aCAqL1xyXG4vKiBpbml0X2tleSBpcyB0aGUgYXJyYXkgZm9yIGluaXRpYWxpemluZyBrZXlzICovXHJcbi8qIGtleV9sZW5ndGggaXMgaXRzIGxlbmd0aCAqL1xyXG4vKiBzbGlnaHQgY2hhbmdlIGZvciBDKyssIDIwMDQvMi8yNiAqL1xyXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLmluaXRfYnlfYXJyYXkgPSBmdW5jdGlvbihpbml0X2tleSwga2V5X2xlbmd0aCkge1xyXG4gIHZhciBpLCBqLCBrO1xyXG4gIHRoaXMuaW5pdF9nZW5yYW5kKDE5NjUwMjE4KTtcclxuICBpPTE7IGo9MDtcclxuICBrID0gKHRoaXMuTj5rZXlfbGVuZ3RoID8gdGhpcy5OIDoga2V5X2xlbmd0aCk7XHJcbiAgZm9yICg7IGs7IGstLSkge1xyXG4gICAgbGV0IHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMCk7XHJcbiAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpICsgaW5pdF9rZXlbal0gKyBqOyAvKiBub24gbGluZWFyICovXHJcbiAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cclxuICAgIGkrKzsgaisrO1xyXG4gICAgaWYgKGk+PXRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4tMV07IGk9MTsgfVxyXG4gICAgaWYgKGo+PWtleV9sZW5ndGgpIHsgaj0wOyB9XHJcbiAgfVxyXG4gIGZvciAoaz10aGlzLk4tMTsgazsgay0tKSB7XHJcbiAgICBsZXQgcyA9IHRoaXMubXRbaS0xXSBeICh0aGlzLm10W2ktMV0gPj4+IDMwKTtcclxuICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpIC0gaTsgLyogbm9uIGxpbmVhciAqL1xyXG4gICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXHJcbiAgICBpKys7XHJcbiAgICBpZiAoaT49dGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTi0xXTsgaT0xOyB9XHJcbiAgfVxyXG5cclxuICB0aGlzLm10WzBdID0gMHg4MDAwMDAwMDsgLyogTVNCIGlzIDE7IGFzc3VyaW5nIG5vbi16ZXJvIGluaXRpYWwgYXJyYXkgKi9cclxufTtcclxuXHJcbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMHhmZmZmZmZmZl0taW50ZXJ2YWwgKi9cclxuTWVyc2VubmVUd2lzdGVyLnByb3RvdHlwZS5nZW5yYW5kX2ludDMyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHk7XHJcbiAgdmFyIG1hZzAxID0gbmV3IEFycmF5KDB4MCwgdGhpcy5NQVRSSVhfQSk7XHJcbiAgLyogbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMSAqL1xyXG5cclxuICBpZiAodGhpcy5tdGkgPj0gdGhpcy5OKSB7IC8qIGdlbmVyYXRlIE4gd29yZHMgYXQgb25lIHRpbWUgKi9cclxuICAgIHZhciBraztcclxuXHJcbiAgICBpZiAodGhpcy5tdGkgPT09IHRoaXMuTisxKSB7ICAvKiBpZiBpbml0X2dlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLCAqL1xyXG4gICAgICB0aGlzLmluaXRfZ2VucmFuZCg1NDg5KTsgLyogYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkICovXHJcbiAgICB9XHJcbiAgICBmb3IgKGtrPTA7a2s8dGhpcy5OLXRoaXMuTTtraysrKSB7XHJcbiAgICAgIHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xyXG4gICAgICB0aGlzLm10W2trXSA9IHRoaXMubXRba2srdGhpcy5NXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xyXG4gICAgfVxyXG4gICAgZm9yICg7a2s8dGhpcy5OLTE7a2srKykge1xyXG4gICAgICB5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcclxuICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trKyh0aGlzLk0tdGhpcy5OKV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcclxuICAgIH1cclxuICAgIHkgPSAodGhpcy5tdFt0aGlzLk4tMV0mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFswXSZ0aGlzLkxPV0VSX01BU0spO1xyXG4gICAgdGhpcy5tdFt0aGlzLk4tMV0gPSB0aGlzLm10W3RoaXMuTS0xXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xyXG5cclxuICAgIHRoaXMubXRpID0gMDtcclxuICB9XHJcblxyXG4gIHkgPSB0aGlzLm10W3RoaXMubXRpKytdO1xyXG5cclxuICAvKiBUZW1wZXJpbmcgKi9cclxuICB5IF49ICh5ID4+PiAxMSk7XHJcbiAgeSBePSAoeSA8PCA3KSAmIDB4OWQyYzU2ODA7XHJcbiAgeSBePSAoeSA8PCAxNSkgJiAweGVmYzYwMDAwO1xyXG4gIHkgXj0gKHkgPj4+IDE4KTtcclxuXHJcbiAgcmV0dXJuIHkgPj4+IDA7XHJcbn07XHJcblxyXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4N2ZmZmZmZmZdLWludGVydmFsICovXHJcbk1lcnNlbm5lVHdpc3Rlci5wcm90b3R5cGUuZ2VucmFuZF9pbnQzMSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCk+Pj4xKTtcclxufTtcclxuXHJcbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMV0tcmVhbC1pbnRlcnZhbCAqL1xyXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLmdlbnJhbmRfcmVhbDEgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk1LjApO1xyXG4gIC8qIGRpdmlkZWQgYnkgMl4zMi0xICovXHJcbn07XHJcblxyXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDEpLXJlYWwtaW50ZXJ2YWwgKi9cclxuTWVyc2VubmVUd2lzdGVyLnByb3RvdHlwZS5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk2LjApO1xyXG4gIC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xyXG59O1xyXG5cclxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiAoMCwxKS1yZWFsLWludGVydmFsICovXHJcbk1lcnNlbm5lVHdpc3Rlci5wcm90b3R5cGUuZ2VucmFuZF9yZWFsMyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCkgKyAwLjUpKigxLjAvNDI5NDk2NzI5Ni4wKTtcclxuICAvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cclxufTtcclxuXHJcbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMSkgd2l0aCA1My1iaXQgcmVzb2x1dGlvbiovXHJcbk1lcnNlbm5lVHdpc3Rlci5wcm90b3R5cGUuZ2VucmFuZF9yZXM1MyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhPXRoaXMuZ2VucmFuZF9pbnQzMigpPj4+NSwgYj10aGlzLmdlbnJhbmRfaW50MzIoKT4+PjY7XHJcbiAgcmV0dXJuKGEqNjcxMDg4NjQuMCtiKSooMS4wLzkwMDcxOTkyNTQ3NDA5OTIuMCk7XHJcbn07XHJcblxyXG4vKiBUaGVzZSByZWFsIHZlcnNpb25zIGFyZSBkdWUgdG8gSXNha3UgV2FkYSwgMjAwMi8wMS8wOSBhZGRlZCAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXJzZW5uZVR3aXN0ZXI7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBCb3ggPSByZXF1aXJlKCcuLi9Cb3gvQm94LmpzJyk7XHJcblxyXG4vKipcclxuICogIHcsIGgsIGQsIHNob3dPdXRlclxyXG5cclxuIFx0UGFyZW50IGVsZW1lbnQgbXVzdCBoYXZlIHBlcnNwZWN0aXZlIHNldCB0byBzb21lIHBpeGVsIHZhbHVlIG9yIHJvb20gd2lsbCBiZSBmbGF0LlxyXG5cclxuXHR2YXIgciA9IFRoaW5nLlJvb20ubWFrZSh7XHJcblx0XHR4OjEwMDAsIHk6LTUwMCxcclxuXHRcdHc6MTAwMCwgaDozNjI1LFxyXG5cdFx0ZDozMDAwLFxyXG5cdFx0c2hvd091dGVyOiBmYWxzZVxyXG5cdH0pO1xyXG4gKi9cclxuY2xhc3MgUm9vbSBleHRlbmRzIEJveCB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdHc6IDE1MDAsXHJcblx0XHRcdGg6IDEwMDAsXHJcblx0XHRcdGQ6ICA4MDAsXHJcblx0XHRcdHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxyXG5cdFx0XHRzaG93T3V0ZXI6IGZhbHNlXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcblx0XHRwcm9wcy5vdmVyZmxvdyA9IHVuZGVmaW5lZDtcclxuXHRcdHRoaXMudyA9IHByb3BzLnc7XHJcblx0XHR0aGlzLmggPSBwcm9wcy5oO1xyXG5cdFx0dGhpcy5kID0gcHJvcHMuZDtcclxuXHRcdHRoaXMud2FsbHMgPSB7fTtcclxuXHJcblx0XHRzdXBlci5pbml0KHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnR5cGUgPSAnUm9vbSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMubWFrZVJvb20odGhpcy4kZWxlbWVudCk7XHJcblx0fVxyXG5cclxuXHRtYWtlUm9vbSgpIHtcclxuXHRcdHZhciB3YWxscyA9IFtdO1xyXG5cdFx0dmFyIGhhbGZIZWlnaHQgPSB0aGlzLmgvMjtcclxuXHRcdHZhciBoYWxmV2lkdGggPSB0aGlzLncvMjtcclxuXHRcdHZhciBoYWxmRGVwdGggPSB0aGlzLmQvMjtcclxuXHJcblx0XHQvLyB0aGlzIGJveCBpcyB0aGUgb3V0ZXIgd3JhcHBlciBkaXYgYXJvdW5kIGFsbCB0aGUgd2FsbHMgLSB3aXRoIGl0cyBvd24gcGVyc3BlY3RpdmVcclxuXHRcdC8vIE5PVEU6IGRvIG5vdCBwdXQgXCJvdmVyZmxvdzogaGlkZGVuXCIgb24gdGhpcyBlbGVtZW50LCBpdCB3aWxsIGJvcmsgWiBheGlzIGxheWVyaW5nXHJcblx0XHR2YXIgcm9vbSA9IHRoaXM7ICAvL0JveC5tYWtlKHtcclxuXHRcdC8vIFx0d2lkdGg6ICcxMDAlJyxcclxuXHRcdC8vIFx0aGVpZ2h0OiAnMTAwJScsXHJcblx0XHQvLyBcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0Ly8gXHR0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJ1xyXG5cdFx0Ly8gfSk7XHJcblxyXG5cdFx0Ly8gSW5uZXIgZmFjaW5nIHdhbGxzXHJcblx0XHQvLyB3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdmcm9udCcsIHtcclxuXHRcdC8vIFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknLFxyXG5cdFx0Ly8gXHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdC8vIFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0Ly8gXHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAxODBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKGhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdC8vIH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdiYWNrJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoICogMC45OTcpICsgJ3B4ICknICAgIC8vIHB1c2ggYmFjayBzbGlnaHRseSBsZXNzIHRoYW4gZnVsbCBhbW91bnQgKDAuOTk3KSBvciB3ZSBnZXQgYSBzbGlnaHQgZ2FwIGF0IGNvcm5lcnNcclxuXHRcdH0pICk7XHJcblx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdyaWdodCcsIHtcclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgyNTUsIDAsIDU1LCAxKScsXHJcblx0XHRcdHdpZHRoOiB0aGlzLmQgKyAncHgnLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2xlZnQnLCB7XHJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDAsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWSggOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC1oYWxmRGVwdGgpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgndG9wJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDU1LCAyNTUsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtKGhhbGZIZWlnaHQgLSAoaGFsZkhlaWdodC1oYWxmRGVwdGgpKSAqIDAuOTk3KSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2JvdHRvbScsIHtcclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAyNTUsIDAsIDEpJyxcclxuXHRcdFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHRcdGhlaWdodDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZkhlaWdodCArIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICogMC45OTcpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cclxuXHRcdC8vIE91dGVyIGZhY2luZyB3YWxsc1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2hvd091dGVyKSB7XHJcblx0XHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dGZyb250Jywge1xyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCknLFxyXG5cdFx0XHRcdHdpZHRoOiB0aGlzLncgKyAncHgnLFxyXG5cdFx0XHRcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVaKCAnICsgKGhhbGZEZXB0aCkgKyAncHggKSdcclxuXHRcdFx0fSkgKTtcclxuXHRcdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0YmFjaycsIHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDEpJyxcclxuXHRcdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTE4MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdFx0fSkgKTtcclxuXHRcdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0cmlnaHQnLCB7XHJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgxMDAsIDEwMCwgMTAwLCAxKScsXHJcblx0XHRcdFx0d2lkdGg6IHRoaXMuZCArICdweCcsXHJcblx0XHRcdFx0aGVpZ2h0OiB0aGlzLmggKyAncHgnLFxyXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgoaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdFx0fSkgKTtcclxuXHRcdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0bGVmdCcsIHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDEwMCwgMTAwLCAxMDAsIDEpJyxcclxuXHRcdFx0XHR3aWR0aDogdGhpcy5kICsgJ3B4JyxcclxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuaCArICdweCcsXHJcblx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWSggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmV2lkdGggLSAoaGFsZldpZHRoLWhhbGZEZXB0aCkpICsgJ3B4ICknXHJcblx0XHRcdH0pICk7XHJcblx0XHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dHRvcCcsIHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDEwMCwgMTAwLCAyMDAsIDEpJyxcclxuXHRcdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXHJcblx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgaGFsZkRlcHRoICsgJ3B4ICknXHJcblx0XHRcdH0pICk7XHJcblx0XHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dGJvdHRvbScsIHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDEwMCwgMjAwLCAxMDAsIDEpJyxcclxuXHRcdFx0XHR3aWR0aDogdGhpcy53ICsgJ3B4JyxcclxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuZCArICdweCcsXHJcblx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmSGVpZ2h0ICsgKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkgKyAncHggKSdcclxuXHRcdFx0fSkgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjb3B5IHdhbGxzIGFycmF5IHRvIG9iamVjdFxyXG5cdFx0Zm9yICh2YXIgaT0wOyBpIDwgd2FsbHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy53YWxsc1sgd2FsbHNbaV0ud2hpY2ggXSA9IHdhbGxzW2ldO1xyXG5cdFx0XHR0aGlzW3dhbGxzW2ldLndoaWNoXSA9IHdhbGxzW2ldO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvb20uYWRkKHdhbGxzKTtcclxuXHRcdC8vIHRoaXMuYWRkKHJvb20pO1xyXG5cdFx0dGhpcy53YWxsc0EgPSB3YWxscztcclxuXHRcdC8vIHRoaXMucm9vbSA9IHJvb207XHJcblx0fVxyXG5cclxuXHRtYWtlV2FsbCh3aGljaCwgY3NzVmFscykge1xyXG5cdFx0dmFyIGRlZmF1bHRDU1MgPSB7XHJcblx0XHRcdGRpc3BsYXk6ICdibG9jaycsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHRiYWNrZmFjZVZpc2liaWxpdHk6ICdoaWRkZW4nLFxyXG5cdFx0XHRvdmVyZmxvdzogJ2hpZGRlbidcclxuXHRcdH07XHJcblx0XHR2YXIgd2FsbCA9IFRoaW5nLkJveC5tYWtlKCQuZXh0ZW5kKHt9LCBkZWZhdWx0Q1NTLCBjc3NWYWxzKSk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKCd3YWxsJyk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKHdoaWNoKTtcclxuXHRcdHdhbGwud2hpY2ggPSB3aGljaDtcclxuXHRcdHJldHVybiB3YWxsO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhSb29tKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUm9vbTtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFRleHRQYW5lIGV4dGVuZHMgVGhpbmcge1xyXG4gICAgaW5pdCAocHJvcHMpIHtcclxuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgVmVyZGFuYSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICAgICAgICBmb250U2l6ZTogJzI0cHgnLFxyXG4gICAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgICAgICAgICAgY29sb3I6ICdyZ2IoMjAwLCAyMDAsIDIwMCknLFxyXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgIHc6IDEwMCxcclxuICAgICAgICAgICAgaDogMTAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgICAgICB0aGlzLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gJ1RleHRQYW5lJztcclxuICAgICAgICB0aGlzLnRleHQgPSBwcm9wcy50ZXh0O1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG4gICAgfVxyXG5cclxuICAgIGZpbGxUZXh0ICgpIHtcclxuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbWF4ID0gMTAwMDtcclxuICAgICAgICB2YXIgJHNwYW4gPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcbiAgICAgICAgdmFyIHNwYW5IZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAvLyBlbGVtZW50IGhhcyB0byBiZSBhcHBlbmRlZCB0byBib2R5IHByaW9yLCBvciBzcGFuSGVpZ2h0IHdpbGwgYmUgMFxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYXBwZW5kKCRzcGFuKTtcclxuICAgICAgICB3aGlsZSAoc3BhbkhlaWdodCA8IG1heEhlaWdodCAmJiBtYXgtLSA+IDApIHtcclxuICAgICAgICAgICAgJHNwYW4uYXBwZW5kKHRoaXMudGV4dCk7XHJcbiAgICAgICAgICAgIHNwYW5IZWlnaHQgPSAkc3Bhbi5oZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyICgpIHtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmZpbGxUZXh0KHRoaXMudGV4dCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblRoaW5nLmFkZENsYXNzKFRleHRQYW5lKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dFBhbmU7XHJcbiIsInZhciBlbGVtZW50Q291bnRlciA9IDA7XHJcblxyXG5jbGFzcyBUaGluZyB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHRoaXMuaW5pdChwcm9wcyk7XHJcbiAgfVxyXG5cclxuICBpbml0IChwcm9wcyA9IHt9KSB7XHJcbiAgICB0aGlzLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnVGhpbmcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy5hZGRNYXNrKHByb3BzLm1hc2spOyAgLy8gbWFrZSB0aGlzIHBhcnQgb2YgY29udmVydFRvQ1NTKClcclxuICB9XHJcblxyXG4gIC8vIFNldCBlc3NlbnRpYWwgZGVmYXVsdCBwcm9wZXJ0aWVzIG9uICd0aGlzJyAoeCx5LHosdyxoKVxyXG4gIC8vIEFkZGl0aW9uYWwgcHJvcGVydGllcyBpbiB0aGUgcHJvcHMgb2JqZWN0IGFyZSBhc3N1bWVkIHRvIGJlIENTU1xyXG4gIHNldERlZmF1bHRQcm9wcyAocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgLy8gZGVmYXVsdCB0byBhYnNvbHV0ZSBwb3NpdGlvbmluZ1xyXG4gICAgcHJvcHMucG9zaXRpb24gPSBwcm9wcy5wb3NpdGlvbiB8fCAnYWJzb2x1dGUnO1xyXG5cclxuICAgIC8vIGtlZXAgdGhlIHByb3BzIG9iamVjdCBvbiBpbnN0YW5jZVxyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xyXG5cclxuICAgIHRoaXMucmVuZGVyT25DZW50ZXIgPSBwcm9wcy5yZW5kZXJPbkNlbnRlciB8fCBmYWxzZTtcclxuICAgIHRoaXMucm90YXRpb24gPSBwcm9wcy5yb3RhdGUgfHwgbnVsbDtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBwcm9wcy5zY2FsZSB8fCAxO1xyXG5cclxuICAgIC8vIHBvc2l0aW9uIGlzIHRoZSBnaXZlbiB4LHkseiBvciAwLDAsMCAodGhpcyBiZWNvbWVzIENTUyB0cmFuc2xhdGUzZCgpKVxyXG4gICAgdGhpcy54ID0gcHJvcHMueCB8fCAwO1xyXG4gICAgdGhpcy55ID0gcHJvcHMueSB8fCAwO1xyXG4gICAgdGhpcy56ID0gcHJvcHMueiB8fCAwO1xyXG5cclxuICAgIC8vIGRpbWVuc2lvbnMgYXJlIHRoZSBnaXZlbiB3LGggb3IgdW5kZWZpbmVkICh0aGlzIGJlY29tZXMgQ1NTIHdpZHRoL2hlaWdodClcclxuICAgIHRoaXMudyA9IHByb3BzLnc7XHJcbiAgICB0aGlzLmggPSBwcm9wcy5oO1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgcGFyZW50RWxlbWVudC5hcHBlbmQodGhpcy4kZWxlbWVudCk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhUaGluZy5jb252ZXJ0VG9DU1ModGhpcy5wcm9wcykpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgZWxlbWVudCBmcm9tIGRvbSBhbmQgbnVsbCBpdCBvdXRcclxuICB1blJlbmRlciAoKSB7XHJcbiAgICBpZiAodGhpcy4kZWxlbWVudCkge1xyXG4gICAgICB0aGlzLiRlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICB0aGlzLiRlbGVtZW50ID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldERpbWVuc2lvbnMgKCkge1xyXG4gICAgcmV0dXJuIHt3OiB0aGlzLiRlbGVtZW50LndpZHRoKCksIGg6IHRoaXMuJGVsZW1lbnQuaGVpZ2h0KCl9O1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm91bmRpbmdCb3ggKCkge1xyXG4gICAgLy8gcmVsYXRpdmUgdG8gcGFnZVxyXG4gICAgdmFyIHNjcm9sbHRvcCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xyXG4gICAgdmFyIHNjcm9sbGxlZnQgPSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCk7XHJcbiAgICB2YXIgYm91bmRzID0gdGhpcy4kZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IGJvdW5kcy5sZWZ0K3Njcm9sbGxlZnQsXHJcbiAgICAgIHk6IGJvdW5kcy50b3Arc2Nyb2xsdG9wLFxyXG4gICAgICB3OiBib3VuZHMud2lkdGgsXHJcbiAgICAgIGg6IGJvdW5kcy5oZWlnaHQsXHJcbiAgICAgIGJvdHRvbTogYm91bmRzLmJvdHRvbStzY3JvbGx0b3AsXHJcbiAgICAgIHJpZ2h0OiBib3VuZHMucmlnaHQrc2Nyb2xsbGVmdFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIGdldCBwb3NpdGlvbiBvZiBlbGVtZW50IHJlbGF0aXZlIHRvIHBhZ2VcclxuICAvLyBvbmx5IHdvcmtzIGFmdGVyIGVsZW1lbnQgaXMgcmVuZGVyZWQgb24gcGFnZVxyXG4gIGdldFBvc2l0aW9uICgpIHtcclxuICAgIHZhciB4eSA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XHJcbiAgICB2YXIgeiA9IHRoaXMuJGVsZW1lbnQuY3NzKCd6LWluZGV4Jyk7XHJcbiAgICB6ID0geiA/IHBhcnNlSW50KHopIDogdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIFt4eS5sZWZ0LCB4eS50b3AsIHpdO1xyXG4gIH1cclxuXHJcbiAgZ2V0UG9zICgpIHtcclxuICAgIGxldCB4ID0gdGhpcy54O1xyXG4gICAgbGV0IHkgPSB0aGlzLnk7XHJcbiAgICBsZXQgeiA9IHRoaXMuejtcclxuICAgIGlmICh0aGlzLnJlbmRlck9uQ2VudGVyKSB7XHJcbiAgICAgIHggLT0gKHRoaXMudyB8fCAwKS8yO1xyXG4gICAgICB5IC09ICh0aGlzLmggfHwgMCkvMjtcclxuICAgIH1cclxuICAgIHJldHVybiB7eCwgeSwgen07XHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm4gdGhlIGVsZW1lbnQncyBDU1MgdHJhbnNmb3JtIG1hdHJpeCBhcyBhcnJheSBvZiA2IG9yIDE2IHZhbHVlcy5cclxuICAvLyA2IHZhbHVlcyBmb3IgYSAyRCBtYXRyaXggKG5vIHJvdGF0aW9uIG9yIG9ubHkgcm90YXRlZCBhcm91bmQgWiBheGlzKSxcclxuICAvLyAxNiB2YWx1ZXMgZm9yIGEgM0QgbWF0cml4LlxyXG4gIGdldENTU1RyYW5zZm9ybSAoKSB7XHJcbiAgICB2YXIgbVN0ciA9IHRoaXMuJGVsZW1lbnQuY3NzKCd0cmFuc2Zvcm0nKS5tYXRjaCgvKC0/W1xcZFxcLl0rKVssKV0vZyk7XHJcbiAgICBpZiAoIW1TdHIpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG1WYWwgPSBbXTtcclxuICAgIGZvciAodmFyIGk9MDsgaSA8IG1TdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbVZhbFtpXSA9IHBhcnNlRmxvYXQobVN0cltpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbVZhbDtcclxuICB9XHJcblxyXG4gIC8vIHJldHVybiBaIGF4aXMgcm90YXRpb24gZnJvbSA2eDYgbWF0cml4XHJcbiAgLy8gdG9kbzogM2QgbWF0cml4IGh0dHA6Ly9uZ2hpYWhvLmNvbS8/cGFnZV9pZD04NDZcclxuICAvLyBodHRwczovL2Nzcy10cmlja3MuY29tL2dldC12YWx1ZS1vZi1jc3Mtcm90YXRpb24tdGhyb3VnaC1qYXZhc2NyaXB0L1xyXG4gIGdldFJvdGF0aW9uICgpIHtcclxuICAgIHZhciByID0gdGhpcy5yb3RhdGlvbiB8fCB7eDowLCB5OjAsIHo6MH07XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiByLnggfHwgMCxcclxuICAgICAgeTogci55IHx8IDAsXHJcbiAgICAgIHo6IHIueiB8fCAwXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0VHJhbnNsYXRpb24gKCkge1xyXG4gICAgcmV0dXJuIHt4OiB0aGlzLngsIHk6IHRoaXMueSwgejogdGhpcy56fTtcclxuICB9XHJcblxyXG4gIC8vIEluY3JlbWVudCB0aGUgY3VycmVudCByb3RhdGlvbiBieSB0aGUgZ2l2ZW4gZGVncmVlcy5cclxuICAvLyBFeHBlY3RpbmcgJ2F4ZXMnIHRvIGJlIHt4OiA5MCwgeTogMCwgejogNDV9XHJcbiAgLy8gQXhlcyBhcmUgaW4gdGhlIG9yZGVyIHRoZXkgd2lsbCBiZSBhcHBsaWVkLCBhbmQgY2FuIGJlIGp1c3Qgb25lIGUuZy46XHJcbiAgLy8ge3o6MTgwLCB5OjkwLCB4OjQ1fSAgb3IgIHt5OjQ1LCB4OjkwfSAgIG9yICAge3o6IDE4MH1cclxuICByb3RhdGUgKGF4ZXMpIHtcclxuICAgIGlmIChheGVzKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgYXhlcyAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICBheGVzID0ge3g6MCwgeTowLCB6OmF4ZXN9OyAgICAvLyBhc3N1bWluZyBheGVzIGlzIGEgbnVtYmVyIGhlcmVcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbiB8fCB7eDowLCB5OjAsIHo6MH07XHJcbiAgICAgIGF4ZXMueCAmJiAodGhpcy5yb3RhdGlvbi54ICs9IGF4ZXMueCk7XHJcbiAgICAgIGF4ZXMueSAmJiAodGhpcy5yb3RhdGlvbi55ICs9IGF4ZXMueSk7XHJcbiAgICAgIGF4ZXMueiAmJiAodGhpcy5yb3RhdGlvbi56ICs9IGF4ZXMueik7XHJcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHJvdGF0ZVRvIChheGVzKSB7XHJcbiAgICBpZiAoYXhlcykge1xyXG4gICAgICB0aGlzLnJvdGF0aW9uID0ge3g6MCwgeTowLCB6OjB9OyAgLy8gcmVzZXQgcm90YXRpb25cclxuICAgICAgdGhpcy5yb3RhdGUoYXhlcyk7XHJcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNjYWxlIChmYWN0b3IpIHtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgKz0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGVUbyAoZmFjdG9yKSB7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gZmFjdG9yO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNsYXRlICh4LCB5LCB6KSB7XHJcbiAgICB0aGlzLnggKz0geCB8fCAwO1xyXG4gICAgdGhpcy55ICs9IHkgfHwgMDtcclxuICAgIHRoaXMueiArPSB6IHx8IDA7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGVUbyAoeCwgeSwgeikge1xyXG4gICAgdGhpcy54ID0geCB8fCAwO1xyXG4gICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgdGhpcy56ID0geiB8fCAwO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNmb3JtICgpIHtcclxuICAgIHRoaXMuY3NzKHtcclxuICAgICAgdHJhbnNmb3JtOiBUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGVGYWN0b3IsIHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMucmVuZGVyT25DZW50ZXIsIHRoaXMudywgdGhpcy5oKVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGNzcyAocHJvcHMpIHtcclxuICAgIC8vIGFkZCBuZXcgY3NzIHByb3BlcnRpZXMgdG8gdGhpcy5wcm9wcyBvYmplY3RcclxuICAgIHRoaXMucHJvcHMgPSAkLmV4dGVuZCh0aGlzLnByb3BzLCBwcm9wcyk7XHJcbiAgICAvLyBzZXQgY3NzIHByb3BlcnRpZXMgb24gdGhlIGh0bWwgZWxlbWVudFxyXG4gICAgdGhpcy4kZWxlbWVudC5jc3MocHJvcHMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBodG1sICgpIHtcclxuICAgIHJldHVybiAnPGRpdj48L2Rpdj4nO1xyXG4gIH1cclxuXHJcbiAgLy8gU2l6ZSBlbGVtZW50IHRvIGZpbGwgcGFyZW50IHdpdGggYSBzcXVhcmUgYXNwZWN0IHJhdGlvXHJcbiAgZmlsbFBhcmVudCAoc3RyZXRjaD1mYWxzZSkge1xyXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgIGxldCBwYXJlbnRXID0gdGhpcy5wYXJlbnQuJGVsZW1lbnQud2lkdGgoKTtcclxuICAgICAgbGV0IHBhcmVudEggPSB0aGlzLnBhcmVudC4kZWxlbWVudC5oZWlnaHQoKTtcclxuICAgICAgbGV0IHBhcmVudEVsZW1lbnRTaXplID0gTWF0aC5tYXgocGFyZW50VywgcGFyZW50SCk7XHJcbiAgICAgIHRoaXMuY3NzKHtcclxuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgICBsZWZ0OiAnMHB4JywgdG9wOiAnMHB4JyxcclxuICAgICAgICB3aWR0aDogc3RyZXRjaCA/IHBhcmVudFcgOiBwYXJlbnRFbGVtZW50U2l6ZSxcclxuICAgICAgICBoZWlnaHQ6IHN0cmV0Y2ggPyBwYXJlbnRIIDogcGFyZW50RWxlbWVudFNpemVcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIE1hc2sgdGhlIGNvbnRlbnRzIG9mIHRoaXMgZGl2LlxyXG4gIC8vIERlZmF1bHRzIHRvIGEgc2luZ2xlIG1hc2sgaW1hZ2UgY292ZXJpbmcgZW50aXJlIGVsZW1lbnQsIG5vIHJlcGVhdC5cclxuICAvL1xyXG4gIC8vIEV4YW1wbGVzOlxyXG4gIC8vIGFkZE1hc2soJ3VybChpbWcvbXlfbWFza19pbWFnZS5wbmcpJylcclxuICAvLyBhZGRNYXNrKCdyYWRpYWwtZ3JhZGllbnQod2hpdGUgMjUlLCB0cmFuc3BhcmVudCAyNiUpJylcclxuICAvLyBhZGRNYXNrKHtpbWFnZTogJ3VybChpbWcvbXlfbWFza19pbWFnZS5wbmcnKSwgcmVwZWF0OiAncmVwZWF0Jywgc2l6ZTogJzEwJSAxMCUnfSlcclxuICAvL1xyXG4gIGFkZE1hc2sgKG1hc2tQcm9wcykge1xyXG4gICAgaWYgKG1hc2tQcm9wcykge1xyXG4gICAgICBpZiAodHlwZW9mIG1hc2tQcm9wcyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBtYXNrUHJvcHMgPSB7aW1hZ2U6IG1hc2tQcm9wc307XHJcbiAgICAgIH1cclxuICAgICAgdmFyIG1hc2tDU1Nwcm9wcyA9IHtcclxuICAgICAgICBXZWJraXRNYXNrSW1hZ2U6IG1hc2tQcm9wcy5pbWFnZSxcclxuICAgICAgICBXZWJraXRNYXNrUmVwZWF0OiBtYXNrUHJvcHMucmVwZWF0IHx8ICduby1yZXBlYXQnLFxyXG4gICAgICAgIFdlYmtpdE1hc2tTaXplOiBtYXNrUHJvcHMuc2l6ZSB8fCAnMTAwJSAxMDAlJyxcclxuICAgICAgICBXZWJraXRNYXNrUG9zaXRpb246IG1hc2tQcm9wcy5wb3NpdGlvbiB8fCAnNTAlIDUwJScsXHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuY3NzKG1hc2tDU1Nwcm9wcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlIChwcm9wcykge1xyXG4gICAgdmFyIGNscyA9IHRoaXM7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY2xzKHByb3BzKTtcclxuICAgIHJldHVybiBpbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDbGFzcyAoY2xzKSB7XHJcbiAgICBUaGluZy5jbGFzc2VzID0gVGhpbmcuY2xhc3NlcyB8fCB7fTtcclxuICAgIFRoaW5nW2Nscy5uYW1lXSA9IFRoaW5nLmNsYXNzZXNbY2xzLm5hbWVdID0gY2xzO1xyXG4gIH1cclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyBDU1MgbWFuYWdlbWVudCBmdW5jdGlvbnNcclxuXHJcbiAgLy8gUmV0dXJuIHRoZSBwcm9wcyBjb252ZXJ0ZWQgdG8gbGVnaXQgQ1NTIHByb3BlcnRpZXMuXHJcbiAgLy8gTW9zdCBwcm9wcyBhcmUgYWxyZWFkeSBjc3MgcHJvcGVydGllcywgYW5kIHdpbGwgYmUgcmV0dXJuZWQgdW5jaGFuZ2VkLlxyXG4gIC8vIFNob3J0aGFuZCBwcm9wZXJ0aWVzICh4LHkseix3LGgscm90YXRlLHNjYWxlLHNpemUpIHdpbGwgYmUgY29udmVydGVkIHRvXHJcbiAgLy8gY3NzIHByb3BlcnRpZXMgYW5kIHJlbW92ZWQgZnJvbSB0aGUgcHJvcHMgb2JqZWN0LlxyXG4gIHN0YXRpYyBjb252ZXJ0VG9DU1MgKHByb3BzKSB7XHJcbiAgICB2YXIgc3R5bGVzID0gJC5leHRlbmQoe30sIHByb3BzKTtcclxuICAgIHN0eWxlcy53aWR0aCA9IHByb3BzLndpZHRoIHx8IChwcm9wcy53ICYmIChwcm9wcy53ICsgXCJweFwiKSksXHJcbiAgICBzdHlsZXMuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0IHx8IChwcm9wcy5oICYmIChwcm9wcy5oICsgXCJweFwiKSksXHJcbiAgICBzdHlsZXMudHJhbnNmb3JtID0gcHJvcHMudHJhbnNmb3JtIHx8IChUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHByb3BzLnJvdGF0ZSwgcHJvcHMuc2NhbGUsIHByb3BzLngsIHByb3BzLnksIHByb3BzLnosIHByb3BzLnJlbmRlck9uQ2VudGVyLCBwcm9wcy53LCBwcm9wcy5oKSksXHJcblxyXG4gICAgLy8gVGhlc2UgYXJlIG5vdCB0cnVlIENTUyBwcm9wZXJ0aWVzIHNvIHJlbW92ZSB0aGVtXHJcbiAgICBkZWxldGUgc3R5bGVzLmlkO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5yb3RhdGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLnNjYWxlO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5zaXplO1xyXG4gICAgZGVsZXRlIHN0eWxlcy54O1xyXG4gICAgZGVsZXRlIHN0eWxlcy55O1xyXG4gICAgZGVsZXRlIHN0eWxlcy56O1xyXG4gICAgZGVsZXRlIHN0eWxlcy53O1xyXG4gICAgZGVsZXRlIHN0eWxlcy5oO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5yO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5tYXNrO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5yZW5kZXJPbkNlbnRlcjtcclxuICAgIGRlbGV0ZSBzdHlsZXMub25JbWdMb2FkZWQ7XHJcbiAgICBkZWxldGUgc3R5bGVzLm9uSW1nRXJyb3I7XHJcblxyXG4gICAgcmV0dXJuIHN0eWxlcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlVHJhbnNmb3JtQ1NTIChyb3RhdGUsIHNjYWxlLCB0eCwgdHksIHR6LCByZW5kZXJPbkNlbnRlciwgdywgaCkge1xyXG4gICAgdmFyIHRyYW5zZm9ybSA9ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9ICh0eCB8fCB0eSB8fCB0eikgPyAoVGhpbmcubWFrZVRyYW5zbGF0ZUNTUyh0eCwgdHksIHR6LCByZW5kZXJPbkNlbnRlciwgdywgaCkgKyAnICcpIDogJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gcm90YXRlID8gKFRoaW5nLm1ha2VSb3RhdGlvbkNTUyhyb3RhdGUpICkgOiAnJztcclxuICAgIHRyYW5zZm9ybSArPSBzY2FsZSA/IChUaGluZy5tYWtlU2NhbGVDU1Moc2NhbGUpICsgJyAnKSA6ICcnO1xyXG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlUm90YXRpb25DU1MgKGFuZ2xlKSB7XHJcbiAgICB2YXIgY3NzID0gJyc7XHJcbiAgICBpZiAoYW5nbGUgIT09IHVuZGVmaW5lZCAmJiBhbmdsZSAhPT0gbnVsbCkge1xyXG4gICAgICBpZiAodHlwZW9mIGFuZ2xlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIHR1cm4gb2JqZWN0IHt4OjEwLCB5OjIwLCB6OjMwfSBpbnRvIGEgY3NzIHRyYW5zZm9ybSBjb21tYW5kXHJcbiAgICAgICAgJC5lYWNoKGFuZ2xlLCBmdW5jdGlvbiAoYXhpc05hbWUsIGFuZ2xlKSB7XHJcbiAgICAgICAgICBjc3MgKz0gJ3JvdGF0ZScgKyBheGlzTmFtZS50b1VwcGVyQ2FzZSgpICsgJygnICthbmdsZSsgJ2RlZykgJztcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBjc3MgPSAncm90YXRlWignK2FuZ2xlKydkZWcpICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjc3M7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVNjYWxlQ1NTIChzY2FsZSkge1xyXG4gICAgcmV0dXJuIChzY2FsZSA9PT0gdW5kZWZpbmVkIHx8IHNjYWxlID09PSBudWxsKSA/ICcnIDogJ3NjYWxlKCcrc2NhbGUrJykgJztcclxuICB9XHJcblxyXG4gIC8vIE5PVEU6IHRyYW5zbGF0aW9uIGNvb3JkcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiB0aGUgZG9jdW1lbnQgZmxvdy5cclxuICAvLyBUaGV5IGFyZSBub3QgdGhlIHNhbWUgYXMgc2V0dGluZyBsZWZ0L3RvcCB2YWx1ZXMsIHdoaWNoIGFyZSBhYnNvbHV0ZSBjb29yZGluYXRlc1xyXG4gIC8vIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudC5cclxuICBzdGF0aWMgbWFrZVRyYW5zbGF0ZUNTUyAoeCwgeSwgeiwgcmVuZGVyT25DZW50ZXIsIHcsIGgpIHtcclxuICAgIHggPSB4IHx8ICcwJztcclxuICAgIHkgPSB5IHx8ICcwJztcclxuICAgIHogPSB6IHx8ICcwJztcclxuICAgIGlmIChyZW5kZXJPbkNlbnRlcikge1xyXG4gICAgICB4IC09IHcvMjtcclxuICAgICAgeSAtPSBoLzI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZTNkKCcrIHggKyAncHgsICcgKyB5ICsgJ3B4LCAnICsgeiArJ3B4KSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUVsZW1lbnQgKGh0bWwsIHByb3BzLCB0eXBlKSB7XHJcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGh0bWwpXHJcbiAgICAgIC5jc3MoVGhpbmcuY29udmVydFRvQ1NTKHByb3BzKSlcclxuICAgICAgLmFkZENsYXNzKHR5cGUgfHwgJ3JhbmRvbScpXHJcbiAgICAgIC5hdHRyKCdpZCcsIHByb3BzLmlkIHx8ICh0eXBlICsgKCsrZWxlbWVudENvdW50ZXIpKSk7XHJcbiAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaXNOdW1lcmljKG4pIHtcclxuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgZm9udCBmYW1pbHkgdG8gcGFnZSAtIHdpbGwgbG9hZCBvbmx5IG9uY2VcclxuICBzdGF0aWMgYWRkRm9udFVSTChmb250RmFtaWx5VVJMLCBpZCkge1xyXG4gICAgaWYgKGZvbnRGYW1pbHlVUkwgJiYgaWQgJiYgJCgnaGVhZCcpLmZpbmQoJyMnICsgaWQpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB2YXIgbGluayA9ICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIicgKyBmb250RmFtaWx5VVJMICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XHJcbiAgICAgICQoJ2hlYWQnKS5hcHBlbmQobGluayk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ1NTRmlsZShmaWxlTmFtZSwgaWQ9J1RoaW5nJykge1xyXG4gICAgaWYgKGZpbGVOYW1lKSB7XHJcbiAgICAgIHZhciBsaW5rID0gJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiJyArIGZpbGVOYW1lICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XHJcbiAgICAgICQoJ2hlYWQnKS5maW5kKCcjJyArIGlkKS5yZW1vdmUoKTtcclxuICAgICAgJCgnaGVhZCcpLmFwcGVuZChsaW5rKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZD0nVGhpbmcnKSB7XHJcbiAgICBpZiAoY3NzU3RyaW5nKSB7XHJcbiAgICAgIHZhciBzdHlsZUlEID0gaWQgKyAnLXN0eWxlcyc7XHJcbiAgICAgIHZhciBzdHlsZUVsID0gJCgnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPicgK2Nzc1N0cmluZysgJzwvc3R5bGU+JylcclxuICAgICAgICAuYXR0cignaWQnLCBzdHlsZUlEKTtcclxuICAgICAgJCgnaGVhZCAjJyArIHN0eWxlSUQpLnJlbW92ZSgpOyAvLyBjbGVhciB0aGUgZXhpc3Rpbmcgc3R5bGUgaWYgYW55XHJcbiAgICAgICQoJ2hlYWQnKS5hcHBlbmQoc3R5bGVFbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKlxyXG4gIGZ1bmN0aW9uIGJpbmRhcmdzKGZ1bmMsIHByb3BzKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKG1vcmVQcm9wcykge1xyXG4gICAgICBsZXQgcCA9ICQuZXh0ZW5kKHt9LCBwcm9wcywgbW9yZVByb3BzKTtcclxuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh7fSwgcCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbnN0YW50aWF0b3IoY2xzLCBwcm9wcykge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtb3JlUHJvcHMpIHtcclxuICAgICAgbGV0IHAgPSAkLmV4dGVuZCh7fSwgcHJvcHMsIG1vcmVQcm9wcyk7XHJcbiAgICAgIHJldHVybiBjbHMubWFrZS5jYWxsKGNscywgcCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gICovXHJcblxyXG4gIHN0YXRpYyBtc2cocykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKHMpO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhUaGluZyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRoaW5nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG5cclxuY2xhc3MgVGltZXIgZXh0ZW5kcyBBY3Rpb24ge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xyXG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XHJcblx0XHR0aGlzLnRpbWVySUQgPSBudWxsO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcclxuXHRcdHRoaXMudGltZXJJRCA9IHNldFRpbWVvdXQodGhpcy5jYWxsYmFjaywgdGhpcy5kZWxheSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XHJcblx0XHR0aGlzLnRpbWVySUQgPSBudWxsO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhUaW1lcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgVHJpYW5nbGUgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdHNpemU6IDEwLFxyXG5cdFx0XHRjb2xvcjogJyNCQURBNTUnXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZChwcm9wcywgZGVmYXVsdFByb3BzKTtcclxuXHRcdHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuXHRcdHRoaXMudHlwZSA9ICdUcmlhbmdsZSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMubWFrZVRyaWFuZ2xlKHRoaXMucHJvcHMuc2l6ZSwgdGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgZWxlbWVudCBiZWZvcmUgY2FsbGluZyB0aGlzXHJcblx0fVxyXG5cclxuXHRtYWtlVHJpYW5nbGUgKHNpemUsIGNvbG9yKSB7XHJcblx0XHRjb2xvciA9IGNvbG9yIHx8ICcjQkFEQTU1JztcclxuXHRcdHNpemUgPSBzaXplIHx8IDEwO1xyXG5cdFx0dGhpcy5jc3Moe1xyXG5cdFx0XHR3aWR0aDogMCxcclxuXHRcdFx0aGVpZ2h0OiAwLFxyXG5cdFx0XHRmb250U2l6ZTogMCxcclxuXHRcdFx0bGluZUhlaWdodDogMCxcclxuXHRcdFx0Ym9yZGVyQm90dG9tOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuXHRcdFx0Ym9yZGVyVG9wOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuXHRcdFx0Ym9yZGVyTGVmdDogc2l6ZSArICdweCBzb2xpZCAnICsgY29sb3JcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRyaWFuZ2xlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJpYW5nbGU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcclxucmVxdWlyZSgnLi9Cb3gvQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQXJyb3cvQXJyb3cuanMnKTtcclxucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGltZXIvVGltZXIuanMnKTtcclxucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcclxucmVxdWlyZSgnLi9QdWxzYXIvUHVsc2FyLmpzJyk7XHJcbnJlcXVpcmUoJy4vRG8vRG8uanMnKTtcclxucmVxdWlyZSgnLi9MYWJlbC9MYWJlbC5qcycpO1xyXG5yZXF1aXJlKCcuL0xpbmUvTGluZS5qcycpO1xyXG5yZXF1aXJlKCcuL0ltZy9JbWcuanMnKTtcclxucmVxdWlyZSgnLi9JbWdTVkcvSW1nU1ZHLmpzJyk7XHJcbnJlcXVpcmUoJy4vUGF0dGVybi9QYXR0ZXJuLmpzJyk7XHJcbnJlcXVpcmUoJy4vUGF0dGVyblBvbGthRG90cy9QYXR0ZXJuUG9sa2FEb3RzLmpzJyk7XHJcbnJlcXVpcmUoJy4vUGF0dGVyblN0cmlwZXMvUGF0dGVyblN0cmlwZXMuanMnKTtcclxucmVxdWlyZSgnLi9QYXR0ZXJuU29mYS9QYXR0ZXJuU29mYS5qcycpO1xyXG5yZXF1aXJlKCcuL1BhdHRlcm5UaWxlTWFyYmxlL1BhdHRlcm5UaWxlTWFyYmxlLmpzJyk7XHJcbnJlcXVpcmUoJy4vQkdJbWcvQkdJbWcuanMnKTtcclxucmVxdWlyZSgnLi9UZXh0UGFuZS9UZXh0UGFuZS5qcycpO1xyXG5yZXF1aXJlKCcuL0NpcmNsZS9DaXJjbGUuanMnKTtcclxucmVxdWlyZSgnLi9UcmlhbmdsZS9UcmlhbmdsZS5qcycpO1xyXG5yZXF1aXJlKCcuL1Jvb20vUm9vbS5qcycpO1xyXG5yZXF1aXJlKCcuL1BhZ2UvUGFnZS5qcycpO1xyXG5yZXF1aXJlKCcuL0NvbXBvc2l0ZUltZy9Db21wb3NpdGVJbWcuanMnKTtcclxucmVxdWlyZSgnLi9Qb2ludHMvUG9pbnRzLmpzJyk7XHJcblxyXG53aW5kb3cuVGhpbmcgPSBUaGluZztcclxuIl19
