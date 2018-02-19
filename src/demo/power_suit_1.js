/**
  * Power Suit
**/
$(function(){
  var tinycolor = window.tinycolor;
  var Thing = window.Thing;
  var Rand = Thing.Rand;
  var Box = Thing.Box;
  var ImgSVG = Thing.ImgSVG;

  var pageParams = Thing.Page.getParams();
  var aspectRatio = 1.36;
  var idealWidth = 3600;
  var CW = pageParams.canvasWidth || idealWidth;
  var CH = CW * aspectRatio;
  var imgPath = 'img/trump/parts/';

  var imgNamesAll = [
    "american-flag_bg.jpg",
    "blue_bg.jpg",
    "cnn_blue_red_bg.jpg",
    "cnn_blue_red_f_bg.jpg",
    "eye_left_1.jpg",
    "eye_right_1.jpg",
    "eyes_1.jpg",
    "eyes_pixelated.jpg",
    // "face_full_pixelated.jpg",
    "face_left_half.jpg",
    "face_right_half_1.jpg",
    "face_right_side_orange_teal.jpg",
    "flag_flat_bg.jpg",
    "flag_hanging_bg.jpg",
    "flag_hanging_gold_cord_bg.jpg",
    "flag_pin_1.jpg",
    "flag_stripes_bg.jpg",
    "hair_1.jpg",
    "hair_2.jpg",
    "hand_left_fist.jpg",
    "hand_left_open.jpg",
    "hand_left_pointing_dark.jpg",
    "hand_right_fist.jpg",
    "hand_right_gun_teal.jpg",
    "hand_right_open.jpg",
    "hand_right_thumbsup.jpg",
    "head_left_side_1.jpg",
    "lapel_left_columns_1.jpg",
    "lapel_left_full_t.png",
    "lapel_left_flag.jpg",
    "lapel_left_pixelated.jpg",
    "lapel_right_flag.jpg",
    "lapel_right_full_t.png",
    "lapel_right_pixelated.jpg",
    "mouth_closed_1.jpg",
    "mouth_closed_2.jpg",
    "mouth_open_1.jpg",
    "mouth_open_pixelated.jpg",
    "mouth_smile_1.jpg",
    "nose_1.jpg",
    "nose_2_pixelated.jpg",
    "pixelated_blue_bg.jpg",
    "putin_on_tv_bg.jpg",
    // "pixelated_face.jpg",
    "senate_columns_bg.jpg",
    "suit_full_frontal.jpg",
    "suit_full_frontal_hands_t.png",
    "teal_wavy_bg.jpg",
    "tie_1.jpg",
    "tie_2.jpg",
    "tie_3_bright.jpg",
    "tie_3_bright_crop.jpg",
    "tie_4.jpg",
    "tie_5_full.jpg",
  ];

  var imgNamesPins = [
    "american-flag_bg.jpg",
    "flag_flat_bg.jpg",
    "flag_hanging_bg.jpg",
    "flag_hanging_gold_cord_bg.jpg",
    "flag_pin_1.jpg",
    "flag_stripes_bg.jpg",
    "senate_columns_bg.jpg",
    "mouth_open_1.jpg",
    "mouth_open_pixelated.jpg",
    "mouth_smile_1.jpg",
    "eye_left_1.jpg",
  ];

  var imgNamesEyes = filterStrings(imgNamesAll, 'eye');
  var imgNamesMouths = filterStrings(imgNamesAll, 'mouth');
  var imgNamesNoses = filterStrings(imgNamesAll, 'nose');
  var imgNamesHair = filterStrings(imgNamesAll, 'hair');
  var imgNamesHands = filterStrings(imgNamesAll, 'hand_');
  var imgNamesBackgrounds = filterStrings(imgNamesAll, '_bg');
  var imgNamesTies = filterStrings(imgNamesAll, 'tie_');
  var imgNamesFaces = filterStrings(imgNamesAll, 'face');
  var imgNamesLapelsLeft = filterStrings(imgNamesAll, 'lapel_left');
  var imgNamesLapelsRight = filterStrings(imgNamesAll, 'lapel_right');
  var imgNamesSuits = filterStrings(imgNamesAll, 'suit_full');

  //-----------------------

  function filterStrings(strings, substr) {
    return strings.filter(str => str.includes(substr));
  }

  function jiggle (num, maxDistance = 0) {
    return num + (Thing.Rand.randFloat(-1, 1) * maxDistance);
  }

  function makeImagesForBox (names, dim, props) {
    var howMany = Rand.randInt(3,7);
    var midW = dim.w/2;
    var midH = dim.h/2;
    var jiggle = props.jiggle || dim.w * (0.1 + (Rand.randFloat() * 0.3));
    var images = [];

    for (var i=0; i < howMany; i++) {
      var facepart = Thing.Img.make({
        src: imgPath + Rand.randItem(names),
        x: (props.renderOnCenter ? midW : 0) + (Rand.randNormal() * jiggle),   // shift the x,y position slightly
        y: (props.renderOnCenter ? midH : 0) + (Rand.randNormal() * jiggle),
        w: dim.w + (Rand.randNormal() * jiggle),    // change the image size slightly
        opacity: 0.5 + (Rand.randFloat() * 0.7),
        filter: 'blur(' +(Rand.randPow() * 50.0).toFixed(1)+ 'px)',
        renderOnCenter: props.renderOnCenter,
        border: props.border,
      });
      images.push(facepart);
    }
    return images;
  }

  function makeImageCascadeForBox (names, dim, props) {
    var howMany = Rand.randInt(3,7);
    var midW = dim.w/2;
    var midH = dim.h/2;
    var jiggle = props.jiggle || dim.w * (0.1 + (Rand.randFloat() * 0.3));
    var bwidth = (dim.w * 0.017);
    var images = [];
    var offset = Thing.Rand.randInt(dim.w * 0.02, dim.w * 0.10);

    for (var i=0; i < howMany; i++) {
      var facepart = Thing.Img.make({
        src: imgPath + Rand.randItem(names),
        x: (props.renderOnCenter ? midW : 0) + (Rand.randNormal() * jiggle) + (i * offset),   // shift the x,y position slightly
        y: (props.renderOnCenter ? midH : 0) + (Rand.randNormal() * jiggle) + (i * offset),
        w: dim.w + (Rand.randNormal() * jiggle),    // change the image size slightly
        opacity: 0.5 + (Rand.randFloat() * 0.7),
        filter: 'blur(' +(Rand.randPow() * 50.0).toFixed(1)+ 'px)',
        renderOnCenter: props.renderOnCenter,
        border: (bwidth * Rand.randFloat(0.3, 1.7)) + 'px solid yellow',
        // mixBlendMode: 'color-burn',
      });
      images.push(facepart);
    }
    return images;
  }

  function makeBorderBox(box, color, width) {
    var jiggle = Rand.randFloat(0.9, 1.1);
    var amount = box.w * 0.1;
    var rect = Thing.make({
      x: amount * Rand.randFloat(-1.0, 1.0),  // position box + or - the jiggle
      y: amount * Rand.randFloat(-1.0, 1.0),
      w: box.w * jiggle,
      h: box.h * jiggle,
      border: width + 'px solid ' + color
    });
    return rect;
  }

  function borderWidth (canvasWidth) {
    return (canvasWidth * 0.0016) * (Rand.randBoolean(45) ? 4 : 1);
  }

  // function makePolkaDots (props = {x:0, y:0, w:1000, h:500, colors: []}) {
  //   var r = Rand.randInt(10, 50);
  //   var s = Rand.randInt(50, 500);
  //   return Thing.Box.make({
  //     x: props.x,
  //     y: props.y,
  //     w: props.w,
  //     h: props.h,
  //     backgroundColor: Rand.randItem(['#f20', '#f63', '#f34', '#e03']),
  //     mask: {
  //       image: ImgSVG.makeURL(ImgSVG.makePolkaDotsSVG(r, 100)),
  //       repeat: 'repeat',
  //       size: s + 'px ' + s + 'px',
  //       position: '0% 0%',
  //     },
  //   });
  // }

  function makeFuzzyImageBox (props) {
    var b = Box.make({x:props.x, y:props.y, w:props.w, h:props.h, backgroundColor:props.backgroundColor, renderOnCenter:true})
            .add(makeImagesForBox(props.images, {w:props.w, h:props.h}, {jiggle: props.jiggle, renderOnCenter: true}));
    return b;
  }

  function makeFuzzyImageCascade (props) {
    var b = Box.make({x:props.x, y:props.y, w:props.w, h:props.h, backgroundColor:props.backgroundColor, renderOnCenter:true})
            .add(makeImageCascadeForBox(props.images, {w:props.w, h:props.h}, {jiggle: props.jiggle, renderOnCenter: true}));
    return b;
  }

  function around(val, distance=540) {
  	return val + (Thing.Rand.randNormal() * distance);
  }

  function makeMouthGrid(props) {
    return Thing.CompositeImg.make({
      x: props.x,
      y: props.y,
      w: props.w,
      h: props.h,
      backgroundColor: Thing.Rand.randItem(props.colors),
      layers: [
        {
          image: 'url(' + imgPath + Thing.Rand.randItem(props.imgNames) + ')',
          size: '20% 15%',
          repeat: 'repeat',
          blendMode: 'normal'
        },
        {
          image: 'url(' + imgPath + Thing.Rand.randItem(props.imgNames) + ')', //diagonalstripes.backgroundImage,
          size: '80% 60%',  //diagonalstripes.backgroundSize,
          position: 'center',
          blendMode: 'hard-light'
        }
      ],
    });
  }

  function getRandImg(imageNames) {
    return imgPath + Thing.Rand.randItem(imageNames);
  }

  function makeLayer(props) {
    return Thing.Box.make({
      id: props.id,
      x: props.x,
      y: props.y,
      w: props.w,
      h: props.h,
    })
    .add(Thing.BGImg.make({
      src: props.src,
      repeat: true,
      size: props.size,
      center: props.center,
    }));
  }

  function makePowerSuitPortrait (props = {w:1000, h:1500}) {
    var powerColors = ['#ff0000', '#ffcc00', '#f09900', '#0000ff', '#ffffff', '#fff'];
    var reds = powerColors;  //[ '#f80', '#e60', '#fc1', '#fa3'];
    var blueColors = ['#30f', '#04f', '#50e', '#36e', '#09f', '#22f', '#00c', '#00f'];
    var overallBGColor = Rand.randItem(reds);
    var highlightFGColor = tinycolor(overallBGColor).brighten(10).lighten(10).toString();
    var highlightFGColor2 = tinycolor(overallBGColor).brighten(10).saturate(25).toString();
    var smallJiggleSize = props.w * 0.035;
    var bigJiggleSize = props.w * 0.15;

    var bounds = Box.make({
      id: 'bounds',
      x: 0,
      y: 0,
      w: props.w,
      h: props.h,
      backgroundColor: overallBGColor,
    });

    // middle background
    var middleSuit = Thing.Img.make({
      id: 'fullsuit',
      x: jiggle(props.w * 0.1, bigJiggleSize),
      y: jiggle(props.h * 0.4, bigJiggleSize),
      w: jiggle(props.w * 0.8, bigJiggleSize),
      h: jiggle(props.h * 0.6, bigJiggleSize),
      src: getRandImg(imgNamesSuits),
    });
    var rightSuit = Thing.Img.make({
      id: 'rightsuit',
      x: Thing.Rand.randInt(props.w * 0.0, props.w * 0.2),
      y: jiggle(props.h * 0.5, bigJiggleSize),
      w: Thing.Rand.randInt(props.w * 0.2, props.w * 0.4),
      h: jiggle(props.h * 0.5, bigJiggleSize),
      src: getRandImg(imgNamesLapelsRight),
    });
    var leftSuit = Thing.Img.make({
      id: 'leftsuit',
      x: Thing.Rand.randInt(props.w * 0.7, props.w * 0.85),
      y: jiggle(props.h * 0.5, bigJiggleSize),
      w: Thing.Rand.randInt(props.w * 0.2, props.w * 0.4),
      h: jiggle(props.h * 0.5, bigJiggleSize),
      src: getRandImg(imgNamesLapelsLeft),
    });

    // bottom half background
    var bottomMouths = makeMouthGrid({
      x: props.w * 0.05,
      y: props.h * 0.3,
      w: props.w * 0.9,
      h: props.h * 0.3,
      colors: reds,
      imgNames: imgNamesMouths,
    }); 

    // mid backgrounds
    var midBGs = Thing.Rand.randItems(imgNamesBackgrounds, Thing.Rand.randInt(1,2)).map((imgName, index) => {
      var leftside = Thing.Rand.randBoolean();
      var topside = Thing.Rand.randBoolean();
      return makeLayer({
        id: 'midbg' + index,
        x: leftside ? Thing.Rand.randInt(props.w * -0.01, props.w * 0.01) : Thing.Rand.randInt(props.w * 0.4, props.w * 0.6),
        y: topside ? Thing.Rand.randInt(props.h * -0.01, props.h * 0.01) : Thing.Rand.randInt(props.h * 0.5, props.h * 0.7),
        w: Thing.Rand.randInt(props.w * 0.3, props.w * 0.6),
        h: Thing.Rand.randInt(props.h * 0.5, props.w * 0.6),
        size: Thing.Rand.randInt(50,120) + '% ' + Thing.Rand.randInt(60,120) + '%',
        src: imgPath + imgName,
      });
    });

    // tie
    var ties = Thing.Rand.randItems(imgNamesTies, Thing.Rand.randInt(3,5)).map((imgName, index) => {
      return makeLayer({
        id: 'tie' + index,
        x: Thing.Rand.randInt(props.w * 0.4, props.w * 0.5),
        y: Thing.Rand.randInt(props.h * 0.5, props.h * 0.6),
        w: Thing.Rand.randInt(props.w * 0.2, props.w * 0.25),
        h: Thing.Rand.randInt(props.h * 0.5, props.h * 0.5),
        size: Thing.Rand.randInt(50,120) + '% ' + Thing.Rand.randInt(60,120) + '%',
        center: true,
        src: imgPath + imgName,
      });
    });

    // scatter imgs
    var scatter = Thing.Rand.randItems(imgNamesAll, Thing.Rand.randInt(5,9)).map((imgName, index) => {
      return makeLayer({
        id: 'scatter' + index,
        x: Thing.Rand.randInt(props.w * 0.05, props.w * 0.6),
        y: Thing.Rand.randInt(props.h * 0.1, props.h * 0.25),
        w: Thing.Rand.randInt(props.w * 0.05, props.w * 0.3),
        h: Thing.Rand.randInt(props.h * 0.1, props.h * 0.5),
        src: imgPath + imgName,
        size: Thing.Rand.randInt(10,100) + '% ' + Thing.Rand.randInt(10,100) + '%',
        repeat: 'repeat',
      });
    });

    // twitter imgs
    var twitters = Thing.Rand.randItems(imgNamesPins, Thing.Rand.randInt(2,5)).map((imgName, index) => {
      var size = Thing.Rand.randInt(props.w * 0.1, props.w * 0.5);
      return makeLayer({
        id: 'twitter' + index,
        x: Thing.Rand.randInt(props.w * 0.0, props.w * 0.9),
        y: Thing.Rand.randInt(props.h * 0.0, props.h * 0.4),
        w: size,
        h: size,
        src: imgPath + imgName,
        size: Thing.Rand.randInt(100,100) + '% ' + Thing.Rand.randInt(100,100) + '%',
        repeat: 'repeat',
      }).addMask({
        image: 'url(' + imgPath + 'twitter_logo_blue_t.png' + ')',
        size: '150%',
        repeat: 'repeat',
      });
    });

    // eye imgs
    var eyes = makeLayer({
      id: 'eyes',
      x: Thing.Rand.randInt(props.w * 0.0, props.w * 0.1),
      y: Thing.Rand.randInt(props.h * 0.16, props.h * 0.3),
      w: Thing.Rand.randInt(props.w * 0.5, props.w * 1.2),
      h: Thing.Rand.randInt(props.h * 0.01, props.h * 0.1),
      src: getRandImg(imgNamesEyes),
      size: Thing.Rand.randInt(10,30) + '% ',
      repeat: 'repeat',
    });

    // hand imgs
    var hands = Thing.Rand.randItems(imgNamesHands, Thing.Rand.randInt(2,5)).map((imgName, index) => {
      return makeLayer({
        id: 'hand' + index,
        x: Thing.Rand.randInt(props.w * -0.01, props.w * 0.9),
        y: Thing.Rand.randInt(props.h * 0.6, props.h * 0.9),
        w: Thing.Rand.randInt(props.w * 0.05, props.w * 0.2),
        h: Thing.Rand.randInt(props.w * 0.05, props.w * 0.3),
        src: imgPath + imgName,
        size: Thing.Rand.randInt(100,100) + '% ',
      });
    });

    // build boxes for face parts
    var eyeY = props.h * 0.3;
    var eyeRX = props.w * 0.3;
    var eyeLX = props.w * 0.7;
    var eyeW = props.w * 0.30;
    var noseY = props.h * 0.45;
    var noseW = props.w * 0.25;
    var noseH = props.h * 0.3;
    var mouthY = props.h * 0.75;
    var mouthW = props.w * 0.5;
    var mouthH = props.h * 0.2;
    var centerX = props.w * 0.5;
    var eyeR = makeFuzzyImageCascade({
      x: around(0, bigJiggleSize),
      y: around(eyeY, bigJiggleSize),
      w: around(props.w, bigJiggleSize),
      h: around(props.h * 0.1, bigJiggleSize),
      backgroundColor: Rand.randItem(reds),
      images: imgNamesEyes,
    });
    var eyeL = makeFuzzyImageCascade({
      x: around(eyeLX, bigJiggleSize),
      y: around(eyeY, bigJiggleSize),
      w: around(eyeW, bigJiggleSize),
      h: around(mouthH, bigJiggleSize),
      backgroundColor: Rand.randItem(reds),
      images: imgNamesEyes,
      jiggle: bigJiggleSize,
    });
    var nose = makeFuzzyImageCascade({
      x: around(centerX, bigJiggleSize),
      y: around(noseY, bigJiggleSize),
      w: around(noseW, bigJiggleSize),
      h: around(noseH, bigJiggleSize),
      backgroundColor: Rand.randItem(blueColors),
      images: imgNamesNoses,
    });
    var mouth = makeFuzzyImageBox({
      id: 'mouth',
      x: around(centerX, bigJiggleSize),
      y: around(eyeY * 1.8, bigJiggleSize),
      w: around(mouthW, bigJiggleSize),
      h: around(mouthH, bigJiggleSize),
      backgroundColor: highlightFGColor,
      images: imgNamesMouths,
    });
    var hair = Box.make({
    	x: around(props.w * -0.05, bigJiggleSize),
    	y: around(props.h * 0.05, bigJiggleSize),
    	w: around(props.w * 0.7, bigJiggleSize),
    	h: around(props.h * 0.6, bigJiggleSize),
    });
    var hairs = makeImagesForBox(imgNamesHair, hair.getDimensions(), {jiggle: smallJiggleSize, renderOnCenter: false});

    mouth.add(makeBorderBox(mouth, highlightFGColor2, borderWidth(props.w)));
    nose.add(makeBorderBox(nose, Rand.randItem(reds), borderWidth(props.w)));
    eyeR.add(makeBorderBox(eyeR, Rand.randItem(reds), borderWidth(props.w)));
    eyeL.add(makeBorderBox(eyeL, Rand.randItem(reds), borderWidth(props.w)));

    // overall background
    bounds.add(Thing.BGImg.make({
      id: 'overallbg', 
      src: getRandImg(imgNamesBackgrounds)
    }));
    bounds.add(midBGs);
    bounds.add(scatter);
    bounds.add(middleSuit);
    bounds.add(leftSuit);
    bounds.add(rightSuit);
    bounds.add(ties);
    bounds.add(hands);
    bounds.add(twitters);
    bounds.add(eyes);
    bounds.add(bottomMouths);
    bounds.add(mouth);

    Thing.Img.onAllLoaded(function () {
      hair
        .addMask('url(' + hairs[0].src + ')')
        .css({
          backgroundImage: 'url(' + hairs[1].src + ')',
          backgroundSize: '100px 100px',
          width: hairs[0].w + 'px',
          height: hairs[0].h + 'px',
        })
        ;
    	bounds.render();
    });

    return bounds;
  }

  function rebel() {
  	return Thing.Rand.randInt(0, 100) > 90;
  }

  //====================================================================//

  function main() {
    // Respond to page params and key events
    Thing.Page.setScale(pageParams.scale || 1);
    Thing.Page.initEvents();
    Thing.Rand.init(pageParams.randomSeed);

    var powerSuitPortrait = makePowerSuitPortrait({
      x: 0,
      y: 0,
      w: CW,
      h: CH,
    });

    var stage = Thing.Box.make({
      x: 0,
      y: 0,
      w: CW,
      h: CH,
      overflow: 'hidden',
    });

    stage.add([
      powerSuitPortrait,
    ]);

    stage.render();    
  }

  main();
});
