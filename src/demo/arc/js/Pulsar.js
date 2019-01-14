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
    this.alpha = props.alpha;
  }

  getColor(position = 1) { // 0-1
    var newColor = [];
    // palette takes priority overy from-to colors
    if (this.palette) {
      newColor = this.palette[ Math.round((this.palette.length - 1) * position) ];
      if (this.alpha) {
        newColor[3] = this.alpha; // apply given alpha value to all palette pixels
      }
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

class Easing {
  // t=time, b=start value, c=change in value, d=duration
  static easeInOutCubic(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t + b;
    t -= 2;
    return c/2*(t*t*t + 2) + b;
  }

  static linear(t, b, c, d) {
    return c*t/d + b;
  }

  static easeInOutCubic1(t) {
    return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
  }

  static easeInOutSine(t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  }
}

//============================================================

class Pulsar {
  constructor(props = {}) {
    this.name = props.name || this.constructor.name;
    this.colorFactory = props.colorFactory;
    this.context = props.context;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.r = props.r || 0;
    this.lastr = props.r || 0;
    this.maxR = props.maxR || (250 * Pulsar.SCALE);
    this.rotateVelocity = props.rotateVelocity || 0;
    this.rotation = 0;
    this.point = [0,0];
    this.duration = props.duration || 1000; // milliseconds to full size
    this.time = props.time || 0; // how many millis are we into this objects duration
    this.direction = props.direction || 1; // 1 or -1
    this.velocity = props.velocity === undefined ? 1.0 : props.velocity; // how fast should time pass? >1 is faster <1 is slower
    this.friction = props.friction || 0.0; // how much to shave off velocity each update() e.g. 0.001
  }

  update(delta) {
    this.velocity -= this.velocity * this.friction;
    this.time += delta * this.velocity * this.direction;
    this.rotateVelocity -= this.rotateVelocity * this.friction;
    this.rotation += this.rotateVelocity;
    this.lastr = this.r;
    this.r = Pulsar.ease(this.time, 0, this.maxR, this.duration);

    // console.log('update - delta, lastr, r:', delta, this.lastr, this.r);
    if (this.r >= this.maxR) {
      this.r = this.maxR;
      this.time = this.duration;
      this.direction = -1;
    }
    else if (this.r <= 0) {
      this.r = 0;
      this.time = 0;
      this.direction = 1;
    }

    // update circumference point position
    var t = (Math.PI / 2) * this.rotation;
    this.point[0] = this.r * Math.cos(t) + this.x;
    this.point[1] = this.r * Math.sin(t) + this.y;
  }

  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    this.positionBegin();

    Shapes.drawCircle(
      this.context,
      0,
      0,
      this.r,
      hex,
      this.lastr,
    );

    this.positionEnd();
  }

  positionBegin() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.rotate((Math.PI / 2) * this.rotation);
  }

  positionEnd() {
    this.context.translate(-this.x, -this.y);
    // this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.restore();
  }
}

Pulsar.SCALE = 1.0;
Pulsar.ease = Easing.easeInOutSine;

//============================================================

class PulsarSolid extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    Shapes.drawCircleFilled(
      this.context,
      this.x,
      this.y,
      this.r,
      hex
    );
  }
}

class PulsarSolidWithOutline extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
    var bandWidth = 150;
    var innerR = this.r > bandWidth ? (this.r - bandWidth) : 0;

    this.positionBegin();

    Shapes.drawDonut(this.context, 0, 0, this.r, innerR, 0, Shapes.TWOPI, hex);

    // red outline
    var outlineW = 1;
    var outlineR = this.r - 1 < outlineW ? outlineW : this.r - 1;
    Shapes.drawCirclePartial(
      this.context,
      0,
      0,
      outlineR,
      '#ff3000',
      outlineR - outlineW
    );

    this.positionEnd();
  }
}

class PulsarVerticalBar extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
    var halfR = this.maxR / 2;

    Shapes.drawRectangleFilledRIGHT(
      this.context,
      this.x,
      this.y,
      this.r,
      800 * Pulsar.SCALE,
      hex,
      this.lastr,
    );
    if (this.direction > 0) {
      // dark thin edge on right
      Shapes.drawRectangleFilledRIGHT(
        this.context,
        this.x + this.r,
        this.y,
        1,
        800 * Pulsar.SCALE,
        '#c60',
        this.r - 2,
      );    
    }
  }
}

class PulsarVerticalBarToTheRight extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    Shapes.drawRectangleFilledRIGHT(
      this.context,
      this.x,
      this.y,
      this.r,  //(this.lastr + (this.r - this.lastr) * interp),
      800 * Pulsar.SCALE,
      hex,
      this.lastr,
    );
  }
}

class PulsarVerticalDivider extends Pulsar {
  constructor(props) {
    super(props);

    // This pulsar sweeps across the entire screen, from x=0 to x=1200.
    // To position the pulsar at the mouse click position, advance the current
    // time of the pulsar to match the click x position.
    this.time = (this.x / this.maxR) * this.duration;

    this.y = 0;
    this.bandWidth = 20 * Pulsar.SCALE;
  }
  
  draw(interp) {
    if (this.direction > 0) {
      const color = this.colorFactory.colorFrom;
      const hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
      this.context.globalCompositeOperation = 'overlay';  // source-over';  //hue  soft-light
      Shapes.drawRectangleFilledRIGHT(
        this.context,
        this.r - this.bandWidth,
        this.y,
        this.bandWidth,
        800 * Pulsar.SCALE,
        hex,
        this.lastr,
      );
    }
    else {
      const color = this.colorFactory.colorTo;
      const hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
      this.context.globalCompositeOperation = 'overlay';  //multiply'; //darken
      Shapes.drawRectangleFilledRIGHT(
        this.context,
        this.r,
        this.y,
        this.bandWidth,
        800 * Pulsar.SCALE,
        hex,
        this.lastr,
      );
    }

    this.context.globalCompositeOperation = 'source-over';
  }
}

class PulsarPattern extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    Shapes.drawCirclePattern(
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

    this.positionBegin();

    Shapes.drawCircleDashedArcsBlocks(
      this.context,
      0, //this.x,
      0, //this.y,
      this.r,
      hex,
      this.lastr,
      this.maxR,
      10,
      40
    );

    this.positionEnd();
  }
}

class PulsarSpiral extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    Shapes.drawCircleDashedArcsSpiraled(
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
    this.yes = true;
  }

  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();

    // hex = this.yes ? hex : '#0000';
    // this.yes = !this.yes;

    Shapes.drawSpiralDashed(
      this.context,
      this.x,
      this.y,
      this.r,
      hex,
      this.lastr,
    );

  }
}
