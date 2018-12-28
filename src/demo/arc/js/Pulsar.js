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

class Pulsar {
  constructor(props = {}) {
    this.colorFactory = props.colorFactory;
    this.context = props.context;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.r = props.r || 0;
    this.lastr = props.r || 0;
    this.maxR = props.maxR || (250 * Shapes.getScale());
    this.velocity = props.velocity || (0.02 * Shapes.getScale());
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

    Shapes.drawCircle(
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
    var width = 150;

    // Shapes.drawCircleFilled(
    //   this.context,
    //   this.x,
    //   this.y,
    //   this.r,
    //   hex
    // );

    let innerR = this.r > width ? (this.r - width) : 0;
    Shapes.drawDonut(this.context, this.x, this.y, this.r, innerR, 0, Shapes.TWOPI, hex);

    // red outline
    var outlineW = 1;
    var outlineR = this.r - 1 < outlineW ? outlineW : this.r - 1;
    Shapes.drawCirclePartial(
      this.context,
      this.x,
      this.y,
      outlineR,
      '#ff3000',
      outlineR - outlineW
    );
  }
}

class PulsarVerticalBar extends Pulsar {
  draw(interp) {
    var color = this.colorFactory.getColor(this.r / this.maxR);
    var hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
    var halfR = this.maxR / 2;

    // this.context.globalCompositeOperation = 'saturation';

    Shapes.drawRectangleFilledRIGHT(
      this.context,
      this.x,
      this.y,
      this.r,
      800 * Shapes.getScale(),
      hex,
      this.lastr,
    );
    if (this.velocity > 0) {
      // dark thin edge on right
      Shapes.drawRectangleFilledRIGHT(
        this.context,
        this.x + this.r,
        this.y,
        1,
        800 * Shapes.getScale(),
        '#c60',
        this.r - 2,
      );    
    }

    // this.context.globalCompositeOperation = 'source-over';
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
      800 * Shapes.getScale(),
      hex,
      this.lastr,
    );
  }
}

class PulsarVerticalDivider extends Pulsar {
  constructor(props) {
    super(props);
    this.newbie = true;
  }
  
  draw(interp) {
    if (this.newbie) {
      this.r = this.x;
      this.y = 0;
      this.newbie = false;
    }

    if (this.velocity > 0) {
      const color = this.colorFactory.colorFrom;
      const hex = tinycolor({r:color[0], g:color[1], b:color[2], a:color[3]}).toHex8String();
      this.context.globalCompositeOperation = 'overlay';  // source-over';  //hue  soft-light
      Shapes.drawRectangleFilledRIGHT(
        this.context,
        this.r - 20,
        this.y,
        20,
        800 * Shapes.getScale(),
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
        20,
        800 * Shapes.getScale(),
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

    Shapes.drawCircleDashedArcsBlocks(
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
   Shapes. drawCircle(
      this.context,
      (this.lastx + (this.x - this.lastx) * interp),
      this.y,
      this.r,
      // this.color
      hex
    );
  }
}
