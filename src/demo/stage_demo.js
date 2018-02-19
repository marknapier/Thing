var Thing = window.Thing;
var Makers = window.Makers;

function makeMarker (props) {
  let defaultProps = {
    backgroundColor: '#0d0',
    w: 10,
    h: 10,
    color: '#000',
    fontSize: '40px'
  };
  props = $.extend({}, defaultProps, props);
  return Thing.make(props);
}

$(function () {
  var stageWidth = 1200;
  var stageHeight = 800;
  var stageDepth = 800;

  var stage = Makers.makeStage({
    w: stageWidth,
    h: stageHeight,
    backgroundColor: 'rgb(124, 10, 0)',
  });

  // var rightWall = Thing.Img.make({
  //     src: 'img/vintagewallpaper4_crop.png',
  //     x: stageWidth,
  //     y: 0,
  //     w: stageDepth,
  //     h: stageHeight,
  //     rotate: {y:90},
  //     opacity: 0.5
  //   });

  // Highlight on back wall
  var lightSpot = Thing.make({
    w: stageWidth,
    h: stageHeight,
    background: 'radial-gradient(at 40% 30%, rgba(255, 145, 112, 0.278431) 10%, transparent 50%, rgba(25, 0, 72, 0.290196) 90%)'
  });
  var backWall = Thing.Box.make({
    w: stageWidth,
    h: stageHeight,
    z: -stageDepth,
    overflow: 'hidden'
  });
  backWall.add(lightSpot);

  // var wallpaper = Thing.Pattern.make({
  //   pattern: 'nothing',
  //   background: 'url(img/victorian_red_velvet_wallpaper.jpg)'
  // });

  // Room edge right side
  // var edge = Thing.Line.make({
  //   x1: stageWidth,
  //   y1: 0,
  //   x2: stageWidth,
  //   y2: stageHeight,
  //   width: 20,
  //   background: 'linear-gradient(rgb(0, 40, 80) 0%, rgb(255, 128, 0) 100%)'
  // });

  // Bleached wood floor
  var floor = Makers.makeFloorBleached({
    x: stageHeight,
    y: 0,
    w: stageWidth,
    h: stageDepth,
  });

  stage.add(makeMarker({x:0, y:0, z:-stageDepth}));
  stage.add(makeMarker({x:0, y:stageHeight-10, z:-stageDepth}));
  stage.add(makeMarker({x:stageWidth-10, y:0, z: -stageDepth}));
  stage.add(makeMarker({x:stageWidth-10, y:stageHeight-10, z: -stageDepth}));

  // stage.add(wallpaper);
  stage.add(backWall);
  // stage.add(rightWall);
  // stage.add(edge);
  stage.add(floor);

  stage.render();
});
