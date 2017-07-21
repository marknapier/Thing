var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.classes.Rand;

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

// var florals = [
//   'victorian_roses_on_black.jpg',
//   'pink_and_red_roses_on_white.jpg',
//   'red_on_white_floral_pattern.jpg',
//   'roses_on_beige_pattern.jpg',
// ];

function makePattern (name, size) {
  var Pattern = Thing.classes.Pattern;
  var P =  Pattern.make({pattern: name, size: size});
  var box = Thing.classes.Box.make( {
    x: Rand.randInt(0,1000),
    y: 0,
    w: Rand.randInt(200,1600),
    h: 3000,
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
  var ImgSVG = Thing.classes.ImgSVG;
  var sofaSizes = [100, 160, 225, 280, 350, 500];
  var backgroundMasks = [
    ImgSVG.make({radius: Rand.randInt(500,1000), lineWidth: Rand.randInt(200,600)}).getURL(),
    ImgSVG.make({radius: Rand.randInt(50,1000), lineWidth: Rand.randInt(500,1000)}).getURL(),
    ImgSVG.make({radius: Rand.randInt(1000,1800), lineWidth: Rand.randInt(50,200)}).getURL(),
  ];

  var mWich = Thing.classes.Box.make({
    x: props.x,
    y: 0,
    w: 3000,
    h: 3000,
    rotate: {y: Rand.randInt(-45,45)},
    zIndex: props.zIndex
  });

  var meninaPatterns = Thing.classes.Box.make({
    width: '100%',
    height: '100%',
    backgroundColor: Rand.randItem(greens),
    WebkitMaskImage: Rand.randItem(backgroundMasks),
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: '100%',
    opacity: (0.9 + (Rand.randFloat()*0.1)),   // range from slight transparency to fully opaque
  });

  var patterns = [
    Meninas.makeTextPane(0, 0, Rand.randInt(500,2000), 3000),
    makePattern('GraphPaper', Rand.randInt(2,10) * 100).css({backgroundColor:'none'}),
    makePattern('PlaidRed', Rand.randInt(1,8) * 250),
    makePattern('Sofa', Rand.randItem(sofaSizes)),
    makePattern('PolkaDots', Rand.randInt(20,600)),
    makePattern('Stripes', Rand.randInt(50,500)),
    makePattern('DiagonalStripesViolet', Rand.randInt(60,500)),
  ];

  while (patterns.length) {
    var p = Rand.randItem(patterns);
    patterns.splice(patterns.indexOf(p), 1);
    meninaPatterns.add(p);
  }

  mWich.add(meninaPatterns);

  return mWich;
}

function makeVerticalBar (props) {
  var backgrounds = [
    'url(img/pink_and_red_roses_on_white.jpg) 0 0 / 1000px 2400px',
    'url(img/victorian_roses_on_black.jpg) 0 0 / 1280px 1920px',
    'url(img/victorian_rose_pattern.jpg) 0 0 / 500px 750px',
    'url(img/wood_texture_smooth_panel_red_oak.jpg) 0 0 / 3000px 3125px',
    '#021',
    '#010',
    '#121',
    '#ffa61f',
  ];
  return Thing.make( $.extend({
    x: Rand.randInt(-100,4000),
    y: 0,
    w: Rand.randInt(500,2000),
    h: 3125,
    background: Rand.randItem(backgrounds),
    borderRight: '2px solid #008e00',
  }, props));
}

function makeLump (props) {
  var imgNames = [
    'birth_of_venus_leg_left.png',
    'leg_eve_left_1.png',
    'leg_durer_right_1.png',
    'rubens_adonis_leg_right.png',
    'rubens_venus_leg_left.png',
  ];
  var imgs = imgNames.map( function (imgName) {
    return Thing.classes.Img.make({
      src: 'img/' + imgName,
      x: Rand.randNormal() * 100,
      y: Rand.randInt(0, 800),
      w: Rand.randInt(500, 1000),
      h: Rand.randInt(500, 2000),
      opacity: 0.1 + (Rand.randFloat()*0.9),
      filter: 'blur(' +(Rand.randPow() * 20.0).toFixed(1)+ 'px)',
    });
  });
  return Thing.classes.Box.make({x: Rand.randInt(0,4000), y: 800, w:1000, h:1000, zIndex: props.zIndex}).add(imgs);
}

$(function () {
  // setup the stage
  var aspectRatio = 0.625;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'rgb(255, 47, 90)'});

  var lightSpot = Thing.make({
      w: 4150,
      h: 2800,
      background: 'radial-gradient(at 40% 30%, rgba(250, 239, 200, 0.89) 10%, transparent 50%, rgba(124, 72, 82, 0.54) 90%)'
    });

  var backWall = Thing.classes.Box.make({
    w: 5000,
    h: 2800,
    overflow: 'hidden'
  });

  var wallpaper =  Thing.classes.PatternStripes.make({color: Rand.randItem(greens), size: Rand.randInt(500,5000)});

  // Bleached wood floor
  var floor = Meninas.makeFloorBleached({w:7500, y:1475, rotate:{x:89}});
  //radial-gradient(at 50% 40%, rgb(195, 255, 146) 32%, transparent 35%, rgb(255, 67, 103) 40%)
  //linear-gradient(rgba(255, 252, 195, 0.3) 6%, transparent 35%, rgba(124, 72, 82, 0.6) 60%)

  var circles = [
    makeMeninaSandwich({x: -500, zIndex:Rand.randInt(10000,11000)}),
    makeMeninaSandwich({x:  800, zIndex:Rand.randInt(10000,11000)}),
    makeVerticalBar({zIndex: Rand.randInt(10000,11000)}),
    makeVerticalBar({zIndex: Rand.randInt(10000,11000)}),
    makeVerticalBar({zIndex: Rand.randInt(10000,11000)}),
    makeVerticalBar({zIndex: Rand.randInt(10000,11000)}),
    makeVerticalBar({zIndex: Rand.randInt(10000,11000)}),
    makeVerticalBar({
      zIndex: Rand.randInt(10000,11000),
      w: 50,
      background: '#ffa61f',
      borderLeft: '2px solid mediumvioletred',
      borderRight: '2px solid darkgreen'
    }),
    makeLump({zIndex: 10800}),
    makeMeninaSandwich({x: 1100, zIndex:Rand.randInt(10000,11000)}),
    makeMeninaSandwich({x: 2000, zIndex:Rand.randInt(10000,11000)}),
    makeMeninaSandwich({x: 3000, zIndex:Rand.randInt(10000,11000)}),
  ];

  // $('body').css({overflow: 'scroll'});

  Meninas.scaleDocument(1);

  backWall.add(lightSpot);
  background.add(circles);

  background.add(wallpaper);
  background.add(backWall);
  background.add(floor);

  background.render();

  window.BG = background;
});


/*
//sofa
radial-gradient(hsl(311, 97%, 51%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,     radial-gradient(hsl(169, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50% 50%,     radial-gradient(hsl(349, 100%, 69%) 20%, hsla(0, 100%, 20%, 0)) 50% 0,     radial-gradient(hsla(328, 100%, 91%, 0.83) 20%, hsla(0, 100%, 20%, 0)) 0 50%,     radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) 50% 0,     radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100% 50%,     radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,     radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50% 50%,     linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,     linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0
//polkadots
radial-gradient(rgb(255, 242, 0) 4.8px, transparent 47.8px), radial-gradient(blue 9px, rgb(255, 255, 174) 5.8px, transparent 63.8px)

*/