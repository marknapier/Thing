var Thing = window.Thing;
var Rand = Thing.Rand;

var pageParams = Thing.Page.getParams();
var aspectRatio = 1;
var CW = pageParams.canvasWidth || 6000;
var CH = CW * aspectRatio;

function makeRoom (props) {
  var r = Thing.Room.make($.extend({
    x: 1000,
    y:  120,
    w: 1000,
    h: 2625,
    d: 1000,
    showOuter: false,
    overflow: 'hidden'
  }, props));

  r.back.css({backgroundColor: '#000'});
  r.right.css({backgroundColor: '#333'});
  r.left.css({backgroundColor: '#333'});
  r.top.css({backgroundColor: '#111'});
  r.bottom.css({backgroundColor: '#222'});
  return r;
}

function makeLightSpot () {
  return Thing.make({
    width: '100%',
    height: '100%',
    background: 'radial-gradient(at 40% 30%, rgba(255, 255, 255, 0.3) 10%, rgba(94, 72, 82, 0.54) 90%)'
  });
}

function makeShadowSpot(props) {
  return Thing.make({
    id: 'shadowSpot',
    x: props.x,
    y: props.y,
    z: props.z,
    w: props.w,
    h: props.h,
    rotate: {x: 90},
    background: 'radial-gradient(at 50% 50%, rgba(0, 0, 0, 0.5) 30%, transparent 70%)'
  });
}

function makeBackground(props = {}) {
  return Thing.Box.make($.extend({
        w: props.w || 5000,
        h: props.h || 3600,
        backgroundColor: 'rgb(60, 47, 70)',
        backgroundImage: 'url(img/clouds_on_light_blue.jpg)',
        backgroundSize: 'cover',
        overflow: 'hidden',
        perspective: '7000px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
    }, props))
    .add(Thing.BGImg.make({  // stripe texture
      url: 'linear-gradient(90deg, rgba(255, 244, 56, 0.75) 4px, transparent 4px)', //img/white_door.png',
      mixBlendMode: 'normal', // 'hard-light',
      repeat: true,
      size: '10px', //5% 20%',
      opacity: 0.25,
    }))
    .add(Thing.make({  // shadow on wall
      width: '120%',
      height: '120%',
      background: 'radial-gradient(at 30% 30%, transparent 30%, rgba(0,0,0,.7) 80%)',
      mixBlendMode: 'darken',
    }))
    .add(Thing.make({  // highlight on wall
      width: '100%',
      height: '100%',
      background: 'radial-gradient(at 40% 30%, rgba(255, 255, 235, .7) 10%, transparent 50%)',
      mixBlendMode: 'normal',
      opacity: 0.5,
    }));
}

function arrangeAround(thing, posx, posy) {
  var x, y;
  switch (thing.props.halign) {
    case 'left': x = posx; break;
    case 'center': x = posx - (thing.w / 2); break;
    case 'right': x = posx - thing.w; break;
  }
  switch (thing.props.valign) {
    case 'top': y = posy; break;
    case 'middle': y = posy - (thing.h / 2); break;
    case 'bottom': y = posy - thing.h; break;
  }
  return [x, y];
}

// show images in a line and push to bottom of container box
function arrangeImagesInBox(imgs, props) {
  var b = Thing.Box.make({
    position: 'relative',
    w: props.w,
    h: props.h,
    margin: '20px',
    border: '1px solid magenta',
    overflow: 'hidden',
  });

  imgs.forEach(function (i) {
    var xy = arrangeAround(i, props.w/2, props.h/2);
    i.translateTo(xy[0], xy[1]);
  });

  b.add( imgs );
  return b;
}

function randomHAlign() {
  return Thing.Rand.randItem(['left', 'center', 'right']);
}

function randomVAlign() {
  return Thing.Rand.randItem(['top', 'middle', 'bottom']);
}

function randomImgPosition(url) {
  return { 
    src: url,
    halign: randomHAlign(), 
    valign: randomVAlign(), 
    w: Thing.Rand.randInt(CW*0.25, CW*0.5),
  };
}

function makeBouquet(callback, props) {
  // align left-right edges
  Thing.Img.loadImages([
      randomImgPosition('img/banana_tree_2_t.png'),
      randomImgPosition('img/BananaPalm_t.png'),
      randomImgPosition('img/aquarium_flowering_t.png'),
      randomImgPosition('img/aquarium_plastic_leaves_t.png'),
      randomImgPosition('img/leaves/hasta_leaf_A_1.png'),
      randomImgPosition('img/leaves/hosta_leaf_B_1.png'),
      randomImgPosition('img/leaves/laurel_branch_with_buds_1.png'),
      randomImgPosition('img/leaves/pointy_leaf_twig_1_HC.png'),
      randomImgPosition('img/leaves/rose_branch_1_HC.png'),
      randomImgPosition('img/leaves/snake_plant.png'),
      randomImgPosition('img/leaves/trumpet_flower_1_HC.png'),
      randomImgPosition('img/leaves/hibiscus_flower_1.png'),
    ], 
    function (imgs) {
      let bouquet = arrangeImagesInBox(imgs, props);
      callback(bouquet);
    }
  );
}

$(function () {
  // var mainRoom = makeRoom({
  //   x: -CW * 0.22,
  //   y: 0,
  //   d: CH * 1.2,
  //   w: CW * 1.44,
  //   h: CH,
  //   perspectiveOrigin: (CW * 0.5) + 'px ' + (CH * 0.75) + 'px',  // origin is center of screen
  // });

  // mainRoom.back.css({backgroundColor: 'transparent'});
  // mainRoom.left.css({backgroundColor: 'transparent'});
  // mainRoom.right.css({backgroundColor: 'transparent'});
  // mainRoom.top.css({backgroundColor: 'transparent'});
  // mainRoom.bottom.css({backgroundColor: 'rgba(0,255,0,.2)'});
  // mainRoom.bottom.add(fillFloor());
  // mainRoom.add([
  // ]);

  var bg = makeBackground({w: CW, h: CH}).render();

  makeBouquet((bouquet) => {
    bg.add(bouquet).render();    
  }, {w: CW, h: CH});


  Thing.Page.setup();
});
