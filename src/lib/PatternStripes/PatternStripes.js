var Thing = require('../Thing/Thing.js');

class PatternStripes extends Thing {
  init (props) {
    var defaultProps = {
      color: 'rgba(255,205,25,1)',
      radius: 100,
      size: 500
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
    this.type = 'PatternStripes';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    // stripes background
    this.css({
      backgroundImage: 'linear-gradient(90deg, transparent 50%, ' +props.color+ ' 50%)',
      backgroundSize: props.size + 'px'
    });
  }

  render () {
    if (this.parent) {
      super.render();
      // Adjust pattern to fill parent
      super.fillParent(this.props.stretch);
    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }

}
Thing.addClass(PatternStripes);

module.exports = PatternStripes;
