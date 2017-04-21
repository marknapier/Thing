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
    z: Rand.randInt(1,1000) * 10,
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
  var Img = Thing.classes.Img;
  var sofaSizes = [5, 10, 12.5, 16.6, 25, 50];

  var mWich = Thing.classes.Box.make({
    x: props.x,
    y: 1030,
    w: 1300,
    h: 1770,
    zIndex: 10000
  });

  var solidMenina = Img.make({
    src:'img/las_meninas_girl_mask.png',
    w: 1300,
    h: 1770,
    filter: 'drop-shadow(10px 10px 20px rgba(0,0,0,0.7))'
  }).scaleTo(1.01);

  var meninaPatterns = Thing.classes.Box.make({
    width: '100%',
    height: '100%',
    backgroundColor: Rand.randItem(Meninas.greens),
    WebkitMaskImage: 'url(img/las_meninas_girl_mask.png)',   // 846 X 1150     .735
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: '100%',
    opacity: 0.85
  });

  mWich.add(solidMenina);

  meninaPatterns.add(Meninas.makeTextPane(0, 0, Rand.randInt(100,650), 2000));
  meninaPatterns.add(makePattern('GraphPaper'));
  meninaPatterns.add(makePattern('PlaidRedLarge'));
  meninaPatterns.add(makePattern('Sofa', Rand.randItem(sofaSizes)));
  meninaPatterns.add(makePattern('PatternPolkaDots', Rand.randInt(10,250)));
  meninaPatterns.add(makePattern('PatternStripes', Rand.randInt(50,300)));
  meninaPatterns.add(makePattern('DiagonalStripesViolet', Rand.randInt(3,20)));
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

  var menina = Img.make({
    src:'img/las_meninas_girl_t.png',
    x: 1100,
    y: 1700,
    zIndex: 40000
  }).scaleTo(1.8);

  var rightWall = Img.make({
      src: 'img/vintagewallpaper4_crop.png',
      w: 2000,
      h: 2000,
      z: 2000,
      opacity: 0.05
    })
    .css({
      transform: 'translate(2500px, 200px) rotateY(100deg) scale(2.2)'
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
    width: 20,
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

  var meninaSandwich1 = makeMeninaSandwich({x: -200});
  var meninaSandwich2 = makeMeninaSandwich({x: 1100});
  var meninaSandwich3 = makeMeninaSandwich({x: 2400});
  var meninaSandwich4 = makeMeninaSandwich({x: 3700});
  var meninaSandwiches = [meninaSandwich1,meninaSandwich2,meninaSandwich3,meninaSandwich4];

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
    var M = Meninas.makeMatrix2D( menina.getCSSTransform() );
    var tp = Meninas.transformPoint(point, M, [dim.w/2, dim.h/2]);

    // point to Menina
    var pointer = Meninas.makeTextArrow(
      Rand.randInt(tp[0]-100, tp[0]+100), Rand.randInt(tp[1]-150, tp[1]-350),
      tp[0], tp[1],
      '#5dff1d', parseInt(tp[0]), 60, pos[2]+5000);
    pointer[1].css({fontSize:'200px', fontWeight: 'bold'});

    // update the code text AFTER render
    // var codeText = Meninas.makeMatrix2D(meninaSandwich4.getCSSTransform()).inspect();
    // var codeText = Thing.classes.Rand.randItem(meninaSandwich4.items[1].items).items[0].$element.css('background-image');
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
  backWall.add(meninaSandwich1);
  backWall.add(meninaSandwich2);
  backWall.add(meninaSandwich3);
  backWall.add(meninaSandwich4);
  backWall.add(codeLabel);

  background.add(wallpaper);
  background.add(backWall);
  background.add(menina);
  background.add(rightWall);
  background.add(edge);
  background.add(floorImg);

  background.render();

});
