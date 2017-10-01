var Thing = window.Thing;
var Meninas = window.Meninas;

function makePattern (name, size) {
  var Rand = Thing.classes.Rand;
  var Pattern = Thing.classes[name] ? Thing.classes[name] : Thing.classes.Pattern;
  var P =  Pattern.make({pattern: name, size: size});
  var box = Thing.classes.Box.make( {
    x: Rand.randInt(0,1000),
    y: 0,
    w: Rand.randInt(200,1600),
    h: 2000,
    zIndex: Rand.randInt(1,1000) * 10,
    backgroundColor: 'transparent',   //Rand.randItem(greens),
    position: 'absolute',
    display: 'block',
    overflow: 'hidden'
  });

  box.add( P );
  return box;
}

function makeMeninaSandwich(props) {
  var Rand = Thing.classes.Rand;
  var sofaSizes = [100, 160, 225, 280, 350, 500];

  var mWich = Thing.classes.Box.make({
    x: props.x,
    y: 0,
    w: 2500,
    h: 3000,
    zIndex: 10000
  });

  var backgroundMasks = [
    'linear-gradient(0deg, transparent 0%, transparent 25%, #fff 25%, #fff 55%, transparent 55.15%, transparent 85%, #fff 85%)',
    'linear-gradient(45deg, #0e0030 25%, transparent 25.15%, transparent 50%, #0e0030 50.15%, #0e0030 75%, transparent 75.15%, transparent)',
    'radial-gradient(transparent 300px, #fff 300px, #fff 600px, transparent 600px, transparent 900px, #fff 900px, #fff 1200px, transparent 1200px)'
  ];

  var meninaPatterns = Thing.classes.Box.make({
    width: '100%',
    height: '100%',
    backgroundColor: Rand.randItem(Meninas.greens),
    WebkitMaskImage: Rand.randItem(backgroundMasks),   // 846 X 1150     .735
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: '100%',
    opacity: 0.85
  });

  meninaPatterns.add(Meninas.makeTextPane(0, 0, Rand.randInt(100,650), 2000));
  meninaPatterns.add(makePattern('GraphPaper', Rand.randInt(1,8) * 100));
  meninaPatterns.add(makePattern('PlaidRed', Rand.randInt(1,8) * 250));
  meninaPatterns.add(makePattern('Sofa', Rand.randItem(sofaSizes)));
  meninaPatterns.add(makePattern('PolkaDots', Rand.randInt(10,550)));
  meninaPatterns.add(makePattern('Stripes', Rand.randInt(50,300)));
  meninaPatterns.add(makePattern('DiagonalStripesViolet', Rand.randInt(30,400)));
  mWich.add(meninaPatterns);

  return mWich;
}

$(function () {
  var Rand = Thing.classes.Rand;
  var Img = Thing.classes.Img;

  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'#ffe78b'});

  // menina as a shadow on floor
  var menina = Img.make({
    src:'img/las_meninas_girl_t.png',
    zIndex: 50000,
    opacity: 0.7,
    scale: 1.6,
    x: 1900,
    y: 2400,
    rotate: {x: 90, z: 43}
  });

  var eveLeg = Img.make({
    src: 'img/leg_eve_left_1.png',
    x: 3500,
    y: 1200,
    w: 600,
    zIndex: 50000
  });

  var eveLegShadow = Thing.make({
    background: 'url(img/spot_shadow_2.png) center center / 100% 100% no-repeat',
    x: 3473,
    y: 2721,
    w: 200,
    h: 410,
    opacity: 0.6,
    zIndex: 50000,
    rotate: {x: 90, z: 25}
  });

  var rightWall = Img.make({
    src: 'img/vintagewallpaper4_crop.png',
    w: 2000,
    h: 2000,
    scale: 2.2,
    rotate: {y: 100},
    x: 2500,
    y: 200,
    zIndex: 2000,
    opacity: 0.05
  });

  var lightSpot = Thing.make({
    w: 4150,
    h: 2800,
    background: 'radial-gradient(at 40% 30%, rgba(250, 239, 200, 0.89) 10%, transparent 50%, rgba(124, 72, 82, 0.54) 90%)'
  });

  var backWall = Thing.classes.Box.make({
    w: 4150,
    h: 2800,
    overflow: 'hidden'
  });

  var wallpaper =  Thing.classes.PatternStripes.make({color: 'rgba(196, 191, 138, 0.52)', size: 200});

  // Room edge right side
  var edge = Thing.classes.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    lineWidth: 20,
    zIndex: 10010,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  // makeFloor
  var floorImg = Thing.classes.Img
    .make({
      src:'img/wood_texture_smooth_panel_red_oak_pers_left.png',
      right: '0px',
      bottom: '0px',
      w: pixelWidth,
      h: 800,
      zIndex: 20000
    });

  var meninaSandwich0 = makeMeninaSandwich({x: -500});
  var meninaSandwich1 = makeMeninaSandwich({x:  800});
  var meninaSandwich2 = makeMeninaSandwich({x: 1100});
  var meninaSandwich3 = makeMeninaSandwich({x: 1600});
  var meninaSandwich4 = makeMeninaSandwich({x: 2000});
  var meninaSandwiches = [meninaSandwich0,meninaSandwich1,meninaSandwich2,meninaSandwich3,meninaSandwich4];

  var codeLabel = Thing.classes.Label.make({
    text: 'waiting...',
    x: 2400,
    y: 200,
    w: 1300,
    h: 1500,
    fontSize: '80px',
    color: '#0c3',
    textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
    whiteSpace: 'pre'
  });

  var pos = menina.getPosition();

  // called after images load (renders Background)
  function makeImgPointers () {
    var dim = menina.getDimensions();
    var point = [500, 100];
    var M = Meninas.makeMatrix3D( menina.getCSSTransform() );
    var tp = Meninas.transformPoint(point, M, [dim.w/2, dim.h/2]);

    // point to Menina
    var pointer = Meninas.makeTextArrow(
      Rand.randInt(tp[0]-100, tp[0]+100), Rand.randInt(tp[1]-150, tp[1]-350),
      tp[0], tp[1],
      '#5dff1d', parseInt(tp[0]), 60, pos[2]+5000);
    pointer[1].css({fontSize:'200px', fontWeight: 'bold'});

    // update the code text AFTER render
    var codeText = JSON.stringify(Thing.classes.Rand.randItem(meninaSandwich4.items[1].items).props, null, 4);
    codeLabel.setText( codeText );

    // Arrow with letter
    var meninaPosition = Rand.randItem(meninaSandwiches).getBoundingBox();
    background.add( Meninas.makeBubbleArrow(
            Rand.randInt(100,3000), Rand.randInt(100,500),
            meninaPosition.x+meninaPosition.w/2, meninaPosition.y,
            '#ceff34', Rand.randItem(['A','B','C','D']), false, Rand.randInt(3000,15000)) );

    background.add(pointer);
    background.render();
  }
  Img.onAllLoaded = makeImgPointers;

  window.BG = background;

  Meninas.scaleDocument(1);

  backWall.add(lightSpot);
  backWall.add(meninaSandwich0);
  backWall.add(meninaSandwich1);
  backWall.add(meninaSandwich2);
  backWall.add(meninaSandwich3);
  backWall.add(meninaSandwich4);
  backWall.add(codeLabel);

  background.add(wallpaper);
  background.add(backWall);
  background.add(menina);
  background.add(eveLegShadow);
  background.add(eveLeg);
  background.add(rightWall);
  background.add(edge);
  background.add(floorImg);

  var floor1 = Thing.make({
    w:5000,
    h:3600,
    zIndex:38000,
    transform: 'translate(0px, 1605px) rotateX(85deg)',
    background: 'url(img/wood_texture_smooth_panel_red_oak.jpg) center center / 100% 100% no-repeat',
  });

  var floor2 = Thing.make({
    w:5000,
    h:3600,
    zIndex:40000,
    transform: 'translate(0px, 1600px) rotateX(85deg)',
    backgroundImage: 'linear-gradient(90deg, #f3daac 0.4%, #6a5f4b .8%, #6a5f4b 1.6%, #ffdc8d 2.0%, #f3daac 3%)',
    backgroundSize: '400px 400px',
    opacity: 0.85
  });

  background.add(floor1).add(floor2);

  background.render();
});
