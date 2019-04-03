window.UIListener = (function () {
  var mousePosition = null;
  var mousedownPoint = null;
  var mouseupPoint = null;
  var vector;
  var longpressTimer;
  var longpressing = false;
  var gesture;
  var scale = 1;
  var handleClick;
  var handleGesture;
  var handleLongPress;

  // given a mouse position in screen coords (Y is positive)
  // clone the point and force the Y axis to negative (gl space has negative Y axis)
  function invertY(point) {
    return {x: point.x, y: point.y > 0 ? -point.y : point.y};
  }

  class Vector {
    constructor(x=0, y=0) {
      this.x = x;
      this.y = y;
    }

    length() {
      return Math.sqrt(this.x*this.x + this.y*this.y);
    }
  }

  class Gesture {
    constructor(start, end) {
      this.start = invertY(start);
      this.end = invertY(end);
    }
  }

  function getElementMouseXY(e) {
    var rect = e.target.getBoundingClientRect();
    var cx, cy;
    if (e.touches && e.touches[0]) {
      console.log('touchstart!!!!!!!!!!', e.touches);
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } 
    else if (e.changedTouches && e.changedTouches[0]) {
      console.log('touchEnd!!!!!!!!!!', e.changedTouches);
      cx = e.changedTouches[0].clientX;
      cy = e.changedTouches[0].clientY;
    }
    else {
      cx = e.clientX;
      cy = e.clientY;
    }
    return { 
      x: cx - rect.left,
      y: cy - rect.top
    };
  }

  function mouseMove(e) {
    var p = getElementMouseXY(e);
    mousePosition = new Vector(p.x, p.y);
  }

  function longPress() {
    // if we got to this function, the user has pressed and held
    // if the mouse position has not moved, then it's a long press
    var v = new Vector(mousePosition.x - mousedownPoint.x, mousePosition.y - mousedownPoint.y);
    if (v.length() < 5 * scale) { 
      longpressing = true;
      console.log('LONG PRESS!!!!!!');
      handleLongPress && handleLongPress(invertY(mousedownPoint));
    }
  }

  function gestureStart(e) {
    var p = getElementMouseXY(e);
    mouseupPoint = null;
    mousedownPoint = new Vector(p.x, p.y);
    longpressTimer = setTimeout(longPress, 600); // in 600 millis we'll check if this is a long press
    console.log('--->Down', p.x, p.y);
  }

  function gestureEnd(e) {
    var p = getElementMouseXY(e);
    clearTimeout(longpressTimer);
    mouseupPoint = new Vector(p.x, p.y);
    vector = new Vector(p.x - mousedownPoint.x, p.y - mousedownPoint.y);

    console.log('--->UP x y vector xy length', p.x, p.y, vector.x, vector.y, vector.length());
    if (longpressing) {
      // gesture has been handled by longpress logic
      longpressing = false;
    }
    else if (vector.length() < 5 * scale) { 
      // if little/no movement, treat it as a click
      handleClick && handleClick(invertY(mousedownPoint));
    }
    else {
      gesture = new Gesture(mousedownPoint, mouseupPoint);
      handleGesture && handleGesture(gesture.start, gesture.end, vector);
    }
  }

  function getGesture() {
    return gesture;
  }

  function listenOnElement(el) {
    el.addEventListener('touchstart', gestureStart);
    el.addEventListener('touchend', gestureEnd);
    el.addEventListener('mousedown', gestureStart);
    el.addEventListener('mouseup', gestureEnd);
    el.addEventListener('mousemove', mouseMove);
  }

  function setScale(s) {
    scale = s || 1;
  }

  function setCallbacks(callbacks = {}) {
    handleClick = callbacks.handleClick;
    handleGesture = callbacks.handleGesture;
    handleLongPress = callbacks.handleLongPress;
  }

  return {
    listenOnElement,
    getGesture,
    setScale,
    setCallbacks,
  };
}());
