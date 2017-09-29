var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.classes.Rand;

var pageParams = Thing.classes.Page.getParams();
var aspectRatio = 0.620;
var CW = pageParams.canvasWidth || 6000;  // canvas width
var CH = CW * aspectRatio;

var plantNamesSmall = [
  'aquarium_flowering_t.png',
  'aquarium_plastic_leaves_t.png',
  'low_philo_mixed_t.png',
];

function makeFigure (props = {z: 150}) {
  var borderWidth = CW * 0.0015;
  var torso = Thing.classes.Img.make($.extend({
    x: CW * 0.07,
    y: CW * 0.2366,
    z: props.z,
    rotate: {z: 30},
    src: 'img/Titian_Venus_of_Urbino_torso_t.png',
    border: borderWidth + 'px dashed #0f0',
  }, props));
  var head = Thing.classes.Img.make({
    x: 300,
    y: -300,
    rotate: {z: 15},
    src: 'img/Titian_Venus_of_Urbino_head_t.png',
    border: borderWidth + 'px dashed #cf0',
    transformOrigin: '90% 90%',
  });
  var legs = Thing.classes.Img.make({
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

function makeFigure3 (props = {x: 0, y: 0, z: 0}) {
  var borderWidth = 10; //CW * 0.0015;

  var torso = makeAttachable({
      thing: Thing.classes.Img.make($.extend({
      x: props.x,
      y: props.y,
      src: 'img/Titian_Venus_of_Urbino_torso_t_vert.png',
      border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-60, 60)},
    }, props)),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 300/3, y: 100/2},
    attachPoints: {
      hipRight: {x: 100, y: 860},
      hipLeft: {x: 400, y: 860},
      neck: {x: 400, y: 140},
    },
  });

  var head = makeAttachable({
    thing: Thing.classes.Img.make({
      src: 'img/Titian_Venus_of_Urbino_head_t_vert.png',
      rotate: {z: Rand.randInt(-10, 10)},
    }),
    origin: {x: 200, y: 460},
    attachPoints: {},
  });

  var thighRight = makeAttachable({
    thing: Thing.classes.Img.make({
      src: 'img/Titian_Venus_of_Urbino_thigh_right_t.png',
      border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-10, 10)},
      zIndex: 10,  // pull it forward over right thigh
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 115, y: 120},
    attachPoints: {
      knee: {x: 175, y: 740}
    },
  });
  thigh = thighRight;



  var thighLeft = makeAttachable({
    thing: Thing.classes.Img.make({
      src: 'img/Titian_Venus_of_Urbino_thigh_left_t.png',
      border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-10, 10)},
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 190, y: 120},
    attachPoints: {
      knee: {x: 150, y: 740}
    },
  });

  var calfRight = makeAttachable({
    thing: Thing.classes.Img.make({
      src: 'img/Titian_Venus_of_Urbino_calf_right_t.png',
      border: borderWidth + 'px dashed #0f0',
      rotate: {z: Rand.randInt(-10, 10)},
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 60, y: 55},
    attachPoints: {
      ankle: {x: 85, y: 600}
    },
  });

  calf = calfRight;

  var footRight = makeAttachable({
    thing: Thing.classes.Img.make({
      src: 'img/Titian_Venus_of_Urbino_foot_right_t.png',
      border: borderWidth + 'px dashed #f39',
      rotate: {z: Rand.randInt(-30, 0)},
    }),
    borderWidth: borderWidth,  // need to pass border width or rotations will be off-center
    origin: {x: 280, y: 24},
    attachPoints: {},
  });

  foot = footRight;

  torso.attach(head, 'neck');
  torso.attach(thighRight, 'hipRight');
  torso.attach(thighLeft, 'hipLeft');
  thighRight.attach(calfRight, 'knee');
  calfRight.attach(footRight, 'ankle');

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
  var thing = props.thing;  //Thing.make(props);

  // put marker at rotation point
  var dotO = Thing.make({w: 20, h: 20, x: (origin.x-props.borderWidth) - (20/2), y: (origin.y-props.borderWidth) - (20/2), backgroundColor: 'green', borderRadius: '20px'});
  thing.$element.append(dotO.$element);

  // put markers at attachment points
  Object.entries(attachPoints).forEach(([name, point]) => {
    let dotA = Thing.make({w: 20, h: 20, x: point.x - (20/2), y: point.y - (20/2), backgroundColor: 'gray'});
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

  var bottom = CW * 0.1;
  var bottomSmall = CW * -0.015;

  var plants = [
    Thing.classes.Img.make({src:'img/double-palm-silk-tree_t.png', x: randX(), z: randZ(), w: randW() + 200, bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/BananaPalm_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/banana_tree_2_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/dracaena-marginata-potted_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/rubber_tree_potted_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    //
    Thing.classes.Img.make({src:'img/double-palm-silk-tree_t.png', x: randX(), z: randZ(), w: randW() + 200, bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/BananaPalm_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/banana_tree_2_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/dracaena-marginata-potted_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/rubber_tree_potted_t.png', x: randX(), z: randZ(), w: randW(), bottom: bottom+'px'}),
    //
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
  ];
  return plants;
}

function makeCouch (props = {z: 100}) {
  var i = Thing.classes.Img.make($.extend({
      src:'img/sofa_3_victorian_sofa_t.png',    //sofa_leather_overstuffed_t.png
      x: CW * 0.1,
      y: CW * 0.266,
      z: props.z,
      w: CW * 0.466,
      filter: 'drop-shadow(10px 10px 19px rgba(0,0,0,0.7))'
    }, props));
  return i;
}

function makeSurface (props = {w:2500, h:2500}) {
  var container = Thing.classes.Box.make({
    w: props.w, 
    h: props.h, 
    backgroundColor: 'rgb(255, 228, 126)',
  });

  var wallpaper =  Thing.classes.PatternStripes.make({
    color: 'rgba(196, 191, 138, 0.52)', 
    size: props.w * 0.033
  });

  // var textureImg = Thing.classes.BGImg.make({
  //   url: 'img/vintagewallpaper4_crop_cutout_1.png',
  //   size: '30% 50%',
  //   repeat: true,
  //   opacity: 0.1,
  // });

  var textureImg = Thing.make({
    w: props.w,
    h: props.h,
    backgroundColor: 'rgba(255, 136, 0, 0.06)',
    WebkitMaskImage: 'url(img/vintagewallpaper4_crop_cutout_1.png)',
    WebkitMaskSize: '50% 80%',
    WebkitMaskRepeat: 'repeat',
  });

  var lightSpot = Thing.make({
    w: props.w,
    h: props.h,
    background: 'radial-gradient(at 30% 30%, transparent 30%, rgba(80, 0, 115, 0.3) 90%)'
  });

  container.add([wallpaper, textureImg, lightSpot]);

  return container;
}

function makePointer(targetThing, text) {
  var tgtPoint = [50, 100];
  var distance = CW * 0.1;
  var delta = CW * 0.05;
  var randY = Rand.randInt(-delta, delta);
  var worldPoint = Meninas.getWorldCoordsOf(tgtPoint, targetThing);

  Thing.classes.Line.make({
    x1: worldPoint[0] - distance, 
    y1: worldPoint[1] + randY,
    x2: worldPoint[0], 
    y2: worldPoint[1],
    width: CW / 1000, 
    color: '#0f0'
  }).render();

  Thing.classes.Label.make({
    text: text, 
    x: (worldPoint[0] - distance) - 50, 
    y: (worldPoint[1] + randY) - 50, 
    fontSize: '60px', 
    backgroundColor: 'yellow',
    padding: '50px 60px',
    borderRadius: '900px',
    border: '3px solid #360',
  }).render();
}

var stg;

$(function () {
  // surface
  // box
  // bg color
  // bg pattern
  //    opacity
  // gradient
  // fill parent container

  // Floor
  var floorImg = Thing.classes.Img
    .make({
      src:'img/wood_texture_smooth_panel_red_oak_pers_left.png',
      right: '0px',
      bottom: '0px',
      w: CW,
      h: CW * 0.2,
      z: 10,
    });

  // Room edge right side
  var edge = Thing.classes.Line.make({
    x1: CW * 0.829, 
    y1: 0,
    x2: CW * 0.829, 
    y2: CW * 0.5,
    width: CW * 0.0033,
    z: -1,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  // All the things go here
  var venusStanding = makeFigure3({x: CW * 0.7, y: CH * 0.1, z: 15});
  var stage = Thing.classes.Box.make({
    w: CW,
    h: CH,
    transformStyle: 'preserve-3d',
  });
  stage.add([
    floorImg,
    edge,
    makePlants(),
    makeCouch({z: 100}),
    makeFigure({z: 100}),
    venusStanding,
  ]);

  stg = stage;



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
  ]);
  background.render();

  makePointer(foot, 'C');
  makePointer(calf, 'B');
  makePointer(thigh, 'A');

  // Respond to page params and key events
  Thing.classes.Page.setScale(pageParams.scale || 1);
  Thing.classes.Page.initEvents();

  // for debugging
  window.BG = background;
});
