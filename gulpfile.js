var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var newer = require('gulp-newer');
var print = require('gulp-print').default;

// get modules for browserify in gulp
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// so we can require() css and html in code
var stringify = require('stringify');

var bases = {
	src: 'src/lib/',
	dist: 'dist/',
};

var paths = {
	scripts: ['src/lib/**/*.js'],
	// html: ['src/demo/index.html', '!src/demo/test.html'],
	dist: 'dist/'
};

var config = {
	jshint: {
	    // files: path.join(bases.src, '**/*.js'),
	    options: {
	        browser: true,
	        browserify: true,
	        curly: true,
	        esversion: 6,
	        eqeqeq: true,
	        eqnull: true,
	        expr: true,
	        forin: true,
	        globals: {
	            // Thing: true,
	            $: true
	        },
	        indent: 4,
	        lookup: false,
	        multistr: true,
	        scripturl: true,
	        strict: false,
	        trailing: true,
	        undef: true,
	        unused: true
	    }
	},
	browserify: {
		options: {
			entries: 'src/lib/index.js',
			debug: true,
			// insertGlobals: true,
			// defining transforms here will avoid crashing your stream
			transform: [
				[stringify, {
			        appliesTo: { includeExtensions: ['.html', '.css'] },
			        minify: true
			    }]
			]
		}
	}
};

// browserify.transform('browserify-css', { autoInject: true })

////////////////
// Tasks

// Copy all images to dist
gulp.task('images', function() {
  return gulp.src('src/demo/**/*.{png,gif,jpg}',  {base: './src/demo/'})
      	.pipe(gulp.dest('dist'));
});

gulp.task('demo', function() {
    gulp.src('src/demo/**/*.js')
        .pipe(gulp.dest('dist'));

    gulp.src('src/demo/**/*.html')
        .pipe(gulp.dest('dist'));

    gulp.src('src/demo/**/*.css')
   		.pipe(gulp.dest('dist'));
});

gulp.task('jshint', function() {
    return gulp.src( ['src/lib/**/*.js', 'src/demo/*.js'] )
        .pipe(jshint(config.jshint.options))
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', ['jshint'], function () {
  var b = browserify(config.browserify.options);

  return b.bundle()
    .pipe(source('src/lib/**/*.js'))   // makes streaming vinyl file object
    .pipe(buffer())
    .pipe(rename('thing.js'))
    .pipe(gulp.dest('dist'))
    ;
});

// copy dist to htdocs folder
gulp.task('publish',  ['browserify', 'demo'], function() {
   gulp.src('./dist/**/*')
   .pipe(newer('../htdocs/Thing'))
   .pipe(gulp.dest('../htdocs/Thing'));
});

// Backup/restore images (helps manage repo size - store images separately from code)

gulp.task('img-save', function() {
  gulp.src('./src/demo/**/*.{png,gif,jpg}',  {base: './src/'})
  .pipe(print())
  .pipe(gulp.dest('../Thing_images'));
});

gulp.task('img-restore', function() {
  gulp.src('../Thing_images/**',  {base: '../Thing_images/'})
  .pipe(print())
  .pipe(gulp.dest('./src'));
});

gulp.task('img-clean', function() {
  gulp.src('./src/demo/gun/img/**',  {base: './src/'})
  .pipe(clean({force: true}));
});

////////////////
// Default task

gulp.task('default', ['publish']);
