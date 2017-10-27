var Thing = require('../Thing/Thing.js');

// var blendModes = [
//   'normal',
//   // darker
//   'darken',
//   'multiply',
//   'color-burn',
//   // lighter
//   'lighten',
//   'color-dodge',
//   'screen',
//   // contrast
//   'overlay',
//   'hard-light',
//   'soft-light',
//   // inversion
//   'exclusion',
//   'difference',
//   // components
//   'hue',
//   'saturation',
//   'color',
//   'luminosity',
// ];

// {
//     position: relative;
//     display: inline-block;
//     background-color: rgb(255, 174, 174);
//     margin: 20px;
//     width: 300px;
//     height: 600px;
//     background-image: url(img/faceparts/washington_eye_left_round.png), url(img/faceparts/washington_eye_left_round.png);
//     background-size: 100% 50%, 110% 53%;
//     background-blend-mode: darken, color-burn;
//     background-position: 0px 0px, -13px -2px;
//     background-repeat: no-repeat, no-repeat;
// }



// // very high contrast
// {
//     position: relative;
//     display: inline-block;
//     background-color: rgb(128, 128, 128);
//     margin: 20px;
//     width: 300px;
//     height: 600px;
//     background-image: url(img/faceparts/washington_eye_left_round.png), url(img/faceparts/washington_eye_left_round.png);
//     background-size: 100% 50%, 100% 50%;
//     background-blend-mode: color-dodge, color-burn;
//     background-position: 0px 0px, -0px 0px;
//     background-repeat: no-repeat, no-repeat;
// }



class CompositeImg extends Thing {
  init (props = {}) {
    this.type = 'CompositeImg';
    this.layers = [];

    if (props.layers) {
      this.addLayer(props.layers);
      delete props.layers;  // don't let this propagate into css
    }

    this.setDefaultProps(props);

    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.applyLayers();  // will add layer CSS props to pops object so makeElement() will pick them up
    this.addMask(props.mask);  // make this part of convertToCSS()
  }

  addLayer (props = {}) {
    if (props instanceof Array) {
      props.forEach(this.addLayer.bind(this));
    }
    else if (props) {
      var layerProps = {
        backgroundImage: props.image || props.backgroundImage,
        backgroundSize: props.size || props.backgroundSize || '100% 100%',
        backgroundBlendMode: props.blendMode || props.backgroundMode || 'normal',
        backgroundPosition: props.position || props.backgroundPosition || '0px 0px',
        backgroundRepeat: props.repeat || props.backgroundRepeat || 'no-repeat',
      };
      this.layers.push(layerProps);
    }
  }

  // merge all layer properties into one background properties CSS object
  makeCSS () {
    var mergedLayers = {};
    if (this.layers.length > 0) {
      mergedLayers = this.layers.reverse().reduce(function (merged, layerProps) {
        merged.backgroundImage += (', ' + layerProps.backgroundImage); 
        merged.backgroundSize += (', ' + layerProps.backgroundSize); 
        merged.backgroundBlendMode += (', ' + layerProps.backgroundBlendMode); 
        merged.backgroundPosition += (', ' + layerProps.backgroundPosition); 
        merged.backgroundRepeat += (', ' + layerProps.backgroundRepeat); 
        return merged;
      });
    }
    return mergedLayers;
  }

  // make (props) {
  //   return Thing.make($.extend({
  //     w: 1200,
  //     h: 2750,
  //     backgroundColor: 'red',
  //   }, props));
  // }

  applyLayers () {
    this.css(this.makeCSS());
  }
}
Thing.addClass(CompositeImg);

module.exports = CompositeImg;
