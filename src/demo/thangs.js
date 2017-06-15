$(function(){
  var Thing = window.Thing;
  var Rand = Thing.classes.Rand;

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
    'yoda_eye_right.png',
    'yoda_eye_right_fuzzy.png'
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
    'yoda_eye_left_fuzzy.png',
    'yoda_left_eye.png'
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
    'yoda_mouth_circle.png'
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
    "yoda_nose.png",
    "yoda_nose_fuzzy.png"
  ];

  function makeFaceParts (dim) {
    // var dim = box.getDimensions();
    var midW = dim.w * 0.5;
    var leftW = dim.w * 0.70;
    var riteW = dim.w * 0.30;
    var eyeH = dim.h * 0.50;
    var noseH = dim.h * 0.40;
    var mouthH = dim.h * 0.75;
    var jitter = Rand.randInt(0,50);
    var scale = function () {return 0.80 + (Rand.randSin() * 0.4);};
    var parts = [];

    var eyeLeft = Thing.classes.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesEyesLeft),
      x: (leftW + (Rand.randNormal() * jitter)) - 75,   // rough attempt at centering
      y: (eyeH + (Rand.randNormal() * jitter)) - 60,
      w: 150 * scale(),
    });
    var eyeRight = Thing.classes.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesEyesRight),
      x: (riteW + (Rand.randNormal() * jitter)) - 75,
      y: (eyeH + (Rand.randNormal() * jitter)) - 60,
      w: 150 * scale(),
    });
    var nose = Thing.classes.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesNoses),
      x: (midW + (Rand.randNormal() * jitter)) - 75,
      y: noseH + (Rand.randNormal() * jitter),
      w: 150 * scale(),
    });
    var mouth = Thing.classes.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesMouths),
      x: (midW + (Rand.randNormal() * jitter)) - 125,
      y: mouthH + (Rand.randNormal() * jitter),
      w: 250 * scale(),
    });
    var hair = Thing.make({
      x: (dim.w * 0.05) + (Rand.randNormal() * jitter),
      y: (dim.h * 0.05) + (Rand.randNormal() * jitter),
      w: (dim.w * 0.8) * scale(),
      h: (dim.h * 0.2) * scale(),
      backgroundColor: '#630'
    });
    parts = [mouth, nose, eyeLeft, eyeRight, hair];
    return parts;
  }

  function makeDividerLines(dim) {
    let lines = [
      Thing.classes.Line.make({  // vertical center 
        x1: (dim.w/2),
        y1: (0),
        x2: (dim.w/2),
        y2: (dim.h),
        width: 2,
        color: '#6C0'
      }),
      Thing.classes.Line.make({  // horizontal center
        x1: (0),
        y1: (dim.h/2),
        x2: (dim.w),
        y2: (dim.h/2),
        width: 2,
        color: '#6C0'
      }),
      Thing.classes.Line.make({  // horizontal top quarter
        x1: (0),
        y1: (dim.h * 0.25),
        x2: (dim.w),
        y2: (dim.h * 0.25),
        width: 2,
        color: '#6C0'
      }),
      Thing.classes.Line.make({  // horizontal bottom quarter
        x1: (0),
        y1: (dim.h * 0.75),
        x2: (dim.w),
        y2: (dim.h * 0.75),
        width: 2,
        color: '#6C0'
      }),
      Thing.classes.Line.make({  // vertical eye centerline
        x1: (dim.w * 0.33),
        y1: (dim.h * 0.35),
        x2: (dim.w * 0.33),
        y2: (dim.h * 0.65),
        width: 2,
        color: '#6C0'
      }),
      Thing.classes.Line.make({  // vertical eye centerline
        x1: (dim.w * 0.66),
        y1: (dim.h * 0.35),
        x2: (dim.w * 0.66),
        y2: (dim.h * 0.65),
        width: 2,
        color: '#6C0'
      })
    ];
    return lines;
  }

  function makeGridBox(dim) {
    var b = Thing.classes.Box.make({
      w: dim.w, 
      h: dim.h, 
      border: '2px solid #699',
      margin: '20px'
    });
    b.add(Thing.classes.Pattern.make({
      pattern:'none', 
      backgroundSize: '50px 50px, 50px 50px',
      backgroundPosition: '-2px -2px, -2px -2px',
      backgroundImage: 'linear-gradient(rgba(120, 120, 120, 0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(120, 120, 120, 0.3) 2px, transparent 2px)',
      stretch: true
    }));
    return b;
  }

  //---------------------------------------------------------

  var dim = {w: 400, h: 600};
  var b = makeGridBox(dim);
  b.add(makeDividerLines({w: dim.w, h: dim.h}));
  b.add(makeFaceParts({w: dim.w, h: dim.h}));
  b.render();
});

