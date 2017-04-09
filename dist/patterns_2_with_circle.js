var Thing = window.Thing;

// function scaleDocument (n) {
//   var el = document.body;
//   el.style.transformOrigin = 'left top';
//   el.style.transform = 'scale(' + n + ')';
// }

function makePattern (name) {
  Thing.classes.Box
    .make( {
      w: 100,
      h: 400,
      backgroundColor: 'green',
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden'
    })
    .add( Thing.classes.Pattern.make({pattern: name}) )
    .css({width:'300px', height:'1200px'})
    .render();
}

$(function () {
  // background aliasing is smoother at a larger size
  // scaleDocument(3);

  makePattern('GraphPaper');
  makePattern('PlaidRed');
  makePattern('Sofa');
  makePattern('PolkaDots');
  makePattern('Stripes');
  makePattern('DiagonalStripes');

  Thing.classes.Img
    .make({src:'img/las_meninas_girl_t.png'})
    .css({left:'0px', top:'0px'})
    .render();


  var target = {x: 300, y: 300};
  var bubble = {x: 750, y: 100};

  Thing.classes.Line.make({
    x1:bubble.x, y1:bubble.y,
    x2:target.x, y2:target.y,
    color:'#BADA55',
    width:5
  })
  .render();

  var c = Thing.classes.Circle.make({
    text: 'HI',
    x: bubble.x,
    y: bubble.y,
    r: 40
  })
  .render();

  window.c = c;

});


