
window.Meninas = (function () {

  var Thing = window.Thing;
  var greens = ['#339911', '#008000', '#009000', '#008600', '#00aa00', '#008010', '#108000', '#30a000', '#00a030', '#30a030'];

  function scaleDocument (n) {
    var el = document.body;
    el.style.transformOrigin = '0 0';
    el.style.transform = 'scale(' + n + ')';
    // Prevents the screenshot plugin from including scrollbars in large screenshots.
    el.style.overflow = 'hidden';
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
      zIndex: Rand.randInt(1,1000) * 10,
      backgroundColor: Rand.randItem(greens),
      position: 'absolute',
      display: 'block',
      overflow: 'hidden'
    });

    box.add( P );
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
        zIndex: Rand.randInt(500,1000) * 10
      })
      .scaleTo(0.8 + (Rand.randFloat()*2))
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
        zIndex: Rand.randInt(9000, 10000),
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
        x: 0,
        y: 780,
        zIndex: 20000,
        rotate: {x: 90},
        scale: 2
      });
    return i;
  }

  function makeRightWall () {
    var i = Thing.classes.Img
      .make({
        src: 'img/vintagewallpaper4_crop.png',
        w: 2000,
        h: 2000,
        scale: 2,
        rotate: {y: 110},
        x: 2500,
        y: 0,
        zIndex: 2000,
        opacity: 0.85
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
      lineWidth:10,
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
    });

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
      lineWidth: w,
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
    });

    return [l,c];
  }

  function makeBackground (w, h) {
    return Thing.classes.Box
        .make({
          w: w || 5000,
          h: h || 3600,
          backgroundColor: '#ff6400',
          position: 'absolute',
          display: 'block',
          overflow: 'hidden',
          perspective: '4000px',
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d'
        });
  }

  //----------------------------------------------------
  // Matrix functions (rely on Sylvester.js)

  // return a Sylvester.js 3x3 matrix from an array of 6 values
  function makeMatrix2D (mA) {
    var $M = window.$M;  // sylvester library
    var m = null;
    if (mA && mA.length === 6) {
      m = $M([
        [mA[0], mA[2], mA[4]],
        [mA[1], mA[3], mA[5]],
        [0,0,1]
      ]);
    }
    return m;
  }

  // return a Sylvester.js 4x4 matrix from an array of 6 or 16 values
  function makeMatrix3D (mA) {
    var $M = window.$M;  // sylvester library
    var m = null;
    if (mA && mA.length === 16) {
      m = $M([
        [mA[0], mA[4], mA[8], mA[12]],
        [mA[1], mA[5], mA[9], mA[13]],
        [mA[2], mA[6], mA[10], mA[14]],
        [mA[3], mA[7], mA[11], mA[15]],
      ]);
    }
    else if (mA && mA.length === 6) {
      m = $M([
        [mA[0], mA[2], 0, mA[4]],
        [mA[1], mA[3], 0, mA[5]],
        [0,       0,   1,     0],
        [0,       0,   0,     1],
      ]);
    }
    return m;
  }

  // return the point transformed by the given matrix
  // CSS Elements by default have transform-origin at center. Pass
  // the position of the origin in originOffset (defaults to 0,0).
  function transformPoint (point, M, originOffset) {
    var Vector = window.Vector;  // sylvester library
    originOffset = originOffset || [0,0];
    // shift point to center around origin
    var v = Vector.create([point[0]-originOffset[0], point[1]-originOffset[1], 1, 1]);
    // transform the point
    var tm = M.multiply(v);
    // shift the transformed point back
    var tx = tm.elements[0] + originOffset[0];
    var ty = tm.elements[1] + originOffset[1];
    return [tx, ty];
  }

  // return point transformed by the given thing's matrix
  // point will be unchanged if the thing has not been translated/rotated/scaled
  function getPositionOf (point, thing) {
    var matrix = makeMatrix3D( thing.getCSSTransform() );
    if (matrix) {
      var origin;
      if (thing.origin) {  // it's an Attachable, use it's origin
        origin = [thing.origin.x, thing.origin.y];
      }
      else {     // it's a regular thing, assume origin is in center
        var dim = thing.getDimensions();
        origin = [dim.w/2, dim.h/2];
      }
      return transformPoint(point, matrix, origin);
    }
    return point;
  }

  // return point transformed by the given thing's matrix
  // and all parent matrixes, resulting in the screen position of
  // the given point in the given thing.
  function getWorldCoordsOf(tgtPoint, target) {
    for (var thing=target; thing; thing=thing.parent) {
      tgtPoint = getPositionOf(tgtPoint, thing);
    }
    return tgtPoint;
  }

  function getPointInThing(thing, point) {
    var M = makeMatrix3D( thing.getCSSTransform() );
    var dim = thing.getDimensions();
    var tp = transformPoint(point, M, [dim.w/2, dim.h/2]);
    return tp;
  }

  // end of matrix functions
  //----------------------------------------------------

  function makeFloorBleached(options) {
    var defaultOptions = {
      x: -1200,
      y: 1605,
      w: 6100,
      h: 3600,
      backgroundSize: 400,
      rotate: {x: 85}
    };
    var _options = $.extend(defaultOptions, options);
    var floor = Thing.classes.Box.make(_options)
      .add([
        Thing.make({  // wood texture
          width: '100%',
          height: '100%',
          background: 'url(img/wood_texture_smooth_panel_red_oak.jpg) center center / 100% 100% no-repeat',
        }),
        Thing.make({  // lines pattern
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(90deg, #f3daac 0.4%, #6a5f4b .8%, #6a5f4b 1.6%, #ffdc8d 2.0%, #f3daac 3%)',
          backgroundSize: '' + _options.backgroundSize + 'px ' + _options.backgroundSize + 'px',
          opacity: 0.85
        }),
        Thing.make({   // light spot
          width: '100%',
          height: '100%',
          background: 'radial-gradient(at 50% 40%, rgba(255, 252, 195, 0.3) 20%, transparent 35%, rgba(124, 72, 82, 0.55) 90%)'
        })
      ]);
    // floor.addMask('radial-gradient(transparent 25%, white 26%)');
    return floor;
  }

  return {
    greens: greens,
    scaleDocument: scaleDocument,
    makePattern: makePattern,
    makeTextPane: makeTextPane,
    makeMenina: makeMenina,
    makeCouch: makeCouch,
    makeFloor: makeFloor,
    makeRightWall: makeRightWall,
    makeBubbleArrow: makeBubbleArrow,
    makeTextArrow: makeTextArrow,
    makeBackground: makeBackground,
    makeMatrix2D: makeMatrix2D,
    makeMatrix3D: makeMatrix3D,
    transformPoint: transformPoint,
    getPointInThing: getPointInThing,
    getPositionOf: getPositionOf,
    getWorldCoordsOf: getWorldCoordsOf,
    makeFloorBleached: makeFloorBleached
  };
}());
