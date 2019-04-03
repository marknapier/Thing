var Intersections = (function () {
  function lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // calculate the direction of the lines
    var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      // point where the lines meet
      var intersectionX = x1 + (uA * (x2-x1));
      var intersectionY = y1 + (uA * (y2-y1));

      return true;
    }
    return false;
  }

  function lineRectIntersect(x1, y1, x2, y2, rx, ry, rw, rh) {
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    var left =   lineLineIntersect(x1,y1,x2,y2, rx,ry,rx, ry+rh);
    var right =  lineLineIntersect(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
    var top =    lineLineIntersect(x1,y1,x2,y2, rx,ry, rx+rw,ry);
    var bottom = lineLineIntersect(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
      return true;
    }
    return false;
  }

  // Check intersection of line seg and circle
  // A,B end points of line segment
  // C center of circle
  // radius of circle
  // returns distance from line to center if intersecting else 0   
  function doesLineIntersectCircle(A, B, C, radius) {
    var dist;
    const v1x = B.x - A.x;
    const v1y = B.y - A.y;
    const v2x = C.x - A.x;
    const v2y = C.y - A.y;
    // get the unit distance along the line of the closest point to
    // circle center
    const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);

    // if the point is on the line segment get the distance squared
    // from that point to the circle center
    if (u >= 0 && u <= 1) {
      dist = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
    } 
    else {
      // if closest point not on the line segment
      // use the unit distance to determine which end is closest
      // and get dist square to circle
      dist = u < 0 ?
      (A.x - C.x) ** 2 + (A.y - C.y) ** 2 :
      (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
    }

    if (dist < radius * radius) {
      return Math.sqrt(dist);
    }
    return 0;
  }

  function sqr(x) { 
    return x * x 
  }
  function dist2(v, w) { 
    return sqr(v.x - w.x) + sqr(v.y - w.y) 
  }
  function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, { x: v.x + t * (w.x - v.x),
                      y: v.y + t * (w.y - v.y) });
  }
  function distToSegment(p, v, w) { 
    return Math.sqrt(distToSegmentSquared(p, v, w)); 
  }

  function slope(p1, p2) {
    return (p2.y - p1.y) / (p2.x - p1.x);
  }

  function b(p1, p2) {
    // y=mx+b
    var m = slope(p1, p2);
    return p1.y - (m * p1.x); 
  }

  function makeLongLine(p1, p2) {
    var m = slope(p1, p2);
    var b = p1.y - (m * p1.x);
    var y1 = (m * 0) + b;
    var y2 = (m * 1200) + b;
    return [ {x: 0, y: y1}, {x: 1200, y: y2}];
  }

  function getNormal(a, b, c) {
    var u = {x: b.x - a.x, y: b.y - a.y};
    var v = {x: c.x - a.x, y: c.y - a.y};
    // z is always 0 here (2d only)
    var n = {
      x: (u.y * 0) - (0 * v.y),
      y: (0 * v.x) - (u.x * 0),
      z: (u.x * v.y) - (u.y * v.x),
    }
    return n;
  }


  return {
    lineRectIntersect,
    doesLineIntersectCircle,
    distToSegment,
    makeLongLine,
    getNormal,
  };
}());


