var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.Rand;

var pageParams = Thing.Page.getParams();
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
    return Thing.Img.make({
      src: 'img/' + imgName,
      x: props.x + (Rand.randNormal() * (props.w * 0.1)),
      y: Rand.randInt(0, props.y),
      w: Rand.randInt(props.w * 0.8, props.w),
      h: Rand.randInt(props.h * 0.8, props.h),
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

function makeRoom (props) {
  var r = Thing.Room.make($.extend({
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

function fillFloor () {
  return Meninas.makeFloorBleached({
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      rotate: {x: 0}
    });
}

function makeLightSpot () {
  return Thing.make({
      width: '100%',
      height: '100%',
      background: 'radial-gradient(at 40% 30%, transparent 10%, rgba(0, 0, 0, 0.3) 90%)'
    });
}

function makeOverlayRoom (props) {
  var R = makeWrappedRoom({
    x: props.x,
    y: CW * -0.2,   // top is out of viewport
    z: CH * 0.1,    // move to the front of mainRoom
    h: CH * 1.3,    // fill to bottom of screen
    w: props.w,
    d: CW * 0.28,
    perspective: (CW * 1.1) + 'px',
    perspectiveOrigin: '-' + (CW * 0.33) + 'px ' + (CW * 0.45) + 'px',
    background: 'url(img/victorian_rose_pattern.jpg) 0 0 / 500px 750px',
  });
  R.room.left.css({backgroundColor: 'rgba(255,255,0,.3)'});
  R.room.right.css({backgroundColor: 'rgba(255,0,0,.3)'});
  R.room.right.add(makeLightSpot());
  R.room.top.css({backgroundColor: 'rgba(0,0,255,.3)'});
  R.room.bottom.css({backgroundColor: 'rgba(0,255,0,.3)'});
  R.room.back.css({backgroundColor: '#112'});
  R.room.rotate({y: 30});
  R.room.add(makeLump({x:200, y: 200, w:500, h: 1000}));
  return R;
}

// x: starting pos
// w: total width to fill
// minW, maxW: min/max width of column
// return array of objects like: {x: 123, w:345}
function makeWidths (props) {
  var columns = [];
  var x = props.x || 0;
  var columnW = 0;
  var remainingW = 0;
  var maxW = props.maxW;

  while (x < props.w) {
    remainingW = props.w - x;
    maxW = remainingW > props.maxW ? props.maxW : remainingW;
    if (remainingW > props.minW) {
      columnW = Rand.randInt(props.minW, maxW);
    }
    else {
      columnW = remainingW;
    }
    columns.push({x: x, w: columnW});
    x += columnW;
  }

  return columns;
}

function makeRandomRooms (props) {
  var rooms = [];
  makeWidths(props).forEach(function (xw) {
    var overlayRoom = makeOverlayRoom({
      x: xw.x,
      w: xw.w,
    });
    overlayRoom.room.rotate({y: Rand.randInt(-90, 90)});
    overlayRoom.css({borderLeft: '5px solid red'});
    rooms.push(overlayRoom);
  });
  return rooms;
}

$(function () {
  var corridor = makeWrappedRoom({
    x: CW * 0.819,
    y: 0,
    h: CH,
    w: CW * 0.18,
    d: CW * 0.18,
    perspective: (CW/6) + 'px',
    perspectiveOrigin: '-' + (CW / 2) + 'px ' + (CH / 2) + 'px',
  });
  corridor.room.right.css({backgroundImage: 'radial-gradient(at 60% 60%, rgba(184, 155, 176, 0.3) 10%, rgba(28, 17, 22, 0.46) 90%)'});
  corridor.room.bottom.css({backgroundImage: 'radial-gradient(at 50% 65%, rgba(61, 54, 41, 0.3) 40%, rgba(28, 17, 22, 0.3) 140%)'});

  var overlayRoom = makeOverlayRoom({
    x: CW * 0.2,
    w: Rand.randInt(CW * 0.10, CW * 0.20),
  });
  overlayRoom.room.rotate({y: Rand.randInt(-70, 30)});

  var overlayRoom2 = makeOverlayRoom({
    x: CW * 0.4,
    w: Rand.randInt(CW * 0.10, CW * 0.20),
  });
  overlayRoom.room.rotate({y: Rand.randInt(-70, 30)});

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
    overlayRoom,
    overlayRoom2,
    makeLump({
        x: 2000, //CW * 0.65,
        y: CW * 0.20,
        w: CW * 0.2,
        h: CW * 0.3,
    }),
  ]);

  var background = Meninas.makeBackground(CW, CH)
    .css({
      backgroundColor:'rgb(60, 47, 70)',
      backgroundImage: 'url(img/clouds_on_light_blue.jpg)',
      backgroundSize: 'cover',
    });
  background.add([
    mainRoom,
    makeRandomRooms({x: CW*0.3, w: CW*0.65, h: CH, minW: CW/15, maxW: CW/2}),
  ]);
  background.render();

  Thing.Page.setScale(pageParams.scale || 1);
  Thing.Page.initEvents();

  // for debugging
  window.BG = background;
});
