var gulp = require('gulp');
var rg = require('rangle-gulp');
var karma = require('gulp-karma');

var karmaFiles = [
  'client/bower_components/angular/angular.js',
  'client/bower_components/angular-mocks/angular-mocks.js',
  'client/bower_components/sinon-chai/lib/sinon-chai.js',
  'client/bower_components/koast-angular/dist/koast.js',
  'client/bower_components/angular-ui-router/release/angular-ui-router.js',
  'client/testing/lib/q.js',
  'client/testing/test-utils.js',
  'client/bower_components/lodash/dist/lodash.js',
  'client/app/**/*.html',
  'client/app/**/*.js'
];

gulp.task('karma', function() {
  return gulp.src(karmaFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('karma-watch', function() {
  return gulp.src(karmaFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('api-test', rg.mocha({
  files: 'server/testing/*.js'
}));

gulp.task('lint', rg.jshint({
  // files: specify which files (optional)
}));

gulp.task('beautify', rg.beautify({
  // files: specify which files (optional)
}));

gulp.task('concat', rg.concatAndUglify({
  // files: specify which files (optional)
  // name: specify what the result should be called, e.g. 'foo'
  // dist: specify where the output should go, e.g. 'client/dist/'
}));

gulp.task('dev', rg.connectWatch({
  root : 'client',
  port : 8080,
  livereload : true,
  // Files to watch for live re-load
  glob : ['./client/app/**/*.html', './client/app/**/*.js','./client/app/testing/**/*.js']
}));

gulp.task('default', ['lint', 'concat', 'mocha', 'karma']);

gulp.task('protractor', rg.protractor({
  files: [
    'client/testing/scenarios/*.scenario.js'
  ]
}));
