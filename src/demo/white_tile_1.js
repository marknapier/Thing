var Thing = window.Thing;

$(function () {

  // TILE
  var patternW = 3630;
  var patternH = 3630;
  var tileW = 500;
  var tileH = 500;
  var numTiles = (parseInt(patternW/tileW) + 1) * (parseInt(patternH/tileH) + 1);

  var tileBG = Thing.Box.make({
    backgroundImage: 'url(img/concrete_1.jpg)',
    position: 'absolute',
    w: patternW,
    h: patternH,
    overflow: 'hidden'
  });

  for (var i=0; i < numTiles; i++) {
    var randX = Thing.Rand.randInt(0,2000) * -1;  // less than width of background Texture
    var randY = Thing.Rand.randInt(0,1000) * -1;  // less than height of background Texture
    var tile = Thing.make({
      border: '1px solid rgba(0, 0, 0, 0.15)',
      boxShadow: 'rgb(255, 255, 255) 12px 12px 25px inset, rgb(180, 180, 180) -12px -12px 25px inset, rgba(33, 33, 33, 0.4) 6px 6px 8px',
      // backgroundImage: 'radial-gradient(ellipse farthest-corner at 140px 20px , rgba(250, 250, 250, 0.9) 30%, rgba(238, 238, 238, 0.8) 85%)',
      backgroundImage: 'url(img/white-marble-texture-lite.jpg)',
      backgroundPosition: randX+'px '+ randY+'px',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      float: 'left',
      w: tileW,
      h: tileH,
      margin: '5px',
      borderRadius: '6px'
    });
    tileBG.add(tile);
  }

  tileBG.render();

});
