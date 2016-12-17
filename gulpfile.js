var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var path = require('path');
var appName = path.basename(__dirname);
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

plugins.q = require('q');
plugins.runSequence = require('run-sequence');
plugins.url = require('url');

var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

var vars = {
	notifyInfo: notifyInfo,

	plumberErrorHandler: {
		errorHandler: plugins.notify.onError({
			title: notifyInfo.title,
			icon: notifyInfo.icon,
			message: "Error: <%= error.message %>"
		})
	},

	browserSync: browserSync,

	pkg: pkg,

	appName: appName,

	styles: ['src/style/*.scss'],

	stylesVendor: ['bower_components/fontawesome/css/font-awesome.min.css'],

	html: ['*.html', 'src/**/**.html'],

	scripts: ['src/script/*.js'],

	scriptsVendor:[
		'bower_components/angular/angular.min.js',
		'bower_components/angular-cookies/angular-cookies.js',
		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-sanitize/angular-sanitize.js',
		'bower_components/angular-route/angular-route.js',
		'bower_components/angular-loader/angular-loader.js',
		'bower_components/angular-animate/angular-animate.min.js',
		'bower_components/ckc-angularjs-utility/dist/utility.min.js',
		'bower_components/ngstorage/ngStorage.min.js',
	],

	moveFonts: ['bower_components/font-awesome/fonts/*.*'],

	moveToLib: [],

	moveSourceMaps: [
		'bower_components/angular/angular.min.js.map'
	],

	buildFiles: [
		'lib/bower_components/font-awesome/css/font-awesome.min.css',
		'lib/bower_components/font-awesome/css/font-awesome.css.map',
		'lib/bower_components/font-awesome/fonts/*.*',
		'dist/css/'+ appName +'_vendor.min.css',
		'dist/css/'+ appName +'.min.css',
		'dist/js/'+ appName +'_vendor.min.js',
		'dist/js/'+ appName +'.min.js',
		'dist/js/'+ appName +'.min.js.map',
		'dist/js/utility.min.js.map',
		'favicon.png',
		'app.js',
		'demo.html',
		'index.html'
	]
};



gulp.task('bower', require('./tasks/bower')(gulp, plugins, vars));
gulp.task('browser-sync', require('./tasks/browsersync')(gulp, plugins, vars));
gulp.task('index', require('./tasks/index')(gulp, plugins, vars));
gulp.task('move_fonts', require('./tasks/move_fonts')(gulp, plugins, vars));
gulp.task('move_sourcemaps', require('./tasks/move_sourcemaps')(gulp, plugins, vars));
gulp.task('move_to_build', require('./tasks/move_to_build')(gulp, plugins, vars));
gulp.task('move_to_lib', require('./tasks/move_to_lib')(gulp, plugins, vars));
gulp.task('package', function(){
	var path = require('path');
	var fs = require('fs');

	vars.pkg.name = path.basename(__dirname);
	fs.writeFileSync("./package.json", JSON.stringify(vars.pkg, null, "\t"));
	vars.pkg = require('./package.json');
});
gulp.task('scripts_vendor', require('./tasks/scripts_vendor')(gulp, plugins, vars));
gulp.task('scripts', require('./tasks/scripts')(gulp, plugins, vars));
gulp.task('styles_vendor', require('./tasks/styles_vendor')(gulp, plugins, vars));
gulp.task('styles', require('./tasks/styles')(gulp, plugins, vars));
gulp.task('aws_publish', require('./tasks/aws_publish')(gulp, plugins, vars));



/* INSTALL
* Updates package.json name
* Creates index.html
* Creates an nginx.conf file if needed
* Creates bower.json
*/

gulp.task('install', ['package', 'index', 'bower']);



/* LIVE
* Watches for file changes
*/

gulp.task('live', function() {
	plugins.livereload.listen();
	gulp.watch(vars.stylesToDo, ['styles']);
	gulp.watch(vars.stylesToDoVender, ['styles_vendor']);
	gulp.watch(vars.moveFonts, ['move_fonts']);
	gulp.watch(vars.vendor_scripts, ['scripts_vendor']);
	gulp.watch(vars.app_scripts, ['scripts']);
	gulp.watch(vars.htmlToDo, ['scripts']);
	gulp.watch(vars.moveToLib, ['move_to_lib']);
	gulp.watch(vars.moveSourceMaps, ['move_sourcemaps']);
	gulp.watch("dist/**").on('change', vars.browserSync.reload);
});

gulp.task('default', [
	'move_to_lib',
	'move_sourcemaps',
	'move_fonts',
	'styles',
	'styles_vendor',
	'scripts_vendor',
	'scripts',
	'browser-sync',
	'live'
], function(){});
