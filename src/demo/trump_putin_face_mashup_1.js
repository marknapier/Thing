var Thing = window.Thing;

var pageParams = Thing.Page.getParams();
var aspectRatio = 0.618;
var CW = pageParams.canvasWidth || 6000;
var CH = CW * aspectRatio;
var imgPath = 'img/trump/parts/';

// image names
var hair = [
  'trump_hair_1.png',
  'putin_forehead_1.png',
];
var eye = [
  'eye_left_1.jpg',
  'eye_right_1.jpg',
  'putin_eye_right_1.png',
  'putin_eye_left_1.png',
  'putin_mouth_square_1.png',
  'mouth_open_1.jpg',
  'mouth_open_pixelated.jpg',
];
var mouth = [
  'mouth_closed_1.jpg',
  'mouth_closed_2.jpg',
  'mouth_open_1.jpg',
  'mouth_open_pixelated.jpg',
  'mouth_smile_1.jpg',
  'putin_mouth_1.png',
  'putin_mouth_2.png',
];
var flag = [
  'Flag_of_the_United_States.png',
  'USA_flag_starfield.png',
  'USA_flag_stripes.png',
  'russian_flag.png'
];

// image names for each layout section
var imageNamesForSection = {
  bg1: flag,
  bg2: flag,
  bg3: flag,
  forehead: hair,
  eye1: eye,
  eye2: eye,
  eye3: eye,
  eye4: eye,
  mouth: mouth,
};

function rand(arr) {
  return Thing.Rand.randItem(arr);
}

function makeBackground(props = {}) {
  return Thing.Box.make($.extend({
        w: props.w,
        h: props.h,
        backgroundColor: 'rgb(220, 40, 30)',
        overflow: 'hidden',
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

function makeBGImg(props) {
  return Thing.BGImg.make( $.extend({
      src: imgPath + 'twit_logo_blue_t.png',
      size: 'cover', //'100% 100%',
      center: false,
      repeat: false,
      transition: 'opacity 1s ease-in-out',
      opacity: 0,
  }, props));
}

function setImage(layoutSection, imageName) {
  var oldBGImg = layoutSection.items[0];
  var newBGImg = makeBGImg({
    src: imgPath + imageName,
  });

  // add the new img to dom (opacity is 0 by default)
  layoutSection.add(newBGImg);
  newBGImg.render();

  // Allow time for dom to catch up then change img opacity
  setTimeout(function () {
    newBGImg.$element.css({opacity: 1});
  }, 100);
  return oldBGImg;
}

function makeImageNamesArray() {
  return [
    { src: imgPath + 'Flag_of_the_United_States.png', },
    { src: imgPath + 'USA_flag_starfield.png', },
    { src: imgPath + 'USA_flag_stripes.png', },
    { src: imgPath + 'russian_flag.png', },
    { src: imgPath + 'putin_mouth_1.png', },
    { src: imgPath + 'putin_eye_right_1.png', },
    { src: imgPath + 'putin_forehead_1.png', },
    { src: imgPath + 'mouth_closed_1.jpg', },
    { src: imgPath + 'mouth_closed_2.jpg', },
    { src: imgPath + 'eye_left_1.jpg', },
    { src: imgPath + 'eye_right_1.jpg', },
    { src: imgPath + 'mouth_open_1.jpg', },
    { src: imgPath + 'mouth_smile_1.jpg', },
    { src: imgPath + 'trump_hair_1.png', },
    { src: imgPath + 'twit_logo_blue_t.png', },
  ];
}

function arrange(layout) {
  setImage(layout.bg1, rand(flag));
  setImage(layout.bg2, rand(flag));
  setImage(layout.bg3, rand(flag));
  setImage(layout.forehead, rand(hair));
  setImage(layout.eye1, rand(eye));
  setImage(layout.eye2, rand(eye));
  setImage(layout.eye3, rand(eye));
  setImage(layout.eye4, rand(eye));
  setImage(layout.mouth, rand(mouth));
}

function updateFace(layout) {
  var sectionName = rand(['forehead', 'eye1', 'eye2', 'eye3', 'eye4', 'mouth']);
  var oldImg = setImage(layout[sectionName], rand(imageNamesForSection[sectionName]));

  // remove the old image in one second
  setTimeout(function () {
    layout[sectionName].remove(oldImg);
  }, 1000);
}

function updateFlag(layout) {
  var sectionName = rand(['bg1', 'bg3']);
  var oldImg = setImage(layout[sectionName], rand(imageNamesForSection[sectionName]));

  // remove the old image in one second
  setTimeout(function () {
    layout[sectionName].remove(oldImg);
  }, 1000);
}

$(function () {
  var bg = makeBackground({w: CW, h: CH}).render();

  var layout = makeLayout({w: CW, h: CH});

  // layout.bg.add(makeBGImg());
  // layout.bg1.add(makeBGImg());
  // layout.bg2.add(makeBGImg());
  // layout.bg3.add(makeBGImg());
  // layout.forehead.add(makeBGImg());
  // layout.eye1.add(makeBGImg());
  // layout.eye2.add(makeBGImg());
  // layout.eye3.add(makeBGImg());
  // layout.eye4.add(makeBGImg());
  // layout.mouth.add(makeBGImg());

  Object.keys(layout).forEach(function (k) {
    bg.add(layout[k]);
  });

  bg.render();

  Thing.Img.loadImages(makeImageNamesArray(), function (imgs) {
    arrange(layout, imgs);
    setInterval(function () {
      updateFace(layout, null);
    }, 1200);
    setInterval(function () {
      updateFlag(layout, null);
    }, 12000);
  });

  Thing.Page.setup();
});
