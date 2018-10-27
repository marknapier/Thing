var Thing = window.Thing;

var pageParams = Thing.Page.getParams();
var aspectRatio = 1;
var CW = pageParams.canvasWidth || 6000;
var CH = CW * aspectRatio;

// function makeRoom (props) {
//   var r = Thing.Room.make($.extend({
//     x: 1000,
//     y:  120,
//     w: 1000,
//     h: 2625,
//     d: 1000,
//     showOuter: false,
//     overflow: 'hidden'
//   }, props));

//   r.back.css({backgroundColor: '#000'});
//   r.right.css({backgroundColor: '#333'});
//   r.left.css({backgroundColor: '#333'});
//   r.top.css({backgroundColor: '#111'});
//   r.bottom.css({backgroundColor: '#222'});
//   return r;
// }

// function makeLightSpot () {
//   return Thing.make({
//     width: '100%',
//     height: '100%',
//     background: 'radial-gradient(at 40% 30%, rgba(255, 255, 255, 0.3) 10%, rgba(94, 72, 82, 0.54) 90%)'
//   });
// }

// function makeShadowSpot(props) {
//   return Thing.make({
//     id: 'shadowSpot',
//     x: props.x,
//     y: props.y,
//     z: props.z,
//     w: props.w,
//     h: props.h,
//     rotate: {x: 90},
//     background: 'radial-gradient(at 50% 50%, rgba(0, 0, 0, 0.5) 30%, transparent 70%)'
//   });
// }

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
    // .add(Thing.BGImg.make({  // stripe texture
    //   url: 'linear-gradient(90deg, rgba(255, 244, 56, 0.75) 4px, transparent 4px)', //img/white_door.png',
    //   mixBlendMode: 'normal', // 'hard-light',
    //   repeat: true,
    //   size: '10px', //5% 20%',
    //   opacity: 0.25,
    // }))
    .add(makeLawn())
    .add(Thing.make({  // shadow on wall
      width: '120%',
      height: '120%',
      background: 'radial-gradient(at 30% 30%, transparent 30%, rgba(0,0,0,.7) 80%)',
      mixBlendMode: 'darken',
    }))
    .add(Thing.make({  // highlight on wall
      width: '100%',
      height: '100%',
      background: 'radial-gradient(at 40% 30%, rgba(255, 245, 145, 1.0) 10%, transparent 50%)',
      mixBlendMode: 'overlay',
      opacity: 0.95,
    }));
}

function makeLawn() {
  return Thing.BGImg.make({
    x: 0,
    y: CH * 0.85,
    w: CW,
    h: CH * 0.15,
    src: 'img/leaves/grassy_lawn_square_1.png',
    size: '100% 50%',
    center: true,
    repeat: true,
  });
}

// In order to flip and rotate an image we need to wrap it in a parent div
// so we can separate rotation from the flip transformations.
// Rotation goes on the parent element and can have it's own transform-origin.
// Flip transformation (scaleX = -1) goes on the child img element.
function makeImageFlipper(img) {
  // pub rotation, transformOrigin and positioning on parent wrapper
  var b = Thing.Box.make({
    x: img.x,
    y: img.y,
    z: img.z,
    w: img.w,
    h: img.h,
    rotate: img.rotation,
    transformOrigin: img.props.transformOrigin,
    halign: img.props.halign,
    valign: img.props.valign,
    // border: '2px solid red',
  });

  // Clone the image but remove rotation, transformOrigin and positioning
  var imgProps = img.props;
  imgProps.rotate = undefined;
  imgProps.transformOrigin = undefined;
  imgProps.x = imgProps.y = imgProps.z = 0;
  imgProps.position = 'relative';
  var newImg = Thing.Img.make(imgProps);

  // put img into parent wrapper
  b.add(newImg);
  return b;
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
  var b = Thing.Box.make($.extend({
    position: 'relative',
    // overflow: 'hidden',
    transformStyle: 'preserve-3d',
  }, props));
  var finalImgs = [];
  var z = 0;

  imgs.forEach(function (i) {
    if (i.props.scale) {
      i = makeImageFlipper(i);
    }
    var xy = arrangeAround(i, props.w * 0.5, Thing.Rand.randInt(props.h * 0.95, props.h * 0.95));
    z += 10;
    i.translateTo(xy[0], xy[1], z);
    finalImgs.push(i);
  });

  b.add( finalImgs );
  return b;
}

function randomHAlign() {
  return Thing.Rand.randItem(['left', 'center', 'right']);
}

function randomVAlign() {
  // return Thing.Rand.randItem(['top', 'middle', 'bottom']);
  return 'bottom';  //Thing.Rand.randItem(['bottom']);
}

function randomImgPosition(url) {
  return { 
    src: url,
    halign: 'center',   //randomHAlign(), 
    valign: randomVAlign(), 
    w: Thing.Rand.randInt(CW*0.25, CW*0.7),
  };
}

function makeMaskedLeaf(props) {
  var leaf = Thing.make({
    w: props.w || 500, 
    h: props.h || 500, 
    x: props.x || 0, 
    y: props.y || 0,
    mask: `url(${props.maskUrl})`,
    background: `url(${props.bgUrl})`,
    halign: props.halign || 'left',
    // scale: {x: -1},
  });
  var xy = arrangeAround(leaf, CW * 0.5, Thing.Rand.randInt(CH * 0.95, CH * 0.95));
  leaf
    .translateTo(xy[0], xy[1], 0)
    .css({transformOrigin: '0% 100%'})
    .rotateTo({z: Thing.Rand.randInt(-130, 45)});
  return leaf;
}

function makeLeafImageConfigurations() {
  return [
    // big leaf towards the right
    {
      src: 'img/leaves/hasta_leaf_A_1.png',
      w: Thing.Rand.randInt(CW*0.4, CW*0.65),
      halign: 'right',
      valign: 'bottom',
      transformOrigin: '100% 100%',
      rotate: {z: Thing.Rand.randInt(-30, 45) },
      scale: {x: -1}, // flip horizontally
    },
    // big leaf towards the left
    {
      src: 'img/leaves/hosta_leaf_B_1.png',
      w: Thing.Rand.randInt(CW*0.4, CW*0.75),
      halign: 'left',
      valign: 'bottom',
      transformOrigin: '0% 100%',
      rotate: {z: Thing.Rand.randInt(-45, 30)},
    },

    // leafy twig growing towards the right
    {
      src: 'img/leaves/pointy_leaf_twig_1_HC.png',
      w: Thing.Rand.randInt(CW*0.1, CW*0.5),
      halign: 'left',
      valign: 'bottom',
      transformOrigin: '50% 100%',
      rotate: {z: Thing.Rand.randInt(-20, 40) },
      scale: {x: -1}, // flip horizontally
    },
    {
      src: 'img/leaves/pointy_leaf_twig_1_HC.png',
      w: Thing.Rand.randInt(CW*0.1, CW*0.5),
      halign: 'left',
      valign: 'bottom',
      transformOrigin: '50% 100%',
      rotate: {z: Thing.Rand.randInt(-20, 30) },
      scale: {x: -1},
    },
    {
      src: 'img/leaves/pointy_leaf_twig_1_HC.png',
      w: Thing.Rand.randInt(CW*0.1, CW*0.4),
      halign: 'left',
      valign: 'bottom',
      transformOrigin: '50% 100%',
      rotate: {z: Thing.Rand.randInt(-20, 20) },
      scale: {x: -1},
    },

    // leafy twig growing towards the left
    {
      src: 'img/leaves/pointy_leaf_twig_1_HC.png',
      w: Thing.Rand.randInt(CW*0.1, CW*0.5),
      halign: 'right',
      valign: 'bottom',
      transformOrigin: '50% 100%',
      rotate: {z: Thing.Rand.randInt(-50, 20)},
    },
    {
      src: 'img/leaves/pointy_leaf_twig_1_HC.png',
      w: Thing.Rand.randInt(CW*0.1, CW*0.4),
      halign: 'right',
      valign: 'bottom',
      transformOrigin: '50% 100%',
      rotate: {z: Thing.Rand.randInt(-40, 20)},
    },
    {
      src: 'img/leaves/pointy_leaf_twig_1_HC.png',
      w: Thing.Rand.randInt(CW*0.1, CW*0.4),
      halign: 'right',
      valign: 'bottom',
      transformOrigin: '50% 100%',
      rotate: {z: Thing.Rand.randInt(-20, 20)},
    },

    // // randomImgPosition('img/banana_tree_2_t.png'),
    // // randomImgPosition('img/BananaPalm_t.png'),
    randomImgPosition('img/aquarium_flowering_t.png'),
    randomImgPosition('img/aquarium_plastic_leaves_t.png'),
    randomImgPosition('img/leaves/laurel_branch_with_buds_1.png'),
    randomImgPosition('img/leaves/rose_branch_1_HC.png'),
    randomImgPosition('img/leaves/snake_plant.png'),

    {
      src: 'img/leaves/trumpet_flower_1_HC.png',
      y: Thing.Rand.randInt(CW*0.2, CW*0.5),
      w: Thing.Rand.randInt(CW*0.15, CW*0.5),
      halign: randomHAlign(), 
      transformOrigin: '50% 100%',
      rotate: {z: Thing.Rand.randInt(-80, 80)},
    },
    {
      src: 'img/leaves/trumpet_flower_1_HC.png',
      y: Thing.Rand.randInt(CW*0.2, CW*0.5),
      w: Thing.Rand.randInt(CW*0.15, CW*0.5),
      halign: randomHAlign(), 
      transformOrigin: '50% 100%',
      rotate: {z: Thing.Rand.randInt(-80, 80)},
    },
    {
      src: 'img/leaves/hibiscus_flower_1.png',
      y: Thing.Rand.randInt(CW*0.2, CW*0.5),
      w: Thing.Rand.randInt(CW*0.15, CW*0.5),
      halign: randomHAlign(), 
      transformOrigin: '50% 50%',
      rotate: {z: Thing.Rand.randInt(-80, 70)},
    },
    {
      src: 'img/leaves/hibiscus_flower_1.png',
      y: Thing.Rand.randInt(CW*0.2, CW*0.5),
      w: Thing.Rand.randInt(CW*0.1, CW*0.4),
      halign: randomHAlign(), 
      transformOrigin: '50% 50%',
      rotate: {z: Thing.Rand.randInt(-80, 70)},
    },
  ];
}

function makeBouquet(callback, props) {
  // align left-right edges
  Thing.Img.loadImages(makeLeafImageConfigurations(), function (imgs) {
      let bouquet = arrangeImagesInBox(imgs, props);
      bouquet.add([
        makeMaskedLeaf({
          maskUrl: 'img/leaves/hasta_leaf_A_1.png',
          bgUrl: 'img/pink_and_red_roses_on_white.jpg',
          w: Thing.Rand.randInt(CW*0.4, CW*0.8),
        }),
      ]);
      callback(bouquet);
  });
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

  // bg.add(makeLawn());

  makeBouquet((bouquet) => {
    bg.add(bouquet).render();    
  }, {
    w: CW, 
    h: CH,
  });

  Thing.Page.setup();
});
