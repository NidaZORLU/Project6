const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const del = require('del')
const gulp = require('gulp');
const sass = require('gulp-sass');
const dist = './dist'
const source = './src';


function js() {
    return src(source + '/assets/js/script.js')
        .pipe(changed(source))
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(dest(dist + '/assets/js'))
        .pipe(browsersync.stream());
}


function clean() {
    return del([dist + '**', '!' + dist])
}


function css() {
    return src(source + '/assets/css/style.css ')
        .pipe(changed(source))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(dest(dist + '/assets/css'))
        .pipe(browsersync.stream());
}


function img() {
    return src(source + '/assets/img/*')
        //.pipe(imagemin())
        .pipe(dest(dist + '/assets/img'));
}

function htmlfiles() {
    return src(source + '/index.html')
        //.pipe(imagemin())
        .pipe(dest(dist));
}

function watchFiles() {
    watch(source + '/assets/css/style.css', css);
    watch(source + '/asset/js/script.js', js);
    watch('/assets/img', img);
    watch(source + '/index.html', htmlfiles)
}


function browserSync() {
    browsersync.init({
        server: {
            baseDir: dist
        },
        port: 3000
    });
}
gulp.task('sass', ()=> {
    return
    gulp.src('/assets/sass/style.scss').pipe(sass()).pipe(gulp.dest('assets/css'));
});
gulp.task('watch', () =>{
    gulp.watch('/assets/sass/**/*.scss', gulp.series('sass'));
});
gulp.task('default', gulp.series('watch'));

exports.watch = series(js, css, img, htmlfiles, parallel(watchFiles, browserSync));
exports.default = series(clean, parallel(js, css, img, htmlfiles));
