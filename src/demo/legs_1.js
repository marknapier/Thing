var Thing = window.Thing;
var Meninas = window.Meninas;

$(function () {
  // var Rand = Thing.classes.Rand;
  var Img = Thing.classes.Img;

  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'rgb(124, 10, 0)'});

  var rightWall = Img.make({
      src: 'img/vintagewallpaper4_crop.png',
      w: 1200,
      h: 2300,
      scale: 1.8,
      rotate: {y: 90},
      x: 4000,
      y: 433,
      zIndex: 2000,
      opacity: 0.5
    });

  var lightSpot = Thing.make({
    w: 4150,
    h: 2800,
    background: 'radial-gradient(at 40% 30%, rgba(255, 145, 112, 0.278431) 10%, transparent 50%, rgba(25, 0, 72, 0.290196) 90%)'
  });

  var backWall = Thing.classes.Box.make({
    w: 4150,
    h: 2800,
    overflow: 'hidden'
  });

  // var wallpaper = Thing.classes.PatternStripes.make({color: 'rgba(196, 191, 138, 0.52)', size: 200});
  var wallpaper = Thing.classes.Pattern.make({pattern: 'nothing', background: 'url(img/victorian_red_velvet_wallpaper.jpg)'});

  // Room edge right side
  var edge = Thing.classes.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    lineWidth: 20,
    zIndex: 10010,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  // makeFloor
  var floorImg = Thing.classes.Img
    .make({
      src:'img/wood_texture_smooth_panel_red_oak_pers_left.png',
      right: '0px',
      bottom: '0px',
      w: pixelWidth,
      h: 800,
      zIndex: 20000
    });

  var leg1 = Img.make({
    src: 'img/leg_durer_adam_right_and_foot_1.png',
    x: 3000,
    y: 1250,
    w: 800,
    zIndex: 50000
  });
  var leg2 = Img.make({
    src: 'img/leg_durer_eve_vase_1.png',
    x: 0,
    y: 1200,
    w: 800,
    zIndex: 50000
  });
  var leg3 = Img.make({
    src: 'img/leg_durer_right_1.png',
    x: 4300,
    y: 900,
    w: 700
  });
  var leg4 = Img.make({
    src: 'img/leg_titian_venus_right_1.png',
    x: 4150,
    y: 1000,
    w: 600
  });

  var eveLeg = Img.make({
    src: 'img/leg_eve_left_1.png',
    x: 3500,
    y: 1200,
    w: 600,
    zIndex: 50000
  });

  var eveLegShadow = Thing.make({
    background: 'url(img/spot_shadow_2.png) center center / 100% 100% no-repeat',
    x: 3473,
    y: 2721,
    w: 200,
    h: 410,
    rotate: {x: 90, z:25},
    opacity: 0.6,
    zIndex: 50000
  });

  // Big Leg
  var leg = Img.make({                   // the leg image, rotated to intersect the 'doorway'
    src: 'img/leg_eve_left_1.png',
    x: 1550,
    y: 300,
    w: 900
  });

  // Bleached wood floor
  var floor1 = Thing.make({
    w:6100,
    h:3600,
    zIndex:38000,
    transform: 'translate(-1200px, 1605px) rotateX(85deg)',
    background: 'url(img/wood_texture_smooth_panel_red_oak.jpg) center center / 100% 100% no-repeat',
  });
  var floor2 = Thing.make({
    w:6100,
    h:3600,
    zIndex:40000,
    transform: 'translate(-1200px, 1600px) rotateX(85deg)',
    backgroundImage: 'linear-gradient(90deg, #f3daac 0.4%, #6a5f4b .8%, #6a5f4b 1.6%, #ffdc8d 2.0%, #f3daac 3%)',
    backgroundSize: '400px 400px',
    opacity: 0.85
  });

  window.BG = background;

  Meninas.scaleDocument(1);

  backWall.add(lightSpot);
  background.add(wallpaper);
  background.add(backWall);

  background.add(eveLegShadow);
  background.add(eveLeg);

  background.add(leg);
  background.add(leg1);
  background.add(leg2);
  background.add(leg3);
  background.add(leg4);

  background.add(rightWall);
  background.add(edge);
  background.add(floorImg);

  background.add(floor1).add(floor2);

  background.render();
});
