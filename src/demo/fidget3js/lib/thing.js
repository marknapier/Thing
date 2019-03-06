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
    this.set(props);
  }

  set (props) {
    this.$element.css(BGImg.makeBGImgCSS(props));
    return this;
  }

  static makeBGImgCSS (props) {
    var url = props.url || ('url("' + props.src + '")');
    return {
      backgroundImage: url,
      backgroundRepeat: props.repeat ? 'repeat' : 'no-repeat',
      backgroundPosition: props.backgroundPosition || (props.center ? 'center' : '0 0'),
      backgroundSize: props.size
    };
  }
}
Thing.addClass(BGImg);

module.exports = BGImg;

},{"../Thing/Thing.js":27}],5:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

function compareZ(a, b) {
  if (a.z < b.z) {
    return -1;
  }
  if (a.z > b.z) {
    return 1;
  }
  return 0;
}

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

  empty () {
    var clone = this.items.slice(0);
    var b = this;
    clone.forEach(function (item) {
      b.remove(item);
    });
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

  sortZ () {
    this.items.sort(compareZ);
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

    // load the image, or skip if javascript img is provided
    if (props.img) {
        this.onLoad(props.img);
    } else {
        loadImage(props.src, this.onLoad.bind(this), this.onError.bind(this));
    }
  }

  onLoad (img) {
    this.loaded = true;
    this.aspectRatio = img.height / img.width;  // aspect ratio of original image
    // if neither height nor width are provided, use native dimensions
    // if width is provided, recalc height based on aspectRatio
    // if height is provided, recalc width based on aspectRatio
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
    this.w = this.h = 0;
    this.aspectRatio = 1;
    pageImgQueue.remove(this);
    // exec callback if any
    this.onImgError && this.onImgError(this);
  }

  setWidth (w) {
    this.w = w;
    this.h = w * this.aspectRatio;
    this.css({
        width: this.w,
        height: this.h
    });
    return this;
  }

  setHeight (h) {
    this.h = h;
    this.w = h * (1/this.aspectRatio);
    this.css({
        width: this.w,
        height: this.h
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

  // expecting an object param like: { src: 'http;//path.to/image' }
  // string param will be converted into object with src property
  static getImage(imgConfigOrUrl) {
      var imgConfig = (typeof imgConfigOrUrl === 'string') ? {src: imgConfigOrUrl} : imgConfigOrUrl;
      return new Promise(function(resolve, reject) {
          var img = new Image();
          img.onload = function() {
              resolve(imgConfig);
          };
          img.onerror = function() {
              reject(imgConfig);
          };
          imgConfig.img = img;
          img.src = imgConfig.src;
      });
  }

  static loadImages(imagePaths, callback) {
      var promises = imagePaths.map(Img.getImage);
      Promise.all(promises)
      .then(function (imgsJSON) {
          // convert javascript img objects to Thing Img objects
          var thingImgs = imgsJSON.map(function (imgJSON) { return Thing.Img.make(imgJSON); });
          callback(thingImgs);
      })
      .catch(function(urls) {
          Thing.msg("Img.loadImages: Error fetching some images: " + urls);
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
var Rand = require('../Rand/Rand.js');

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
        Rand.init(pageParams.randomSeed);
        Page.setScale(pageParams.scale || 1);
        Page.initEvents();
    }
}
Thing.addClass(Page);

module.exports = Page;

},{"../Rand/Rand.js":23,"../Thing/Thing.js":27}],15:[function(require,module,exports){
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

	static setSeed(s) {
		seed = s;
		MTRand = new MersenneTwister(seed);
	}

	static random() {
		MTRand || Rand.init();
		return MTRand.random();
	}

	// return a random element from an array
	static randItem(arr) {
		if (arr && arr.length > 0) {
			return arr[ Rand.randInt(0, arr.length-1) ];
		}
	}

	// return a random element from an array, and remove it from array
	static pickItem(arr) {
		if (arr && arr.length > 0) {
			var index = Rand.randInt(0, arr.length-1);
			return arr.splice(index,1)[0];
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
		min = Math.ceil(min || 0);
		max = Math.floor(max === undefined ? 1 : max);
		return Math.floor(Rand.random() * (max - min + 1)) + min;
	}

	// Return a random float between min and max (0 and .99999 by default)
	static randFloat(min=0.0, max=0.99999) {
	    return min + (Rand.random() * (max - min));
	}

	// return true some percentage of the time (defaults to 50%)
	static randBoolean(threshold=50) {
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
			w: this.w,
			h: this.h,
			transform: 'translateZ( ' + (-halfDepth * 0.997) + 'px )'    // push back slightly less than full amount (0.997) or we get a slight gap at corners
		}) );
		walls.push( this.makeWall('right', {
			backgroundColor: 'rgba(255, 0, 55, 1)',
			w: this.d,
			h: this.h,
			transform: 'rotateY( -90deg ) translateZ( ' + (-(halfWidth + (halfWidth-halfDepth))) + 'px )'
		}) );
		walls.push( this.makeWall('left', {
			backgroundColor: 'rgba(255, 255, 0, 1)',
			w: this.d,
			h: this.h,
			transform: 'rotateY( 90deg ) translateZ( ' + (-halfDepth) + 'px )'
		}) );
		walls.push( this.makeWall('top', {
			backgroundColor: 'rgba(0, 55, 255, 1)',
			w: this.w,
			h: this.d,
			transform: 'rotateX( -90deg ) translateZ( ' + (-(halfHeight - (halfHeight-halfDepth)) * 0.997) + 'px )'
		}) );
		walls.push( this.makeWall('bottom', {
			backgroundColor: 'rgba(0, 255, 0, 1)',
			w: this.w,
			h: this.d,
			transform: 'rotateX( 90deg ) translateZ( ' + (-(halfHeight + (halfHeight-halfDepth)) * 0.997) + 'px )'
		}) );

		// Outer facing walls
		if (this.props.showOuter) {
			walls.push( this.makeWall('outfront', {
				backgroundColor: 'rgba(255, 255, 255, 0)',
				w: this.w,
				h: this.h,
				transform: 'translateZ( ' + (halfDepth) + 'px )'
			}) );
			walls.push( this.makeWall('outback', {
				backgroundColor: 'rgba(0, 0, 0, 1)',
				w: this.w,
				h: this.h,
				transform: 'rotateX( -180deg ) translateZ( ' + halfDepth + 'px )'
			}) );
			walls.push( this.makeWall('outright', {
				backgroundColor: 'rgba(100, 100, 100, 1)',
				w: this.d,
				h: this.h,
				transform: 'rotateY( 90deg ) translateZ( ' + ((halfWidth + (halfWidth-halfDepth))) + 'px )'
			}) );
			walls.push( this.makeWall('outleft', {
				backgroundColor: 'rgba(100, 100, 100, 1)',
				w: this.d,
				h: this.h,
				transform: 'rotateY( -90deg ) translateZ( ' + (halfWidth - (halfWidth-halfDepth)) + 'px )'
			}) );
			walls.push( this.makeWall('outtop', {
				backgroundColor: 'rgba(100, 100, 200, 1)',
				w: this.w,
				h: this.d,
				transform: 'rotateX( 90deg ) translateZ( ' + halfDepth + 'px )'
			}) );
			walls.push( this.makeWall('outbottom', {
				backgroundColor: 'rgba(100, 200, 100, 1)',
				w: this.w,
				h: this.d,
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

	empty() {
	  var clone = this.items.slice(0);
	  var b = this;
	  clone.forEach(function (item) {
	  	if (b.wallsA.indexOf(item) === -1) { // don't delete the walls, just the items in the room
	  		b.remove(item);
	  	}
	  });
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
    this.scaleFactor = props.scale || null;

    // position is the given x,y,z or 0,0,0 (this becomes CSS translate3d())
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.z = props.z || 0;

    // dimensions are the given w,h or undefined (this becomes CSS width/height)
    this.w = props.w;
    this.h = props.h;

    this.id = props.id;
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
    this.x = x || this.x || 0;
    this.y = y || this.y || 0;
    this.z = z || this.z || 0;
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
    var css = '';
    if (scale !== undefined && scale !== null) {
      if (typeof scale === 'object') {
        css = 'scale3d(' +
            (scale.x === undefined ? '1' : scale.x) + ',' +
            (scale.y === undefined ? '1' : scale.y) + ',' +
            (scale.z === undefined ? '1' : scale.z) +
            ')';
      }
      else {
        css = 'scale('+scale+') ';
      }
    }
    return css;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0FjdGlvbi9BY3Rpb24uanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JHSW1nL0JHSW1nLmpzIiwic3JjL2xpYi9Cb3gvQm94LmpzIiwic3JjL2xpYi9DaXJjbGUvQ2lyY2xlLmpzIiwic3JjL2xpYi9Db21wb3NpdGVJbWcvQ29tcG9zaXRlSW1nLmpzIiwic3JjL2xpYi9EZW1vQm94L0RlbW9Cb3guanMiLCJzcmMvbGliL0RvL0RvLmpzIiwic3JjL2xpYi9JbWdTVkcvSW1nU1ZHLmpzIiwic3JjL2xpYi9JbWcvSW1nLmpzIiwic3JjL2xpYi9MYWJlbC9MYWJlbC5qcyIsInNyYy9saWIvTGluZS9MaW5lLmpzIiwic3JjL2xpYi9QYWdlL1BhZ2UuanMiLCJzcmMvbGliL1BhdHRlcm5Qb2xrYURvdHMvUGF0dGVyblBvbGthRG90cy5qcyIsInNyYy9saWIvUGF0dGVyblNvZmEvUGF0dGVyblNvZmEuY3NzIiwic3JjL2xpYi9QYXR0ZXJuU29mYS9QYXR0ZXJuU29mYS5qcyIsInNyYy9saWIvUGF0dGVyblN0cmlwZXMvUGF0dGVyblN0cmlwZXMuanMiLCJzcmMvbGliL1BhdHRlcm5UaWxlTWFyYmxlL1BhdHRlcm5UaWxlTWFyYmxlLmpzIiwic3JjL2xpYi9QYXR0ZXJuL1BhdHRlcm4uanMiLCJzcmMvbGliL1BvaW50cy9Qb2ludHMuanMiLCJzcmMvbGliL1B1bHNhci9QdWxzYXIuanMiLCJzcmMvbGliL1JhbmQvUmFuZC5qcyIsInNyYy9saWIvUmFuZC9tZXJzZW5uZS10d2lzdGVyLmpzIiwic3JjL2xpYi9Sb29tL1Jvb20uanMiLCJzcmMvbGliL1RleHRQYW5lL1RleHRQYW5lLmpzIiwic3JjL2xpYi9UaGluZy9UaGluZy5qcyIsInNyYy9saWIvVGltZXIvVGltZXIuanMiLCJzcmMvbGliL1RyaWFuZ2xlL1RyaWFuZ2xlLmpzIiwic3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb24ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxuXHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHRoaXMucHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0d2luZG93LmNvbnNvbGUubG9nKCdBY3Rpb24uZ28oKScpO1xyXG5cdH1cclxuXHJcblx0c3RvcCAoKSB7XHJcblx0XHR3aW5kb3cuY29uc29sZS5sb2coJ0FjdGlvbi5zdG9wKCknKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBtYWtlICgpIHtcclxuXHQgIHZhciBjbHMgPSB0aGlzO1xyXG5cdCAgdmFyIGluc3RhbmNlID0gbmV3IGNscygpO1xyXG5cdCAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcclxuXHQgIHJldHVybiBpbnN0YW5jZTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQWN0aW9uKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLyogcmVxdWlyZWQgZm9yIGFycm93ICovXFxyXFxuLmFycm93LWhlYWQge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXHJcXG4gIHdpZHRoOiAwOyBcXHJcXG4gIGhlaWdodDogMDsgXFxyXFxuICBib3JkZXItdG9wOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWJvdHRvbTogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1sZWZ0OiAzMHB4IHNvbGlkIGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uYXJyb3ctYm9keSB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxuICB3aWR0aDogNDBweDtcXHJcXG4gIGhlaWdodDogMjBweDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxyXFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDA7XFxyXFxuICBib3JkZXItcmlnaHQ6IDA7XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy13cmFwcGVyIHtcXHJcXG4gIHdpZHRoOiA3MHB4OyAgIC8qIGFycm93LWJvZHkgd2lkdGggKyBhcnJvdy1oZWFkIGJvcmRlciB3aWR0aCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uQXJyb3cge1xcclxcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxyXFxufVxcclxcblxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIENTUyA9IHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XHJcblxyXG5jbGFzcyBBcnJvdyBleHRlbmRzIFRoaW5nIHtcclxuXHRpbml0IChwcm9wcykge1xyXG5cdFx0dGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0Fycm93JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTsgIC8vIGJhc2ljIFRoaW5nIGRpdiB3aXRoIElEIGFuZCBjbGFzc1xyXG5cdFx0dGhpcy5zZXRDb2xvcih0aGlzLnByb3BzLmNvbG9yKTsgIC8vIGhhdmUgdG8gbWFrZSBhcnJvdyBiZWZvcmUgY2FsbGluZyB0aGlzXHJcblx0XHRUaGluZy5hZGRDU1NTdHJpbmcoQ1NTLCAnQXJyb3cnKTtcclxuXHR9XHJcblxyXG5cdHNldENvbG9yIChjKSB7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1oZWFkJykuY3NzKHtib3JkZXJMZWZ0Q29sb3I6Y30pO1xyXG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctYm9keScpLmNzcyh7YmFja2dyb3VuZENvbG9yOmN9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0aHRtbCAoKSB7XHJcblx0XHRyZXR1cm4gXCI8ZGl2PjxkaXYgY2xhc3M9J2Fycm93LXdyYXBwZXInPjxkaXYgY2xhc3M9J2Fycm93LWJvZHknPjwvZGl2PjxkaXYgY2xhc3M9J2Fycm93LWhlYWQnPjwvZGl2PjwvZGl2PjwvZGl2PlwiO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhBcnJvdyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFycm93O1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgQkdJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHVybDogJycsICAgLy8gZnVsbHkgZm9ybWVkIGltYWdlIGRlZmluaXRpb24gZS5nLiB1cmwoaW1nL2JsYWguanBnKSBvciBsaW5lYXItZ3JhZGllbnQoKSBldGMuXHJcbiAgICAgIHNyYzogJycsICAgLy8gaW1hZ2UgcGF0aCBlLmcuICdpbWcvYmxhaC5qcGcnLiBQYXNzIEVJVEhFUiB1cmwgT1Igc3JjIE5PVCBCT1RILlxyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgIGNlbnRlcjogdHJ1ZSxcclxuICAgICAgcmVwZWF0OiBmYWxzZSxcclxuICAgICAgc2l6ZTogJ2NvdmVyJyAgICAvLyBjb250YWlufGNvdmVyfDEwMCUgMTAwJVxyXG4gICAgfTtcclxuICAgIHByb3BzID0gdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdCR0ltZyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLnNldChwcm9wcyk7XHJcbiAgfVxyXG5cclxuICBzZXQgKHByb3BzKSB7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhCR0ltZy5tYWtlQkdJbWdDU1MocHJvcHMpKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VCR0ltZ0NTUyAocHJvcHMpIHtcclxuICAgIHZhciB1cmwgPSBwcm9wcy51cmwgfHwgKCd1cmwoXCInICsgcHJvcHMuc3JjICsgJ1wiKScpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiB1cmwsXHJcbiAgICAgIGJhY2tncm91bmRSZXBlYXQ6IHByb3BzLnJlcGVhdCA/ICdyZXBlYXQnIDogJ25vLXJlcGVhdCcsXHJcbiAgICAgIGJhY2tncm91bmRQb3NpdGlvbjogcHJvcHMuYmFja2dyb3VuZFBvc2l0aW9uIHx8IChwcm9wcy5jZW50ZXIgPyAnY2VudGVyJyA6ICcwIDAnKSxcclxuICAgICAgYmFja2dyb3VuZFNpemU6IHByb3BzLnNpemVcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEJHSW1nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQkdJbWc7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBjb21wYXJlWihhLCBiKSB7XHJcbiAgaWYgKGEueiA8IGIueikge1xyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH1cclxuICBpZiAoYS56ID4gYi56KSB7XHJcbiAgICByZXR1cm4gMTtcclxuICB9XHJcbiAgcmV0dXJuIDA7XHJcbn1cclxuXHJcbmNsYXNzIEJveCBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcyA9IHt9KSB7XHJcbiAgXHR0aGlzLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcbiAgXHR0aGlzLnR5cGUgPSAnQm94JztcclxuICBcdHRoaXMuaXRlbXMgPSBbXTtcclxuICBcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuYWRkTWFzayhwcm9wcy5tYXNrKTtcclxuICB9XHJcblxyXG4gIGFkZCAodGhpbmcpIHtcclxuICAgIGlmICh0aGluZykge1xyXG4gICAgICBpZiAodGhpbmcgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHRoaW5nLmZvckVhY2godGhpcy5hZGQuYmluZCh0aGlzKSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKHRoaW5nKTtcclxuICAgICAgICB0aGluZy5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBpdGVtIGZyb20gdGhpcyBib3ggKGZyb20gdGhlIGRvbSBhbmQgdGhlIGl0ZW1zIGxpc3QpXHJcbiAgcmVtb3ZlIChpdGVtKSB7XHJcbiAgXHRpZiAoaXRlbSkge1xyXG4gIFx0XHR2YXIgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XHJcbiAgXHRcdGlmIChpbmRleCA+IC0xKSB7XHJcbiAgXHRcdCAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIFx0XHRcdGl0ZW0uJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgXHRcdFx0aXRlbS5wYXJlbnQgPSBudWxsO1xyXG4gIFx0XHR9XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGVtcHR5ICgpIHtcclxuICAgIHZhciBjbG9uZSA9IHRoaXMuaXRlbXMuc2xpY2UoMCk7XHJcbiAgICB2YXIgYiA9IHRoaXM7XHJcbiAgICBjbG9uZS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIGIucmVtb3ZlKGl0ZW0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBudW1FbGVtZW50cyAoKSB7XHJcbiAgXHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50Qm91bmRzICgpIHtcclxuICAgIHZhciBib3VuZHMgPSB7eDo5OTk5OTksIHk6OTk5OTk5LCBib3R0b206MCwgcmlnaHQ6MH07XHJcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPCAxKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3MgPSB0aGlzLml0ZW1zW2ldLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgIGJvdW5kcy54ID0gKHBvcy54IDwgYm91bmRzLngpID8gcG9zLnggOiBib3VuZHMueDtcclxuICAgICAgYm91bmRzLnkgPSAocG9zLnkgPCBib3VuZHMueSkgPyBwb3MueSA6IGJvdW5kcy55O1xyXG4gICAgICBib3VuZHMuYm90dG9tID0gKHBvcy5ib3R0b20gPiBib3VuZHMuYm90dG9tKSA/IHBvcy5ib3R0b20gOiBib3VuZHMuYm90dG9tO1xyXG4gICAgICBib3VuZHMucmlnaHQgPSAocG9zLnJpZ2h0ID4gYm91bmRzLnJpZ2h0KSA/IHBvcy5yaWdodCA6IGJvdW5kcy5yaWdodDtcclxuICAgIH1cclxuICAgIGJvdW5kcy53ID0gYm91bmRzLnJpZ2h0IC0gYm91bmRzLng7XHJcbiAgICBib3VuZHMuaCA9IGJvdW5kcy5ib3R0b20gLSBib3VuZHMueTtcclxuICAgIHJldHVybiBib3VuZHM7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gIFx0c3VwZXIucmVuZGVyKCk7XHJcbiAgXHRmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRcdHRoaXMuaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgXHR9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGVhY2ggKGZ1bmMpIHtcclxuICAgIGZ1bmMgJiYgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzb3J0WiAoKSB7XHJcbiAgICB0aGlzLml0ZW1zLnNvcnQoY29tcGFyZVopO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhCb3gpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb3g7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBDaXJjbGUgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHRleHQ6ICcnLFxyXG4gICAgICBsZWZ0OiAwLFxyXG4gICAgICB0b3A6IDAsXHJcbiAgICAgIHI6IDI1LFxyXG4gICAgICBmb250RmFtaWx5OiAnQ2FsaWJyaSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICBmb250U2l6ZTogJzI0cHgnLFxyXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgIGNvbG9yOiAnIzBmMCcsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxyXG4gICAgICBib3JkZXJDb2xvcjogJyNCQURBNTUnLFxyXG4gICAgICBib3JkZXJXaWR0aDogNVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdDaXJjbGUnO1xyXG4gICAgdGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHJcbiAgICAvLyBhcHBseSBjaXJjbGUgY3NzXHJcbiAgICB2YXIgb2Zmc2V0ID0gcHJvcHMuciArIHByb3BzLmJvcmRlcldpZHRoO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgICdsZWZ0JzogJycgKyAocHJvcHMubGVmdC1vZmZzZXQpICsgJ3B4JyxcclxuICAgICAgICAndG9wJzogJycgKyAocHJvcHMudG9wLW9mZnNldCkgKyAncHgnLFxyXG4gICAgICAgICd3aWR0aCc6ICcnICsgcHJvcHMucioyICsgJ3B4JyxcclxuICAgICAgICAnaGVpZ2h0JzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxyXG4gICAgICAgICdsaW5lSGVpZ2h0JzogJycgKyBwcm9wcy5yKjIgKyAncHgnLFxyXG4gICAgICAgICdib3JkZXInOiBwcm9wcy5ib3JkZXJXaWR0aCArICdweCBzb2xpZCAnICsgcHJvcHMuYm9yZGVyQ29sb3IsXHJcbiAgICAgICAgJ2JvcmRlclJhZGl1cyc6ICcxMDAwMHB4JyxcclxuICAgICAgICAndGV4dEFsaWduJzogJ2NlbnRlcicsXHJcbiAgICAgICAgJ292ZXJmbG93JzogJ2hpZGRlbidcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5zZXRUZXh0KHRoaXMudGV4dCk7XHJcbiAgfVxyXG5cclxuICBzZXRUZXh0ICh0eHQpIHtcclxuICAgIHRoaXMudGV4dCA9IHR4dDtcclxuICAgIHRoaXMuJGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQodHh0KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhDaXJjbGUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG4vLyB2YXIgYmxlbmRNb2RlcyA9IFtcclxuLy8gICAnbm9ybWFsJyxcclxuLy8gICAvLyBkYXJrZXJcclxuLy8gICAnZGFya2VuJyxcclxuLy8gICAnbXVsdGlwbHknLFxyXG4vLyAgICdjb2xvci1idXJuJyxcclxuLy8gICAvLyBsaWdodGVyXHJcbi8vICAgJ2xpZ2h0ZW4nLFxyXG4vLyAgICdjb2xvci1kb2RnZScsXHJcbi8vICAgJ3NjcmVlbicsXHJcbi8vICAgLy8gY29udHJhc3RcclxuLy8gICAnb3ZlcmxheScsXHJcbi8vICAgJ2hhcmQtbGlnaHQnLFxyXG4vLyAgICdzb2Z0LWxpZ2h0JyxcclxuLy8gICAvLyBpbnZlcnNpb25cclxuLy8gICAnZXhjbHVzaW9uJyxcclxuLy8gICAnZGlmZmVyZW5jZScsXHJcbi8vICAgLy8gY29tcG9uZW50c1xyXG4vLyAgICdodWUnLFxyXG4vLyAgICdzYXR1cmF0aW9uJyxcclxuLy8gICAnY29sb3InLFxyXG4vLyAgICdsdW1pbm9zaXR5JyxcclxuLy8gXTtcclxuXHJcbi8vIHtcclxuLy8gICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuLy8gICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuLy8gICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsIDE3NCwgMTc0KTtcclxuLy8gICAgIG1hcmdpbjogMjBweDtcclxuLy8gICAgIHdpZHRoOiAzMDBweDtcclxuLy8gICAgIGhlaWdodDogNjAwcHg7XHJcbi8vICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoaW1nL2ZhY2VwYXJ0cy93YXNoaW5ndG9uX2V5ZV9sZWZ0X3JvdW5kLnBuZyksIHVybChpbWcvZmFjZXBhcnRzL3dhc2hpbmd0b25fZXllX2xlZnRfcm91bmQucG5nKTtcclxuLy8gICAgIGJhY2tncm91bmQtc2l6ZTogMTAwJSA1MCUsIDExMCUgNTMlO1xyXG4vLyAgICAgYmFja2dyb3VuZC1ibGVuZC1tb2RlOiBkYXJrZW4sIGNvbG9yLWJ1cm47XHJcbi8vICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwcHggMHB4LCAtMTNweCAtMnB4O1xyXG4vLyAgICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdCwgbm8tcmVwZWF0O1xyXG4vLyB9XHJcblxyXG5cclxuXHJcbi8vIC8vIHZlcnkgaGlnaCBjb250cmFzdFxyXG4vLyB7XHJcbi8vICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbi8vICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbi8vICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbi8vICAgICBtYXJnaW46IDIwcHg7XHJcbi8vICAgICB3aWR0aDogMzAwcHg7XHJcbi8vICAgICBoZWlnaHQ6IDYwMHB4O1xyXG4vLyAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGltZy9mYWNlcGFydHMvd2FzaGluZ3Rvbl9leWVfbGVmdF9yb3VuZC5wbmcpLCB1cmwoaW1nL2ZhY2VwYXJ0cy93YXNoaW5ndG9uX2V5ZV9sZWZ0X3JvdW5kLnBuZyk7XHJcbi8vICAgICBiYWNrZ3JvdW5kLXNpemU6IDEwMCUgNTAlLCAxMDAlIDUwJTtcclxuLy8gICAgIGJhY2tncm91bmQtYmxlbmQtbW9kZTogY29sb3ItZG9kZ2UsIGNvbG9yLWJ1cm47XHJcbi8vICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwcHggMHB4LCAtMHB4IDBweDtcclxuLy8gICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQsIG5vLXJlcGVhdDtcclxuLy8gfVxyXG5cclxuXHJcblxyXG5jbGFzcyBDb21wb3NpdGVJbWcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMgPSB7fSkge1xyXG4gICAgdGhpcy50eXBlID0gJ0NvbXBvc2l0ZUltZyc7XHJcbiAgICB0aGlzLmxheWVycyA9IFtdO1xyXG5cclxuICAgIGlmIChwcm9wcy5sYXllcnMpIHtcclxuICAgICAgdGhpcy5hZGRMYXllcihwcm9wcy5sYXllcnMpO1xyXG4gICAgICBkZWxldGUgcHJvcHMubGF5ZXJzOyAgLy8gZG9uJ3QgbGV0IHRoaXMgcHJvcGFnYXRlIGludG8gY3NzXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuYXBwbHlMYXllcnMoKTsgIC8vIHdpbGwgYWRkIGxheWVyIENTUyBwcm9wcyB0byBwb3BzIG9iamVjdCBzbyBtYWtlRWxlbWVudCgpIHdpbGwgcGljayB0aGVtIHVwXHJcbiAgICB0aGlzLmFkZE1hc2socHJvcHMubWFzayk7ICAvLyBtYWtlIHRoaXMgcGFydCBvZiBjb252ZXJ0VG9DU1MoKVxyXG4gIH1cclxuXHJcbiAgYWRkTGF5ZXIgKHByb3BzID0ge30pIHtcclxuICAgIGlmIChwcm9wcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIHByb3BzLmZvckVhY2godGhpcy5hZGRMYXllci5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHByb3BzKSB7XHJcbiAgICAgIHZhciBsYXllclByb3BzID0ge1xyXG4gICAgICAgIGJhY2tncm91bmRJbWFnZTogcHJvcHMuaW1hZ2UgfHwgcHJvcHMuYmFja2dyb3VuZEltYWdlLFxyXG4gICAgICAgIGJhY2tncm91bmRTaXplOiBwcm9wcy5zaXplIHx8IHByb3BzLmJhY2tncm91bmRTaXplIHx8ICcxMDAlIDEwMCUnLFxyXG4gICAgICAgIGJhY2tncm91bmRCbGVuZE1vZGU6IHByb3BzLmJsZW5kTW9kZSB8fCBwcm9wcy5iYWNrZ3JvdW5kTW9kZSB8fCAnbm9ybWFsJyxcclxuICAgICAgICBiYWNrZ3JvdW5kUG9zaXRpb246IHByb3BzLnBvc2l0aW9uIHx8IHByb3BzLmJhY2tncm91bmRQb3NpdGlvbiB8fCAnMHB4IDBweCcsXHJcbiAgICAgICAgYmFja2dyb3VuZFJlcGVhdDogcHJvcHMucmVwZWF0IHx8IHByb3BzLmJhY2tncm91bmRSZXBlYXQgfHwgJ25vLXJlcGVhdCcsXHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXJQcm9wcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBtZXJnZSBhbGwgbGF5ZXIgcHJvcGVydGllcyBpbnRvIG9uZSBiYWNrZ3JvdW5kIHByb3BlcnRpZXMgQ1NTIG9iamVjdFxyXG4gIG1ha2VDU1MgKCkge1xyXG4gICAgdmFyIG1lcmdlZExheWVycyA9IHt9O1xyXG4gICAgaWYgKHRoaXMubGF5ZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgbWVyZ2VkTGF5ZXJzID0gdGhpcy5sYXllcnMucmV2ZXJzZSgpLnJlZHVjZShmdW5jdGlvbiAobWVyZ2VkLCBsYXllclByb3BzKSB7XHJcbiAgICAgICAgbWVyZ2VkLmJhY2tncm91bmRJbWFnZSArPSAoJywgJyArIGxheWVyUHJvcHMuYmFja2dyb3VuZEltYWdlKTsgXHJcbiAgICAgICAgbWVyZ2VkLmJhY2tncm91bmRTaXplICs9ICgnLCAnICsgbGF5ZXJQcm9wcy5iYWNrZ3JvdW5kU2l6ZSk7IFxyXG4gICAgICAgIG1lcmdlZC5iYWNrZ3JvdW5kQmxlbmRNb2RlICs9ICgnLCAnICsgbGF5ZXJQcm9wcy5iYWNrZ3JvdW5kQmxlbmRNb2RlKTsgXHJcbiAgICAgICAgbWVyZ2VkLmJhY2tncm91bmRQb3NpdGlvbiArPSAoJywgJyArIGxheWVyUHJvcHMuYmFja2dyb3VuZFBvc2l0aW9uKTsgXHJcbiAgICAgICAgbWVyZ2VkLmJhY2tncm91bmRSZXBlYXQgKz0gKCcsICcgKyBsYXllclByb3BzLmJhY2tncm91bmRSZXBlYXQpOyBcclxuICAgICAgICByZXR1cm4gbWVyZ2VkO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBtZXJnZWRMYXllcnM7XHJcbiAgfVxyXG5cclxuICAvLyBtYWtlIChwcm9wcykge1xyXG4gIC8vICAgcmV0dXJuIFRoaW5nLm1ha2UoJC5leHRlbmQoe1xyXG4gIC8vICAgICB3OiAxMjAwLFxyXG4gIC8vICAgICBoOiAyNzUwLFxyXG4gIC8vICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnLFxyXG4gIC8vICAgfSwgcHJvcHMpKTtcclxuICAvLyB9XHJcblxyXG4gIGFwcGx5TGF5ZXJzICgpIHtcclxuICAgIHRoaXMuY3NzKHRoaXMubWFrZUNTUygpKTtcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoQ29tcG9zaXRlSW1nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRlSW1nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xyXG5cclxuY2xhc3MgRGVtb0JveCBleHRlbmRzIEJveCB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHQgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxyXG5cdFx0ICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcclxuXHRcdCAgbWFyZ2luOiAnMjBweCcsXHJcblx0XHQgIHdpZHRoOiAnMjAwcHgnLFxyXG5cdFx0ICBoZWlnaHQ6ICcyMDBweCcsXHJcblx0XHQgIGJvcmRlcjogJzJweCBkYXNoZWQgI2VlZSdcclxuXHRcdH07XHJcblx0XHRwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuXHRcdHN1cGVyLmluaXQocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0RlbW9Cb3gnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhEZW1vQm94KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVtb0JveDtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbi8vIExpa2UgVW5peCBwaXBlOiBvdXRwdXQgb2Ygb25lIGNvbW1hbmQgaXMgaW5wdXQgdG8gdGhlIG5leHRcclxuLy8gRWFjaCBmdW5jdGlvbiB0YWtlcyBhICdwcm9wcycgb2JqZWN0IGFzIGFyZ3VtZW50XHJcbi8vIEVhY2ggZnVuY3Rpb24gcmV0dXJucyBhbiBvYmplY3Qgd2l0aCByZXN1bHRzLCB3aGljaCBpcyBwYXNzZWQgYXMgcHJvcHMgdG8gdGhlIG5leHRcclxuLy8gRG8oKSByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgdGhlIERvIGNoYWluXHJcblxyXG4vLyBQLnB1bHNlLnNldFRvKFxyXG4vLyAgICAgRG8oUi5nZXRSYW5kb21OdW1iZXIsIHtmcm9tOjAsIHRvOjEwfSkgICAvLyByZXR1cm5zOiAge2RhdGE6IDh9XHJcbi8vICAgICAuRG8oQy5waWNrQ29sb3IpICAgIC8vIHJlYWRzIGlucHV0IDgsIHJldHVybnMge2RhdGE6ICcjY2ZmJ31cclxuLy8gICAgIC5EbyhCLmNoYW5nZUNvbG9yKSAgIC8vIHJlYWRzIGlucHV0ICcjY2ZmJywgY2hhbmdlcyBjb2xvciBvbiBCbGlua2VyXHJcbi8vICk7XHJcblxyXG5cclxuZnVuY3Rpb24gRG8oX2FGdW5jdGlvbiwgX3Byb3BzLCBfZmlyc3REbykge1xyXG4gICAgdmFyIGFGdW5jdGlvbiA9IF9hRnVuY3Rpb247XHJcbiAgICB2YXIgcHJvcHMgPSBfcHJvcHM7XHJcbiAgICB2YXIgZmlyc3REbyA9IF9maXJzdERvIHx8IGV4ZWN1dG9yO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdhZnVuY3Rpb249JywgYUZ1bmN0aW9uKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdwcm9wcz0nLCBwcm9wcyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZmlyc3REbz0nLCBmaXJzdERvKTtcclxuXHJcbiAgICAvLyBSdW4gdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cy5cclxuICAgIC8vIFBhc3MgdGhlIHJlc3VsdHMgdG8gdGhlIG5leHQgY2hhaW5lZCBmdW5jdGlvbiAoaWYgYW55KS5cclxuICAgIC8vIFJldHVybiByZXN1bHRzIG9mIHRoaXMgZnVuY3Rpb24gb3Igb2YgdGhlIGNoYWluXHJcbiAgICBmdW5jdGlvbiBleGVjdXRvciAocGlwZWRQcm9wcykge1xyXG4gICAgICAgIHZhciByZXR1cm5WYWwgPSBhRnVuY3Rpb24ocHJvcHMgfHwgcGlwZWRQcm9wcyk7XHJcbiAgICAgICAgcmV0dXJuIChleGVjdXRvci5uZXh0RG8gPyBleGVjdXRvci5uZXh0RG8ocmV0dXJuVmFsKSA6IHJldHVyblZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV0dXJuIHRoZSBsYXN0ICdEbycgaW4gdGhlIGNoYWluXHJcbiAgICBmdW5jdGlvbiBnZXRMYXN0RG8gKCkge1xyXG4gICAgICAgIHZhciB0bXBEbyA9IGZpcnN0RG87XHJcbiAgICAgICAgd2hpbGUgKHRtcERvLm5leHREbykgeyB0bXBEbyA9IHRtcERvLm5leHREbzsgfVxyXG4gICAgICAgIHJldHVybiB0bXBEbztcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgYSBuZXcgJ0RvJyB0byB0aGUgZW5kIG9mIHRoZSBjaGFpbi5cclxuICAgIGV4ZWN1dG9yLkRvID0gZnVuY3Rpb24gKGFGdW5jdGlvbiwgcHJvcHMpIHtcclxuICAgICAgICBnZXRMYXN0RG8oKS5uZXh0RG8gPSBEbyhhRnVuY3Rpb24sIHByb3BzLCBmaXJzdERvKTtcclxuICAgICAgICByZXR1cm4gZmlyc3REbzsgIC8vIEFsd2F5cyByZXR1cm4gdGhlIGZpcnN0ICdEbycgaW4gdGhlIGNoYWluXHJcbiAgICB9O1xyXG5cclxuICAgIGV4ZWN1dG9yLm5leHREbyA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIGV4ZWN1dG9yO1xyXG59XHJcblxyXG5UaGluZy5EbyA9IERvO1xyXG5cclxuLypcclxuLy8gY2hhaW5lZCwgZWFjaCBEbyBoYXMgaXRzIG93biBwYXJhbWV0ZXJzXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTt9LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCB7YXJnMjonaGVsbG8gdG8gMjIyMjInfSlcclxuXHJcbi8vIGNoYWluZWQsIHdpdGggZmlyc3QgRG8gcGlwaW5nIHJlc3VsdHMgdG8gc2Vjb25kIERvXHJcbnZhciBkID0gRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMScsIHByb3BzKTsgcmV0dXJuIHtwaXBlZHByb3A6MTIzNH19LCB7YXJnMTonaGVsbG8xJ30pXHJcbiAgICAgICAgICAgICAgICAuRG8oZnVuY3Rpb24gKHByb3BzKSB7Y29uc29sZS5sb2coJ3N0ZXAgMicsIHByb3BzKTt9LCBudWxsKVxyXG5cclxudmFyIGQgPSBEbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAxJywgcHJvcHMpOyByZXR1cm4ge3BpcGVkcHJvcDoxMjM0fX0sIHthcmcxOidoZWxsbzEnfSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAyJywgcHJvcHMpOyByZXR1cm4ge25ld1Byb3A6cHJvcHMucGlwZWRwcm9wKzJ9fSlcclxuICAgICAgICAgICAgICAgIC5EbyhmdW5jdGlvbiAocHJvcHMpIHtjb25zb2xlLmxvZygnc3RlcCAzJywgcHJvcHMpO30pXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERvO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLypcclxuLy8gd29ya3Mgd2l0aCBzdGFyLnN2ZyBhcyBiYXNlNjRcclxuLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQRDk0Yld3Z2RtVnljMmx2YmowaU1TNHdJaUJsYm1OdlpHbHVaejBpVlZSR0xUZ2lJ4oCmdHpkSEp2YTJVdFpHRnphR0Z5Y21GNU9tNXZibVU3YzNSeWIydGxMVzl3WVdOcGRIazZNU0lnTHo0Z0lEd3ZaejQ4TDNOMlp6ND0pO1xyXG4td2Via2l0LW1hc2stcmVwZWF0OiBuby1yZXBlYXQ7XHJcbi13ZWJraXQtbWFzay1zaXplOiAxMDAlO1xyXG5cclxuLy8gY2lyY2xlIHN2ZyBhbHNvIHdvcmtzXHJcbi13ZWJraXQtbWFzay1pbWFnZTogdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczMCcgaGVpZ2h0PSczMCc+PGNpcmNsZSBzaGFwZS1yZW5kZXJpbmc9J2dlb21ldHJpY1ByZWNpc2lvbicgY3g9JzE1JyBjeT0nMTUnIHI9JzEwJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzUnIGZpbGw9J25vbmUnLz48L3N2Zz5cIik7XHJcbi13ZWJraXQtbWFzay1yZXBlYXQ6IG5vLXJlcGVhdDtcclxuLXdlYmtpdC1tYXNrLXNpemU6IDEwMCU7XHJcblxyXG4uc3RhciB7XHJcbiAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQRDk0Yld3Z2RtVnljMmx2YmowaU1TNHdJaUJsYm1OdlpHbHVaejBpVlZSR0xUZ2lJSE4wWVc1a1lXeHZibVU5SW01dklqOCtQSE4yWnlBZ0lIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ0lDQjRiV3h1Y3pwall6MGlhSFIwY0RvdkwyTnlaV0YwYVhabFkyOXRiVzl1Y3k1dmNtY3Zibk1qSWlBZ0lIaHRiRzV6T25Ka1pqMGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNVGs1T1M4d01pOHlNaTF5WkdZdGMzbHVkR0Y0TFc1ekl5SWdJQ0I0Yld4dWN6cHpkbWM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWlBZ0lIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJZ0lDQjJaWEp6YVc5dVBTSXhMakVpSUNBZ2FXUTlJbk4yWnpJaUlDQWdkbWxsZDBKdmVEMGlNQ0F3SURrNUxqazVPVGs1TnlBNU9TNDVPVGs1T1RjaUlDQWdhR1ZwWjJoMFBTSXhNREFpSUNBZ2QybGtkR2c5SWpFd01DSStJQ0E4WkdWbWN5QWdJQ0FnYVdROUltUmxabk0wSWlBdlBpQWdQRzFsZEdGa1lYUmhJQ0FnSUNCcFpEMGliV1YwWVdSaGRHRTNJajRnSUNBZ1BISmtaanBTUkVZK0lDQWdJQ0FnUEdOak9sZHZjbXNnSUNBZ0lDQWdJQ0J5WkdZNllXSnZkWFE5SWlJK0lDQWdJQ0FnSUNBOFpHTTZabTl5YldGMFBtbHRZV2RsTDNOMlp5dDRiV3c4TDJSak9tWnZjbTFoZEQ0Z0lDQWdJQ0FnSUR4a1l6cDBlWEJsSUNBZ0lDQWdJQ0FnSUNCeVpHWTZjbVZ6YjNWeVkyVTlJbWgwZEhBNkx5OXdkWEpzTG05eVp5OWtZeTlrWTIxcGRIbHdaUzlUZEdsc2JFbHRZV2RsSWlBdlBpQWdJQ0FnSUNBZ1BHUmpPblJwZEd4bFBqd3ZaR002ZEdsMGJHVStJQ0FnSUNBZ1BDOWpZenBYYjNKclBpQWdJQ0E4TDNKa1pqcFNSRVkrSUNBOEwyMWxkR0ZrWVhSaFBpQWdQR2NnSUNBZ0lIUnlZVzV6Wm05eWJUMGlkSEpoYm5Oc1lYUmxLREFzTFRrMU1pNHpOakl5TXlraUlDQWdJQ0JwWkQwaWJHRjVaWEl4SWo0Z0lDQWdQSEJoZEdnZ0lDQWdJQ0FnWkQwaVRTQTFNQzR3TURBd01ERXNPVFUwTGpnd09UTTVJRFkxTGpRMU1EZzBPQ3c1T0RZdU1URTJNalFnTVRBd0xEazVNUzR4TXpZMU1pQTNOQzQ1T1RrNU9UZ3NNVEF4TlM0MU1EVTFJRGd3TGprd01UWTVPU3d4TURRNUxqa3hOU0ExTUN3eE1ETXpMalkyT1RFZ01Ua3VNRGs0TWprNExERXdORGt1T1RFMUlESTFMakF3TURBd01Td3hNREUxTGpVd05UVWdMVEV1TWpFek5ETXpObVV0Tml3NU9URXVNVE0yTlRJZ016UXVOVFE1TVRVeExEazROaTR4TVRZeU5DQmFJaUFnSUNBZ0lDQnBaRDBpY0dGMGFEUXhNellpSUNBZ0lDQWdJSE4wZVd4bFBTSnZjR0ZqYVhSNU9qRTdabWxzYkRvak1EQXdNREF3TzJacGJHd3RiM0JoWTJsMGVUb3dMalV3TWpJeU1qSTBPM04wY205clpUcHViMjVsTzNOMGNtOXJaUzEzYVdSMGFEb3lNaTQyTnpjeE5qVTVPVHR6ZEhKdmEyVXRiR2x1WldwdmFXNDZjbTkxYm1RN2MzUnliMnRsTFcxcGRHVnliR2x0YVhRNk5EdHpkSEp2YTJVdFpHRnphR0Z5Y21GNU9tNXZibVU3YzNSeWIydGxMVzl3WVdOcGRIazZNU0lnTHo0Z0lEd3ZaejQ4TDNOMlp6ND0pO1xyXG59XHJcbiovXHJcblxyXG5jbGFzcyBJbWdTVkcgZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIGxpbmVXaWR0aDogNSxcclxuICAgICAgcmFkaXVzOiAxMFxyXG4gICAgfTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdJbWdTVkcnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhwcm9wcy5wYXR0ZXJuKTtcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBsZXQgc3ZnVGFnID0gSW1nU1ZHLm1ha2VDaXJjbGVTVkcodGhpcy5wcm9wcy5yYWRpdXMsIHRoaXMucHJvcHMubGluZVdpZHRoKTtcclxuICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoc3ZnVGFnKTtcclxuICB9XHJcblxyXG4gIGdldFVSTCAoKSB7XHJcbiAgICByZXR1cm4gSW1nU1ZHLm1ha2VVUkwoSW1nU1ZHLm1ha2VDaXJjbGVTVkcodGhpcy5wcm9wcy5yYWRpdXMsIHRoaXMucHJvcHMubGluZVdpZHRoKSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVVSTCAoc3ZnVGFnKSB7XHJcbiAgICByZXR1cm4gYHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LCR7c3ZnVGFnfVwiKWA7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUNpcmNsZVNWRyAocmFkaXVzLCBsaW5lV2lkdGgpIHtcclxuICAgIGxldCBvdXRlclJhZGl1cyA9IHJhZGl1cyArIGxpbmVXaWR0aDtcclxuICAgIGxldCB3aWR0aCA9IChvdXRlclJhZGl1cykgKiAyO1xyXG4gICAgbGV0IHN2Z1RhZyA9IGA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JyR7d2lkdGh9JyBoZWlnaHQ9JyR7d2lkdGh9Jz48Y2lyY2xlIHNoYXBlLXJlbmRlcmluZz0nZ2VvbWV0cmljUHJlY2lzaW9uJyBjeD0nJHtvdXRlclJhZGl1c30nIGN5PScke291dGVyUmFkaXVzfScgcj0nJHtyYWRpdXN9JyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JyR7bGluZVdpZHRofScgZmlsbD0nbm9uZScvPjwvc3ZnPmA7XHJcbiAgICByZXR1cm4gc3ZnVGFnO1xyXG4gIH1cclxuXHJcbiAgLy8gcmFkaXVzOiByYWRpdXMgb2YgZG90ICh3aWxsIGJlIGNhcHBlZCBhdCAxLzQgb2Ygc2l6ZSwgc28gZG90cyBkb24ndCBvdmVyZmxvdyBpbWFnZSBib3VuZHMpXHJcbiAgLy8gc2l6ZTogc2l6ZSBvZiB0d28tZG90IGltYWdlIChzcXVhcmUpXHJcbiAgLy9cclxuICAvLyBTVkdzIHNjYWxlIHVwL2Rvd24gdmVyeSB3ZWxsLCBzbyB0aGVyZSdzIG5vIG5lZWQgdG8gc2V0IGEgbGFyZ2Ugc2l6ZS4gSnVzdCB1c2UgMTAwIGFuZCBzY2FsZSB0aGUgaW1hZ2UgaW4gQ1NTLlxyXG4gIHN0YXRpYyBtYWtlUG9sa2FEb3RzU1ZHIChyYWRpdXM9MjAsIHNpemU9MTAwKSB7XHJcbiAgICBsZXQgbGVmdCA9IHNpemUgKiAwLjI1O1xyXG4gICAgbGV0IHJpZ2h0ID0gc2l6ZSAqIDAuNzU7XHJcbiAgICBsZXQgciA9IHJhZGl1cyA+IHNpemUgKiAwLjI1ID8gc2l6ZSAqIDAuMjUgOiByYWRpdXM7XHJcbiAgICBsZXQgc3ZnVGFnID0gYDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nJHtzaXplfScgaGVpZ2h0PScke3NpemV9Jz48Y2lyY2xlIHNoYXBlLXJlbmRlcmluZz0nZ2VvbWV0cmljUHJlY2lzaW9uJyBjeD0nJHtsZWZ0fScgY3k9JyR7bGVmdH0nIHI9JyR7cn0nIGZpbGw9J2JsYWNrJy8+PGNpcmNsZSBzaGFwZS1yZW5kZXJpbmc9J2dlb21ldHJpY1ByZWNpc2lvbicgY3g9JyR7cmlnaHR9JyBjeT0nJHtyaWdodH0nIHI9JyR7cn0nIGZpbGw9J2JsYWNrJy8+PC9zdmc+YDtcclxuICAgIHJldHVybiBzdmdUYWc7XHJcbiAgfVxyXG59XHJcblxyXG5UaGluZy5hZGRDbGFzcyhJbWdTVkcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWdTVkc7XHJcblxyXG5cclxuLyoqIFNWRyBQb2xrYSBkb3QgcGF0dGVybiwgZmlsbGVkIGludG8gcmVjdGFuZ2xlXHJcblxyXG48c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+XHJcbiAgICA8ZGVmcz5cclxuICAgICAgICA8cGF0dGVybiB4PVwiNTYxLjIwMDAxMjIwNzAzMTJcIiB5PVwiMTY3XCIgaWQ9XCJwYXR0ZXJuLW91dHB1dFwiIHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiMzUwXCIgcGF0dGVyblVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj5cclxuICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCI0MDBcIiBoZWlnaHQ9XCIzNTBcIj5cclxuICAgICAgICAgICAgICAgIDxyZWN0IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWxsPVwiI2ZiZmJmYlwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgIDxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg5OSwgODkpLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDEpXCIgZmlsbD1cIiMwMDAwMDBcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlPVwibm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgcj1cIjI1XCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAsIDApLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDQuNSlcIj48L2NpcmNsZT5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIHI9XCIyNVwiIGNsYXNzPVwiY2xvbmVcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNDAwLCAwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCI+PC9jaXJjbGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSByPVwiMjVcIiBjbGFzcz1cImNsb25lXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAsIDM1MCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgcj1cIjI1XCIgY2xhc3M9XCJjbG9uZVwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg0MDAsIDM1MCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwLCAwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCIgeD1cIi0yNVwiIHk9XCItMjVcIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBmaWxsPVwidHJhbnNwYXJlbnRcIiBzdHJva2U9XCJub25lXCIgY2xhc3M9XCJzaGFwZS1vdmVybGF5XCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg0MDAsIDApLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDQuNSlcIiB4PVwiLTI1XCIgeT1cIi0yNVwiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIGZpbGw9XCJ0cmFuc3BhcmVudFwiIHN0cm9rZT1cIm5vbmVcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgPHJlY3QgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAsIDM1MCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiIHg9XCItMjVcIiB5PVwiLTI1XCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cInRyYW5zcGFyZW50XCIgc3Ryb2tlPVwibm9uZVwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNDAwLCAzNTApLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDQuNSlcIiB4PVwiLTI1XCIgeT1cIi0yNVwiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIGZpbGw9XCJ0cmFuc3BhcmVudFwiIHN0cm9rZT1cIm5vbmVcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICA8L2c+XHJcbiAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMzAyLCAyNTgpLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDEpXCIgZmlsbD1cIiMwMDAwMDBcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlPVwibm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgcj1cIjI1XCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAsIDApLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDQuNSlcIj48L2NpcmNsZT5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIHI9XCIyNVwiIGNsYXNzPVwiY2xvbmVcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTQwMCwgMCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgcj1cIjI1XCIgY2xhc3M9XCJjbG9uZVwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwLCAtMzUwKSwgcm90YXRlKDAsIDAsIDApLCBzY2FsZSg0LjUpXCI+PC9jaXJjbGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSByPVwiMjVcIiBjbGFzcz1cImNsb25lXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKC00MDAsIC0zNTApLCByb3RhdGUoMCwgMCwgMCksIHNjYWxlKDQuNSlcIj48L2NpcmNsZT5cclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwgMCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiIHg9XCItMjVcIiB5PVwiLTI1XCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cInRyYW5zcGFyZW50XCIgc3Ryb2tlPVwibm9uZVwiIGNsYXNzPVwic2hhcGUtb3ZlcmxheVwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTQwMCwgMCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiIHg9XCItMjVcIiB5PVwiLTI1XCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cInRyYW5zcGFyZW50XCIgc3Ryb2tlPVwibm9uZVwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwgLTM1MCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiIHg9XCItMjVcIiB5PVwiLTI1XCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cInRyYW5zcGFyZW50XCIgc3Ryb2tlPVwibm9uZVwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTQwMCwgLTM1MCksIHJvdGF0ZSgwLCAwLCAwKSwgc2NhbGUoNC41KVwiIHg9XCItMjVcIiB5PVwiLTI1XCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgZmlsbD1cInRyYW5zcGFyZW50XCIgc3Ryb2tlPVwibm9uZVwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgIDwvZz5cclxuICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgPC9wYXR0ZXJuPlxyXG4gICAgPC9kZWZzPlxyXG4gICAgPHJlY3QgY2xhc3M9XCJwcmV2aWV3LW91dHB1dFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWxsPVwidXJsKCNwYXR0ZXJuLW91dHB1dClcIj48L3JlY3Q+XHJcbjwvc3ZnPlxyXG4qL1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuLypcclxuICAgIHNyYzogPGZpbGUgcGF0aD5cclxuKi9cclxuY2xhc3MgSW1nIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cclxuICAgIHRoaXMudHlwZSA9ICdJbWcnO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5vbkltZ0xvYWRlZCA9IHByb3BzLm9uSW1nTG9hZGVkO1xyXG4gICAgdGhpcy5vbkltZ0Vycm9yID0gcHJvcHMub25JbWdFcnJvcjtcclxuICAgIHRoaXMuc3JjID0gcHJvcHMuc3JjO1xyXG5cclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuXHJcbiAgICAvLyB0cmFjayB0aGUgaW1hZ2UgbG9hZFxyXG4gICAgcGFnZUltZ1F1ZXVlLmFkZCh0aGlzKTtcclxuXHJcbiAgICAvLyBsb2FkIHRoZSBpbWFnZSwgb3Igc2tpcCBpZiBqYXZhc2NyaXB0IGltZyBpcyBwcm92aWRlZFxyXG4gICAgaWYgKHByb3BzLmltZykge1xyXG4gICAgICAgIHRoaXMub25Mb2FkKHByb3BzLmltZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvYWRJbWFnZShwcm9wcy5zcmMsIHRoaXMub25Mb2FkLmJpbmQodGhpcyksIHRoaXMub25FcnJvci5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uTG9hZCAoaW1nKSB7XHJcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmFzcGVjdFJhdGlvID0gaW1nLmhlaWdodCAvIGltZy53aWR0aDsgIC8vIGFzcGVjdCByYXRpbyBvZiBvcmlnaW5hbCBpbWFnZVxyXG4gICAgLy8gaWYgbmVpdGhlciBoZWlnaHQgbm9yIHdpZHRoIGFyZSBwcm92aWRlZCwgdXNlIG5hdGl2ZSBkaW1lbnNpb25zXHJcbiAgICAvLyBpZiB3aWR0aCBpcyBwcm92aWRlZCwgcmVjYWxjIGhlaWdodCBiYXNlZCBvbiBhc3BlY3RSYXRpb1xyXG4gICAgLy8gaWYgaGVpZ2h0IGlzIHByb3ZpZGVkLCByZWNhbGMgd2lkdGggYmFzZWQgb24gYXNwZWN0UmF0aW9cclxuICAgIGlmICh0aGlzLncgfHwgKCF0aGlzLncgJiYgIXRoaXMuaCkpIHtcclxuICAgICAgICB0aGlzLncgPSB0aGlzLncgfHwgaW1nLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaCA9IHRoaXMuaCB8fCAodGhpcy53ICogdGhpcy5hc3BlY3RSYXRpbyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmggPSB0aGlzLmg7XHJcbiAgICAgICAgdGhpcy53ID0gKHRoaXMuaCAqICgxL3RoaXMuYXNwZWN0UmF0aW8pKTtcclxuICAgICAgICB3aW5kb3cuY29uc29sZS5sb2coJ2ltZyBsb2FkZWQnLCB0aGlzLmgsIHRoaXMuYXNwZWN0UmF0aW8sICgxL3RoaXMuYXNwZWN0UmF0aW8pLCB0aGlzLncpO1xyXG4gICAgfVxyXG4gICAgLy8gc2V0IHRoZSBpbWFnZSBhcyB0aGUgZGl2J3MgYmFja2dyb3VuZFxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLncsXHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmgsXHJcbiAgICAgICAgYmFja2dyb3VuZDogJ3VybCgnICtpbWcuc3JjKyAnKSBuby1yZXBlYXQgY2VudGVyICcgKyAodGhpcy5wcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJycpLFxyXG4gICAgICAgIGJhY2tncm91bmRTaXplOiAnMTAwJSAxMDAlJ1xyXG4gICAgfSk7XHJcbiAgICAvLyBhcHBseSB0cmFuc2Zvcm1zIG5vdyB0aGF0IHdlIGtub3cgaW1hZ2Ugd2lkdGggYW5kIGhlaWdodFxyXG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIC8vIGNsZWFyIGltYWdlIGZyb20gdGhlIGxvYWQgcXVldWVcclxuICAgIHBhZ2VJbWdRdWV1ZS5yZW1vdmUodGhpcyk7XHJcbiAgICAvLyBleGVjIGNhbGxiYWNrIGlmIGFueVxyXG4gICAgdGhpcy5vbkltZ0xvYWRlZCAmJiB0aGlzLm9uSW1nTG9hZGVkKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgb25FcnJvciAoaW1nKSB7XHJcbiAgICBUaGluZy5tc2coJ0ltZy5vbkVycm9yOiBGYWlsZWQgdG8gbG9hZCAnICsgaW1nLnNyYyk7XHJcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICB0aGlzLncgPSB0aGlzLmggPSAwO1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDE7XHJcbiAgICBwYWdlSW1nUXVldWUucmVtb3ZlKHRoaXMpO1xyXG4gICAgLy8gZXhlYyBjYWxsYmFjayBpZiBhbnlcclxuICAgIHRoaXMub25JbWdFcnJvciAmJiB0aGlzLm9uSW1nRXJyb3IodGhpcyk7XHJcbiAgfVxyXG5cclxuICBzZXRXaWR0aCAodykge1xyXG4gICAgdGhpcy53ID0gdztcclxuICAgIHRoaXMuaCA9IHcgKiB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLncsXHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzZXRIZWlnaHQgKGgpIHtcclxuICAgIHRoaXMuaCA9IGg7XHJcbiAgICB0aGlzLncgPSBoICogKDEvdGhpcy5hc3BlY3RSYXRpbyk7XHJcbiAgICB0aGlzLmNzcyh7XHJcbiAgICAgICAgd2lkdGg6IHRoaXMudyxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaFxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBvbkFsbExvYWRlZCAoZnVuYykge1xyXG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgb25Mb2FkRnVuY3Rpb25zLnB1c2goZnVuYyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBUaGluZy5tc2coXCJJTUcub25BbGxMb2FkZWQoKTogdHJpZ2dlcmVkXCIpO1xyXG4gICAgICAgIG9uTG9hZEZ1bmN0aW9ucy5mb3JFYWNoKCAoZikgPT4geyBmKCk7IH0gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkQmF0Y2ggKHByb3BzQXJyYXkgPSBbXSwgb25CYXRjaExvYWRlZCA9ICgpID0+IHt9KSB7XHJcbiAgICBsZXQgcSA9IG5ldyBJbWdRdWV1ZSh7b25FbXB0eTogKCkgPT4geyBvbkJhdGNoTG9hZGVkKGxvYWRlZCk7IH19KTtcclxuICAgIGxldCBsb2FkZWQgPSBbXTtcclxuICAgIHByb3BzQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAocHJvcHMpIHtcclxuICAgICAgICBwcm9wcy5vbkltZ0xvYWRlZCA9IChpbWcpID0+IHsgXHJcbiAgICAgICAgICAgIGxvYWRlZC5wdXNoKGltZyk7IC8vIGhhcyB0byBiZSBCRUZPUkUgcS5yZW1vZSgpIHNvIGxhc3QgaW1hZ2UgaXMgaW5jbHVkZWQgd2hlbiBxLm9uRW1wdHkoKSBmaXJlcy5cclxuICAgICAgICAgICAgcS5yZW1vdmUoaW1nKTsgXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9wcy5vbkltZ0Vycm9yID0gKGltZykgPT4geyBcclxuICAgICAgICAgICAgcS5yZW1vdmUoaW1nKTsgXHJcbiAgICAgICAgfTtcclxuICAgICAgICBxLmFkZChJbWcubWFrZShwcm9wcykpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBleHBlY3RpbmcgYW4gb2JqZWN0IHBhcmFtIGxpa2U6IHsgc3JjOiAnaHR0cDsvL3BhdGgudG8vaW1hZ2UnIH1cclxuICAvLyBzdHJpbmcgcGFyYW0gd2lsbCBiZSBjb252ZXJ0ZWQgaW50byBvYmplY3Qgd2l0aCBzcmMgcHJvcGVydHlcclxuICBzdGF0aWMgZ2V0SW1hZ2UoaW1nQ29uZmlnT3JVcmwpIHtcclxuICAgICAgdmFyIGltZ0NvbmZpZyA9ICh0eXBlb2YgaW1nQ29uZmlnT3JVcmwgPT09ICdzdHJpbmcnKSA/IHtzcmM6IGltZ0NvbmZpZ09yVXJsfSA6IGltZ0NvbmZpZ09yVXJsO1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShpbWdDb25maWcpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KGltZ0NvbmZpZyk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaW1nQ29uZmlnLmltZyA9IGltZztcclxuICAgICAgICAgIGltZy5zcmMgPSBpbWdDb25maWcuc3JjO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkSW1hZ2VzKGltYWdlUGF0aHMsIGNhbGxiYWNrKSB7XHJcbiAgICAgIHZhciBwcm9taXNlcyA9IGltYWdlUGF0aHMubWFwKEltZy5nZXRJbWFnZSk7XHJcbiAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKVxyXG4gICAgICAudGhlbihmdW5jdGlvbiAoaW1nc0pTT04pIHtcclxuICAgICAgICAgIC8vIGNvbnZlcnQgamF2YXNjcmlwdCBpbWcgb2JqZWN0cyB0byBUaGluZyBJbWcgb2JqZWN0c1xyXG4gICAgICAgICAgdmFyIHRoaW5nSW1ncyA9IGltZ3NKU09OLm1hcChmdW5jdGlvbiAoaW1nSlNPTikgeyByZXR1cm4gVGhpbmcuSW1nLm1ha2UoaW1nSlNPTik7IH0pO1xyXG4gICAgICAgICAgY2FsbGJhY2sodGhpbmdJbWdzKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKHVybHMpIHtcclxuICAgICAgICAgIFRoaW5nLm1zZyhcIkltZy5sb2FkSW1hZ2VzOiBFcnJvciBmZXRjaGluZyBzb21lIGltYWdlczogXCIgKyB1cmxzKTtcclxuICAgICAgfSk7ICAgICAgIFxyXG4gIH1cclxufVxyXG5cclxuVGhpbmcuYWRkQ2xhc3MoSW1nKTtcclxuXHJcblxyXG5jbGFzcyBJbWdRdWV1ZSB7XHJcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMgPSB7b25FbXB0eTogZnVuY3Rpb24gKCkge319KSB7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRJbWdzID0gW107XHJcbiAgICAgICAgdGhpcy5vbkVtcHR5ID0gcHJvcHMub25FbXB0eTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKGltZykge1xyXG4gICAgICAgIGlmIChpbWcgJiYgIWltZy5sb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWV1ZWRJbWdzLnB1c2goaW1nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWVkSW1ncy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlIChpbWcpIHtcclxuICAgICAgICBpZiAoaW1nICYmIGltZy5sb2FkZWQpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5xdWV1ZWRJbWdzLmluZGV4T2YoaW1nKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVldWVkSW1ncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXVlZEltZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRW1wdHkgJiYgdGhpcy5vbkVtcHR5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWVkSW1ncy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtYWluaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZWRJbWdzLmxlbmd0aDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEltYWdlIChzcmMsIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY2FsbGJhY2sodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgaW1nLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZXJyb3JDYWxsYmFjayh0aGlzKTtcclxuICAgIH07XHJcbiAgICBpbWcuc3JjID0gc3JjO1xyXG59XHJcblxyXG52YXIgb25Mb2FkRnVuY3Rpb25zID0gW107XHJcbnZhciBwYWdlSW1nUXVldWUgPSBuZXcgSW1nUXVldWUoe29uRW1wdHk6ICgpID0+IEltZy5vbkFsbExvYWRlZCgpfSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEltZztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIExhYmVsIGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHR0ZXh0OiAnJyxcclxuXHRcdFx0aHRtbDogZmFsc2UsXHJcblx0XHRcdGZvbnRGYW1pbHk6ICdSb2JvdG8sIENhbGlicmksIEFyaWFsLCBzYW5zLXNlcmlmJyxcclxuXHRcdFx0Zm9udFNpemU6ICcxNHB4JyxcclxuXHRcdFx0Y29sb3I6ICcjMDAwJ1xyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0dGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0xhYmVsJztcclxuXHRcdHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcblx0XHR0aGlzLmlzSFRNTCA9IHByb3BzLmh0bWw7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuc2V0VGV4dChwcm9wcy50ZXh0KTtcclxuXHJcblx0XHRUaGluZy5hZGRGb250VVJMKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvOjEwMCw0MDAsNzAwLDkwMCcsICdyb2JvdG9fZm9udCcpO1xyXG5cdH1cclxuXHJcblx0c2V0VGV4dCAodHh0KSB7XHJcblx0XHR0aGlzLnRleHQgPSB0eHQ7XHJcblx0XHRpZiAodGhpcy5pc0hUTUwpIHtcclxuXHRcdFx0Ly8gd2lsbCByZXNwZWN0IGh0bWwgdGFnc1xyXG5cdFx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkuaHRtbCh0eHQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIGxpdGVyYWwgdGV4dCAtIHdpbGwgc2hvdyBhbmdsZSBicmFja2V0c1xyXG5cdFx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCkudGV4dCh0eHQpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKExhYmVsKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGFiZWw7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBMaW5lIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICAvLyBleHBlY3RpbmcgcHJvcHM6IHsgeDowLCB5OjAsIHgyOjUwLCB5Mjo1MCwgbGluZVdpZHRoOjUgfVxyXG4gICAgLy8gY2FsbCBpdCAnbGluZVdpZHRoJyB0byBhdm9pZCBjb2xsaXNpb24gd2l0aCBDU1MgJ3dpZHRoJyBwcm9wZXJ0eVxyXG5cclxuICAgIC8vIGZpeCBvbGQgcHJvcGVydHkgbmFtZXNcclxuICAgIHByb3BzLnggPSBwcm9wcy54IHx8IHByb3BzLngxIHx8IDA7XHJcbiAgICBwcm9wcy55ID0gcHJvcHMueSB8fCBwcm9wcy55MSB8fCAwO1xyXG4gICAgZGVsZXRlIHByb3BzLngxO1xyXG4gICAgZGVsZXRlIHByb3BzLnkxO1xyXG5cclxuICAgIC8vIG5lZWQgdG8gc2V0IG9yaWdpbiB0byBmYXIgbGVmdCBvZiBsaW5lXHJcbiAgICBwcm9wcy50cmFuc2Zvcm1PcmlnaW4gPSAnMCA1MCUnO1xyXG4gICAgcHJvcHMuYmFja2dyb3VuZENvbG9yID0gcHJvcHMgJiYgKHByb3BzLmJhY2tncm91bmRDb2xvciB8fCBwcm9wcy5jb2xvciB8fCAnYmxhY2snKTtcclxuICAgIHN1cGVyLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcblxyXG4gICAgdGhpcy50eXBlID0gJ0xpbmUnO1xyXG5cclxuICAgIHRoaXMuY3JlYXRlTGluZShwcm9wcy54LCBwcm9wcy55LCBwcm9wcy54MiwgcHJvcHMueTIsIHByb3BzLmxpbmVXaWR0aCwgcHJvcHMuYXJyb3csIHByb3BzLnNob3J0ZW4pO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlTGluZSAoeDEseTEsIHgyLHkyLCBsaW5lV2lkdGgsIGFycm93LCBzaG9ydGVuKSB7XHJcbiAgICB0aGlzLmxpbmVXaWR0aCA9IGxpbmVXaWR0aCB8fCAyO1xyXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoKHgxLXgyKSooeDEteDIpICsgKHkxLXkyKSooeTEteTIpKSAtIChhcnJvdz8gdGhpcy5saW5lV2lkdGgqMiA6IDApOyAgLy8gc2hvcnRlbiB0aGUgbGVuZ3RoIHRvIG1ha2Ugcm9vbSBmb3IgYXJyb3doZWFkXHJcbiAgICB0aGlzLmFuZ2xlICA9IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgdGhpcy5sZW5ndGggLT0gc2hvcnRlbiB8fCAwOyAgLy8gc2hvcnRlbiB0aGUgbGluZSBhIGJpdCAobWFrZXMgcm9vbSBmb3IgYXJyb3doZWFkKVxyXG5cclxuICAgIC8vIGdycnJycnIuLi4gc29tZSBmdW5jcyByZWFkIGZyb20gcHJvcHMueCwgc29tZSByZWFkIHRoaXMueFxyXG4gICAgdGhpcy54ID0gdGhpcy5wcm9wcy54ID0geDE7XHJcbiAgICB0aGlzLnkgPSB0aGlzLnByb3BzLnkgPSAoeTEtKHRoaXMubGluZVdpZHRoLzIpKTtcclxuICAgIHRoaXMudyA9IHRoaXMucHJvcHMudyA9IHRoaXMubGVuZ3RoO1xyXG4gICAgdGhpcy5oID0gdGhpcy5wcm9wcy5oID0gdGhpcy5saW5lV2lkdGg7XHJcbiAgICB0aGlzLnJvdGF0aW9uID0gdGhpcy5wcm9wcy5yb3RhdGUgPSB7ejogdGhpcy5hbmdsZX07XHJcblxyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG5cclxuICAgIGlmIChhcnJvdykge1xyXG4gICAgICB0aGlzLmFkZEFycm93SGVhZCh0aGlzLmxlbmd0aCwgdGhpcy5saW5lV2lkdGgsIHRoaXMubGluZVdpZHRoKjIsIHRoaXMucHJvcHMuYmFja2dyb3VuZENvbG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGxlbiBvZiBsaW5lLCB3aWR0aCBvZiBsaW5lLCBzaXplIG9mIHRyaWFuZ2xlIChpZS4gMTAgd2lsbCBiZSAxMHB4IHdpZGUgYW5kIDIwcHggaGlnaClcclxuICBhZGRBcnJvd0hlYWQgKGxlbiwgd2lkdGgsIHNpemUsIGNvbG9yKSB7XHJcbiAgICB0aGlzLmFycm93SGVhZCA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICB0aGlzLmFycm93SGVhZC5jc3Moe1xyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgd2lkdGg6IDAsXHJcbiAgICAgIGhlaWdodDogMCxcclxuICAgICAgZm9udFNpemU6IDAsXHJcbiAgICAgIGxpbmVIZWlnaHQ6IDAsXHJcbiAgICAgIGxlZnQ6IGxlbiArICdweCcsXHJcbiAgICAgIHRvcDogLShzaXplLSh3aWR0aC8yKSkgKyAncHgnLFxyXG4gICAgICBib3JkZXJCb3R0b206IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJUb3A6IHNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxyXG4gICAgICBib3JkZXJMZWZ0OiBzaXplICsgJ3B4IHNvbGlkICcgKyBjb2xvclxyXG4gICAgfSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKHRoaXMuYXJyb3dIZWFkKTtcclxuICB9XHJcblxyXG4gIGRhc2hlZCAoZGFzaFNpemUpIHtcclxuICAgIGRhc2hTaXplID0gZGFzaFNpemU9PT11bmRlZmluZWQgPyAxMCA6IGRhc2hTaXplO1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgMzAlLCAnICt0aGlzLnByb3BzLmJhY2tncm91bmRDb2xvcisgJyAzMCUpJyxcclxuICAgICAgYmFja2dyb3VuZFNpemU6IGRhc2hTaXplICsgJ3B4J1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoTGluZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpbmU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbnZhciBSYW5kID0gcmVxdWlyZSgnLi4vUmFuZC9SYW5kLmpzJyk7XHJcblxyXG5jbGFzcyBQYWdlIHtcclxuICAgIHN0YXRpYyBkb3dubG9hZChkYXRhLCBmaWxlbmFtZSwgdHlwZSkge1xyXG4gICAgICAgIHZhciBmaWxlID0gbmV3IEJsb2IoW2RhdGFdLCB7dHlwZTogdHlwZX0pO1xyXG4gICAgICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xyXG4gICAgICAgIHZhciBhID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGEuaHJlZiA9IHVybDtcclxuICAgICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XHJcbiAgICAgICAgd2luZG93LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgYS5jbGljaygpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xyXG4gICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xyXG4gICAgICAgIH0sIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXREb2N1bWVudEhUTUwgKCkge1xyXG4gICAgICAgIHZhciBlbnRpcmVEb2MgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2h0bWwnKVswXTtcclxuICAgICAgICB2YXIgZW50aXJlRG9jU3RyID0gJzxodG1sPicgKyBlbnRpcmVEb2MuaW5uZXJIVE1MICsgJzwvaHRtbD4nO1xyXG4gICAgICAgIHJldHVybiBlbnRpcmVEb2NTdHI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNhdmVEb2NUb0ZpbGUoKSB7XHJcbiAgICAgICAgdmFyIHJhbmRudW0gPSBwYXJzZUludChNYXRoLnJhbmRvbSgpKjEwMDAwMDAwMCk7XHJcblxyXG4gICAgICAgIC8vIGh0bWwgb25seTogZG9uJ3Qgc2F2ZSBzY3JpcHRzXHJcbiAgICAgICAgJCgnc2NyaXB0JykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIFBhZ2UuZG93bmxvYWQoUGFnZS5nZXREb2N1bWVudEhUTUwoKSwgJ1RoaW5nX3NhdmVkX2ZpbGVfJyArIHJhbmRudW0gKyAnLmh0bWwnLCAndGV4dC9odG1sJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldFNjYWxlIChzY2FsZSkge1xyXG4gICAgICAgIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdsZWZ0IHRvcCc7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbml0RXZlbnRzKCkge1xyXG4gICAgICAgIC8vIExpc3RlbiBmb3Iga2V5cHJlc3NcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICAgICAgICB2YXIgbiA9IE51bWJlcihlLmtleSk7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChuID49IDAgJiYgbiA8PSA5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTnVtYmVyIGtleXMgc2NhbGUgdGhlIHBhZ2UgZnJvbSAuMSB0byAuOS4gMCBpcyBmdWxsc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IG4gPT09IDAgPyAxIDogbi8xMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNjYWxlKHNjYWxlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNlIGlmIChlLmtleSA9PT0gJ3MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcyB0b2dnbGVzIHNjcm9sbGluZyBvbi9vZmZcclxuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5vdmVyZmxvdyA9IChlbC5zdHlsZS5vdmVyZmxvdyA9PT0gJ2hpZGRlbicpID8gJ3Njcm9sbCcgOiAnaGlkZGVuJztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlS2V5dmFsU3RyaW5nKHN0ciwgZGVsaW1pdGVyID0gJyYnLCBhc3NvY2lhdGl2ZU9wZXJhdG9yID0gJz0nKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XHJcbiAgICAgICAgY29uc3QgZGVjb2RlZFN0ciA9IHN0ciA/IGRlY29kZVVSSUNvbXBvbmVudChzdHIpIDogbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKGRlY29kZWRTdHIpIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5dmFscyA9IGRlY29kZWRTdHIuc3BsaXQoZGVsaW1pdGVyKTtcclxuICAgICAgICAgICAga2V5dmFscy5mb3JFYWNoKChrdikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5dmFsID0ga3Yuc3BsaXQoYXNzb2NpYXRpdmVPcGVyYXRvcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5dmFsLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5dmFsLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSBrZXl2YWwuam9pbignPScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5LnRyaW0oKV0gPSB2YWwudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRQYXJhbXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VLZXl2YWxTdHJpbmcod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldHVwKCkge1xyXG4gICAgICAgIHZhciBwYWdlUGFyYW1zID0gVGhpbmcuUGFnZS5nZXRQYXJhbXMoKTtcclxuICAgICAgICBSYW5kLmluaXQocGFnZVBhcmFtcy5yYW5kb21TZWVkKTtcclxuICAgICAgICBQYWdlLnNldFNjYWxlKHBhZ2VQYXJhbXMuc2NhbGUgfHwgMSk7XHJcbiAgICAgICAgUGFnZS5pbml0RXZlbnRzKCk7XHJcbiAgICB9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUGFnZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2U7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBQYXR0ZXJuUG9sa2FEb3RzIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBjb2xvcjogJyNmZmZkZDcnLFxyXG4gICAgICByYWRpdXM6IDEwMCxcclxuICAgICAgc2l6ZTogNTAwXHJcbiAgICB9O1xyXG4gICAgcHJvcHMucmFkaXVzID0gcHJvcHMucmFkaXVzIHx8IHByb3BzLnNpemUvNTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuUG9sa2FEb3RzJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIC8vIHBvbGthIGRvdHMgYmFja2dyb3VuZFxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6ICdyYWRpYWwtZ3JhZGllbnQoJyArcHJvcHMuY29sb3IrICcgJyArcHJvcHMucmFkaXVzKyAncHgsIHRyYW5zcGFyZW50ICcgKyhwcm9wcy5yYWRpdXMrMikrICdweCksIHJhZGlhbC1ncmFkaWVudCgnICtwcm9wcy5jb2xvcisgJyAnICtwcm9wcy5yYWRpdXMrICdweCwgdHJhbnNwYXJlbnQgJyArKHByb3BzLnJhZGl1cysyKSsgJ3B4KScsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBwcm9wcy5zaXplICsgJ3B4ICcgKyBwcm9wcy5zaXplICsgJ3B4JyxcclxuICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiAnMCAwLCAnICsocHJvcHMuc2l6ZS8yKSsgJ3B4ICcgKyhwcm9wcy5zaXplLzIpKyAncHgnXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICAgIC8vIEFkanVzdCBwYXR0ZXJuIHRvIGZpbGwgcGFyZW50XHJcbiAgICAgIHN1cGVyLmZpbGxQYXJlbnQodGhpcy5wcm9wcy5zdHJldGNoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBUaGluZy5tc2coJ1BhdHRlcm4ucmVuZGVyKCk6IFBhdHRlcm4gbmVlZHMgdG8gYmUgYWRkZWQgdG8gYSBwYXJlbnQgYmVmb3JlIGNhbGxpbmcgcmVuZGVyLicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxufVxyXG5UaGluZy5hZGRDbGFzcyhQYXR0ZXJuUG9sa2FEb3RzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblBvbGthRG90cztcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5QYXR0ZXJuU29mYSB7XFxyXFxuICBiYWNrZ3JvdW5kOlxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDk5JSwgNDAlKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA5JSkgMCAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDQwJSkgNCUsIGhzbCgwLCAxMDAlLCAxOCUpIDglLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgMTAlKSA1MCUgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCA0NiUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSAwLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCA0MSUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsKDAsIDEwMCUsIDIzJSkgMzUlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNjAlKSA1MCUgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpIDEwMCUgNTAlLFxcclxcbiAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCA5NiUsIDQlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDAgMCxcXHJcXG4gICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMTUlLCAwLjcpLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpIDUwJSA1MCUsXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCg0NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDAsXFxyXFxuICAgIGxpbmVhci1ncmFkaWVudCgtNDVkZWcsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA0OSUsIGhzbGEoMCwgMTAwJSwgMCUsIDEpIDUwJSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDcwJSkgMCAwO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMwMDtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMjUlIDI1JTtcXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQ1NTID0gcmVxdWlyZSgnLi9QYXR0ZXJuU29mYS5jc3MnKTtcclxuXHJcbmNsYXNzIFBhdHRlcm5Tb2ZhIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBzaXplOiAyNVxyXG4gICAgfTtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnUGF0dGVyblNvZmEnO1xyXG4gICAgdGhpcy5wYXR0ZXJuU2l6ZXMgPSBbNSwgMTAsIDEyLjUsIDE2LjYsIDI1LCA1MF07IC8vIHBlcmNlbnQgYmFja2dyb3VuZCBzaXplcyB0aGF0IGRvbid0IGRpc3RvcnQgcGF0dGVyblxyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gICAgVGhpbmcuYWRkQ1NTU3RyaW5nKENTUywgJ1BhdHRlcm5Tb2ZhJyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG5cclxuICAgICAgLy8gcmVzaXplIHBhdHRlcm4gdG8gZmlsbCBwYXJlbnQgZWxlbWVudCB3aXRoIGEgc3F1YXJlIGFzcGVjdCByYXRpb1xyXG4gICAgICB0aGlzLmZpbGxQYXJlbnQodGhpcy5wcm9wcy5zdHJldGNoKTtcclxuXHJcbiAgICAgIC8vIFR3ZWFrIHRoZSBwYXR0ZXJuIHNpemVcclxuICAgICAgaWYgKHRoaXMucHJvcHMuc2l6ZSkge1xyXG4gICAgICAgIHRoaXMuY3NzKHtiYWNrZ3JvdW5kU2l6ZTogKHRoaXMucGF0dGVyblNpemVzW3RoaXMucHJvcHMuc2l6ZV0gfHwgMjUpICsgJyUnfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBUaGluZy5tc2coJ1BhdHRlcm4ucmVuZGVyKCk6IFBhdHRlcm4gbmVlZHMgdG8gYmUgYWRkZWQgdG8gYSBwYXJlbnQgYmVmb3JlIGNhbGxpbmcgcmVuZGVyLicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm5Tb2ZhKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblNvZmE7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBQYXR0ZXJuU3RyaXBlcyBleHRlbmRzIFRoaW5nIHtcclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgICAgY29sb3I6ICdyZ2JhKDI1NSwyMDUsMjUsMSknLFxyXG4gICAgICByYWRpdXM6IDEwMCxcclxuICAgICAgc2l6ZTogNTAwXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgdGhpcy5zZXREZWZhdWx0UHJvcHMocHJvcHMpO1xyXG4gICAgdGhpcy50eXBlID0gJ1BhdHRlcm5TdHJpcGVzJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIC8vIHN0cmlwZXMgYmFja2dyb3VuZFxyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6ICdsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgJyArcHJvcHMuY29sb3IrICcgNTAlKScsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBwcm9wcy5zaXplICsgJ3B4J1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgICAvLyBBZGp1c3QgcGF0dGVybiB0byBmaWxsIHBhcmVudFxyXG4gICAgICBzdXBlci5maWxsUGFyZW50KHRoaXMucHJvcHMuc3RyZXRjaCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgVGhpbmcubXNnKCdQYXR0ZXJuLnJlbmRlcigpOiBQYXR0ZXJuIG5lZWRzIHRvIGJlIGFkZGVkIHRvIGEgcGFyZW50IGJlZm9yZSBjYWxsaW5nIHJlbmRlci4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUGF0dGVyblN0cmlwZXMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuU3RyaXBlcztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIFBhdHRlcm5UaWxlTWFyYmxlIGV4dGVuZHMgVGhpbmcge1xyXG4gIGluaXQgKHByb3BzKSB7XHJcbiAgICB2YXIgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBzaXplOiA1MDBcclxuICAgIH07XHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLnNldERlZmF1bHRQcm9wcyhwcm9wcyk7XHJcbiAgICB0aGlzLnR5cGUgPSAnUGF0dGVyblRpbGVNYXJibGUnO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICBzdXBlci5yZW5kZXIoKTtcclxuXHJcbiAgICAgIHZhciBwYXR0ZXJuVyA9IDM2MzA7XHJcbiAgICAgIHZhciBwYXR0ZXJuSCA9IDMwMDA7XHJcbiAgICAgIHZhciB0aWxlVyA9IDUwMDtcclxuICAgICAgdmFyIHRpbGVIID0gNTAwO1xyXG4gICAgICB2YXIgbnVtVGlsZXMgPSAocGFyc2VJbnQocGF0dGVyblcvdGlsZVcpICsgMSkgKiAocGFyc2VJbnQocGF0dGVybkgvdGlsZUgpICsgMSk7XHJcblxyXG4gICAgICAvLyB2YXIgQkcgPSBUaGluZy5Cb3gubWFrZSh7XHJcbiAgICAgIC8vICAgYmFja2dyb3VuZEltYWdlOiAndXJsKGltZy9jb25jcmV0ZV8xLmpwZyknLFxyXG4gICAgICAvLyAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAvLyAgIHc6IHBhdHRlcm5XLFxyXG4gICAgICAvLyAgIGg6IHBhdHRlcm5IXHJcbiAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgdGhpcy5jc3Moe2JhY2tncm91bmRJbWFnZTogJ3VybChpbWcvY29uY3JldGVfMS5qcGcpJ30pO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wOyBpIDwgbnVtVGlsZXM7IGkrKykge1xyXG4gICAgICAgIHZhciByYW5kWCA9IFRoaW5nLlJhbmQucmFuZEludCgwLDIwMDApICogLTE7ICAvLyBsZXNzIHRoYW4gd2lkdGggb2YgYmFja2dyb3VuZCBUZXh0dXJlXHJcbiAgICAgICAgdmFyIHJhbmRZID0gVGhpbmcuUmFuZC5yYW5kSW50KDAsMTAwMCkgKiAtMTsgIC8vIGxlc3MgdGhhbiBoZWlnaHQgb2YgYmFja2dyb3VuZCBUZXh0dXJlXHJcbiAgICAgICAgdmFyIHRpbGUgPSBUaGluZy5tYWtlKHtcclxuICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMTUpJyxcclxuICAgICAgICAgIGJveFNoYWRvdzogJ3JnYigyNTUsIDI1NSwgMjU1KSAxMnB4IDEycHggMjVweCBpbnNldCwgcmdiKDE4MCwgMTgwLCAxODApIC0xMnB4IC0xMnB4IDI1cHggaW5zZXQsIHJnYmEoMzMsIDMzLCAzMywgMC40KSA2cHggNnB4IDhweCcsXHJcbiAgICAgICAgICAvLyBiYWNrZ3JvdW5kSW1hZ2U6ICdyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBmYXJ0aGVzdC1jb3JuZXIgYXQgMTQwcHggMjBweCAsIHJnYmEoMjUwLCAyNTAsIDI1MCwgMC45KSAzMCUsIHJnYmEoMjM4LCAyMzgsIDIzOCwgMC44KSA4NSUpJyxcclxuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogJ3VybChpbWcvd2hpdGUtbWFyYmxlLXRleHR1cmUtbGl0ZS5qcGcpJyxcclxuICAgICAgICAgIGJhY2tncm91bmRQb3NpdGlvbjogcmFuZFgrJ3B4ICcrIHJhbmRZKydweCcsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kUmVwZWF0OiAnbm8tcmVwZWF0JyxcclxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgZmxvYXQ6ICdsZWZ0JyxcclxuICAgICAgICAgIHc6IHRpbGVXLFxyXG4gICAgICAgICAgaDogdGlsZUgsXHJcbiAgICAgICAgICBtYXJnaW46ICc1cHgnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQodGlsZS4kZWxlbWVudCk7XHJcbiAgICAgICAgLy8gQkcuYWRkKHRpbGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIFRoaW5nLm1zZygnUGF0dGVybi5yZW5kZXIoKTogUGF0dGVybiBuZWVkcyB0byBiZSBhZGRlZCB0byBhIHBhcmVudCBiZWZvcmUgY2FsbGluZyByZW5kZXIuJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG59XHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm5UaWxlTWFyYmxlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblRpbGVNYXJibGU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcbi8vIHZhciBDU1MgPSByZXF1aXJlKCcuL1BhdHRlcm4uY3NzJyk7XHJcblxyXG5mdW5jdGlvbiBvbmVMaW5lKHMpIHtcclxuICByZXR1cm4gKHMucmVwbGFjZSgvXFxyP1xcbnxcXHJ8XFx0L2dtLCAnJykpLnRyaW0oKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIFBhdHRlcm4gZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIHBhdHRlcm46ICdHcmFwaFBhcGVyJyxcclxuICAgICAgc3RyZXRjaDogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHRoaXMucHJvcHMgPSBwcm9wcyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdQYXR0ZXJuJztcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudCh0aGlzLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MocHJvcHMucGF0dGVybik7XHJcblxyXG4gICAgLy8gQWRkIHRoZSBQYXR0ZXJucyBjc3MgKHdpbGwgYWRkIG9ubHkgb25jZSlcclxuICAgIC8vIFRoaW5nLmFkZENTU1N0cmluZyhDU1MsICdQYXR0ZXJuJyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgc3VwZXIucmVuZGVyKCk7XHJcblxyXG4gICAgLy8gQWRqdXN0IHBhdHRlcm4gdG8gZmlsbCBwYXJlbnQgd2l0aCBhIHNxdWFyZSBhc3BlY3QgcmF0aW9cclxuICAgIHN1cGVyLmZpbGxQYXJlbnQodGhpcy5wcm9wcy5zdHJldGNoKTtcclxuXHJcbiAgICBpZiAodGhpcy5wcm9wcy5wYXR0ZXJuICYmIHBhdHRlcm5UZW1wbGF0ZXNbdGhpcy5wcm9wcy5wYXR0ZXJuXSkge1xyXG4gICAgICB2YXIgcGF0dGVyblRlbXBsYXRlID0gcGF0dGVyblRlbXBsYXRlc1t0aGlzLnByb3BzLnBhdHRlcm5dO1xyXG4gICAgICB0aGlzLmNzcyggcGF0dGVyblRlbXBsYXRlKHRoaXMucHJvcHMpICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnByb3BzLnNpemUpIHsgLy8gVHdlYWsgdGhlIHNpemVcclxuICAgICAgdGhpcy5jc3Moe2JhY2tncm91bmRTaXplOiB0aGlzLnByb3BzLnNpemUgKyAnJSd9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlR3JpZFBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDUwO1xyXG4gICAgbGV0IGNvbG9yID0gcHJvcHMuY29sb3IgfHwgJ3JnYmEoMjU1LDI1NSwyNTUsLjUpJztcclxuICAgIGxldCBiZ0NvbG9yID0gcHJvcHMuYmFja2dyb3VuZENvbG9yIHx8ICd0cmFuc3BhcmVudCc7XHJcbiAgICBsZXQgbGluZVdpZHRoID0gcHJvcHMubGluZVdpZHRoIHx8IDI7XHJcbiAgICBsZXQgcGF0dGVybkNTUyA9IHtcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogYCR7c2l6ZX1weCAke3NpemV9cHgsICR7c2l6ZX1weCAke3NpemV9cHhgLFxyXG4gICAgICBiYWNrZ3JvdW5kUG9zaXRpb246IGAtJHtsaW5lV2lkdGh9cHggLSR7bGluZVdpZHRofXB4LCAtJHtsaW5lV2lkdGh9cHggLSR7bGluZVdpZHRofXB4YCxcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiBvbmVMaW5lKGBsaW5lYXItZ3JhZGllbnQoJHtjb2xvcn0gJHtsaW5lV2lkdGh9cHgsIHRyYW5zcGFyZW50ICR7bGluZVdpZHRofXB4KSxcclxuICAgICAgICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgJHtjb2xvcn0gJHtsaW5lV2lkdGh9cHgsIHRyYW5zcGFyZW50ICR7bGluZVdpZHRofXB4KWApLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gcGF0dGVybkNTUztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlR3JhcGhQYXBlclBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDEwMDtcclxuICAgIGxldCBkaXZTaXplID0gc2l6ZSAvIDU7XHJcbiAgICBsZXQgY29sb3IgPSBwcm9wcy5jb2xvciB8fCAncmdiYSgyNTUsMjU1LDI1NSwuMyknO1xyXG4gICAgbGV0IGJnQ29sb3IgPSBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMwMDMnO1xyXG4gICAgbGV0IGxpbmVXaWR0aCA9IHByb3BzLmxpbmVXaWR0aCB8fCA0O1xyXG4gICAgbGV0IGxXaWR0aCA9IGxpbmVXaWR0aCAvIDI7XHJcbiAgICBsZXQgYmdJbWcgPSBgXHJcbiAgICAgICAgbGluZWFyLWdyYWRpZW50KCR7Y29sb3J9ICR7bGluZVdpZHRofXB4LCB0cmFuc3BhcmVudCAke2xpbmVXaWR0aH1weCksXHJcbiAgICAgICAgbGluZWFyLWdyYWRpZW50KDkwZGVnLCAke2NvbG9yfSAke2xpbmVXaWR0aH1weCwgdHJhbnNwYXJlbnQgJHtsaW5lV2lkdGh9cHgpLFxyXG4gICAgICAgIGxpbmVhci1ncmFkaWVudCgke2NvbG9yfSAke2xXaWR0aH1weCwgdHJhbnNwYXJlbnQgJHtsV2lkdGh9cHgpLFxyXG4gICAgICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgJHtjb2xvcn0gJHtsV2lkdGh9cHgsIHRyYW5zcGFyZW50ICR7bFdpZHRofXB4KWA7XHJcbiAgICBsZXQgcGF0dGVybkNTUyA9IHtcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogYCR7c2l6ZX1weCAke3NpemV9cHgsICR7c2l6ZX1weCAke3NpemV9cHgsICR7ZGl2U2l6ZX1weCAke2RpdlNpemV9cHgsICR7ZGl2U2l6ZX1weCAke2RpdlNpemV9cHhgLFxyXG4gICAgICBiYWNrZ3JvdW5kUG9zaXRpb246IGAtJHtsaW5lV2lkdGh9cHggLSR7bGluZVdpZHRofXB4LCAtJHtsaW5lV2lkdGh9cHggLSR7bGluZVdpZHRofXB4LCAtJHtsV2lkdGh9cHggLSR7bFdpZHRofXB4LCAtJHtsV2lkdGh9cHggLSR7bFdpZHRofXB4YCxcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiBvbmVMaW5lKGJnSW1nKSxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHBhdHRlcm5DU1M7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZURpYWdvbmFsU3RyaXBlUGF0dGVybkNTUyhwcm9wcykge1xyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHJcbiAgICBsZXQgc2l6ZSA9IHByb3BzLnNpemUgfHwgNTA7XHJcbiAgICBsZXQgY29sb3IgPSBwcm9wcy5jb2xvciB8fCAnIzBlMDAzMCc7XHJcbiAgICBsZXQgYmdDb2xvciA9IHByb3BzLmJhY2tncm91bmRDb2xvciB8fCAndHJhbnNwYXJlbnQnO1xyXG4gICAgbGV0IGJnSW1nID0gYGxpbmVhci1ncmFkaWVudCg0NWRlZywgJHtjb2xvcn0gMjUlLCB0cmFuc3BhcmVudCAyNS4xNSUsIHRyYW5zcGFyZW50IDUwJSwgJHtjb2xvcn0gNTAuMTUlLCAke2NvbG9yfSA3NSUsIHRyYW5zcGFyZW50IDc1LjE1JSwgdHJhbnNwYXJlbnQpYDtcclxuICAgIGxldCBwYXR0ZXJuQ1NTID0ge1xyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJnQ29sb3IsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBgJHtzaXplfXB4ICR7c2l6ZX1weGAsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogb25lTGluZShiZ0ltZyksXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYXR0ZXJuQ1NTO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VWZXJ0aWNhbFN0cmlwZVBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDEwMDtcclxuICAgIGxldCBjb2xvciA9IHByb3BzLmNvbG9yIHx8ICdyZ2JhKDI1NSwyMDUsMjUsMSknO1xyXG4gICAgbGV0IGJnQ29sb3IgPSBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJ3RyYW5zcGFyZW50JztcclxuICAgIGxldCBiZ0ltZyA9IGBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50IDUwJSwgJHtjb2xvcn0gNTAlKWA7XHJcbiAgICBsZXQgcGF0dGVybkNTUyA9IHtcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yLFxyXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogYCR7c2l6ZX1weGAsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYmdJbWcsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYXR0ZXJuQ1NTO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VQb2xrYURvdFBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDEwMDtcclxuICAgIGxldCBtaWQgPSBzaXplIC8gMjtcclxuICAgIGxldCByYWRpdXMgPSBwcm9wcy5yYWRpdXMgfHwgKHNpemUvNSk7XHJcbiAgICBsZXQgY29sb3IgPSBwcm9wcy5jb2xvciB8fCAnI2ZmZmRkNyc7XHJcbiAgICBsZXQgYmdDb2xvciA9IHByb3BzLmJhY2tncm91bmRDb2xvciB8fCAndHJhbnNwYXJlbnQnO1xyXG4gICAgbGV0IGJnSW1nID1cclxuICAgICAgYHJhZGlhbC1ncmFkaWVudCgke2NvbG9yfSAke3JhZGl1c31weCwgdHJhbnNwYXJlbnQgJHtyYWRpdXMrMX1weCksXHJcbiAgICAgIHJhZGlhbC1ncmFkaWVudCgke2NvbG9yfSAke3JhZGl1c31weCwgdHJhbnNwYXJlbnQgJHtyYWRpdXMrMX1weClgO1xyXG4gICAgbGV0IHBhdHRlcm5DU1MgPSB7XHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogYmdDb2xvcixcclxuICAgICAgYmFja2dyb3VuZFNpemU6IGAke3NpemV9cHggJHtzaXplfXB4YCxcclxuICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiBgMCAwLCAke21pZH1weCAke21pZH1weGAsXHJcbiAgICAgIGJhY2tncm91bmRJbWFnZTogb25lTGluZShiZ0ltZyksXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYXR0ZXJuQ1NTO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VTb2ZhUGF0dGVybkNTUyhwcm9wcykge1xyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHJcbiAgICBsZXQgc2l6ZSA9IHByb3BzLnNpemUgfHwgMTAwO1xyXG4gICAgbGV0IG1pZCA9IHNpemUgLyAyO1xyXG4gICAgbGV0IGJnQ29sb3IgPSBwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMzMDAnO1xyXG4gICAgbGV0IGJnID1cclxuICAgICAgYHJhZGlhbC1ncmFkaWVudChoc2woMCwgOTklLCA0MCUpIDQlLCBoc2woMCwgMTAwJSwgMTglKSA5JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDklKSAwIDAsXHJcbiAgICAgIHJhZGlhbC1ncmFkaWVudChoc2woMCwgMTAwJSwgNDAlKSA0JSwgaHNsKDAsIDEwMCUsIDE4JSkgOCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSAxMCUpICR7bWlkfXB4ICR7bWlkfXB4LFxyXG4gICAgICByYWRpYWwtZ3JhZGllbnQoaHNsYSgwLCAxMDAlLCA0NiUsIDAuOCkgMjAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkpICR7bWlkfXB4IDAsXHJcbiAgICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDQxJSwgMC44KSAyMCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSkgMCAke21pZH1weCxcclxuICAgICAgcmFkaWFsLWdyYWRpZW50KGhzbCgwLCAxMDAlLCAyMyUpIDM1JSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDYwJSkgJHttaWR9cHggMCxcclxuICAgICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgMTAwJSwgMjAlLCAxKSAzNSUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA2MCUpICR7c2l6ZX1weCAke21pZH1weCxcclxuICAgICAgcmFkaWFsLWdyYWRpZW50KGhzbGEoMCwgOTYlLCA0JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAwIDAsXHJcbiAgICAgIHJhZGlhbC1ncmFkaWVudChoc2xhKDAsIDEwMCUsIDE1JSwgMC43KSwgaHNsYSgwLCAxMDAlLCAyMCUsIDApKSAke21pZH1weCAke21pZH1weCxcclxuICAgICAgbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNDklLCBoc2xhKDAsIDEwMCUsIDAlLCAxKSA1MCUsIGhzbGEoMCwgMTAwJSwgMjAlLCAwKSA3MCUpIDAgMCxcclxuICAgICAgbGluZWFyLWdyYWRpZW50KC00NWRlZywgaHNsYSgwLCAxMDAlLCAyMCUsIDApIDQ5JSwgaHNsYSgwLCAxMDAlLCAwJSwgMSkgNTAlLCBoc2xhKDAsIDEwMCUsIDIwJSwgMCkgNzAlKSAwIDBgO1xyXG4gICAgbGV0IHBhdHRlcm5DU1MgPSB7XHJcbiAgICAgIGJhY2tncm91bmQ6IG9uZUxpbmUoYmcpLCAgLy8gVGhpcyBoYXMgdG8gY29tZSBiZWZvcmUgYmFja2dyb3VuZFNpemUgb3IgaXQgZG9lc24ndCBzaG93KD8hKVxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJnQ29sb3IsXHJcbiAgICAgIGJhY2tncm91bmRTaXplOiBgJHtzaXplfXB4ICR7c2l6ZX1weGAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYXR0ZXJuQ1NTO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VQbGFpZFJlZFBhdHRlcm5DU1MocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcblxyXG4gICAgbGV0IHNpemUgPSBwcm9wcy5zaXplIHx8IDEwMDA7XHJcbiAgICAvLyB0aGluIGJsdWUgbGluZVxyXG4gICAgbGV0IHRpbnkxYSA9IHNpemUgKiAwLjIwMDtcclxuICAgIGxldCB0aW55MWIgPSBzaXplICogMC4yMTI7XHJcbiAgICAvLyB0aGluIGJsdWUgbGluZVxyXG4gICAgbGV0IHRpbnkyYSA9IHNpemUgKiAwLjI1MjtcclxuICAgIGxldCB0aW55MmIgPSBzaXplICogMC4yNjQ7XHJcbiAgICAvLyB1cHBlciB3aWRlIGdyZWVuaXNoIGJhbmRcclxuICAgIGxldCB3aWRlMWEgPSBzaXplICogMC40NjQ7XHJcbiAgICBsZXQgd2lkZTFiID0gc2l6ZSAqIDAuNjY0O1xyXG4gICAgLy8gbWlkZGxlIGdyZWVuaXNoIGJhbmRcclxuICAgIGxldCB3aWRlMmEgPSBzaXplICogMC42NzY7XHJcbiAgICBsZXQgd2lkZTJiID0gc2l6ZSAqIDAuNzE2O1xyXG4gICAgLy8gdXBwZXIgd2lkZSBncmVlbmlzaCBiYW5kXHJcbiAgICBsZXQgd2lkZTNhID0gc2l6ZSAqIDAuNzI4O1xyXG4gICAgbGV0IHdpZGUzYiA9IHNpemUgKiAwLjkyODtcclxuICAgIC8vIGJhY2tncm91bmQgaGF0Y2hpbmdcclxuICAgIGxldCBoYXRjaEEgPSBzaXplICogMC4wMDg7XHJcbiAgICBsZXQgaGF0Y2hCID0gc2l6ZSAqIDAuMDEyO1xyXG4gICAgbGV0IGhhdGNoQyA9IHNpemUgKiAwLjAyMDtcclxuXHJcbiAgICBsZXQgYmdDb2xvciA9IHByb3BzLmJhY2tncm91bmRDb2xvciB8fCAnaHNsKDAsIDg2JSwgMzQlKSc7XHJcbiAgICBsZXQgYmdJbWcgPVxyXG4gICAgICBgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudChcclxuICAgICAgICB0cmFuc3BhcmVudCwgdHJhbnNwYXJlbnQgJHt0aW55MWF9cHgsXHJcbiAgICAgICAgcmdiYSg0MCwwLDE2MCwuNCkgJHt0aW55MWF9cHgsIHJnYmEoNDAsMCwxNjAsLjQpICR7dGlueTFifXB4LFxyXG4gICAgICAgIHRyYW5zcGFyZW50ICR7dGlueTFifXB4LCB0cmFuc3BhcmVudCAke3RpbnkyYX1weCxcclxuICAgICAgICByZ2JhKDQwLDAsMTYwLC40KSAke3RpbnkyYX1weCwgcmdiYSg0MCwwLDE2MCwuNCkgJHt0aW55MmJ9cHgsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQgJHt0aW55MmJ9cHgsIHRyYW5zcGFyZW50ICR7d2lkZTFhfXB4LFxyXG4gICAgICAgIHJnYmEoMCw2MCwwLC41KSAke3dpZGUxYX1weCwgcmdiYSgwLDYwLDAsLjUpICR7d2lkZTFifXB4LFxyXG4gICAgICAgIHJnYmEoMjU1LDI1NSwyMDAsLjMpICR7d2lkZTFifXB4LCByZ2JhKDI1NSwyNTUsMjAwLC4zKSAke3dpZGUyYX1weCxcclxuICAgICAgICByZ2JhKDAsNjAsMCwuNSkgJHt3aWRlMmF9cHgsIHJnYmEoMCw2MCwwLC41KSAke3dpZGUyYn1weCxcclxuICAgICAgICByZ2JhKDI1NSwyNTUsMjAwLC4zKSAke3dpZGUyYn1weCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgJHt3aWRlM2F9cHgsXHJcbiAgICAgICAgcmdiYSgwLDYwLDAsLjUpICR7d2lkZTNhfXB4LCByZ2JhKDAsNjAsMCwuNSkgJHt3aWRlM2J9cHgsIHRyYW5zcGFyZW50ICR7d2lkZTNifXB4KSxcclxuICAgICAgcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgyNzBkZWcsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQsIHRyYW5zcGFyZW50ICR7dGlueTFhfXB4LFxyXG4gICAgICAgIHJnYmEoNDAsMCwxNjAsLjQpICR7dGlueTFhfXB4LCByZ2JhKDQwLDAsMTYwLC40KSAke3RpbnkxYn1weCxcclxuICAgICAgICB0cmFuc3BhcmVudCAke3RpbnkxYn1weCwgdHJhbnNwYXJlbnQgJHt0aW55MmF9cHgsXHJcbiAgICAgICAgcmdiYSg0MCwwLDE2MCwuNCkgJHt0aW55MmF9cHgsIHJnYmEoNDAsMCwxNjAsLjQpICR7dGlueTJifXB4LFxyXG4gICAgICAgIHRyYW5zcGFyZW50ICR7dGlueTJifXB4LCB0cmFuc3BhcmVudCAke3dpZGUxYX1weCxcclxuICAgICAgICByZ2JhKDAsNjAsMCwuNSkgJHt3aWRlMWF9cHgsIHJnYmEoMCw2MCwwLC41KSAke3dpZGUxYn1weCxcclxuICAgICAgICByZ2JhKDI1NSwyNTUsMjAwLC4zKSAke3dpZGUxYn1weCwgcmdiYSgyNTUsMjU1LDIwMCwuMykgJHt3aWRlMmF9cHgsXHJcbiAgICAgICAgcmdiYSgwLDYwLDAsLjUpICR7d2lkZTJhfXB4LCByZ2JhKDAsNjAsMCwuNSkgJHt3aWRlMmJ9cHgsXHJcbiAgICAgICAgcmdiYSgyNTUsMjU1LDIwMCwuMykgJHt3aWRlMmJ9cHgsIHJnYmEoMjU1LDI1NSwyMDAsLjMpICR7d2lkZTNhfXB4LFxyXG4gICAgICAgIHJnYmEoMCw2MCwwLC41KSAke3dpZGUzYX1weCwgcmdiYSgwLDYwLDAsLjUpICR7d2lkZTNifXB4LCB0cmFuc3BhcmVudCAke3dpZGUzYn1weCksXHJcbiAgICAgIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoMTI1ZGVnLFxyXG4gICAgICAgIHRyYW5zcGFyZW50LCB0cmFuc3BhcmVudCAke2hhdGNoQX1weCxcclxuICAgICAgICByZ2JhKDAsMCwwLC4yKSAke2hhdGNoQX1weCwgcmdiYSgwLDAsMCwuMikgJHtoYXRjaEJ9cHgsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQgJHtoYXRjaEJ9cHgsIHRyYW5zcGFyZW50ICR7aGF0Y2hDfXB4LCByZ2JhKDAsMCwwLC4yKSAke2hhdGNoQ31weClgO1xyXG4gICAgbGV0IHBhdHRlcm5DU1MgPSB7XHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogYmdDb2xvcixcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiBvbmVMaW5lKGJnSW1nKSxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHBhdHRlcm5DU1M7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZVBhdHRlcm5Gcm9tQ1NTKGNzcykge1xyXG4gICAgcmV0dXJuIHRoaXMubWFrZSh7cGF0dGVybjogJ25vbmUnLCBzaXplOiBudWxsLCBzdHJldGNoOiB0cnVlfSkuY3NzKGNzcyk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgcGF0dGVyblRlbXBsYXRlcyA9IHtcclxuICBHcmlkOiBQYXR0ZXJuLm1ha2VHcmlkUGF0dGVybkNTUyxcclxuICBHcmFwaFBhcGVyOiBQYXR0ZXJuLm1ha2VHcmFwaFBhcGVyUGF0dGVybkNTUyxcclxuICBEaWFnb25hbFN0cmlwZXM6IFBhdHRlcm4ubWFrZURpYWdvbmFsU3RyaXBlUGF0dGVybkNTUyxcclxuICBEaWFnb25hbFN0cmlwZXNWaW9sZXQ6IFBhdHRlcm4ubWFrZURpYWdvbmFsU3RyaXBlUGF0dGVybkNTUyxcclxuICBWZXJ0aWNhbFN0cmlwZXM6IFBhdHRlcm4ubWFrZVZlcnRpY2FsU3RyaXBlUGF0dGVybkNTUyxcclxuICBTdHJpcGVzOiBQYXR0ZXJuLm1ha2VWZXJ0aWNhbFN0cmlwZVBhdHRlcm5DU1MsXHJcbiAgUGF0dGVyblN0cmlwZXM6IFBhdHRlcm4ubWFrZVZlcnRpY2FsU3RyaXBlUGF0dGVybkNTUyxcclxuICBQb2xrYURvdHM6IFBhdHRlcm4ubWFrZVBvbGthRG90UGF0dGVybkNTUyxcclxuICBQYXR0ZXJuUG9sa2FEb3RzOiBQYXR0ZXJuLm1ha2VQb2xrYURvdFBhdHRlcm5DU1MsXHJcbiAgU29mYTogUGF0dGVybi5tYWtlU29mYVBhdHRlcm5DU1MsXHJcbiAgUGxhaWRSZWQ6IFBhdHRlcm4ubWFrZVBsYWlkUmVkUGF0dGVybkNTUyxcclxufTtcclxuXHJcblRoaW5nLmFkZENsYXNzKFBhdHRlcm4pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgUG9pbnRzIHtcclxuXHRzdGF0aWMgZ2V0TWF4WShwb2ludHMpIHtcclxuXHRcdHZhciBwID0gcG9pbnRzICYmIHBvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50VmFsdWUpID0+IGFjY3VtdWxhdG9yLnkgPiBjdXJyZW50VmFsdWUueSA/IGFjY3VtdWxhdG9yIDogY3VycmVudFZhbHVlKTtcclxuXHRcdHJldHVybiAocCAmJiBwLnkpIHx8IDA7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0TWluWShwb2ludHMpIHtcclxuXHRcdHZhciBwID0gcG9pbnRzICYmIHBvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50VmFsdWUpID0+IGFjY3VtdWxhdG9yLnkgPCBjdXJyZW50VmFsdWUueSA/IGFjY3VtdWxhdG9yIDogY3VycmVudFZhbHVlKTtcclxuXHRcdHJldHVybiAocCAmJiBwLnkpIHx8IDEwMDtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBzb3J0WSAocG9pbnRzKSB7XHJcblx0XHR2YXIgY2xvbmUgPSBwb2ludHMubWFwKGZ1bmN0aW9uIChwKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0eDogcC54LFxyXG5cdFx0XHRcdHk6IHAueSxcclxuXHRcdFx0XHRfdGFyZ2V0VGhpbmc6IHAsIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHNvdXJjZSB0aGluZ1xyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHJcblx0XHRjbG9uZS5zb3J0KGZ1bmN0aW9uKGEsYikge1xyXG5cdFx0XHRyZXR1cm4gYS55IC0gYi55O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gY2xvbmU7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgbWFrZVBvaW50c0F0WCAocG9pbnRzLCB4LCBvZmZzZXQpIHtcclxuXHRcdHZhciB4cG9pbnRzID0gcG9pbnRzLm1hcChmdW5jdGlvbiAocCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHg6IHggIT09IHVuZGVmaW5lZCA/IHggOiAocC54ICsgb2Zmc2V0KSxcclxuXHRcdFx0XHR5OiBwLnksXHJcblx0XHRcdFx0X3RhcmdldFRoaW5nOiBwLl90YXJnZXRUaGluZyB8fCBwLCAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBzb3VyY2UgdGhpbmdcclxuXHRcdFx0fTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHhwb2ludHM7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgamlnZ2xlIChwb2ludHMsIG1heERpc3RhbmNlID0gMCkge1xyXG5cdFx0cmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24gKHApIHtcclxuXHRcdFx0dmFyIGppZ2dsZSA9IFRoaW5nLlJhbmQucmFuZEZsb2F0KC0xLCAxKTtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHR4OiBwLnggKyAoamlnZ2xlICogbWF4RGlzdGFuY2UpLFxyXG5cdFx0XHRcdHk6IHAueSArIChqaWdnbGUgKiBtYXhEaXN0YW5jZSksXHJcblx0XHRcdFx0X3RhcmdldFRoaW5nOiBwLl90YXJnZXRUaGluZywgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgc291cmNlIHRoaW5nXHJcblx0XHRcdH07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBzdHJldGNoWSAocG9pbnRzLCBhbW91bnQgPSAxLCBtaW5ZID0gMCwgbWF4WSA9IDEwMCkge1xyXG5cdFx0dmFyIG9yaWdIZWlnaHQgPSBtYXhZIC0gbWluWTtcclxuXHRcdHZhciBuZXdIZWlnaHQgPSBvcmlnSGVpZ2h0ICogYW1vdW50O1xyXG5cdFx0dmFyIG5ld1N0YXJ0WSA9IG1pblkgLSAoKG5ld0hlaWdodCAtIG9yaWdIZWlnaHQpIC8gMik7XHJcblx0XHR2YXIgbmV3UG9pbnRzID0gcG9pbnRzLm1hcChmdW5jdGlvbiAocCkge1xyXG5cdFx0XHR2YXIgb3JpZ1lwb3NBc1BlcmNlbnQgPSAocC55IC0gbWluWSkgLyBvcmlnSGVpZ2h0O1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHg6IHAueCxcclxuXHRcdFx0XHR5OiBuZXdTdGFydFkgKyAob3JpZ1lwb3NBc1BlcmNlbnQgKiBuZXdIZWlnaHQpLFxyXG5cdFx0XHRcdF90YXJnZXRUaGluZzogcC5fdGFyZ2V0VGhpbmcsIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHNvdXJjZSB0aGluZ1xyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3UG9pbnRzO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1ha2VBZGphY2VudFBvaW50cyhwcm9wcyA9IHtwb2ludHM6W10sIG1pblk6IDAsIG1heFk6IDEwMCwgb2Zmc2V0OiAtMTAwLCBqaWdnbGU6IDB9KSB7XHJcblx0XHR2YXIgeCA9IHByb3BzLng7XHJcblx0XHR2YXIgb2Zmc2V0ID0gcHJvcHMub2Zmc2V0IHx8IC0xMDA7XHJcblx0XHR2YXIgbWluWSA9IFBvaW50cy5nZXRNaW5ZKHByb3BzLnBvaW50cyk7XHJcblx0XHR2YXIgbWF4WSA9IFBvaW50cy5nZXRNYXhZKHByb3BzLnBvaW50cyk7XHJcblxyXG5cdFx0dmFyIGFQb2ludHMgPSBQb2ludHMubWFrZVBvaW50c0F0WChwcm9wcy5wb2ludHMsIHgsIG9mZnNldCk7XHJcblx0XHRhUG9pbnRzID0gUG9pbnRzLmppZ2dsZShhUG9pbnRzLCBwcm9wcy5qaWdnbGUpO1xyXG5cdFx0YVBvaW50cyA9IFBvaW50cy5zdHJldGNoWShhUG9pbnRzLCBwcm9wcy5zdHJldGNoLCBtaW5ZLCBtYXhZKTtcclxuXHJcblx0XHRyZXR1cm4gYVBvaW50cztcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoUG9pbnRzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUG9pbnRzO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG52YXIgVGltZXIgPSByZXF1aXJlKCcuLi9UaW1lci9UaW1lci5qcycpO1xyXG5cclxuXHJcbmNsYXNzIFB1bHNhciBleHRlbmRzIEFjdGlvbiB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge307XHJcblx0XHR0aGlzLmNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XHJcblx0XHR0aGlzLmRlbGF5ID0gcHJvcHMuZGVsYXkgfHwgMTAwMDtcclxuXHRcdHRoaXMuVCA9IFRpbWVyLm1ha2Uoe2NhbGxiYWNrOiB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgZGVsYXk6IHRoaXMuZGVsYXl9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z28gKCkge1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0dGhpcy5ULnN0b3AoKTtcclxuXHR9XHJcblxyXG5cdHRyaWdnZXIgKCkge1xyXG5cdFx0dGhpcy5jYWxsYmFjaygpO1xyXG5cdFx0dGhpcy5ULmdvKCk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFB1bHNhcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFB1bHNhcjtcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxudmFyIE1lcnNlbm5lVHdpc3RlciA9IHJlcXVpcmUoJy4vbWVyc2VubmUtdHdpc3Rlci5qcycpO1xyXG5cclxudmFyIE1UUmFuZCA9IG51bGw7XHJcbnZhciBzZWVkID0gbnVsbDtcclxudmFyIFBJID0gMy4xNDE1OTI2NTM1OTtcclxudmFyIEhBTEZQSSA9IFBJLzIuMDtcclxuXHJcbmNsYXNzIFJhbmQge1xyXG5cdHN0YXRpYyBpbml0KHMpIHtcclxuXHRcdHNlZWQgPSAocyAhPT0gdW5kZWZpbmVkKSA/IHMgOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xyXG5cdFx0TVRSYW5kID0gbmV3IE1lcnNlbm5lVHdpc3RlcihzZWVkKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRTZWVkKCkge1xyXG5cdFx0cmV0dXJuIHNlZWQ7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgc2V0U2VlZChzKSB7XHJcblx0XHRzZWVkID0gcztcclxuXHRcdE1UUmFuZCA9IG5ldyBNZXJzZW5uZVR3aXN0ZXIoc2VlZCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcmFuZG9tKCkge1xyXG5cdFx0TVRSYW5kIHx8IFJhbmQuaW5pdCgpO1xyXG5cdFx0cmV0dXJuIE1UUmFuZC5yYW5kb20oKTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBhIHJhbmRvbSBlbGVtZW50IGZyb20gYW4gYXJyYXlcclxuXHRzdGF0aWMgcmFuZEl0ZW0oYXJyKSB7XHJcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHJldHVybiBhcnJbIFJhbmQucmFuZEludCgwLCBhcnIubGVuZ3RoLTEpIF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5LCBhbmQgcmVtb3ZlIGl0IGZyb20gYXJyYXlcclxuXHRzdGF0aWMgcGlja0l0ZW0oYXJyKSB7XHJcblx0XHRpZiAoYXJyICYmIGFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHZhciBpbmRleCA9IFJhbmQucmFuZEludCgwLCBhcnIubGVuZ3RoLTEpO1xyXG5cdFx0XHRyZXR1cm4gYXJyLnNwbGljZShpbmRleCwxKVswXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyByYW5kSXRlbXMoYXJyLCBuPTMpIHtcclxuXHRcdHZhciBpdGVtcyA9IFtdO1xyXG5cdFx0aWYgKGFycikge1xyXG5cdFx0XHRmb3IgKHZhciBpPTA7IGkgPCBuOyBpKyspIHtcclxuXHRcdFx0ICBpdGVtcy5wdXNoKFJhbmQucmFuZEl0ZW0oYXJyKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBpdGVtcztcclxuXHR9XHJcblxyXG5cdC8vIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGluY2x1ZGVkKVxyXG5cdC8vIFVzaW5nIE1hdGgucm91bmQoKSB3aWxsIGdpdmUgeW91IGEgbm9uLXVuaWZvcm0gZGlzdHJpYnV0aW9uIVxyXG5cdHN0YXRpYyByYW5kSW50KG1pbiwgbWF4KSB7XHJcblx0XHRtaW4gPSBNYXRoLmNlaWwobWluIHx8IDApO1xyXG5cdFx0bWF4ID0gTWF0aC5mbG9vcihtYXggPT09IHVuZGVmaW5lZCA/IDEgOiBtYXgpO1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoUmFuZC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcblx0fVxyXG5cclxuXHQvLyBSZXR1cm4gYSByYW5kb20gZmxvYXQgYmV0d2VlbiBtaW4gYW5kIG1heCAoMCBhbmQgLjk5OTk5IGJ5IGRlZmF1bHQpXHJcblx0c3RhdGljIHJhbmRGbG9hdChtaW49MC4wLCBtYXg9MC45OTk5OSkge1xyXG5cdCAgICByZXR1cm4gbWluICsgKFJhbmQucmFuZG9tKCkgKiAobWF4IC0gbWluKSk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gdHJ1ZSBzb21lIHBlcmNlbnRhZ2Ugb2YgdGhlIHRpbWUgKGRlZmF1bHRzIHRvIDUwJSlcclxuXHRzdGF0aWMgcmFuZEJvb2xlYW4odGhyZXNob2xkPTUwKSB7XHJcblx0XHRyZXR1cm4gUmFuZC5yYW5kSW50KDEsMTAwKSA8IHRocmVzaG9sZDtcclxuXHR9XHJcblxyXG5cdC8vIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiBtYXhEaXN0YW5jZSBvZiB0YXJnZXQgKGRpc3RyaWJ1dGVkIGluIGEgYmVsbCBjdXJ2ZSBhcm91bmQgdGFyZ2V0KVxyXG5cdHN0YXRpYyByYW5kQ2xvc2VUbyh0YXJnZXQsIG1heERpc3RhbmNlKSB7XHJcblx0XHQvLyByZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogcmFuZE5vcm1hbCgpKTsgICAgLy8gY29uY2VudHJhdGVkIHRvd2FyZHMgY2VudGVyIDUwJSBvZiByYW5nZVxyXG5cdFx0Ly8gcmV0dXJuIHRhcmdldCArIChtYXhEaXN0YW5jZSAqIHJhbmRTaW4yKCkpOyAgIC8vIHNwcmVhZCBvdmVyIGVudGlyZSByYW5nZSwgc29tZXdoYXQgY29uY2VudHJhdGVkIHRvd2FyZHMgY2VudGVyXHJcblx0XHRyZXR1cm4gdGFyZ2V0ICsgKG1heERpc3RhbmNlICogUmFuZC5yYW5kUG93MigpKTsgICAvLyBzcHJlYWQgb3ZlciBlbnRpcmUgcmFuZ2UsIHdpdGggc2hhcnAgY29uY2VudHJhdGlvbiBhcm91bmQgY2VudGVyXHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCBleHBvbmVudGlhbGx5IGNsb3NlciB0byAwXHJcblx0c3RhdGljIHJhbmRQb3coKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5wb3coMS4wIC0gUmFuZC5yYW5kRmxvYXQoKSwgNCk7XHJcblx0fVxyXG5cclxuXHQvLyByZXR1cm4gZmxvYXQgYmV0d2VlbiAwIGFuZCAxLCBkaXN0cmlidXRlZCB0b3dhcmQgMVxyXG5cdHN0YXRpYyByYW5kU2luKCkge1xyXG5cdFx0cmV0dXJuIE1hdGguc2luKFJhbmQucmFuZEZsb2F0KCkgKiBIQUxGUEkpO1xyXG5cdH1cclxuXHJcblx0Ly8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGV4cG9uZW50aWFsbHkgY2xvc2VyIHRvIDBcclxuXHRzdGF0aWMgcmFuZFBvdzIoKSB7XHJcblx0XHRyZXR1cm4gUmFuZC5yYW5kUG93KCkgLSBSYW5kLnJhbmRQb3coKTtcclxuXHR9XHJcblxyXG5cdC8vIHJldHVybiBmbG9hdCBiZXR3ZWVuIC0xIGFuZCAxLCBkaXN0cmlidXRlZCBpbiBhIGJlbGwgY3VydmUgYXJvdW5kIDBcclxuXHRzdGF0aWMgcmFuZE5vcm1hbCgpIHtcclxuXHRcdHJldHVybiAoKFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSArIFJhbmQucmFuZEZsb2F0KCkgKyBSYW5kLnJhbmRGbG9hdCgpICsgUmFuZC5yYW5kRmxvYXQoKSkgLSAzLjApIC8gMy4wO1xyXG5cdH1cclxuXHJcbiAgLy8gcmV0dXJuIGZsb2F0IGJldHdlZW4gLTEgYW5kIDEsIGRpc3RyaWJ1dGVkIGNsb3NlciB0byAwXHJcbiAgc3RhdGljIHJhbmRTaW4yKCkge1xyXG4gICAgcmV0dXJuIFJhbmQucmFuZFNpbigpIC0gUmFuZC5yYW5kU2luKCk7XHJcbiAgfVxyXG5cclxuICAvLyByZXR1cm4gYXJyYXkgb2YgMyBpbnRzLCBlYWNoIDAtMjU1XHJcbiAgc3RhdGljIHJhbmRSR0IoKSB7XHJcbiAgICByZXR1cm4gW1JhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSksIFJhbmQucmFuZEludCgwLDI1NSldO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJhbmRSR0JzdHIoYWxwaGEpIHtcclxuXHRcdHZhciByZ2IgPSBSYW5kLnJhbmRSR0IoKTtcclxuICAgIHJldHVybiAncmdiYSgnICtyZ2JbMF0rICcsJyArcmdiWzFdKyAnLCcgK3JnYlsyXSsgJywgJyArIChhbHBoYSB8fCAwLjkpICsgJyknO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhSYW5kKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFuZDtcclxuIiwiXHJcbi8qXHJcbiAgSSd2ZSB3cmFwcGVkIE1ha290byBNYXRzdW1vdG8gYW5kIFRha3VqaSBOaXNoaW11cmEncyBjb2RlIGluIGEgbmFtZXNwYWNlXHJcbiAgc28gaXQncyBiZXR0ZXIgZW5jYXBzdWxhdGVkLiBOb3cgeW91IGNhbiBoYXZlIG11bHRpcGxlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdG9yc1xyXG4gIGFuZCB0aGV5IHdvbid0IHN0b21wIGFsbCBvdmVyIGVhY2hvdGhlcidzIHN0YXRlLlxyXG5cclxuICBJZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBhcyBhIHN1YnN0aXR1dGUgZm9yIE1hdGgucmFuZG9tKCksIHVzZSB0aGUgcmFuZG9tKClcclxuICBtZXRob2QgbGlrZSBzbzpcclxuXHJcbiAgdmFyIG0gPSBuZXcgTWVyc2VubmVUd2lzdGVyKCk7XHJcbiAgdmFyIHJhbmRvbU51bWJlciA9IG0ucmFuZG9tKCk7XHJcblxyXG4gIFlvdSBjYW4gYWxzbyBjYWxsIHRoZSBvdGhlciBnZW5yYW5kX3tmb299KCkgbWV0aG9kcyBvbiB0aGUgaW5zdGFuY2UuXHJcblxyXG4gIElmIHlvdSB3YW50IHRvIHVzZSBhIHNwZWNpZmljIHNlZWQgaW4gb3JkZXIgdG8gZ2V0IGEgcmVwZWF0YWJsZSByYW5kb21cclxuICBzZXF1ZW5jZSwgcGFzcyBhbiBpbnRlZ2VyIGludG8gdGhlIGNvbnN0cnVjdG9yOlxyXG5cclxuICB2YXIgbSA9IG5ldyBNZXJzZW5uZVR3aXN0ZXIoMTIzKTtcclxuXHJcbiAgYW5kIHRoYXQgd2lsbCBhbHdheXMgcHJvZHVjZSB0aGUgc2FtZSByYW5kb20gc2VxdWVuY2UuXHJcblxyXG4gIFNlYW4gTWNDdWxsb3VnaCAoYmFua3NlYW5AZ21haWwuY29tKVxyXG4qL1xyXG5cclxuLypcclxuICAgQSBDLXByb2dyYW0gZm9yIE1UMTk5MzcsIHdpdGggaW5pdGlhbGl6YXRpb24gaW1wcm92ZWQgMjAwMi8xLzI2LlxyXG4gICBDb2RlZCBieSBUYWt1amkgTmlzaGltdXJhIGFuZCBNYWtvdG8gTWF0c3Vtb3RvLlxyXG5cclxuICAgQmVmb3JlIHVzaW5nLCBpbml0aWFsaXplIHRoZSBzdGF0ZSBieSB1c2luZyBpbml0X2dlbnJhbmQoc2VlZClcclxuICAgb3IgaW5pdF9ieV9hcnJheShpbml0X2tleSwga2V5X2xlbmd0aCkuXHJcblxyXG4gICBDb3B5cmlnaHQgKEMpIDE5OTcgLSAyMDAyLCBNYWtvdG8gTWF0c3Vtb3RvIGFuZCBUYWt1amkgTmlzaGltdXJhLFxyXG4gICBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5cclxuICAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XHJcbiAgIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uc1xyXG4gICBhcmUgbWV0OlxyXG5cclxuICAgICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxyXG4gICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuXHJcbiAgICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcclxuICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXHJcbiAgICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuXHJcbiAgICAgMy4gVGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IG5vdCBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZVxyXG4gICAgICAgIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlblxyXG4gICAgICAgIHBlcm1pc3Npb24uXHJcblxyXG4gICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXHJcbiAgIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcclxuICAgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXHJcbiAgIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUlxyXG4gICBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcclxuICAgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLFxyXG4gICBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1JcclxuICAgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxyXG4gICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xyXG4gICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcclxuICAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcblxyXG5cclxuICAgQW55IGZlZWRiYWNrIGlzIHZlcnkgd2VsY29tZS5cclxuICAgaHR0cDovL3d3dy5tYXRoLnNjaS5oaXJvc2hpbWEtdS5hYy5qcC9+bS1tYXQvTVQvZW10Lmh0bWxcclxuICAgZW1haWw6IG0tbWF0IEAgbWF0aC5zY2kuaGlyb3NoaW1hLXUuYWMuanAgKHJlbW92ZSBzcGFjZSlcclxuKi9cclxuXHJcbnZhciBNZXJzZW5uZVR3aXN0ZXIgPSBmdW5jdGlvbihzZWVkKSB7XHJcbiAgaWYgKHNlZWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgc2VlZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gIH1cclxuICAvKiBQZXJpb2QgcGFyYW1ldGVycyAqL1xyXG4gIHRoaXMuTiA9IDYyNDtcclxuICB0aGlzLk0gPSAzOTc7XHJcbiAgdGhpcy5NQVRSSVhfQSA9IDB4OTkwOGIwZGY7ICAgLyogY29uc3RhbnQgdmVjdG9yIGEgKi9cclxuICB0aGlzLlVQUEVSX01BU0sgPSAweDgwMDAwMDAwOyAvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXHJcbiAgdGhpcy5MT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsgLyogbGVhc3Qgc2lnbmlmaWNhbnQgciBiaXRzICovXHJcblxyXG4gIHRoaXMubXQgPSBuZXcgQXJyYXkodGhpcy5OKTsgLyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICovXHJcbiAgdGhpcy5tdGk9dGhpcy5OKzE7IC8qIG10aT09TisxIG1lYW5zIG10W05dIGlzIG5vdCBpbml0aWFsaXplZCAqL1xyXG5cclxuICB0aGlzLmluaXRfZ2VucmFuZChzZWVkKTtcclxufTtcclxuXHJcbi8qIGluaXRpYWxpemVzIG10W05dIHdpdGggYSBzZWVkICovXHJcbk1lcnNlbm5lVHdpc3Rlci5wcm90b3R5cGUuaW5pdF9nZW5yYW5kID0gZnVuY3Rpb24oc2VlZCkge1xyXG4gIHRoaXMubXRbMF0gPSBzZWVkID4+PiAwO1xyXG4gIGZvciAodGhpcy5tdGk9MTsgdGhpcy5tdGk8dGhpcy5OOyB0aGlzLm10aSsrKSB7XHJcbiAgICAgIHZhciBzID0gdGhpcy5tdFt0aGlzLm10aS0xXSBeICh0aGlzLm10W3RoaXMubXRpLTFdID4+PiAzMCk7XHJcbiAgICAgIHRoaXMubXRbdGhpcy5tdGldID0gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE4MTI0MzMyNTMpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxODEyNDMzMjUzKSArIHRoaXMubXRpO1xyXG4gICAgICAvKiBTZWUgS251dGggVEFPQ1AgVm9sMi4gM3JkIEVkLiBQLjEwNiBmb3IgbXVsdGlwbGllci4gKi9cclxuICAgICAgLyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXHJcbiAgICAgIC8qIG9ubHkgTVNCcyBvZiB0aGUgYXJyYXkgbXRbXS4gICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAvKiAyMDAyLzAxLzA5IG1vZGlmaWVkIGJ5IE1ha290byBNYXRzdW1vdG8gICAgICAgICAgICAgKi9cclxuICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPj4+PSAwO1xyXG4gICAgICAvKiBmb3IgPjMyIGJpdCBtYWNoaW5lcyAqL1xyXG4gIH1cclxufTtcclxuXHJcbi8qIGluaXRpYWxpemUgYnkgYW4gYXJyYXkgd2l0aCBhcnJheS1sZW5ndGggKi9cclxuLyogaW5pdF9rZXkgaXMgdGhlIGFycmF5IGZvciBpbml0aWFsaXppbmcga2V5cyAqL1xyXG4vKiBrZXlfbGVuZ3RoIGlzIGl0cyBsZW5ndGggKi9cclxuLyogc2xpZ2h0IGNoYW5nZSBmb3IgQysrLCAyMDA0LzIvMjYgKi9cclxuTWVyc2VubmVUd2lzdGVyLnByb3RvdHlwZS5pbml0X2J5X2FycmF5ID0gZnVuY3Rpb24oaW5pdF9rZXksIGtleV9sZW5ndGgpIHtcclxuICB2YXIgaSwgaiwgaztcclxuICB0aGlzLmluaXRfZ2VucmFuZCgxOTY1MDIxOCk7XHJcbiAgaT0xOyBqPTA7XHJcbiAgayA9ICh0aGlzLk4+a2V5X2xlbmd0aCA/IHRoaXMuTiA6IGtleV9sZW5ndGgpO1xyXG4gIGZvciAoOyBrOyBrLS0pIHtcclxuICAgIGxldCBzID0gdGhpcy5tdFtpLTFdIF4gKHRoaXMubXRbaS0xXSA+Pj4gMzApO1xyXG4gICAgdGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE2NjQ1MjUpIDw8IDE2KSArICgocyAmIDB4MDAwMGZmZmYpICogMTY2NDUyNSkpKSArIGluaXRfa2V5W2pdICsgajsgLyogbm9uIGxpbmVhciAqL1xyXG4gICAgdGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXHJcbiAgICBpKys7IGorKztcclxuICAgIGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cclxuICAgIGlmIChqPj1rZXlfbGVuZ3RoKSB7IGo9MDsgfVxyXG4gIH1cclxuICBmb3IgKGs9dGhpcy5OLTE7IGs7IGstLSkge1xyXG4gICAgbGV0IHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMCk7XHJcbiAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTU2NjA4Mzk0MSkgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE1NjYwODM5NDEpKSAtIGk7IC8qIG5vbiBsaW5lYXIgKi9cclxuICAgIHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xyXG4gICAgaSsrO1xyXG4gICAgaWYgKGk+PXRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4tMV07IGk9MTsgfVxyXG4gIH1cclxuXHJcbiAgdGhpcy5tdFswXSA9IDB4ODAwMDAwMDA7IC8qIE1TQiBpcyAxOyBhc3N1cmluZyBub24temVybyBpbml0aWFsIGFycmF5ICovXHJcbn07XHJcblxyXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4ZmZmZmZmZmZdLWludGVydmFsICovXHJcbk1lcnNlbm5lVHdpc3Rlci5wcm90b3R5cGUuZ2VucmFuZF9pbnQzMiA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB5O1xyXG4gIHZhciBtYWcwMSA9IG5ldyBBcnJheSgweDAsIHRoaXMuTUFUUklYX0EpO1xyXG4gIC8qIG1hZzAxW3hdID0geCAqIE1BVFJJWF9BICBmb3IgeD0wLDEgKi9cclxuXHJcbiAgaWYgKHRoaXMubXRpID49IHRoaXMuTikgeyAvKiBnZW5lcmF0ZSBOIHdvcmRzIGF0IG9uZSB0aW1lICovXHJcbiAgICB2YXIga2s7XHJcblxyXG4gICAgaWYgKHRoaXMubXRpID09PSB0aGlzLk4rMSkgeyAgLyogaWYgaW5pdF9nZW5yYW5kKCkgaGFzIG5vdCBiZWVuIGNhbGxlZCwgKi9cclxuICAgICAgdGhpcy5pbml0X2dlbnJhbmQoNTQ4OSk7IC8qIGEgZGVmYXVsdCBpbml0aWFsIHNlZWQgaXMgdXNlZCAqL1xyXG4gICAgfVxyXG4gICAgZm9yIChraz0wO2trPHRoaXMuTi10aGlzLk07a2srKykge1xyXG4gICAgICB5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcclxuICAgICAgdGhpcy5tdFtra10gPSB0aGlzLm10W2trK3RoaXMuTV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcclxuICAgIH1cclxuICAgIGZvciAoO2trPHRoaXMuTi0xO2trKyspIHtcclxuICAgICAgeSA9ICh0aGlzLm10W2trXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10W2trKzFdJnRoaXMuTE9XRVJfTUFTSyk7XHJcbiAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtraysodGhpcy5NLXRoaXMuTildIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XHJcbiAgICB9XHJcbiAgICB5ID0gKHRoaXMubXRbdGhpcy5OLTFdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRbMF0mdGhpcy5MT1dFUl9NQVNLKTtcclxuICAgIHRoaXMubXRbdGhpcy5OLTFdID0gdGhpcy5tdFt0aGlzLk0tMV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcclxuXHJcbiAgICB0aGlzLm10aSA9IDA7XHJcbiAgfVxyXG5cclxuICB5ID0gdGhpcy5tdFt0aGlzLm10aSsrXTtcclxuXHJcbiAgLyogVGVtcGVyaW5nICovXHJcbiAgeSBePSAoeSA+Pj4gMTEpO1xyXG4gIHkgXj0gKHkgPDwgNykgJiAweDlkMmM1NjgwO1xyXG4gIHkgXj0gKHkgPDwgMTUpICYgMHhlZmM2MDAwMDtcclxuICB5IF49ICh5ID4+PiAxOCk7XHJcblxyXG4gIHJldHVybiB5ID4+PiAwO1xyXG59O1xyXG5cclxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwweDdmZmZmZmZmXS1pbnRlcnZhbCAqL1xyXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLmdlbnJhbmRfaW50MzEgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpPj4+MSk7XHJcbn07XHJcblxyXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDFdLXJlYWwtaW50ZXJ2YWwgKi9cclxuTWVyc2VubmVUd2lzdGVyLnByb3RvdHlwZS5nZW5yYW5kX3JlYWwxID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5NS4wKTtcclxuICAvKiBkaXZpZGVkIGJ5IDJeMzItMSAqL1xyXG59O1xyXG5cclxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxKS1yZWFsLWludGVydmFsICovXHJcbk1lcnNlbm5lVHdpc3Rlci5wcm90b3R5cGUucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5Ni4wKTtcclxuICAvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cclxufTtcclxuXHJcbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gKDAsMSktcmVhbC1pbnRlcnZhbCAqL1xyXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLmdlbnJhbmRfcmVhbDMgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpICsgMC41KSooMS4wLzQyOTQ5NjcyOTYuMCk7XHJcbiAgLyogZGl2aWRlZCBieSAyXjMyICovXHJcbn07XHJcblxyXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDEpIHdpdGggNTMtYml0IHJlc29sdXRpb24qL1xyXG5NZXJzZW5uZVR3aXN0ZXIucHJvdG90eXBlLmdlbnJhbmRfcmVzNTMgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgYT10aGlzLmdlbnJhbmRfaW50MzIoKT4+PjUsIGI9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj42O1xyXG4gIHJldHVybihhKjY3MTA4ODY0LjArYikqKDEuMC85MDA3MTk5MjU0NzQwOTkyLjApO1xyXG59O1xyXG5cclxuLyogVGhlc2UgcmVhbCB2ZXJzaW9ucyBhcmUgZHVlIHRvIElzYWt1IFdhZGEsIDIwMDIvMDEvMDkgYWRkZWQgKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVyc2VubmVUd2lzdGVyO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xyXG5cclxuLyoqXHJcbiAqICB3LCBoLCBkLCBzaG93T3V0ZXJcclxuXHJcbiBcdFBhcmVudCBlbGVtZW50IG11c3QgaGF2ZSBwZXJzcGVjdGl2ZSBzZXQgdG8gc29tZSBwaXhlbCB2YWx1ZSBvciByb29tIHdpbGwgYmUgZmxhdC5cclxuXHJcblx0dmFyIHIgPSBUaGluZy5Sb29tLm1ha2Uoe1xyXG5cdFx0eDoxMDAwLCB5Oi01MDAsXHJcblx0XHR3OjEwMDAsIGg6MzYyNSxcclxuXHRcdGQ6MzAwMCxcclxuXHRcdHNob3dPdXRlcjogZmFsc2VcclxuXHR9KTtcclxuICovXHJcbmNsYXNzIFJvb20gZXh0ZW5kcyBCb3gge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR2YXIgZGVmYXVsdFByb3BzID0ge1xyXG5cdFx0XHR3OiAxNTAwLFxyXG5cdFx0XHRoOiAxMDAwLFxyXG5cdFx0XHRkOiAgODAwLFxyXG5cdFx0XHR0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJyxcclxuXHRcdFx0c2hvd091dGVyOiBmYWxzZVxyXG5cdFx0fTtcclxuXHRcdHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG5cdFx0cHJvcHMub3ZlcmZsb3cgPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLncgPSBwcm9wcy53O1xyXG5cdFx0dGhpcy5oID0gcHJvcHMuaDtcclxuXHRcdHRoaXMuZCA9IHByb3BzLmQ7XHJcblx0XHR0aGlzLndhbGxzID0ge307XHJcblxyXG5cdFx0c3VwZXIuaW5pdChwcm9wcyk7XHJcblxyXG5cdFx0dGhpcy50eXBlID0gJ1Jvb20nO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcblx0XHR0aGlzLm1ha2VSb29tKHRoaXMuJGVsZW1lbnQpO1xyXG5cdH1cclxuXHJcblx0bWFrZVJvb20oKSB7XHJcblx0XHR2YXIgd2FsbHMgPSBbXTtcclxuXHRcdHZhciBoYWxmSGVpZ2h0ID0gdGhpcy5oLzI7XHJcblx0XHR2YXIgaGFsZldpZHRoID0gdGhpcy53LzI7XHJcblx0XHR2YXIgaGFsZkRlcHRoID0gdGhpcy5kLzI7XHJcblxyXG5cdFx0Ly8gdGhpcyBib3ggaXMgdGhlIG91dGVyIHdyYXBwZXIgZGl2IGFyb3VuZCBhbGwgdGhlIHdhbGxzIC0gd2l0aCBpdHMgb3duIHBlcnNwZWN0aXZlXHJcblx0XHQvLyBOT1RFOiBkbyBub3QgcHV0IFwib3ZlcmZsb3c6IGhpZGRlblwiIG9uIHRoaXMgZWxlbWVudCwgaXQgd2lsbCBib3JrIFogYXhpcyBsYXllcmluZ1xyXG5cdFx0dmFyIHJvb20gPSB0aGlzOyAgLy9Cb3gubWFrZSh7XHJcblx0XHQvLyBcdHdpZHRoOiAnMTAwJScsXHJcblx0XHQvLyBcdGhlaWdodDogJzEwMCUnLFxyXG5cdFx0Ly8gXHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuXHRcdC8vIFx0dHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCdcclxuXHRcdC8vIH0pO1xyXG5cclxuXHRcdC8vIElubmVyIGZhY2luZyB3YWxsc1xyXG5cdFx0Ly8gd2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnZnJvbnQnLCB7XHJcblx0XHQvLyBcdGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpJyxcclxuXHRcdC8vIFx0d2lkdGg6IHRoaXMudyArICdweCcsXHJcblx0XHQvLyBcdGhlaWdodDogdGhpcy5oICsgJ3B4JyxcclxuXHRcdC8vIFx0dHJhbnNmb3JtOiAncm90YXRlWCggMTgwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmRGVwdGgpICsgJ3B4ICknXHJcblx0XHQvLyB9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnYmFjaycsIHtcclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAxKScsXHJcblx0XHRcdHc6IHRoaXMudyxcclxuXHRcdFx0aDogdGhpcy5oLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVaKCAnICsgKC1oYWxmRGVwdGggKiAwLjk5NykgKyAncHggKScgICAgLy8gcHVzaCBiYWNrIHNsaWdodGx5IGxlc3MgdGhhbiBmdWxsIGFtb3VudCAoMC45OTcpIG9yIHdlIGdldCBhIHNsaWdodCBnYXAgYXQgY29ybmVyc1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ3JpZ2h0Jywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgMCwgNTUsIDEpJyxcclxuXHRcdFx0dzogdGhpcy5kLFxyXG5cdFx0XHRoOiB0aGlzLmgsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoLShoYWxmV2lkdGggKyAoaGFsZldpZHRoLWhhbGZEZXB0aCkpKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ2xlZnQnLCB7XHJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDAsIDEpJyxcclxuXHRcdFx0dzogdGhpcy5kLFxyXG5cdFx0XHRoOiB0aGlzLmgsXHJcblx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgtaGFsZkRlcHRoKSArICdweCApJ1xyXG5cdFx0fSkgKTtcclxuXHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ3RvcCcsIHtcclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCA1NSwgMjU1LCAxKScsXHJcblx0XHRcdHc6IHRoaXMudyxcclxuXHRcdFx0aDogdGhpcy5kLFxyXG5cdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZkhlaWdodCAtIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICogMC45OTcpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnYm90dG9tJywge1xyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDI1NSwgMCwgMSknLFxyXG5cdFx0XHR3OiB0aGlzLncsXHJcblx0XHRcdGg6IHRoaXMuZCxcclxuXHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggOTBkZWcgKSB0cmFuc2xhdGVaKCAnICsgKC0oaGFsZkhlaWdodCArIChoYWxmSGVpZ2h0LWhhbGZEZXB0aCkpICogMC45OTcpICsgJ3B4ICknXHJcblx0XHR9KSApO1xyXG5cclxuXHRcdC8vIE91dGVyIGZhY2luZyB3YWxsc1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2hvd091dGVyKSB7XHJcblx0XHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dGZyb250Jywge1xyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCknLFxyXG5cdFx0XHRcdHc6IHRoaXMudyxcclxuXHRcdFx0XHRoOiB0aGlzLmgsXHJcblx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWiggJyArIChoYWxmRGVwdGgpICsgJ3B4ICknXHJcblx0XHRcdH0pICk7XHJcblx0XHRcdHdhbGxzLnB1c2goIHRoaXMubWFrZVdhbGwoJ291dGJhY2snLCB7XHJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAxKScsXHJcblx0XHRcdFx0dzogdGhpcy53LFxyXG5cdFx0XHRcdGg6IHRoaXMuaCxcclxuXHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCAtMTgwZGVnICkgdHJhbnNsYXRlWiggJyArIGhhbGZEZXB0aCArICdweCApJ1xyXG5cdFx0XHR9KSApO1xyXG5cdFx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXRyaWdodCcsIHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDEwMCwgMTAwLCAxMDAsIDEpJyxcclxuXHRcdFx0XHR3OiB0aGlzLmQsXHJcblx0XHRcdFx0aDogdGhpcy5oLFxyXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIDkwZGVnICkgdHJhbnNsYXRlWiggJyArICgoaGFsZldpZHRoICsgKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSkgKyAncHggKSdcclxuXHRcdFx0fSkgKTtcclxuXHRcdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0bGVmdCcsIHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDEwMCwgMTAwLCAxMDAsIDEpJyxcclxuXHRcdFx0XHR3OiB0aGlzLmQsXHJcblx0XHRcdFx0aDogdGhpcy5oLFxyXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3JvdGF0ZVkoIC05MGRlZyApIHRyYW5zbGF0ZVooICcgKyAoaGFsZldpZHRoIC0gKGhhbGZXaWR0aC1oYWxmRGVwdGgpKSArICdweCApJ1xyXG5cdFx0XHR9KSApO1xyXG5cdFx0XHR3YWxscy5wdXNoKCB0aGlzLm1ha2VXYWxsKCdvdXR0b3AnLCB7XHJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgxMDAsIDEwMCwgMjAwLCAxKScsXHJcblx0XHRcdFx0dzogdGhpcy53LFxyXG5cdFx0XHRcdGg6IHRoaXMuZCxcclxuXHRcdFx0XHR0cmFuc2Zvcm06ICdyb3RhdGVYKCA5MGRlZyApIHRyYW5zbGF0ZVooICcgKyBoYWxmRGVwdGggKyAncHggKSdcclxuXHRcdFx0fSkgKTtcclxuXHRcdFx0d2FsbHMucHVzaCggdGhpcy5tYWtlV2FsbCgnb3V0Ym90dG9tJywge1xyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMTAwLCAyMDAsIDEwMCwgMSknLFxyXG5cdFx0XHRcdHc6IHRoaXMudyxcclxuXHRcdFx0XHRoOiB0aGlzLmQsXHJcblx0XHRcdFx0dHJhbnNmb3JtOiAncm90YXRlWCggLTkwZGVnICkgdHJhbnNsYXRlWiggJyArIChoYWxmSGVpZ2h0ICsgKGhhbGZIZWlnaHQtaGFsZkRlcHRoKSkgKyAncHggKSdcclxuXHRcdFx0fSkgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjb3B5IHdhbGxzIGFycmF5IHRvIG9iamVjdFxyXG5cdFx0Zm9yICh2YXIgaT0wOyBpIDwgd2FsbHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy53YWxsc1sgd2FsbHNbaV0ud2hpY2ggXSA9IHdhbGxzW2ldO1xyXG5cdFx0XHR0aGlzW3dhbGxzW2ldLndoaWNoXSA9IHdhbGxzW2ldO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvb20uYWRkKHdhbGxzKTtcclxuXHRcdC8vIHRoaXMuYWRkKHJvb20pO1xyXG5cdFx0dGhpcy53YWxsc0EgPSB3YWxscztcclxuXHRcdC8vIHRoaXMucm9vbSA9IHJvb207XHJcblx0fVxyXG5cclxuXHRtYWtlV2FsbCh3aGljaCwgY3NzVmFscykge1xyXG5cdFx0dmFyIGRlZmF1bHRDU1MgPSB7XHJcblx0XHRcdGRpc3BsYXk6ICdibG9jaycsXHJcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHRiYWNrZmFjZVZpc2liaWxpdHk6ICdoaWRkZW4nLFxyXG5cdFx0XHRvdmVyZmxvdzogJ2hpZGRlbidcclxuXHRcdH07XHJcblx0XHR2YXIgd2FsbCA9IFRoaW5nLkJveC5tYWtlKCQuZXh0ZW5kKHt9LCBkZWZhdWx0Q1NTLCBjc3NWYWxzKSk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKCd3YWxsJyk7XHJcblx0XHR3YWxsLiRlbGVtZW50LmFkZENsYXNzKHdoaWNoKTtcclxuXHRcdHdhbGwud2hpY2ggPSB3aGljaDtcclxuXHRcdHJldHVybiB3YWxsO1xyXG5cdH1cclxuXHJcblx0ZW1wdHkoKSB7XHJcblx0ICB2YXIgY2xvbmUgPSB0aGlzLml0ZW1zLnNsaWNlKDApO1xyXG5cdCAgdmFyIGIgPSB0aGlzO1xyXG5cdCAgY2xvbmUuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdCAgXHRpZiAoYi53YWxsc0EuaW5kZXhPZihpdGVtKSA9PT0gLTEpIHsgLy8gZG9uJ3QgZGVsZXRlIHRoZSB3YWxscywganVzdCB0aGUgaXRlbXMgaW4gdGhlIHJvb21cclxuXHQgIFx0XHRiLnJlbW92ZShpdGVtKTtcclxuXHQgIFx0fVxyXG5cdCAgfSk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFJvb20pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSb29tO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgVGV4dFBhbmUgZXh0ZW5kcyBUaGluZyB7XHJcbiAgICBpbml0IChwcm9wcykge1xyXG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdDYWxpYnJpLCBWZXJkYW5hLCBBcmlhbCwgc2Fucy1zZXJpZicsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMjRweCcsXHJcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgICAgICAgICBjb2xvcjogJ3JnYigyMDAsIDIwMCwgMjAwKScsXHJcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgdzogMTAwLFxyXG4gICAgICAgICAgICBoOiAxMDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHByb3BzID0gJC5leHRlbmQoe30sIGRlZmF1bHRQcm9wcywgcHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSAnVGV4dFBhbmUnO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KHRoaXMuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpOyAgLy8gYmFzaWMgVGhpbmcgZGl2IHdpdGggSUQgYW5kIGNsYXNzXHJcbiAgICB9XHJcblxyXG4gICAgZmlsbFRleHQgKCkge1xyXG4gICAgICAgIHZhciBtYXhIZWlnaHQgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBtYXggPSAxMDAwO1xyXG4gICAgICAgIHZhciAkc3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcclxuICAgICAgICB2YXIgc3BhbkhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgIC8vIGVsZW1lbnQgaGFzIHRvIGJlIGFwcGVuZGVkIHRvIGJvZHkgcHJpb3IsIG9yIHNwYW5IZWlnaHQgd2lsbCBiZSAwXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJHNwYW4pO1xyXG4gICAgICAgIHdoaWxlIChzcGFuSGVpZ2h0IDwgbWF4SGVpZ2h0ICYmIG1heC0tID4gMCkge1xyXG4gICAgICAgICAgICAkc3Bhbi5hcHBlbmQodGhpcy50ZXh0KTtcclxuICAgICAgICAgICAgc3BhbkhlaWdodCA9ICRzcGFuLmhlaWdodCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIgKCkge1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuZmlsbFRleHQodGhpcy50ZXh0KTtcclxuICAgIH1cclxufVxyXG5cclxuVGhpbmcuYWRkQ2xhc3MoVGV4dFBhbmUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0UGFuZTtcclxuIiwidmFyIGVsZW1lbnRDb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRoaW5nIHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgdGhpcy5pbml0KHByb3BzKTtcclxuICB9XHJcblxyXG4gIGluaXQgKHByb3BzID0ge30pIHtcclxuICAgIHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdUaGluZyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgICB0aGlzLmFkZE1hc2socHJvcHMubWFzayk7ICAvLyBtYWtlIHRoaXMgcGFydCBvZiBjb252ZXJ0VG9DU1MoKVxyXG4gIH1cclxuXHJcbiAgLy8gU2V0IGVzc2VudGlhbCBkZWZhdWx0IHByb3BlcnRpZXMgb24gJ3RoaXMnICh4LHkseix3LGgpXHJcbiAgLy8gQWRkaXRpb25hbCBwcm9wZXJ0aWVzIGluIHRoZSBwcm9wcyBvYmplY3QgYXJlIGFzc3VtZWQgdG8gYmUgQ1NTXHJcbiAgc2V0RGVmYXVsdFByb3BzIChwcm9wcykge1xyXG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcclxuXHJcbiAgICAvLyBkZWZhdWx0IHRvIGFic29sdXRlIHBvc2l0aW9uaW5nXHJcbiAgICBwcm9wcy5wb3NpdGlvbiA9IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSc7XHJcblxyXG4gICAgLy8ga2VlcCB0aGUgcHJvcHMgb2JqZWN0IG9uIGluc3RhbmNlXHJcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJPbkNlbnRlciA9IHByb3BzLnJlbmRlck9uQ2VudGVyIHx8IGZhbHNlO1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IHByb3BzLnJvdGF0ZSB8fCBudWxsO1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IHByb3BzLnNjYWxlIHx8IG51bGw7XHJcblxyXG4gICAgLy8gcG9zaXRpb24gaXMgdGhlIGdpdmVuIHgseSx6IG9yIDAsMCwwICh0aGlzIGJlY29tZXMgQ1NTIHRyYW5zbGF0ZTNkKCkpXHJcbiAgICB0aGlzLnggPSBwcm9wcy54IHx8IDA7XHJcbiAgICB0aGlzLnkgPSBwcm9wcy55IHx8IDA7XHJcbiAgICB0aGlzLnogPSBwcm9wcy56IHx8IDA7XHJcblxyXG4gICAgLy8gZGltZW5zaW9ucyBhcmUgdGhlIGdpdmVuIHcsaCBvciB1bmRlZmluZWQgKHRoaXMgYmVjb21lcyBDU1Mgd2lkdGgvaGVpZ2h0KVxyXG4gICAgdGhpcy53ID0gcHJvcHMudztcclxuICAgIHRoaXMuaCA9IHByb3BzLmg7XHJcblxyXG4gICAgdGhpcy5pZCA9IHByb3BzLmlkO1xyXG4gICAgdGhpcy4kZWxlbWVudCA9IG51bGw7XHJcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgdmFyIHBhcmVudEVsZW1lbnQgPSAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuJGVsZW1lbnQpIHx8ICQoZG9jdW1lbnQuYm9keSk7XHJcbiAgICBwYXJlbnRFbGVtZW50LmFwcGVuZCh0aGlzLiRlbGVtZW50KTtcclxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKFRoaW5nLmNvbnZlcnRUb0NTUyh0aGlzLnByb3BzKSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxyXG4gIHVuUmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLiRlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0RGltZW5zaW9ucyAoKSB7XHJcbiAgICByZXR1cm4ge3c6IHRoaXMuJGVsZW1lbnQud2lkdGgoKSwgaDogdGhpcy4kZWxlbWVudC5oZWlnaHQoKX07XHJcbiAgfVxyXG5cclxuICBnZXRCb3VuZGluZ0JveCAoKSB7XHJcbiAgICAvLyByZWxhdGl2ZSB0byBwYWdlXHJcbiAgICB2YXIgc2Nyb2xsdG9wID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICB2YXIgc2Nyb2xsbGVmdCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKTtcclxuICAgIHZhciBib3VuZHMgPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogYm91bmRzLmxlZnQrc2Nyb2xsbGVmdCxcclxuICAgICAgeTogYm91bmRzLnRvcCtzY3JvbGx0b3AsXHJcbiAgICAgIHc6IGJvdW5kcy53aWR0aCxcclxuICAgICAgaDogYm91bmRzLmhlaWdodCxcclxuICAgICAgYm90dG9tOiBib3VuZHMuYm90dG9tK3Njcm9sbHRvcCxcclxuICAgICAgcmlnaHQ6IGJvdW5kcy5yaWdodCtzY3JvbGxsZWZ0XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gZ2V0IHBvc2l0aW9uIG9mIGVsZW1lbnQgcmVsYXRpdmUgdG8gcGFnZVxyXG4gIC8vIG9ubHkgd29ya3MgYWZ0ZXIgZWxlbWVudCBpcyByZW5kZXJlZCBvbiBwYWdlXHJcbiAgZ2V0UG9zaXRpb24gKCkge1xyXG4gICAgdmFyIHh5ID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKTtcclxuICAgIHZhciB6ID0gdGhpcy4kZWxlbWVudC5jc3MoJ3otaW5kZXgnKTtcclxuICAgIHogPSB6ID8gcGFyc2VJbnQoeikgOiB1bmRlZmluZWQ7XHJcbiAgICByZXR1cm4gW3h5LmxlZnQsIHh5LnRvcCwgel07XHJcbiAgfVxyXG5cclxuICBnZXRQb3MgKCkge1xyXG4gICAgbGV0IHggPSB0aGlzLng7XHJcbiAgICBsZXQgeSA9IHRoaXMueTtcclxuICAgIGxldCB6ID0gdGhpcy56O1xyXG4gICAgaWYgKHRoaXMucmVuZGVyT25DZW50ZXIpIHtcclxuICAgICAgeCAtPSAodGhpcy53IHx8IDApLzI7XHJcbiAgICAgIHkgLT0gKHRoaXMuaCB8fCAwKS8yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHt4LCB5LCB6fTtcclxuICB9XHJcblxyXG4gIC8vIFJldHVybiB0aGUgZWxlbWVudCdzIENTUyB0cmFuc2Zvcm0gbWF0cml4IGFzIGFycmF5IG9mIDYgb3IgMTYgdmFsdWVzLlxyXG4gIC8vIDYgdmFsdWVzIGZvciBhIDJEIG1hdHJpeCAobm8gcm90YXRpb24gb3Igb25seSByb3RhdGVkIGFyb3VuZCBaIGF4aXMpLFxyXG4gIC8vIDE2IHZhbHVlcyBmb3IgYSAzRCBtYXRyaXguXHJcbiAgZ2V0Q1NTVHJhbnNmb3JtICgpIHtcclxuICAgIHZhciBtU3RyID0gdGhpcy4kZWxlbWVudC5jc3MoJ3RyYW5zZm9ybScpLm1hdGNoKC8oLT9bXFxkXFwuXSspWywpXS9nKTtcclxuICAgIGlmICghbVN0cikge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbVZhbCA9IFtdO1xyXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbVN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtVmFsW2ldID0gcGFyc2VGbG9hdChtU3RyW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtVmFsO1xyXG4gIH1cclxuXHJcbiAgLy8gcmV0dXJuIFogYXhpcyByb3RhdGlvbiBmcm9tIDZ4NiBtYXRyaXhcclxuICAvLyB0b2RvOiAzZCBtYXRyaXggaHR0cDovL25naGlhaG8uY29tLz9wYWdlX2lkPTg0NlxyXG4gIC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZ2V0LXZhbHVlLW9mLWNzcy1yb3RhdGlvbi10aHJvdWdoLWphdmFzY3JpcHQvXHJcbiAgZ2V0Um90YXRpb24gKCkge1xyXG4gICAgdmFyIHIgPSB0aGlzLnJvdGF0aW9uIHx8IHt4OjAsIHk6MCwgejowfTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IHIueCB8fCAwLFxyXG4gICAgICB5OiByLnkgfHwgMCxcclxuICAgICAgejogci56IHx8IDBcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRUcmFuc2xhdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge3g6IHRoaXMueCwgeTogdGhpcy55LCB6OiB0aGlzLnp9O1xyXG4gIH1cclxuXHJcbiAgLy8gSW5jcmVtZW50IHRoZSBjdXJyZW50IHJvdGF0aW9uIGJ5IHRoZSBnaXZlbiBkZWdyZWVzLlxyXG4gIC8vIEV4cGVjdGluZyAnYXhlcycgdG8gYmUge3g6IDkwLCB5OiAwLCB6OiA0NX1cclxuICAvLyBBeGVzIGFyZSBpbiB0aGUgb3JkZXIgdGhleSB3aWxsIGJlIGFwcGxpZWQsIGFuZCBjYW4gYmUganVzdCBvbmUgZS5nLjpcclxuICAvLyB7ejoxODAsIHk6OTAsIHg6NDV9ICBvciAge3k6NDUsIHg6OTB9ICAgb3IgICB7ejogMTgwfVxyXG4gIHJvdGF0ZSAoYXhlcykge1xyXG4gICAgaWYgKGF4ZXMpIHtcclxuICAgICAgaWYgKHR5cGVvZiBheGVzICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGF4ZXMgPSB7eDowLCB5OjAsIHo6YXhlc307ICAgIC8vIGFzc3VtaW5nIGF4ZXMgaXMgYSBudW1iZXIgaGVyZVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucm90YXRpb24gPSB0aGlzLnJvdGF0aW9uIHx8IHt4OjAsIHk6MCwgejowfTtcclxuICAgICAgYXhlcy54ICYmICh0aGlzLnJvdGF0aW9uLnggKz0gYXhlcy54KTtcclxuICAgICAgYXhlcy55ICYmICh0aGlzLnJvdGF0aW9uLnkgKz0gYXhlcy55KTtcclxuICAgICAgYXhlcy56ICYmICh0aGlzLnJvdGF0aW9uLnogKz0gYXhlcy56KTtcclxuICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlVG8gKGF4ZXMpIHtcclxuICAgIGlmIChheGVzKSB7XHJcbiAgICAgIHRoaXMucm90YXRpb24gPSB7eDowLCB5OjAsIHo6MH07ICAvLyByZXNldCByb3RhdGlvblxyXG4gICAgICB0aGlzLnJvdGF0ZShheGVzKTtcclxuICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGUgKGZhY3Rvcikge1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciArPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzY2FsZVRvIChmYWN0b3IpIHtcclxuICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBmYWN0b3I7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGUgKHgsIHksIHopIHtcclxuICAgIHRoaXMueCArPSB4IHx8IDA7XHJcbiAgICB0aGlzLnkgKz0geSB8fCAwO1xyXG4gICAgdGhpcy56ICs9IHogfHwgMDtcclxuICAgIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHRyYW5zbGF0ZVRvICh4LCB5LCB6KSB7XHJcbiAgICB0aGlzLnggPSB4IHx8IHRoaXMueCB8fCAwO1xyXG4gICAgdGhpcy55ID0geSB8fCB0aGlzLnkgfHwgMDtcclxuICAgIHRoaXMueiA9IHogfHwgdGhpcy56IHx8IDA7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0cmFuc2Zvcm0gKCkge1xyXG4gICAgdGhpcy5jc3Moe1xyXG4gICAgICB0cmFuc2Zvcm06IFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1ModGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZUZhY3RvciwgdGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy5yZW5kZXJPbkNlbnRlciwgdGhpcy53LCB0aGlzLmgpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgY3NzIChwcm9wcykge1xyXG4gICAgLy8gYWRkIG5ldyBjc3MgcHJvcGVydGllcyB0byB0aGlzLnByb3BzIG9iamVjdFxyXG4gICAgdGhpcy5wcm9wcyA9ICQuZXh0ZW5kKHRoaXMucHJvcHMsIHByb3BzKTtcclxuICAgIC8vIHNldCBjc3MgcHJvcGVydGllcyBvbiB0aGUgaHRtbCBlbGVtZW50XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhwcm9wcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGh0bWwgKCkge1xyXG4gICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XHJcbiAgfVxyXG5cclxuICAvLyBTaXplIGVsZW1lbnQgdG8gZmlsbCBwYXJlbnQgd2l0aCBhIHNxdWFyZSBhc3BlY3QgcmF0aW9cclxuICBmaWxsUGFyZW50IChzdHJldGNoPWZhbHNlKSB7XHJcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgbGV0IHBhcmVudFcgPSB0aGlzLnBhcmVudC4kZWxlbWVudC53aWR0aCgpO1xyXG4gICAgICBsZXQgcGFyZW50SCA9IHRoaXMucGFyZW50LiRlbGVtZW50LmhlaWdodCgpO1xyXG4gICAgICBsZXQgcGFyZW50RWxlbWVudFNpemUgPSBNYXRoLm1heChwYXJlbnRXLCBwYXJlbnRIKTtcclxuICAgICAgdGhpcy5jc3Moe1xyXG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgIGxlZnQ6ICcwcHgnLCB0b3A6ICcwcHgnLFxyXG4gICAgICAgIHdpZHRoOiBzdHJldGNoID8gcGFyZW50VyA6IHBhcmVudEVsZW1lbnRTaXplLFxyXG4gICAgICAgIGhlaWdodDogc3RyZXRjaCA/IHBhcmVudEggOiBwYXJlbnRFbGVtZW50U2l6ZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gTWFzayB0aGUgY29udGVudHMgb2YgdGhpcyBkaXYuXHJcbiAgLy8gRGVmYXVsdHMgdG8gYSBzaW5nbGUgbWFzayBpbWFnZSBjb3ZlcmluZyBlbnRpcmUgZWxlbWVudCwgbm8gcmVwZWF0LlxyXG4gIC8vXHJcbiAgLy8gRXhhbXBsZXM6XHJcbiAgLy8gYWRkTWFzaygndXJsKGltZy9teV9tYXNrX2ltYWdlLnBuZyknKVxyXG4gIC8vIGFkZE1hc2soJ3JhZGlhbC1ncmFkaWVudCh3aGl0ZSAyNSUsIHRyYW5zcGFyZW50IDI2JSknKVxyXG4gIC8vIGFkZE1hc2soe2ltYWdlOiAndXJsKGltZy9teV9tYXNrX2ltYWdlLnBuZycpLCByZXBlYXQ6ICdyZXBlYXQnLCBzaXplOiAnMTAlIDEwJSd9KVxyXG4gIC8vXHJcbiAgYWRkTWFzayAobWFza1Byb3BzKSB7XHJcbiAgICBpZiAobWFza1Byb3BzKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgbWFza1Byb3BzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIG1hc2tQcm9wcyA9IHtpbWFnZTogbWFza1Byb3BzfTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgbWFza0NTU3Byb3BzID0ge1xyXG4gICAgICAgIFdlYmtpdE1hc2tJbWFnZTogbWFza1Byb3BzLmltYWdlLFxyXG4gICAgICAgIFdlYmtpdE1hc2tSZXBlYXQ6IG1hc2tQcm9wcy5yZXBlYXQgfHwgJ25vLXJlcGVhdCcsXHJcbiAgICAgICAgV2Via2l0TWFza1NpemU6IG1hc2tQcm9wcy5zaXplIHx8ICcxMDAlIDEwMCUnLFxyXG4gICAgICAgIFdlYmtpdE1hc2tQb3NpdGlvbjogbWFza1Byb3BzLnBvc2l0aW9uIHx8ICc1MCUgNTAlJyxcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5jc3MobWFza0NTU3Byb3BzKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2UgKHByb3BzKSB7XHJcbiAgICB2YXIgY2xzID0gdGhpcztcclxuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjbHMocHJvcHMpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZENsYXNzIChjbHMpIHtcclxuICAgIFRoaW5nLmNsYXNzZXMgPSBUaGluZy5jbGFzc2VzIHx8IHt9O1xyXG4gICAgVGhpbmdbY2xzLm5hbWVdID0gVGhpbmcuY2xhc3Nlc1tjbHMubmFtZV0gPSBjbHM7XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xyXG5cclxuICAvLyBSZXR1cm4gdGhlIHByb3BzIGNvbnZlcnRlZCB0byBsZWdpdCBDU1MgcHJvcGVydGllcy5cclxuICAvLyBNb3N0IHByb3BzIGFyZSBhbHJlYWR5IGNzcyBwcm9wZXJ0aWVzLCBhbmQgd2lsbCBiZSByZXR1cm5lZCB1bmNoYW5nZWQuXHJcbiAgLy8gU2hvcnRoYW5kIHByb3BlcnRpZXMgKHgseSx6LHcsaCxyb3RhdGUsc2NhbGUsc2l6ZSkgd2lsbCBiZSBjb252ZXJ0ZWQgdG9cclxuICAvLyBjc3MgcHJvcGVydGllcyBhbmQgcmVtb3ZlZCBmcm9tIHRoZSBwcm9wcyBvYmplY3QuXHJcbiAgc3RhdGljIGNvbnZlcnRUb0NTUyAocHJvcHMpIHtcclxuICAgIHZhciBzdHlsZXMgPSAkLmV4dGVuZCh7fSwgcHJvcHMpO1xyXG4gICAgc3R5bGVzLndpZHRoID0gcHJvcHMud2lkdGggfHwgKHByb3BzLncgJiYgKHByb3BzLncgKyBcInB4XCIpKSxcclxuICAgIHN0eWxlcy5oZWlnaHQgPSBwcm9wcy5oZWlnaHQgfHwgKHByb3BzLmggJiYgKHByb3BzLmggKyBcInB4XCIpKSxcclxuICAgIHN0eWxlcy50cmFuc2Zvcm0gPSBwcm9wcy50cmFuc2Zvcm0gfHwgKFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1MocHJvcHMucm90YXRlLCBwcm9wcy5zY2FsZSwgcHJvcHMueCwgcHJvcHMueSwgcHJvcHMueiwgcHJvcHMucmVuZGVyT25DZW50ZXIsIHByb3BzLncsIHByb3BzLmgpKSxcclxuXHJcbiAgICAvLyBUaGVzZSBhcmUgbm90IHRydWUgQ1NTIHByb3BlcnRpZXMgc28gcmVtb3ZlIHRoZW1cclxuICAgIGRlbGV0ZSBzdHlsZXMuaWQ7XHJcbiAgICBkZWxldGUgc3R5bGVzLnJvdGF0ZTtcclxuICAgIGRlbGV0ZSBzdHlsZXMuc2NhbGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLnNpemU7XHJcbiAgICBkZWxldGUgc3R5bGVzLng7XHJcbiAgICBkZWxldGUgc3R5bGVzLnk7XHJcbiAgICBkZWxldGUgc3R5bGVzLno7XHJcbiAgICBkZWxldGUgc3R5bGVzLnc7XHJcbiAgICBkZWxldGUgc3R5bGVzLmg7XHJcbiAgICBkZWxldGUgc3R5bGVzLnI7XHJcbiAgICBkZWxldGUgc3R5bGVzLm1hc2s7XHJcbiAgICBkZWxldGUgc3R5bGVzLnJlbmRlck9uQ2VudGVyO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5vbkltZ0xvYWRlZDtcclxuICAgIGRlbGV0ZSBzdHlsZXMub25JbWdFcnJvcjtcclxuXHJcbiAgICByZXR1cm4gc3R5bGVzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VUcmFuc2Zvcm1DU1MgKHJvdGF0ZSwgc2NhbGUsIHR4LCB0eSwgdHosIHJlbmRlck9uQ2VudGVyLCB3LCBoKSB7XHJcbiAgICB2YXIgdHJhbnNmb3JtID0gJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gKHR4IHx8IHR5IHx8IHR6KSA/IChUaGluZy5tYWtlVHJhbnNsYXRlQ1NTKHR4LCB0eSwgdHosIHJlbmRlck9uQ2VudGVyLCB3LCBoKSArICcgJykgOiAnJztcclxuICAgIHRyYW5zZm9ybSArPSByb3RhdGUgPyAoVGhpbmcubWFrZVJvdGF0aW9uQ1NTKHJvdGF0ZSkgKSA6ICcnO1xyXG4gICAgdHJhbnNmb3JtICs9IHNjYWxlID8gKFRoaW5nLm1ha2VTY2FsZUNTUyhzY2FsZSkgKyAnICcpIDogJyc7XHJcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VSb3RhdGlvbkNTUyAoYW5nbGUpIHtcclxuICAgIHZhciBjc3MgPSAnJztcclxuICAgIGlmIChhbmdsZSAhPT0gdW5kZWZpbmVkICYmIGFuZ2xlICE9PSBudWxsKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgYW5nbGUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgLy8gdHVybiBvYmplY3Qge3g6MTAsIHk6MjAsIHo6MzB9IGludG8gYSBjc3MgdHJhbnNmb3JtIGNvbW1hbmRcclxuICAgICAgICAkLmVhY2goYW5nbGUsIGZ1bmN0aW9uIChheGlzTmFtZSwgYW5nbGUpIHtcclxuICAgICAgICAgIGNzcyArPSAncm90YXRlJyArIGF4aXNOYW1lLnRvVXBwZXJDYXNlKCkgKyAnKCcgK2FuZ2xlKyAnZGVnKSAnO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGNzcyA9ICdyb3RhdGVaKCcrYW5nbGUrJ2RlZykgJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNzcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlU2NhbGVDU1MgKHNjYWxlKSB7XHJcbiAgICB2YXIgY3NzID0gJyc7XHJcbiAgICBpZiAoc2NhbGUgIT09IHVuZGVmaW5lZCAmJiBzY2FsZSAhPT0gbnVsbCkge1xyXG4gICAgICBpZiAodHlwZW9mIHNjYWxlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNzcyA9ICdzY2FsZTNkKCcgK1xyXG4gICAgICAgICAgICAoc2NhbGUueCA9PT0gdW5kZWZpbmVkID8gJzEnIDogc2NhbGUueCkgKyAnLCcgK1xyXG4gICAgICAgICAgICAoc2NhbGUueSA9PT0gdW5kZWZpbmVkID8gJzEnIDogc2NhbGUueSkgKyAnLCcgK1xyXG4gICAgICAgICAgICAoc2NhbGUueiA9PT0gdW5kZWZpbmVkID8gJzEnIDogc2NhbGUueikgK1xyXG4gICAgICAgICAgICAnKSc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY3NzID0gJ3NjYWxlKCcrc2NhbGUrJykgJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNzcztcclxuICB9XHJcblxyXG4gIC8vIE5PVEU6IHRyYW5zbGF0aW9uIGNvb3JkcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiB0aGUgZG9jdW1lbnQgZmxvdy5cclxuICAvLyBUaGV5IGFyZSBub3QgdGhlIHNhbWUgYXMgc2V0dGluZyBsZWZ0L3RvcCB2YWx1ZXMsIHdoaWNoIGFyZSBhYnNvbHV0ZSBjb29yZGluYXRlc1xyXG4gIC8vIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQgZWxlbWVudC5cclxuICBzdGF0aWMgbWFrZVRyYW5zbGF0ZUNTUyAoeCwgeSwgeiwgcmVuZGVyT25DZW50ZXIsIHcsIGgpIHtcclxuICAgIHggPSB4IHx8ICcwJztcclxuICAgIHkgPSB5IHx8ICcwJztcclxuICAgIHogPSB6IHx8ICcwJztcclxuICAgIGlmIChyZW5kZXJPbkNlbnRlcikge1xyXG4gICAgICB4IC09IHcvMjtcclxuICAgICAgeSAtPSBoLzI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZTNkKCcrIHggKyAncHgsICcgKyB5ICsgJ3B4LCAnICsgeiArJ3B4KSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUVsZW1lbnQgKGh0bWwsIHByb3BzLCB0eXBlKSB7XHJcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGh0bWwpXHJcbiAgICAgIC5jc3MoVGhpbmcuY29udmVydFRvQ1NTKHByb3BzKSlcclxuICAgICAgLmFkZENsYXNzKHR5cGUgfHwgJ3JhbmRvbScpXHJcbiAgICAgIC5hdHRyKCdpZCcsIHByb3BzLmlkIHx8ICh0eXBlICsgKCsrZWxlbWVudENvdW50ZXIpKSk7XHJcbiAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaXNOdW1lcmljKG4pIHtcclxuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgZm9udCBmYW1pbHkgdG8gcGFnZSAtIHdpbGwgbG9hZCBvbmx5IG9uY2VcclxuICBzdGF0aWMgYWRkRm9udFVSTChmb250RmFtaWx5VVJMLCBpZCkge1xyXG4gICAgaWYgKGZvbnRGYW1pbHlVUkwgJiYgaWQgJiYgJCgnaGVhZCcpLmZpbmQoJyMnICsgaWQpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB2YXIgbGluayA9ICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIicgKyBmb250RmFtaWx5VVJMICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XHJcbiAgICAgICQoJ2hlYWQnKS5hcHBlbmQobGluayk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ1NTRmlsZShmaWxlTmFtZSwgaWQ9J1RoaW5nJykge1xyXG4gICAgaWYgKGZpbGVOYW1lKSB7XHJcbiAgICAgIHZhciBsaW5rID0gJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiJyArIGZpbGVOYW1lICsgJ1wiIGlkPVwiJyArIGlkICsgJ1wiPic7XHJcbiAgICAgICQoJ2hlYWQnKS5maW5kKCcjJyArIGlkKS5yZW1vdmUoKTtcclxuICAgICAgJCgnaGVhZCcpLmFwcGVuZChsaW5rKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZD0nVGhpbmcnKSB7XHJcbiAgICBpZiAoY3NzU3RyaW5nKSB7XHJcbiAgICAgIHZhciBzdHlsZUlEID0gaWQgKyAnLXN0eWxlcyc7XHJcbiAgICAgIHZhciBzdHlsZUVsID0gJCgnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPicgK2Nzc1N0cmluZysgJzwvc3R5bGU+JylcclxuICAgICAgICAuYXR0cignaWQnLCBzdHlsZUlEKTtcclxuICAgICAgJCgnaGVhZCAjJyArIHN0eWxlSUQpLnJlbW92ZSgpOyAvLyBjbGVhciB0aGUgZXhpc3Rpbmcgc3R5bGUgaWYgYW55XHJcbiAgICAgICQoJ2hlYWQnKS5hcHBlbmQoc3R5bGVFbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKlxyXG4gIGZ1bmN0aW9uIGJpbmRhcmdzKGZ1bmMsIHByb3BzKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKG1vcmVQcm9wcykge1xyXG4gICAgICBsZXQgcCA9ICQuZXh0ZW5kKHt9LCBwcm9wcywgbW9yZVByb3BzKTtcclxuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh7fSwgcCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbnN0YW50aWF0b3IoY2xzLCBwcm9wcykge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtb3JlUHJvcHMpIHtcclxuICAgICAgbGV0IHAgPSAkLmV4dGVuZCh7fSwgcHJvcHMsIG1vcmVQcm9wcyk7XHJcbiAgICAgIHJldHVybiBjbHMubWFrZS5jYWxsKGNscywgcCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gICovXHJcblxyXG4gIHN0YXRpYyBtc2cocykge1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nKHMpO1xyXG4gIH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhUaGluZyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRoaW5nO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQWN0aW9uID0gcmVxdWlyZSgnLi4vQWN0aW9uL0FjdGlvbi5qcycpO1xyXG5cclxuY2xhc3MgVGltZXIgZXh0ZW5kcyBBY3Rpb24ge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG5cdFx0dGhpcy5jYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xyXG5cdFx0dGhpcy5kZWxheSA9IHByb3BzLmRlbGF5IHx8IDEwMDA7XHJcblx0XHR0aGlzLnRpbWVySUQgPSBudWxsO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnbyAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lcklEKTtcclxuXHRcdHRoaXMudGltZXJJRCA9IHNldFRpbWVvdXQodGhpcy5jYWxsYmFjaywgdGhpcy5kZWxheSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHN0b3AgKCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJJRCk7XHJcblx0XHR0aGlzLnRpbWVySUQgPSBudWxsO1xyXG5cdH1cclxufVxyXG5UaGluZy5hZGRDbGFzcyhUaW1lcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyO1xyXG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG5cclxuY2xhc3MgVHJpYW5nbGUgZXh0ZW5kcyBUaGluZyB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHZhciBkZWZhdWx0UHJvcHMgPSB7XHJcblx0XHRcdHNpemU6IDEwLFxyXG5cdFx0XHRjb2xvcjogJyNCQURBNTUnXHJcblx0XHR9O1xyXG5cdFx0cHJvcHMgPSAkLmV4dGVuZChwcm9wcywgZGVmYXVsdFByb3BzKTtcclxuXHRcdHRoaXMuc2V0RGVmYXVsdFByb3BzKHByb3BzKTtcclxuXHRcdHRoaXMudHlwZSA9ICdUcmlhbmdsZSc7XHJcblx0XHR0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQodGhpcy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMubWFrZVRyaWFuZ2xlKHRoaXMucHJvcHMuc2l6ZSwgdGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgZWxlbWVudCBiZWZvcmUgY2FsbGluZyB0aGlzXHJcblx0fVxyXG5cclxuXHRtYWtlVHJpYW5nbGUgKHNpemUsIGNvbG9yKSB7XHJcblx0XHRjb2xvciA9IGNvbG9yIHx8ICcjQkFEQTU1JztcclxuXHRcdHNpemUgPSBzaXplIHx8IDEwO1xyXG5cdFx0dGhpcy5jc3Moe1xyXG5cdFx0XHR3aWR0aDogMCxcclxuXHRcdFx0aGVpZ2h0OiAwLFxyXG5cdFx0XHRmb250U2l6ZTogMCxcclxuXHRcdFx0bGluZUhlaWdodDogMCxcclxuXHRcdFx0Ym9yZGVyQm90dG9tOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuXHRcdFx0Ym9yZGVyVG9wOiBzaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcclxuXHRcdFx0Ym9yZGVyTGVmdDogc2l6ZSArICdweCBzb2xpZCAnICsgY29sb3JcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKFRyaWFuZ2xlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJpYW5nbGU7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4vVGhpbmcvVGhpbmcuanMnKTtcclxucmVxdWlyZSgnLi9Cb3gvQm94LmpzJyk7XHJcbnJlcXVpcmUoJy4vQXJyb3cvQXJyb3cuanMnKTtcclxucmVxdWlyZSgnLi9EZW1vQm94L0RlbW9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BY3Rpb24vQWN0aW9uLmpzJyk7XHJcbnJlcXVpcmUoJy4vVGltZXIvVGltZXIuanMnKTtcclxucmVxdWlyZSgnLi9SYW5kL1JhbmQuanMnKTtcclxucmVxdWlyZSgnLi9QdWxzYXIvUHVsc2FyLmpzJyk7XHJcbnJlcXVpcmUoJy4vRG8vRG8uanMnKTtcclxucmVxdWlyZSgnLi9MYWJlbC9MYWJlbC5qcycpO1xyXG5yZXF1aXJlKCcuL0xpbmUvTGluZS5qcycpO1xyXG5yZXF1aXJlKCcuL0ltZy9JbWcuanMnKTtcclxucmVxdWlyZSgnLi9JbWdTVkcvSW1nU1ZHLmpzJyk7XHJcbnJlcXVpcmUoJy4vUGF0dGVybi9QYXR0ZXJuLmpzJyk7XHJcbnJlcXVpcmUoJy4vUGF0dGVyblBvbGthRG90cy9QYXR0ZXJuUG9sa2FEb3RzLmpzJyk7XHJcbnJlcXVpcmUoJy4vUGF0dGVyblN0cmlwZXMvUGF0dGVyblN0cmlwZXMuanMnKTtcclxucmVxdWlyZSgnLi9QYXR0ZXJuU29mYS9QYXR0ZXJuU29mYS5qcycpO1xyXG5yZXF1aXJlKCcuL1BhdHRlcm5UaWxlTWFyYmxlL1BhdHRlcm5UaWxlTWFyYmxlLmpzJyk7XHJcbnJlcXVpcmUoJy4vQkdJbWcvQkdJbWcuanMnKTtcclxucmVxdWlyZSgnLi9UZXh0UGFuZS9UZXh0UGFuZS5qcycpO1xyXG5yZXF1aXJlKCcuL0NpcmNsZS9DaXJjbGUuanMnKTtcclxucmVxdWlyZSgnLi9UcmlhbmdsZS9UcmlhbmdsZS5qcycpO1xyXG5yZXF1aXJlKCcuL1Jvb20vUm9vbS5qcycpO1xyXG5yZXF1aXJlKCcuL1BhZ2UvUGFnZS5qcycpO1xyXG5yZXF1aXJlKCcuL0NvbXBvc2l0ZUltZy9Db21wb3NpdGVJbWcuanMnKTtcclxucmVxdWlyZSgnLi9Qb2ludHMvUG9pbnRzLmpzJyk7XHJcblxyXG53aW5kb3cuVGhpbmcgPSBUaGluZztcclxuIl19
