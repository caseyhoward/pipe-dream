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
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(coffee())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('dist'));
})
```

### After
``` js
var gulp = require('gulp');
var pipeDream = require('pipe-dream');

gulp.task('scripts', function() {
  return pipeDream(paths.scripts).coffee().uglify().concat('all.min.js').dest('dist');
});
```

or

``` js
var gulp = require('gulp');
var pipeDream = require('pipe-dream');

gulp.task('scripts', function() {
  return pipeDream(paths.scripts)
    .coffee()
    .uglify()
    .concat('all.min.js')
    .dest('dist');
});
```
