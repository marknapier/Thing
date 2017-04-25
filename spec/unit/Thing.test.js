describe('Thing', function () {
	it('lives!', function () {
		expect(typeof Thing).toBe('function');
	});
	it('makes things', function () {
		let t = Thing.make();
		expect(typeof t).toBe('object');
	});
});

describe('A Thing', function () {
	it('defaults to absolute positioning', function () {
		let t = Thing.make();
		expect(t.$element.css('position')).toBe('absolute');
		expect(t.x).toBe(0);
		expect(t.y).toBe(0);
	});
	it('renders into body element by default', function () {
		let t = Thing.make();
		t.render();
		expect($('body').find('.Thing').length).toBe(1);
		t.unRender();
	});
	it('un-renders (removes itself from parent element)', function () {
		let t = Thing.make();
		t.render();
		expect($('body').find('.Thing').length).toBe(1);
		t.unRender();
		expect($('body').find('.Thing').length).toBe(0);
	});
	it('takes CSS style properties as parameters', function () {
		let t = Thing.make({backgroundColor:'rgb(255, 0, 0)'});
		t.render();
		
		let $element = $('body').find('.Thing');
		expect($element.css('background-color')).toBe('rgb(255, 0, 0)');

		t.unRender();
	});
});
