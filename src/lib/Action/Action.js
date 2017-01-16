var Thing = require('../Thing/Thing.js');

class Action {
	constructor() {
	}

	init (props) {
		this.props = props || {};
		return this;
	}

	go () {
		window.console.log('Action.go()');
	}

	stop () {
		window.console.log('Action.stop()');
	}

	static make () {
	  var cls = this;
	  var instance = new cls();
	  instance.init.apply(instance, arguments);

	  // bind member functions to the instance
	  /* jshint ignore:start */
	  Object.getOwnPropertyNames(instance.__proto__).forEach(function (key) {
	    if (typeof instance[key] === 'function') {
	      instance[key] = instance[key].bind(instance);
	      window.console.log('BOUND', key);        
	    }
	  });
	  /* jshint ignore:end */

	  return instance;
	}
}
Thing.addClass(Action);

module.exports = Action;
