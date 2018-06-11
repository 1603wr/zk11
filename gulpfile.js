var gulp = require('gulp');
var url = require('url');
var path = require('path');
var fs = require('fs');
// 编译sass插件
var sass = require('gulp-sass');
// 搭建服务
var server = require('gulp-webserver');
//压缩css插件
var cleancss = require('gulp-clean-css');
//合并css插件
var concat = require('gulp-concat');
//压缩js插件
var minjs = require('gulp-uglify');
//编译es6
var babel = require('gulp-babel');
// 编译sass任务
gulp.task('sass', function() {
    // 监听文件变化
    gulp.watch('src/scss/style.scss', function() {
        gulp.src('src/scss/style.scss')
            .pipe(sass())
            .pipe(gulp.dest('src/css'))
    })
});
// css文件合并压缩
gulp.task('mincss', function() {
    gulp.src('src/css/*.css')
        .pipe(cleancss())
        .pipe(gulp.dest('src/css'))
});
//js文件合并压缩
gulp.task('minjs', function() {
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(minjs())
        .pipe(gulp.dest('src/js'))
});
// 启动服务
gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            host: 'localhost',
            port: 6060,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return false;
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname == "/" ? '/index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
            }
        }))
})
gulp.task('webkage', ['mincss', 'minjs'])
gulp.task('default', ['sass', 'server', 'mincss', 'minjs'])