function makeBlendedDrawing(rendrr) {
  var scene;
  var camera;
  var rWidth = rendrr.getSize().width;
  var rHeight = rendrr.getSize().height;

  function makeDrawingScene() {
    var scene = new THREE.Scene();
    return scene;
  }

  function makeCamera() {
    var aspect = rWidth / rHeight;
    var cam = new THREE.OrthographicCamera(
      0, rWidth,
      0, -rHeight,
      1, 1000
    );

    cam.position.set( 0, 0, 500 );
    cam.lookAt( new THREE.Vector3(0, 0, 0) );
    cam.updateMatrixWorld();

    return cam;
  }

  function update() {
  }

  function render() {
    // renders into offscreent texture without clearing background: moving shapes will leave trails
    rendrr.render(scene, camera, offscreenTexture, true); // mem leak??
    // rendrr.render(scene, camera); // direct to screen
  }

  function makeOffscreenTexture(r) {
    return new THREE.WebGLRenderTarget( rWidth, rHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter, // THREE.NearestFilter, THREE.LinearFilter
      format: THREE.RGBFormat
    });
  }

  function getTexture() {
    return offscreenTexture.texture;
  }

  var scene = makeDrawingScene();
  var camera = makeCamera();
  var offscreenTexture = makeOffscreenTexture(rendrr);
  var raycaster = new THREE.Raycaster();

  return {
    update,
    render,
    getTexture,
    scene,
  };
}


