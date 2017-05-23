var elementCounter = 0;

class Thing {
  constructor() {}

  init (props) {
    this.initialize(props);
    this.type = 'Thing';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
  }

  initialize (props) {
    // CSS props go into this.props
    props = props || {};
    props.position = props.position || 'absolute';   // default to absolute positioning
    this.props = props;

    // keep these properties on 'this'
    this.rotation = props.rotate || null;
    this.scaleFactor = props.scale || 1;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.z = props.z || 0;
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
      transform: Thing.makeTransformCSS(this.rotation, this.scaleFactor, this.x, this.y, this.z)
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

  // Size element to fill parent with a square aspect ratio
  fillParent () {
    if (this.parent) {
      let parentElementSize = Math.max(this.parent.$element.width(), this.parent.$element.height());
      this.css({
        position: 'absolute',
        left: '0px', top: '0px',
        width: parentElementSize, height: parentElementSize
      });
    }
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
      // zIndex: props.zIndex || props.z,
      backgroundColor: props.backgroundColor,
      transform: props.transform || (Thing.makeTransformCSS(props.rotate, props.scale, props.x, props.y, props.z)),
      position: props.position || 'absolute'
    });
    // These are not true CSS properties, so remove them
    delete styles.rotate;
    delete styles.scale;
    delete styles.x;
    delete styles.y;
    delete styles.z;
    delete styles.w;
    delete styles.h;
    return styles;
  }

  static makeTransformCSS (rotate, scale, tx, ty, tz) {
    var transform = '';
    transform += (tx || ty || tz) ? (Thing.makeTranslateCSS(tx, ty, tz) + ' ') : '';
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
    return 'scale('+scale+')';
  }

  // NOTE: translation coords are relative to the element's position in the document flow.
  // They are not the same as setting left/top values, which are absolute coordinates
  // relative to the parent element.
  static makeTranslateCSS (x, y, z) {
    x = x || '0';
    y = y || '0';
    z = z || '0';
    return 'translate3d('+ x + 'px, ' + y + 'px, ' + z +'px)';
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
  //---------------------------------------------------------

  static msg(s) {
    window.console.log(s);
  }
}
Thing.addClass(Thing);

module.exports = Thing;
