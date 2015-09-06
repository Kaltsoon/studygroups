var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');

gulp.task('script', function() {
  gulp.src(['./public/javascripts/app.js', './public/javascripts/views/templates.js', './public/javascripts/services/*.js', './public/javascripts/controllers/*.js', './public/javascripts/directives/*.js'])
  .pipe(concat('app.min.js'))
  .pipe(uglify({
    mangle: false
  }))
  .pipe(gulp.dest('./public/dist'));
});

gulp.task('template', function () {
  return gulp.src('./public/javascripts/views/**/*.html')
    .pipe(templateCache({
      module: 'StudyGroupsApp'
    }))
    .pipe(gulp.dest('./public/javascripts/views'));
});

gulp.task('less', function(){
  return gulp.src('./public/stylesheets/*.less')
  .pipe(less())
  .pipe(concat('app.min.css'))
  .pipe(gulp.dest('./public/dist'));
});
