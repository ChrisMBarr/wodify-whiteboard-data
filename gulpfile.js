var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('compile-ts', function() {
  var tsResult = gulp.src('*.ts')
    .pipe(ts({
        noExternalResolve: true,
        noImplicitAny: true,
        suppressImplicitAnyIndexErrors: true
      }));
      
      return tsResult.js.pipe(gulp.dest('js'));
});
 
gulp.task('watch', function () {
  gulp.watch('*.ts', ['compile-ts']);
});