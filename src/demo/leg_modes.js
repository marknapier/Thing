var Thing = window.Thing;
var Meninas = window.Meninas;
var Rand = Thing.classes.Rand;

// multiply, darken, luminosity;

var colors = [
  'black',
  'pink',
  'aqua',
  'green',
  'lightgreen',
  'darkseagreen',
  'darkgreen',
  'lawngreen',
  'limegreen',
  'darkorange',
];

var blendModes = [
  'normal',
  'darken',
  'lighten',
  'multiply',
  'luminosity',
  'hard-light',
  'hue',
  'exclusion',
];

var images = [
  'rubens_adonis_leg_left.png',
  'rubens_adonis_leg_right.png',
  'rubens_venus_leg_left.png',
  'leg_durer_right_1.png',
  'leg_eve_left_1.png',
];

function bgPositionStr() {
  return [0, 0, 0].map(function () {
    return '' + (Rand.randInt(0,3) * 100) + 'px 0px';
  }).join(',');
}

function bgImgStr() {
  return [
    Rand.randItem(images),
    Rand.randItem(images),
    Rand.randItem(images),
  ].map(function (imgname) {
    return 'url(img/' + imgname + ')';
  }).join(',');
}

function bgModeStr() {
  return [
    Rand.randItem(blendModes),
    Rand.randItem(blendModes),
    Rand.randItem(blendModes),
  ].join(',');
}

function makeLegLayers (props) {
  return Thing.make($.extend({
    w: 1200,
    h: 2750,
    backgroundColor: Rand.randItem(colors),
    backgroundImage: bgImgStr(),
    backgroundSize: '1000px 2750px, 700px 2750px, 840px 2750px',
    backgroundBlendMode: bgModeStr(),
    backgroundPosition: bgPositionStr(),
    backgroundRepeat: 'no-repeat',
  }, props));
}

$(function () {
  var aspectRatio = 0.625;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale);

  var lightSpot = Thing.make({
    w: 5000,
    h: 2800,
    background: 'radial-gradient(at 40% 30%, rgba(255, 255, 255, 0.3) 10%, rgba(94, 72, 82, 0.54) 90%)'
  });

  var backWall = Thing.classes.Box.make({
    backgroundColor: '#011',
    // background: 'linear-gradient(90deg, rgba(255, 244, 156, 0.3) 4px, transparent 4px)',
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

  var rug = Thing.classes.Img.make({
    x: 3764,
    y: 2000,
    z: 1188,
    rotate: {z: 90, y: 90},
    scale: 3,
    src:'img/persian_carpet_fine_red_1.png'
  });

  backWall.add([
    makeLegLayers({x: 0}),
    makeLegLayers({x: 1200}),
    makeLegLayers({x: 2400}),
    makeLegLayers({x: 3600}),
  ]);

  background.add(backWall);
  background.add(floor);
  background.add(rug);
  background.render();

  // for debugging
  window.BG = background;
});
