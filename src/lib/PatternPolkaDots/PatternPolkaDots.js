var Thing = require('../Thing/Thing.js');

class PatternPolkaDots extends Thing {
  init (props) {
    var defaultProps = {
      color: '#fffdd7',
      radius: 100,
      size: 500
    };
    props.radius = props.radius || props.size/5;
    this.props = props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'PatternPolkaDots';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    // polka dots background
    this.css({
      backgroundImage: 'radial-gradient(' +props.color+ ' ' +props.radius+ 'px, transparent ' +(props.radius+2)+ 'px), radial-gradient(' +props.color+ ' ' +props.radius+ 'px, transparent ' +(props.radius+2)+ 'px)',
      backgroundSize: props.size + 'px',
      backgroundPosition: '0 0, ' +(props.size/2)+ 'px ' +(props.size/2)+ 'px'
    });
  }

  render () {
    if (this.parent) {
      super.render();
      // Adjust pattern to fill parent with a square aspect ratio
      var size = Math.max(this.parent.$element.width(), this.parent.$element.height());
      this.css({
        position: 'absolute',
        left: '0px', top: '0px',
        width: size, height: size
      });
    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }

}
Thing.addClass(PatternPolkaDots);

module.exports = PatternPolkaDots;
