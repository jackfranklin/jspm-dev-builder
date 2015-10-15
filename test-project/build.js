var DevBuilder = require('../index');
var path = require('path');
var chokidar = require('chokidar');

var appBuilder = new DevBuilder({
  expression: path.join(__dirname, 'main'),
  outLoc: path.join(__dirname, 'bundle.js'),
  logPrefix: 'my-app',
  buildOptions: {
    minify: false,
    mangle: false,
    sourceMaps: true
  }
});

appBuilder.build();

chokidar.watch('main.js').on('change', function() {
  appBuilder.build('main.js');
});

chokidar.watch('main.hbs').on('change', function() {
  appBuilder.build('main.hbs');
});
