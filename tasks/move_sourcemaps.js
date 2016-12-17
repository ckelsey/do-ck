module.exports = function (gulp, plugins, vars) {
	return function () {

		gulp.src(vars.moveSourceMaps).pipe(gulp.dest('dist/js'));
	};
};
