var DevBuilder = require('../index');
var path = require('path');
var chokidar = require('chokidar');

var appBuilder = new DevBuilder({
  expression: path.join(__dirname, 'main'),
  outLoc: path.join(__dirname, 'bundleSfx.js'),
  logPrefix: 'my-app',
  buildOptions: {
    sfx: true
  }
});

appBuilder.build();

chokidar.watch('main.js').on('change', function() {
  appBuilder.build('main.js');
});

chokidar.watch('not-bundled.js').on('change', function() {
  appBuilder.build('not-bundled.js');
});

chokidar.watch('main.hbs').on('change', function() {
  appBuilder.build('main.hbs!'); // note !
});
