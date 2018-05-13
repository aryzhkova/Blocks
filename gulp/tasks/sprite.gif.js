/**
 * Created by Anna on 12.02.2017.
 */
'use strict';

module.exports = function() {
    $.gulp.task('sprite:gif',function () {
        var spriteData = $.gulp.src('./source/images/icons/*.gif' )
            .pipe($.gp.spritesmith({
                imgName:'sprite.gif',
                cssName:'sprite_gif.css',
                padding: 10
            }));
        spriteData.img.pipe($.gulp.dest('./source/images/'));
        spriteData.css.pipe($.gulp.dest('./source/style/common/'));

        return spriteData;

    })

};
