var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function() {
  gulp.start('combine-global', 'combine-angular-patient');
});

gulp.task('combine-angular-patient', function() {
  return gulp.src([
      './bower_components/angular/angular.min.js',
      './bower_components/angular-route/angular-route.min.js',
      './patient_app/app.js',
      './patient_app/controllers/*.js'
    ])
    .pipe(concat('patient_app.js'))
    .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('combine-global', function() {
  return gulp.src(['./bower_components/jquery/dist/jquery.min.js', './bower_components/foundation/js/vendor/modernizr.js'])
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./public/javascripts'));
});