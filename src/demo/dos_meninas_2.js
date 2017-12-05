//----------------------------------------------------
// 1.35  (.74)     6000x4440    5130x3800
// 1.3888  (.72)   6000x4320    5000x3600  4000x2880
// 1.4084 (.71)      6000x4260
// 1.618   (.618)     6000x3708.3
//
var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.Rand;
var Pattern = Thing.Pattern;

function makeRandomBox(props) {
  return Thing.Box.make($.extend({
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
  return makeRandomBox().add( Pattern.makePatternFromCSS(patternCSSProps) );
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
  var edge = Thing.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    lineWidth: 20,
    zIndex: 10010,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  var floorImg = Thing.Img
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
    makePatternBox( Pattern.makeGraphPaperPatternCSS({size: Rand.randInt(1,5) * 100, backgroundColor: '#003'}) ),
    makePatternBox( Pattern.makePlaidRedPatternCSS() ),
    makePatternBox( Pattern.makeSofaPatternCSS({size: Rand.randInt(2,12) * 50}) ),
    makePatternBox( Pattern.makePolkaDotPatternCSS({size: Rand.randInt(100,650)}) ),
    makePatternBox( Pattern.makeVerticalStripePatternCSS({size: Rand.randInt(130,600)}) ),
    makePatternBox( Pattern.makeDiagonalStripePatternCSS({size: Rand.randInt(5,100) * 10}) ),
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
    var M = Meninas.makeMatrix3D( menina.getCSSTransform() );
    var tp = Meninas.transformPoint(point, M, [dim.w/2, dim.h/2]);
    background.add( Meninas.makeTextArrow(
      Rand.randInt(tp[0]-100, tp[0]+100), Rand.randInt(tp[1]-150, tp[1]-350),
      tp[0], tp[1],
      '#5dff1d', parseInt(tp[0]), 60, pos[2]+5000) );
    background.render();
  }

  Thing.Img.onAllLoaded(makeImgPointers);

  window.menina = menina;
  window.BG = background;
});
