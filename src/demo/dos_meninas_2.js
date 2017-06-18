//----------------------------------------------------
// 1.35  (.74)     6000x4440    5130x3800
// 1.3888  (.72)   6000x4320    5000x3600  4000x2880
// 1.4084 (.71)      6000x4260
// 1.618   (.618)     6000x3708.3
//

$(function () {
  var Thing = window.Thing;
  var Meninas = window.Meninas;
  var Rand = Thing.classes.Rand;

  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale);
  var sofaSizes = [5, 10, 12.5, 16.6, 25, 50];

  // Prevents the screenshot plugin from including scrollbars in large screenshots.
  $('body').css({
    overflow: 'hidden',
    transformOrigin: '0 0'
  });

  background.add(Meninas.makeTextPane(0, 0, 1200, 2800));

  background.add(Meninas.makePattern('GraphPaper'));
  background.add(Meninas.makePattern('PlaidRedLarge'));
  background.add(Meninas.makePattern('Sofa', Rand.randItem(sofaSizes)));
  background.add(Meninas.makePattern('PatternPolkaDots', Rand.randInt(100,650)));
  background.add(Meninas.makePattern('PatternStripes', Rand.randInt(130,600)));
  background.add(Meninas.makePattern('DiagonalStripesViolet', Rand.randInt(10,40)));

  var menina = Meninas.makeMenina();
  menina.css({border: '9px solid rgba(255, 192, 203, 1)'});
  background.add(Meninas.makeMenina());
  background.add(menina);

  window.menina = menina;
  window.BG = background;

  background.add(Meninas.makeCouch());

  background.add(Meninas.makeRightWall());
  // background.add(Meninas.makeFloor())

  // Room edge right side
  var edge = Thing.classes.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    width: 20,
    zIndex: 10010,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });
  background.add(edge);

  background.add( Meninas.makeBubbleArrow(
          Rand.randInt(100,3000), Rand.randInt(100,500),
          menina.x, menina.y,
          '#ceff34', '', false, Rand.randInt(3000,15000)) );

  var pos = menina.getPosition();

  // Room
  // var R = Thing.classes.Room.make({
  //   w: pixelWidth,
  //   h: pixelHeight,
  //   d: 2000
  // });
  // R.walls.back.add(background);

  // var floorImg = Thing.classes.Img
  //   .make({
  //     src:'img/wood_texture_smooth_panel_red_oak.jpg',
  //     w: pixelWidth,
  //     h: 2000
  //   });
  // R.walls.bottom.add(floorImg);

  // stage.add(R);

  // makeFloor
  var floorImg = Thing.classes.Img
    .make({
      src:'img/wood_texture_smooth_panel_red_oak_pers_left.png',
      right: '0px',
      bottom: '0px',
      w: pixelWidth,
      h: 1000,
      zIndex: 20000
    });
  background.add(floorImg);

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
});
