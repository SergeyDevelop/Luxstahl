var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer  = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
// var jshint = require('gulp-jshint');
var notify = require("gulp-notify");
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');




gulp.task('sass',function(){
    return gulp.src(['app/sass/**/*.sass','app/scss/**/*.scss'])
    .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}))
});

// gulp.task('jshint'),function(){
//     return gulp.src('app/js/**/*.js')
//     .pipe(jshint())
//     // .pipe(jshint.reporter('jshint-stylish'));
// };

gulp.task('browser-sync',function(){
    browserSync({
        server:{
            baseDir:'app'
        },
        notify:false
    })
});


gulp.task('clean',function(){
    return del.sync('dist')
});


gulp.task('clear',function(){
    return cache.clearAll();
});


gulp.task('img',function(){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced:true,
        progressive: true,
        svgoPlugins:[{ removeViewBox:false}],
        une:[pngquant()]
    })))
    .pipe(gulp.dest('dist/img'))
});


gulp.task('watch',['browser-sync','sass'],function(){
    gulp.watch(['app/sass/**/*.sass','app/scss/**/*.scss'],['sass']);
    gulp.watch('app/**/*.html',browserSync.reload);
    gulp.watch('app/js/**/*.js',browserSync.reload);
});


gulp.task('build',['clean','img','sass'],function(){
    var buildCss = gulp.src('app/css/**/*')
    .pipe(cleancss())
    .pipe(gulp.dest('dist/css')) ;

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildLibs = gulp.src('app/libs/**/*')
    .pipe(gulp.dest('dist/libs'));

    var buildJs = gulp.src('app/js/**/*')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js')) ;

    var buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('default', ['watch']);





