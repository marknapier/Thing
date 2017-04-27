var Thing = window.Thing;
var Meninas = window.Meninas;

$(function () {
  var Rand = Thing.classes.Rand;
  var Img = Thing.classes.Img;

  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'#ffe78b'});

  var eveLeg = Img.make({
    src: 'img/leg_eve_left_1.png',
    x: 3500,
    y: 1200,
    w: 600,
    zIndex: 50000
  });

  //   <div class="Img" id="Img104" style="position: absolute
  //   opacity: .6
  //   width: 225px
  //   transform: translate(3473px, 2721px) rotateX(90deg) rotateZ(25deg) scaleX(.9) scaleY(1.1)
  //   height: 400px
  //   z-index: 50000
  //   background: url(&quot
  //     file:///C:/Users/Mark/GIT/htdocs/Thing/img/spot_shadow_2.png&quot
  //   ) center center / 100% 100% no-repeat
  // "></div>


  var eveLegShadow = Thing.make({
    background: 'url(img/spot_shadow_2.png) center center / 100% 100% no-repeat',
    x: 3473,
    y: 2721,
    w: 225,
    h: 400,
    opacity: 0.6,
    zIndex: 50000
  }).css({
    // background: 'url(img/spot_shadow_2.png) center center / 100% 100% no-repeat',
    transform: 'translate(3473px, 2721px) rotateX(90deg) rotateZ(25deg) scaleX(.9) scaleY(1.1)'
  });

  var rightWall = Img.make({
      src: 'img/vintagewallpaper4_crop.png',
      w: 1200,
      h: 2300,
      z: 2000,
      opacity: 0.5
    })
    .css({
      transform: 'translate(4000px, 433px) rotateY(90deg) scale(1.8)'
    });

  var lightSpot = Thing.make({
      w: 4150,
      h: 2800,
      background: 'radial-gradient(at 40% 30%, rgba(250, 239, 200, 0.89) 10%, transparent 50%, rgba(124, 72, 82, 0.54) 90%)'
    });

  var backWall = Thing.classes.Box.make({
    w: 4150,
    h: 2800,
    overflow: 'hidden'
  });

  var wallpaper =  Thing.classes.PatternStripes.make({color: 'rgba(196, 191, 138, 0.52)', size: 200});

  // Room edge right side
  var edge = Thing.classes.Line.make({
    x1:4150, y1:0,
    x2:4150, y2:3000,
    width: 20,
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

  // Leg in doorway
  var frontWrapper = Thing.classes.Box.make({
    x:2000, 
    y:0, 
    w:5000, 
    h:3600,
    rotate: {y:-90},
    transformStyle:'preserve-3d', zIndex:90000
  });
  var frontwall = Thing.classes.Box.make({
    w: 5000,
    h: 3600,
    backgroundColor: 'gray',
    WebkitMaskImage: 'url(img/wall_with_door_mask.png)',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: '100%',
    transformStyle:'preserve-3d',
    backgroundImage:
      'linear-gradient(90deg, transparent 51%, #ffffc8 51%, #ffffc8 59%, transparent 59%),' +
      'linear-gradient(90deg, transparent 43%, #f33054 43%, #f33054 67%, transparent 67%),' +
      'linear-gradient(90deg, #029b4f 34%, #262626 34%, #262626 75%, #029b4f 75%)',
    backgroundPosition: '0%, 0%, 0%',
    backgroundSize: '15%, 15%, 15%'

  });
  var leg = Img.make({
    src: 'img/leg_eve_left_1.png'
  }).css({transform: 'translate(2350px, 2100px) rotateX(90deg) rotateY(78deg) scale(3)'});
  frontWrapper.add(frontwall);
  frontWrapper.add(leg);


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
  background.add(frontWrapper);

  var floor1 = Thing.make({
    w:5000,
    h:3600,
    zIndex:38000,
    transform: 'translate(-100px, 1605px) rotateX(85deg)',
    background: 'url(img/wood_texture_smooth_panel_red_oak.jpg) center center / 100% 100% no-repeat',
  });

  var floor2 = Thing.make({
    w:5000,
    h:3600,
    zIndex:40000,
    transform: 'translate(-100px, 1600px) rotateX(85deg)',
    backgroundImage: 'linear-gradient(90deg, #f3daac 0.4%, #6a5f4b .8%, #6a5f4b 1.6%, #ffdc8d 2.0%, #f3daac 3%)',
    backgroundSize: '400px 400px',
    opacity: 0.85
  });

  background.add(floor1).add(floor2);

  // // intersecting planes
  // var L1 = Img.make({
  //   src: 'img/hole_in_rock.png',
  //   w: 960
  // }).css({transform:'rotateY(-90deg)'});
  // var L2 = Img.make({
  //   src: 'img/leg_eve_left_1.png',
  //   w: 300
  // }).css({transform:'translate(45px, 0px) rotateZ(76deg)'});
  // var B = Thing.classes.Box.make({x:4000, y:2000, w:1000, h:1000, transformStyle:'preserve-3d', zIndex:60000});
  // B.add(L1);
  // B.add(L2);
  // background.add(B);
  // B.render();


  background.render();

  /* spot shadow
  <div class="Img" id="Img104" style="position: absolute;opacity: .6;width: 225px;transform: translate(3473px, 2721px) rotateX(90deg) rotateZ(25deg) scaleX(.9) scaleY(1.1);height: 400px;z-index: 50000;background: url(&quot;file:///C:/Users/Mark/GIT/htdocs/Thing/img/spot_shadow_2.png&quot;) center center / 100% 100% no-repeat;"></div>
  */

  // marble bg
  //<div class="Thing" id="Thing6" style="background-image: url(img/white-marble-texture-1.jpg);position: absolute;width: 4150px;height: 2800px;transform: scale(1);"></div>

  //white bathroom tile:
  //<div class="Thing" id="Thing106" style="background-color: rgb(242, 242, 242);border: 1px solid rgba(0, 0, 0, 0.15);box-shadow: rgb(255, 255, 255) 12px 12px 25px inset, rgb(180, 180, 180) -12px -12px 25px inset, rgba(33, 33, 33, 0.4) 6px 6px 8px;position: absolute;width: 500px;margin: 40px;height: 500px;transform: scale(1);"></div>

  //tile with overall gradient:
  //<div class="Thing" id="Thing106" style="background-color: rgb(242, 242, 242);border: 1px solid rgba(0, 0, 0, 0.15);box-shadow: rgb(255, 255, 255) 12px 12px 25px inset, rgb(180, 180, 180) -12px -12px 25px inset, rgba(33, 33, 33, 0.4) 6px 6px 8px;background-image: radial-gradient(ellipse farthest-corner at 140px 20px , #fafafa 30%, #eeeeee 85%);position: absolute;left: 525px;width: 500px;margin: 40px;height: 500px;transform: scale(1);"></div>

  //tile with transparency (marble BG shows through a little)
  //<div class="Thing" id="Thing106" style="/* background-color: rgb(242, 242, 242); */border: 1px solid rgba(0, 0, 0, 0.15);box-shadow: rgb(255, 255, 255) 12px 12px 25px inset, rgb(180, 180, 180) -12px -12px 25px inset, rgba(33, 33, 33, 0.4) 6px 6px 8px;background-image: radial-gradient(ellipse farthest-corner at 140px 20px , rgba(250, 250, 250, 0.9) 30%, rgba(238, 238, 238, 0.8) 85%);position: absolute;left: 505px;width: 500px;margin: 40px;height: 500px;transform: scale(1);"></div>

  /*
    // Intersecting 3D planes
    var B = Thing.classes.Box.make({w:200, h:200, perspective:'500px', transformStyle:'preserve-3d'});
    var p1 = Thing.make({w:200, h:200, background:'url(http://icons.iconarchive.com/icons/icons-land/vista-people/256/Person-Male-Light-icon.png) red'});
    var p2 = Thing.make({w:200, h:200, background:'url(http://icons.iconarchive.com/icons/icons-land/vista-people/256/Person-Male-Light-icon.png) blue'});
    B.add(p1.css({transform: 'rotateY(-34deg)'}))
    B.add(p2.css({transform: 'rotateY(45deg)'}))
    background.add(B);
    B.render();
  */

/*   
  // TILE
  var patternW = 3630;
  var patternH = 3000;
  var tileW = 500;
  var tileH = 500;
  var numTiles = (parseInt(patternW/tileW) + 1) * (parseInt(patternH/tileH) + 1);

  var tileBG = Thing.classes.Box.make({
    backgroundImage: 'url(img/concrete_1.jpg)',
    position: 'absolute',
    w: patternW,
    h: patternH
  });

  for (var i=0; i < numTiles; i++) {
    var randX = Thing.classes.Rand.randInt(0,2000) * -1;  // less than width of background Texture
    var randY = Thing.classes.Rand.randInt(0,1000) * -1;  // less than height of background Texture
    var tile = Thing.make({
      border: '1px solid rgba(0, 0, 0, 0.15)',
      boxShadow: 'rgb(255, 255, 255) 12px 12px 25px inset, rgb(180, 180, 180) -12px -12px 25px inset, rgba(33, 33, 33, 0.4) 6px 6px 8px',
      // backgroundImage: 'radial-gradient(ellipse farthest-corner at 140px 20px , rgba(250, 250, 250, 0.9) 30%, rgba(238, 238, 238, 0.8) 85%)',
      backgroundImage: 'url(img/white-marble-texture-lite.jpg)',
      backgroundPosition: randX+'px '+ randY+'px',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      float: 'left',
      w: tileW,
      h: tileH,
      margin: '5px',
      borderRadius: '6px'
    });
    tileBG.add(tile);
  }
*/

});
