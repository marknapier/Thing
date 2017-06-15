var Thing = require('../Thing/Thing.js');
var CSS = require('./Pattern.css');

class Pattern extends Thing {
  init (props) {
    var defaultProps = {
      color: '#ddd',
      pattern: 'GraphPaper',
      cellWidth: 100,
      cellHeight: 100,
      lineWidth: 2
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'Pattern';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.addClass(props.pattern);

    // Add the Patterns css (will add only once)
    Thing.addCSSString(CSS, 'Pattern');
  }

  render () {
    super.render();

    // Adjust pattern to fill parent with a square aspect ratio
    super.fillParent(this.props.stretch);

    // Tweak the size
    if (this.props.size) {
      this.css({backgroundSize: this.props.size + '%'});
    }

    return this;
  }
}
Thing.addClass(Pattern);

module.exports = Pattern;
