"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const { series } = require('gulp');

var Undertaker = require('undertaker');

var taker = new Undertaker();

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2019-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'));
  // Font Awesome
  var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    .pipe(gulp.dest('./vendor'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./vendor/jquery-easing'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
  var dropzone = gulp.src([
      './node_modules/dropzone/dist/*'
  ])
  .pipe(gulp.dest('./vendor/dropzone'));
  // Simple Line Icons
  var simpleLineIconsFonts = gulp.src('./node_modules/simple-line-icons/fonts/**')
    .pipe(gulp.dest('./vendor/simple-line-icons/fonts'));
  var simpleLineIconsCSS = gulp.src('./node_modules/simple-line-icons/css/**')
    .pipe(gulp.dest('./vendor/simple-line-icons/css'));
  return merge(bootstrap, fontAwesome, jquery, jqueryEasing, simpleLineIconsFonts, simpleLineIconsCSS, dropzone);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
//const vendor = gulp.series(clean, modules);
//const build = gulp.series(vendor, css);
// const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
function watch(){
  clean();
  modules();
  css();
  watchFiles();
  var a = function(){console.log('Watching files')};
  browserSync(a);
}

function build(){
   gulp.series(clean, modules, css);
  // clean();
  // modules();
  // css();
}

function vendor(){
  clean();
  modules();
}
// Export tasks
exports.css = css;
exports.clean = clean;
exports.modules = modules;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;

// exports.watch = gulp.series(clean, modules, css, gulp.parallel(watchFiles, browserSync));
exports.default = css;
