$(function(){
  var Thing = window.Thing;
  var Meninas = window.Meninas;
  var Rand = Thing.Rand;

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

  var imgNamesHair = [
    "elvis_hair.png",
    "marilyn_hair.png",
    "mona_hair.png",
    "washington_hair.png",
    "chaplin_hat.png"
  ];

  function makeLabelLines (things) {
    var lines = things.map(function(t) {
      var y = -200 + ((t.y / 1800) * 300);
      return Thing.Line.make({
        x1: t.x + (t.x < 580 ? -100 : 100),   // left side vs. right
        y1: t.y,
        x2: (t.x < 580 ? -100 : 1100),   // left side vs. right
        y2: (t.y + y),
        lineWidth: 6,
        color: '#6F0',
        zIndex: 1000
      });
    });
    return lines;
  }

  function makeLabels (things) {
    var labels = things.map(function(t) {
      var y = -200 + ((t.y / 1800) * 300);
      return Thing.Label.make({
        x: (t.x < 580 ? -300 : 1100),   // left side vs. right
        y: (t.y + y) - 25,
        w: 200,
        h: 50,
        color: '#6F0',
        fontSize: '' + (1800 * 0.03) + 'px',
        fontWeight: 700,
        textShadow: 'rgba(0, 0, 0, 0.8) 1px 1px 1px',
        text: '' + t.x.toFixed(0) + ',' + t.y.toFixed(0),
        zIndex: 1100
      });
    });
    return labels;
  }

  function makeFaceParts (dim) {
    var midW = dim.w * 0.5;
    var midH = dim.h * 0.50;
    var eyeW = dim.w * 0.375;
    var eyeLX = dim.w * 0.70;
    var eyeRX = dim.w * 0.30;
    var noseY = dim.h * 0.60;  // vertical center of nose
    var mouthY = dim.h * 0.812;  // vertical center of mouth
    var jitter = Rand.randInt(0,80);
    var variation = function () {return 0.80 + (Rand.randSin() * 0.4);};
    var parts = [];

    var eyeLeft = Thing.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesEyesLeft),
      x: (eyeLX + (Rand.randNormal() * jitter)),
        // rough attempt at centering
      y: (midH + (Rand.randNormal() * jitter)),
      w: eyeW * variation(),
      renderOnCenter: true,
      border: '1px solid red',
    });
    var eyeRight = Thing.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesEyesRight),
      x: (eyeRX + (Rand.randNormal() * jitter)),
      y: (midH + (Rand.randNormal() * jitter)),
      w: eyeW * variation(),
      renderOnCenter: true,
    });
    var nose = Thing.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesNoses),
      x: (midW + (Rand.randNormal() * (jitter/2))),      // keep the nose closer to center (less jitter)
      y: noseY + (Rand.randNormal() * jitter),
      w: (0.32 * dim.w) * variation(),
      renderOnCenter: true,
    });
    var mouth = Thing.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesMouths),
      x: (midW + (Rand.randNormal() * jitter)),
      y: mouthY + (Rand.randNormal() * jitter),
      w: (0.625 * dim.w) * variation(),
      renderOnCenter: true,
    });

    var hairW = (dim.w * 1.2) * variation();
    var hair = Thing.Img.make({
      src: 'img/faceparts/' + Rand.randItem(imgNamesHair),
      x: ((dim.w-hairW)*0.5) + (Rand.randNormal() * jitter),
      y: 0 + (Rand.randNormal() * jitter),
      w: hairW,
    });

    parts = [hair, mouth, nose, eyeLeft, eyeRight];
    Rand.randItem(parts).props.backgroundColor = '#6f0';  // sneaky... inject into props  :()

    return parts;
  }

  function makeDividerLines(dim) {
    let lineWidth = 6;
    let lines = [
      Thing.Line.make({  // vertical center
        x1: (dim.w/2),
        y1: (0),
        x2: (dim.w/2),
        y2: (dim.h),
        lineWidth: lineWidth,
        color: '#6C0'
      }),
      Thing.Line.make({  // horizontal center
        x1: (0),
        y1: (dim.h/2),
        x2: (dim.w),
        y2: (dim.h/2),
        lineWidth: lineWidth,
        color: '#6C0'
      }),
      Thing.Line.make({  // horizontal top quarter
        x1: (0),
        y1: (dim.h * 0.25),
        x2: (dim.w),
        y2: (dim.h * 0.25),
        lineWidth: lineWidth,
        color: '#6C0'
      }),
      Thing.Line.make({  // horizontal bottom quarter
        x1: (0),
        y1: (dim.h * 0.75),
        x2: (dim.w),
        y2: (dim.h * 0.75),
        lineWidth: lineWidth,
        color: '#6C0'
      }),
      Thing.Line.make({  // vertical eye centerline 1/3
        x1: (dim.w * 0.33),
        y1: (dim.h * 0.35),
        x2: (dim.w * 0.33),
        y2: (dim.h * 0.65),
        lineWidth: lineWidth,
        color: '#6C0'
      }),
      Thing.Line.make({  // vertical eye centerline 2/3
        x1: (dim.w * 0.66),
        y1: (dim.h * 0.35),
        x2: (dim.w * 0.66),
        y2: (dim.h * 0.65),
        lineWidth: lineWidth,
        color: '#6C0'
      })
    ];
    return lines;
  }

  // expect {w, h}
  function makeGridBox(props) {
    var gridW = props.w * 0.1;
    var lineW = props.w * 0.004;
    var halfLineW = lineW * 0.5;
    var b = Thing.Box.make($.extend({
      x: 500,
      y: 500,
      w: props.w,
      h: props.h,
      border: '2px solid #699',
      margin: '20px'
    }, props));
    b.add(Thing.Pattern.make({
      pattern:'none',
      backgroundSize: `${gridW}px ${gridW}px, ${gridW}px ${gridW}px`,
      backgroundPosition: `-${halfLineW}px -${halfLineW}px, -${halfLineW}px -${halfLineW}px`,
      backgroundImage: `linear-gradient(rgba(120, 120, 120, 0.25) ${lineW}px, transparent ${lineW}px), linear-gradient(90deg, rgba(120, 120, 120, 0.25) ${lineW}px, transparent ${lineW}px)`,
      stretch: true
    }));
    return b;
  }

  //---------------------------------------------------------

  var background = Meninas.makeBackground().css({backgroundColor: '#fff'});
  var dim = {w: 1200, h: 1800};
  var faceParts = makeFaceParts(dim);

  var box = makeGridBox({w: dim.w, h: dim.h, backgroundColor: '#ffff92'});
  box.add(makeDividerLines(dim));
  box.add(faceParts);
  box.add(makeLabelLines(faceParts));
  box.add(makeLabels(faceParts));

  background.add(box);
  background.render();
});

