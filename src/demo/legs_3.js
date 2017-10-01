var Thing = window.Thing;
var Meninas = window.Meninas;

function makeBunchOfLegs (width) {
  var Rand = Thing.classes.Rand;
  var Img = Thing.classes.Img;
  var arrayOLegs = [
    Img.make({
      src: 'img/leg_durer_adam_right_and_foot_1.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: 1250,
      w: 800
    }),
    Img.make({
      src: 'img/leg_durer_eve_vase_1.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: 1200,
      w: 800
    }),
    Img.make({
      src: 'img/leg_durer_right_1.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: 900,
      w: 700
    }),
    Img.make({
      src: 'img/leg_titian_venus_right_1.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: 1000,
      w: 600
    }),
    Img.make({
      src: 'img/titian_venus_both_legs_1.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: 500,
      w: 750
    }),
    Img.make({
      src: 'img/leg_eve_left_1.png',
      x: Rand.randInt(0,width),
      y: 1200,
      w: 600
    }),
    Img.make({         // Big Leg
      src: 'img/leg_eve_left_1.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: 300,
      w: 900
    }),
    Img.make({
      src: 'img/titian_venus_both_legs_1.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: Rand.randInt(-100,500),
      w: 750
    }),
    Img.make({
      src: 'img/leg_eve_left_1.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: Rand.randInt(-100,500),
      w: 900
    }),
    //
    Img.make({
      src: 'img/rubens_adonis_leg_left.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: Rand.randInt(500,900),
      w: 800
    }),
    Img.make({
      src: 'img/rubens_adonis_leg_right.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: Rand.randInt(-100,500),
      w: 800
    }),
    Img.make({
      src: 'img/rubens_venus_leg_left.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: Rand.randInt(-100,500),
      w: 500
    }),
    Img.make({
      src: 'img/birth_of_venus_leg_left.png',
      rotate: {y: Rand.randInt(-45, 45)},
      x: Rand.randInt(0,width),
      y: Rand.randInt(-100,500),
      w: 600
    }),
  ];
  return arrayOLegs;
}

$(function () {
  var Img = Thing.classes.Img;
  var Rand = Thing.classes.Rand;

  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'rgb(124, 10, 0)'});
  var legContainerWidth = Thing.classes.Rand.randInt(2000,3000);

  var rightWall = Img.make({
      src: 'img/vintagewallpaper4_crop.png',
      x: 4000,
      y: 433,
      w: 1200,
      h: 2300,
      rotate: {y:90},
      scale: 1.8,
      opacity: 0.5
    });

  // Highlight on back wall
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
  backWall.add(lightSpot);

  // var wallpaper = Thing.classes.PatternStripes.make({color: 'rgba(196, 191, 138, 0.52)', size: 200});
  var wallpaper = Thing.classes.Pattern.make({pattern: 'nothing', background: 'url(img/victorian_red_velvet_wallpaper.jpg)'});

  // Room edge right side
  var edge = Thing.classes.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    lineWidth: 20,
    background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  });

  // Bleached wood floor
  var floor = Meninas.makeFloorBleached();

  // put all the legs into one box
  var legContainer = Thing.classes.Box.make({
    x: 50,
    y: 50,
    w: legContainerWidth,
    h: 3100,
    transformStyle: 'preserve-3d'
  })
  .add(makeBunchOfLegs(legContainerWidth));

  // another bunch of legs
  var bunchOfLegs = Thing.classes.Box.make({
    x: 3300,
    y: 300,
    w: legContainerWidth * 0.75,
    h: 2000,
    transformStyle: 'preserve-3d',
    scale: 0.7,
    rotate: {z:-5}
  })
  .add(makeBunchOfLegs(legContainerWidth/2));

  // random dark circle on floor
  var darkspot = Thing.classes.Circle.make({
    r: 500,
    x: Rand.randInt(1000,4500),
    y: Rand.randInt(800,2000),
    backgroundColor: 'rgba(0,0,40,.95)',
    borderColor: 'transparent',
    borderWidth: 0
  });

  Meninas.scaleDocument(1);

  floor.add(darkspot);
  background.add(wallpaper);
  background.add(backWall);
  background.add(bunchOfLegs);
  background.add(rightWall);
  background.add(edge);
  background.add(floor);
  background.add(legContainer);
  background.render();

  window.BG = background;
});


/*

-webkit-mask-image: url(img/las_meninas_girl_mask.png);
-webkit-mask-repeat: no-repeat;
-webkit-mask-size: 100%;
opacity: 0.85


// Shadow div - added to the leg container div
<div style="
width: 500px;
height: 950px;
position:absolute;
transform-origin: 50% 50%;
transform: translate3D(2400px, 2900px, -400px) rotateX(89deg) rotateZ(30deg);
background-image: radial-gradient(ellipse at 50% 50%, rgb(109, 96, 96) 0%, #8a7777 35%, transparent 68%);
opacity: 0.85; ">
</div>

// translate:  X to the leg to be shadowed
//    Y to the floor height - half the shadow height


// striped shadow-ish shape on floor
<div class="Img" id="Img21" style="position: absolute;width: 1800px;height: 700px;-webkit-mask-image: url(file:///C:/Users/Mark/GIT/htdocs/Thing/img/shadow_mask_3.png);-webkit-mask-repeat: no-repeat;-webkit-mask-size: 100%;background-image: linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),      linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),      linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%);background-position: 10%, 10%, 10%;background-size: 15%, 15%, 15%;transform: translate3d(2100px, 2788px, -100px) rotateX(84deg) rotateZ(-23deg);opacity: 0.85;"></div>
<div class="Img" id="Img21" style="position: absolute;width: 1800px;height: 700px;-webkit-mask-image: url(file:///C:/Users/Mark/GIT/htdocs/Thing/img/shadow_mask_1.png);-webkit-mask-repeat: no-repeat;-webkit-mask-size: 100%;background-image: linear-gradient(90deg, transparent 21%, #af2828 21%, #d0f9c5 59%, transparent 59%),      linear-gradient(90deg, transparent 43%, #d930f3 43%, #f33054 67%, transparent 67%),      linear-gradient(90deg, #002177 34%, #000f90 34%, #0b009c 75%, #01045a 75%);background-position: 10%, 10%, 10%;background-size: 15%, 15%, 15%;transform: translate3d(600px, 2707px, 38px) rotateX(84deg) rotateZ(-36deg);opacity: 0.85;"></div>

// Darker striped shadow-ish shape on floor
<div class="Img" id="Img21" style="position: absolute;width: 2300px;height: 800px;-webkit-mask-image: url(file:///C:/Users/Mark/GIT/htdocs/Thing/img/shadow_mask_3.png);-webkit-mask-repeat: no-repeat;-webkit-mask-size: 100%;background-image: linear-gradient(90deg, transparent 51%, #3a3a17 51%, #000000 59%, transparent 59%),      linear-gradient(90deg, transparent 43%, #331a1f 43%, #691f2d 67%, rgba(39, 5, 5, 0) 67%),      linear-gradient(90deg, #001b0d 34%, #262626 34%, #262626 75%, #001d0f 75%);background-position: 10%, 10%, 10%;background-size: 15%, 15%, 15%;transform: translate3d(1500px, 3000px, -734px) rotateX(80deg) rotateZ(-9deg);opacity: 0.85;"></div>
<div class="Img" id="Img21" style="position: absolute;width: 1800px;height: 700px;-webkit-mask-image: url(file:///C:/Users/Mark/GIT/htdocs/Thing/img/shadow_mask_1.png);-webkit-mask-repeat: no-repeat;-webkit-mask-size: 100%;background-image: linear-gradient(90deg, transparent 21%, #210d0d 21%, #041001 59%, transparent 59%),      linear-gradient(90deg, transparent 43%, #28152b 43%, #2d0d13 67%, transparent 67%),      linear-gradient(90deg, #002177 34%, #000f90 34%, #0b009c 75%, #01045a 75%);background-position: 10%, 10%, 10%;background-size: 15%, 15%, 15%;transform: translate3d(700px, 3000px, -1362px) rotateX(80deg) rotateZ(-16deg);opacity: 0.85;"></div>

*/