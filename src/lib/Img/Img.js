var Thing = require('../Thing/Thing.js');

/*
    src: <file path>
*/
class Img extends Thing {
  init (props) {
    props = props || {};

    this.type = 'Img';
    this.aspectRatio = 1;
    this.loaded = false;
    this.onImgLoaded = props.onImgLoaded;
    this.onImgError = props.onImgError;
    this.src = props.src;

    this.setDefaultProps(props);
    this.$element = Thing.makeElement(this.html(), this.props, this.type);

    // track the image load
    pageImgQueue.add(this);

    // load the image, or skip if javascript img is provided
    if (props.img) {
        this.onLoad(props.img);
    } else {
        loadImage(props.src, this.onLoad.bind(this), this.onError.bind(this));
    }
  }

  onLoad (img) {
    this.loaded = true;
    this.aspectRatio = img.height / img.width;  // aspect ratio of original image
    // if neither height nor width are provided, use native dimensions
    // if width is provided, recalc height based on aspectRatio
    // if height is provided, recalc width based on aspectRatio
    if (this.w || (!this.w && !this.h)) {
        this.w = this.w || img.width;
        this.h = this.h || (this.w * this.aspectRatio);
    }
    else {
        this.h = this.h;
        this.w = (this.h * (1/this.aspectRatio));
        window.console.log('img loaded', this.h, this.aspectRatio, (1/this.aspectRatio), this.w);
    }
    // set the image as the div's background
    this.css({
        width: this.w,
        height: this.h,
        background: 'url(' +img.src+ ') no-repeat center ' + (this.props.backgroundColor || ''),
        backgroundSize: '100% 100%'
    });
    // apply transforms now that we know image width and height
    this.transform();
    // clear image from the load queue
    pageImgQueue.remove(this);
    // exec callback if any
    this.onImgLoaded && this.onImgLoaded(this);
  }

  onError (img) {
    Thing.msg('Img.onError: Failed to load ' + img.src);
    this.loaded = true;
    this.w = this.h = 0;
    this.aspectRatio = 1;
    pageImgQueue.remove(this);
    // exec callback if any
    this.onImgError && this.onImgError(this);
  }

  setWidth (w) {
    this.w = w;
    this.h = w * this.aspectRatio;
    this.css({
        width: this.w,
        height: this.h
    });
    return this;
  }

  setHeight (h) {
    this.h = h;
    this.w = h * (1/this.aspectRatio);
    this.css({
        width: this.w,
        height: this.h
    });
    return this;
  }

  static onAllLoaded (func) {
    if (typeof func === 'function') {
        onLoadFunctions.push(func);
    }
    else {
        Thing.msg("IMG.onAllLoaded(): triggered");
        onLoadFunctions.forEach( (f) => { f(); } );
    }
  }

  static loadBatch (propsArray = [], onBatchLoaded = () => {}) {
    let q = new ImgQueue({onEmpty: () => { onBatchLoaded(loaded); }});
    let loaded = [];
    propsArray.forEach(function (props) {
        props.onImgLoaded = (img) => { 
            loaded.push(img); // has to be BEFORE q.remoe() so last image is included when q.onEmpty() fires.
            q.remove(img); 
        };
        props.onImgError = (img) => { 
            q.remove(img); 
        };
        q.add(Img.make(props));
    });
  }

  // expecting an object param like: { src: 'http;//path.to/image' }
  // string param will be converted into object with src property
  static getImage(imgConfigOrUrl) {
      var imgConfig = (typeof imgConfigOrUrl === 'string') ? {src: imgConfigOrUrl} : imgConfigOrUrl;
      return new Promise(function(resolve, reject) {
          var img = new Image();
          img.onload = function() {
              resolve(imgConfig);
          };
          img.onerror = function() {
              reject(imgConfig);
          };
          imgConfig.img = img;
          img.src = imgConfig.src;
      });
  }

  static loadImages(imagePaths, callback) {
      var promises = imagePaths.map(Img.getImage);
      Promise.all(promises)
      .then(function (imgsJSON) {
          // convert javascript img objects to Thing Img objects
          var thingImgs = imgsJSON.map(function (imgJSON) { return Thing.Img.make(imgJSON); });
          callback(thingImgs);
      })
      .catch(function(urls) {
          Thing.msg("Img.loadImages: Error fetching some images: " + urls);
      });       
  }
}

Thing.addClass(Img);


class ImgQueue {
    constructor (props = {onEmpty: function () {}}) {
        this.queuedImgs = [];
        this.onEmpty = props.onEmpty;
    }

    add (img) {
        if (img && !img.loaded) {
            this.queuedImgs.push(img);
        }
        return this.queuedImgs.length;
    }

    remove (img) {
        if (img && img.loaded) {
            var index = this.queuedImgs.indexOf(img);
            if (index > -1) {
                this.queuedImgs.splice(index, 1);
            }
            if (this.queuedImgs.length === 0) {
                this.onEmpty && this.onEmpty();
            }
        }
        return this.queuedImgs.length;
    }

    remaining () {
        return this.queuedImgs.length;
    }
}

function loadImage (src, callback, errorCallback) {
    var img = new Image();
    img.onload = function() {
        callback(this);
    };
    img.onerror = function () {
        errorCallback(this);
    };
    img.src = src;
}

var onLoadFunctions = [];
var pageImgQueue = new ImgQueue({onEmpty: () => Img.onAllLoaded()});

module.exports = Img;
