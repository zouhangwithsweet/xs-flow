const gulp = require('gulp')
const ts = require('gulp-typescript')
const merge = require('merge2')

const tsProjectESM = ts.createProject("tsconfig.json")

gulp.task('default', function() {
  const toESM = gulp.src('src/*.ts').pipe(tsProjectESM())

  return merge([
    toESM.js.pipe(gulp.dest('lib-module')),
    toESM.dts.pipe(gulp.dest('types')),
  ])
})
