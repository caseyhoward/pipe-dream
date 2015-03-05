## Installation
```sh
npm install --save-dev pipe-dream
```

## Purpose
The main objective is make gulp tasks easier to write and read by getting rid of some of the noise

## Features
* Automatically requiring gulp plugins
* Automatically installing missing gulp plugins (This indroduces an obvious security risk. Be careful.)
* Getting rid of the "pipes"

## Usage

### Before
```js
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('dist'));
})
```

### After

```js
var gulp = require('gulp');
var pipeDream = require('pipe-dream');

gulp.task('scripts', function() {
  return pipeDream(paths.scripts)
    .sourcemaps.init()
    .coffee()
    .uglify()
    .sourcemaps.write('./maps')
    .concat('all.min.js')
    .dest('dist');
});
```

### Running gulp

Unfortunately, gulp must be ran with the --harmony flag. This is due to the use of the new Proxy class. This is pretty annoying and I would like to come up with a solution. Ideas would be appreciated.

```
  gulp --harmony scripts
```

One idea is alias gulp in your bashrc:
```
alias gulp='gulp --harmony'
```
However, this isn't the best idea since its global

Calling other methods is also supported (including pipe)
```js
var coffee = require('gulp-coffee');

gulp.task('scripts', function() {
  return pipeDream(paths.scripts)
    .pipe(coffee())
    .on('error', function() {
      console.log('kaboom');
    })
    .concat('all.min.js')
    .dest('dist');
});
```

However, this means that plugins like gulp-pipe, gulp-on, etc

Here is a current list functions that exist on a gulp source stream
```
 * _read
 * _transform
 * _write
 * addListener
 * destroy
 * emit
 * end
 * listeners
 * on
 * once
 * pause
 * pipe
 * push
 * read
 * removeAllListeners
 * removeListener
 * resume
 * setEncoding
 * setMaxListeners
 * unpipe
 * unshift
 * wrap
 * write
```
