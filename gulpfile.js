var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('compile-ts', function() {
  var tsResult = gulp.src('typescript/*.ts')
    .pipe(ts({
        noImplicitAny: true,
        suppressImplicitAnyIndexErrors: true,
        outDir: "js"
      }));
      
      return tsResult.js.pipe(gulp.dest('js'));
});
 
gulp.task('watch', function () {
  gulp.watch('typescript/*.ts', ['compile-ts']);
});