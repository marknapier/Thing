var Thing = require('../Thing/Thing.js');
var Box = require('../Box/Box.js');

class DemoBox extends Box {
	init (props) {
		var defaultProps = {
		  display: 'inline-block',
		  position: 'relative',
		  margin: '20px',
		  width: '200px',
		  height: '200px',
		  border: '2px dashed #eee'
		};
		props = $.extend({}, defaultProps, props);
		super.init(props);
		this.type = 'DemoBox';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);
	}
}
Thing.addClass(DemoBox);

module.exports = DemoBox;
