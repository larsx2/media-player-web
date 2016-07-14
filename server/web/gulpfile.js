var gulp =       require('gulp');
var plugins =    require('gulp-load-plugins')();
var browserify = require('browserify');
var source =     require('vinyl-source-stream');
var buffer =     require('vinyl-buffer');
//var hbsfy =      require('hbsfy');

gulp.task('browserify', function() {
    var options;
    options = {
        debug: true,
        paths: [
            'source/'
        ]
    };
    /*
    hbsfy.configure({
        extensions: ['hbs']
    });
*/
    return browserify('source/scripts/app.main.js')
        //.transform(hbsfy)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        //.pipe(plugins.uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('default', ['browserify']);
