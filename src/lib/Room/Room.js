var Thing = require('../Thing/Thing.js');
var Box = require('../Box/Box.js');

/**
 *  w, h, depth, showOuter

	var r = Thing.classes.Room.make({
		x:1000, y:-500, w:1000, h:3625, d:3000, showOuter: false, overflow: 'hidden'
	});
	r.css({zIndex:15000});
	BG.add(r);
	r.render();
	$('.Room .Box').css({transform: 'rotateY(25deg)'});
 */
class Room extends Box {
	init (props) {
		var defaultProps = {
			w: 1500,
			h: 1000,
			d:  800,
			border: '1px solid black',
			perspective: 'inherit',  // '8000px'
			showOuter: false
		};
		props = $.extend({}, defaultProps, props);
		this.w = props.w;
		this.h = props.h;
		this.d = props.d;
		this.walls = {};

		super.init(props);
		// this.initialize(props); 

		this.type = 'Room';
		this.$element = Thing.makeElement(this.html(), this.props, this.type);  // basic Thing div with ID and class
		this.makeRoom(this.$element);
	}

	makeRoom() {
		var walls = [];
		var halfHeight = this.h/2;
		var halfWidth = this.w/2;
		var halfDepth = this.d/2;

		var room = Box.make({
			width: '100%',
			height: '100%',
			zIndex: 20000,
			position: 'absolute',
			transformStyle: 'preserve-3d',
			transition: 'transform 1s'
		});

		// Inner facing walls
		// walls.push( this.makeWall('front', {
		// 	background: 'rgba(255, 255, 255, 1)',
		// 	width: this.w + 'px',
		// 	height: this.h + 'px',
		// 	transform: 'rotateX( 180deg ) translateZ( ' + (halfDepth) + 'px )'
		// }) );
		walls.push( this.back = this.makeWall('back', {
			background: 'rgba(0, 0, 0, 1)',
			width: this.w + 'px',
			height: this.h + 'px',
			transform: 'translateZ( ' + (-halfDepth * 0.997) + 'px )'    // push back slightly less than full amount (0.997) or we get a slight gap at corners
		}) );
		walls.push( this.right = this.makeWall('right', {
			background: 'rgba(255, 0, 55, 1)',
			width: this.d + 'px',
			height: this.h + 'px',
			transform: 'rotateY( -90deg ) translateZ( ' + (-(halfWidth + (halfWidth-halfDepth))) + 'px )'
		}) );
		walls.push( this.left = this.makeWall('left', {
			background: 'rgba(255, 255, 0, 1)',
			width: this.d + 'px',
			height: this.h + 'px',
			transform: 'rotateY( 90deg ) translateZ( ' + (-halfDepth) + 'px )'
		}) );
		walls.push( this.top = this.makeWall('top', {
			background: 'rgba(0, 55, 255, 1)',
			width: this.w + 'px',
			height: this.d + 'px',
			transform: 'rotateX( -90deg ) translateZ( ' + (-(halfHeight - (halfHeight-halfDepth)) * 0.997) + 'px )'
		}) );
		walls.push( this.bottom = this.makeWall('bottom', {
			background: 'rgba(0, 255, 0, 1)',
			width: this.w + 'px',
			height: this.d + 'px',
			transform: 'rotateX( 90deg ) translateZ( ' + (-(halfHeight + (halfHeight-halfDepth)) * 0.997) + 'px )'
		}) );

		// Outer facing walls
		if (this.props.showOuter) {
			walls.push( this.makeWall('outfront', {
				background: 'rgba(255, 255, 255, 0)',
				width: this.w + 'px',
				height: this.h + 'px',
				transform: 'translateZ( ' + (halfDepth) + 'px )'
			}) );
			walls.push( this.makeWall('outback', {
				background: 'rgba(0, 0, 0, 1)',
				width: this.w + 'px',
				height: this.h + 'px',
				transform: 'rotateX( -180deg ) translateZ( ' + halfDepth + 'px )'
			}) );
			walls.push( this.makeWall('outright', {
				background: 'rgba(100, 100, 100, 1)',
				width: this.d + 'px',
				height: this.h + 'px',
				transform: 'rotateY( 90deg ) translateZ( ' + ((halfWidth + (halfWidth-halfDepth))) + 'px )'
			}) );
			walls.push( this.makeWall('outleft', {
				background: 'rgba(100, 100, 100, 1)',
				width: this.d + 'px',
				height: this.h + 'px',
				transform: 'rotateY( -90deg ) translateZ( ' + (halfWidth - (halfWidth-halfDepth)) + 'px )'
			}) );
			walls.push( this.makeWall('outtop', {
				background: 'rgba(100, 100, 200, 1)',
				width: this.w + 'px',
				height: this.d + 'px',
				transform: 'rotateX( 90deg ) translateZ( ' + halfDepth + 'px )'
			}) );
			walls.push( this.makeWall('outbottom', {
				background: 'rgba(100, 200, 100, 1)',
				width: this.w + 'px',
				height: this.d + 'px',
				transform: 'rotateX( -90deg ) translateZ( ' + (halfHeight + (halfHeight-halfDepth)) + 'px )'
			}) );
		}

		// copy walls array to object
		for (var i=0; i < walls.length; i++) {
			this.walls[ walls[i].which ] = walls[i];
		}

		room.add(walls);
		this.add(room);
		this.room = room;
	}

	makeWall(which, cssVals) {
		var defaultCSS = {
			display: 'block',
			position: 'absolute',
			// lineHeight: this.h + 'px',
			// fontSize: (this.h/3) +'px',
			// fontWeight: 'bold',
			// textAlign: 'center',
			// color: 'white',
			backfaceVisibility: 'hidden'
		};
		var wall = Thing.classes.Box.make($.extend({}, defaultCSS, cssVals));
		wall.$element.addClass('wall');
		wall.$element.addClass(which);
		// wall.$element.append(which);
		wall.which = which;
		return wall;
	}
}
Thing.addClass(Room);

module.exports = Room;
