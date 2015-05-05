var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('default', function() {
  gulp.start('combine-global', 'combine-angular-patient', 'sass');
});

gulp.task('combine-angular-patient', function() {
  return gulp.src([
      './bower_components/angular/angular.min.js',
      './bower_components/angular-route/angular-route.min.js',
      './bower_components/angular-foundation/mm-foundation-tpls.min.js',
      './patient_app/app.js',
      './patient_app/controllers/*.js',
      './patient_app/services/*.js'
    ])
    .pipe(concat('patient_app.js'))
    .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('combine-global', function() {
  return gulp.src([
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/foundation/js/vendor/modernizr.js',
      './bower_components/foundation/js/foundation.min.js',
      './bower_components/foundation/js/foundation/foundation.accordion.js'
    ])
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('sass', function () {
  gulp.src([
      './bower_components/foundation/scss/normalize.scss',
      './bower_components/foundation/scss/foundation.scss',
      './stylesheets/style.scss'
    ])
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('watch', function() {
  gulp.watch('./stylesheets/*.scss', ['sass']);
  gulp.watch(['./patient_app/*.js', './patient_app/*/*.js'], ['combine-angular-patient']);
});
