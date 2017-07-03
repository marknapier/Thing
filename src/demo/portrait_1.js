/**
 * Created by mark.napier on 1/1/17.
 */
var Thing = window.Thing;

var imgNamesEyesRight = [
    'kim_eye_right_1.png',
    'kim_eye_right_2.png',
    'kim_eye_right_3.png',
    'kim_eye_right_4.png',
    'kim_eye_right_5.png',
    'kim_eye_right_6.png',
    'kim_eye_right_7.png',
    'kim_eye_right_8.png',
    'kim_eye_right_9.png',
    'kim_eye_right_10.png',
    'kim_eye_right_11.png',
    'kim_eye_right_12.png'
];

// var imgNamesEyesLeft = [
//     'elvis_eye_left_round.png',
//     'elvis_eye_left_square.png',
//     'marilyn_eye_left_fuzzy.png',
//     'marilyn_eye_left_round.png',
//     'marilyn_eye_left_square.png',
//     'mona_eye_left_circle.png',
//     'mona_eye_left_fuzzy.png',
//     'washington_eye_left_fuzzy.png',
//     'washington_eye_left_round.png',
//     'washington_eye_left_square.png',
//     'yoda_eye_left_fuzzy.png',
//     'yoda_left_eye.png'
// ];

// class ImgGrid extends Thing {
//     init (props) {
//         this.initialize(props);
//         this.path = props.path;
//         this.imgNames = props.names;
//         this.columns = props.columns || 10;
//         this.box = props.box;
//     }

//     render () {
//         this.pickImages(this.path, this.imgNames, this.box, this.columns);
//     }

//     pickImages (path, names, box, columns) {
//         var Rand = Thing.classes.Rand;
//         var dim = box.getDimensions();
//         var size = dim.w/columns;
//         var howMany = columns * columns;

//         for (var i=0; i < howMany; i++) {
//             var facepart = Thing.classes.Img.make({
//                 src: path + Rand.randItem(names),
//                 x: (i % columns) * size,
//                 y: Math.floor(i/columns) * size,
//                 w: size,
//                 h: size
//             });
//             box.add(facepart);
//         }

//         var L = Thing.classes.Label.make({
//             x: 50,
//             y: 50,
//             text:''+howMany,
//             color: 'red',
//             fontSize: 120
//         });
//         box.add(L);

//         box.render();
//     }
// }

class RedTextLabel extends Thing.classes.Label {
    init (props) {
        var defaultProps = {
            fontFamily: 'Verdana, Arial, sans-serif',
            fontSize: '400px',
            fontWeight: 'bold',
            color: 'rgb(211, 26, 26)'
        };
        props = $.extend({}, defaultProps, props);
        super.init(props);
        // this.initialize(props);
        // this.type = 'Label';
        // this.text = props.text;
        // this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
        // this.$element.append(this.text);
    }
}

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
        var max = 50;
        var $span = $('<span id="bdfiekdiek"></span>');
        var spanHeight = 0;

        // $('body').append(this.$element);
        this.$element.append($span);
        window.console.log('PRE ADD SPAN', maxHeight);
        while (spanHeight < maxHeight && max-- > 0) {
            $span.append(this.text);
            spanHeight = $('#bdfiekdiek').height();
            window.console.log('ADD SPAN', maxHeight, spanHeight, max);
        }
        // $('body').remove(this.$element);
    }

    render () {
        super.render();
        this.fillText(this.text);
    }
}

window.TextPane = TextPane;
window.RedTextLabel = RedTextLabel;

// function scaleDocument (n) {
//     var el = document.body;
//     el.style.transformOrigin = 'left top';
//     el.style.transform = 'scale(' + n + ')';
// }

function gradient(gradientCSS) {
    return Thing.make({position:'absolute', width:'100%', height:'100%', background:gradientCSS});
}

function makeBackground (w, h, scale) {
    return Thing.classes.Box
        .make( {w:w, h:h, backgroundColor: '#f00', position:'relative', display:'inline-block'} )
        .add( gradient('linear-gradient(to bottom, rgba(90,90,0,.1) 0%, rgba(0,90,0,.4) 100%)') )
        .add( gradient('linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,.1))') )
        .add( gradient('radial-gradient(ellipse at 80% 50%, rgba(228,244,137,.2) 0%, rgba(2,86,255,0.09) 91%, rgba(2,86,255,0) 100%)') )
        .add( Thing.classes.Pattern.make({
            pattern: 'GraphPaper',
            backgroundColor: 'transparent',
            size: scale*10,
            lineWidth: scale*5
        }) )
        .render();
}

function makeArrayOfLines(dim, scale) {
    var Rand = Thing.classes.Rand;
    var howMany = Rand.randInt(30,500);
    var items = [];

    for (var i=0; i < howMany; i++) {
        var Ln = Thing.classes.Line.make({
            x1: Rand.randCloseTo(0, 400),
            y1: Rand.randInt(0, dim.h),
            x2: Rand.randCloseTo(dim.w, 400),
            y2: Rand.randInt(0, dim.h),
            width: Rand.randInt(scale, scale*4),
            color: '#3F3',
            opacity: 0.1 + Rand.randFloat()
        });
        items.push(Ln);
    }

    return items;
}

function addRandomStuff (dim, items, path, scale) {
    var Rand = Thing.classes.Rand;

    // Arrow
    var A = Thing.classes.Arrow.make({
        x: Rand.randCloseTo(0, dim.w/3),
        y: Rand.randInt(0, dim.h),
        scale: Rand.randInt(scale,scale*20),
        rotate: Thing.classes.Rand.randInt(0,360),
        color: 'rgb(0, 235, 0)'
    });
    items.splice(Rand.randInt(1,items.length), 0, A);   // insert in the middle of array

    // Red number
    var R = RedTextLabel.make({
        text: ''+Thing.classes.Rand.randInt(0,360),
        x: Rand.randInt(0, dim.w*0.6),
        y: Rand.randInt(0, dim.h*0.75),
        fontSize: Rand.randInt(dim.w/10, dim.w/5)
    });
    items.splice(Rand.randInt(1,items.length), 0, R);

    // Eyes
    var howMany = Rand.randInt(1,4);
    scale = dim.w / 750;   // images are about 750px wide. Scale is the multiplier that will make image same width as container box.
    for (var i=0; i < howMany; i++) {
        var facepart = Thing.classes.Img.make({
            src: path + Rand.randItem(imgNamesEyesRight),
            x: Rand.randInt(0, dim.w*0.6),
            y: Rand.randInt(0, dim.h*0.6),
            scale: (0.1+(Rand.randFloat()*0.5)) * scale
        });
        items.splice(Rand.randInt(1,items.length), 0, facepart);
    }

    // Grid
    var gridPattern = Thing.classes.Pattern.make({
        pattern: 'GraphPaper',
        backgroundColor: 'transparent',
        size: scale * 13,
        lineWidth: scale * 2
    });
    items.splice(Rand.randInt(1,items.length), 0, gridPattern);

    return items;
}

function main () {
    var aspectRatio = 1.25;
    var pixelWidth = 1000;  //6000;
    var pixelHeight = pixelWidth * aspectRatio;  //7500;
    var mainScale = pixelWidth * 0.001;  // assume design is 1000 pixels wide, this will be 1
    var background = makeBackground(pixelWidth, pixelHeight, mainScale);
    var linesBox = Thing.classes.Box.make({w:pixelWidth, h:pixelHeight, overflow:'hidden'});
    var imgPath = 'img/KIM/eye_right/';
    var dim = linesBox.getDimensions();
    var lines = makeArrayOfLines(dim);

    lines = addRandomStuff(dim, lines, imgPath, mainScale);
    linesBox.add(lines);
    background.add(linesBox);
    background.render();

    window.linesBox = linesBox;
}

$(function () {
    // scaleDocument(3);
    main();
});

