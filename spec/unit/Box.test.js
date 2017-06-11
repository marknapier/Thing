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
	it('knows its bounds on the page', function () {
		let b = Thing.classes.Box.make({x:100, y:200, w:300, h:400});

		// remove any default whitespace from body tag
		$('body').css({padding:0, margin:0, border:0});

		b.render();
		expect(b.getBoundingBox()).toEqual({x:100, y:200, w:300, h:400, bottom:600, right:400});
		b.unRender();
	});
	it('knows the bounds of its elements on the page (even if they overflow the box)', function () {
		let b = Thing.classes.Box.make({x:100, y:200, w:20, h:20});  // 20x20 box
		b.add(Thing.make({x:0, y:0, w:100, h:100}));
		b.add(Thing.make({x:50, y:50, w:200, h:200}));   // 200x200 thing at 50,50

		// remove any default whitespace from body tag
		$('body').css({padding:0, margin:0, border:0});

		b.render();
		expect(b.getElementBounds()).toEqual({x:100, y:200, w:250, h:250, bottom:450, right:350});
		b.unRender();
	});
});
