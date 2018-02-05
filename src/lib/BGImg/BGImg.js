var Thing = require('../Thing/Thing.js');

class BGImg extends Thing {
  init (props) {
    var defaultProps = {
      url: '',   // fully formed image definition e.g. url(img/blah.jpg) or linear-gradient() etc.
      src: '',   // image path e.g. 'img/blah.jpg'. Pass EITHER url OR src NOT BOTH.
      position: 'absolute',
      width: '100%',
      height: '100%',
      center: true,
      repeat: false,
      size: 'cover'    // contain|cover|100% 100%
    };
    props = this.props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
    this.type = 'BGImg';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.css(BGImg.makeBGImgCSS(props));
  }

  static makeBGImgCSS (props) {
    var url = props.url || ('url("' + props.src + '")');
    return {
      backgroundImage: url,
      backgroundRepeat: props.repeat ? 'repeat' : 'no-repeat',
      backgroundPosition: props.center ? 'center' : '0 0',
      backgroundSize: props.size
    };
  }
}
Thing.addClass(BGImg);

module.exports = BGImg;
