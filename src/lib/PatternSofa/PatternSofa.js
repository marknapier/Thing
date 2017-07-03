var Thing = require('../Thing/Thing.js');
var CSS = require('./PatternSofa.css');

class PatternSofa extends Thing {
  init (props) {
    var defaultProps = {
      size: 25
    };
    props = props || {};
    this.props = props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'PatternSofa';
    this.patternSizes = [5, 10, 12.5, 16.6, 25, 50]; // percent background sizes that don't distort pattern
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    Thing.addCSSString(CSS, 'PatternSofa');
  }

  render () {
    if (this.parent) {
      super.render();

      // resize pattern to fill parent element with a square aspect ratio
      this.fillParent(this.props.stretch);

      // Tweak the pattern size
      if (this.props.size) {
        this.css({backgroundSize: (this.patternSizes[this.props.size] || 25) + '%'});
      }
    }
    else {
      Thing.msg('Pattern.render(): Pattern needs to be added to a parent before calling render.');
    }
    return this;
  }
}
Thing.addClass(PatternSofa);

module.exports = PatternSofa;
