(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "/* required for arrow */\r\n.arrow-head {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  width: 0; \r\n  height: 0; \r\n  border-top: 30px solid transparent;\r\n  border-bottom: 30px solid transparent;\r\n  border-left: 30px solid green;\r\n}\r\n\r\n.arrow-body {\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  background-color: green;\r\n  width: 40px;\r\n  height: 20px;\r\n  margin: 0;\r\n  margin-top: 20px;\r\n  margin-bottom: 20px;\r\n  border-left: 0;\r\n  border-right: 0;\r\n}\r\n\r\n.arrow-wrapper {\r\n  width: 70px;   /* arrow-body width + arrow-head border width */\r\n}\r\n\r\n.Arrow {\r\n  /* For some nice animation on the rotates: */\r\n  -webkit-transition: -webkit-transform .2s;\r\n     -moz-transition:    -moz-transform .2s;\r\n          transition:         transform .2s;\r\n}\r\n\r\n";

},{}],2:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Arrow extends Thing {
	init (props) {
		this.initialize(props);
		this.type = 'Arrow';
		this.$element = Thing.makeElement(Arrow.html(), this.props, this.type);  // basic Thing div with ID and class
		this.setColor(this.props.color);  // have to make arrow before calling this
	}

	render () {
		super.render();

		// var parentElement = (this.parent && this.parent.$element) || $(document.body);
		// parentElement.append(this.$element);
		// this.$element.css(this.props);
	}

	setColor (c) {
		this.$element.find('.arrow-head').css({borderLeftColor:c});
		this.$element.find('.arrow-body').css({backgroundColor:c});
	}

	static createArrowElement () {
		var $arrow = $("<div class='arrow-wrapper'><div class='arrow-body'></div><div class='arrow-head'></div></div>");
		return $arrow;
	}

	static html () {
		return "<div><div class='arrow-wrapper'><div class='arrow-body'></div><div class='arrow-head'></div></div></div>";
	}

	static css () {
		return require('./Arrow.css');
	}
}
Thing.addClass(Arrow);

module.exports = Arrow;

},{"../Thing/Thing.js":6,"./Arrow.css":1}],3:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');

class Box extends Thing {
  init (props) {
  	this.initialize(props);
  	this.type = 'Box';
  	this.items = [];
  	this.$element = Thing.makeElement(Thing.html(), this.props, this.type);
  }

  add (item) {
  	if (item) {
  		this.items.push(item);
  		item.parent = this;
  	}
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
  }

  numElements () {
  	return this.items.length;
  }

  render () {
  	super.render();
  	for (var i=0; i < this.items.length; i++) {
  		this.items[i].render();
  	}
  }
}
Thing.addClass(Box);

module.exports = Box;

},{"../Thing/Thing.js":6}],4:[function(require,module,exports){
module.exports = "\r\n.DemoBox {\r\n  display: block;\r\n  position: relative;\r\n  float: left;\r\n  margin: 20px;\r\n  width: 200px; \r\n  height: 200px; \r\n  border: 2px dashed #eee;\r\n}\r\n";

},{}],5:[function(require,module,exports){
var Thing = require('../Thing/Thing.js');
var Box = require('../Box/Box.js');

class DemoBox extends Box {
	init (props) {
		super.init(props);
		props.width = props.width || 200;
		props.height = props.height || 200;
		props.position = 'relative';
		this.type = 'DemoBox';
		this.$element = Thing.makeElement(Thing.html(), this.props, this.type);
	}

	render () {
		super.render();
	}

	static css () {
		return require('./DemoBox.css');
	}
}
Thing.addClass(DemoBox);

module.exports = DemoBox;

},{"../Box/Box.js":3,"../Thing/Thing.js":6,"./DemoBox.css":4}],6:[function(require,module,exports){
var elementCounter = 0;

class Thing {
  constructor() {
  }

  init (props) {
    this.initialize(props);
    this.type = 'Thing';
    this.$element = Thing.makeElement(Thing.html(), this.props, this.type);
  }

  initialize (props) {
    props = props || {};
    // CSS props go into this.props
    this.props = Thing.cleanup(props);
    // keep these properties on 'this'
    this.rotation = props.rotate || 0;
    this.scaleFactor = props.scale || 1;
    this.$element = null;
    this.parent = null;
  }

  render () {
    var parentElement = (this.parent && this.parent.$element) || $(document.body);
    parentElement.append(this.$element);
    this.$element.css(this.props);
  }

  // remove element from dom and null it out
  unRender () {
    if (this.$element) {
      this.$element.remove();
      this.$element = null;
    }
  }

  rotate (degrees) {
    this.rotation += degrees;
    this.css({ 
      transform: Thing.makeTransformCSS(this.rotation, this.scaleFactor)
    });
  }

  rotateTo (angle) {
    this.rotation = angle;
    this.css({ 
      transform: Thing.makeTransformCSS(this.rotation, this.scaleFactor)
    });
  }

  scale (factor) {
    this.scaleFactor += factor;
    this.css({ 
      transform: Thing.makeTransformCSS(this.rotation, this.scaleFactor)
    });
  }

  scaleTo (factor) {
    this.scaleFactor = factor;
    this.css({ 
      transform: Thing.makeTransformCSS(this.rotation, this.scaleFactor)
    });
  }

  css (props) {
    this.props = $.extend(this.props, props);
    this.$element.css(props);
  }

  static html () {
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
    Thing.addCSSString(cls.css(), cls.name);

    // add additional css file at load time
    Thing.addCSSFile(cls.name + '/' + cls.name + '.css', cls.name);
  }

  static getClass (name) {
    return Thing.classes[name];
  }

  //---------------------------------------------------------
  // CSS management functions

  static makeStyles (props) {
    var styles = props || {};
    $.extend(styles, {
      left: props.left || (props.x && (props.x + "px")),
      top: props.top || (props.y && (props.y + "px")),
      width: props.width || (props.w && (props.w + "px")),
      height: props.height || (props.h && (props.h + "px")),
      zIndex: props.zIndex || props.z,
      backgroundColor: (props.backgroundColor || 'transparent'),
      transform: props.transform || (Thing.makeTransformCSS(props.rotate, props.scale)),
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

  static makeTransformCSS (rotate, scale) {
    var transform = '';
    transform += scale && (Thing.makeScaleCSS(scale) + ' ');
    transform += Thing.isNumeric(rotate) && (Thing.makeAngleCSS(rotate) + ' ');
    return transform;
  }

  static makeAngleCSS (angle) {
    return 'rotate('+angle+'deg)';
  }

  static makeScaleCSS (scale) {
    return 'scale('+scale+')';
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
    $.get(fileName)
        .done(function() { 
            var link = '<link rel="stylesheet" type="text/css" href="' + fileName + '" id="' + id + '">';
            $('head').find('#' + id).remove();
            $('head').append(link);
        })
        .fail(function() {})
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

},{}],7:[function(require,module,exports){
var Thing = require('./Thing/Thing.js');
require('./Box/Box.js');
require('./Arrow/Arrow.js');
require('./DemoBox/DemoBox.js');

window.Thing = Thing;

},{"./Arrow/Arrow.js":2,"./Box/Box.js":3,"./DemoBox/DemoBox.js":5,"./Thing/Thing.js":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL0Fycm93L0Fycm93LmNzcyIsInNyYy9saWIvQXJyb3cvQXJyb3cuanMiLCJzcmMvbGliL0JveC9Cb3guanMiLCJzcmMvbGliL0RlbW9Cb3gvRGVtb0JveC5jc3MiLCJzcmMvbGliL0RlbW9Cb3gvRGVtb0JveC5qcyIsInNyYy9saWIvVGhpbmcvVGhpbmcuanMiLCJzcmMvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLyogcmVxdWlyZWQgZm9yIGFycm93ICovXFxyXFxuLmFycm93LWhlYWQge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXHJcXG4gIHdpZHRoOiAwOyBcXHJcXG4gIGhlaWdodDogMDsgXFxyXFxuICBib3JkZXItdG9wOiAzMHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWJvdHRvbTogMzBweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1sZWZ0OiAzMHB4IHNvbGlkIGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uYXJyb3ctYm9keSB7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxuICB3aWR0aDogNDBweDtcXHJcXG4gIGhlaWdodDogMjBweDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxyXFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcclxcbiAgYm9yZGVyLWxlZnQ6IDA7XFxyXFxuICBib3JkZXItcmlnaHQ6IDA7XFxyXFxufVxcclxcblxcclxcbi5hcnJvdy13cmFwcGVyIHtcXHJcXG4gIHdpZHRoOiA3MHB4OyAgIC8qIGFycm93LWJvZHkgd2lkdGggKyBhcnJvdy1oZWFkIGJvcmRlciB3aWR0aCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uQXJyb3cge1xcclxcbiAgLyogRm9yIHNvbWUgbmljZSBhbmltYXRpb24gb24gdGhlIHJvdGF0ZXM6ICovXFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIC4ycztcXHJcXG4gICAgIC1tb3otdHJhbnNpdGlvbjogICAgLW1vei10cmFuc2Zvcm0gLjJzO1xcclxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgIHRyYW5zZm9ybSAuMnM7XFxyXFxufVxcclxcblxcclxcblwiO1xuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi4vVGhpbmcvVGhpbmcuanMnKTtcclxuXHJcbmNsYXNzIEFycm93IGV4dGVuZHMgVGhpbmcge1xyXG5cdGluaXQgKHByb3BzKSB7XHJcblx0XHR0aGlzLmluaXRpYWxpemUocHJvcHMpO1xyXG5cdFx0dGhpcy50eXBlID0gJ0Fycm93JztcclxuXHRcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudChBcnJvdy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7ICAvLyBiYXNpYyBUaGluZyBkaXYgd2l0aCBJRCBhbmQgY2xhc3NcclxuXHRcdHRoaXMuc2V0Q29sb3IodGhpcy5wcm9wcy5jb2xvcik7ICAvLyBoYXZlIHRvIG1ha2UgYXJyb3cgYmVmb3JlIGNhbGxpbmcgdGhpc1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHN1cGVyLnJlbmRlcigpO1xyXG5cclxuXHRcdC8vIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xyXG5cdFx0Ly8gcGFyZW50RWxlbWVudC5hcHBlbmQodGhpcy4kZWxlbWVudCk7XHJcblx0XHQvLyB0aGlzLiRlbGVtZW50LmNzcyh0aGlzLnByb3BzKTtcclxuXHR9XHJcblxyXG5cdHNldENvbG9yIChjKSB7XHJcblx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5hcnJvdy1oZWFkJykuY3NzKHtib3JkZXJMZWZ0Q29sb3I6Y30pO1xyXG5cdFx0dGhpcy4kZWxlbWVudC5maW5kKCcuYXJyb3ctYm9keScpLmNzcyh7YmFja2dyb3VuZENvbG9yOmN9KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjcmVhdGVBcnJvd0VsZW1lbnQgKCkge1xyXG5cdFx0dmFyICRhcnJvdyA9ICQoXCI8ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj5cIik7XHJcblx0XHRyZXR1cm4gJGFycm93O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGh0bWwgKCkge1xyXG5cdFx0cmV0dXJuIFwiPGRpdj48ZGl2IGNsYXNzPSdhcnJvdy13cmFwcGVyJz48ZGl2IGNsYXNzPSdhcnJvdy1ib2R5Jz48L2Rpdj48ZGl2IGNsYXNzPSdhcnJvdy1oZWFkJz48L2Rpdj48L2Rpdj48L2Rpdj5cIjtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vQXJyb3cuY3NzJyk7XHJcblx0fVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEFycm93KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XHJcbiIsInZhciBUaGluZyA9IHJlcXVpcmUoJy4uL1RoaW5nL1RoaW5nLmpzJyk7XHJcblxyXG5jbGFzcyBCb3ggZXh0ZW5kcyBUaGluZyB7XHJcbiAgaW5pdCAocHJvcHMpIHtcclxuICBcdHRoaXMuaW5pdGlhbGl6ZShwcm9wcyk7XHJcbiAgXHR0aGlzLnR5cGUgPSAnQm94JztcclxuICBcdHRoaXMuaXRlbXMgPSBbXTtcclxuICBcdHRoaXMuJGVsZW1lbnQgPSBUaGluZy5tYWtlRWxlbWVudChUaGluZy5odG1sKCksIHRoaXMucHJvcHMsIHRoaXMudHlwZSk7XHJcbiAgfVxyXG5cclxuICBhZGQgKGl0ZW0pIHtcclxuICBcdGlmIChpdGVtKSB7XHJcbiAgXHRcdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICBcdFx0aXRlbS5wYXJlbnQgPSB0aGlzO1xyXG4gIFx0fVxyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSB0aGlzIGJveCAoZnJvbSB0aGUgZG9tIGFuZCB0aGUgaXRlbXMgbGlzdClcclxuICByZW1vdmUgKGl0ZW0pIHtcclxuXHRpZiAoaXRlbSkge1xyXG5cdFx0dmFyIGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xyXG5cdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdCAgICB0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdGl0ZW0uJGVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHRcdGl0ZW0ucGFyZW50ID0gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcbiAgfVxyXG5cclxuICBudW1FbGVtZW50cyAoKSB7XHJcbiAgXHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gIFx0c3VwZXIucmVuZGVyKCk7XHJcbiAgXHRmb3IgKHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRcdHRoaXMuaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgXHR9XHJcbiAgfVxyXG59XHJcblRoaW5nLmFkZENsYXNzKEJveCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJveDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcclxcbi5EZW1vQm94IHtcXHJcXG4gIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgZmxvYXQ6IGxlZnQ7XFxyXFxuICBtYXJnaW46IDIwcHg7XFxyXFxuICB3aWR0aDogMjAwcHg7IFxcclxcbiAgaGVpZ2h0OiAyMDBweDsgXFxyXFxuICBib3JkZXI6IDJweCBkYXNoZWQgI2VlZTtcXHJcXG59XFxyXFxuXCI7XG4iLCJ2YXIgVGhpbmcgPSByZXF1aXJlKCcuLi9UaGluZy9UaGluZy5qcycpO1xyXG52YXIgQm94ID0gcmVxdWlyZSgnLi4vQm94L0JveC5qcycpO1xyXG5cclxuY2xhc3MgRGVtb0JveCBleHRlbmRzIEJveCB7XHJcblx0aW5pdCAocHJvcHMpIHtcclxuXHRcdHN1cGVyLmluaXQocHJvcHMpO1xyXG5cdFx0cHJvcHMud2lkdGggPSBwcm9wcy53aWR0aCB8fCAyMDA7XHJcblx0XHRwcm9wcy5oZWlnaHQgPSBwcm9wcy5oZWlnaHQgfHwgMjAwO1xyXG5cdFx0cHJvcHMucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFx0dGhpcy50eXBlID0gJ0RlbW9Cb3gnO1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9IFRoaW5nLm1ha2VFbGVtZW50KFRoaW5nLmh0bWwoKSwgdGhpcy5wcm9wcywgdGhpcy50eXBlKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHRzdXBlci5yZW5kZXIoKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjc3MgKCkge1xyXG5cdFx0cmV0dXJuIHJlcXVpcmUoJy4vRGVtb0JveC5jc3MnKTtcclxuXHR9XHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoRGVtb0JveCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlbW9Cb3g7XHJcbiIsInZhciBlbGVtZW50Q291bnRlciA9IDA7XHJcblxyXG5jbGFzcyBUaGluZyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBpbml0IChwcm9wcykge1xyXG4gICAgdGhpcy5pbml0aWFsaXplKHByb3BzKTtcclxuICAgIHRoaXMudHlwZSA9ICdUaGluZyc7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gVGhpbmcubWFrZUVsZW1lbnQoVGhpbmcuaHRtbCgpLCB0aGlzLnByb3BzLCB0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZSAocHJvcHMpIHtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICAvLyBDU1MgcHJvcHMgZ28gaW50byB0aGlzLnByb3BzXHJcbiAgICB0aGlzLnByb3BzID0gVGhpbmcuY2xlYW51cChwcm9wcyk7XHJcbiAgICAvLyBrZWVwIHRoZXNlIHByb3BlcnRpZXMgb24gJ3RoaXMnXHJcbiAgICB0aGlzLnJvdGF0aW9uID0gcHJvcHMucm90YXRlIHx8IDA7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gcHJvcHMuc2NhbGUgfHwgMTtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIHZhciBwYXJlbnRFbGVtZW50ID0gKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiRlbGVtZW50KSB8fCAkKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgcGFyZW50RWxlbWVudC5hcHBlbmQodGhpcy4kZWxlbWVudCk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh0aGlzLnByb3BzKTtcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gZG9tIGFuZCBudWxsIGl0IG91dFxyXG4gIHVuUmVuZGVyICgpIHtcclxuICAgIGlmICh0aGlzLiRlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcm90YXRlIChkZWdyZWVzKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IGRlZ3JlZXM7XHJcbiAgICB0aGlzLmNzcyh7IFxyXG4gICAgICB0cmFuc2Zvcm06IFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1ModGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZUZhY3RvcilcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlVG8gKGFuZ2xlKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uID0gYW5nbGU7XHJcbiAgICB0aGlzLmNzcyh7IFxyXG4gICAgICB0cmFuc2Zvcm06IFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1ModGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZUZhY3RvcilcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2NhbGUgKGZhY3Rvcikge1xyXG4gICAgdGhpcy5zY2FsZUZhY3RvciArPSBmYWN0b3I7XHJcbiAgICB0aGlzLmNzcyh7IFxyXG4gICAgICB0cmFuc2Zvcm06IFRoaW5nLm1ha2VUcmFuc2Zvcm1DU1ModGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZUZhY3RvcilcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2NhbGVUbyAoZmFjdG9yKSB7XHJcbiAgICB0aGlzLnNjYWxlRmFjdG9yID0gZmFjdG9yO1xyXG4gICAgdGhpcy5jc3MoeyBcclxuICAgICAgdHJhbnNmb3JtOiBUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGVGYWN0b3IpXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNzcyAocHJvcHMpIHtcclxuICAgIHRoaXMucHJvcHMgPSAkLmV4dGVuZCh0aGlzLnByb3BzLCBwcm9wcyk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhwcm9wcyk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaHRtbCAoKSB7XHJcbiAgICByZXR1cm4gJzxkaXY+PC9kaXY+JztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjc3MgKCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZSAoKSB7XHJcbiAgICB2YXIgY2xzID0gdGhpcztcclxuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjbHMoKTtcclxuICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XHJcbiAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ2xhc3MgKGNscykge1xyXG4gICAgVGhpbmcuY2xhc3NlcyA9IFRoaW5nLmNsYXNzZXMgfHwge307XHJcbiAgICBUaGluZy5jbGFzc2VzW2Nscy5uYW1lXSA9IGNscztcclxuXHJcbiAgICAvLyBsb2FkIHRoZSBjbGFzcyBzdHlsZXMgKHRoZXNlIGFyZSBpbmNsdWRlZCBpbiB0aGUgYnVuZGxlIGF0IGJ1aWxkIHRpbWUpXHJcbiAgICBUaGluZy5hZGRDU1NTdHJpbmcoY2xzLmNzcygpLCBjbHMubmFtZSk7XHJcblxyXG4gICAgLy8gYWRkIGFkZGl0aW9uYWwgY3NzIGZpbGUgYXQgbG9hZCB0aW1lXHJcbiAgICBUaGluZy5hZGRDU1NGaWxlKGNscy5uYW1lICsgJy8nICsgY2xzLm5hbWUgKyAnLmNzcycsIGNscy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRDbGFzcyAobmFtZSkge1xyXG4gICAgcmV0dXJuIFRoaW5nLmNsYXNzZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIENTUyBtYW5hZ2VtZW50IGZ1bmN0aW9uc1xyXG5cclxuICBzdGF0aWMgbWFrZVN0eWxlcyAocHJvcHMpIHtcclxuICAgIHZhciBzdHlsZXMgPSBwcm9wcyB8fCB7fTtcclxuICAgICQuZXh0ZW5kKHN0eWxlcywge1xyXG4gICAgICBsZWZ0OiBwcm9wcy5sZWZ0IHx8IChwcm9wcy54ICYmIChwcm9wcy54ICsgXCJweFwiKSksXHJcbiAgICAgIHRvcDogcHJvcHMudG9wIHx8IChwcm9wcy55ICYmIChwcm9wcy55ICsgXCJweFwiKSksXHJcbiAgICAgIHdpZHRoOiBwcm9wcy53aWR0aCB8fCAocHJvcHMudyAmJiAocHJvcHMudyArIFwicHhcIikpLFxyXG4gICAgICBoZWlnaHQ6IHByb3BzLmhlaWdodCB8fCAocHJvcHMuaCAmJiAocHJvcHMuaCArIFwicHhcIikpLFxyXG4gICAgICB6SW5kZXg6IHByb3BzLnpJbmRleCB8fCBwcm9wcy56LFxyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IChwcm9wcy5iYWNrZ3JvdW5kQ29sb3IgfHwgJ3RyYW5zcGFyZW50JyksXHJcbiAgICAgIHRyYW5zZm9ybTogcHJvcHMudHJhbnNmb3JtIHx8IChUaGluZy5tYWtlVHJhbnNmb3JtQ1NTKHByb3BzLnJvdGF0ZSwgcHJvcHMuc2NhbGUpKSxcclxuICAgICAgcG9zaXRpb246IHByb3BzLnBvc2l0aW9uIHx8ICdhYnNvbHV0ZSdcclxuICAgIH0pO1xyXG4gICAgZGVsZXRlIHN0eWxlcy5yb3RhdGU7XHJcbiAgICBkZWxldGUgc3R5bGVzLnNjYWxlO1xyXG4gICAgZGVsZXRlIHN0eWxlcy54O1xyXG4gICAgZGVsZXRlIHN0eWxlcy55O1xyXG4gICAgZGVsZXRlIHN0eWxlcy56O1xyXG4gICAgZGVsZXRlIHN0eWxlcy53O1xyXG4gICAgZGVsZXRlIHN0eWxlcy5oO1xyXG4gICAgcmV0dXJuIHN0eWxlcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYWtlVHJhbnNmb3JtQ1NTIChyb3RhdGUsIHNjYWxlKSB7XHJcbiAgICB2YXIgdHJhbnNmb3JtID0gJyc7XHJcbiAgICB0cmFuc2Zvcm0gKz0gc2NhbGUgJiYgKFRoaW5nLm1ha2VTY2FsZUNTUyhzY2FsZSkgKyAnICcpO1xyXG4gICAgdHJhbnNmb3JtICs9IFRoaW5nLmlzTnVtZXJpYyhyb3RhdGUpICYmIChUaGluZy5tYWtlQW5nbGVDU1Mocm90YXRlKSArICcgJyk7XHJcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VBbmdsZUNTUyAoYW5nbGUpIHtcclxuICAgIHJldHVybiAncm90YXRlKCcrYW5nbGUrJ2RlZyknO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1ha2VTY2FsZUNTUyAoc2NhbGUpIHtcclxuICAgIHJldHVybiAnc2NhbGUoJytzY2FsZSsnKSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWFrZUVsZW1lbnQgKGh0bWwsIHByb3BzLCB0eXBlKSB7XHJcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGh0bWwpXHJcbiAgICAgIC5jc3MoVGhpbmcubWFrZVN0eWxlcyhwcm9wcykpXHJcbiAgICAgIC5hZGRDbGFzcyh0eXBlIHx8ICdyYW5kb20nKVxyXG4gICAgICAuYXR0cignaWQnLCAodHlwZSB8fCAncmFuZG9tJykgKyAoKytlbGVtZW50Q291bnRlcikpO1xyXG4gICAgcmV0dXJuICRlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGlzTnVtZXJpYyhuKSB7XHJcbiAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xyXG4gIH1cclxuXHJcbiAgLy8gTWFrZSBzdXJlIG5lY2Vzc2FyeSBDU1MgcHJvcGVydGllcyBhcmUgcHJlc2VudCBvciBkZWZhdWx0ZWQgdG8gc29tZXRoaW5nIHNhbmVcclxuICBzdGF0aWMgY2xlYW51cCAocHJvcHMpIHtcclxuICAgIHZhciBjcCA9IHByb3BzIHx8IHt9O1xyXG4gICAgY3AucG9zaXRpb24gPSBwcm9wcy5wb3NpdGlvbiB8fCAnYWJzb2x1dGUnOyAgIC8vIGRlZmF1bHQgdG8gYWJzb2x1dGUgcG9zaXRpb25pbmdcclxuICAgIC8vIGNwLnggPSBwcm9wcy54IHx8IHByb3BzLmxlZnQgfHwgMDtcclxuICAgIC8vIGNwLnkgPSBwcm9wcy55IHx8IHByb3BzLnRvcCB8fCAwO1xyXG4gICAgLy8gY3AueiA9IHByb3BzLnogfHwgcHJvcHMuekluZGV4O1xyXG4gICAgLy8gY3AudyA9IHByb3BzLncgfHwgcHJvcHMud2lkdGg7XHJcbiAgICAvLyBjcC5oID0gcHJvcHMuaCB8fCBwcm9wcy5oZWlnaHQ7XHJcbiAgICBjcC5yb3RhdGlvbiA9IHByb3BzLnJvdGF0aW9uIHx8IDA7XHJcbiAgICBjcC5zY2FsZSA9IHByb3BzLnNjYWxlIHx8IDE7XHJcbiAgICByZXR1cm4gY3A7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkQ1NTRmlsZShmaWxlTmFtZSwgaWQpIHtcclxuICAgICQuZ2V0KGZpbGVOYW1lKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICAgICAgdmFyIGxpbmsgPSAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCInICsgZmlsZU5hbWUgKyAnXCIgaWQ9XCInICsgaWQgKyAnXCI+JztcclxuICAgICAgICAgICAgJCgnaGVhZCcpLmZpbmQoJyMnICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAkKCdoZWFkJykuYXBwZW5kKGxpbmspO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7fSlcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhZGRDU1NTdHJpbmcoY3NzU3RyaW5nLCBpZCkge1xyXG4gICAgaWYgKGNzc1N0cmluZykge1xyXG4gICAgICAvLyB2YXIgZG9jID0gd2luZG93LmRvY3VtZW50O1xyXG4gICAgICB2YXIgc3R5bGVFbCA9ICQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICtjc3NTdHJpbmcrICc8L3N0eWxlPicpICAgICBcclxuICAgICAgICAuYXR0cignaWQnLCAoaWQgfHwgJ1RoaW5nJykgKyAnLXN0eWxlcycpO1xyXG4gICAgICAkKCdoZWFkJykuYXBwZW5kKHN0eWxlRWwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbn1cclxuVGhpbmcuYWRkQ2xhc3MoVGhpbmcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaGluZztcclxuIiwidmFyIFRoaW5nID0gcmVxdWlyZSgnLi9UaGluZy9UaGluZy5qcycpO1xyXG5yZXF1aXJlKCcuL0JveC9Cb3guanMnKTtcclxucmVxdWlyZSgnLi9BcnJvdy9BcnJvdy5qcycpO1xyXG5yZXF1aXJlKCcuL0RlbW9Cb3gvRGVtb0JveC5qcycpO1xyXG5cclxud2luZG93LlRoaW5nID0gVGhpbmc7XHJcbiJdfQ==
