'use strict';

var gulp    = require('gulp');
var app     = 'umbel-ui';
var merge   = require('merge-stream');
var path    = require('path');
var $       = require('gulp-load-plugins')();

var paths = {
  less: ['less/**/*.less', 'components'],
  guide: './guide',
  lessMain: './guide/less/guide.less'
}

gulp.task('guide', function() {
  var lessOptions = {
    paths: paths.less
  };

  var less  = gulp.src(paths.lessMain)
    .pipe($.less(lessOptions).on('error', $.util.log))
    .pipe($.rename(function(path) {
      extname: ".css"
    }))
    .pipe(gulp.dest(path.join(paths.guide, 'css')))

  var umbelFonts = gulp.src('./fonts/*')
    .pipe(gulp.dest(path.join(paths.guide, 'components/'+app+'/fonts')));

  var bootstrapFonts = gulp.src('./components/bootstrap/fonts/*')
    .pipe(gulp.dest(path.join(paths.guide, 'components/bootstrap/fonts')));

  return merge(
    less,
    umbelFonts,
    bootstrapFonts
  );
});

gulp.task('watch', function() {
  gulp.watch(paths.less, ['less'])
});

gulp.task('build', ['guide']);

gulp.task('default', ['build']);
