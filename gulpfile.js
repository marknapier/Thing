var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');

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
	        scripturl: true,
	        strict: false,
	        trailing: true,
	        undef: true,
	        unused: true,
	        esversion: 6
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

gulp.task('demo', function() {
   gulp.src('src/demo/thing.html')
   .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function() {
    return gulp.src('src/lib/**/*.js')
        .pipe(jshint(config.jshint.options))
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', ['jshint'], function () {
  // set up the browserify instance for use in Gulp
  var options = {
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
  };
  var b = browserify(config.browserify.options);

  return b.bundle()
    .pipe(source('src/lib/**/*.js'))   // makes streaming vinyl file object 
    .pipe(buffer())
    .pipe(rename('thing.js'))
    .pipe(gulp.dest('dist'))
    ;
});

gulp.task('publish',  ['browserify', 'demo'], function() {
   gulp.src('./dist/**/*')
   .pipe(gulp.dest('../../../../xampp/htdocs/css_lines'));
});

////////////////
// Default task

gulp.task('default', ['publish']);
