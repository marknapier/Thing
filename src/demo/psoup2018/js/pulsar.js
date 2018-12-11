const TWOPI = 2 * Math.PI;

function clearCanvas(context, w, h, color) {
  context.save();
  context.clearRect(0, 0, w, h);
  context.fillStyle = color;
  context.fillRect(0, 0, w, h);
  context.restore();
  // context.fill();
}

function drawRectangle(context, x, y, r, color, lastr) {
  var fillWidth = Math.abs(r - lastr);
  r = lastr + (fillWidth / 2);

  context.beginPath();
  context.rect(x-r, 0, r * 2, 900); // !!! need height here
  context.fillStyle = '#00000000';
  context.fill();
  context.lineWidth = fillWidth;
  context.strokeStyle = color;
  context.stroke();
}

function drawCircle(context, x, y, r, color, lastr) {
  var fillWidth = Math.abs(r - lastr);
  r = lastr + (fillWidth / 2);

  context.beginPath();
  context.arc(x, y, r, 0, TWOPI, false);
  context.fillStyle = '#00000000';
  context.fill();
  context.lineWidth = fillWidth;
  context.strokeStyle = color;
  context.stroke();
}

function drawCircleFilled(context, x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, TWOPI, false);
  context.fillStyle = color;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = color;
  context.stroke();
}

function drawCirclePattern(context, x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, TWOPI, false);
  context.fillStyle = pattern;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = pattern;
  context.stroke();
}

function drawSpiral(context, x, y, r, color) {
  var amount = (r / (250 * scale)) * 6;  // magic number! number of overlaps
  var startAngle = amount * TWOPI;
  var endAngle = startAngle + (TWOPI * (0.02 * (r / (250 * scale))));
  var draw = Math.floor(r) % 2 === 0;

  if (draw) {
    context.save();

    context.beginPath();
    // context.setLineDash([2 * scale, 10 * scale]);
    context.arc(x, y, r, startAngle, endAngle, false);
    context.lineWidth = 7 * scale;
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

    var amount = r / (250 * scale);  // magic number!
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

function drawCircleDashedArcsBlocks(context, x, y, r, color, lastr) {
  var fillWidth = Math.abs(r - lastr);
  var dashLen = TWOPI / 60;
  var dashSpace = TWOPI / 60;

  for (var w=0; w < fillWidth; w++) {
    r = lastr + w;

    var band = Math.floor(r / (25 * scale));
    var amount = (band * 12.5) / (250 * scale);  // magic number!
    var startAngle = amount * TWOPI;
    var endAngle = startAngle + TWOPI;

    for (var a=startAngle; a < endAngle; a += (dashLen + dashSpace)) {
      context.save();

      context.beginPath();
      context.arc(x, y, r, a, a + dashLen, false);
      context.lineWidth = 2;  // 2
      context.strokeStyle = color;
      context.stroke();

      context.beginPath();
      context.arc(x, y, r, a+dashLen, a + dashLen + dashSpace, false);
      context.lineWidth = 2;  // 2
      context.strokeStyle = '#ffff9966';
      context.stroke();

      context.restore();
    }
  }
}

//============================================================

class ColorFactory {
  constructor(props = {colorFrom: [0,0,0,1], colorTo: [255,255,255,1]}) {
    if (props.color) {
      props.colorFrom = props.color;
      props.colorTo = props.color;
    }
    if (props.colorFrom && props.colorTo) {
      this.colorFrom = props.colorFrom.slice(0); // slice(0) clones the color RGB array
      this.colorTo = props.colorTo.slice(0);
    }
    if (props.palette) {
      this.palette = props.palette;
      this.colorFrom = props.palette[0].slice(0);
      this.colorTo = props.palette[props.palette.length-1].slice(0);
    }
  }

  getColor(position = 1) { // 0-1
    var newColor = [];
    // palette takes priority overy from-to colors
    if (this.palette) {
      newColor = this.palette[ Math.round((this.palette.length - 1) * position) ];
    } 
    else {
      newColor[0] = this.colorFrom[0] + Math.round((this.colorTo[0]-this.colorFrom[0]) * position);
      newColor[1] = this.colorFrom[1] + Math.round((this.colorTo[1]-this.colorFrom[1]) * position);
      newColor[2] = this.colorFrom[2] + Math.round((this.colorTo[2]-this.colorFrom[2]) * position);
      newColor[3] = this.colorFrom[3] + ((this.colorTo[3]-this.colorFrom[3]) * position);
    }
    return newColor;
  }

  getGradientValues(numSteps) {
    var gradient = [];
    if (numSteps > 1) {
      for (var i=0; i < numSteps; i++) {
        gradient.push(this.getColor(i/(numSteps-1)));
      }
    }
    return gradient;
  }

  getColorHex(position) {
    var color = this.getColor(position);
    return tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
  }
}

//============================================================

class Pulsar {
  constructor(props = {}) {
    this.colorFactory = props.colorFactory;
    this.context = props.context;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.r = props.r || 0;
    this.lastr = props.r || 0;
    this.maxR = props.maxR || (250 * scale);
    this.velocity = props.velocity || (0.02 * scale);
  }

  update(delta) {
    this.lastr = this.r;
    this.r += this.velocity * delta;
    // console.log('update - delta, lastr, r:', delta, this.lastr, this.r);
    if (this.r >= this.maxR) {
      this.velocity = -this.velocity;
      this.r = this.maxR;
    }
    if (this.r <= 0) {
      this.velocity = -this.velocity;
      this.r = 0;
    }
  }

  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    if (color === undefined) {
      debugger
    }
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    // mega-kludgey - pattern is created in main script
    // this.context.strokeStyle = pattern;

    drawCircle(
      this.context,
      this.x,
      this.y,
      this.r, //(this.r + (this.r - this.lastr) * interp), // * 1.5,
      hex,
      this.lastr,
    );
  }
}

//============================================================

class PulsarSolid extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    drawCircleFilled(
      this.context,
      this.x,
      this.y,
      (this.lastr + (this.r - this.lastr) * interp),
      hex
    );
  }
}

class PulsarVerticalBar extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    drawRectangle(
      this.context,
      this.x,
      this.y,
      this.r,  //(this.lastr + (this.r - this.lastr) * interp),
      hex,
      this.lastr,
    );
  }
}

class PulsarPattern extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    drawCirclePattern(
      this.context,
      this.x,
      this.y,
      (this.lastr + (this.r - this.lastr) * interp),
      hex
    );
  }
}

class PulsarChecked extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    drawCircleDashedArcsBlocks(
      this.context,
      this.x,
      this.y,
      this.r,
      hex,
      this.lastr,
    );
  }
}

class PulsarSpiral extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    drawCircleDashedArcsSpiraled(
      this.context,
      this.x,
      this.y,
      this.r,
      hex,
      this.lastr,
    );
  }
}

class PulsarDashed extends Pulsar {
  constructor(props) {
    super(props);
    this.band = 0;
  }

  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
    // var band = Math.floor(this.r / (6 * scale));

    // if (band !== this.band) {
    //   this.band = band;
      drawSpiral(
        this.context,
        this.x,
        this.y,
        this.r,
        hex,
        this.lastr,
      );
    // }

  }
}

//============================================================

class Slider {
  constructor(props = {}) {
    // this.color = props.color || '#ffff0022';
    this.colorFactory = props.colorFactory;
    this.context = props.context;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.r = props.r || 100;
    this.lastx = props.x || 0;
    this.minX = props.x || 0;
    this.maxX = props.maxX || 500;
    this.velocity = props.velocity || 0.02;
  }

  update(delta) {
    this.lastx = this.x;
    this.x += this.velocity * delta;
    if (this.x >= this.maxX || this.x <= this.minX) {
      this.velocity = -this.velocity;
    }
  }

  draw(interp) {
    var color = this.colorFactory.getColor(this.x / (this.maxX - this.minX));
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
    drawCircle(
      this.context,
      (this.lastx + (this.x - this.lastx) * interp),
      this.y,
      this.r,
      // this.color
      hex
    );
  }
}
