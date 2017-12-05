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

    // load the image
    loadImage(props.src, this.onLoad.bind(this), this.onError.bind(this));
  }

  onLoad (img) {
    this.loaded = true;
    this.aspectRatio = img.height / img.width;  // aspect ratio of original image
    this.w = this.w || img.width;
    this.h = this.h || (this.w * this.aspectRatio);
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
    this.width = this.height = 0;
    this.aspectRatio = 1;
    pageImgQueue.remove(this);
    // exec callback if any
    this.onImgError && this.onImgError(this);
  }

  setWidth (w) {
    this.width = w;
    this.height = w * this.aspectRatio;
    this.css({
        width: this.width,
        height: this.height
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
