/**
 * Created by Anna on 12.02.2017.
 */
'use strict'
module.exports = function() {
    $.gulp.task('copy:font', function() {
        return $.gulp.src('./source/fonts/**/*.*', { since: $.gulp.lastRun('copy:font') })
            .pipe($.gulp.dest($.config.root + '/assets/fonts'));
    });
};

