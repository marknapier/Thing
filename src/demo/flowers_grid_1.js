var Thing = window.Thing;
var Rand = Thing.Rand;
var CW = 3000;
var CH = CW;

$(function () {
  // Respond to page params and key events (inits Rand, has to be first if you pass randomSeed param on url)
  Thing.Page.setup();

  var flowerCount = 0;
  var flowerImages = [
    // 'flo_1.png',
    'flo_3.png',
    'flo_4.png',
    'flo_5.png',
    'flo_6.png',
    'flo_7.png',
    'flo_8.png',
    'flo_9.png',
    'flo_1t.png',
  ];
  var maskImages = [
    'flo_3.png',
    'flo_6.png',
    'flo_8.png',
    'flo_9.png',
    'flo_1t.png',
  ];

  function makeFlowerBunch (props = {x: 0, y: 0, w: 500, h: 1000}) {
    var imgNames = [];
    var filters = [
      'drop-shadow(rgb(255, 255, 20) 120px 20px 8px)', 
      'drop-shadow(rgb(255, 255, 20) 20px 20px 18px)', 
      'drop-shadow(rgb(255, 255, 20) 40px 40px 8px)', 
      'contrast(120)', 
      'brighten(150)', 
      'blur(30px)', 
      undefined,
    ];
    var blendModes = ['difference', 'overlay', 'color-burn', 'color-dodge', 'lighten', 'darken'];

    for (var i=0; i < 4; i++) {
      imgNames.push(Rand.randItem(props.imageNames));
    }

    var imgs = imgNames.map( function (imgName, index) {
      return Thing.Img.make({
        src: 'img/flowers/' + imgName,
        x: 0,
        y: 0,
        w: props.w,
        h: props.h,
        opacity: 0.6 + (Rand.randFloat()*0.9),
        mixBlendMode: Thing.Rand.randItem(blendModes),
        filter: index > 1 ? Thing.Rand.randItem(filters) : undefined,
      });
    });

    return Thing.Box.make({
      id: 'flower_' + flowerCount++,
      display: 'inline-block',
      x: props.x,
      y: props.y,
      w: props.w,
      h: props.h,
    }).add(imgs);
  }

  function makeFlowerBunchMasked(props) {
    return makeFlowerBunch({
      x: props.x,
      y: props.y,
      w: props.w,
      h: props.w,
      imageNames: flowerImages,
    });

    // .addMask({
    //   image: 'url(img/flowers/' + Thing.Rand.randItem(maskImages) + ')',
    //   size: '80% 80%',
    // });
  }

  function makeFourBunches() {
    var half = CW / 2;
    var bunches = [
      makeFlowerBunchMasked({x: 0, y: 0, w: half, h: half}),
      makeFlowerBunchMasked({x: half, y: 0, w: half, h: half}),
      makeFlowerBunchMasked({x: 0, y: half, w: half, h: half}),
      makeFlowerBunchMasked({x: half, y: half, w: half, h: half}),
    ];
    bunches.forEach((b) => {
      b.$element.on('click', function (e) {
        window.console.log('click', b.id);
        randomChanges(b);
        e.stopPropagation();
      });
    });
    return bunches;
  }

  function randomChanges(flowerBunch) {
    flowerBunch.rotate({z: Rand.randInt(-300, 300)});
    flowerBunch.each(function (flo) {
      flo.rotate({z: Rand.randInt(-300, 300)});
      flo.css({opacity: Rand.randFloat(0.2, 1.4)});
    });
  }

  function makeFourBackgrounds() {
    var half = CW / 2;
    var bgColors = [
      '#fc0',
      '#cf0',
      '#0d0',
      '#0cc',
      '#fd',
      '#3f3',
      '#f3ff',
      '#33f',
    ];
    return [
      Thing.make({x: 0, y: 0, w: half, h: half, backgroundColor: Thing.Rand.pickItem(bgColors)}),
      Thing.make({x: half, y: 0, w: half, h: half, backgroundColor: Thing.Rand.pickItem(bgColors)}),
      Thing.make({x: 0, y: half, w: half, h: half, backgroundColor: Thing.Rand.pickItem(bgColors)}),
      Thing.make({x: half, y: half, w: half, h: half, backgroundColor: Thing.Rand.pickItem(bgColors)}),
    ];
  }
  // start

  Thing.Box.make({
    w: CW,
    h: CH,
    cursor: 'pointer',
  })
  .add(makeFourBackgrounds())
  .add(makeFourBunches())
  .render();

  $('body').on('click', randomChanges);
});
