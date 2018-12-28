(function () {
  const TWOPI = 2 * Math.PI;

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
    context.rect(x, 0, w, h); // !!! need height here
    context.fillStyle = color;
    context.fill();
  }

  function drawCircle(context, x, y, r, color, lastr) {
    var fillWidth = Math.abs(r - lastr);
    context.beginPath();
    context.arc(x, y, r + ((r-lastr) / 2), 0, TWOPI, false);
    context.lineWidth = fillWidth * 3;
    context.strokeStyle = color;
    context.stroke();
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
    context.fillStyle = pattern;
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
    TWOPI,
  };

}())