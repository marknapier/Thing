/*
  Dimensions are based on 1200 x 800 canvas size.
  To change the size of the artwork, change the canvas tag width to whatever size you want,
  then set Shapes.setScale(actualCanvasSize / 1200).
*/
window.ArcField = (function () {
  var canvas = null; //document.getElementById('myCanvas');
  var patternCanvas = document.getElementById('patternCanvas');
  var fpsDisplay = document.getElementById('fpsDisplay');
  var context = null; //canvas.getContext('2d');
  var contextPattern = patternCanvas.getContext('2d');
  var timestep = 1000 / 60;
  var frameCount = 0;
  var scale = 1; // canvas.width / 1200;
  var pulsarClasses = {
    Pulsar,
    PulsarSolid,
    PulsarChecked,
    PulsarSpiral,
    PulsarDashed,
    PulsarPattern,
    PulsarVerticalBar,
    PulsarVerticalDivider,
    PulsarVerticalSweep,
    PulsarSolidWithOutline,
  };
  var fidget1, fidget2;

  function makeGreenOrangePalette() {
    var colors = (new ColorFactory({colorFrom: [5, 225, 90, 0.6], colorTo: [255, 60, 0, 0.6]})).getGradientValues(255);
    for (let i=120; i <= 140; i++) {
      colors[i] = [0,0,0,0];  // transparent band in middle
    }
    return colors;
  }

  function makeGreenGreenPalette() {
    var colors = (new ColorFactory({colorFrom: [77, 212, 0, 0.2], colorTo: [0, 117, 60, 0.2]})).getGradientValues(255);
    colors[253] = [0,60,60,0.2];
    colors[254] = [0,60,60,0.2];
    return colors;
  }

  function makeYellowishPalette() {
    var colors = new ColorFactory({colorFrom: [230, 255, 0, 0.6], colorTo: [255, 250, 180, 0.6]}).getGradientValues(255);
    colors[253] = [20, 10, 30, 0.5];
    colors[254] = [0, 10, 50, 0.5];
    return colors;
  }

  var pulsarConfigs = [
    {
      type: 'Pulsar', // bluegreen - is replaced by pixel palette below
      context: context,
      colorFactory: new ColorFactory({color: [0, 153, 102, 0.35]}),
      duration: 10 * 1000,
      r: 250,
      velocity: 0,
      friction: 0.1,
    },
    {
      type: 'Pulsar',
      context: context,
      colorFactory: new ColorFactory({palette: makeGreenOrangePalette()}),
      duration: 5 * 1000,
      maxR: 250 * scale,
    },
    {
      type: 'Pulsar',  // solid red alpha
      context: context,
      colorFactory: new ColorFactory({color: [255, 0, 102, 0.09]}),
      duration: 30 * 1000,
      maxR: 320 * scale,
    },
    {
      type: 'PulsarChecked',
      context: context,
      colorFactory: new ColorFactory({palette: makeGreenGreenPalette()}),
      duration: 14 * 1000,
    },
    {
      type: 'PulsarChecked',
      context: context,
      colorFactory: new ColorFactory({colorFrom: [255, 220, 0, 1.0], colorTo: [230, 250, 30, 1.0]}),
      duration: 14 * 1000,
    },
    {
      type: 'PulsarSolidWithOutline',  //solid
      context: context,
      colorFactory: new ColorFactory({color: [0, 0, 75, 0.8]}),  // 102
      duration: 32 * 1000,
      maxR: 320 * scale,
    },
    {
      type: 'PulsarVerticalBar',
      context: context,
      colorFactory: new ColorFactory({color: [0, 0, 75, 1.0]}),  // 102
      duration: 10 * 1000,
    },
    {
      type: 'PulsarVerticalBar',
      context: context,
      colorFactory: new ColorFactory({colorFrom: [230, 255, 0, 0.6], colorTo: [255, 250, 180, 0.6]}),
      duration: 8 * 1000,
    },
    {
      type: 'PulsarVerticalDivider',
      context: context,
      colorFactory: new ColorFactory({colorFrom: [250, 250, 100, 0.3], colorTo: [0, 0, 50, 0.3]}),
      duration: 1200 * 1000,
      maxR: 1200 * scale,
    },
  ];

  var currentPen = pulsarConfigs[0];
  var pulsars = [];

  function getPixels(imageObj) {
    var tmpCanvas = document.createElement('canvas');
    var tmpContext = tmpCanvas.getContext('2d');
    tmpCanvas.width = imageObj.width;
    tmpCanvas.height = imageObj.height;
    tmpCanvas.style.display = 'none';
    document.body.appendChild(tmpCanvas);
    tmpContext.drawImage(imageObj, 0, 0);

    var imgd = tmpContext.getImageData(0, 0, imageObj.width, imageObj.height);
    var pix = imgd.data;
    var pixels = [];

    for (var i = 0, n = pix.length; i < n; i += 4) {
      pixels.push([
        pix[i  ], // red
        pix[i+1], // green
        pix[i+2], // blue
        pix[i+3], // alpha
      ]);
    }

    return pixels;
  }

  function loadPixels(imgSrc, callback) {
    var imageObj = new Image();
    imageObj.onload = function() {
      callback(getPixels(imageObj));
    };
    imageObj.src = imgSrc;
  }

  function copyCanvas() {
    var dataURL = canvas.toDataURL();
    document.getElementById('canvasCopy').src = dataURL;
  }

  function update(delta) {
    frameCount++;
    updateAll(delta);
  }

  function draw(interp) {
    drawAll(interp);
    fpsDisplay.textContent = Math.round(MainLoop.getFPS()) + ' FPS';
  }

  function updateAll(delta) {
    pulsars.forEach(function (p) {
      p.update(delta);
    });
    fidget1 && fidget1.update();
    fidget2 && fidget2.update();
  }

  function drawAll(interp) {
    pulsars.forEach(function (p) {
      p.draw(interp);
    });
    drawGesture();
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

  function addPulsar(p) {
    if (pulsars.length >= 200) {
      pulsars.shift();
    }
    pulsars.push(p);
  }

  function rgbHex(rgbaArray) {
    return tinycolor({r:rgbaArray[0], g:rgbaArray[1], b:rgbaArray[2], a:1.0}).toHex8String();
  }

  function setPen(pulsarConfig) {
    currentPen = pulsarConfig;
  }

  var colorButtons = [];

  function clearSelectedButton() {
    colorButtons.forEach(function (b) {
      b.classList.remove('selected');
    });
  }

  function addButtons(configs) {
    configs.forEach(function (config) {
      var div = document.createElement('div');
      var colorFrom = rgbHex(config.colorFactory.colorFrom);
      var colorTo = rgbHex(config.colorFactory.colorTo);
      div.className = ('color-button');
      if (config.type === 'PulsarVerticalBar' || config.type === 'PulsarVerticalDivider') {
        div.style.borderRadius = 0;
      }
      if (config.type === 'PulsarChecked') {
        div.style.backgroundColor = colorFrom;
        div.classList.add('checkered3');
      }
      else {
        div.style.backgroundImage = `linear-gradient(${colorFrom} 0%, ${colorTo} 100%)`;
      }
      div.addEventListener('click', (function (c, d) {
        return function (e) {
          clearSelectedButton();
          d.classList.add('selected');
          setPen(c); 
        };
      })(config, div));
      document.getElementById('pulsar-buttons').append(div);
      colorButtons.push(div);
      colorButtons[0].classList.add('selected');
    })
  }

  function setFullscreenButton() {
    var goFS = document.getElementById("goFS");
    goFS.addEventListener("click", function() {
      if (document.body.webkitRequestFullScreen) document.body.webkitRequestFullScreen();
      else if (document.body.requestFullscreen) document.body.requestFullscreen();
      else if (document.body.requestFullScreen) document.body.requestFullScreen();
    }, false);
  }

  function makePatternThang(ctx, imgFileName, callback) {
    var imageObj = new Image();
    imageObj.onload = function() {
      var p = ctx.createPattern(imageObj, 'repeat');
      callback(p);
    };
    imageObj.src = imgFileName;
  }

  var friction = 0.0; // 0.00005;

  function randBandWidth() {
    return Math.floor(6 + Math.random() * 80);
  }


  function createFidget1(x, y, radius=100) {
    let circles = [];
    let bandWidth = randBandWidth();

    for (let r=10; r < radius; ) {
      bandWidth = randBandWidth();

      let p = new Pulsar({
        context,
        r,
        bandWidth,
        x: x,
        y: y,
        velocity: 0.0001,
      });

      addPulsar(p);
      circles.push(p);
      r += (Math.random() * bandWidth);
    }

    function update() {
    }

    var self = {
      update,
    };

    return self;
  }

  function createFidget2() {
    var barLeft = new PulsarVerticalSweep({
      context: context,
      x: 0 * scale,
      y: 0 * scale,
      time: 0,
      friction: 0.0,
      colorFactory: new ColorFactory({colorFrom: [0, 0, 60, 0.9], colorTo: [250, 250, 0, 0.9]}),
      duration: 21 * 1000,  // 12
      maxR: 600 * scale,
      edgeWidth: 4 * scale,
    });
    var barLeft1 = new PulsarVerticalSweep({
      context: context,
      x: 300 * scale,
      y: 0 * scale,
      time: 0,
      friction: 0.0,
      colorFactory: new ColorFactory({colorFrom: [0, 0, 60, 0.9], colorTo: [250, 250, 0, 0.9]}),
      duration: 28 * 1000,  // 12
      maxR: 600 * scale,
      edgeWidth: 4 * scale,
    });
    var barRight = new PulsarVerticalSweep({
      context: context,
      x: 600 * scale,
      y: 0 * scale,
      time: 0,
      friction: 0.0,
      colorFactory: new ColorFactory({colorFrom: [255, 250, 0, 0.5], colorTo: [0, 0, 60, 0.5]}),
      // colorFactory: new ColorFactory({colorTo: [255, 250, 30, 0.5], colorFrom:  [255, 230, 0, 0.2]}),
      duration: 14 * 1000,  // 12
      maxR: 600 * scale,
      edgeWidth: 4 * scale,
    });
    var discLeft = new PulsarChecked({
      context: context,
      x: 400 * scale,
      y: 400 * scale,
      time: 0,
      friction: friction,
      colorFactory: new ColorFactory({color: [255, 250, 0, 0.35]}),
      duration: 15 * 1000,  // 5
      rotateVelocity: 0.008,
      maxR: 270,
      numBands: 1,
      numPies: 2,
    });
    var discLeft1 = new PulsarChecked({
      context: context,
      x: 300 * scale,
      y: 300 * scale,
      time: 0,
      friction: friction,
      colorFactory: new ColorFactory({color: [255, 250, 0, 0.35]}),
      duration: 10 * 1000,  // 5
      rotateVelocity: 0.0,
      maxR: 290,
      numBands: 10,
      numPies: 40,
    });
    var discRight = new PulsarChecked({
      context: context,
      x: 800 * scale,
      y: 400 * scale,
      time: 10000,
      friction: friction,
      colorFactory: new ColorFactory({colorFrom: [0, 0, 120, 0.9], colorTo: [0, 0, 60, 0.9]}),
      duration: 27 * 1000,  // 17
      maxR: 350 * scale,
      rotateVelocity: 0.0,
      numBands: 10,
      numPies: 30,
    });
    var discRight1 = new PulsarSolidWithOutline({
      context: context,
      x: 700 * scale,
      y: 410 * scale,
      time: 10000,
      friction: friction,
      colorFactory: new ColorFactory({colorFrom: [0, 0, 120, 0.9], colorTo: [0, 0, 60, 0.9]}),
      duration: 27 * 1000,  // 17
      maxR: 250 * scale,
      rotateVelocity: 0.003,
      numBands: 1,
      numPies: 2,
    });

    function update() {
    }

    var self = {
      update,
    };

    addPulsar(barLeft);
    // addPulsar(barLeft1);
    addPulsar(discRight1);
    addPulsar(barRight);
    addPulsar(discLeft);
    addPulsar(discLeft1);
    addPulsar(discRight);

    return self;
  }

  function drawGesture() {
    if (gesture && gesture !== drawnGesture) {
      HUD.drawGesture(gesture.start.x, gesture.start.y, gesture.end.x, gesture.end.y);
      drawnGesture = gesture;
    }
  }

  function lineRectIntersect(x1, y1, x2, y2, rx, ry, rw, rh) {
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    var left =   lineLineIntersect(x1,y1,x2,y2, rx,ry,rx, ry+rh);
    var right =  lineLineIntersect(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
    var top =    lineLineIntersect(x1,y1,x2,y2, rx,ry, rx+rw,ry);
    var bottom = lineLineIntersect(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
      return true;
    }
    return false;
  }

  function lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // calculate the direction of the lines
    var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      // point where the lines meet
      var intersectionX = x1 + (uA * (x2-x1));
      var intersectionY = y1 + (uA * (y2-y1));

      return true;
    }
    return false;
  }

  // Check intersection of line seg and circle
  // A,B end points of line segment
  // C center of circle
  // radius of circle
  // returns distance from line to center if intersecting else 0   
  function doesLineIntersectCircle(A, B, C, radius) {
    var dist;
    const v1x = B.x - A.x;
    const v1y = B.y - A.y;
    const v2x = C.x - A.x;
    const v2y = C.y - A.y;
    // get the unit distance along the line of the closest point to
    // circle center
    const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);

    // if the point is on the line segment get the distance squared
    // from that point to the circle center
    if (u >= 0 && u <= 1) {
      dist = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
    } 
    else {
      // if closest point not on the line segment
      // use the unit distance to determine which end is closest
      // and get dist square to circle
      dist = u < 0 ?
      (A.x - C.x) ** 2 + (A.y - C.y) ** 2 :
      (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
    }

    if (dist < radius * radius) {
      return Math.sqrt(dist);
    }
    return 0;
  }

  function sqr(x) { 
    return x * x 
  }
  function dist2(v, w) { 
    return sqr(v.x - w.x) + sqr(v.y - w.y) 
  }
  function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, { x: v.x + t * (w.x - v.x),
                      y: v.y + t * (w.y - v.y) });
  }
  function distToSegment(p, v, w) { 
    return Math.sqrt(distToSegmentSquared(p, v, w)); 
  }

  function slope(p1, p2) {
    return (p2.y - p1.y) / (p2.x - p1.x);
  }

  function b(p1, p2) {
    // y=mx+b
    var m = slope(p1, p2);
    return p1.y - (m * p1.x); 
  }

  function makeLongLine(p1, p2) {
    var m = slope(p1, p2);
    var b = p1.y - (m * p1.x);
    var y1 = (m * 0) + b;
    var y2 = (m * 1200) + b;
    return [ {x: 0, y: y1}, {x: 1200, y: y2}];
  }

  function getNormal(a, b, c) {
    var u = {x: b.x - a.x, y: b.y - a.y};
    var v = {x: c.x - a.x, y: c.y - a.y};
    // z is always 0 here (2d only)
    var n = {
      x: (u.y * 0) - (0 * v.y),
      y: (0 * v.x) - (u.x * 0),
      z: (u.x * v.y) - (u.y * v.x),
    }
    return n;
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

  // given a mouse position in screen coords (Y is positive)
  // clone the point and force the Y axis to negative (gl space has negative Y axis)
  function invertY(point) {
    return {x: point.x, y: point.y > 0 ? -point.y : point.y};
  }

  class Gesture {
    constructor(start, end) {
      this.start = invertY(start);
      this.end = invertY(end);
    }
  }

  var mousePosition = null;
  var mousedownPoint = null;
  var mouseupPoint = null;
  var vector = new Vector;
  var longpressTimer;
  var longpressing = false;
  var gesture;
  var drawnGesture;

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
      handleLongPress(invertY(mousedownPoint));
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
      handleClick(invertY(mousedownPoint));
    }
    else {
      drawnGesture = gesture;
      gesture = new Gesture(mousedownPoint, mouseupPoint);
      handleGesture(gesture.start, gesture.end, vector);
    }
  }

  function handleClick(point) {
    var scale = 1 / 1;   // 1 over canvas scale factor
    var pulsarClass = pulsarClasses[currentPen.type || 'Pulsar'];
    currentPen.x = point.x;
    currentPen.y = point.y;
    currentPen.context = context;
    currentPen.friction = friction;  // fudgy: set global friction value to any pulsar added by click
    addPulsar(new pulsarClass(currentPen));
  }

  function handleGesture(start, end, v) {
    pulsars.map((p) => {
      if (p.name === 'PulsarVerticalBar') {
        var intersects = lineRectIntersect(start.x, start.y, end.x, end.y, p.x, p.y, p.r, 800 *scale);
        return {
          distance: intersects ? 1 : 0,
          vector: v,
          pulsar: p,
          normal: getNormal(start, end, p),
        }
      }
      else {
        var distanceToCenter = doesLineIntersectCircle(start, end, p, p.r);
        return {
          distance: distanceToCenter,
          vector: v,
          pulsar: p,
          normal: getNormal(start, end, p),
        };
      }
    }).filter((intersection) => {
      return intersection.distance > 0;
    }).forEach((intersection) => {
      var longline = makeLongLine(start, end);
      var dist = distToSegment(intersection.pulsar, longline[0], longline[1]); // how far is gesture from center
      var leverage = dist / intersection.pulsar.maxR; // 0 == at center 1 == at edge
      var magnitude = intersection.vector.length() / (300 * scale); // how big is the gesture (300 pixels is based on 1200 pixel wide canvas) will be in range 0-4
      var clockwise = intersection.normal.z > 0 ? 1 : -1; // which way to rotate

      if (intersection.pulsar.name === 'PulsarVerticalBar') {
        console.log('intersectBAR', intersection.pulsar.name, intersection.vector);
        var direction = intersection.vector.x > 0 ? 1 : -1;
        intersection.pulsar.velocity += magnitude * 0.1;
      }
      else {
        console.log('intersect', intersection.pulsar.name, 'len=', intersection.vector.length() / (300 * scale), 'dist=', dist, 'longline', longline, 'lev', leverage, intersection.vector);
        // intersection.pulsar.direction = {x: (intersection.vector.x/intersection.vector.x)*Math.sign(intersection.vector.x), y: -((intersection.vector.y/intersection.vector.y)*Math.sign(intersection.vector.y))};
        intersection.pulsar.direction = {x: intersection.vector.x / 10, y: -intersection.vector.y / 10};
        intersection.pulsar.velocity += magnitude * (1 - leverage) * 0.01;
        intersection.pulsar.rotateVelocity += magnitude * leverage * 0.1 * clockwise;
      }
    });
  }

  function handleLongPress(start) {
    var end = {x: start.x + 1, y: start.y + 1};  // make up a short 'end' vector
    pulsars.map((p) => {
      var distanceToCenter = doesLineIntersectCircle(start, end, new Vector(p.x, p.y), p.r);
      return {
        distance: distanceToCenter,
        vector: null,
        pulsar: p,
        normal: null,
      };
    }).filter((intersection) => {
      return intersection.distance > 0;
    }).forEach((intersection) => {
      console.log('long press on', intersection.pulsar.name);
      intersection.pulsar.velocity *= 0.5;
      intersection.pulsar.rotateVelocity *= 0.5;
    });
  }

  function handleKeypress(e) {
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 83 && evtobj.ctrlKey) { // ctrl-S
      savePulsars(pulsars);
      e.preventDefault();
    }
    else if (evtobj.keyCode == 76 && evtobj.ctrlKey) { // ctrl-L
      loadPulsars();
      e.preventDefault();
    }
    else if (evtobj.keyCode == 67 && evtobj.ctrlKey) { // ctrl-C
      pulsars = [];
      e.preventDefault();
    }
  }



  function savePulsars(pulsars) {
    var pulsarConfigStr = window.JSON.stringify(pulsars);
    window.localStorage.setItem('pulsars', pulsarConfigStr);
  }

  function loadPulsars() {
    var pulsarConfigStr = window.localStorage.getItem('pulsars');
    var pulsarConfigs = window.JSON.parse(pulsarConfigStr);

    // clear current pulsars
    pulsars = [];

    // add pulsars from storage
    pulsarConfigs.forEach((pconfig) => {
      pconfig.type = pconfig.name;
      pconfig.context = context;
      pconfig.colorFactory = new ColorFactory(pconfig.colorFactory);

      var pulsarClass = pulsarClasses[pconfig.name] || pulsarClasses[0];
      addPulsar(new pulsarClass(pconfig));
    });
  }

  function randomR() {
    return Math.floor(60 + Math.random() * 200);
  }

  var DPR = 1;

  function init(rendrr, scene3js, textures) {
    canvas = rendrr.domElement;
    context = scene3js;
    DPR = rendrr.getPixelRatio();

    Pulsar.SCALE = scale;
    Pulsar.ease = Easing.easeInOutSine;
    Pulsar.textures = textures;

    // context.translate(0.5, 0.5);

    // makePatternThang(contextPattern, '../img/vintagewallpaper4_crop.png', function (p) {
    //   Shapes.setPattern(p);
    // });

    loadPixels('./img/palette_blue_green_dark_edge_2.png', function (pixelValues) {
      pulsarConfigs[0].colorFactory = new ColorFactory({palette: pixelValues, alpha: 0.35});
    });

    // loadPixels('./img/skin_front_1px_1.png', function (pixelValues) {
    //   pulsarConfigs[1].colorFactory = new ColorFactory({palette: pixelValues, alpha: 0.75});
    //   pulsarConfigs[6].colorFactory = new ColorFactory({palette: pixelValues, alpha: 0.05});
    // });

    canvas.addEventListener('touchstart', gestureStart);
    canvas.addEventListener('touchend', gestureEnd);
    canvas.addEventListener('mousedown', gestureStart);
    canvas.addEventListener('mouseup', gestureEnd);
    canvas.addEventListener('mousemove', mouseMove);

    document.addEventListener('keydown', handleKeypress);

    setFullscreenButton();
    setPen(pulsarConfigs[0]);

    fidget1 = createFidget1(1200, -100, randomR()); // middle
    fidget1 = createFidget1(400, -100, randomR());
    fidget1 = createFidget1(800, -100, randomR());

    fidget1 = createFidget1(1000, -200, randomR()); // middle
    fidget1 = createFidget1(200, -200, randomR());
    fidget1 = createFidget1(600, -200, randomR());

    fidget1 = createFidget1(1200, -300, randomR()); // middle
    fidget1 = createFidget1(400, -300, randomR());
    fidget1 = createFidget1(800, -300, randomR());

    fidget1 = createFidget1(1000, -400, randomR()); // middle
    fidget1 = createFidget1(200, -400, randomR());
    fidget1 = createFidget1(600, -400, randomR());

    // fidget2 = createFidget2();
  }
  
  return { 
    init, 
    update, 
    draw 
  };
}())

