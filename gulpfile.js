var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var SERVER_PORT = 80;
var SERVER_ROOT = __dirname;


/*======================================
  SVG
======================================*/
gulp.task('svg2png', function() {
  var svg = gulp.src(['./img/svg/*.svg']);

  svg
    .pipe($.changed('./img', { extension: '.png' }))
    .pipe($.svg2png())
    .pipe($.imagemin({
      interlaced: true
    }))
    .pipe(gulp.dest('./img'));

  svg
    .pipe($.changed('./img'))
    .pipe($.imagemin({
      svgoPlugins: [{ removeViewBox: false }]
    }))
    .pipe(gulp.dest('./img'));

  return svg;
});

/*======================================
  Minify images
======================================*/
gulp.task('imagemin', function() {
  var pngquant  = require('imagemin-pngquant');

  return gulp.src(['./img/src/*'])
    .pipe($.changed('./img'))
    .pipe($.plumber())
    .pipe($.imagemin({
      svgoPlugins: [{ removeViewBox: false }],
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./img'));
});

/*======================================
  Iconfont
======================================*/
gulp.task('iconfont', function() {
  var fontName = 'Icons';

  return gulp.src(['img/icons/*.svg'])
    .pipe($.iconfont({
      fontName: fontName,
      appendCodepoints: true,
      normalize: true
    }))
    .on('codepoints', function(codepoints, options) {
      gulp.src('./sass/template/_icons.scss')
        .pipe($.consolidate('lodash', {
          glyphs: codepoints,
          fontName: fontName,
          fontPath: 'fonts/',
          className: 'icon'
        }))
        .pipe(gulp.dest('./sass'));
    })
    .pipe(gulp.dest('./fonts'));
});

/*======================================
  SASS
======================================*/
gulp.task('sass', function() {
  var handleError = function(err) {
    var path = require('path');

    return {
      title: path.basename(err.file),
      message: 'Line ' + err.line + ' » ' + err.message
    }
  };

  return gulp.src(['./*.scss'])
    .pipe($.sourcemaps.init())
      .pipe($.sass({
        precision: 10,
        errLogToConsole: false,
        outputStyle: 'compressed',
        onError: $.notify.onError(handleError)
      }))
      .pipe($.autoprefixer('last 2 versions', 'ie 8', 'ie 9', '> 1%'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe($.filter('*.css'))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.csso())
    .pipe(gulp.dest('./'));
});

/*======================================
  Javascript
======================================*/
gulp.task('lint', function() {
  return gulp.src(['./js/funcoes.js'])
    .pipe($.plumber())
    .pipe($.jshint('.jshintrc'))
    .pipe($.notify(function(file) {
      if (file.jshint.success) {
        return false;
      }

      var errors = file.jshint.results.map(function(data) {
            if (data.error) {
              return 'Line ' + data.error.line + ' » ' + data.error.reason;
            }
          }).join('\n'),
          errCount = file.jshint.errorCount;

      return {
        title: 'Found ' + errCount + (errCount > 1 ? ' errors' : ' error') + ' in ' + file.relative,
        message: errors
      };
    }));
});

/*======================================
  Templates
======================================*/
gulp.task('template', function() {
  gulp.src('./templates/*.ejs')
    .pipe($.changed('./'), { extension: '.html' })
    .pipe($.ejs())
    .pipe(gulp.dest('./'));
});

gulp.task('template-all', function() {
  gulp.src('./templates/*.ejs')
    .pipe($.ejs())
    .pipe(gulp.dest('./'));
});

/*======================================
  Live preview
======================================*/
gulp.task('serve', function() {
  $.connect.server({
    port: SERVER_PORT,
    root: SERVER_ROOT,
    livereload: true,
    middleware: function() {
      var directory = require('serve-index');
      return [directory('./', { icons: true, view: 'details' })];
    }
  });
});

/*======================================
  Default task
======================================*/
gulp.task('default', ['serve'], function() {
  /* Watch HTML */
  $.watch(['./templates/*.{html,ejs}'], { verbose: true, read: false }, function() {
    gulp.start('template');
  });

  $.watch(['./templates/partials/*.{html,ejs}'], { verbose: true, read: false }, function() {
    gulp.start('template-all');
  });

  /* Watch styles */
  $.watch(['./*.scss', './sass/**'], { verbose: true, read: false }, function() {
    gulp.start('sass');
  });

  /* Watch images */
  $.watch(['./img/svg/*.svg'], { verbose: true, read: false }, function() {
    gulp.start('svg2png');
  });

  $.watch(['./img/src/*'], { verbose: true, read: false }, function() {
    gulp.start('imagemin');
  }).on('error', function(e) {
    console.log('\x1b[36mError: %s\x1b[0m » \x1b[32m%s\x1b[0m', e.code, e.path);
    return true;
  });

  $.watch(['./img/icons/*.svg'], { verbose: true, read: false }, function() {
    gulp.start('iconfont');
  });

  /* Watch scripts */
  $.watch(['./js/*'], { verbose: true, read: false }, function() {
    gulp.start('lint');
  });

  /* Trigger LiveReload */
  $.watch(['./*.html', './*.css', './img/*', './js/*'], { verbose: true, read: false }, function(vinyl) {
    gulp.src(vinyl.path, { read: false })
      .pipe($.connect.reload());
  });
});