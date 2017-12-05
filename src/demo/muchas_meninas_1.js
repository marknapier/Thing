var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.Rand;
var Img = Thing.Img;

function makePattern (name, size) {
  var Rand = Thing.Rand;
  var Pattern = Thing.Pattern;
  var P =  Pattern.make({pattern: name, size: size, stretch: true});
  var box = Thing.Box.make( {
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
  var Rand = Thing.Rand;
  var Img = Thing.Img;
  var sofaSizes = [100, 160, 225, 280, 350, 500];

  var mWich = Thing.Box.make({
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

  var meninaPatterns = Thing.Box.make({
    width: '100%',
    height: '100%',
    backgroundColor: Rand.randItem(Meninas.greens),
    mask: 'url(img/las_meninas_girl_mask.png)',
    opacity: 0.85
  });

  mWich.add(solidMenina);

  meninaPatterns.add(Meninas.makeTextPane(0, 0, Rand.randInt(100,650), 2000));
  meninaPatterns.add(makePattern('GraphPaper', Rand.randInt(1,8) * 100));
  meninaPatterns.add(makePattern('PlaidRed', Rand.randInt(1,8) * 250));
  meninaPatterns.add(makePattern('Sofa', Rand.randItem(sofaSizes)));
  meninaPatterns.add(makePattern('PolkaDots', Rand.randInt(50,550)));
  meninaPatterns.add(makePattern('Stripes', Rand.randInt(50,400)));
  meninaPatterns.add(makePattern('DiagonalStripesViolet', Rand.randInt(30,400)));
  mWich.add(meninaPatterns);

  return mWich;
}

function makePointer(tgtPoint, z) {
  var pointer = Meninas.makeTextArrow(
    Thing.Rand.randInt(tgtPoint[0] - 100, tgtPoint[0] + 100), 
    Thing.Rand.randInt(tgtPoint[1] - 150, tgtPoint[1] - 350),
    tgtPoint[0],
    tgtPoint[1],
    '#5dff1d', parseInt(tgtPoint[0]), 60, z+5000
  );
  pointer[1].css({fontSize:'200px', fontWeight: 'bold'});

  return pointer;
}

$(function () {
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
    zIndex: 40000,
    scale: 1.8,
    onImgLoaded: (img) => {
      var tgtPoint = Meninas.getPointInThing(img, [500, 100]);
      var pos = img.getPosition();
      background.add(makePointer(tgtPoint, pos[2]));
      background.render();
    },
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

  var backWall = Thing.Box.make({
    w: 4150,
    h: 2800,
    overflow: 'hidden'
  });

  var wallpaper =  Thing.PatternStripes.make({color: 'rgba(196, 191, 138, 0.52)', size: 200});

  // Room edge right side
  var edge = Thing.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    lineWidth: 20,
    zIndex: 10010,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  // makeFloor
  var floorImg = Thing.Img
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

  var codeLabel = Thing.Label.make({
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

  function makeImgCodeLabel () {
    // update the code text AFTER render
    var codeText = JSON.stringify(Thing.Rand.randItem(meninaSandwich4.items[1].items).props, null, 4);
    codeLabel.setText( codeText );
  }

  function makeImgPointers () {
    // Arrow with letter
    var meninaPosition = Rand.randItem(meninaSandwiches).getBoundingBox();
    background.add( Meninas.makeBubbleArrow(
            Rand.randInt(100,3000), Rand.randInt(100,500),
            meninaPosition.x+meninaPosition.w/2, meninaPosition.y,
            '#ceff34', Rand.randItem(['A','B','C','D']), false, Rand.randInt(3000,15000)) );
  }

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

  // called after all images load
  Img.onAllLoaded(makeImgCodeLabel);
  Img.onAllLoaded(makeImgPointers);
  Img.onAllLoaded(() => {background.render();});  // re-render background so changes appear

});
