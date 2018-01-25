var gulp         = require('gulp');
var	rename       = require('gulp-rename');
var	postcss      = require('gulp-postcss');
var	assets       = require('postcss-assets');
var	nested       = require('postcss-nested');
var	short        = require('postcss-short');
var concat       = require('gulp-concat');
var	uglify       = require('gulp-uglify');
var	cssnano      = require('gulp-cssnano');
var	cssnext      = require('postcss-cssnext');
var	autoprefixer = require('gulp-autoprefixer');
var	sass         = require('gulp-sass');
var notify       = require('gulp-notify');
var browserSync  = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync({
		proxy: 
		"mysite.rus",
		notify: false
	
	});
});
gulp.task('sass', function() {
		var processors = [
			short,
			nested,
			cssnext,
			assets({
				loadPaths: ['assets/templates/Stas/app/'],
				relativeTo: 'assets/templates/Stas/app/css/'
			})
		];
	return gulp.src('assets/templates/Stas/app/sass/**/*.sass')
	.pipe(sass().on("error", notify.onError()))
	.pipe(postcss(processors))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({
    browsers: ['last 12 versions'],
    cascade: false
    }))
	.pipe(cssnano())
	.pipe(gulp.dest('assets/templates/Stas/app/css'))
	.pipe(browserSync.reload({stream: true}));
});
gulp.task('libs', function() {
	return gulp.src([
		'assets/templates/Stas/app/js/jquery-3.2.1.min.js'
		
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/templates/Stas/app/js'));
});
gulp.task('watch', ['sass', 'libs','browser-sync'], function() {
	gulp.watch('assets/templates/Stas/app/sass/**/*.sass', ['sass']);
	gulp.watch('*.php', browserSync.reload);
});
gulp.task('default', ['watch', 'sass']);
