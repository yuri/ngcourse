# Part 20: [gulp](https://github.com/gulpjs/gulp), _The Streaming Build System_


At its simplest, gulp is a build system and collection of plugins using [NodeJS streams](https://github.com/substack/stream-handbook#introduction). The idea is to read in a collection files, pass them through a series of modules, and then finally write out the result.

## Why use gulp?

 - __Available Plugins__: By having modules do one thing well, gulp allows for easily reused modules to be added, reordered and removed without affecting those up/downstream. This leaves a flexible and versatile collection of jobs.

- __Tasks Are Easily Chained Together__: The use of streams is highly agreeable when trying to build a web app for a production environment where a series of improvements (minification, concatenation, etc.)  and checks (linting, unit tests, etc.) need be performed and then outputted to a build folder. Chaining together the different modules together to take in the source files, preform an improvement/transformation, and then output the resulting build to a build folder, will create a repeatable automated build.

- __Same Tech Stack as The Rest of the Project__: No need to use another other language, gulp tasks are coded in NodeJS.

- __Development Tasks are Stored Within the Project__: Packages providing gulp tasks  can/should be tracked in _package.json_ -> _"devDependencies"_. New developers or CI jobs just need to run ```npm install``` to have all the required build/test dependencies installed.

- __Cross Platform__: Runs on Linux, Windows, and OSX.

## Example
The below preforms a subset of the same tasks as the included gulpfile.js but rangle-gulp tasks have been decapsulated for clarity.



Load gulp and the required plugins
```javascript
var gulp = require('gulp');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');
var beautify = require('gulp-js-beautify');
var gulpFilter = require('gulp-filter');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulpFilter = require('gulp-filter');
var connect = require('gulp-connect');
var fs = require('fs');
```

```gulp karma```: Inject all client app files and external dependencies and run the client unit tests. This will break the stream if one or more tests fail.

```javascript
gulp.task('karma', function(){  
  return gulp.src(/*GLOB matching all client app, test, and required dependancy files */)
  .pipe(karma({
    configFile: 'client/testing/karma.conf.js',
    action: 'run'
  }))
  .on('error', function (err) {
    // Make sure failed tests cause gulp to exit non-zero
    throw err;
  });
});
```

```gulp lint```: Lint the client app scripts. It will log and break the stream if any linting errors were found.
```javascript
gulp.task('lint', function () {
  return gulp.src(/*GLOB matching all client app scripts*/)
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter('fail'));
});
```

```gulp beautify```: Beautify the source client script files.
```javascript
gulp.task('beautify',  function () {
  var jsBeautifyConfig = JSON.parse(fs.readFileSync('.jsbeautifyrc'));
  return gulp.src(/*GLOB matching all client app scripts*/, { base: '.' })
    .pipe(beautify(jsBeautifyConfig))
    //overwrite the inputted files so the changes will be committed to the project
    .pipe(gulp.dest('.'));
});
```

```gulp concatAndMinify```: Combine and minify all the client script files into all.min.js then output the result to the build folder.
```javascript
gulp.task('concatAndMinify', function () {  
  return
    gulp.src(/*GLOB matching all client app scripts*/)
    .pipe(gulpFilter(/*functuion to filter out all test files*/))
    .pipe(concat('all.js'))
    .pipe(gulp.dest(/*build folder path*/))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(/*build folder path*/));
  };
);
```

```gulp assets```: Copy assets into build folder.
```javascript
gulp.task('assets',function(){
  return gulp.src( [ /*GLOB(s) to include all html, css, fonts, images, etc.*/ ],
   { 'base' : './client' })
    .pipe(gulp.dest(/*build folder path*/))
});
```


```gulp dev```:  Start a server to serve the client app files and auto reload the page when any client file changes.
```javascript
//initalize the server to serve the client app
function initConnect(options) {
  connect.server(options);
  watch({ glob: options.glob })
  .pipe(connect.reload());
  return connect.reload();
};

gulp.task('dev', initConnect({
  root : 'client',
  port : 8080,
  livereload : true, //reload the page when a client file is changed
  // Files to watch for live re-load
  glob : [/* GLOB(s) to cover all client files*/]
}));
```

```gulp```: The task that is run when no task is specified. It will lint, then run unit test,  concat and minify the app scripts, then copy the asset files over.
```javascript
gulp.task('default', ['lint', 'karma', 'concatAndMinify', 'assets']);
```
