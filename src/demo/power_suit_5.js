/**
  * Power Suit 4
  * 
  * Thing-power_suit_4-html-20180930-214746.png is randomSeed=1538358311135
  * Thing-power_suit_4-html-20181006-160751.png is randomSeed=1538856113037
  * Thing-power_suit_4-html-20181006-164130.png is randomSeed=1538858171902
  * Thing-power_suit_4-html-20181007-103909_crown.png is randomSeed=1538874150053 (with some tweaks to hands)
  * Thing-power_suit_4-html-20181007-105255_crown.png is randomSeed=1538923794635
  *
  The daily Trump
  Image of fascist leader hangs in public square
  reinforces cult of personality
  celebrates the ego of a supreme leader
  TKOTI - The King Of The Internet
  The current king created by and for social media - a twitter troll leads the country
  Aligned with religious rule. Perceived by the Christian right as a leader ordained by god.
**/
$(function(){
  var tinycolor = window.tinycolor;
  var Thing = window.Thing;
  var Rand = Thing.Rand;
  var Box = Thing.Box;

  var pageParams = Thing.Page.getParams();
  var aspectRatio = 1.28;   // 0.78  1.28
  var idealWidth = 3600;
  var CW = parseInt(pageParams.canvasWidth) || idealWidth;
  var CH = CW * aspectRatio;
  var imgPath = 'img/trump/parts/';

  var tweets = [  
    {
      "text":"“8X more new manufacturing jobs now than with Obama.” @FoxNews  @cvpayne",
      "created_at":"Tue Oct 16 13:08:24 +0000 2018",
      "id_str":"1052184484941049857"
    },
    {
      "text":"“Op-Ed praises Trump Administrations efforts at the Border.” @FoxNews  The  Washington Examiner States, “Finally, the government has taken steps to stop releasing unaccompanied minors to criminals and traffickers.” This was done by the Obama Administration!",
      "created_at":"Tue Oct 16 12:55:38 +0000 2018",
      "id_str":"1052181272137801728"
    },
    {
      "text":"“We can’t secure the Border because of the Democrats historic level of Obstruction. The Presidents fed up with this. His agenda is working. The economy is growing at twice the rate it did under Obama. We’ve nominated and confirmed 68 Federal Judges, 26 Court of Appeals Judges....",
      "created_at":"Thu Sep 20 11:32:58 +0000 2018",
      "id_str":"1042738383720726528"
    },
    {
      "text":"“A lot of small &amp; medium size enterprises are registering very good profit, sometimes record profits-there stocks are doing very well, low income workers are getting big raises. There are an awful lot of good things going on that weren’t during Pres. Obama’s Watch.” Peter Morici",
      "created_at":"Mon Sep 17 10:01:30 +0000 2018",
      "id_str":"1041628201435521024"
    },
    {
      "text":"Consumer Sentiment hit its highest level in 17 years this year. Sentiment fell 11% in 2015, an Obama year, and rose 16% since the Election, #TrumpTime!",
      "created_at":"Mon Sep 17 01:06:27 +0000 2018",
      "id_str":"1041493551446675456"
    },
    {
      "text":"Exclusive -- Donald Trump Jr. to Obama: My Dad Fixed the Economy You Could Not https://t.co/HXuSBGFmf2 via @BreitbartNews",
      "created_at":"Sun Sep 16 02:27:07 +0000 2018",
      "id_str":"1041151464046043137"
    },
    {
      "text":"When President Obama said that he has been to “57 States,” very little mention in Fake News Media. Can you imagine if I said that...story of the year! @IngrahamAngle",
      "created_at":"Sat Sep 15 03:08:11 +0000 2018",
      "id_str":"1040799409670377472"
    },
    {
      "text":"“President Trump would need a magic wand to get to 4% GDP,” stated President Obama. I guess I have a magic wand, 4.2%, and we will do MUCH better than this! We have just begun.",
      "created_at":"Mon Sep 10 14:42:34 +0000 2018",
      "id_str":"1039162221492928513"
    },
    {
      "text":"“Barack Obama talked a lot about hope, but Donald Trump delivered the American Dream. All the economic indicators, what’s happening overseas, Donald Trump has proven to be far more successful than Barack Obama. President Trump is delivering the American Dream.” Jason Chaffetz",
      "created_at":"Sun Sep 09 13:32:04 +0000 2018",
      "id_str":"1038782091629088768"
    },
    {
      "text":"“Barrack Obama talked a lot about hope, but Donald Trump delivered the American Dream. All the economic indicators, what’s happening overseas, Donald Trump has proven to be far more successful than Barrack Obama. President Trump is delivering the American Dream.” Jason Chaffetz",
      "created_at":"Sun Sep 09 13:10:27 +0000 2018",
      "id_str":"1038776649171578880"
    },
    {
      "text":"Two long running, Obama era, investigations of  two very popular Republican Congressmen were brought to a well publicized charge, just ahead of the Mid-Terms, by the Jeff Sessions Justice Department. Two easy wins now in doubt because there is not enough time. Good job Jeff......",
      "created_at":"Mon Sep 03 18:25:25 +0000 2018",
      "id_str":"1036681588573130752"
    },
    {
      "text":"“You have a Fake Dossier, gathered by Steele, paid by the Clinton team to get information on Trump. The Dossier is Fake, nothing in it has been verified. It then filters into our American court system in order to spy on Barrack Obama and Hillary Clinton’s political opponent......",
      "created_at":"Sat Sep 01 13:19:20 +0000 2018",
      "id_str":"1035879783547199488"
    },
    {
      "text":".@Rasmussen_Poll just came out at 48% approval rate despite the constant and intense Fake News. Higher than Election Day and higher than President Obama. Rasmussen was one of the most accurate Election Day polls!",
      "created_at":"Sat Sep 01 02:25:38 +0000 2018",
      "id_str":"1035715271418413056"
    },
    {
      "text":"“The Obama people did something that’s never been done...They spied on a rival presidential campaign. Would it be OK if Trump did it next? I am losing faith that our system is on the level. I’m beginning to think it is rotten &amp; corrupt. Scary stuff Obama did.” @TuckerCarlson  DOJ",
      "created_at":"Wed Aug 29 12:12:38 +0000 2018",
      "id_str":"1034775835004358656"
    },
    {
      "text":"“Mainstream Media tries to rewrite history to credit Obama for Trump accomplishments. Since President Trump took office, the economy is booming. The stronger the economy gets, the more desperate his critics are. O had weakest recovery since Great Depression.” @WashTimes",
      "created_at":"Sun Aug 26 22:01:33 +0000 2018",
      "id_str":"1033836873473568768"
    },
    {
      "text":"Michael Cohen plead guilty to two counts of campaign finance violations that are not a crime. President Obama had a big campaign finance violation and it was easily settled!",
      "created_at":"Wed Aug 22 13:37:34 +0000 2018",
      "id_str":"1032260490439864320"
    },
    {
      "text":"Fake News, of which there is soooo much (this time the very tired New Yorker) falsely reported that I was going to take the extraordinary step of denying Intelligence Briefings to President Obama. Never discussed or thought of!",
      "created_at":"Tue Aug 21 11:10:49 +0000 2018",
      "id_str":"1031861173149413376"
    },
    {
      "text":"Presidential Approval numbers are very good - strong economy, military and just about everything else. Better numbers than Obama at this point, by far. We are winning on just about every front and for that reason there will not be a Blue Wave, but there might be a Red Wave!",
      "created_at":"Sun Aug 05 20:01:17 +0000 2018",
      "id_str":"1026196465696350208"
    },
    {
      "text":"..Because of Tariffs we will be able to start paying down large amounts of the $21 Trillion in debt that has been accumulated, much by the Obama Administration, while at the same time reducing taxes for our people. At minimum, we will make much better Trade Deals for our country!",
      "created_at":"Sun Aug 05 12:06:25 +0000 2018",
      "id_str":"1026076959980302336"
    },
    {
      "text":"....Also, why is Mueller only appointing Angry Dems, some of whom have worked for Crooked Hillary, others, including himself, have worked for Obama....And why isn’t Mueller looking at all of the criminal activity &amp; real Russian Collusion on the Democrats side-Podesta, Dossier?",
      "created_at":"Sun Jul 29 20:20:39 +0000 2018",
      "id_str":"1023664624259014656"
    },
  ];

  var allItems = [
      { item:"Flag_of_the_United_States.png", attribs:['bg', 'flag', 'blue', 'red', 'accent'] },
      { item:"american-flag_bg.jpg", attribs:['bg', 'pin', 'flag', 'blue', 'red', 'accent'] },
      { item:"blue_bg.jpg", attribs:['bg', 'blue'] },
      { item:"cnn_blue_red_bg.jpg", attribs:['bg', 'blue'] },
      { item:"cnn_blue_red_f_bg.jpg", attribs:['bg', 'red'] },
      { item:"eagle_flag_bg.jpg", attribs:['bg', 'flag', 'accent'] },
      { item:"eye_left_1.jpg", attribs:['pin', 'eye'] },
      { item:"eye_right_1.jpg", attribs:['eye'] },
      { item:"eyes_1.jpg", attribs:['eye'] },
      { item:"eyes_pixelated.jpg", attribs:['eye'] },
      { item:"eye_left_pixelated_1.png", attribs:['eye'] },
      { item:"eye_right_pixelated_1.png", attribs:['eye'] },
      { item:"eye_right_side_up_1.png", attribs:['eye'] },
      { item:"eye_left_side_1.png", attribs:['eye'] },
      { item:"eye_right_side_1.png", attribs:['eye'] },
      { item:"eye_left_side_up_1.png", attribs:['eye'] },
      { item:"face_left_half.jpg", attribs:['face'] },
      { item:"face_right_half_1.jpg", attribs:['face'] },
      { item:"face_right_side_orange_teal.jpg", attribs:['face'] },
      { item:"flag_flat_bg.jpg", attribs:['bg', 'pin', 'flag', 'red'] },
      { item:"flag_flat_bg_1.jpg", attribs:['bg', 'pin', 'flag', 'red'] },
      { item:"flag_hanging_bg.jpg", attribs:['pin', 'flag', 'blue', 'accent'] },  //!! ugly bg
      { item:"flag_hanging_gold_cord_bg.jpg", attribs:['bg', 'pin', 'flag', 'blue', 'dark', 'accent'] },
      { item:"flag_pin_1.jpg", attribs:['pin', 'bg', 'flag', 'blue'] },
      { item:"flag_stripes_bg.jpg", attribs:['bg', 'pin', 'flag'] },
      { item:"gold_leaf_bg_bright.png", attribs:['bg', 'yellow'] },
      { item:"hair_1.jpg", attribs:['bg', 'hair', 'yellow'] },
      { item:"hair_2.jpg", attribs:['hair', 'yellow'] },
      { item:"hair_detail_1.png", attribs:['hair', 'yellow'] },
      { item:"trump_hair_sideburns_t.png", attribs:['hair', 'yellow'] },
      { item:"hand_left_fist_t.jpg", attribs:['hand', 'left'] },
      { item:"hand_left_open_t.png", attribs:['hand', 'left'] },
      { item:"hand_left_pointing_dark_t.png", attribs:['hand', 'left'] },
      { item:"hand_right_fist_t.png", attribs:['hand', 'right'] },
      { item:"hand_right_gun_teal_t.png", attribs:['hand', 'right'] },
      { item:"hand_right_open_t.png", attribs:['hand', 'right'] },
      { item:"hand_right_thumbsup.jpg", attribs:['hand', 'right'] },
      { item:"head_left_side_1.jpg", attribs:['head'] },
      { item:"lapel_left_columns_1.jpg", attribs:['suit', 'left'] },
      { item:"lapel_left_full_t.png", attribs:['suit', 'left'] },
      { item:"lapel_left_flag.jpg", attribs:['flag', 'suit', 'blue', 'left'] },
      { item:"lapel_left_pixelated.jpg", attribs:['suit', 'blue', 'left'] },
      { item:"lapel_right_flag.jpg", attribs:['flag', 'suit', 'right', 'blue'] },
      { item:"lapel_right_full_t.png", attribs:['suit', 'right', 'blue'] },
      { item:"lapel_right_pixelated.jpg", attribs:['suit', 'right', 'blue'] },
      { item:"mouth_closed_1.jpg", attribs:['mouth'] },
      { item:"mouth_closed_2.jpg", attribs:['mouth'] },
      { item:"mouth_open_1.jpg", attribs:['pin', 'mouth'] },
      { item:"mouth_open_pixelated.jpg", attribs:['pin', 'mouth'] },
      { item:"mouth_smile_1.jpg", attribs:['pin', 'mouth'] },
      { item:"mouth_shut_side_up_1.png", attribs:['mouth'] },
      { item:"nose_1.jpg", attribs:['nose'] },
      { item:"nose_2_pixelated.jpg", attribs:['nose'] },
      { item:"nose_side_up_1.png", attribs:['nose'] },
      { item:"pixelated_blue_bg.jpg", attribs:['bg', 'blue'] },
      { item:"putin_on_tv_bg.png", attribs:['bg', 'accent'] },
      { item:"senate_columns_bg.jpg", attribs:['bg', 'pin'] },
      { item:"suit_full_frontal.jpg", attribs:['suit', 'full'] },
      { item:"suit_full_frontal_hands_t.png", attribs:['suit', 'full'] },
      { item:"suit_right_sunlit_t.png", attribs:['suit', 'right'] },
      { item:"suit_right_navy_t.png", attribs:['suit', 'right'] },
      { item:"suit_left_navy_t.png", attribs:['suit', 'left'] },
      { item:"teal_wavy_bg.jpg", attribs:['bg', 'blue', 'light'] },
      { item:"tie_1.jpg", attribs:['tie', 'red'] },
      { item:"tie_2.jpg", attribs:['tie', 'red'] },
      { item:"tie_3_bright.jpg", attribs:['tie', 'red'] },
      { item:"tie_3_bright_crop.jpg", attribs:['tie', 'red'] },
      { item:"tie_4.jpg", attribs:['tie', 'red'] },
      { item:"tie_5_full.jpg", attribs:['tie', 'red'] },
      { item:"tie_long_t.png", attribs:['tie', 'red'] },
      { item:"tie_alone_t.png", attribs:['tie', 'red'] },
      { item:"extra_long_tie_1.png", attribs:['tie', 'red', 'red'] },
      { item:"extra_long_tie_1_t.png", attribs:['tie', 'red', 'red'] },
      { item:"tie_striped_red_lapels_1_t.png", attribs:['tie', 'suit', 'red'] },
      { item:'tiki_torch_lit_t_1.png', attribs:['accent'] },
      { item:"melania_blue_dress_1.png", attribs:['accent', 'blue'] },
      { item:"american_flag_on_stand_t.png", attribs:['bg', 'accent', 'red'] },
      { item:"kim-jong-un-with-missile.png", attribs:['bg', 'accent', 'blue'] },
      { item:"oval_office.png", attribs:['bg', 'yellow'] },
      { item:'blue_with_light_edge.png', attribs:['bg', 'blue'] },
      { item:'USA_flag_starfield_seamless.png', attribs:['bg', 'pin', 'flag', 'blue'] },
      { item:'USA_flag_stripes.png', attribs:['bg', 'flag', 'red', 'accent'] },
      { item:'russian_flag.png', attribs:['bg', 'flag', 'blue', 'red'] },
      { item:'Five_Pointed_Star_Solid_blue.png', attribs:['bg', 'blue', 'accent'] },
      { item:'pure-silk-navy-red-repp-tie_1.png', attribs:['bg', 'blue', 'red'] },
      { item:'gold_leaf_crackled.png', attribs:['bg', 'yellow', 'accent'] },
      { item:'storm_clouds_icon.png', attribs:['blue', 'accent'] },
      

  ];

  function getItems(items, attribute) {
      return items.filter((row) => {
          return row.attribs.some(attrib => attrib === attribute);
      });
  }

  function getItemsThatAre(attributes = []) {
      var selectedRows = getItems(allItems, attributes[0]).filter((row) => {
          return attributes.every(attrib => row.attribs.includes(attrib));
      });
      return selectedRows.map(row => row.item);
  }

  var imgNamesToScatter = getItemsThatAre(['accent']);
  var imgNamesEyes = getItemsThatAre(['eye']);
  var imgNamesMouths = getItemsThatAre(['mouth']);
  var imgNamesNoses = getItemsThatAre(['nose']);
  var imgNamesHair = getItemsThatAre(['hair']);
  var imgNamesHands = getItemsThatAre(['hand']);
  var imgNamesBackgrounds = getItemsThatAre(['bg']);
  var imgNamesTies = getItemsThatAre(['tie']);
  var imgNamesLapelsLeft = getItemsThatAre(['suit', 'left']);
  var imgNamesLapelsRight = getItemsThatAre(['suit', 'right']);
  var imgNamesSuits = getItemsThatAre(['suit', 'full']);
  var imgNamesPins = getItemsThatAre(['pin']);

  //-----------------------

  // function filterStrings(strings, substr) {
  //   return strings.filter(str => str.includes(substr));
  // }

  // return a number in a random distribution +- maxDistance from num
  function jiggle (num, maxDistance = 0) {
    return num + (Thing.Rand.randFloat(-1, 1) * maxDistance);
  }

  // return a number in a normal distribution around the given value
  function around(val, distance=540) {
    return val + (Thing.Rand.randNormal() * distance);
  }

  function makeBubbleArrow (bubbleX, bubbleY, targetX, targetY, color, text, shorten, z=100, r=100) {
    z = z || 2200;

    var lineWidth = r * 0.1;

    var l = Thing.Line.make({
      x: bubbleX,
      y: bubbleY,
      x2: targetX,
      y2: targetY,
      z: z,
      color: color,
      lineWidth: lineWidth,
      arrow: true,
      shorten: shorten,
      boxShadow: '0px 0px 9px -1px rgba(10,20,0,0.75)'
    });

    var c = Thing.Circle.make({
      text: text || '' + Thing.Rand.randInt(1, 67),
      x: bubbleX,
      y: bubbleY,
      z: z+1,
      r: r,
      fontSize: (r * 0.8) + 'px',
      color: '#0f0',
      boxShadow: '0px 0px 9px 0px rgba(10,20,0,0.75)',
      borderColor: color,
      borderWidth: lineWidth,
      backgroundColor: '#00000099',
    });

    return [l,c];
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

  function makeBorderBox(props = {}) {
    var jiggle = Rand.randFloat(0.9, 1.1);
    var amount = props.box.w * 0.1;
    return Thing.make({
      id: props.id,
      x: amount * Rand.randFloat(-1.0, 1.0),  // position box + or - the jiggle
      y: amount * Rand.randFloat(-1.0, 1.0),
      w: props.box.w * jiggle,
      h: props.box.h * jiggle,
      border: props.width + 'px solid ' + props.color
    });
  }

  function borderWidth (canvasWidth) {
    return (canvasWidth * 0.0016) * (Rand.randBoolean(45) ? 4 : 1);
  }

  function makeTextCascade(props) {
    var x = props.x;
    var y = props.y;
    var z = props.z;
    var count = 1;
    var offx = props.w * 0.014;
    var offy = props.h * 0.0217;
    var labels = props.texts.map(text => {
      var l = Thing.Label.make({
        id: props.id + '-' + count,
        fontSize: (props.w * 0.016) + 'px',
        color: '#0f0',
        text: text,
        x: x,
        y: y,
        z: z,
        w: (props.w * 0.1),
      });
      x += offx;
      y += offy;
      z += 1;
      count += 1;
      return l;
    });
    return labels;
  }

  function makeTweetCascade(props) {
    return makeTextCascade({
      id: 'tweets',
      texts: props.tweets.map(tweet => JSON.stringify(tweet)),
      x: props.w * 0.55,
      y: props.h * 0.25,
      z: props.z,
      w: props.w,
      h: props.h,
    });
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
    var b = Box.make({
      id: props.id,
      x: props.x,
      y: props.y,
      z: props.z,
      w: props.w,
      h: props.h,
      backgroundColor: props.backgroundColor,
      renderOnCenter: true,
    })
    .add(makeImagesForBox(props.images, {w:props.w, h:props.h}, {jiggle: props.jiggle, renderOnCenter: true}));
    return b;
  }

  function makeFuzzyImageCascade (props) {
    var b = Box.make({
      id: props.id,
      x:props.x,
      y:props.y,
      w:props.w,
      h:props.h,
      backgroundColor:props.backgroundColor,
      renderOnCenter:true
    })
    .add(makeImageCascadeForBox(props.images, {w:props.w, h:props.h}, {jiggle: props.jiggle, renderOnCenter: true}));
    return b;
  }

  function makeMouthGrid(props) {
    return Thing.Box.make({
      x: props.x,
      y: props.y,
      w: props.w,
      h: props.h,
      backgroundColor: Thing.Rand.randItem(props.colors),
    })
    .add([
      Thing.BGImg.make({
        url: 'url(' + imgPath + Thing.Rand.randItem(props.imgNames) + ')',
        size: '20% 15%',
        repeat: 'repeat',
        mixBlendMode: 'normal'
      }),
      Thing.BGImg.make({
        url: 'url(' + imgPath + Thing.Rand.randItem(props.imgNames) + ')',
        size: '80% 60%',
        position: 'center',
        mixBlendMode: 'hard-light'
      }),
    ]);
  }

  function randomArray(array = [], howmany = 10) {
    var a = [];
    for (var i=0; i < howmany; i++) {
      a.push(Thing.Rand.randItem(array));
    }
    return a;
  }

  function makeFan(props) {
    Thing.Img.loadImages(props.images, function (imgs) {
      imgs.forEach(function (img) {
        // img.translateTo(props.x, props.y, props.z);
        // img.transform();
        props.container.add(img);
      });
      props.container.render();
    });
  }

  function makeImgArray(props = {imgNames: []}) {
    return props.imgNames.map((imgName /*, index */) => {
      return Thing.Img.make({
        src: imgPath + imgName,
        w: props.w,
        position: 'relative',
      });
    });
  }

  function makeImgArrayScroll(props) {
    var eyeImgs = makeImgArray({
      imgNames: props.imgNames,
      w: props.w,
    });
    var eyeImgBox = Thing.Box.make($.extend({
      overflowX: 'hidden',
      overflowY: 'scroll',
    }, props)).add(eyeImgs);

    setTimeout(function () {
      eyeImgBox.$element.scrollTop(props.h * Thing.Rand.randInt(1, 5));
    }, 1000);

    return eyeImgBox;
  }

  function getRandImg(imageNames) {
    return imgPath + Thing.Rand.randItem(imageNames);
  }

  function makeLayer(props, dim = {}) {
    return Thing.Box.make({
      id: props.id,
      x: dim.x || props.x,
      y: dim.y || props.y,
      z: props.z,
      w: dim.w || props.w,
      h: dim.h || props.h,
      opacity: props.opacity,
      renderOnCenter: props.renderOnCenter,
      transformOrigin: props.transformOrigin,
      rotate: props.rotate,
      filter: props.filter,
    })
    .add(Thing.BGImg.make({
      src: props.src,
      repeat: true,
      size: props.size,
      center: props.center,
      backgroundPosition: props.backgroundPosition,
    }));
  }

  function makeHorizontalStripDimensions(props = {w:1000, h:3000}) {
    var dim = {};
    dim.x = Thing.Rand.randInt(props.w * 0.0, props.w * 0.1);
    dim.y = Thing.Rand.randInt(props.h * 0.16, props.h * 0.3);
    dim.w = Thing.Rand.randInt(props.w * 0.5, props.w * 1.2);
    dim.h = Thing.Rand.randInt(props.h * 0.01, props.h * 0.1);
    return dim;
  }

  // function makeHorizontalRectDimensions(props = {w:1000, h:3000}) {
  //   var dim = {};
  //   dim.x = Thing.Rand.randInt(props.w * 0.0, props.w * 0.1);
  //   dim.y = Thing.Rand.randInt(props.h * 0.0, props.h * 0.2);
  //   dim.w = Thing.Rand.randInt(props.w * 0.3, props.w * 0.8);
  //   dim.h = Thing.Rand.randInt(props.h * 0.1, props.h * 0.3);
  //   return dim;
  // }

  function makeTwitters(props = {}) {
    // make a set of 2 to 10 images
    var imageSet = Thing.Rand.randItems(imgNamesPins, Thing.Rand.randInt(2,20));
    // more images => smaller size and closer together
    var scaleFactor = (2 / imageSet.length); // range from 1 to .1
    var imageSize = (props.w * 0.8) * scaleFactor;
    var jiggleAmount = (props.w * 0.7) * (scaleFactor * 3); // jiggle less when meny twits (cluster them)
    // position twitter cluster to the right or left, not dead center
    var x = (props.w / 2) + (Thing.Rand.randInt(props.w * 0.2, props.w * 0.4) * (Thing.Rand.randBoolean() ? 1 : -1));
    var y = Thing.Rand.randInt(props.h * 0.1, props.h * 0.3);

    // build the twit flock
    return imageSet.map((imgName, index) => {
      var jiggledSize = around(imageSize, imageSize * 0.6);
      return Thing.Box.make({  // make a container
        id: 'twitter' + index,
        x: around(x, jiggleAmount),
        y: jiggle(y, jiggleAmount),
        z: around(props.z, 50),
        w: jiggledSize,
        h: jiggledSize,
      })
      .add(Thing.Img.make({  // put a twit image underneath...
        src: imgPath + 'twit_logo_blue_crop_t.png',
        w: jiggledSize,
        filter: 'drop-shadow(#00006677 0px 0px ' + Math.round(props.w * 0.0013) + 'px)', // with a slight blue outline
      }))
      .add(
        Thing.BGImg.make({   // put a background pattern masked in a twit image on top
          src: imgPath + imgName,
          repeat: false,
          size: '100% 100%',
        }).addMask({
          image: 'url(' + imgPath + 'twit_logo_blue_crop_t.png' + ')',
          size: '100% 100%',
          repeat: 'repeat',
        })
      );
    });
  }

  function makeTwitterField(props = {}) {
    return makeLayer({
      id: 'twitterfield',
      x: Thing.Rand.randInt(props.w * -0.05, props.w * 0.1),
      y: Thing.Rand.randInt(props.h * -0.05, props.h * 0.1),
      z: 5,
      w: Thing.Rand.randInt(props.w * 0.4, props.w * 1.5),
      h: Thing.Rand.randInt(props.w * 0.85, props.w * 1.5),
      src: imgPath + Thing.Rand.randItem(imgNamesBackgrounds),
      size: 'cover',
      repeat: true,
      opacity: 0.3,
    }).addMask({
      image: 'url(' + imgPath + 'twit_logo_blue_t.png' + ')',
      size: Thing.Rand.randInt(2,15) + '%',
      repeat: 'repeat',
    });
  }

  function makeScatterImages(props) {
    return Thing.Rand.randItems(imgNamesToScatter, Thing.Rand.randInt(5,9)).map((imgName, index) => {
      var leftside = Thing.Rand.randBoolean();
      var xyRange = leftside ? [-0.05, 0.25, 0.1, 0.45] : [0.6, 0.9, 0.4, 0.8];
      return makeLayer({
        id: 'scatter' + index,
        x: Thing.Rand.randInt(props.w * xyRange[0], props.w * xyRange[1]),
        y: Thing.Rand.randInt(props.h * xyRange[2], props.h * xyRange[3]),
        z: props.z + around(150, 40),
        w: Thing.Rand.randInt(props.w * 0.05, props.w * 0.3),
        h: Thing.Rand.randInt(props.h * 0.1, props.h * 0.5),
        src: imgPath + imgName,
        size: Thing.Rand.randInt(10,110) + '% ', // + Thing.Rand.randInt(10,100) + '%',
        repeat: 'repeat',
      });
    });
  }

  function makeSwatchesBlueTwitter(props) {
    var bg0 = Thing.BGImg.make({
      src: imgPath + 'lapel_right_full_t.png',
      size: '100% 100%',
      center: true,
      repeat: false,
    });

    // var bg1 = Thing.BGImg.make({
    //   src: 'img/trump/swatches/navy_blue_cloth_9502-3.jpg',
    //   size: '50% 50%',
    //   center: true,
    //   repeat: true,
    //   opacity: 0.5,
    // });

    var bg2 = Thing.BGImg.make({
      src: imgPath + Thing.Rand.randItem(['gold_leaf_bg_bright.png', 'pure-silk-navy-red-repp-tie_1.png']),
      size: '5% 5%',
      repeat: true,
      opacity: 0.8,
    }).addMask({
      image: 'url(' + imgPath + 'twit_logo_blue_t.png)',
      repeat: 'repeat',
      size: '10% 5%',
    });

    var box = Thing.Box.make({
      id: 'suit-patterned',
      margin: '20px',
      x: props.x,
      y: props.y,
      z: props.z,
      w: props.w,
      h: props.h,
      border: (CW * Thing.Rand.randFloat(0.013, 0.025)) + 'px solid #00ff37',
      mask: {image: 'url(' + imgPath + 'lapel_right_full_t.png)'},
    }).add([bg0, bg2]);

    return box;
  }

  function makeLines(props) {
    return [
      // midline vertical
      Thing.Line.make({
        x: props.w * 0.5,
        y: 0,
        x2: props.w * 0.5,
        y2: props.h,
        z: props.z,
        lineWidth: props.w * 0.002,
        color: 'transparent',
        backgroundImage: 'linear-gradient(90deg, transparent 50%, ' +'#00ff0077'+ ' 50%)',
        backgroundSize: (props.w * 0.005) + 'px',
      }),
      // top quarter
      Thing.Label.make({
        fontSize: (props.w * 0.016) + 'px',
        color: '#0f0',
        text: '25% CH=' + props.h,
        x: props.w * 0.5,
        y: props.h * 0.25,
        z: props.z,
      }),
      // top quarter
      Thing.Line.make({
        x: 0,
        y: props.h * 0.25,
        x2: props.w,
        y2: props.h * 0.25,
        z: props.z,
        lineWidth: props.w * 0.002,
        color: '#0ff',
        backgroundImage: 'linear-gradient(90deg, transparent 50%, ' +'#000'+ ' 50%)',
        backgroundSize: (props.w * 0.0333) + 'px'
      }),
      // top third
      Thing.Line.make({
        x: 0,
        y: props.h * 0.33333,
        x2: props.w,
        y2: props.h * 0.33333,
        z: props.z,
        lineWidth: props.w * 0.002,
        color: 'transparent',
        backgroundImage: 'linear-gradient(90deg, transparent 50%, ' +'#0f0'+ ' 50%)',
        backgroundSize: (props.w * 0.055) + 'px'
      }),
      // bottom third
      Thing.Line.make({
        x: 0,
        y: props.h * 0.66666,
        x2: props.w,
        y2: props.h * 0.66666,
        z: props.z,
        lineWidth: props.w * 0.002,
        color: 'transparent',
        backgroundImage: 'linear-gradient(90deg, transparent 50%, ' +'#0f0'+ ' 50%)',
        backgroundSize: (props.w * 0.066) + 'px'
      }),
      // face midline
      Thing.Line.make({
        x: props.w * 0.45,
        y: props.h * 0.0,
        x2: props.w * 0.45,
        y2: props.h * 0.85,
        z: props.z,
        lineWidth: props.w * 0.002,
        color: '#0f0',
      }),
      // face midline bottom cross
      Thing.Line.make({
        x: (props.w * 0.45) - (props.w * 0.01),
        y: props.h * 0.85,
        x2: (props.w * 0.45) + (props.w * 0.01),
        y2: props.h * 0.85,
        z: props.z,
        lineWidth: props.w * 0.002,
        color: '#0f0',
      }),
    ];
  }

  function makeGrayFrame(props = {w: 100, h: 100, lineWidth: 8}) {
    var lineWidth = props.lineWidth || 8;
    var borderW = lineWidth / 2;

    var inny = Thing.Box.make({
      w: props.w,
      h: props.h,
      // backgroundColor: 'red',
      borderTop: borderW + 'px solid #555',
      borderRight: borderW + 'px solid #bbb',
      borderBottom: borderW + 'px solid #fff',
      borderLeft: borderW + 'px solid #777',
    });

    var outty = Thing.Box.make({
      id: props.id || 'grayframe',
      x: props.x,
      y: props.y,
      z: props.z,
      w: props.w + lineWidth,
      h: props.h + lineWidth,
      borderTop: borderW + 'px solid #fff',
      borderRight: borderW + 'px solid #777',
      borderBottom: borderW + 'px solid #555',
      borderLeft: borderW + 'px solid #ccc',
    });

    outty.add(inny);

    return outty;
  }

  function makeSomeHands(props) {
    return Thing.Rand.randItems(imgNamesHands, Thing.Rand.randInt(2,6)).map((imgName, index) => {
      return makeLayer({
        id: 'hand' + index,
        x: Thing.Rand.randInt(props.w * -0.01, props.w * 0.5),
        y: Thing.Rand.randInt(props.h * 0.5, props.h * 0.7),
        z: 5000,
        w: Thing.Rand.randInt(props.w * 0.05, props.w * 0.3),
        h: Thing.Rand.randInt(props.w * 0.15, props.w * 0.3),
        src: imgPath + imgName,
        size: Thing.Rand.randInt(100,100) + '% ',
      });
    });
  }

  function makeBunchOfTies(props) {
    return Thing.Rand.randItems(imgNamesTies, Thing.Rand.randInt(3,5)).map((imgName, index) => {
      return makeLayer({
        id: 'tie' + index,
        x: Thing.Rand.randInt(props.w * 0.4, props.w * 0.5),
        y: Thing.Rand.randInt(props.h * 0.5, props.h * 0.6),
        z: props.z + around(150, 40),
        w: Thing.Rand.randInt(props.w * 0.2, props.w * 0.25),
        h: Thing.Rand.randInt(props.h * 0.5, props.h * 0.5),
        size: Thing.Rand.randInt(50,120) + '% ' + Thing.Rand.randInt(60,120) + '%',
        center: true,
        src: imgPath + imgName,
      });
    }); 
  }

  function makeSuitParts(props) {
    var smallJiggleSize = props.w * 0.05;
    var rightSuit = Thing.Img.make({
      id: 'rightsuit',
      x: 0,
      y: 0,  //jiggle(props.h * 0.01, smallJiggleSize),
      w: Thing.Rand.randInt(props.w * 0.25, props.w * 0.45),
      h: props.h,
      // h: jiggle(props.h * 0.4, smallJiggleSize),
      src: getRandImg(imgNamesLapelsRight),
    });
    var middleSuit = Thing.Img.make({
      id: 'fullsuit',
      x: jiggle(props.w * 0.3333, smallJiggleSize),
      y: 0, //jiggle(props.h * 0.1, smallJiggleSize),
      w: jiggle(props.w * 0.66, smallJiggleSize),
      h: props.h,
      // h: jiggle(props.h * 0.6, smallJiggleSize),
      src: getRandImg(imgNamesSuits),
    });
    var leftSuit = Thing.Img.make({
      id: 'leftsuit',
      x: jiggle(props.w * 0.6666, smallJiggleSize),
      y: 0, //jiggle(props.h * 0.15, smallJiggleSize),
      w: Thing.Rand.randInt(props.w * 0.25, props.w * 0.45),
      h: props.h,
      // h: jiggle(props.h * 0.4, smallJiggleSize),
      src: getRandImg(imgNamesLapelsLeft),
    });
    return [rightSuit, middleSuit, leftSuit];
  }

  // x: starting pos
  // w: total width to fill
  // minW, maxW: min/max width of column
  // return array of objects like: {x: 123, w:345}
  // function makeWidthsORIG(props) {
  //   var columns = [];
  //   var x = props.x || 0;
  //   var columnW = 0;
  //   var remainingW = 0;
  //   var maxW = props.maxW;
  //   var done = false;
  //   var overlap = props.overlap || 0;

  //   while (!done && x < (props.x + props.w)) {
  //     remainingW = props.w - x;
  //     maxW = remainingW > props.maxW ? props.maxW : remainingW;
  //     if (remainingW > props.minW) {
  //       columnW = Rand.randInt(props.minW, maxW);
  //     }
  //     else {
  //       columnW = remainingW;
  //       done = true;
  //     }
  //     columns.push({x: x, w: columnW});

  //     var o = Thing.Rand.randInt(overlap * 0.25, overlap);
  //     x += (columnW - (o > (columnW / 2) ? columnW / 2 : o));
  //   }

  //   return columns;
  // }

  function makeWidths(props) {
    var columns = [];
    var x = props.x || 0;
    var columnW = 0;
    var bs = 0;

    while (x < (props.x + props.w)) {
      columnW = Rand.randInt(props.minW, props.maxW);
      columns.push({x: x, w: columnW});

      var o = columnW * Thing.Rand.randFloat(0.1, 0.5);
      x += (columnW - o);

      bs++;
      if (bs > 200) {
        return;
      }
    }

    return columns;
  }

  function makeBackgroundGridOnLeft(props) {
    return Thing.Rand.randItems(imgNamesBackgrounds, Thing.Rand.randInt(1,1)).map((imgName, index) => {
      var leftside = true; //Thing.Rand.randBoolean();
      var topside = true; //Thing.Rand.randBoolean();
      return makeLayer({
        id: 'midbg' + index,
        x: leftside ? 0 : Thing.Rand.randInt(props.w * 0.4, props.w * 0.6),
        y: topside ? 0 : Thing.Rand.randInt(props.h * 0.5, props.h * 0.7),
        w: props.w,
        h: props.h,
        size: Thing.Rand.randInt(30,120) + '% ',   //'cover',  
        src: imgPath + imgName,
        opacity: (Thing.Rand.randBoolean(20) ? 0.1 : 1),
      });
    });
  }

  function makeBackgroundGridOnRight(props) {
    var bgSize = Thing.Rand.randInt(2, 25);
    return Thing.Box.make({
        id: 'overallbg', 
        x: props.x,
        y: 0,
        w: props.w,
        h: props.h,
      }).add(Thing.BGImg.make({
        src: getRandImg(imgNamesBackgrounds),
        repeat: true,
        size: bgSize + '%',
        opacity: (Thing.Rand.randBoolean(20) ? 0.07 : 1),
      }));
  }

  function to180(deg) {
    return deg < 180 ? deg : 360 - deg; 
  }

  function makeCrownCircle(props = {}) {
    var backgrounds = [ "gold_leaf_bg_bright.png", "gold_leaf_crackled.png", ];  //"hair_detail_1.png", 
    var imageSet = [...Array(props.numNodes)]; // start with an array of blanks
    var radius = (props.w * 0.5);
    var circumference = 2 * Math.PI * radius;
    var imageOverlap = ((circumference * 0.5) * (1/imageSet.length));  // keep overlap proportional to number of images
    var imageSize = (circumference / imageSet.length) + imageOverlap;
    var twitImages = ['twit_logo_blue_crop_t.png', 'twit_logo_blue_crop_left_t.png'];
    var left = true;

    // Generate a circle of images, as many as given by numNodes
    var crownNodes = imageSet.map((_, index) => {
      var jiggledSize = imageSize;  //around(imageSize, imageSize * 0.6);
      var rotation = 360 * (index / imageSet.length);
      var position = 1 - (to180(rotation) / 180);  // 1 is the back of the circle, 0 is front

      var crownNode = makeLayer({
        id: 'crown-node-' + index,
        x: props.x,
        y: props.y,
        z: props.z,
        w: jiggledSize,
        h: jiggledSize, // * 2,
        src: imgPath + backgrounds[ Math.round(position) ], // show a darker texture at back of circle
        size: 'cover',
        backgroundPosition: 'right bottom', // lower corner of the gold texture image has a nice shadow
        repeat: false,
        renderOnCenter: true,
        transformOrigin: '50% 50% ' + radius + 'px',
        rotate: {x: -3, y: rotation},
        // make images at back of circle darker, front of circle brighter
        filter: 'brightness(' + (100-(position*50)) + '%) saturate(' + (100+(position*50)) + '%)',
      }).addMask({
        image: 'url(' + imgPath + twitImages[left? 1 : 0] + ')', // alternate left/right facing twits
        size: '100% 100%',
        repeat: 'repeat',
      });

      left = !left;
      return crownNode;
    });

    return crownNodes;
  }

  function makeCrown(props) {
    var b = Thing.Box.make({
      id: 'crown-box',
      x: props.x,
      y: props.y,
      z: props.z,
      w: props.w,
      h: props.h,
      border: '5px solid blue',
      renderOnCenter: true,
      perspective: '' + Math.round(props.w * 4.444) + 'px',  // about 4000px depending on dimensions of crown
      perspectiveOrigin: '50% 150%',  // vanishing point is middle of box at top
      transformStyle: 'preserve-3d',
    });

    // lowest ring, at bottom of given dimensions
    props.numNodes = 10;
    props.x = props.w / 2;
    props.y = props.h * 0.66;
    props.z = 0;
    b.add(makeCrownCircle(props));

    // middle ring, a little above
    props.numNodes = 22;
    props.y = props.y - (props.h * 0.2);
    props.w = props.w * 1.1;
    b.add(makeCrownCircle(props));

    // top ring
    props.numNodes = 40;
    props.y = props.y - (props.h * 0.1);
    props.w = props.w * 1.1;
    b.add(makeCrownCircle(props));

    return b;
  }// 540 594

  function makeThrone(props) {
    return Thing.Img.make({
      src: imgPath + 'tiki_torch_lit_t_1.png',
      x: props.x,
      y: props.y,
      z: props.z,
      w: props.w,
    });
  }

  function makeMelania(props) {
    return Thing.Img.make({
      id: 'melania-dress',
      src: imgPath + 'melania_blue_dress_1.png',
      x: jiggle(props.w * Thing.Rand.randItem([0.25, 0.75]), props.w * 0.3),
      y: around(props.h * 0.66, props.h * 0.33),
      z: 5000,
      w: Thing.Rand.randInt(props.w * 0.04, props.w * 0.09),
    });
  }

  // // props {x: 0, w: CW, h: CH, minW: CW/15, maxW: CW/2}
  // function makeSuitColumnsORIG(props) {
  //   var parts = [];
  //   var suitparts = [imgNamesLapelsRight, imgNamesTies, imgNamesLapelsLeft, imgNamesSuits];
  //   makeWidths(props).forEach(function (xw) {
  //     var columnMidpoint = (xw.x - props.x) + (xw.w / 2);
  //     var whichThird = Math.min(Math.floor((columnMidpoint / props.w) / 0.333), 2); // 0, 1 or 2
  //     var y = around(props.y, props.h * 0.2);
  //     parts.push(Thing.Img.make({
  //       id: 'big-suit-col-' + xw.x,
  //       x: xw.x,
  //       y: y,
  //       z: around(props.z, 10),
  //       w: xw.w,
  //       h: props.h,
  //       src: getRandImg(suitparts[whichThird]),
  //     }));
  //     parts.push(Thing.Label.make({
  //       text: 'x:' + xw.x + ' <br>w:' + xw.w,
  //       x: xw.x,
  //       y: y + props.h,
  //       z: props.z,
  //       fontSize: (props.w * 0.03) + 'px',
  //       fontWeight: 'bold',
  //       color: '#0c0',
  //       html: true,
  //       borderLeft: Math.floor(props.w * 0.002) + 'px solid green',
  //     }));
  //   });
  //   return parts;
  // }

  function makeSuitColumns(props) {
    var parts = [];
    var suitparts = [imgNamesLapelsRight, imgNamesTies, imgNamesLapelsLeft, imgNamesSuits];
    makeWidths(props).forEach(function (xw) {
      var columnMidpoint = (xw.x - props.x) + (xw.w / 2);
      var whichThird = Math.min(Math.floor((columnMidpoint / props.w) / 0.333), 2); // 0, 1 or 2
      var y = around(props.y, props.h * 0.2);
      parts.push(Thing.Img.make({
        id: props.id + '-' + Math.round(xw.x),
        x: xw.x,
        y: y,
        z: around(props.z, 10),
        w: xw.w,
        h: props.h,
        src: getRandImg(suitparts[whichThird]),
      }));
      parts.push(Thing.Label.make({
        text: 'x:' + Math.round(xw.x) + ' <br>w:' + xw.w,
        x: xw.x,
        y: y + props.h,
        z: props.z,
        fontSize: (props.w * 0.03) + 'px',
        fontWeight: 'bold',
        color: '#0c0',
        textShadow: '#1f6b00 0px 0px 2px',
        html: true,
        borderLeft: Math.floor(props.w * 0.002) + 'px solid green',
      }));
    });
    return parts;
  }

  function makeBigSuit(props) {
    // make suit pieces in columns, with labels at the bottom
    var columns = (makeSuitColumns({
      id: 'big-suit',
      x: props.x,
      y: props.y,
      z: props.z,
      w: props.w,
      h: props.h,
      minW: props.minW,
      maxW: props.maxW,
      overlap: props.w * 0.07,
    }));
    // make one label a green tab
    var labels = columns.filter((item) => { return item.type === 'Label'; });
    Thing.Rand.randItem(labels).css({
      color: '#030',
      backgroundColor: '#00ef00',
      borderBottomLeftRadius: '' + (props.w * 0.01) + 'px',
      borderBottomRightRadius: '' + (props.w * 0.01) + 'px',
    });
    return columns;
  }

  function makeSuitStuff(props) {
    var bigJiggleSize = props.w * 0.15;
    var suitJiggleSize = props.w * Thing.Rand.randFloat(0.05, 0.15);
    var suitAreaW = Math.round(props.w * Thing.Rand.randFloat(0.3, 1.0)); // overal width of all suit stuff
    var suitAreaX = Math.round((props.w - suitAreaW) * Thing.Rand.randFloat(0.3, 0.6));
    var suitAreaY = props.h * 0.55;
    var suitWidth = Thing.Rand.randInt(suitAreaW * 0.3, suitAreaW * 0.9);
    var suitHeight = Thing.Rand.randInt(props.h * 0.3, props.h * 0.5);
    var zpos = [700, 800, 900, 1000];

    var grayFrame = (makeGrayFrame({
      id: 'suit-parts',
      x: jiggle(suitAreaX, suitJiggleSize),
      y: jiggle(suitAreaY, suitJiggleSize),
      z: Thing.Rand.pickItem(zpos),
      w: suitWidth,
      h: suitHeight,
      lineWidth: Math.round(suitAreaW * 0.00533333),
    }).add(makeSuitParts({w: suitWidth, h: suitHeight})));
    
    var swatchesBlueTwitter = makeSwatchesBlueTwitter({
      x: jiggle(suitAreaX, suitJiggleSize),
      y: jiggle(suitAreaY, suitJiggleSize),
      w: jiggle(suitAreaW * 0.4, bigJiggleSize),
      h: jiggle(suitHeight, suitJiggleSize),
      z: Thing.Rand.pickItem(zpos),
    });

    var bigSuitW = suitAreaW; // * Thing.Rand.randFloat(0.5, 0.9);
    var bigSuit = makeBigSuit({
      x: suitAreaX,
      y: jiggle(suitAreaY, suitJiggleSize),
      z: Thing.Rand.pickItem(zpos),
      w: bigSuitW,
      h: suitHeight,
      minW: bigSuitW / Thing.Rand.randInt(6, 30),
      maxW: bigSuitW / Thing.Rand.randInt(3, 5),
    });

    // mark upper left position of suit area
    var markerText = Thing.Label.make({
      fontSize: (props.w * 0.01) + 'px',
      textShadow: '#1f6b00 0px 0px 3px',
      color: '#0f0',
      text: 'S x=' + suitAreaX + ' w=' + suitAreaW,
      x: suitAreaX,
      y: props.h * 0.45,
      z: 5000,
    });

    var suitY = suitAreaY + (props.w * 0.02);
    var markerLine = Thing.Line.make({
      x: suitAreaX,
      y: suitY,
      x2: suitAreaX + suitAreaW,
      y2: suitY,
      z: 5000,
      color: '#6cff78a6',
      lineWidth: props.w * 0.0027,
    });

    var ties = makeBunchOfTies($.extend({}, props, {z: Thing.Rand.pickItem(zpos)}));

    return [grayFrame, bigSuit, markerText, markerLine, ties, swatchesBlueTwitter];
  }
  
  // function makeBigSuitORIG(props) {
  //   var b = Thing.Box.make({
  //     id: 'big-suit',
  //     x: props.x,
  //     y: props.y,
  //     w: props.w,
  //     h: props.h,
  //     z: props.z,
  //     transformStyle: 'preserve-3d',
  //     // border: '2px solid blue',
  //   });
  //   var columns = (makeSuitColumns({
  //     x: props.x,
  //     y: props.y,
  //     z: props.z,
  //     w: b.w,
  //     h: b.h,
  //     minW: props.minW,
  //     maxW: props.maxW,
  //     overlap: b.w * 0.07,
  //   }));
  //   // make one label a green tab
  //   var labels = columns.filter((item) => { return item.type === 'Label'; });
  //   Thing.Rand.randItem(labels).css({
  //     color: '#030',
  //     backgroundColor: '#00ef00',
  //     borderBottomLeftRadius: '' + (props.w * 0.01) + 'px',
  //     borderBottomRightRadius: '' + (props.w * 0.01) + 'px',
  //   });
  //   return columns;
  // }

  function makePowerSuitPortrait (props = {w:1000, h:1500}) {
    var powerColors = ['#ff0000', '#ff6700', '#ff8d1c', '#0000ff', '#0503a7', '#03f', '#006', '#e60000'];
    var reds = powerColors;  //[ '#f80', '#e60', '#fc1', '#fa3'];
    var blueColors = ['#30f', '#04f', '#50e', '#36e', '#09f', '#22f', '#00c', '#00f'];
    var overallBGColor = Rand.randItem(reds);
    var highlightFGColor = tinycolor(overallBGColor).brighten(10).lighten(10).toString();
    var highlightFGColor2 = tinycolor(overallBGColor).brighten(10).saturate(25).toString();
    var bigJiggleSize = props.w * 0.15;
    var bgMidline = Thing.Rand.randInt(props.w * 0.05, props.w * 0.8);
    var baseFaceZ = Thing.Rand.randItem([100, 500, 1000, 2000]);

    // container for portrait
    var bounds = Box.make({
      id: 'power-suit-portrait',
      x: 0,
      y: 0,
      w: props.w,
      h: props.h,
      backgroundColor: overallBGColor,
      transformStyle: 'preserve-3d',
    });

    // background on left and right sides
    var midBGs = makeBackgroundGridOnLeft($.extend({}, props, {
      x: 0,
      w: bgMidline,
      z: 100
    }));
    var rightBG = makeBackgroundGridOnRight($.extend({}, props, {
      x: bgMidline,
      w: props.w - bgMidline,
      z: 100
    }));

    // twitter imgs
    var twitterField = makeTwitterField({w: props.w, h: props.h});
    var twitters = makeTwitters({w: props.w, h: props.h, z: 210});

    // mouths
    var bottomMouths = makeMouthGrid({
      id: 'mouths',
      x: Thing.Rand.randInt(props.w * 0.0, props.w * 0.5),
      y: Thing.Rand.randInt(props.h * 0.2, props.h * 0.35),
      z: baseFaceZ + 920,
      w: Thing.Rand.randInt(props.w * 0.3, props.w * 0.65),
      h: Thing.Rand.randInt(props.h * 0.1, props.h * 0.3),
      colors: reds,
      imgNames: imgNamesMouths,
    }); 

    // eye imgs
    var eyes = makeLayer({
      id: 'eyes',
      src: getRandImg(imgNamesEyes),
      size: Thing.Rand.randInt(10,30) + '% ',
      repeat: 'repeat',
    }, makeHorizontalStripDimensions({w: props.w, h: props.h}));

    function hairBGRepeated(props) {
      return makeLayer({
        id: 'hair',
        src: getRandImg(imgNamesHair),
        size: Thing.Rand.randInt(10, 180) + '% ',
        repeat: 'repeat',
        center: true,
        z: baseFaceZ + 200,
      }, {
        x: Thing.Rand.randInt(props.w * 0.15, props.w * 0.35),
        y: Thing.Rand.randInt(props.h * 0.01, props.h * 0.1),
        w: Thing.Rand.randInt(props.w * 0.15, props.w * 0.75), 
        h: Thing.Rand.randInt(props.h * 0.1, props.h * 0.25),
      });
    }
    
    function oneBigHair(props) {
      return Thing.Img.make({
        src: getRandImg(imgNamesHair),
        x: Thing.Rand.randInt(props.w * 0.1, props.w * 0.3),
        y: Thing.Rand.randInt(props.h * 0.01, props.h * 0.1),
        w: Thing.Rand.randInt(props.w * 0.3, props.w * 0.75), 
        h: Thing.Rand.randInt(props.h * 0.1, props.h * 0.3),
        z: baseFaceZ + 200,
        borderLeft: around(props.w * 0.008, props.w * 0.004) + 'px solid #00e',
      });
    }
    
    // hair
    var hairFuncs = [hairBGRepeated, oneBigHair];
    var hair = Thing.Rand.randItem(hairFuncs)(props);
    // var hair = makeLayer({
    //   id: 'hair',
    //   src: getRandImg(imgNamesHair),
    //   size: Thing.Rand.randInt(10, 180) + '% ',
    //   repeat: 'repeat',
    //   center: true,
    //   z: baseFaceZ + 200,
    // }, {
    //   x: Thing.Rand.randInt(props.w * 0.15, props.w * 0.35),
    //   y: Thing.Rand.randInt(props.h * 0.01, props.h * 0.1),
    //   w: Thing.Rand.randInt(props.w * 0.15, props.w * 0.75), 
    //   h: Thing.Rand.randInt(props.h * 0.1, props.h * 0.25),
    // });

    // build boxes for face parts
    var eyeY = props.h * 0.3;
    var eyeLX = props.w * 0.7;
    var eyeW = props.w * 0.30;
    var noseY = props.h * 0.45;
    var noseW = props.w * 0.25;
    var noseH = props.h * 0.3;
    var mouthW = props.w * 0.5;
    var mouthH = props.h * 0.2;
    var centerX = props.w * 0.5;
    var eyeR = makeFuzzyImageCascade({
      id: 'eyeR',
      x: around(props.w * 0.25, bigJiggleSize),
      y: around(eyeY, bigJiggleSize),
      z: baseFaceZ + 200,
      w: around(eyeW, bigJiggleSize),
      h: around(props.h * 0.1, bigJiggleSize),
      backgroundColor: Rand.randItem(reds),
      images: imgNamesEyes,
    });
    var eyeL = makeFuzzyImageCascade({
      id: 'eyeL',
      x: around(eyeLX, bigJiggleSize),
      y: around(eyeY, bigJiggleSize),
      z: baseFaceZ + 200,
      w: around(eyeW, bigJiggleSize),
      h: around(mouthH, bigJiggleSize),
      backgroundColor: Rand.randItem(reds),
      images: imgNamesEyes,
      jiggle: bigJiggleSize,
    });
    var nose = makeFuzzyImageCascade({
      id: 'nose',
      x: around(centerX, bigJiggleSize),
      y: around(noseY, bigJiggleSize),
      z: baseFaceZ + 205,
      w: around(noseW, bigJiggleSize),
      h: around(noseH, bigJiggleSize),
      backgroundColor: Rand.randItem(blueColors),
      images: imgNamesNoses,
    });
    var mouth = makeFuzzyImageBox({
      id: 'mouth',
      x: around(centerX, bigJiggleSize),
      y: around(eyeY * 1.25, bigJiggleSize),
      z: baseFaceZ + around(250, 100),
      w: mouthW * Thing.Rand.randFloat(0.8, 1.2),
      h: mouthH * Thing.Rand.randFloat(0.8, 1.2),
      backgroundColor: highlightFGColor,
      images: imgNamesMouths,
    });

    mouth.add(makeBorderBox({ id:'mouthborder', box: mouth, color: highlightFGColor2, width: borderWidth(props.w) }));
    nose.add(makeBorderBox({ id:'noseborder', box: nose, color: Rand.randItem(reds), width: borderWidth(props.w) }));
    eyeR.add(makeBorderBox({ id:'eyeRborder', box: eyeR, color: Rand.randItem(reds), width: borderWidth(props.w) }));
    eyeL.add(makeBorderBox({ id:'eyeLborder', box: eyeL, color: Rand.randItem(reds), width: borderWidth(props.w) }));

    // Backgrounds

    bounds.add(rightBG);
    bounds.add(midBGs);
    bounds.add(twitterField);
    bounds.add(makeScatterImages($.extend({}, props, {z: baseFaceZ})));
    bounds.add(twitters);
    bounds.add(makeBubbleArrow(
      twitters[0].x - ((props.w * 0.15) * (twitters[0].x < props.w / 2 ? -1 : 1)), twitters[0].y - (props.w * 0.1), 
      twitters[0].x, twitters[0].y, 
      '#0f0', 
      '' + twitters.length, 
      0, 5000,
      props.w * 0.03
    ));

    // Face parts

    bounds.add(hair);
    bounds.add(eyes);
    bounds.add(eyeL);
    bounds.add(eyeR);
    bounds.add(nose);
    bounds.add(bottomMouths);
    bounds.add(mouth);
    bounds.add(makeImgArrayScroll({  // scrolling eyes right side
      id: 'eyes-right-scroll',
      imgNames: randomArray(imgNamesEyes, 10),
      x: props.w * 0.35,
      y: props.h * 0.12,
      z: baseFaceZ + 250,
      w: props.w * 0.1,
      h: props.h * 0.2,
    }));
    bounds.add(makeImgArrayScroll({  // scrolling eyes left side
      id: 'eyes-left-scroll',
      imgNames: randomArray(imgNamesEyes, 10),
      x: props.w * 0.45,
      y: props.h * 0.12,
      z: baseFaceZ + 250,
      w: props.w * 0.1,
      h: props.h * 0.2,
    }));

    // Suit
    bounds.add(makeSuitStuff($.extend({}, props, {z: 1000})));

    // Hands

    bounds.add(makeSomeHands(props));

    makeFan({
      images: [
        { 
          src: imgPath + 'hand_right_fist_t.png',
          x: props.w * 0.75,
          y: props.h * 0.66,
          z: 5000,
          w: jiggle(props.w * 0.2, bigJiggleSize),
          border: (props.w * 0.001) + 'px solid red',
          transformOrigin: '40% 80%',
          rotate: {z: Thing.Rand.randInt(-45, 45)},
          renderOnCenter: true
        },
        { 
          src: imgPath + 'hand_right_gun_teal_t.png',
          x: props.w * 0.75,
          y: props.h * 0.66,
          z: 5000,
          w: jiggle(props.w * 0.15, bigJiggleSize),
          border: (props.w * 0.001) + 'px solid red',
          transformOrigin: '75% 100%',
          rotate: {z: Thing.Rand.randInt(-45, 45)},
          renderOnCenter: true
        },
        { 
          src: imgPath + 'hand_right_open_t.png',
          x: props.w * 0.75,
          y: props.h * 0.66,
          z: 5000,
          w: jiggle(props.w * 0.2, bigJiggleSize),
          border: (props.w * 0.001) + 'px solid red',
          transformOrigin: '100% 50%',
          rotate: {z: Thing.Rand.randInt(-45, 45)},
          renderOnCenter: true
        },
      ], 
      container: bounds,
      x: props.w * 0.5,
      y: props.h * 0.5,
      z: 5000,
    });

    var crownW = Thing.Rand.randInt(props.w * 0.08, props.w * 0.3);
    bounds.add(makeCrown({
      x: jiggle(props.w * 0.5, props.w * 0.25),
      y: around(props.h * 0.1, props.h * 0.2),
      z: 5000,
      w: crownW,
      h: jiggle(crownW * 0.7, crownW * 0.2),
      numNodes: 10,
    }));

    bounds.add(makeThrone({
      id: 'throne-1',
      x: props.w * 0.08,
      y: props.h * 0.05,
      z: 200,
      w: props.w * 0.1,
    }));

    bounds.add(makeThrone({
      id: 'throne-2',
      x: props.w * 0.5,
      y: props.h * 0.05,
      z: 200,
      w: props.w * 0.1,
    }));

    bounds.add(makeMelania({w: props.w, h: props.h}));

    bounds.add(makeTweetCascade({tweets: tweets, w: props.w, h: props.h, z: 1000}));

    // Guide lines

    bounds.add(makeLines({w: props.w, h: props.h, z: 10000}));

    return bounds;
  }

  //====================================================================//

  function main() {
    // Respond to page params and key events
    // Thing.Page.setScale(pageParams.scale || 1);
    // Thing.Page.initEvents();
    // Thing.Rand.init(pageParams.randomSeed);

    //1534963894508


    Thing.Page.setup();

    var powerSuitPortrait = makePowerSuitPortrait({
      id: 'powersuit',
      x: 0,
      y: 0,
      w: CW,
      h: CH,
    });

    var stage = Thing.Box.make({
      id: 'stage',
      x: 0,
      y: 0,
      w: CW,
      h: CH,
      overflow: 'hidden',
      // perspective: '4000px',  // keep the design flat (orthogonal view)
      transformStyle: 'preserve-3d',
    });

    stage.add([
      powerSuitPortrait,
    ]);

    stage.render();    
  }

  main();
});
