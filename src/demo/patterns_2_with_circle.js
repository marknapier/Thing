
// class Circle extends Thing {
//   init (props) {
//     var defaultProps = {
//       text: '',
//       left: 0,
//       top: 0,
//       r: 25,
//       borderWidth: 5,
//       fontFamily: 'Calibri, Arial, sans-serif',
//       color: '#343',
//       backgroundColor: '#f60',
//       borderRadius: '10000px',
//       border: '5px solid #BADA55',
//       fontSize: '26px',
//       fontWeight: 'bold'
//     };

//     props = $.extend({}, defaultProps, props);
//     super.init(props);
//     this.type = 'Circle';
//     this.text = props.text;

//     this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class

//     // apply circle css
//     var offset = props.r + props.borderWidth;
//     this.css({
//         'left': '' + (props.left-offset) + 'px',
//         'top': '' + (props.top-offset) + 'px',
//         'width': '' + props.r*2 + 'px',
//         'height': '' + props.r*2 + 'px',
//         'lineHeight': '' + props.r*2 + 'px',
//         'textAlign': 'center',
//         'overflow': 'hidden'
//       });

//     this.setText(this.text);
//   }

//   setText (txt) {
//     this.text = txt;
//     this.$element.empty().append(txt);
//     return this;
//   }

//   render () {
//     super.render();
//     return this;
//   }
// }
// Thing.addClass(Circle);


function scaleDocument (n) {
  var el = document.body;
  el.style.transformOrigin = 'left top'; 
  el.style.transform = 'scale(' + n + ')';
}

function makePattern (name) {
  var box = Thing.classes.Box
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

  var i = Thing.classes.Img
    .make({src:'img/las_meninas_girl_t.png'})
    .css({left:'0px', top:'0px'})
    .render();


  var target = {x: 300, y: 300};
  var bubble = {x: 750, y: 100};

  var l = Thing.classes.Line.make({
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


