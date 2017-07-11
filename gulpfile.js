var jsdoc = require('gulp-jsdoc3');
var gulp = require('gulp');
/*
gulp.task('default', function() {
  // �����Ĭ�ϵ�������������
});
*/

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './*/*.js'], {read: false})
        .pipe(jsdoc(cb));
});