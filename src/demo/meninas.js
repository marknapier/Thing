var greens = ['#339911', '#008000', '#009000', '#008600', '#00aa00', '#008010', '#108000', '#30a000', '#00a030', '#30a030'];

function scaleDocument (n) {
  var el = document.body;
  el.style.transformOrigin = 'left top';
  el.style.transform = 'scale(' + n + ')';
}

function makePattern (name, size) {
  var Rand = Thing.classes.Rand;
  var Pattern = Thing.classes[name] ? Thing.classes[name] : Thing.classes.Pattern;
  var P =  Pattern.make({pattern: name, size: size});
  var box = Thing.classes.Box.make( {
    x: Rand.randInt(0,3000),
    y: 0,
    w: Rand.randInt(400,1600),
    h: 3600,
    z: Rand.randInt(1,1000) * 10,
    backgroundColor: Rand.randItem(greens),
    position: 'absolute',
    display: 'block',
    overflow: 'hidden'
  });

  box.add( P )
  return box;
}

function makeTextPane (x, y, w, h) {
  var Rand = Thing.classes.Rand;
  var TextPane = Thing.classes.TextPane;
  var bgColor = Rand.randItem(greens);
  var textBox = Thing.classes.Box.make({
      x: x,
      y: y,
      w: w,
      h: h,
      overflow: 'hidden',
      backgroundColor: bgColor
  });
  var fontSize = Rand.randInt(36, 160);

  textBox.add( TextPane.make({
      text:'There was a man and a dog too this time. Two beasts, counting Old Ben, the bear, and two men, counting Boon and Hoggenbeck, in whom some of the same blood ran which ran in Sam Fathers, even though Boon\'s was a plebeian strain of it and only Sam and Old Ben and the mongrel Lion were taintless and incorruptible.',
      width:'100%',
      height:'100%',
      color: Rand.randRGBstr(),
      fontSize: fontSize
  }) );
  textBox.add( TextPane.make({
      text:'That put the thing in a new light. Ben stopped nibbling his apple. Tom swept his brush daintily back and forth -- stepped back to note the effect -- added a touch here and there -- criticised the effect again -- Ben watching every move and getting more and more interested, more and more absorbed. Presently he said:',
      width:'100%',
      height:'100%',
      color: '#f0fff9',
      fontSize: fontSize
  }) );
  textBox.add( TextPane.make({
      text:'On the surface, I was calm: in secret, without really admitting it, I was waiting for something. Her return? How could I have been waiting for that? We all know that we are material creatures, subject to the laws of physiology and physics, and not even the power of all our feelings combined can defeat those laws. All we can do is detest them. The age-old faith of lovers and poets in the power of love, stronger than death, that finis vitae sed non amoris, is a lie, useless and not even funny. So must one be resigned to being a clock that measures the passage of time, now out of order, now repaired, and whose mechanism generates despair and love as soon as its maker sets it going? Are we to grow used to the idea that every man relives ancient torments, which are all the more profound because they grow comic with repetition? That human existence should repeat itself, well and good, but that it should repeat itself like a hackneyed tune, or a record a drunkard keeps playing as he feeds coins into the jukebox...',
      width:'100%',
      height:'100%',
      color: bgColor,
      fontSize: fontSize
  }).rotate(90) );
  return textBox;
}

function makeMenina() {
  var Rand = Thing.classes.Rand;
  var i = Thing.classes.Img
    .make({
      src:'img/las_meninas_girl_t.png',
      x: Rand.randInt(-500, 4500),
      y: Rand.randInt(500, 2000),
      z: Rand.randInt(500,1000) * 10
    })
    .scaleTo(.8 + (Rand.randFloat()*2))
    .rotate(Rand.randInt(180)-90)  ;
  return i;
}

function makeCouch() {
  var Rand = Thing.classes.Rand;
  var i = Thing.classes.Img
    .make({
      src:'img/sofa_3_victorian_sofa_t.png',    //sofa_leather_overstuffed_t.png
      x: 600,
      y: 1600,
      z: Rand.randInt(9000, 10000),
      filter: 'drop-shadow(10px 10px 19px rgba(0,0,0,0.7))'
    })
    .scaleTo(1.8) ;
  return i;
}

function makeFloor () {
  var i = Thing.classes.Img
    .make({
      src:'img/wood_texture_smooth_panel_red_oak.jpg',
      w: 1000,
      h: 600,
      z: 20000
    })
    .css({transform: 'translate(0px, 780px) rotateX(90deg) scale(2)'})  ;
  return i;
}

// function makeRightWall () {
//   var i = Thing.classes.Img
//     .make({
//       src:'img/vintagewallpaper4_crop_edges_1.png',   // 'vintagewallpaper4_crop.png',
//       w: 1000,
//       h: 1000,
//       z: 1000,
//       opacity: .1
//     })
//     .css({transform: 'translate(800px, -60px) rotateY(110deg) scale(2)'})  ;
//   return i;
// }

function makeRightWall () {
  var i = Thing.classes.Img
    .make({
      src: 'img/vintagewallpaper4_crop.png',   //'img/vintagewallpaper4_crop_cutout_1.png',
      w: 2000,
      h: 2000,
      z: 2000,
      opacity: .85
    })
    .css({
      transform: 'translate(2500px, 0px) rotateY(110deg) scale(2)'
    });

  var g = Thing.make({
      w: 2000,
      h: 2000,
      opacity: 1
    })
    .css({
      background: 'radial-gradient(at 40% 30%, rgba(255, 224, 113, 0.490196) 10%, transparent 50%, rgba(144, 0, 27, 0.8) 90%)'
    });

  i.$element.append(g.$element);
  return i;
}

function makeBubbleArrow (bubbleX, bubbleY, targetX, targetY, color, text, shorten, z) {
  z = z || 2200;

  var l = Thing.classes.Line.make({
    x1:bubbleX, y1:bubbleY,
    x2:targetX, y2:targetY,
    color: color,
    width:10,
    arrow:true,
    shorten: shorten,
    zIndex: z,
    boxShadow: '0px 0px 9px -1px rgba(10,20,0,0.75)'
  });

  var c = Thing.classes.Circle.make({
    text: text || '' + Thing.classes.Rand.randInt(1, 67),
    x: bubbleX,
    y: bubbleY,
    r: 100,
    zIndex: z+1,
    fontSize: '80px',
    color: '#fff',
    boxShadow: '0px 0px 9px 0px rgba(10,20,0,0.75)',
    borderColor: color,
    borderWidth: 10
  })

  return [l,c];
}

function makeTextArrow (bubbleX, bubbleY, targetX, targetY, color, text, shorten, z) {
  z = z || 2200;

  var r = 30;
  var w = 12;

  var l = Thing.classes.Line.make({
    x1:bubbleX, y1:bubbleY,
    x2:targetX, y2:targetY,
    color: color,
    width: w,
    arrow: true,
    shorten: shorten,
    zIndex: z,
    boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.25)'
  });

  var c = Thing.classes.Label.make({
    text: text || '' + Thing.classes.Rand.randInt(1, 67),
    x: bubbleX - r,
    y: bubbleY - (82),  //fontSize
    // w: r*2,
    zIndex: z+1,
    fontSize: '100px',
    color: '#0f0',
    // borderBottom: '3px solid #0f0',
    textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
  })

  return [l,c];
}

function makeBackground (w, h, scale) {
  return Thing.classes.Box
      .make({
        w: w,
        h: h,
        backgroundColor: '#ff6400',
        position: 'absolute',
        display: 'block',
        overflow: 'hidden',
        perspective: '4000px',
        transformStyle: 'preserve-3d'
      });
}

function makeStage (w, h, scale) {
  return Thing.classes.Box
      .make({
        w: w,
        h: h,
        backgroundColor: '#ff64cc',
        position: 'absolute',
        display: 'block',
        overflow: 'hidden',
        perspective: '2000px',
        transformStyle: 'preserve-3d'
      });
}

//----------------------------------------------------
// Matrix functions (rely on Sylvester.js)

// return a Sylvester.js matrix from an array of 6 values
function makeMatrix2D (mA) {
  var m = null;
  if (mA && mA.length === 6) {
    var m = $M([
      [mA[0], mA[2], mA[4]],
      [mA[1], mA[3], mA[5]],
      [0,0,1]
    ]);
  }
  return m;
}

// return the point transformed by the given matrix
// CSS Elements by default have transform-origin at center. Pass
// the position of the origin in originOffset (defaults to 0,0).
function transformPoint (point, M, originOffset) {
  originOffset = originOffset || [0,0];
  // shift point to center around origin
  var v = Vector.create([point[0]-originOffset[0], point[1]-originOffset[1], 1]);
  // transform the point
  var tm = M.multiply(v);
  // shift the transformed point back
  var tx = tm.elements[0]+originOffset[0];
  var ty = tm.elements[1]+originOffset[1];
  return [tx, ty];
}

