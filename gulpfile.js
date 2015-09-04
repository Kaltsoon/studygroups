var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var concat = require('gulp-concat');

gulp.task('script', function() {
  gulp.src(['./public/javascripts/app.js', './public/javascripts/services/*.js', './public/javascripts/controllers/*.js', './public/javascripts/directives/*.js'])
  .pipe(concat('app.min.js'))
  .pipe(gulp.dest('./public/dist'));
});

gulp.task('less', function(){
  return gulp.src('./public/stylesheets/*.less')
  .pipe(less())
  .pipe(concat('app.min.css'))
  .pipe(gulp.dest('./public/dist'));
});
