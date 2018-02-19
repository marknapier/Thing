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
