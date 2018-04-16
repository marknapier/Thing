
function drawCircle(context, x, y, r, color) {
  r = (r < 0) ? 0 : r;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fillStyle = '#00000000';
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = color;
  context.stroke();
}

function drawCircleFilled(context, x, y, r, color) {
  r = (r < 0) ? 0 : r;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = color;
  context.stroke();
}

function clearCanvas(color) {
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.fill();
}

//============================================================

class ColorFactory {
  constructor(props = {colorFrom: [0,0,0,1], colorTo: [255,255,255,1]}) {
    if (props.color) {
      props.colorFrom = props.color;
      props.colorTo = props.color;
    }
    this.colorFrom = props.colorFrom.slice(0);
    this.colorTo = props.colorTo.slice(0);
  }

  getColor(position = 1) { // 0-1
    var newColor = [];
    newColor[0] = this.colorFrom[0] + Math.round((this.colorTo[0]-this.colorFrom[0]) * position);
    newColor[1] = this.colorFrom[1] + Math.round((this.colorTo[1]-this.colorFrom[1]) * position);
    newColor[2] = this.colorFrom[2] + Math.round((this.colorTo[2]-this.colorFrom[2]) * position);
    newColor[3] = this.colorFrom[3] + ((this.colorTo[3]-this.colorFrom[3]) * position);
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
    this.maxR = props.maxR || 250;
    this.velocity = props.velocity || 0.02;
  }

  update(delta) {
    this.lastr = this.r;
    this.r += this.velocity * delta;
    if (this.r >= this.maxR || this.r <= 0) {
      this.velocity = -this.velocity;
    }
  }

  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    // if (!this.skip) {
    //   this.skip = (Math.random() > 0.996) ? Math.floor(Math.random()*15) : 0;
    // }

    // this.skip = (this.skip && --this.skip);

    if (this.skip) hex = '#ffff0022';
    // if (!this.skip) {
      drawCircle(
        this.context,
        this.x,
        this.y,
        (this.lastr + (this.r - this.lastr) * interp), // * 1.5,
        hex
      );
    // }
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
