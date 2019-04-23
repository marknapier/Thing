(function () {
  const TWOPI = 2 * Math.PI;
  let fillPattern = null;

  function clearCanvas(context, w, h, color) {
    context.save();
    context.clearRect(0, 0, w, h);
    context.fillStyle = color;
    context.fillRect(0, 0, w, h);
    context.restore();
  }

  function drawRectangle(context, x, y, w, h, color, lastr) {
    var fillWidth = Math.abs(w - lastr); // for rectangles, treat radius as width
    w = lastr + (fillWidth / 2);
    context.beginPath();
    context.rect(x-w, 0, w * 2, h);
    context.lineWidth = fillWidth;
    context.strokeStyle = color;
    context.stroke();
  }

  function drawRectangleFilledCentered(context, x, y, w, h, color) {
    w /= 2;
    context.beginPath();
    context.rect(x - w, 0, w * 2, h);
    context.fillStyle = color;
    context.fill();
  }

  function drawRectangleFilledRIGHT(context, x, y, w, h, color) {
    context.beginPath();
    context.rect(x, 0, w, h);
    context.fillStyle = color;
    context.fill();
  }

  function mapUVsToWidthRing(geometry, maxGeometryWidth) {
    var verts = geometry.attributes.position.array;
    var uvs = geometry.attributes.uv.array;

    var halfwidth = maxGeometryWidth / 2;
    var maxWidth = maxGeometryWidth * 2;
    for (let p=0, t=0; p < verts.length; p += 3, t += 2) {
      uvs[t] = (verts[p] + halfwidth) / maxWidth;
      uvs[t+1] = (verts[p+1] + halfwidth) / maxWidth;
    }
  }

  function makeArc(x, y, z, r, c) {
    var circleRadius = r;
    var geometry = new THREE.RingBufferGeometry( (r >= 3 ? r - 3 : 0), r, 60, 1, 0, 2 * Math.PI);
    mapUVsToWidthRing(geometry, 600);

    // var material = new THREE.MeshLambertMaterial( { opacity: 0.05, map: texture } );
    // var material = new THREE.MeshBasicMaterial( { color: '#ddddaa', transparent: true, opacity: 0.1, map: texture } );
    var material = new THREE.MeshBasicMaterial( { color: '#ddddaa', transparent: true, opacity: 0.1, map: texture } );
    // var material = new THREE.MeshPhongMaterial( { opacity: 0.05, map: texture } );

    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
  }

  function makeFatArc(innerR, outerR, c, texture, opacity, arcSize) {
    var geometry = new THREE.RingBufferGeometry(innerR, outerR, 60, 1, 0, arcSize);
    var material = new THREE.MeshBasicMaterial( { color: c, transparent: true, opacity: opacity, map: texture } );
    // var material = new THREE.MeshPhongMaterial( { color: c, transparent: true, opacity: opacity, map: texture } );
    mapUVsToWidthRing(geometry, outerR * 1);
    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
  }

  function mapUVsToWidth(uvArray, geometryWidth) {
    for (let i=0; i < uvArray.length; i++) {
      uvArray[i] = uvArray[i] / geometryWidth;
    }
  }

  function makeCircle(x, y, z, r, txtr) {
    var geometry = new THREE.CircleGeometry( r, 360 ); // radius, segments
    var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { transparent: true, map: txtr } ) );
    mesh.position.set( x, y, z );
    // mesh.rotation.set( 0, 0, 0 );
    // mesh.scale.set( 1, 1, 1 );
    return mesh;
  }

  function makeQuad(x, y, z, w, h, t, color) {
    var plane = new THREE.PlaneBufferGeometry(w, h);
    var mat = new THREE.MeshBasicMaterial({map: t, transparent: true, color: color});
    var quad = new THREE.Mesh(plane, mat);
    quad.position.set(x, y, z);
    return quad;
  }

  //////////////////////////////////////////////////////////

  var meshCache = null;

  function buildMeshes() {
    let cache = {};
    for (let r=0; r < 500; r++) {
      cache['' + r] = makeArc(0, 0, 0, r);
    }
    return cache;
  }

  function drawCircle(context, x, y, r, color, lastr) {
    if (!meshCache) {
      meshCache = buildMeshes();
    }

    r = Math.floor(r);
    lastr = Math.floor(lastr);

    let circles = [];
    let minR = Math.min(r, lastr);
    let maxR = Math.max(r, lastr);
    for (let i=minR; i < maxR; i++) {
      // console.log('push mesh', '' + i, minR, maxR);
      circles.push(meshCache[i]);
    }
    // var m = meshCache['' + Math.floor(r)];
    // return [m];
    // circles.length > 1 && console.log('circles', circles.length);
    return circles;
  }

  function drawDonut(context, x, y, r1, r2, startRadians = 0, endRadians = TWOPI, color = '#f00') {
    const outerR = Math.max(r1, r2);
    const innerR = Math.min(r1, r2);
    context.beginPath();
    context.arc(x, y, outerR, startRadians, endRadians, false); // Outer: CCW
    context.arc(x, y, innerR, endRadians, startRadians, true); // Inner: CW
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }

  function drawCirclePartial(context, x, y, r, color, lastr) {
    var fillWidth = Math.abs(r - lastr);
    var step = r >= lastr ? 1 : -1;
    var amount = (r / 250) * 2;  // magic number! number of overlaps
    var startAngle = amount * TWOPI;
    var endAngle = startAngle + (TWOPI * (0.6));

    context.beginPath();
    for (var s=0, rr=lastr; s < fillWidth; s++, rr += step) {
      context.arc(x, y, rr, startAngle, endAngle, false);
    }
    context.lineWidth = 2;  // magic number!!!
    context.strokeStyle = color;
    context.stroke();
  }

  function drawCircleFilled(context, x, y, r, color) {
    context.beginPath();
    context.arc(x, y, r, 0, TWOPI, false);
    context.fillStyle = color;
    context.fill();
  }

  function drawCirclePattern(context, x, y, r, color) {
    context.beginPath();
    context.arc(x, y, r, 0, TWOPI, false);
    context.fillStyle = fillPattern;
    context.fill();
  }

  function drawSpiralDashed(context, x, y, r, color) {
    var amount = (r / (250)) * 7;  // magic number! number of overlaps
    var startAngle = amount * TWOPI;
    var endAngle = startAngle + (TWOPI * (0.2));

    context.save();

    context.beginPath();
    context.arc(x, y, r, startAngle, endAngle, false);
    context.lineWidth = 25;
    context.strokeStyle = color;
    context.stroke();

    context.restore();
  }

  function drawSpiralDots(context, x, y, r, color) {
    var amount = (r / (250)) * 6;  // magic number! number of overlaps
    var startAngle = amount * TWOPI;
    var endAngle = startAngle + (TWOPI * (0.02 * (r / (250))));
    var draw = Math.floor(r) % 2 === 0;

    if (draw) {
      context.save();

      context.beginPath();
      // context.setLineDash([2, 10]);
      context.arc(x, y, r, startAngle, endAngle, false);
      context.lineWidth = 7;
      context.strokeStyle = color;
      context.stroke();

      context.restore();
    }
  }

  function drawCircleDashedRotatedNautilus(context, x, y, r, color) { // Nautilus spiral effect
    var amount = r / 250;  // magic number!
    var startAngle = amount * TWOPI;
    var endAngle = TWOPI;
    context.beginPath();
    context.setLineDash([5, 5]);
    context.arc(x, y, r, startAngle, endAngle, false);
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
  }

  function drawCircleDashedRotatedSpiralJumpy(context, x, y, r, color) {
    var amount = r / 3;  // magic number!
    var startAngle = amount * TWOPI;
    var endAngle = startAngle + (TWOPI * 0.1);
    context.beginPath();
    // context.setLineDash([2, 3]);
    context.arc(x, y, r, startAngle, endAngle, false);
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
  }

  function drawCircleDashedRotatedSpiralTexture(context, x, y, r, color) {
    var amount = r / 250;  // magic number!
    var startAngle = amount * TWOPI;
    var endAngle = startAngle + TWOPI;
    context.beginPath();
    context.setLineDash([2, 3]);
    context.arc(x, y, r, startAngle, endAngle, false);
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
  }

  function drawCircleDashedArcs(context, x, y, r, color) {
    var amount = r / 50;  // magic number!
    var startAngle = amount * TWOPI;
    var endAngle = startAngle + TWOPI;
    var dashLen = TWOPI / 180; // magic number!
    var dashSpace = dashLen;
    for (var a=startAngle; a < endAngle; a += (dashLen + dashSpace)) {
      context.beginPath();
      context.arc(x, y, r, a, a + dashLen, false);
      context.lineWidth = 2;
      context.strokeStyle = color;
      context.stroke();
    }
  }

  function drawCircleDashedArcsSpiraled(context, x, y, r, color, lastr) {

    var fillWidth = Math.abs(r - lastr);
    var dashLen = TWOPI / 60;
    var dashSpace = TWOPI / 360;  // 720

    for (var w=0; w < fillWidth; w++) {
      r = lastr + w;

      var amount = r / (250);  // magic number!
      var startAngle = amount * TWOPI;
      var endAngle = startAngle + TWOPI;

      for (var a=startAngle; a < endAngle; a += (dashLen + dashSpace)) {
        context.beginPath();
        context.arc(x, y, r, a, a + dashLen, false);
        context.lineWidth = 2;  // 2
        context.strokeStyle = color;
        context.stroke();
      }
    }
  }

  function drawCircleDashedArcsBlocks(context, x, y, r, color, lastr, maxR, numBands, numPies) {
    var fillWidth = Math.abs(r - lastr); // how many pixels to fill, from last radius to present radius
    var bandR = maxR / numBands; // how wide is each ring
    var pieWidth = TWOPI / numPies; // how wide in radians is each pie slice

    context.save();

    for (var w=0; w < fillWidth; w++) { // loop for as many pixels as we need to fill
      r = lastr + w; // increment radius by one

      var whichBand = Math.floor(r / bandR);
      var rotateAmount = whichBand * pieWidth;
      var startAngle = rotateAmount;
      var endAngle = startAngle + TWOPI;

      // draw dashed ring
      for (var a=startAngle; a < endAngle; a += (pieWidth + pieWidth)) {
        context.beginPath();
        context.arc(x, y, r, a, a + pieWidth, false);
        context.lineWidth = 2;  // 2
        context.strokeStyle = color;
        context.stroke();

        context.beginPath();
        context.arc(x, y, r, a+pieWidth, a + pieWidth + pieWidth, false);
        context.lineWidth = 2;  // 2
        context.strokeStyle = '#ffff9966';
        context.stroke();
      }
    }

    context.restore();
  }

  function createCirclePoints(numPoints, radius) {
    var points = [],
      angle,
      x,
      y,
      i;
    for (i=0; i<numPoints; i++) {
      angle = (i / (numPoints/2)) * Math.PI; // Calculate the angle at which the element will be placed.
      x = (radius * Math.cos(angle)); // Calculate the x position of the element.
      y = (radius * Math.sin(angle)); // Calculate the y position of the element.
      points.push({id: i, x: x, y: y, angle: angle});
    }
    return points;
  }

  function jiggle(points, howmuch) {
    for (var n=0; n < points.length; n++) {
      points[n].x += points[n].x * (Math.random() * howmuch);
      points[n].y += points[n].y * (Math.random() * howmuch);
    }
    return points;
  }

  function makeFlowerShape(txtr) {
    // var heartShape = new THREE.Shape(); // From httshapp://blog.burlock.org/html5/130-paths
    // heartShape.moveTo( 25, 25 ); // 1
    // heartShape.bezierCurveTo( 25, 25, 20, 0,      0, 0 );  // 2
    // heartShape.bezierCurveTo( -30, 0, -30, 35,  -30, 35 ); // 3
    // heartShape.bezierCurveTo( -30, 55, -10, 77,   25, 95 ); // 4
    // heartShape.bezierCurveTo( 60, 77, 80, 55,     80, 35 ); // 5
    // heartShape.bezierCurveTo( 80, 35, 80, 0,      50, 0 ); // 6
    // heartShape.bezierCurveTo( 35, 0, 25, 25,      25, 25 ); // 7

    function randPetals() {
      return 5 + Math.floor(Math.random() * 7);
    }

    // bezierCurveTo( from control point x, y,    to control point x, y,   to new point x, y)
    var daisy = new THREE.Shape();
    var numPetals = randPetals();
    var jiggleAmount = 0.1 + (Math.random() * 1.5);
    var outerRadius = Math.floor(100 + ( Math.random() * 250));
    var innerPoints = jiggle(createCirclePoints(numPetals, 50), jiggleAmount);
    var outerPoints = jiggle(createCirclePoints(numPetals, 250), jiggleAmount);
    daisy.moveTo( innerPoints[0].x, innerPoints[0].y );

    for (var n = 1; n < innerPoints.length; n++) {
      daisy.bezierCurveTo(
        outerPoints[n-1].x, outerPoints[n-1].y,
        outerPoints[n].x, outerPoints[n].y,
        innerPoints[n].x, innerPoints[n].y );
    }

    daisy.bezierCurveTo(
      outerPoints[innerPoints.length-1].x, outerPoints[innerPoints.length-1].y,
      outerPoints[0].x, outerPoints[0].y,
      innerPoints[0].x, innerPoints[0].y );

    var geometry = new THREE.ShapeBufferGeometry(daisy, 60);
    mapUVsToWidthRing(geometry, outerRadius);

    var mat = new THREE.MeshBasicMaterial( { color: 0xF6F300, transparent: true, map: txtr } );
    var mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set( 500 + Math.floor(Math.random() * 800), -(300 + Math.floor(Math.random() * 500)), -75 );

    return mesh;
    // return makeLineShape(daisy);
  }

  function makeLineShape(shape) {
    shape.autoClose = true;
    var points = shape.getPoints( 100 );
    var spacedPoints = shape.getSpacedPoints( 50 );
    var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
    var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );
    var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: 0xF6F300 } ) );
    return line;
  }

  function setPattern(p) {
    fillPattern = p;
  }

  function makeRandomArc(p) {
    function rand255() {
      return Math.floor(50 + Math.random() * 200);
    }

    function randOpacity() {
      // return 0.4 + (Math.random() * 0.6);
      return 0.2 + (Math.random() * 0.8);
    }

    function randRadius() {
      return Math.floor(2 + (Math.random() * 8)) * 50;
    }

    function randBandWidth() {
      return Math.floor(10 + Math.random() * 150);
    }

    function randArcSize() {
      var circleRad = 2 * Math.PI;
      var rad = 2.39996;
      var small = rad;
      var large = circleRad - rad;
      return (Math.random() > 0.5) ? small : large;
    }

    // var color = this.colorFactory.getColor(this.r / this.maxR);
    // var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHexString();
    var hex = tinycolor({r:rand255(), g:rand255(), b:rand255(), a:randOpacity()}).toHexString();
    // var hex = ['#ff0000', '#ddeeff', '#0000ff', '#ff00ff', '#cc0000', '#cc0033', '#3300cc', '#330099'][Math.floor(Math.random() * 7)];

    var bw = this.bandWidth || randBandWidth();
    var r = p.r || randRadius();
    var txtr = Math.random() > 0.65 ? Pulsar.textures[Math.floor(Math.random() * Pulsar.textures.length)] : undefined;  // GLOBAL!!!!
    p.r = r + bw;
    p.rotation = p.rotation || (Math.random() * (2 * Math.PI));

    p.mesh = Shapes.makeFatArc(
      r,
      r + bw,
      txtr ? '#fff' : hex,
      txtr,
      txtr ? 0.9 : randOpacity(),
      randArcSize(),
    );
    // set color and position
    p.mesh.material.color.set( txtr ? '#fff' : hex );
    p.mesh.rotateZ(p.rotation);
    // add it to scene
    p.context.add( p.mesh );
  }

  window.Shapes = {
    clearCanvas,
    drawRectangle,
    drawRectangleFilledCentered,
    drawRectangleFilledRIGHT,
    drawCircle,
    drawCirclePartial,
    drawCircleFilled,
    drawCirclePattern,
    drawSpiralDashed,
    drawSpiralDots,
    drawCircleDashedRotatedNautilus,
    drawCircleDashedRotatedSpiralJumpy,
    drawCircleDashedRotatedSpiralTexture,
    drawCircleDashedArcs,
    drawCircleDashedArcsSpiraled,
    drawCircleDashedArcsBlocks,
    drawDonut,
    makeFatArc,
    makeFlowerShape,
    makeRandomArc,
    makeCircle,
    makeQuad,
    createCirclePoints,
    TWOPI,
    setPattern,
  };

}())