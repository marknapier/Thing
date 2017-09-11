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
    transformOrigin: '5% 25%',   // add in border and 1/2 dot width to center dot at rotation point
  });
  var headdot = Thing.make({w: 20, h: 20, x: 406 * 0.9, y: 433 * 0.9, backgroundColor: 'blue'});
  var legsdot = Thing.make({w: 20, h: 20, x: 1736 * 0.05, y: 540 * 0.25, backgroundColor: 'blue'});

  head.$element.append(headdot.$element);
  legs.$element.append(legsdot.$element);
  torso.$element.append(head.$element);
  torso.$element.append(legs.$element);

  return torso;  // 530 1300
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
