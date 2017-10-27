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

var imgNamesHair = [
  "elvis_hair.png",
  "marilyn_hair.png",
  "mona_hair.png",
  "washington_hair.png",
  "chaplin_hat.png"
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
      opacity: 0.5 + (Rand.randFloat() * 0.7),
      filter: 'blur(' +(Rand.randPow() * 50.0).toFixed(1)+ 'px)',
      renderOnCenter:true,
    });
    images.push(facepart);
  }
  return images;
}

function makeBoundingBox(box, color, width) {
  var elbounds = box.getElementBounds(); // bounds of all elements, relative to document
  var boxbounds = box.getBoundingBox();  // bounds of the box element
  var rect = Thing.make({
    x: (elbounds.x-boxbounds.x), // position the rectangle relative to the box
    y: (elbounds.y-boxbounds.y),
    w: elbounds.w,
    h: elbounds.h,
    zIndex: 0,
    border: width + 'px solid ' + color
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

function makeSlices (props = {}) {
  var outerW = props.w;
  var outerH = props.h;
  var blah = makeWidths({x:0, w:props.w, minW:props.w*0.01, maxW:props.w*0.2});
  var strips = blah
  .map( function (xw) {
    return {
      x: xw.x,
      w: xw.w,
      content: Thing.classes.Img.make({
        src:'img/faceparts/' + Thing.classes.Rand.randItem(imgNamesMouths),
        w: props.w,
        h: props.h * 0.35,
      })
    };
  })
  .map( function (props = {}) {
    return makeStrip({
      content: props.content,
      x: props.x, // * (props.w * 0.125),
      y: 0,
      w: outerW,  // props.w * 0.125,  // width of strip: 1/8 of window
      h: outerH * 0.35,
      offset: props.x,  //props.num * (props.w * 0.125),
    });
  });
  return strips;
}

// x: starting pos
// w: total width to fill
// minW, maxW: min/max width of column
// return array of objects like: {x: 123, w:345}
function makeWidths (props) {
  var columns = [];
  var x = props.x || 0;
  var columnW = 0;
  var remainingW = 0;
  var maxW = props.maxW;

  while (x < props.w) {
    remainingW = props.w - x;
    maxW = remainingW > props.maxW ? props.maxW : remainingW;
    if (remainingW > props.minW) {
      columnW = Rand.randInt(props.minW, maxW);
    }
    else {
      columnW = remainingW;
    }
    columns.push({x: x, w: columnW});
    x += columnW;
  }

  return columns;
}

function borderWidth () {
  return (CW * 0.0016) * (Rand.randBoolean(45) ? 4 : 1);
}

$(function(){
  var colors = ['#3f2', 'red', 'pink', 'cyan', '#ff3', '#0f4', '#332', '#004', 'orange'];
  var bounds = Box.make({x:0, y:0, w: CW, h: CH, backgroundColor:Rand.randItem(colors)});

  var bg1 = Box.make({x:0, y:CH*0.35, w: CW, h: CH*0.20, backgroundColor:'pink'});
  bg1.add(  Thing.classes.BGImg.make({
      url: 'img/faceparts/' + Rand.randItem(imgNamesEyesLeft),
      size: '10% 22%',
      center: true,
      repeat: true
  }) );

  var diagonalstripes = Thing.classes.Pattern.makeDiagonalStripePatternCSS({
    color: Rand.randItem(colors), 
    size: Rand.randInt(200,2000)
  });

  var bg2 = Thing.classes.CompositeImg.make({
    x:0,
    y:CH*0.35 + CH*0.20,
    w: CW,
    h: CH*0.45,
    backgroundColor:'#0f0',
    layers: [
      {
        image: 'url(img/faceparts/' + Rand.randItem(imgNamesMouths) + ')',
        size: '20% 15%',
        repeat: 'repeat',
        blendMode: 'normal'
      },
      {
        image: 'url(img/faceparts/' + Rand.randItem(imgNamesMouths) + ')', //diagonalstripes.backgroundImage,
        size: '80% 60%',  //diagonalstripes.backgroundSize,
        position: 'center',
        // repeat: 'repeat',
        blendMode: 'hard-light'
      }
    ],
  });

  bounds.add(bg1);
  bounds.add(bg2);

  bounds.add(
      Thing.classes.Box.make({x: 0, y: 0, w: CW, h: CH * 0.38})
      .add(Thing.classes.Pattern.make({pattern:'PolkaDots', color: Rand.randItem(colors), size: Rand.randInt(100,1000)}))
  );
  // bounds.add(makeSlices({w: CW, h: CH}));


  var eyeY = CH * 0.47;
  var eyeRX = CW * 0.26;
  var eyeLX = CW * 0.74;
  var eyeW = CW * 0.40;
  var noseY = CH * 0.55;
  var noseW = CW * 0.25;
  var noseH = CH * 0.3;
  var mouthY = CH * 0.75;
  var mouthW = CW * 0.5;
  var mouthH = CH * 0.2;
  var centerX = CW * 0.5;
  var eyeR = Box.make({x:eyeRX, y:eyeY, w:eyeW, h:mouthH, backgroundColor:'green', renderOnCenter:true});
  var eyeL = Box.make({x:eyeLX, y:eyeY, w:eyeW, h:mouthH, backgroundColor:'red', renderOnCenter:true});
  var nose = Box.make({x:centerX, y:noseY, w:noseW, h:noseH, backgroundColor:'magenta', renderOnCenter:true});
  var mouth = Box.make({x:centerX, y:mouthY, w:mouthW, h:mouthH, backgroundColor:'yellow', renderOnCenter:true});
  var hair = Box.make({x:CW * 0.0, y:CH * 0.05, w:CW * 1.1, h:CH * 0.75, backgroundColor:'blue', renderOnCenter:false});

  var mouths = makeImagesForBox(imgNamesMouths, mouth);
  var noses = makeImagesForBox(imgNamesNoses, nose);
  var eyesL = makeImagesForBox(imgNamesEyesLeft, eyeL);
  var eyesR = makeImagesForBox(imgNamesEyesRight, eyeR);
  var hairs = makeImagesForBox(imgNamesHair, hair);

  bounds.render();

  // Respond to page params and key events
  Thing.classes.Page.setScale(pageParams.scale || 1);
  Thing.classes.Page.initEvents();

  // wait for images to load, then make bounding boxes, set scale, etc.
  Thing.classes.Img.onAllLoaded = function () {
    hair.add(hairs[0]).addMask('url(' + hairs[0].src + ')').render();

    mouth.add(mouths).render();
    mouth.add(makeBoundingBox(mouth, '#0F0', borderWidth())).render();

    nose.add(noses).render();  // have to render before getting bounding box or box will be 0x0
    nose.add(makeBoundingBox(nose, '#F00', borderWidth())).render();

    eyeR.add(eyesR).render();
    eyeR.add(makeBoundingBox(eyeR, '#F0F', borderWidth())).render();

    eyeL.add(eyesL).render();
    eyeL.add(makeBoundingBox(eyeL, '#FF0', borderWidth())).render();
  };

});
