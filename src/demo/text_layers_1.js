var Thing = window.Thing;
var Rand = Thing.Rand;

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
        window.console.log('PRE ADD SPAN', maxHeight);
        while (spanHeight < maxHeight && max-- > 0) {
            $span.append(this.text);
            spanHeight = $span.height();
            window.console.log('ADD SPAN', maxHeight, spanHeight, max);
        }
    }

    render () {
        super.render();
        this.fillText(this.text);
    }
}

function makeTextPane (props) {
    var linesBox = Thing.Box.make({
        w: props.w,
        h: props.h,
        overflow: 'hidden',
        backgroundColor: props.backgroundColor || 'white'
    });
    var fontSize = props.fontSize || Rand.randInt(12, 48);

    linesBox.add( TextPane.make({
        text:'There was a man and a dog too this time. Two beasts, counting Old Ben, the bear, and two men, counting Boon and Hoggenbeck, in whom some of the same blood ran which ran in Sam Fathers, even though Boon\'s was a plebeian strain of it and only Sam and Old Ben and the mongrel Lion were taintless and incorruptible.',
        width:'100%',
        height:'100%',
        color: Rand.randRGBstr(),
        fontSize: fontSize
    }) );
    linesBox.add( TextPane.make({
        text:'That put the thing in a new light. Ben stopped nibbling his apple. Tom swept his brush daintily back and forth -- stepped back to note the effect -- added a touch here and there -- criticised the effect again -- Ben watching every move and getting more and more interested, more and more absorbed. Presently he said:',
        width:'100%',
        height:'100%',
        color: Rand.randRGBstr(),
        fontSize: fontSize
    }) );
    linesBox.add( TextPane.make({
        text:'On the surface, I was calm: in secret, without really admitting it, I was waiting for something. Her return? How could I have been waiting for that? We all know that we are material creatures, subject to the laws of physiology and physics, and not even the power of all our feelings combined can defeat those laws. All we can do is detest them. The age-old faith of lovers and poets in the power of love, stronger than death, that finis vitae sed non amoris, is a lie, useless and not even funny. So must one be resigned to being a clock that measures the passage of time, now out of order, now repaired, and whose mechanism generates despair and love as soon as its maker sets it going? Are we to grow used to the idea that every man relives ancient torments, which are all the more profound because they grow comic with repetition? That human existence should repeat itself, well and good, but that it should repeat itself like a hackneyed tune, or a record a drunkard keeps playing as he feeds coins into the jukebox...',
        width:'100%',
        height:'100%',
        color: props.backgroundColor,
        fontSize: fontSize
    }).rotate(90) );

    return linesBox;
}

window.TextPane = TextPane;

function main () {
    var aspectRatio = 1.25;
    var pixelWidth = 1000;  //6000;
    var pixelHeight = pixelWidth * aspectRatio;  //7500;
    var greens = ['#339911', '#008000', '#009000', '#008600', '#00aa00', '#008010', '#108000', '#30a000', '#00a030', '#30a030'];


    var txt0 = makeTextPane({w: pixelWidth, h: pixelHeight, backgroundColor: Rand.randItem(greens), fontSize: Rand.randInt(80,300)});
    txt0.add([
        Thing.Pattern.make({pattern: 'GraphPaper', backgroundColor: 'transparent'}).css({opacity: 0.7}),
        Thing.Pattern.make({pattern: 'PolkaDots', size: 40}),
    ]);

    var txt1 = makeTextPane({w: pixelWidth, h: pixelHeight, backgroundColor: Rand.randItem(greens)});

    var polkas = Thing.Pattern.make({pattern: 'PolkaDots', size: 207, radius: 30, color: '#fff'});

    txt1.css({
      WebkitMaskImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'><circle shape-rendering='geometricPrecision' cx='500' cy='500' r='300' stroke='black' stroke-width='0' fill='black'/></svg>\")",
      WebkitMaskRepeat: 'repeat',
      WebkitMaskSize: '20%',
      WebkitMaskPosition: '0 0'
    });
    txt1.add([
        Thing.Pattern.make({pattern: 'GraphPaper', backgroundColor: 'transparent'}).css({opacity: 0.7}),
        polkas,
    ]);

    txt0.render();
    txt1.render();

    window.txt1 = txt1;
}

$(function () {
    main();
});

