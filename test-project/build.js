var DevBuilder = require('../index');
var path = require('path');

var appBuilder = new DevBuilder({
  jspm: require('jspm'),
  expression: path.join(__dirname, 'main'),
  outLoc: path.join(__dirname, 'bundle.js'),
  logPrefix: 'my-app',
  buildOptions: {
    sfx: true,
  },
});

appBuilder.build();
