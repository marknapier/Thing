/**
 	Needs these js files:
	<script src='js/lines/LineSegmentsGeometry.js'></script>
	<script src='js/lines/LineGeometry.js'></script>
	<script src='js/lines/LineMaterial.js'></script>
	<script src='js/lines/LineSegments2.js'></script>
	<script src='js/lines/Line2.js'></script>
**/

window.FatLine = (function () {
	var matLine;

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

	function makeFlowerShape() {
	  function randPetals() {
	    return 5 + Math.floor(Math.random() * 7);
	  }

	  // bezierCurveTo( from control point x, y,    to control point x, y,   to new point x, y)
	  var daisy = new THREE.Shape();
	  var numPetals = randPetals();
	  var jiggleAmount = 0.1 + (Math.random() * 1.5);
	  var outerRadius = Math.floor(100 + ( Math.random() * 250));
	  var innerPoints = createCirclePoints(numPetals, 50);
	  var outerPoints = createCirclePoints(numPetals, 250);
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

	  return daisy;
	}

	function makeLineFromPoints(points) {
		var positions = [];
		var colors = [];
		var spline = new THREE.CatmullRomCurve3( points );
		var divisions = Math.round( 12 * points.length );
		var color = new THREE.Color();

		for ( var i = 0, l = divisions; i < l; i ++ ) {
			var point = spline.getPoint( i / l );
			positions.push( point.x, point.y, point.z );

			color.setRGB( 0, i % 5 ? 255 : 0, 0 );
			colors.push( color.r, color.g, color.b );
		}

		var geometry = new THREE.LineGeometry();
		geometry.setPositions( positions );
		geometry.setColors( colors );

		matLine = new THREE.LineMaterial( {
			color: 0xffffff,
			linewidth: 3, // in pixels
			vertexColors: THREE.VertexColors,
			//resolution:  // to be set by renderer, eventually
			dashed: false
		} );

		line = new THREE.Line2( geometry, matLine );
		line.computeLineDistances();

		return line;
	}

	function setResolution(vw, vh) {
		matLine &&
			matLine.resolution.set( vw, vh ); // resolution of the viewport
	}

	function makeFlowerOutline() {
		// Make outline of a flower
		var daisy = makeFlowerShape();
		var pointsDaisy = daisy.extractPoints().shape;
		var pointsDaisy3 = pointsDaisy.map(p => new THREE.Vector3(p.x, p.y, 0)); // add a z value to each point
		var flowerOutline = makeLineFromPoints(pointsDaisy3);

		return flowerOutline;
	}

	return {
		makeFlowerOutline,
		setResolution,
	};
}());
