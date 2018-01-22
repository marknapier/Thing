var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.Rand;

function makeLump (props) {
  var imgNames = [
    'birth_of_venus_leg_left.png',
    'leg_eve_left_1.png',
    'leg_durer_right_1.png',
    'rubens_adonis_leg_right.png',
    'rubens_venus_leg_left.png',
  ];
  var imgs = imgNames.map( function (imgName) {
    return Thing.Img.make({
      src: 'img/' + imgName,
      x: Rand.randNormal() * 100,
      y: Rand.randInt(0, 800),
      w: Rand.randInt(500, 1000),
      h: Rand.randInt(500, 2000),
      opacity: 0.1 + (Rand.randFloat()*0.9),
      filter: 'blur(' +(Rand.randPow() * 20.0).toFixed(1)+ 'px)',
    });
  });
  return Thing.Box.make({
    x: 0,
    y: 500,
    w:1000,
    h:1000,
    zIndex: props && props.zIndex
  }).add(imgs);
}

// wrap a room in a div to prevent overflow
function makeWrappedRoom (props) {
  props = $.extend({}, {
    x: 1000,
    y:  120,
    w: 1000,
    h: 2625,
    overflow: 'hidden',
    perspective: 'inherit',    // need to have perspective ON or room will be flat (this assumes that the parent container has a perspective:1000px setting or something similar)
  }, props);

  // outer div
  var wrapper = Thing.Box.make(props);

  // room has same dimensions as wrapper
  var r = Thing.Room.make({
    w: props.w,
    h: props.h,
    d: props.d || 1000,
    showOuter: props.showOuter || false,
  });

  // style the walls
  r.back.css({backgroundColor: '#000'});
  r.right.css({backgroundColor: '#333'});
  r.left.css({backgroundColor: '#333'});
  r.top.css({backgroundColor: '#111'});
  r.bottom.css({backgroundColor: '#222'});

  // put room in the wrapper box
  wrapper.add(r);
  wrapper.room = r;  // expose the room for outside access

  return wrapper;
}

$(function () {
  var aspectRatio = 0.625;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;

  var background = Meninas.makeBackground(pixelWidth, pixelHeight)
    .css({
      backgroundColor:'rgb(60, 47, 70)',
      backgroundImage: 'url(img/clouds_on_light_blue.jpg)',
      backgroundSize: 'cover',
    });

  var lightSpot = Thing.make({
    w: 4150,
    h: 2800,
    background: 'radial-gradient(at 40% 30%, rgba(255, 255, 255, 0.3) 10%, rgba(94, 72, 82, 0.54) 90%)'
  });

  var backWall = Thing.Box.make({
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

  var legRoom = makeWrappedRoom();
  legRoom.room.add(makeLump());
  legRoom.room.rotate({y: -25});

  var corridor = makeWrappedRoom({
    x: 4150,
    y: -993,
    h: 3735,
    w: 850,
    d: 800,
    perspective: '1000px',
    perspectiveOrigin: '-2500px 2300px',  // origin is center of screen
  });
  corridor.room.right.css({backgroundImage: 'radial-gradient(at 60% 60%, rgba(184, 155, 176, 0.3) 10%, rgba(28, 17, 22, 0.46) 90%)'});
  corridor.room.bottom.css({backgroundImage: 'radial-gradient(at 50% 65%, rgba(61, 54, 41, 0.3) 40%, rgba(28, 17, 22, 0.3) 140%)'});

  var rug = Thing.Img.make({
    x: 3764,
    y: 2000,
    z: 1188,
    rotate: {z: 90, y: 90},
    scale: 3,
    src:'img/persian_carpet_fine_red_1.png'
  });

  background.add(backWall);
  background.add(legRoom);
  background.add(corridor);
  background.add(floor);
  background.add(rug);
  background.render();

  // for debugging
  window.BG = background;
});
