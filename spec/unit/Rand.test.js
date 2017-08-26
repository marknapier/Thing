describe('Rand', function () {
	it('inits with a given seed value', function () {
		let R = Thing.classes.Rand;
		R.init(1234);
		expect(R.random()).toBe(0.19151945016346872);
		expect(R.random()).toBe(0.49766366626136005);
	});
	it('inits to a random seed value if none is given', function () {
		let R = Thing.classes.Rand;
		R.init();
		expect(R.random()).not.toBe(0.19151945016346872);
		expect(R.random()).not.toBe(0.49766366626136005);
	});
	it('auto-inits to a random seed value if init is not called', function () {
		let R = Thing.classes.Rand;
		let n = R.random();
		expect(n).not.toBeLessThan(0);
		expect(n).not.toBeGreaterThan(1);
	});
	it('generates a random float between 0 and 1', function () {
		let R = Thing.classes.Rand;
		R.init();

		let min = 0;
		let max = 0;
		for (let i=0; i < 100; i++) {
			let n = R.randFloat();
			max = n > max ? n : max;
			min = n < min ? n : min;
		}
		
		expect(min).not.toBeLessThan(0);
		expect(max).not.toBeGreaterThan(1);
	});
	it('generates a random integer between a min and max value (inclusive)', function () {
		let R = Thing.classes.Rand;
		R.init();

		let min = 7;
		let max = 7;
		for (let i=0; i < 100; i++) {
			let n = R.randInt(5,10);
			max = n > max ? n : max;
			min = n < min ? n : min;
		}
		
		expect(min).not.toBeLessThan(5);
		expect(max).not.toBeGreaterThan(10);
		expect(min).toBe(5);
		expect(max).toBe(10);
	});
	it('selects a random item from an array', function () {
		let R = Thing.classes.Rand;
		R.init();

		let items = ['foo', 'bar', 'baz', 'blort', 'barf'];
		let fails = 0;
		let min = 999;
		let max = 0;
		for (let i=0; i < 100; i++) {
			let item = R.randItem(items);
			let position = items.indexOf(item);
			fails += (position >= 0) ? 0 : 1;
			min = position < min ? position : min;
			max = position > max ? position : max;
		}
		
		expect(fails).toBe(0);    // always returns array element
		expect(min).toBe(0);            // includes the first element
		expect(max).toBe(items.length-1);    // includes the last element
	});
	it('generates a boolean that is true a given percentage of the time', function () {
		let R = Thing.classes.Rand;
		R.init();

		let yesses = 0;
		for (let i=0; i < 100; i++) {
			yesses += R.randBoolean(30) ? 1 : 0;
		}
		
		// leave a margin of +-10% around the given threshold value
		expect(yesses).not.toBeGreaterThan(40);
		expect(yesses).not.toBeLessThan(20);
	});
});
