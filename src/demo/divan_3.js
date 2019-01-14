var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.Rand;

var pageParams = Thing.Page.getParams();
var aspectRatio = 0.620;
var idealCanvasWidth = 6000;
var CW = pageParams.canvasWidth || idealCanvasWidth;
var CH = CW * aspectRatio;

var plantNamesSmall = [
  'aquarium_flowering_t.png',
  'aquarium_plastic_leaves_t.png',
  'low_philo_mixed_t.png',
];

function makeFigure (props = {z: 150}) {
  var borderWidth = CW * 0.0015;
  var torso = Thing.Img.make($.extend({
    x: props.x,
    y: props.y,
    z: props.z,
    rotate: {z: 30},
    src: 'img/Titian_Venus_of_Urbino_torso_t.png',
    border: borderWidth + 'px dashed #0f0',
  }, props));
  var head = Thing.Img.make({
    x: 300,
    y: -300,
    rotate: {z: 15},
    src: 'img/Titian_Venus_of_Urbino_head_t.png',
    border: borderWidth + 'px dashed #cf0',
    transformOrigin: '90% 90%',
  });
  var legs = Thing.Img.make({
    x: 1050,
    y: 350,
    rotate: {z: -30},
    src: 'img/Titian_Venus_of_Urbino_legs_t.png',
    border: borderWidth + 'px dashed #3f9',
    transformOrigin: '5% 25%',
  });
  var headdot = Thing.make({w: 20, h: 20, x: 406 * 0.9, y: 433 * 0.9, backgroundColor: 'blue'});
  var legsdot = Thing.make({w: 20, h: 20, x: 1736 * 0.05, y: 540 * 0.25, backgroundColor: 'blue'});

  head.$element.append(headdot.$element);
  legs.$element.append(legsdot.$element);
  torso.$element.append(head.$element);
  torso.$element.append(legs.$element);

  return torso;  // 530 1300
}

var thigh = null;
var calf = null;
var foot = null;

function makeFigure3 (props = {x: 0, y: 0, z: 0, scale: 1}) {
  var S = props.scale || 1.0;
  var borderWidth = 10 * S; //CW * 0.0015;

  var torso = makeAttachable({
    thing: Thing.Img.make({
      id: 'torso',
      x: props.x,
      y: props.y,
      z: props.z,
      w: 482 * S,
      src: 'img/Titian_Venus_of_Urbino_torso_t_vert.png',
      border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-60, 60)},
      cursor: 'pointer',
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: (300/3) * S, y: (100/2) * S},
    attachPoints: {
      hipRight: {x: 100 * S, y: 860 * S},
      hipLeft: {x: 400 * S, y: 860 * S},
      neck: {x: 400 * S, y: 140 * S},
      armRight: {x: 100 * S, y: 120 * S},
      armLeft: {x: 500 * S, y: 230 * S},
    },
  });

  var head = makeAttachable({
    thing: Thing.Img.make({
      w: 375 * S,
      src: 'img/Titian_Venus_of_Urbino_head_t_vert.png',
      rotate: {z: Rand.randInt(-20, 40)},
      zIndex: 10,
    }),
    origin: {x: 200 * S, y: 460 * S},
    attachPoints: {},
  });

  var upperarmRight = makeAttachable({
    thing: Thing.Img.make({
      w: 160 * S,
      src: 'img/botticelli_venus_upperarm_right.png',
      // border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-120, 130)},
      zIndex: 30,
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 90 * S, y: 50 * S},
    attachPoints: {
      elbow: {x: 40 * S, y: 460 * S}
    },
  });

  var forearmRight = makeAttachable({
    thing: Thing.Img.make({
      w: 200 * S,
      src: 'img/botticelli_venus_forearm_right.png',
      // border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-160, 0)},
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 120 * S, y: 50 * S},
    attachPoints: {
      // knee: {x: 175 * S, y: 740 * S}
    },
  });

  var upperarmLeft = makeAttachable({
    thing: Thing.Img.make({
      w: 150 * S,
      src: 'img/botticelli_venus_upperarm_left.png',
      // border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-120, 130)},
      zIndex: 30,
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 80 * S, y: 50 * S},
    attachPoints: {
      elbow: {x: 110 * S, y: 460 * S}
    },
  });

  var forearmLeft = makeAttachable({
    thing: Thing.Img.make({
      w: 240 * S,
      src: 'img/Titian_Venus_of_Urbino_forearm_left.png',
      // border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(0, 160)},
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 120 * S, y: 50 * S},
    attachPoints: {
      // knee: {x: 175 * S, y: 740 * S}
    },
  });

  var thighRight = makeAttachable({
    thing: Thing.Img.make({
      w: 301 * S,
      src: 'img/Titian_Venus_of_Urbino_thigh_right_t.png',
      border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-25, 25)},
      zIndex: 5,  // pull it forward over left thigh
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 115 * S, y: 120 * S},
    attachPoints: {
      knee: {x: 175 * S, y: 740 * S}
    },
  });
  thigh = thighRight;

  var thighLeft = makeAttachable({
    thing: Thing.Img.make({
      w: 301 * S,
      src: 'img/Titian_Venus_of_Urbino_thigh_left_t.png',
      border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-25, 25)},
      zIndex: 1,
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 190 * S, y: 120 * S},
    attachPoints: {
      knee: {x: 150 * S, y: 740 * S}
    },
  });

  var calfRight = makeAttachable({
    thing: Thing.Img.make({
      w: 192 * S,
      src: 'img/Titian_Venus_of_Urbino_calf_right_t.png',
      border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(5, -90)},
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 60 * S, y: 55 * S},
    attachPoints: {
      ankle: {x: 85 * S, y: 600 * S}
    },
  });

  calf = calfRight;

  var calfLeft = makeAttachable({
    thing: Thing.Img.make({
      w: 192 * S,
      src: 'img/botticelli_venus_calf_left.png',
      // border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(5, -90)},
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 60 * S, y: 55 * S},
    attachPoints: {
      ankle: {x: 85 * S, y: 600 * S}
    },
  });

  var footRight = makeAttachable({
    thing: Thing.Img.make({
      w: 352 * S,
      src: 'img/Titian_Venus_of_Urbino_foot_right_t.png',
      border: borderWidth + 'px dashed #f39',
      rotate: {z: Rand.randInt(-40, 20)},
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 280 * S, y: 24 * S},
    attachPoints: {},
  });

  foot = footRight;

  upperarmRight.attach(forearmRight, 'elbow');
  upperarmLeft.attach(forearmLeft, 'elbow');
  thighRight.attach(calfRight, 'knee');
  thighLeft.attach(calfLeft, 'knee');
  calfRight.attach(footRight, 'ankle');
  torso.attach(head, 'neck');
  torso.attach(upperarmLeft, 'armLeft');
  torso.attach(upperarmRight, 'armRight');
  torso.attach(thighRight, 'hipRight');
  torso.attach(thighLeft, 'hipLeft');

  return torso;
}

// Add an attach() function to a thing so it can be connected to other attachable things.
// An 'attachable' thing has:
//     1 origin per piece (required) aka the pivot point
//     N attachPoints (optional)
// The thing will rotate around origin. Other attachables can be connected to attachment points.
function makeAttachable (props = {}) {
  var defaultProps = {
    thing: null,
    origin: {x: 0, y: 0},
    borderWidth: 0,
    attachPoints: {},
  };
  props = $.extend(defaultProps, props);

  var attachPoints = props.attachPoints;
  var origin = {x: props.origin.x + props.borderWidth, y: props.origin.y + props.borderWidth};
  var thing = props.thing;

  // put marker at rotation point
  var dotO = Thing.make({
    w: 20,
    h: 20,
    x: (origin.x-props.borderWidth) - (20/2),
    y: (origin.y-props.borderWidth) - (20/2),
    backgroundColor: 'green',
    borderRadius: '20px',
  });
  thing.$element.append(dotO.$element);

  // put markers at attachment points
  Object.entries(attachPoints).forEach(([name, point]) => {
    let dotA = Thing.make({
      w: 20,
      h: 20,
      x: point.x - (20/2),
      y: point.y - (20/2),
      backgroundColor: 'gray',
    });
    thing.$element.append(dotA.$element);
  });

  // set the pivot point
  thing.css({transformOrigin: origin.x + 'px ' + origin.y + 'px'});

  // add function to thing
  thing.attach = function (newPiece, pointName) {
    var point = attachPoints[pointName];
    thing.$element.append(newPiece.$element);
    newPiece.translate(point.x - newPiece.origin.x, point.y - newPiece.origin.y);
    newPiece.parent = thing;
  };

  // expose the origin point
  thing.origin = origin;

  return thing;
}

function makePlants () {
  function randX () {
    return Rand.randInt(CW*0.2, CW*0.7);
  }

  function randXsmall () {
    return Rand.randInt(CW*0.01, CW*0.4);
  }

  function randZ () {
    return Rand.randInt(2, 9);
  }

  function randW () {
    return Rand.randInt(CW*0.2, CW*0.35);
  }

  function randWsmall () {
    return Rand.randInt(CW*0.1, CW*0.25);
  }

  function randNameSmall () {
    return 'img/' + Rand.randItem(plantNamesSmall);
  }

  var bottom = CW * 0.07;
  var bottomSmall = CW * -0.015;

  var plants = [
    // Thing.Img.make({src:'img/double-palm-silk-tree_t.png', x: randX(), z: randZ(), w: randW() + 200, bottom: bottom+'px'}),
    Thing.Img.make({src:'img/BananaPalm_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.Img.make({src:'img/banana_tree_2_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    // Thing.Img.make({src:'img/dracaena-marginata-potted_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.Img.make({src:'img/rubber_tree_potted_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    // //
    // Thing.Img.make({src:'img/double-palm-silk-tree_t.png', x: randX(), z: randZ(), w: randW() + 200, bottom: bottom+'px'}),
    Thing.Img.make({src:'img/BananaPalm_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.Img.make({src:'img/banana_tree_2_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    // Thing.Img.make({src:'img/dracaena-marginata-potted_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.Img.make({src:'img/rubber_tree_potted_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    //
    Thing.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
  ];
  return plants;
}

function makeCouch (props = {z: 100}) {
  var i = Thing.Img.make($.extend({
      src:'img/sofa_3_victorian_sofa_t.png',
      x: CW * 0.1,
      y: CW * 0.3766,
      z: props.z,
      w: CW * 0.466,
      // filter: 'drop-shadow(10px 10px 19px rgba(0,0,0,0.7))'
    }, props));
  return i;
}

function makeDoor(props = {position: 'left', wall:{}}) {
  var d = Thing.Img.make($.extend({
    src:'img/white_door.png',
    x: props.wall.w * (props.position === 'center' ? 0.1 : 0.3),
    y: props.wall.h * 0.3,
    h: props.wall.h * 0.7,
    cursor: 'pointer',
  }, props));
  d.$element.on('click', function () {
    XX += (props.position === 'left') ? -1 : (props.position === 'right' ? 1 : 0);
    YY += (props.position === 'center') ? 1 : 0;
    regenerate(XX, YY);
  });
  return d;
}

function makeSurface (props = {w:2500, h:2500}) {
  var container = Thing.Box.make({
    w: props.w,
    h: props.h,
    backgroundColor: 'rgb(255, 228, 126)',
  });

  var wallpaper =  Thing.PatternStripes.make({
    color: 'rgba(196, 191, 138, 0.52)',
    size: props.w * 0.033
  });

  // var textureImg = Thing.BGImg.make({
  //   src: 'img/vintagewallpaper4_crop_cutout_1.png',
  //   size: '30% 50%',
  //   repeat: true,
  //   opacity: 0.1,
  // });

  var textureImg = Thing.make({
    w: props.w,
    h: props.h,
    backgroundColor: 'rgba(255, 136, 0, 0.06)',
    // mask: {
    //   image: 'url(img/vintagewallpaper4_crop_cutout_1.png)',
    //   size: '50% 80%',
    //   repeat: 'repeat',
    //   position: '0 0',
    // },
  });

  var lightSpot = Thing.make({
    w: props.w,
    h: props.h,
    background: 'radial-gradient(at 30% 30%, transparent 30%, rgba(80, 0, 115, 0.3) 90%)'
  });

  container.add([wallpaper, textureImg, lightSpot]);

  return container;
}

// function makePointer(targetThing, text) {
//   var tgtPoint = [50, 100];
//   var distance = CW * 0.1;
//   var delta = CW * 0.05;
//   var randY = Rand.randInt(-delta, delta);
//   var worldPoint = Meninas.getWorldCoordsOf(tgtPoint, targetThing);

//   Thing.Line.make({
//     x1: worldPoint[0] - distance,
//     y1: worldPoint[1] + randY,
//     x2: worldPoint[0],
//     y2: worldPoint[1],
//     lineWidth: CW / 1000,
//     color: '#0f0'
//   }).render();

//   Thing.Label.make({
//     text: text,
//     x: (worldPoint[0] - distance) - 50,
//     y: (worldPoint[1] + randY) - 50,
//     fontSize: '60px',
//     backgroundColor: 'yellow',
//     padding: '50px 60px',
//     borderRadius: '900px',
//     border: '3px solid #360',
//   }).render();
// }

function makeSignature() {
  return Thing.Label.make({
    text: 'napier ' + Thing.Rand.getSeed(),
    fontSize: Math.floor(0.01 * CW) + 'px',
  });
}

var MR;
var stg;
var venus;

function makeSeed(x, y) {
  var sign = x < 0 ? -1 : 1;
  return sign * parseInt('' + y + Math.abs(x));
}

function regenerate(x, y) {
  Thing.Rand.setSeed( makeSeed(x,y) );
  MR.empty();
  MR.add(makeStuff(MR));
  MR.render();
}

function makeStuff(room) {
  // Floor
  var floorImg = Thing.Img
    .make({
      src:'img/wood_texture_smooth_panel_red_oak_pers_left.png',
      right: '0px',
      bottom: '0px',
      w: CW,
      h: CW * 0.2,
      z: 10,
    });

  // Room edge right side
  var edge = Thing.Line.make({
    x: CW * 0.829,
    y: 0,
    z: -1,
    x2: CW * 0.829,
    y2: CW * 0.5,
    width: CW * 0.0033,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  // All the things go here
  var venusStanding = makeFigure3({
    scale: CW/idealCanvasWidth,
    x: room.w * Thing.Rand.randFloat(0.1, 0.8),
    y: room.h * 0.25,
    z: Thing.Rand.randInt(0, room.d),
  });
  venus = venusStanding;

  return [
    // // floorImg,
    // // edge,
    makeMarkers(room),
    // makePlants(),
    makeCouch({
      x: room.w * Thing.Rand.randFloat(0, 0.53),
      y: CW * 0.3766,
      z: 100,
    }),
    // makeFigure({
    //   x: CW * 0.07,
    //   y: CW * 0.2366,
    //   z: 100
    // }),
    venusStanding,
    makeSignature(),
  ];
}

function makeMarkers(room) {
  var labels = [];
  var fontSize = Math.floor(0.006 * CW);
  var halfDepth = room.d / 2;
  for (var z=halfDepth; z > -halfDepth; z -= 100) {
    labels.push( Thing.Label.make({
      id: 'marker-' + z,
      text: '_' + z,
      y: room.h - fontSize,
      z: z,
      fontSize: fontSize + 'px',
      color: '#0F0',
    }));
  }
  return labels;
}

function makeFloor() {
  return Thing.BGImg.make({
    src: 'img/wood_texture_smooth_panel_red_oak.jpg',
  });
}

function makeRoom (props) {
  var r = Thing.Room.make($.extend({
    showOuter: false,
    overflow: 'hidden'
  }, props));

  r.back.css({backgroundColor: '#000'});
  r.right.css({backgroundColor: '#333'});
  r.left.css({backgroundColor: '#333'});
  r.top.css({backgroundColor: '#111'});
  r.bottom.css({backgroundColor: '#222'});

  r.left.add(makeDoor({position: 'left', wall: r.left}));
  r.back.add(makeDoor({position: 'center', wall: r.back}));
  r.right.add(makeDoor({position: 'right', wall: r.right}));
  r.bottom.add(makeFloor());

  return r;
}

var XX = 0;
var YY = 1;

$(function () {
  // Respond to page params and key events
  Thing.Page.setup();

  var stage = Thing.Box.make({
    w: CW,
    h: CH,
    transformStyle: 'preserve-3d',
  });

  stg = stage;

  var mainRoom = makeRoom({
    id: 'mainroom',
    x: 0,
    y: 0,
    z: -(CH * 0.9) / 2,
    w: CW,
    h: CH,
    d: CH * 0.9,
    perspectiveOrigin: (CW * 0.5) + 'px ' + (CH * 0.75) + 'px',  // origin is center of screen
  });
  mainRoom.back.css({backgroundColor: 'transparent'});
  mainRoom.left.css({backgroundColor: 'rgba(255,255,0,.2)'});
  mainRoom.right.css({backgroundColor: 'rgba(0,255,255,1)'});
  mainRoom.top.css({backgroundColor: 'rgba(0,0,255,.2)'});
  mainRoom.bottom.css({backgroundColor: 'rgba(0,255,0,.2)'});
  // mainRoom.bottom.add(fillFloor());
  // mainRoom.back.add(corridor);
  mainRoom.add([
  ]);

  window.MR = mainRoom;

  regenerate(XX, YY);

  // Background pattern fills the entire page
  var background = Meninas.makeBackground(CW, CH)
    .css({
      backgroundColor:'rgb(60, 47, 70)',
      backgroundImage: 'url(img/clouds_on_light_blue.jpg)',
      backgroundSize: 'cover',
    });
  background.add([
    makeSurface({w: CW, h: CH}),
    stage,
    mainRoom,
  ]);
  background.render();

  // makeSignature().render();
});
