/**
 * Created by Anna on 12.02.2017.
 */
'use strict';

module.exports = function() {
    $.gulp.task('sprite:png',function () {
        var spriteData = $.gulp.src('./source/sprite/*.png' )
            .pipe($.gp.spritesmith({
                imgName:'sprite.png',
                cssName:'sprite_png.css',
                padding: 10
            }));
        spriteData.img.pipe($.gulp.dest('./source/images/'));
        spriteData.css.pipe($.gulp.dest('./source/style/common/'));

        return spriteData;

    })

};
