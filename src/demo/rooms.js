var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.classes.Rand;

var pageParams = Thing.classes.Page.getParams();
var aspectRatio = 0.620;
var CW = pageParams.canvasWidth || 6000;  // canvas width
var CH = CW * aspectRatio;


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
      x: Rand.randNormal() * (CW * 0.025),
      y: Rand.randInt(0, CW * 0.15),
      w: Rand.randInt(CW * 0.1, CW * 0.2),
      h: Rand.randInt(CW * 0.1, CW * 0.3),
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
  var wrapper = Thing.classes.Box.make(props);

  // room has same dimensions as wrapper
  var r = Thing.classes.Room.make({
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

function fillFloor () {
  return Meninas.makeFloorBleached({
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      rotate: {x: 0}
    });
}

$(function () {

  var lightSpot = Thing.make({
    width: '100%',
    height: '100%',
    background: 'radial-gradient(at 40% 30%, rgba(255, 255, 255, 0.3) 10%, rgba(94, 72, 82, 0.54) 90%)'
  });

  var legRoom = makeRoom({
    x: CW * 0.45,
    y: CH * 0.208,
    z: CH * -0.2,
    w: CW * 0.2,
    h: CH * 0.79,
    d: CW * 0.2
  });
  legRoom.add(makeLump());
  legRoom.rotate({y: 25});
  legRoom.bottom.add(Thing.classes.BGImg.make({
    url:'img/persian_carpet_fine_red_1.png'
  }));

  var corridor = makeWrappedRoom({
    x: CW * 0.819,
    y: 0,
    h: CH,
    w: CW * 0.18,
    d: CW * 0.18,
    perspective: '1000px',
    perspectiveOrigin: '-' + (CW / 2) + 'px ' + (CH / 2) + 'px',  // origin is center of screen
  });
  corridor.room.right.css({backgroundImage: 'radial-gradient(at 60% 60%, rgba(184, 155, 176, 0.3) 10%, rgba(28, 17, 22, 0.46) 90%)'});
  corridor.room.bottom.css({backgroundImage: 'radial-gradient(at 50% 65%, rgba(61, 54, 41, 0.3) 40%, rgba(28, 17, 22, 0.3) 140%)'});

  var innerRoom = makeRoom({
    x: CW * 0.2,
    y: CH * 0.295,
    z: CH * -0.2,
    w: CW * 0.15,
    h: CH * 0.7,
    d: CW * 0.1,
    showOuter: true,
  });
  innerRoom.back.css({backgroundColor: 'rgba(0,0,0,.5)'});
  innerRoom.left.css({backgroundColor: 'rgba(255,255,0,.5)'});
  innerRoom.right.css({backgroundColor: 'rgba(0,255,255,1)'});
  innerRoom.top.css({backgroundColor: 'rgba(0,0,255,.5)'});
  innerRoom.bottom.css({backgroundColor: 'rgba(0,255,0,1)'});
  innerRoom.rotate({y:-15});
  innerRoom.bottom.add(fillFloor());
  innerRoom.back.add(lightSpot);

  var mainRoom = makeRoom({
    x: 0,
    y: 0,
    d: CH * 0.9,
    w: CW,
    h: CH,
    perspectiveOrigin: (CW * 0.5) + 'px ' + (CH * 0.75) + 'px',  // origin is center of screen
  });
  mainRoom.back.css({backgroundColor: 'transparent'});
  mainRoom.left.css({backgroundColor: 'rgba(255,255,0,.2)'});
  mainRoom.right.css({backgroundColor: 'rgba(0,255,255,1)'});
  mainRoom.top.css({backgroundColor: 'rgba(0,0,255,.2)'});
  mainRoom.bottom.css({backgroundColor: 'rgba(0,255,0,.2)'});
  mainRoom.bottom.add(fillFloor());
  mainRoom.back.add(corridor);
  mainRoom.add([
    innerRoom,
    legRoom,
  ]);

  var background = Meninas.makeBackground(CW, CH)
    .css({
      backgroundColor:'rgb(60, 47, 70)',
      backgroundImage: 'url(img/clouds_on_light_blue.jpg)',
      backgroundSize: 'cover',
    });
  background.add([
    mainRoom,
  ]);
  background.render();

  Thing.classes.Page.setScale(pageParams.scale || 1);
  Thing.classes.Page.initEvents();

  // for debugging
  window.mainRoom = mainRoom;
  window.BG = background;
});
