'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var es = require('event-stream');

var config = {};
config.isProduction = false;

gulp.task('css', function() {
    // compile sass
    var sassFilter = $.filter(['*.{sass,scss}']);
    var sassFiles = gulp.src('app/assets/css/**/*').pipe(sassFilter)
    .pipe($.rubySass({
        style: 'expanded',
        precision: 10
    }))
    .on('error', function(err){
        new $.util.PluginError('CSS', err, {showStack: true});
    });

    // create a copy of the map files outside of the CSS style
    // either use this technique or use gulp-concat-sourcemap instead of gulp-concat (see below)
    // var mapFilter = $.filter(['*.map']);
    // es.merge(sassFiles)
    //     .pipe(mapFilter)
    //     .pipe(gulp.dest(inputConfig.dest));

    // concat css + compiled sass
    var cssFilter = $.filter(['*.css']);
    var cssFiles = gulp.src('app/assets/css/**/*').pipe(cssFilter);
    return es.merge(cssFiles, sassFiles)
        .pipe($.concatSourcemap('style.min.css'))
        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(config.isProduction ? $.combineMediaQueries({
            log: true
        }) : $.util.noop())
        .pipe(config.isProduction ? $.cssmin() : $.util.noop())
        .pipe($.size())
        .pipe(gulp.dest('./dist/assets/css'));

});