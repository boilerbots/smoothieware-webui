var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    bytediff = require('gulp-bytediff'),
    cdnizer = require("gulp-cdnizer"),
    removeCode = require('gulp-remove-code'),
    merge = require('merge-stream'),
    del = require('del'),
    zip = require('gulp-zip'),
    htmlmin = require('gulp-htmlmin'),
    replace = require('gulp-replace'),
    fs = require('fs'),
    //smoosher = require('gulp-smoosher')
    nginclude = require('gulp-nginclude');

var demoMode = false;

function clean() {
    return del(['dist']);
}

function cleanDemo() {
    demoMode = true;
    return del(['dist']);
}

function lint() {
    return gulp.src('www/js/**/app.js', 'www/js/**/translations.js', 'www/js/controllers/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
}

function cdnizeAndCopy() {
    return merge(
        gulp.src(['www/index.html'])
            .pipe(removeCode({production: true}))
            .pipe(cdnizer([{
                file: 'lib/bootstrap-css-only/css/bootstrap.min.css',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
            }]))

            .pipe(cdnizer([{
                file: 'lib/angular/angular.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.0/angular.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-route/angular-route.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.0/angular-route.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-resource/angular-resource.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.0/angular-resource.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-mocks/angular-mocks.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.0/angular-mocks.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-sanitize/angular-sanitize.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.0/angular-sanitize.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-gettext/dist/angular-gettext.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-gettext/2.3.11/angular-gettext.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-xeditable/dist/js/xeditable.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-xeditable/0.8.1/js/xeditable.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/angular-local-storage/dist/angular-local-storage.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/angular-local-storage/0.7.1/angular-local-storage.min.js'
            }]))
            .pipe(cdnizer([{
                file: 'lib/ng-file-upload/ng-file-upload.min.js',
                cdn: 'https://cdnjs.cloudflare.com/ajax/libs/danialfarid-angular-file-upload/12.2.13/ng-file-upload.min.js'
            }]))
            .pipe(gulp.dest('dist'))
    )
}

function concatApp() {
    var src = ['www/js/**/app.js', 'www/js/**/translations.js', 'www/js/controllers/**/*.js', 'www/js/services/**/*.js' ];

    if (demoMode) {
        src = src.concat('www/lib/angular-mocks/**/angular-mocks.js');
    }

    return merge(
        gulp.src(src)
            .pipe(concat('app.js'))
            .pipe(gulpif(!demoMode, removeCode({production: true})))
            .pipe(gulp.dest('./dist/js')),

        gulp.src(['www/css/**/*.css'])
            .pipe(concat('style.css'))
            .pipe(gulp.dest('./dist/css/'))
    )
}

function partials() {
    return merge(
        gulp.src('dist/index.html')
            .pipe(replace(/<ng-include src="'partials\/(.*?)'"><\/ng-include>/g, function (match, p1) {
                return fs.readFileSync('www/partials/' + p1, 'utf8');
            }))
            .pipe(gulp.dest('dist/'))
    )
}

function replaceSVG() {
    return gulp.src('dist/index.html')
        .pipe(replace(/<!-- replaceSVG --><data-ng-include src="'img\/jogdial.svg'"><\/data-ng-include><!-- \/replaceSVG -->/g, function (match, p1) {
            return fs.readFileSync('www/img/jogdial.svg', 'utf8');
        }))
        .pipe(gulp.dest('dist'))
}

function minifyApp() {
    return merge(
        gulp.src(['dist/js/app.js'])
            .pipe(ngAnnotate({add: true}))
            .pipe(bytediff.start())
            .pipe(uglify({mangle: true}))
            .pipe(bytediff.stop())
            .pipe(gulp.dest('./dist/js/')),

        gulp.src('dist/css/style.css')
            .pipe(cleanCSS({debug: true}, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(gulp.dest('./dist/css/')),

        gulp.src('dist/index.html')
            .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true}))
            .pipe(gulp.dest('dist'))
    )
}

function smoosh() {
    return gulp.src('dist/index.html')
        .pipe(smoosher())
        .pipe(gulp.dest('dist'))
}

function compress() {
    return gulp.src('dist/index.html')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('.'));
}

function addDemoMock() {
    return gulp.src(['dist/js/app.js'])
        .pipe(removeCode({demo: true}))
        .pipe(gulp.dest('./dist/js/'))
}

var defaultSeries = gulp.series(clean,  lint, cdnizeAndCopy, concatApp, partials, replaceSVG, minifyApp, smoosh);
var packageSeries = gulp.series(clean,  lint, cdnizeAndCopy, concatApp, partials, replaceSVG, minifyApp, smoosh, compress);
//var demoSeries = gulp.series(cleanDemo, lint, cdnizeAndCopy, concatApp, partials, replaceSVG, addDemoMock, minifyApp, smoosh);
var demoSeries = gulp.series(cleanDemo, lint, cdnizeAndCopy, concatApp, partials, replaceSVG, addDemoMock);
var debugSeries = gulp.series(clean,    lint, cdnizeAndCopy, concatApp, partials, replaceSVG);

gulp.task('default', defaultSeries);
gulp.task('package', packageSeries);
gulp.task('demo', demoSeries);
gulp.task('debug', debugSeries);

