const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const deleteLines = require("gulp-delete-lines");
const minify = require("gulp-minifier");

var src_option = {
    base: "./src/",
};
var ignore_path = ["!node_modules",
    "!gulpfile*",
    "!node_modules/**/*",
    "!dist",
    "!dist/**/*",
    "!./*.@[js|json|md|css]",
    "!./src/jasmine",
    "!./src/jasmine/**/*"];
var path = {
    img: ["./src/**/*.@(jpg|png)"].concat(ignore_path),
    js: ["./src/**/*.js"].concat(ignore_path),
    css: ["./src/**/*.css"].concat(ignore_path),
    html: ["./src/**/*.html"].concat(ignore_path),
};

gulp.task("test",function() {
    console.log("hello gulp.");
});

gulp.task("output", function() {
    gulp.src(["./src/**/*.+(jpg|png|eot|svg|ttf|woff)"].concat(ignore_path),src_option)
        .pipe(gulp.dest("dist"));
    gulp.src(["./src/**/*.+(html|css|js)"].concat(ignore_path),src_option)
        .pipe(deleteLines({
            "filters": [
                /.jasmine./i
            ]
        }))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
        }))
        .pipe(gulp.dest("dist"));
});
var serFlag = false;

gulp.task("ser", function () {
    gulp.watch("./src/**/*+(html|js|css)",['reload']);
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    serFlag = true;

    
});

gulp.task('reload', function() {
    // console.log('file changed');
    if(serFlag)
        reload();
})

