const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const spritesmith = require("gulp.spritesmith");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");

// Server

gulp.task("serve", function () {
  browserSync.init({
    server: "./",
  });
  gulp.watch("./src/css/*.css", gulp.series("minify-css"));
  gulp.watch("./src/sass/*.scss", gulp.series("sass"));
  gulp.watch("./src/js/**/*.js", gulp.series("babel"));
  gulp
    .watch([
      "./*.html",
      "./src/sass/*.scss",
      "./src/css/*.css",
      "./src/js/es6/*.js",
    ])
    .on("change", browserSync.reload);
});

// Sass Compiler
sass.compiler = require("node-sass");
gulp.task("sass", function () {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(
      autoprefixer(["last 5 versions", "> 1%", "ie 9", "ie 8"], {
        cascade: true,
      })
    )
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(gulp.dest("./dist/css/sass/"));
});

// Minify CSS
gulp.task("minify-css", () => {
  return gulp
    .src("./src/**/*.css")
    .pipe(
      autoprefixer(["last 5 versions", "> 1%", "ie 9", "ie 8"], {
        cascade: true,
      })
    )
    .pipe(
      cleanCSS({ debug: true }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(cleanCSS({ compatibility: "ie9" }))
    .pipe(gulp.dest("./dist/css/min/"));
});

// Minify Images
gulp.task("minify-img", function () {
  return gulp
    .src("./src/img/min/**/*")
    .pipe(imagemin([imagemin.mozjpeg({ quality: 10, progressive: true })]))
    .pipe(gulp.dest("./dist/img/min/"));
});

// Create sprite
gulp.task("sprite", function () {
  var spriteData = gulp.src("./src/img/sprite/*.png").pipe(
    spritesmith({
      imgName: "sprite.png",
      cssName: "sprite.css",
      padding: 20,
    })
  );
  return spriteData.pipe(gulp.dest("./dist/img/sprite/"));
});

// Babel
gulp.task("babel", () =>
  gulp
    .src("./src/js/es6/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulp.dest("./dist/js/es5/"))
);

// Default Task
gulp.task(
  "default",
  gulp.series(gulp.parallel("serve", "sass", "babel"), function () {})
);
