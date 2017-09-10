var gulp = require('gulp');

gulp.task('default', function () {
    console.log("default task")
});
gulp.task('copy-apidoc-fix', function () {
    gulp.src('./custo/send_sample_request.js')
        .pipe(gulp.dest('./node_modules/apidoc/template/utils/'));
});
