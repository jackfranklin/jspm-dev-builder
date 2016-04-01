var chalk = require('chalk');
var path = require('path');
var _ = require('lodash');

function DevBuilder(options) {
  this.expression = options.expression;
  this.outLoc = options.outLoc;
  this.logPrefix = options.logPrefix || 'jspm-dev';
  this.jspm = options.jspm || require('jspm');
  this.builder = new this.jspm.Builder();
  this.buildOptions = _.extend({
    sfx: false,
    minify: false,
    mangle: false,
    sourceMaps: false,
    lowResSourceMaps: false,
  }, options.buildOptions || {});

  // older versions of jspm don't have a version property
  if (this.jspm.version) {
    this.logInfo('Using jspm version ', this.jspm.version);
  }

  if (this.buildOptions.sfx) {
    this.logInfo('Warning! SFX Cache invalidation is buggy. See jackfranklin/jspm-dev-builder/issues/9.');
  }
}

DevBuilder.prototype.removeFromTrace = function(filename) {
  if (!this.builder) return false;
  var invalidated = this.builder.invalidate(filename);
  return invalidated.length > 0;
};

DevBuilder.prototype.bundle = function() {
  var buildOptions = _.omit(this.buildOptions, 'sfx');
  if (this.buildOptions.sfx) {
    this.logInfo('Building SFX bundle');
    return this.builder.buildStatic(this.expression, this.outLoc, buildOptions);
  } else {
    this.logInfo('Building non-SFX bundle');
    return this.builder.bundle(this.expression, this.outLoc, buildOptions);
  }
};

DevBuilder.prototype.build = function(filename) {
  if (filename) {
    if (!this.removeFromTrace(filename)) {
      this.logError('jspm invalidation error', ['Nothing has been invalidated for',
        filename + '. It\'s likely that the module does not exist.',
        'If the module is loaded using a plugin, you need to append !',
        'to its name in order to invalidate it properly'].join(' '));
    } else {
      this.logInfo('Invalidated', chalk.blue(filename), 'from cache');
    }
  }

  var buildStart = Date.now();
  this.logInfo('jspm build starting', chalk.blue(this.expression));

  return this.bundle().then(function() {
    var buildEnd = Date.now();
    this.logInfo('jspm build finished', chalk.red(buildEnd - buildStart));
    return this;
  }.bind(this)).catch(function(err) {
    // Do any errors actually contain a message property?
    if (err.message) {
        this.logError('jspm build error:', err.message, err.stack);
    }
    else {
        this.logError('jspm build error:', err);
    }
  }.bind(this));
};

DevBuilder.prototype.logInfo = function() {
  console.log.bind(console, chalk.red(this.logPrefix)).apply(null, arguments);
};

DevBuilder.prototype.logError = function() {
  console.log.bind(console, chalk.red(this.logPrefix)).apply(null, arguments);
};

module.exports = DevBuilder;
