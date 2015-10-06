var chalk = require('chalk');
var path = require('path');
var _ = require('lodash');

var sharedCache = {};

function DevBuilder(options) {
  this.expression = options.expression;
  this.outLoc = options.outLoc;
  this.logPrefix = options.logPrefix || 'jspm-dev';
  this.jspm = options.jspm || require('jspm');
  this.buildOptions = _.extend({
    sfx: false,
    minify: false,
    mangle: false,
    sourceMaps: false,
    lowResSourceMaps: false,
  }, options.buildOptions || {});
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

DevBuilder.prototype.bundle = function() {
  var buildOptions = _.omit(this.buildOptions, 'sfx');
  if (this.buildOptions.sfx) {
    this.logInfo('Building SFX bundle');
    return this.builder.buildStatic(this.expression, this.outLoc, buildOptions);
  } else {
    this.logInfo('Building non-SFX bundle');
    return this.builder.build(this.expression, this.outLoc, buildOptions);
  }
}
DevBuilder.prototype.build = function(filename) {
  this.builder = new this.jspm.Builder();
  if (filename) {
    this.removeFromTrace(filename);
  }
  this.builder.setCache(sharedCache);

  var buildStart = Date.now();

  this.logInfo('jspm build starting', chalk.blue(this.expression));

  return this.bundle().then(function() {
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
