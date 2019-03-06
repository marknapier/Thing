/*
  Dimensions are based on 1200 x 800 canvas size.
  To change the size of the artwork, change the canvas tag width to whatever size you want,
  then set Shapes.setScale(actualCanvasSize / 1200).
*/
window.Arc = (function () {
  var canvas = document.getElementById('myCanvas');
  var fpsDisplay = document.getElementById('fpsDisplay');
  var context = canvas.getContext('2d');
  var centerY = canvas.height / 3;
  var radius = 200;
  var timestep = 1000 / 60;
  var frameCount = 0;
  var scale = canvas.width / 1200;
  var pulsarClasses = {
    Pulsar,
    PulsarSolid,
    PulsarChecked,
    PulsarSpiral,
    PulsarDashed,
    PulsarPattern,
    PulsarVerticalBar,
    PulsarVerticalDivider,
    PulsarSolidWithOutline,
  };

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
    },
    {
      type: 'Pulsar',
      context: context,
      colorFactory: new ColorFactory({palette: makeGreenOrangePalette()}),
      maxR: 250 * scale,
      duration: 5 * 1000,
    },
    {
      type: 'Pulsar',  // solid red alpha
      context: context,
      colorFactory: new ColorFactory({color: [255, 0, 102, 0.09]}),
      maxR: 320 * scale,
      duration: 30 * 1000,
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
      colorFactory: new ColorFactory({color: [0, 0, 75, 1.0]}),  // 102
      maxR: 320 * scale,
      duration: 32 * 1000,
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
      maxR: 1200 * scale,
      duration: 60 * 1000,
    },
  ];

  var currentPen = pulsarConfigs[0];
  var pattern = null;
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
  }

  function drawAll(interp) {
    pulsars.forEach(function (p) {
      p.draw(interp);
    });
  }

  function getElementClickXY(e) {
    var rect = e.target.getBoundingClientRect();
    return { 
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function handleClick(x, y) {
    var scale = 1 / 1;   // 1 over canvas scale factor
    var pulsarClass = pulsarClasses[currentPen.type || 'Pulsar'];
    currentPen.x = x;
    currentPen.y = y;
    currentPen.context = context;
    addPulsar(new pulsarClass(currentPen));
  }

  function addPulsar(p) {
    if (pulsars.length >= 30) {
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

  function init() {
    Pulsar.SCALE = scale;
    Pulsar.ease = Easing.linear;

    context.translate(0.5, 0.5);

    MainLoop.setSimulationTimestep(timestep);
    MainLoop.setDraw(draw);
    MainLoop.setUpdate(update);
    MainLoop.start();

    canvas.addEventListener('click', function (e) {
      var p = getElementClickXY(e);
      handleClick(p.x, p.y);
    })
    canvas.addEventListener('touch', function (e) {
      var p = getElementClickXY(e);
      handleClick(p.x, p.y);
    })

    loadPixels('./img/palette_blue_green_dark_edge_2.png', function (pixelValues) {
      pulsarConfigs[0].colorFactory = new ColorFactory({palette: pixelValues, alpha: 0.35});
    });

    // bogus hack: wait for images to load before creating interface buttons
    setTimeout(function () {
      addButtons(pulsarConfigs);
    }, 1000);

    setFullscreenButton();
    setPen(pulsarConfigs[0]);
  }
  
  return { init };
}())

window.Arc.init();
