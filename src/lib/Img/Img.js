var Thing = require('../Thing/Thing.js');

class Img extends Thing {
  init (props) {
    props = props || {};
    props.src = props.src || 'img/IMG_0021.JPG';
    super.init(props);
    this.type = 'Img';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
  }

  html () {
    return '<img src="' + this.props.src + '">';
  }
}

Thing.addClass(Img);

module.exports = Img;
