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
	it('renders itself into html', function () {
		let t = Thing.make();
		t.render();
		expect($('.Thing').length).toBe(1);
		t.unRender();
	});
	it('renders a DIV element by default', function () {
		let t = Thing.make();
		t.render();
		expect($('.Thing')[0].tagName).toBe('DIV');
		t.unRender();
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
	it('defaults to absolute positioning', function () {
		let t = Thing.make();
		expect(t.$element.css('position')).toBe('absolute');
		expect(t.x).toBe(0);
		expect(t.y).toBe(0);
	});
	it('takes CSS style properties as parameters', function () {
		let t = Thing.make({backgroundColor:'rgb(255, 0, 0)'});
		t.render();

		let $element = $('body').find('.Thing');
		expect($element.css('background-color')).toBe('rgb(255, 0, 0)');

		t.unRender();
	});
	it('converts "shorthand" w and h properties to CSS width and height properties', function () {
		let t = Thing.make({w:200, h:200});
		t.render();

		let $element = $('body').find('.Thing');
		expect($element.css('width')).toBe('200px');
		expect($element.css('height')).toBe('200px');

		t.unRender();
	});
	it('converts "shorthand" x, y and z properties to CSS transform property', function () {
		let t = Thing.make({x:100, y:200, z:300});
		t.render();

		let $element = $('body').find('.Thing');
		let transformCSS = $element.css('transform');
		let is3dMatrix = transformCSS.startsWith('matrix3d');
		let containsXYZCoords = transformCSS.includes('100, 200, 300');
		expect(is3dMatrix).toBe(true);
		expect(containsXYZCoords).toBe(true);

		t.unRender();
	});
	it('knows its dimensions', function () {
		let t = Thing.make({w:300, h:400});
		t.render();
		expect(t.getDimensions()).toEqual({w:300, h:400});
		t.unRender();
	});
});
