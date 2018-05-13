'use strict';

module.exports = function() {
    $.gulp.task('copy:upload', function() {
        return $.gulp.src('./upload/*.*', { since: $.gulp.lastRun('copy:upload') })
            .pipe($.gulp.dest($.config.root + '/upload'));
    });
};

