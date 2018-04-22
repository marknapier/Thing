$(function () {
  var Thing = window.Thing;
  var Rand = Thing.Rand;
  var pageParams = Thing.Page.getParams();
  var aspectRatio = 0.6666;
  var idealWidth = 3600;
  var CW = pageParams.canvasWidth || idealWidth;
  var CH = CW * aspectRatio;

  var imageNames = [
    '15BTAA92FS9MMMDNTHNG_is.png',
    '15z_CZ75B9mm_L_91102_01102.png',
    '15z_CZ75B9mm_L_91102_01102_r.png',
    '16z_CZP10_R.png',
    '16z_CZP10_R_r.png',
    '37184-DEFAULT-l.png',
    '472.png',
    '647227_ts.png',
    'Citadel_1911_Officer_Classic_Wood_High_Res-1024x1024.png',
    'Dan-Wesson-Razorback-RZ-10mm-Stainless-Cocobolo.png',
    'FN_509_Rotators-1800x1275.png',
    'Glock-22-Gen4-Handgun.png',
    'Glock-22-Gen4-Handgun_r.png',
    'HK-P30LS-V3-Dasa-9mm-left.png',
    'KWCKMB-15AHKS.png',
    'Kelloggs_pistol.png',
    'Ruger-Security-9-3.png',
    'SHB0118_HND01.png',
    'SHB0118_HND01_r.png',
    'Swedish-Pistol-Lahti-m-40-open.png',
    'barret_hand_gun.png',
    'cz-usa-cz-p-071.png',
    'revolver_1.png',
    'rm380-rightview.png',
  ];

  function makeImageBunch (props = {x: 0, y: 0, w: 500, h: 1000}) {
    var imgNames = [];
    var numImages = 25;
    for (var i=0; i < numImages; i++) {
      imgNames.push(Rand.randItem(props.imageNames));
    }

    var imgs = imgNames.map( function (imgName, index) {
      return Thing.Img.make({
        src: 'img/guns/' + imgName,
        x: 0,
        y: 0,
        w: props.w,
        h: props.h,
        opacity: index > (numImages - 2) ? 0.2 + (Rand.randFloat()*0.3) : 0.4 + (Rand.randFloat()*0.4),
        mixBlendMode: Thing.Rand.randItem(['difference', 'overlay', 'color-burn', 'color-dodge', 'lighten', 'darken']),
        // filter: index > 1 ? 'drop-shadow(rgb(255, 255, 20) 10px 10px 8px)' : undefined,
      });
    });

    return Thing.Box.make({
      id: 'imageBunch',
      x: props.x,
      y: props.y,
      w: props.w,
      h: props.h,
    }).add(imgs);
  }

  function makeImageBunchMasked() {
    return makeImageBunch({
      x: 0,
      y: 0,
      w: CW,
      h: CH,
      imageNames: imageNames,
    });
  }

  function main() {
    function randomChanges() {
      imageBunch.each(function (img) {
        img.css({opacity: Rand.randFloat(0.2, 1.4)});
      });
    }

    // Respond to page params and key events
    Thing.Page.setScale(pageParams.scale || 1);
    Thing.Page.initEvents();
    Thing.Rand.init(pageParams.randomSeed);

    var imageBunch = makeImageBunchMasked();
    var spacer = (window.innerHeight - CH) / 2;

    // put this color on body - it won't be factored into image blend modes
    document.body.style.backgroundColor = '#ff7c00';  // #12ef5c
    document.body.style.backgroundImage = 'linear-gradient(10deg, rgba(255, 55, 0, 0.16) 87%, rgba(250, 245, 0, 0.16) 100%)';

    Thing.Box.make({
      position: 'relative',
      padding: '25% 45%',
      w: CW,
      h: CH,
    })
    .add(
      Thing.Box.make({
        id: 'outerbox',
        w: CW,
        h: CH,
        cursor: 'pointer',
      })
      .add(imageBunch)
    )
    .render();

    $('body').on('click', randomChanges);
  }

  // start
  main();

});
