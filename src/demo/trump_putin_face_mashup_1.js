var Thing = window.Thing;

var pageParams = Thing.Page.getParams();
var aspectRatio = 0.618;
var CW = pageParams.canvasWidth || 6000;
var CH = CW * aspectRatio;
var imgPath = 'img/trump/parts/';

function makeBackground(props = {}) {
  return Thing.Box.make($.extend({
        w: props.w,
        h: props.h,
        backgroundColor: 'rgb(220, 40, 30)',
        overflow: 'hidden',
    }, props));
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

// // show images in a line and push to bottom of container box
// function arrangeImagesInBox(imgs, props) {
//   var b = Thing.Box.make($.extend({
//     position: 'relative',
//     // overflow: 'hidden',
//     transformStyle: 'preserve-3d',
//   }, props));
//   var finalImgs = [];
//   var z = 0;

//   imgs.forEach(function (i) {
//     if (i.props.scale) {
//       i = makeImageFlipper(i);
//     }
//     var xy = arrangeAround(i, props.w * 0.5, Thing.Rand.randInt(props.h * 0.95, props.h * 0.95));
//     z += 10;
//     i.translateTo(xy[0], xy[1], z);
//     finalImgs.push(i);
//   });

//   b.add( finalImgs );
//   return b;
// }

// function makeMaskedLeaf(props) {
//   var leaf = Thing.make({
//     w: props.w || 500, 
//     h: props.h || 500, 
//     x: props.x || 0, 
//     y: props.y || 0,
//     mask: `url(${props.maskUrl})`,
//     background: `url(${props.bgUrl})`,
//     halign: props.halign || 'left',
//     // scale: {x: -1},
//   });
//   var xy = arrangeAround(leaf, CW * 0.5, Thing.Rand.randInt(CH * 0.95, CH * 0.95));
//   leaf
//     .translateTo(xy[0], xy[1], 0)
//     .css({transformOrigin: '0% 100%'})
//     .rotateTo({z: Thing.Rand.randInt(-130, 45)});
//   return leaf;
// }

function makeImageNamesArray() {
  return [
    {
      src: imgPath + 'Flag_of_the_United_States.png',
    },
    {
      src: imgPath + 'russian_flag.png',
    },
    {
      src: imgPath + 'putin_mouth_1.png',
    },
    {
      src: imgPath + 'putin_eye_right_1.png',
    },
    {
      src: imgPath + 'mouth_closed_1.jpg',
    },
    {
      src: imgPath + 'eye_left_1.jpg',
    },
    {
      src: imgPath + 'eye_right_1.jpg',
    },
    {
      src: imgPath + 'mouth_open_1.jpg',
    },
    {
      src: imgPath + 'mouth_smile_1.jpg',
    },
    {
      src: imgPath + 'twit_logo_blue_t.png',
    },
  ];
}

function makeBGImg(props) {
  return Thing.BGImg.make( $.extend({
      src: imgPath + 'twit_logo_blue_t.png',
      size: 'cover',
      center: false,
      repeat: false,
  }, props));
}

function makeLayout(props) {
  var containers = {
    // full background field
    bg: Thing.Box.make({
      background: 'green',
      x: 0,
      y: 0,
      w: props.w,
      h: props.h,
    }),
    // 3 background fields
    bg1: Thing.Box.make({
      background: 'blue',
      x: 0,
      y: 0,
      w: props.w * 0.3333,
      h: props.h,
    }),
    bg2: Thing.Box.make({
      background: 'red',
      x: props.w * 0.3333,
      y: 0,
      w: props.w * 0.3333,
      h: props.h,
    }),
    bg3: Thing.Box.make({
      background: 'yellow',
      x: props.w * 0.6666,
      y: 0,
      w: props.w * 0.3333,
      h: props.h,
    }),
    // middle third face parts
    // forehead
    forehead: Thing.Box.make({
      background: '#ccc',
      x: props.w * 0.3333,
      y: 0,
      w: props.w * 0.3333,
      h: props.h * 0.25,
    }),
    // eyes
    eye1: Thing.Box.make({
      background: '#999',
      x: props.w * 0.3333,
      y: props.h * 0.25,
      w: (props.w * 0.3333) * 0.5,
      h: props.h * 0.25,
    }),
    eye2: Thing.Box.make({
      background: '#990',
      x: props.w * 0.3333 + ((props.w * 0.3333) * 0.5),
      y: props.h * 0.25,
      w: (props.w * 0.3333) * 0.5,
      h: props.h * 0.25,
    }),
    eye3: Thing.Box.make({
      background: '#555',
      x: props.w * 0.3333,
      y: props.h * 0.5,
      w: (props.w * 0.3333) * 0.5,
      h: props.h * 0.25,
    }),
    eye4: Thing.Box.make({
      background: '#550',
      x: props.w * 0.3333 + ((props.w * 0.3333) * 0.5),
      y: props.h * 0.5,
      w: (props.w * 0.3333) * 0.5,
      h: props.h * 0.25,
    }),
    // mouth
    mouth: Thing.Box.make({
      background: '#333',
      x: props.w * 0.3333,
      y: props.h * 0.75,
      w: props.w * 0.3333,
      h: props.h * 0.25,
    }),
  };

  return containers;
}

function arrange(layout, imgs) {
  layout.bg1.items[0].set({src: imgPath + 'Flag_of_the_United_States.png'});
  layout.bg2.items[0].set({src: imgPath + 'russian_flag.png'});
  layout.forehead.items[0].set({src: imgPath + 'mouth_closed_1.jpg'});
  layout.eye1.items[0].set({src: imgPath + 'putin_eye_right_1.png'});
}

$(function () {
  var bg = makeBackground({w: CW, h: CH}).render();

  var layout = makeLayout({w: CW, h: CH});

  layout.bg.add(makeBGImg());
  layout.bg1.add(makeBGImg());
  layout.bg2.add(makeBGImg());
  layout.bg3.add(makeBGImg());
  layout.forehead.add(makeBGImg({size: '100% 100%'}));
  layout.eye1.add(makeBGImg({size: '100% 100%'}));
  layout.eye2.add(makeBGImg({size: '100% 100%'}));
  layout.eye3.add(makeBGImg({size: '100% 100%'}));
  layout.eye4.add(makeBGImg({size: '100% 100%'}));
  layout.mouth.add(makeBGImg({size: '100% 100%'}));

  Object.keys(layout).forEach(function (k) {
    bg.add(layout[k]);
  });

  bg.render();

  Thing.Img.loadImages(makeImageNamesArray(), function (imgs) {
    arrange(layout, imgs);
  });

  Thing.Page.setup();
});
