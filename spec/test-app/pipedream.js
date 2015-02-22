try {
  var pipeDream = require('./index.js');
  pipeDream('./assets/*.js').jshint().concat('all.js').dest('dest');
} catch (error) {
  console.log('ERROR: ' + error);
  throw error;
}
