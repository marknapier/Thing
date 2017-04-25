describe('Box', function () {
	it('lives in Thing.classes', function () {
		expect(typeof Thing.classes.Box).toBe('function');
	});
	it('defaults to absolute positioning', function () {
		let b = Thing.classes.Box.make();
		expect(b.$element.css('position')).toBe('absolute');
		expect(b.x).toBe(0);
		expect(b.y).toBe(0);
	});
	it('renders into body element by default', function () {
		let b = Thing.classes.Box.make();
		b.render();
		expect($('body').find('.Box').length).toBe(1);
		b.unRender();
	});
	it('can add things to itself', function () {
		let b = Thing.classes.Box.make();
		let t = Thing.make();
		b.add(t);
		expect(b.numElements()).toBe(1);
		expect(b.items[0]).toBe(t);
	});
	it('can remove things that were added', function () {
		let b = Thing.classes.Box.make();
		let t = Thing.make();
		b.add(t);
		b.remove(t);
		expect(b.numElements()).toBe(0);
		b.render();
		expect($('body').find('.Box').find('.Thing').length).toBe(0);
		b.unRender();
	});
	it('will be the parent of the things inside it', function () {
		let b = Thing.classes.Box.make();
		let t = Thing.make();
		b.add(t);
		expect(t.parent).toBe(b);
	});
	it('will render the things inside it', function () {
		let b = Thing.classes.Box.make();
		let t = Thing.make();
		b.add(t);
		b.render();
		expect($('body').find('.Box').length).toBe(1);
		expect($('body').find('.Box').find('.Thing').length).toBe(1);
		b.unRender();
	});
});
