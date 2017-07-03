//----------------------------------------------------
// 1.35  (.74)     6000x4440    5130x3800
// 1.3888  (.72)   6000x4320    5000x3600  4000x2880
// 1.4084 (.71)      6000x4260
// 1.618   (.618)     6000x3708.3
//
var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.classes.Rand;

function oneLine(s) {
  return (s.replace(/\r?\n|\r|\t/gm, '')).trim();
}

function makeGridPatternCSS(props) {
  props = props || {};

  let size = props.size || 100;
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

function makeGraphPaperPatternCSS(props) {
  props = props || {};

  let size = props.size || 100;
  let divSize = size / 4;
  let color = props.color || 'rgba(255,255,255,.5)';
  let bgColor = props.backgroundColor || 'transparent';
  let lineWidth = props.lineWidth || 2;
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

function makeDiagonalStripePatternCSS(props) {
  props = props || {};

  let size = props.size || 100;
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

function makeSofaPatternCSS(props) {
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

function makePatternFromCSS(css) {
  return Thing.classes.Pattern.make({pattern: 'none', size: null, stretch: true}).css(css);
}

function makeRandomBox(props) {
  return Thing.classes.Box.make($.extend({
    x: Rand.randInt(0,3000),
    y: 0,
    w: Rand.randInt(400,1600),
    h: 3600,
    zIndex: Rand.randInt(1,1000) * 10,
    backgroundColor: Rand.randItem(Meninas.greens),
    position: 'absolute',
    display: 'block',
    overflow: 'hidden'
  }, props));
}

function makePatternBox(patternCSSProps) {
  return makeRandomBox().add( makePatternFromCSS(patternCSSProps) );
}

$(function () {
  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale);
  var menina = Meninas.makeMenina().css({border: '9px solid rgba(255, 192, 203, 1)'});
  var pos = menina.getPosition();

  // Room edge right side
  var edge = Thing.classes.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    width: 20,
    zIndex: 10010,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  var floorImg = Thing.classes.Img
    .make({
      src:'img/wood_texture_smooth_panel_red_oak_pers_left.png',
      right: '0px',
      bottom: '0px',
      w: pixelWidth,
      h: 1000,
      zIndex: 20000
    });

  // Prevents the screenshot plugin from including scrollbars in large screenshots.
  $('body').css({
    overflow: 'hidden',
    transformOrigin: '0 0'
  });

  background.add([
    Meninas.makeTextPane(0, 0, 1200, 2800),
    makePatternBox( makeGraphPaperPatternCSS({size: Rand.randInt(1,5) * 100, backgroundColor: '#003'}) ),
    Meninas.makePattern('PlaidRedLarge'),
    makePatternBox( makeSofaPatternCSS({size: Rand.randInt(2,12) * 50, backgroundColor: '#330'}) ),
    Meninas.makePattern('PatternPolkaDots', Rand.randInt(100,650)),
    Meninas.makePattern('PatternStripes', Rand.randInt(130,600)),
    makePatternBox( makeDiagonalStripePatternCSS({size: Rand.randInt(5,100) * 10}) ),
    Meninas.makeMenina(),
    menina,
    Meninas.makeCouch(),
    Meninas.makeRightWall(),
    edge,
    floorImg,
  ]);

  // makeBubbleArrow() returns array with two objects to render
  background.add( Meninas.makeBubbleArrow(
    Rand.randInt(100,3000), Rand.randInt(100,500),
    menina.x, menina.y,
    '#ceff34', '', false, Rand.randInt(3000,15000)
  ));

  background.render();

  function makeImgPointers () {
    var dim = menina.getDimensions();
    var point = [500, 100];
    var M = Meninas.makeMatrix2D( menina.getCSSTransform() );
    var tp = Meninas.transformPoint(point, M, [dim.w/2, dim.h/2]);
    background.add( Meninas.makeTextArrow(
      Rand.randInt(tp[0]-100, tp[0]+100), Rand.randInt(tp[1]-150, tp[1]-350),
      tp[0], tp[1],
      '#5dff1d', parseInt(tp[0]), 60, pos[2]+5000) );
    background.render();
  }

  Thing.classes.Img.onAllLoaded = makeImgPointers;

  window.menina = menina;
  window.BG = background;
});
