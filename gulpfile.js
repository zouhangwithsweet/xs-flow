const gulp = require('gulp')
const ts = require('gulp-typescript')
const merge = require('merge2')

const tsProjectESM = ts.createProject("tsconfig.json")
const tsProjectCom = ts.createProject("tsconfig.json", {
  module: 'commonjs',
  target: 'ES5'
})

gulp.task('default', function() {
  const toESM = gulp.src('src/*.ts').pipe(tsProjectESM())
  const toCom = gulp.src('src/*.ts').pipe(tsProjectCom())

  return merge([
    toESM.js.pipe(gulp.dest('lib-module')),
    toESM.dts.pipe(gulp.dest('lib-module')),
    toCom.js.pipe(gulp.dest('lib')),
    toCom.dts.pipe(gulp.dest('lib')),
  ])
})
