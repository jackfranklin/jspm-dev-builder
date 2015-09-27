var chalk = require('chalk');
var path = require('path');

var sharedCache = {};

function DevBuilder(options) {
  this.inLoc = options.inLoc;
  this.outLoc = options.outLoc;
  this.logPrefix = options.logPrefix || 'jspm-dev';
  this.jspm = options.jspm || require('jspm');
}

DevBuilder.prototype.removeFromTrace = function(filename) {
  // the trace is keyed by the filename but with extra things on it
  // so we can't just call delete trace[filename]
  if (!(sharedCache && sharedCache.trace)) return;

  var traceKeys = Object.keys(sharedCache.trace);
  traceKeys.filter(function(key) {
    return key.indexOf(filename) > - 1;
  }).forEach(function(key) {
    this.logInfo('Deleting', chalk.blue(key), 'from trace cache');
    delete sharedCache.trace[key];
  }, this);
};

DevBuilder.prototype.build = function(filename) {
  this.builder = new this.jspm.Builder();
  if (filename) {
    this.removeFromTrace(filename);
  }
  this.builder.setCache(sharedCache);

  var buildStart = Date.now();

  this.logInfo('jspm build starting', chalk.blue(this.inLoc));

  return this.builder.bundle(this.inLoc, this.outLoc).then(function() {
    sharedCache = this.builder.getCache();

    var buildEnd = Date.now();
    this.logInfo('jspm build finished', chalk.red(buildEnd - buildStart));

    return this;

  }.bind(this)).catch(function(err) {
    this.logError('jspm build error', err.message, err.stack);
  }.bind(this));
};

DevBuilder.prototype.logInfo = function() {
  console.log.bind(console, chalk.red(this.logPrefix)).apply(null, arguments);
};

DevBuilder.prototype.logError = function() {
  console.log.bind(console, chalk.red(this.logPrefix)).apply(null, arguments);
};

module.exports = DevBuilder;