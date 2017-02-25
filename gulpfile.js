const gulp = require('gulp')
const concat = require('gulp-concat')

gulp.task('script', () => {
  return gulp.src([
    'node_modules/pako/dist/pako.min.js',
    'node_modules/marked/marked.min.js'
    // 'app.js'
  ])
  .pipe(concat('hurl.js'))
  .pipe(gulp.dest('build'))
})

gulp.task('default', ['script'])
