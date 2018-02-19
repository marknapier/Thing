var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.Rand;

var pageParams = Thing.Page.getParams();
var aspectRatio = 0.620;
var CW = pageParams.canvasWidth || 6000;  // canvas width   1.618  0.618
var CH = CW * aspectRatio;
var legImages = [
  'birth_of_venus_leg_left.png',
  'leg_eve_left_1.png',
  'leg_durer_right_1.png',
  'rubens_adonis_leg_right.png',
  'rubens_venus_leg_left.png',
];

function makeLump (props = {x: 0, y: 0, w: 500, h: 1000}) {
  var imgNames = props.imageNames;
  var imgs = imgNames.map( function (imgName) {
    return Thing.Img.make({
      src: 'img/' + imgName,
      x: Rand.randNormal() * (props.w * 0.25),
      y: Rand.randInt(0, props.h * 0.2),
      w: Rand.randInt(props.w * 0.5, props.w * 0.8),
      h: Rand.randInt(props.h * 0.5, props.h * 0.8),
      opacity: 0.4 + (Rand.randFloat()*0.7),
      filter: 'blur(' +(Rand.randPow() * 20.0).toFixed(1)+ 'px)',
      // mixBlendMode: Thing.Rand.randItem(['overlay', 'overlay', 'normal', 'difference', 'color-burn']),
      mixBlendMode: Thing.Rand.randItem(['overlay', 'difference', 'color-burn', 'color-burn', 'color-burn', 'color-dodge', 'normal', 'normal', 'hard-light']),
    });
  });

  return Thing.Box.make({
    x: props.x,
    y: props.y,
    w: 1000,
    h: 2500,
    zIndex: props && props.zIndex
  }).add(imgs);
}

function makeMaskedLump() {
  return makeLump({
    x: 0,
    y: CH * 0.29,
    w: CW * 0.2,
    h: CH -(CH * 0.135),
    imageNames: legImages,
  }).addMask({
    image: 'url(img/' + Thing.Rand.randItem(legImages) + ')',
    size: '100% 100%',
  });
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
// function makeWrappedRoom (props) {
//   props = $.extend({}, {
//     x: 1000,
//     y:  120,
//     w: 1000,
//     h: 2625,
//     overflow: 'hidden',
//     perspective: 'inherit',    // need to have perspective ON or room will be flat (this assumes that the parent container has a perspective:1000px setting or something similar)
//   }, props);

//   // outer div
//   var wrapper = Thing.Box.make(props);

//   // room has same dimensions as wrapper
//   var r = Thing.Room.make({
//     w: props.w,
//     h: props.h,
//     d: props.d || 1000,
//     showOuter: props.showOuter || false,
//   });

//   // style the walls
//   r.back.css({backgroundColor: '#000'});
//   r.right.css({backgroundColor: '#333'});
//   r.left.css({backgroundColor: '#333'});
//   r.top.css({backgroundColor: '#111'});
//   r.bottom.css({backgroundColor: '#222'});

//   // put room in the wrapper box
//   wrapper.add(r);
//   wrapper.room = r;  // expose the room for outside access

//   return wrapper;
// }

function fillFloor () {
  return Meninas.makeFloorBleached({
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      rotate: {x: 0}
    });
}

var transparentPatterns = [
  {pattern: 'Grid', size: Rand.randInt(1,8) * 20, stretch: true},
  {pattern: 'PolkaDots', size: Rand.randInt(50,550), stretch: true},
  {pattern: 'Stripes', size: Rand.randInt(20,100), stretch: true},
  {pattern: 'DiagonalStripesViolet', size: Rand.randInt(30,400), stretch: true},
];

function randomPattern (patterns) {
  var P = Thing.Pattern.make(Thing.Rand.randItem(patterns));
  return P;
}

function makeLightSpot () {
  return Thing.make({
    width: '100%',
    height: '100%',
    background: 'radial-gradient(at 40% 30%, rgba(255, 255, 255, 0.3) 10%, rgba(94, 72, 82, 0.54) 90%)'
  });
}

function makeWireRoom(props) {
  var room = makeRoom({
    x: props.x,
    y: props.y,
    z: props.z,
    w: props.w,
    h: props.h,
    d: props.d,
    showOuter: true
  });

  room.top.css({backgroundColor: 'transparent'});
  room.bottom.css({backgroundColor: 'transparent'});
  room.back.css({backgroundColor: 'transparent'});
  room.left.css({backgroundColor: 'transparent'});
  room.right.css({backgroundColor: 'transparent'});

  room.outtop.css({backgroundColor: 'transparent'});
  room.outbottom.css({backgroundColor: 'transparent'});
  room.outback.css({backgroundColor: 'transparent'});
  room.outleft.css({backgroundColor: 'transparent'});
  room.outright.css({backgroundColor: 'transparent'});
  room.outfront.css({backgroundColor: 'transparent'});

  addWire(room);

  return room;
}

function addWire(room) {
  var borderCSS = {border: (CW*0.0016) + 'px solid #0c0'};
  room.back.css(borderCSS);
  room.left.css(borderCSS);
  room.right.css(borderCSS);
  room.outback.css(borderCSS);
  room.outleft.css(borderCSS);
  room.outright.css(borderCSS);
  room.outfront.css(borderCSS);
  return room;
}

function makePlane(props = {x:0, y:0, w:1200, h: 3200}) {
  return Thing.Box.make({
    x: props.x || 0,
    y: props.y || 0,
    w: props.w || 1200,
    h: props.h || CH,
    perspective: '4000px',
  })
  .add(Thing.BGImg.make({
    url: 'url(img/wood-panel-texture-oak.jpg)',
    size: '100% 100%',
  }));
}

function makeWireFrameRoom() {
  var wireframeRoom = makeWireRoom({
      x: CW * 0.3,
      y: CH * 0.0215,
      z: 0,
      w: CW * 0.08,
      h: CH * 0.959,
      d: CW * 0.1,
    });
    wireframeRoom.add(makeMaskedLump().css(Thing.Pattern.makeSofaPatternCSS()));
    wireframeRoom.back.add(randomPattern(transparentPatterns));
    wireframeRoom.left.add(randomPattern(transparentPatterns));
    wireframeRoom.right.add(randomPattern(transparentPatterns));
    wireframeRoom.outright.add(randomPattern(transparentPatterns));
    wireframeRoom.outfront.add(randomPattern(transparentPatterns));
    return wireframeRoom;
}

$(function () {
  var legRoom = makeRoom({
    x: CW * 0.85,
    y: CH * 0.0215,
    z: 0,
    w: CW * 0.2,
    h: CH * 0.959,
    d: CW * 0.1,
    showOuter: true,
  });
  legRoom.add(makeMaskedLump());

  var innerRoom = makeRoom({
    x: CW * 0.5,
    y: CH * 0.0215,
    z: 0,
    w: CW * 0.15,
    h: CH * 0.959,
    d: CW * 0.1,
    showOuter: true,
  });
  innerRoom.add(makeMaskedLump());
  innerRoom.back.css({backgroundColor: 'rgba(0,0,0,.5)'});
  innerRoom.left.css({background: 'url(img/victorian_rose_pattern.jpg) 0px 0px / 500px 750px'});
  innerRoom.left.add(makeLightSpot());
  innerRoom.right.css({backgroundColor: 'rgba(0,255,255,1)'});
  innerRoom.top.css({backgroundColor: 'rgba(0,0,255,.5)'});
  innerRoom.bottom.css({backgroundColor: 'rgba(0,255,0,1)'});
  innerRoom.bottom.add(fillFloor());
  innerRoom.back.css({background: 'url(img/victorian_rose_pattern.jpg) 0px 0px / 500px 750px'});
  innerRoom.back.add(makeLightSpot());

  var wireframeRoom = makeWireFrameRoom();

  var wireframeRoom2 = makeWireRoom({
    x: 0,
    y: 0,
    z: 0,
    w: CW * 0.079,
    h: CH * 0.950,
    d: CW * 0.1,
  });

  var plane1 = makePlane({x: 0, w: 1200});
  plane1.add(makeWireRoom({
    x: 0,
    y: -CH * 0.2,
    z: 0,
    w: CW * 0.2,
    h: CH * 1.2,
    d: CW * 0.1,
  }));

  var plane2 = makePlane({x: 4800, w: 1200});
  plane2.add(makeLump({
    x: 0,
    y: CH * 0.29,
    w: CW * 0.2,
    h: CH -(CH * 0.135),
    imageNames: legImages,
  }));

  var couch = Thing.Img.make({
    src: 'img/sofa_leather_overstuffed_t.png',
    x: 2000,
    y: 2000,
  });

  var mainRoom = makeRoom({
    x: -CW * 0.22,
    y: 0,
    d: CH * 0.9,
    w: CW * 1.44,
    h: CH,
    perspectiveOrigin: (CW * 0.5) + 'px ' + (CH * 0.75) + 'px',  // origin is center of screen
  });
  mainRoom.back.css({backgroundColor: 'transparent'});
  mainRoom.left.css({backgroundColor: 'transparent'});
  mainRoom.right.css({backgroundColor: 'transparent'});
  mainRoom.top.css({backgroundColor: 'transparent'});
  mainRoom.bottom.css({backgroundColor: 'rgba(0,255,0,.2)'});
  mainRoom.bottom.add(fillFloor());
  mainRoom.add([
    innerRoom,
    legRoom.add(wireframeRoom2),
    wireframeRoom,
    couch,
  ]);

  Meninas.makeBackground(CW, CH)
    .css({
      backgroundColor:'rgb(60, 47, 70)',
      backgroundImage: 'url(img/clouds_on_light_blue.jpg)',
      backgroundSize: 'cover',
      perspective: '7000px',
    })
    .add(mainRoom)
    .add(plane1)
    .add(plane2)
    .render();

  Thing.Page.setup();
});