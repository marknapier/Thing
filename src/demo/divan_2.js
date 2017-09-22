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

function makeFigure (props = {}) {
  var borderWidth = CW * 0.0015;
  var torso = Thing.classes.Img.make($.extend({
    x: CW * 0.07,
    y: CW * 0.2366,
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

function makeFigure2 () {
  var borderWidth = 10; //CW * 0.0015;
  var z = 200;

  var torsoDim = {w: 600, h: 1000};
  var torsoAPoint = {x: torsoDim.w * 0.6666, y: torsoDim.h * 0.9};
  var torsoProps = {
    x: CW * 0.7,
    y: CW * 0.3,
    z: z,
    w: torsoDim.w,
    h: torsoDim.h,
    rotate: {z: 0},
    border: borderWidth + 'px dashed #0f0',
    backgroundColor: 'red',
    transformOrigin: '300px 500px',
  };
  var torso = Thing.make(torsoProps);
  var torsodotA = Thing.make({w: 20, h: 20, x: torsoAPoint.x - (20/2), y: torsoAPoint.y - (20/2), backgroundColor: 'gray'});
  torso.$element.append(torsodotA.$element);

  var legDim = {w: 100, h: 500};
  var legAPoint = {x: legDim.w * 0.5, y: legDim.h * 0.9};
  var legOrigin = (legDim.w * 0.5) + borderWidth;
  var legProps = {
    x: (torsoAPoint.x - legOrigin),   // attach leg to torso attachment point
    y: (torsoAPoint.y - legOrigin),
    w: legDim.w,
    h: legDim.h,
    rotate: {z: 0},
    border: borderWidth + 'px dashed #3f9',
    transformOrigin: legOrigin + 'px ' + legOrigin + 'px',   
    backgroundColor: 'yellow',
  };
  var leg = Thing.make(legProps);
  var legdotO = Thing.make({w: 20, h: 20, x: (legOrigin-borderWidth) - (20/2), y: (legOrigin-borderWidth) - (20/2), backgroundColor: 'blue'});
  var legdotA = Thing.make({w: 20, h: 20, x: legAPoint.x - (20/2), y: legAPoint.y - (20/2), backgroundColor: 'gray'});
  leg.$element.append(legdotO.$element);
  leg.$element.append(legdotA.$element);

  var footDim = {w: 300, h: 100};
  var footOrigin = (footDim.h * 0.5) + borderWidth;
  var footProps = {
    x: (legAPoint.x - footOrigin),   // attach foot to leg attachment point
    y: (legAPoint.y - footOrigin),
    w: footDim.w,
    h: footDim.h,
    rotate: {z: 0},
    border: borderWidth + 'px dashed #f39',
    transformOrigin: footOrigin + 'px ' + footOrigin + 'px',   
    backgroundColor: 'cyan',
    opacity: 0.5
  };
  var foot = Thing.make(footProps);
  var footdotO = Thing.make({w: 20, h: 20, x: (footOrigin-borderWidth) - (20/2), y: (footOrigin-borderWidth) - (20/2), backgroundColor: 'blue'});
  foot.$element.append(footdotO.$element);

  // 1 origin per piece (required)
  // N attachment points (optional)
  // piece rotates around origin (can be connected to attachment points)

  leg.$element.append(foot.$element);
  torso.$element.append(leg.$element);

  return torso;
}

function makePlants () {
  function randX () {
    return Rand.randInt(CW*0.2, CW*0.7);
  }
  
  function randXsmall () {
    return Rand.randInt(CW*0.01, CW*0.4);
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
    Thing.classes.Img.make({src:'img/double-palm-silk-tree_t.png', x: randX(), w: randW() + 200, bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/BananaPalm_t.png', x: randX(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/banana_tree_2_t.png', x: randX(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/dracaena-marginata-potted_t.png', x: randX(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/rubber_tree_potted_t.png', x: randX(), w: randW(), bottom: bottom+'px'}),
    //
    Thing.classes.Img.make({src:'img/double-palm-silk-tree_t.png', x: randX(), w: randW() + 200, bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/BananaPalm_t.png', x: randX(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/banana_tree_2_t.png', x: randX(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/dracaena-marginata-potted_t.png', x: randX(), w: randW(), bottom: bottom+'px'}),
    Thing.classes.Img.make({src:'img/rubber_tree_potted_t.png', x: randX(), w: randW(), bottom: bottom+'px'}),
    //
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
    Thing.classes.Img.make({src:randNameSmall(), x: randXsmall(), w: randWsmall(), z: 300, bottom: bottomSmall+'px'}),
  ];
  return plants;
}

function makeCouch (props = {}) {
  var i = Thing.classes.Img.make($.extend({
      src:'img/sofa_3_victorian_sofa_t.png',    //sofa_leather_overstuffed_t.png
      x: CW * 0.1,
      y: CW * 0.266,
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
    makeFigure({z: 150}),
    makeFigure2({z: 200}),
  ]);

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

  // Respond to page params and key events
  Thing.classes.Page.setScale(pageParams.scale || 1);
  Thing.classes.Page.initEvents();

  // for debugging
  window.BG = background;
});
