/**
  * Power Suit
**/
$(function(){
  var Thing = window.Thing;

  var pageParams = Thing.Page.getParams();
  var aspectRatio = 1.36;
  var idealWidth = 3600;
  var CW = pageParams.canvasWidth || idealWidth;
  var CH = CW * aspectRatio;
  // var imgPath = 'img/trump/parts/';

  var imgNamesAll = [
    "Flag_of_the_United_States.png",
    "american-flag_bg.jpg",
    "blue_bg.jpg",
    "cnn_blue_red_bg.jpg",
    "cnn_blue_red_f_bg.jpg",
    "eagle_flag_bg.jpg",
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
    "gold_leaf_bg.jpg",
    "hair_1.jpg",
    "hair_2.jpg",
    "hand_left_fist.jpg",
    "hand_left_open_t.png",
    "hand_left_pointing_dark_t.png",
    "hand_right_fist_t.png",
    "hand_right_gun_teal_t.png",
    "hand_right_open_t.png",
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
    "putin_on_tv_bg.png",
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

  var imgNamesBackgrounds = filterStrings(imgNamesAll, '_bg');
      imgNamesBackgrounds.concat([
        'tie_3_bright_crop.jpg',
        'Flag_of_the_United_States.png',
        'hair_1.jpg',
      ]);

  //-----------------------

  function filterStrings(strings, substr) {
    return strings.filter(str => str.includes(substr));
  }

  function makeSwatches1() {
    var bg1 = Thing.BGImg.make({
      src: 'img/trump/swatches/blue_cloth_D7.jpg',
      size: '50% 50%',
      center: true,
      repeat: true,
    });

    var bg2 = Thing.BGImg.make({
      src: 'img/trump/parts/gold_leaf_bg.jpg',
    }).addMask({
      image: 'url(img/trump/twit_logo_blue_t.png)',
      repeat: 'repeat',
      size: '20% 20%',
    });

    var box = Thing.Box.make({
      position: 'relative',
      margin: '20px',
      w: 500,
      h: 500,
      border: '2px solid red',
    }).add([bg1, bg2]);

    return box;
  }

  function makeSwatches2() {
    var bg1 = Thing.BGImg.make({
      src: 'img/trump/parts/gold_leaf_bg.jpg',
      size: '50% 50%',
      center: true,
      repeat: true,
    });

    var bg2 = Thing.BGImg.make({
      src: 'img/trump/parts/gold_leaf_bg.jpg',
    }).addMask({
      image: 'url(img/trump/twit_logo_blue_t.png)',
      repeat: 'repeat',
      size: '20% 20%',
    });

    var box = Thing.Box.make({
      position: 'relative',
      margin: '20px',
      w: 500,
      h: 500,
      border: '2px solid red',
    }).add([bg1, bg2]);

    return box;
  }

  function makeSwatches3() {
    var bg1 = Thing.BGImg.make({
      src: 'img/trump/swatches/gray_pinstripe_cloth_79214-1.jpg',
      size: '50% 50%',
      center: true,
      repeat: true,
    });

    var bg2 = Thing.BGImg.make({
      src: 'img/trump/swatches/blue_cloth_D7.jpg',
    }).addMask({
      image: 'url(img/trump/twit_logo_blue_t.png)',
      repeat: 'repeat',
      size: '20% 20%',
    });

    var box = Thing.Box.make({
      position: 'relative',
      margin: '20px',
      w: 500,
      h: 500,
      border: '2px solid red',
    }).add([bg1, bg2]);

    return box;
  }

  function makeSwatches4() {
    var bg1 = Thing.BGImg.make({
      src: 'img/trump/swatches/navy_blue_cloth_9502-3.jpg',
      size: '50% 50%',
      center: true,
      repeat: true,
    });

    var bg2 = Thing.BGImg.make({
      src: 'img/trump/swatches/blue_cloth_D7.jpg',
      size: '10% 10%',
      repeat: true,
    }).addMask({
      image: 'url(img/trump/twit_logo_blue_t.png)',
      repeat: 'repeat',
      size: '20% 20%',
    });

    var box = Thing.Box.make({
      position: 'relative',
      margin: '20px',
      w: 500,
      h: 500,
      border: '2px solid red',
    }).add([bg1, bg2]);

    return box;
  }

  function makeSwatches5() {
    var bg1 = Thing.BGImg.make({
      src: 'img/trump/swatches/burgundy_tie_cloth.jpg',
      size: '50% 50%',
      center: true,
      repeat: true,
    });

    var bg2 = Thing.BGImg.make({
      src: 'img/trump/swatches/red_silk_tie_2.png',
      size: '10% 10%',
      repeat: true,
    }).addMask({
      image: 'url(img/trump/twit_logo_blue_t.png)',
      repeat: 'repeat',
      size: '20% 20%',
    });

    var box = Thing.Box.make({
      position: 'relative',
      margin: '20px',
      w: 500,
      h: 500,
      border: '2px solid red',
    }).add([bg1, bg2]);

    return box;
  }

  //====================================================================//

  function main() {
    Thing.Page.setup();

    var stage = Thing.Box.make({
      x: 0,
      y: 0,
      w: CW,
      h: CH,
      overflow: 'hidden',
    });

    stage.add([
      makeSwatches1(),
      makeSwatches2(),
      makeSwatches3(),
      makeSwatches4(),
      makeSwatches5(),
    ]);

    stage.render();    
  }

  main();
});
