const gulp = require('gulp')
const ts = require('gulp-typescript')
const merge = require('merge2')

const tsProjectESM = ts.createProject("tsconfig.json")
const tsProjectUMD = ts.createProject("tsconfig.json", {
  module: 'umd',
  target: 'ES5'
})

gulp.task('default', function() {
  const toESM = gulp.src('src/*.ts').pipe(tsProjectESM())
  const toUMD = gulp.src('src/*.ts').pipe(tsProjectUMD())

  return merge([
    toESM.js.pipe(gulp.dest('lib-module')),
    toESM.dts.pipe(gulp.dest('lib-module')),
    toUMD.js.pipe(gulp.dest('lib')),
    toUMD.dts.pipe(gulp.dest('lib')),
  ])
})
