const gulp 			= require('gulp');
const $ 			= require('gulp-load-plugins')();
const uglify 		= require('gulp-uglify');
const sourcemaps 	= require('gulp-sourcemaps');
const plumber 		= require('gulp-plumber');
const notify 		= require('gulp-notify');
const eslint        = require('gulp-eslint');
const header        = require('gulp-header');
const browserSync   = require('browser-sync').create();

gulp.task('lint', function() {
    return gulp.src('source/browser-detect.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', function() {
	const pkg = require('./package.json');
    const banner = [
        '/**',
        ' * <%= pkg.description %> v<%= pkg.version %> | <%= pkg.license %>',
		' * Author: <%= pkg.author %>',
        ' * <%= pkg.homepage %>',
        ' */',
        ''
    ].join('\n');

    return gulp.src('source/browser-detect.js')
        .pipe(plumber({
            errorHandler: notify.onError('JS: <%= error.message %>')
        }))
        .pipe(sourcemaps.init())
		.pipe(uglify())
        .pipe($.rename('browser-detect.min.js'))
		.pipe(header(banner, { pkg: pkg }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
        .pipe(notify({
            message: 'Compilation complete: <%= file.relative %>',
            onLast: true
        }));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './test/',
            directory: true,
            routes: {
                '/dist': './dist'
			},
			index: 'index.html'
        },
        files: ['dist/*.js', 'examples/*'],
        open: false
    });
});

gulp.task('default', ['lint', 'build', 'browser-sync'], function() {
    gulp.watch('source/browser-detect.js', ['lint', 'build']);
});
