var Thing = require('../Thing/Thing.js');

class Line extends Thing {
  init (props) {
    /* // proposed props
      {
        x: 0,
        y: 0,
        x2: 100,
        y2: 100,
        lineWidth: 2,  // call it 'lineWidth' to avoid collision with CSS 'width' property
      }
    */
    props.x = props.x || props.x1 || 0;
    props.y = props.y || props.y1 || 0;
    delete props.x1;
    delete props.y1;

    // expecting props: { x1:0, y1:0, x2:50, y2:50 }
    props.backgroundColor = props && (props.backgroundColor || props.color || 'black');
    super.setDefaultProps(props);
    this.type = 'Line';
    this.length = 10;
    this.lineWidth = 1;
    this.angle = 0;
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.createLine(props.x, props.y, props.x2, props.y2, props.lineWidth, props.arrow, props.shorten);
  }

  createLine (x1,y1, x2,y2, lineWidth, arrow, shorten) {
    this.lineWidth = lineWidth || 2;
    this.length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) - (arrow? this.lineWidth*2 : 0);  // shorten the length to make room for arrowhead
    this.angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    this.length -= shorten || 0;  // shorten the line a bit (makes room for arrowhead)

    // grrrrrr... some funcs read from props.x, some read this.x
    this.x = this.props.x = x1;
    this.y = this.props.y = (y1-(this.lineWidth/2));
    this.w = this.props.w = this.length;
    this.h = this.props.h = this.lineWidth;
    this.rotate = this.props.rotate = {z: this.angle};

    this.$element = Thing.makeElement(this.html(), this.props, this.type);

    // this.css({
    //     // 'left': '' + x1 + 'px',
    //     // 'top': '' + (y1-(this.lineWidth/2)) + 'px',
    //     // 'width': '' + this.length + 'px',
    //     // 'height': '' + this.lineWidth + 'px',
    //     // rotate around start point of line
    //     'transform-origin': '0 50%'
    //   });
    // // this.rotateTo(this.angle);
    // this.transform();

    if (arrow) {
      this.addArrowHead(this.length, this.lineWidth, this.lineWidth*2, this.props.backgroundColor);
    }
  }

  // len of line, width of line, size of triangle (ie. 10 will be 10px wide and 20px high)
  addArrowHead (len, width, size, color) {
    this.arrowHead = $('<div></div>');
    this.arrowHead.css({
      position: 'absolute',
      width: 0,
      height: 0,
      fontSize: 0,
      lineHeight: 0,
      left: len + 'px',
      top: -(size-(width/2)) + 'px',
      borderBottom: size + 'px solid transparent',
      borderTop: size + 'px solid transparent',
      borderLeft: size + 'px solid ' + color
    });
    this.$element.empty().append(this.arrowHead);
  }

  dashed (dashSize) {
    dashSize = dashSize===undefined ? 10 : dashSize;
    this.css({
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(90deg, transparent 30%, ' +this.props.backgroundColor+ ' 30%)',
      backgroundSize: dashSize + 'px'
    });
    return this;
  }
}
Thing.addClass(Line);

module.exports = Line;
