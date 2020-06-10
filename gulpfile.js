const gulp = require("gulp");
const sync = require("browser-sync");
const htmlmin = require("gulp-htmlmin");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const spritesmith = require("gulp.spritesmith");


// HTML
const html = () => {
  return gulp
    .src("src/*.html")
    .pipe(
      htmlmin({
        removeComments: false,
        collapseWhitespace: false,
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(sync.stream());
};
exports.html = html;


// Styles
const styles = () => {
  return gulp
    .src("src/css/**/*")
    .pipe(autoprefixer())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("dist/css/"));
};
exports.styles = styles;

const concatcss = () => {
  return gulp 
    .src("dist/css/**/*")
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest("dist/css/"));
}
exports.concatcss = concatcss;


// Scripts
const scripts = () => {
  return gulp
    .src("src/js/**/*")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(gulp.dest("dist/js"));
};
exports.scripts = scripts;


// Images
const images = () => {
  return gulp
    .src(["src/img/*", "!src/img/sprite"])
    .pipe(imagemin([
      imagemin.mozjpeg({ 
        quality: 10, 
        progressive: true 
      })
    ]))
    .pipe(gulp.dest("dist/img/min/"));
};
exports.images = images;

const sprite = () => {
  return gulp
    .src("src/img/sprite/*.png")
    .pipe(
      spritesmith({
        imgName: "sprite.png",
        cssName: "sprite.css",
        padding: 20,
      })
    )
    .pipe(gulp.dest("dist/img/sprite/"));
}
exports.sprite = sprite;


// Server
const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: "dist",
    },
  });
  gulp.watch("./**/*").on("change", sync.reload);
};
exports.server = server;


// Watch
const watch = () => {
  gulp.watch("src/*.html", gulp.series(html));
  gulp.watch("src/css/**/*", gulp.series(styles));
  gulp.watch("src/scripts/**/*", gulp.series(scripts));
  gulp.watch(["src/img/**/*"], gulp.series(images, sprite));
};
exports.watch = watch;


// Default

exports.default = gulp.series(
  gulp.parallel(html, styles, scripts, images),
  gulp.parallel(watch, server)
);