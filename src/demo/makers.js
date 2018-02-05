
window.Makers = (function () {
  var Thing = window.Thing;

  function makeStage (props = {}) {
    return Thing.Box.make({
      w: props.w || 5000,
      h: props.h || 3600,
      backgroundColor: '#ff6400',
      position: 'absolute',
      overflow: 'hidden',
      perspective: '4000px',
      perspectiveOrigin: '50% 50%',
      transformStyle: 'preserve-3d'
    });
  }

  function makeFloorBleached(props) {
    var defaultOptions = {
      x: -1200,
      y: 1605,
      w: 6100,
      h: 3600,
      backgroundSize: 400,
      rotate: {x: 90}
    };
    var _options = $.extend(defaultOptions, props);
    var floor = Thing.Box.make(_options)
      .add([
        Thing.make({  // wood texture
          width: '100%',
          height: '100%',
          background: 'url(img/wood_texture_smooth_panel_red_oak.jpg) center center / 100% 100% no-repeat',
        }),
        Thing.make({  // lines pattern
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(90deg, #f3daac 0.4%, #6a5f4b .8%, #6a5f4b 1.6%, #ffdc8d 2.0%, #f3daac 3%)',
          backgroundSize: '' + _options.backgroundSize + 'px ' + _options.backgroundSize + 'px',
          opacity: 0.85
        }),
        Thing.make({   // light spot
          width: '100%',
          height: '100%',
          background: 'radial-gradient(at 50% 40%, rgba(255, 252, 195, 0.3) 20%, transparent 35%, rgba(124, 72, 82, 0.55) 90%)'
        })
      ]);
    return floor;
  }

  return {
    makeStage,
    makeFloorBleached
  };
}());
