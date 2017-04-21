var Thing = window.Thing;
var Meninas = window.Meninas;
var greens = [
  'rgba(0, 255, 160, 1.0)',   // light aqua
  'rgba(51, 180, 17, 1.0)',   // various shades of green, half opaque, half translucent
  'rgba(51, 180, 17, 0.95)',
  'rgba(0, 128, 0, 1.0)',
  'rgba(0, 128, 0, 0.9)',
  'rgba(0, 164, 0, 1.0)',
  'rgba(0, 164, 0, 0.8)',
  'rgba(0, 120, 0, 1.0)',
  'rgba(0, 120, 0, 0.7)',
  'rgba(137, 190, 0, 1.0)',
  'rgba(137, 190, 0, 0.6)',
  'rgba(0, 128, 16, 1.0)',
  'rgba(0, 128, 16, 0.6)',
  'rgba(60, 240, 0, 1.0)',
  'rgba(60, 240, 0, 0.7)',
  'rgba(68, 224, 0, 1.0)',
  'rgba(68, 224, 0, 0.8)',
  'rgba(50, 200, 0, 1.0)',
  'rgba(50, 200, 0, 0.9)',
  'rgba(0, 55, 33, 1.0)',
  'rgba(0, 55, 33, 0.95)'
];

function makePattern (name, size) {
  var Rand = Thing.classes.Rand;
  var Pattern = Thing.classes[name] ? Thing.classes[name] : Thing.classes.Pattern;
  var P =  Pattern.make({pattern: name, size: size});
  var box = Thing.classes.Box.make( {
    x: Rand.randInt(0,1000),
    y: 0,
    w: Rand.randInt(200,1600),
    h: 2000,
    z: Rand.randInt(1,1000) * 10,
    backgroundColor: 'transparent',   //Rand.randItem(greens),
    position: 'absolute',
    display: 'block',
    overflow: 'hidden'
  });

  box.add( P );
  return box;
}

function makeMeninaSandwich(props) {
  var Rand = Thing.classes.Rand;
  var sofaSizes = [5, 10, 12.5, 16.6, 25, 50];

  var mWich = Thing.classes.Box.make({
    x: props.x,
    y: 0,
    w: 3000,
    h: 3000,
    zIndex: 10000
  });

  var backgroundMasks = [
    'linear-gradient(0deg, transparent 0%, transparent 25%, #fff 25%, #fff 55%, transparent 55.15%, transparent 85%, #fff 85%)',
    'linear-gradient(45deg, #0e0030 25%, transparent 25.15%, transparent 50%, #0e0030 50.15%, #0e0030 75%, transparent 75.15%, transparent)',
    'radial-gradient(transparent 300px, #fff 300px, #fff 600px, transparent 600px, transparent 900px, #fff 900px, #fff 1200px, transparent 1200px)',
    'radial-gradient(transparent 300px, #fff 300px, #fff 800px, transparent 800px, transparent 850px, #fff 850px, #fff 1400px, transparent 1400px)'
  ];

  var meninaPatterns = Thing.classes.Box.make({
    width: '100%',
    height: '100%',
    backgroundColor: Rand.randItem(greens),
    // WebkitMaskImage: backgroundMasks[2],
    WebkitMaskImage: Rand.randItem(backgroundMasks),
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: '100%',
    opacity: (0.9 + (Rand.randFloat()*0.1))   // range from slight transparency to fully opaque
  }).rotate(Rand.randInt(0,7)*45);

  meninaPatterns.add(Meninas.makeTextPane(0, 0, Rand.randInt(100,650), 2000));
  meninaPatterns.add(makePattern('GraphPaper'));
  meninaPatterns.add(makePattern('PlaidRedLarge'));
  meninaPatterns.add(makePattern('Sofa', Rand.randItem(sofaSizes)));
  meninaPatterns.add(makePattern('PatternPolkaDots', Rand.randInt(10,250)));
  meninaPatterns.add(makePattern('PatternStripes', Rand.randInt(50,300)));
  meninaPatterns.add(makePattern('DiagonalStripesViolet', Rand.randInt(3,20)));
  mWich.add(meninaPatterns);

  return mWich;
}

$(function () {
  var Rand = Thing.classes.Rand;
  var Img = Thing.classes.Img;

  // setup the stage
  var aspectRatio = 0.72;
  var pixelWidth = 5000;
  var pixelHeight = pixelWidth * aspectRatio;
  var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
  var background = Meninas.makeBackground(pixelWidth, pixelHeight, mainScale).css({backgroundColor:'#ffe78b'});

  var menina = Img.make({
    src:'img/las_meninas_girl_t.png',
    zIndex: 50000,
    opacity: 0.7
  }).scaleTo(1.8);

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
      w: 2000,
      h: 2000,
      z: 2000,
      opacity: 0.05
    })
    .css({
      transform: 'translate(2500px, 200px) rotateY(100deg) scale(2.2)'
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

  var meninaSandwich0 = makeMeninaSandwich({x: -500});
  var meninaSandwich1 = makeMeninaSandwich({x:  800});
  var meninaSandwich2 = makeMeninaSandwich({x: 1100});
  var meninaSandwich3 = makeMeninaSandwich({x: 1600});
  var meninaSandwich4 = makeMeninaSandwich({x: 2000});
  var meninaSandwiches = [meninaSandwich0,meninaSandwich1,meninaSandwich2,meninaSandwich3,meninaSandwich4];

  var codeLabel = Thing.classes.Label.make({
    text: 'waiting...',
    x: 2400,
    y: 200,
    w: 1300,
    h: 1500,
    fontSize: '80px',
    color: '#0c3',
    textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
    whiteSpace: 'pre'
  });

  var pos = menina.getPosition();

  // called after images load (renders Background)
  function makeImgPointers () {
    var dim = menina.getDimensions();
    var point = [500, 100];
    var M = Meninas.makeMatrix2D( menina.getCSSTransform() );
    var tp = Meninas.transformPoint(point, M, [dim.w/2, dim.h/2]);

    // point to Menina
    var pointer = Meninas.makeTextArrow(
      Rand.randInt(tp[0]-100, tp[0]+100), Rand.randInt(tp[1]-150, tp[1]-350),
      tp[0], tp[1],
      '#5dff1d', parseInt(tp[0]), 60, pos[2]+5000);
    pointer[1].css({fontSize:'200px', fontWeight: 'bold'});

    // update the code text AFTER render
    // var codeText = Meninas.makeMatrix2D(meninaSandwich4.getCSSTransform()).inspect();
    // var codeText = Thing.classes.Rand.randItem(meninaSandwich4.items[1].items).items[0].$element.css('background-image');
    var codeText = JSON.stringify(Thing.classes.Rand.randItem(meninaSandwich4.items[1].items).props, null, 4);
    codeLabel.setText( codeText );

    // Arrow with letter
    var meninaPosition = Rand.randItem(meninaSandwiches).getBoundingBox();
    background.add( Meninas.makeBubbleArrow(
            Rand.randInt(100,3000), Rand.randInt(100,500),
            meninaPosition.x+meninaPosition.w/2, meninaPosition.y,
            '#ceff34', Rand.randItem(['A','B','C','D']), false, Rand.randInt(3000,15000)) );

    background.add(pointer);
    background.render();
  }
  Img.onAllLoaded = makeImgPointers;

  window.BG = background;

  Meninas.scaleDocument(1);

  backWall.add(lightSpot);
  backWall.add(meninaSandwich0);
  backWall.add(meninaSandwich1);
  backWall.add(meninaSandwich2);
  backWall.add(meninaSandwich3);
  backWall.add(meninaSandwich4);
  backWall.add(codeLabel);

  // menina as a shadow on floor
  menina.css({
    transform: 'translate(1900px, 2400px) rotateX(90deg) rotateZ(43deg) scale(1.6)',
    WebkitMaskImage: 'url(img/las_meninas_girl_mask.png)',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: '100%',
    backgroundImage: 'linear-gradient(0deg, #635b5a 5%, rgba(255, 255, 25, 0) 80%)'
  });

  background.add(wallpaper);
  background.add(backWall);
  // background.add(menina);
  // background.add(eveLegShadow);
  // background.add(eveLeg);
  background.add(rightWall);
  background.add(edge);
  background.add(floorImg);

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

/*
  // intersecting planes
  var L1 = Img.make({
    src: 'img/hole_in_rock.png',
    w: 960
  }).css({transform:'rotateY(-90deg)'});
  var L2 = Img.make({
    src: 'img/leg_eve_left_1.png',
    w: 300
  }).css({transform:'translate(45px, 0px) rotateZ(76deg)'});
  var B = Thing.classes.Box.make({x:4000, y:2000, w:1000, h:1000, transformStyle:'preserve-3d', zIndex:60000});
  B.add(L1);
  B.add(L2);
  background.add(B);
  B.render();
*/

  // window.BG.render();

});
