var gulp = require('gulp');
var rg = require('rangle-gulp');

var karmaVendorFiles = [
  'client/bower_components/angular/angular.min.js',
  'client/bower_components/angular-mocks/angular-mocks.js',
  'client/bower_components/sinon-chai/lib/sinon-chai.js',
  'client/testing/lib/q.js',
  'client/testing/test-utils.js'
];

gulp.task('karma', rg.karma({
  // files: specify which folders (optional)
  // karmaConf: specify which karma config file (optional)
  vendor: karmaVendorFiles
}));

gulp.task('karma-watch', rg.karmaWatch({
  // files: specify which folders (optional)
  // karmaConf: specify which karma config file (optional)
}));

gulp.task('mocha', rg.karmaWatch({
  // files: specify which folders (optional)
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
  port : 3000,
  livereload : true,
  // Files to watch for live re-load
  glob : ['./client/**/*.html', './client/**/*.js']
}));

gulp.task('default', ['lint', 'concat', 'mocha', 'karma']);

gulp.task('protractor', rg.protractor({
  files: [
    'client/testing/scenarios/*.scenario.js'
  ]
}));