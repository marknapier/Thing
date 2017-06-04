var Thing = require('../Thing/Thing.js');

class Label extends Thing {
	init (props) {
		var defaultProps = {
			text: '',
			fontFamily: 'Roboto, Calibri, Arial, sans-serif',
			fontSize: '14px',
			color: '#000'
		};
		props = $.extend({}, defaultProps, props);
		this.initialize(props);
		this.type = 'Label';
		this.text = props.text;
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.setText(props.text);

		Thing.addFontURL('https://fonts.googleapis.com/css?family=Roboto:400,500,700,900', 'roboto_font');
	}

	setText (txt) {
		this.text = txt;
		this.$element.empty().text(txt);
		return this;
	}
}
Thing.addClass(Label);

module.exports = Label;
