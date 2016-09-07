var Thing = require('../Thing/Thing.js');

class Box extends Thing {
  init (props) {
  	this.initialize(props);
  	this.type = 'Box';
  	this.items = [];
  	this.$element = Thing.makeElement(Thing.html(), this.props, this.type);
  }

  add (item) {
  	if (item) {
  		this.items.push(item);
  		item.parent = this;
  	}
  }

  // remove item from this box (from the dom and the items list)
  remove (item) {
	if (item) {
		var index = this.items.indexOf(item);
		if (index > -1) {
		    this.items.splice(index, 1);
			item.$element.remove();
			item.parent = null;
		}
	}
  }

  numElements () {
  	return this.items.length;
  }

  render () {
  	super.render();
  	for (var i=0; i < this.items.length; i++) {
  		this.items[i].render();
  	}
  }
}
Thing.addClass(Box);

module.exports = Box;
