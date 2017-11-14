var Thing = window.Thing;
var Meninas = window.Meninas;

$(function () {
  var Img = Thing.Img;

  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'rgb(46, 0, 0)'});

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

  var backWall = Thing.Box.make({
    w: 4150,
    h: 2800,
    overflow: 'hidden'
  });

  // var wallpaper = Thing.PatternStripes.make({color: 'rgba(196, 191, 138, 0.52)', size: 200});
  var wallpaper = Thing.Pattern.make({pattern: 'nothing', background: 'url(img/victorian_red_velvet_wallpaper.jpg)'});

  // Room edge right side
  var edge = Thing.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    width: 20,
    zIndex: 10010,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  // makeFloor
  var floorImg = Thing.Img
    .make({
      src:'img/wood_texture_smooth_panel_red_oak_pers_left.png',
      right: '0px',
      bottom: '0px',
      w: pixelWidth,
      h: 800,
      zIndex: 20000
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
    rotate: {x: 90, z: 25},
    opacity: 0.6,
    zIndex: 50000
  });

  // Leg in doorway
  var doorwayAndLeg = Thing.Box.make({   // this contains wall and leg
    x: -700, 
    y: -200, 
    w: 5000, 
    h: 3600,
    rotate: {y:-90},
    transformStyle: 'preserve-3d', 
    zIndex: 90000
  });
  var wallWithDoorway = Thing.Box.make({    // this masks a 'doorway' in the wall pattern
    w: 3800,
    h: 3600,
    backgroundColor: 'gray',
    mask: 'url(img/wall_with_door_mask.png)',
    backgroundImage:
      'linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),' +
      'linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),' +
      'linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%)',
    backgroundPosition: '0%, 0%, 0%',
    backgroundSize: '20%, 20%, 20%'
  });
  var leg = Img.make({                   // the leg image, rotated to intersect the 'doorway'
    src: 'img/leg_eve_left_1.png',
    rotate: {x: 90, y:78},
    x: 1350,
    y: 1000,
    w: 900
  });
  doorwayAndLeg.add(wallWithDoorway);
  doorwayAndLeg.add(leg);

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

  background.add(rightWall);
  background.add(edge);
  background.add(floorImg);
  background.add(doorwayAndLeg);

  background.add(floor1).add(floor2);

  background.render();
});
