var Thing = require('../Thing/Thing.js');

class BGImg extends Thing {
  init (props) {
    var defaultProps = {
      url: '',
      position: 'absolute',
      width: '100%',
      height: '100%',
      center: true,
      repeat: false,
      size: 'cover'    // contain|cover|100% 100%
    };
    props = this.props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'BGImg';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.css({
      background: 'url("' + props.url + '")',
      backgroundRepeat: props.repeat ? 'repeat' : 'no-repeat',
      backgroundPosition: props.center ? 'center' : '0 0',
      backgroundSize: props.size
    });
  }
}
Thing.addClass(BGImg);

module.exports = BGImg;
