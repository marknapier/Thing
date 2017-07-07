var Thing = require('../Thing/Thing.js');
// var CSS = require('./Pattern.css');

function oneLine(s) {
  return (s.replace(/\r?\n|\r|\t/gm, '')).trim();
}


class Pattern extends Thing {
  init (props) {
    var defaultProps = {
      pattern: 'GraphPaper',
      stretch: true
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.initialize(props);
    this.type = 'Pattern';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.addClass(props.pattern);

    // Add the Patterns css (will add only once)
    // Thing.addCSSString(CSS, 'Pattern');
  }

  render () {
    super.render();

    // Adjust pattern to fill parent with a square aspect ratio
    super.fillParent(this.props.stretch);

    if (this.props.pattern && patternTemplates[this.props.pattern]) {
      var patternTemplate = patternTemplates[this.props.pattern];
      this.css( patternTemplate(this.props) );
    }
    else if (this.props.size) { // Tweak the size
      this.css({backgroundSize: this.props.size + '%'});
    }

    return this;
  }

  static makeGridPatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let color = props.color || 'rgba(255,255,255,.5)';
    let bgColor = props.backgroundColor || 'transparent';
    let lineWidth = props.lineWidth || 2;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px, ${size}px ${size}px`,
      backgroundPosition: `-${lineWidth}px -${lineWidth}px, -${lineWidth}px -${lineWidth}px`,
      backgroundImage: oneLine(`linear-gradient(${color} ${lineWidth}px, transparent ${lineWidth}px),
          linear-gradient(90deg, ${color} ${lineWidth}px, transparent ${lineWidth}px)`),
    };

    return patternCSS;
  }

  static makeGraphPaperPatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let divSize = size / 5;
    let color = props.color || 'rgba(255,255,255,.3)';
    let bgColor = props.backgroundColor || '#003';
    let lineWidth = props.lineWidth || 4;
    let lWidth = lineWidth / 2;
    let bgImg = `
        linear-gradient(${color} ${lineWidth}px, transparent ${lineWidth}px),
        linear-gradient(90deg, ${color} ${lineWidth}px, transparent ${lineWidth}px),
        linear-gradient(${color} ${lWidth}px, transparent ${lWidth}px),
        linear-gradient(90deg, ${color} ${lWidth}px, transparent ${lWidth}px)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${divSize}px ${divSize}px, ${divSize}px ${divSize}px`,
      backgroundPosition: `-${lineWidth}px -${lineWidth}px, -${lineWidth}px -${lineWidth}px, -${lWidth}px -${lWidth}px, -${lWidth}px -${lWidth}px`,
      backgroundImage: oneLine(bgImg),
    };

    return patternCSS;
  }

  static makeDiagonalStripePatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let color = props.color || '#0e0030';
    let bgColor = props.backgroundColor || 'transparent';
    let bgImg = `linear-gradient(45deg, ${color} 25%, transparent 25.15%, transparent 50%, ${color} 50.15%, ${color} 75%, transparent 75.15%, transparent)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px`,
      backgroundImage: oneLine(bgImg),
    };

    return patternCSS;
  }

  static makeVerticalStripePatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let color = props.color || 'rgba(255,205,25,1)';
    let bgColor = props.backgroundColor || 'transparent';
    let bgImg = `linear-gradient(90deg, transparent 50%, ${color} 50%)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px`,
      backgroundImage: bgImg,
    };

    return patternCSS;
  }

  static makePolkaDotPatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let mid = size / 2;
    let radius = props.radius || (size/5);
    let color = props.color || '#fffdd7';
    let bgColor = props.backgroundColor || 'transparent';
    let bgImg =
      `radial-gradient(${color} ${radius}px, transparent ${radius+2}px),
      radial-gradient(${color} ${radius}px, transparent ${radius+2}px)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px`,
      backgroundPosition: `0 0, ${mid}px ${mid}px`,
      backgroundImage: oneLine(bgImg),
    };

    return patternCSS;
  }

  static makeSofaPatternCSS(props) {
    props = props || {};

    let size = props.size || 100;
    let mid = size / 2;
    let bgColor = props.backgroundColor || '#300';
    let bg =
      `radial-gradient(hsl(0, 99%, 40%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0,
      radial-gradient(hsl(0, 100%, 40%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) ${mid}px ${mid}px,
      radial-gradient(hsla(0, 100%, 46%, 0.8) 20%, hsla(0, 100%, 20%, 0)) ${mid}px 0,
      radial-gradient(hsla(0, 100%, 41%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 ${mid}px,
      radial-gradient(hsl(0, 100%, 23%) 35%, hsla(0, 100%, 20%, 0) 60%) ${mid}px 0,
      radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) ${size}px ${mid}px,
      radial-gradient(hsla(0, 96%, 4%, 0.7), hsla(0, 100%, 20%, 0)) 0 0,
      radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) ${mid}px ${mid}px,
      linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0,
      linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0`;
    let patternCSS = {
      background: oneLine(bg),  // This has to come before backgroundSize or it doesn't show(?!)
      backgroundColor: bgColor,
      backgroundSize: `${size}px ${size}px`,
    };

    return patternCSS;
  }

  static makePlaidRedPatternCSS(props) {
    props = props || {};

    let bgColor = props.backgroundColor || 'hsl(0, 86%, 34%)';
    let bgImg =
      `repeating-linear-gradient(transparent,
        transparent 200px, rgba(40,0,160,.4) 200px, rgba(40,0,160,.4) 212px, transparent 212px,
        transparent 252px, rgba(40,0,160,.4) 252px, rgba(40,0,160,.4) 264px, transparent 264px,
        transparent 464px, rgba(0,60,0,.5) 464px, rgba(0,60,0,.5) 664px, rgba(255,255,200,.3) 664px, rgba(255,255,200,.3) 676px, rgba(0,60,0,.5) 676px,
        rgba(0,60,0,.5) 716px, rgba(255,255,200,.3) 716px, rgba(255,255,200,.3) 728px, rgba(0,60,0,.5) 728px,
        rgba(0,60,0,.5) 928px, transparent 928px),
      repeating-linear-gradient(270deg, transparent,
        transparent 200px, rgba(40,0,160,.4) 200px, rgba(40,0,160,.4) 212px, transparent 212px,
        transparent 252px, rgba(40,0,160,.4) 252px, rgba(40,0,160,.4) 264px, transparent 264px,
        transparent 464px, rgba(0,60,0,.5) 464px, rgba(0,60,0,.5) 664px, rgba(255,255,200,.3) 664px, rgba(255,255,200,.3) 676px, rgba(0,60,0,.5) 676px,
        rgba(0,60,0,.5) 716px, rgba(255,255,200,.3) 716px, rgba(255,255,200,.3) 728px, rgba(0,60,0,.5) 728px,
        rgba(0,60,0,.5) 928px, transparent 928px),
      repeating-linear-gradient(125deg, transparent,
        transparent 8px, rgba(0,0,0,.2) 8px,
        rgba(0,0,0,.2) 12px, transparent 12px,
        transparent 20px, rgba(0,0,0,.2) 20px)`;
    let patternCSS = {
      backgroundColor: bgColor,
      backgroundImage: oneLine(bgImg),
    };

    return patternCSS;
  }

  static makePatternFromCSS(css) {
    return this.make({pattern: 'none', size: null, stretch: true}).css(css);
  }
}

var patternTemplates = {
  Grid: Pattern.makeGridPatternCSS,
  GraphPaper: Pattern.makeGraphPaperPatternCSS,
  DiagonalStripes: Pattern.makeDiagonalStripePatternCSS,
  DiagonalStripesViolet: Pattern.makeDiagonalStripePatternCSS,
  VerticalStripes: Pattern.makeVerticalStripePatternCSS,
  Stripes: Pattern.makeVerticalStripePatternCSS,
  PatternStripes: Pattern.makeVerticalStripePatternCSS,
  PolkaDots: Pattern.makePolkaDotPatternCSS,
  PatternPolkaDots: Pattern.makePolkaDotPatternCSS,
  Sofa: Pattern.makeSofaPatternCSS,
  PlaidRed: Pattern.makePlaidRedPatternCSS,
};

Thing.addClass(Pattern);

module.exports = Pattern;
