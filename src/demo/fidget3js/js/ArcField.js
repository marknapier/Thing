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


  function createFidget1(x, y, w, h, radius=100) {
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
        bounds: {minx: 0, maxx: w, miny: -h, maxy: 0},
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

  var drawnGesture;

  function drawGesture() {
    var gesture = UIListener.getGesture();
    if (gesture && gesture !== drawnGesture) {
      HUD.drawGesture(gesture.start.x, gesture.start.y, gesture.end.x, gesture.end.y);
      drawnGesture = gesture;
    }
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

  function handleClick(point) {
    var scale = 1 / 1;   // 1 over canvas scale factor
    var pulsarClass = pulsarClasses[currentPen.type || 'Pulsar'];
    currentPen.x = point.x;
    currentPen.y = point.y;
    currentPen.context = context;
    currentPen.friction = friction;  // fudgy: set global friction value to any pulsar added by click
    currentPen.bounds = {minx: 0, maxx: 1600, miny: -800, maxy: 0}
    addPulsar(new pulsarClass(currentPen));
  }

  function handleGesture(start, end, v) {
    pulsars.map((p) => {
      if (p.name === 'PulsarVerticalBar') {
        var intersects = Intersections.lineRectIntersect(start.x, start.y, end.x, end.y, p.x, p.y, p.r, 800 *scale);
        return {
          distance: intersects ? 1 : 0,
          vector: v,
          pulsar: p,
          normal: Intersections.getNormal(start, end, p),
        }
      }
      else {
        var distanceToCenter = Intersections.doesLineIntersectCircle(start, end, p, p.r);
        return {
          distance: distanceToCenter,
          vector: v,
          pulsar: p,
          normal: Intersections.getNormal(start, end, p),
        };
      }
    }).filter((intersection) => {
      return intersection.distance > 0;
    }).forEach((intersection) => {
      var longline = Intersections.makeLongLine(start, end);
      var dist = Intersections.distToSegment(intersection.pulsar, longline[0], longline[1]); // how far is gesture from center
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
      var distanceToCenter = Intersections.doesLineIntersectCircle(start, end, new Vector(p.x, p.y), p.r);
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
    var rWidth = rendrr.getSize().width;
    var rHeight = rendrr.getSize().height;

    canvas = rendrr.domElement;
    context = scene3js;
    DPR = rendrr.getPixelRatio();

    UIListener.setScale(scale);

    Pulsar.SCALE = scale;
    Pulsar.ease = Easing.easeInOutSine;
    Pulsar.textures = textures;

    loadPixels('./img/palette_blue_green_dark_edge_2.png', function (pixelValues) {
      pulsarConfigs[0].colorFactory = new ColorFactory({palette: pixelValues, alpha: 0.35});
    });

    UIListener.listenOnElement(canvas);
    UIListener.setCallbacks({
      handleClick,
      handleGesture,
      handleLongPress,
    });

    document.addEventListener('keydown', handleKeypress);

    setFullscreenButton();
    setPen(pulsarConfigs[0]);

    fidget1 = createFidget1(1200, -100, rWidth, rHeight, randomR()); // middle
    fidget1 = createFidget1(400, -100, rWidth, rHeight, randomR());
    fidget1 = createFidget1(800, -100, rWidth, rHeight, randomR());

    fidget1 = createFidget1(1000, -200, rWidth, rHeight, randomR()); // middle
    fidget1 = createFidget1(200, -200, rWidth, rHeight, randomR());
    fidget1 = createFidget1(600, -200, rWidth, rHeight, randomR());

    fidget1 = createFidget1(1200, -300, rWidth, rHeight, randomR()); // middle
    fidget1 = createFidget1(400, -300, rWidth, rHeight, randomR());
    fidget1 = createFidget1(800, -300, rWidth, rHeight, randomR());

    fidget1 = createFidget1(1000, -400, rWidth, rHeight, randomR()); // middle
    fidget1 = createFidget1(200, -400, rWidth, rHeight, randomR());
    fidget1 = createFidget1(600, -400, rWidth, rHeight, randomR());

    // fidget2 = createFidget2();
  }
  
  return { 
    init, 
    update, 
    draw 
  };
}())

