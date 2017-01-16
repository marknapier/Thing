var Thing = require('../Thing/Thing.js');
var Action = require('../Action/Action.js');
var Timer = require('../Timer/Timer.js');
var External = require('../External/External.js');


class Pulsar extends Action {
	init (props) {
		props = props || {};
		this.callback = props.callback || function () {};
		this.delay = props.delay || 1000;
		this.T = Timer.make({callback: this.trigger.bind(this), delay: this.delay});

		// Create external function
		this.action = External(function action () {});

		return this;
	}

	go () {
		this.T.go();
		return this;
	}

	stop () {
		this.T.stop();
	}

	trigger () {
		this.action(); // call external function
		this.T.go();
	}
}
Thing.addClass(Pulsar);

module.exports = Pulsar;
