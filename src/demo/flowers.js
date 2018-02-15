$(function () {
  var Thing = window.Thing;
  var Rand = Thing.Rand;
  var CW = 800;
  var CH = CW;
  var flowerImages = [
    'flo_1.png',
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
        mixBlendMode: Thing.Rand.randItem(['difference', 'overlay', 'color-burn', 'color-dodge', 'lighten', 'darken']),
        filter: index > 1 ? 'drop-shadow(rgb(255, 255, 20) 10px 10px 8px)' : undefined,
      });
    });

    return Thing.Box.make({
      x: props.x,
      y: props.y,
      w: props.w,
      h: props.h,
    }).add(imgs);
  }

  function makeFlowerBunchMasked() {
    return makeFlowerBunch({
      x: 0,
      y: 0,
      w: CW,
      h: CH,
      imageNames: flowerImages,
    }).addMask({
      image: 'url(img/flowers/' + Thing.Rand.randItem(maskImages) + ')',
      size: '100% 100%',
    });
  }

  function randomChanges() {
    flowerBunch.rotate({z: Rand.randInt(-300, 300)});
    flowerBunch.each(function (flo) {
      flo.rotate({z: Rand.randInt(-300, 300)});
      flo.css({opacity: Rand.randFloat(0.2, 1.4)});
    });
  }

  // start

  var flowerBunch = makeFlowerBunchMasked();
  var spacer = (window.innerHeight - CH) / 2;

  Thing.Box.make({
    w: CW,
    h: CH,
    position: 'relative',
    margin: spacer + 'px auto',
    cursor: 'pointer',
  })
  .add(flowerBunch)
  .render();

  $('body').on('click', randomChanges);
});
