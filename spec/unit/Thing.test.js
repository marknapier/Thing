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
	it('converts "shorthand" mask properties to CSS mask-image property', function () {
		let t = Thing.make({mask: {
			image: 'url(my_mask_image.png)',
			repeat: 'repeat',
			size: '50px 50px', 
			position: '25px 25px'
		}});
		t.render();

		let $element = $('body').find('.Thing');
		expect($element.css('webkit-mask-image').includes('my_mask_image.png')).toBe(true);
		expect($element.css('webkit-mask-repeat')).toBe('repeat');
		expect($element.css('webkit-mask-size')).toBe('50px 50px');
		expect($element.css('webkit-mask-position')).toBe('25px 25px');

		t.unRender();
	});
	it('can be re-rendered (preserves the original CSS properties plus any new ones that were added)', function () {
		let t = Thing.make({x:100, y:200, z:300, backgroundColor:'rgb(0, 0, 255)'});
		t.render();
		t.css({fontSize:'78px', color: 'rgb(255, 0, 0)'});
		t.render();

		let $element = $('body').find('.Thing');
		expect($element.css('transform').includes('100, 200, 300')).toBe(true);
		expect($element.css('background-color')).toBe('rgb(0, 0, 255)');
		expect($element.css('font-size')).toBe('78px');
		expect($element.css('color')).toBe('rgb(255, 0, 0)');

		t.unRender();
	});
	it('knows its dimensions', function () {
		let t = Thing.make({w:300, h:400});
		t.render();
		expect(t.getDimensions()).toEqual({w:300, h:400});
		t.unRender();
	});
	it('knows its position', function () {
		let t = Thing.make({x:500, y:600, z:700});
		t.render();
		expect(t.getTranslation()).toEqual({x:500, y:600, z:700});
		t.unRender();
	});
	it('sets the html element id', function () {
		let t = Thing.make({id: 'asdf', w:200});
		t.render();
		expect(document.getElementById('asdf').style.width).toEqual('200px');
		t.unRender();
	});
	it('sets CSS transform scale() when numeric scale property is provided', function () {
		let t = Thing.make({id: 'asdf', scale: 2.2});
		t.render();
		expect(document.getElementById('asdf').style.transform).toContain('scale(2.2)');
		t.unRender();
	});
	it('sets CSS transform scale3d() when {x,y,z} scale property is provided', function () {
		let t = Thing.make({id: 'asdf', scale: {x: 0.5, y: 1.0, z: 1.5} });
		t.render();
		expect(document.getElementById('asdf').style.transform).toContain('scale3d(0.5, 1, 1.5)');
		t.unRender();
	});
});
