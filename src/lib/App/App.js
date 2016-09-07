
class App {
	constructor(props) {
		props = props || {};
	}

	render () {
		window.console.log('App.render()');
	}

	run () {
		window.console.log('App.run()');
	}

	init (config) {
		for (var section in config) {
			if (config.hasOwnProperty(section)) {
				var props = config[section];
				var cls = App.getClass[props.type];
				var thing = new cls(props);
				window.console.log("App init ", section, props);
				thing.render();
			}
		}
	}
}

module.exports = App;

