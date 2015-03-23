/***
 * Node Modules 
 **/
var 
    gulp       = require('gulp');
    concat     = require('gulp-concat');
    uglify     = require('gulp-uglify');
    notify     = require('gulp-notify');
    rename     = require('gulp-rename');
    minifyCSS  = require('gulp-minify-css');
    sourcemaps = require('gulp-sourcemaps');
    livereload = require('gulp-livereload');
    jshint     = require('gulp-jshint');

/***
 * Settings 
 **/
var 
    config = {
	    production: false
    }

/***
 * Paths 
 **/
var paths = {
	css: ['app/assets/css/**/*.css'],
	js: ['app/assets/js/**/*.js'],
	vendor: {
		css: [
			'app/assets/vendor/fontawesome/css/font-awesome.css',
			'app/assets/vendor/select2/select2.css'
		],
		fonts: [
			'app/assets/vendor/fontawesome/fonts/**/*.{ttf,woff,eof,svg}'
		],
		images: [
			'app/assets/vendor/select2/**/*.{png,gif,jpg,jpeg}'
		],
		js: [
			'app/assets/vendor/select2/select2.js'
		]
	}
};

/***
 * General 
 **/
gulp.task('set:development', function() {
	config.production = false;
});

gulp.task('set:production', function() {
	config.production = true;
});

/*** 
 * Project Assets 
 **/
gulp.task('css:dev', function() {
	return gulp.src(paths.css)
		.pipe(concat('app.min.css'))
		.pipe(gulp.dest('public/css'))
});

gulp.task('js:dev', function() {
    return gulp.src(paths.js)
    	.pipe(jshint())
  		.pipe(jshint.reporter('default'))
    	.pipe(gulp.dest('public/js'))
});

gulp.task('css', function() {
	return gulp.src(paths.css)
		.pipe(minifyCSS({keepBreaks: false}))
		.pipe(concat('app.min.css'))
		.pipe(gulp.dest('public/css'))
});

gulp.task('js', function() {
    return gulp.src(paths.js)
    	.pipe(jshint())
  		.pipe(jshint.reporter('default'))
    	.pipe(uglify({mangle: true}))
    	.pipe(gulp.dest('public/js'))
});

/***
 * 3rd Party Assets 
 **/
gulp.task('vendor:js', function() {
	return gulp.src(paths.vendor.js)
		.pipe(sourcemaps.init())
		.pipe(concat('vendor.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/js'))
});

gulp.task('vendor:css', function() {
	return gulp.src(paths.vendor.css)
		.pipe(minifyCSS({keepBreaks:false}))
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('public/css'))
});

gulp.task('vendor:images', function() {
	return gulp.src(paths.vendor.images)
		.pipe(gulp.dest('public/css'))
});

gulp.task('vendor:fonts', function() {
	return gulp.src(paths.vendor.fonts)
		.pipe(gulp.dest('public/fonts'))
});

/***
 * Main Tasks 
 **/
gulp.task('watch', function() {
	livereload.listen();

	if(config.production) {
		gulp.watch(paths.js, ['js']);
		gulp.watch(paths.css, ['cs']);
	} else {
		gulp.watch(paths.js, ['js:dev']);
		gulp.watch(paths.css, ['css:dev']);
	}

	gulp.watch('public/css/**').on('change', livereload.changed);
	gulp.watch('public/js/**').on('change', livereload.changed);

	gulp.watch('app/views/**/*.php').on('change', livereload.changed);
});

gulp.task('publish:development', ['set:development','js:dev', 'css:dev']);
gulp.task('publish:production', ['set:production','js', 'css']);

gulp.task('vendor:publish', ['vendor:js', 'vendor:css', 'vendor:fonts', 'vendor:images']);

gulp.task('publish', ['publish:production', 'vendor:publish']);

gulp.task('default', ['watch']);
