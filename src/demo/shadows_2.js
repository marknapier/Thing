var Thing = window.Thing;
var Meninas = window.Meninas;
var greens = [
  'rgba(0, 255, 160, 1.0)',   // light aqua
  'rgba(51, 180, 17, 1.0)',   // various shades of green, half opaque, half translucent
  'rgba(51, 180, 17, 0.95)',
  'rgba(0, 128, 0, 1.0)',
  'rgba(0, 128, 0, 0.9)',
  'rgba(0, 164, 0, 1.0)',
  'rgba(0, 164, 0, 0.8)',
  'rgba(0, 120, 0, 1.0)',
  'rgba(0, 120, 0, 0.7)',
  'rgba(137, 190, 0, 1.0)',
  'rgba(137, 190, 0, 0.6)',
  'rgba(0, 128, 16, 1.0)',
  'rgba(0, 128, 16, 0.6)',
  'rgba(60, 240, 0, 1.0)',
  'rgba(60, 240, 0, 0.7)',
  'rgba(68, 224, 0, 1.0)',
  'rgba(68, 224, 0, 0.8)',
  'rgba(50, 200, 0, 1.0)',
  'rgba(50, 200, 0, 0.9)',
  'rgba(0, 55, 33, 1.0)',
  'rgba(0, 55, 33, 0.95)'
];

function makePattern (name, size) {
  var Rand = Thing.Rand;
  var Pattern = Thing.Pattern;
  var P =  Pattern.make({pattern: name, size: size});
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
  var sofaSizes = [100, 160, 225, 280, 350, 500];

  var mWich = Thing.Box.make({
    x: props.x,
    y: 0,
    w: 3000,
    h: 3000,
    zIndex: 10000
  });

  var backgroundMasks = [
    'linear-gradient(0deg, transparent 0%, transparent 25%, #fff 25%, #fff 55%, transparent 55.15%, transparent 85%, #fff 85%)',
    'linear-gradient(45deg, #0e0030 25%, transparent 25.15%, transparent 50%, #0e0030 50.15%, #0e0030 75%, transparent 75.15%, transparent)',
    'radial-gradient(transparent 300px, #fff 300px, #fff 600px, transparent 600px, transparent 900px, #fff 900px, #fff 1200px, transparent 1200px)',
    'radial-gradient(transparent 300px, #fff 300px, #fff 800px, transparent 800px, transparent 850px, #fff 850px, #fff 1400px, transparent 1400px)'
  ];

  var meninaPatterns = Thing.Box.make({
    width: '100%',
    height: '100%',
    backgroundColor: Rand.randItem(greens),
    mask: Rand.randItem(backgroundMasks),
    opacity: (0.9 + (Rand.randFloat()*0.1))   // range from slight transparency to fully opaque
  }).rotate(Rand.randInt(0,7)*45);

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
  var Img = Thing.Img;

  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'#ffe78b'});

  var rightWall = Img.make({
      src: 'img/vintagewallpaper4_crop.png',
      w: 2000,
      h: 2000,
      x: 2500,
      y: 200,
      zIndex: 2000,
      rotate: {y: 100},
      scale: 2.2,
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

  var meninaSandwich0 = makeMeninaSandwich({x: -500});
  var meninaSandwich1 = makeMeninaSandwich({x:  800});
  var meninaSandwich2 = makeMeninaSandwich({x: 1100});
  var meninaSandwich3 = makeMeninaSandwich({x: 1600});
  var meninaSandwich4 = makeMeninaSandwich({x: 2000});

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
  background.add(rightWall);
  background.add(edge);
  background.add(floorImg);

  var floor1 = Thing.make({
    w:5000,
    h:3600,
    zIndex:38000,
    transform: 'translate(-100px, 1605px) rotateX(85deg)',
    background: 'url(img/wood_texture_smooth_panel_red_oak.jpg) center center / 100% 100% no-repeat',
  });

  var floor2 = Thing.make({
    w:5000,
    h:3600,
    zIndex:40000,
    transform: 'translate(-100px, 1600px) rotateX(85deg)',
    backgroundImage: 'linear-gradient(90deg, #f3daac 0.4%, #6a5f4b .8%, #6a5f4b 1.6%, #ffdc8d 2.0%, #f3daac 3%)',
    backgroundSize: '400px 400px',
    opacity: 0.85
  });

  background.add(floor1).add(floor2);
  background.render();
});
