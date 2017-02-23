var Thing = require('../Thing/Thing.js');

class TextPane extends Thing {
    init (props) {
        var defaultProps = {
            fontFamily: 'Calibri, Verdana, Arial, sans-serif',
            fontSize: '24px',
            fontWeight: 'normal',
            color: 'rgb(200, 200, 200)',
            overflow: 'hidden',
            w: 100,
            h: 100
        };
        props = $.extend({}, defaultProps, props);
        super.init(props);
        this.type = 'TextPane';
        this.text = props.text;
        this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
    }

    fillText () {
        var maxHeight = this.$element.height();
        var max = 1000;
        var $span = $('<span></span>');
        var spanHeight = 0;

        // element has to be appended to body prior, or spanHeight will be 0
        this.$element.append($span);
        while (spanHeight < maxHeight && max-- > 0) {
            $span.append(this.text);
            spanHeight = $span.height();
        }
    }

    render () {
        super.render();
        this.fillText(this.text);
    }
}

Thing.addClass(TextPane);

module.exports = TextPane;
