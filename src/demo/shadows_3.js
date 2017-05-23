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
  var Rand = Thing.classes.Rand;
  var Pattern = Thing.classes[name] ? Thing.classes[name] : Thing.classes.Pattern;
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

// function makeRadialGradient (props) {
//   let defaultProps = {
//     color: 'rgb(255,255,255)',
//     radius: 100,
//     size: 200,
//   };
//   let _props = $.extend({}, defaultProps, props);
//   return {
//     backgroundImage: _props.backgroundImage || ('radial-gradient(' +_props.color+ ' ' +_props.radius+ 'px, transparent ' +(_props.radius+2)+ 'px)'),
//     backgroundSize: _props.size + 'px ' + _props.size + 'px',
//     backgroundPosition: '' +(_props.size/2)+ 'px ' +(_props.size/2)+ 'px'
//   };
// }

// var radgradCSS = {
//   backgroundImage: 'radial-gradient(rgb(255, 242, 0) 4.8px, transparent 47.8px), radial-gradient(blue 9px, rgb(255, 255, 174) 5.8px, transparent 63.8px)',
//   backgroundSize: '230px, 230px',
//   backgroundPosition: '0px 0px, 115px 115px',
// };

// background-image: radial-gradient(rgb(255, 242, 0) 4.8px, transparent 47.8px, rgb(255, 200, 241) 50px, transparent 60px);
// background-size: 230px 230px;
// background-position: 0px;

// background-image: radial-gradient(rgb(0, 23, 255) 5px, transparent 10px, rgb(255, 200, 241) 60px, rgba(82, 255, 160, 0.98) 62px, transparent 65px);
// background-size: 230px 230px;
// background-position: 115px 115px;

function makeMeninaSandwich(props) {
  var Rand = Thing.classes.Rand;
  var sofaSizes = [5, 10, 12.5, 16.6, 25, 50];
  var backgroundMasks = [
    // 'linear-gradient(0deg, transparent 0%, transparent 15%, rgb(255, 255, 255) 15%, rgb(255, 255, 255) 55%, transparent 55.15%, transparent 65%, rgb(255, 255, 255) 65%, rgb(255,255,255) 90%, transparent 90%)',
    // 'linear-gradient(45deg, #0e0030 25%, transparent 25.15%, transparent 50%, #0e0030 50.15%, #0e0030 75%, transparent 75.15%, transparent)',
    // 'radial-gradient(transparent 300px, #fff 300px, #fff 600px, transparent 600px, transparent 900px, #fff 900px, #fff 1200px, transparent 1200px)',
    // 'radial-gradient(transparent 300px, #fff 300px, #fff 800px, transparent 800px, transparent 850px, #fff 850px, #fff 1400px, transparent 1400px)',
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='4000' height='4000'><circle shape-rendering='geometricPrecision' cx='2000' cy='2000' r='1000' stroke='black' stroke-width='1000' fill='none'/></svg>\")",
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='4000' height='4000'><circle shape-rendering='geometricPrecision' cx='2000' cy='2000' r='1000' stroke='black' stroke-width='1000' fill='none'/></svg>\")"
  ];
    // 'url(img/zebra_print_t.png)'

  var mWich = Thing.classes.Box.make({
    x: props.x,
    y: 0,
    w: 3000,
    h: 3000,
    zIndex: 10000
  });

  var meninaPatterns = Thing.classes.Box.make({
    width: '100%',
    height: '100%',
    backgroundColor: Rand.randItem(greens),
    // WebkitMaskImage: backgroundMasks[3],
    WebkitMaskImage: Rand.randItem(backgroundMasks),
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: '100%',
    opacity: (0.9 + (Rand.randFloat()*0.1)),   // range from slight transparency to fully opaque
    rotate: {z: Rand.randInt(0,7)*45}
  });

  var patterns = [
    Meninas.makeTextPane(0, 0, Rand.randInt(500,2000), 3000),
    makePattern('GraphPaper'),
    makePattern('PlaidRedLarge'),
    makePattern('Sofa', Rand.randItem(sofaSizes)),
    makePattern('PatternPolkaDots', Rand.randInt(10,550)),
    makePattern('PatternStripes', Rand.randInt(50,500)),
    makePattern('DiagonalStripesViolet', Rand.randInt(3,50)),
  ];

  while (patterns.length) {
    var p = Rand.randItem(patterns);
    patterns.splice(patterns.indexOf(p), 1);
    meninaPatterns.add(p);
  }

  mWich.add(meninaPatterns);

  return mWich;
}

$(function () {
  // var Img = Thing.classes.Img;
  var Rand = Thing.classes.Rand;

  // setup the stage
  var aspectRatio = 0.72;
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

  var meninaSandwich0 = makeMeninaSandwich({x: -500}).css({zIndex:Rand.randInt(10000,11000)});
  var meninaSandwich1 = makeMeninaSandwich({x:  800}).css({zIndex:Rand.randInt(10000,11000)});
  var meninaSandwich2 = makeMeninaSandwich({x: 1100}).css({zIndex:Rand.randInt(10000,11000)});
  var meninaSandwich3 = makeMeninaSandwich({x: 2000}).css({zIndex:Rand.randInt(10000,11000)});
  var meninaSandwich4 = makeMeninaSandwich({x: 3000}).css({zIndex:Rand.randInt(10000,11000)});

  Meninas.scaleDocument(1);

  backWall.add(lightSpot);
  backWall.add(meninaSandwich0);
  backWall.add(meninaSandwich1);
  backWall.add(meninaSandwich2);
  backWall.add(meninaSandwich3);
  backWall.add(meninaSandwich4);

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