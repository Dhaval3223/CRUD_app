const gulp = require('gulp');
const { src, series, parallel, dest, watch } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer')

const jsPath = './**/*.js'
const cssPath = './**/*.css'

function copyHTML(){
    return gulp.src('/Users/dhavalmulashiya/Desktop/project 4  3/*.html').pipe(gulp.dest('dist'));
}

function jsTasks(){
    return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assests/js'))
}
function cssTasks(){
    return src(cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assests/css'))
}

exports.copyHTML = copyHTML;
exports.jsTasks = jsTasks;
exports.cssTasks = cssTasks;
exports.defult = parallel(copyHTML);