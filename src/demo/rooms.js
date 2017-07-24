var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.classes.Rand;

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
  return Thing.classes.Box.make({
    x: 0,
    y: 500,
    w:1000,
    h:1000,
    zIndex: props && props.zIndex
  }).add(imgs);
}

function makeRoom (props) {
  var r = Thing.classes.Room.make($.extend({
    x: 1000,
    y:  120,
    w: 1000,
    h: 2625,
    d: 1000,
    showOuter: false,
    overflow: 'hidden'
  }, props));

  r.back.css({backgroundColor: '#000'});
  r.right.css({backgroundColor: '#333'});
  r.left.css({backgroundColor: '#333'});
  r.top.css({backgroundColor: '#111'});
  r.bottom.css({backgroundColor: '#222'});
  return r;
}

$(function () {
  var aspectRatio = 0.620;
  var pixelWidth = 3000;
  var pixelHeight = pixelWidth * aspectRatio;

  var lightSpot = Thing.make({
    w: 4150,
    h: 2800,
    background: 'radial-gradient(at 40% 30%, rgba(255, 255, 255, 0.3) 10%, rgba(94, 72, 82, 0.54) 90%)'
  });

  var backWall = Thing.classes.Box.make({
    background: 'linear-gradient(90deg, rgba(255, 244, 156, 0.3) 4px, transparent 4px)',
    backgroundSize: '8px',
    w: 5000,
    h: 2800,
    overflow: 'hidden',
  });
  backWall.add(lightSpot);

  var floor = Meninas.makeFloorBleached({
    w: 7500,
    y: 1475,
    rotate:{x: 90}
  });

  var legRoom = makeRoom({
    x: 0,
    y: 0,
    w: pixelWidth,
    h: pixelHeight
  });

  legRoom.add(makeLump());
  legRoom.rotate({y: -25});

  var corridor = makeRoom({
    x: 4150,
    y: -993,
    h: 3735,
    w: 850,
    d: 800,
    perspective: '1000px',
    perspectiveOrigin: '-2500px 2300px',  // origin is center of screen
  });
  corridor.right.css({backgroundImage: 'radial-gradient(at 60% 60%, rgba(184, 155, 176, 0.3) 10%, rgba(28, 17, 22, 0.46) 90%)'});
  corridor.bottom.css({backgroundImage: 'radial-gradient(at 50% 65%, rgba(61, 54, 41, 0.3) 40%, rgba(28, 17, 22, 0.3) 140%)'});

  var anotherRoom = makeRoom({
    x: 300,
    y: 0,
    h: pixelHeight,
    w: 850,
    d: 800
  });
  anotherRoom.right.css({backgroundColor: 'red'});
  anotherRoom.bottom.css({backgroundColor: 'blue'});

  var rug = Thing.classes.Img.make({
    x: 3764,
    y: 2000,
    z: 1188,
    rotate: {z: 90, y: 90},
    scale: 3,
    src:'img/persian_carpet_fine_red_1.png'
  });

  var mainRoom = makeRoom({
    x: 0,
    y: 0,
    w: pixelWidth,
    h: pixelHeight,
    perspectiveOrigin: (pixelWidth * 0.5) + 'px ' + (pixelHeight * 0.75) + 'px',  // origin is center of screen
  });
  mainRoom.back.css({backgroundColor: 'rgba(0,0,0,.6)'});
  mainRoom.left.css({backgroundColor: 'rgba(255,255,0,.2)'});
  mainRoom.right.css({backgroundColor: 'rgba(0,255,255,1)'});
  mainRoom.top.css({backgroundColor: 'rgba(0,0,255,.2)'});
  mainRoom.bottom.css({backgroundColor: 'rgba(0,255,0,.2)'});

  var innerRoom = makeRoom({
    x: pixelWidth * 0.2,
    y: 0,
    w: pixelWidth/3,
    h: pixelHeight,
    showOuter: true,
  });
  innerRoom.back.css({backgroundColor: 'rgba(0,0,0,.5)'});
  innerRoom.left.css({backgroundColor: 'rgba(255,255,0,.5)'});
  innerRoom.right.css({backgroundColor: 'rgba(0,255,255,1)'});
  innerRoom.top.css({backgroundColor: 'rgba(0,0,255,.5)'});
  innerRoom.bottom.css({backgroundColor: 'rgba(0,255,0,1)'});
  innerRoom.rotate({y:-15});
  innerRoom.bottom.add(rug);

  mainRoom.add([
    innerRoom,
  ]);

  var background = Meninas.makeBackground(pixelWidth, pixelHeight)
    .css({
      backgroundColor:'rgb(60, 47, 70)',
      backgroundImage: 'url(img/clouds_on_light_blue.jpg)',
      backgroundSize: 'cover',
    });

  background.add([
    mainRoom,
    // backWall,
    // mainRoom,
    // innerRoom,
    // legRoom,
    // corridor,
    // anotherRoom,
    // floor,
    // rug,
  ]);

  // background.add( mainRoom.wallsA );
  background.render();

  Thing.classes.Page.initEvents();

  // for debugging
  window.mainRoom = mainRoom;
  window.BG = background;
});
