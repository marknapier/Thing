/**
  * Familiar Faces
**/

var Thing = window.Thing;
var Rand = Thing.classes.Rand;
var Box = Thing.classes.Box;

var pageParams = Thing.classes.Page.getParams();
var aspectRatio = 1.5;
var idealWidth = 3000;
var CW = pageParams.canvasWidth || idealWidth;
var CH = CW * aspectRatio;
var SCALE = CW / idealWidth;

var imgNames = [
  'elvis_eye_left_round.png',
  'elvis_eye_left_square.png',
  'elvis_eye_right_round.png',
  'elvis_eye_right_square.png',
  'elvis_mouth_round.png',
  'elvis_mouth_square.png',
  'marilyn_eye_left_fuzzy.png',
  'marilyn_eye_left_round.png',
  'marilyn_eye_left_square.png',
  'marilyn_eye_right_fuzzy.png',
  'marilyn_eye_right_round.png',
  'marilyn_eye_right_square.png',
  'marilyn_mouth.png',
  'marilyn_mouth_round.png',
  'marilyn_mouth_square.png',
  'mona_eye_left_circle.png',
  'mona_eye_left_fuzzy.png',
  'mona_eye_right_circle.png',
  'mona_eye_right_fuzzy.png',
  'mona_eye_right_square.png',
  'washington_eye_left_fuzzy.png',
  'washington_eye_left_round.png',
  'washington_eye_left_square.png',
  'washington_eye_right_fuzzy.png',
  'washington_eye_right_round.png',
  'washington_eye_right_square.png',
  'washington_mouth_fuzzy.png',
  'washington_mouth_round.png',
  'washington_mouth_square.png',
  // 'yoda_eye_left_fuzzy.png',
  // 'yoda_eye_right.png',
  // 'yoda_eye_right_fuzzy.png',
  // 'yoda_left_eye.png',
  // 'yoda_mouth_circle.png'
];

var imgNamesEyesRight = [
  'elvis_eye_right_round.png',
  'elvis_eye_right_square.png',
  'marilyn_eye_right_fuzzy.png',
  'marilyn_eye_right_round.png',
  'marilyn_eye_right_square.png',
  'mona_eye_right_circle.png',
  'mona_eye_right_fuzzy.png',
  'mona_eye_right_square.png',
  'washington_eye_right_fuzzy.png',
  'washington_eye_right_round.png',
  'washington_eye_right_square.png',
  // 'yoda_eye_right.png',
  // 'yoda_eye_right_fuzzy.png'
];

var imgNamesEyesLeft = [
  'elvis_eye_left_round.png',
  'elvis_eye_left_square.png',
  'marilyn_eye_left_fuzzy.png',
  'marilyn_eye_left_round.png',
  'marilyn_eye_left_square.png',
  'mona_eye_left_circle.png',
  'mona_eye_left_fuzzy.png',
  'washington_eye_left_fuzzy.png',
  'washington_eye_left_round.png',
  'washington_eye_left_square.png',
  // 'yoda_eye_left_fuzzy.png',
  // 'yoda_left_eye.png'
];

var imgNamesMouths = [
  'elvis_mouth_round.png',
  'elvis_mouth_square.png',
  'marilyn_mouth.png',
  'marilyn_mouth_round.png',
  'marilyn_mouth_square.png',
  'washington_mouth_fuzzy.png',
  'washington_mouth_round.png',
  'washington_mouth_square.png',
  // 'yoda_mouth_circle.png'
];

var imgNamesNoses = [
  "elvis_nose.png",
  "elvis_nose_square.png",
  "marilyn_nose.png",
  "marilyn_nose_fuzzy.png",
  "mona_nose_fuzzy.png",
  "mona_nose_square.png",
  "nixon_nose.png",
  "nixon_nose_fuzzy.png",
  "washington_nose.png",
  "washington_nose_fuzzy.png",
  // "yoda_nose.png",
  // "yoda_nose_fuzzy.png"
];

//-----------------------

function makeImagesForBox (names, box) {
  var howMany = Rand.randInt(3,7);
  var dim = box.getDimensions();
  var midW = dim.w/2;
  var midH = dim.h/2;
  var scale = dim.w / 100;
  var jiggle = dim.w * 0.1;
  var images = [];

  for (var i=0; i < howMany; i++) {
    var facepart = Thing.classes.Img.make({
      src: 'img/faceparts/' + Rand.randItem(names),
      x: midW + (Rand.randNormal() * jiggle),
      y: midH + (Rand.randNormal() * jiggle),
      w: dim.w + (Rand.randNormal() * jiggle),
      opacity: 0.5 + Rand.randFloat(),
      renderOnCenter:true,
    });
    images.push(facepart);
  }
  return images;
}

function makeBoundingBox(box, color) {
  var elbounds = box.getElementBounds(); // bounds of all elements, relative to document
  var boxbounds = box.getBoundingBox();  // bounds of the box element
  var rect = Thing.make({
    x: (elbounds.x-boxbounds.x), // position the rectangle relative to the box
    y: (elbounds.y-boxbounds.y),
    w: elbounds.w,
    h: elbounds.h,
    zIndex: 0,
    border: '5px solid ' + color
  });
  return rect;
}

function makeStrip(props = {}) {
  var box = Thing.classes.Box.make({
    x: props.x,
    y: props.y,
    w: props.w,
    h: props.h,
    overflow: 'hidden',
  });
  box.add(props.content);
  props.content.translateTo(-props.offset, 0, 0);
  return box;
}

function makeSlices (props) {
  var blah = [0,1,2,3,4,5,6,7];
  var strips = blah
  .map( function (num) {
    return {
      num: num,
      content: Thing.classes.Img.make({
        src:'img/faceparts/' + Thing.classes.Rand.randItem(imgNamesMouths),
        w: CW,
        h: CH * 0.35,
      })
    };
  })
  .map( function (props) {
    return makeStrip({
      content: props.content,
      x: props.num * (CW * 0.125),
      y: 0,
      w: CW * 0.125,  // width of strip: 1/8 of window
      h: CH * 0.35,
      offset: props.num * (CW * 0.125),
    });
  });
  return strips;
}

$(function(){
  var bounds = Box.make({x:0, y:0, w: CW, h: CH, backgroundColor:'black'});

  var bg1 = Box.make({x:0, y:CH*0.35, w: CW, h: CH*0.20, backgroundColor:'pink'});
  bg1.add(  Thing.classes.BGImg.make({
      url: 'img/faceparts/' + Rand.randItem(imgNamesEyesLeft),
      size: '10% 22%',
      center: true,
      repeat: true
  }) );

  var bg2 = Box.make({x:0, y:CH*0.35 + CH*0.20, w: CW, h: CH*0.45, backgroundColor:'#0f0'});
  bg2.add(  Thing.classes.BGImg.make({
      url: 'img/faceparts/' + Rand.randItem(imgNamesMouths),
      size: '20% 15%',
      center: false,
      repeat: true
  }) );

  var bg3 = Box.make({x:CW*0.10, y:CH*0.35 + CH*0.20, w: CW-(CW*0.20), h: CH*0.40});
  bg3.add(  Thing.classes.BGImg.make({
      url: 'img/faceparts/' + Rand.randItem(imgNamesMouths),
      size: '100% 100%',
      center: true,
      repeat: true
  }) );

  bounds.add(bg1);
  bounds.add(bg2);
  bounds.add(makeSlices());
  // bounds.add(bg3);

  var eyeY = CH * 0.5;
  var eyeLX = CW * 0.70;
  var eyeRX = CW * 0.29;
  var noseY = CH * 0.59;
  var noseW = CW * 0.20;
  var noseH = CH * 0.25;
  var mouthY = CH * 0.75;
  var mouthW = CW * 0.35;
  var mouthH = CH * 0.15;
  var eyeW = CW * 0.30;
  var centerX = CW * 0.5;
  var eyeR = Box.make({x:eyeRX, y:eyeY, w:eyeW, h:mouthH, backgroundColor:'green', renderOnCenter:true});
  var eyeL = Box.make({x:eyeLX, y:eyeY, w:eyeW, h:mouthH, backgroundColor:'red', renderOnCenter:true});
  var nose = Box.make({x:centerX, y:noseY, w:noseW, h:noseH, backgroundColor:'magenta', renderOnCenter:true});
  var mouth = Box.make({x:centerX, y:mouthY, w:mouthW, h:mouthH, backgroundColor:'yellow', renderOnCenter:true});

  var mouths = makeImagesForBox(imgNamesMouths, mouth);
  var noses = makeImagesForBox(imgNamesNoses, nose);
  var eyesL = makeImagesForBox(imgNamesEyesLeft, eyeL);
  var eyesR = makeImagesForBox(imgNamesEyesRight, eyeR);

  bounds.render();

  // wait for images to load, then make bounding boxes, set scale, etc.
  Thing.classes.Img.onAllLoaded = function () {
    mouth.add(mouths).render();
    mouth.add(makeBoundingBox(mouth, '#0F0')).render();

    nose.add(noses).render();  // have to render before getting bounding box or box will be 0x0
    nose.add(makeBoundingBox(nose, '#F00')).render();

    eyeR.add(eyesR).render();
    eyeR.add(makeBoundingBox(eyeR, '#F0F')).render();

    eyeL.add(eyesL).render();
    eyeL.add(makeBoundingBox(eyeL, '#FF0')).render();

    // var s = makeStrip({
    //   content: bg3,
    //   x: 500,
    //   y: 0,
    //   w: 100,
    //   h: 1000,
    // });
    // s.render();

    // Respond to page params and key events
    Thing.classes.Page.setScale(pageParams.scale || 1);
    Thing.classes.Page.initEvents();

  };
});
