const gulp = require('gulp');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
var gcmq = require('gulp-group-css-media-queries');

let isDev = false;
let isProd = !isDev;

function clean() {
  return del('./dist/*');
}

function html() {
  return gulp
    .src('./src/**/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
}

function styles() {
  return gulp
    .src('./src/scss/style.scss')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass())
    .pipe(gcmq())
    .pipe(autoprefixer())
    .pipe(
      gulpIf(
        isProd,
        cleanCSS({
          level: 2,
        })
      )
    )

    .pipe(gulpIf(isDev, sourcemaps.write()))

    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src('./src/img/*')
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.stream());
}

function js() {
  return gulp
    .src('./src/js/main.js')
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
}

function json() {
  return gulp
    .src('./src/js/*.json')
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
}

function libs() {
  return gulp
    .src([
      './node_modules/slick-carousel/slick/slick.min.js',
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/isotope-layout/dist/isotope.pkgd.min.js',
    ])
    .pipe(gulp.dest('./dist/js/libs'))
    .pipe(browserSync.stream());
}

function webfonts() {
  return gulp
    .src([
      './node_modules/@fortawesome/fontawesome-free/webfonts/*',
      './src/fonts/**/*',
    ])
    .pipe(gulp.dest('./dist/fonts'));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './dist/',
    },
  });

  gulp.watch('./src/scss/**/*.scss', styles);
  gulp.watch('./src/**/*.html', html);
  gulp.watch('./src/js/main.js', js);
  gulp.watch('./src/js/*.json', json);
  gulp.watch('./src/js/*.json', images);
}

let build = gulp.parallel(html, styles, images, js, libs, webfonts, json);
let buildWithClean = gulp.series(clean, build);
let dev = gulp.series(buildWithClean, watch);

gulp.task('build', build);
gulp.task('dev', dev);
