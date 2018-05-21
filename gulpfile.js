var gulp = require('gulp'),
    less = require('gulp-less'),
    browsersync = require('browser-sync'),
    imagemin = require('gulp-imagemin'), 
    pngquant = require('imagemin-pngquant'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    cache = require('gulp-cache'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename');
    

gulp.task('less', function() {
  return gulp.src('src/less/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(['last 15 versions'], { cascade: true }))
    .pipe(gulp.dest('src/css'))
    .pipe(browsersync.reload({stream: true}))
});

gulp.task('cssmin', function () {
  return gulp.src('src/css/*.css')
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist/css'))
      .pipe(browsersync.reload({stream: true}))
});

gulp.task('watch', ['webserver','html', 'imagemin', 'fonts','less', 'cssmin'], function() {
  gulp.watch('src/less/*.less', ['less']); // Наблюдение за less файлами
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/images/*.png', ['imagemin']);
  gulp.watch('src/fonts/*.ttf', ['fonts']);
  gulp.watch('src/css/*.css', ['cssmin']);
  
});

gulp.task('webserver', function() { // Создаем таск browser-sync
  browsersync({ // Выполняем browserSync
    server: { // Определяем параметры сервера
        baseDir: './dist' // Директория для сервера
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logprefix: 'Sasha',
    notify: false // Отключаем уведомления
  });
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/*.*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('imagemin', function() {
   return gulp.src('src/images/*.*')
    .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
  })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
    .pipe(browsersync.reload({stream: true}))
});
gulp.task('clean', function() {
  return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('default',[ 'clean', 'webserver', 'watch']);
  