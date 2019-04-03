function makeHUD(rendrr, sceneDrawnInTexture) {
  var scene;
  var camera;
  var marker;
  var rWidth = rendrr.getSize().width;
  var rHeight = rendrr.getSize().height;

  function makeMarker(w, h, color) {
    var square_material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
    var square_geometry = new THREE.PlaneBufferGeometry(w, h);
    var square_mesh = new THREE.Mesh(square_geometry, square_material);
    return square_mesh;
  }

  function drawLine(scene, x1, y1, x2, y2, color) {
    var lineWidth = 30;
    var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    var angle = Math.atan2(y2 - y1, x2 - x1); // * 180 / Math.PI;
    var ninetyRads = 90 * Math.PI/180;

    console.log('drawGesture xy2 xy1 len angle', x2, y2, x1, y1, length, angle);

    marker && scene.remove(marker);

    marker = makeMarker(lineWidth, length, 0xF00030);
    marker.rotateOnAxis( {x:0, y:0, z:1}, angle - ninetyRads );
    marker.position.set(x1, y1, 50);
    marker.translateY(length/2);
    scene.add(marker);
  }

  function makeHUDScene(sceneDrawnInTexture) {
    var materialScreen = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: sceneDrawnInTexture } },
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragment_shader_screen' ).textContent,
      depthWrite: false
    });
    var sceneHUD = new THREE.Scene();
    var plane = new THREE.PlaneBufferGeometry( rWidth, rHeight );
    var quad = new THREE.Mesh( plane, materialScreen );
    quad.position.set(rWidth/2, -rHeight/2, -100);
    sceneHUD.add( quad );
    return sceneHUD;
  }

  function makeCameraForScreen() {
    var aspect = rWidth / rHeight;
    var cam = new THREE.OrthographicCamera(
      0,
      rHeight * aspect,
      0,
      -rHeight,
      1,
      1000
    );
    cam.position.z = 100;
    return cam;
  }

  function update() {
  }

  function render() {
    rendrr.render(scene, camera);
  }

  function drawGesture(startX, startY, endX, endY) {
    drawLine(scene, startX, startY, endX, endY, null);
  }

  function addQuadWithTexture(t) {
    scene.add( makeQuad(260, -450, 50, 512, 512, t) );
  }

  var scene = makeHUDScene(sceneDrawnInTexture);
  var camera = makeCameraForScreen();
  var raycaster = new THREE.Raycaster();

  return {
    update,
    render,
    drawGesture,
    scene,
    addQuadWithTexture,
  };
}


