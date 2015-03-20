## Warning
There is a pretty [major bug](https://github.com/caseyhoward/pipe-dream/issues/1) that needs to be fixed before I can recommend using this.

## Installation
```sh
npm install --save-dev pipe-dream
```

## Purpose
The main objective is make using gulp more efficient and less verbose.

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

## Related Projects
* [gulp-pipe](https://github.com/blakelapierre/gulp-pipe) - Solves the problem of having "pipe" everywhere. It takes an array containing the glob that gulp.src takes as the first element and the rest of the elements are the gulp plugins to be applied.
* [gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins) - Solves the problem of having to require gulp plugins. It automatically loads gulp plugins in your package.json as properties on a single object.
