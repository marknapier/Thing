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
  var r = Thing.classes.Room.make({
    x: 1000,
    y:   86,
    w: 1000,
    h: 2625,
    d: 1000,
    zIndex: (props && props.zIndex) || 15000,
    showOuter: false,
    overflow: 'hidden'
  });
  r.back.css({backgroundColor: '#000'});
  r.right.css({backgroundColor: '#333'});
  r.left.css({backgroundColor: '#333'});
  r.top.css({backgroundColor: '#111'});
  r.bottom.css({backgroundColor: '#222'});
  return r;
}

$(function () {
  var aspectRatio = 0.625;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'rgb(60, 47, 70)'});

  var lightSpot = Thing.make({
    w: 4150,
    h: 2800,
    background: 'radial-gradient(at 40% 30%, rgba(255, 255, 255, 0.3) 10%, rgba(94, 72, 82, 0.54) 90%)'
  });

  var backWall = Thing.classes.Box.make({
    w: 5000,
    h: 2800,
    overflow: 'hidden'
  });

  var floor = Meninas.makeFloorBleached({
    w: 7500, 
    y: 1475, 
    rotate:{x: 89}
  });

  var room = makeRoom();

  room.room.add(makeLump());
  room.room.rotate({y: -25});

  backWall.add(lightSpot);

  background.add(backWall);
  background.add(floor);
  background.add(room);

  background.render();

  window.room = room;

  window.BG = background;
});
