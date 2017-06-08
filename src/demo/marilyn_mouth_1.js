var Thing = window.Thing;

$(function(){
  let Rand = Thing.classes.Rand;
  let bgImage = 'img/marilyn_mouth_square.png';
  let greenColors = ['#3d0', '#3c3', '#5F5', '#3e3', '#4e0'];

  function makeColumn (props) {
    return Thing.classes.Box.make($.extend({
        x: Rand.randInt(-20, 4800),
        y: Rand.randInt(-20, 120),
        w: Rand.randFloat() > 0.75 ? Rand.randInt(500, 1500) : Rand.randInt(120, 1000),
        h: 3600,
        zIndex: Rand.randInt(100, 1000)
        // overflow: 'hidden'
      }, props));
  }

  function makeLabel (props) {
    return Thing.classes.Label.make($.extend({
      color: '#33ff33',
      textShadow: '1px 1px 2px black',
      fontSize: '46px',
      fontWeight: '700',
      margin: '16px'
    }, props));
  }

  function makeFlyingMouth (props) {
    let halfWidth = props.w / 2;
    let b = Thing.classes.Box.make({
      x: props.x, 
      y: props.y, 
      backgroundColor: 'magenta'
    });
    b.add(Thing.classes.Img.make({   // left
      src: 'img/rubens_swan_wing_venus_hair_1.png',
      x: -halfWidth,
      y: -halfWidth,
      w: props.w,
      rotate: {y:180}
    }));
    b.add(Thing.classes.Img.make({   // right
      src: 'img/rubens_swan_wing_venus_hair_1.png',
      x: (halfWidth+200),
      y: -halfWidth,
      w: props.w
    }));
    b.add(Thing.classes.Img.make({
      src: 'img/marilyn_mouth_square.png',
      w: props.w
    }));
    return b;
  }

  function makeFlyingMouths () {
    let mouths = [];
    let rows = 2;
    let cols = 4;
    let colwidth = 5000 / cols;
    let rowheight = 3600 / rows;
    for (let r=0; r < rows; r++) { 
      for (let c=0; c < cols; c++) { 
        mouths.push( makeFlyingMouth({
          w: Thing.classes.Rand.randInt(200, 1100), 
          x: Thing.classes.Rand.randCloseTo((c*colwidth)+(colwidth/2), 200), 
          y: Thing.classes.Rand.randCloseTo((r*rowheight)+(rowheight/2), 200), 
        })); 
      }
    }    
  }

  function makeFullRectangle () {
    var r = Thing.classes.Box.make({w: 5000, h: 3125, backgroundColor: '#ff6'}).add(
      Thing.make({w: 3125, h: 3125, backgroundColor: '#6f6'})
    );
    return r;
  }

  function makeColumns() {
    return [

      // background dark
      makeColumn({
        x: Rand.randInt(-200, 3000),
        y: 0,
        w: Rand.randInt(1500, 5000),
        zIndex: Rand.randInt(10,15),
        backgroundColor: 'rgb(35, 40, 30)'
      }).add(
        Thing.classes.Label.make({
          color: '#3F3',
          fontSize: Rand.randInt(100, 200) + 'px',
          fontWeight: "900",
          text: "Background"
      })).add(
        Thing.make({   // light spot
          width: '100%',
          height: '100%',
          background: 'radial-gradient(at 40% 30%, rgba(94, 121, 69, 0.23) 10%, rgba(1, 18, 0, 0.39) 90%)'
      })),

      // background green
      makeColumn({
        x: Rand.randInt(-200, 3000),
        y: 0,
        w: Rand.randInt(500, 5000),
        zIndex: Rand.randInt(10,15),
        backgroundColor: 'rgb(42, 250, 36)'
      }).add(
        Thing.classes.Label.make({
          color: Rand.randItem(['#690', '#330', '#343']),
          fontSize: Rand.randInt(80, 250) + 'px',
          fontWeight: "400",
          text: "Green"
      })).add(
        Thing.make({   // light spot
          width: '100%',
          height: '100%',
          background: 'radial-gradient(at 40% 30%, rgba(194, 255, 135, 0.23) 10%, rgba(1, 18, 0, 0.39) 90%)'
      })),

      // GOED detail
      // makeColumn({
      //   w: Rand.randInt(1000,4000),
      //   x: Rand.randInt(-500, 2000),
      //   opacity: 0.2,
      //   zIndex: 200
      // }).add(
      //   Thing.classes.BGImg.make({
      //     url: 'img/goed_detail_1_t.png',
      //     size: 'cover',
      //     center: true,
      //     repeat: false
      // })).add(makeLabel({text: 'GOED'})),

      // Rubens detail
      Thing.classes.Img.make({
        src: 'img/rubens_swan_wing_venus_hair_1.png',
        x: Rand.randInt(-500, 4000),
        y: Rand.randInt(500, 3000),
        w: Rand.randInt(600, 2000),
        zIndex: Rand.randInt(100, 500)
      }),

      // Rubens detail
      Thing.classes.Img.make({
        src: 'img/rubens_swan_wing_venus_hair_1.png',
        x: Rand.randInt(-500, 4000),
        y: Rand.randInt(500, 3000),
        w: Rand.randInt(600, 3000),
        rotate: {y: Rand.randInt(0, 180)},
        zIndex: Rand.randInt(100, 500)
      }),

      // Rubens detail
      Thing.classes.Img.make({
        src: 'img/rubens_swan_wing_venus_hair_1.png',
        x: Rand.randInt(-500, 4000),
        y: Rand.randInt(500, 3000),
        w: Rand.randInt(1000, 3000),
        rotate: {y: Rand.randInt(0, 180)},
        zIndex: Rand.randInt(100, 1500)
      }),

      // Mouths
      makeColumn().add(
        Thing.classes.BGImg.make({
          url: bgImage,
          size: 'cover',
          center: false,
          repeat: false
      })).add(makeLabel({text: 'A: size=cover center=false repeat=false'})),
      makeColumn().add(
        Thing.classes.BGImg.make({
          url: bgImage,
          size: 'cover',
          center: true,
          repeat: false
      })).add(makeLabel({text: 'size=cover center=true repeat=false'})),
      // makeColumn().add(
      //   Thing.classes.BGImg.make({
      //     url: bgImage,
      //     size: '100% 50%',
      //     center: true,
      //     repeat: false
      // })).add(makeLabel({text: 'size=100/50 center=true repeat=false'})),
      makeColumn().add(
        Thing.classes.BGImg.make({
          url: bgImage,
          size: '12% 25%',
          center: true,
          repeat: true
      })).add(makeLabel({text: 'size=50% center=true repeat=true'})),
      makeColumn().add(
        Thing.classes.BGImg.make({
          url: bgImage,
          size: 'contain',
          center: true,
          repeat: true
      })).add(makeLabel({text: 'size=contain center=true repeat=true'})),
      makeColumn().add(
        Thing.classes.BGImg.make({
          url: bgImage,
          size: '100% 100%',
          center: false,
          repeat: false
      })).add(makeLabel({text: 'size=100% center=false repeat=false'})),

      // Text
      makeColumn().add(
        Thing.classes.Label.make({
          color: Rand.randItem(greenColors),
          fontSize: Rand.randInt(200, 2000) + 'px',
          fontWeight: "400",
          textShadow: '1px 1px 1px darkolivegreen',
          text: "Large regular 400 weight AaBbCcDdEeFfGg HIJKLMNOP 0123456789 $#@!%^&* (){}<>..."
      })),
      makeColumn().add(
        Thing.classes.Label.make({
          color: Rand.randItem(greenColors),
          fontSize: Rand.randInt(200, 2000) + 'px',
          fontWeight: "400",
          textShadow: '1px 1px 1px darkolivegreen',
          text: "<p>I will rise</p><p>After a thousand years</p><p>And set my teeth in the silver of the moon</p>"
      })),
      makeColumn().add(
        Thing.classes.Label.make({
          color: Rand.randItem(greenColors),
          fontSize: Rand.randInt(100, 300) + 'px',
          fontWeight: "400",
          textShadow: '1px 1px 1px darkolivegreen',
          text: "<meta charset='utf-8'><script>$(function(){ let Rand = T"
          // rotate: {z: Rand.randInt(-10,10)}
      })),
      makeColumn().add(
        Thing.classes.Label.make({
          color: Rand.randItem(greenColors),
          fontSize: Rand.randInt(200, 2000) + 'px',
          fontWeight: "900",
          textShadow: '1px 1px 1px darkolivegreen',
          text: "<img src='mmonr"
          // rotate: {z: Rand.randInt(-10,10)}
      })),

      // Mouths
      makeColumn({opacity: 0.85}).add(
        Thing.classes.BGImg.make({
          url: bgImage,
          size: '50% 50%',
          center: false,
          repeat: false
      })).add(makeLabel({text: 'size=50% center=false repeat=false'})),
      makeColumn({opacity: 0.85}).add(
        Thing.classes.BGImg.make({
          url: bgImage,
          size: '50% 50%',
          center: true,
          repeat: false
      })).add(makeLabel({text: 'size=50% center=true repeat=false'})),
      makeColumn().add(
        Thing.classes.BGImg.make({
          url: bgImage,
          size: '15% 15%',
          center: true,
          repeat: true
      })).add(makeLabel({text: 'size=50% center=true repeat=true'})),
      // makeColumn().add(
      //   Thing.classes.BGImg.make({
      //     url: bgImage,
      //     size: '50% 50%',
      //     center: false,
      //     repeat: true
      // })).add(makeLabel({text: 'size=50% center=false repeat=true'})),

      // accent line
      makeColumn({
        x: Rand.randInt(0, 4500),
        y: 0,
        w: Rand.randInt(6, 60),
        zIndex: 2000,
        backgroundColor: 'rgb(12, 25, 6)',
        borderLeft: '5px solid #ff7600',
        borderRight: '5px solid #6C0'
      }).add(
        Thing.classes.Label.make({
          color: '#3F3',
          fontSize: Rand.randInt(40, 120) + 'px',
          fontWeight: "100",
          bottom: '0px',
          text: "1) 2) 3) 4)"
      })),

      Thing.classes.Pattern.make({pattern:'GraphPaper', zIndex:9000})
      // background-size: 100px 100px, 100px 100px;
      // background-position: -2px -2px, -2px -2px;
      // background-image: linear-gradient(rgba(110, 142, 105, 0.33) 2px, transparent 2px), linear-gradient(90deg, rgba(88, 109, 83, 0.39) 2px, transparent 2px);

    ];
  }

  // Render columns
  Thing.classes.Box.make({
    backgroundColor: 'rgb(42, 45, 36)',
    backgroundImage: 'url(img/white_grid_1.png)',
    backgroundSize: Rand.randInt(50,200) + '%',
    overflow: 'hidden',
    x: 0,
    y: 0,
    w: 5000,
    h: 3600,
    zIndex: 0
  })
  .add(makeColumns())
  .render();
});
