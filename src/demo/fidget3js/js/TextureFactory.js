function makeTextureFactory(rendrr, tsize = 512) {
  /** 
    This module will copy pixels from the framebuffer into a texture. 
    -- The framebuffer may contain more pixels than the canvas size. For example 
       the Mac retina display has 2 framebuffer pixels per 1 screen pixel (dpr=2), and  
       my HP laptop has 1.25 framebuffer pixels per 1 screen pixel. 
    -- Either way I want to always copy exactly tsize X tsize pixels into the texture 
    -- Texture dimensions (tsize) have to be a power of 2 or the texture will not tile  
       correctly when I use it to create patterns.
    -- Since the texture size is fixed (e.g. 512) but the framebuffer size is 
       variable (1, 1.25, 2) I scale the scene to fit into exactly 512 actual pixels.
  */
  var scene;
  var camera;
  var framebufferTexture;
  var dpr = rendrr.getPixelRatio();
  var sceneScale = 1/dpr;
  var rWidth = rendrr.getSize().width;
  var rHeight = rendrr.getSize().height;

  function makeScene() {
    var scene = new THREE.Scene();
    scene.scale.set(sceneScale, sceneScale, 1);
    return scene;
  }

  // camera maps pixel to pixel with the dimensions of the webgl renderer
  // 0,0 is at center
  function makeCamera(w, h) {
    var cam = new THREE.OrthographicCamera(
      w / -2,
      w / 2,
      h / 2,
      h / -2,
      -1000,
      1000
    );

    cam.position.x = 0;
    cam.position.y = 0;
    cam.position.z = 500;
    cam.lookAt( scene.position );
    cam.updateMatrixWorld();

    return cam;
  }

  function clearScene(scn) {
    let chilluns = scn.children.slice(0);
    chilluns.forEach((c) => c.parent.remove(c));
  }

  function render(sceneFunction) {
    clearScene(scene);

    // add things to the scene
    sceneFunction(scene);

    rendrr.clear();

    // render the scene to framebuffer
    rendrr.render(scene, camera);

    // center the texture proportions in pixel buffer (account for more pixels in framebuffer)
    var lowerLeftCorner = new THREE.Vector2(
      (rendrr.getSize().width * dpr / 2) - (tsize / 2),
      (rendrr.getSize().height * dpr / 2) - (tsize / 2)
    );

    // copy framebuffer to texture
    rendrr.copyFramebufferToTexture( lowerLeftCorner, framebufferTexture );
  }

  function makeTexture() {
    var data = new Uint8Array( tsize * tsize * 4 );
    // RGBA format assumes that webgl backbuffer has alpha (see {alpha: true} parameter in Renderer)
    var texture = new THREE.DataTexture( data, tsize, tsize, THREE.RGBAFormat );
    texture.minFilter = THREE.LinearFilter; //LinearFilter; // LinearMipMapLinearFilter
    texture.magFilter = THREE.LinearFilter;

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(2, 2);

    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }

  function getTexture2() {
    return framebufferTexture;
  }

  scene = makeScene();
  camera = makeCamera(rWidth, rHeight);
  framebufferTexture = makeTexture();

  return {
    update,
    render,
    getTexture2,
    scene,
  };
}

